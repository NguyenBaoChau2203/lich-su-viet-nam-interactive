import { readFileSync } from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { describe, expect, it } from "vitest";
import { buildTabletopMesh, disposeTabletopMesh } from "@/components/explorer/tabletop-mesh";
import { createMapProjection, getFootprintBounds } from "@/lib/explorer/projection";
import type { MapFootprint } from "@/lib/explorer/types";

// Explicitly synthetic geometry for mathematical/extrusion verification — not historical or geographic data
const syntheticFootprint: MapFootprint = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { partId: "synthetic-mainland-with-hole", sourceId: "synthetic" },
      geometry: {
        type: "Polygon",
        coordinates: [
          // Outer ring (west=0..4, south=0..6)
          [
            [0, 0],
            [4, 0],
            [4, 6],
            [0, 6],
            [0, 0],
          ],
          // Inner hole ring (1..2, 1..2)
          [
            [1, 1],
            [1, 2],
            [2, 2],
            [2, 1],
            [1, 1],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: { partId: "synthetic-east-north-island", sourceId: "synthetic" },
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [6, 7],
              [8, 7],
              [8, 9],
              [6, 9],
              [6, 7],
            ],
          ],
        ],
      },
    },
  ],
};

describe("buildTabletopMesh and disposeTabletopMesh (synthetic & real footprints)", () => {
  it("extrudes a synthetic polygon with a hole and a separate island with Y spanning 0..3 and matching north/east orientation", () => {
    const bounds = getFootprintBounds(syntheticFootprint);
    const projection = createMapProjection(bounds, 100);
    const group = buildTabletopMesh(syntheticFootprint, projection);
    group.updateMatrixWorld(true);

    const meshes: THREE.Mesh[] = [];
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        meshes.push(obj as THREE.Mesh);
      }
    });

    expect(meshes.length).toBeGreaterThanOrEqual(2);
    const partIds = new Set(meshes.map((m) => m.userData.partId as string));
    expect(partIds.has("synthetic-mainland-with-hole")).toBe(true);
    expect(partIds.has("synthetic-east-north-island")).toBe(true);

    const worldVertex = new THREE.Vector3();
    let minY = Infinity;
    let maxY = -Infinity;
    let hasSideNormal = false;

    for (const mesh of meshes) {
      const pos = mesh.geometry.getAttribute("position");
      const norm = mesh.geometry.getAttribute("normal");
      expect(pos.count).toBeGreaterThan(0);

      for (let i = 0; i < pos.count; i++) {
        worldVertex.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld);
        expect(Number.isFinite(worldVertex.x)).toBe(true);
        expect(Number.isFinite(worldVertex.y)).toBe(true);
        expect(Number.isFinite(worldVertex.z)).toBe(true);
        if (worldVertex.y < minY) minY = worldVertex.y;
        if (worldVertex.y > maxY) maxY = worldVertex.y;
      }

      if (norm) {
        for (let i = 0; i < norm.count; i++) {
          const ny = norm.getY(i);
          if (Math.abs(ny) < 0.2) {
            hasSideNormal = true;
            break;
          }
        }
      }
    }

    expect(minY).toBeCloseTo(0, 5);
    expect(maxY).toBeCloseTo(3, 5);
    expect(hasSideNormal).toBe(true);

    // Check orientation: synthetic-east-north-island is in the east (+X) and north (-Z) of the bounds center (lng=4, lat=4.5)
    const islandMesh = meshes.find((m) => m.userData.partId === "synthetic-east-north-island")!;
    const islandBox = new THREE.Box3().setFromObject(islandMesh);
    const islandCenter = islandBox.getCenter(new THREE.Vector3());
    const expectedIslandCenter = projection.project(7, 8);
    expect(islandCenter.x).toBeGreaterThan(0);
    expect(islandCenter.z).toBeLessThan(0);
    expect(islandCenter.x).toBeCloseTo(expectedIslandCenter.x, 4);
    expect(islandCenter.z).toBeCloseTo(expectedIslandCenter.z, 4);

    // Check hole preservation: raycast downward at projected hole center (lng=1.5, lat=1.5) should miss the mainland mesh
    const mainlandMesh = meshes.find((m) => m.userData.partId === "synthetic-mainland-with-hole")!;
    const holeCenter = projection.project(1.5, 1.5);
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(holeCenter.x, 10, holeCenter.z),
      new THREE.Vector3(0, -1, 0),
    );
    expect(raycaster.intersectObject(mainlandMesh, true)).toHaveLength(0);

    // Raycast on solid mainland (lng=3, lat=4) should hit the top face at Y=3
    const solidPoint = projection.project(3, 4);
    raycaster.set(new THREE.Vector3(solidPoint.x, 10, solidPoint.z), new THREE.Vector3(0, -1, 0));
    const hits = raycaster.intersectObject(mainlandMesh, true);
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0].point.y).toBeCloseTo(3, 4);

    expect(() => {
      disposeTabletopMesh(group);
      disposeTabletopMesh(group);
    }).not.toThrow();
  });

  it("extrudes the reviewed Vietnam tabletop footprint within the 80,000-triangle budget", () => {
    const raw = readFileSync(
      path.resolve(import.meta.dirname, "..", "..", "public", "maps", "vietnam-tabletop.geojson"),
      "utf8",
    );
    const footprint = JSON.parse(raw) as MapFootprint;
    const projection = createMapProjection(getFootprintBounds(footprint), 100);
    const group = buildTabletopMesh(footprint, projection);

    let triangles = 0;
    const partIds = new Set<string>();
    group.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh) {
        partIds.add(mesh.userData.partId as string);
        const index = mesh.geometry.getIndex();
        const pos = mesh.geometry.getAttribute("position");
        triangles += index ? index.count / 3 : pos.count / 3;
      }
    });

    expect(partIds.has("mainland")).toBe(true);
    expect(partIds.has("phu-quoc")).toBe(true);
    expect(partIds.has("con-dao")).toBe(true);
    expect(partIds.has("hoang-sa")).toBe(true);
    expect(partIds.has("truong-sa")).toBe(true);
    expect(triangles).toBeGreaterThan(1000);
    expect(triangles).toBeLessThanOrEqual(80_000);

    disposeTabletopMesh(group);
  });
});
