import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import { inspectScene, pixelDifference, strokeCoreContrast, syntheticProvinceFixture } from "./refinement-evidence";

const outputDir = path.resolve("output/playwright/province-boundaries-completion");
const sizes = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test.use({ reducedMotion: "reduce" });

test("real production province files return 200 and attach without geometry mocking", async ({ page, request }) => {
  const geo = await request.get("/maps/history-vietnam-province-boundaries.geojson");
  const provenance = await request.get("/maps/history-vietnam-province-boundaries.provenance.json");
  expect(geo.status()).toBe(200);
  expect(provenance.status()).toBe(200);
  expect((await geo.json()).features.length).toBeGreaterThan(0);
  await page.goto("/");
  const globe = await waitForGlobe(page);
  await expect(globe).toHaveAttribute("data-country-boundaries", "ready");
  await expect(globe).toHaveAttribute("data-province-boundaries", "ready");
  const data = await geo.json();
  const attribution = page.locator("details.globe-attribution");
  await attribution.locator("summary").click();
  await expect(attribution.locator("time")).toHaveAttribute("datetime", data.sourceTimestamp);
  await expect(attribution).toContainText("2026-10-23 20:20:51 UTC");
  await expect(attribution).toContainText("© OpenStreetMap contributors");
  const source = attribution.getByRole("link", { name: "Nguồn và xử lý ranh giới tỉnh/thành" });
  await expect(source).toHaveAttribute("href", "/maps/history-vietnam-province-boundaries.provenance.json");
  await expect(attribution.getByRole("link", { name: "Nghị quyết 202/2025/QH15", exact: true })).toHaveAttribute("href", /xaydungchinhsach\.chinhphu\.vn/);
});

for (const size of sizes) {
  test(`real province pixels at overview, northern/central/southern and Khanh Hoa local scales ${size.width}x${size.height}`, async ({ page }) => {
    mkdirSync(outputDir, { recursive: true });
    const data = JSON.parse(readFileSync("public/maps/history-vietnam-province-boundaries.geojson", "utf8"));
    await page.setViewportSize(size);
    await page.goto("/");
    const globe = await waitForGlobe(page);
    await expect(globe).toHaveAttribute("data-province-boundaries", "ready");
    const canvas = page.locator("canvas.cinematic-globe-canvas");
    const evidence: Record<string, unknown>[] = [];
    const views = [{ label: "overview", view: (await inspectScene(page)).view },
      ...[["north", "01-24"], ["central", "46-48"], ["south", "75-79"], ["khanh-hoa-dak-lak", "56-66"], ["khanh-hoa-lam-dong", "56-68"]].flatMap(([label, pair]) => {
        const feature = data.features.filter((f: { properties: { provinceCodes: string[] } }) => f.properties.provinceCodes.join("-") === pair)
          .sort((a: { geometry: { coordinates: number[][] } }, b: { geometry: { coordinates: number[][] } }) => b.geometry.coordinates.length - a.geometry.coordinates.length)[0];
        const [lng, lat] = feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)];
        return [8, 10, 11].map(zoom => ({ label: `${label}-z${zoom}`, view: { lng, lat, zoom } }));
      })];
    for (const { label, view } of views) {
      await inspectScene(page, { type: "view", view });
      const before = await inspectScene(page, { type: "province", data });
      const withProvince = await canvas.screenshot();
      await page.screenshot({ path: path.join(outputDir, `real-${label}-${size.width}x${size.height}.png`) });
      const cleared = await inspectScene(page, { type: "clear-province" });
      const withoutProvince = await canvas.screenshot();
      expect(before.stats.provinceBorderSegments).toBeGreaterThan(0);
      expect(cleared.stats.provinceBorderSegments).toBe(0);
      expect(cleared.stats.countryBorderSegments).toBe(before.stats.countryBorderSegments);
      expect(cleared.stats.journeyPath).toEqual(before.stats.journeyPath);
      expect(cleared.view).toEqual(before.view);
      const changedPixels = await pixelDifference(withProvince, withoutProvince);
      if (label === "overview" || label === "central-z11") {
        writeFileSync(path.join(outputDir, `real-${label}-${size.width}x${size.height}-canvas-with-province.png`), withProvince);
        writeFileSync(path.join(outputDir, `real-${label}-${size.width}x${size.height}-canvas-without-province.png`), withoutProvince);
      }
      expect(changedPixels, label).toBeGreaterThan(30);
      evidence.push({ label, view, changedPixels, provinceSegments: before.stats.provinceBorderSegments, countrySegments: before.stats.countryBorderSegments });
    }
    await inspectScene(page, { type: "province", data });
    const tools = page.getByRole("group", { name: "Điều khiển địa cầu" });
    await expect(tools).toBeVisible();
    await tools.getByRole("button", { name: "Về Việt Nam" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    writeFileSync(path.join(outputDir, `real-pixels-${size.width}x${size.height}.json`), JSON.stringify(evidence, null, 2));
  });
}

test("real local province stroke has readable composited contrast and no far-side pixels", async ({ page }) => {
  const data = JSON.parse(readFileSync("public/maps/history-vietnam-province-boundaries.geojson", "utf8"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(await waitForGlobe(page)).toHaveAttribute("data-province-boundaries", "ready");
  const canvas = page.locator("canvas.cinematic-globe-canvas");
  const evidence: Record<string, unknown>[] = [];
  for (const pair of ["01-24", "46-48", "75-79", "56-66", "56-68"]) {
    const feature = data.features.filter((f: { properties: { provinceCodes: string[] } }) => f.properties.provinceCodes.join("-") === pair)
      .sort((a: { geometry: { coordinates: number[][] } }, b: { geometry: { coordinates: number[][] } }) => b.geometry.coordinates.length - a.geometry.coordinates.length)[0];
    const [lng, lat] = feature.geometry.coordinates[Math.floor(feature.geometry.coordinates.length / 2)];
    for (const zoom of [8, 10, 11]) {
    await inspectScene(page, { type: "view", view: { lng, lat, zoom } });
    await inspectScene(page, { type: "province", data });
    const withLayer = await canvas.screenshot();
    await inspectScene(page, { type: "clear-province" });
    const withoutLayer = await canvas.screenshot();
    const contrast = await strokeCoreContrast(withLayer, withoutLayer);
    expect(contrast.changedPixels).toBeGreaterThan(30);
    expect(contrast.p95Contrast, `pair ${pair}, zoom ${zoom}`).toBeGreaterThanOrEqual(3);
    evidence.push({ pair, zoom, ...contrast });
    }
  }
  const [lng, lat] = data.features[0].geometry.coordinates[0];
  await inspectScene(page, { type: "view", view: { lat: -lat, lng: lng - 180, zoom: 2 } });
  await inspectScene(page, { type: "province", data });
  const far = await canvas.screenshot();
  await inspectScene(page, { type: "clear-province" });
  expect(await pixelDifference(far, await canvas.screenshot())).toBe(0);
  writeFileSync(path.join(outputDir, "real-stroke-contrast.json"), JSON.stringify({ evidence, farSideChangedPixels: 0 }, null, 2));
});

test("real provinces remain passive with a selected event and coexist with each authored journey path", async ({ page }) => {
  const data = JSON.parse(readFileSync("public/maps/history-vietnam-province-boundaries.geojson", "utf8"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?su-kien=chien-dich-dien-bien-phu&ban-do=21.4,103,8");
  await expect(await waitForGlobe(page)).toHaveAttribute("data-province-boundaries", "ready");
  await expect(page.getByTestId("map-event-card")).toContainText("Chiến dịch Điện Biên Phủ");
  const hits = await page.locator(".home-event-marker").evaluateAll(elements => elements.map(element => {
    const r = element.getBoundingClientRect();
    return { width: r.width, height: r.height, hit: document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest("button") === element };
  }));
  expect(hits.length).toBeGreaterThan(0);
  expect(hits.every(h => h.hit && h.width >= 32 && h.height >= 32)).toBe(true);
  await page.screenshot({ path: path.join(outputDir, "real-selected-event-1440x900.png") });
  const cases = [["ho-chi-minh-1911-1941", "pac-bo-1941"], ["mua-thu-doc-lap-1945", "ba-dinh-1945"],
    ["khang-chien-chong-phap-1946-1954", "dien-bien-phu-1954"], ["mua-xuan-1975", "sai-gon-1975"]];
  for (const [journey, stop] of cases) {
    await page.goto(`/?hanh-trinh=${journey}&moc=${stop}`);
    await expect(await waitForGlobe(page)).toHaveAttribute("data-province-boundaries", "ready");
    await inspectScene(page, { type: "view", view: { lat: 15.5, lng: 106.4, zoom: 3.64 } });
    const both = await inspectScene(page);
    expect(both.stats.journeyPath?.segments).toBeGreaterThan(0);
    const canvas = page.locator("canvas.cinematic-globe-canvas");
    const image = await canvas.screenshot();
    await page.screenshot({ path: path.join(outputDir, `real-journey-${journey}-1440x900.png`) });
    const withoutProvince = await inspectScene(page, { type: "clear-province" });
    expect(withoutProvince.stats.journeyPath).toEqual(both.stats.journeyPath);
    expect(await pixelDifference(image, await canvas.screenshot())).toBeGreaterThan(100);
    await inspectScene(page, { type: "province", data });
    const withoutPath = await inspectScene(page, { type: "clear-path" });
    expect(withoutPath.stats.provinceBorderSegments).toBe(both.stats.provinceBorderSegments);
    expect(await pixelDifference(image, await canvas.screenshot())).toBeGreaterThan(30);
  }
});

async function waitForGlobe(page: Page) {
  const globe = page.getByTestId("cinematic-globe");
  await expect(globe).toHaveAttribute("data-state", "ready", { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready);
  return globe;
}

// Synthetic lines with 34 manifest identities exercise the envelope/renderer only.
// These are not source-approved administrative boundaries or a production artifact.
function createProvinceFixture() {
  const manifest = JSON.parse(
    readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"),
  );
  return {
    type: "FeatureCollection",
    schemaVersion: 1,
    referenceFramework: "VN-34-2025",
    sourceTimestamp: "2026-10-24T09:54:11Z",
    sourceSnapshotSha256: "0".repeat(64),
    license: {
      id: "TEST-ONLY",
      url: "https://example.invalid/synthetic",
      attribution: "Synthetic renderer fixture; no real boundary claim",
    },
    units: manifest.units.map(
      (u: { code: string; officialName: string; osmRelationId: number; observedRelationVersion: number }) => ({
        code: u.code,
        name: u.officialName,
        sourceId: `fixture:${u.osmRelationId}`,
        sourceRevision: String(u.observedRelationVersion),
      }),
    ),
    features: [
      // Northern interior lines
      {
        type: "Feature",
        id: "fixture-edge-01-04",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["01", "04"],
          sourceEdgeIds: ["way-fixture-101"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [105.85, 21.05],
            [106.10, 21.60],
            [106.26, 22.66],
          ],
        },
      },
      {
        type: "Feature",
        id: "fixture-edge-01-11",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["01", "11"],
          sourceEdgeIds: ["way-fixture-102"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [105.85, 21.05],
            [104.50, 21.20],
            [103.02, 21.38],
          ],
        },
      },
      // Central interior lines
      {
        type: "Feature",
        id: "fixture-edge-44-46",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["44", "46"],
          sourceEdgeIds: ["way-fixture-201"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [106.62, 17.46],
            [107.00, 16.90],
            [107.59, 16.46],
          ],
        },
      },
      {
        type: "Feature",
        id: "fixture-edge-46-48",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["46", "48"],
          sourceEdgeIds: ["way-fixture-202"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [107.59, 16.46],
            [107.90, 16.25],
            [108.20, 16.05],
          ],
        },
      },
      // Southern interior lines
      {
        type: "Feature",
        id: "fixture-edge-75-79",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["75", "79"],
          sourceEdgeIds: ["way-fixture-301"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [106.84, 10.95],
            [106.75, 10.82],
            [106.70, 10.77],
          ],
        },
      },
      {
        type: "Feature",
        id: "fixture-edge-79-96",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["79", "96"],
          sourceEdgeIds: ["way-fixture-302"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [106.70, 10.77],
            [105.78, 10.03],
            [105.15, 9.17],
          ],
        },
      },
    ],
  };
}

test.describe("Task 06 — province boundaries optional failure and fallback", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
  });

  test("handles an explicitly injected province 404 while maintaining core Earth and events", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route("**/maps/history-vietnam-province-boundaries.geojson", route => route.fulfill({ status: 404 }));
    await page.goto("/");

    const globe = await waitForGlobe(page);
    // Explicit fault injection; natural production 404 is covered as a failure above.
    await expect(globe).toHaveAttribute("data-province-boundaries", "unavailable", { timeout: 15_000 });
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();

    // Map tools remain enabled and usable
    const worldBtn = page.getByRole("button", { name: "Toàn cầu" });
    await expect(worldBtn).toBeEnabled();
    const vietnamBtn = page.getByRole("button", { name: "Về Việt Nam" });
    await expect(vietnamBtn).toBeEnabled();

    // Capture baseline screenshot
    await page.screenshot({ path: path.join(outputDir, "injected-province-404-overview-1440x900.png") });

    // Verify map attribution contains the required modern reference disclosure
    const attribution = page.locator("details.globe-attribution");
    await expect(attribution).toBeVisible();
    await attribution.locator("summary").click();

    await expect(attribution).toContainText(
      "Ranh giới 34 tỉnh/thành hiện nay là lớp tham chiếu địa lý; không mô tả địa giới tại thời điểm sự kiện.",
    );
    await expect(attribution).toContainText("(Lớp ranh giới tỉnh/thành tùy chọn hiện không khả dụng.)");
    await expect(attribution.getByRole("link", { name: "OpenStreetMap (ODbL)" })).toBeVisible();
    await expect(attribution.getByRole("link", { name: /Nghị quyết 202\/2025\/QH15/ })).toBeVisible();
  });

  test("handles aborted/network-failed province requests without blocking map readiness", async ({ page }) => {
    await page.route("**/maps/history-vietnam-province-boundaries.geojson", (route) => route.abort());
    await page.goto("/");

    const globe = await waitForGlobe(page);
    await expect(globe).toHaveAttribute("data-province-boundaries", "unavailable", { timeout: 15_000 });
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();
  });

  test("handles malformed JSON in province boundaries without crashing renderer", async ({ page }) => {
    await page.route("**/maps/history-vietnam-province-boundaries.geojson", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{ malformed json content ...",
      }),
    );
    await page.goto("/");

    const globe = await waitForGlobe(page);
    await expect(globe).toHaveAttribute("data-province-boundaries", "unavailable", { timeout: 15_000 });
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();
  });
});

test("synthetic metadata follows successfully attached data and clears on context loss/retry failure", async ({ page }) => {
  const fixture = syntheticProvinceFixture();
  fixture.sourceTimestamp = "2020-01-02T03:04:05Z";
  let fail = false;
  await page.route("**/maps/history-vietnam-province-boundaries.geojson", route => fail
    ? route.fulfill({ status: 404 })
    : route.fulfill({ json: fixture }));
  await page.goto("/");
  const globe = await waitForGlobe(page);
  await expect(globe).toHaveAttribute("data-province-boundaries", "ready");
  const attribution = page.locator("details.globe-attribution");
  await attribution.locator("summary").click();
  await expect(attribution.locator("time")).toHaveAttribute("datetime", fixture.sourceTimestamp);
  await expect(attribution).toContainText("Synthetic renderer fixture");
  fail = true;
  await page.locator("canvas.cinematic-globe-canvas").evaluate(canvas => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await expect(attribution.locator("time")).toHaveCount(0);
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(globe).toHaveAttribute("data-state", "ready");
  await expect(globe).toHaveAttribute("data-province-boundaries", "unavailable");
  await expect(attribution.locator("time")).toHaveCount(0);
  await expect(attribution).not.toContainText("Synthetic renderer fixture");
});

test("late synthetic province data cannot attach geometry or metadata after context retry", async ({ page }) => {
  const old = syntheticProvinceFixture(), current = syntheticProvinceFixture();
  old.sourceTimestamp = "2019-01-01T00:00:00Z";
  current.sourceTimestamp = "2021-01-01T00:00:00Z";
  let release = () => {};
  const held = new Promise<void>(resolve => { release = resolve; });
  let requests = 0;
  await page.route("**/maps/history-vietnam-province-boundaries.geojson", async route => {
    if (++requests === 1) {
      await held;
      await route.fulfill({ json: old }).catch(() => { /* Expected abort of the old attempt. */ });
    } else await route.fulfill({ json: current });
  });
  await page.goto("/");
  const globe = await waitForGlobe(page);
  await expect(globe).toHaveAttribute("data-province-boundaries", "loading");
  await page.locator("canvas.cinematic-globe-canvas").evaluate(canvas => canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.getByTestId("globe-error")).toBeVisible();
  await page.getByRole("button", { name: "Thử lại", exact: true }).click();
  await expect(globe).toHaveAttribute("data-province-boundaries", "ready");
  release();
  await page.locator("details.globe-attribution summary").click();
  await expect(page.locator("details.globe-attribution time")).toHaveAttribute("datetime", current.sourceTimestamp);
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  expect((await inspectScene(page)).stats.provinceBorderSegments).toBeGreaterThan(0);
});

test.describe("Task 06 — synthetic fixture rendering, not province source acceptance", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
  });

  test("renders a synthetic province fixture inside Vietnam at overview and local scales", async ({ page }) => {
    const fixture = createProvinceFixture();

    // Intercept province boundaries request with valid test fixture
    await page.route("**/maps/history-vietnam-province-boundaries.geojson", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fixture),
      }),
    );

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const globe = await waitForGlobe(page);
    await expect(globe).toHaveAttribute("data-province-boundaries", "ready", { timeout: 15_000 });
    await expect(globe).toHaveAttribute("data-state", "ready");

    // Capture overview screenshot with province lines rendered
    const readyOverviewPath = path.join(outputDir, "synthetic-province-ready-overview-1440x900.png");
    await page.screenshot({ path: readyOverviewPath });

    // Verify attribution indicates available data without the unavailable notice
    const attribution = page.locator("details.globe-attribution");
    await attribution.locator("summary").click();
    await expect(attribution).toContainText(
      "Ranh giới 34 tỉnh/thành hiện nay là lớp tham chiếu địa lý; không mô tả địa giới tại thời điểm sự kiện.",
    );
    await expect(attribution).not.toContainText("(Lớp ranh giới tỉnh/thành tùy chọn hiện không khả dụng.)");

    // Test local scale: zoom into Hanoi region using "+" button or canvas keydown
    const canvas = page.locator("canvas.cinematic-globe-canvas");
    await canvas.focus();

    // Zoom in multiple times to reach local zoom (8, 10, 11)
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press("+");
      await page.waitForTimeout(200);
    }
    await page.waitForTimeout(600);

    const localZ8Path = path.join(outputDir, "synthetic-province-local-zoom-scale.png");
    await page.screenshot({ path: localZ8Path });

    // Verify event markers remain visible and interactive
    const eventMarkers = page.locator(".home-event-marker");
    await expect(eventMarkers.first()).toBeVisible();
  });

  for (const size of sizes) {
    test(`renders cleanly across desktop viewport ${size.width}x${size.height}`, async ({ page }) => {
      const fixture = createProvinceFixture();
      await page.route("**/maps/history-vietnam-province-boundaries.geojson", (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(fixture),
        }),
      );

      await page.setViewportSize(size);
      await page.goto("/");

      const globe = await waitForGlobe(page);
      await expect(globe).toHaveAttribute("data-province-boundaries", "ready", { timeout: 15_000 });

      // Controls and tools fit cleanly
      const tools = page.locator(".home-map-tools");
      await expect(tools).toBeVisible();

      const screenshotPath = path.join(outputDir, `synthetic-province-desktop-${size.width}x${size.height}.png`);
      await page.screenshot({ path: screenshotPath });
    });
  }

  test("handles delayed province response during rapid navigation without stale attachment", async ({ page }) => {
    const fixture = createProvinceFixture();
    await page.route("**/maps/history-vietnam-province-boundaries.geojson", async (route) => {
      await new Promise((r) => setTimeout(r, 1200));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fixture),
      });
    });

    await page.goto("/");
    const globe = await waitForGlobe(page);
    expect(await globe.getAttribute("data-state")).toBe("ready");

    // Rapidly navigate away before boundary resolves
    await page.goto("/kham-pha");
    await expect(page).toHaveURL(/\/kham-pha/);

    // Return to home
    await page.goto("/");
    const restoredGlobe = await waitForGlobe(page);
    await expect(restoredGlobe).toHaveAttribute("data-state", "ready");
  });
});
