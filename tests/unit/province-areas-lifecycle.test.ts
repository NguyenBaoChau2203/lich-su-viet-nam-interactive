import { describe, expect, it, vi } from "vitest";
import { BufferGeometry, Float32BufferAttribute, Raycaster, Vector3 } from "three";

vi.mock("@/lib/explorer/cinematic/geography", async () => {
  const actual = await vi.importActual<typeof import("@/lib/explorer/cinematic/geography")>("@/lib/explorer/cinematic/geography");
  return {
    ...actual,
    createSurfaceCap: async () => {
      const geometry = new BufferGeometry();
      geometry.setAttribute("position", new Float32BufferAttribute([
        0, 0, 1,
        0.1, 0, 1,
        0, 0.1, 1,
      ], 3));
      return geometry;
    },
  };
});

import { createProvinceAreaLayer, PROVINCE_AREA_BASE_RADIUS, type ProvinceSelectionGeometry } from "@/lib/explorer/cinematic/province-areas";
import { isEarthOccluded, vectorToGeo } from "@/lib/explorer/cinematic/projection";
import { viewToCameraPose } from "@/lib/explorer/cinematic/camera";
import { parseProvinceAreas } from "@/lib/locality/province-areas";

const square = {
  type: "FeatureCollection",
  schemaVersion: 1,
  boundaryKind: "province-area",
  referenceFramework: "VN-34-2025",
  coverageStatus: "partial-demo",
  admittedCount: 1,
  sourceTimestamp: "2026-10-23T20:20:51Z",
  sourceSnapshotSha256: "test",
  license: { id: "ODbL-1.0", url: "https://opendatacommons.org/licenses/odbl/1-0/", attribution: "© OpenStreetMap contributors" },
  features: [
    {
      type: "Feature",
      id: "province-area:01",
      properties: {
        code: "01",
        officialName: "Thành phố Hà Nội",
        boundaryKind: "province-area",
        referenceFramework: "VN-34-2025",
        osmRelationId: 1,
        partCount: 1,
        holeCount: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [[[105, 21], [106, 21], [106, 22], [105, 22], [105, 21]]],
      },
    },
  ],
};

describe("province clear lifecycle and outline storage", () => {
  it("does not let camera clearance raise a province that is clearing", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: { width: 1280, height: 720 } });
    layer.setCameraClearance({ cameraRadius: 2.4, near: 0.05 });
    layer.setSelected("01", { nonce: 1, instant: false });
    layer.update(performance.now() + 40);
    layer.setSelected(null, { nonce: 2, instant: false });
    layer.setCameraClearance({ cameraRadius: 2.2, near: 0.05 });
    layer.setCameraClearance({ cameraRadius: 3, near: 0.05 });
    const settled = layer.update(performance.now() + 2000);
    expect(settled).toBe(false);
    expect(layer.getSelectedGeometry()).toBeNull();
    expect(layer.stats().selected).toBeNull();
    layer.dispose();
  }, 30000);

  it("keeps the same outline interleaved buffer through a lift and a camera retarget", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: { width: 1280, height: 720 } });
    layer.setCameraClearance({ cameraRadius: 2.4, near: 0.05 });
    layer.setSelected("01", { nonce: 1, instant: true });
    const buffer = layer.getOutlinePositionBuffer();
    expect(buffer).not.toBeNull();
    layer.setCameraClearance({ cameraRadius: 1.004, near: 0.001 });
    layer.update(performance.now());
    expect(layer.getOutlinePositionBuffer()).toBe(buffer);
    layer.setSelected("01", { nonce: 2, instant: false });
    const moving = layer.getOutlinePositionBuffer();
    layer.update(performance.now());
    expect(layer.getOutlinePositionBuffer()).toBe(moving);
    layer.setSelected("01", { nonce: 2, instant: true });
    const geometry = layer.getSelectedGeometry();
    expect(geometry?.status).toBe("admitted");
    expect(geometry?.nonFinite).toBe(0);
    expect(geometry?.wallOtherHits).toBe(0);
    expect(geometry?.wallBaseHits).toBeGreaterThan(0);
    expect(geometry?.wallTopHits).toBeGreaterThan(0);
    expect(geometry?.capMinRadius).toBeGreaterThan(PROVINCE_AREA_BASE_RADIUS);
    layer.dispose();
  }, 30000);
});

describe("earth occlusion", () => {
  it("hides the far side and the tangent, and keeps a facing point visible", () => {
    const camera = [0, 0, 3] as const;
    const front = vectorToGeo([0, 0, 1]);
    const back = vectorToGeo([0, 0, -1]);
    const limb = vectorToGeo([Math.sqrt(8 / 9), 0, 1 / 3]);
    expect(isEarthOccluded(camera, front.lat, front.lng)).toBe(false);
    expect(isEarthOccluded(camera, back.lat, back.lng)).toBe(true);
    expect(isEarthOccluded(camera, limb.lat, limb.lng)).toBe(true);
    const pose = viewToCameraPose({ lat: -21, lng: -74, zoom: 7 }, { width: 1280, height: 720 });
    expect(isEarthOccluded(pose.position, 21.02, 105.84)).toBe(true);
    expect(isEarthOccluded(pose.position, -21, -74)).toBe(false);
  });
});

describe("restored close-camera clearance", () => {
  const stage = { width: 1280, height: 720 };

  function restoredPose(zoom: number, lat = 21.028, lng = 105.854) {
    const pose = viewToCameraPose({ lat, lng, zoom }, stage);
    return { pose, cameraRadius: Math.hypot(...pose.position) };
  }

  function expectOutside(geometry: ProvinceSelectionGeometry | null, cameraRadius: number, near: number) {
    expect(geometry).not.toBeNull();
    const mesh = geometry!;
    expect(mesh.status).toBe("admitted");
    expect(mesh.nonFinite).toBe(0);
    expect(mesh.wallOtherHits).toBe(0);
    expect(mesh.baseRadius).toBeGreaterThan(1);
    expect(mesh.baseRadius).toBeLessThan(cameraRadius);
    expect(mesh.capMaxRadius).toBeLessThan(cameraRadius);
    expect(mesh.currentRadius).toBeLessThan(cameraRadius);
    expect(mesh.targetRadius).toBeLessThan(cameraRadius);
    expect(cameraRadius - mesh.capMaxRadius!).toBeGreaterThan(near);
    expect(mesh.wallBaseRadius).toBeLessThan(cameraRadius);
    expect(Math.abs(mesh.wallBaseRadius! - mesh.baseRadius)).toBeLessThan(1e-4);
    expect(Math.abs(mesh.capMinRadius! - mesh.currentRadius)).toBeLessThan(1e-4);
    expect(Math.abs(mesh.capMaxRadius! - mesh.currentRadius)).toBeLessThan(1e-4);
  }

  it("keeps a direct zoom 11 and legacy zoom 18 selection outside the camera", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: stage });
    for (const zoom of [11, 18]) {
      const { pose, cameraRadius } = restoredPose(zoom);
      layer.setCameraClearance({
        cameraRadius,
        near: pose.near,
        distanceToTarget: pose.distanceToTarget,
      });
      layer.setSelected("01", { nonce: zoom, instant: true });
      const geometry = layer.getSelectedGeometry();
      expectOutside(geometry, cameraRadius, pose.near);
      if (zoom === 18) expect(geometry!.baseRadius).toBeLessThan(PROVINCE_AREA_BASE_RADIUS);
    }
    layer.dispose();
  }, 30000);

  it("moves an already selected cap when the close pose arrives after construction", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: stage });
    layer.setSelected("01", { nonce: 1, instant: true });
    expect(layer.getSelectedGeometry()?.currentRadius).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS + 0.006, 4);
    const close = restoredPose(18);
    layer.setCameraClearance({
      cameraRadius: close.cameraRadius,
      near: close.pose.near,
      distanceToTarget: close.pose.distanceToTarget,
    });
    expectOutside(layer.getSelectedGeometry(), close.cameraRadius, close.pose.near);
    const open = viewToCameraPose({ lat: 21.028, lng: 105.854, zoom: 4 }, stage);
    layer.setCameraClearance({
      cameraRadius: Math.hypot(...open.position),
      near: open.near,
      distanceToTarget: open.distanceToTarget,
    });
    const restored = layer.getSelectedGeometry();
    expect(restored?.baseRadius).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS, 6);
    expect(restored?.currentRadius).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS + 0.006, 4);
    layer.dispose();
  }, 30000);

  it("keeps a zero-lift selection after the normal-motion interval", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: stage });
    const close = restoredPose(18);
    layer.setCameraClearance({
      cameraRadius: close.cameraRadius,
      near: close.pose.near,
      distanceToTarget: close.pose.distanceToTarget,
    });
    layer.setSelected("01", { nonce: 1, instant: false });
    expect(layer.update(performance.now() + 1000)).toBe(false);
    expectOutside(layer.getSelectedGeometry(), close.cameraRadius, close.pose.near);
    layer.dispose();
  }, 30000);

  it("picks the displayed base while the camera is inside the old constant shell", async () => {
    const layer = await createProvinceAreaLayer(parseProvinceAreas(square), { resolution: stage });
    const { pose, cameraRadius } = restoredPose(18, 0, 0);
    layer.setCameraClearance({
      cameraRadius,
      near: pose.near,
      distanceToTarget: pose.distanceToTarget,
    });
    const raycaster = new Raycaster();
    raycaster.set(new Vector3(...pose.position), new Vector3(...pose.forward));
    expect(layer.pick(raycaster, cameraRadius - 1)).toBe("01");
    layer.dispose();
  }, 30000);
});
