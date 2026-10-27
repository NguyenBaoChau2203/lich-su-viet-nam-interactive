import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");
const diagnostics = new WeakMap<Page, { kind: string; path?: string; status?: number; message?: string }[]>();

test.beforeEach(async ({ page, context }) => {
  const events: NonNullable<ReturnType<typeof diagnostics.get>> = [];
  diagnostics.set(page, events);
  page.on("pageerror", (error) => events.push({ kind: "pageerror", message: error.message }));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      events.push({
        kind: `console-${message.type()}`,
        message: message.text().replace(/https?:\/\/[^\s"'<>]+/gu, (val) => {
          try { return new URL(val).pathname; } catch { return "[URL]"; }
        }).slice(0, 800),
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
  page.on("requestfailed", (request) => {
    events.push({ kind: "requestfailed", path: new URL(request.url()).pathname, message: request.failure()?.errorText });
  });

  await page.addInitScript(() => {
    localStorage.setItem("ls12:da-xem-huong-dan", "1");
    sessionStorage.setItem("ls12:globe-intro-seen", "1");
  });

  await context.route("**/_next/image?**", (route) => {
    if (route.request().url().includes("broken")) {
      return route.fulfill({ status: 503, contentType: "text/plain", body: "Synthetic image unavailable" });
    }
    return route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail });
  });

  await context.route("https://example.invalid/**", (route) => {
    if (route.request().url().includes("broken")) {
      return route.fulfill({ status: 503, contentType: "text/plain", body: "Synthetic image unavailable" });
    }
    return route.fulfill({ status: 200, contentType: "image/svg+xml", body: thumbnail });
  });
});

test.afterEach(async ({ page }, info) => {
  const events = diagnostics.get(page) ?? [];
  await info.attach("console-network-diagnostics", {
    contentType: "application/json",
    body: JSON.stringify(events, null, 2),
  });
  mkdirSync("output/playwright/local-heroes/diagnostics", { recursive: true });
  writeFileSync(
    `output/playwright/local-heroes/diagnostics/${info.project.name}-${info.title.replace(/[^a-z0-9]+/giu, "-").slice(0, 90)}.json`,
    JSON.stringify(events, null, 2),
  );
  expect(events.filter((e) => e.kind === "pageerror")).toEqual([]);
});

test("figure detail renders sourced stories, citations, and locality roles in logical heading order", async ({ page }) => {
  const returnUrl = encodeURIComponent("/?noi-dung=nhan-vat&dia-phuong=ha-noi&q-nhan-vat=%C4%90%E1%BA%B7ng");
  await page.goto(`/nhan-vat/synthetic-person-01?kham-pha=${returnUrl}`);

  // Heading hierarchy
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("Đặng Nhân Vật Giả");

  // Sections
  await expect(page.getByRole("heading", { name: "Đóng góp tiêu biểu", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Gắn với địa phương", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Câu chuyện lịch sử", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nguồn tham khảo", exact: true })).toBeVisible();

  // Story presentation
  const storyHeading = page.getByRole("heading", { level: 3, name: "Câu chuyện kiểm thử" });
  await expect(storyHeading).toBeVisible();
  await expect(page.getByText("Truyện chính", { exact: true })).toBeVisible();

  // Citation link inside story
  const citationLink = page.getByRole("link", { name: /Chú thích nguồn:/i });
  await expect(citationLink).toBeVisible();
  await expect(citationLink).toHaveAttribute("href", "#nguon-synthetic-source");

  // Locality roles distinguishing qualifying vs commemoration
  await expect(page.getByText("Quê quán", { exact: false })).toBeVisible();
  await expect(page.getByText("Quan hệ tưởng niệm / bổ sung", { exact: false })).toBeVisible();

  // Source list anchored
  const sourceItem = page.locator("#nguon-synthetic-source");
  await expect(sourceItem).toBeVisible();
  await expect(sourceItem).toContainText("Synthetic archive");

  // No horizontal overflow
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);

  // Capture screenshot
  mkdirSync("output/playwright/local-heroes/screenshots", { recursive: true });
  await page.screenshot({
    path: `output/playwright/local-heroes/screenshots/detail-${page.viewportSize()!.width}x${page.viewportSize()!.height}.png`,
  });
});

test("broken image does not remove stories, credits, or return navigation", async ({ page }) => {
  // synthetic-person-02 uses broken image URL
  await page.goto("/nhan-vat/synthetic-person-02?kham-pha=%2F%3Fnoi-dung%3Dnhan-vat");

  // Title and stories are intact
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Câu chuyện lịch sử" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nguồn tham khảo" })).toBeVisible();

  // Image credit or caption remains present
  await expect(page.getByText("Tư liệu bối cảnh", { exact: false })).toBeVisible();

  // Return link remains interactive
  const returnLink = page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true });
  await expect(returnLink).toBeVisible();
  await returnLink.click();
  await expect(page).toHaveURL(/\/\?noi-dung=nhan-vat/);
});

test("safe return rejects malicious return links and restores exact people state", async ({ page }) => {
  // 1. Malicious external return link is neutralized to safe people home
  await page.goto("/nhan-vat/synthetic-person-01?kham-pha=https%3A%2F%2Fmalicious.invalid%2Fattack");
  const returnLink = page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true });
  await expect(returnLink).toHaveAttribute("href", "/?noi-dung=nhan-vat");

  // 2. Protocol-relative link is neutralized
  await page.goto("/nhan-vat/synthetic-person-01?kham-pha=%2F%2Fmalicious.invalid%2Fattack");
  await expect(page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true })).toHaveAttribute("href", "/?noi-dung=nhan-vat");

  // 3. Admin return link is neutralized
  await page.goto("/nhan-vat/synthetic-person-01?kham-pha=%2Fquan-tri%2Fnoi-bo");
  await expect(page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true })).toHaveAttribute("href", "/?noi-dung=nhan-vat");

  // 4. Valid rich return link preserves locality, search query, page and map state
  const validTarget = "/?noi-dung=nhan-vat&dia-phuong=ha-noi&q-nhan-vat=Dang&ban-do=21,105,5";
  await page.goto(`/nhan-vat/synthetic-person-01?kham-pha=${encodeURIComponent(validTarget)}`);
  await page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true }).click();
  await expect(page).toHaveURL(/\/\?.*noi-dung=nhan-vat/);
  await expect(page).toHaveURL(/dia-phuong=ha-noi/);
  await expect(page).toHaveURL(/q-nhan-vat=Dang/);
  await expect(page).toHaveURL(/ban-do=21(%2C|,)105(%2C|,)5/);
  await expect(page.getByLabel("Địa phương tham chiếu")).toHaveValue("ha-noi");
});

test("accessibility: zero axe violations and full keyboard accessibility on detail", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/nhan-vat/synthetic-person-01?kham-pha=%2F%3Fnoi-dung%3Dnhan-vat");

  // Keyboard navigation & focus
  const returnTop = page.getByRole("link", { name: "← Trở lại nhân vật theo địa phương", exact: true });
  await returnTop.focus();
  await expect(returnTop).toBeFocused();
  const outline = await returnTop.evaluate((node) => getComputedStyle(node).outlineStyle);
  expect(outline).not.toBe("none");

  // Axe accessibility audit
  const axe = await new AxeBuilder({ page })
    .include("article")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  mkdirSync("output/playwright/local-heroes/accessibility", { recursive: true });
  writeFileSync(
    `output/playwright/local-heroes/accessibility/detail-${page.viewportSize()!.width}x${page.viewportSize()!.height}.json`,
    JSON.stringify(
      {
        viewport: page.viewportSize(),
        tags: ["wcag2a", "wcag2aa", "wcag21aa"],
        violations: axe.violations,
        passedRules: axe.passes.map((r) => r.id),
      },
      null,
      2,
    ),
  );
  expect(axe.violations).toEqual([]);
});
