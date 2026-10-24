import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";
import {
  parseProvinceBoundaries,
  provinceBoundarySegments,
  loadProvinceBoundaries,
  MAX_SAFE_PROVINCE_SEGMENTS,
  PROVINCE_ALTITUDE,
  type ProvinceBoundaryCollection,
} from "@/lib/explorer/cinematic/province-boundaries";
import { surfaceLayerRadii } from "@/lib/explorer/cinematic/projection";

// These small rectangular cells are synthetic source-validation fixtures only.
// They are never a province artifact and do not supply real administrative geometry.
const manifest = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"));
const directories: string[] = [];
afterEach(() => { for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true }); });

type Member = { type: string; ref: number; role: string };
type ResearchSource = {
  schemaVersion: number;
  source: { timestamp: string; license: string };
  national: { id: number; members: Member[] };
  relations: { id: number; tags: Record<string, string>; members: Member[] }[];
  ways: { id: number; tags: Record<string, string>; nodes: number[] }[];
  nodes: { id: number; lon: number; lat: number }[];
};

function fixture(): ResearchSource {
  const nodes = Array.from({ length: 70 }, (_, index) => ({ id: index + 1, lon: 105 + Math.floor(index / 2) / 100, lat: 15 + (index % 2) / 100 }));
  const vertical = Array.from({ length: 35 }, (_, index) => ({ id: index + 1, tags: {}, nodes: [index * 2 + 1, index * 2 + 2] }));
  const horizontal = Array.from({ length: 68 }, (_, index) => ({ id: index + 101, tags: {}, nodes: [index + 1, index + 3] }));
  return {
    schemaVersion: 1,
    source: { timestamp: "2026-10-23T20:20:51Z", license: "ODbL-1.0" },
    national: { id: 49915, members: [] },
    nodes, ways: [...vertical, ...horizontal],
    relations: manifest.units.map((unit: { osmRelationId: number; osmIsoCode: string; officialName: string }, index: number) => ({
      id: unit.osmRelationId,
      tags: { boundary: "administrative", admin_level: "4", "ISO3166-2": unit.osmIsoCode, name: unit.officialName },
      members: [index + 1, index + 2, index * 2 + 101, index * 2 + 102].map(ref => ({ type: "w", ref, role: "outer" })),
    })),
  };
}

function runAudit(source: unknown, membership: unknown = manifest) {
  const directory = mkdtempSync(path.join(tmpdir(), "history-province-audit-"));
  directories.push(directory);
  const input = path.join(directory, "source.json");
  const crosswalk = path.join(directory, "membership.json");
  writeFileSync(input, JSON.stringify(source));
  writeFileSync(crosswalk, JSON.stringify(membership));
  const result = spawnSync(process.execPath, ["scripts/validate-vietnam-province-source.mjs", "--input", input, "--membership", crosswalk], { encoding: "utf8" });
  return { exit: result.status, output: result.stdout, error: result.stderr, report: result.status === 0 || result.status === 2 ? JSON.parse(result.stdout) : null };
}

describe("province research source gate (no production geometry)", () => {
  it("counts 34 identities separately from the shared interior ways and never clears production", () => {
    const result = runAudit(fixture());
    expect(result.exit, result.error).toBe(0);
    expect(result.report.membership).toEqual({ expected: 34, matched: 34 });
    expect(result.report.topology.sharedWays).toBe(33);
    expect(result.report.topology.interiorCandidateSegments).toBe(33);
    expect(result.report.topology.singleOwnerWays).toBe(70);
    expect(result.report.productionReady).toBe(false);
    expect(result.report.polygonValidity).toBe("not_verified");
  });

  it("rejects a 34-name/center inventory without ways or polygon parts", () => {
    const source = fixture(); source.ways = []; source.nodes = [];
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues.some((issue: { code: string }) => issue.code === "MISSING_WAY")).toBe(true);
  });

  it("reports an absent outer part and an absent inner hole with their relation and way IDs", () => {
    const source = fixture();
    const khanhHoa = source.relations.find(r => r.tags["ISO3166-2"] === "VN-34")!;
    khanhHoa.members.push({ type: "w", ref: 1120240931, role: "inner" }, { type: "w", ref: 1120240941, role: "outer" });
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "MISSING_WAY", relationId: 1887959, wayId: 1120240931, role: "inner" }),
      expect.objectContaining({ code: "MISSING_WAY", relationId: 1887959, wayId: 1120240941, role: "outer" }),
    ]));
  });

  it("rejects missing membership even when the remaining relations have complete ways", () => {
    const source = fixture(); source.relations.pop();
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.membership.matched).toBe(33);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "MISSING_RELATION", provinceCode: "96" }));
  });

  it("rejects a substituted relation and a mismatched ISO crosswalk", () => {
    const source = fixture(); source.relations[0].id = 123; source.relations[1].tags["ISO3166-2"] = "VN-OLD";
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "UNKNOWN_RELATION", relationId: 123 }));
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "IDENTITY_MISMATCH", provinceCode: "04" }));
  });

  it("rejects malformed or duplicate official membership rather than accepting an arbitrary count", () => {
    const bad = structuredClone(manifest); bad.units[1].code = "01";
    const result = runAudit(fixture(), bad);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "INVALID_MEMBERSHIP" }));
  });

  it("rejects unknown member roles instead of silently losing a polygon part", () => {
    const source = fixture(); source.relations[0].members[0].role = "unreviewed";
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "UNKNOWN_MEMBER_ROLE" }));
  });

  it("rejects repeated membership of a source way in one unit", () => {
    const source = fixture(); source.relations[0].members.push({ ...source.relations[0].members[0] });
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "DUPLICATE_WAY_MEMBERSHIP" }));
  });

  it("rejects a way owned by three provinces", () => {
    const source = fixture(); source.relations[2].members.push({ type: "w", ref: 2, role: "outer" });
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "NON_MANIFOLD_WAY", wayId: 2 }));
  });

  it("rejects missing node coordinates and duplicate node identities", () => {
    const source = fixture(); source.nodes.pop(); source.nodes.push({ ...source.nodes[0] });
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "MISSING_NODE" }));
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "DUPLICATE_NODE" }));
  });

  it.each([null, 181, "105"])("rejects nonfinite/out-of-range or nonnumeric longitude %s", (longitude) => {
    const source = fixture() as unknown as { nodes: { lon: unknown }[] }; source.nodes[0].lon = longitude;
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "INVALID_COORDINATE" }));
  });

  it("rejects an open ring rather than joining missing endpoints with an invented segment", () => {
    const source = fixture(); source.relations[0].members.pop();
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "OPEN_RING", provinceCode: "01" }));
  });

  it("excludes tagged maritime, disputed and national ways from interior candidate metrics", () => {
    const source = fixture(); source.ways[1].tags = { maritime: "yes" }; source.ways[2].tags = { disputed: "yes" };
    source.national.members.push({ type: "w", ref: 4, role: "outer" });
    const result = runAudit(source);
    expect(result.exit).toBe(0);
    expect(result.report.topology.sharedWays).toBe(33);
    expect(result.report.topology.interiorCandidateSegments).toBe(30);
    expect(result.report.topology.excludedSharedWays).toBe(3);
  });

  it("rejects two different way IDs duplicating the same source edge", () => {
    const source = fixture(); source.ways.push({ ...source.ways[1], id: 999 });
    source.relations[0].members[1].ref = 999;
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "DUPLICATE_SOURCE_EDGE" }));
  });

  it("makes the diagnostic report deterministic across source ordering", () => {
    const source = fixture(); source.relations[0].members.push({ type: "w", ref: 9999, role: "inner" });
    const first = runAudit(source);
    source.relations.reverse(); source.ways.reverse(); source.nodes.reverse();
    for (const relation of source.relations) relation.members.reverse();
    const second = runAudit(source);
    expect(first.exit).toBe(2);
    expect(second.output).toBe(first.output);
  });

  it("rejects missing represented date and unsupported source license without a public artifact", () => {
    const source = fixture(); source.source.timestamp = ""; source.source.license = "repository-code-MIT";
    const result = runAudit(source);
    expect(result.exit).toBe(2);
    expect(result.report.issues).toContainEqual(expect.objectContaining({ code: "INVALID_SOURCE_METADATA" }));
    expect(result.report.productionReady).toBe(false);
  });
});

function validProvinceCollection(): ProvinceBoundaryCollection {
  return {
    type: "FeatureCollection",
    schemaVersion: 1,
    referenceFramework: "VN-34-2025",
    sourceTimestamp: "2026-10-24T09:54:11Z",
    sourceSnapshotSha256: "6f872236aba6463acfcfb04a026e9c0087aabb3de677a335b2d7bfa42c29e467",
    license: {
      id: "ODbL-1.0",
      url: "https://opendatacommons.org/licenses/odbl/1-0/",
      attribution: "© OpenStreetMap contributors",
    },
    units: manifest.units.map((u: { code: string; officialName: string; osmRelationId: number; observedRelationVersion: number }) => ({
      code: u.code,
      name: u.officialName,
      sourceId: String(u.osmRelationId),
      sourceRevision: String(u.observedRelationVersion),
    })),
    features: [
      {
        type: "Feature",
        id: "province-edge-01-04",
        properties: {
          boundaryKind: "province-interior",
          provinceCodes: ["01", "04"],
          sourceEdgeIds: ["way-1001"],
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [105.8, 21.0],
            [106.0, 21.5],
          ],
        },
      },
    ],
  };
}

describe("province boundary parser, segments, and layer depth contracts", () => {
  it("parses a valid collection fixture, preserving 34 units and line string features", () => {
    const valid = validProvinceCollection();
    const parsed = parseProvinceBoundaries(valid);
    expect(parsed.type).toBe("FeatureCollection");
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.referenceFramework).toBe("VN-34-2025");
    expect(parsed.units).toHaveLength(34);
    expect(parsed.features).toHaveLength(1);
    expect(parsed.features[0].properties.provinceCodes).toEqual(["01", "04"]);
  });

  it("rejects non-object or null input", () => {
    expect(() => parseProvinceBoundaries(null)).toThrow(/FeatureCollection/);
    expect(() => parseProvinceBoundaries("string")).toThrow(/FeatureCollection/);
    expect(() => parseProvinceBoundaries([])).toThrow(/FeatureCollection/);
  });

  it("rejects invalid schemaVersion or referenceFramework", () => {
    const badVersion = { ...validProvinceCollection(), schemaVersion: 2 };
    expect(() => parseProvinceBoundaries(badVersion)).toThrow(/schemaVersion/);

    const badFramework = { ...validProvinceCollection(), referenceFramework: "VN-63-2020" };
    expect(() => parseProvinceBoundaries(badFramework)).toThrow(/referenceFramework/);
  });

  it("rejects invalid sourceSnapshotSha256 or missing license", () => {
    const badHash = { ...validProvinceCollection(), sourceSnapshotSha256: "not-a-sha256" };
    expect(() => parseProvinceBoundaries(badHash)).toThrow(/sourceSnapshotSha256/);

    const badLicense = { ...validProvinceCollection(), license: { id: "", url: "", attribution: "" } };
    expect(() => parseProvinceBoundaries(badLicense)).toThrow(/license/);
  });

  it("rejects collection with count !== 34 units or duplicate/unknown unit codes", () => {
    const missingUnit = validProvinceCollection();
    missingUnit.units = missingUnit.units.slice(0, 33);
    expect(() => parseProvinceBoundaries(missingUnit)).toThrow(/34 units/);

    const dupUnit = validProvinceCollection();
    dupUnit.units = [dupUnit.units[0], { ...dupUnit.units[0] }, ...dupUnit.units.slice(2)];
    expect(() => parseProvinceBoundaries(dupUnit)).toThrow(/duplicate unit code/);

    const unknownUnit = validProvinceCollection();
    unknownUnit.units = [{ ...unknownUnit.units[0], code: "99" }, ...unknownUnit.units.slice(1)];
    expect(() => parseProvinceBoundaries(unknownUnit)).toThrow(/unknown province code/);
  });

  it("rejects feature with wrong boundaryKind, unknown, unsorted, or identical provinceCodes", () => {
    const badKind = validProvinceCollection();
    badKind.features = [{
      ...badKind.features[0],
      properties: { ...badKind.features[0].properties, boundaryKind: "international" as unknown as "province-interior" },
    }];
    expect(() => parseProvinceBoundaries(badKind)).toThrow(/province-interior/);

    const unsortedCodes = validProvinceCollection();
    unsortedCodes.features = [{
      ...unsortedCodes.features[0],
      properties: { ...unsortedCodes.features[0].properties, provinceCodes: ["04", "01"] },
    }];
    expect(() => parseProvinceBoundaries(unsortedCodes)).toThrow(/sorted/);

    const sameCodes = validProvinceCollection();
    sameCodes.features = [{
      ...sameCodes.features[0],
      properties: { ...sameCodes.features[0].properties, provinceCodes: ["01", "01"] as unknown as readonly [string, string] },
    }];
    expect(() => parseProvinceBoundaries(sameCodes)).toThrow(/distinct/);
  });

  it("rejects feature with duplicate feature id or empty sourceEdgeIds", () => {
    const dupId = validProvinceCollection();
    dupId.features = [dupId.features[0], { ...dupId.features[0] }];
    expect(() => parseProvinceBoundaries(dupId)).toThrow(/duplicate feature id/);

    const emptyEdges = validProvinceCollection();
    emptyEdges.features = [{
      ...emptyEdges.features[0],
      properties: { ...emptyEdges.features[0].properties, sourceEdgeIds: [] },
    }];
    expect(() => parseProvinceBoundaries(emptyEdges)).toThrow(/sourceEdgeIds/);
  });

  it("rejects an undirected edge repeated under a different feature identity", () => {
    const data = validProvinceCollection();
    const first = data.features[0];
    data.features = [first, { ...first, id: "renamed-reverse-edge",
      properties: { ...first.properties, sourceEdgeIds: ["different-source-id"] },
      geometry: { type: "LineString", coordinates: [...first.geometry.coordinates].reverse() } }];
    expect(() => parseProvinceBoundaries(data)).toThrow(/duplicate undirected edge/i);
  });

  it.each(["not-a-timestamp", "2026-02-31T09:54:11Z"])("rejects invalid source timestamp %s", sourceTimestamp => {
    expect(() => parseProvinceBoundaries({ ...validProvinceCollection(), sourceTimestamp })).toThrow(/sourceTimestamp/);
  });

  it("rejects coordinates outside the frozen two-dimensional envelope", () => {
    const data = validProvinceCollection();
    const first = data.features[0];
    data.features = [{ ...first, geometry: { type: "LineString", coordinates: [[105.8, 21, 500], [106, 21.5]] as unknown as [number, number][] } }];
    expect(() => parseProvinceBoundaries(data)).toThrow(/coordinate/);
  });

  it("rejects degenerate lines or non-finite/out-of-range coordinates", () => {
    const tooFew = validProvinceCollection();
    tooFew.features = [{
      ...tooFew.features[0],
      geometry: { type: "LineString", coordinates: [[105.8, 21.0]] },
    }];
    expect(() => parseProvinceBoundaries(tooFew)).toThrow(/at least 2 distinct points/);

    const identicalPts = validProvinceCollection();
    identicalPts.features = [{
      ...identicalPts.features[0],
      geometry: { type: "LineString", coordinates: [[105.8, 21.0], [105.8, 21.0]] },
    }];
    expect(() => parseProvinceBoundaries(identicalPts)).toThrow(/at least 2 distinct points/);

    const invalidCoord = validProvinceCollection();
    invalidCoord.features = [{
      ...invalidCoord.features[0],
      geometry: { type: "LineString", coordinates: [[105.8, 21.0], [999, 21.0]] },
    }];
    expect(() => parseProvinceBoundaries(invalidCoord)).toThrow(/coordinate/);
  });

  it("subdivides province boundary segments at specified radius and stepDeg", () => {
    const data = validProvinceCollection();
    const segments = provinceBoundarySegments(data, PROVINCE_ALTITUDE, 0.25);
    expect(segments.length).toBeGreaterThan(0);
    expect(segments.length % 6).toBe(0); // 2 points * 3 floats per segment
    // Verify all coordinate floats are finite numbers
    for (let i = 0; i < segments.length; i++) {
      expect(Number.isFinite(segments[i])).toBe(true);
    }
  });

  it("enforces depth hierarchy: cap < province < outline at all camera distances", () => {
    expect(MAX_SAFE_PROVINCE_SEGMENTS).toBe(50_000);
    for (const distance of [0.0001, 0.001, 0.01, 0.1, 1.0, 5.0, 10.0]) {
      const radii = surfaceLayerRadii(distance);
      expect(radii.cap).toBeLessThan(radii.province);
      expect(radii.province).toBeLessThan(radii.outline);
    }
  });

  it("loads province boundaries via loadProvinceBoundaries with abort and error handling", async () => {
    // 404 or network failure returns null safely
    const missing = await loadProvinceBoundaries("/non-existent-province-path.geojson");
    expect(missing).toBeNull();

    // Aborted signal returns null safely
    const controller = new AbortController();
    controller.abort();
    const aborted = await loadProvinceBoundaries("/non-existent-province-path.geojson", controller.signal);
    expect(aborted).toBeNull();
  });
});
