import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./refinement-test";
import { inspectScene } from "./refinement-evidence";

// Public read-only suites. With journey-catalog-server.mjs, evidence is explicitly a network fixture.
const output = path.resolve("output/playwright/journey-timeline");
const sizes = [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
const choices = [
  ["ho-chi-minh-1911-1941", "marseille-1911", "Đến Marseille"],
  ["mua-thu-doc-lap-1945", "ha-noi-1945", "Hà Nội giành chính quyền"],
  ["khang-chien-chong-phap-1946-1954", "dien-bien-phu-1954", "Chiến thắng Điện Biên Phủ"],
  ["mua-xuan-1975", "buon-ma-thuot-1975", "Tiến công Buôn Ma Thuột"],
] as const;
const href = (journey: string, stop: string) => `/?tu=1986&den=1986&hanh-trinh=${journey}&moc=${stop}`;
async function ready(page: Page, journey = choices[1][0] as string, stop = choices[1][1] as string) {
  await page.goto(href(journey, stop));
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByTestId("journey-popup")).toBeVisible();
}
test.beforeAll(() => mkdirSync(output, { recursive: true }));

for (const viewport of sizes) for (const [journey, stop] of choices) test(`anchored reader ${journey} ${viewport.width}x${viewport.height}`, async ({ page }) => {
  await page.setViewportSize(viewport); await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await ready(page, journey, stop);
  const popup = page.getByTestId("journey-popup");
  const summary = await popup.locator(".journey-summary").boundingBox();
  const reading = await popup.locator(".journey-reading").boundingBox();
  expect(summary!.y + Math.min(summary!.height, 42)).toBeLessThanOrEqual(reading!.y + reading!.height);
  await expect(popup.getByRole("img")).toBeVisible();
  await expect.poll(() => popup.getByRole("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const geometry = await popup.evaluate(element => {
    const r = element.getBoundingClientRect(), shell = element.closest(".home-history-map")!.getBoundingClientRect();
    const pin = document.querySelector(".globe-journey-pin")!.getBoundingClientRect();
    const x = Number((element as HTMLElement).dataset.anchorX) + shell.left, y = Number((element as HTMLElement).dataset.anchorY) + shell.top;
    const rail = document.querySelector(".journey-timeline")!.getBoundingClientRect();
    return { rect: r.toJSON(), anchor: { x, y }, pin: { x: pin.left + pin.width / 2, y: pin.top + pin.height / 2 }, railTop: rail.top,
      gap: Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom)), overflow: document.documentElement.scrollWidth > innerWidth + 1 };
  });
  expect(geometry.pin.x).toBeCloseTo(geometry.anchor.x, 0); expect(geometry.pin.y).toBeCloseTo(geometry.anchor.y, 0);
  expect(geometry.rect.left).toBeGreaterThanOrEqual(16); expect(geometry.rect.right).toBeLessThanOrEqual(viewport.width - 16);
  expect(geometry.rect.top).toBeGreaterThanOrEqual(76); expect(geometry.rect.bottom).toBeLessThanOrEqual(geometry.railTop - 15);
  expect(geometry.gap).toBeGreaterThanOrEqual(11); expect(geometry.gap).toBeLessThan(220); expect(geometry.overflow).toBe(false);
  await expect(page.getByRole("button", { name: "Thoát hành trình", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeVisible();
  await page.getByRole("region", { name: "Nội dung mốc hành trình" }).focus();
  await page.keyboard.press("Escape"); await expect(popup).toHaveCount(0);
  const reopen = page.getByRole("button", { name: "Đọc mốc hiện tại", exact: true });
  await expect(reopen).toBeFocused(); await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: await page.locator("#journey-stop-heading").innerText(), exact: true })).toBeFocused();
  await expect(page.getByTestId("journey-timeline")).toBeVisible();
  if (journey === choices[1][0] && viewport.width === 1280) {
    const axe = await new AxeBuilder({ page }).include('[data-testid="history-explorer"]').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(axe.violations).toEqual([]);
  }
  expect(errors).toEqual([]);
  await page.screenshot({ path: path.join(output, `${journey}-${viewport.width}x${viewport.height}.png`) });
  writeFileSync(path.join(output, `${journey}-${viewport.width}x${viewport.height}.json`), JSON.stringify({ viewport, journey, stop, geometry, pageErrors: errors }, null, 2));
});

test("reading hover, focus and sources latch pause; explicit Play remains usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" }); await ready(page);
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-popup")).toBeVisible();
  await page.getByRole("region", { name: "Nội dung mốc hành trình" }).hover();
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  await page.mouse.move(10, 65); await page.waitForTimeout(2200);
  expect(new URL(page.url()).searchParams.get("moc")).toBe("ha-noi-1945");
  const summary = page.locator(".journey-sources summary"); await summary.focus(); await page.keyboard.press("Enter");
  await expect(page.locator(".journey-sources")).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  await summary.click(); await page.mouse.move(10, 65);
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toBeVisible();
});

test("rapid seek/switch rejects outgoing reader and keeps the newest arrival", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" }); await ready(page, choices[0][0], "sai-gon-1911");
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Marseille/ }).click();
  await expect(page.getByTestId("journey-popup")).toHaveCount(0);
  await page.getByTestId("journey-select").selectOption(choices[3][0]);
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Đà Nẵng/ }).click();
  await expect(page.getByTestId("journey-popup")).toContainText("Giải phóng Đà Nẵng");
  await page.waitForTimeout(4100);
  expect(new URL(page.url()).searchParams.get("moc")).toBe("da-nang-1975");
  await expect(page.getByTestId("journey-popup").getByRole("img")).toHaveAttribute("alt", /Đà Nẵng/);
  await expect(page.getByTestId("journey-popup")).not.toContainText("Marseille");
});

test("failed and delayed media never block reading, closing or a newer stop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.route("**/images/journeys/ha-noi-1945.webp", route => route.abort());
  await ready(page); await expect(page.getByTestId("journey-popup")).toContainText("Không tải được ảnh");
  await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
  await expect(page.getByTestId("journey-popup")).toContainText("Huế giành chính quyền");
  await page.getByRole("button", { name: "Đóng thông tin mốc", exact: true }).click();
  await expect(page.getByTestId("journey-popup")).toHaveCount(0);
});

test("a slow outgoing image cannot replace a newer stop and resize keeps its actual point", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/images/journeys/ha-noi-1945.webp", async route => { await held; await route.continue().catch(() => {}); });
  await page.goto(href(choices[1][0], choices[1][1]), { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("journey-popup")).toBeVisible();
  await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
  await expect(page.getByTestId("journey-popup")).toContainText("Huế giành chính quyền");
  release(); await page.setViewportSize({ width: 1366, height: 768 });
  await expect(page.getByTestId("journey-popup").getByRole("img")).toHaveAttribute("alt", /Thượng Tứ/);
  await expect.poll(() => page.getByTestId("journey-popup").evaluate(element => element.getBoundingClientRect().right <= innerWidth - 16)).toBe(true);
  await expect(page.locator("#journey-stop-heading")).toHaveText("Huế giành chính quyền");
});

test("offstage projection removes geographical reader and restores focus to persistent control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await ready(page);
  await page.getByRole("region", { name: "Nội dung mốc hành trình" }).focus();
  await inspectScene(page, { type: "view", view: { lat: -21, lng: -74, zoom: 5 } });
  await expect(page.getByTestId("journey-popup")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Đọc mốc hiện tại", exact: true })).toBeFocused();
  await page.getByTestId("journey-reader-fallback").locator("summary").first().click();
  await expect(page.getByRole("heading", { name: "Hà Nội giành chính quyền", exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toBeVisible();
});

test("stage offsets and DPR 2 keep popup leader and real point in the same CSS coordinates", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, deviceScaleFactor: 2, viewport: { width: 1366, height: 768 }, reducedMotion: "reduce" });
  const page = await context.newPage(); await ready(page);
  await page.addStyleTag({ content: '[data-testid="home-event-map"] { left: 24px; right: 32px; top: 70px; bottom: 16px; }' });
  await expect.poll(() => page.evaluate(() => {
    const pin = document.querySelector(".globe-journey-pin")?.getBoundingClientRect();
    const line = document.querySelector<SVGLineElement>(".journey-popup-leader line");
    const origin = document.querySelector(".home-history-map")?.getBoundingClientRect();
    if (!pin || !line || !origin) return Infinity;
    return Math.hypot(pin.left + pin.width / 2 - origin.left - line.x2.baseVal.value, pin.top + pin.height / 2 - origin.top - line.y2.baseVal.value);
  })).toBeLessThan(1);
  await expect(page.getByTestId("journey-popup")).toBeVisible();
  await page.screenshot({ path: path.join(output, "stage-offset-dpr-2.png") });
  await context.close();
});

test("failed WebGL retains ordinary HTML reading and native journey choices", async ({ page }) => {
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
    if (kind.includes("webgl")) return null; return original.apply(this, [kind, ...args] as Parameters<typeof original>);
  } as typeof original; });
  await page.goto(href(choices[1][0], choices[1][1]));
  await expect(page.getByTestId("journey-reader-fallback")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Hà Nội giành chính quyền", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Đóng thông tin mốc", exact: true }).click();
  await expect(page.getByTestId("journey-reader-fallback")).toHaveCount(0);
  await page.getByRole("button", { name: "Đọc mốc hiện tại", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Hà Nội giành chính quyền", exact: true })).toBeVisible();
});

test("no JavaScript keeps each journey reader, real milestone/source links and GET exit", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: sizes[0] });
  const page = await context.newPage();
  for (const [journey, stop] of choices) {
    await page.goto(`${baseURL}${href(journey, stop)}`);
    await expect(page.getByTestId("journey-reader-fallback")).toBeVisible();
    await expect(page.locator(".journey-summary")).toBeVisible();
    await page.locator(".journey-sources summary").focus(); await page.keyboard.press("Enter");
    await expect(page.locator(".journey-sources a").first()).toHaveAttribute("href", /^https?:/);
    await expect(page.getByTestId("journey-timeline").getByRole("link").first()).toHaveAttribute("href", /moc=/);
  }
  await page.locator(".journey-exit-noscript").click();
  await expect(page.getByTestId("map-time-controls")).toBeVisible();
  await context.close();
});

test("idle and hidden scenes add no continuous draws; media loading stays bounded", async ({ page }) => {
  await page.addInitScript(() => {
    const measured = window as unknown as { __testDraws: number }; measured.__testDraws = 0;
    const prototype = WebGL2RenderingContext.prototype as unknown as Record<string, (...args: number[]) => void>;
    for (const name of ["drawElements", "drawArrays"]) {
      const original = prototype[name];
      prototype[name] = function(this: WebGL2RenderingContext, ...args: number[]) { measured.__testDraws++; return original.apply(this, args); };
    }
  });
  await page.emulateMedia({ reducedMotion: "reduce" }); await ready(page);
  await page.waitForTimeout(800);
  const count = () => page.evaluate(() => (window as unknown as { __testDraws: number }).__testDraws);
  const before = await count(); await page.waitForTimeout(600); const idleAfter = await count(); expect(idleAfter).toBe(before);
  const stats = await inspectScene(page);
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, get: () => true }); document.dispatchEvent(new Event("visibilitychange")); });
  const hidden = await count(); await page.waitForTimeout(600); const hiddenAfter = await count(); expect(hiddenAfter).toBe(hidden);
  const media = await page.evaluate(() => performance.getEntriesByType("resource").filter(entry => entry.name.includes("/images/journeys/")).map(entry => ({ path: new URL(entry.name).pathname, transferBytes: (entry as PerformanceResourceTiming).transferSize })));
  expect(media.length).toBeLessThanOrEqual(1); expect(media.every(item => item.transferBytes < 205_000)).toBe(true);
  writeFileSync(path.join(output, "render-media-measurements.json"), JSON.stringify({ dataset: "test-only network fixture", browser: page.context().browser()?.version(), stats: stats.stats,
    idle: { before, after: idleAfter, addedDraws: idleAfter - before, durationMs: 600 }, hidden: { before: hidden, after: hiddenAfter, addedDraws: hiddenAfter - hidden, durationMs: 600 }, media,
    hiddenMethod: "document visibility event plus real scene cancellation" }, null, 2));
});
