/** Serial local-only evidence capture. Run after build/E2E, with no concurrent workload. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { chromium, expect } from "@playwright/test";
import sharp from "sharp";

const base = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3100";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Measurement target must be the owned local server");
const output = path.resolve("output/playwright/explorer-refinement/task-09");
mkdirSync(output, { recursive: true });
const report = {
  startedAt: new Date().toISOString(), target: base, buildId: readFileSync(".next/BUILD_ID", "utf8").trim(),
  device: { platform: os.platform(), release: os.release(), architecture: os.arch(), cpu: os.cpus()[0]?.model,
    logicalCpus: os.cpus().length, memoryGiB: +(os.totalmem() / 2 ** 30).toFixed(2) },
  method: "Installed Edge headless, hardware ANGLE when reported; CSS 1440x900 DPR1; scene's rAF/render capture without gl.finish. Native WebGL bufferData/deleteBuffer and draw methods count actual unique live buffer allocations and submitted draws. Browser-only measurement hooks are absent from production code.",
  limitations: ["No approved province production artifact exists. Synthetic fixture/stress evidence validates renderer capacity only.",
    "Frame intervals measure rendered rAF cadence; renderMs measures CPU submission, not synchronized GPU completion.",
    "UI budget is a conservative entire-chunk envelope including the UI/journey/declustering and scene/province chunks, not a historical build delta."],
};
const browser = await chromium.launch({ channel: process.env.E2E_CHANNEL ?? "msedge", headless: true });
try {
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  const events = [];
  page.on("pageerror", error => events.push({ kind: "pageerror", message: error.message.slice(0, 500) }));
  page.on("console", message => {
    if (["error", "warning"].includes(message.type())) events.push({ kind: message.type(), message: message.text().slice(0, 500) });
  });
  page.on("requestfailed", request => events.push({ kind: "requestfailed", path: new URL(request.url()).pathname, error: request.failure()?.errorText }));
  page.on("response", response => {
    if (response.status() >= 400) events.push({ kind: "http", path: new URL(response.url()).pathname, status: response.status() });
  });
  await page.addInitScript(() => {
    const buffers = new Map();
    let draws = 0, uploads = 0, deletes = 0;
    for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
      const data = prototype.bufferData, remove = prototype.deleteBuffer;
      prototype.bufferData = function (...args) {
        const bound = this.getParameter(args[0] === this.ARRAY_BUFFER ? this.ARRAY_BUFFER_BINDING : this.ELEMENT_ARRAY_BUFFER_BINDING);
        const bytes = typeof args[1] === "number" ? args[1] : args[1]?.byteLength ?? 0;
        const result = Reflect.apply(data, this, args);
        if (bound) buffers.set(bound, bytes);
        uploads++;
        return result;
      };
      prototype.deleteBuffer = function (buffer) { buffers.delete(buffer); deletes++; return Reflect.apply(remove, this, [buffer]); };
      for (const method of ["drawElements", "drawArrays", "drawElementsInstanced", "drawArraysInstanced"]) {
        const original = prototype[method];
        if (typeof original !== "function") continue;
        prototype[method] = function (...args) { draws++; return Reflect.apply(original, this, args); };
      }
    }
    window.__task09Gl = () => ({ draws, uploads, deletes, liveBuffers: buffers.size, bufferBytes: [...buffers.values()].reduce((a, b) => a + b, 0) });
  });
  await page.goto(`${base}/?hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911`);
  await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-country-boundaries", "ready");
  await expect(page.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "unavailable");
  await page.evaluate(async () => {
    const canvas = document.querySelector("canvas.cinematic-globe-canvas");
    let fiber = canvas[Object.keys(canvas).find(key => key.startsWith("__reactFiber"))];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) {
        if (typeof hook.memoizedState?.scene?.beginFrameCapture === "function") {
          window.__task09Scene = hook.memoizedState.scene;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return;
        }
      }
      fiber = fiber.return;
    }
    throw new Error("Actual mounted scene unavailable");
  });
  const snapshot = () => page.evaluate(() => ({ scene: window.__task09Scene.stats(), gl: window.__task09Gl() }));
  report.baseline = await snapshot();
  await page.getByTestId("journey-timeline").getByRole("link", { name: /Pác Bó/ }).click();
  await expect.poll(async () => (await snapshot()).scene.journeyPath?.request?.stopId).toBe("pac-bo-1941");
  await page.waitForTimeout(100);
  report.path = await snapshot();
  await page.evaluate(() => { window.__task09ArrivalView = window.__task09Scene.getView(); });
  report.pathDelta = { drawCalls: report.path.scene.drawCalls - report.baseline.scene.drawCalls,
    bufferBytes: report.path.gl.bufferBytes - report.baseline.gl.bufferBytes };

  const manifest = JSON.parse(readFileSync("docs/audits/sources/2026-10-24-vietnam-province-membership.json", "utf8"));
  const fixture = {
    type: "FeatureCollection", schemaVersion: 1, referenceFramework: "VN-34-2025",
    sourceTimestamp: "2026-10-24T09:54:11Z", sourceSnapshotSha256: "0".repeat(64),
    license: { id: "TEST-ONLY", url: "https://example.invalid/synthetic", attribution: "Synthetic capacity fixture; no boundary claim" },
    units: manifest.units.map(u => ({ code: u.code, name: u.officialName, sourceId: `fixture:${u.osmRelationId}`, sourceRevision: String(u.observedRelationVersion) })),
    features: [{ type: "Feature", id: "synthetic-ceiling", properties: { boundaryKind: "province-interior", provinceCodes: ["01", "24"], sourceEdgeIds: ["fixture-only"] },
      geometry: { type: "LineString", coordinates: Array.from({ length: 50_001 }, (_, i) => [105.84, 20.98 + i / 500_000]) } }],
  };
  await page.evaluate(async fixture => {
    window.__task09Scene.setProvinceBoundaries(fixture);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }, fixture);
  report.syntheticCeiling = await snapshot();
  report.syntheticCombinedDelta = { drawCalls: report.syntheticCeiling.scene.drawCalls - report.baseline.scene.drawCalls,
    bufferBytes: report.syntheticCeiling.gl.bufferBytes - report.baseline.gl.bufferBytes };
  assert(report.syntheticCombinedDelta.drawCalls <= 3);
  assert(report.syntheticCombinedDelta.bufferBytes <= 6 * 2 ** 20);
  assert.equal(report.syntheticCeiling.scene.provinceBorderSegments, 50_000);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  const sampleFlight = async withSyntheticProvince => page.evaluate(async withSyntheticProvince => {
    const scene = window.__task09Scene;
    if (!withSyntheticProvince) scene.setProvinceBoundaries(null);
    scene.setView({ lat: 55.754110, lng: 37.613577, zoom: 3.5 });
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    scene.beginFrameCapture();
    const began = performance.now();
    const result = await scene.flyTo(window.__task09ArrivalView, 10_000, scene.stats().journeyPath.request);
    return { capture: scene.endFrameCapture(), elapsedMs: performance.now() - began, result, stats: scene.stats() };
  }, withSyntheticProvince);
  // First sample deliberately exercises the full permitted synthetic segment count.
  report.ceilingFlight = await sampleFlight(true);
  report.productionFlight = await sampleFlight(false);
  for (const name of ["ceilingFlight", "productionFlight"]) {
    const data = report[name].capture.intervalsMs.toSorted((a, b) => a - b);
    report[name].summary = { frames: report[name].capture.renderMs.length, medianMs: data[Math.floor(data.length * 0.5)], p95Ms: data[Math.floor(data.length * 0.95)] };
  }
  await page.screenshot({ path: path.join(output, "measured-flight-arrived.png"), scale: "css" });
  const idleWindow = async () => {
    const before = await snapshot();
    await page.evaluate(() => window.__task09Scene.beginFrameCapture());
    await page.waitForTimeout(1000);
    const capture = await page.evaluate(() => window.__task09Scene.endFrameCapture());
    const after = await snapshot();
    return { durationMs: 1000, draws: after.gl.draws - before.gl.draws, frames: capture.renderMs.length, before, after };
  };
  await page.waitForTimeout(150);
  report.settled = await idleWindow();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  report.hidden = await idleWindow();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    Object.defineProperty(document, "visibilityState", { configurable: true, value: "visible" });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForTimeout(150);

  const resources = await page.evaluate(() => performance.getEntriesByType("resource").filter(r => r.name.includes("/_next/static/") && new URL(r.name).pathname.endsWith(".js"))
    .map(r => new URL(r.name).pathname));
  const served = async pathname => new Promise((resolve, reject) => {
    http.get(new URL(pathname, base), { headers: { "Accept-Encoding": "gzip" } }, response => {
      const chunks = [];
      response.on("data", data => chunks.push(data));
      response.on("end", () => {
        const encoded = Buffer.concat(chunks);
        const body = response.headers["content-encoding"] === "gzip" ? gunzipSync(encoded) : encoded;
        resolve({ path: pathname, status: response.statusCode, contentEncoding: response.headers["content-encoding"] ?? "identity",
          servedBytes: encoded.length, rawBytes: body.length, gzipBytes: gzipSync(body).length,
          sha256: createHash("sha256").update(body).digest("hex"), body });
      });
      response.on("error", reject);
    }).on("error", reject);
  });
  const geoPaths = ["/maps/vietnam-tabletop.geojson", "/maps/history-world-land.geojson", "/maps/history-country-boundaries.geojson", "/maps/history-vietnam-labels.json", "/maps/history-vietnam-province-boundaries.geojson"];
  report.geography = [];
  for (const pathname of geoPaths) { const { body, ...entry } = await served(pathname); void body; report.geography.push(entry); }
  report.geographyGzipBytes = report.geography.filter(e => e.status === 200).reduce((sum, e) => sum + e.gzipBytes, 0);
  report.scripts = [];
  const uiTokens = ["journey-chooser", "Tự chuyển sau ít nhất", "Các mốc gần nhau được tách", "province-interior"];
  const scriptPaths = new Set(resources);
  // Include the optional parser chunk even when the production 404 means its
  // import was not requested. This keeps the upper bound conservative.
  for (const name of readdirSync(".next/static/chunks")) {
    if (!name.endsWith(".js")) continue;
    const text = readFileSync(path.join(".next/static/chunks", name), "utf8");
    if (uiTokens.some(token => text.includes(token))) scriptPaths.add(`/_next/static/chunks/${name}`);
  }
  // Report complete served chunks, including unrelated code inside them, as an upper bound.
  for (const pathname of scriptPaths) {
    const { body, ...entry } = await served(pathname);
    entry.observedOnInitialPage = resources.includes(pathname);
    entry.containsProvinceParser = body.toString("utf8").includes("province-interior");
    entry.uiEnvelope = entry.containsProvinceParser || uiTokens.some(token => body.toString("utf8").includes(token));
    report.scripts.push(entry);
  }
  report.uiEnvelopeGzipBytes = report.scripts.filter(e => e.uiEnvelope).reduce((sum, e) => sum + e.gzipBytes, 0);
  report.totalLoadedJsGzipBytes = report.scripts.filter(e => e.observedOnInitialPage).reduce((sum, e) => sum + e.gzipBytes, 0);
  // Real client navigation exercises React unmount/disposal; preserve the old scene reference only for inspection.
  await page.getByTestId("journey-panel").getByRole("link", { name: /Xem chi tiết sự kiện/ }).click();
  await expect(page).toHaveURL(/\/su-kien\//);
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(0);
  report.unmounted = await idleWindow();
  report.events = events;
  report.finishedAt = new Date().toISOString();
  report.gates = {
    geography800KiB: report.geographyGzipBytes <= 800 * 1024,
    uiEnvelope60KiB: report.uiEnvelopeGzipBytes > 0 && report.uiEnvelopeGzipBytes <= 60 * 1024,
    syntheticAddedCalls3: report.syntheticCombinedDelta.drawCalls <= 3,
    syntheticBuffers6MiB: report.syntheticCombinedDelta.bufferBytes <= 6 * 2 ** 20,
    productionFrames: report.productionFlight.summary.medianMs <= 33.3 && report.productionFlight.summary.p95Ms <= 50,
    syntheticFrames: report.ceilingFlight.summary.medianMs <= 33.3 && report.ceilingFlight.summary.p95Ms <= 50,
    noContinuingDraws: [report.settled, report.hidden, report.unmounted].every(w => w.frames === 0 && w.draws === 0),
    approvedProvince: false,
  };
  await context.close();

  // Separate from the measurement window: prove simultaneous real layers at local scale.
  const combinedContext = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const combinedPage = await combinedContext.newPage();
  const localFixture = structuredClone(fixture);
  localFixture.features[0].geometry.coordinates = [[105.84, 20.93], [105.84, 21.13]];
  await combinedPage.route("**/maps/history-vietnam-province-boundaries.geojson", route => route.fulfill({ json: localFixture }));
  await combinedPage.goto(`${base}/?hanh-trinh=mua-thu-doc-lap-1945&moc=ba-dinh-1945`);
  await expect(combinedPage.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  await expect(combinedPage.getByTestId("cinematic-globe")).toHaveAttribute("data-province-boundaries", "ready");
  await combinedPage.evaluate(() => {
    const canvas = document.querySelector("canvas.cinematic-globe-canvas");
    let fiber = canvas[Object.keys(canvas).find(key => key.startsWith("__reactFiber"))];
    while (fiber) {
      for (let hook = fiber.memoizedState; hook; hook = hook.next) if (typeof hook.memoizedState?.scene?.stats === "function") {
        window.__task09Scene = hook.memoizedState.scene; return;
      }
      fiber = fiber.return;
    }
    throw new Error("Combined scene unavailable");
  });
  const changedPixels = async (a, b) => {
    const first = await sharp(a).removeAlpha().raw().toBuffer();
    const second = await sharp(b).removeAlpha().raw().toBuffer();
    let count = 0;
    for (let i = 0; i < first.length; i += 3) if (Math.max(...[0, 1, 2].map(c => Math.abs(first[i + c] - second[i + c]))) > 12) count++;
    return count;
  };
  report.combinedLocalPixels = [];
  for (const zoom of [8, 10, 11]) {
    await combinedPage.getByTestId("journey-timeline").locator('[aria-current="step"]').click();
    await combinedPage.evaluate(async ({ zoom, localFixture }) => {
      window.__task09Scene.setProvinceBoundaries(localFixture);
      window.__task09Scene.setView({ lat: 21.03, lng: 105.84, zoom });
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, { zoom, localFixture });
    const canvas = combinedPage.locator("canvas.cinematic-globe-canvas");
    const both = await canvas.screenshot({ path: path.join(output, `combined-path-province-z${zoom}.png`), scale: "css" });
    const stats = await combinedPage.evaluate(() => window.__task09Scene.stats());
    await combinedPage.evaluate(async () => {
      window.__task09Scene.setProvinceBoundaries(null);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const pathOnly = await canvas.screenshot();
    await combinedPage.evaluate(async () => {
      window.__task09Scene.setJourneyPath(null);
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const neither = await canvas.screenshot();
    const evidence = { zoom, provincePixels: await changedPixels(both, pathOnly), pathPixels: await changedPixels(pathOnly, neither), stats, syntheticProvinceOnly: true };
    report.combinedLocalPixels.push(evidence);
    assert(evidence.provincePixels > 20 && evidence.pathPixels > 20, `Simultaneous local layers must draw actual pixels at ${zoom}`);
  }
  await combinedContext.close();

  const fallbackContext = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const fallback = await fallbackContext.newPage();
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
      return String(kind).includes("webgl") ? null : Reflect.apply(original, this, [kind, ...args]);
    };
  });
  await fallback.goto(`${base}/?hanh-trinh=mua-thu-doc-lap-1945&moc=ha-noi-1945`);
  await expect(fallback.getByTestId("globe-error")).toBeVisible();
  const choices = await fallback.getByTestId("journey-select").locator("option").evaluateAll(options => options.map(o => o.value));
  assert.equal(choices.length, 4);
  report.noWebglJourneys = [];
  for (const id of choices) {
    await fallback.getByTestId("journey-select").selectOption(id);
    const heading = fallback.getByTestId("journey-panel").getByRole("heading");
    const before = await heading.textContent();
    await fallback.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
    await expect(heading).not.toHaveText(before);
    await expect(fallback.getByRole("button", { name: "Phát hành trình", exact: true })).toBeDisabled();
    const sources = fallback.getByTestId("journey-panel").locator(".journey-sources");
    await sources.locator("summary").focus(); await fallback.keyboard.press("Enter");
    await expect(sources).toHaveAttribute("open", "");
    await expect(sources.getByRole("link").first()).toBeVisible();
    report.noWebglJourneys.push({ id, before, after: await heading.textContent() });
    await fallback.screenshot({ path: path.join(output, `no-webgl-${id}.png`), scale: "css" });
    await sources.locator("summary").focus(); await fallback.keyboard.press("Enter");
  }
  await fallbackContext.close();

  // A separate navigation probe, after all frame samples, records the baseline
  // server symptom without suppressing it or inferring server health from UI success.
  const serverLog = path.resolve(".task-reports/task-09-work/server-acceptance.stderr.log");
  const streamErrors = () => (readFileSync(serverLog, "utf8").match(/3840477093/g) ?? []).length;
  const probeContext = await browser.newContext({ reducedMotion: "reduce" });
  const probe = await probeContext.newPage();
  const probeErrors = [];
  probe.on("pageerror", error => probeErrors.push(error.message.slice(0, 500)));
  report.streamCloseProbe = { method: "Three root document navigations replaced immediately after commit, then a completed journey load", before: streamErrors(), iterations: [] };
  for (let i = 0; i < 3; i++) {
    const before = streamErrors();
    await probe.goto(`${base}/?tu=1945&den=1945&task09-navigation-probe=${i}`, { waitUntil: "commit" });
    const response = await probe.goto(`${base}/?hanh-trinh=mua-thu-doc-lap-1945&moc=hue-1945`, { waitUntil: "domcontentloaded" });
    await probe.waitForTimeout(150);
    report.streamCloseProbe.iterations.push({ i, responseStatus: response.status(), newServerErrors: streamErrors() - before });
  }
  await expect(probe.getByTestId("globe-map")).toHaveAttribute("data-ready", "true");
  report.streamCloseProbe.after = streamErrors();
  report.streamCloseProbe.pageErrors = probeErrors;
  report.streamCloseProbe.finalReadableTitle = await probe.getByTestId("journey-panel").getByRole("heading").textContent();
  await probeContext.close();
  report.finishedAt = new Date().toISOString();
} finally {
  writeFileSync(path.join(output, "measurements.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
console.log(JSON.stringify({ buildId: report.buildId, gates: report.gates, productionFrames: report.productionFlight?.summary,
  ceilingFrames: report.ceilingFlight?.summary, uiEnvelopeGzipBytes: report.uiEnvelopeGzipBytes,
  geographyGzipBytes: report.geographyGzipBytes, syntheticCombinedDelta: report.syntheticCombinedDelta }, null, 2));
