import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";

test.use({ viewport: { width: 1280, height: 720 } });
test.setTimeout(90_000);
const output = path.resolve("output/playwright/home-globe");

async function ready(page: Page, href = "/?ban-do=16,107,4.5") {
  await page.goto(href);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
}

test("integrated globe uses one real canvas and only the approved local geography and imagery", async ({ page }) => {
  const requests: string[] = []; const imagery: string[] = []; const errors: string[] = [];
  page.on("request", (request) => { requests.push(request.url()); if (request.resourceType() === "image") imagery.push(request.url()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await ready(page);
  const canvas = page.getByTestId("globe-map").locator("canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((element) => Boolean((element as HTMLCanvasElement).getContext("webgl2")))).toBe(true);
  await expect(page.locator(".home-event-marker").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Toàn cầu", exact: true })).toBeVisible();
  const allowed = [
    "/maps/history-world-land.geojson",
    "/maps/vietnam-tabletop.geojson",
    "/maps/history-vietnam-labels.json",
    "/maps/history-country-boundaries.geojson",
    "/maps/history-vietnam-province-boundaries.geojson",
    "/maps/globe/earth-day-4096x2048.jpg",
    "/maps/globe/earth-normal-2048x1024.jpg",
    "/maps/globe/earth-specular-2048x1024.jpg",
  ];
  const origin = new URL(page.url()).origin;
  const geographicRequests = requests.map((url) => new URL(url)).filter((url) =>
    url.pathname.startsWith("/maps/") || /\.(?:geojson|pbf)(?:$|\?)/.test(url.pathname)
    || /(?:tile\.openstreetmap|demotiles|mapbox|arcgisonline|cartocdn|googleapis\.com\/.*tile)/i.test(url.href));
  expect(geographicRequests.filter((url) => url.origin !== origin || !allowed.includes(url.pathname)).map((url) => url.href)).toEqual([]);
  expect(imagery.map((url) => new URL(url)).filter((url) => url.origin !== origin || !allowed.includes(url.pathname)).map((url) => url.href)).toEqual([]);
  for (const asset of allowed) expect(requests.some((url) => new URL(url).pathname === asset), asset).toBe(true);
  expect(errors).toEqual([]);
});

test("desktop globe, event card and journey remain usable at the four agreed viewports", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page); mkdirSync(output, { recursive: true });
  for (const size of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
    await page.setViewportSize(size);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(size.height);
    const canvas = await page.getByTestId("globe-map").locator("canvas").boundingBox();
    expect(canvas!.height).toBeGreaterThanOrEqual(size.height - 67);
    await page.getByRole("button", { name: "Về Việt Nam", exact: true }).click();
    const marker = page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]');
    await expect(marker).toBeInViewport();
    await page.screenshot({ path: path.join(output, `globe-${size.width}x${size.height}.png`) });
    await marker.click(); await expect(page.getByTestId("map-event-detail")).toBeInViewport();
    const controls = await page.locator(".home-map-tools").boundingBox(); const card = await page.getByTestId("map-event-card").boundingBox();
    expect(controls!.x + controls!.width).toBeLessThan(card!.x);
    await page.screenshot({ path: path.join(output, `card-${size.width}x${size.height}.png`) });
    await page.getByRole("button", { name: "Đóng thông tin sự kiện", exact: true }).click();
    await page.getByRole("button", { name: "Hành trình", exact: true }).click();
    await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeInViewport();
    const journey = await page.getByTestId("journey-panel").boundingBox(); const strip = await page.getByTestId("journey-timeline").boundingBox();
    expect(journey!.y + journey!.height).toBeLessThan(strip!.y);
    await page.screenshot({ path: path.join(output, `journey-${size.width}x${size.height}.png`) });
    await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  }
});

test("fresh entry can skip its globe intro and restored URLs never replay it", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true });
  await expect(skip).toBeVisible(); await skip.click(); await expect(skip).toHaveCount(0);
  await expect.poll(() => Number(new URL(page.url()).searchParams.get("ban-do")?.split(",")[2] ?? 0), { timeout: 600 }).toBeGreaterThan(3);
  await page.reload(); await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(skip).toHaveCount(0);
});

test("camera arrival cannot cancel a delayed event navigation during the intro", async ({ page }) => {
  await page.route("**/su-kien/**", async (route) => { await new Promise((resolve) => setTimeout(resolve, 4000)); await route.continue(); });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toBeVisible();
  await page.locator(".home-map-list summary").click();
  await page.getByTestId("explorer-event-link").filter({ hasText: "Chiến dịch Điện Biên Phủ" }).click();
  await expect(page).toHaveURL(/\/su-kien\/chien-dich-dien-bien-phu\?/, { timeout: 12_000 });
});

test("journey playback waits for reading, pauses on map input, and seeking cancels earlier flights", async ({ page }) => {
  await ready(page); await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Tự chuyển sau ít nhất 2 giây đọc");
  await expect.poll(() => new URL(page.url()).searchParams.get("moc"), { timeout: 15_000 }).toBe("marseille-1911");
  await page.mouse.move(700, 280); await page.mouse.wheel(0, -100);
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
  const timeline = page.getByTestId("journey-timeline");
  await timeline.getByRole("link", { name: /Paris/ }).click(); await timeline.getByRole("link", { name: /Moskva/ }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Hoạt động tại Liên Xô");
  await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe("moscow-1923");
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",")[0]).toBe("55.75411");
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await page.evaluate(() => { Object.defineProperty(document, "hidden", { configurable: true, value: true }); document.dispatchEvent(new Event("visibilitychange")); });
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
});

test("changing motion preference stops playback and exiting a shared journey returns to Vietnam", async ({ page }) => {
  await ready(page, "/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click();
  await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  await expect.poll(() => Number(new URL(page.url()).searchParams.get("ban-do")?.split(",")[1] ?? 0)).toBeGreaterThan(100);
  await expect(page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]')).toBeVisible();
});

test("a published event detail returns to the same paused biographical milestone", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/?hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911");
  await page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ }).click();
  await expect(page).toHaveURL(/\/su-kien\/nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc/);
  await page.getByRole("link", { name: /Trở lại bản đồ/ }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Rời Tổ quốc");
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe("sai-gon-1911");
});

test("exiting or restoring browser history during a flight cancels the old camera destination", async ({ page }) => {
  const href = "/?tu=1954&den=1954&ban-do=16,107,4.5";
  await ready(page, href);
  const marker = page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]');
  const savedMarker = (await marker.boundingBox())!;
  const physicalError = async () => { const box = await marker.boundingBox(); return box ? Math.hypot(box.x - savedMarker.x, box.y - savedMarker.y) : Infinity; };
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Paris/ }).click();
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  // Outwait the longest P5 flight (3.6 seconds) plus the owner's URL debounce.
  await page.waitForTimeout(4000);
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).toBe("16,107,4.5");
  await expect.poll(physicalError).toBeLessThan(1);
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Moskva/ }).click();
  await page.evaluate((url) => { history.pushState(null, "", url); dispatchEvent(new PopStateEvent("popstate")); }, href);
  await page.waitForTimeout(4000);
  await expect(page.getByTestId("journey-panel")).toHaveCount(0);
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).toBe("16,107,4.5");
  await expect.poll(physicalError).toBeLessThan(1);
});

test("a shared journey opens paused, survives reload, and never creates a draft event link", async ({ page }) => {
  await ready(page, "/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
  await expect(page.getByTestId("journey-panel")).toContainText("Tiếng nói tại Pháp");
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
  await page.reload(); await expect(page.getByTestId("journey-panel")).toContainText("06/1919");
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Tours/ }).click();
  await expect(page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết/ })).toHaveCount(0);
});

test("event pins on the far side of Earth are hidden while their HTML links remain", async ({ page }) => {
  await ready(page, "/?tu=1954&den=1954&ban-do=0,-70,1.5");
  await expect(page.locator(".home-event-marker")).toHaveCount(0);
  await page.locator(".home-map-list summary").click();
  expect(await page.getByTestId("explorer-event-link").count()).toBeGreaterThan(0);
  await page.locator(".home-map-list summary").click();
  await page.getByRole("button", { name: "Về Việt Nam", exact: true }).click();
  await expect(page.locator(".home-event-marker").first()).toBeVisible();
});

test("unsupported WebGL keeps both event reading and manual journey selection available", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, ...args: unknown[]) {
      if (contextId.startsWith("webgl")) return null;
      return original.apply(this, [contextId, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto("/"); await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.locator(".home-map-list summary").click(); await expect(page.getByTestId("explorer-event-link").first()).toBeVisible();
  await page.getByRole("button", { name: "Hành trình", exact: true }).click(); await page.getByTestId("journey-timeline").getByRole("link", { name: /Tours/ }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Bước ngoặt ở Tours");
});

test("authored journey supports seeking, sources, reduced motion, and exploration restoration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page, "/?tu=1954&den=1954&ban-do=16,107,4.5");
  await page.getByRole("button", { name: "Hành trình", exact: true }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("Rời Tổ quốc");
  await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
  await page.getByRole("link", { name: "Paris", exact: false }).click();
  await expect(page.getByTestId("journey-panel")).toContainText("06/1919");
  await expect(page.getByTestId("journey-panel")).toContainText("không đánh dấu địa điểm hội nghị tại Versailles");
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe("paris-1919");
  await page.getByTestId("journey-panel").getByText("Nguồn và độ chính xác", { exact: true }).click();
  await expect(page.getByTestId("journey-panel").getByRole("link", { name: "Cổng thông tin Hồ Chí Minh", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  await expect(page.locator("#explorer-year-from")).toHaveValue("1954");
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")).toBe("16,107,4.5");
});
