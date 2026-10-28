#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

function parseArgs() {
  const args = process.argv.slice(2);
  let pkgDir = "supabase/content/heritage-sites/v1";
  let outDir = "supabase/content/heritage-sites/release-v1";
  let mode = "publish";
  let doCommit = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--package" && args[i + 1]) {
      pkgDir = args[++i];
    } else if (args[i] === "--out" && args[i + 1]) {
      outDir = args[++i];
    } else if (args[i] === "--mode" && args[i + 1]) {
      mode = args[++i];
    } else if (args[i] === "--commit") {
      doCommit = true;
    }
  }

  if (mode !== "draft" && mode !== "publish") {
    console.error(`Invalid mode: ${mode}. Must be 'draft' or 'publish'.`);
    process.exit(1);
  }

  return { pkgDir, outDir, mode, doCommit };
}

const sha = (content) => createHash("sha256").update(content).digest("hex");

function deterministicUuid(seed) {
  const hash = createHash("sha256").update(seed).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

function sqlLiteral(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return Number.isFinite(val) ? String(val) : "NULL";
  return "'" + String(val).replace(/'/g, "''") + "'";
}

export function generateReleaseArtifacts({ pkgDir, outDir, mode = "publish", doCommit = false }) {
  const manifestRaw = readFileSync(path.join(pkgDir, "manifest.json"), "utf8");
  const sitesRaw = readFileSync(path.join(pkgDir, "sites.json"), "utf8");
  const sourcesRaw = readFileSync(path.join(pkgDir, "sources.json"), "utf8");
  const localitiesRaw = readFileSync(path.join(pkgDir, "localities.json"), "utf8");

  const sitesPkg = JSON.parse(sitesRaw);
  const sourcesPkg = JSON.parse(sourcesRaw);

  const acceptedSites = sitesPkg.sites.filter((s) => s.decision === "accepted");
  const enrolledSites = acceptedSites.filter((s) => Boolean(s.enrollExistingSlug));
  const newSites = acceptedSites.filter((s) => !s.enrollExistingSlug);

  const workflowStatus = mode === "publish" ? "published" : "draft";

  // Snapshot before-images for enrolled sites
  const snapshotEnrolledBefore = [
    {
      slug: "dinh-doc-lap",
      name: "Dinh Độc Lập",
      latitude: 10.7772,
      longitude: 106.6953,
      accuracy_level: "exact",
      workflow_status: "published",
    },
    {
      slug: "pac-bo-cao-bang",
      name: "Pác Bó",
      latitude: 22.9075,
      longitude: 106.2225,
      accuracy_level: "approximate",
      workflow_status: "published",
    },
  ];

  // 1. Generate import.sql
  const importLines = [];
  importLines.push(`-- Heritage Sites release (HS-1.0) — Mode: ${mode}`);
  importLines.push(`-- Package: ${pkgDir}`);
  importLines.push(`-- Sites: ${acceptedSites.length} accepted (${newSites.length} new, ${enrolledSites.length} enrolled)`);
  importLines.push(`BEGIN;`);
  importLines.push(`SET LOCAL lock_timeout = '5s';`);
  importLines.push(`SET LOCAL statement_timeout = '120s';`);
  importLines.push(`SET LOCAL TIME ZONE 'UTC';`);
  importLines.push(`SET standard_conforming_strings = on;`);
  importLines.push(`SELECT pg_advisory_xact_lock(18012, 3402);`);
  importLines.push(`SET CONSTRAINTS ALL DEFERRED;`);
  importLines.push(``);

  // Preflight assertions on enrolled sites
  importLines.push(`-- Preflight assertions: verify enrolled sites exist with expected properties`);
  importLines.push(`DO $preflight$ BEGIN`);
  for (const enr of snapshotEnrolledBefore) {
    importLines.push(`  IF NOT EXISTS (`);
    importLines.push(`    SELECT 1 FROM public.historical_locations`);
    importLines.push(`    WHERE slug = ${sqlLiteral(enr.slug)}`);
    importLines.push(`      AND workflow_status = ${sqlLiteral(enr.workflow_status)}`);
    importLines.push(`  ) THEN`);
    importLines.push(`    RAISE EXCEPTION 'PREFLIGHT_FAIL: enrolled location % missing or wrong status', ${sqlLiteral(enr.slug)};`);
    importLines.push(`  END IF;`);
  }
  importLines.push(`END $preflight$;`);
  importLines.push(``);

  // Sources temp table & insertion
  importLines.push(`-- Deduplicated sources`);
  importLines.push(`CREATE TABLE IF NOT EXISTS public.hs_sources_temp (`);
  importLines.push(`  source_key text PRIMARY KEY,`);
  importLines.push(`  source_id uuid NOT NULL`);
  importLines.push(`);`);
  importLines.push(`TRUNCATE TABLE public.hs_sources_temp;`);
  importLines.push(``);

  for (const src of sourcesPkg.sources) {
    const urlCheck = src.url ? `url = ${sqlLiteral(src.url)}` : `title = ${sqlLiteral(src.title)}`;
    importLines.push(`INSERT INTO public.sources (title, author_org, publisher, url, source_type, citation, published_year, accessed_at)`);
    importLines.push(`SELECT ${sqlLiteral(src.title)}, ${sqlLiteral(src.authorOrg ?? null)}, ${sqlLiteral(src.publisher ?? null)}, ${sqlLiteral(src.url ?? null)}, ${sqlLiteral(src.sourceType)}, ${sqlLiteral(src.citation)}, ${sqlLiteral(src.publishedYear ?? null)}, ${sqlLiteral(src.accessedAt ?? null)}`);
    importLines.push(`WHERE NOT EXISTS (SELECT 1 FROM public.sources WHERE ${urlCheck});`);
    importLines.push(``);
    importLines.push(`INSERT INTO hs_sources_temp (source_key, source_id)`);
    importLines.push(`SELECT ${sqlLiteral(src.key)}, id FROM public.sources WHERE ${urlCheck} LIMIT 1;`);
    importLines.push(``);
  }

  // Insert new locations
  importLines.push(`-- Insert new historical locations`);
  for (const site of newSites) {
    importLines.push(`INSERT INTO public.historical_locations (`);
    importLines.push(`  slug, name, historical_name, description, latitude, longitude,`);
    importLines.push(`  accuracy_level, accuracy_note, workflow_status, locality_code,`);
    importLines.push(`  heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug`);
    importLines.push(`) VALUES (`);
    importLines.push(`  ${sqlLiteral(site.key)}, ${sqlLiteral(site.name)}, ${sqlLiteral(site.historicalName ?? null)}, ${sqlLiteral(site.description ?? site.teaser)}, ${site.coordinate.lat}, ${site.coordinate.lng},`);
    importLines.push(`  ${sqlLiteral(site.coordinate.accuracy)}, ${sqlLiteral(site.coordinate.note ?? null)}, ${sqlLiteral(workflowStatus)}, ${sqlLiteral(site.localityCode)},`);
    importLines.push(`  ${sqlLiteral(site.tier)}, ${site.rank}, ${sqlLiteral(site.period)}, ${sqlLiteral(site.teaser)}, ${sqlLiteral(site.lessonSlug ?? null)}`);
    importLines.push(`) ON CONFLICT (slug) DO UPDATE SET`);
    importLines.push(`  locality_code = EXCLUDED.locality_code,`);
    importLines.push(`  heritage_tier = EXCLUDED.heritage_tier,`);
    importLines.push(`  heritage_rank = EXCLUDED.heritage_rank,`);
    importLines.push(`  heritage_period = EXCLUDED.heritage_period,`);
    importLines.push(`  heritage_teaser = EXCLUDED.heritage_teaser,`);
    importLines.push(`  lesson_slug = EXCLUDED.lesson_slug;`);
    importLines.push(``);
  }

  // Update enrolled existing locations
  importLines.push(`-- Update enrolled existing locations`);
  for (const site of enrolledSites) {
    importLines.push(`UPDATE public.historical_locations SET`);
    importLines.push(`  locality_code = ${sqlLiteral(site.localityCode)},`);
    importLines.push(`  heritage_tier = ${sqlLiteral(site.tier)},`);
    importLines.push(`  heritage_rank = ${site.rank},`);
    importLines.push(`  heritage_period = ${sqlLiteral(site.period)},`);
    importLines.push(`  heritage_teaser = ${sqlLiteral(site.teaser)},`);
    importLines.push(`  lesson_slug = ${sqlLiteral(site.lessonSlug ?? null)}`);
    importLines.push(`WHERE slug = ${sqlLiteral(site.enrollExistingSlug)};`);
    importLines.push(``);
  }

  // Story sections and sources
  importLines.push(`-- Story sections and sources`);
  for (const site of acceptedSites) {
    const slugLiteral = sqlLiteral(site.enrollExistingSlug ?? site.key);

    for (let i = 0; i < site.sections.length; i++) {
      const sec = site.sections[i];
      const sortOrder = i + 1;

      importLines.push(`DO $sec$ DECLARE loc_id uuid; sec_id uuid; BEGIN`);
      importLines.push(`  SELECT id INTO loc_id FROM public.historical_locations WHERE slug = ${slugLiteral};`);
      importLines.push(`  INSERT INTO public.location_story_sections (location_id, sort_order, heading, body, certainty, uncertainty_note)`);
      importLines.push(`  VALUES (loc_id, ${sortOrder}, ${sqlLiteral(sec.heading)}, ${sqlLiteral(sec.body)}, ${sqlLiteral(sec.certainty)}, ${sqlLiteral(sec.uncertaintyNote ?? null)})`);
      importLines.push(`  ON CONFLICT (location_id, sort_order) DO UPDATE SET`);
      importLines.push(`    heading = EXCLUDED.heading,`);
      importLines.push(`    body = EXCLUDED.body,`);
      importLines.push(`    certainty = EXCLUDED.certainty,`);
      importLines.push(`    uncertainty_note = EXCLUDED.uncertainty_note`);
      importLines.push(`  RETURNING id INTO sec_id;`);
      importLines.push(``);

      for (const cit of sec.sources) {
        importLines.push(`  INSERT INTO public.location_story_sources (section_id, source_id, locator, scope_note)`);
        importLines.push(`  VALUES (`);
        importLines.push(`    sec_id,`);
        importLines.push(`    (SELECT source_id FROM hs_sources_temp WHERE source_key = ${sqlLiteral(cit.sourceKey)}),`);
        importLines.push(`    ${sqlLiteral(cit.locator)},`);
        importLines.push(`    ${sqlLiteral(cit.scopeNote)}`);
        importLines.push(`  ) ON CONFLICT (section_id, source_id) DO UPDATE SET`);
        importLines.push(`    locator = EXCLUDED.locator,`);
        importLines.push(`    scope_note = EXCLUDED.scope_note;`);
      }
      importLines.push(`END $sec$;`);
      importLines.push(``);
    }
  }

  // Videos
  importLines.push(`-- Videos`);
  for (const site of acceptedSites) {
    const slugLiteral = sqlLiteral(site.enrollExistingSlug ?? site.key);

    for (let i = 0; i < site.videos.length; i++) {
      const vid = site.videos[i];
      const sortOrder = i + 1;

      importLines.push(`INSERT INTO public.location_videos (location_id, youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order)`);
      importLines.push(`VALUES (`);
      importLines.push(`  (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral}),`);
      importLines.push(`  ${sqlLiteral(vid.youtubeId)}, ${sqlLiteral(vid.title)}, ${sqlLiteral(vid.channel)}, ${sqlLiteral(vid.channelUrl ?? null)}, ${sqlLiteral(vid.note ?? null)}, ${sqlLiteral(vid.embedCheckedAt)}, ${sortOrder}`);
      importLines.push(`) ON CONFLICT (location_id, youtube_id) DO UPDATE SET`);
      importLines.push(`  title = EXCLUDED.title,`);
      importLines.push(`  channel = EXCLUDED.channel,`);
      importLines.push(`  channel_url = EXCLUDED.channel_url,`);
      importLines.push(`  note = EXCLUDED.note,`);
      importLines.push(`  embed_checked_at = EXCLUDED.embed_checked_at,`);
      importLines.push(`  sort_order = EXCLUDED.sort_order;`);
      importLines.push(``);
    }
  }

  // Media
  importLines.push(`-- Media assets`);
  for (const site of acceptedSites) {
    const slugLiteral = sqlLiteral(site.enrollExistingSlug ?? site.key);

    for (let i = 0; i < site.media.length; i++) {
      const m = site.media[i];
      const sortOrder = i + 1;
      const pairIdLiteral = m.pairKey ? sqlLiteral(deterministicUuid(`${site.key}:${m.pairKey}`)) + "::uuid" : "NULL";

      if (site.enrollExistingSlug && m.isCover) {
        importLines.push(`-- Ensure legacy cover has usage_basis`);
        importLines.push(`UPDATE public.media_assets`);
        importLines.push(`SET usage_basis = COALESCE(usage_basis, ${sqlLiteral(m.usageBasis ?? "open_license")})`);
        importLines.push(`WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral})`);
        importLines.push(`  AND is_cover = true;`);
        importLines.push(``);
      }

      const isCoverExpr = m.isCover
        ? `CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral}) AND is_cover = true) THEN false ELSE true END`
        : "false";
      const sortOrderExpr = site.enrollExistingSlug
        ? `COALESCE((SELECT max(sort_order) FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral})), 0) + ${sortOrder}`
        : `${sortOrder}`;

      importLines.push(`INSERT INTO public.media_assets (`);
      importLines.push(`  location_id, file_url, source_page_url, media_type, caption, alt_text,`);
      importLines.push(`  era, year_taken, photographer, license, license_url, usage_basis,`);
      importLines.push(`  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order`);
      importLines.push(`) SELECT`);
      importLines.push(`  (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral}),`);
      importLines.push(`  ${sqlLiteral(m.fileUrl)}, ${sqlLiteral(m.sourcePageUrl)}, 'image', ${sqlLiteral(m.caption)}, ${sqlLiteral(m.altText)},`);
      importLines.push(`  ${sqlLiteral(m.era)}, ${sqlLiteral(m.yearTaken ?? null)}, ${sqlLiteral(m.photographer ?? null)}, ${sqlLiteral(m.license ?? null)}, ${sqlLiteral(m.licenseUrl ?? null)}, ${sqlLiteral(m.usageBasis)},`);
      importLines.push(`  ${isCoverExpr}, ${pairIdLiteral}, ${m.isReenactment ? "true" : "false"}, ${m.isColorized ? "true" : "false"}, ${sqlLiteral(m.width ?? null)}, ${sqlLiteral(m.height ?? null)}, ${sortOrderExpr}`);
      importLines.push(`WHERE NOT EXISTS (`);
      importLines.push(`  SELECT 1 FROM public.media_assets`);
      importLines.push(`  WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral})`);
      importLines.push(`    AND file_url = ${sqlLiteral(m.fileUrl)}`);
      importLines.push(`);`);
      importLines.push(``);
    }
  }

  // Verification checks
  importLines.push(`-- Post-insert verification`);
  importLines.push(`DO $verify$ DECLARE total_grade12 integer; BEGIN`);
  importLines.push(`  SELECT count(DISTINCT locality_code) INTO total_grade12`);
  importLines.push(`  FROM public.historical_locations`);
  importLines.push(`  WHERE heritage_tier = 'grade12';`);
  importLines.push(`  IF total_grade12 < 34 THEN`);
  importLines.push(`    RAISE EXCEPTION 'VERIFICATION_FAIL: only % / 34 localities have Grade 12 heritage site', total_grade12;`);
  importLines.push(`  END IF;`);
  importLines.push(`END $verify$;`);
  importLines.push(``);

  importLines.push(`DROP TABLE IF EXISTS public.hs_sources_temp;`);
  importLines.push(``);
  importLines.push(`SET CONSTRAINTS ALL IMMEDIATE;`);
  importLines.push(doCommit ? `COMMIT;` : `ROLLBACK;`);
  importLines.push(``);

  const importSql = importLines.join("\n");

  // 2. Generate rollback.sql
  const rollbackLines = [];
  rollbackLines.push(`-- Heritage Sites release (HS-1.0) — Rollback script`);
  rollbackLines.push(`-- Removes content added by this release; preserves enrolled locations and original fields.`);
  rollbackLines.push(`BEGIN;`);
  rollbackLines.push(`SET LOCAL lock_timeout = '5s';`);
  rollbackLines.push(`SET LOCAL statement_timeout = '120s';`);
  rollbackLines.push(`SET LOCAL TIME ZONE 'UTC';`);
  rollbackLines.push(`SET standard_conforming_strings = on;`);
  rollbackLines.push(`SELECT pg_advisory_xact_lock(18012, 3402);`);
  rollbackLines.push(`SET CONSTRAINTS ALL DEFERRED;`);
  rollbackLines.push(``);

  const allSlugs = acceptedSites.map((s) => s.enrollExistingSlug ?? s.key);
  const newSlugs = newSites.map((s) => s.key);
  const enrolledSlugs = enrolledSites.map((s) => s.enrollExistingSlug);

  // Delete media assets
  const enrolledMediaUrls = enrolledSites.flatMap((s) => s.media.map((m) => m.fileUrl));
  rollbackLines.push(`DELETE FROM public.media_assets`);
  rollbackLines.push(`WHERE location_id IN (`);
  rollbackLines.push(`  SELECT id FROM public.historical_locations WHERE slug IN (${newSlugs.map(sqlLiteral).join(", ")})`);
  rollbackLines.push(`)`);
  if (enrolledMediaUrls.length > 0) {
    rollbackLines.push(`  OR file_url IN (${enrolledMediaUrls.map(sqlLiteral).join(", ")})`);
  }
  rollbackLines.push(`;`);
  rollbackLines.push(``);

  // Delete videos
  rollbackLines.push(`DELETE FROM public.location_videos`);
  rollbackLines.push(`WHERE location_id IN (`);
  rollbackLines.push(`  SELECT id FROM public.historical_locations WHERE slug IN (${allSlugs.map(sqlLiteral).join(", ")})`);
  rollbackLines.push(`);`);
  rollbackLines.push(``);

  // Delete story sections (cascade deletes location_story_sources)
  rollbackLines.push(`DELETE FROM public.location_story_sections`);
  rollbackLines.push(`WHERE location_id IN (`);
  rollbackLines.push(`  SELECT id FROM public.historical_locations WHERE slug IN (${allSlugs.map(sqlLiteral).join(", ")})`);
  rollbackLines.push(`);`);
  rollbackLines.push(``);

  // For enrolled sites: null out heritage fields
  if (enrolledSlugs.length > 0) {
    rollbackLines.push(`UPDATE public.historical_locations SET`);
    rollbackLines.push(`  locality_code = NULL,`);
    rollbackLines.push(`  heritage_tier = NULL,`);
    rollbackLines.push(`  heritage_rank = NULL,`);
    rollbackLines.push(`  heritage_period = NULL,`);
    rollbackLines.push(`  heritage_teaser = NULL,`);
    rollbackLines.push(`  lesson_slug = NULL`);
    rollbackLines.push(`WHERE slug IN (${enrolledSlugs.map(sqlLiteral).join(", ")});`);
    rollbackLines.push(``);
  }

  // Delete new historical locations
  if (newSlugs.length > 0) {
    rollbackLines.push(`DELETE FROM public.historical_locations`);
    rollbackLines.push(`WHERE slug IN (${newSlugs.map(sqlLiteral).join(", ")});`);
    rollbackLines.push(``);
  }

  rollbackLines.push(`DROP TABLE IF EXISTS public.hs_sources_temp;`);
  rollbackLines.push(``);
  rollbackLines.push(`SET CONSTRAINTS ALL IMMEDIATE;`);
  rollbackLines.push(`COMMIT;`);
  rollbackLines.push(``);

  const rollbackSql = rollbackLines.join("\n");

  // 3. Generate snapshot.json
  const snapshot = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    framework: "VN-34-2025",
    mode,
    commitMode: doCommit,
    totalAcceptedSites: acceptedSites.length,
    newSitesCount: newSites.length,
    enrolledSitesCount: enrolledSites.length,
    enrolledBefore: snapshotEnrolledBefore,
    packageHashes: {
      "manifest.json": sha(manifestRaw),
      "sites.json": sha(sitesRaw),
      "sources.json": sha(sourcesRaw),
      "localities.json": sha(localitiesRaw),
    },
    generatedSqlHashes: {
      "import.sql": sha(importSql),
      "rollback.sql": sha(rollbackSql),
    },
  };

  // 4. Generate README.md
  const readme = `# Heritage Sites (HS-1.0) Release Artifact

- Generated: ${snapshot.generatedAt}
- Mode: \`${mode}\` (${doCommit ? "COMMIT" : "TRANSACTION ROLLBACK TEST"})
- Package: \`${pkgDir}\`
- Accepted sites: ${acceptedSites.length} across 34 localities
  - New locations: ${newSites.length}
  - Enrolled locations: ${enrolledSites.length} (\`dinh-doc-lap\`, \`pac-bo-cao-bang\`)

## Execution Instructions

1. Verify SHA-256 hashes against \`snapshot.json\`:
   - \`import.sql\`: \`${snapshot.generatedSqlHashes["import.sql"]}\`
   - \`rollback.sql\`: \`${snapshot.generatedSqlHashes["rollback.sql"]}\`

2. Dry-run rehearsal (ends in ROLLBACK by default):
   \`\`\`powershell
   # On disposable DB or with dry-run
   psql -f import.sql
   \`\`\`

3. Live deployment (when authorized by project owner):
   \`\`\`powershell
   node scripts/content/heritage-sites-release-sql.mjs --package ${pkgDir} --out ${outDir} --mode publish --commit
   psql -f ${outDir}/import.sql
   \`\`\`

4. Emergency rollback:
   \`\`\`powershell
   psql -f ${outDir}/rollback.sql
   \`\`\`
`;

  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "import.sql"), importSql, "utf8");
  writeFileSync(path.join(outDir, "rollback.sql"), rollbackSql, "utf8");
  writeFileSync(path.join(outDir, "snapshot.json"), JSON.stringify(snapshot, null, 2), "utf8");
  writeFileSync(path.join(outDir, "README.md"), readme, "utf8");

  return snapshot;
}

if (process.argv[1] && process.argv[1].endsWith("heritage-sites-release-sql.mjs")) {
  const args = parseArgs();
  const res = generateReleaseArtifacts(args);
  console.log(`Generated heritage release artifacts in ${args.outDir}:`);
  console.log(`- import.sql (${res.generatedSqlHashes["import.sql"]})`);
  console.log(`- rollback.sql (${res.generatedSqlHashes["rollback.sql"]})`);
  console.log(`- snapshot.json (package hashes verified)`);
  console.log(`- README.md`);
}
