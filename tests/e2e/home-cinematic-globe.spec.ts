import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "./refinement-test";

// P4 integration and retained P3 shell coverage; public, read-only routes only.
const output = path.resolve("output/playwright/cinematic-globe/phase-4");
const sizes = [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
test.use({ reducedMotion: "reduce" });

async function ready(page: Page, href = "/") {
  await page.goto(href);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
}

async function measure(page: Page) {
  return page.evaluate(() => {
    const box = (element: Element) => {
      const r = element.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const hit = (a: ReturnType<typeof box>, b: ReturnType<typeof box>) =>
      a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
    const controls = [...document.querySelectorAll<HTMLElement>(".home-history-map button, .home-history-map a, .home-history-map input, .home-history-map summary")]
      .filter((element) => {
        const closed = element.closest("details:not([open])");
        return element.checkVisibility() && (!closed || element === closed.querySelector(":scope > summary")) && !element.closest("dialog:not([open])");
      })
      .flatMap((element) => {
        const rect = box(element);
        // A reading panel deliberately scrolls. Inspect only its visible controls.
        for (let parent = element.parentElement; parent; parent = parent.parentElement) {
          if (/(auto|scroll|hidden)/.test(getComputedStyle(parent).overflowY) && !hit(rect, box(parent))) return [];
        }
        return [{ name: element.getAttribute("aria-label") || element.textContent?.trim() || element.id, rect }];
      });
    const regions = Object.fromEntries([".home-atlas-header", ".home-map-intro", ".home-map-guidance", ".home-map-event-card", ".home-map-time", ".journey-timeline", ".home-map-tools"]
      .flatMap((selector) => { const element = document.querySelector(selector); return element ? [[selector, box(element)]] : []; }));
    return {
      width: innerWidth, height: innerHeight,
      scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
      controls, regions,
      collisions: controls.flatMap((a, i) => controls.slice(i + 1).filter((b) => hit(a.rect, b.rect)).map((b) => [a.name, b.name])),
    };
  });
}

async function captureAndCheck(page: Page, state: string) {
  const measurements = await measure(page);
  const { width, height, regions } = measurements;
  expect(measurements.scrollWidth).toBeLessThanOrEqual(width);
  expect(measurements.scrollHeight).toBeLessThanOrEqual(height);
  expect(measurements.collisions).toEqual([]);
  for (const control of measurements.controls) {
    expect(control.rect.left, control.name ?? "control").toBeGreaterThanOrEqual(0);
    expect(control.rect.right, control.name ?? "control").toBeLessThanOrEqual(width);
    expect(control.rect.top, control.name ?? "control").toBeGreaterThanOrEqual(0);
    expect(control.rect.bottom, control.name ?? "control").toBeLessThanOrEqual(height);
  }
  const rail = regions[".home-map-time"] ?? regions[".journey-timeline"];
  expect(rail.height).toBeLessThanOrEqual(height <= 768 ? 88 : 104);
  expect(regions[".home-atlas-header"].height).toBeGreaterThanOrEqual(56);
  expect(regions[".home-atlas-header"].height).toBeLessThanOrEqual(64);
  const reading = regions[".home-map-event-card"] ?? regions[".home-map-guidance"];
  expect(reading.bottom).toBeLessThan(rail.top);
  expect(regions[".home-map-intro"].right).toBeLessThan(width * 0.36);
  expect(reading.left).toBeGreaterThan(width * 0.62);
  expect(regions[".home-atlas-header"].bottom).toBeLessThan(height * 0.20);
  expect(rail.top).toBeGreaterThan(height * 0.72);
  await page.locator(".home-map-event-card img").evaluateAll((images) => Promise.all(images.map((image) => {
    const img = image as HTMLImageElement;
    return img.complete ? Promise.resolve() : new Promise<void>((resolve) => {
      img.addEventListener("load", () => resolve(), { once: true });
      img.addEventListener("error", () => resolve(), { once: true });
      setTimeout(resolve, 8_000);
    });
  })));
  if (width === 1440) {
    expect(regions[".home-map-intro"].left).toBeGreaterThanOrEqual(32);
    expect(regions[".home-map-intro"].left).toBeLessThanOrEqual(48);
    expect(regions[".home-map-intro"].top).toBeGreaterThanOrEqual(88);
    expect(regions[".home-map-intro"].top).toBeLessThanOrEqual(116);
    expect(regions[".home-map-intro"].width).toBeGreaterThanOrEqual(280);
    expect(regions[".home-map-intro"].width).toBeLessThanOrEqual(340);
    expect(reading.width).toBeGreaterThanOrEqual(300);
    expect(reading.width).toBeLessThanOrEqual(336);
    expect(reading.top).toBeGreaterThanOrEqual(88);
    expect(reading.top).toBeLessThanOrEqual(112);
  }
  mkdirSync(output, { recursive: true });
  await page.screenshot({ path: path.join(output, `${state}-${width}x${height}.png`), scale: "css" });
  writeFileSync(path.join(output, `${state}-${width}x${height}.json`), JSON.stringify(measurements, null, 2));
}

for (const size of sizes) {
  test(`atlas shell default/card/journey fits ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await ready(page);
    if (process.env.P3_BASELINE === "1") {
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `before-${size.width}x${size.height}.png`) });
    }
    await expect(page.getByTestId("home-atlas-header")).toBeVisible();
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Khám phá", exact: true })).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Hành trình", exact: true })).toHaveCount(1);
    await expect(page.getByTestId("home-map-guidance")).toContainText("Khám phá một sự kiện");
    await captureAndCheck(page, "default");
    await page.locator(".globe-attribution > summary").click();
    expect((await measure(page)).collisions).toEqual([]);
    await page.locator(".globe-attribution > summary").click();
    await page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]').click();
    await expect(page.locator("#map-event-heading")).toBeFocused();
    await expect(page.getByTestId("home-map-guidance")).toHaveCount(0);
    await expect(page.getByTestId("map-event-detail")).toBeInViewport();
    await captureAndCheck(page, "card");
    await page.locator(".globe-attribution > summary").click();
    expect((await measure(page)).collisions).toEqual([]);
    await page.locator(".globe-attribution > summary").click();
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("home-map-guidance")).toBeVisible();
    await page.getByRole("button", { name: "Xem hành trình", exact: true }).click();
    await expect(page.getByTestId("journey-panel")).toBeVisible();
    await expect(page.getByTestId("home-map-guidance")).toHaveCount(0);
    await expect(page.getByTestId("map-event-card")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Hành trình", exact: true })).toHaveAttribute("aria-pressed", "true");
    await captureAndCheck(page, "journey");
    const reader = page.getByRole("region", { name: "Nội dung mốc hành trình" });
    await reader.getByText("Nguồn và độ chính xác", { exact: true }).click();
    const before = new URL(page.url()).searchParams.get("ban-do");
    await reader.hover(); await page.mouse.wheel(0, 800);
    expect(new URL(page.url()).searchParams.get("ban-do")).toBe(before);
    const scroll = await reader.evaluate((el) => ({ height: el.clientHeight, content: el.scrollHeight }));
    if (scroll.content > scroll.height + 1) await expect.poll(() => reader.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(size.height);
    await page.screenshot({ path: path.join(output, `journey-sources-${size.width}x${size.height}.png`), scale: "css" });
    await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeInViewport();
    await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
    await expect(page.getByRole("button", { name: "Hành trình", exact: true })).toBeFocused();
  });
}

test("atlas keyboard skip, mode, secondary navigation, search and reading remain accessible", async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await ready(page);
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Bỏ qua menu, tới nội dung chính", exact: true });
  await expect(skip).toBeFocused(); await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter"); await expect(page.locator("main")).toBeFocused();
  const modes = page.getByRole("button", { name: "Hành trình", exact: true });
  await modes.focus(); await page.keyboard.press("Enter");
  await expect(page.locator("#journey-stop-heading")).toBeFocused();
  await page.getByRole("button", { name: "Khám phá", exact: true }).click();
  const secondary = page.locator(".home-atlas-secondary > summary");
  await secondary.focus(); await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Học theo bài", exact: true })).toBeFocused();
  await page.keyboard.press("Escape"); await expect(secondary).toBeFocused();
  await expect(page.getByRole("link", { name: "Học theo bài", exact: true })).toBeHidden();
  await page.getByRole("link", { name: "Tìm kiếm", exact: true }).focus();
  await page.keyboard.press("Enter"); await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape"); await expect(page.getByRole("link", { name: "Tìm kiếm", exact: true })).toBeFocused();
  await page.keyboard.press("/"); await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator(".home-map-list summary").click();
  await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.getByTestId("explorer-event-item").last().getByRole("button").focus();
  await expect(page.getByTestId("explorer-event-item").last().getByRole("button")).toBeInViewport();
  await page.locator(".home-map-list summary").click();
  const violations = (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations;
  expect(violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) }))).toEqual([]);
});

test("atlas native navigation and event links remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: sizes[0] });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`);
  await expect(page.getByTestId("home-atlas-header")).toBeVisible();
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("h1")).toHaveCount(1);
  await page.locator(".home-map-list summary").click();
  await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.locator(".home-atlas-secondary > summary").click();
  await expect(page.getByRole("link", { name: "Ôn tập theo bài", exact: true })).toHaveAttribute("href", "/trac-nghiem");
  await page.getByRole("link", { name: "Học theo bài", exact: true }).click();
  await expect(page).toHaveURL(/\/muc-luc$/);
  await expect(page.locator("#nav-trigger-hoc")).toBeVisible();
  await context.close();
});

test("atlas remains usable while geography loads and both public data and rendering fail", async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  let release = () => {};
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/maps/history-world-land.geojson", async (route) => { await held; await route.abort(); });
  try {
    await page.goto("/?__test_db_error=1", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".home-map-loading").first()).toBeVisible();
    await expect(page.getByTestId("home-atlas-header")).toBeVisible();
    await expect(page.getByTestId("home-map-guidance")).toBeVisible();
  } finally { release(); }
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await expect(page.getByTestId("explorer-data-error")).toBeVisible();
  const data = (await page.getByTestId("explorer-data-error").boundingBox())!;
  const renderer = (await page.getByTestId("globe-error").boundingBox())!;
  expect(data.y + data.height).toBeLessThan(renderer.y);
  expect((await measure(page)).collisions).toEqual([]);
  await page.getByRole("button", { name: "Xem hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Rời Tổ quốc");
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
});

test("secondary study and event detail retain the original shared header through client navigation", async ({ page }) => {
  await ready(page);
  await page.locator(".home-atlas-secondary > summary").click();
  await page.getByRole("link", { name: "Học theo bài", exact: true }).click();
  await expect(page).toHaveURL(/\/muc-luc$/);
  await expect(page.getByTestId("home-atlas-header")).toHaveCount(0);
  await expect(page.locator("#nav-trigger-hoc")).toBeVisible();
  await page.getByRole("link", { name: "Lịch sử 12", exact: true }).click();
  await expect(page.getByTestId("home-atlas-header")).toBeVisible();
  await expect(page.locator("#nav-trigger-hoc")).toHaveCount(0);
  await page.locator(".home-map-list summary").click();
  await page.getByTestId("explorer-event-link").filter({ hasText: "Chiến dịch Điện Biên Phủ" }).click();
  await expect(page).toHaveURL(/\/su-kien\/chien-dich-dien-bien-phu\?/);
  await expect(page.locator("#nav-trigger-hoc")).toBeVisible();
  await expect(page.locator("main")).toHaveCount(1);
});

test("Escape in secondary navigation preserves the selected event and returns focus to its trigger", async ({ page }) => {
  await ready(page, "/?su-kien=chien-dich-dien-bien-phu&ban-do=21.4,103,8");
  await expect(page.getByTestId("map-event-card")).toBeVisible();
  const secondary = page.locator(".home-atlas-secondary > summary");
  await secondary.click();
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("map-event-card")).toBeVisible();
  await expect(secondary).toBeFocused();
  await expect(page.getByRole("link", { name: "Học theo bài", exact: true })).toBeHidden();
});

for (const size of [sizes[0], sizes[2]]) {
  test(`real groups, geographic zoom, filters and detail return retain context at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await ready(page, "/?ban-do=15.5,106.4,3.2");
    const view = () => new URL(page.url()).searchParams.get("ban-do")?.split(",").map(Number);
    await expect.poll(() => view()?.[2]).toBeGreaterThan(3);
    const separatedSlug = "nguyen-ai-quoc-ve-nuoc-lanh-dao-cach-mang";
    const cluster = page.locator(`.home-event-marker.is-cluster[data-event-slugs*="${separatedSlug}"]`);
    const members = (await cluster.getAttribute("data-event-slugs"))!.split("|");
    await cluster.click();
    const popup = page.getByRole("region", { name: "Các sự kiện tại khu vực", exact: true });
    await expect(popup.locator("li button").first()).toBeInViewport();
    const beforeZoom = view()![2];
    await popup.getByRole("button", { name: "Phóng to khu vực", exact: true }).click();
    await expect.poll(() => view()?.[2]).toBeGreaterThan(beforeZoom);
    await expect(popup).toHaveCount(0);
    await expect.poll(() => page.locator(".home-event-marker").evaluateAll((elements, slugs) => elements.filter((element) =>
      element.getAttribute("data-event-slugs")!.split("|").some((slug) => slugs.includes(slug))).length, members)).toBeGreaterThan(1);
    const separated = page.locator(`.home-event-marker:not(.is-cluster)[data-event-slugs="${separatedSlug}"]`);
    const title = await separated.getAttribute("title");
    // Task 02: an already-visible local marker retains the useful fitted scale.
    // 5.4 remains the default event framing, not an interactive camera ceiling.
    const selectionZoom = Math.max(5.4, view()![2]);
    await separated.click();
    await expect(page.getByTestId("map-event-card")).toContainText(title!);
    await expect.poll(() => view()?.[2]).toBe(selectionZoom);
    await page.locator("#explorer-year-from").fill("1954");
    await page.locator("#explorer-year-to").fill("1954");
    await page.getByRole("button", { name: "Lọc thời gian", exact: true }).click();
    await expect(page.getByTestId("explorer-event-count")).toHaveText("2");
    await expect(page.getByTestId("map-event-card")).toHaveCount(0);
    // The group zoom intentionally leaves this event's region. Return to the
    // country overview before selecting a different published location.
    await page.getByRole("button", { name: "Về Việt Nam", exact: true }).click();
    await page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]').click();
    await expect(page.locator("#map-event-heading")).toBeFocused();
    await expect(page.getByTestId("map-event-card")).toContainText("nguồn tham khảo");
    await expect.poll(() => view()?.[2]).toBe(5.4);
    const context = new URL((await page.getByTestId("map-event-detail").getAttribute("href"))!, "http://local").searchParams.get("kham-pha")!;
    mkdirSync(output, { recursive: true });
    await page.screenshot({ path: path.join(output, `group-filter-card-${size.width}x${size.height}.png`), scale: "css" });
    await page.getByTestId("map-event-detail").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chiến dịch Điện Biên Phủ");
    await page.getByRole("link", { name: /Trở lại bản đồ/ }).click();
    await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
    await expect(page.getByTestId("map-event-card")).toContainText("Chiến dịch Điện Biên Phủ");
    await expect(page.locator("#explorer-year-from")).toHaveValue("1954");
    await expect.poll(() => view()).toEqual(new URL(context, "http://local").searchParams.get("ban-do")!.split(",").map(Number));
    await expect(page.getByTestId("globe-map").locator("canvas")).toHaveCount(1);
    await page.screenshot({ path: path.join(output, `detail-return-${size.width}x${size.height}.png`), scale: "css" });
  });

  test(`legacy views preserve place and scale through input, reload and history at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    for (const zoom of [1.2, 4.5, 6.5, 8]) {
      await ready(page, `/?tu=1954&den=1954&ban-do=16,107,${zoom}`);
      const value = () => new URL(page.url()).searchParams.get("ban-do")!.split(",").map(Number);
      expect(value()).toEqual([16, 107, zoom]);
      await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
      await page.getByTestId("globe-map").locator("canvas").focus();
      await page.keyboard.press("ArrowRight");
      await expect.poll(() => value()[1]).toBeGreaterThan(107);
      // Independent Mercator scale at the surface: a 90 CSS px key step. The
      // deterministic overview tilt stays within 15% of this longitude scale.
      const expectedDelta = 90 * 360 / (512 * 2 ** zoom);
      expect(Math.abs((value()[1] - 107) / expectedDelta - 1)).toBeLessThan(0.15);
      expect(value()[2]).toBe(zoom);
      const moved = value();
      await page.reload();
      await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
      expect(value()).toEqual(moved);
      await page.evaluate(() => { history.pushState(null, "", "/?tu=1911&den=1941&ban-do=0,-70,1.2"); dispatchEvent(new PopStateEvent("popstate")); });
      await expect(page.locator("#explorer-year-from")).toHaveValue("1911");
      await page.goBack();
      await expect(page.locator("#explorer-year-from")).toHaveValue("1954");
      await expect.poll(() => value()).toEqual(moved);
      await page.goForward();
      await expect.poll(() => value()).toEqual([0, -70, 1.2]);
      await expect(page.locator(".home-event-marker")).toHaveCount(0);
    }
  });
}

test("marker positions follow real wheel, pan and keyboard camera changes", async ({ page }) => {
  await page.setViewportSize(sizes[2]);
  await ready(page, "/?tu=1954&den=1954&ban-do=16,107,3.64");
  const marker = page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]');
  await expect(marker).toBeVisible();
  const position = async () => { const box = (await marker.boundingBox())!; return { x: box.x + box.width / 2, y: box.y + box.height / 2 }; };
  const start = await position();
  await page.mouse.move(750, 440); await page.mouse.wheel(0, -250);
  await expect.poll(async () => Math.hypot((await position()).x - start.x, (await position()).y - start.y)).toBeGreaterThan(10);
  const wheel = await position();
  await page.mouse.move(750, 440); await page.mouse.down(); await page.mouse.move(815, 470, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => (await position()).x - wheel.x).toBeGreaterThan(40);
  const pan = await position();
  await page.getByTestId("globe-map").locator("canvas").focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(async () => pan.x - (await position()).x).toBeGreaterThan(65);
  await page.screenshot({ path: path.join(output, "real-wheel-pan-keyboard-1440x900.png"), scale: "css" });
});

test("camera flights update card return URLs once after settlement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/?tu=1954&den=1954&su-kien=chien-dich-dien-bien-phu&ban-do=21.4,103,5.4");
  const link = page.getByTestId("map-event-detail");
  const initialHref = await link.getAttribute("href");
  await link.evaluate((element) => {
    const values: string[] = [];
    const observer = new MutationObserver(() => { values.push(element.getAttribute("href")!); });
    observer.observe(element, { attributes: true, attributeFilter: ["href"] });
    (window as unknown as { cameraHrefChanges: string[] }).cameraHrefChanges = values;
  });
  await page.getByRole("button", { name: "Toàn cầu", exact: true }).click();
  await expect.poll(() => link.getAttribute("href")).not.toBe(initialHref);
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",").map(Number)[2]).toBeLessThan(4.4);
  expect(await page.evaluate(() => (window as unknown as { cameraHrefChanges: string[] }).cameraHrefChanges.length)).toBe(1);
});

test("an old wheel-settlement callback cannot publish a frame from a newer event focus flight", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/?tu=1954&den=1954&ban-do=16,107,3.64");
  await page.locator(".home-map-list summary").click();
  const item = page.getByTestId("explorer-event-item").filter({ hasText: "Chiến dịch Điện Biên Phủ" }).getByRole("button");
  await item.evaluate((button) => {
    const changes: string[] = [];
    new MutationObserver((records) => {
      for (const record of records) if ((record.target as HTMLElement).dataset.testid === "map-event-detail")
        changes.push((record.target as HTMLAnchorElement).href);
    }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ["href"] });
    (window as unknown as { cameraHrefChanges: string[] }).cameraHrefChanges = changes;
    // Same event-loop turn makes the pre-existing 160 ms wheel callback
    // deterministically overlap the newly requested 900 ms focus flight.
    document.querySelector("[data-testid=globe-map] canvas")!.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, cancelable: true }));
    (button as HTMLButtonElement).click();
  });
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",")[2]).toBe("5.4");
  expect(await page.evaluate(() => (window as unknown as { cameraHrefChanges: string[] }).cameraHrefChanges.length)).toBe(1);
});

test("real WebGL context loss and a failed local texture recover with one scene and readable links", async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await page.route("**/maps/globe/earth-day-4096x2048.jpg", (route) => route.abort());
  await page.goto("/");
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.locator(".home-map-list summary").click();
  await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.unroute("**/maps/globe/earth-day-4096x2048.jpg");
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  const canvas = page.getByTestId("globe-map").locator("canvas");
  const previousView = new URL(page.url()).searchParams.get("ban-do");
  await canvas.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).not.toBe(previousView);
  const savedView = new URL(page.url()).searchParams.get("ban-do");
  const marker = page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]');
  const savedMarker = (await marker.boundingBox())!;
  const old = (await canvas.elementHandle())!;
  await old.evaluate((element) => {
    // Lose the actual context before the wheel burst's 160 ms settlement.
    element.dispatchEvent(new WheelEvent("wheel", { deltaY: -100, cancelable: true }));
    (element as HTMLCanvasElement).getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext();
  });
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(canvas).toHaveCount(1);
  expect(await old.evaluate((element) => (element as HTMLCanvasElement).getContext("webgl2")!.isContextLost())).toBe(true);
  expect(await canvas.evaluate((element) => (element as HTMLCanvasElement).getContext("webgl2")!.isContextLost())).toBe(false);
  expect(new URL(page.url()).searchParams.get("ban-do")).toBe(savedView);
  await expect.poll(async () => {
    const restored = await marker.boundingBox();
    return restored ? Math.hypot(restored.x - savedMarker.x, restored.y - savedMarker.y) : Infinity;
  }).toBeLessThan(1);
  await page.screenshot({ path: path.join(output, "context-loss-retry-1280x720.png"), scale: "css" });
});

test("exiting a journey restores a selected exploration without replaying its consumed focus request", async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await ready(page, "/?tu=1954&den=1954");
  await page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]').click();
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",")[2]).toBe("5.4");
  await page.getByRole("button", { name: "Thu nhỏ bản đồ", exact: true }).click();
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",")[2]).toBe("4.4");
  const beforeKey = new URL(page.url()).searchParams.get("ban-do");
  await page.getByTestId("globe-map").locator("canvas").focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).not.toBe(beforeKey);
  const savedView = new URL(page.url()).searchParams.get("ban-do");
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  await expect(page.getByTestId("map-event-card")).toContainText("Chiến dịch Điện Biên Phủ");
  await page.waitForTimeout(500); // Outwait an unwanted reduced-motion focus + the owner's URL debounce.
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).toBe(savedView);
});

test.describe("P5 camera direction", () => {
  test.use({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });
  const captures = path.resolve("output/playwright/cinematic-globe/phase-5");
  const journey = "/?hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911";
  const view = (page: Page) => new URL(page.url()).searchParams.get("ban-do");
  const stop = (page: Page, name: RegExp) => page.getByTestId("journey-timeline").getByRole("link", { name });
  const visibility = (page: Page, hidden: boolean) => page.evaluate((hidden) => {
    Object.defineProperty(document, "hidden", { configurable: true, value: hidden });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: hidden ? "hidden" : "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  }, hidden);

  test("fresh entry finishes its finite 3–4 second intro and remains still after arrival", async ({ page }) => {
    await page.addInitScript(() => {
      let started = false;
      const observer = new MutationObserver(() => {
        if (document.querySelector(".globe-skip")) {
          if (!started) { started = true; performance.mark("p5-intro-start"); }
        } else if (started) { performance.mark("p5-intro-end"); observer.disconnect(); }
      });
      observer.observe(document, { childList: true, subtree: true });
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toBeVisible();
    await expect.poll(() => view(page), { timeout: 6000 }).toBe("15.5,106.4,3.64");
    const duration = await page.evaluate(() => performance.getEntriesByName("p5-intro-end")[0].startTime - performance.getEntriesByName("p5-intro-start")[0].startTime);
    expect(duration).toBeGreaterThanOrEqual(3000);
    expect(duration).toBeLessThanOrEqual(4000);
    const canvas = page.getByTestId("globe-map").locator("canvas");
    const atArrival = await canvas.screenshot();
    await page.waitForTimeout(1000);
    expect((await canvas.screenshot()).equals(atArrival)).toBe(true);
    mkdirSync(captures, { recursive: true });
    writeFileSync(path.join(captures, "intro-timing.json"), JSON.stringify({ durationMs: duration, viewport: [1440, 900], method: "DOM intro visibility marks; one-second exact canvas comparison after arrival" }, null, 2));
  });

  test("manual wheel interruption discards the intro and session entry never replays it", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toBeVisible();
    await page.mouse.move(750, 430); await page.mouse.wheel(0, -100);
    await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
    await expect.poll(() => view(page)).not.toBeNull();
    const interrupted = view(page);
    await page.waitForTimeout(4000);
    expect(view(page)).toBe(interrupted);
    await ready(page, "/");
    await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
  });

  test("runtime reduced motion instantly finishes a live world control without replaying it on opt-in", async ({ page }) => {
    await ready(page, "/?ban-do=16,107,4.5");
    await page.getByRole("button", { name: "Toàn cầu", exact: true }).click();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => Number(view(page)?.split(",")[2]), { timeout: 600 }).toBeLessThan(3);
    const settled = view(page);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(1200);
    expect(view(page)).toBe(settled);
  });

  test("hidden travel discards stale work and returns instantly to only the latest hidden seek", async ({ page }) => {
    await ready(page, journey);
    await expect.poll(() => view(page)).toBe("10.76212,106.70298,6.4");
    await stop(page, /Marseille/).click();
    await page.waitForTimeout(300);
    await visibility(page, true);
    await stop(page, /London/).click();
    await page.waitForTimeout(4000);
    expect(view(page)).toBe("10.76212,106.70298,6.4");
    await visibility(page, false);
    await expect.poll(() => view(page), { timeout: 700 }).toBe("51.50194,-0.11867,5.5");
    await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
    await expect(page.locator(".globe-journey-pin")).toBeVisible();
    await page.waitForTimeout(4000);
    expect(view(page)).toBe("51.50194,-0.11867,5.5");
  });

  test("the two-second reading interval starts after intercontinental arrival and pause cancels advancement", async ({ page }) => {
    await ready(page, journey);
    await stop(page, /Marseille/).click();
    await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
    await expect(page.getByTestId("journey-panel")).toContainText("Đang chuyển tới địa điểm");
    await expect(page.getByTestId("journey-panel")).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
    await page.waitForTimeout(1500);
    expect(new URL(page.url()).searchParams.get("moc")).toBe("marseille-1911");
    await expect.poll(() => new URL(page.url()).searchParams.get("moc"), { timeout: 4000 }).toBe("london-1913");
    await page.getByRole("button", { name: "Tạm dừng hành trình", exact: true }).click();
    await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
    await page.waitForTimeout(2500);
    expect(new URL(page.url()).searchParams.get("moc")).toBe("london-1913");
  });

  test("seek spam and drag leave the latest manual camera intact beyond every canceled arrival", async ({ page }) => {
    await ready(page, journey);
    for (const name of [/Marseille/, /Paris/, /Moskva/, /Tours/, /Marseille/]) await stop(page, name).click();
    await page.mouse.move(760, 450); await page.mouse.down();
    await page.mouse.move(815, 475, { steps: 8 }); await page.mouse.up();
    await expect.poll(() => view(page)).not.toBe("10.76212,106.70298,6.4");
    const manual = view(page);
    await page.waitForTimeout(4000);
    expect(view(page)).toBe(manual);
    expect(new URL(page.url()).searchParams.get("moc")).toBe("marseille-1911");
    await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  });

  test("route departure freezes the physical camera while a detail response is delayed", async ({ page }) => {
    let release = () => {};
    const held = new Promise<void>((resolve) => { release = resolve; });
    let requested = false;
    await page.route("**/su-kien/**", async (route) => { requested = true; await held; await route.continue(); });
    await ready(page, "/?hanh-trinh=ho-chi-minh-1911-1941&moc=moscow-1923");
    await stop(page, /Bến Nhà Rồng/).click();
    await page.waitForTimeout(300);
    await page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ }).click();
    try {
      await expect.poll(() => requested).toBe(true);
      const canvas = page.getByTestId("globe-map").locator("canvas");
      const atDeparture = await canvas.screenshot();
      const url = page.url();
      await page.waitForTimeout(4000);
      expect((await canvas.screenshot()).equals(atDeparture)).toBe(true);
      expect(page.url()).toBe(url);
    } finally { release(); }
    await expect(page).toHaveURL(/\/su-kien\/nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc/);
  });

  for (const size of [sizes[0], sizes[2]]) test(`captures Vietnam–Marseille context and return at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await ready(page, journey);
    mkdirSync(captures, { recursive: true });
    const backend = await page.getByTestId("globe-map").locator("canvas").evaluate((element) => {
      const gl = (element as HTMLCanvasElement).getContext("webgl2")!;
      const debug = gl.getExtension("WEBGL_debug_renderer_info");
      return { browser: navigator.userAgent, dpr: devicePixelRatio, viewport: [innerWidth, innerHeight], webgl: gl.getParameter(gl.VERSION), renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : "unavailable" };
    });
    writeFileSync(path.join(captures, `browser-${size.width}x${size.height}.json`), JSON.stringify(backend, null, 2));
    for (const [direction, name, target] of [["outbound", /Marseille/, "43.29192,5.37306,5.5"], ["return", /Bến Nhà Rồng/, "10.76212,106.70298,6.4"]] as const) {
      await stop(page, name).click();
      await page.waitForTimeout(1700); // Capture the world-context turn of this 3–3.6 second flight.
      await page.screenshot({ path: path.join(captures, `${direction}-context-${size.width}x${size.height}.png`), scale: "css" });
      await expect.poll(() => view(page)).toBe(target);
      await expect(page.locator(".globe-journey-pin")).toBeVisible();
      await page.screenshot({ path: path.join(captures, `${direction}-arrival-${size.width}x${size.height}.png`), scale: "css" });
    }
  });
});
