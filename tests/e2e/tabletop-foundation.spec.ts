import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow } from "./support";

// Desktop-only foundation suite per docs/product/DESKTOP-UI-SCOPE.md (1280×720, 1366×768, 1440×900, 1920×1080).
// Uses SwiftShader for deterministic WebGL behavior in automated runs.

test.use({
  viewport: { width: 1280, height: 720 },
  launchOptions: {
    args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  },
});
test.setTimeout(180_000);

const DESKTOP_VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const SCREENSHOT_DIR = path.resolve(process.cwd(), "test-results", "tabletop-checkpoint-a");

test.describe("Tabletop Foundation (Checkpoint A — Desktop Only)", () => {
  test("initializes raised 3D Vietnam tabletop with visible side depth, zero external tile/DEM requests, and zero idle frames", async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on("request", (req) => {
      const url = req.url();
      if (!url.startsWith("http://localhost") && !url.startsWith("http://127.0.0.1") && !url.startsWith("data:")) {
        externalRequests.push(url);
      }
    });

    await page.goto("/");
    const stage = page.getByTestId("tabletop-stage");
    await expect(stage).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });
    await page.waitForFunction(() => Boolean(window.__tabletop));

    const stats = await page.evaluate(() => window.__tabletop!.getStats());
    expect(stats).not.toBeNull();
    expect(stats!.sideFacesVisible).toBe(true);
    expect(stats!.partCount).toBeGreaterThanOrEqual(5);
    expect(stats!.triangles).toBeGreaterThan(1000);
    expect(stats!.triangles).toBeLessThanOrEqual(80_000);
    expect(stats!.pixelRatio).toBeLessThanOrEqual(2);

    // Confirm no external tile/DEM requests were made
    expect(externalRequests).toEqual([]);

    // Confirm zero continuous render loop during a 2-second idle window
    const framesBefore = await page.evaluate(() => window.__tabletop!.getStats()!.frameCount);
    await page.waitForTimeout(2000);
    const framesAfter = await page.evaluate(() => window.__tabletop!.getStats()!.frameCount);
    expect(framesAfter).toBe(framesBefore);
  });

  test("supports mouse drag/wheel, toolbar buttons, keyboard controls, reset, and enforces camera bounds", async ({
    page,
  }) => {
    await page.goto("/");
    const stage = page.getByTestId("tabletop-stage");
    await expect(stage).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });
    await page.waitForFunction(() => Boolean(window.__tabletop));

    const initialView = await page.evaluate(() => window.__tabletop!.getView());

    // Toolbar button: zoom in
    await page.getByTestId("tabletop-zoom-in").click();
    const afterZoomIn = await page.evaluate(() => window.__tabletop!.getView());
    expect(afterZoomIn.distance).toBeLessThan(initialView.distance);

    // Toolbar button: rotate right
    await page.getByTestId("tabletop-rotate-right").click();
    const afterRotate = await page.evaluate(() => window.__tabletop!.getView());
    expect(afterRotate.azimuth).not.toBe(afterZoomIn.azimuth);

    // Keyboard interaction on canvas
    const canvas = page.getByTestId("tabletop-canvas");
    await canvas.focus();
    await page.keyboard.press("ArrowUp");
    const afterKeyTilt = await page.evaluate(() => window.__tabletop!.getView());
    expect(afterKeyTilt.polar).toBeLessThan(afterRotate.polar);

    // Mouse wheel zoom out on canvas
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.wheel(0, 240);
    await page.waitForTimeout(150);
    const afterWheel = await page.evaluate(() => window.__tabletop!.getView());
    expect(afterWheel.distance).toBeGreaterThan(afterKeyTilt.distance);

    // Mouse drag orbit on canvas
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.mouse.move(box!.x + box!.width / 2 + 90, box!.y + box!.height / 2 + 40, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(150);
    const afterDrag = await page.evaluate(() => window.__tabletop!.getView());
    expect(afterDrag.azimuth).not.toBe(afterWheel.azimuth);

    // Enforce camera bounds when attempting extreme out-of-range view
    await page.evaluate(() => {
      window.__tabletop!.setView({
        azimuth: 0.5,
        polar: 9.9,
        distance: 9999,
        targetX: 999,
        targetZ: -999,
      });
    });
    const clampedView = await page.evaluate(() => window.__tabletop!.getView());
    expect(clampedView.polar).toBeGreaterThanOrEqual(0.25);
    expect(clampedView.polar).toBeLessThanOrEqual(1.35);
    expect(clampedView.distance).toBeGreaterThanOrEqual(25);
    expect(clampedView.distance).toBeLessThanOrEqual(250);
    expect(Math.abs(clampedView.targetX)).toBeLessThanOrEqual(70);
    expect(Math.abs(clampedView.targetZ)).toBeLessThanOrEqual(70);

    // Reset button restores initial view
    await page.getByTestId("tabletop-reset").click();
    const resetView = await page.evaluate(() => window.__tabletop!.getView());
    expect(resetView.azimuth).toBeCloseTo(initialView.azimuth, 2);
    expect(resetView.polar).toBeCloseTo(initialView.polar, 2);
    expect(resetView.distance).toBeCloseTo(initialView.distance, 1);
  });

  test("Adapts cleanly across all four desktop viewports (1280×720, 1366×768, 1440×900, 1920×1080) and captures screenshots", async ({
    page,
  }) => {
    mkdirSync(SCREENSHOT_DIR, { recursive: true });
    await page.goto("/");
    const stage = page.getByTestId("tabletop-stage");
    await expect(stage).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });
    await page.waitForFunction(() => Boolean(window.__tabletop));

    for (const vp of DESKTOP_VIEWPORTS) {
      await page.setViewportSize(vp);
      await page.evaluate(() => window.__tabletop!.resize());
      await page.waitForTimeout(200);

      expect(await hasHorizontalOverflow(page), `horizontal overflow at ${vp.width}x${vp.height}`).toBe(false);
      await expect(page.getByTestId("tabletop-zoom-in")).toBeVisible();
      await expect(page.getByTestId("tabletop-reset")).toBeVisible();
      await expect(page.getByTestId("explorer-event-list")).toBeVisible();

      const stats = await page.evaluate(() => window.__tabletop!.getStats());
      expect(stats?.sideFacesVisible, `side faces visible at ${vp.width}x${vp.height}`).toBe(true);

      const screenshotPath = path.join(SCREENSHOT_DIR, `tabletop-${vp.width}x${vp.height}.png`);
      await page.screenshot({ path: screenshotPath });
    }
  });

  test("respects prefers-reduced-motion, recovers from WebGL context loss via retry, and supports no-WebGL & DB-error fallbacks", async ({
    browser,
  }) => {
    // 1. Reduced motion + context loss & retry
    const rmContext = await browser.newContext({
      viewport: { width: 1366, height: 768 },
      reducedMotion: "reduce",
    });
    const rmPage = await rmContext.newPage();
    await rmPage.goto("/");
    const rmStage = rmPage.getByTestId("tabletop-stage");
    await expect(rmStage).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });
    await expect(rmStage).toHaveAttribute("data-reduced-motion", "true");
    const rmStats = await rmPage.evaluate(() => window.__tabletop!.getStats());
    expect(rmStats?.reducedMotion).toBe(true);

    // Simulate context loss and retry
    await rmPage.evaluate(() => window.__tabletop!.simulateContextLoss());
    await expect(rmStage).toHaveAttribute("data-phase", "error");
    await expect(rmPage.getByTestId("tabletop-error")).toBeVisible();
    await rmPage.getByTestId("tabletop-retry").click();
    await expect(rmStage).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });

    // Database error simulation keeps map working and shows one clear message
    await rmPage.goto("/?__test_db_error=1");
    await expect(rmPage.getByTestId("explorer-data-error")).toBeVisible();
    await expect(rmPage.getByTestId("tabletop-stage")).toHaveAttribute("data-phase", "ready", { timeout: 60_000 });
    await expect(rmPage.getByTestId("explorer-event-item")).toHaveCount(0);
    await rmContext.close();

    // 2. No-WebGL fallback
    const noWebglContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const noWebglPage = await noWebglContext.newPage();
    await noWebglPage.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext as (
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) => unknown;
      (HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext = function (
        this: HTMLCanvasElement,
        type: string,
        ...rest: unknown[]
      ) {
        if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
        return original.call(this, type, ...rest);
      };
    });
    await noWebglPage.goto("/");
    await expect(noWebglPage.getByTestId("tabletop-stage")).toHaveAttribute("data-phase", "unsupported");
    await expect(noWebglPage.getByTestId("tabletop-unsupported")).toBeVisible();
    await expect(noWebglPage.getByTestId("explorer-event-list")).toBeVisible();
    await noWebglContext.close();

    // 3. JavaScript-disabled SSR event list and links
    const noJsContext = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      javaScriptEnabled: false,
    });
    const noJsPage = await noJsContext.newPage();
    await noJsPage.goto("/");
    await expect(noJsPage.getByTestId("explorer-event-list")).toBeVisible();
    const links = noJsPage.getByTestId("explorer-event-link");
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
    const firstHref = await links.first().getAttribute("href");
    expect(firstHref).toMatch(/^\/su-kien\//);
    await noJsContext.close();
  });
});
