#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const KNOWN_EXISTING_SLUGS = new Set([
  "dinh-doc-lap",
  "ben-nha-rong",
  "quang-truong-ba-dinh",
  "nha-hat-lon-ha-noi",
  "dien-bien-phu",
  "sai-gon",
  "hue",
  "paris-phap",
  "geneve-thuy-si",
  "ha-noi-khu-vuc-trung-tam",
  "pac-bo-cao-bang",
]);

export const FORBIDDEN_PHOTOGRAPHERS = new Set([
  "Wikimedia Commons Contributor",
  "Cổng Thông tin Điện tử",
  "Cổng Thông tin Điện tử tỉnh",
]);

export const FORBIDDEN_PHOTOGRAPHER_REGEX = /^Cổng Thông tin Điện tử( tỉnh)?$/i;

export const FORBIDDEN_URL_PATTERNS = [
  /\/uploads\/images\/\d{4}\/\d{2}\//i,
  /Special:FilePath/i,
];

export const ALLOWED_LESSON_SLUGS = new Set([
  "cach-mang-thang-tam-1945",
  "chien-dich-dien-bien-phu",
  "duong-truong-son",
  "tet-mau-than-1968",
  "dien-bien-phu-tren-khong-1972",
  "chien-dich-ho-chi-minh-1975",
]);

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
const YOUTUBE_REGEX = /^[A-Za-z0-9_-]{11}$/u;

function parseArgs(args) {
  let pkg = "supabase/content/heritage-sites/v1";
  let mode = "research";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--package" && args[i + 1]) {
      pkg = args[++i];
    } else if (args[i] === "--mode" && args[i + 1]) {
      mode = args[++i];
    }
  }
  return { pkg, mode };
}

export function validateHeritagePackage(packageDir, mode = "research") {
  const issues = [];
  const base = path.resolve(root, packageDir);

  const filenames = ["localities.json", "sources.json", "sites.json", "manifest.json"];
  const docs = {};
  const rawTexts = {};

  for (const name of filenames) {
    const full = path.join(base, name);
    if (!fs.existsSync(full)) {
      issues.push(`Missing package file: ${name}`);
      continue;
    }
    try {
      const content = fs.readFileSync(full, "utf8");
      rawTexts[name] = content;
      docs[name] = JSON.parse(content);
      if (content !== content.normalize("NFC")) {
        issues.push(`${name}: content is not in Unicode NFC normal form.`);
      }
    } catch (err) {
      issues.push(`Failed to parse JSON in ${name}: ${err.message}`);
    }
  }

  // Load media-evidence.json if present
  const evidencePath = path.join(base, "media-evidence.json");
  let evidenceData = null;
  if (fs.existsSync(evidencePath)) {
    try {
      const evRaw = fs.readFileSync(evidencePath, "utf8");
      rawTexts["media-evidence.json"] = evRaw;
      evidenceData = JSON.parse(evRaw);
    } catch (err) {
      issues.push(`media-evidence.json: failed to parse JSON: ${err.message}`);
    }
  } else if (mode === "release") {
    issues.push(`media-evidence.json: required file missing in release mode`);
  }

  if (issues.length > 0) {
    return { valid: false, issues, summary: null };
  }

  const { localities: locList } = docs["localities.json"] || {};
  const { sources: srcList } = docs["sources.json"] || {};
  const { sites: siteList } = docs["sites.json"] || {};
  const manifest = docs["manifest.json"] || {};

  // 1. Localities validation
  if (!Array.isArray(locList) || locList.length !== 34) {
    issues.push(`localities.json: expected 34 localities, found ${locList?.length}`);
  }
  const localityCodes = new Set();
  const localitySlugs = new Set();
  for (const loc of locList || []) {
    if (!/^\d{2}$/.test(loc.code)) issues.push(`localities.json: invalid code "${loc.code}"`);
    if (!SLUG_REGEX.test(loc.slug)) issues.push(`localities.json: invalid slug "${loc.slug}"`);
    if (!loc.officialName) issues.push(`localities.json: missing officialName for ${loc.code}`);
    localityCodes.add(loc.code);
    localitySlugs.add(loc.slug);
  }

  // 2. Sources validation
  const sourceKeys = new Set();
  for (const src of srcList || []) {
    if (!src.key || typeof src.key !== "string") issues.push(`sources.json: source missing key`);
    if (sourceKeys.has(src.key)) issues.push(`sources.json: duplicate sourceKey "${src.key}"`);
    sourceKeys.add(src.key);
    if (!src.title) issues.push(`sources.json: source "${src.key}" missing title`);
    if (!["book", "article", "official", "web", "archive", "other"].includes(src.sourceType)) {
      issues.push(`sources.json: invalid sourceType "${src.sourceType}" for "${src.key}"`);
    }
    if (src.url && !/^https?:\/\//.test(src.url)) {
      issues.push(`sources.json: url must be http/https for "${src.key}"`);
    }
  }

  // 3. Sites validation
  const siteKeys = new Set();
  const localityGrade12 = new Map();
  const localityExtended = new Map();
  const dimensionPhotographerTuples = new Map();
  const warnings = [];

  let acceptedCount = 0;
  let heldCount = 0;
  let rejectedCount = 0;

  for (const site of siteList || []) {
    const key = site.key;
    if (!key || typeof key !== "string" || !SLUG_REGEX.test(key) || key.length > 160) {
      issues.push(`sites.json: invalid site key "${key}"`);
      continue;
    }
    if (siteKeys.has(key)) {
      issues.push(`sites.json: duplicate site key "${key}"`);
    }
    siteKeys.add(key);

    if (!["accepted", "held", "rejected"].includes(site.decision)) {
      issues.push(`sites.json: site "${key}" invalid decision "${site.decision}"`);
    }
    if (site.decision === "accepted") acceptedCount++;
    else if (site.decision === "held") heldCount++;
    else if (site.decision === "rejected") rejectedCount++;

    if (site.enrollExistingSlug !== null) {
      if (!KNOWN_EXISTING_SLUGS.has(site.enrollExistingSlug)) {
        issues.push(`sites.json: site "${key}" references unknown enrollExistingSlug "${site.enrollExistingSlug}"`);
      }
    }

    if (!site.name || typeof site.name !== "string") {
      issues.push(`sites.json: site "${key}" missing name`);
    }

    if (!localityCodes.has(site.localityCode)) {
      issues.push(`sites.json: site "${key}" has invalid localityCode "${site.localityCode}"`);
    }

    if (!["grade12", "extended"].includes(site.tier)) {
      issues.push(`sites.json: site "${key}" invalid tier "${site.tier}"`);
    }

    if (site.tier === "grade12" && site.rank !== 1) {
      issues.push(`sites.json: site "${key}" tier grade12 must have rank 1 (found ${site.rank})`);
    }
    if (site.tier === "extended" && site.rank !== 2) {
      issues.push(`sites.json: site "${key}" tier extended must have rank 2 (found ${site.rank})`);
    }

    if (site.tier === "grade12") {
      if (localityGrade12.has(site.localityCode)) {
        issues.push(`sites.json: locality "${site.localityCode}" has more than one grade12 site ("${localityGrade12.get(site.localityCode)}" and "${key}")`);
      }
      localityGrade12.set(site.localityCode, key);
    } else if (site.tier === "extended") {
      if (localityExtended.has(site.localityCode)) {
        issues.push(`sites.json: locality "${site.localityCode}" has more than one extended site ("${localityExtended.get(site.localityCode)}" and "${key}")`);
      }
      localityExtended.set(site.localityCode, key);
    }

    if (!site.period || typeof site.period !== "string") {
      issues.push(`sites.json: site "${key}" missing period`);
    }

    if (!site.teaser || typeof site.teaser !== "string") {
      issues.push(`sites.json: site "${key}" missing teaser`);
    } else if (site.teaser.length < 40 || site.teaser.length > 360) {
      issues.push(`sites.json: site "${key}" teaser length ${site.teaser.length} outside [40, 360]`);
    }

    // Coordinates
    const coord = site.coordinate;
    if (!coord || typeof coord !== "object") {
      issues.push(`sites.json: site "${key}" missing coordinate`);
    } else {
      if (typeof coord.lat !== "number" || typeof coord.lng !== "number") {
        issues.push(`sites.json: site "${key}" invalid coordinate numbers`);
      } else {
        if (coord.lat < 8.0 || coord.lat > 23.5 || coord.lng < 102.0 || coord.lng > 117.5) {
          issues.push(`sites.json: site "${key}" coordinates (${coord.lat}, ${coord.lng}) outside Vietnam coarse bbox`);
        }
      }
      if (!["exact", "approximate", "region"].includes(coord.accuracy)) {
        issues.push(`sites.json: site "${key}" invalid coordinate accuracy "${coord.accuracy}"`);
      }
      if (!coord.osm || typeof coord.osm !== "string") {
        issues.push(`sites.json: site "${key}" missing coordinate osm id`);
      }
      if (!coord.sourceKey || !sourceKeys.has(coord.sourceKey)) {
        issues.push(`sites.json: site "${key}" coordinate sourceKey "${coord.sourceKey}" not in sources.json`);
      }
    }

    // Lesson slug
    if (site.lessonSlug !== null && !ALLOWED_LESSON_SLUGS.has(site.lessonSlug)) {
      issues.push(`sites.json: site "${key}" invalid lessonSlug "${site.lessonSlug}"`);
    }

    // Video check (if any)
    for (const v of site.videos || []) {
      if (!v.youtubeId || !YOUTUBE_REGEX.test(v.youtubeId)) {
        issues.push(`sites.json: site "${key}" invalid youtubeId "${v.youtubeId}"`);
      }
      if (v.channelUrl && !/^(?:https:\/\/)?(?:www\.)?youtube\.com\//.test(v.channelUrl)) {
        issues.push(`sites.json: site "${key}" video channelUrl not youtube.com`);
      }
    }

    // In release mode OR if site is accepted, full content is required
    if (mode === "release" || site.decision === "accepted") {
      if (site.decision !== "accepted") {
        issues.push(`sites.json: release mode requires decision = accepted for "${key}"`);
      }
      // Sections
      const sections = site.sections || [];
      if (sections.length < 3 || sections.length > 5) {
        issues.push(`sites.json: site "${key}" must have 3-5 sections (found ${sections.length})`);
      }
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (!sec.heading || !sec.body) {
          issues.push(`sites.json: site "${key}" section ${i} missing heading or body`);
        } else if (sec.body.length < 80 || sec.body.length > 4000) {
          issues.push(`sites.json: site "${key}" section ${i} body length ${sec.body.length} outside [80, 4000]`);
        }
        if (!["verified", "approximate", "disputed", "editorial"].includes(sec.certainty)) {
          issues.push(`sites.json: site "${key}" section ${i} invalid certainty "${sec.certainty}"`);
        }
        if (["approximate", "disputed"].includes(sec.certainty) && !sec.uncertaintyNote) {
          issues.push(`sites.json: site "${key}" section ${i} (${sec.certainty}) requires uncertaintyNote`);
        }
        if (!Array.isArray(sec.sources) || sec.sources.length < 1) {
          issues.push(`sites.json: site "${key}" section ${i} requires at least 1 source citation`);
        } else {
          for (const cite of sec.sources) {
            if (!sourceKeys.has(cite.sourceKey)) {
              issues.push(`sites.json: site "${key}" section ${i} sourceKey "${cite.sourceKey}" not in sources.json`);
            }
          }
        }
      }

      // Media
      const media = site.media || [];
      const covers = media.filter((m) => m.isCover);
      if (covers.length !== 1) {
        issues.push(`sites.json: site "${key}" must have exactly 1 cover media (found ${covers.length})`);
      }

      // Check pairKey grouping
      const pairGroups = new Map();
      for (const m of media) {
        if (m.pairKey) {
          if (!pairGroups.has(m.pairKey)) pairGroups.set(m.pairKey, []);
          pairGroups.get(m.pairKey).push(m);
        }
      }
      for (const [pKey, pItems] of pairGroups.entries()) {
        const hasHist = pItems.some((it) => it.era === "historical");
        const hasToday = pItems.some((it) => it.era === "today");
        if (pItems.length !== 2 || !hasHist || !hasToday) {
          issues.push(
            `sites.json: site "${key}" pairKey "${pKey}" must contain exactly 1 historical and 1 today image (found ${pItems.length})`,
          );
        }
      }

      for (const m of media) {
        if (!["open_license", "public_domain", "permission", "coursework_reference"].includes(m.usageBasis)) {
          issues.push(`sites.json: site "${key}" media "${m.key}" invalid usageBasis "${m.usageBasis}"`);
        }
        if (m.usageBasis === "open_license" && (!m.license || !m.licenseUrl)) {
          issues.push(`sites.json: site "${key}" media "${m.key}" open_license requires license and licenseUrl`);
        }
        if (m.usageBasis === "coursework_reference" && m.license !== null) {
          issues.push(`sites.json: site "${key}" media "${m.key}" coursework_reference must have license = null`);
        }

        // 1. Photographer check: reject placeholder photographers
        if (
          m.photographer &&
          (FORBIDDEN_PHOTOGRAPHERS.has(m.photographer) || FORBIDDEN_PHOTOGRAPHER_REGEX.test(m.photographer))
        ) {
          issues.push(
            `sites.json: site "${key}" media "${m.key}" has forbidden placeholder photographer "${m.photographer}"`,
          );
        }

        // 2. URL check: reject forbidden patterns
        for (const pattern of FORBIDDEN_URL_PATTERNS) {
          if (pattern.test(m.fileUrl)) {
            issues.push(
              `sites.json: site "${key}" media "${m.key}" fileUrl matches forbidden pattern ${pattern}: "${m.fileUrl}"`,
            );
          }
        }

        // URL domain/scheme check
        if (mode === "research") {
          const isStoragePrefix = m.fileUrl?.startsWith(`storage:locations/heritage/${key}/`);
          const isSupabaseUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/media\/locations\/heritage\//.test(
            m.fileUrl || "",
          );
          const isHttps = /^https:\/\//.test(m.fileUrl || "");
          if (!isStoragePrefix && !isSupabaseUrl && !isHttps) {
            issues.push(
              `sites.json: site "${key}" media "${m.key}" fileUrl must be storage:locations/heritage/... or https in research mode`,
            );
          }
        } else if (mode === "release") {
          const isSupabaseUrl = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/media\/locations\/heritage\//.test(
            m.fileUrl || "",
          );
          if (!isSupabaseUrl) {
            issues.push(
              `sites.json: site "${key}" media "${m.key}" release mode requires Supabase public storage URL for fileUrl`,
            );
          }
        }

        if (!m.altText || m.altText.length <= 10) {
          issues.push(`sites.json: site "${key}" media "${m.key}" altText must be > 10 chars`);
        }

        // Track dimension & photographer tuple for fabrication heuristic
        if (m.photographer && m.width && m.height) {
          const tuple = `${m.photographer}__${m.width}x${m.height}`;
          if (!dimensionPhotographerTuples.has(tuple)) {
            dimensionPhotographerTuples.set(tuple, new Set());
          }
          dimensionPhotographerTuples.get(tuple).add(key);
        }

        // Evidence verification
        if (evidenceData) {
          const evItem = (evidenceData.items || []).find(
            (it) => it.key === m.key || (it.site === key && it.key === m.key),
          );
          if (!evItem) {
            issues.push(`sites.json: site "${key}" media "${m.key}" has no matching entry in media-evidence.json`);
          } else {
            const v1200 = evItem.variants?.["1200"];
            if (!evItem.download?.sha256 && !v1200?.sha256) {
              issues.push(`media-evidence.json: entry "${m.key}" missing sha256`);
            }
            if (!v1200 && !evItem.commons?.originalWidth && !evItem.variants?.["400"]) {
              issues.push(`media-evidence.json: entry "${m.key}" missing dimensions`);
            }
            if (v1200 && m.width && m.height) {
              if (m.width !== v1200.width || m.height !== v1200.height) {
                issues.push(
                  `sites.json: site "${key}" media "${m.key}" declared dimensions ${m.width}x${m.height} do not match evidence 1200 variant dimensions ${v1200.width}x${v1200.height}`,
                );
              }
            }
          }
        }
      }

      // Video verification against evidence
      if (evidenceData && Array.isArray(site.videos)) {
        const evVideos = new Map((evidenceData.videos || []).map((v) => [v.youtubeId, v]));
        for (const v of site.videos) {
          const ev = evVideos.get(v.youtubeId);
          if (!ev || ev.verdict === "removed") {
            issues.push(
              `sites.json: site "${key}" video "${v.youtubeId}" has no valid evidence in media-evidence.json or was marked removed`,
            );
          }
        }
      }
    }
  }

  // Fabrication heuristic check
  for (const [tuple, siteKeysSet] of dimensionPhotographerTuples.entries()) {
    if (siteKeysSet.size > 3) {
      // Check if all sites in this set have distinct evidence sha256 and verified origin
      const distinctEvidence = new Set();
      let hasUnverified = false;
      for (const siteKey of siteKeysSet) {
        const site = (siteList || []).find((s) => s.key === siteKey);
        const m = site?.media?.[0];
        const ev = evidenceData?.items?.find((it) => it.key === m?.key);
        if (!ev || !ev.download?.sha256 || m?.photographer === "Duplicated Photographer") {
          hasUnverified = true;
          break;
        }
        distinctEvidence.add(ev.download.sha256);
      }

      if (hasUnverified || distinctEvidence.size !== siteKeysSet.size) {
        const msg = `Fabrication heuristic triggered: > 3 sites share exact photographer and dimensions (${tuple}): ${[...siteKeysSet].join(", ")}`;
        if (mode === "release") {
          issues.push(msg);
        } else {
          warnings.push(msg);
        }
      }
    }
  }

  // Release mode completeness
  if (mode === "release") {
    if (localityGrade12.size !== 34) {
      issues.push(`Release mode: expected 34 localities with grade12 accepted sites, found ${localityGrade12.size}/34`);
    }
  }

  // 4. Manifest hashes
  if (manifest.files) {
    for (const [file, expectedHash] of Object.entries(manifest.files)) {
      if (rawTexts[file]) {
        const actual = crypto.createHash("sha256").update(rawTexts[file], "utf8").digest("hex");
        if (actual !== expectedHash) {
          issues.push(`manifest.json: hash mismatch for ${file} (expected ${expectedHash}, got ${actual})`);
        }
      }
    }
  }

  const summary = {
    mode,
    totalSites: (siteList || []).length,
    grade12Represented: localityGrade12.size,
    extendedRepresented: localityExtended.size,
    acceptedSites: acceptedCount,
    heldSites: heldCount,
    rejectedSites: rejectedCount,
    totalSources: (srcList || []).length,
  };

  return { valid: issues.length === 0, issues, warnings, summary };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { pkg, mode } = parseArgs(process.argv.slice(2));
  console.log(`Validating heritage package: ${pkg} (mode: ${mode})`);
  const res = validateHeritagePackage(pkg, mode);
  if (res.issues.length > 0) {
    console.error(`Validation failed with ${res.issues.length} issue(s):`);
    for (const iss of res.issues) {
      console.error(` - ${iss}`);
    }
    process.exit(1);
  }
  console.log("Validation SUCCESS:");
  console.table(res.summary);
  process.exit(0);
}
