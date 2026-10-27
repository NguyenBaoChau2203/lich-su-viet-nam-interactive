// Explicit disposable-local acceptance of the reviewed national graph. No remote override or service-role client.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { localAdminEnvironment } from "./local-heroes-admin-e2e.mjs";
import { runTool } from "./runtime.mjs";
import { validateTargetDescriptor } from "../../tests/rls/local-heroes-concurrency.mjs";
import { createReleaseSnapshot, renderImportSetup, renderLocalPromotion } from "../content/prepare-local-heroes-release.mjs";

const args = process.argv.slice(2);
assert(args.length === 2 && args[0] === "--target", "Use --target <disposable-descriptor.json>.");
const target = validateTargetDescriptor(JSON.parse(fs.readFileSync(args[1], "utf8")));
assert.equal(target.container, "supabase_db_local-heroes-phase02-disposable");
const env = localAdminEnvironment(); // Verifies Docker transport, descriptor, both labels, CLI config, API and ports.
const output = "output/playwright/local-heroes-national";
fs.mkdirSync(output, { recursive: true });
const psql = (input) => {
  const r = spawnSync("docker", ["exec", "-i", target.container, "psql", "-U", "postgres", "-d", "postgres", "-X", "-tA", "-v", "ON_ERROR_STOP=1"], { input, encoding: "utf8", timeout: 60000, maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  if (r.status !== 0) throw Error(r.stderr?.match(/ERROR:.*$/mu)?.[0] ?? "Disposable SQL process failed");
  return r.stdout.trim();
};
const counts = () => JSON.parse(psql("select json_build_object('auth',(select count(*) from auth.users),'people',(select count(*) from public.historical_figures),'sources',(select count(*) from public.sources),'registry',(select count(*) from public.history_localities));"));
assert.deepEqual(counts(), { auth: 0, people: 0, sources: 0, registry: 34 }, "Requires empty dedicated disposable DB");
assert(fs.existsSync(".next-local-heroes-admin/BUILD_ID"), "Build the guarded local-admin app first");
const snapshot = createReleaseSnapshot();
assert.equal(snapshot.reviewCompletePeople, 35); assert.equal(snapshot.representedLocalities, 34);
const localities = JSON.parse(fs.readFileSync("supabase/content/local-heroes/national-v1/localities.json")).records;
const seed = "BEGIN;\nSET LOCAL app.local_heroes_disposable='local-heroes-phase02-disposable';\n" + renderImportSetup(snapshot) + "SELECT pg_temp.lh_import_drafts();\n" + renderLocalPromotion(snapshot) + "COMMIT;\n";
const diagnostics = [], results = [], viewports = [{ width: 1280, height: 720 }, { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }];
let seeded = false, server, browser, failure = null, cleanupRestoredBaseline = false;
const base = "http://127.0.0.1:3115";
try {
  psql(seed); seeded = true;
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3115"], { env, cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(Error("Guarded app startup timed out")), 30000);
    server.stdout.on("data", (b) => { if (String(b).includes("Ready in")) { clearTimeout(timer); resolve(); } });
    server.stderr.on("data", (b) => diagnostics.push({ kind: "server", message: String(b).replace(/https?:\/\/[^\s]+/gu, "[URL]").slice(0, 500) }));
    server.once("exit", () => { clearTimeout(timer); reject(Error("Guarded app exited")); });
  });
  browser = await chromium.launch({ channel: "msedge", headless: true });
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    const page = await context.newPage();
    page.on("pageerror", (e) => diagnostics.push({ kind: "pageerror", viewport, message: e.message }));
    page.on("console", (m) => { if (["error", "warning"].includes(m.type())) diagnostics.push({ kind: m.type(), viewport, message: m.text().replace(/https?:\/\/[^\s"'<>]+/gu, (v) => { try { return new URL(v).pathname; } catch { return "[URL]"; } }).slice(0, 600) }); });
    page.on("response", (r) => { if (r.status() >= 400) diagnostics.push({ kind: "http", viewport, path: new URL(r.url()).pathname, status: r.status() }); });
    await page.addInitScript(() => { localStorage.setItem("ls12:da-xem-huong-dan", "1"); sessionStorage.setItem("ls12:globe-intro-seen", "1"); });
    await page.goto(base + "/", { waitUntil: "networkidle" });
    const entry = page.getByRole("link", { name: "Nhân vật theo địa phương", exact: true });
    await entry.focus(); await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { name: "Nhân vật cách mạng theo địa phương", exact: true })).toBeFocused();
    const rows = page.getByTestId("local-hero-row");
    await expect(rows).toHaveCount(12); await expect(page.locator(".local-heroes-count")).toContainText("35 nhân vật");
    const listIds = new Set(await rows.evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-person-id"))));
    for (const n of [2, 3]) { await page.getByRole("link", { name: `Trang nhân vật ${n}`, exact: true }).click(); await expect(rows).toHaveCount(n === 2 ? 12 : 11); for (const id of await rows.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-person-id")))) listIds.add(id); }
    assert.equal(listIds.size, 35);
    const select = page.getByLabel("Địa phương tham chiếu", { exact: true });
    for (const locality of localities) {
      const [response] = await Promise.all([page.waitForResponse((r) => new URL(r.url()).pathname === "/api/local-heroes" && new URL(r.url()).searchParams.get("dia-phuong") === locality.slug), select.selectOption(locality.slug)]);
      assert.equal(response.status(), 200); const { data } = await response.json();
      assert.equal(data.filters.localityCode, locality.code); assert(data.totalPeople > 0);
      await expect(rows).toHaveCount(data.totalPeople); await expect(select).toHaveValue(locality.slug);
    }
    await select.selectOption("");
    const search = page.getByLabel("Tên, bí danh hoặc đóng góp", { exact: true });
    await search.fill("Nong Van Den"); await search.press("Enter"); await expect(rows).toHaveCount(1); await expect(rows.first()).toContainText("Kim Đồng");
    await page.reload(); await expect(rows).toHaveCount(1);
    const detail = rows.first().getByRole("link", { name: /Xem câu chuyện/u });
    const expectedReturn = new URL(await detail.getAttribute("href"), base).searchParams.get("kham-pha");
    await page.screenshot({ path: `${output}/catalog-${viewport.width}x${viewport.height}.png` });
    const catalogAxe = await new AxeBuilder({ page }).include(".home-history-map").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    assert.deepEqual(catalogAxe.violations, []);
    await detail.click(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kim Đồng");
    const citation = page.getByRole("link", { name: /Chú thích nguồn:/iu }).first();
    const citationTarget = await citation.getAttribute("href"); await citation.click(); await expect(page.locator(citationTarget)).toBeVisible();
    await page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true }).click();
    assert.equal(new URL(page.url()).pathname + new URL(page.url()).search, expectedReturn);
    await expect(rows).toHaveCount(1); await page.goBack(); await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kim Đồng"); await page.goForward(); await expect(rows).toHaveCount(1);
    let profiles = 0;
    for (const person of snapshot.people) {
      const story = snapshot.rows.figure_stories.find((s) => s.figure_id === person.id), media = snapshot.rows.media_assets.find((m) => m.figure_id === person.id);
      const response = await page.goto(`${base}/nhan-vat/${person.slug}?kham-pha=${encodeURIComponent('/?noi-dung=nhan-vat')}`, { waitUntil: "networkidle" });
      assert.equal(response.status(), 200); await expect(page.getByRole("heading", { level: 1 })).toHaveText(person.name);
      await expect(page.getByRole("heading", { level: 3, name: story.title, exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "Nguồn tham khảo", exact: true })).toBeVisible();
      const img = page.getByAltText(media.alt_text, { exact: true }).first();
      await img.scrollIntoViewIfNeeded(); await expect(img).toBeVisible();
      await expect.poll(() => img.evaluate((node) => node.complete && node.naturalWidth > 0), { timeout: 20000 }).toBe(true);
      const text = await page.locator("main").innerText();
      assert(text.includes(story.body.split("[[cite:")[0].slice(0, 70))); assert(!text.includes("PRIVATE_"));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
      if (person.slug === "kim-dong") {
        const axe = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        assert.deepEqual(axe.violations, []);
        fs.writeFileSync(`${output}/axe-${viewport.width}.json`, JSON.stringify({ catalog: catalogAxe.violations, detail: axe.violations, passedRules: axe.passes.map((p) => p.id) }, null, 2));
        await page.screenshot({ path: `${output}/detail-${viewport.width}x${viewport.height}.png`, fullPage: true });
      }
      profiles++;
    }
    const staticContext = await browser.newContext({ viewport, javaScriptEnabled: false });
    const staticPage = await staticContext.newPage(); await staticPage.goto(base + "/nhan-vat/kim-dong");
    await expect(staticPage.getByRole("heading", { name: "Câu chuyện lịch sử", exact: true })).toBeVisible();
    await expect(staticPage.getByRole("link", { name: /Chú thích nguồn:/iu }).first()).toBeVisible();
    await staticContext.close();
    results.push({ viewport, actualDatabase: true, mockedRequests: 0, publishedPeople: 35, localitySelections: 34, distinctPaginatedPeople: listIds.size, alias: "Nong Van Den", reloadReturnBackForward: true, profiles, noJsStory: true, wcagAaViolations: 0 });
    await context.close();
  }
  assert.equal(diagnostics.filter((d) => d.kind === "pageerror").length, 0);
} catch (e) { failure = e.message; process.exitCode = 1; }
finally {
  await browser?.close();
  if (server?.pid) { if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true }); else server.kill("SIGTERM"); }
  if (seeded) {
    localAdminEnvironment();
    const reset = runTool("supabase", ["db", "reset", "--local", "--workdir", ".task-reports/local-heroes-phase-02-work/db"], { encoding: "utf8", timeout: 180000, maxBuffer: 8 * 1024 * 1024 });
    fs.writeFileSync(`${output}/cleanup.log`, (reset.stdout ?? "") + (reset.stderr ?? ""));
    if (reset.status === 0) { assert.deepEqual(counts(), { auth: 0, people: 0, sources: 0, registry: 34 }); cleanupRestoredBaseline = true; }
    else { failure = (failure ? failure + "; " : "") + "Disposable cleanup reset failed"; process.exitCode = 1; }
  }
  const evidence = { recordedAt: new Date().toISOString(), snapshotHash: snapshot.snapshotHash, seedSha256: createHash("sha256").update(seed).digest("hex"), target: { project: "local-heroes-phase02-disposable", host: "127.0.0.1" }, buildId: fs.readFileSync(".next-local-heroes-admin/BUILD_ID", "utf8").trim(), browser: browser?.version(), results, diagnostics, failure, cleanupRestoredBaseline, nationalReleaseReady: false };
  fs.writeFileSync(path.join(output, "results.json"), JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify({ snapshotHash: snapshot.snapshotHash, viewportsPassed: results.length, profilesChecked: results.reduce((n, r) => n + r.profiles, 0), failure, cleanupRestoredBaseline }));
}
