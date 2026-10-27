import http from "node:http";
import { spawn } from "node:child_process";
import { appendFileSync, mkdirSync, writeFileSync } from "node:fs";
import { events, people, localities, pageResult, profileResult } from "./fixtures/local-heroes/catalog.mjs";
import { localHeroesEnvironment } from "../../scripts/agent/local-heroes-e2e.mjs";
if (process.env.LOCAL_HEROES_E2E !== "1" || process.env.E2E_BASE_URL) throw new Error("Explicit isolated fixture only.");
mkdirSync("output/playwright/local-heroes", { recursive: true });
const log = "output/playwright/local-heroes/fixture-requests.ndjson";
writeFileSync(log, "");
// Opt-in legacy navigation fixtures leave the performance/default catalog unchanged.
const publicEvents = process.env.LOCAL_HEROES_LEGACY_FIXTURE === "1" ? [...events,
  ...Array.from({ length: 12 }, (_, i) => ({ ...events[0], id: `30000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`, slug: `synthetic-year-${1980 + i}`, title: `Synthetic navigation ${1980 + i}`, start_year: 1980 + i, date_text: String(1980 + i) })),
  { ...events[0], id: "30000000-0000-4000-8000-000000000020", slug: "synthetic-interval", title: "Synthetic interval 2007–2010", start_year: 2007, end_year: 2010, date_text: "2007–2010", date_precision: "period" },
  { ...events[0], id: "30000000-0000-4000-8000-000000000021", slug: "synthetic-same-year", title: "Synthetic second event 2009", start_year: 2009, date_text: "2009" },
] : events;
const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://127.0.0.1:54329");
  res.setHeader("Content-Type", "application/json"); res.setHeader("Cache-Control", "no-store");
  const finish = (status, data) => { res.writeHead(status); res.end(req.method === "HEAD" ? undefined : JSON.stringify(data)); };
  if (!["GET", "HEAD"].includes(req.method)) return finish(405, { message: "Read-only fixture" });
  appendFileSync(log, JSON.stringify({ method: req.method, path: u.pathname, query: Object.fromEntries(u.searchParams) }) + "\n");
  if (u.pathname === "/rest/v1/rpc/local_hero_page") {
    const query = u.searchParams.get("p_query") || "";
    if (query === "fixture-error") return finish(503, { message: "Synthetic outage" });
    const code = localities.find((l) => l.code === u.searchParams.get("p_locality_code"))?.code ?? null;
    return finish(200, pageResult(code, query, Number(u.searchParams.get("p_page")) || 1));
  }
  if (u.pathname === "/rest/v1/rpc/local_hero_profile") return u.searchParams.get("p_slug") === "synthetic-profile-error" ? finish(503, { message: "PRIVATE_FAILURE_SENTINEL" }) : finish(200, profileResult(u.searchParams.get("p_slug")));
  if (u.pathname === "/rest/v1/historical_events") {
    if (u.searchParams.get("workflow_status") !== "eq.published") return finish(403, { message: "Explicit public filter required" });
    const rows = publicEvents.filter((e) => !u.searchParams.has("slug") || u.searchParams.get("slug") === `eq.${e.slug}`);
    res.setHeader("Content-Range", `0-${Math.max(0, rows.length - 1)}/${rows.length}`);
    return finish(200, String(req.headers.accept).includes("vnd.pgrst.object") ? rows[0] ?? null : rows);
  }
  if (u.pathname === "/rest/v1/historical_figures") {
    if (u.searchParams.get("workflow_status") !== "eq.published") return finish(403, { message: "Explicit public filter required" });
    const slug = u.searchParams.get("slug")?.replace(/^eq\./u, "");
    const p = people.find((p) => p.slug === slug) ?? (["synthetic-ineligible", "synthetic-profile-error"].includes(slug) ? { ...people[0], slug, name: "PRIVATE_INELIGIBLE_SENTINEL" } : null);
    const data = p ? { id: p.id, slug: p.slug, name: p.name, birth_year: null, death_year: null, biography: null, other_names: null, portrait_url: null, is_local_hero: true, workflow_status: "published", media_assets: [], event_figures: [], contribution_summary: p.contributionSummary, catalog_aliases: p.aliases }
      : slug === "synthetic-legacy" ? { id: "legacy", slug, name: "Synthetic legacy person", workflow_status: "published", is_local_hero: false, biography: "Synthetic legacy biography", birth_year: null, death_year: null, other_names: null, portrait_url: null, media_assets: [], event_figures: [] } : null;
    return finish(200, data);
  }
  return finish(404, { message: "Unsupported fixture route" });
});
server.listen(54329, "127.0.0.1", () => {
  const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3114"], { env: { ...process.env, ...localHeroesEnvironment }, stdio: "inherit", windowsHide: true });
  const stop = () => { app.kill(); server.close(); };
  process.on("SIGTERM", stop); process.on("SIGINT", stop); app.on("exit", (code) => { server.close(); process.exitCode = code ?? 1; });
});
