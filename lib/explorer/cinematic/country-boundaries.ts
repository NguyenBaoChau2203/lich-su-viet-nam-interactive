/**
 * Country Boundaries - Processing, validation, and types for international land borders.
 *
 * Sourced from Natural Earth 50m Admin 0 boundary lines (land).
 * Classification policy: viewClass = FCLASS_VN ?? FEATURECLA.
 * Initial solid layer retains only "International boundary (verify)".
 */

import { add, dot, geoToVector, normalize, scale } from "@/lib/explorer/cinematic/projection";

export const ORDINARY_BOUNDARY_CLASS = "International boundary (verify)" as const;

export type CountryBoundaryViewClass = typeof ORDINARY_BOUNDARY_CLASS;

export type CountryBoundaryProperties = {
  sourceId: number;
  sourceClass: string;
  viewClass: CountryBoundaryViewClass;
};

export type CountryBoundaryGeometry =
  | { type: "LineString"; coordinates: [number, number][] }
  | { type: "MultiLineString"; coordinates: [number, number][][] };

export type CountryBoundaryFeature = {
  type: "Feature";
  properties: CountryBoundaryProperties;
  geometry: CountryBoundaryGeometry;
};

export type CountryBoundaryCollection = {
  type: "FeatureCollection";
  features: CountryBoundaryFeature[];
};

/**
 * Resolves the effective boundary classification following the project policy:
 * FCLASS_VN ?? FEATURECLA
 *
 * Source properties are strictly uppercase; lowercase fields are ignored.
 */
export function resolveEffectiveBoundaryClass(properties: {
  FEATURECLA?: unknown;
  FCLASS_VN?: unknown;
  [key: string]: unknown;
}): string | null {
  if (!properties || typeof properties !== "object") return null;

  const fclassVn = typeof properties.FCLASS_VN === "string" ? properties.FCLASS_VN.trim() : null;
  if (fclassVn) return fclassVn;

  const featurecla = typeof properties.FEATURECLA === "string" ? properties.FEATURECLA.trim() : null;
  if (featurecla) return featurecla;

  return null;
}

/**
 * Determines whether a feature qualifies as an ordinary international land boundary
 * under the effective classification policy.
 */
export function isOrdinaryInternationalBoundary(properties: {
  FEATURECLA?: unknown;
  FCLASS_VN?: unknown;
  [key: string]: unknown;
}): boolean {
  return resolveEffectiveBoundaryClass(properties) === ORDINARY_BOUNDARY_CLASS;
}

/**
 * Rounds a single geographic coordinate to 4 decimal places (approx. 11m resolution),
 * normalizing negative zero to zero.
 */
export function roundCoordinate(val: number): number {
  const rounded = Number(val.toFixed(4));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function isValidCoordinatePair(pair: unknown): pair is [number, number] {
  if (!Array.isArray(pair) || pair.length < 2) return false;
  const [lng, lat] = pair;
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

function roundCoordinateList(coords: unknown[]): [number, number][] {
  const result: [number, number][] = [];
  for (const pt of coords) {
    if (!isValidCoordinatePair(pt)) {
      throw new Error(`Invalid coordinate pair: ${JSON.stringify(pt)}`);
    }
    result.push([roundCoordinate(pt[0]), roundCoordinate(pt[1])]);
  }
  return result;
}

/**
 * Normalizes a raw Natural Earth boundary feature.
 * Retains only ordinary international boundaries; returns null for omitted features or unsupported geometry.
 */
export function normalizeBoundaryFeature(rawFeature: unknown): CountryBoundaryFeature | null {
  if (!rawFeature || typeof rawFeature !== "object") return null;
  const feat = rawFeature as Record<string, unknown>;
  if (feat.type !== "Feature" || !feat.properties || typeof feat.properties !== "object") return null;

  const props = feat.properties as Record<string, unknown>;
  const effectiveClass = resolveEffectiveBoundaryClass(props);
  if (effectiveClass !== ORDINARY_BOUNDARY_CLASS) return null;

  const sourceId = typeof props.NE_ID === "number" && Number.isInteger(props.NE_ID) ? props.NE_ID : null;
  if (sourceId === null) return null;

  const sourceClass = typeof props.FEATURECLA === "string" && props.FEATURECLA.trim().length > 0
    ? props.FEATURECLA.trim()
    : null;
  if (!sourceClass) return null;

  if (!feat.geometry || typeof feat.geometry !== "object") return null;
  const geom = feat.geometry as Record<string, unknown>;

  if (geom.type === "LineString") {
    if (!Array.isArray(geom.coordinates) || geom.coordinates.length < 2) return null;
    try {
      const coordinates = roundCoordinateList(geom.coordinates);
      return {
        type: "Feature",
        properties: {
          sourceId,
          sourceClass,
          viewClass: ORDINARY_BOUNDARY_CLASS,
        },
        geometry: {
          type: "LineString",
          coordinates,
        },
      };
    } catch {
      return null;
    }
  }

  if (geom.type === "MultiLineString") {
    if (!Array.isArray(geom.coordinates) || geom.coordinates.length < 1) return null;
    try {
      const coordinates: [number, number][][] = [];
      for (const part of geom.coordinates) {
        if (!Array.isArray(part) || part.length < 2) return null;
        coordinates.push(roundCoordinateList(part));
      }
      return {
        type: "Feature",
        properties: {
          sourceId,
          sourceClass,
          viewClass: ORDINARY_BOUNDARY_CLASS,
        },
        geometry: {
          type: "MultiLineString",
          coordinates,
        },
      };
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Strict parser for runtime CountryBoundaryCollection.
 * Throws if the collection structure or any feature property/geometry does not match the strict schema.
 */
export function parseCountryBoundaries(input: unknown): CountryBoundaryCollection {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid country boundaries: input must be an object");
  }
  const coll = input as Record<string, unknown>;
  if (coll.type !== "FeatureCollection" || !Array.isArray(coll.features)) {
    throw new Error("Invalid country boundaries: expected FeatureCollection with features array");
  }

  const features: CountryBoundaryFeature[] = [];

  for (let i = 0; i < coll.features.length; i++) {
    const f = coll.features[i];
    if (!f || typeof f !== "object") {
      throw new Error(`Invalid feature at index ${i}: not an object`);
    }
    const feat = f as Record<string, unknown>;
    if (feat.type !== "Feature" || !feat.properties || typeof feat.properties !== "object") {
      throw new Error(`Invalid feature at index ${i}: missing type or properties`);
    }
    const props = feat.properties as Record<string, unknown>;
    if (typeof props.sourceId !== "number" || !Number.isInteger(props.sourceId)) {
      throw new Error(`Invalid feature at index ${i}: sourceId must be an integer`);
    }
    if (typeof props.sourceClass !== "string" || !props.sourceClass) {
      throw new Error(`Invalid feature at index ${i}: sourceClass must be a non-empty string`);
    }
    if (props.viewClass !== ORDINARY_BOUNDARY_CLASS) {
      throw new Error(
        `Invalid feature at index ${i}: viewClass must be "${ORDINARY_BOUNDARY_CLASS}", got "${props.viewClass}"`,
      );
    }

    if (!feat.geometry || typeof feat.geometry !== "object") {
      throw new Error(`Invalid feature at index ${i}: geometry is missing`);
    }
    const geom = feat.geometry as Record<string, unknown>;
    if (geom.type === "LineString") {
      if (!Array.isArray(geom.coordinates) || geom.coordinates.length < 2) {
        throw new Error(`Invalid LineString at index ${i}: requires at least 2 points`);
      }
      for (const pt of geom.coordinates) {
        if (!isValidCoordinatePair(pt)) {
          throw new Error(`Invalid LineString coordinate at index ${i}`);
        }
      }
    } else if (geom.type === "MultiLineString") {
      if (!Array.isArray(geom.coordinates) || geom.coordinates.length < 1) {
        throw new Error(`Invalid MultiLineString at index ${i}: requires at least 1 line part`);
      }
      for (const line of geom.coordinates) {
        if (!Array.isArray(line) || line.length < 2) {
          throw new Error(`Invalid MultiLineString part at index ${i}: requires at least 2 points`);
        }
        for (const pt of line) {
          if (!isValidCoordinatePair(pt)) {
            throw new Error(`Invalid MultiLineString coordinate at index ${i}`);
          }
        }
      }
    } else {
      throw new Error(`Invalid geometry type "${geom.type}" at index ${i}: only LineString and MultiLineString are supported`);
    }

    features.push(feat as CountryBoundaryFeature);
  }

  return {
    type: "FeatureCollection",
    features,
  };
}

const MAX_SAFE_SEGMENTS = 60_000;

/**
 * Pinned Natural Earth source IDs that share land borders directly with Vietnam:
 * - 1746705493: Cambodia - Vietnam land boundary
 * - 1746707417: Laos - Vietnam land boundary
 * - 1746707649: China - Vietnam land boundary
 *
 * Used for source-aware suppression to prevent duplicate/offset parallel strokes with Vietnam's gold outline.
 */
export const VIETNAM_SHARED_BORDER_SOURCE_IDS = Object.freeze([
  1746705493,
  1746707417,
  1746707649,
]);

const SHARED_IDS_SET = new Set(VIETNAM_SHARED_BORDER_SOURCE_IDS);

export type CountryBoundarySegmentOptions = {
  /**
   * If true, suppresses only the three specific Natural Earth boundary lines that directly border Vietnam,
   * avoiding double strokes with Vietnam's detailed gold national outline.
   */
  suppressSharedVietnamEdges?: boolean;
};

/**
 * Projects country boundary lines onto a sphere of the given radius, subdividing long segments
 * with a maximum angular step (stepDeg).
 *
 * Never closes open lines and never connects disconnected MultiLineString parts.
 * Uses geoToVector(lat, lng, radius) convention where GeoJSON coordinates are [lng, lat].
 */
export function countryBoundarySegments(
  data: CountryBoundaryCollection,
  radius = 1.0002,
  stepDeg = 0.25,
  options?: CountryBoundarySegmentOptions,
): Float32Array {
  if (!Number.isFinite(radius) || radius <= 0) {
    throw new Error(`Invalid radius: ${radius}. Must be a finite positive number.`);
  }
  if (!Number.isFinite(stepDeg) || stepDeg <= 0) {
    throw new Error(`Invalid stepDeg: ${stepDeg}. Must be a finite positive number.`);
  }

  const suppressShared = Boolean(options?.suppressSharedVietnamEdges);
  const out: number[] = [];
  let segmentCount = 0;

  for (const feature of data.features) {
    if (suppressShared && SHARED_IDS_SET.has(feature.properties.sourceId)) {
      continue;
    }

    const lines = feature.geometry.type === "LineString"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;

    for (const line of lines) {
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
        if (segmentCount > MAX_SAFE_SEGMENTS) {
          throw new Error(
            `Boundary segments exceeded safety limit of ${MAX_SAFE_SEGMENTS} segments.`,
          );
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
  }

  return new Float32Array(out);
}
