import { expect, test, type Page } from "@playwright/test";
import { viewToCameraPose } from "@/lib/explorer/cinematic/camera";
import { inspectScene } from "./refinement-evidence";

test.use({ video: "on" });

const ready = (page: import("@playwright/test").Page) =>
  expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 60000 });

const areasReady = (page: import("@playwright/test").Page) =>
  expect(page.getByTestId("globe-map")).toHaveAttribute("data-province-areas", "ready", { timeout: 90000 });

async function geometry(page: import("@playwright/test").Page) {
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
            getSelectedProvinceGeometry?: () => { code: string; status: string; currentRadius: number; targetRadius: number } | null;
            getOutlinePositionBuffer?: () => object | null;
          };
        } | null;
        if (value?.scene?.getSelectedProvinceGeometry) {
          return {
            geometry: value.scene.getSelectedProvinceGeometry(),
            outline: value.scene.getOutlinePositionBuffer?.() ?? null,
          };
        }
      }
      fiber = fiber.return;
    }
    return null;
  });
}

test("F34-clear: camera and zoom cannot resurrect a cleared province", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await ready(page);
  await areasReady(page);
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  await page.locator('button[data-locality-code="04"]').click();
  await page.getByRole("button", { name: /Bỏ chọn/ }).click();
  await expect(page).not.toHaveURL(/dia-phuong=/);
  await page.getByRole("button", { name: "Phóng to bản đồ", exact: true }).click();
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(700);
  await expect(page.getByTestId("locality-card-cluster")).toHaveCount(0);
  await expect.poll(async () => (await geometry(page))?.geometry ?? null).toBeNull();
});

test("F34-occlusion: an opposite-side raised province hides leaders and keeps cards", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await ready(page);
  await areasReady(page);
  await expect(page.getByTestId("locality-connectors").locator("path")).not.toHaveCount(0);
  await inspectScene(page, { type: "view", view: { lat: -21, lng: -74, zoom: 7 } });
  await expect(page.getByTestId("locality-connectors")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Thành phố Hà Nội", exact: true })).toBeVisible();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
});

test("F34-outline: outline storage stays stable and clear cycles stay bounded", async ({ page }) => {
  await page.addInitScript(() => {
    const stats = { create: 0, delete: 0 };
    for (const proto of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const create = proto.createBuffer;
      const remove = proto.deleteBuffer;
      proto.createBuffer = function () {
        stats.create += 1;
        return create.call(this);
      };
      proto.deleteBuffer = function (buffer: WebGLBuffer | null) {
        stats.delete += 1;
        return remove.call(this, buffer);
      };
    }
    Object.defineProperty(window, "__glBuffers", { value: stats });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await ready(page);
  await areasReady(page);
  await expect.poll(async () => (await geometry(page))?.geometry?.code).toBe("01");
  const stable = await page.locator("canvas.cinematic-globe-canvas").evaluate(async (element) => {
    type Hook = { memoizedState: unknown; next: Hook | null };
    type Fiber = { memoizedState: Hook | null; return: Fiber | null };
    const key = Object.keys(element).find((name) => name.startsWith("__reactFiber"))!;
    let fiber: Fiber | null = (element as unknown as Record<string, Fiber>)[key];
    let scene: { getOutlinePositionBuffer?: () => object | null } | undefined;
    while (fiber && !scene) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        const value = hook.memoizedState as { scene?: { getOutlinePositionBuffer?: () => object | null } } | null;
        if (value?.scene?.getOutlinePositionBuffer) scene = value.scene;
      }
      fiber = fiber.return;
    }
    const first = scene?.getOutlinePositionBuffer?.() ?? null;
    await new Promise((resolve) => setTimeout(resolve, 160));
    return first !== null && scene?.getOutlinePositionBuffer?.() === first;
  });
  expect(stable).toBe(true);
  const before = await page.evaluate(() => ({ ...(window as unknown as { __glBuffers: { create: number; delete: number } }).__glBuffers }));
  for (let i = 0; i < 5; i++) {
    await page.getByRole("button", { name: /Bỏ chọn/ }).click();
    await expect(page).not.toHaveURL(/dia-phuong=/);
    await page.locator('button[data-locality-code="01"]').click();
    await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  }
  await page.getByRole("button", { name: /Bỏ chọn/ }).click();
  await page.waitForTimeout(500);
  const after = await page.evaluate(() => ({ ...(window as unknown as { __glBuffers: { create: number; delete: number } }).__glBuffers }));
  const net = (after.create - after.delete) - (before.create - before.delete);
  expect(net).toBeLessThan(40);
});

test("F34-surface: an oblique camera keeps the raised cap and side wall", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ca-mau");
  await ready(page);
  await areasReady(page);
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "96");
  const wallHolds = async () => {
    const mesh = (await geometry(page))?.geometry as {
      code?: string;
      status?: string;
      currentRadius?: number;
      baseRadius?: number;
      capMinRadius?: number;
      capMaxRadius?: number;
      wallBaseRadius?: number;
      wallTopRadius?: number;
      wallBaseHits?: number;
      wallTopHits?: number;
      wallOtherHits?: number;
      nonFinite?: number;
    } | null;
    if (!mesh || mesh.code !== "96" || mesh.status !== "admitted") return false;
    if (mesh.currentRadius == null || mesh.baseRadius == null || !(mesh.currentRadius > mesh.baseRadius)) return false;
    return mesh.nonFinite === 0
      && mesh.wallOtherHits === 0
      && (mesh.wallBaseHits ?? 0) > 0
      && (mesh.wallTopHits ?? 0) > 0
      && Math.abs((mesh.capMinRadius ?? 0) - mesh.currentRadius) < 1e-3
      && Math.abs((mesh.capMaxRadius ?? 0) - mesh.currentRadius) < 1e-3
      && Math.abs((mesh.wallBaseRadius ?? 0) - mesh.baseRadius) < 1e-3
      && Math.abs((mesh.wallTopRadius ?? 0) - mesh.currentRadius) < 1e-3;
  };
  await expect.poll(wallHolds, { timeout: 20000 }).toBe(true);
  // Aim southeast of Cà Mau so the province stays on the near side and is seen off the view axis.
  await inspectScene(page, { type: "view", view: { lat: 6.2, lng: 107.4, zoom: 5.2 } });
  await page.waitForTimeout(700);
  await expect.poll(wallHolds, { timeout: 20000 }).toBe(true);
  await expect(page).toHaveURL(/dia-phuong=ca-mau/);
  await expect(page.getByRole("heading", { name: "Tỉnh Cà Mau", exact: true })).toBeVisible();
});

test("F34-panel: X hides only the chooser", async ({ page }) => {
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi");
  await ready(page);
  await areasReady(page);
  const url = page.url();
  const historyLength = await page.evaluate(() => history.length);
  await page.getByRole("button", { name: "Ẩn bảng địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeHidden();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  expect(page.url()).toBe(url);
  expect(await page.evaluate(() => history.length)).toBe(historyLength);
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await expect(page.getByTestId("locality-chooser")).toBeVisible();
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  expect(page.url()).toBe(url);
});

type RestoredMesh = {
  code?: string;
  status?: string;
  baseRadius?: number;
  currentRadius?: number;
  targetRadius?: number;
  capMinRadius?: number;
  capMaxRadius?: number;
  wallBaseRadius?: number;
  wallTopRadius?: number;
  wallBaseHits?: number;
  wallTopHits?: number;
  wallOtherHits?: number;
  nonFinite?: number;
  outlineRadius?: number;
};

async function restoredSurface(page: Page): Promise<RestoredMesh | null> {
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
            getSelectedProvinceGeometry?: () => RestoredMesh | null;
            getOutlinePositionBuffer?: () => { array?: ArrayLike<number> } | null;
          };
        } | null;
        const scene = value?.scene;
        if (!scene?.getSelectedProvinceGeometry) continue;
        const mesh = scene.getSelectedProvinceGeometry();
        const array = scene.getOutlinePositionBuffer?.()?.array;
        const outlineRadius = array && array.length >= 3 ? Math.hypot(array[0], array[1], array[2]) : 0;
        return mesh ? { ...mesh, outlineRadius } : null;
      }
      fiber = fiber.return;
    }
    return null;
  });
}

async function assertRestoredClearance(page: Page, zoom: number) {
  const inspected = await inspectScene(page);
  expect(Math.abs(inspected.view.lat - 21.028)).toBeLessThan(0.02);
  expect(Math.abs(inspected.view.lng - 105.854)).toBeLessThan(0.02);
  expect(Math.abs(inspected.view.zoom - zoom)).toBeLessThan(0.02);
  await expect.poll(async () => {
    const mesh = await restoredSurface(page);
    return mesh?.code === "01" && mesh.status === "admitted" && mesh.targetRadius != null;
  }, { timeout: 20000 }).toBe(true);
  const mesh = await restoredSurface(page);
  const size = await page.locator("canvas.cinematic-globe-canvas").evaluate((canvas) => ({
    width: canvas.clientWidth,
    height: canvas.clientHeight,
  }));
  const pose = viewToCameraPose(inspected.view, size);
  const cameraRadius = Math.hypot(...pose.position);
  expect(mesh).not.toBeNull();
  const surface = mesh!;
  expect(surface.status).toBe("admitted");
  expect(surface.nonFinite).toBe(0);
  expect(surface.wallOtherHits).toBe(0);
  expect(surface.baseRadius).toBeGreaterThan(1);
  expect(surface.baseRadius!).toBeLessThan(cameraRadius);
  expect(surface.capMaxRadius!).toBeLessThan(cameraRadius);
  expect(surface.currentRadius!).toBeLessThan(cameraRadius);
  expect(surface.targetRadius!).toBeLessThan(cameraRadius);
  expect(surface.wallBaseRadius!).toBeLessThan(cameraRadius);
  expect(cameraRadius - surface.capMaxRadius!).toBeGreaterThan(pose.near);
  expect(Math.abs(surface.wallBaseRadius! - surface.baseRadius!)).toBeLessThan(1e-3);
  expect(Math.abs(surface.outlineRadius! - surface.currentRadius!)).toBeLessThan(1e-3);
  expect(surface.outlineRadius!).toBeLessThan(cameraRadius);
  if ((surface.wallTopHits ?? 0) > 0) expect(surface.wallTopRadius!).toBeLessThan(cameraRadius);
  if (zoom === 18) expect(surface.baseRadius!).toBeLessThan(1.0004);
  await expect(page.getByRole("heading", { name: "Thành phố Hà Nội", exact: true })).toBeVisible();
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
}

for (const motion of ["reduce", "no-preference"] as const) {
  test(`F34-restored-camera: direct zoom 11 and 18 stay outside the cap (${motion})`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: motion });
    for (const zoom of [11, 18]) {
      await page.goto(`/?noi-dung=dia-phuong&dia-phuong=ha-noi&ban-do=21.028,105.854,${zoom}`);
      await ready(page);
      await areasReady(page);
      await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
      await assertRestoredClearance(page, zoom);
      await expect(page).toHaveURL(new RegExp(`ban-do=21\\.028(?:%2C|,)105\\.854(?:%2C|,)${zoom}(?:&|$)`));
    }
  });
}

test("F34-restored-camera: a delayed area build uses the newest close pose", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  let release = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/maps/history-vietnam-province-areas.geojson", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/?noi-dung=dia-phuong&dia-phuong=ha-noi&ban-do=21.028,105.854,11");
  await ready(page);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-province-areas", "loading");
  const moved = await inspectScene(page, { type: "view", view: { lat: 21.028, lng: 105.854, zoom: 18 } });
  expect(Math.abs(moved.view.zoom - 18)).toBeLessThan(0.02);
  release();
  await areasReady(page);
  await expect(page.getByTestId("locality-card-cluster")).toHaveAttribute("data-locality-code", "01");
  await assertRestoredClearance(page, 18);
  await expect(page).toHaveURL(/ban-do=21\.028(?:%2C|,)105\.854(?:%2C|,)11(?:&|$)/);
});
