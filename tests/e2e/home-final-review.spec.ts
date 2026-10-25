import { test, expect } from "./refinement-test";

for (const size of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`intro decoration does not create scrollbars at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    const scroll = await page.locator(".home-map-intro").evaluate(element => ({
      width: element.clientWidth, contentWidth: element.scrollWidth,
      height: element.clientHeight, contentHeight: element.scrollHeight,
    }));
    expect(scroll.contentWidth).toBeLessThanOrEqual(scroll.width + 1);
    expect(scroll.contentHeight).toBeLessThanOrEqual(scroll.height + 1);
  });
}

test("country geometry over the render budget degrades without an unhandled error", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  // Synthetic source has a valid envelope; subdivision must still reject its
  // 60,001 distinct short edges. It is not a real administrative boundary.
  const coordinates = Array.from({ length: 60_002 }, (_, index) => [100 + index * 0.00001, 20]);
  await page.route("**/maps/history-country-boundaries.geojson", route => route.fulfill({
    contentType: "application/json", body: JSON.stringify({ type: "FeatureCollection", features: [{
      type: "Feature", properties: { sourceId: 1, sourceClass: "International boundary (verify)", viewClass: "International boundary (verify)" },
      geometry: { type: "LineString", coordinates },
    }] }),
  }));
  await page.goto("/?ban-do=15.5,106.4,3.32");
  const globe = page.getByTestId("cinematic-globe");
  await expect(globe).toHaveAttribute("data-state", "ready", { timeout: 30_000 });
  await expect(globe).toHaveAttribute("data-country-boundaries", "unavailable");
  await expect(page.getByRole("button", { name: "Toàn cầu", exact: true })).toBeEnabled();
  await page.locator(".home-event-marker").first().click();
  await expect(page.locator(".home-map-event-card")).toBeVisible();
  expect(errors).toEqual([]);
});

test("camera flights retain overlay observers instead of rebuilding subscriptions per frame", async ({ page }) => {
  await page.addInitScript(() => {
    const counts = { resize: 0, mutation: 0 };
    Object.defineProperty(window, "reviewObserverCounts", { value: counts });
    const NativeResize = window.ResizeObserver, NativeMutation = window.MutationObserver;
    window.ResizeObserver = class extends NativeResize {
      constructor(callback: ResizeObserverCallback) { super(callback); counts.resize++; }
    };
    window.MutationObserver = class extends NativeMutation {
      constructor(callback: MutationCallback) { super(callback); counts.mutation++; }
    };
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?ban-do=15.5,106.4,3.32");
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  const counts = () => page.evaluate(() => ({ ...(window as unknown as { reviewObserverCounts: { resize: number; mutation: number } }).reviewObserverCounts }));
  const before = await counts();
  await page.getByRole("button", { name: "Toàn cầu", exact: true }).click();
  await expect.poll(() => Number(new URL(page.url()).searchParams.get("ban-do")?.split(",")[2])).toBeLessThan(3);
  const after = await counts();
  // Allow a small fixed mount/settle margin, never a per-frame subscription.
  expect(after.resize - before.resize).toBeLessThanOrEqual(3);
  expect(after.mutation - before.mutation).toBeLessThanOrEqual(3);
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  await page.getByRole("button", { name: "Về Việt Nam", exact: true }).click();
  await expect(page.locator(".home-event-marker").first()).toBeVisible();
});
