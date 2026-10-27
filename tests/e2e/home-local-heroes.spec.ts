import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import localities from "./fixtures/local-heroes/localities.json";
import { inspectScene } from "./refinement-evidence";
const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");
const diagnostics = new WeakMap<Page, { kind: string; path?: string; status?: number; message?: string }[]>();
const rows = (page: Page) => page.getByTestId("local-hero-row");
const locality = (page: Page) => page.getByLabel("Địa phương tham chiếu", { exact: true });
const query = (page: Page) => page.getByLabel("Tên, bí danh hoặc đóng góp", { exact: true });
const ready = (page: Page) => expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
test.beforeEach(async ({ page, context }, info) => {
  const events: NonNullable<ReturnType<typeof diagnostics.get>> = []; diagnostics.set(page, events);
  page.on("pageerror", (error) => events.push({ kind: "pageerror", message: error.message }));
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) events.push({ kind: `console-${message.type()}`, message: message.text().replace(/https?:\/\/[^\s"'<>]+/gu, (value) => { try { return new URL(value).pathname; } catch { return "[URL]"; } }).slice(0, 800) }); });
  page.on("response", (response) => { if (response.status() >= 400) events.push({ kind: response.url().includes("broken") ? "intentional-broken-image" : "http-error", path: new URL(response.url()).pathname, status: response.status() }); });
  page.on("requestfailed", (request) => events.push({ kind: "requestfailed", path: new URL(request.url()).pathname, message: request.failure()?.errorText }));
  await page.addInitScript(({ seen }) => { localStorage.setItem("ls12:da-xem-huong-dan", "1"); if (seen) sessionStorage.setItem("ls12:globe-intro-seen", "1"); }, { seen: !info.title.includes("intro") });
  await context.route("**/_next/image?**", (route) => route.fulfill(route.request().url().includes("broken")
    ? { status: 503, contentType: "text/plain", body: "Synthetic image unavailable" } : { status: 200, contentType: "image/svg+xml", body: thumbnail }));
  await context.route("https://example.invalid/**", (route) => route.fulfill(route.request().url().includes("broken")
    ? { status: 503, contentType: "text/plain", body: "Synthetic image unavailable" } : { status: 200, contentType: "image/svg+xml", body: thumbnail }));
});
test.afterEach(async ({ page }, info) => {
  const events = diagnostics.get(page) ?? [];
  await info.attach("console-network-diagnostics", { contentType: "application/json", body: JSON.stringify(events, null, 2) });
  mkdirSync("output/playwright/local-heroes/diagnostics", { recursive: true });
  writeFileSync(`output/playwright/local-heroes/diagnostics/${info.project.name}-${info.title.replace(/[^a-z0-9]+/giu, "-").slice(0, 90)}.json`, JSON.stringify(events, null, 2));
  expect(events.filter((e) => e.kind === "pageerror")).toEqual([]);
});
test("homepage locality entry exposes a bounded public list", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nhân vật cách mạng theo địa phương", exact: true })).toBeVisible();
  await expect(page.locator("[data-testid=local-hero-row]")).toHaveCount(12);
  await ready(page);
  mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
  await page.screenshot({ path: `output/playwright/local-heroes/screenshots/people-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png` });
});

test("all 34 choices, distinct locality counts, pagination and Vietnamese aliases", async ({ page }) => {
  await page.goto("/?noi-dung=nhan-vat"); await expect(rows(page)).toHaveCount(12);
  await expect(locality(page).locator("option")).toHaveCount(35);
  for (const l of localities) await expect(locality(page).locator(`option[value="${l.slug}"]`)).toHaveText(l.officialName);
  const ids = await rows(page).evaluateAll((nodes) => nodes.map((node) => node.getAttribute("data-person-id"))); expect(new Set(ids).size).toBe(12);
  await locality(page).selectOption("ha-noi"); await expect(page.locator(".local-heroes-count")).toContainText("14 nhân vật");
  await page.getByRole("link", { name: "Trang nhân vật 2", exact: true }).click(); await expect(rows(page)).toHaveCount(2);
  await locality(page).selectOption("cao-bang"); await expect(rows(page)).toHaveCount(2); await expect(page).not.toHaveURL(/trang-nhan-vat=/);
  await locality(page).selectOption(""); await query(page).fill("Bi danh gia"); await query(page).press("Enter");
  await expect(rows(page)).toHaveCount(1); await expect(rows(page).first()).toContainText("Đặng Nhân Vật Giả");
  await query(page).fill("ĐẶNG"); await query(page).press("Enter"); await expect(rows(page)).toHaveCount(1);
  await query(page).fill("no-match-synthetic"); await query(page).press("Enter"); await expect(page.getByText("Không có nhân vật phù hợp với tìm kiếm này.", { exact: false })).toBeVisible();
  await query(page).fill(""); await locality(page).selectOption("ca-mau");
  await expect(page.getByText("Chưa có hồ sơ đã được thẩm định cho địa phương này.", { exact: false })).toBeVisible();
});

test("selecting every canonical locality commits its own page and matching result state", async ({ page }) => {
  await page.goto("/?noi-dung=nhan-vat&trang-nhan-vat=2");
  for (const place of localities) {
    const [response] = await Promise.all([
      page.waitForResponse((r) => new URL(r.url()).pathname === "/api/local-heroes"
        && new URL(r.url()).searchParams.get("dia-phuong") === place.slug),
      locality(page).selectOption(place.slug),
    ]);
    expect(response.status()).toBe(200);
    const payload = (await response.json()).data;
    expect(payload.filters).toMatchObject({ localityCode: place.code, page: 1 });
    await expect(locality(page)).toHaveValue(place.slug);
    await expect(page).toHaveURL(new RegExp(`dia-phuong=${place.slug}(?:&|$)`));
    await expect(page).not.toHaveURL(/trang-nhan-vat=/);
    await expect(rows(page)).toHaveCount(Math.min(12, payload.totalPeople));
    if (payload.totalPeople === 0) await expect(page.getByText("Chưa có hồ sơ đã được thẩm định cho địa phương này.", { exact: false })).toBeVisible();
    else await expect(page.locator(".local-heroes-count")).toContainText(`${payload.totalPeople} nhân vật`);
  }
});

test("reload share Back forward and detail return preserve exact people context", async ({ page, browser }) => {
  await page.goto("/?noi-dung=nhan-vat&tu=1911&den=1975&ban-do=21,105,5&dia-phuong=ha-noi&trang-nhan-vat=2");
  await expect(rows(page)).toHaveCount(2); const shared = page.url();
  await page.reload(); await expect(rows(page)).toHaveCount(2);
  const copied = await browser.newPage(); await copied.route("**/_next/image?**", (r) => r.fulfill({ contentType: "image/svg+xml", body: thumbnail })); await copied.goto(shared); await expect(rows(copied)).toHaveCount(2); await copied.close();
  await locality(page).selectOption("cao-bang"); await expect(page).toHaveURL(/dia-phuong=cao-bang/); await expect(rows(page)).toHaveCount(2);
  await page.goBack(); await expect(locality(page)).toHaveValue("ha-noi"); await expect(page.locator(".local-heroes-pagination")).toContainText("Trang 2 / 2");
  await page.goForward(); await expect(locality(page)).toHaveValue("cao-bang"); await expect(rows(page)).toHaveCount(2);
  const home = page.url();
  const detail = rows(page).first().getByRole("link", { name: /Xem câu chuyện/ });
  const expected = new URL((await detail.getAttribute("href"))!, page.url()).searchParams.get("kham-pha")!;
  await detail.click(); await expect(page).toHaveURL(/\/nhan-vat\/synthetic-person-/);
  await expect(page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true })).toHaveAttribute("href", expected);
  await page.goBack(); await expect(rows(page)).toHaveCount(2); await expect(locality(page)).toHaveValue("cao-bang");
  await rows(page).first().getByRole("link", { name: /Xem câu chuyện/ }).click();
  await page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true }).click();
  await expect(rows(page)).toHaveCount(2); await expect(locality(page)).toHaveValue("cao-bang");
  expect(new URL(page.url()).searchParams.get("ban-do")).toBe(new URL(home).searchParams.get("ban-do"));
});

test("keyboard focus, scrolling, contrast and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" }); await page.goto("/");
  const entry = page.getByRole("link", { name: "Theo địa phương", exact: true }); await entry.focus(); await page.keyboard.press("Enter");
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Nhân vật cách mạng theo địa phương", exact: true })).toBeFocused();
  await expect(rows(page)).toHaveCount(12); await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Đóng danh sách nhân vật" })).toBeFocused();
  await page.keyboard.press("Tab"); await page.keyboard.press("Tab"); await page.keyboard.press("Tab"); await expect(locality(page)).toBeFocused();
  const outline = await locality(page).evaluate((node) => getComputedStyle(node).outlineStyle); expect(outline).not.toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  const scroll = page.getByRole("region", { name: "Kết quả nhân vật, cuộn để đọc" });
  await page.locator(".local-heroes-results").evaluate((node) => { node.scrollTop = node.scrollHeight; });
  await expect(rows(page).last().getByRole("link", { name: /Xem câu chuyện/ })).toBeInViewport();
  await expect(page.getByRole("link", { name: "Trang nhân vật tiếp", exact: true })).toBeInViewport();
  expect(await scroll.count()).toBe(1);
  const axe = await new AxeBuilder({ page }).include(".home-history-map").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  mkdirSync("output/playwright/local-heroes/accessibility", { recursive: true });
  writeFileSync(`output/playwright/local-heroes/accessibility/${page.viewportSize()!.width}x${page.viewportSize()!.height}.json`, JSON.stringify({ tags: ["wcag2a", "wcag2aa", "wcag21aa"], violations: axe.violations, passedRules: axe.passes.map((rule) => rule.id) }, null, 2));
  expect(axe.violations).toEqual([]);
  await page.keyboard.press("Escape"); await expect(page.getByTestId("local-heroes-panel")).toHaveCount(0); await expect(entry).toBeFocused();
  await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
});

test("entry during journey playback restores its paused selection and camera", async ({ page }) => {
  await page.goto("/?tu=1911&den=1975&ban-do=10.76,106.7,6.6&hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911"); await ready(page);
  await page.getByRole("button", { name: "Phát hành trình", exact: true }).click(); await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(rows(page)).toHaveCount(12);
  const before = new URL(page.url()).searchParams;
  await expect(page.getByTestId("journey-panel")).toHaveCount(0); await expect(page.getByTestId("map-event-card")).toHaveCount(0); await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  await locality(page).selectOption("ha-noi"); await expect(page.locator(".local-heroes-count")).toContainText("14 nhân vật");
  await page.keyboard.press("Escape"); await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
  await page.waitForTimeout(3800); await expect(page.getByRole("button", { name: "Phát hành trình", exact: true })).toBeVisible();
  const after = new URL(page.url()).searchParams;
  for (const key of ["tu", "den", "hanh-trinh", "moc", "ban-do"]) expect(after.get(key)).toBe(before.get(key));
  const expectedView = before.get("ban-do")!.split(",").map(Number), actualView = (await inspectScene(page)).view;
  expect(actualView.lat).toBeCloseTo(expectedView[0], 4); expect(actualView.lng).toBeCloseTo(expectedView[1], 4); expect(actualView.zoom).toBeCloseTo(expectedView[2], 2);
});

test("late locality and search responses cannot replace the newest intent", async ({ page }) => {
  await page.addInitScript(() => { const original = window.fetch.bind(window); window.fetch = (input, init) => original(input, String(input).includes("/api/local-heroes") ? { ...init, signal: undefined } : init); });
  await page.goto("/?noi-dung=nhan-vat"); await expect(rows(page)).toHaveCount(12);
  let releaseOld!: () => void; const held = new Promise<void>((resolve) => { releaseOld = resolve; });
  let heldStarted!: () => void; const started = new Promise<void>((resolve) => { heldStarted = resolve; });
  let releaseSearch!: () => void; const heldSearch = new Promise<void>((resolve) => { releaseSearch = resolve; });
  let searchStarted!: () => void; const searching = new Promise<void>((resolve) => { searchStarted = resolve; });
  await page.route("**/api/local-heroes?**", async (route) => {
    const url = new URL(route.request().url()), response = await route.fetch();
    if (url.searchParams.get("dia-phuong") === "ha-noi") { heldStarted(); await held; }
    if (url.searchParams.get("q-nhan-vat") === "Nhân") { searchStarted(); await heldSearch; }
    await route.fulfill({ response }).catch(() => {});
  });
  await locality(page).selectOption("ha-noi"); await started; await expect(rows(page)).toHaveCount(0); await expect(page.getByText("Đang tải danh sách nhân vật…", { exact: true })).toBeVisible();
  await locality(page).selectOption("cao-bang"); await expect(rows(page)).toHaveCount(2); releaseOld(); await page.waitForTimeout(300); await expect(rows(page)).toHaveCount(2);
  await query(page).fill("Nhân"); await searching; await query(page).fill("Đặng"); await expect(rows(page)).toHaveCount(1); releaseSearch(); await page.waitForTimeout(300); await expect(rows(page)).toHaveCount(1); await expect(rows(page)).toContainText("Đặng Nhân Vật Giả");
});

test("independent errors, retry, clamping and broken accepted images", async ({ page }) => {
  await page.goto("/?noi-dung=nhan-vat&dia-phuong=ha-noi&trang-nhan-vat=999999&__test_db_error=1");
  await expect(rows(page)).toHaveCount(2); await expect(page.getByTestId("explorer-data-error")).toBeVisible(); await expect(page).toHaveURL(/trang-nhan-vat=2/);
  await page.goto("/?noi-dung=nhan-vat&q-nhan-vat=fixture-error"); await expect(page.getByTestId("local-heroes-panel").getByRole("alert")).toContainText("Chưa tải được danh sách nhân vật");
  await expect(page.getByTestId("explorer-data-error")).toHaveCount(0);
  await query(page).fill("Đặng"); await query(page).press("Enter"); await expect(rows(page)).toHaveCount(1);
  let fail = true;
  await page.route("**/api/local-heroes?**", async (route) => fail ? route.fulfill({ status: 503, json: { ok: false, error: { code: "DATA_UNAVAILABLE" } } }) : route.continue());
  await locality(page).selectOption("cao-bang"); await expect(page.getByTestId("local-heroes-panel").getByRole("alert")).toContainText("Chưa tải được danh sách nhân vật");
  const failedUrl = page.url(); fail = false; await page.getByRole("link", { name: "Thử lại", exact: true }).click(); await expect(rows(page)).toHaveCount(1); expect(page.url()).toBe(failedUrl);
  await page.goto("/?noi-dung=nhan-vat"); await expect(rows(page)).toHaveCount(12); await rows(page).nth(1).scrollIntoViewIfNeeded(); await expect(page.getByTestId("local-hero-image-error").first()).toBeVisible();
  const images = rows(page).locator("img");
  for (const image of await images.all()) { await expect(image).toHaveAttribute("loading", "lazy"); await expect(image).toHaveAttribute("width", "120"); await expect(image).toHaveAttribute("height", "80"); const src = new URL((await image.getAttribute("src"))!, page.url()); expect(Number(src.searchParams.get("w"))).toBeLessThanOrEqual(480); }
});

test("SSR GET without JavaScript follows locality pagination detail and return", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: test.info().project.use.viewport });
  const page = await context.newPage(); await page.route("**/_next/image?**", (r) => r.fulfill({ contentType: "image/svg+xml", body: thumbnail }));
  await page.goto("http://127.0.0.1:3114/"); await page.getByRole("link", { name: "Theo địa phương", exact: true }).click(); await page.getByRole("link", { name: "Nhân vật", exact: true }).click(); await expect(rows(page)).toHaveCount(12);
  const fallbackOverlapsPanel = await page.evaluate(() => {
    const panel = document.querySelector(".local-heroes-panel")!.getBoundingClientRect();
    return [...document.querySelectorAll(".home-map-notice, .home-map-tile-error")].some((notice) => {
      const box = notice.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && box.left < panel.right && box.right > panel.left && box.top < panel.bottom && box.bottom > panel.top;
    });
  });
  expect(fallbackOverlapsPanel).toBe(false);
  await expect(page.locator(".home-map-loading")).toBeHidden();
  await locality(page).selectOption("ha-noi"); await page.getByRole("button", { name: "Tìm", exact: true }).click(); await expect(page.locator(".local-heroes-count")).toContainText("14 nhân vật");
  await page.getByRole("link", { name: "Trang nhân vật 2", exact: true }).click(); await expect(rows(page)).toHaveCount(2);
  await rows(page).first().getByRole("link", { name: /Xem câu chuyện/ }).click(); await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true }).click(); await expect(rows(page)).toHaveCount(2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: `output/playwright/local-heroes/screenshots/no-js-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png` }); await context.close();
});

test("HTML catalog without WebGL remains keyboard operable", async ({ page }) => {
  await page.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: Parameters<typeof original>) { return /webgl/iu.test(String(args[0])) ? null : Reflect.apply(original, this, args); } as typeof original; });
  await page.goto("/?noi-dung=nhan-vat&dia-phuong=cao-bang"); await expect(rows(page)).toHaveCount(2);
  await locality(page).focus(); await expect(locality(page)).toBeFocused(); await query(page).fill("Bi danh gia"); await query(page).press("Enter"); await expect(rows(page)).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Toàn cầu", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.screenshot({ path: `output/playwright/local-heroes/screenshots/no-webgl-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png` });
});

test("default network is deferred; one page RPC supplies count/coverage without N+1", async ({ page, request }) => {
  const before = readFileSync("output/playwright/local-heroes/fixture-requests.ndjson", "utf8").trim().split("\n").filter(Boolean).length;
  const photos: string[] = []; page.on("request", (r) => { if (r.url().includes("local-heroes/") || r.url().includes("/_next/image")) photos.push(r.url()); });
  await page.goto("/"); await ready(page); await page.waitForTimeout(250);
  const initial = readFileSync("output/playwright/local-heroes/fixture-requests.ndjson", "utf8").trim().split("\n").filter(Boolean).slice(before).map((line) => JSON.parse(line));
  expect(initial.filter((row) => row.path.includes("local_hero"))).toEqual([]); expect(photos).toEqual([]);
  await page.evaluate(() => history.replaceState({ ...history.state, localHeroesTestSentinel: "preserved" }, "", location.href));
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(rows(page)).toHaveCount(12);
  const opened = readFileSync("output/playwright/local-heroes/fixture-requests.ndjson", "utf8").trim().split("\n").filter(Boolean).slice(before).map((line) => JSON.parse(line));
  expect(opened.filter((row) => row.path.endsWith("local_hero_page"))).toHaveLength(1); expect(opened.filter((row) => row.path.endsWith("local_hero_profile"))).toHaveLength(0);
  expect(await page.evaluate(() => history.state.localHeroesTestSentinel)).toBe("preserved");
  for (const l of localities) { const response = await request.get(`/api/local-heroes?dia-phuong=${l.slug}`); expect(response.status()).toBe(200); const { data } = await response.json(); expect(data.totalPeople).toBe(data.coverage.byLocality.find((row: { code: string }) => row.code === l.code).eligiblePeople); expect(data.items.length).toBeLessThanOrEqual(12); }
  expect((await request.post("http://127.0.0.1:54329/rest/v1/historical_figures", { data: {} })).status()).toBe(405);
  expect((await request.get("http://127.0.0.1:54329/auth/v1/user")).status()).toBe(404);
  const beforeSSR = readFileSync("output/playwright/local-heroes/fixture-requests.ndjson", "utf8").trim().split("\n").filter(Boolean).length;
  const clientCalls: string[] = []; page.on("request", (r) => { if (new URL(r.url()).pathname === "/api/local-heroes") clientCalls.push(r.url()); });
  await page.goto("/?noi-dung=nhan-vat&dia-phuong=ha-noi&trang-nhan-vat=2"); await expect(rows(page)).toHaveCount(2); await page.waitForTimeout(300);
  const hydrated = readFileSync("output/playwright/local-heroes/fixture-requests.ndjson", "utf8").trim().split("\n").filter(Boolean).slice(beforeSSR).map((line) => JSON.parse(line));
  expect(hydrated.filter((row) => row.path.endsWith("local_hero_page"))).toHaveLength(1); expect(clientCalls).toEqual([]);
});

test("people entry before scene readiness cancels intro and never replays it", async ({ page }) => {
  let release!: () => void; const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/maps/globe/earth-day-4096x2048.jpg", async (route) => { await held; await route.continue().catch(() => {}); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(rows(page)).toHaveCount(12);
  release(); await ready(page); await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
  await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
});

test("public detail rejects ineligible profiles, sanitizes outages and keeps legacy access", async ({ request }) => {
  const hidden = await request.get("/nhan-vat/synthetic-ineligible"); expect(hidden.status()).toBe(404); expect(await hidden.text()).not.toContain("PRIVATE_INELIGIBLE_SENTINEL");
  const error = await request.get("/nhan-vat/synthetic-profile-error"); expect(error.status()).toBe(500); expect(await error.text()).not.toContain("PRIVATE_FAILURE_SENTINEL");
  const legacy = await request.get("/nhan-vat/synthetic-legacy"); expect(legacy.status()).toBe(200); expect(await legacy.text()).toContain("Synthetic legacy biography");
});

test("entering during the active intro cancels the flight without a second camera", async ({ page }) => {
  await page.goto("/"); await page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true }).waitFor({ state: "visible" });
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(rows(page)).toHaveCount(12);
  await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
  const before = (await inspectScene(page)).view; await page.waitForTimeout(600); const after = (await inspectScene(page)).view;
  expect(after.lat).toBeCloseTo(before.lat, 4); expect(after.lng).toBeCloseTo(before.lng, 4); expect(after.zoom).toBeCloseTo(before.zoom, 4);
  await expect(page.locator("canvas.cinematic-globe-canvas")).toHaveCount(1);
  await page.keyboard.press("Escape"); await expect(page.getByRole("button", { name: "Bỏ qua chuyển cảnh", exact: true })).toHaveCount(0);
});
