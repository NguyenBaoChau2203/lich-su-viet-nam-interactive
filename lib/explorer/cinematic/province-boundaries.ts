/**
 * Province Boundaries - Processing, validation, and types for interior province boundaries.
 *
 * Implements the frozen Province Boundary Envelope v1 from Task 05.
 * Strictly checks the 34 provincial-level units established under Resolution 202/2025/QH15
 * and Decision 19/2025/QD-TTg.
 */

import { add, dot, geoToVector, normalize, scale } from "@/lib/explorer/cinematic/projection";

export const PROVINCE_ALTITUDE = 1.0006;
export const PROVINCE_SLATE = "#728277";
export const MAX_SAFE_PROVINCE_SEGMENTS = 50_000;

export const OFFICIAL_PROVINCE_CODES = Object.freeze([
  "01", "04", "08", "11", "12", "14", "15", "19", "20", "22",
  "24", "25", "31", "33", "37", "38", "40", "42", "44", "46",
  "48", "51", "52", "56", "66", "68", "75", "79", "80", "82",
  "86", "91", "92", "96",
]);

const OFFICIAL_CODES_SET = new Set<string>(OFFICIAL_PROVINCE_CODES);

export type ProvinceBoundaryUnit = {
  code: string;
  name: string;
  sourceId: string;
  sourceRevision: string;
};

export type ProvinceBoundaryFeature = {
  type: "Feature";
  id: string;
  properties: {
    boundaryKind: "province-interior";
    provinceCodes: readonly [string, string];
    sourceEdgeIds: readonly string[];
  };
  geometry: {
    type: "LineString";
    coordinates: readonly [number, number][];
  };
};

export type ProvinceBoundaryCollection = {
  type: "FeatureCollection";
  schemaVersion: 1;
  referenceFramework: "VN-34-2025";
  sourceTimestamp: string;
  sourceSnapshotSha256: string;
  units: readonly ProvinceBoundaryUnit[];
  license: { id: string; url: string; attribution: string };
  features: readonly ProvinceBoundaryFeature[];
};

function isValidCoordinate(coord: unknown): coord is [number, number] {
  if (!Array.isArray(coord) || coord.length !== 2) return false;
  const [lng, lat] = coord;
  return (
    typeof lng === "number" &&
    Number.isFinite(lng) &&
    lng >= -180 &&
    lng <= 180 &&
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    lat >= -90 &&
    lat <= 90
  );
}

/**
 * Validates the envelope, not source approval, of a ProvinceBoundaryCollection.
 * Rejects unknown/missing/duplicate unit codes, wrong era/version or malformed source metadata,
 * unsorted/identical/unknown province code pairs, absent source IDs, duplicate feature IDs,
 * malformed or non-finite coordinates, degenerate lines and segment overrun.
 */
export function parseProvinceBoundaries(input: unknown): ProvinceBoundaryCollection {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid province boundary input: must be a GeoJSON FeatureCollection object");
  }

  const raw = input as Record<string, unknown>;

  if (raw.type !== "FeatureCollection") {
    throw new Error(`Invalid type: "${String(raw.type)}", expected "FeatureCollection"`);
  }

  if (raw.schemaVersion !== 1) {
    throw new Error(`Invalid schemaVersion: ${String(raw.schemaVersion)}, expected 1`);
  }

  if (raw.referenceFramework !== "VN-34-2025") {
    throw new Error(`Invalid referenceFramework: "${String(raw.referenceFramework)}", expected "VN-34-2025"`);
  }

  if (typeof raw.sourceTimestamp !== "string"
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(raw.sourceTimestamp)
    || !Number.isFinite(Date.parse(raw.sourceTimestamp))
    || new Date(`${raw.sourceTimestamp.slice(0, 19)}Z`).toISOString().slice(0, 19) !== raw.sourceTimestamp.slice(0, 19)) {
    throw new Error("Invalid sourceTimestamp: must be a valid ISO timestamp with timezone");
  }

  if (
    typeof raw.sourceSnapshotSha256 !== "string" ||
    !/^[0-9a-f]{64}$/i.test(raw.sourceSnapshotSha256)
  ) {
    throw new Error("Invalid sourceSnapshotSha256: must be a 64-character hex SHA-256 string");
  }

  if (!raw.license || typeof raw.license !== "object") {
    throw new Error("Invalid license: must be an object with id, url, and attribution");
  }
  const license = raw.license as Record<string, unknown>;
  if (
    typeof license.id !== "string" || !license.id.trim() ||
    typeof license.url !== "string" || !license.url.trim() ||
    typeof license.attribution !== "string" || !license.attribution.trim()
  ) {
    throw new Error("Invalid license: id, url, and attribution must be non-empty strings");
  }

  if (!Array.isArray(raw.units) || raw.units.length !== 34) {
    throw new Error(`Invalid units: expected exactly 34 units, found ${Array.isArray(raw.units) ? raw.units.length : "non-array"}`);
  }

  const seenUnitCodes = new Set<string>();
  const units: ProvinceBoundaryUnit[] = [];

  for (let i = 0; i < raw.units.length; i++) {
    const u = raw.units[i];
    if (!u || typeof u !== "object") {
      throw new Error(`Invalid unit at index ${i}: must be an object`);
    }
    const unitObj = u as Record<string, unknown>;
    const code = typeof unitObj.code === "string" ? unitObj.code.trim() : "";
    if (!OFFICIAL_CODES_SET.has(code)) {
      throw new Error(`Invalid unit at index ${i}: unknown province code "${code}"`);
    }
    if (seenUnitCodes.has(code)) {
      throw new Error(`Invalid unit at index ${i}: duplicate unit code "${code}"`);
    }
    seenUnitCodes.add(code);

    const name = typeof unitObj.name === "string" ? unitObj.name.trim() : "";
    if (!name) throw new Error(`Invalid unit "${code}": name must be a non-empty string`);

    const sourceId = typeof unitObj.sourceId === "string" ? unitObj.sourceId.trim() : "";
    if (!sourceId) throw new Error(`Invalid unit "${code}": sourceId must be a non-empty string`);

    const sourceRevision = typeof unitObj.sourceRevision === "string" ? unitObj.sourceRevision.trim() : "";
    if (!sourceRevision) throw new Error(`Invalid unit "${code}": sourceRevision must be a non-empty string`);

    units.push({ code, name, sourceId, sourceRevision });
  }

  // Ensure all 34 official codes are represented
  for (const officialCode of OFFICIAL_PROVINCE_CODES) {
    if (!seenUnitCodes.has(officialCode)) {
      throw new Error(`Missing official province unit code: "${officialCode}"`);
    }
  }

  if (!Array.isArray(raw.features)) {
    throw new Error("Invalid features: must be an array");
  }

  const seenFeatureIds = new Set<string>();
  const seenEdges = new Set<string>();
  const features: ProvinceBoundaryFeature[] = [];
  let totalSegments = 0;

  for (let i = 0; i < raw.features.length; i++) {
    const f = raw.features[i];
    if (!f || typeof f !== "object") {
      throw new Error(`Invalid feature at index ${i}: must be an object`);
    }
    const feat = f as Record<string, unknown>;
    if (feat.type !== "Feature") {
      throw new Error(`Invalid feature at index ${i}: type must be "Feature"`);
    }

    const id = typeof feat.id === "string" ? feat.id.trim() : "";
    if (!id) throw new Error(`Invalid feature at index ${i}: id must be a non-empty string`);
    if (seenFeatureIds.has(id)) {
      throw new Error(`Invalid feature at index ${i}: duplicate feature id "${id}"`);
    }
    seenFeatureIds.add(id);

    if (!feat.properties || typeof feat.properties !== "object") {
      throw new Error(`Invalid properties at feature "${id}"`);
    }
    const props = feat.properties as Record<string, unknown>;

    if (props.boundaryKind !== "province-interior") {
      throw new Error(`Invalid boundaryKind at feature "${id}": expected "province-interior", got "${String(props.boundaryKind)}"`);
    }

    if (!Array.isArray(props.provinceCodes) || props.provinceCodes.length !== 2) {
      throw new Error(`Invalid provinceCodes at feature "${id}": must be a tuple of 2 province codes`);
    }
    const [codeA, codeB] = props.provinceCodes.map((c) => (typeof c === "string" ? c.trim() : ""));
    if (!OFFICIAL_CODES_SET.has(codeA) || !OFFICIAL_CODES_SET.has(codeB)) {
      throw new Error(`Invalid provinceCodes at feature "${id}": unknown code pair ["${codeA}", "${codeB}"]`);
    }
    if (codeA === codeB) {
      throw new Error(`Invalid provinceCodes at feature "${id}": codes must be distinct, got ["${codeA}", "${codeB}"]`);
    }
    if (codeA >= codeB) {
      throw new Error(`Invalid provinceCodes at feature "${id}": codes must be sorted, got ["${codeA}", "${codeB}"]`);
    }

    if (!Array.isArray(props.sourceEdgeIds) || props.sourceEdgeIds.length === 0) {
      throw new Error(`Invalid sourceEdgeIds at feature "${id}": must be a non-empty array of strings`);
    }
    for (const edgeId of props.sourceEdgeIds) {
      if (typeof edgeId !== "string" || !edgeId.trim()) {
        throw new Error(`Invalid sourceEdgeId in feature "${id}": must be non-empty string`);
      }
    }

    if (!feat.geometry || typeof feat.geometry !== "object") {
      throw new Error(`Invalid geometry at feature "${id}"`);
    }
    const geom = feat.geometry as Record<string, unknown>;
    if (geom.type !== "LineString") {
      throw new Error(`Invalid geometry type at feature "${id}": expected "LineString", got "${String(geom.type)}"`);
    }

    if (!Array.isArray(geom.coordinates) || geom.coordinates.length < 2) {
      throw new Error(`Invalid coordinates at feature "${id}": requires at least 2 distinct points`);
    }

    const coordinates: [number, number][] = [];
    for (let cIdx = 0; cIdx < geom.coordinates.length; cIdx++) {
      const pt = geom.coordinates[cIdx];
      if (!isValidCoordinate(pt)) {
        throw new Error(`Invalid coordinate at feature "${id}" index ${cIdx}`);
      }
      coordinates.push([pt[0], pt[1]]);
    }

    // Feature IDs and source labels can differ while the geometry draws the same
    // shared edge twice. Check each undirected edge across the whole collection.
    for (let cIdx = 1; cIdx < coordinates.length; cIdx++) {
      const a = JSON.stringify(coordinates[cIdx - 1]), b = JSON.stringify(coordinates[cIdx]);
      const edge = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seenEdges.has(edge)) throw new Error(`Duplicate undirected edge at feature "${id}"`);
      seenEdges.add(edge);
    }

    // Check for degenerate lines where all coordinates are identical
    let distinctPoints = false;
    for (let cIdx = 1; cIdx < coordinates.length; cIdx++) {
      if (
        Math.abs(coordinates[cIdx][0] - coordinates[0][0]) > 1e-7 ||
        Math.abs(coordinates[cIdx][1] - coordinates[0][1]) > 1e-7
      ) {
        distinctPoints = true;
        break;
      }
    }
    if (!distinctPoints) {
      throw new Error(`Degenerate line at feature "${id}": requires at least 2 distinct points`);
    }

    totalSegments += coordinates.length - 1;
    if (totalSegments > MAX_SAFE_PROVINCE_SEGMENTS) {
      throw new Error(`Province boundaries exceed segment budget limit of ${MAX_SAFE_PROVINCE_SEGMENTS}`);
    }

    features.push({
      type: "Feature",
      id,
      properties: {
        boundaryKind: "province-interior",
        provinceCodes: [codeA, codeB],
        sourceEdgeIds: [...props.sourceEdgeIds] as string[],
      },
      geometry: {
        type: "LineString",
        coordinates,
      },
    });
  }

  return {
    type: "FeatureCollection",
    schemaVersion: 1,
    referenceFramework: "VN-34-2025",
    sourceTimestamp: raw.sourceTimestamp,
    sourceSnapshotSha256: raw.sourceSnapshotSha256.toLowerCase(),
    units,
    license: {
      id: license.id as string,
      url: license.url as string,
      attribution: license.attribution as string,
    },
    features,
  };
}

/**
 * Projects interior province boundary lines onto a sphere of radius (default PROVINCE_ALTITUDE),
 * subdividing long segments by stepDeg so lines conform to the spherical Earth surface.
 */
export function provinceBoundarySegments(
  data: ProvinceBoundaryCollection,
  radius = PROVINCE_ALTITUDE,
  stepDeg = 0.25,
): Float32Array {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new Error(`Invalid radius: ${radius}. Must be a finite positive number.`);
  }
  if (!Number.isFinite(stepDeg) || stepDeg <= 0) {
    throw new Error(`Invalid stepDeg: ${stepDeg}. Must be a finite positive number.`);
  }

  const out: number[] = [];
  let segmentCount = 0;

  for (const feature of data.features) {
    const line = feature.geometry.coordinates;
    if (!Array.isArray(line) || line.length < 2) continue;

    for (let i = 0; i < line.length - 1; i++) {
      const [lngA, latA] = line[i];
      const [lngB, latB] = line[i + 1];

      // Skip degenerate consecutive points
      if (Math.abs(lngA - lngB) < 1e-7 && Math.abs(latA - latB) < 1e-7) {
        continue;
      }

      const a = geoToVector(latA, lngA, 1);
      const b = geoToVector(latB, lngB, 1);

      const cosVal = Math.min(1, Math.max(-1, dot(a, b)));
      const angleRad = Math.acos(cosVal);
      const angleDeg = (angleRad * 180) / Math.PI;

      if (angleDeg < 1e-6) continue;

      const pieces = Math.max(1, Math.ceil((angleDeg - 1e-7) / stepDeg));
      segmentCount += pieces;
      if (segmentCount > MAX_SAFE_PROVINCE_SEGMENTS) {
        throw new Error(`Boundary segments exceeded safety limit of ${MAX_SAFE_PROVINCE_SEGMENTS} segments.`);
      }

      let previous = scale(a, radius);
      for (let piece = 1; piece <= pieces; piece++) {
        const t = piece / pieces;
        const point = scale(normalize(add(scale(a, 1 - t), scale(b, t))), radius);
        out.push(...previous, ...point);
        previous = point;
      }
    }
  }

  return new Float32Array(out);
}

/**
 * Loads province boundaries asynchronously from the specified URL.
 * Returns null if the fetch fails, aborts, or the payload is invalid.
 * Never throws out to callers, allowing graceful optional fallback.
 */
export async function loadProvinceBoundaries(
  url: string,
  signal?: AbortSignal,
): Promise<ProvinceBoundaryCollection | null> {
  if (signal?.aborted) return null;
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;
    const json = await response.json();
    if (signal?.aborted) return null;
    return parseProvinceBoundaries(json);
  } catch {
    return null;
  }
}
