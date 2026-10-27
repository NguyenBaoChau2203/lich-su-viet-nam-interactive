// Offline preparation only. No database/network client and no automatic publication.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadPackage, validatePackage, DEFAULT_PACKAGE } from "./local-heroes-validator.mjs";
import { canonical } from "./local-heroes-schema.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const reviewFile = "docs/audits/sources/2026-10-27-local-heroes-remediation-content-review.json";
export const outputDirectory = "supabase/content/local-heroes/release-phase-07-remediation";
const namespace = "bfcdd5b2-7473-4ea9-9a21-a633400a3ca0";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (value) => JSON.stringify(value, null, 2) + "\n";
const literal = (value) => "'" + value.replaceAll("'", "''") + "'";
const fail = (message) => { throw new Error(message); };

export function packageId(kind, key) {
  const digest = createHash("sha1").update(Buffer.from(namespace.replaceAll("-", ""), "hex")).update(`national-v1/${kind}/${key}`, "utf8").digest();
  digest[6] = (digest[6] & 15) | 80;
  digest[8] = (digest[8] & 63) | 128;
  const h = digest.subarray(0, 16).toString("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function createReleaseSnapshot(reviewPath = reviewFile, packagePath = DEFAULT_PACKAGE) {
  const validation = validatePackage(packagePath);
  if (!validation.valid) fail("Input research package is invalid; no artifact was written.");
  const { documents: d, bytes } = loadPackage(packagePath);
  const reviewBytes = fs.readFileSync(path.resolve(root, reviewPath));
  const review = JSON.parse(reviewBytes);
  const expectedFiles = Object.keys(bytes).map((n) => n + ".json").sort();
  if (review.kind !== "local-heroes-phase-07-acceptance" || review.inputManifestHash !== d.manifest.manifestHash
    || !Array.isArray(review.inputFiles) || review.inputFiles.length !== expectedFiles.length
    || JSON.stringify(review.inputFiles.map((f) => f.name).sort()) !== JSON.stringify(expectedFiles)
    || review.inputFiles.some((f) => !bytes[f.name.replace(/\.json$/u, "")] || hash(bytes[f.name.replace(/\.json$/u, "")]) !== f.sha256))
    fail("Acceptance overlay does not match the input manifest");
  const selected = d.roster.records.filter((r) => r.decision === "accepted");
  const decisions = new Map(review.people.map((p) => [p.personKey, p]));
  if (decisions.size !== d.roster.records.length || d.roster.records.some((r) => decisions.get(r.personKey)?.rosterDecision !== r.decision))
    fail("Acceptance overlay cannot remove or downgrade a selected identity.");
  const complete = new Set(review.people.filter((p) => p.acceptance === "complete_for_local_rehearsal").map((p) => p.personKey));
  const admittedClaims = new Set(review.admittedClaimIds);
  const by = (kind, id) => d[kind].records.find((r) => r.id === id);
  const ids = (kind, r) => kind === "person" ? r.existingFigureId ?? packageId(kind, r.personKey)
    : kind === "source" ? r.existingSourceId ?? packageId(kind, r.id)
      : kind === "media" ? r.existingMediaId ?? packageId(kind, r.id) : packageId(kind, r.id);
  const people = selected.map((r) => {
    const p = d.people.records.find((p) => p.personKey === r.personKey);
    if (complete.has(p.personKey)) {
      const story = by("stories", p.mainStoryId), media = by("media", p.representativeMediaId);
      const storyCheck = review.storyChecks.find((s) => s.id === story?.id), imageCheck = review.imageChecks.find((m) => m.id === media?.id);
      const claims = d.claims.records.filter((c) => c.decision === "accepted" && (
        c.subjectKind === "person" && c.subjectKey === p.personKey
        || c.subjectKind === "relation" && d.relations.records.some((r) => r.id === c.subjectKey && r.personKey === p.personKey && r.decision === "accepted")
        || c.subjectKind === "story" && c.subjectKey === story?.id || c.subjectKind === "media" && c.subjectKey === media?.id));
      if (r.readiness !== "complete" || story?.decision !== "accepted" || media?.decision !== "accepted"
        || storyCheck?.decision !== "accepted" || imageCheck?.decision !== "accepted" || !imageCheck.visualInspected
        || !imageCheck.linkedFromOriginalPage || imageCheck.sha256 !== media.sha256 || claims.some((c) => !admittedClaims.has(c.id)))
        fail("Graph is not admitted by the source/story/media acceptance decisions");
    }
    return { personKey: p.personKey, id: ids("person", p), slug: p.slug, name: p.name,
      mode: complete.has(p.personKey) ? "reviewed_graph" : "identity_shell_only", blockers: decisions.get(p.personKey).blockers };
  });
  if ([...complete].some((key) => !people.some((p) => p.personKey === key))) fail("A held identity cannot enter the import.");
  const rows = { sources: [], historical_figures: [], figure_sources: [], figure_stories: [], figure_story_sources: [], figure_localities: [], media_assets: [], figure_media_evidence: [] };
  const usedSources = new Set();
  function citations(claim, owner, table) {
    if (!admittedClaims.has(claim.id)) fail("An unchecked claim cannot enter a reviewed graph.");
    for (const ref of claim.sourceRefs) {
      const source = by("sources", ref.sourceId);
      const check = review.sourceChecks.find((s) => s.id === source?.id);
      if (source?.decision !== "accepted" || !["scoped_for_admitted_sample", "scoped_for_admitted_graph"].includes(check?.scopeDecision) || check.httpStatus !== 200 || !check.sha256)
        fail("A source lacks direct scoped acceptance.");
      usedSources.add(source.id);
      rows[table].push({ ...owner, claim_key: claim.key, source_id: ids("source", source), claim_text: claim.text,
        locator: ref.locator, scope_note: ref.scopeNote, certainty: claim.certainty, uncertainty_note: claim.uncertaintyNote });
    }
  }
  for (const person of people) {
    const p = d.people.records.find((p) => p.personKey === person.personKey), full = complete.has(p.personKey);
    rows.historical_figures.push({ id: person.id, name: p.name, slug: p.slug, other_names: full && p.aliases.length ? p.aliases.join(", ") : null,
      birth_year: full ? p.birthYear : null, death_year: full ? p.deathYear : null, biography: full ? p.biography : null,
      portrait_url: null, workflow_status: "draft", review_note: null, is_local_hero: true,
      contribution_summary: full ? p.contributionSummary : null, contribution_start_year: full ? p.contributionStartYear : null,
      contribution_end_year: full ? p.contributionEndYear : null, catalog_aliases: full ? p.aliases : [] });
    if (!full) continue;
    for (const cid of p.claimIds) citations(by("claims", cid), { figure_id: person.id }, "figure_sources");
    for (const r of d.relations.records.filter((r) => r.personKey === p.personKey && r.decision === "accepted")) {
      const c = by("claims", r.claimId);
      // A relation claim can be in person.claimIds; emit a single row per composite key.
      if (!p.claimIds.includes(c.id)) citations(c, { figure_id: person.id }, "figure_sources");
      rows.figure_localities.push({ id: ids("relation", r), figure_id: person.id, locality_code: r.localityCode, relationship_kind: r.kind,
        historical_place_label: r.historicalPlaceLabel, explanation: r.explanation, claim_key: c.key,
        primary_source_id: ids("source", by("sources", [...c.sourceRefs].sort((a, b) => a.sourceId < b.sourceId ? -1 : 1)[0].sourceId)),
        certainty: r.certainty, uncertainty_note: r.uncertaintyNote });
    }
    const s = by("stories", p.mainStoryId);
    rows.figure_stories.push({ id: ids("story", s), figure_id: person.id, slug: s.slug, title: s.title, summary: s.summary,
      body: s.body, sort_order: s.sortOrder, is_primary: true, workflow_status: "draft", review_note: null });
    for (const cid of s.claimIds) citations(by("claims", cid), { story_id: ids("story", s) }, "figure_story_sources");
    const m = by("media", p.representativeMediaId), identity = by("claims", m.identityClaimId), ref = identity.sourceRefs[0];
    usedSources.add(ref.sourceId);
    const source = by("sources", ref.sourceId);
    rows.media_assets.push({ id: ids("media", m), figure_id: person.id, event_id: null, location_id: null, file_url: m.fileUrl,
      media_type: "image", caption: m.caption, alt_text: m.altText, source_id: ids("source", source), sort_order: 0, era: m.era,
      year_taken: m.yearTaken, is_reenactment: m.isReenactment, is_colorized: m.isColorized, is_cover: true,
      photographer: [m.creator, m.institution, !m.creator ? "không rõ tác giả" : null].filter(Boolean).join(" · "),
      license: m.license, license_url: m.licenseUrl, source_page_url: m.sourcePageUrl, width: m.width, height: m.height, focal_point: null });
    rows.figure_media_evidence.push({ media_id: ids("media", m), figure_id: person.id, depiction_kind: m.depictionKind, decision: "accepted",
      identity_source_id: ids("source", source), identity_locator: ref.locator, identity_certainty: identity.certainty,
      usage_basis: m.usageBasis, usage_source_id: null, usage_locator: null,
      usage_note: `${m.usageNote} LH-1.0.0-draft.1; ${m.sourcePageUrl}`, checked_at: m.checkedAt });
  }
  const sourceRecords = d.sources.records.filter((s) => usedSources.has(s.id));
  for (const s of sourceRecords) rows.sources.push({ id: ids("source", s), title: s.title, author_org: s.authorOrg, publisher: s.publisher,
    published_year: s.publishedYear, url: s.url, source_type: s.sourceType, citation: [s.citation, s.documentRef].filter(Boolean).join(" · "), accessed_at: s.accessedAt });
  for (const records of Object.values(rows)) records.sort((a, b) => JSON.stringify(canonical(a)) < JSON.stringify(canonical(b)) ? -1 : 1);
  const snapshot = { schemaVersion: 1, kind: "local-heroes-draft-rehearsal", contractId: d.manifest.contractId, inputManifestHash: d.manifest.manifestHash,
    inputManifestVersion: d.manifest.version, acceptanceSha256: hash(reviewBytes), inputFiles: review.inputFiles,
    idNamespace: namespace, idNamePattern: "national-v1/<person|source|story|media|relation>/<package-key>",
    nationalReleaseReady: false, mandatoryPeople: selected.length, mandatoryLocalities: 34, reviewCompletePeople: complete.size,
    representedLocalities: new Set(d.relations.records.filter((r) => complete.has(r.personKey) && r.decision === "accepted" && r.certainty === "verified" && r.kind !== "commemoration").map((r) => r.localityCode)).size,
    warning: `Local rehearsal only: ${selected.length - complete.size} identity shells are incomplete and cannot be promoted. No national publication is ready or authorized.`,
    people, rows, sourceRecords, sourceFingerprints: sourceRecords.map((s) => ({ id: s.id, databaseId: ids("source", s), recordSha256: hash(JSON.stringify(canonical(s))),
      originalPageSha256: review.sourceChecks.find((r) => r.id === s.id).sha256 })),
    mediaFingerprints: d.media.records.filter((m) => complete.has(m.personKey) && m.decision === "accepted").map((m) => ({ id: m.id, databaseId: ids("media", m), sha256: m.sha256 })) };
  snapshot.snapshotHash = hash(JSON.stringify(canonical(snapshot)));
  return snapshot;
}

const keys = { sources: ["id"], historical_figures: ["id"], figure_sources: ["figure_id", "claim_key", "source_id"], figure_stories: ["id"],
  figure_story_sources: ["story_id", "claim_key", "source_id"], figure_localities: ["id"], media_assets: ["id"], figure_media_evidence: ["media_id"] };

export function renderImportSetup(snapshot) {
  const values = Object.entries(snapshot.rows).flatMap(([table, records]) => records.map((r) => `(${literal(table)},${literal(JSON.stringify(r))}::jsonb)`));
  const check = (table, records, required) => {
    const cols = Object.keys(records[0]), key = keys[table].map((k) => `actual.${k}=expected.${k}`).join(" AND ");
    const compare = cols.map((k) => `actual.${k}`).join(","), expected = cols.map((k) => `expected.${k}`).join(",");
    return `IF EXISTS(SELECT 1 FROM lh_expected e CROSS JOIN LATERAL jsonb_populate_record(NULL::public.${table},e.row_data) expected ${required ? "LEFT" : "INNER"} JOIN public.${table} actual ON ${key} WHERE e.table_name=${literal(table)} AND (${required ? `actual.${keys[table][0]} IS NULL OR ` : ""}ROW(${compare}) IS DISTINCT FROM ROW(${expected}))) THEN RAISE EXCEPTION USING ERRCODE='23505',MESSAGE='IDENTITY_OR_CONTENT_CONFLICT:${table}'; END IF;`;
  };
  const preflight = [], inserts = [], final = [];
  for (const [table, records] of Object.entries(snapshot.rows)) {
    if (!records.length) continue;
    preflight.push(check(table, records, false));
    const cols = Object.keys(records[0]);
    inserts.push(`INSERT INTO public.${table}(${cols.join(",")}) SELECT ${cols.map((c) => "expected." + c).join(",")} FROM lh_expected e CROSS JOIN LATERAL jsonb_populate_record(NULL::public.${table},e.row_data) expected WHERE e.table_name=${literal(table)} ON CONFLICT DO NOTHING;`);
    final.push(check(table, records, true));
    if (!["sources", "historical_figures"].includes(table)) {
      const owner = table === "figure_story_sources" ? "actual.story_id IN (SELECT (row_data->>'id')::uuid FROM lh_expected WHERE table_name='figure_stories')"
        : "actual.figure_id IN (SELECT (row_data->>'id')::uuid FROM lh_expected WHERE table_name='historical_figures')";
      const key = keys[table].map((k) => `to_jsonb(actual)->${literal(k)}=e.row_data->${literal(k)}`).join(" AND ");
      final.push(`IF EXISTS(SELECT 1 FROM public.${table} actual WHERE ${owner} AND NOT EXISTS(SELECT 1 FROM lh_expected e WHERE e.table_name=${literal(table)} AND ${key})) THEN RAISE EXCEPTION USING ERRCODE='23505',MESSAGE='UNEXPECTED_GRAPH_LINK:${table}'; END IF;`);
    }
  }
  return `SET standard_conforming_strings=on;
CREATE TEMP TABLE lh_expected(table_name text NOT NULL,row_data jsonb NOT NULL) ON COMMIT DROP;
INSERT INTO lh_expected VALUES\n${values.join(",\n")};
CREATE FUNCTION pg_temp.lh_import_drafts() RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER AS $lh_import$
BEGIN
  IF current_setting('app.local_heroes_disposable',true) IS DISTINCT FROM 'local-heroes-phase02-disposable' OR current_database()<>'postgres' THEN RAISE EXCEPTION 'DISPOSABLE_TARGET_REQUIRED'; END IF;
  PERFORM pg_advisory_xact_lock(18012,3401);
  IF (SELECT count(*) FROM public.history_localities)<>34 THEN RAISE EXCEPTION 'REGISTRY_MISMATCH'; END IF;
  IF EXISTS(SELECT 1 FROM public.historical_figures actual JOIN lh_expected e ON e.table_name='historical_figures' AND (public.local_hero_fold(actual.name)=public.local_hero_fold(e.row_data->>'name') OR actual.slug=e.row_data->>'slug') WHERE actual.id<>(e.row_data->>'id')::uuid)
    OR EXISTS(SELECT 1 FROM public.event_figures actual JOIN lh_expected e ON e.table_name='historical_figures' AND actual.figure_id=(e.row_data->>'id')::uuid) THEN RAISE EXCEPTION USING ERRCODE='23505',MESSAGE='LEGACY_IDENTITY_CONFLICT'; END IF;
  ${preflight.join("\n  ")}
  ${inserts.join("\n  ")}
  ${final.join("\n  ")}
  SET CONSTRAINTS ALL IMMEDIATE;
  SET CONSTRAINTS ALL DEFERRED;
  RETURN jsonb_build_object('snapshotHash',${literal(snapshot.snapshotHash)},'draftPeople',${snapshot.people.length},'reviewedGraphs',${snapshot.reviewCompletePeople},'nationalReleaseReady',false);
END $lh_import$;
`;
}

export function renderLocalPromotion(snapshot) {
  const selected = snapshot.people.filter((p) => p.mode === "reviewed_graph");
  const commands = selected.map((p) => {
    const story = snapshot.rows.figure_stories.find((s) => s.figure_id === p.id);
    return `PERFORM set_config('request.jwt.claim.sub','a7070000-0000-4000-8000-000000000001',true);
    outcome:=public.local_hero_submit_graph(jsonb_build_object('figureId',${literal(p.id)},'expectedRevision',(SELECT local_hero_revision::text FROM public.historical_figures WHERE id=${literal(p.id)}::uuid),'storyIds',jsonb_build_array(${literal(story.id)})));
    IF outcome->>'ok'<>'true' THEN RAISE EXCEPTION 'LOCAL_SUBMIT_FAILED: %',outcome->'error'->>'code'; END IF;
    PERFORM set_config('request.jwt.claim.sub','a7070000-0000-4000-8000-000000000002',true);
    outcome:=public.local_hero_review_graph(jsonb_build_object('figureId',${literal(p.id)},'expectedRevision',(SELECT local_hero_revision::text FROM public.historical_figures WHERE id=${literal(p.id)}::uuid),'action','publish'));
    IF outcome->>'ok'<>'true' THEN RAISE EXCEPTION 'LOCAL_PROMOTION_FAILED: %',outcome->'error'->>'code'; END IF;`;
  });
  return `-- Explicitly disposable, uncommitted promotion; never a national release.
INSERT INTO auth.users(id,email) VALUES ('a7070000-0000-4000-8000-000000000001','lh-phase07-editor@example.invalid'),('a7070000-0000-4000-8000-000000000002','lh-phase07-reviewer@example.invalid');
INSERT INTO public.staff_profiles(id,role,account_status) VALUES ('a7070000-0000-4000-8000-000000000001','editor','active'),('a7070000-0000-4000-8000-000000000002','reviewer','active');
SET LOCAL ROLE authenticated;
DO $lh_promote$ DECLARE outcome jsonb; BEGIN
  ${commands.join("\n  ")}
END $lh_promote$;
RESET ROLE;
SELECT set_config('request.jwt.claim.sub','',true);
SET LOCAL ROLE anon;
DO $lh_public$ DECLARE page jsonb; BEGIN
  page:=public.local_hero_page(NULL,'',1);
  IF (page->>'totalPeople')::integer<>${selected.length} OR (page->'coverage'->>'representedLocalities')::integer<>${snapshot.representedLocalities} THEN RAISE EXCEPTION 'LOCAL_PUBLIC_GRAPH_MISMATCH'; END IF;
  IF page::text LIKE '%PRIVATE_%' THEN RAISE EXCEPTION 'PRIVATE_DATA_EXPOSED'; END IF;
END $lh_public$;
SELECT jsonb_build_object('localPublicPeople',public.local_hero_page(NULL,'',1)->'totalPeople','localCoverage',public.local_hero_page(NULL,'',1)->'coverage','nationalReleaseReady',false);
RESET ROLE;
`;
}

export function prepareRelease(out = outputDirectory, reviewPath = reviewFile, packagePath = DEFAULT_PACKAGE) {
  const destination = path.resolve(root, out);
  const allowed = ["supabase/content/local-heroes/", ".task-reports/"].map((p) => path.resolve(root, p) + path.sep);
  if (!allowed.some((p) => destination.startsWith(p))) fail("Artifact output must remain in the local feature or ignored task-report directory.");
  for (let parent = destination; parent !== root; parent = path.dirname(parent)) if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) fail("Symlink output is forbidden.");
  const snapshot = createReleaseSnapshot(reviewPath, packagePath), setup = renderImportSetup(snapshot);
  const begin = "BEGIN;\nSET LOCAL app.local_heroes_disposable='local-heroes-phase02-disposable';\n";
  const files = {
    "snapshot.json": json(snapshot),
    "draft-import.sql": `-- Deterministic draft-only local rehearsal. Always rolls back; no COMMIT or remote target.\n${begin}${setup}SELECT pg_temp.lh_import_drafts();\nSELECT pg_temp.lh_import_drafts(); -- exact rerun\nROLLBACK;\n`,
    "local-promotion-rehearsal.sql": `${begin}${setup}SELECT pg_temp.lh_import_drafts();\n${renderLocalPromotion(snapshot)}ROLLBACK;\n`,
    "rollback.sql": "-- Abort the entire open rehearsal transaction, including Auth/roles and imported drafts.\nROLLBACK;\n",
  };
  files["artifact-hashes.json"] = json({ schemaVersion: 1, snapshotHash: snapshot.snapshotHash, inputManifestHash: snapshot.inputManifestHash,
    acceptanceSha256: snapshot.acceptanceSha256, files: Object.entries(files).map(([name, bytes]) => ({ name, sha256: hash(bytes) })).sort((a, b) => a.name < b.name ? -1 : 1) });
  for (const [name, bytes] of Object.entries(files)) {
    const target = path.join(destination, name);
    if (fs.existsSync(target) && (fs.lstatSync(target).isSymbolicLink() || fs.readFileSync(target, "utf8") !== bytes)) fail("Refusing to overwrite a different artifact; use a new reviewed output directory.");
  }
  fs.mkdirSync(destination, { recursive: true });
  for (const [name, bytes] of Object.entries(files)) if (!fs.existsSync(path.join(destination, name))) fs.writeFileSync(path.join(destination, name), bytes);
  return { snapshotHash: snapshot.snapshotHash, people: snapshot.people.length, reviewedGraphs: snapshot.reviewCompletePeople, nationalReleaseReady: false };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i += 2) {
      if (!["--out", "--review", "--package"].includes(args[i]) || !args[i + 1] || options[args[i]]) fail("Use --out <local-directory>, --review <acceptance-json> and/or --package <input-directory>.");
      options[args[i]] = args[i + 1];
    }
    console.log(JSON.stringify(prepareRelease(options["--out"], options["--review"], options["--package"])));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
