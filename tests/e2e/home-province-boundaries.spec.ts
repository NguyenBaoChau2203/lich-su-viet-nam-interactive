import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";

const outputDir = path.resolve("output/playwright/refinement/task-06");
const sizes = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

test.use({ reducedMotion: "reduce" });

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
    sourceSnapshotSha256: "6f872236aba6463acfcfb04a026e9c0087aabb3de677a335b2d7bfa42c29e467",
    license: {
      id: "ODbL-1.0",
      url: "https://opendatacommons.org/licenses/odbl/1-0/",
      attribution: "© OpenStreetMap contributors",
    },
    units: manifest.units.map(
      (u: { code: string; officialName: string; osmRelationId: number; observedRelationVersion: number }) => ({
        code: u.code,
        name: u.officialName,
        sourceId: String(u.osmRelationId),
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

  test("runs safely with province asset 404/unavailable in production, maintaining core Earth and events", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const globe = await waitForGlobe(page);
    // In production without an approved province artifact, the asset 404s and marks "unavailable"
    await expect(globe).toHaveAttribute("data-province-boundaries", "unavailable", { timeout: 15_000 });
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();

    // Map tools remain enabled and usable
    const worldBtn = page.getByRole("button", { name: "Toàn cầu" });
    await expect(worldBtn).toBeEnabled();
    const vietnamBtn = page.getByRole("button", { name: "Về Việt Nam" });
    await expect(vietnamBtn).toBeEnabled();

    // Capture baseline screenshot
    await page.screenshot({ path: path.join(outputDir, "province-unavailable-overview-1440x900.png") });

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
    const readyOverviewPath = path.join(outputDir, "province-ready-overview-1440x900.png");
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

    const localZ8Path = path.join(outputDir, "province-local-zoom-scale.png");
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

      const screenshotPath = path.join(outputDir, `province-desktop-${size.width}x${size.height}.png`);
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
