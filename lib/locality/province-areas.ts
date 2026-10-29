import type { LocalityCode } from "@/lib/local-heroes/types";
import type { LinearRing, MapGeometry } from "@/lib/explorer/types";

export type ProvinceAreaProperties = {
  code: LocalityCode;
  officialName: string;
  boundaryKind: "province-area";
  referenceFramework: "VN-34-2025";
  osmRelationId: number;
  partCount: number;
  holeCount: number;
};

export type ProvinceAreaFeature = {
  type: "Feature";
  id: string;
  properties: ProvinceAreaProperties;
  geometry: MapGeometry;
};

export type ProvinceAreaCollection = {
  type: "FeatureCollection";
  schemaVersion: 1;
  boundaryKind: "province-area";
  referenceFramework: "VN-34-2025";
  coverageStatus: "partial" | "partial-demo" | "complete";
  admittedCount: number;
  blockedCount?: number;
  sourceTimestamp: string | null;
  sourceSnapshotSha256: string;
  license: { id: string; url: string; attribution: string };
  features: readonly ProvinceAreaFeature[];
};

const OFFICIAL = new Set([
  "01", "04", "08", "11", "12", "14", "15", "19", "20", "22",
  "24", "25", "31", "33", "37", "38", "40", "42", "44", "46",
  "48", "51", "52", "56", "66", "68", "75", "79", "80", "82",
  "86", "91", "92", "96",
]);

function isRing(value: unknown): value is LinearRing {
  if (!Array.isArray(value) || value.length < 4) return false;
  return value.every(
    (point) =>
      Array.isArray(point) &&
      point.length >= 2 &&
      typeof point[0] === "number" &&
      typeof point[1] === "number" &&
      Number.isFinite(point[0]) &&
      Number.isFinite(point[1]),
  );
}

function isGeometry(value: unknown): value is MapGeometry {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const geom = value as { type?: string; coordinates?: unknown };
  if (geom.type === "Polygon") {
    return Array.isArray(geom.coordinates) && geom.coordinates.length >= 1 && geom.coordinates.every(isRing);
  }
  if (geom.type === "MultiPolygon") {
    return (
      Array.isArray(geom.coordinates) &&
      geom.coordinates.length >= 1 &&
      geom.coordinates.every((polygon) => Array.isArray(polygon) && polygon.length >= 1 && polygon.every(isRing))
    );
  }
  return false;
}

/** Validates envelope and canonical identity; does not certify historical borders. */
export function parseProvinceAreas(input: unknown): ProvinceAreaCollection {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid province-area input: expected a FeatureCollection");
  }
  const raw = input as Record<string, unknown>;
  if (raw.type !== "FeatureCollection" || raw.schemaVersion !== 1 || raw.boundaryKind !== "province-area") {
    throw new Error("Invalid province-area envelope");
  }
  if (raw.referenceFramework !== "VN-34-2025") throw new Error("Unexpected reference framework");
  if (!["partial", "partial-demo", "complete"].includes(String(raw.coverageStatus))) {
    throw new Error("Invalid coverageStatus");
  }
  if (!Array.isArray(raw.features)) throw new Error("Missing features");
  const license = raw.license as ProvinceAreaCollection["license"] | undefined;
  if (!license || license.id !== "ODbL-1.0") throw new Error("ODbL license required");

  const seen = new Set<string>();
  const features: ProvinceAreaFeature[] = [];
  for (const feature of raw.features) {
    if (!feature || typeof feature !== "object") throw new Error("Invalid feature");
    const props = (feature as { properties?: Record<string, unknown> }).properties;
    const geometry = (feature as { geometry?: unknown }).geometry;
    const code = typeof props?.code === "string" ? props.code : "";
    if (!OFFICIAL.has(code) || seen.has(code)) throw new Error(`Invalid or duplicate province code: ${code}`);
    if (props?.boundaryKind !== "province-area" || !isGeometry(geometry)) {
      throw new Error(`Invalid province-area geometry for ${code}`);
    }
    seen.add(code);
    features.push({
      type: "Feature",
      id: typeof (feature as { id?: string }).id === "string" ? (feature as { id: string }).id : `province-area:${code}`,
      properties: {
        code: code as LocalityCode,
        officialName: String(props.officialName ?? code),
        boundaryKind: "province-area",
        referenceFramework: "VN-34-2025",
        osmRelationId: Number(props.osmRelationId) || 0,
        partCount: Number(props.partCount) || 1,
        holeCount: Number(props.holeCount) || 0,
      },
      geometry,
    });
  }
  features.sort((a, b) => a.properties.code.localeCompare(b.properties.code));
  const coverageStatus = raw.coverageStatus as ProvinceAreaCollection["coverageStatus"];
  if (coverageStatus === "complete") {
    const expected = [...OFFICIAL].sort();
    const actual = features.map((f) => f.properties.code);
    if (actual.length !== expected.length || actual.some((code, i) => code !== expected[i])) {
      throw new Error("complete coverageStatus requires exactly the canonical 34 locality codes");
    }
  }
  return {
    type: "FeatureCollection",
    schemaVersion: 1,
    boundaryKind: "province-area",
    referenceFramework: "VN-34-2025",
    coverageStatus,
    admittedCount: Number(raw.admittedCount) || features.length,
    blockedCount: typeof raw.blockedCount === "number" ? raw.blockedCount : undefined,
    sourceTimestamp: typeof raw.sourceTimestamp === "string" ? raw.sourceTimestamp : null,
    sourceSnapshotSha256: String(raw.sourceSnapshotSha256 ?? ""),
    license,
    features,
  };
}

export async function loadProvinceAreas(url: string, signal?: AbortSignal): Promise<ProvinceAreaCollection | null> {
  if (signal?.aborted) return null;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    const json = await response.json();
    if (signal?.aborted) return null;
    return parseProvinceAreas(json);
  } catch {
    return null;
  }
}

export function provinceAreaPolygons(feature: ProvinceAreaFeature): readonly (readonly LinearRing[])[] {
  return feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
}

function pointInRing(point: readonly [number, number], ring: LinearRing): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function ringArea(ring: LinearRing): number {
  let total = 0;
  for (let i = 0; i < ring.length - 1; i++) total += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return total / 2;
}

function pointInProvince(point: readonly [number, number], polygons: readonly (readonly LinearRing[])[]): boolean {
  for (const polygon of polygons) {
    const [outer, ...holes] = polygon;
    if (!outer || !pointInRing(point, outer)) continue;
    if (holes.some((hole) => pointInRing(point, hole))) continue;
    return true;
  }
  return false;
}

/**
 * Verified interior presentation anchor: inside a selected shell and outside every hole.
 * Prefers the largest-area component; never uses a raw vertex average that can fall in a hole.
 */
export function provinceAreaAnchor(feature: ProvinceAreaFeature): { lat: number; lng: number } | null {
  const polygons = provinceAreaPolygons(feature);
  if (!polygons.length) return null;
  const ranked = [...polygons].sort((a, b) => Math.abs(ringArea(b[0])) - Math.abs(ringArea(a[0])));
  for (const polygon of ranked) {
    const outer = polygon[0];
    if (!outer || outer.length < 4) continue;
    const holes = polygon.slice(1);
    const open = outer.slice(0, -1);
    // Pole-of-inaccessibility style scan: centroid candidates, then bbox grid.
    let cx = 0;
    let cy = 0;
    let area = 0;
    for (let i = 0; i < open.length; i++) {
      const [x1, y1] = open[i];
      const [x2, y2] = open[(i + 1) % open.length];
      const cross = x1 * y2 - x2 * y1;
      area += cross;
      cx += (x1 + x2) * cross;
      cy += (y1 + y2) * cross;
    }
    const candidates: Array<[number, number]> = [];
    if (Math.abs(area) > 1e-18) candidates.push([cx / (3 * area), cy / (3 * area)]);
    for (let i = 0; i < open.length; i++) {
      const [x1, y1] = open[i];
      const [x2, y2] = open[(i + 1) % open.length];
      const [x3, y3] = open[(i + 2) % open.length];
      candidates.push([(x1 + x2 + x3) / 3, (y1 + y2 + y3) / 3]);
    }
    let minLng = Infinity;
    let maxLng = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;
    for (const [lng, lat] of open) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
    for (let gy = 1; gy <= 8; gy++) {
      for (let gx = 1; gx <= 8; gx++) {
        candidates.push([
          minLng + ((maxLng - minLng) * gx) / 9,
          minLat + ((maxLat - minLat) * gy) / 9,
        ]);
      }
    }
    for (const [lng, lat] of candidates) {
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
      const point: [number, number] = [lng, lat];
      if (!pointInRing(point, outer)) continue;
      if (holes.some((hole) => pointInRing(point, hole))) continue;
      if (!pointInProvince(point, polygons)) continue;
      return { lng, lat };
    }
  }
  return null;
}
