import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import sharp from "sharp";
import { viewToCameraPose } from "@/lib/explorer/cinematic/camera";
import { surfaceLayerRadii } from "@/lib/explorer/cinematic/projection";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import type { MapFootprint } from "@/lib/explorer/types";
import AxeBuilder from "@axe-core/playwright";
import { inspectScene, pixelDifference, syntheticProvinceFixture } from "./refinement-evidence";

// Public desktop read-only coverage. Coincident data is injected into this browser's
// serialized HTML only; production records, identities and coordinates are never written.
const output = path.resolve("output/playwright/refinement/task-02");
const sizes = [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
const hanoi = ["tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi", "tuyen-ngon-doc-lap", "dai-hoi-dang-lan-thu-vi"];
const south = ["nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc", "tong-tien-cong-va-noi-day-tet-mau-than-1968", "chien-dich-ho-chi-minh"];
const view = (page: Page) => new URL(page.url()).searchParams.get("ban-do")?.split(",").map(Number);
const group = (page: Page, slug: string) => page.locator(`.home-event-marker.is-cluster[data-event-slugs*="${slug}"]`);
const popup = (page: Page) => page.getByRole("region", { name: "Các sự kiện tại khu vực", exact: true });
const task09Output = path.resolve("output/playwright/explorer-refinement/task-09");
test.use({ reducedMotion: "reduce" });
test.beforeAll(() => { mkdirSync(output, { recursive: true }); mkdirSync(task09Output, { recursive: true }); });

async function ready(page: Page, href: string) {
  await page.goto(href);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
}

async function assertTargets(page: Page) {
  const result = await page.locator(".home-event-marker").evaluateAll(elements => {
    const boxes = elements.map(element => ({ element, rect: element.getBoundingClientRect() }));
    return boxes.map(({ element, rect }) => ({ width: rect.width, height: rect.height,
      hit: document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest("button") === element,
      overlaps: boxes.filter(other => other.element !== element && rect.left < other.rect.right && rect.right > other.rect.left
        && rect.top < other.rect.bottom && rect.bottom > other.rect.top).length }));
  });
  expect(result.length).toBeGreaterThan(0);
  for (const item of result) { expect(item.width).toBeGreaterThanOrEqual(32); expect(item.height).toBeGreaterThanOrEqual(32); expect(item.hit).toBe(true); expect(item.overlaps).toBe(0); }
}

async function sceneEvidence(page: Page, points: { lat: number; lng: number }[]) {
  return page.locator("canvas").evaluate((element, points) => {
    // Inspect the real mounted runtime, without adding production debug globals.
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find(key => key.startsWith("__reactFiber"))!;
    let fiber = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: CinematicScene } | null;
        if (typeof value?.scene?.projectGeo === "function") return { view: value.scene.getView(),
          points: points.map(point => value.scene!.projectGeo(point.lat, point.lng)), stats: value.scene.stats() };
      }
      fiber = fiber.return!;
    }
    throw new Error("Mounted cinematic runtime not found");
  }, points);
}

test("plus, wheel, keyboard and cap move the real camera beyond imagery advice", async ({ page }) => {
  await ready(page, "/?ban-do=21.03,105.84,5.4");
  await page.getByRole("button", { name: "Phóng to bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBe(6.4);
  await page.mouse.move(740, 450); await page.mouse.wheel(0, -500);
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(6.4);
  const beforeKey = view(page)![2];
  await page.locator("canvas").focus(); await page.keyboard.press("+");
  await expect.poll(() => view(page)?.[2]).toBeGreaterThan(beforeKey);
  for (let i = 0; i < 8; i++) await page.getByRole("button", { name: "Phóng to bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBe(11);
  await page.mouse.wheel(0, -1000); await page.locator("canvas").focus(); await page.keyboard.press("+");
  await expect.poll(() => view(page)?.[2]).toBe(11);
  expect((await sceneEvidence(page, [])).view.zoom).toBe(11);
  await page.getByRole("button", { name: "Thu nhỏ bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBe(10);
});

for (const size of sizes) test(`real Hanoi and southern anchors fit, separate and expand at ${size.width}x${size.height}`, async ({ page }) => {
  await page.setViewportSize(size);
  const evidence = [];
  for (const [name, members, centre] of [["hanoi", hanoi, "21.03,105.84"], ["south", south, "10.77,106.7"]] as const) {
    await ready(page, `/?ban-do=${centre},5.4`);
    const cluster = group(page, members[0]);
    await cluster.click();
    await popup(page).getByRole("button", { name: "Phóng to khu vực", exact: true }).click();
    await expect.poll(() => view(page)?.[2]).toBe(11);
    await expect(popup(page)).toHaveCount(0);
    for (const slug of members) await expect(page.locator(`.home-event-marker[data-event-slugs*="${slug}"]`).first()).toBeInViewport();
    if (name === "hanoi") expect(await page.locator(".home-event-marker:not(.is-cluster)").count()).toBeGreaterThan(0);
    await assertTargets(page);
    // A vanished cluster gives keyboard focus to a surviving member, never body.
    await expect(page.locator(".home-event-marker:focus")).toHaveCount(1);
    const residual = page.locator(".home-event-marker.is-cluster").first();
    if (await residual.count()) {
      await residual.click();
      await expect(page.locator(".globe-expanded-marker").first()).toBeVisible();
      await expect(popup(page)).toContainText("đường nối chỉ về vị trí gốc");
      const expanded = page.locator(".globe-expanded-marker");
      expect(await expanded.count()).toBeGreaterThan(1);
      expect(await page.locator(".globe-cluster-leaders line").count()).toBe(await expanded.count());
      const origins = await page.locator(".globe-cluster-leaders line").evaluateAll(elements => elements.map(element => `${element.getAttribute("x1")},${element.getAttribute("y1")}`));
      expect(new Set(origins).size).toBeGreaterThan(1); // Real distinct source positions remain distinct.
      await assertTargets(page);
      await page.screenshot({ path: path.join(output, `after-${name}-expanded-${size.width}x${size.height}.png`), scale: "css" });
      await expanded.first().focus(); await page.keyboard.press("Escape");
      await expect(expanded).toHaveCount(0); await expect(residual).toBeFocused();
    }
    await page.screenshot({ path: path.join(output, `after-${name}-${size.width}x${size.height}.png`), scale: "css" });
    evidence.push({ name, camera: view(page), markers: await page.locator(".home-event-marker").evaluateAll(elements => elements.map(element => ({ slugs: element.getAttribute("data-event-slugs"), rect: element.getBoundingClientRect().toJSON() }))) });
  }
  writeFileSync(path.join(output, `separation-${size.width}x${size.height}.json`), JSON.stringify(evidence, null, 2));
});

test("coincident fixtures expand deterministically and retain keyboard/card/detail focus and URL context", async ({ page }) => {
  await page.route("**/?*coincident-fixture=1*", async route => {
    const response = await route.fetch();
    let html = await response.text();
    for (const [lat, lng] of [[21.0245, 105.8578], [21.0369, 105.8342]]) {
      const original = `latitude\\\":${lat},\\\"longitude\\\":${lng}`;
      expect(html).toContain(original);
      html = html.replaceAll(original, 'latitude\\\":21.0285,\\\"longitude\\\":105.8542');
    }
    await route.fulfill({ response, body: html });
  });
  await ready(page, "/?coincident-fixture=1&ban-do=21.0285,105.8542,11");
  const cluster = group(page, hanoi[0]);
  await cluster.click();
  const expanded = page.locator(".globe-expanded-marker");
  await expect(expanded).toHaveCount(3);
  const closeTarget = await popup(page).getByRole("button", { name: "Đóng nhóm sự kiện", exact: true }).boundingBox();
  expect(closeTarget!.width).toBeGreaterThanOrEqual(32);
  expect(closeTarget!.height).toBeGreaterThanOrEqual(32);
  const positions = () => expanded.evaluateAll(elements => elements.map(element => ({ key: element.getAttribute("data-anchor-keys"), x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y })));
  const first = await positions();
  await assertTargets(page);
  const leaders = await page.locator(".globe-cluster-leaders line").evaluateAll(elements => elements.map(element => [element.getAttribute("x1"), element.getAttribute("y1")]));
  expect(new Set(leaders.map(point => point.join(","))).size).toBe(1);
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(accessibility.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }))).toEqual([]);
  await page.screenshot({ path: path.join(output, "coincident-expanded.png"), scale: "css" });
  await expanded.first().press("Escape"); await expect(cluster).toBeFocused();
  await cluster.press("Enter"); await expect(expanded).toHaveCount(3);
  expect(await positions()).toEqual(first);
  const chosen = expanded.first(); const slug = await chosen.getAttribute("data-event-slugs");
  await chosen.focus(); await chosen.press("Enter");
  await expect(page.locator("#map-event-heading")).toBeFocused();
  await expect.poll(() => view(page)?.[2]).toBe(11);
  await page.keyboard.press("Escape"); await expect(chosen).toBeFocused();
  await chosen.press("Enter"); await expect(page.locator("#map-event-heading")).toBeFocused();
  const saved = view(page);
  await page.getByTestId("map-event-detail").click();
  await expect(page).toHaveURL(new RegExp(`/su-kien/${slug}`));
  await page.getByRole("link", { name: /Trở lại bản đồ/ }).click();
  await expect(page.locator("#map-event-heading")).toBeFocused();
  expect(view(page)).toEqual(saved);
});

test("legacy 18 restores untouched, zooms out gradually, and reload/history retain local camera", async ({ page }) => {
  await ready(page, "/?ban-do=21.03,105.84,18");
  expect(view(page)?.[2]).toBe(18);
  await page.getByRole("button", { name: "Thu nhỏ bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBe(17);
  await page.getByRole("button", { name: "Phóng to bản đồ", exact: true }).click();
  await expect.poll(() => view(page)?.[2]).toBe(17);
  await page.reload(); await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  expect(view(page)?.[2]).toBe(17);
  await page.evaluate(() => { history.pushState(null, "", "/?tu=1945&den=1945&ban-do=21.03,105.84,10"); dispatchEvent(new PopStateEvent("popstate")); });
  await expect(page.locator("#explorer-year-from")).toHaveValue("1945");
  await expect.poll(() => view(page)?.[2]).toBe(10);
  await page.goBack(); await expect.poll(() => view(page)?.[2]).toBe(17);
  await page.goForward(); await expect.poll(() => view(page)?.[2]).toBe(10);
});

test("a visible secondary location keeps local scale, selection, precision and focus", async ({ page }) => {
  await ready(page, "/?ban-do=16.4637,107.5909,10");
  const marker = page.locator(`.home-event-marker[data-event-slugs="${south[1]}"]`);
  await expect(marker).toHaveAttribute("data-approximate", "true");
  const saved = view(page);
  await marker.click();
  await expect(page.locator("#map-event-heading")).toBeFocused();
  await expect.poll(() => view(page)).toEqual(saved);
  await page.keyboard.press("Escape"); await expect(marker).toBeFocused();
});

test("two coincident locations of one event retain separate anchor keys and selectable expansion", async ({ page }) => {
  await page.route("**/?*multi-location-fixture=1*", async route => {
    const response = await route.fetch();
    const html = await response.text();
    const original = 'latitude\\\":16.4637,\\\"longitude\\\":107.5909';
    expect(html).toContain(original);
    await route.fulfill({ response, body: html.replaceAll(original, 'latitude\\\":10.7769,\\\"longitude\\\":106.7009') });
  });
  await ready(page, "/?multi-location-fixture=1&tu=1968&den=1968&ban-do=10.7769,106.7009,11");
  const cluster = group(page, south[1]);
  await expect(cluster).toBeVisible();
  await cluster.click();
  const expanded = page.locator(".globe-expanded-marker");
  await expect(expanded).toHaveCount(2);
  const keys = await expanded.evaluateAll(elements => elements.map(element => element.getAttribute("data-anchor-keys")));
  expect(new Set(keys).size).toBe(2);
  for (const marker of await expanded.all()) await expect(marker).toHaveAttribute("data-event-slugs", south[1]);
  await assertTargets(page);
  await expanded.first().click(); await expect(page.locator("#map-event-heading")).toBeFocused();
  expect(view(page)?.[2]).toBe(11);
  await page.keyboard.press("Escape"); await expect(expanded.first()).toBeFocused();
});

test("history restoration cancels an in-flight cluster fit and its pending focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await ready(page, "/?ban-do=21.03,105.84,5.4");
  await group(page, hanoi[0]).click();
  await popup(page).getByRole("button", { name: "Phóng to khu vực", exact: true }).click();
  await page.evaluate(() => { history.pushState(null, "", "/?tu=1945&den=1945&ban-do=21.03,105.84,8"); dispatchEvent(new PopStateEvent("popstate")); });
  await expect(page.locator("#explorer-year-from")).toHaveValue("1945");
  await expect.poll(() => view(page)?.[2]).toBe(8);
  const before = await sceneEvidence(page, []);
  await page.waitForTimeout(800);
  const after = await sceneEvidence(page, []);
  expect(after.view).toEqual(before.view);
  expect(after.view.zoom).toBe(8);
  await expect(page.locator(".globe-expanded-marker")).toHaveCount(0);
  await expect(page.locator(".home-event-marker:focus")).toHaveCount(0);
});

for (const zoom of [8, 10, 11]) test(`source cap, gold outline and HTML/Three projection align at zoom ${zoom}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const footprint = JSON.parse(readFileSync("public/maps/vietnam-tabletop.geojson", "utf8")) as MapFootprint;
  const points = footprint.features.flatMap(feature => feature.geometry.type === "Polygon" ? feature.geometry.coordinates.flat() : feature.geometry.coordinates.flat(2));
  const edge = [...points].sort((a, b) => Math.hypot(a[0] - 105, a[1] - 21.5) - Math.hypot(b[0] - 105, b[1] - 21.5))[0];
  const offset = 100 / (512 * 2 ** zoom / 360);
  await ready(page, `/?tu=1912&den=1912&ban-do=${edge[1]},${edge[0] - offset},${zoom}`);
  const evidence = await sceneEvidence(page, [{ lat: edge[1], lng: edge[0] }]);
  const canvas = page.locator("canvas");
  const png = await canvas.screenshot({ scale: "css" });
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const projected = evidence.points[0];
  expect(projected.behind).toBe(false);
  const gold = [];
  for (let x = Math.floor(projected.x) - 3; x <= Math.ceil(projected.x) + 3; x++)
    for (let y = Math.floor(projected.y) - 3; y <= Math.ceil(projected.y) + 3; y++) {
      const index = (y * info.width + x) * info.channels;
      const [r, g, b] = [data[index], data[index + 1], data[index + 2]];
      if (r > 180 && g > 140 && r > g * 1.1 && g > b * 1.2) gold.push(Math.hypot(x - projected.x, y - projected.y));
    }
  expect(gold.length, "real gold outline pixels near Three's unit-sphere projection").toBeGreaterThan(0);
  expect(Math.min(...gold)).toBeLessThan(2.5);
  const pose = viewToCameraPose(evidence.view, { width: 1440, height: 900 });
  writeFileSync(path.join(output, `depth-z${zoom}.json`), JSON.stringify({ ...evidence, near: pose.near, distance: pose.distanceToTarget,
    radii: surfaceLayerRadii(pose.distanceToTarget), outlineErrorPx: Math.min(...gold) }, null, 2));
  await page.screenshot({ path: path.join(output, `after-boundary-z${zoom}.png`), scale: "css" });
});

for (const zoom of [8, 10, 11]) test(`published Hanoi HTML anchors match the real Three camera at zoom ${zoom}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, `/?ban-do=21.03,105.84,${zoom}`);
  // Reused published inventory from the review; these are not new location claims.
  const coordinates = [{ lat: 21.0245, lng: 105.8578 }, { lat: 21.0369, lng: 105.8342 }, { lat: 21.0285, lng: 105.8542 }];
  const evidence = await sceneEvidence(page, coordinates);
  const markers = await page.locator(".home-event-marker").evaluateAll(elements => elements.map(element => ({ slugs: element.getAttribute("data-event-slugs")!.split("|"),
    x: element.getBoundingClientRect().x + 16, y: element.getBoundingClientRect().y + 16 })));
  expect(markers.length).toBeGreaterThan(0);
  for (const marker of markers) {
    const projected = marker.slugs.map(slug => evidence.points[hanoi.indexOf(slug)]);
    const x = projected.reduce((sum, point) => sum + point.x, 0) / projected.length;
    const y = projected.reduce((sum, point) => sum + point.y, 0) / projected.length;
    expect(Math.hypot(marker.x - x, marker.y - y)).toBeLessThan(0.5);
  }
  await assertTargets(page);
  await page.screenshot({ path: path.join(output, `after-hanoi-z${zoom}.png`), scale: "css" });
});

test("a far-side Vietnam cap remains occluded instead of painting the near hemisphere", async ({ page }) => {
  await ready(page, "/?tu=1912&den=1912&ban-do=-21.03,-74.16,8");
  const screenshot = await page.locator("canvas").screenshot({ scale: "css" });
  const { data, info } = await sharp(screenshot).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const x = Math.floor(info.width * 0.455); const y = Math.floor(info.height * 0.405);
  const at = (y * info.width + x) * info.channels;
  expect(data[at + 1], "near-side ocean should not carry the warm Vietnam cap").toBeGreaterThan(data[at]);
  await page.screenshot({ path: path.join(output, "far-side-cap-occlusion.png"), scale: "css" });
});

for (const zoom of [8, 10, 11]) test(`Task 09 synthetic province fixture pixels survive the cap at zoom ${zoom} and remain passive`, async ({ page }) => {
  const fixture = syntheticProvinceFixture();
  await page.route("**/maps/history-vietnam-province-boundaries.geojson", route => route.fulfill({ json: fixture }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page, `/?ban-do=21.03,105.84,${zoom}`);
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "ready");
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const withProvince = await canvas.screenshot({ path: path.join(task09Output, `synthetic-province-z${zoom}.png`), scale: "css" });
  const withStats = await inspectScene(page);
  await inspectScene(page, { type: "clear-province" });
  const withoutProvince = await canvas.screenshot({ path: path.join(task09Output, `synthetic-province-cleared-z${zoom}.png`), scale: "css" });
  const pixels = await pixelDifference(withProvince, withoutProvince);
  writeFileSync(path.join(task09Output, `synthetic-province-z${zoom}.json`), JSON.stringify({ fixtureOnly: true, zoom, pixels, withStats,
    cleared: await inspectScene(page) }, null, 2));
  expect(pixels, "actual province stroke pixels above the Vietnam cap, not a fetch/status count").toBeGreaterThan(20);
  await inspectScene(page, { type: "province", data: fixture });
  await assertTargets(page);
  const marker = page.locator(".home-event-marker").first();
  await marker.focus(); await marker.press("Enter");
  await expect(page.getByTestId("map-event-card").or(popup(page))).toBeVisible();
});

test("Task 09 synthetic province far-side pixels are occluded and context retry restores only the new optional layer", async ({ page }) => {
  const fixture = syntheticProvinceFixture();
  let failed = true;
  await page.route("**/maps/history-vietnam-province-boundaries.geojson", route => failed
    ? route.fulfill({ status: 503, body: "optional asset deliberately unavailable" }) : route.fulfill({ json: fixture }));
  await ready(page, "/?ban-do=21.03,105.84,10");
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "unavailable");
  failed = false;
  await page.locator("canvas.cinematic-globe-canvas").evaluate(element => (element as HTMLCanvasElement).getContext("webgl2")!
    .getExtension("WEBGL_lose_context")!.loseContext());
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "ready");
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  await inspectScene(page, { type: "view", view: { lat: -21.03, lng: -74.16, zoom: 10 } });
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const far = await canvas.screenshot({ path: path.join(task09Output, "synthetic-province-far-side.png") });
  await inspectScene(page, { type: "clear-province" });
  expect(await pixelDifference(far, await canvas.screenshot())).toBe(0);
});

test("Task 09 synthetic province projection overrun falls back without an unhandled error and can retry", async ({ page }) => {
  const fixture = syntheticProvinceFixture();
  const tooDense = structuredClone(fixture);
  // The envelope has <50k edges but spherical subdivision would exceed 50k.
  // All edges are distinct; this specifically exercises the renderer's budget rejection.
  tooDense.features[0].geometry = { type: "LineString", coordinates: Array.from({ length: 25_002 }, (_, i) => [105.84 + i / 1_000_000, 21.03 + (i % 2) * 0.4] as [number, number]) };
  let overrun = true;
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.route("**/maps/history-vietnam-province-boundaries.geojson", route => route.fulfill({ json: overrun ? tooDense : fixture }));
  await ready(page, "/?ban-do=21.03,105.84,8");
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "unavailable");
  expect(errors).toEqual([]);
  await assertTargets(page);
  await page.screenshot({ path: path.join(task09Output, "province-overrun-safe-fallback.png"), scale: "css" });
  overrun = false;
  await page.locator("canvas.cinematic-globe-canvas").evaluate(element => (element as HTMLCanvasElement).getContext("webgl2")!
    .getExtension("WEBGL_lose_context")!.loseContext());
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "ready");
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
  await page.screenshot({ path: path.join(task09Output, "province-overrun-retry.png"), scale: "css" });
});
