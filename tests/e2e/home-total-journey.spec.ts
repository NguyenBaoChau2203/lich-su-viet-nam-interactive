import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import { TOTAL_JOURNEY_ID } from "@/lib/explorer/journeys/total";

const output = path.resolve("output/playwright/explorer-map-total-journey");
const first = "ho-chi-minh-1911-1941-sai-gon-1911";
const pacBo = "ho-chi-minh-1911-1941-pac-bo-1941";
const haNoi1945 = "mua-thu-doc-lap-1945-ha-noi-1945";
const baDinh = "mua-thu-doc-lap-1945-ba-dinh-1945";
const haNoi1946 = "khang-chien-chong-phap-1946-1954-ha-noi-1946";
const geneve = "khang-chien-chong-phap-1946-1954-geneve-1954";
const buonMaThuot = "mua-xuan-1975-buon-ma-thuot-1975";
const last = "mua-xuan-1975-sai-gon-1975";
const middle = "mua-thu-doc-lap-1945-hue-1945";
const href = (stop: string) => `/?tu=1911&den=1975&hanh-trinh=${TOTAL_JOURNEY_ID}&moc=${stop}`;

async function expectCurrentMilestoneInView(page: Page) {
  await expect.poll(() => page.locator(".journey-timeline ol").evaluate(list => {
    const current = list.querySelector('[aria-current="step"]');
    if (!current) return false;
    const outer = list.getBoundingClientRect(), item = current.getBoundingClientRect();
    return item.left >= outer.left - 1 && item.right <= outer.right + 1;
  })).toBe(true);
}

test.use({ reducedMotion: "reduce" });
test.beforeAll(() => mkdirSync(output, { recursive: true }));

test("the total journey keeps source order, media, boundaries and return state", async ({ page }, info) => {
  await page.goto("/?tu=1911&den=1975&hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911");
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 60_000 });
  await expect(page.getByTestId("journey-select").locator("option")).toHaveCount(5);
  const choice = page.locator('[data-journey-id="hanh-trinh-tong-hop"]');
  await choice.focus();
  await expect(choice).toBeFocused();
  await page.keyboard.press("Enter");
  await expect.poll(() => new URL(page.url()).searchParams.get("hanh-trinh")).toBe(TOTAL_JOURNEY_ID);
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(first);
  await expect(page.getByRole("heading", { name: "Rời Tổ quốc", exact: true })).toBeVisible();
  await expect(page.getByTestId("journey-note")).toContainText("Tổng hợp các mốc từ những hành trình hiện có theo thứ tự thời gian");
  await expect(page.getByTestId("journey-note")).toContainText("Đường nối là sơ đồ, không phải tuyến di chuyển thực tế.");
  await expect(page.getByTestId("journey-panel")).toContainText("Giảm chuyển động");
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
  await expect(page.locator(".journey-media img")).toHaveAttribute("src", /so-luong-1911/);
  await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(20);
  await expect(page.getByRole("button", { name: "Mốc trước", exact: true })).toBeDisabled();

  for (const [from, to, title] of [
    [pacBo, haNoi1945, "Hà Nội giành chính quyền"],
    [baDinh, haNoi1946, "Toàn quốc kháng chiến"],
    [geneve, buonMaThuot, "Tiến công Buôn Ma Thuột"],
  ] as const) {
    await page.goto(href(from));
    await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeEnabled();
    await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
    await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(to);
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expectCurrentMilestoneInView(page);
    await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeFocused();
    await page.getByRole("button", { name: "Mốc trước", exact: true }).click();
    await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(from);
  }

  await page.goto(href(last));
  await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeDisabled();
  await expect(page.getByRole("heading", { name: "Cờ giải phóng tại Dinh Độc Lập", exact: true })).toBeVisible();
  await expect(page.locator(".journey-timeline ol")).toHaveClass(/is-scrollable/);
  await expectCurrentMilestoneInView(page);
  const timeline = (await page.getByTestId("journey-timeline").boundingBox())!;
  const intro = (await page.locator(".home-map-intro").boundingBox())!;
  const reader = (await page.getByTestId("journey-popup").boundingBox())!;
  expect(intro.y + intro.height).toBeLessThanOrEqual(timeline.y + 1);
  expect(reader.y + reader.height).toBeLessThanOrEqual(timeline.y + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
  await page.screenshot({ path: path.join(output, `total-journey-${info.project.name}.png`), scale: "css" });

  await page.goto(href(middle));
  await expect(page.getByRole("heading", { name: "Huế giành chính quyền", exact: true })).toBeVisible();
  await page.reload();
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(middle);
  await expectCurrentMilestoneInView(page);
  await page.goto(href(first));
  await page.goBack();
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(middle);
  await page.goForward();
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(first);
  await expect(page.getByRole("heading", { name: "Rời Tổ quốc", exact: true })).toBeVisible();

  const detail = page.getByRole("link", { name: /Xem chi tiết sự kiện/ });
  await expect(detail).toHaveAttribute("href", /su-kien\/nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc/);
  const returnStop = new URL(page.url()).searchParams.get("moc");
  await detail.click();
  await expect(page).toHaveURL(/\/su-kien\/nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc/);
  await page.goBack();
  await expect.poll(() => new URL(page.url()).searchParams.get("hanh-trinh")).toBe(TOTAL_JOURNEY_ID);
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(returnStop);
});

test("the active milestone stays in view during playback and desktop resize without moving page focus", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(href(geneve));
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 60_000 });
  await expect(page.getByRole("button", { name: "Đọc mốc hiện tại", exact: true })).toBeEnabled();
  await expectCurrentMilestoneInView(page);
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await page.mouse.move(5, 65);
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(buonMaThuot);
  await page.getByRole("button", { name: "Tạm dừng hành trình", exact: true }).click();
  await expectCurrentMilestoneInView(page);
  const originalSize = page.viewportSize()!;
  const focusedBeforeResize = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  await page.setViewportSize({ width: 1280, height: 720 });
  await expectCurrentMilestoneInView(page);
  expect(await page.evaluate(() => document.activeElement?.getAttribute("aria-label"))).toBe(focusedBeforeResize);
  expect(await page.evaluate(() => ({ x: scrollX, y: scrollY }))).toEqual({ x: 0, y: 0 });
  await page.setViewportSize(originalSize);
  await expectCurrentMilestoneInView(page);
  await page.screenshot({ path: path.join(output, `total-playback-current-${info.project.name}.png`), scale: "css" });
});

test("no JavaScript can open the total journey and an individual journey", async ({ browser, baseURL }, info) => {
  test.skip(info.project.name !== "1280x720", "Static links do not depend on the other desktop sizes.");
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  try {
    await page.goto(href(middle));
    await expect(page.getByTestId("journey-title")).toHaveText("Hành trình tổng hợp");
    await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(20);
    await expect(page.locator(".journey-summary")).toContainText("Ngày 23/8");
    await page.goto("/?hanh-trinh=mua-thu-doc-lap-1945&moc=ha-noi-1945");
    await expect(page.getByTestId("journey-title")).toHaveText("Mùa thu độc lập 1945");
    await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(4);
    await page.screenshot({ path: path.join(output, "total-journey-no-js-1280x720.png"), scale: "css" });
  } finally {
    await context.close();
  }
});
