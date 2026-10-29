/**
 * Merge recovered Khánh Hòa member ways into the pinned research snapshot.
 * Rejects incompatible shared-node coordinates. Does not invent rings.
 *
 * Usage:
 *   node scripts/province-boundaries/merge_khanh_hoa_recovery.mjs \
 *     --base .task-reports/explorer-refinement-task-05-work/province-source.research.json.gz \
 *     --recovery .task-reports/khanh-hoa-recovery-20261029/raw \
 *     --out .task-reports/khanh-hoa-recovery-20261029/province-source.merged.json.gz
 */
import { createHash } from "node:crypto";
import { createGzip, gunzipSync } from "node:zlib";
import { createWriteStream, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { finished } from "node:stream/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
export const EXPECTED_KHANH_HOA_WAY_IDS = [
  1120240923, 1120240925, 1120240927, 1120240928, 1120240930, 1120240931, 1120240932, 1120240934,
  1120240941, 1120240942, 1120240947, 1120240954, 1120240955, 1199677144, 1319181446, 1368675506,
];
const COORD_EPS = 1e-7;

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function parseArgs(argv) {
  const values = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!["--base", "--recovery", "--out"].includes(argv[i]) || !argv[i + 1]) {
      throw new Error("Usage: --base research.json.gz --recovery raw-dir --out merged.json.gz");
    }
    values[argv[i]] = argv[i + 1];
  }
  if (!values["--base"] || !values["--recovery"] || !values["--out"]) {
    throw new Error("All of --base, --recovery and --out are required");
  }
  return values;
}

function readGzipJson(path) {
  const bytes = readFileSync(path);
  const text = gunzipSync(bytes, { maxOutputLength: 64 * 1024 * 1024 }).toString("utf8");
  return { json: JSON.parse(text), sha256: sha256(bytes), bytes: bytes.length };
}

function loadRecovery(dir) {
  const files = readdirSync(dir).filter((name) => name.startsWith("way-") && name.endsWith("-full.json"));
  const ways = new Map();
  const nodes = new Map();
  const fileHashes = [];
  for (const name of files.sort()) {
    const bytes = readFileSync(resolve(dir, name));
    const json = JSON.parse(bytes.toString("utf8"));
    fileHashes.push({ file: name, sha256: sha256(bytes), bytes: bytes.length });
    for (const element of json.elements ?? []) {
      if (element.type === "node") {
        nodes.set(element.id, {
          id: element.id,
          lat: element.lat,
          lon: element.lon,
          version: element.version ?? null,
          timestamp: element.timestamp ?? null,
        });
      }
      if (element.type === "way") {
        ways.set(element.id, {
          id: element.id,
          version: element.version ?? null,
          timestamp: element.timestamp ?? null,
          tags: element.tags ?? {},
          nodes: element.nodes ?? [],
        });
      }
    }
  }
  return { ways, nodes, fileHashes };
}

export function mergeRecovery(base, recovery) {
  const nodeById = new Map(base.nodes.map((n) => [n.id, { ...n }]));
  const wayById = new Map(base.ways.map((w) => [w.id, { ...w, nodes: [...w.nodes] }]));
  const conflicts = [];
  const snapshotMs = Date.parse(base.source?.timestamp ?? "");
  if (!Number.isFinite(snapshotMs)) conflicts.push({ kind: "MISSING_SNAPSHOT_TIMESTAMP" });
  const qualifyTime = (element, id, timestamp) => {
    const ms = Date.parse(timestamp ?? "");
    if (!timestamp || !Number.isFinite(ms)) {
      conflicts.push({ kind: "MISSING_TIMESTAMP", element, id });
      return;
    }
    if (Number.isFinite(snapshotMs) && ms > snapshotMs) {
      conflicts.push({ kind: "TIMESTAMP_AFTER_SNAPSHOT", element, id, timestamp, snapshot: base.source?.timestamp });
    }
  };
  for (const conflict of recovery.duplicateNodeConflicts ?? []) conflicts.push(conflict);
  const addedNodes = [];
  const addedWays = [];
  const updatedSharedNodes = [];

  for (const wayId of EXPECTED_KHANH_HOA_WAY_IDS) {
    if (!recovery.ways.has(wayId)) conflicts.push({ kind: "MISSING_RECOVERY_WAY", wayId });
  }

  for (const [wayId, way] of recovery.ways) {
    if (!EXPECTED_KHANH_HOA_WAY_IDS.includes(wayId)) {
      conflicts.push({ kind: "UNEXPECTED_WAY", wayId });
      continue;
    }
    if (wayById.has(wayId)) {
      conflicts.push({ kind: "WAY_ALREADY_PRESENT", wayId });
      continue;
    }
    for (const nodeId of way.nodes) {
      const recovered = recovery.nodes.get(nodeId);
      if (!recovered) {
        conflicts.push({ kind: "MISSING_RECOVERY_NODE", wayId, nodeId });
        continue;
      }
      qualifyTime("node", nodeId, recovered.timestamp);
      const existing = nodeById.get(nodeId);
      if (existing) {
        const dLat = Math.abs(existing.lat - recovered.lat);
        const dLon = Math.abs(existing.lon - recovered.lon);
        if (dLat > COORD_EPS || dLon > COORD_EPS) {
          conflicts.push({
            kind: "NODE_COORD_CONFLICT",
            nodeId,
            wayId,
            base: { lat: existing.lat, lon: existing.lon },
            recovered: { lat: recovered.lat, lon: recovered.lon },
          });
        } else {
          updatedSharedNodes.push(nodeId);
        }
      } else {
        nodeById.set(nodeId, { id: recovered.id, lat: recovered.lat, lon: recovered.lon });
        addedNodes.push(nodeId);
      }
    }
    qualifyTime("way", wayId, way.timestamp);
    wayById.set(wayId, {
      id: way.id,
      version: way.version,
      timestamp: way.timestamp,
      tags: way.tags,
      nodes: [...way.nodes],
    });
    addedWays.push(wayId);
  }

  const hardConflicts = conflicts;

  return {
    ok: hardConflicts.length === 0,
    conflicts: hardConflicts,
    addedNodes: [...new Set(addedNodes)].sort((a, b) => a - b),
    addedWays: addedWays.sort((a, b) => a - b),
    updatedSharedNodes: [...new Set(updatedSharedNodes)].sort((a, b) => a - b),
    merged: {
      ...base,
      nodes: [...nodeById.values()].sort((a, b) => a.id - b.id),
      ways: [...wayById.values()].sort((a, b) => a.id - b.id),
      recovery: {
        kind: "khanh-hoa-missing-ways",
        relationId: 1887959,
        localityCode: "56",
        retrievedVia: "Cursor WebFetch of official OSM API /api/0.6/way/{id}/full.json",
        accessDate: "2026-10-29",
        license: "ODbL-1.0",
        note: "Merged recovered member ways into the pinned Geofabrik research snapshot after endpoint/node compatibility checks. Modern reference geometry only.",
      },
    },
  };
}

async function writeGzipJson(path, document) {
  mkdirSync(dirname(path), { recursive: true });
  const body = Buffer.from(`${JSON.stringify(document)}\n`, "utf8");
  const gzip = createGzip({ level: 9 });
  const out = createWriteStream(path);
  gzip.pipe(out);
  gzip.end(body);
  await finished(out);
  const written = readFileSync(path);
  return { sha256: sha256(written), bytes: written.length, rawBytes: body.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = parseArgs(process.argv.slice(2));
  const basePath = resolve(args["--base"]);
  const recoveryDir = resolve(args["--recovery"]);
  const outPath = resolve(args["--out"]);
  if (!outPath.startsWith(resolve(ROOT, ".task-reports"))) {
    throw new Error("Merged output must live under .task-reports/");
  }
  const base = readGzipJson(basePath);
  const recovery = loadRecovery(recoveryDir);
  const result = mergeRecovery(base.json, recovery);
  const reportPath = resolve(dirname(outPath), "merge-report.json");
  if (!result.ok) {
    writeFileSync(reportPath, `${JSON.stringify({ ok: false, conflicts: result.conflicts, fileHashes: recovery.fileHashes }, null, 2)}\n`);
    console.error(JSON.stringify({ ok: false, conflictCount: result.conflicts.length, reportPath }, null, 2));
    process.exitCode = 2;
  } else {
    const written = await writeGzipJson(outPath, result.merged);
    writeFileSync(
      reportPath,
      `${JSON.stringify(
        {
          ok: true,
          baseSha256: base.sha256,
          mergedSha256: written.sha256,
          mergedBytes: written.bytes,
          rawBytes: written.rawBytes,
          addedWays: result.addedWays,
          addedNodes: result.addedNodes.length,
          sharedCompatibleNodes: result.updatedSharedNodes.length,
          fileHashes: recovery.fileHashes,
          accessDate: "2026-10-29",
        },
        null,
        2,
      )}\n`,
    );
    console.log(JSON.stringify({ ok: true, outPath, mergedSha256: written.sha256, addedWays: result.addedWays.length, addedNodes: result.addedNodes.length }, null, 2));
  }
}
