/**
 * Assemble independently admitted province Polygon/MultiPolygon features from the
 * pinned OSM research snapshot. Does not invent rings for missing members.
 *
 * Usage:
 *   node scripts/province-boundaries/build_areas.mjs \
 *     --input .task-reports/.../province-source.research.json.gz \
 *     --out .task-reports/province-areas-candidate-YYYYMMDD/
 */
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import { pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const MEMBERSHIP_PATH = resolve(ROOT, "docs/audits/sources/2026-10-24-vietnam-province-membership.json");
const EXPECTED = "01 04 08 11 12 14 15 19 20 22 24 25 31 33 37 38 40 42 44 46 48 51 52 56 66 68 75 79 80 82 86 91 92 96".split(" ");

function readJson(path) {
  const bytes = readFileSync(path);
  const text = path.endsWith(".gz")
    ? gunzipSync(bytes, { maxOutputLength: 64 * 1024 * 1024 }).toString("utf8")
    : bytes.toString("utf8");
  return { json: JSON.parse(text), sha256: createHash("sha256").update(bytes).digest("hex"), bytes: bytes.length };
}

function ringArea(ring) {
  let total = 0;
  for (let i = 0; i < ring.length - 1; i++) total += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  return total / 2;
}

function closeRing(coords) {
  if (!coords.length) return coords;
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) return [...coords, [first[0], first[1]]];
  return coords;
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 0) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function segmentsIntersect(a, b, c, d) {
  const cross = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  const d1 = cross(a, b, c);
  const d2 = cross(a, b, d);
  const d3 = cross(c, d, a);
  const d4 = cross(c, d, b);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  return false;
}

function segmentBbox(a, b) {
  return {
    minX: Math.min(a[0], b[0]),
    maxX: Math.max(a[0], b[0]),
    minY: Math.min(a[1], b[1]),
    maxY: Math.max(a[1], b[1]),
  };
}

function bboxesOverlap(a, b) {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

/** Reject bow-ties and other improper self-crossings; adjacent/shared-vertex touches are allowed. */
export function ringSelfIntersects(ring) {
  const n = ring.length - 1;
  if (n < 4) return false;
  const boxes = new Array(n);
  for (let i = 0; i < n; i++) boxes[i] = segmentBbox(ring[i], ring[i + 1]);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) continue;
      if (!bboxesOverlap(boxes[i], boxes[j])) continue;
      if (segmentsIntersect(ring[i], ring[i + 1], ring[j], ring[j + 1])) return true;
    }
  }
  return false;
}

/** Documented non-geometry boundary members: recorded, never used as rings. */
const NON_GEOMETRY_ROLES = new Set(["admin_centre", "label", "subarea", "land_area"]);

/** Chain undirected ways into closed rings by shared endpoint node IDs. */
function assembleRings(members, ways, nodes) {
  const missing = [];
  const acknowledged = [];
  const byRole = { outer: [], inner: [] };
  for (const member of members) {
    const role = member.role || "";
    if (NON_GEOMETRY_ROLES.has(role)) {
      // admin_centre/label nodes and subarea relations are documented OSM boundary metadata.
      acknowledged.push({ type: member.type, ref: member.ref, role });
      continue;
    }
    if (member.type === "n" && role === "") {
      // Empty-role nodes on boundary relations are commonly admin labels in Vietnam extracts.
      acknowledged.push({ type: member.type, ref: member.ref, role: "empty-node" });
      continue;
    }
    if (member.type === "r") {
      return {
        missing: [],
        error: `NESTED_RELATION_UNRESOLVED ref=${member.ref} role=${role || "(empty)"}`,
        outer: [],
        inner: [],
        acknowledged,
      };
    }
    if (member.type !== "w") {
      return {
        missing: [],
        error: `UNEXPECTED_MEMBER_TYPE type=${member.type} ref=${member.ref} role=${role || "(empty)"}`,
        outer: [],
        inner: [],
        acknowledged,
      };
    }
    if (!["outer", "inner"].includes(role)) {
      return {
        missing: [],
        error: `UNEXPECTED_MEMBER_ROLE role=${role || "(empty)"} ref=${member.ref}`,
        outer: [],
        inner: [],
        acknowledged,
      };
    }
    const way = ways.get(member.ref);
    if (!way) {
      missing.push({ wayId: member.ref, role });
      continue;
    }
    byRole[role].push(way);
  }
  if (missing.length) return { missing, outer: [], inner: [], acknowledged };

  const ringsFor = (roleWays, roleName) => {
    const unused = new Set(roleWays.map((w) => w.id));
    const wayById = new Map(roleWays.map((w) => [w.id, w]));
    const endpointIndex = new Map();
    for (const way of roleWays) {
      if (!way.nodes || way.nodes.length < 2) {
        return { error: `DEGENERATE_WAY role=${roleName} way=${way.id}`, rings: [] };
      }
      for (const end of [way.nodes[0], way.nodes.at(-1)]) {
        if (!endpointIndex.has(end)) endpointIndex.set(end, []);
        endpointIndex.get(end).push(way.id);
      }
    }
    const rings = [];
    while (unused.size) {
      const startId = Math.min(...unused);
      const startWay = wayById.get(startId);
      unused.delete(startId);
      let nodeIds = [...startWay.nodes];
      let guard = 0;
      while (guard++ < roleWays.length + 2) {
        const tip = nodeIds[nodeIds.length - 1];
        const start = nodeIds[0];
        if (tip === start && nodeIds.length > 2) break;
        const candidates = (endpointIndex.get(tip) ?? []).filter((id) => unused.has(id));
        if (!candidates.length) break;
        if (candidates.length > 1) {
          return { error: `AMBIGUOUS_BRANCH role=${roleName} tip=${tip} ways=${candidates.join(",")}`, rings: [] };
        }
        const nextId = candidates[0];
        const next = wayById.get(nextId);
        unused.delete(nextId);
        const forward = next.nodes[0] === tip;
        const reverse = next.nodes.at(-1) === tip;
        if (!forward && !reverse) break;
        const seq = forward ? next.nodes : [...next.nodes].reverse();
        nodeIds = nodeIds.concat(seq.slice(1));
      }
      if (nodeIds[0] !== nodeIds[nodeIds.length - 1] || nodeIds.length < 4) {
        return { error: `OPEN_OR_SHORT_RING role=${roleName} startWay=${startId}`, rings: [] };
      }
      const coords = [];
      for (const nodeId of nodeIds) {
        const node = nodes.get(nodeId);
        if (!node) return { error: `MISSING_NODE ${nodeId}`, rings: [] };
        coords.push([node.lon, node.lat]);
      }
      const closed = closeRing(coords);
      if (ringSelfIntersects(closed)) {
        return { error: `SELF_INTERSECTING_RING role=${roleName} startWay=${startId}`, rings: [] };
      }
      rings.push(closed);
    }
    return { rings };
  };

  const outerBuild = ringsFor(byRole.outer, "outer");
  if (outerBuild.error) return { missing: [], error: outerBuild.error, outer: [], inner: [], acknowledged };
  const innerBuild = ringsFor(byRole.inner, "inner");
  if (innerBuild.error) return { missing: [], error: innerBuild.error, outer: [], inner: [], acknowledged };
  return { missing: [], outer: outerBuild.rings, inner: innerBuild.rings, acknowledged };
}

function normalizeOrientation(ring, clockwise) {
  const area = ringArea(ring);
  const isClockwise = area < 0;
  if (clockwise === isClockwise) return ring;
  return closeRing([...ring].reverse());
}

function buildPolygons(outerRings, innerRings) {
  if (!outerRings.length) return { error: "MISSING_OUTER" };
  const outers = outerRings.map((ring) => normalizeOrientation(ring, false));
  const inners = innerRings.map((ring) => normalizeOrientation(ring, true));
  const assigned = new Set();
  const polygons = outers.map((outer) => {
    const holes = [];
    inners.forEach((inner, index) => {
      if (assigned.has(index)) return;
      // Representative interior vertex (skip closure duplicate).
      const sample = inner[Math.min(1, inner.length - 2)];
      if (!pointInRing(sample, outer)) return;
      // Every sampled hole vertex must remain inside the candidate shell.
      for (let i = 0; i < inner.length - 1; i += Math.max(1, Math.floor((inner.length - 1) / 8))) {
        if (!pointInRing(inner[i], outer)) return;
      }
      holes.push(inner);
      assigned.add(index);
    });
    return [outer, ...holes];
  });
  if (assigned.size !== inners.length) {
    return { error: `UNASSIGNED_HOLES ${inners.length - assigned.size}` };
  }
  for (const polygon of polygons) {
    for (const ring of polygon) {
      if (ring.length < 4) return { error: "SHORT_RING" };
      if (Math.abs(ringArea(ring)) < 1e-14) return { error: "DEGENERATE_AREA" };
      for (const [lng, lat] of ring) {
        if (!Number.isFinite(lng) || !Number.isFinite(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          return { error: "INVALID_COORDINATE" };
        }
      }
    }
  }
  return {
    geometry:
      polygons.length === 1
        ? { type: "Polygon", coordinates: polygons[0] }
        : { type: "MultiPolygon", coordinates: polygons },
    partCount: polygons.length,
    holeCount: inners.length,
  };
}

export function buildProvinceAreas(input, membership) {
  const nodes = new Map(input.nodes.map((n) => [n.id, n]));
  const ways = new Map(input.ways.map((w) => [w.id, w]));
  const relations = new Map(input.relations.map((r) => [r.id, r]));
  const ledger = [];
  const features = [];

  for (const unit of membership.units) {
    const entry = {
      code: unit.code,
      officialName: unit.officialName,
      osmRelationId: unit.osmRelationId,
      status: "blocked",
      blockers: [],
      partCount: 0,
      holeCount: 0,
      outerRingCount: 0,
      innerRingCount: 0,
      missingWays: [],
    };
    const relation = relations.get(unit.osmRelationId);
    if (!relation) {
      entry.blockers.push("MISSING_RELATION");
      ledger.push(entry);
      continue;
    }
    const assembled = assembleRings(relation.members, ways, nodes);
    if (assembled.missing?.length) {
      entry.blockers.push("MISSING_WAY");
      entry.missingWays = assembled.missing;
      ledger.push(entry);
      continue;
    }
    if (assembled.error) {
      entry.blockers.push(assembled.error);
      ledger.push(entry);
      continue;
    }
    entry.outerRingCount = assembled.outer.length;
    entry.innerRingCount = assembled.inner.length;
    const built = buildPolygons(assembled.outer, assembled.inner);
    if (built.error) {
      entry.blockers.push(built.error);
      ledger.push(entry);
      continue;
    }
    entry.status = "admitted";
    entry.partCount = built.partCount;
    entry.holeCount = built.holeCount;
    ledger.push(entry);
    features.push({
      type: "Feature",
      id: `province-area:${unit.code}`,
      properties: {
        code: unit.code,
        officialName: unit.officialName,
        boundaryKind: "province-area",
        referenceFramework: "VN-34-2025",
        osmRelationId: unit.osmRelationId,
        partCount: built.partCount,
        holeCount: built.holeCount,
      },
      geometry: built.geometry,
    });
  }

  features.sort((a, b) => a.properties.code.localeCompare(b.properties.code));
  ledger.sort((a, b) => a.code.localeCompare(b.code));
  return { features, ledger };
}

function parseArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!["--input", "--out", "--membership"].includes(argv[i]) || !argv[i + 1]) {
      throw new Error("Usage: --input research.json[.gz] --out .task-reports/<dir>/ [--membership crosswalk.json]");
    }
    values[argv[i]] = argv[i + 1];
  }
  if (!values["--input"] || !values["--out"]) throw new Error("Both --input and --out are required");
  return values;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = resolve(args["--input"]);
  const outDir = resolve(args["--out"]);
  if (!outDir.startsWith(resolve(ROOT, ".task-reports"))) {
    throw new Error("Candidate output must live under .task-reports/");
  }
  mkdirSync(outDir, { recursive: true });
  const membership = JSON.parse(readFileSync(args["--membership"] ?? MEMBERSHIP_PATH, "utf8"));
  if (!Array.isArray(membership.units) || membership.units.length !== 34) throw new Error("Invalid membership");
  for (const code of EXPECTED) {
    if (!membership.units.some((u) => u.code === code)) throw new Error(`Missing membership code ${code}`);
  }

  const { json: input, sha256, bytes } = readJson(inputPath);
  const { features, ledger } = buildProvinceAreas(input, membership);
  const admitted = ledger.filter((row) => row.status === "admitted");
  const blocked = ledger.filter((row) => row.status === "blocked");
  const collection = {
    type: "FeatureCollection",
    schemaVersion: 1,
    boundaryKind: "province-area",
    referenceFramework: "VN-34-2025",
    coverageStatus: blocked.length ? "partial" : "complete",
    admittedCount: admitted.length,
    blockedCount: blocked.length,
    sourceTimestamp: input.source?.timestamp ?? null,
    sourceSnapshotSha256: sha256,
    sourceBytes: bytes,
    license: {
      id: "ODbL-1.0",
      url: "https://opendatacommons.org/licenses/odbl/1-0/",
      attribution: "© OpenStreetMap contributors",
    },
    features,
  };
  const geoPath = resolve(outDir, "history-vietnam-province-areas.partial.geojson");
  const ledgerPath = resolve(outDir, "province-area-admission-ledger.json");
  const provenancePath = resolve(outDir, "provenance.json");
  writeFileSync(geoPath, JSON.stringify(collection) + "\n");
  writeFileSync(ledgerPath, JSON.stringify({ schemaVersion: 1, units: ledger }, null, 2) + "\n");
  writeFileSync(
    provenancePath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        inputPath: inputPath.replaceAll("\\", "/"),
        inputSha256: sha256,
        admittedCount: admitted.length,
        blockedCount: blocked.length,
        blockedCodes: blocked.map((row) => row.code),
        note: "Partial candidate only. Do not treat as complete 34/34 production geometry while blocked rows remain.",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    JSON.stringify(
      {
        outDir,
        admitted: admitted.length,
        blocked: blocked.length,
        blockedCodes: blocked.map((row) => row.code),
        featureCount: features.length,
      },
      null,
      2,
    ),
  );
  process.exitCode = features.length ? 0 : 2;
}
