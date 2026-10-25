// Explicit TEST-ONLY PostgREST-shaped network fixture. No real database, keys or writes.
import http from "node:http";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import smoke from "../../scripts/agent/smoke-env.json" with { type: "json" };

const rows = Array.from({ length: 12 }, (_, i) => ({ slug: `synthetic-year-${1980 + i}`, title: `Synthetic navigation ${1980 + i}`, start_year: 1980 + i, end_year: null }));
rows.push({ slug: "synthetic-interval", title: "Synthetic interval 2007–2010", start_year: 2007, end_year: 2010 },
  { slug: "synthetic-same-year", title: "Synthetic second event 2009", start_year: 2009, end_year: null });
try {
  const reviewed = JSON.parse(readFileSync("supabase/content/timeline-2026-10-25/review-package.json", "utf8"));
  rows.push(...reviewed.events.filter(event => event.evidence === "verified").map(event => ({ ...event, start_year: event.startYear, end_year: event.endYear, date_text: event.dateText, date_precision: event.datePrecision,
    event_sources: event.sources.map(ref => {
      const source = reviewed.sources.find(item => item.id === ref.id);
      return { source_note: `${ref.locator} — ${ref.scope}`, confidence_note: "Test-only publication of a local draft artifact; no human approval implied.",
        sources: { id: source.id, title: source.title, citation: `${source.institution}; accessed ${source.accessedAt}`, url: source.url, source_type: "official" } };
    }) })));
} catch (error) { if (error.code !== "ENOENT") throw error; }
const topic = { name: "Test-only curated catalog", slug: "test-catalog" };
rows.push({ slug: "synthetic-unpublished-draft", title: "Unpublished fixture sentinel", start_year: 2020, end_year: null, workflow_status: "draft" });
const events = rows.map((row, index) => ({ id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`, summary: "Synthetic UI fixture; not database publication or historical certification.", content: "## Nguồn\n\nTest-only network fixture.",
  date_text: String(row.start_year), date_precision: row.end_year ? "period" : "year", is_featured: false, workflow_status: "published",
  curriculum_topics: topic, media_assets: [], event_figures: [], event_topics: [], event_locations: [],
  event_sources: [{ source_note: "Test fixture only", confidence_note: null, sources: { id: "fixture-source", title: "Test source", citation: "Synthetic provenance for UI testing only", url: "https://www.wto.org/english/thewto_e/acc_e/a1_vietnam_e.htm", source_type: "website" } }], ...row }));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://127.0.0.1:54321");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3100");
  if (req.method !== "GET") { res.writeHead(405); res.end(JSON.stringify({ message: "Read-only fixture" })); return; }
  let data = [];
  if (url.pathname === "/rest/v1/historical_events") {
    if (url.searchParams.get("workflow_status") !== "eq.published") { res.writeHead(403); res.end(JSON.stringify({ message: "Fixture requires explicit published filter" })); return; }
    data = events.filter(event => event.workflow_status === "published" && (!url.searchParams.has("slug") || url.searchParams.get("slug") === `eq.${event.slug}`));
    if (url.searchParams.has("is_featured")) data = data.filter(event => event.is_featured);
    data.sort((a, b) => a.start_year - b.start_year || a.slug.localeCompare(b.slug));
  }
  res.setHeader("Content-Range", `0-${Math.max(0, data.length - 1)}/${data.length}`);
  const singular = String(req.headers.accept).includes("vnd.pgrst.object");
  res.end(JSON.stringify(singular ? data[0] ?? null : data));
});
server.listen(54321, "127.0.0.1", () => {
  console.log(`TEST-ONLY catalog network fixture: ${events.filter(event => event.workflow_status === "published").length} visible rows, one excluded draft sentinel; no database or RLS backing.`);
  if (process.env.JOURNEY_CATALOG_ONLY === "1") {
    process.on("SIGTERM", () => server.close()); process.on("SIGINT", () => server.close());
    return;
  }
  const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", process.env.JOURNEY_UI_DEV === "1" ? "dev" : "start", "-p", "3100"], { env: { ...process.env, ...smoke }, stdio: "inherit", windowsHide: true });
  const stop = () => { app.kill(); server.close(); };
  process.on("SIGTERM", stop); process.on("SIGINT", stop);
  app.on("exit", code => { server.close(); process.exitCode = code ?? 0; });
});
