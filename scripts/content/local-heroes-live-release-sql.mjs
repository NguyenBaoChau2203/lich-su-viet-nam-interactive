import { canonical } from "./local-heroes-schema.mjs";
export const literal = (s) => "'" + String(s).replaceAll("'", "''") + "'";
const keys = { sources: ["id"], historical_figures: ["id"], figure_sources: ["figure_id", "claim_key", "source_id"], figure_stories: ["id"], figure_story_sources: ["story_id", "claim_key", "source_id"], figure_localities: ["id"], media_assets: ["id"], figure_media_evidence: ["media_id"] };
const catalogFields = ["is_local_hero", "contribution_summary", "contribution_start_year", "contribution_end_year", "catalog_aliases", "local_hero_revision", "local_hero_search_text"];
const encode = (v) => literal(JSON.stringify(canonical(v))) + "::jsonb";
const idList = (rows) => rows.map((r) => literal(r.id) + "::uuid").join(",");
const pick = (row, expected) => `(SELECT jsonb_object_agg(k, to_jsonb(${row})->k) FROM jsonb_object_keys(${expected}) k)`;
const keyJoin = (table, actual, expected) => keys[table].map((k) => `to_jsonb(${actual})->${literal(k)}=${expected}->${literal(k)}`).join(" AND ");
const header = `BEGIN;\nSET LOCAL lock_timeout='5s';\nSET LOCAL statement_timeout='120s';\nSET LOCAL TIME ZONE 'UTC';\nSET standard_conforming_strings=on;\nSELECT pg_advisory_xact_lock(18012,3401);\nSET CONSTRAINTS ALL DEFERRED;\n`;

function setup(snapshot) {
  const values = Object.entries(snapshot.rows).flatMap(([table, rows]) => rows.map((r) => `(${literal(table)},${encode(r)})`));
  const before = snapshot.preserved.figures.map((r) => `(${encode(r)})`).join(",\n");
  return `CREATE TEMP TABLE lh_release_expected(table_name text NOT NULL,row_data jsonb NOT NULL) ON COMMIT DROP;
INSERT INTO lh_release_expected VALUES\n${values.join(",\n")};
CREATE TEMP TABLE lh_release_before(row_data jsonb NOT NULL) ON COMMIT DROP;
INSERT INTO lh_release_before VALUES\n${before};
DO $owner$ BEGIN IF session_user NOT IN ('postgres','supabase_admin') OR current_setting('role') NOT IN ('none','postgres') OR auth.uid() IS NOT NULL THEN RAISE EXCEPTION 'DATABASE_OWNER_RELEASE_REQUIRED'; END IF; END $owner$;
LOCK TABLE public.historical_figures,public.sources,public.media_assets,public.event_figures,public.historical_events IN SHARE ROW EXCLUSIVE MODE;
`;
}

function preserved(snapshot, error = "BEFORE_IMAGE_CONFLICT") {
  const oldIds = idList(snapshot.preserved.figures), canonicalIds = idList(snapshot.canonicalEnrollments);
  const existingMedia = snapshot.preserved.figureMedia.map((r) => `(${encode(r)})`).join(",\n");
  return `IF EXISTS(SELECT 1 FROM lh_release_before b LEFT JOIN public.historical_figures f ON f.id=(b.row_data->>'id')::uuid WHERE f.id IS NULL OR ${pick("f", "b.row_data")} IS DISTINCT FROM b.row_data) THEN RAISE EXCEPTION '${error}:CANONICAL_BASE_PRESERVED'; END IF;
  IF (SELECT count(*) FROM public.historical_figures WHERE id IN (${oldIds}))<>${snapshot.preserved.figures.length} THEN RAISE EXCEPTION '${error}:LEGACY_IDENTITIES'; END IF;
  IF EXISTS(SELECT 1 FROM public.historical_figures WHERE id IN (${oldIds}) AND id NOT IN (${canonicalIds}) AND is_local_hero) THEN RAISE EXCEPTION '${error}:UNSELECTED_LEGACY_ENROLLMENT'; END IF;
  IF EXISTS(SELECT 1 FROM (VALUES ${existingMedia}) b(row_data) LEFT JOIN public.media_assets m ON m.id=(b.row_data->>'id')::uuid WHERE m.id IS NULL OR ${pick("m", "b.row_data")} IS DISTINCT FROM b.row_data) THEN RAISE EXCEPTION '${error}:LEGACY_MEDIA'; END IF;
  IF (SELECT md5(string_agg(to_jsonb(e)::text,',' ORDER BY e.id)) FROM public.historical_events e) IS DISTINCT FROM ${literal(snapshot.preserved.fingerprints.events)}
    OR (SELECT md5(string_agg(to_jsonb(e)::text,',' ORDER BY e.event_id,e.figure_id)) FROM public.event_figures e) IS DISTINCT FROM ${literal(snapshot.preserved.fingerprints.event_figures)} THEN RAISE EXCEPTION '${error}:EXISTING_EVENT_LINKS'; END IF;
  IF (SELECT md5(string_agg(to_jsonb(m)::text,',' ORDER BY m.id)) FROM public.media_assets m WHERE m.id NOT IN (${idList(snapshot.rows.media_assets)})) IS DISTINCT FROM ${literal(snapshot.preserved.fingerprints.media)} THEN RAISE EXCEPTION '${error}:UNRELATED_MEDIA'; END IF;
`;
}

function compareRows(snapshot, required, rollback = false) {
  return Object.entries(snapshot.rows).map(([table, rows]) => {
    const exception = rollback ? "ROLLBACK_CONFLICT" : "IDENTITY_OR_CONTENT_CONFLICT";
    let where = `e.table_name=${literal(table)}`;
    if (!required && table === "historical_figures") where += ` AND a.id NOT IN (${idList(snapshot.canonicalEnrollments)})`;
    const columns = Object.keys(rows[0]);
    const actual = columns.map((k) => `a.${k}`).join(","), expected = columns.map((k) => `x.${k}`).join(",");
    return `IF EXISTS(SELECT 1 FROM lh_release_expected e CROSS JOIN LATERAL jsonb_populate_record(NULL::public.${table},e.row_data) x ${required ? "LEFT" : "INNER"} JOIN public.${table} a ON ${keys[table].map((k) => `a.${k}=x.${k}`).join(" AND ")} WHERE ${where} AND (${required ? `a.${keys[table][0]} IS NULL OR ` : ""}ROW(${actual}) IS DISTINCT FROM ROW(${expected}))) THEN RAISE EXCEPTION '${exception}:${table}'; END IF;`;
  }).join("\n");
}

function unknownLinks(snapshot, rollback = false) {
  const people = idList(snapshot.rows.historical_figures), stories = idList(snapshot.rows.figure_stories), media = idList(snapshot.preserved.figureMedia);
  return Object.keys(snapshot.rows).filter((t) => !["historical_figures", "sources"].includes(t)).map((table) => {
    const owner = table === "figure_story_sources" ? `a.story_id IN (${stories})` : `a.figure_id IN (${people})`;
    const known = table === "media_assets" ? ` AND a.id NOT IN (${media})` : "";
    return `IF EXISTS(SELECT 1 FROM public.${table} a WHERE ${owner}${known} AND NOT EXISTS(SELECT 1 FROM lh_release_expected e WHERE e.table_name=${literal(table)} AND ${keyJoin(table, "a", "e.row_data")})) THEN RAISE EXCEPTION '${rollback ? "ROLLBACK_CONFLICT" : "UNEXPECTED_GRAPH_LINK"}:${table}'; END IF;`;
  }).join("\n");
}

export function renderLivePublication(snapshot) {
  const legacy = idList(snapshot.canonicalEnrollments);
  const catalog = catalogFields.filter((k) => !["local_hero_revision", "local_hero_search_text"].includes(k));
  const inserts = Object.entries(snapshot.rows).map(([table, rows]) => {
    const columns = Object.keys(rows[0]);
    return `INSERT INTO public.${table}(${columns.join(",")}) SELECT ${columns.map((c) => "x." + c).join(",")} FROM lh_release_expected e CROSS JOIN LATERAL jsonb_populate_record(NULL::public.${table},e.row_data) x WHERE e.table_name=${literal(table)} ON CONFLICT DO NOTHING;`;
  });
  return `-- Authorized target-specific release. Requires reviewed artifact, actual baseline and database-owner session.\n${header}${setup(snapshot)}
DO $preflight$ BEGIN
  ${preserved(snapshot)}
  IF EXISTS(SELECT 1 FROM public.historical_figures f JOIN lh_release_expected e ON e.table_name='historical_figures' AND (f.slug=e.row_data->>'slug' OR public.local_hero_fold(f.name)=public.local_hero_fold(e.row_data->>'name')) WHERE f.id<>(e.row_data->>'id')::uuid) THEN RAISE EXCEPTION 'CANONICAL_IDENTITY_CONFLICT'; END IF;
  ${compareRows(snapshot, false)}
  IF EXISTS(SELECT 1 FROM public.historical_figures a WHERE a.id IN (${legacy}) AND NOT a.is_local_hero AND (a.contribution_summary IS NOT NULL OR a.contribution_start_year IS NOT NULL OR a.contribution_end_year IS NOT NULL OR cardinality(a.catalog_aliases)>0)) THEN RAISE EXCEPTION 'BEFORE_IMAGE_CONFLICT:CATALOG_DRAFT'; END IF;
  IF EXISTS(SELECT 1 FROM public.historical_figures a JOIN lh_release_expected e ON e.table_name='historical_figures' AND a.id=(e.row_data->>'id')::uuid WHERE a.id IN (${legacy}) AND a.is_local_hero AND ${pick("a", "e.row_data")} IS DISTINCT FROM e.row_data) THEN RAISE EXCEPTION 'IDENTITY_OR_CONTENT_CONFLICT:ENROLLED_CANONICAL'; END IF;
END $preflight$;
UPDATE public.historical_figures a SET ${catalog.map((k) => `${k}=x.${k}`).join(",")} FROM lh_release_expected e CROSS JOIN LATERAL jsonb_populate_record(NULL::public.historical_figures,e.row_data) x WHERE e.table_name='historical_figures' AND a.id=x.id AND a.id IN (${legacy}) AND NOT a.is_local_hero;
${inserts.join("\n")}
DO $verify$ DECLARE p record; BEGIN
  ${compareRows(snapshot, true)}
  ${unknownLinks(snapshot)}
  ${preserved(snapshot)}
  FOR p IN SELECT id FROM public.historical_figures WHERE id IN (${idList(snapshot.rows.historical_figures)}) LOOP PERFORM private.local_hero_assert_graph(p.id); END LOOP;
END $verify$;
SET CONSTRAINTS ALL IMMEDIATE;
SET LOCAL ROLE anon;
DO $public_check$ DECLARE result jsonb; BEGIN
  result:=public.local_hero_page(NULL,'',1);
  IF (result->>'totalPeople')::integer<>35 OR (result->'coverage'->>'representedLocalities')::integer<>34 OR jsonb_array_length(result->'items')<>12 THEN RAISE EXCEPTION 'PUBLIC_NATIONAL_GRAPH_MISMATCH'; END IF;
  IF (SELECT count(*) FROM public.sources WHERE id IN (${idList(snapshot.rows.sources)}))<>${snapshot.rows.sources.length} THEN RAISE EXCEPTION 'PUBLIC_SOURCE_VISIBILITY_MISMATCH'; END IF;
END $public_check$;
SELECT jsonb_build_object('releaseHash',${literal(snapshot.releaseHash)},'publicPeople',public.local_hero_page(NULL,'',1)->'totalPeople','coverage',public.local_hero_page(NULL,'',1)->'coverage','targetRef',${literal(snapshot.projectRef)});
RESET ROLE;
COMMIT;
`;
}

export function renderLiveRollback(snapshot) {
  const canonicalIds = idList(snapshot.canonicalEnrollments), newIds = snapshot.rows.historical_figures.filter((f) => !snapshot.canonicalEnrollments.some((c) => c.id === f.id));
  const deletes = ["figure_story_sources", "figure_localities", "figure_media_evidence", "figure_sources", "figure_stories", "media_assets"].map((table) =>
    `DELETE FROM public.${table} a USING lh_release_expected e WHERE e.table_name=${literal(table)} AND ${keyJoin(table, "a", "e.row_data")};`);
  return `-- Reviewed rollback of only this release. Refuses later edits, extra children or event links; schema remains adopted.\n${header}${setup(snapshot)}
DO $rollback_guard$ BEGIN
  ${compareRows(snapshot, true, true)}
  ${unknownLinks(snapshot, true)}
  ${preserved(snapshot, "ROLLBACK_CONFLICT")}
  IF EXISTS(SELECT 1 FROM public.event_figures WHERE figure_id IN (${idList(newIds)})) THEN RAISE EXCEPTION 'ROLLBACK_CONFLICT:NEW_EVENT_LINK'; END IF;
  IF EXISTS(SELECT 1 FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace WHERE c.contype='f' AND c.confrelid='public.historical_figures'::regclass AND (n.nspname<>'public' OR t.relname NOT IN ('event_figures','media_assets','figure_sources','figure_localities','figure_stories','figure_media_evidence','figure_story_sources'))) THEN RAISE EXCEPTION 'ROLLBACK_CONFLICT:UNKNOWN_OWNER_REFERENCE'; END IF;
END $rollback_guard$;
UPDATE public.historical_figures SET is_local_hero=false,contribution_summary=NULL,contribution_start_year=NULL,contribution_end_year=NULL,catalog_aliases='{}' WHERE id IN (${canonicalIds});
${deletes.join("\n")}
DELETE FROM public.historical_figures WHERE id IN (${idList(newIds)});
DELETE FROM public.sources a USING lh_release_expected e WHERE e.table_name='sources' AND a.id=(e.row_data->>'id')::uuid;
DO $restored$ BEGIN
  ${preserved(snapshot, "ROLLBACK_CONFLICT")}
  IF (SELECT count(*) FROM public.historical_figures)<>${snapshot.preserved.figures.length} OR (SELECT count(*) FROM public.sources)<>${snapshot.baselineCounts.sources} OR (SELECT count(*) FROM public.media_assets)<>${snapshot.baselineCounts.media} OR EXISTS(SELECT 1 FROM public.historical_figures WHERE is_local_hero) THEN RAISE EXCEPTION 'ROLLBACK_CONFLICT:BASELINE_NOT_RESTORED'; END IF;
END $restored$;
SET CONSTRAINTS ALL IMMEDIATE;
SELECT jsonb_build_object('rolledBackRelease',${literal(snapshot.releaseHash)},'canonicalBasePreserved',true,'remainingFigures',(SELECT count(*) FROM public.historical_figures));
COMMIT;
`;
}
