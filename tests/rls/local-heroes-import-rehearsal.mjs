// Every mutation is enclosed in an explicit ROLLBACK on the descriptor-confirmed disposable DB.
import fs from "node:fs";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { validateTargetDescriptor } from "./local-heroes-concurrency.mjs";
import { localAdminEnvironment } from "../../scripts/agent/local-heroes-admin-e2e.mjs";
import { createReleaseSnapshot, renderImportSetup, renderLocalPromotion } from "../../scripts/content/prepare-local-heroes-release.mjs";

const args = process.argv.slice(2);
if (args.length !== 2 || args[0] !== "--target") throw new Error("Use only --target <disposable-descriptor.json>.");
const target = validateTargetDescriptor(JSON.parse(fs.readFileSync(args[1], "utf8")));
assert.equal(target.container, "supabase_db_local-heroes-phase02-disposable");
localAdminEnvironment(); // Local Docker transport, both labels, CLI project, port and API; never log returned configuration.
const psql = ["exec", "-i", target.container, "psql", "-U", "postgres", "-d", "postgres", "-X", "-tA", "-v", "ON_ERROR_STOP=1"];
const sql = (input) => {
  const r = spawnSync("docker", psql, { input, encoding: "utf8", timeout: 60000, maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  if (r.status !== 0) throw new Error("Disposable rehearsal SQL failed: " + (r.stderr?.match(/ERROR:.*$/mu)?.[0] ?? "local process error"));
  return r.stdout.trim();
};
const counts = () => JSON.parse(sql(`SELECT json_build_object('auth',(SELECT count(*) FROM auth.users),'staff',(SELECT count(*) FROM public.staff_profiles),
  'people',(SELECT count(*) FROM public.historical_figures),'sources',(SELECT count(*) FROM public.sources),'stories',(SELECT count(*) FROM public.figure_stories),
  'claims',(SELECT count(*) FROM public.figure_sources),'storyClaims',(SELECT count(*) FROM public.figure_story_sources),'localities',(SELECT count(*) FROM public.figure_localities),
  'media',(SELECT count(*) FROM public.media_assets),'mediaEvidence',(SELECT count(*) FROM public.figure_media_evidence),'registry',(SELECT count(*) FROM public.history_localities));`));
const before = counts();
assert.deepEqual(before, { auth: 0, staff: 0, people: 0, sources: 0, stories: 0, claims: 0, storyClaims: 0, localities: 0, media: 0, mediaEvidence: 0, registry: 34 }, "Requires a fresh empty dedicated disposable baseline.");
const snapshot = createReleaseSnapshot(), setup = renderImportSetup(snapshot), results = [];
const start = "BEGIN;\nSET LOCAL app.local_heroes_disposable='local-heroes-phase02-disposable';\n";
function run(name, body) {
  const input = start + setup + body + "\nROLLBACK;\n";
  sql(input);
  assert.deepEqual(counts(), before, "ROLLBACK must restore the baseline after " + name);
  results.push({ case: name, passed: true, rollbackRestoredBaseline: true, sqlSha256: createHash("sha256").update(input).digest("hex") });
}

run("import_exact_rerun_unrelated_rows_and_uuid_v5", `
INSERT INTO public.historical_figures(id,name,slug) VALUES ('a7070000-0000-4000-8000-000000000099','Synthetic unrelated person','phase07-unrelated');
INSERT INTO public.sources(id,title,citation,source_type) VALUES ('b7070000-0000-4000-8000-000000000099','Synthetic unrelated source','Synthetic reference','other');
CREATE TEMP TABLE lh_unrelated AS SELECT to_jsonb(f) data FROM public.historical_figures f WHERE id='a7070000-0000-4000-8000-000000000099';
SELECT pg_temp.lh_import_drafts();
CREATE TEMP TABLE lh_revisions AS SELECT id,local_hero_revision FROM public.historical_figures;
SELECT pg_temp.lh_import_drafts();
DO $check$ BEGIN
  IF (SELECT count(*) FROM public.historical_figures)<>36 OR EXISTS(SELECT 1 FROM public.historical_figures WHERE workflow_status<>'draft') THEN RAISE EXCEPTION 'DRAFT_IMPORT_COUNT'; END IF;
  IF (SELECT to_jsonb(f) FROM public.historical_figures f WHERE id='a7070000-0000-4000-8000-000000000099') IS DISTINCT FROM (SELECT data FROM lh_unrelated) THEN RAISE EXCEPTION 'UNRELATED_ROW_CHANGED'; END IF;
  IF (SELECT title FROM public.sources WHERE id='b7070000-0000-4000-8000-000000000099')<>'Synthetic unrelated source' THEN RAISE EXCEPTION 'UNRELATED_SOURCE_CHANGED'; END IF;
  IF EXISTS(SELECT 1 FROM lh_revisions r JOIN public.historical_figures f USING(id) WHERE f.local_hero_revision<>r.local_hero_revision) THEN RAISE EXCEPTION 'RERUN_NOT_IDEMPOTENT'; END IF;
  ${snapshot.people.filter((p) => p.personKey.startsWith("new:")).map((p) => `IF extensions.uuid_generate_v5('${snapshot.idNamespace}'::uuid,'national-v1/person/${p.personKey}')<>'${p.id}'::uuid THEN RAISE EXCEPTION 'UUID_V5_MISMATCH'; END IF;`).join("\n  ")}
END $check$;
SET LOCAL ROLE anon;
DO $public$ BEGIN IF (public.local_hero_page(NULL,'',1)->>'totalPeople')::integer<>0 THEN RAISE EXCEPTION 'DRAFT_LEAK'; END IF; END $public$;
RESET ROLE;
`);

const canonical = snapshot.people.find((p) => p.slug === "van-tien-dung");
run("protected_canonical_identity_conflict_rolls_back", `
INSERT INTO public.historical_figures(id,name,slug,workflow_status) VALUES ('${canonical.id}','${canonical.name}','${canonical.slug}','published');
DO $check$ BEGIN
  BEGIN PERFORM pg_temp.lh_import_drafts(); RAISE EXCEPTION 'MISSING_CONFLICT_REJECTION'; EXCEPTION WHEN unique_violation THEN NULL; END;
  IF (SELECT is_local_hero OR workflow_status<>'published' FROM public.historical_figures WHERE id='${canonical.id}') OR (SELECT count(*) FROM public.sources)<>0 OR (SELECT count(*) FROM public.historical_figures)<>1 THEN RAISE EXCEPTION 'CONFLICT_OVERWROTE_LEGACY'; END IF;
END $check$;
`);

run("slug_conflict_is_atomic", `
INSERT INTO public.historical_figures(id,name,slug) VALUES ('a7070000-0000-4000-8000-000000000098','Synthetic conflicting slug owner','kim-dong');
DO $check$ BEGIN
  BEGIN PERFORM pg_temp.lh_import_drafts(); RAISE EXCEPTION 'MISSING_CONFLICT_REJECTION'; EXCEPTION WHEN unique_violation THEN NULL; END;
  IF (SELECT count(*) FROM public.historical_figures)<>1 OR (SELECT count(*) FROM public.sources)<>0 OR EXISTS(SELECT 1 FROM public.historical_figures WHERE is_local_hero) THEN RAISE EXCEPTION 'PARTIAL_IMPORT_LEAK'; END IF;
END $check$;
`);

const sourceId = snapshot.rows.sources[0].id;
run("source_fingerprint_conflict_rolls_back", `
INSERT INTO public.sources(id,title,citation,source_type) VALUES ('${sourceId}','Synthetic conflicting source','Synthetic reference','other');
DO $check$ BEGIN
  BEGIN PERFORM pg_temp.lh_import_drafts(); RAISE EXCEPTION 'MISSING_CONFLICT_REJECTION'; EXCEPTION WHEN unique_violation THEN NULL; END;
  IF (SELECT title FROM public.sources WHERE id='${sourceId}')<>'Synthetic conflicting source' OR (SELECT count(*) FROM public.historical_figures)<>0 THEN RAISE EXCEPTION 'SOURCE_OVERWRITTEN'; END IF;
END $check$;
`);

const storyId = snapshot.rows.figure_stories[0].id;
run("edited_child_prevents_rerun_overwrite", `
SELECT pg_temp.lh_import_drafts();
UPDATE public.figure_stories SET title='Synthetic later editorial change' WHERE id='${storyId}';
DO $check$ BEGIN
  BEGIN PERFORM pg_temp.lh_import_drafts(); RAISE EXCEPTION 'MISSING_CONFLICT_REJECTION'; EXCEPTION WHEN unique_violation THEN NULL; END;
  IF (SELECT title FROM public.figure_stories WHERE id='${storyId}')<>'Synthetic later editorial change' THEN RAISE EXCEPTION 'CHILD_OVERWRITTEN'; END IF;
END $check$;
`);

run("local_editor_submit_reviewer_promotion_anon_read_and_rollback", "SELECT pg_temp.lh_import_drafts();\n" + renderLocalPromotion(snapshot));
assert.deepEqual(counts(), before);
console.log(JSON.stringify({ target: { project: "local-heroes-phase02-disposable", host: "127.0.0.1", database: "postgres" }, snapshotHash: snapshot.snapshotHash,
  importedDraftPeople: snapshot.people.length, localPromotedPeople: snapshot.reviewCompletePeople, nationalReleaseReady: false, before, after: counts(), results }, null, 2));
