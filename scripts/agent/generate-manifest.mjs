import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const base = path.join(root, "supabase/content/heritage-sites/v1");
const files = ["localities.json", "sources.json", "sites.json"];
const fileHashes = {};

for (const f of files) {
  const content = fs.readFileSync(path.join(base, f), "utf8");
  fileHashes[f] = crypto.createHash("sha256").update(content, "utf8").digest("hex");
}

const sites = JSON.parse(fs.readFileSync(path.join(base, "sites.json"), "utf8")).sites;
const sources = JSON.parse(fs.readFileSync(path.join(base, "sources.json"), "utf8")).sources;

const manifest = {
  schemaVersion: 1,
  framework: "VN-34-2025",
  createdAt: "2026-10-27T21:00:00Z",
  counts: {
    totalSites: sites.length,
    grade12Sites: sites.filter((s) => s.tier === "grade12").length,
    extendedSites: sites.filter((s) => s.tier === "extended").length,
    acceptedSites: sites.filter((s) => s.decision === "accepted").length,
    heldSites: sites.filter((s) => s.decision === "held").length,
    rejectedSites: sites.filter((s) => s.decision === "rejected").length,
    totalSources: sources.length
  },
  files: fileHashes
};

fs.writeFileSync(path.join(base, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log("manifest.json generated successfully:");
console.log(JSON.stringify(manifest, null, 2));
