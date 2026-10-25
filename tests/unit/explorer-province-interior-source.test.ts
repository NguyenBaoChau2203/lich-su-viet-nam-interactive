import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const membership = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"));

// Synthetic graph, no production geography: 34 identities connected by 33 shared ways.
function fixture() {
  return {
    schemaVersion: 1,
    source: { publisher: "OpenStreetMap contributors / Geofabrik GmbH", url: "https://download.geofabrik.de/asia/vietnam-261023.osm.pbf", timestamp: "2026-10-23T20:20:51Z", license: "ODbL-1.0" },
    national: { id: 49915, members: [] as { type: string; ref: number; role: string }[] },
    relations: membership.units.map((u: { osmRelationId: number; observedRelationVersion: number; observedRelationTimestamp: string; observedOsmName: string; osmIsoCode: string }, i: number) => ({
      id: u.osmRelationId, version: u.observedRelationVersion, timestamp: u.observedRelationTimestamp,
      tags: { boundary: "administrative", admin_level: "4", name: u.observedOsmName, "ISO3166-2": u.osmIsoCode },
      members: [i > 0 ? { type: "w", ref: i, role: "outer" } : null, i < 33 ? { type: "w", ref: i + 1, role: "outer" } : null].filter(Boolean),
    })),
    ways: Array.from({ length: 33 }, (_, i) => ({ id: i + 1, version: 1, timestamp: "2026-01-01T00:00:00Z", tags: {} as Record<string, string>, nodes: [i + 1, i + 2] })),
    nodes: Array.from({ length: 34 }, (_, i) => ({ id: i + 1, lon: 104 + i / 100, lat: 20 })),
  };
}

function audit(input = fixture(), manifest = structuredClone(membership)) {
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", "import {auditProvinceInteriorSource} from './scripts/audit-vietnam-province-interior-source.mjs'; let s='';for await(const c of process.stdin)s+=c;const {input,membership}=JSON.parse(s);process.stdout.write(JSON.stringify(auditProvinceInteriorSource(input,membership)));"], { input: JSON.stringify({ input, membership: manifest }), encoding: "utf8" });
  expect(result.status, result.stderr).toBe(0);
  return JSON.parse(result.stdout);
}

describe("independent shared interior source gate", () => {
  it("certifies shared membership separately from unresolved full polygons", () => {
    const report = audit();
    expect(report.status).toBe("pass");
    expect(report.scope).toBe("shared-interior-lines");
    expect(report.fullPolygonStatus).toBe("needs_evidence");
    expect(report.counts).toMatchObject({ matchedUnits: 34, sharedWays: 33, eligibleWays: 33, rawSegments: 33, pairs: 33, representedUnits: 34 });
  });
  it("fails a missing shared way before any exclusion can conceal it", () => {
    const input = fixture(); input.ways.shift();
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "MISSING_SHARED_WAY", wayId: 1 }));
  });
  it("fails a missing eligible node", () => {
    const input = fixture(); input.nodes.shift();
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "MISSING_NODE", nodeId: 1 }));
  });
  it("classifies absent single-owner membership without guessing location", () => {
    const input = fixture(); input.relations[0].members.push({ type: "w", ref: 999, role: "inner" });
    const report = audit(input);
    expect(report.status).toBe("pass");
    expect(report.missingSingleOwnerObjects).toEqual([{ wayId: 999, provinceCodes: ["01"], roles: ["inner"], reason: "single-owner-outside-mutual-scope" }]);
    expect(report.eligibleWayIds).not.toContain(999);
    input.relations[1].members.push({ type: "w", ref: 999, role: "outer" });
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "MISSING_SHARED_WAY", wayId: 999 }));
  });
  it.each(["missing", "duplicated"])("rejects %s unit membership", kind => {
    const input = fixture();
    if (kind === "missing") input.relations.pop(); else input.relations.push(input.relations[0]);
    expect(audit(input).status).toBe("fail");
  });
  it("rejects an unknown role even on a missing object", () => {
    const input = fixture(); input.relations[0].members.push({ type: "w", ref: 999, role: "unreviewed" });
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "UNKNOWN_MEMBER_ROLE" }));
  });
  it("rejects non-manifold ownership and repeated relation membership", () => {
    const input = fixture(); input.relations[2].members.push({ type: "w", ref: 1, role: "outer" });
    input.relations[0].members.push({ type: "w", ref: 1, role: "outer" });
    expect(audit(input).issues.map((i: { code: string }) => i.code)).toEqual(expect.arrayContaining(["NON_MANIFOLD_WAY", "DUPLICATE_WAY_MEMBERSHIP"]));
  });
  it("rejects a differently identified reversed duplicate edge", () => {
    const input = fixture(); input.ways[1].nodes = [2, 1];
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "DUPLICATE_SOURCE_EDGE" }));
  });
  it.each(["timestamp", "license", "url"])("rejects mismatched source %s", key => {
    const input = fixture(); input.source[key as keyof typeof input.source] = "unreviewed";
    expect(audit(input).status).toBe("fail");
  });
  it("rejects stale relation revisions and mismatched government identities", () => {
    const input = fixture(); input.relations[0].version++; input.relations[1].tags["ISO3166-2"] = "VN-OLD";
    expect(audit(input).issues.map((i: { code: string }) => i.code)).toEqual(expect.arrayContaining(["REVISION_MISMATCH", "IDENTITY_MISMATCH"]));
  });
  it("compares pyosmium UTC revision strings by their represented instant", () => {
    const input = fixture();
    input.relations[0].timestamp = input.relations[0].timestamp.replace("T", " ").replace("Z", "+00:00");
    input.ways[0].timestamp = "2026-01-01 00:00:00+00:00";
    expect(audit(input).status).toBe("pass");
    input.ways[0].timestamp = "2026-10-24 00:00:00+00:00";
    expect(audit(input).issues).toContainEqual(expect.objectContaining({ code: "INVALID_WAY_REVISION" }));
  });
  it("records policy exclusions and fails unexplained pair/unit loss", () => {
    const input = fixture(); input.ways[0].tags.maritime = "yes";
    const report = audit(input);
    expect(report.exclusions).toContainEqual(expect.objectContaining({ wayId: 1, reason: "maritime-tag" }));
    expect(report.issues).toContainEqual(expect.objectContaining({ code: "UNIT_WITHOUT_ELIGIBLE_LINES", provinceCode: "01" }));
  });
  it("produces stable diagnostics and canonical eligible IDs from reordered arrays", () => {
    const input = fixture(); const first = audit(input);
    input.relations.reverse(); input.ways.reverse(); input.nodes.reverse();
    expect(audit(input)).toEqual(first);
  });
});
