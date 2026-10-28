#!/usr/bin/env node
/**
 * scripts/content/heritage-commons-search.mjs
 *
 * Searches Wikimedia Commons API (namespace 6: File) for Vietnamese heritage sites.
 * Returns only genuine matching files with verified licensing (PD, CC0, CC BY, CC BY-SA, GODL).
 */

const USER_AGENT = "LichSuVietNam12/1.0 (do an giao duc; heritage search; https://github.com/tronghp160/WEB_LICH-SU_12)";

export async function searchCommons(terms, limit = 15) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: String(limit),
    gsrsearch: terms,
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "640",
  }).toString();

  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`Commons search error: HTTP ${res.status}`);
  const data = await res.json();
  const pages = data?.query?.pages || [];

  const plain = (html) =>
    (html ?? "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;/g, "'")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const allowedLicense = /^(public domain|pd\b|cc0|cc[ -]by(-sa)?[ -]\d|godl\b|attribution$)/i;

  const results = [];
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (!info) continue;
    const ext = info.extmetadata || {};
    const license = plain(ext.LicenseShortName?.value);
    const isAllowed = license && allowedLicense.test(license) && !/\b(nc|nd)\b/i.test(license) && !/fair use/i.test(license);
    const artist = plain(ext.Artist?.value).replace(/^(Unknown author\s*)+$/i, "").trim();
    const dateText = plain(ext.DateTimeOriginal?.value);
    const desc = plain(ext.ImageDescription?.value);

    results.push({
      title: page.title,
      width: info.width,
      height: info.height,
      mime: info.mime,
      url: info.url,
      thumbUrl: info.thumburl,
      descriptionUrl: info.descriptionurl,
      license,
      isAllowed,
      artist,
      dateText,
      description: desc.slice(0, 200),
    });
  }

  return results;
}

if (process.argv[1] && process.argv[1].endsWith("heritage-commons-search.mjs")) {
  const query = process.argv.slice(2).join(" ");
  if (!query) {
    console.error("Usage: node heritage-commons-search.mjs <search terms>");
    process.exit(1);
  }
  console.log(`Searching Commons for: "${query}"...`);
  searchCommons(query).then((items) => {
    console.log(`Found ${items.length} items:`);
    items.forEach((item, i) => {
      console.log(`\n[${i + 1}] ${item.title} (${item.width}x${item.height}) [${item.license || "NO LICENSE"}] ${item.isAllowed ? "✓ ALLOWED" : "✗ REJECT"}`);
      console.log(`    Artist: ${item.artist || "(unknown)"}`);
      console.log(`    URL: ${item.url}`);
      console.log(`    Desc: ${item.description}`);
    });
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
