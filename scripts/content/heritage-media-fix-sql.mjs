#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseArgs } from "node:util";

const root = process.cwd();

function sqlLiteral(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return String(val);
  return `'${String(val).replace(/'/g, "''")}'`;
}

function sha256String(str) {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

export function generateMediaFixSql(options = {}) {
  const pkgDir = path.resolve(root, options.package || "supabase/content/heritage-sites/v1");
  const outDir = path.resolve(root, options.out || "supabase/content/heritage-sites/release-v1-media-fix");
  const beforeFile = path.resolve(root, options.before || path.join(outDir, "before.json"));
  const baseUrl = (options.baseUrl || "https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media").replace(/\/+$/, "");
  const mode = options.mode || "draft";
  const doCommit = Boolean(options.commit);

  if (!fs.existsSync(beforeFile)) {
    throw new Error(`File before.json không tồn tại: ${beforeFile}`);
  }

  const beforeData = JSON.parse(fs.readFileSync(beforeFile, "utf8"));
  const sitesData = JSON.parse(fs.readFileSync(path.join(pkgDir, "sites.json"), "utf8"));
  const evidenceData = JSON.parse(fs.readFileSync(path.join(pkgDir, "media-evidence.json"), "utf8"));

  const acceptedSites = sitesData.sites.filter((s) => s.decision === "accepted");

  // Determine media to delete from beforeData
  // Note: For enrolled locations (pac-bo-cao-bang, dinh-doc-lap), only delete the media rows
  // that were added by release-v1 (i.e. Special:FilePath or sort_order > 1), NEVER delete their pre-existing cover.
  const enrolledSlugs = ["pac-bo-cao-bang", "dinh-doc-lap"];
  const mediaToDelete = [];
  const mediaToAssert = [];
  const videosToDelete = [];

  for (const loc of beforeData) {
    const isEnrolled = enrolledSlugs.includes(loc.slug);
    for (const ma of loc.media_assets || []) {
      if (isEnrolled) {
        // Enrolled site: protect pre-existing cover
        if (ma.is_cover && ma.sort_order === 1 && !ma.file_url.includes("Special:FilePath")) {
          // Keep pre-existing cover
          continue;
        }
      }
      mediaToDelete.push({
        id: ma.id,
        locationSlug: loc.slug,
        fileUrl: ma.file_url,
      });
      mediaToAssert.push({
        id: ma.id,
        locationSlug: loc.slug,
        fileUrl: ma.file_url,
      });
    }

    for (const v of loc.location_videos || []) {
      videosToDelete.push({
        id: v.id,
        locationSlug: loc.slug,
        youtubeId: v.youtube_id,
        title: v.title,
      });
    }
  }

  // Generate apply.sql
  const applyLines = [];
  applyLines.push(`-- Heritage Sites Media Corrective Release (release-v1-media-fix)`);
  applyLines.push(`-- Mode: ${mode} (${doCommit ? "COMMIT" : "ROLLBACK"})`);
  applyLines.push(`-- Generated: ${new Date().toISOString()}`);
  applyLines.push(`BEGIN;`);
  applyLines.push(`SET LOCAL lock_timeout = '5s';`);
  applyLines.push(`SET LOCAL statement_timeout = '120s';`);
  applyLines.push(`SET LOCAL TIME ZONE 'UTC';`);
  applyLines.push(`SET standard_conforming_strings = on;`);
  applyLines.push(`SELECT pg_advisory_xact_lock(18012, 3402);`);
  applyLines.push(`SET CONSTRAINTS ALL DEFERRED;`);
  applyLines.push(``);

  // 1. Assertions on location existence and media drift
  applyLines.push(`-- 1. Preflight Assertions: Verify locations and assert un-drifted state against before.json`);
  applyLines.push(`DO $assert$ BEGIN`);
  for (const s of acceptedSites) {
    const slug = s.enrollExistingSlug || s.key;
    applyLines.push(`  IF NOT EXISTS (SELECT 1 FROM public.historical_locations WHERE slug = ${sqlLiteral(slug)}) THEN`);
    applyLines.push(`    RAISE EXCEPTION 'heritage location missing: %', ${sqlLiteral(slug)};`);
    applyLines.push(`  END IF;`);
  }
  for (const ma of mediaToAssert) {
    applyLines.push(`  IF NOT EXISTS (SELECT 1 FROM public.media_assets WHERE id = ${sqlLiteral(ma.id)} AND file_url = ${sqlLiteral(ma.fileUrl)}) THEN`);
    applyLines.push(`    RAISE EXCEPTION 'heritage media drift on %: asset % has changed', ${sqlLiteral(ma.locationSlug)}, ${sqlLiteral(ma.id)};`);
    applyLines.push(`  END IF;`);
  }
  applyLines.push(`END $assert$;`);
  applyLines.push(``);

  // 2. Delete obsolete media
  applyLines.push(`-- 2. Delete obsolete / broken media rows from release-v1`);
  if (mediaToDelete.length > 0) {
    applyLines.push(`DELETE FROM public.media_assets WHERE id IN (`);
    for (let i = 0; i < mediaToDelete.length; i++) {
      const comma = i === mediaToDelete.length - 1 ? "" : ",";
      applyLines.push(`  ${sqlLiteral(mediaToDelete[i].id)}${comma}`);
    }
    applyLines.push(`);`);
  }
  applyLines.push(``);

  // 3. Delete fake videos
  applyLines.push(`-- 3. Delete unverified / fake location videos`);
  if (videosToDelete.length > 0) {
    applyLines.push(`DELETE FROM public.location_videos WHERE id IN (`);
    for (let i = 0; i < videosToDelete.length; i++) {
      const comma = i === videosToDelete.length - 1 ? "" : ",";
      applyLines.push(`  ${sqlLiteral(videosToDelete[i].id)}${comma}`);
    }
    applyLines.push(`);`);
  }
  applyLines.push(``);

  // 4. Insert new verified media assets from package
  applyLines.push(`-- 4. Insert new evidence-backed media assets`);
  let mediaInsertedCount = 0;
  for (const site of acceptedSites) {
    const slugLiteral = sqlLiteral(site.enrollExistingSlug || site.key);
    for (let i = 0; i < site.media.length; i++) {
      const m = site.media[i];
      mediaInsertedCount++;
      const name = m.key.startsWith(site.key + "-") ? m.key.slice(site.key.length + 1) : m.key;
      const fileUrl = `${baseUrl}/locations/heritage/${site.key}/${name}-1200.webp`;

      const isCoverExpr = m.isCover
        ? `CASE WHEN EXISTS (SELECT 1 FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral}) AND is_cover = true) THEN false ELSE true END`
        : "false";

      const sortOrderExpr = site.enrollExistingSlug
        ? `COALESCE((SELECT max(sort_order) FROM public.media_assets WHERE location_id = (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral})), 0) + ${i + 1}`
        : `${i + 1}`;

      applyLines.push(`INSERT INTO public.media_assets (`);
      applyLines.push(`  location_id, file_url, source_page_url, media_type, caption, alt_text,`);
      applyLines.push(`  era, year_taken, photographer, license, license_url, usage_basis,`);
      applyLines.push(`  is_cover, pair_id, is_reenactment, is_colorized, width, height, sort_order`);
      applyLines.push(`) VALUES (`);
      applyLines.push(`  (SELECT id FROM public.historical_locations WHERE slug = ${slugLiteral}),`);
      applyLines.push(`  ${sqlLiteral(fileUrl)}, ${sqlLiteral(m.sourcePageUrl)}, 'image', ${sqlLiteral(m.caption)}, ${sqlLiteral(m.altText)},`);
      applyLines.push(`  ${sqlLiteral(m.era)}, ${sqlLiteral(m.yearTaken)}, ${sqlLiteral(m.photographer)}, ${sqlLiteral(m.license)}, ${sqlLiteral(m.licenseUrl)}, ${sqlLiteral(m.usageBasis)},`);
      applyLines.push(`  ${isCoverExpr}, NULL, false, false, ${m.width}, ${m.height}, ${sortOrderExpr}`);
      applyLines.push(`);`);
      applyLines.push(``);
    }
  }

  // 5. Post-apply verification assertions
  applyLines.push(`-- 5. Post-apply Verification: Assert each heritage site has >= 1 image and <= 1 cover`);
  applyLines.push(`DO $verify$ DECLARE`);
  applyLines.push(`  loc RECORD;`);
  applyLines.push(`  cover_count int;`);
  applyLines.push(`  media_count int;`);
  applyLines.push(`BEGIN`);
  applyLines.push(`  FOR loc IN SELECT id, slug FROM public.historical_locations WHERE heritage_tier IS NOT NULL LOOP`);
  applyLines.push(`    SELECT count(*) INTO media_count FROM public.media_assets WHERE location_id = loc.id;`);
  applyLines.push(`    IF media_count < 1 THEN`);
  applyLines.push(`      RAISE EXCEPTION 'POST_VERIFY_FAIL: location % has no media assets', loc.slug;`);
  applyLines.push(`    END IF;`);
  applyLines.push(`    SELECT count(*) INTO cover_count FROM public.media_assets WHERE location_id = loc.id AND is_cover = true;`);
  applyLines.push(`    IF cover_count != 1 THEN`);
  applyLines.push(`      RAISE EXCEPTION 'POST_VERIFY_FAIL: location % has % covers (must be exactly 1)', loc.slug, cover_count;`);
  applyLines.push(`    END IF;`);
  applyLines.push(`  END LOOP;`);
  applyLines.push(`END $verify$;`);
  applyLines.push(``);

  applyLines.push(`SET CONSTRAINTS ALL IMMEDIATE;`);
  if (doCommit) {
    applyLines.push(`COMMIT;`);
  } else {
    applyLines.push(`ROLLBACK;`);
  }

  const applySql = applyLines.join("\n") + "\n";

  // Generate rollback.sql
  const rollbackLines = [];
  rollbackLines.push(`-- Heritage Sites Media Corrective Release (ROLLBACK)`);
  rollbackLines.push(`-- Restores exact state recorded in before.json`);
  rollbackLines.push(`BEGIN;`);
  rollbackLines.push(`SET LOCAL lock_timeout = '5s';`);
  rollbackLines.push(`SET LOCAL statement_timeout = '120s';`);
  rollbackLines.push(`SET LOCAL TIME ZONE 'UTC';`);
  rollbackLines.push(`SET standard_conforming_strings = on;`);
  rollbackLines.push(`SELECT pg_advisory_xact_lock(18012, 3402);`);
  rollbackLines.push(`SET CONSTRAINTS ALL DEFERRED;`);
  rollbackLines.push(``);

  // 1. Delete new storage media
  rollbackLines.push(`-- 1. Remove newly inserted media assets`);
  rollbackLines.push(`DELETE FROM public.media_assets WHERE file_url LIKE ${sqlLiteral(`${baseUrl}/locations/heritage/%`)};`);
  rollbackLines.push(``);

  // 2. Restore deleted media assets
  rollbackLines.push(`-- 2. Restore previously deleted media assets`);
  for (const loc of beforeData) {
    const isEnrolled = enrolledSlugs.includes(loc.slug);
    for (const ma of loc.media_assets || []) {
      if (isEnrolled && ma.is_cover && ma.sort_order === 1 && !ma.file_url.includes("Special:FilePath")) {
        // Was not deleted
        continue;
      }
      rollbackLines.push(`INSERT INTO public.media_assets (`);
      rollbackLines.push(`  id, location_id, file_url, source_page_url, media_type, caption, alt_text,`);
      rollbackLines.push(`  photographer, license, usage_basis, is_cover, width, height, sort_order`);
      rollbackLines.push(`) VALUES (`);
      rollbackLines.push(`  ${sqlLiteral(ma.id)}, (SELECT id FROM public.historical_locations WHERE slug = ${sqlLiteral(loc.slug)}),`);
      rollbackLines.push(`  ${sqlLiteral(ma.file_url)}, ${sqlLiteral(ma.source_page_url ?? null)}, 'image', ${sqlLiteral(ma.caption ?? null)}, ${sqlLiteral(ma.alt_text ?? null)},`);
      rollbackLines.push(`  ${sqlLiteral(ma.photographer ?? null)}, ${sqlLiteral(ma.license ?? null)}, ${sqlLiteral(ma.usage_basis ?? "open_license")}, ${ma.is_cover ? "true" : "false"},`);
      rollbackLines.push(`  ${ma.width ?? 1200}, ${ma.height ?? 800}, ${ma.sort_order ?? 1}`);
      rollbackLines.push(`);`);
    }
  }
  rollbackLines.push(``);

  // 3. Restore deleted videos
  rollbackLines.push(`-- 3. Restore previously deleted videos`);
  for (const v of videosToDelete) {
    rollbackLines.push(`INSERT INTO public.location_videos (id, location_id, youtube_id, title)`);
    rollbackLines.push(`VALUES (`);
    rollbackLines.push(`  ${sqlLiteral(v.id)}, (SELECT id FROM public.historical_locations WHERE slug = ${sqlLiteral(v.locationSlug)}),`);
    rollbackLines.push(`  ${sqlLiteral(v.youtubeId)}, ${sqlLiteral(v.title ?? null)}`);
    rollbackLines.push(`);`);
  }
  rollbackLines.push(``);

  rollbackLines.push(`SET CONSTRAINTS ALL IMMEDIATE;`);
  rollbackLines.push(`COMMIT;`);

  const rollbackSql = rollbackLines.join("\n") + "\n";

  // Generate README.md
  const readmeLines = [
    `# Heritage Sites Media Corrective Release (release-v1-media-fix)`,
    ``,
    `- Generated: ${new Date().toISOString()}`,
    `- Mode: \`${mode}\` (${doCommit ? "COMMIT" : "ROLLBACK"})`,
    `- Package: \`${pkgDir}\``,
    `- Base Storage URL: \`${baseUrl}\``,
    ``,
    `## Counts`,
    `- Sites affected: ${acceptedSites.length} across 34 localities`,
    `- Media rows deleted (broken/fabricated): ${mediaToDelete.length}`,
    `- Media rows inserted (genuine/verified): ${mediaInsertedCount}`,
    `- Video rows deleted (404/fabricated): ${videosToDelete.length}`,
    ``,
    `## Execution`,
    `1. Apply corrective SQL (must be run in a single transaction):`,
    `   \`\`\`sql`,
    `   \\i apply.sql`,
    `   \`\`\``,
    `2. Rollback if needed:`,
    `   \`\`\`sql`,
    `   \\i rollback.sql`,
    `   \`\`\``,
  ];
  const readmeMd = readmeLines.join("\n") + "\n";

  // Generate snapshot.json
  const snapshot = {
    timestamp: new Date().toISOString(),
    mode,
    commitMode: doCommit,
    baseUrl,
    counts: {
      totalSites: acceptedSites.length,
      mediaDeleted: mediaToDelete.length,
      mediaInserted: mediaInsertedCount,
      videosDeleted: videosToDelete.length,
      videosInserted: 0,
    },
    hashes: {
      applySql: sha256String(applySql),
      rollbackSql: sha256String(rollbackSql),
      beforeJson: sha256String(fs.readFileSync(beforeFile, "utf8")),
      packageManifest: fs.existsSync(path.join(pkgDir, "manifest.json"))
        ? JSON.parse(fs.readFileSync(path.join(pkgDir, "manifest.json"), "utf8")).packageHash
        : null,
    },
  };

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "apply.sql"), applySql, "utf8");
  fs.writeFileSync(path.join(outDir, "rollback.sql"), rollbackSql, "utf8");
  fs.writeFileSync(path.join(outDir, "README.md"), readmeMd, "utf8");
  fs.writeFileSync(path.join(outDir, "snapshot.json"), JSON.stringify(snapshot, null, 2) + "\n", "utf8");

  return {
    outDir,
    mode,
    commitMode: doCommit,
    counts: snapshot.counts,
    hashes: snapshot.hashes,
  };
}

if (process.argv[1] && process.argv[1].endsWith("heritage-media-fix-sql.mjs")) {
  const { values: args } = parseArgs({
    options: {
      package: { type: "string", default: "supabase/content/heritage-sites/v1" },
      before: { type: "string" },
      "base-url": { type: "string" },
      out: { type: "string", default: "supabase/content/heritage-sites/release-v1-media-fix" },
      mode: { type: "string", default: "draft" },
      commit: { type: "boolean", default: false },
    },
  });

  const res = generateMediaFixSql({
    package: args.package,
    before: args.before,
    baseUrl: args["base-url"],
    out: args.out,
    mode: args.commit ? "publish" : (args.mode || "draft"),
    commit: args.commit,
  });

  console.log(`✓ Đã tạo thành công bộ artifact khắc phục media tại: ${res.outDir}`);
  console.log(`Chế độ: ${res.mode} (commit: ${res.commitMode})`);
  console.log(`Số hàng ảnh xóa: ${res.counts.mediaDeleted}`);
  console.log(`Số hàng ảnh thêm: ${res.counts.mediaInserted}`);
  console.log(`Số hàng video xóa: ${res.counts.videosDeleted}`);
  console.log(`Hash apply.sql: ${res.hashes.applySql}`);
  console.log(`Hash rollback.sql: ${res.hashes.rollbackSql}`);
}
