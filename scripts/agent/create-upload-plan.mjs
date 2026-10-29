import fs from "node:fs";
import path from "node:path";

// Read the specs from Batch A, B, C, D runners
async function main() {
  const fileA = fs.readFileSync("scripts/agent/run-batch-a.mjs", "utf8");
  const fileB = fs.readFileSync("scripts/agent/run-batch-b.mjs", "utf8");
  const fileC = fs.readFileSync("scripts/agent/run-batch-c.mjs", "utf8");
  const fileD = fs.readFileSync("scripts/agent/run-batch-d.mjs", "utf8");

  // We can also extract directly from media-evidence.json and sites.json!
  const evidence = JSON.parse(fs.readFileSync("supabase/content/heritage-sites/v1/media-evidence.json", "utf8"));
  const sitesData = JSON.parse(fs.readFileSync("supabase/content/heritage-sites/v1/sites.json", "utf8"));

  console.log("Total evidence items:", evidence.items.length);
  console.log("Total accepted sites:", sitesData.sites.filter(s => s.decision === "accepted").length);

  const plan = [];
  for (const site of sitesData.sites.filter(s => s.decision === "accepted")) {
    const m = site.media[0];
    const ev = evidence.items.find(i => i.key === m.key || (i.site === site.key && i.key === m.key));
    if (!ev) {
      console.error("Missing evidence for site:", site.key, m.key);
      process.exit(1);
    }
    const name = m.key.startsWith(site.key + "-") ? m.key.slice(site.key.length + 1) : m.key;
    plan.push({
      site: site.key,
      name,
      origin: ev.origin,
      commons: ev.commons?.title || null,
      web: ev.web?.imageUrl || ev.download?.url || null,
      page: ev.web?.pageUrl || ev.commons?.descriptionurl || m.sourcePageUrl,
      credit: m.photographer,
      usage: m.usageBasis,
      caption: m.caption,
      alt: m.altText,
      era: m.era,
      year: m.yearTaken,
      visual: ev.visualCheck,
    });
  }

  console.log("Generated upload plan with", plan.length, "sites");
  fs.writeFileSync("supabase/content/heritage-sites/v1/upload-plan.json", JSON.stringify(plan, null, 2) + "\n");
  console.log("✓ Saved supabase/content/heritage-sites/v1/upload-plan.json");
}

main().catch(console.error);
