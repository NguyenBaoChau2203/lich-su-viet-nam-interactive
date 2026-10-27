import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { canonical } from "./local-heroes-schema.mjs";
import { renderLivePublication, renderLiveRollback } from "./local-heroes-live-release-sql.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const inputPath = "supabase/content/local-heroes/release-phase-07-remediation/snapshot.json";
const sha = (b) => createHash("sha256").update(b).digest("hex");
const read = (p) => JSON.parse(fs.readFileSync(path.resolve(root, p), "utf8"));
const fail = (message) => { throw Error(message); };
export function createLiveRelease(baselinePath, evidencePath) {
  const baselineBytes = fs.readFileSync(path.resolve(root, baselinePath)), baseline = JSON.parse(baselineBytes), evidence = read(evidencePath), input = read(inputPath);
  if (baseline.kind !== "read-only-public-content-before-image" || baseline.projectRef !== "ueolfjujjybutyuyfxha" || evidence.projectRef !== baseline.projectRef || evidence.baselineSha256 !== sha(baselineBytes)) fail("BEFORE_IMAGE_MISMATCH");
  if (evidence.kind !== "local-heroes-live-legacy-enrollment-evidence" || evidence.inputSnapshotHash !== input.snapshotHash || input.reviewCompletePeople !== 35 || input.representedLocalities !== 34) fail("LEGACY_EVIDENCE_REQUIRED");
  for (const source of evidence.sourceRecords) {
    if (Object.values(source).some((v) => typeof v === "string" && (v !== v.normalize("NFC") || /[\u0000-\u001f\u007f]/u.test(v)))
      || !source.title?.trim() || !source.citation?.trim() || !source.author_org?.trim() || !/^https:\/\/[^/@\s?#]+(?:[/?#][^\s]*)?$/u.test(source.url)) fail("SOURCE_METADATA_INVALID");
  }
  const rows = structuredClone(input.rows), selected = new Map(input.people.map((p) => [p.id, p]));
  const canonicalPeople = baseline.figures.filter((p) => selected.has(p.id));
  if (canonicalPeople.length !== 3 || canonicalPeople.some((p) => p.name !== selected.get(p.id).name || p.slug !== selected.get(p.id).slug || p.workflow_status !== "published")
    || evidence.entries.length !== 3 || evidence.entries.some((e) => !canonicalPeople.some((p) => p.id === e.figureId))) fail("CANONICAL_IDENTITY_CONFLICT");
  for (const p of baseline.figures) if (input.people.some((s) => s.slug === p.slug && s.id !== p.id)) fail("CANONICAL_IDENTITY_CONFLICT");
  for (const e of evidence.entries) {
    const legacy = canonicalPeople.find((p) => p.id === e.figureId);
    if (JSON.stringify(canonical(e.preservedLegacy)) !== JSON.stringify(canonical(legacy))) fail("BEFORE_IMAGE_MISMATCH");
    const figure = rows.historical_figures.find((p) => p.id === e.figureId);
    Object.assign(figure, legacy);
    for (const [field, value] of Object.entries(legacy).filter(([k, v]) => ["biography", "birth_year", "death_year"].includes(k) && v !== null && v !== "")) {
      const claim = e.claims.find((c) => c.field === field);
      if (!claim || claim.decision !== "accepted" || claim.certainty !== "verified" || claim.claimText !== String(value) || !claim.refs.length) fail("LEGACY_EVIDENCE_REQUIRED");
      rows.figure_sources = rows.figure_sources.filter((s) => !(s.figure_id === legacy.id && s.claim_key === field));
      for (const ref of claim.refs) {
        const check = evidence.sourceChecks.find((s) => s.sourceId === ref.sourceId);
        if (!check || check.decision !== "accepted" || check.httpStatus !== 200 || !/^[a-f0-9]{64}$/u.test(check.sha256) || !ref.locator || !ref.scopeNote) fail("LEGACY_EVIDENCE_REQUIRED");
        if (![...rows.sources, ...evidence.sourceRecords].some((s) => s.id === ref.sourceId && s.url === check.url)) fail("LEGACY_EVIDENCE_REQUIRED");
        rows.figure_sources.push({ figure_id: legacy.id, claim_key: field, source_id: ref.sourceId, claim_text: claim.claimText, locator: ref.locator, scope_note: ref.scopeNote, certainty: "verified", uncertainty_note: null });
      }
    }
  }
  for (const source of evidence.sourceRecords) {
    if (rows.sources.some((s) => s.id === source.id || s.url === source.url)) fail("SOURCE_IDENTITY_CONFLICT");
    rows.sources.push(source);
  }
  const mediaAdaptations = [];
  for (const m of rows.media_assets) if (canonicalPeople.some((p) => p.id === m.figure_id) && baseline.figureMedia.some((old) => old.figure_id === m.figure_id && old.is_cover)) {
    m.is_cover = false; mediaAdaptations.push({ mediaId: m.id, reason: "Preserve the existing unique legacy cover; catalog selects the explicitly admitted new image independently." });
  }
  for (const row of [...rows.historical_figures, ...rows.figure_stories]) row.workflow_status = "published";
  for (const list of Object.values(rows)) list.sort((a, b) => {
    const left = JSON.stringify(canonical(a)), right = JSON.stringify(canonical(b));
    return left < right ? -1 : left > right ? 1 : 0;
  });
  const snapshot = { schemaVersion: 1, kind: "local-heroes-authorized-live-release", projectRef: baseline.projectRef, inputSnapshotHash: input.snapshotHash, inputManifestHash: input.inputManifestHash,
    baselineSha256: sha(baselineBytes), legacyEvidenceSha256: sha(fs.readFileSync(path.resolve(root, evidencePath))), people: input.people, representedLocalities: 34,
    canonicalEnrollments: canonicalPeople, baselineCounts: baseline.counts,
    expectedDatabaseCounts: { historical_figures: baseline.figures.length + rows.historical_figures.length - canonicalPeople.length, sources: baseline.counts.sources + rows.sources.length, media_assets: baseline.counts.media + rows.media_assets.length },
    preserved: { figures: baseline.figures, figureMedia: baseline.figureMedia, eventLinks: baseline.eventLinks, fingerprints: baseline.unrelatedFingerprints }, rows, mediaAdaptations,
    boundary: "This artifact requires explicit owner authorization, matching actual target/baseline and successful disposable rehearsal. It preserves legacy columns and links; it never weakens the original draft import guards." };
  snapshot.releaseHash = sha(JSON.stringify(canonical(snapshot))); return snapshot;
}

export function prepareLiveRelease(baselinePath, evidencePath, out) {
  const destination = path.resolve(root, out), allowed = ["supabase/content/local-heroes/", ".task-reports/"].map((p) => path.resolve(root, p) + path.sep);
  if (!allowed.some((p) => destination.startsWith(p))) fail("Local feature output required");
  for (let p = destination; p !== root; p = path.dirname(p)) if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail("Symlink output forbidden");
  const snapshot = createLiveRelease(baselinePath, evidencePath);
  const files = { "snapshot.json": JSON.stringify(snapshot, null, 2) + "\n", "publish.sql": renderLivePublication(snapshot), "rollback-content.sql": renderLiveRollback(snapshot) };
  files["artifact-hashes.json"] = JSON.stringify({ schemaVersion: 1, releaseHash: snapshot.releaseHash, inputSnapshotHash: snapshot.inputSnapshotHash, inputManifestHash: snapshot.inputManifestHash, files: Object.entries(files).map(([name, bytes]) => ({ name, sha256: sha(bytes) })) }, null, 2) + "\n";
  for (const [name, bytes] of Object.entries(files)) { const p = path.join(destination, name); if (fs.existsSync(p) && fs.readFileSync(p, "utf8") !== bytes) fail("Refuse changed artifact overwrite; use a new output directory"); }
  fs.mkdirSync(destination, { recursive: true }); for (const [name, bytes] of Object.entries(files)) fs.writeFileSync(path.join(destination, name), bytes);
  return { releaseHash: snapshot.releaseHash, people: snapshot.people.length, canonicalPreserved: snapshot.canonicalEnrollments.length, localities: snapshot.representedLocalities, output: out };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const opts = {}; for (let i = 2; i < process.argv.length; i += 2) { const k = process.argv[i]; if (!["--baseline", "--evidence", "--out"].includes(k) || !process.argv[i + 1] || opts[k]) fail("Use --baseline <json> --evidence <json> --out <local-directory>"); opts[k] = process.argv[i + 1]; }
    if (!["--baseline", "--evidence", "--out"].every((k) => opts[k])) fail("Use --baseline <json> --evidence <json> --out <local-directory>");
    console.log(JSON.stringify(prepareLiveRelease(opts["--baseline"], opts["--evidence"], opts["--out"])));
  } catch (e) { console.error(e.message); process.exitCode = 1; }
}
