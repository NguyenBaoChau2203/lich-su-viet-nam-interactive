import { readFileSync } from "node:fs";
import type { Page } from "@playwright/test";
import sharp from "sharp";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import type { JourneyPathRequest } from "@/lib/explorer/cinematic/journey-path";
import type { ProvinceBoundaryCollection } from "@/lib/explorer/cinematic/province-boundaries";
import type { MapView } from "@/lib/explorer/map-view";

type SceneAction = { type: "stats" | "clear-path" | "clear-province" | "clear-country" | "capture-start" | "capture-end" }
  | { type: "view"; view: MapView }
  | { type: "path"; request: JourneyPathRequest }
  | { type: "province"; data: ProvinceBoundaryCollection }
  | { type: "visible"; visible: boolean };

/** Inspect the mounted production scene; no debug method/global is added to the app. */
export async function inspectScene(page: Page, action: SceneAction = { type: "stats" }) {
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
    if (!scene) throw new Error("Mounted cinematic runtime not found");
    if (action.type === "view") scene.setView(action.view);
    if (action.type === "path") scene.setJourneyPath(action.request);
    if (action.type === "province") scene.setProvinceBoundaries(action.data);
    if (action.type === "clear-path") scene.setJourneyPath(null);
    if (action.type === "clear-province") scene.setProvinceBoundaries(null);
    if (action.type === "clear-country") scene.setCountryBoundaries(null);
    if (action.type === "visible") scene.setVisible(action.visible);
    if (action.type === "capture-start") scene.beginFrameCapture();
    const capture = action.type === "capture-end" ? scene.endFrameCapture() : undefined;
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    return { view: scene.getView(), stats: scene.stats(), capture };
  }, action);
}

/** Deliberately synthetic line, never a source-approved province artifact. */
export function syntheticProvinceFixture(): ProvinceBoundaryCollection {
  const manifest = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"));
  return {
    type: "FeatureCollection", schemaVersion: 1, referenceFramework: "VN-34-2025",
    sourceTimestamp: "2026-10-24T09:54:11Z", sourceSnapshotSha256: "0".repeat(64),
    license: { id: "TEST-ONLY", url: "https://example.invalid/synthetic", attribution: "Synthetic renderer fixture; no real boundary claim" },
    units: manifest.units.map((u: { code: string; officialName: string; osmRelationId: number; observedRelationVersion: number }) => ({
      code: u.code, name: u.officialName, sourceId: `fixture:${u.osmRelationId}`, sourceRevision: String(u.observedRelationVersion),
    })),
    features: [{ type: "Feature", id: "synthetic-local-line", properties: {
      boundaryKind: "province-interior", provinceCodes: ["01", "24"], sourceEdgeIds: ["fixture-only-edge"],
    }, geometry: { type: "LineString", coordinates: [[105.84, 20.93], [105.84, 21.13]] } }],
  };
}

export async function pixelDifference(a: Buffer, b: Buffer, threshold = 12) {
  const first = await sharp(a).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const second = await sharp(b).removeAlpha().raw().toBuffer();
  if (first.data.length !== second.length) throw new Error("Canvas dimensions changed during comparison");
  let pixels = 0;
  for (let i = 0; i < second.length; i += first.info.channels) {
    if (Math.max(...[0, 1, 2].map(c => Math.abs(first.data[i + c] - second[i + c]))) > threshold) pixels++;
  }
  return pixels;
}
