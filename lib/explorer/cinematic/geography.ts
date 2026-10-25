import { BufferGeometry, type Material, type Mesh } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import type { LinearRing, MapGeometry, PolygonCoordinates } from "@/lib/explorer/types";
import { add, dot, geoToVector, normalize, scale } from "@/lib/explorer/cinematic/projection";

export type HighlightCollection = {
  type: "FeatureCollection";
  features: { type: "Feature"; properties?: unknown; geometry: MapGeometry }[];
};

/** d3-geo's spherical bounds expect clockwise exteriors (opposite to RFC 7946).
 * Normalize only the render copy; otherwise a valid counterclockwise exterior can describe the
 * globe's complement to ConicPolygonGeometry, selecting its polar triangulator and filling holes.
 */
function capWinding(polygon: PolygonCoordinates): number[][][] {
  const area = (ring: LinearRing) => {
    let total = 0; let previousLng = ring[0][0];
    for (let i = 1; i < ring.length; i++) {
      const delta = ((ring[i][0] - previousLng + 540) % 360) - 180;
      const nextLng = previousLng + delta;
      total += previousLng * ring[i][1] - nextLng * ring[i - 1][1];
      previousLng = nextLng;
    }
    return total;
  };
  return polygon.map((ring, index) => {
    const copy = ring.map(([lng, lat]) => [lng, lat]);
    return (index === 0 ? area(ring) > 0 : area(ring) < 0) ? copy.reverse() : copy;
  });
}

/** Outline every outer AND inner ring, including every MultiPolygon member. No generated island points. */
export function surfaceOutlineSegments(collection: HighlightCollection, radius: number, stepDeg = 0.25): Float32Array {
  const out: number[] = [];
  for (const feature of collection.features) {
    const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const polygon of polygons) for (const ring of polygon) {
      for (let index = 0; index < ring.length - 1; index++) {
        const [lngA, latA] = ring[index]; const [lngB, latB] = ring[index + 1];
        const a = geoToVector(latA, lngA); const b = geoToVector(latB, lngB);
        const angle = Math.acos(Math.min(1, Math.max(-1, dot(a, b)))) * 180 / Math.PI;
        const pieces = Math.max(1, Math.ceil(angle / stepDeg));
        let previous = scale(a, radius);
        for (let piece = 1; piece <= pieces; piece++) {
          const t = piece / pieces;
          const point = scale(normalize(add(scale(a, 1 - t), scale(b, t))), radius);
          out.push(...previous, ...point); previous = point;
        }
      }
    }
  }
  return new Float32Array(out);
}

/** Browser-only cap triangulation. The resulting mesh has no sides/base and preserves source holes. */
export async function createSurfaceCap(collection: HighlightCollection, material: Material): Promise<BufferGeometry> {
  const { default: ThreeGlobe } = await import("three-globe");
  const polygonCount = collection.features.reduce((count, feature) => count
    + (feature.geometry.type === "Polygon" ? 1 : feature.geometry.coordinates.length), 0);
  const builder = new ThreeGlobe({ waitForGlobeReady: false, animateIn: false })
    .showGlobe(false).showAtmosphere(false).polygonsTransitionDuration(0)
    .polygonGeoJsonGeometry("geometry")
    // At 1° interior resolution triangle sagitta is below this near-surface lift.
    .polygonAltitude(0.0004).polygonCapCurvatureResolution(1)
    .polygonCapMaterial(() => material).polygonSideColor(() => "").polygonStrokeColor(() => false)
    // Kapsule stamps IDs on its data. Keep both its mutations and winding adaptation off source data.
    .polygonsData(collection.features.map((feature) => ({ ...feature, geometry: feature.geometry.type === "Polygon"
      ? { type: "Polygon", coordinates: capWinding(feature.geometry.coordinates) }
      : { type: "MultiPolygon", coordinates: feature.geometry.coordinates.map(capWinding) } })));
  const parts: BufferGeometry[] = [];
  try {
    for (let attempt = 0; attempt < 20; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 16));
      const meshes: Mesh[] = [];
      builder.traverse((object) => {
        const mesh = object as Mesh;
        if (mesh.isMesh && mesh.geometry?.type === "ConicPolygonGeometry" && mesh.geometry.attributes.position) meshes.push(mesh);
      });
      if (meshes.length !== polygonCount) continue;
      for (const mesh of meshes) {
        const unindexed = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
        const part = new BufferGeometry();
        part.setAttribute("position", unindexed.getAttribute("position").clone());
        // three-globe's radius is 100. Bake altitude; no object transform remains on the merged cap.
        const factor = 0.01 * mesh.scale.x;
        part.scale(factor, factor, factor);
        parts.push(part); unindexed.dispose(); mesh.geometry.dispose();
      }
      const merged = mergeGeometries(parts, false);
      if (!merged) throw new Error("Không ghép được hình học bề mặt Việt Nam.");
      merged.userData.sourcePolygonCount = polygonCount;
      return merged;
    }
    throw new Error("Chưa dựng đủ các polygon và đảo từ nguồn bản đồ.");
  } finally {
    builder.pauseAnimation();
    (builder as unknown as { _destructor?: () => void })._destructor?.();
    for (const part of parts) part.dispose();
  }
}
