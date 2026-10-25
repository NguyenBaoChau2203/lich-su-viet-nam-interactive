import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { parseProvinceBoundaries, provinceBoundarySegments, PROVINCE_ALTITUDE } from "@/lib/explorer/cinematic/province-boundaries";

const basename = "history-vietnam-province-boundaries";
const directory = process.env.PROVINCE_ARTIFACT_DIR ?? "public/maps";
const reviewPath = "docs/audits/sources/2026-10-25-province-interior-source-review.json";
const reviewBytes = readFileSync(reviewPath);
const review = JSON.parse(reviewBytes.toString("utf8"));
const membership = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"));
const sourceEvidence = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-source-evidence.json", "utf8"));
const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
type Way = { wayId: number; provinceCodes: string[] };
type SpatialWay = Way & { state: string; reason: string; sourceLengthM: number; displayLengthM: number };

function loadArtifact(dir = directory) {
  const bytes = readFileSync(path.join(dir, `${basename}.geojson`));
  const provenance = JSON.parse(readFileSync(path.join(dir, `${basename}.provenance.json`), "utf8"));
  return { bytes, provenance };
}

// This gate deliberately adds source/scope approval checks to the generic runtime
// parser. The parser itself must continue to support explicitly synthetic tests.
function validateProduction(bytes: Buffer, provenance: ReturnType<typeof loadArtifact>["provenance"]) {
  const data = parseProvinceBoundaries(JSON.parse(bytes.toString("utf8")));
  assert.equal(provenance.scope, "shared-interior-lines");
  assert.equal(provenance.status, "complete-for-shared-interior-lines");
  assert.equal(provenance.fullPolygonStatus, "needs_evidence");
  assert.equal(review.scopedAudit.status, "pass");
  assert.equal(provenance.artifact.sha256, hash(bytes));
  assert.equal(hash(bytes), review.derivedArtifactSelfReview.geojsonSha256);
  assert.equal(provenance.sourceReview.sha256, hash(reviewBytes));
  assert.equal(provenance.mask.sha256, hash(readFileSync("public/maps/vietnam-tabletop.geojson")));
  assert.equal(data.sourceSnapshotSha256, sourceEvidence.researchExtraction.rawSha256);
  assert.equal(provenance.source.rawSha256, data.sourceSnapshotSha256);
  assert.equal(provenance.source.gzipSha256, sourceEvidence.researchExtraction.gzipSha256);
  assert.equal(provenance.source.pbfSha256, sourceEvidence.source.sourceSha256);
  assert.equal(data.sourceTimestamp, sourceEvidence.source.timestamp);
  assert.equal(provenance.sourceTimestamp, data.sourceTimestamp);
  assert.equal(data.license.id, "ODbL-1.0");
  assert.equal(data.license.url, "https://opendatacommons.org/licenses/odbl/1-0/");
  assert.equal(data.license.attribution, "© OpenStreetMap contributors");
  assert.equal(provenance.source.url, sourceEvidence.source.url);
  assert.ok(!/TEST-ONLY|example\.invalid|fixture-only|way-fixture/i.test(bytes.toString("utf8")));
  assert.deepEqual(data.units, membership.units.map((u: { code: string; officialName: string; osmRelationId: number; observedRelationVersion: number }) => ({
    code: u.code, name: u.officialName, sourceId: String(u.osmRelationId), sourceRevision: String(u.observedRelationVersion),
  })));
  assert.ok(data.features.length > 0);
  const eligible = new Map<number, Way>(review.scopedAudit.eligibleWays.map((w: Way) => [w.wayId, w]));
  const seenWays = new Set<number>(), pairs = new Set<string>(), units = new Set<string>();
  const origins = new Map<string, { sourceEdgeIds: string[]; provinceCodes: string[] }>(provenance.featureOrigins.map((f: { id: string; sourceEdgeIds: string[]; provinceCodes: string[] }) => [f.id, f]));
  for (const feature of data.features) {
    const { provinceCodes, sourceEdgeIds } = feature.properties;
    assert.deepEqual(origins.get(feature.id)?.sourceEdgeIds, sourceEdgeIds);
    assert.deepEqual(origins.get(feature.id)?.provinceCodes, provinceCodes);
    pairs.add(provinceCodes.join("-")); provinceCodes.forEach(c => units.add(c));
    assert.equal(new Set(sourceEdgeIds).size, sourceEdgeIds.length);
    for (const sourceId of sourceEdgeIds) {
      assert.match(sourceId, /^way:[1-9]\d*$/);
      const id = Number(sourceId.slice(4));
      assert.deepEqual(eligible.get(id)?.provinceCodes, provinceCodes);
      seenWays.add(id);
    }
  }
  const accounting: SpatialWay[] = provenance.spatialAccounting;
  assert.deepEqual(provenance.mask.sourceChannelReview, review.displayMaskReview);
  const channels = new Map<number, { sourceLengthM: number }>(review.displayMaskReview.reviewedChannelWays.map((w: Way & { sourceLengthM: number }) => [w.wayId, w]));
  const interactions = new Map<number, { sourceLengthM: number; originalMaskRetainedLengthM: number }>(review.displayMaskReview.otherMaskInteractions.map((w: Way & { sourceLengthM: number; originalMaskRetainedLengthM: number }) => [w.wayId, w]));
  assert.equal(accounting.length, eligible.size);
  assert.equal(new Set(accounting.map(w => w.wayId)).size, eligible.size);
  for (const way of accounting) {
    assert.deepEqual(way.provinceCodes, eligible.get(way.wayId)?.provinceCodes);
    assert.ok(["retained", "clipped", "excluded"].includes(way.state));
    assert.ok(way.reason && way.sourceLengthM > 0 && way.displayLengthM >= 0);
    assert.equal(seenWays.has(way.wayId), way.state !== "excluded");
    if (way.state === "excluded") assert.equal(way.reason, "immutable-national-display-mask");
    const channel = channels.get(way.wayId), interaction = interactions.get(way.wayId);
    if (channel) {
      assert.equal(way.state, "retained");
      assert.equal(way.reason, "reviewed-source-channel-context");
      assert.ok(Math.abs(way.sourceLengthM - channel.sourceLengthM) <= .001);
      assert.ok(Math.abs(way.displayLengthM - way.sourceLengthM) <= .001);
    } else if (interaction) {
      assert.equal(way.state, interaction.originalMaskRetainedLengthM === 0 ? "excluded" : "clipped");
      assert.ok(Math.abs(way.sourceLengthM - interaction.sourceLengthM) <= .001);
      assert.ok(Math.abs(way.displayLengthM - interaction.originalMaskRetainedLengthM) <= .001);
    } else {
      assert.equal(way.state, "retained");
      assert.equal(way.sourceLengthM, way.displayLengthM);
    }
  }
  assert.deepEqual([...pairs].sort(), review.scopedAudit.pairs.map((p: { provinceCodes: string[] }) => p.provinceCodes.join("-")).sort());
  assert.deepEqual([...units].sort(), membership.units.map((u: { code: string }) => u.code));
  assert.deepEqual(provenance.coverage.beforeMask, review.scopedAudit.counts);
  assert.equal(provenance.coverage.afterMask.features, data.features.length);
  assert.equal(provenance.coverage.afterMask.waysRepresented, seenWays.size);
  assert.deepEqual(provenance.coverage.afterMask.units, [...units].sort());
  assert.equal(provenance.transformation.toleranceM, review.derivedArtifactSelfReview.toleranceProjectedM);
  assert.deepEqual(provenance.missingSingleOwnerObjects, review.scopedAudit.missingSingleOwnerObjects);
  assert.deepEqual(provenance.policyExclusions, review.scopedAudit.exclusions);
  assert.deepEqual(provenance.fullSourceNegativeControl, review.fullSourceNegativeControl);
  assert.equal(provenance.fullSourceNegativeControl.productionReady, false);
  assert.equal(provenance.fullSourceNegativeControl.issues.length, 16);
  for (const [file, expected] of Object.entries(provenance.transformation.scriptHashes)) assert.equal(hash(readFileSync(file)), expected);
  assert.ok(provenance.transformation.maxSourceRelativeDisplacementM <= provenance.transformation.toleranceM + .03);
  assert.ok(provenance.transformation.conservativeLocalZoom11ErrorCssPx <= 3);
  assert.ok(provenance.transformation.toleranceM <= 80);
  const segments = provinceBoundarySegments(data, PROVINCE_ALTITUDE, .25);
  const rawSegments = data.features.reduce((n, f) => n + f.geometry.coordinates.length - 1, 0);
  const compressed = gzipSync(bytes, { level: 6 });
  assert.ok(rawSegments <= 50_000 && segments.length / 6 <= 50_000);
  assert.equal(provenance.artifact.rawSegments, rawSegments);
  assert.equal(provenance.artifact.subdividedSegments, segments.length / 6);
  assert.equal(provenance.artifact.bytes, bytes.length);
  // Deflate byte streams can differ across zlib/platform releases. Recompression
  // must always meet the budget; compare recorded byte hashes on the same toolchain.
  if (provenance.transformation.runtimeCompression.zlib === process.versions.zlib
    && provenance.transformation.runtimeCompression.platform === process.platform) {
    assert.equal(provenance.artifact.runtimeGzipBytes, compressed.length);
    assert.equal(provenance.artifact.runtimeGzipSha256, hash(compressed));
  }
  assert.ok(provenance.artifact.gzipBytes <= 200 * 1024);
  assert.ok(compressed.length <= 200 * 1024);
  return { data, rawSegments, renderedSegments: segments.length / 6, bytes: bytes.length, gzipBytes: compressed.length, positionBytes: segments.byteLength };
}

describe("real province production artifact (offline, no ignored source/PBF required)", () => {
  it("serves reviewed source-derived geometry through the actual runtime parser/subdivision", () => {
    const { bytes, provenance } = loadArtifact();
    const result = validateProduction(bytes, provenance);
    const runtime = ["history-world-land.geojson", "vietnam-tabletop.geojson", "history-country-boundaries.geojson", "history-vietnam-labels.json"];
    const totalGzipBytes = runtime.reduce((sum, f) => sum + gzipSync(readFileSync(path.join("public/maps", f)), { level: 6 }).length, result.gzipBytes);
    expect(totalGzipBytes).toBeLessThanOrEqual(800 * 1024);
    console.info("Real province runtime budgets", { ...result, data: undefined, totalGzipBytes });
  });
  it("rejects absent production files instead of accepting optional-loader fallback", () => {
    expect(() => loadArtifact(".task-reports/never-a-production-artifact-directory")).toThrow(/ENOENT/);
  });
  it("rejects byte/hash tampering and a narrower or full-polygon scope claim", () => {
    const { bytes, provenance } = loadArtifact();
    expect(() => validateProduction(Buffer.concat([bytes, Buffer.from(" ")]), provenance)).toThrow();
    expect(() => validateProduction(bytes, { ...provenance, scope: "full-polygons" })).toThrow();
    expect(() => validateProduction(bytes, { ...provenance, sourceReview: { sha256: "0".repeat(64) } })).toThrow();
  });
  it("rejects TEST-ONLY/example.invalid geometry even with a matching artifact checksum", () => {
    const { bytes, provenance } = loadArtifact();
    const fixture = JSON.parse(bytes.toString("utf8"));
    fixture.license = { id: "TEST-ONLY", url: "https://example.invalid/synthetic", attribution: "Fixture only" };
    const changed = Buffer.from(JSON.stringify(fixture));
    expect(() => validateProduction(changed, { ...provenance, artifact: { ...provenance.artifact, sha256: hash(changed) } })).toThrow();
  });
  it("rejects rehashed coordinate drift that was never accepted in the source review", () => {
    const { bytes, provenance } = loadArtifact();
    const changed = JSON.parse(bytes.toString("utf8"));
    changed.features[0].geometry.coordinates[0][0] = Number((changed.features[0].geometry.coordinates[0][0] + .000123).toFixed(7));
    const altered = Buffer.from(JSON.stringify(changed) + "\n");
    const compressed = gzipSync(altered, { level: 6 });
    expect(() => validateProduction(altered, { ...provenance, artifact: { ...provenance.artifact,
      sha256: hash(altered), bytes: altered.length, runtimeGzipBytes: compressed.length, runtimeGzipSha256: hash(compressed),
    } })).toThrow();
  });
});
