import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const v1Dir = path.join(root, "supabase/content/heritage-sites/v1");
const fixtureBase = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "valid-package");

fs.mkdirSync(fixtureBase, { recursive: true });

// Copy localities
fs.copyFileSync(path.join(v1Dir, "localities.json"), path.join(fixtureBase, "localities.json"));
// Copy sources
fs.copyFileSync(path.join(v1Dir, "sources.json"), path.join(fixtureBase, "sources.json"));

// Read v1 sites and sanitize them into valid mock sites
const v1Sites = JSON.parse(fs.readFileSync(path.join(v1Dir, "sites.json"), "utf8")).sites;

const evidenceItems = [];
const validSites = v1Sites.map((site, idx) => {
  const s = JSON.parse(JSON.stringify(site));
  s.videos = []; // no videos in valid mock

  // Unique dimensions and realistic photographer
  const pWidth = 1200;
  const pHeight = 800 + (idx % 50); // diverse dimensions to avoid fabrication heuristic (>3 sites)
  const photographerName = `Photographer ${idx + 1}`;

  s.media = [
    {
      key: `${s.key}-cover`,
      fileUrl: `https://ueolfjujjybutyuyfxha.supabase.co/storage/v1/object/public/media/locations/heritage/${s.key}/cover-1200.webp`,
      sourcePageUrl: `https://commons.wikimedia.org/wiki/File:${s.key}-cover.jpg`,
      era: "today",
      yearTaken: 2020,
      photographer: photographerName,
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      usageBasis: "open_license",
      caption: `Di tích lịch sử ${s.name} tại địa phương`,
      altText: `Hình ảnh toàn cảnh di tích lịch sử ${s.name}`,
      isCover: true,
      pairKey: null,
      isReenactment: false,
      isColorized: false,
      width: pWidth,
      height: pHeight,
      checkedAt: "2026-10-28",
    },
  ];

  evidenceItems.push({
    key: `${s.key}-cover`,
    site: s.key,
    origin: "commons",
    commons: {
      title: `File:${s.key}-cover.jpg`,
      descriptionurl: `https://commons.wikimedia.org/wiki/File:${s.key}-cover.jpg`,
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      artist: photographerName,
      credit: photographerName,
      originalWidth: 2400,
      originalHeight: pHeight * 2,
    },
    web: null,
    download: {
      url: `https://upload.wikimedia.org/wikipedia/commons/test/${s.key}-cover.jpg`,
      at: "2026-10-28T00:00:00.000Z",
      sha256: crypto.createHash("sha256").update(`${s.key}-download`).digest("hex"),
      bytes: 150000,
      mime: "image/jpeg",
    },
    variants: {
      "400": {
        width: 400,
        height: Math.round(pHeight / 3),
        bytes: 15000,
        sha256: crypto.createHash("sha256").update(`${s.key}-400`).digest("hex"),
      },
      "1200": {
        width: pWidth,
        height: pHeight,
        bytes: 45000,
        sha256: crypto.createHash("sha256").update(`${s.key}-1200`).digest("hex"),
      },
    },
    visualCheck: `Ảnh chụp thực tế ${s.key}`,
    searchLog: [`Imported ${s.key}`],
  });

  return s;
});

const sitesDoc = {
  schemaVersion: 1,
  framework: "VN-34-2025",
  sites: validSites,
};
fs.writeFileSync(path.join(fixtureBase, "sites.json"), JSON.stringify(sitesDoc, null, 2) + "\n");

const evidenceDoc = {
  schemaVersion: 1,
  items: evidenceItems,
  videos: [],
  notFound: [],
};
fs.writeFileSync(path.join(fixtureBase, "media-evidence.json"), JSON.stringify(evidenceDoc, null, 2) + "\n");

// Generate manifest
const manifest = {
  schemaVersion: 1,
  framework: "VN-34-2025",
  files: {},
};
for (const file of ["localities.json", "sources.json", "sites.json"]) {
  const content = fs.readFileSync(path.join(fixtureBase, file), "utf8");
  manifest.files[file] = crypto.createHash("sha256").update(content, "utf8").digest("hex");
}
fs.writeFileSync(path.join(fixtureBase, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

console.log("Valid fixture generated successfully at:", fixtureBase);
