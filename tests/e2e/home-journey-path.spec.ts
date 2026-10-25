import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import sharp from "sharp";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import type { JourneyPathRequest } from "@/lib/explorer/cinematic/journey-path";
import { HISTORY_JOURNEY, type JourneyArrival } from "@/lib/explorer/journey";
import type { MapView } from "@/lib/explorer/map-view";

const output = path.resolve("output/playwright/refinement/task-04");
test.use({ reducedMotion: "reduce" });
test.beforeAll(() => mkdirSync(output, { recursive: true }));

async function ready(page: Page) {
  await page.goto("/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-country-boundaries", "ready");
  await expect(page.getByTestId("journey-panel")).toContainText("Tiếng nói tại Pháp");
}

// Find the actual mounted scene. No debug globals or test-only production methods.
type Action = { type: "view"; view: MapView } | { type: "clear" | "stats" | "cancel" | "capture-start" | "capture-end" | "dispose" }
  | { type: "path"; request: JourneyPathRequest } | { type: "visible"; visible: boolean }
  | { type: "flight"; view: MapView; duration: number; arrival: JourneyArrival };
async function sceneAction(page: Page, action: Action) {
  return page.locator("canvas.cinematic-globe-canvas").evaluate(async (element, action) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find(key => key.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    let scene: CinematicScene | undefined;
    while (fiber && !scene) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: CinematicScene } | null;
        if (typeof value?.scene?.projectGeo === "function") { scene = value.scene; break; }
      }
      fiber = fiber.return;
    }
    if (!scene) throw new Error("Mounted cinematic scene not found");
    if (action.type === "view") scene.setView(action.view);
    // On the pre-fix renderer this intentionally leaves the canvas unchanged.
    if (action.type === "clear" && "setJourneyPath" in scene)
      (scene as CinematicScene & { setJourneyPath(request: null): void }).setJourneyPath(null);
    if (action.type === "path") scene.setJourneyPath(action.request);
    if (action.type === "flight") void scene.flyTo(action.view, action.duration, action.arrival);
    if (action.type === "cancel") scene.cancelFlight();
    if (action.type === "visible") scene.setVisible(action.visible);
    if (action.type === "capture-start") scene.beginFrameCapture();
    const capture = action.type === "capture-end" ? scene.endFrameCapture() : undefined;
    const stats = scene.stats();
    if (action.type === "dispose") scene.dispose();
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return { stats: action.type === "dispose" ? stats : scene.stats(), capture };
  }, action);
}

async function changedPixels(a: Buffer, b: Buffer) {
  const first = await sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const second = await sharp(b).removeAlpha().raw().toBuffer();
  let pixels = 0;
  for (let i = 0; i < second.length; i += 3) {
    if (Math.max(...[0, 1, 2].map(c => Math.abs(first.data[i + c] - second[i + c]))) > 35) pixels++;
  }
  return pixels;
}

async function strokeCoreContrast(a: Buffer, b: Buffer) {
  const first = await sharp(a).removeAlpha().raw().toBuffer();
  const second = await sharp(b).removeAlpha().raw().toBuffer();
  const luminance = (buffer: Buffer, i: number) => [0.2126, 0.7152, 0.0722].reduce((sum, weight, c) => {
    const value = buffer[i + c] / 255;
    return sum + weight * (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  }, 0);
  const ratios: number[] = [];
  for (let i = 0; i < first.length; i += 3) {
    if (Math.max(...[0, 1, 2].map(c => Math.abs(first[i + c] - second[i + c]))) <= 35) continue;
    ratios.push((luminance(first, i) + 0.05) / (luminance(second, i) + 0.05));
  }
  ratios.sort((a, b) => a - b);
  // Ignore the partially covered antialiased edge; measure the rendered stroke core.
  return ratios[Math.floor(ratios.length * 0.95)] ?? 0;
}

test("shared multi-stop journey draws real path pixels on the current Earth", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await sceneAction(page, { type: "view", view: { lat: 40, lng: 45, zoom: 2.1 } });
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const withPath = await canvas.screenshot({ path: path.join(output, "shared-route.png") });
  const routeStats = (await sceneAction(page, { type: "stats" })).stats;
  await sceneAction(page, { type: "clear" });
  const withoutPath = await canvas.screenshot({ path: path.join(output, "shared-route-cleared.png") });
  const clearStats = (await sceneAction(page, { type: "stats" })).stats;
  const pixels = await changedPixels(withPath, withoutPath);
  writeFileSync(path.join(output, "shared-route-comparison.json"), JSON.stringify({ changedPixels: pixels, routeStats, clearStats }, null, 2));
  expect(pixels, "authored multi-stop connections must change real canvas pixels").toBeGreaterThan(150);
  expect(routeStats.drawCalls - clearStats.drawCalls).toBe(1);
  expect(routeStats.geometries - clearStats.geometries).toBe(1);
  expect(routeStats.textures).toBe(clearStats.textures);
});

function synthetic(points: [number, number][], nonce: number, id = "render-fixture"): JourneyPathRequest {
  const journey = { ...HISTORY_JOURNEY, id, stops: points.map(([lat, lng], index) => ({
    ...HISTORY_JOURNEY.stops[0], id: `same-${index}`, view: { lat, lng, zoom: 3 },
  })) };
  return { journey, journeyId: id, stopId: journey.stops.at(-1)!.id, nonce };
}
const pathState = async (page: Page) => (await sceneAction(page, { type: "stats" })).stats.journeyPath!;

test("finite current-leg reveal changes actual pixels while completed segments remain static", async ({ page }) => {
  await ready(page);
  const view = { lat: 0, lng: 0, zoom: 2.1 };
  const request = synthetic([[0, -35], [15, -15], [0, 25]], 100);
  await sceneAction(page, { type: "view", view });
  await sceneAction(page, { type: "path", request });
  await sceneAction(page, { type: "flight", view, duration: 3000, arrival: request });
  await expect.poll(async () => (await pathState(page)).reveal).toBeGreaterThan(1.08);
  const earlyState = await pathState(page);
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const early = await canvas.screenshot({ path: path.join(output, "progress-early.png") });
  await expect.poll(async () => (await pathState(page)).active).toBe(false);
  const full = await canvas.screenshot({ path: path.join(output, "progress-arrived.png") });
  expect((await pathState(page)).reveal).toBe(2);
  await sceneAction(page, { type: "clear" });
  const none = await canvas.screenshot({ path: path.join(output, "progress-cleared.png") });
  const earlyPixels = await changedPixels(early, none), fullPixels = await changedPixels(full, none);
  const revealPixels = await changedPixels(early, full);
  expect(earlyPixels).toBeGreaterThan(100);
  expect(revealPixels).toBeGreaterThan(100);
  expect(fullPixels).toBeGreaterThan(earlyPixels + 100);
  writeFileSync(path.join(output, "finite-progress.json"), JSON.stringify({ earlyState, earlyPixels, fullPixels, revealPixels }, null, 2));
});

test("sphere seam and far-side occlusion are proved by real canvas comparisons", async ({ page }) => {
  await ready(page);
  const request = synthetic([[5, 170], [5, -170]], 100);
  await sceneAction(page, { type: "view", view: { lat: 5, lng: 180, zoom: 2.1 } });
  await sceneAction(page, { type: "path", request });
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const near = await canvas.screenshot({ path: path.join(output, "seam-near.png") });
  await sceneAction(page, { type: "clear" });
  const nearNone = await canvas.screenshot();
  const nearPixels = await changedPixels(near, nearNone);
  expect(nearPixels).toBeGreaterThan(100);
  await sceneAction(page, { type: "view", view: { lat: -5, lng: 0, zoom: 2.1 } });
  await sceneAction(page, { type: "path", request: { ...request, nonce: 101 } });
  const far = await canvas.screenshot({ path: path.join(output, "seam-far-occluded.png") });
  await sceneAction(page, { type: "clear" });
  const farNone = await canvas.screenshot();
  const farPixels = await changedPixels(far, farNone);
  expect(farPixels).toBe(0);
  writeFileSync(path.join(output, "seam-occlusion.json"), JSON.stringify({ nearPixels, farPixels }, null, 2));
});

test("switch, clear, hidden and disposal reject obsolete paths without continuing draws", async ({ page }) => {
  await ready(page);
  const view = { lat: 0, lng: 0, zoom: 2.1 };
  const a = synthetic([[0, -30], [0, 30]], 100, "render-a");
  const b = synthetic([[-20, 0], [20, 0]], 101, "render-b");
  await sceneAction(page, { type: "view", view });
  await sceneAction(page, { type: "path", request: a });
  await sceneAction(page, { type: "flight", view, duration: 1000, arrival: a });
  await sceneAction(page, { type: "path", request: b });
  await sceneAction(page, { type: "flight", view, duration: 600, arrival: b });
  await sceneAction(page, { type: "path", request: a });
  await expect.poll(async () => (await pathState(page)).active).toBe(false);
  expect((await pathState(page)).request).toMatchObject({ journeyId: b.journeyId, nonce: 101 });
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const switched = await canvas.screenshot();
  await sceneAction(page, { type: "clear" });
  await sceneAction(page, { type: "path", request: { ...b, nonce: 102 } });
  const clean = await canvas.screenshot();
  expect(await changedPixels(switched, clean)).toBe(0);
  await sceneAction(page, { type: "flight", view, duration: 2000, arrival: { ...b, nonce: 102 } });
  await sceneAction(page, { type: "visible", visible: false });
  await sceneAction(page, { type: "capture-start" });
  await page.waitForTimeout(250);
  const hidden = await sceneAction(page, { type: "capture-end" });
  expect(hidden.capture!.renderMs).toHaveLength(0);
  await sceneAction(page, { type: "clear" });
  await sceneAction(page, { type: "path", request: { ...a, nonce: 103 } });
  await sceneAction(page, { type: "path", request: { ...b, nonce: 102 } });
  await sceneAction(page, { type: "visible", visible: true });
  expect((await pathState(page)).request?.journeyId).toBe(a.journeyId);
  await sceneAction(page, { type: "clear" });
  await sceneAction(page, { type: "path", request: { ...a, nonce: 103 } });
  expect((await pathState(page)).segments).toBe(0);
  await sceneAction(page, { type: "capture-start" });
  await page.waitForTimeout(250);
  const idle = await sceneAction(page, { type: "capture-end" });
  expect(idle.capture!.renderMs).toHaveLength(0);
  await sceneAction(page, { type: "dispose" });
  await sceneAction(page, { type: "path", request: { ...b, nonce: 104 } });
  expect((await pathState(page)).segments).toBe(0);
  writeFileSync(path.join(output, "lifecycle.json"), JSON.stringify({ hiddenDraws: hidden.capture!.renderMs.length,
    idleDraws: idle.capture!.renderMs.length, switchedPixelsVsClean: 0 }, null, 2));
});

test("manual dragging retains a static authored route without adding a historical point", async ({ page }) => {
  await ready(page);
  const before = await pathState(page);
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  await canvas.focus(); await page.keyboard.press("ArrowRight");
  const after = await pathState(page);
  expect(after.request?.journeyId).toBe(before.request?.journeyId);
  expect(after.request?.stopId).toBe(before.request?.stopId);
  expect(after.segments).toBe(before.segments);
  expect(after.active).toBe(false);
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.width * 0.5, box.height * 0.5);
  await page.mouse.down(); await page.mouse.move(box.width * 0.5 + 70, box.height * 0.5 + 20, { steps: 5 });
  await page.mouse.up();
  expect((await pathState(page)).segments).toBe(before.segments);
  expect((await pathState(page)).active).toBe(false);
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  expect((await pathState(page)).segments).toBe(0);
});

test("a real route batch does not intercept published event marker hit targets", async ({ page }) => {
  await page.goto("/?tu=1954&den=1954");
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await sceneAction(page, { type: "path", request: { journey: HISTORY_JOURNEY,
    journeyId: HISTORY_JOURNEY.id, stopId: "paris-1919", nonce: 100 } });
  expect((await pathState(page)).segments).toBeGreaterThan(0);
  const marker = page.locator('.home-event-marker[title="Chiến dịch Điện Biên Phủ"]');
  await expect(marker).toBeVisible();
  expect(await marker.evaluate(element => {
    const r = element.getBoundingClientRect();
    return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest("button") === element;
  })).toBe(true);
  await marker.click();
  await expect(page.getByTestId("map-event-card")).toBeVisible();
  await sceneAction(page, { type: "clear" });
});

test("path remains above the Vietnam surface at local zoom 8, 10 and 11", async ({ page }) => {
  await ready(page);
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const evidence = [];
  for (const [i, zoom] of [8, 10, 11].entries()) {
    const request = synthetic([[21.01, 105.80], [21.05, 105.90]], 100 + i);
    await sceneAction(page, { type: "view", view: { lat: 21.03, lng: 105.85, zoom } });
    await sceneAction(page, { type: "path", request });
    const withPath = await canvas.screenshot({ path: path.join(output, `local-route-z${zoom}.png`) });
    await sceneAction(page, { type: "clear" });
    const noPath = await canvas.screenshot();
    const pixels = await changedPixels(withPath, noPath);
    const coreContrast = await strokeCoreContrast(withPath, noPath);
    expect(pixels, `actual route at zoom ${zoom}`).toBeGreaterThan(40);
    expect(coreContrast, `route core against the composited Vietnam cap at zoom ${zoom}`).toBeGreaterThanOrEqual(3);
    evidence.push({ zoom, changedPixels: pixels, coreContrast });
  }
  writeFileSync(path.join(output, "local-depth.json"), JSON.stringify(evidence, null, 2));
});

test("context-loss retry restores the selected static route after manual input cancelled its flight request", async ({ page }) => {
  await ready(page);
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  await canvas.focus(); await page.keyboard.press("ArrowRight");
  const before = await pathState(page);
  await canvas.evaluate(element => (element as HTMLCanvasElement).getContext("webgl2")!
    .getExtension("WEBGL_lose_context")!.loseContext());
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  const after = await pathState(page);
  expect(after.segments).toBe(before.segments);
  expect(after.request?.journeyId).toBe(before.request?.journeyId);
  expect(after.request?.stopId).toBe(before.request?.stopId);
  expect(after.active).toBe(false);
  await expect(canvas).toHaveCount(1);
  await sceneAction(page, { type: "view", view: { lat: 40, lng: 45, zoom: 2.1 } });
  const restored = await canvas.screenshot({ path: path.join(output, "retry-restored-route.png") });
  await sceneAction(page, { type: "clear" });
  const cleared = await canvas.screenshot();
  const pixels = await changedPixels(restored, cleared);
  expect(pixels).toBeGreaterThan(150);
  writeFileSync(path.join(output, "retry-render.json"), JSON.stringify({ changedPixels: pixels }, null, 2));
});

test("a held outgoing detail navigation cannot reattach the cleared selected route", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/su-kien/**", async route => { await held; await route.continue(); });
  await ready(page);
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Pác Bó/ }).click();
  expect((await pathState(page)).segments).toBeGreaterThan(0);
  const detail = page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ });
  try {
    await expect(detail).toBeVisible();
    await detail.click();
    await expect.poll(async () => (await pathState(page)).request).toBeNull();
    await sceneAction(page, { type: "capture-start" });
    await page.waitForTimeout(350);
    expect((await sceneAction(page, { type: "capture-end" })).capture!.renderMs).toHaveLength(0);
  } finally { release(); }
  await expect(page).toHaveURL(/\/su-kien\//);
});

test("history restoration followed by retry during held departure cannot restore a departed route", async ({ page }) => {
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/su-kien/**", async route => { await held; await route.continue(); });
  await ready(page);
  await page.evaluate(() => {
    history.pushState(null, "", "/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect.poll(async () => (await pathState(page)).request?.nonce ?? -1).toBeGreaterThan(0);
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Pác Bó/ }).click();
  try {
    await page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ }).click();
    await expect.poll(async () => (await pathState(page)).request).toBeNull();
    await page.locator("canvas.cinematic-globe-canvas").evaluate(element => (element as HTMLCanvasElement)
      .getContext("webgl2")!.getExtension("WEBGL_lose_context")!.loseContext());
    await expect(page.getByTestId("globe-error")).toBeVisible();
    await page.getByRole("button", { name: "Thử lại", exact: true }).click();
    await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
    expect((await pathState(page)).request).toBeNull();
  } finally { release(); }
  await expect(page).toHaveURL(/\/su-kien\//);
});

test("real seeking, hidden resume, motion change, history and exit retain only the current route", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page);
  const timeline = page.getByTestId("journey-timeline");
  await timeline.getByRole("link", { name: /Pác Bó/ }).click();
  await expect.poll(async () => (await pathState(page)).active).toBe(true);
  const first = (await pathState(page)).request!;
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await timeline.getByRole("link", { name: /London/ }).click();
  const hidden = await pathState(page);
  expect(hidden.request?.stopId).toBe("london-1913");
  expect(hidden.request!.nonce).toBeGreaterThan(first.nonce);
  expect(hidden.active).toBe(false);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect.poll(async () => (await pathState(page)).reveal).toBe(2);
  await timeline.getByRole("link", { name: /Pác Bó/ }).click();
  await expect.poll(async () => (await pathState(page)).active).toBe(true);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(async () => (await pathState(page)).active).toBe(false);
  expect((await pathState(page)).reveal).toBe(6);
  // Seeking replaces the share URL; create a real history entry explicitly.
  await page.evaluate(() => {
    history.pushState(null, "", "/?hanh-trinh=ho-chi-minh-1911-1941&moc=london-1913");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect.poll(async () => (await pathState(page)).request?.stopId).toBe("london-1913");
  await page.getByRole("button", { name: "Thoát hành trình", exact: true }).click();
  expect((await pathState(page)).segments).toBe(0);
  await page.waitForTimeout(500);
  expect((await pathState(page)).request).toBeNull();
});

for (const size of [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
  test(`static reduced-motion route remains readable at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await ready(page);
    const state = await pathState(page);
    expect(state.active).toBe(false); expect(state.reveal).toBe(3);
    expect(state.segments).toBeGreaterThan(0);
    await expect(page.getByTestId("journey-timeline")).toContainText("sơ đồ");
    await expect(page.getByRole("button", { name: "Mốc tiếp", exact: true })).toBeInViewport();
    await page.screenshot({ path: path.join(output, `static-${size.width}x${size.height}.png`) });
    await sceneAction(page, { type: "capture-start" });
    await page.waitForTimeout(200);
    expect((await sceneAction(page, { type: "capture-end" })).capture!.renderMs).toHaveLength(0);
  });
}
