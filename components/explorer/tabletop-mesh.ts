import * as THREE from "three";
import type { LinearRing, MapFootprint, MapProjection } from "@/lib/explorer/types";

export const TABLETOP_TOP_Y = 3;
export const TABLETOP_BASE_Y = 0;

function ringToVector2(ring: LinearRing, projection: MapProjection, shouldBeClockwise: boolean): THREE.Vector2[] {
  const limit =
    ring.length >= 2 &&
    ring[0][0] === ring[ring.length - 1][0] &&
    ring[0][1] === ring[ring.length - 1][1]
      ? ring.length - 1
      : ring.length;

  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < limit; i++) {
    const [lng, lat] = ring[i];
    const { x, z } = projection.project(lng, lat);
    if (!Number.isFinite(x) || !Number.isFinite(z)) continue;
    const vx = x;
    const vy = -z;
    if (pts.length === 0 || pts[pts.length - 1].x !== vx || pts[pts.length - 1].y !== vy) {
      pts.push(new THREE.Vector2(vx, vy));
    }
  }

  if (pts.length < 3) return [];

  const isCw = THREE.ShapeUtils.isClockWise(pts);
  if (isCw !== shouldBeClockwise) {
    pts.reverse();
  }

  return pts;
}

export function buildTabletopMesh(footprint: MapFootprint, projection: MapProjection): THREE.Group {
  const root = new THREE.Group();
  root.name = "vietnam-tabletop-root";

  const topMaterial = new THREE.MeshStandardMaterial({
    color: 0xdec89c,
    roughness: 0.76,
    metalness: 0.05,
    name: "tabletop-top-material",
  });

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a5830,
    roughness: 0.84,
    metalness: 0.08,
    name: "tabletop-side-material",
  });

  const materials = [topMaterial, sideMaterial];

  for (const feature of footprint.features) {
    const polygons =
      feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;

    const shapes: THREE.Shape[] = [];

    for (const poly of polygons) {
      if (poly.length === 0) continue;
      const outerPts = ringToVector2(poly[0], projection, false);
      if (outerPts.length < 3) continue;

      const shape = new THREE.Shape(outerPts);
      for (let h = 1; h < poly.length; h++) {
        const holePts = ringToVector2(poly[h], projection, true);
        if (holePts.length >= 3) {
          shape.holes.push(new THREE.Path(holePts));
        }
      }
      shapes.push(shape);
    }

    if (shapes.length === 0) continue;

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: TABLETOP_TOP_Y - TABLETOP_BASE_Y,
      bevelEnabled: false,
      steps: 1,
      curveSegments: 1,
    });

    geometry.rotateX(-Math.PI / 2);
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.name = `tabletop-part-${feature.properties.partId}`;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      partId: feature.properties.partId,
      sourceId: feature.properties.sourceId,
      name: feature.properties.name ?? feature.properties.partId,
      partKind: feature.properties.partKind ?? "land",
    };

    root.add(mesh);
  }

  root.userData.materials = materials;
  return root;
}

export function disposeTabletopMesh(root: THREE.Group): void {
  const disposedGeometries = new Set<THREE.BufferGeometry>();
  const disposedMaterials = new Set<THREE.Material>();

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry && !disposedGeometries.has(mesh.geometry)) {
      disposedGeometries.add(mesh.geometry);
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of list) {
        if (mat && !disposedMaterials.has(mat)) {
          disposedMaterials.add(mat);
          mat.dispose();
        }
      }
    }
  });
}
