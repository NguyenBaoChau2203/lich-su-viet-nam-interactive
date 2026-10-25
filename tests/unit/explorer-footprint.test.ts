import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..", "..");
const footprintPath = path.join(root, "public", "maps", "vietnam-tabletop.geojson");
const provenancePath = path.join(root, "public", "maps", "vietnam-tabletop.provenance.json");
const sourcesDocPath = path.join(root, "docs", "content", "vietnam-tabletop-map-sources.md");

type Ring = readonly (readonly [number, number])[];
type PolygonCoords = readonly Ring[];
type FeatureGeometry =
  | { type: "Polygon"; coordinates: PolygonCoords }
  | { type: "MultiPolygon"; coordinates: readonly PolygonCoords[] };

type FootprintFeature = {
  type: "Feature";
  properties: {
    partId: string;
    sourceId: string;
    name?: string;
    partKind?: string;
  };
  geometry: FeatureGeometry;
};

type FootprintCollection = {
  type: "FeatureCollection";
  features: readonly FootprintFeature[];
};

type SourceRecord = {
  sourceId: string;
  title: string;
  publisher: string;
  sourceUrl: string;
  dataUrl: string;
  accessedAt: string;
  license: string;
  scope: string;
  limitations: string;
};

type ProvenanceRecord = {
  sourceUrl: string;
  dataUrl: string;
  publisher: string;
  accessedAt: string;
  license: string;
  scope: string;
  limitations: string;
  sha256: string;
  reviewEvidence: string;
  sources: readonly SourceRecord[];
};

function signedRingArea(ring: Ring): number {
  let sum = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[i + 1];
    sum += x1 * y2 - x2 * y1;
  }
  return sum / 2;
}

function collectPolygons(geometry: FeatureGeometry): readonly PolygonCoords[] {
  return geometry.type === "Polygon" ? [geometry.coordinates] : geometry.coordinates;
}

describe("explorer-footprint: vietnam-tabletop.geojson & provenance", () => {
  it("contains only valid closed Polygon/MultiPolygon rings with finite WGS84 coordinates and nonzero area", () => {
    const raw = readFileSync(footprintPath, "utf8");
    const collection = JSON.parse(raw) as FootprintCollection;

    expect(collection.type).toBe("FeatureCollection");
    expect(Array.isArray(collection.features)).toBe(true);
    expect(collection.features.length).toBeGreaterThanOrEqual(5);

    const partIds = new Set<string>();
    for (const feature of collection.features) {
      expect(feature.type).toBe("Feature");
      expect(typeof feature.properties?.partId).toBe("string");
      expect(feature.properties.partId.length).toBeGreaterThan(0);
      expect(typeof feature.properties?.sourceId).toBe("string");
      expect(feature.properties.sourceId.length).toBeGreaterThan(0);
      expect(partIds.has(feature.properties.partId), `duplicate partId ${feature.properties.partId}`).toBe(false);
      partIds.add(feature.properties.partId);

      expect(["Polygon", "MultiPolygon"]).toContain(feature.geometry.type);
      const polygons = collectPolygons(feature.geometry);
      expect(polygons.length, feature.properties.partId).toBeGreaterThan(0);

      for (const poly of polygons) {
        expect(poly.length, feature.properties.partId).toBeGreaterThan(0);
        for (const ring of poly) {
          expect(ring.length, `${feature.properties.partId} ring length`).toBeGreaterThanOrEqual(4);
          for (const coord of ring) {
            expect(Array.isArray(coord)).toBe(true);
            expect(coord.length).toBe(2);
            const [lng, lat] = coord;
            expect(Number.isFinite(lng), `${feature.properties.partId} lng`).toBe(true);
            expect(Number.isFinite(lat), `${feature.properties.partId} lat`).toBe(true);
            // Valid WGS84 bounds for Vietnam and East Sea islands
            expect(lng, `${feature.properties.partId} lng range`).toBeGreaterThanOrEqual(101);
            expect(lng, `${feature.properties.partId} lng range`).toBeLessThanOrEqual(118);
            expect(lat, `${feature.properties.partId} lat range`).toBeGreaterThanOrEqual(6);
            expect(lat, `${feature.properties.partId} lat range`).toBeLessThanOrEqual(24);
          }
          const first = ring[0];
          const last = ring[ring.length - 1];
          expect(first[0], `${feature.properties.partId} closed ring X`).toBe(last[0]);
          expect(first[1], `${feature.properties.partId} closed ring Y`).toBe(last[1]);
          expect(Math.abs(signedRingArea(ring)), `${feature.properties.partId} nonzero area`).toBeGreaterThan(1e-7);
        }
      }
    }

    // Required parts: mainland, major islands, and sovereignty archipelagos
    expect(partIds.has("mainland")).toBe(true);
    expect(partIds.has("phu-quoc")).toBe(true);
    expect(partIds.has("con-dao")).toBe(true);
    expect(partIds.has("hoang-sa")).toBe(true);
    expect(partIds.has("truong-sa")).toBe(true);
  });

  it("matches documented provenance, sha256, and 200 KiB compressed budget", () => {
    const rawFootprint = readFileSync(footprintPath);
    const rawProvenance = readFileSync(provenancePath, "utf8");
    const rawSourcesDoc = readFileSync(sourcesDocPath, "utf8");

    const collection = JSON.parse(rawFootprint.toString("utf8")) as FootprintCollection;
    const provenance = JSON.parse(rawProvenance) as ProvenanceRecord;

    for (const key of [
      "sourceUrl",
      "dataUrl",
      "publisher",
      "accessedAt",
      "license",
      "scope",
      "limitations",
      "sha256",
      "reviewEvidence",
    ] as const) {
      expect(typeof provenance[key], key).toBe("string");
      expect(provenance[key].trim().length, key).toBeGreaterThan(0);
    }

    const actualSha256 = createHash("sha256").update(rawFootprint).digest("hex");
    expect(provenance.sha256).toBe(actualSha256);

    const documentedIds = new Set((provenance.sources ?? []).map((s) => s.sourceId));
    expect(documentedIds.size).toBeGreaterThan(0);
    for (const feature of collection.features) {
      expect(
        documentedIds.has(feature.properties.sourceId),
        `missing sourceId ${feature.properties.sourceId} in provenance`,
      ).toBe(true);
    }

    const compressedBytes = gzipSync(rawFootprint).byteLength;
    expect(compressedBytes).toBeLessThanOrEqual(200 * 1024);
    expect(rawSourcesDoc).toContain(actualSha256);
  });
});
