import { expect, test, type Page } from "./refinement-test";
import AxeBuilder from "@axe-core/playwright";

// Public, read-only browser journeys. No staff/payment/database-write helpers.
test.use({ viewport: { width: 1280, height: 720 }, reducedMotion: "reduce" });
test.setTimeout(90_000);
async function ready(page: Page, href = "/") {
  await page.goto(href);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.locator(".home-event-marker").first()).toBeVisible();
}
const view = (page: Page) => new URL(page.url()).searchParams.get("ban-do")?.split(",").map(Number);

test("marker, detail, explicit return, reload and Escape retain their exploration context", async ({ page }) => {
  await ready(page, "/?tu=1954&den=1954");
  await page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]').click();
  await expect(page.getByTestId("map-event-card")).toContainText("Chiến dịch Điện Biên Phủ");
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(5);
  const backHref = new URL((await page.getByTestId("map-event-detail").getAttribute("href"))!, "http://local").searchParams.get("kham-pha");
  await page.getByTestId("map-event-detail").click();
  await expect(page).toHaveURL(/\/su-kien\/chien-dich-dien-bien-phu\?/);
  const back = page.getByRole("link", { name: "Trở lại bản đồ", exact: false });
  await expect(back).toHaveAttribute("href", backHref!); await back.click();
  await expect(page.getByTestId("map-event-card")).toContainText("Chiến dịch Điện Biên Phủ");
  await expect(page.locator("#explorer-year-from")).toHaveValue("1954");
  await expect.poll(() => view(page)).toEqual(new URL(backHref!, "http://local").searchParams.get("ban-do")!.split(",").map(Number));
  await page.reload(); await expect(page.locator("#map-event-heading")).toBeFocused();
  await page.keyboard.press("Escape"); await expect(page.getByTestId("map-event-card")).toHaveCount(0);
  await expect(page.locator(".home-map-list summary")).toBeFocused();
});

test("wheel, drag, keyboard, zoom buttons and world/country controls move the real camera", async ({ page }) => {
  await ready(page);
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(0);
  const initialZoom = view(page)![2];
  await page.getByRole("button", { name: "Phóng to bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(initialZoom);
  const zoom = view(page)![2];
  await page.getByRole("button", { name: "Thu nhỏ bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBeLessThan(zoom);
  const beforeWheel = view(page)![2];
  await page.mouse.move(760, 300); await page.mouse.wheel(0, -500);
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(beforeWheel);
  const beforePan = view(page)!.slice(0, 2);
  await page.mouse.move(760, 300); await page.mouse.down(); await page.mouse.move(850, 340, { steps: 8 }); await page.mouse.up();
  await expect.poll(() => view(page)?.slice(0, 2)).not.toEqual(beforePan);
  const beforeKey = view(page)![1]; await page.getByTestId("globe-map").locator("canvas").focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => view(page)?.[1]).not.toBe(beforeKey);
  const closeZoom = view(page)![2];
  await page.getByRole("button", { name: "Toàn cầu", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBeLessThan(closeZoom - 1);
  expect(view(page)?.slice(0, 2)).toEqual([18, 107]);
  await page.getByRole("button", { name: "Về Việt Nam", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(3);
});

test("grouped events remain individually selectable with usable keyboard dismissal", async ({ page }) => {
  await ready(page); const group = page.locator(".home-event-marker.is-cluster").first(); await group.click();
  const popup = page.getByRole("region", { name: "Các sự kiện tại khu vực", exact: true });
  await expect(popup.getByRole("button", { name: "Phóng to khu vực" })).toBeInViewport();
  expect(await popup.locator("li button").count()).toBeGreaterThan(1);
  await popup.getByRole("button", { name: "Đóng nhóm sự kiện" }).focus(); await page.keyboard.press("Escape");
  await expect(popup).toHaveCount(0); await expect(group).toBeFocused(); await group.click();
  const first = popup.locator("li button").first(); const text = await first.textContent(); await first.click();
  expect(text).toContain(await page.locator("#map-event-heading").textContent());
});

test("time filter updates map and list, clears excluded selection, and follows browser history", async ({ page }) => {
  await ready(page); await page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]').click();
  await page.locator("#explorer-year-from").fill("1912"); await page.locator("#explorer-year-to").fill("1912");
  await page.getByRole("button", { name: "Lọc thời gian", exact: true }).click();
  await expect(page.getByTestId("explorer-event-count")).toHaveText("0"); await expect(page.locator(".home-event-marker")).toHaveCount(0);
  await expect(page.getByTestId("map-event-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Toàn bộ", exact: true }).click(); await expect(page.locator(".home-event-marker").first()).toBeVisible();
  await expect.poll(() => new URL(page.url()).searchParams.get("tu")).toBe("1911");
  await page.evaluate(() => { window.history.pushState(null, "", "/?tu=1954&den=1954"); window.dispatchEvent(new PopStateEvent("popstate")); });
  await expect(page.locator("#explorer-year-from")).toHaveValue("1954"); await page.goBack(); await expect(page.locator("#explorer-year-from")).toHaveValue("1911");
  await page.goForward(); await expect(page.locator("#explorer-year-from")).toHaveValue("1954");
});

test("failed geographic asset can retry while the event list stays readable", async ({ page }) => {
  await page.route("**/maps/history-world-land.geojson", (route) => route.abort()); await page.goto("/");
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.locator(".home-map-list summary").click(); await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.unroute("**/maps/history-world-land.geojson"); await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true"); await expect(page.locator(".home-event-marker").first()).toBeVisible();
});

test("failed public event data retains the globe and the sourced editorial journey", async ({ page }) => {
  await page.goto("/?__test_db_error=1"); await expect(page.getByTestId("explorer-data-error")).toBeVisible();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(page.getByTestId("explorer-event-count")).toHaveText("0");
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Rời Tổ quốc"); await expect(page.getByRole("link", { name: "Xem chi tiết sự kiện →", exact: true })).toHaveCount(0);
});

test("no-JavaScript users can read event links and switch the authored journey through HTML", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 720 } }); const page = await context.newPage();
  await page.goto(`${baseURL}/`); await page.locator(".home-map-list summary").click(); await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.goto(`${baseURL}/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919`);
  await expect(page.getByTestId("journey-panel")).toContainText("06/1919");
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Tours/ }).click(); await expect(page.getByTestId("journey-panel")).toContainText("12/1920");
  await context.close();
});

test("reduced motion, event panel focus and short desktop layout pass accessibility checks", async ({ page }) => {
  await ready(page, "/?su-kien=chien-dich-dien-bien-phu&ban-do=21.4,103,8"); await expect(page.locator("#map-event-heading")).toBeFocused();
  const card = await page.getByTestId("map-event-card").boundingBox(); const time = await page.getByTestId("map-time-controls").boundingBox();
  expect(card!.y + card!.height).toBeLessThan(time!.y);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations.map((violation) => ({ id: violation.id, nodes: violation.nodes.map((node) => node.target) }))).toEqual([]);
  await page.keyboard.press("Escape"); await expect(page.locator(".home-map-list summary")).toBeFocused();
});

test("malformed world and journey state recovers without accepting foreign navigation", async ({ page }) => {
  await ready(page, "/?tu=1975&den=1930&su-kien=missing-event&ban-do=NaN,105,99&hanh-trinh=unknown&moc=bad");
  await expect(page.locator("#explorer-year-from")).toHaveValue("1911"); await expect(page.getByTestId("map-event-card")).toHaveCount(0);
  await expect(page.getByTestId("journey-panel")).toHaveCount(0);
});

test("pending filter URL writes do not cancel event navigation", async ({ page }) => {
  await ready(page); await page.route("**/su-kien/**", async (route) => { await new Promise((resolve) => setTimeout(resolve, 500)); await route.continue(); });
  await page.locator(".home-map-list summary").click(); await page.locator("#explorer-year-from").fill("1954"); await page.locator("#explorer-year-to").fill("1954");
  await page.getByRole("button", { name: "Lọc thời gian", exact: true }).click();
  await page.getByTestId("explorer-event-link").filter({ hasText: "Chiến dịch Điện Biên Phủ" }).click();
  await expect(page).toHaveURL(/\/su-kien\/chien-dich-dien-bien-phu\?/); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Chiến dịch Điện Biên Phủ");
});
