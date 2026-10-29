import { expect, test } from "@playwright/test";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { parseProvinceAreas, provinceAreaAnchor } from "@/lib/locality/province-areas";

const shipped = parseProvinceAreas(
  JSON.parse(readFileSync(resolve("public/maps/history-vietnam-province-areas.geojson"), "utf8")),
);
const anchors = new Map(
  shipped.features.map((feature) => {
    const anchor = provinceAreaAnchor(feature);
    if (!anchor) throw new Error(`missing anchor for ${feature.properties.code}`);
    return [feature.properties.code, anchor] as const;
  }),
);

async function ready(page: import("@playwright/test").Page) {
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 60000 });
}

async function sceneGeometry(page: import("@playwright/test").Page) {
  return page.locator("canvas.cinematic-globe-canvas").evaluate((element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"));
    if (!key) return null;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as {
          scene?: {
            getSelectedProvinceGeometry?: () => {
              code: string;
              status: string;
              currentRadius: number;
              baseRadius: number;
              wallVertexCount: number;
              capVertexCount: number;
              partCount: number;
              holeCount: number;
              nonFinite: number;
              wallOtherHits: number;
              wallBaseHits: number;
              wallTopHits: number;
              capMinRadius: number;
              capMaxRadius: number;
              wallBaseRadius: number;
              wallTopRadius: number;
            } | null;
            getProvinceAreaFeature?: (code: string) => unknown;
          };
        } | null;
        if (value?.scene?.getSelectedProvinceGeometry) {
          return {
            geometry: value.scene.getSelectedProvinceGeometry(),
            hasFeature: typeof value.scene.getProvinceAreaFeature === "function",
          };
        }
      }
      fiber = fiber.return;
    }
    return null;
  });
}

async function waitForArea(page: import("@playwright/test").Page, code: string) {
  await expect.poll(async () => page.locator("canvas.cinematic-globe-canvas").evaluate((element, target) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"));
    if (!key) return false;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as {
          scene?: { getProvinceAreaFeature?: (code: string) => unknown };
        } | null;
        if (typeof value?.scene?.getProvinceAreaFeature === "function") {
          return Boolean(value.scene.getProvinceAreaFeature(target));
        }
      }
      fiber = fiber.return;
    }
    return false;
  }, code), { timeout: 90000 }).toBe(true);
}

test.describe.configure({ mode: "serial" });

test("N34: every canonical locality loads admitted raised geometry via direct URL", async ({ page }, testInfo) => {
  test.setTimeout(900_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const rows: Array<Record<string, unknown>> = [];
  for (const locality of LOCALITIES) {
    await page.goto(`/?noi-dung=dia-phuong&dia-phuong=${locality.slug}`);
    await ready(page);
    await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", locality.code, {
      timeout: 30000,
    });
    await expect.poll(async () => {
      const snapshot = await sceneGeometry(page);
      return snapshot?.geometry?.code === locality.code && snapshot.geometry.status === "admitted"
        ? snapshot.geometry
        : null;
    }, { timeout: 45000 }).toBeTruthy();
    const snapshot = await sceneGeometry(page);
    const geometry = snapshot!.geometry!;
    expect(geometry.currentRadius).toBeGreaterThan(geometry.baseRadius);
    expect(geometry.capVertexCount).toBeGreaterThan(0);
    expect(geometry.wallVertexCount).toBeGreaterThan(0);
    const meshPassed = geometry.nonFinite === 0
      && geometry.wallOtherHits === 0
      && geometry.wallBaseHits > 0
      && geometry.wallTopHits > 0
      && Math.abs(geometry.capMinRadius - geometry.currentRadius) < 1e-3
      && Math.abs(geometry.capMaxRadius - geometry.currentRadius) < 1e-3
      && Math.abs(geometry.wallBaseRadius - geometry.baseRadius) < 1e-3
      && Math.abs(geometry.wallTopRadius - geometry.currentRadius) < 1e-3;
    expect(meshPassed, locality.code).toBe(true);
    rows.push({
      code: locality.code,
      slug: locality.slug,
      viewport: testInfo.project.name,
      runtimeBuilt: true,
      meshPassed,
      status: geometry.status,
      currentRadius: geometry.currentRadius,
      baseRadius: geometry.baseRadius,
      capVertexCount: geometry.capVertexCount,
      wallVertexCount: geometry.wallVertexCount,
      partCount: geometry.partCount,
      holeCount: geometry.holeCount,
    });
  }
  expect(rows).toHaveLength(34);
  const matrixDir = resolve("output/playwright/province-areas/matrix");
  mkdirSync(matrixDir, { recursive: true });
  writeFileSync(
    resolve(matrixDir, `runtime-${testInfo.project.name}.json`),
    `${JSON.stringify({ schemaVersion: 2, kind: "runtime-mesh", viewport: testInfo.project.name, count: rows.length, units: rows }, null, 2)}\n`,
  );
});

test("N34-pick: interior pointer selection works with labels hidden for every locality", async ({ page }, testInfo) => {
  test.setTimeout(900_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const results: Array<Record<string, unknown>> = [];

  for (const locality of LOCALITIES) {
    const anchor = anchors.get(locality.code)!;
    // Position the camera with the existing locality framing, then clear selection so the next
    // assertion can only pass through the real canvas pointer path.
    await page.goto(`/?noi-dung=dia-phuong&dia-phuong=${locality.slug}`);
    await ready(page);
    await waitForArea(page, locality.code);
    await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", locality.code);
    await page.getByRole("button", { name: new RegExp(`Bỏ chọn ${locality.officialName}|Bỏ chọn`) }).click();
    await expect(page).not.toHaveURL(/dia-phuong=/);
    await expect(page.getByTestId("locality-card-cluster")).toHaveCount(0);

    await page.evaluate(() => {
      for (const node of document.querySelectorAll("[data-testid^='locality-marker-'], .locality-map-markers, .globe-place-label")) {
        (node as HTMLElement).style.setProperty("display", "none", "important");
        (node as HTMLElement).style.setProperty("pointer-events", "none", "important");
      }
    });

    const clickPoint = await page.locator("canvas.cinematic-globe-canvas").evaluate((element, sample) => {
      type Hook = { memoizedState: unknown; next: Hook | null };
      type Fiber = { memoizedState: Hook | null; return: Fiber | null };
      type SceneApi = { projectGeo(lat: number, lng: number, radius?: number): { x: number; y: number; behind: boolean } };
      const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"))!;
      let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
      let scene: SceneApi | undefined;
      while (fiber && !scene) {
        for (let hook = fiber.memoizedState; hook; hook = hook.next) {
          const value = hook.memoizedState as { scene?: SceneApi } | null;
          if (typeof value?.scene?.projectGeo === "function") {
            scene = value.scene;
            break;
          }
        }
        fiber = fiber.return;
      }
      if (!scene) throw new Error("scene missing");
      const projected = scene.projectGeo(sample.lat, sample.lng);
      if (projected.behind) throw new Error(`sample behind camera for ${sample.code}`);
      const rect = element.getBoundingClientRect();
      return { x: rect.left + projected.x, y: rect.top + projected.y, lat: sample.lat, lng: sample.lng };
    }, { code: locality.code, lat: anchor.lat, lng: anchor.lng });

    await page.mouse.click(clickPoint.x, clickPoint.y);
    await expect(page).toHaveURL(new RegExp(`dia-phuong=${locality.slug}`), { timeout: 20000 });
    await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", locality.code);
    const snapshot = await sceneGeometry(page);
    expect(snapshot?.geometry?.code).toBe(locality.code);
    expect(snapshot?.geometry?.status).toBe("admitted");
    results.push({
      code: locality.code,
      slug: locality.slug,
      viewport: testInfo.project.name,
      interiorPickPassed: true,
      clicked: clickPoint,
      geometryCode: snapshot?.geometry?.code,
    });
  }

  expect(results).toHaveLength(34);
  const matrixDir = resolve("output/playwright/province-areas/matrix");
  mkdirSync(matrixDir, { recursive: true });
  writeFileSync(
    resolve(matrixDir, `interior-pick-${testInfo.project.name}.json`),
    `${JSON.stringify({ schemaVersion: 2, kind: "interior-pick", viewport: testInfo.project.name, count: results.length, units: results, scope: "one shipped-anchor click per unit; not a second source sample or shared-border proof" }, null, 2)}\n`,
  );
});
