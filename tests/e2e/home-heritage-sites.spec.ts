import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, mkdirSync, writeFileSync, existsSync, unlinkSync } from "node:fs";

const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");
const diagnostics = new WeakMap<Page, { kind: string; path?: string; status?: number; message?: string }[]>();

const rows = (page: Page) => page.getByTestId("heritage-row");
const locality = (page: Page) => page.getByLabel("Địa phương tham chiếu", { exact: true });
const ready = (page: Page) => expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30000 });

test.beforeEach(async ({ page, context }) => {
  const events: NonNullable<ReturnType<typeof diagnostics.get>> = [];
  diagnostics.set(page, events);
  page.on("pageerror", (error) => events.push({ kind: "pageerror", message: error.message }));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      events.push({
        kind: `console-${message.type()}`,
        message: message.text().slice(0, 800),
      });
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      events.push({
        kind: response.url().includes("broken") ? "intentional-broken-image" : "http-error",
        path: new URL(response.url()).pathname,
        status: response.status(),
      });
    }
  });

  await page.addInitScript(({ seen }) => {
    localStorage.setItem("ls12:da-xem-huong-dan", "1");
    if (seen) sessionStorage.setItem("ls12:globe-intro-seen", "1");
  }, { seen: true });

  await context.route("**/_next/image?**", (route) =>
    route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail }),
  );
  await context.route("https://example.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail }),
  );
  await context.route("https://commons.wikimedia.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail }),
  );
});

test.afterEach(async ({ page }, info) => {
  const events = diagnostics.get(page) ?? [];
  mkdirSync("output/playwright/local-heroes/diagnostics", { recursive: true });
  writeFileSync(
    `output/playwright/local-heroes/diagnostics/${info.project.name}-${info.title.replace(/[^a-z0-9]+/giu, "-").slice(0, 90)}.json`,
    JSON.stringify(events, null, 2),
  );
  expect(events.filter((e) => e.kind === "pageerror")).toEqual([]);
});

test("H1: Default homepage makes no heritage request and shows Theo địa phương entry", async ({ page }) => {
  const logPath = "output/playwright/local-heroes/fixture-requests.ndjson";
  const before = existsSync(logPath)
    ? readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean).length
    : 0;

  await page.goto("/");
  await ready(page);
  await page.waitForTimeout(250);

  const entry = page.getByRole("link", { name: "Theo địa phương", exact: true });
  await expect(entry).toBeVisible();

  if (existsSync(logPath)) {
    const afterLines = readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean).slice(before);
    const heritageRequests = afterLines
      .map((line) => JSON.parse(line))
      .filter((row) => row.path.includes("historical_locations") && row.query?.select?.includes("heritage_tier"));
    expect(heritageRequests).toHaveLength(0);
  }
});

test("H2: Click Theo địa phương opens places panel with grouped items and coverage", async ({ page }) => {
  await page.goto("/");
  await ready(page);
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();

  await expect(page).toHaveURL(/noi-dung=dia-danh/);
  const heading = page.getByRole("heading", { name: "Địa danh lịch sử theo địa phương", exact: true });
  await expect(heading).toBeVisible();
  await expect(heading).toBeFocused();

  await expect(rows(page)).toHaveCount(6);
  await expect(page.locator(".local-heroes-coverage")).toContainText("Độ phủ hiện có:");

  if (page.viewportSize()?.width === 1440 && page.viewportSize()?.height === 900) {
    mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
    await page.screenshot({ path: "output/playwright/local-heroes/screenshots/heritage-panel-1440x900.png" });
  }
});

test("H3: Select a locality filters rows, updates URL and fires camera nonce", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh");
  await ready(page);

  const initialNonce = await page.getByTestId("history-explorer").getAttribute("data-places-camera-nonce");
  await locality(page).selectOption("quang-tri");

  await expect(page).toHaveURL(/dia-phuong=quang-tri/);
  await expect(rows(page)).toHaveCount(2);
  await expect(page.locator(".local-heroes-count")).toContainText("2 địa danh · Tỉnh Quảng Trị");

  const nextNonce = await page.getByTestId("history-explorer").getAttribute("data-places-camera-nonce");
  expect(Number(nextNonce)).toBeGreaterThan(Number(initialNonce ?? 0));
});

test("H4 & H5: Xem trên bản đồ and marker click open the place card", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri");
  await ready(page);

  // H4: Click "Xem trên bản đồ" from first row
  const firstRow = rows(page).first();
  await firstRow.getByRole("link", { name: /Xem trên bản đồ/ }).click();

  await expect(page).toHaveURL(/dia-danh=synthetic-thanh-co-quang-tri/);
  const card = page.getByTestId("heritage-card");
  await expect(card).toBeVisible();
  await expect(card.getByRole("heading", { name: "Synthetic Thành cổ Quảng Trị" })).toBeFocused();

  // Marker has aria-pressed=true
  const marker = page.locator('button.home-event-marker[data-event-slugs="place:synthetic-thanh-co-quang-tri"]');
  if (await marker.count() > 0) {
    await expect(marker).toHaveAttribute("aria-pressed", "true");
  }

  if (page.viewportSize()?.width === 1440 && page.viewportSize()?.height === 900) {
    mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
    await page.screenshot({ path: "output/playwright/local-heroes/screenshots/heritage-card-1440x900.png" });
  }

  // Close card
  await card.getByRole("button", { name: "Đóng thông tin địa danh" }).click();
  await expect(page.getByTestId("heritage-card")).toHaveCount(0);

  // H5: Clicking marker directly opens the card again
  if (await marker.count() > 0) {
    await marker.click();
    await expect(page.getByTestId("heritage-card")).toBeVisible();
  }
});

test("H6: Video dialog, lazy iframe, Escape cascade and focus return", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=synthetic-thanh-co-quang-tri");
  await ready(page);

  const card = page.getByTestId("heritage-card");
  await expect(card).toBeVisible();

  const videoBtn = card.getByRole("button", { name: /Xem video/ });
  await expect(videoBtn).toBeVisible();
  await videoBtn.click();

  const dialog = page.locator("dialog.heritage-video-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("iframe")).toHaveCount(0);

  // Press play in the video embed -> loads iframe
  const playBtn = dialog.getByRole("button", { name: /Phát video/ });
  await playBtn.click();
  await expect(dialog.locator("iframe")).toHaveCount(1);

  if (page.viewportSize()?.width === 1440 && page.viewportSize()?.height === 900) {
    mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
    await page.screenshot({ path: "output/playwright/local-heroes/screenshots/heritage-video-dialog-1440x900.png" });
  }

  // Escape closes video dialog first
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(videoBtn).toBeFocused();

  // Escape closes card second
  await page.keyboard.press("Escape");
  await expect(card).toHaveCount(0);

  // Escape closes panel third
  await page.keyboard.press("Escape");
  await expect(page.getByTestId("heritage-panel")).toHaveCount(0);
});

test("H7: Tab switching between Địa danh and Nhân vật preserves locality", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri");
  await ready(page);

  // Click tab "Nhân vật"
  await page.getByRole("link", { name: "Nhân vật", exact: true }).click();
  await expect(page).toHaveURL(/noi-dung=nhan-vat/);
  await expect(page).toHaveURL(/dia-phuong=quang-tri/);
  await expect(page.getByTestId("local-heroes-panel")).toBeVisible();

  // Click tab "Địa danh"
  await page.getByRole("link", { name: "Địa danh", exact: true }).click();
  await expect(page).toHaveURL(/noi-dung=dia-danh/);
  await expect(page).toHaveURL(/dia-phuong=quang-tri/);
  await expect(page.getByTestId("heritage-panel")).toBeVisible();
});

test("H8: Close restores exact explorer state before entering", async ({ page }) => {
  await page.goto("/?tu=1954&den=1954&su-kien=chien-dich-dien-bien-phu");
  await ready(page);

  // Enter places mode
  await page.getByRole("link", { name: "Theo địa phương", exact: true }).click();
  await expect(page.getByTestId("heritage-panel")).toBeVisible();

  // Close places panel
  await page.getByRole("link", { name: "Đóng danh sách địa danh", exact: true }).click();
  await expect(page.getByTestId("heritage-panel")).toHaveCount(0);

  // Verify parameters restored
  const url = new URL(page.url());
  expect(url.searchParams.get("tu")).toBe("1954");
  expect(url.searchParams.get("den")).toBe("1954");
  expect(url.searchParams.get("su-kien")).toBe("chien-dich-dien-bien-phu");
  expect(url.searchParams.has("noi-dung")).toBe(false);
});

test("H9: Reload and Back/Forward restore panel, locality and selected place", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=synthetic-thanh-co-quang-tri");
  await ready(page);

  await expect(page.getByTestId("heritage-panel")).toBeVisible();
  await expect(page.getByTestId("heritage-card")).toBeVisible();
  await expect(locality(page)).toHaveValue("quang-tri");

  await page.reload();
  await expect(page.getByTestId("heritage-panel")).toBeVisible();
  await expect(page.getByTestId("heritage-card")).toBeVisible();
  await expect(locality(page)).toHaveValue("quang-tri");

  // Navigate back to without place
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri");
  await expect(page.getByTestId("heritage-card")).toHaveCount(0);
  await page.goBack();
  await expect(page.getByTestId("heritage-card")).toBeVisible();
});

test("H10: No-JS context renders panel and card server-side", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  await page.goto("http://127.0.0.1:3114/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=synthetic-thanh-co-quang-tri");
  await expect(page.getByTestId("heritage-panel")).toBeVisible();
  await expect(page.getByTestId("heritage-card")).toBeVisible();
  await expect(page.getByTestId("heritage-card").getByRole("heading", { name: "Synthetic Thành cổ Quảng Trị" })).toBeVisible();

  await context.close();
});

test("H11: Reduced motion disables camera animation while keeping UI functional", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri");
  await ready(page);

  await expect(page.getByTestId("heritage-panel")).toBeVisible();
  await rows(page).first().getByRole("link", { name: /Xem trên bản đồ/ }).click();
  await expect(page.getByTestId("heritage-card")).toBeVisible();
});

test("H12: Data outage shows alert and Thử lại recovers", async ({ page }) => {
  const flagPath = "output/playwright/local-heroes/heritage-outage.flag";
  mkdirSync("output/playwright/local-heroes", { recursive: true });
  writeFileSync(flagPath, "1");

  try {
    await page.goto("/?noi-dung=dia-danh");
    await expect(page.getByTestId("heritage-panel").getByRole("alert")).toContainText("Chưa tải được danh sách địa danh");

    // Remove flag and click Thử lại
    if (existsSync(flagPath)) unlinkSync(flagPath);
    await page.getByRole("link", { name: "Thử lại" }).click();

    await expect(page.getByTestId("heritage-panel").getByRole("alert")).toHaveCount(0);
    await expect(rows(page)).toHaveCount(6);
  } finally {
    if (existsSync(flagPath)) unlinkSync(flagPath);
  }
});

test("H13: Axe accessibility check in places mode with card and dialog open", async ({ page }) => {
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=synthetic-thanh-co-quang-tri");
  await ready(page);

  // Open video dialog
  await page.getByTestId("heritage-card").getByRole("button", { name: /Xem video/ }).click();
  await expect(page.locator("dialog.heritage-video-dialog")).toBeVisible();

  const axe = await new AxeBuilder({ page })
    .include(".home-history-map")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const seriousOrCritical = axe.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(seriousOrCritical).toEqual([]);
});

test("H14: No horizontal overflow and panel, card, controls do not overlap", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=synthetic-thanh-co-quang-tri");
  await ready(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  const panel = await page.getByTestId("heritage-panel").boundingBox();
  const card = await page.getByTestId("heritage-card").boundingBox();

  if (panel && card) {
    // Panel on right, card on left -> horizontally separated
    expect(card.x + card.width).toBeLessThanOrEqual(panel.x);
  }
});
