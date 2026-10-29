import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import { CLOSEST_USEFUL_EVENT_ZOOM } from "@/lib/explorer/cinematic/camera";
import { MAP_LOCATION_UNAVAILABLE_EXPLANATION } from "@/lib/explorer/map-markers";
import { inspectScene } from "./refinement-evidence";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";

const output = path.resolve("output/playwright/explorer-map-total-journey");
const mapUrl = "/?tu=1954&den=1954&ban-do=15.5,106.4,3.32";

async function ready(page: Page, href = mapUrl) {
  await page.goto(href);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 60_000 });
}

async function openList(page: Page) {
  const list = page.getByTestId("explorer-event-list");
  if ((await list.getAttribute("open")) === null) await list.locator("summary").click();
  return list;
}

function action(page: Page, slug: string) {
  return page.locator(`button[data-event-slug="${slug}"]`);
}

test.use({ reducedMotion: "reduce" });
test.beforeAll(() => mkdirSync(output, { recursive: true }));

test("summary selection cancels an in-flight focus and persists the interrupted view", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const clockStart = Date.now();
  await page.clock.install({ time: clockStart });
  await ready(page, "/?tu=1954&den=1954&ban-do=0,0,3");
  await page.clock.pauseAt(clockStart + 3_600_000);
  // inspectScene waits for animation frames; read the mounted scene directly while paused.
  const readView = () => page.locator("canvas.cinematic-globe-canvas").evaluate(element => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find(key => key.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: CinematicScene } | null;
        if (typeof value?.scene?.projectGeo === "function") return value.scene.getView();
      }
      fiber = fiber.return;
    }
    throw new Error("Mounted cinematic runtime not found");
  });
  await openList(page);
  await action(page, "synthetic-mappable").click();
  await page.clock.runFor(200);
  await openList(page);
  const travelling = await readView();
  expect(Math.abs(travelling.lng - 105.85)).toBeGreaterThan(1);
  expect(travelling.zoom).not.toBe(3);
  await action(page, "synthetic-no-location").click();
  await expect(page.getByTestId("map-location-unavailable")).toBeVisible();
  const interrupted = await readView();
  // Cross the former 900ms completion without relying on the machine's rendering speed.
  await page.clock.runFor(1100);
  const stopped = await readView();
  expect(stopped.lat).toBeCloseTo(interrupted.lat, 3);
  expect(stopped.lng).toBeCloseTo(interrupted.lng, 3);
  expect(stopped.zoom).toBeCloseTo(interrupted.zoom, 3);
  expect(new URL(page.url()).searchParams.get("su-kien")).toBe("synthetic-no-location");
  const saved = new URL(page.url()).searchParams.get("ban-do")!.split(",").map(Number);
  expect(saved[0]).toBeCloseTo(stopped.lat, 3);
  expect(saved[1]).toBeCloseTo(stopped.lng, 3);
  expect(saved[2]).toBeCloseTo(stopped.zoom, 2);
  await page.clock.resume();
  await page.reload();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  const restored = await inspectScene(page);
  expect(restored.view.lat).toBeCloseTo(stopped.lat, 3);
  expect(restored.view.lng).toBeCloseTo(stopped.lng, 3);
  await page.screenshot({ path: path.join(output, `cancelled-event-focus-${info.project.name}.png`), scale: "css" });
});

test("summary-only events explain the gap and eligible events select a real marker", async ({ page }, info) => {
  const pageErrors: string[] = [];
  const httpFailures: { status: number; path: string }[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("response", (response) => {
    if (response.status() < 400) return;
    const url = new URL(response.url());
    httpFailures.push({ status: response.status(), path: url.pathname });
  });
  await ready(page);
  await openList(page);
  for (const slug of ["synthetic-no-location", "synthetic-invalid-coordinates"]) {
    const button = action(page, slug);
    await expect(button).toHaveText("Xem tóm tắt");
    await expect(button).toHaveAttribute("data-map-availability", /no-public-location|invalid-coordinates/);
    await expect(button.locator("xpath=following-sibling::p")).toHaveText(MAP_LOCATION_UNAVAILABLE_EXPLANATION);
  }
  await expect(action(page, "synthetic-mappable")).toHaveText(/Xem vị trí trên bản đồ/);
  await expect(action(page, "synthetic-valid-secondary")).toHaveText(/Xem vị trí trên bản đồ/);

  const summary = action(page, "synthetic-no-location");
  await summary.focus();
  await expect(summary).toBeFocused();
  const before = await inspectScene(page);
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("map-event-card")).toContainText(MAP_LOCATION_UNAVAILABLE_EXPLANATION);
  await expect(page.getByTestId("map-event-card")).not.toContainText("Địa điểm đang được bổ sung");
  await expect(page.getByTestId("map-event-detail")).toHaveAttribute("href", /synthetic-no-location/);
  await expect.poll(() => new URL(page.url()).searchParams.get("su-kien")).toBe("synthetic-no-location");
  const stayed = await inspectScene(page);
  expect(Math.abs(stayed.view.lat - before.view.lat)).toBeLessThan(0.05);
  expect(Math.abs(stayed.view.lng - before.view.lng)).toBeLessThan(0.05);
  expect(Math.abs(stayed.view.zoom - before.view.zoom)).toBeLessThan(0.05);
  await expect(page.locator(".home-event-marker.is-selected")).toHaveCount(0);

  await openList(page);
  await action(page, "synthetic-invalid-coordinates").click();
  await expect.poll(() => new URL(page.url()).searchParams.get("su-kien")).toBe("synthetic-invalid-coordinates");
  const invalidView = await inspectScene(page);
  expect(Math.abs(invalidView.view.lat - before.view.lat)).toBeLessThan(0.05);
  expect(Math.abs(invalidView.view.lng - before.view.lng)).toBeLessThan(0.05);
  await expect(page.getByTestId("map-location-unavailable")).toBeVisible();

  await openList(page);
  await action(page, "synthetic-mappable").click();
  await openList(page);
  await action(page, "synthetic-valid-secondary").click();
  await expect.poll(() => new URL(page.url()).searchParams.get("su-kien")).toBe("synthetic-valid-secondary");
  const selectedMarker = page.locator('.home-event-marker.is-selected[data-event-slugs="synthetic-valid-secondary"]');
  await expect(selectedMarker).toBeVisible();
  const framed = await inspectScene(page);
  const movedToSecondary = Math.abs(framed.view.lat - 16.25) < 0.2 && Math.abs(framed.view.lng - 107.5) < 0.2;
  if (movedToSecondary) expect(framed.view.zoom).toBeCloseTo(CLOSEST_USEFUL_EVENT_ZOOM, 1);
  else {
    expect(framed.view.zoom).toBeGreaterThanOrEqual(CLOSEST_USEFUL_EVENT_ZOOM - 0.05);
    const box = await selectedMarker.boundingBox();
    const viewport = page.viewportSize();
    expect(box && viewport && box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width && box.y + box.height <= viewport.height).toBe(true);
  }

  await inspectScene(page, { type: "view", view: { lat: 10, lng: 106, zoom: 4 } });
  await openList(page);
  await action(page, "synthetic-valid-secondary").click();
  await expect.poll(async () => (await inspectScene(page)).view.lat).toBeCloseTo(16.25, 1);
  const secondary = await inspectScene(page);
  expect(secondary.view.lng).toBeCloseTo(107.5, 1);
  expect(secondary.view.zoom).toBeCloseTo(CLOSEST_USEFUL_EVENT_ZOOM, 1);
  await expect(selectedMarker).toBeVisible();
  await page.screenshot({ path: path.join(output, `map-availability-${info.project.name}.png`), scale: "css" });
  const unexpected = pageErrors.filter((message) => !message.includes("Maximum update depth"));
  expect(unexpected, pageErrors.join("\n")).toEqual([]);
  expect(httpFailures.filter((item) => item.path.includes("/historical_events"))).toEqual([]);
  writeFileSync(path.join(output, `map-availability-console-${info.project.name}.json`), JSON.stringify({ pageErrors, httpFailures }, null, 2));
});

test("WebGL failure and no JavaScript still explain missing locations", async ({ page, browser, baseURL }, info) => {
  test.skip(info.project.name !== "1280x720", "Failure and static reading are viewport-independent controls.");
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (String(kind).includes("webgl")) return null;
      return original.apply(this, [kind, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await page.goto(mapUrl);
  await expect(page.getByTestId("globe-error")).toContainText("Bạn vẫn có thể đọc danh sách sự kiện");
  await openList(page);
  await expect(action(page, "synthetic-no-location")).toHaveText("Xem tóm tắt");
  await action(page, "synthetic-no-location").click();
  await expect(page.getByTestId("map-location-unavailable")).toHaveText(MAP_LOCATION_UNAVAILABLE_EXPLANATION);
  await page.screenshot({ path: path.join(output, "map-availability-no-webgl-1280x720.png"), scale: "css" });

  const context = await browser.newContext({ javaScriptEnabled: false, baseURL, viewport: { width: 1280, height: 720 } });
  const staticPage = await context.newPage();
  try {
    await staticPage.goto(mapUrl);
    await staticPage.getByTestId("explorer-event-list").locator("summary").click();
    await expect(staticPage.locator('button[data-event-slug="synthetic-no-location"]')).toHaveText("Xem tóm tắt");
    await expect(staticPage.locator('button[data-event-slug="synthetic-mappable"]')).toContainText("Xem vị trí trên bản đồ");
    await expect(staticPage.getByText(MAP_LOCATION_UNAVAILABLE_EXPLANATION).first()).toBeVisible();
    await expect(staticPage.locator('a[href*="synthetic-no-location"]')).toBeVisible();
    await staticPage.screenshot({ path: path.join(output, "map-availability-no-js-1280x720.png"), scale: "css" });
  } finally {
    await context.close();
  }
});
