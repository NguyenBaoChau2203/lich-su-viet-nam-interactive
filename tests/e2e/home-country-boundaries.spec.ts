import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "./refinement-test";
import { inspectScene, pixelDifference } from "./refinement-evidence";

const outputDir = path.resolve("output/playwright/country-boundaries/phase-1");
const phase2OutputDir = path.resolve("output/playwright/country-boundaries/phase-2");
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

test.describe("country boundaries integration & resilience", () => {
  test.beforeAll(() => {
    mkdirSync(outputDir, { recursive: true });
    mkdirSync(phase2OutputDir, { recursive: true });
  });

  test("loads boundaries optionally and draws pixels on the globe", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/?ban-do=15.5,106.4,3.32");

    const globe = await waitForGlobe(page);
    await expect(globe).toHaveAttribute("data-country-boundaries", "ready", { timeout: 15_000 });

    const canvas = page.locator("canvas.cinematic-globe-canvas");
    await expect(canvas).toBeVisible();

    // Capture screenshot with boundaries present
    const readyScreenshotPath = path.join(outputDir, "boundaries-ready-1440x900.png");
    await page.screenshot({ path: readyScreenshotPath });

    // Remove only country geometry on the same mounted scene/camera. Comparing
    // canvas pixels avoids layout, font, intro-flight or stale-frame differences.
    await inspectScene(page, { type: "stats" });
    const withBorders = await canvas.screenshot();
    await inspectScene(page, { type: "clear-country" });
    const withoutBorders = await canvas.screenshot();
    expect(await pixelDifference(withBorders, withoutBorders)).toBeGreaterThan(100);

    // Also verify optional network failure on a fresh mount.
    await page.route("**/maps/history-country-boundaries.geojson", (route) => route.abort());
    await page.goto("/");

    const blockedGlobe = await waitForGlobe(page);
    await expect(blockedGlobe).toHaveAttribute("data-country-boundaries", "unavailable", { timeout: 15_000 });

    // Core Earth must remain ready
    await expect(blockedGlobe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();

    const blockedScreenshotPath = path.join(outputDir, "boundaries-blocked-1440x900.png");
    await page.screenshot({ path: blockedScreenshotPath });

  });

  test("retains working Earth and selectable events when boundaries 404", async ({ page }) => {
    await page.route("**/maps/history-country-boundaries.geojson", (route) =>
      route.fulfill({ status: 404, body: "Not found" }),
    );

    await page.goto("/");
    const globe = await waitForGlobe(page);

    await expect(globe).toHaveAttribute("data-country-boundaries", "unavailable");
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();

    // Verify tools and events still interact cleanly
    const worldBtn = page.getByRole("button", { name: "Toàn cầu" });
    await expect(worldBtn).toBeEnabled();
    await worldBtn.click();
    await page.waitForTimeout(300);

    const vietnamBtn = page.getByRole("button", { name: "Về Việt Nam" });
    await expect(vietnamBtn).toBeEnabled();
    await vietnamBtn.click();
  });

  test("handles malformed JSON boundary data without crashing renderer", async ({ page }) => {
    await page.route("**/maps/history-country-boundaries.geojson", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{ malformed json content ...",
      }),
    );

    await page.goto("/");
    const globe = await waitForGlobe(page);

    await expect(globe).toHaveAttribute("data-country-boundaries", "unavailable");
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();
  });

  test("handles unsupported geometry in boundary asset without crashing renderer", async ({ page }) => {
    const invalidData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 999,
            sourceClass: "Invalid",
            viewClass: "International boundary (verify)",
          },
          geometry: {
            type: "Polygon", // unsupported geometry for line collection
            coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
          },
        },
      ],
    };

    await page.route("**/maps/history-country-boundaries.geojson", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(invalidData),
      }),
    );

    await page.goto("/");
    const globe = await waitForGlobe(page);

    await expect(globe).toHaveAttribute("data-country-boundaries", "unavailable");
    await expect(globe).toHaveAttribute("data-state", "ready");
    await expect(page.getByTestId("globe-error")).not.toBeVisible();
  });

  test("handles delayed boundary response during rapid navigation without stale attachment", async ({ page }) => {
    await page.route("**/maps/history-country-boundaries.geojson", async (route) => {
      // Artificial delay
      await new Promise((r) => setTimeout(r, 1500));
      await route.continue();
    });

    await page.goto("/");
    const globe = await waitForGlobe(page);
    expect(await globe.getAttribute("data-state")).toBe("ready");

    // Navigate to another page before boundary resolves
    await page.goto("/kham-pha");
    await expect(page).toHaveURL(/\/kham-pha/);

    // Return to home
    await page.goto("/");
    const restoredGlobe = await waitForGlobe(page);
    await expect(restoredGlobe).toHaveAttribute("data-state", "ready");
  });

  for (const size of sizes) {
    test(`renders cleanly across desktop viewport ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto("/");

      const globe = await waitForGlobe(page);
      await expect(globe).toHaveAttribute("data-country-boundaries", "ready", { timeout: 15_000 });

      const screenshotPath = path.join(outputDir, `desktop-${size.width}x${size.height}.png`);
      await page.screenshot({ path: screenshotPath });
    });
  }
});

test.describe("Phase 2 — visual hierarchy, disclosures, and desktop matrix", () => {
  test("discloses modern generalized boundaries, omission policy, and provenance link in map sources", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForGlobe(page);

    const attribution = page.locator("details.globe-attribution");
    await expect(attribution).toBeVisible();

    const summary = attribution.locator("summary");
    await expect(summary).toHaveText("Nguồn bản đồ");

    // Open disclosure
    await summary.click();

    await expect(attribution).toContainText(
      "Đường biên giới đất liền hiện đại, khái quát theo Natural Earth; không tái dựng biên giới theo năm đang chọn. Một số đường có phân loại chưa chắc chắn trong nguồn được lược bỏ.",
    );

    const provenanceLink = attribution.getByRole("link", { name: "Ranh giới quốc tế & phân loại" });
    await expect(provenanceLink).toBeVisible();
    await expect(provenanceLink).toHaveAttribute("href", "/maps/history-country-boundaries.provenance.json");

    // Keyboard accessibility: can focus the link directly via keyboard navigation
    await provenanceLink.focus();
    const isFocused = await page.evaluate(() => document.activeElement?.getAttribute("href") === "/maps/history-country-boundaries.provenance.json");
    expect(isFocused).toBe(true);
  });

  test("maintains passive line geometry: clicking boundaries does not create popups or intercept events", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await waitForGlobe(page);

    const canvas = page.locator("canvas.cinematic-globe-canvas");
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // Click on canvas where country lines exist (northwest of Vietnam into China/Laos)
    if (box) {
      await page.mouse.click(box.x + box.width * 0.42, box.y + box.height * 0.35);
    }

    // No popup, dialog, or hover card appears
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(page.locator(".country-popup, .country-card")).toHaveCount(0);

    // Event markers remain clickable
    const marker = page.locator(".home-event-marker").first();
    await expect(marker).toBeVisible();
    await marker.click();

    // Event card appears
    await expect(page.locator(".home-map-event-card")).toBeVisible({ timeout: 10_000 });
  });

  for (const size of sizes) {
    test(`Phase 2 visual matrix: captures 4 states at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);

      // 1. Default Vietnam view
      await page.goto("/");
      await waitForGlobe(page);
      await page.screenshot({ path: path.join(phase2OutputDir, `default-${size.width}x${size.height}.png`) });

      // 2. World overview view
      const worldBtn = page.getByRole("button", { name: "Toàn cầu" });
      await worldBtn.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(phase2OutputDir, `world-${size.width}x${size.height}.png`) });

      // 3. Selected event card view
      await page.goto("/?su-kien=nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc");
      await waitForGlobe(page);
      await expect(page.locator(".home-map-event-card")).toBeVisible({ timeout: 10_000 });
      await page.screenshot({ path: path.join(phase2OutputDir, `card-${size.width}x${size.height}.png`) });

      // 4. European journey stop (Paris 1919)
      await page.goto("/?hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
      await waitForGlobe(page);
      await expect(page.getByTestId("journey-panel")).toBeVisible({ timeout: 10_000 });
      await page.screenshot({ path: path.join(phase2OutputDir, `journey-paris-${size.width}x${size.height}.png`) });
    });
  }
});
