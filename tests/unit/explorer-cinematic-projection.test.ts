import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Mesh, MeshBasicMaterial, PerspectiveCamera, Raycaster, Vector3 } from "three";
import { createGlobeViewport, geoToVector, projectToScreen, dot, sub, surfaceLayerRadii, type ScreenCamera } from "@/lib/explorer/cinematic/projection";
import { viewToCameraPose, vietnamOverviewView } from "@/lib/explorer/cinematic/camera";
import { createEarthGeometry } from "@/lib/explorer/cinematic/materials";

const size = { width: 1440, height: 900 };
const front: ScreenCamera = {
  position: [0, 0, 3], forward: [0, 0, -1], up: [0, 1, 0],
  fovDeg: 60, anchor: { x: 0.5, y: 0.5 },
};
const labels = JSON.parse(readFileSync("public/maps/history-vietnam-labels.json", "utf8")).labels as
  { id: string; lng: number; lat: number }[];

describe("local surface depth and HTML alignment", () => {
  it.each([8, 10, 11, 18])("keeps all geographic layers in front of the near plane and within 1px of true anchors at zoom %s", zoom => {
    for (const height of [720, 768, 900, 1080]) {
      const viewport = { width: Math.round(height * 16 / 9), height };
      const view = { lat: 21.03, lng: 105.84, zoom };
      const pose = viewToCameraPose(view, viewport);
      const radii = surfaceLayerRadii(pose.distanceToTarget);
      // Surface samples 100px from the centre, at each supported scale.
      const offset = 100 / (512 * 2 ** zoom / 360);
      const at = { lat: view.lat + offset * 0.4, lng: view.lng + offset };
      const anchor = projectToScreen(pose, viewport, geoToVector(at.lat, at.lng))!;
      for (const radius of Object.values(radii)) {
        const position = geoToVector(at.lat, at.lng, radius);
        const screen = projectToScreen(pose, viewport, position)!;
        expect(dot(sub(position, pose.position), pose.forward)).toBeGreaterThan(pose.near);
        expect(Math.hypot(screen.x - anchor.x, screen.y - anchor.y)).toBeLessThan(1);
      }
    }
  });
});

/** Independent oracle: the installed Three camera and matrices, without a WebGL mock. */
function threeCamera(pose: ScreenCamera) {
  const camera = new PerspectiveCamera(pose.fovDeg, size.width / size.height, 0.001, 100);
  camera.position.set(...pose.position);
  camera.up.set(...pose.up);
  camera.lookAt(new Vector3(...pose.position).add(new Vector3(...pose.forward)));
  camera.setViewOffset(size.width, size.height, (0.5 - pose.anchor.x) * size.width,
    (0.5 - pose.anchor.y) * size.height, size.width, size.height);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
}

describe("GlobeViewport.project(lng, lat): stage CSS pixels and Earth occlusion", () => {
  it.each(["hanoi", "hue", "ho-chi-minh-city"])("aligns the existing sourced %s anchor with Three's actual camera", (id) => {
    const anchor = labels.find((label) => label.id === id)!;
    const pose = viewToCameraPose(vietnamOverviewView(size), size);
    const point = createGlobeViewport(pose, size).project(anchor.lng, anchor.lat);
    expect(point).not.toBeNull();
    const lat = anchor.lat * Math.PI / 180;
    const lng = anchor.lng * Math.PI / 180;
    const projected = new Vector3(Math.cos(lat) * Math.sin(lng), Math.sin(lat), Math.cos(lat) * Math.cos(lng))
      .project(threeCamera(pose));
    expect(point!.x).toBeCloseTo((projected.x + 1) * size.width / 2, 7);
    expect(point!.y).toBeCloseTo((1 - projected.y) * size.height / 2, 7);
  });

  it("takes longitude first and keeps northern, central and southern source anchors in geographic order", () => {
    const viewport = createGlobeViewport(viewToCameraPose(vietnamOverviewView(size), size), size);
    const points = ["hanoi", "hue", "ho-chi-minh-city"].map((id) => {
      const anchor = labels.find((label) => label.id === id)!;
      expect(viewport.project(anchor.lat, anchor.lng)).toBeNull();
      return viewport.project(anchor.lng, anchor.lat)!;
    });
    expect(points[0].y).toBeLessThan(points[1].y);
    expect(points[1].y).toBeLessThan(points[2].y);
    expect(points[1].x).toBeGreaterThan(points[0].x);
  });

  it("rejects far-side points even when their pinhole projection lies inside the viewport", () => {
    const viewport = createGlobeViewport(front, size);
    expect(viewport.project(0, 0)).toEqual({ x: 720, y: 450 });
    expect(viewport.project(180, 0)).toBeNull();
    // Still on the +Z hemisphere, but beyond the perspective horizon at acos(1/2) = 60°.
    const close = createGlobeViewport({ ...front, position: [0, 0, 2] }, size);
    expect(close.project(59, 0)).not.toBeNull();
    expect(close.project(60, 0)).toBeNull();
    expect(close.project(61, 0)).toBeNull();
  });

  it("hides a source anchor at the antipodal camera while retaining the near-side anchor", () => {
    const hanoi = labels.find((label) => label.id === "hanoi")!;
    const opposite = viewToCameraPose({ lat: -hanoi.lat, lng: hanoi.lng - 180, zoom: 1.2 }, size);
    const viewport = createGlobeViewport(opposite, size);
    expect(viewport.project(hanoi.lng, hanoi.lat)).toBeNull();
    expect(viewport.project(hanoi.lng - 180, -hanoi.lat)).not.toBeNull();
  });

  it("projects both sides of ±180° continuously and accepts the two equivalent seam coordinates", () => {
    const viewport = createGlobeViewport({ ...front, position: [0, 0, -3], forward: [0, 0, 1] }, size);
    expect(viewport.project(180, 0)!.x).toBeCloseTo(720, 9);
    expect(viewport.project(-180, 0)!.x).toBeCloseTo(720, 9);
    const east = viewport.project(179.999, 10)!;
    const west = viewport.project(-179.999, 10)!;
    expect(Math.abs(east.x - west.x)).toBeLessThan(0.02);
    expect(east.y).toBeCloseTo(west.y, 9);
    expect(viewport.project(0, 0)).toBeNull();
  });

  it("keeps poles finite without making longitude change the pole's position", () => {
    const viewport = createGlobeViewport({ ...front, position: [0, 3, 0], forward: [0, -1, 0], up: [0, 0, -1] }, size);
    for (const lng of [-180, -90, 0, 90, 180]) {
      const point = viewport.project(lng, 90)!;
      expect(point.x).toBeCloseTo(720, 8);
      expect(point.y).toBeCloseTo(450, 8);
      expect(viewport.project(lng, -90)).toBeNull();
    }
  });

  it.each([[NaN, 0], [0, NaN], [Infinity, 0], [0, -Infinity], [181, 0], [-181, 0], [0, 90.01], [0, -90.01]])(
    "rejects invalid longitude/latitude (%s, %s) instead of wrapping or guessing", (lng, lat) => {
      expect(createGlobeViewport(front, size).project(lng, lat)).toBeNull();
    },
  );

  it("reserves the complete 32px marker hit target at every stage edge", () => {
    for (const [x, y, visible] of [
      [0.16, 0.5, true], [0.84, 0.5, true], [0.5, 0.16, true], [0.5, 0.84, true],
      [0.159, 0.5, false], [0.841, 0.5, false], [0.5, 0.159, false], [0.5, 0.841, false],
      [-1, 0.5, false], [2, 0.5, false],
    ] as const) {
      const point = createGlobeViewport({ ...front, anchor: { x, y } }, { width: 100, height: 100 }).project(0, 0);
      expect(point !== null, `anchor ${x}, ${y}`).toBe(visible);
    }
  });

  it("rejects points outside a close camera's visible viewport", () => {
    const viewport = createGlobeViewport({ ...front, position: [0, 0, 1.1] }, { width: 100, height: 100 });
    expect(viewport.project(0, 0)).not.toBeNull();
    expect(viewport.project(10, 0)).toBeNull();
    expect(viewport.project(0, 10)).toBeNull();
  });

  it("returns CSS pixels independent of drawing-buffer density and page offsets", () => {
    const viewport = createGlobeViewport(front, { width: 800, height: 600 });
    expect(viewport.width).toBe(800);
    expect(viewport.height).toBe(600);
    expect(viewport.project(0, 0)).toEqual({ x: 400, y: 300 });
  });

  it("rejects invalid camera/stage values and respects the camera's clipping planes", () => {
    for (const badSize of [{ width: 0, height: 900 }, { width: 1440, height: -1 }, { width: Infinity, height: 900 }]) {
      expect(createGlobeViewport(front, badSize).project(0, 0)).toBeNull();
    }
    for (const camera of [
      { ...front, position: [0, 0, 0] as const }, { ...front, fovDeg: 0 }, { ...front, fovDeg: NaN },
      { ...front, forward: [0, 0, 0] as const }, { ...front, anchor: { x: NaN, y: 0.5 } },
      { ...front, near: 2.1, far: 10 }, { ...front, near: 0.01, far: 1.9 },
    ]) expect(createGlobeViewport(camera, size).project(0, 0)).toBeNull();
    expect(createGlobeViewport({ ...front, forward: [0, 0, 1] }, size).project(0, 0)).toBeNull();
  });
});

describe("Earth mesh / cap texture alignment", () => {
  it.each(["hanoi", "hue", "ho-chi-minh-city"])("maps the actual Earth triangle at %s to the matching georeferenced texture UV", (id) => {
    const { lat, lng } = labels.find((label) => label.id === id)!;
    const phi = lat * Math.PI / 180; const theta = lng * Math.PI / 180;
    const direction = new Vector3(Math.cos(phi) * Math.sin(theta), Math.sin(phi), Math.cos(phi) * Math.cos(theta));
    const geometry = createEarthGeometry(); const material = new MeshBasicMaterial();
    try {
      const mesh = new Mesh(geometry, material);
      mesh.updateMatrixWorld(true);
      const hit = new Raycaster(direction.clone().multiplyScalar(2), direction.clone().negate()).intersectObject(mesh)[0];
      expect(hit).toBeDefined();
      expect(hit.uv!.x).toBeCloseTo(0.5 + lng / 360, 4);
      expect(hit.uv!.y).toBeCloseTo(0.5 + lat / 180, 4);
    } finally { geometry.dispose(); material.dispose(); }
  });
});
