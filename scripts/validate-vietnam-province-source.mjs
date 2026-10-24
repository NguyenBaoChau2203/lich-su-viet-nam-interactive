#!/usr/bin/env node
/**
 * Offline research gate, NOT a province builder or a production data validator.
 * A successful structural audit still requires polygon, rights and source review.
 * It never writes geometry and never marks a source production-ready.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { gunzipSync } from "node:zlib";

const MEMBERSHIP_URL = new URL("../docs/audits/sources/2026-10-24-vietnam-province-membership.json", import.meta.url);
const EXPECTED_CODES = "01 04 08 11 12 14 15 19 20 22 24 25 31 33 37 38 40 42 44 46 48 51 52 56 66 68 75 79 80 82 86 91 92 96".split(" ");
const positiveId = value => Number.isSafeInteger(value) && value > 0;
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const canonicalName = value => typeof value === "string" ? value.normalize("NFC").replace(/^(Thành phố|Tỉnh) /u, "") : null;

export function auditProvinceSource(input, manifest) {
  const issues = [];
  const add = (code, details = {}) => issues.push({ code, ...details });
  const report = {
    schemaVersion: 1,
    status: "needs_evidence",
    productionReady: false,
    polygonValidity: "not_verified",
    sourceTimestamp: object(input?.source) ? input.source.timestamp ?? null : null,
    membership: { expected: 34, matched: 0 },
    topology: { availableWays: 0, referencedWays: 0, missingWays: 0, availableNodes: 0, sharedWays: 0, singleOwnerWays: 0, excludedSharedWays: 0, interiorCandidateSegments: 0 },
    nameDifferences: [],
    issues,
  };
  const finish = () => {
    issues.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b), "en"));
    report.nameDifferences.sort((a, b) => a.provinceCode.localeCompare(b.provinceCode));
    return { ...report, structurallyComplete: issues.length === 0 };
  };

  const units = manifest?.units;
  if (!Array.isArray(units) || units.length !== 34) {
    add("INVALID_MEMBERSHIP", { message: "Expected the authoritative 34-unit crosswalk." });
    return finish();
  }
  const codes = new Set(), relationIds = new Set(), isoCodes = new Set();
  for (const unit of units) {
    if (!object(unit) || !EXPECTED_CODES.includes(unit.code) || !positiveId(unit.osmRelationId) || !/^VN-[A-Z0-9]{2}$/.test(unit.osmIsoCode ?? "") || !canonicalName(unit.officialName) || codes.has(unit.code) || relationIds.has(unit.osmRelationId) || isoCodes.has(unit.osmIsoCode)) {
      add("INVALID_MEMBERSHIP", { message: "Missing, unknown or duplicated government code, relation ID, name or ISO identity." });
      return finish();
    }
    codes.add(unit.code); relationIds.add(unit.osmRelationId); isoCodes.add(unit.osmIsoCode);
  }
  if (!object(input) || input.schemaVersion !== 1 || ![input.relations, input.ways, input.nodes].every(Array.isArray)) {
    add("INVALID_INPUT", { message: "Expected a research relation/way/node snapshot; centers and polygons without source topology cannot satisfy this gate." });
    return finish();
  }
  if (!object(input.source) || typeof input.source.timestamp !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(input.source.timestamp) || !Number.isFinite(Date.parse(input.source.timestamp)) || input.source.license !== "ODbL-1.0") {
    add("INVALID_SOURCE_METADATA", { message: "A represented snapshot timestamp and OSM data license are required; a repository code license is insufficient." });
  }

  const nodes = new Map(), ways = new Map(), relations = new Map();
  for (const node of input.nodes) {
    if (!object(node) || !positiveId(node.id)) { add("INVALID_NODE"); continue; }
    if (nodes.has(node.id)) { add("DUPLICATE_NODE", { nodeId: node.id }); continue; }
    nodes.set(node.id, node);
    if (typeof node.lon !== "number" || !Number.isFinite(node.lon) || node.lon < -180 || node.lon > 180 || typeof node.lat !== "number" || !Number.isFinite(node.lat) || node.lat < -90 || node.lat > 90) {
      add("INVALID_COORDINATE", { nodeId: node.id });
    }
  }
  report.topology.availableNodes = nodes.size;
  for (const way of input.ways) {
    if (!object(way) || !positiveId(way.id) || !Array.isArray(way.nodes) || way.nodes.length < 2 || !way.nodes.every(positiveId) || !object(way.tags)) {
      add("INVALID_WAY", { wayId: way?.id ?? null }); continue;
    }
    if (ways.has(way.id)) { add("DUPLICATE_WAY", { wayId: way.id }); continue; }
    ways.set(way.id, way);
    for (const nodeId of new Set(way.nodes)) if (!nodes.has(nodeId)) add("MISSING_NODE", { wayId: way.id, nodeId });
  }
  report.topology.availableWays = ways.size;
  for (const relation of input.relations) {
    if (!object(relation) || !positiveId(relation.id) || !object(relation.tags) || !Array.isArray(relation.members)) { add("INVALID_RELATION"); continue; }
    if (relations.has(relation.id)) { add("DUPLICATE_RELATION", { relationId: relation.id }); continue; }
    relations.set(relation.id, relation);
    if (!relationIds.has(relation.id)) add("UNKNOWN_RELATION", { relationId: relation.id });
  }

  const owners = new Map();
  for (const unit of [...units].sort((a, b) => a.code.localeCompare(b.code))) {
    const relation = relations.get(unit.osmRelationId);
    if (!relation) { add("MISSING_RELATION", { provinceCode: unit.code, relationId: unit.osmRelationId }); continue; }
    const tags = relation.tags;
    if (tags.boundary !== "administrative" || tags.admin_level !== "4" || tags["ISO3166-2"] !== unit.osmIsoCode || canonicalName(tags.name) !== canonicalName(unit.officialName)) {
      add("IDENTITY_MISMATCH", { provinceCode: unit.code, relationId: relation.id });
    } else {
      report.membership.matched++;
      if (tags.name !== unit.officialName) report.nameDifferences.push({ provinceCode: unit.code, officialName: unit.officialName, osmName: tags.name });
    }
    const seen = new Set(), endpoints = { outer: new Map(), inner: new Map() };
    let outerCount = 0, complete = true;
    for (const member of relation.members) {
      if (!object(member) || !positiveId(member.ref)) { add("INVALID_MEMBER", { relationId: relation.id }); continue; }
      if (member.type !== "w") {
        if (!((member.type === "n" && ["admin_centre", "label"].includes(member.role)) || (member.type === "r" && member.role === "subarea"))) add("UNKNOWN_MEMBER_ROLE", { relationId: relation.id, role: member.role ?? null });
        continue;
      }
      if (!["outer", "inner"].includes(member.role)) { add("UNKNOWN_MEMBER_ROLE", { relationId: relation.id, wayId: member.ref, role: member.role ?? null }); continue; }
      if (member.role === "outer") outerCount++;
      if (seen.has(member.ref)) { add("DUPLICATE_WAY_MEMBERSHIP", { relationId: relation.id, wayId: member.ref }); continue; }
      seen.add(member.ref);
      if (!owners.has(member.ref)) owners.set(member.ref, new Set());
      owners.get(member.ref).add(unit.code);
      const way = ways.get(member.ref);
      if (!way) { add("MISSING_WAY", { provinceCode: unit.code, relationId: relation.id, wayId: member.ref, role: member.role }); complete = false; continue; }
      for (const node of [way.nodes[0], way.nodes.at(-1)]) endpoints[member.role].set(node, (endpoints[member.role].get(node) ?? 0) + 1);
    }
    if (!outerCount) add("MISSING_OUTER", { provinceCode: unit.code, relationId: relation.id });
    if (complete) for (const role of ["outer", "inner"]) {
      const invalid = [...endpoints[role]].filter(([, degree]) => degree !== 2).sort(([a], [b]) => a - b);
      if (invalid.length) add("OPEN_RING", { provinceCode: unit.code, relationId: relation.id, role, endpoints: invalid.map(([nodeId, degree]) => ({ nodeId, degree })) });
    }
  }

  const nationalIds = new Set(input.national?.members?.filter(member => member.type === "w").map(member => member.ref) ?? []);
  const edgeWays = new Map();
  report.topology.referencedWays = owners.size;
  for (const [wayId, provinces] of [...owners].sort(([a], [b]) => a - b)) {
    const way = ways.get(wayId);
    if (!way) { report.topology.missingWays++; continue; }
    if (provinces.size > 2) add("NON_MANIFOLD_WAY", { wayId, provinceCodes: [...provinces].sort() });
    if (provinces.size === 1) report.topology.singleOwnerWays++;
    if (provinces.size === 2) {
      report.topology.sharedWays++;
      if (way.tags.maritime === "yes" || way.tags.disputed === "yes" || way.tags.boundary === "disputed" || nationalIds.has(wayId)) report.topology.excludedSharedWays++;
      else report.topology.interiorCandidateSegments += way.nodes.length - 1;
    }
    for (let index = 1; index < way.nodes.length; index++) {
      const a = way.nodes[index - 1], b = way.nodes[index];
      if (a === b) { add("DEGENERATE_EDGE", { wayId, nodeId: a }); continue; }
      const key = a < b ? `${a}:${b}` : `${b}:${a}`;
      if (edgeWays.has(key)) add("DUPLICATE_SOURCE_EDGE", { wayId, otherWayId: edgeWays.get(key), edge: key });
      else edgeWays.set(key, wayId);
    }
  }
  return finish();
}

export function readResearchSnapshot(filename) {
  const bytes = readFileSync(filename);
  return JSON.parse((filename.endsWith(".gz") ? gunzipSync(bytes, { maxOutputLength: 64 * 1024 * 1024 }) : bytes).toString("utf8"));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const args = process.argv.slice(2);
    const values = {};
    for (let index = 0; index < args.length; index += 2) {
      if (!["--input", "--membership", "--report"].includes(args[index]) || !args[index + 1] || values[args[index]]) throw new Error("Usage: --input research.json[.gz] [--membership crosswalk.json] [--report diagnostic.json]");
      values[args[index]] = args[index + 1];
    }
    if (!values["--input"]) throw new Error("An explicit local --input is required; this validator never downloads or fabricates source geometry.");
    const manifest = JSON.parse(readFileSync(values["--membership"] ?? MEMBERSHIP_URL, "utf8"));
    const report = auditProvinceSource(readResearchSnapshot(values["--input"]), manifest);
    const output = JSON.stringify(report, null, 2) + "\n";
    if (values["--report"]) writeFileSync(values["--report"], output);
    process.stdout.write(output);
    process.exitCode = report.structurallyComplete ? 0 : 2;
  } catch (error) {
    process.stdout.write(JSON.stringify({ status: "needs_evidence", productionReady: false, issues: [{ code: "INVALID_INPUT", message: error.message }] }) + "\n");
    process.exitCode = 2;
  }
}
