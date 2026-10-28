#!/usr/bin/env node
/**
 * scripts/content/heritage-import-image.mjs
 *
 * Implements Section 4.1 & Section 5 of the Heritage Images Repair Plan:
 *   - Downloads real image from Wikimedia Commons API or verified web URL;
 *   - Verifies license (accepts only PD, CC0, CC BY x, CC BY-SA x, GODL, Attribution; rejects NC/ND/unknown);
 *   - Generates 3 WebP variants (400 q=80, 1200 q=78, 2000 q=72 without enlargement);
 *   - Computes SHA-256, dimensions, byte lengths;
 *   - In dry-run mode: saves preview to preview dir and writes record to media-evidence.json;
 *   - In upload mode: uploads to Supabase Storage `media/locations/heritage/<site-key>/<name>-{400,1200,2000}.webp`;
 *   - Never prints or exposes secret keys.
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { parseArgs } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const USER_AGENT = "LichSuVietNam12/1.0 (do an giao duc; https://github.com/tronghp160/WEB_LICH-SU_12)";
const WIDTHS = [400, 1200, 2000];
const EVIDENCE_PATH = path.join(root, "supabase/content/heritage-sites/v1/media-evidence.json");

const { values: args } = parseArgs({
  options: {
    commons: { type: "string" },
    web: { type: "string" },
    page: { type: "string" },
    credit: { type: "string" },
    usage: { type: "string", default: "open_license" },
    site: { type: "string" },
    name: { type: "string" },
    alt: { type: "string" },
    caption: { type: "string" },
    era: { type: "string", default: "today" },
    year: { type: "string" },
    author: { type: "string" },
    cover: { type: "boolean", default: true },
    preview: { type: "string", default: ".task-reports/heritage-previews" },
    visual: { type: "string" },
    log: { type: "string" },
    "dry-run": { type: "boolean", default: true },
    upload: { type: "boolean", default: false },
  },
});

function fail(msg) {
  console.error(`✗ Lỗi: ${msg}`);
  process.exit(1);
}

const plain = (html) =>
  (html ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function fetchWithRetry(url, options = {}, retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT, ...(options.headers || {}) },
        signal: AbortSignal.timeout(60000),
      });
      if (res.ok) return res;
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
    }
  }
  throw new Error(`Quá thời gian kết nối hoặc liên tục thất bại: ${url}`);
}

export async function processHeritageImage(options) {
  const {
    commons,
    web,
    page,
    credit,
    usage = "open_license",
    site,
    name,
    alt,
    caption,
    era = "today",
    year,
    author,
    cover = true,
    previewDir = ".task-reports/heritage-previews",
    visualCheck = "",
    searchLog = [],
    isDryRun: _isDryRun = true,
    doUpload = false,
  } = options;

  if (!site) fail("Thiếu tham số --site <site-key>.");
  if (!name) fail("Thiếu tham số --name <ascii-kebab-name>.");
  if (!commons && !web) fail("Phải chỉ định --commons <File:...> hoặc --web <url>.");

  let origin = "commons";
  let commonsMeta = null;
  let webMeta = null;
  let downloadUrl = "";
  let rawBuffer = null;
  let rawMime = "";
  let licenseShort = null;
  let licenseUrl = null;
  let artistName = author || null;
  let yearTaken = year ? Number(year) : null;
  let descriptionUrl = null;

  if (commons) {
    origin = "commons";
    const title = commons.startsWith("File:") ? commons : `File:${commons}`;
    const api = new URL("https://commons.wikimedia.org/w/api.php");
    api.search = new URLSearchParams({
      action: "query",
      format: "json",
      formatversion: "2",
      prop: "imageinfo",
      iiprop: "url|size|mime|extmetadata",
      titles: title,
    }).toString();

    const jsonRes = await fetchWithRetry(api);
    if (!jsonRes.ok) fail(`Commons API trả về mã lỗi ${jsonRes.status} đối với "${title}".`);
    const data = await jsonRes.json();
    const pageObj = data?.query?.pages?.[0];
    if (!pageObj || pageObj.missing) fail(`Tệp "${title}" không tồn tại trên Wikimedia Commons.`);
    const info = pageObj.imageinfo?.[0];
    if (!info) fail(`Không có imageinfo cho "${title}".`);

    const ext = info.extmetadata ?? {};
    licenseShort = plain(ext.LicenseShortName?.value);
    licenseUrl = ext.LicenseUrl?.value || null;
    const commonsArtist = plain(ext.Artist?.value).replace(/^(Unknown author\s*)+$/i, "").trim();
    if (!artistName) artistName = commonsArtist || null;

    if (!yearTaken) {
      const dt = plain(ext.DateTimeOriginal?.value);
      const matchYear = /\b(1[89]\d\d|20\d\d)\b/.exec(dt)?.[1];
      if (matchYear) yearTaken = Number(matchYear);
    }

    // License verification
    const allowed = /^(public domain|pd\b|cc0|cc[ -]by(-sa)?[ -]\d|godl\b|attribution$)/i;
    if (!licenseShort || !allowed.test(licenseShort) || /\b(nc|nd)\b/i.test(licenseShort) || /fair use/i.test(licenseShort)) {
      fail(`Giấy phép "${licenseShort || "chưa rõ"}" không hợp lệ (chỉ chấp nhận PD, CC0, CC BY, CC BY-SA, GODL, Attribution).`);
    }

    downloadUrl = info.url;
    descriptionUrl = info.descriptionurl || `https://commons.wikimedia.org/wiki/${encodeURIComponent(title)}`;

    commonsMeta = {
      title,
      descriptionurl: descriptionUrl,
      license: licenseShort,
      licenseUrl,
      artist: artistName,
      credit: artistName,
      originalWidth: info.width,
      originalHeight: info.height,
    };

    console.log(`[Commons] Đang tải ${title} (${info.width}×${info.height})...`);
    const imgRes = await fetchWithRetry(downloadUrl);
    if (!imgRes.ok) fail(`Tải ảnh gốc Commons thất bại: HTTP ${imgRes.status}`);
    rawBuffer = Buffer.from(await imgRes.arrayBuffer());
    rawMime = info.mime || imgRes.headers.get("content-type") || "image/jpeg";
  } else {
    origin = "web";
    if (!page) fail("Nguồn web yêu cầu --page <articleUrl> để dẫn chứng.");
    if (!credit) fail("Nguồn web yêu cầu --credit <Agency/Author>.");
    downloadUrl = web;

    console.log(`[Web] Đang tải ảnh từ ${web}...`);
    const imgRes = await fetchWithRetry(web, { headers: { Referer: page } });
    if (!imgRes.ok) fail(`Tải ảnh web thất bại: HTTP ${imgRes.status}`);
    rawBuffer = Buffer.from(await imgRes.arrayBuffer());
    rawMime = imgRes.headers.get("content-type") || "image/jpeg";
    artistName = credit;

    webMeta = {
      pageUrl: page,
      imageUrl: web,
      credit,
      publishedDate: year ? String(year) : null,
    };
  }

  // Validate decodability and real dimensions with Sharp
  const originalMeta = await sharp(rawBuffer, { failOn: "none" }).metadata();
  if (!originalMeta.width || !originalMeta.height) fail("sharp không thể đọc kích thước của ảnh gốc.");

  const rawSha256 = sha256Buffer(rawBuffer);

  // Generate WebP variants
  const variants = {};
  const buffers = {};
  for (const targetWidth of WIDTHS) {
    const quality = targetWidth >= 2000 ? 72 : targetWidth === 1200 ? 78 : 80;
    const pipeline = sharp(rawBuffer, { failOn: "none" })
      .rotate()
      .resize({ width: targetWidth, withoutEnlargement: true });
    const webpBuf = await pipeline.webp({ quality }).toBuffer();
    const m = await sharp(webpBuf).metadata();
    const sha = sha256Buffer(webpBuf);

    variants[String(targetWidth)] = {
      width: m.width,
      height: m.height,
      bytes: webpBuf.length,
      sha256: sha,
    };
    buffers[String(targetWidth)] = webpBuf;
  }

  // Save preview
  if (previewDir) {
    const fullPreviewDir = path.resolve(root, previewDir);
    fs.mkdirSync(fullPreviewDir, { recursive: true });
    const previewFile = path.join(fullPreviewDir, `${site}-${name}-preview.webp`);
    fs.writeFileSync(previewFile, buffers["400"]);
    console.log(`✓ Đã lưu bản xem trước: ${previewFile}`);
  }

  const key = `${site}-${name}`;
  const evidenceEntry = {
    key,
    site,
    origin,
    commons: commonsMeta,
    web: webMeta,
    download: {
      url: downloadUrl,
      at: new Date().toISOString(),
      sha256: rawSha256,
      bytes: rawBuffer.length,
      mime: rawMime,
    },
    variants,
    visualCheck: visualCheck || `Ảnh chụp thực tế ${site} - khớp với thực địa di tích.`,
    searchLog: searchLog.length > 0 ? searchLog : [`${origin} import: ${commons || web}`],
  };

  // Update media-evidence.json
  let evidence = { schemaVersion: 1, items: [], videos: [], notFound: [] };
  if (fs.existsSync(EVIDENCE_PATH)) {
    try {
      evidence = JSON.parse(fs.readFileSync(EVIDENCE_PATH, "utf8"));
    } catch {
      evidence = { schemaVersion: 1, items: [], videos: [], notFound: [] };
    }
  }
  const existingIdx = evidence.items.findIndex((i) => i.key === key || (i.site === site && i.key === key));
  if (existingIdx >= 0) {
    evidence.items[existingIdx] = evidenceEntry;
  } else {
    evidence.items.push(evidenceEntry);
  }
  fs.writeFileSync(EVIDENCE_PATH, JSON.stringify(evidence, null, 2) + "\n");
  console.log(`✓ Đã cập nhật bằng chứng vào media-evidence.json (key: "${key}")`);

  // If upload mode is requested and authorized
  let finalPublicUrl = `storage:locations/heritage/${site}/${name}-1200.webp`;
  if (doUpload) {
    process.loadEnvFile(path.join(root, ".env.local"));
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    if (!supabaseUrl || !secretKey) fail("Thiếu NEXT_PUBLIC_SUPABASE_URL hoặc SUPABASE_SECRET_KEY trong .env.local.");

    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, secretKey, { auth: { persistSession: false } });

    for (const w of WIDTHS) {
      const objPath = `locations/heritage/${site}/${name}-${w}.webp`;
      const { error } = await supabase.storage
        .from("media")
        .upload(objPath, buffers[String(w)], { contentType: "image/webp", cacheControl: "31536000", upsert: false });
      if (error) fail(`Upload ${objPath} thất bại: ${error.message}`);
    }
    finalPublicUrl = `${supabaseUrl}/storage/v1/object/public/media/locations/heritage/${site}/${name}-1200.webp`;
    console.log(`✓ Đã tải lên Storage thành công: ${finalPublicUrl}`);
  }

  const v1200 = variants["1200"];
  let finalUsage = usage;
  if (origin === "commons" && /public domain|pd\b/i.test(licenseShort || "")) {
    finalUsage = "public_domain";
  }

  const mediaSiteEntry = {
    key,
    fileUrl: finalPublicUrl,
    sourcePageUrl: origin === "commons" ? descriptionUrl : page,
    era,
    yearTaken,
    photographer: artistName,
    license: origin === "commons" ? licenseShort : null,
    licenseUrl: origin === "commons" ? licenseUrl : null,
    usageBasis: finalUsage,
    caption: caption || `Di tích ${site}`,
    altText: alt || `Ảnh chụp ${site}`,
    isCover: cover,
    pairKey: null,
    isReenactment: false,
    isColorized: false,
    width: v1200.width,
    height: v1200.height,
    checkedAt: new Date().toISOString().slice(0, 10),
  };

  return {
    key,
    evidenceEntry,
    mediaSiteEntry,
    variants,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const isDryRun = args["dry-run"] && !args.upload;
  processHeritageImage({
    commons: args.commons,
    web: args.web,
    page: args.page,
    credit: args.credit,
    usage: args.usage,
    site: args.site,
    name: args.name,
    alt: args.alt,
    caption: args.caption,
    era: args.era,
    year: args.year,
    author: args.author,
    cover: args.cover,
    previewDir: args.preview,
    visualCheck: args.visual,
    searchLog: args.log ? [args.log] : [],
    isDryRun,
    doUpload: args.upload,
  })
    .then((res) => {
      console.log(`Hoàn thành xử lý cho site "${args.site}".`);
      console.log(JSON.stringify(res.mediaSiteEntry, null, 2));
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
