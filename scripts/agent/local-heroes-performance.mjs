// Measures browser-fetched production scripts; not a build-directory inventory.
import { spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import os from "node:os";
import net from "node:net";
import { chromium } from "@playwright/test";
import { localHeroesEnvironment } from "./local-heroes-e2e.mjs";
import { inspectScene } from "../../tests/e2e/refinement-evidence.ts";
for (const port of [3114, 54329]) await new Promise((resolve, reject) => {
  const probe = net.createServer(); probe.once("error", reject); probe.listen(port, "127.0.0.1", () => probe.close(resolve));
});
const mode = process.argv[2];
if (!["baseline", "final"].includes(mode)) throw new Error("Use baseline or final.");
const server = spawn(process.execPath, ["tests/e2e/local-heroes-catalog-server.mjs"], { env: { ...process.env, ...localHeroesEnvironment }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Isolated app startup timed out")), 30000);
    server.stdout.on("data", (b) => { if (String(b).includes("Ready in")) { clearTimeout(timer); resolve(); } });
    server.once("exit", () => { clearTimeout(timer); reject(new Error("Isolated server exited")); });
  });
  browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");
  const thumbnails = [];
  await page.route("**/_next/image?**", (route) => route.fulfill({ contentType: "image/svg+xml", body: thumbnail }));
  page.on("response", (response) => {
    if (new URL(response.url()).pathname === "/_next/image") thumbnails.push({ requestedWidth: Number(new URL(response.url()).searchParams.get("w")), transferredBytes: thumbnail.length, fixture: true });
  });
  await page.addInitScript(() => { localStorage.setItem("ls12:da-xem-huong-dan", "1"); sessionStorage.setItem("ls12:globe-intro-seen", "1"); });
  const scripts = new Map(), jobs = [], requests = [], errors = [];
  page.on("request", (r) => requests.push(new URL(r.url()).pathname));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("response", (r) => { if (r.request().resourceType() === "script" && !scripts.has(r.url())) {
    scripts.set(r.url(), null); jobs.push(r.body().then((body) => scripts.set(r.url(), { url: new URL(r.url()).pathname, decodedBytes: body.length, gzipBytes: gzipSync(body).length, contentEncoding: r.headers()["content-encoding"] ?? null })));
  } });
  await page.goto("http://127.0.0.1:3114/", { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="globe-map"][data-ready="true"]', { timeout: 30000 });
  await page.waitForTimeout(1600);
  await Promise.all(jobs);
  const runtime = await page.evaluate(() => {
    const canvas = document.querySelector("canvas"); const gl = canvas?.getContext("webgl2");
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    return { dpr: devicePixelRatio, userAgent: navigator.userAgent, hardwareConcurrency: navigator.hardwareConcurrency,
      renderer: gl && ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unavailable",
      scriptTransfers: performance.getEntriesByType("resource").filter((r) => r.name.includes("/_next/") && r.name.split("?")[0].endsWith(".js")).map((r) => ({ path: new URL(r.name).pathname, encodedBodySize: r.encodedBodySize, transferSize: r.transferSize })),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth };
  });
  const initial = [...scripts.values()].filter(Boolean);
  const evidence = { mode, recordedAt: new Date().toISOString(), buildId: readFileSync(".next-local-heroes/BUILD_ID", "utf8").trim(), fixtureHash: createHash("sha256").update(readFileSync("tests/e2e/fixtures/local-heroes/catalog.mjs")).digest("hex"),
    hardware: { platform: os.platform(), cpu: os.cpus()[0]?.model, memoryGiB: Math.round(os.totalmem() / 1073741824), browserVersion: browser.version(), viewport: { width: 1440, height: 900 } }, runtime,
    initialScripts: initial, initialGzipBytes: initial.reduce((n, s) => n + s.gzipBytes, 0), defaultRequests: requests, errors };
  if (mode === "final") {
    const baseline = JSON.parse(readFileSync("output/playwright/local-heroes/performance-baseline.json", "utf8"));
    evidence.incrementalGzipBytes = evidence.initialGzipBytes - baseline.initialGzipBytes;
    evidence.javascriptBudgetPassed = evidence.incrementalGzipBytes <= 35840;
    const defaultRequests = [...requests];
    await inspectScene(page, { type: "capture-start" }); await page.waitForTimeout(600);
    evidence.defaultIdleCapture = (await inspectScene(page, { type: "capture-end" })).capture;
    const beforeOpen = requests.length;
    await page.getByRole("link", { name: "Nhân vật theo địa phương", exact: true }).click();
    await page.waitForSelector('[data-testid="local-hero-row"]'); await page.waitForLoadState("networkidle");
    const scroller = page.locator(".local-heroes-results"); await scroller.evaluate((node) => { node.scrollTop = node.scrollHeight; });
    await page.waitForLoadState("networkidle"); await page.waitForTimeout(300); await Promise.all(jobs);
    evidence.openModeRequests = requests.slice(beforeOpen);
    evidence.defaultRequests = defaultRequests;
    evidence.thumbnails = thumbnails;
    evidence.openRowCount = await page.getByTestId("local-hero-row").count();
    evidence.openGeometryRequests = evidence.openModeRequests.filter((p) => p.startsWith("/maps/"));
    evidence.defaultPeopleRequests = defaultRequests.filter((p) => p.includes("local-heroes") || p === "/_next/image");
    evidence.openPageRequests = evidence.openModeRequests.filter((p) => p === "/api/local-heroes").length;
    await inspectScene(page, { type: "capture-start" }); await page.waitForTimeout(600);
    const settled = await inspectScene(page, { type: "capture-end" }); evidence.openIdleCapture = settled.capture; evidence.sceneStats = settled.stats;
    evidence.openScripts = [...scripts.values()].filter(Boolean);
    evidence.openIncrementalGzipBytes = evidence.openScripts.reduce((n, s) => n + s.gzipBytes, 0) - baseline.initialGzipBytes;
    evidence.budgetsPassed = evidence.javascriptBudgetPassed && evidence.openIncrementalGzipBytes <= 35840 && evidence.defaultPeopleRequests.length === 0
      && evidence.openPageRequests === 1 && evidence.openRowCount === 12 && evidence.openGeometryRequests.length === 0
      && thumbnails.length > 0 && thumbnails.every((i) => i.requestedWidth <= 480 && i.transferredBytes <= 102400)
      && evidence.defaultIdleCapture.intervalsMs.length === 0 && evidence.openIdleCapture.intervalsMs.length === 0;
  }
  mkdirSync("output/playwright/local-heroes", { recursive: true });
  writeFileSync(`output/playwright/local-heroes/performance-${mode}.json`, JSON.stringify(evidence, null, 2) + "\n");
  console.log(JSON.stringify({ mode, buildId: evidence.buildId, scripts: initial.length, gzipBytes: evidence.initialGzipBytes, incrementalGzipBytes: evidence.incrementalGzipBytes, budgetsPassed: evidence.budgetsPassed, renderer: runtime.renderer, errors }));
} finally {
  await browser?.close();
  if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
  else server.kill("SIGTERM");
}
