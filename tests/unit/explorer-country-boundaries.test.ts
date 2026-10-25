import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import {
  ORDINARY_BOUNDARY_CLASS,
  VIETNAM_SHARED_BORDER_SOURCE_IDS,
  countryBoundarySegments,
  isOrdinaryInternationalBoundary,
  normalizeBoundaryFeature,
  parseCountryBoundaries,
  resolveEffectiveBoundaryClass,
  type CountryBoundaryCollection,
} from "@/lib/explorer/cinematic/country-boundaries";

describe("country boundary classification policy", () => {
  it("resolves uppercase FEATURECLA when FCLASS_VN is absent", () => {
    expect(
      resolveEffectiveBoundaryClass({
        FEATURECLA: "International boundary (verify)",
      }),
    ).toBe("International boundary (verify)");

    expect(
      isOrdinaryInternationalBoundary({
        FEATURECLA: "International boundary (verify)",
      }),
    ).toBe(true);
  });

  it("ignores lowercase property names and never treats them as classified", () => {
    expect(
      resolveEffectiveBoundaryClass({
        featurecla: "International boundary (verify)",
      }),
    ).toBeNull();

    expect(
      isOrdinaryInternationalBoundary({
        featurecla: "International boundary (verify)",
      }),
    ).toBe(false);

    expect(
      resolveEffectiveBoundaryClass({
        fclass_vn: "International boundary (verify)",
      }),
    ).toBeNull();
  });

  it("prefers FCLASS_VN override over FEATURECLA", () => {
    // Override from disputed to ordinary
    const overrideToOrdinary = {
      FEATURECLA: "Disputed (please verify)",
      FCLASS_VN: "International boundary (verify)",
    };
    expect(resolveEffectiveBoundaryClass(overrideToOrdinary)).toBe("International boundary (verify)");
    expect(isOrdinaryInternationalBoundary(overrideToOrdinary)).toBe(true);

    // Override from disputed to Unrecognized (omitted)
    const overrideToUnrecognized = {
      FEATURECLA: "Disputed (please verify)",
      FCLASS_VN: "Unrecognized",
    };
    expect(resolveEffectiveBoundaryClass(overrideToUnrecognized)).toBe("Unrecognized");
    expect(isOrdinaryInternationalBoundary(overrideToUnrecognized)).toBe(false);

    // Override to Admin-1 boundary (omitted)
    const overrideToAdmin1 = {
      FEATURECLA: "Disputed (please verify)",
      FCLASS_VN: "Admin-1 boundary",
    };
    expect(resolveEffectiveBoundaryClass(overrideToAdmin1)).toBe("Admin-1 boundary");
    expect(isOrdinaryInternationalBoundary(overrideToAdmin1)).toBe(false);

    // Override from ordinary to Unrecognized (omitted)
    const overrideOrdinaryToUnrecognized = {
      FEATURECLA: "International boundary (verify)",
      FCLASS_VN: "Unrecognized",
    };
    expect(resolveEffectiveBoundaryClass(overrideOrdinaryToUnrecognized)).toBe("Unrecognized");
    expect(isOrdinaryInternationalBoundary(overrideOrdinaryToUnrecognized)).toBe(false);
  });

  it("does not default unknown or missing classes to ordinary boundaries", () => {
    expect(resolveEffectiveBoundaryClass({})).toBeNull();
    expect(isOrdinaryInternationalBoundary({})).toBe(false);

    expect(resolveEffectiveBoundaryClass({ FEATURECLA: "Arbitrary frontier" })).toBe("Arbitrary frontier");
    expect(isOrdinaryInternationalBoundary({ FEATURECLA: "Arbitrary frontier" })).toBe(false);

    expect(isOrdinaryInternationalBoundary({ FEATURECLA: "Line of control (please verify)" })).toBe(false);
    expect(isOrdinaryInternationalBoundary({ FEATURECLA: "Indefinite (please verify)" })).toBe(false);
    expect(isOrdinaryInternationalBoundary({ FEATURECLA: "Indeterminant frontier" })).toBe(false);
  });
});

describe("boundary feature normalization", () => {
  it("normalizes a valid LineString, preserving open coordinates and 4-decimal precision", () => {
    const raw = {
      type: "Feature",
      properties: {
        NE_ID: 123456789,
        FEATURECLA: "International boundary (verify)",
        FCLASS_VN: null,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [105.123456, 21.654321],
          [106.987654, 22.123456],
        ],
      },
    };

    const normalized = normalizeBoundaryFeature(raw);
    expect(normalized).not.toBeNull();
    expect(normalized?.properties).toEqual({
      sourceId: 123456789,
      sourceClass: "International boundary (verify)",
      viewClass: "International boundary (verify)",
    });
    expect(normalized?.geometry).toEqual({
      type: "LineString",
      coordinates: [
        [105.1235, 21.6543],
        [106.9877, 22.1235],
      ],
    });
    // Open line must not be closed
    expect(normalized?.geometry.coordinates).toHaveLength(2);
    expect(normalized?.geometry.coordinates[0]).not.toEqual(normalized?.geometry.coordinates[1]);
  });

  it("normalizes MultiLineString preserving disconnected parts", () => {
    const raw = {
      type: "Feature",
      properties: {
        NE_ID: 987654321,
        FEATURECLA: "International boundary (verify)",
      },
      geometry: {
        type: "MultiLineString",
        coordinates: [
          [
            [10.11111, 20.22222],
            [10.33333, 20.44444],
          ],
          [
            [30.55555, 40.66666],
            [30.77777, 40.88888],
          ],
        ],
      },
    };

    const normalized = normalizeBoundaryFeature(raw);
    expect(normalized).not.toBeNull();
    expect(normalized?.geometry.type).toBe("MultiLineString");
    if (normalized?.geometry.type === "MultiLineString") {
      expect(normalized.geometry.coordinates).toHaveLength(2);
      expect(normalized.geometry.coordinates[0]).toEqual([
        [10.1111, 20.2222],
        [10.3333, 20.4444],
      ]);
      expect(normalized.geometry.coordinates[1]).toEqual([
        [30.5556, 40.6667],
        [30.7778, 40.8889],
      ]);
    }
  });

  it("returns null for non-ordinary classes or invalid geometries", () => {
    expect(
      normalizeBoundaryFeature({
        type: "Feature",
        properties: { NE_ID: 1, FEATURECLA: "Line of control (please verify)" },
        geometry: { type: "LineString", coordinates: [[0, 0], [1, 1]] },
      }),
    ).toBeNull();

    expect(
      normalizeBoundaryFeature({
        type: "Feature",
        properties: { NE_ID: 2, FEATURECLA: "International boundary (verify)" },
        geometry: { type: "Polygon", coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]] },
      }),
    ).toBeNull();
  });
});

describe("processed country boundaries parser", () => {
  it("parses valid CountryBoundaryCollection cleanly", () => {
    const valid: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 100,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [102.5, 21.0],
              [103.0, 21.5],
            ],
          },
        },
      ],
    };

    const parsed = parseCountryBoundaries(valid);
    expect(parsed).toEqual(valid);
  });

  it("throws on malformed collections and invalid features", () => {
    expect(() => parseCountryBoundaries(null)).toThrow();
    expect(() => parseCountryBoundaries({})).toThrow();
    expect(() => parseCountryBoundaries({ type: "NotFeatureCollection", features: [] })).toThrow();
    expect(() =>
      parseCountryBoundaries({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              sourceId: "not-a-number",
              sourceClass: "International boundary (verify)",
              viewClass: ORDINARY_BOUNDARY_CLASS,
            },
            geometry: { type: "LineString", coordinates: [[0, 0], [1, 1]] },
          },
        ],
      }),
    ).toThrow();

    // Reject non-ordinary viewClass in the processed layer
    expect(() =>
      parseCountryBoundaries({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              sourceId: 101,
              sourceClass: "Disputed (please verify)",
              viewClass: "Disputed (please verify)",
            },
            geometry: { type: "LineString", coordinates: [[0, 0], [1, 1]] },
          },
        ],
      }),
    ).toThrow();
  });
});

describe("production country boundaries artifact and budget", () => {
  const assetPath = "public/maps/history-country-boundaries.geojson";
  const provenancePath = "public/maps/history-country-boundaries.provenance.json";

  it("verifies production asset existence, schema, hash, and budget", () => {
    expect(existsSync(assetPath)).toBe(true);
    expect(existsSync(provenancePath)).toBe(true);

    const rawContent = readFileSync(assetPath, "utf8");
    const rawBuffer = readFileSync(assetPath);
    const parsed = parseCountryBoundaries(JSON.parse(rawContent));
    const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));

    // Exact feature count: 357 ordinary lines under FCLASS_VN ?? FEATURECLA
    expect(parsed.features).toHaveLength(357);

    // All features must have viewClass = 'International boundary (verify)'
    expect(parsed.features.every((f) => f.properties.viewClass === ORDINARY_BOUNDARY_CLASS)).toBe(true);

    // Provenance verification
    const sha256 = createHash("sha256").update(rawBuffer).digest("hex");
    expect(provenance.sha256).toBe(sha256);
    expect(provenance.datasetVersion).toBe("5.1.0");
    expect(provenance.repositoryTag).toBe("v5.1.2");
    expect(provenance.sourceSha256).toBe("2faac4f6b34386f3d21b6e018cf151f241f00e5c936d44dd17d7d9bfb147fa48");
    expect(provenance.effectiveClassPolicy).toBe("FCLASS_VN ?? FEATURECLA");
    expect(provenance.featuresCount).toBe(357);
    expect(provenance.totalPoints).toBe(18980);
    expect(provenance.omittedSummary).toEqual({
      "Unrecognized": 3,
      "Indefinite (please verify)": 5,
      "Disputed (please verify)": 16,
      "Line of control (please verify)": 6,
      "Admin-1 boundary": 1,
      "Indeterminant frontier": 2,
    });
    expect(provenance.omittedFeatures).toHaveLength(33);

    // Budget: asset gzip must be <= 150 KiB
    const gzipLength = gzipSync(rawBuffer).length;
    expect(gzipLength).toBeLessThanOrEqual(150 * 1024);
    expect(provenance.gzipBytes).toBe(gzipLength);
  });
});

describe("countryBoundarySegments spherical geometry", () => {
  it("treats a two-point line as one segment with no closing edge", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 1,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [10, 20],
              [10.1, 20.1],
            ],
          },
        },
      ],
    };

    const segments = countryBoundarySegments(data, 1.0, 1.0);
    // Exactly 1 segment = 6 floats [x1, y1, z1, x2, y2, z2]
    expect(segments).toHaveLength(6);
    // Start != end
    expect([segments[0], segments[1], segments[2]]).not.toEqual([segments[3], segments[4], segments[5]]);
  });

  it("keeps disconnected MultiLineString parts disconnected", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 2,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "MultiLineString",
            coordinates: [
              [
                [0, 0],
                [1, 0],
              ],
              [
                [10, 0],
                [11, 0],
              ],
            ],
          },
        },
      ],
    };

    const segments = countryBoundarySegments(data, 1.0, 2.0);
    // 2 segments = 12 floats: (part1 p0->p1) and (part2 p0->p1)
    expect(segments).toHaveLength(12);

    const part1End = [segments[3], segments[4], segments[5]];
    const part2Start = [segments[6], segments[7], segments[8]];
    // End of part 1 must not connect to start of part 2
    expect(part1End).not.toEqual(part2Start);
  });

  it("respects [lng, lat] coordinate ordering", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 3,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [90, 0], // lng 90, lat 0 -> faces +X
              [90, 0.1],
            ],
          },
        },
      ],
    };

    const segments = countryBoundarySegments(data, 1.0, 1.0);
    // Point 0 at (lng: 90, lat: 0): x ≈ 1, y ≈ 0, z ≈ 0
    expect(segments[0]).toBeCloseTo(1.0, 3);
    expect(segments[1]).toBeCloseTo(0.0, 3);
    expect(segments[2]).toBeCloseTo(0.0, 3);
  });

  it("follows the short great-circle arc across ±180° meridian", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 4,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [179, 0],
              [-179, 0],
            ],
          },
        },
      ],
    };

    const segments = countryBoundarySegments(data, 1.0, 0.5);
    // 2° span with step 0.5° = 4 segments = 24 floats
    expect(segments).toHaveLength(24);

    // All interpolated vertices should stay on the antimeridian side (z < -0.9, |x| < 0.1)
    for (let i = 0; i < segments.length; i += 3) {
      expect(segments[i + 2]).toBeLessThan(-0.9);
      expect(Math.abs(segments[i])).toBeLessThan(0.1);
    }
  });

  it("subdivides long segments into equal spherical steps on the sphere", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 5,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [0, 0],
              [0, 10], // 10 degree span
            ],
          },
        },
      ],
    };

    const radius = 1.0002;
    const segments = countryBoundarySegments(data, radius, 0.25);
    // 10° / 0.25° = 40 pieces = 240 floats
    expect(segments).toHaveLength(240);

    for (let i = 0; i < segments.length; i += 3) {
      const len = Math.hypot(segments[i], segments[i + 1], segments[i + 2]);
      expect(len).toBeCloseTo(radius, 4);
    }
  });

  it("validates finite radius and stepDeg parameters", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [],
    };

    expect(() => countryBoundarySegments(data, 0)).toThrow();
    expect(() => countryBoundarySegments(data, -1)).toThrow();
    expect(() => countryBoundarySegments(data, NaN)).toThrow();
    expect(() => countryBoundarySegments(data, Infinity)).toThrow();
    expect(() => countryBoundarySegments(data, 1.0, 0)).toThrow();
    expect(() => countryBoundarySegments(data, 1.0, -0.5)).toThrow();
    expect(() => countryBoundarySegments(data, 1.0, NaN)).toThrow();
  });

  it("safely skips consecutive degenerate points", () => {
    const data: CountryBoundaryCollection = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            sourceId: 6,
            sourceClass: "International boundary (verify)",
            viewClass: ORDINARY_BOUNDARY_CLASS,
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [10, 10],
              [10, 10], // duplicate
              [10.1, 10],
            ],
          },
        },
      ],
    };

    const segments = countryBoundarySegments(data, 1.0, 1.0);
    // Should produce only 1 segment (6 floats) for [10, 10] -> [10.1, 10]
    expect(segments).toHaveLength(6);
  });

  it("processes the production boundary asset well within segment budget", () => {
    const assetPath = "public/maps/history-country-boundaries.geojson";
    const raw = JSON.parse(readFileSync(assetPath, "utf8"));
    const collection = parseCountryBoundaries(raw);

    const segments = countryBoundarySegments(collection, 1.0002, 0.25);
    const segmentCount = segments.length / 6;

    // Must be <= 60,000 segments from the design spec budget
    expect(segmentCount).toBeLessThanOrEqual(60_000);
    // Exact count with stepDeg = 0.25 is 19,562 (skipping 94 degenerate points)
    expect(segmentCount).toBe(19562);
  });
});

describe("Phase 2 — line hierarchy and shared edge calibration", () => {
  it("identifies the three exact Vietnam shared land borders for source-aware suppression", () => {
    expect(VIETNAM_SHARED_BORDER_SOURCE_IDS).toHaveLength(3);
    expect(VIETNAM_SHARED_BORDER_SOURCE_IDS).toContain(1746705493); // Cambodia - Vietnam
    expect(VIETNAM_SHARED_BORDER_SOURCE_IDS).toContain(1746707417); // Laos - Vietnam
    expect(VIETNAM_SHARED_BORDER_SOURCE_IDS).toContain(1746707649); // China - Vietnam
  });

  it("suppresses only Vietnam shared border lines when suppressSharedVietnamEdges is enabled", () => {
    const assetPath = "public/maps/history-country-boundaries.geojson";
    const raw = JSON.parse(readFileSync(assetPath, "utf8"));
    const collection = parseCountryBoundaries(raw);

    const fullSegments = countryBoundarySegments(collection, 1.0002, 0.25);
    const suppressedSegments = countryBoundarySegments(collection, 1.0002, 0.25, {
      suppressSharedVietnamEdges: true,
    });

    const fullCount = fullSegments.length / 6;
    const suppressedCount = suppressedSegments.length / 6;

    expect(fullCount).toBe(19562);
    // Exactly 349 segments from the 3 Vietnam shared borders are suppressed
    expect(suppressedCount).toBe(19213);
    expect(fullCount - suppressedCount).toBe(349);
  });
});
