#!/usr/bin/env node
/** Bounded offline candidate builder. Promotion is a separate production-data gate. */
import { readFileSync, writeFileSync, realpathSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { gzipSync } from "node:zlib";
import { auditPinnedFiles, sha256 } from "./audit-vietnam-province-interior-source.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

export function safeOutputDirectory(directory) {
  const target = path.resolve(directory), scratch = path.resolve(ROOT, ".task-reports");
  let ancestor = target;
  while (!existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const actualAncestor = realpathSync(ancestor);
  if (!target.startsWith(scratch + path.sep) || !(actualAncestor === scratch || actualAncestor.startsWith(scratch + path.sep))) throw new Error("Candidate output must stay under repository .task-reports/; no public/source overwrite");
  return target;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const values = {};
    for (let i = 2; i < process.argv.length; i += 2) {
      const key = process.argv[i];
      if (!["--input", "--membership", "--mask", "--source-review", "--output-dir"].includes(key) || !process.argv[i + 1] || values[key]) throw new Error("Expected --input --membership --mask --source-review --output-dir");
      values[key] = path.resolve(process.argv[i + 1]);
    }
    if (Object.keys(values).length !== 5) throw new Error("All five explicit local paths are required");
    const output = safeOutputDirectory(values["--output-dir"]);
    for (const key of ["--input", "--membership", "--mask", "--source-review"]) if (values[key] === output || values[key].startsWith(output + path.sep)) throw new Error("Candidate cannot overwrite an input directory");
    const { report } = auditPinnedFiles(values["--input"], values["--membership"]);
    const review = JSON.parse(readFileSync(values["--source-review"], "utf8"));
    if (report.status !== "pass" || review.scope !== "shared-interior-lines" || !isDeepStrictEqual(report, review.scopedAudit)) throw new Error("Current scoped audit does not match the reviewed source record");
    const mask = readFileSync(values["--mask"]);
    if (sha256(mask) !== "2239001e2c4030421949a760feb4e1ddae5abe192bd7827344848851a431a895") throw new Error("Display mask differs from the immutable reviewed national/island context");
    const result = spawnSync("uv", ["run", "--offline", "--with", "shapely==2.1.2", "python", path.resolve(ROOT, "scripts/province-boundaries/build_interior.py"), ...Object.entries(values).flat()], { cwd: ROOT, encoding: "utf8", maxBuffer: 1024 * 1024, timeout: 180000 });
    process.stdout.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    if (result.error) throw result.error;
    if (result.status === 0) {
      const name = "history-vietnam-province-boundaries";
      const compressed = gzipSync(readFileSync(path.join(output, `${name}.geojson`)), { level: 6 });
      const provenancePath = path.join(output, `${name}.provenance.json`);
      const provenance = JSON.parse(readFileSync(provenancePath, "utf8"));
      provenance.artifact.runtimeGzipBytes = compressed.length;
      provenance.artifact.runtimeGzipSha256 = sha256(compressed);
      provenance.transformation.runtimeCompression = { node: process.versions.node, zlib: process.versions.zlib, platform: process.platform, level: 6, mtime: 0 };
      if (compressed.length > 200 * 1024) throw new Error("Runtime gzip exceeds the unchanged province budget");
      const provenanceBytes = Buffer.from(JSON.stringify(provenance) + "\n");
      writeFileSync(provenancePath, provenanceBytes);
      process.stdout.write(JSON.stringify({ runtimeGzipBytes: compressed.length, provenanceSha256: sha256(provenanceBytes) }) + "\n");
    }
    process.exitCode = result.status ?? 2;
  } catch (error) {
    process.stderr.write(`Interior candidate build rejected: ${error.message}\n`);
    process.exitCode = 2;
  }
}
