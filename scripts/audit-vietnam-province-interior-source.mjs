#!/usr/bin/env node
/** Offline, independent mutual-edge audit. A pass NEVER certifies full polygons. */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { gunzipSync } from "node:zlib";

export const SOURCE_PINS = Object.freeze({
  rawSha256: "587a00e6aedc42f461c100fcaa33c4ac80f78dd5c00afddc1f7d748e9e3fef3c",
  gzipSha256: "5504fab937f8f991a4926334e441da1f9f1b6a9219ec303eff82dd44f41c76d0",
  pbfSha256: "c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90",
  timestamp: "2026-10-23T20:20:51Z",
  url: "https://download.geofabrik.de/asia/vietnam-261023.osm.pbf",
  publisher: "OpenStreetMap contributors / Geofabrik GmbH",
});
const CODES = "01 04 08 11 12 14 15 19 20 22 24 25 31 33 37 38 40 42 44 46 48 51 52 56 66 68 75 79 80 82 86 91 92 96".split(" ");
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const id = value => Number.isSafeInteger(value) && value > 0;
const name = value => typeof value === "string" ? value.normalize("NFC").replace(/^(Thành phố|Tỉnh) /u, "") : null;
// pyosmium 4.3.2 serializes revisions as "YYYY-MM-DD HH:mm:ss+00:00".
const utc = value => typeof value === "string" ? value.replace(" ", "T").replace(/\+00:00$/, "Z") : value;
const timestamp = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(utc(value)) && Number.isFinite(Date.parse(utc(value))) && new Date(utc(value)).toISOString().slice(0, 19) === utc(value).slice(0, 19);
export const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

export function auditProvinceInteriorSource(input, membership) {
  const issues = [], exclusions = [], missingSingleOwnerObjects = [], eligibleWays = [];
  const add = (code, details = {}) => issues.push({ code, ...details });
  const counts = { matchedUnits: 0, referencedWays: 0, availableWays: 0, sharedWays: 0, singleOwnerWays: 0, missingSingleOwnerWays: 0, policyExcludedWays: 0, eligibleWays: 0, rawSegments: 0, pairs: 0, representedUnits: 0 };
  const pairs = new Map();
  const finish = () => ({
    schemaVersion: 1, scope: "shared-interior-lines", status: issues.length ? "fail" : "pass",
    completeness: issues.length ? "not-certified" : "complete-for-shared-interior-lines",
    fullPolygonStatus: "needs_evidence", sourceTimestamp: input?.source?.timestamp ?? null,
    counts, eligibleWayIds: eligibleWays.map(w => w.wayId), eligibleWays,
    pairs: [...pairs].sort(([a], [b]) => a.localeCompare(b)).map(([pair, ways]) => ({ provinceCodes: pair.split("-"), wayIds: ways })),
    exclusions, missingSingleOwnerObjects,
    issues: issues.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), "en")),
    limitation: "Mutual source-way reference lines only. Missing single-owner membership gives no evidence of physical location. No full polygons, legal/survey accuracy, historical borders or point-in-province use.",
  });
  if (!object(input) || input.schemaVersion !== 1 || ![input.relations, input.ways, input.nodes].every(Array.isArray)) { add("INVALID_INPUT"); return finish(); }
  if (!object(input.source) || input.source.timestamp !== SOURCE_PINS.timestamp || input.source.url !== SOURCE_PINS.url || input.source.publisher !== SOURCE_PINS.publisher || input.source.license !== "ODbL-1.0") add("SOURCE_MANIFEST_MISMATCH");
  const units = membership?.units;
  if (!Array.isArray(units) || units.length !== 34) { add("INVALID_MEMBERSHIP"); return finish(); }
  const codes = new Set(), relationIds = new Set(), isoCodes = new Set();
  for (const unit of units) {
    if (!object(unit) || !CODES.includes(unit.code) || codes.has(unit.code) || !name(unit.officialName) || !id(unit.osmRelationId) || relationIds.has(unit.osmRelationId) || !/^VN-[A-Z0-9]{2}$/.test(unit.osmIsoCode ?? "") || isoCodes.has(unit.osmIsoCode) || !id(unit.observedRelationVersion) || !timestamp(unit.observedRelationTimestamp)) { add("INVALID_MEMBERSHIP"); return finish(); }
    codes.add(unit.code); relationIds.add(unit.osmRelationId); isoCodes.add(unit.osmIsoCode);
  }
  const relations = new Map();
  for (const relation of input.relations) {
    if (!object(relation) || !id(relation.id) || !object(relation.tags) || !Array.isArray(relation.members)) { add("INVALID_RELATION"); continue; }
    if (relations.has(relation.id)) { add("DUPLICATE_RELATION", { relationId: relation.id }); continue; }
    if (!relationIds.has(relation.id)) add("UNKNOWN_RELATION", { relationId: relation.id });
    relations.set(relation.id, relation);
  }
  // IMPORTANT: collect ALL ownership before consulting available geometry.
  const ownership = new Map();
  for (const unit of [...units].sort((a, b) => a.code.localeCompare(b.code))) {
    const relation = relations.get(unit.osmRelationId);
    if (!relation) { add("MISSING_RELATION", { relationId: unit.osmRelationId, provinceCode: unit.code }); continue; }
    if (relation.tags.boundary !== "administrative" || relation.tags.admin_level !== "4" || relation.tags["ISO3166-2"] !== unit.osmIsoCode || name(relation.tags.name) !== name(unit.officialName)) add("IDENTITY_MISMATCH", { provinceCode: unit.code });
    else counts.matchedUnits++;
    if (relation.version !== unit.observedRelationVersion || !timestamp(relation.timestamp) || utc(relation.timestamp) !== utc(unit.observedRelationTimestamp) || utc(relation.timestamp) > SOURCE_PINS.timestamp) add("REVISION_MISMATCH", { relationId: relation.id });
    const seen = new Set();
    for (const member of relation.members) {
      if (!object(member) || !id(member.ref)) { add("INVALID_MEMBER", { relationId: relation.id }); continue; }
      if (member.type !== "w") {
        if (!((member.type === "n" && ["label", "admin_centre"].includes(member.role)) || (member.type === "r" && member.role === "subarea"))) add("UNKNOWN_MEMBER_ROLE", { relationId: relation.id, role: member.role ?? null });
        continue;
      }
      if (!["outer", "inner"].includes(member.role)) add("UNKNOWN_MEMBER_ROLE", { relationId: relation.id, wayId: member.ref, role: member.role ?? null });
      if (seen.has(member.ref)) add("DUPLICATE_WAY_MEMBERSHIP", { relationId: relation.id, wayId: member.ref });
      seen.add(member.ref);
      if (!ownership.has(member.ref)) ownership.set(member.ref, { codes: new Set(), roles: new Set() });
      ownership.get(member.ref).codes.add(unit.code);
      ownership.get(member.ref).roles.add(member.role);
    }
  }
  const nodes = new Map(), ways = new Map();
  for (const node of input.nodes) {
    if (!object(node) || !id(node.id)) { add("INVALID_NODE"); continue; }
    if (nodes.has(node.id)) { add("DUPLICATE_NODE", { nodeId: node.id }); continue; }
    nodes.set(node.id, node);
    if (typeof node.lon !== "number" || !Number.isFinite(node.lon) || Math.abs(node.lon) > 180 || typeof node.lat !== "number" || !Number.isFinite(node.lat) || Math.abs(node.lat) > 90) add("INVALID_COORDINATE", { nodeId: node.id });
  }
  for (const way of input.ways) {
    if (!object(way) || !id(way.id) || !Array.isArray(way.nodes) || way.nodes.length < 2 || !way.nodes.every(id) || !object(way.tags)) { add("INVALID_WAY", { wayId: way?.id ?? null }); continue; }
    if (ways.has(way.id)) { add("DUPLICATE_WAY", { wayId: way.id }); continue; }
    ways.set(way.id, way);
    if (!id(way.version) || !timestamp(way.timestamp) || utc(way.timestamp) > SOURCE_PINS.timestamp) add("INVALID_WAY_REVISION", { wayId: way.id });
    if (!ownership.has(way.id)) add("UNOWNED_WAY", { wayId: way.id });
  }
  if (input.national?.id !== 49915 || !Array.isArray(input.national?.members)) add("INVALID_NATIONAL_MEMBERSHIP");
  const national = new Set(input.national?.members?.filter(m => m.type === "w").map(m => m.ref) ?? []);
  const edges = new Map(), coordinateEdges = new Map(), covered = new Set();
  counts.referencedWays = ownership.size; counts.availableWays = ways.size;
  for (const [wayId, owners] of [...ownership].sort(([a], [b]) => a - b)) {
    const provinceCodes = [...owners.codes].sort(), roles = [...owners.roles].sort(), way = ways.get(wayId);
    if (provinceCodes.length > 2) add("NON_MANIFOLD_WAY", { wayId, provinceCodes });
    if (provinceCodes.length === 1) {
      counts.singleOwnerWays++;
      exclusions.push({ wayId, provinceCodes, reason: "single-owner-outside-mutual-scope", available: Boolean(way) });
      if (!way) { counts.missingSingleOwnerWays++; missingSingleOwnerObjects.push({ wayId, provinceCodes, roles, reason: "single-owner-outside-mutual-scope" }); }
    } else counts.sharedWays++;
    if (!way) { if (provinceCodes.length >= 2) add("MISSING_SHARED_WAY", { wayId, provinceCodes }); continue; }
    for (const nodeId of new Set(way.nodes)) if (!nodes.has(nodeId)) add("MISSING_NODE", { wayId, nodeId });
    // Verify all available referenced ways, including policy exclusions.
    for (let i = 1; i < way.nodes.length; i++) {
      const a = way.nodes[i - 1], b = way.nodes[i];
      if (a === b) { add("DEGENERATE_EDGE", { wayId, nodeId: a }); continue; }
      const key = [a, b].sort((x, y) => x - y).join(":");
      if (edges.has(key)) add("DUPLICATE_SOURCE_EDGE", { wayId, otherWayId: edges.get(key), edge: key });
      edges.set(key, wayId);
      if (nodes.has(a) && nodes.has(b)) {
        const positions = [a, b].map(n => `${nodes.get(n).lon},${nodes.get(n).lat}`).sort();
        if (positions[0] === positions[1]) add("DEGENERATE_COORDINATE_EDGE", { wayId });
        const ckey = positions.join("|");
        if (coordinateEdges.has(ckey) && coordinateEdges.get(ckey) !== key) add("DUPLICATE_COORDINATE_EDGE", { wayId, edge: ckey });
        coordinateEdges.set(ckey, key);
      }
    }
    if (provinceCodes.length !== 2) continue;
    const reasons = [];
    if (way.tags.maritime === "yes") reasons.push("maritime-tag");
    if (way.tags.disputed === "yes" || way.tags.boundary === "disputed") reasons.push("disputed-tag");
    if (national.has(wayId)) reasons.push("national-relation-member");
    if (reasons.length) { counts.policyExcludedWays++; exclusions.push({ wayId, provinceCodes, reason: reasons[0], reasons, available: true }); continue; }
    const key = provinceCodes.join("-");
    if (!pairs.has(key)) pairs.set(key, []);
    pairs.get(key).push(wayId); provinceCodes.forEach(c => covered.add(c));
    eligibleWays.push({ wayId, provinceCodes, version: way.version, timestamp: utc(way.timestamp), segments: way.nodes.length - 1, endpoints: [way.nodes[0], way.nodes.at(-1)] });
    counts.rawSegments += way.nodes.length - 1;
  }
  for (const code of CODES) if (!covered.has(code)) add("UNIT_WITHOUT_ELIGIBLE_LINES", { provinceCode: code });
  counts.eligibleWays = eligibleWays.length; counts.pairs = pairs.size; counts.representedUnits = covered.size;
  return finish();
}

/** Hash original bytes, NEVER a JSON serialization. Both pins precede parsing/auditing. */
export function readPinnedResearch(filename) {
  const compressed = readFileSync(filename);
  if (sha256(compressed) !== SOURCE_PINS.gzipSha256) throw new Error("Compressed research checksum differs from reviewed pin");
  const raw = gunzipSync(compressed, { maxOutputLength: 64 * 1024 * 1024 });
  if (sha256(raw) !== SOURCE_PINS.rawSha256) throw new Error("Decompressed research checksum differs from reviewed pin");
  return { input: JSON.parse(raw.toString("utf8")), verifiedHashes: { ...SOURCE_PINS, rawBytes: raw.length, gzipBytes: compressed.length } };
}

export function auditPinnedFiles(inputPath, membershipPath) {
  const { input, verifiedHashes } = readPinnedResearch(inputPath);
  const membershipBytes = readFileSync(membershipPath);
  const membership = JSON.parse(membershipBytes.toString("utf8"));
  return { input, membership, report: { ...auditProvinceInteriorSource(input, membership), verifiedHashes: { ...verifiedHashes, membershipSha256: sha256(membershipBytes) } } };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const values = {};
    for (let i = 2; i < process.argv.length; i += 2) {
      const key = process.argv[i];
      if (!["--input", "--membership", "--report"].includes(key) || !process.argv[i + 1] || values[key]) throw new Error("Usage: --input research.json.gz --membership crosswalk.json --report audit.json");
      values[key] = process.argv[i + 1];
    }
    if (!values["--input"] || !values["--membership"]) throw new Error("Explicit local input and membership required");
    if (values["--report"]) {
      const target = path.resolve(values["--report"]), publicRoot = path.resolve("public");
      if (target === publicRoot || target.startsWith(publicRoot + path.sep) || [values["--input"], values["--membership"]].some(p => path.resolve(p) === target)) throw new Error("Audit cannot write public geometry or overwrite inputs");
    }
    const { report } = auditPinnedFiles(values["--input"], values["--membership"]);
    const output = JSON.stringify(report, null, 2) + "\n";
    if (values["--report"]) writeFileSync(values["--report"], output);
    process.stdout.write(output);
    process.exitCode = report.status === "pass" ? 0 : 2;
  } catch (error) {
    process.stdout.write(JSON.stringify({ scope: "shared-interior-lines", status: "fail", fullPolygonStatus: "needs_evidence", issues: [{ code: "INVALID_INPUT", message: error.message }] }) + "\n");
    process.exitCode = 2;
  }
}
