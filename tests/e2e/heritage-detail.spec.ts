import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";

const thumbnail = readFileSync("tests/e2e/fixtures/local-heroes/thumbnail.svg");

test.beforeEach(async ({ page, context }) => {
  page.on("pageerror", (error) => {
    throw error;
  });

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

test("P1: Story renders in order; citation [1] jumps to #nguon-1; source list shows locator and date", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  const storyHeading = page.getByRole("heading", { name: "Câu chuyện", exact: true });
  await expect(storyHeading).toBeVisible();

  // Verify section headings in order
  const sections = page.locator("section[aria-labelledby='cau-chuyen'] h3");
  await expect(sections.nth(0)).toHaveText("Synthetic Lịch sử xây dựng thành cổ");
  await expect(sections.nth(1)).toHaveText("Synthetic 81 ngày đêm máu và hoa mùa hè năm 1972");
  await expect(sections.nth(2)).toHaveText("Synthetic Ước tính số lượng bom đạn trút xuống");

  // Citation link [1] jumps to #nguon-1
  const citation1 = page.locator("a[href='#nguon-1']").first();
  await expect(citation1).toBeVisible();
  await expect(citation1).toHaveText("[1]");

  // Source list shows locator and accessed date
  const source1 = page.locator("#nguon-1");
  await expect(source1).toBeVisible();
  await expect(source1).toContainText("Synthetic Lịch sử Đảng bộ tỉnh Quảng Trị");
  await expect(source1).toContainText("tr. 142");
  await expect(source1).toContainText("Đã truy cập: 2026-10-25");
});

test("P2: Approximate section shows its note", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  const note = page.locator("text=Lưu ý về độ xác thực: Synthetic số liệu ước tính");
  await expect(note).toBeVisible();
});

test("P3: Videos render lazily (0 iframes until play)", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  const videoSection = page.locator("section[aria-labelledby='video']");
  await expect(videoSection).toBeVisible();

  // 0 iframes initially
  await expect(videoSection.locator("iframe")).toHaveCount(0);

  // Press play
  const playBtn = videoSection.getByRole("button", { name: /Phát video/ }).first();
  await playBtn.click();

  // Now 1 iframe
  await expect(videoSection.locator("iframe")).toHaveCount(1);
});

test("P4: Tier, locality and period badges are visible", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  await expect(page.locator(".heritage-badge.is-grade12")).toHaveText("Lớp 12");
  await expect(page.getByText("Thuộc Tỉnh Quảng Trị — địa giới hành chính 2025")).toBeVisible();
  await expect(page.getByText("28/6 – 16/9/1972")).toBeVisible();
});

test("P5: The return link equals validated kham-pha; malicious/unknown falls back to /?noi-dung=dia-danh", async ({ page }) => {
  // Valid return link
  const validUrl = "/dia-diem/synthetic-thanh-co-quang-tri?kham-pha=" + encodeURIComponent("/?noi-dung=dia-danh&dia-phuong=quang-tri");
  await page.goto(validUrl);
  const returnLink = page.getByRole("link", { name: "Trở lại địa danh theo địa phương" });
  await expect(returnLink).toBeVisible();
  expect(returnLink).toHaveAttribute("href", "/?noi-dung=dia-danh&dia-phuong=quang-tri");

  // Malicious return link
  const evilUrl = "/dia-diem/synthetic-thanh-co-quang-tri?kham-pha=" + encodeURIComponent("//evil.com");
  await page.goto(evilUrl);
  await expect(page.getByRole("link", { name: "Trở lại địa danh theo địa phương" })).toHaveAttribute("href", "/?noi-dung=dia-danh");

  // Unknown param return link
  const unknownUrl = "/dia-diem/synthetic-thanh-co-quang-tri?kham-pha=" + encodeURIComponent("/?unknown_key=1");
  await page.goto(unknownUrl);
  await expect(page.getByRole("link", { name: "Trở lại địa danh theo địa phương" })).toHaveAttribute("href", "/?noi-dung=dia-danh");
});

test("P6: Related people (max 4) link to /nhan-vat/...", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  const aside = page.locator("aside");
  const peopleSection = aside.locator("section[aria-labelledby='nhan-vat-dia-phuong']");
  if (await peopleSection.count() > 0) {
    const links = peopleSection.locator("a[href^='/nhan-vat/']");
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(4);
  }
});

test("P7: A legacy location without heritage data still renders exactly as before", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-legacy-location");

  await expect(page.getByRole("heading", { name: "Giới thiệu" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sự kiện tại địa điểm này" })).toBeVisible();

  // No heritage story or video sections
  await expect(page.locator("section[aria-labelledby='cau-chuyen']")).toHaveCount(0);
  await expect(page.locator("section[aria-labelledby='video']")).toHaveCount(0);
  await expect(page.locator(".heritage-badge")).toHaveCount(0);
});

test("P8: Axe accessibility check on heritage place detail page", async ({ page }) => {
  await page.goto("/dia-diem/synthetic-thanh-co-quang-tri");

  const axe = await new AxeBuilder({ page })
    .exclude(".leaflet-container")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();

  const seriousOrCritical = axe.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(seriousOrCritical).toEqual([]);
});

test("P9: Broken cover shows placeholder, removes broken img and disables lightbox", async ({ page, context }) => {
  await context.route("https://example.invalid/broken.jpg**", (route) =>
    route.fulfill({ status: 404, contentType: "text/plain", body: "Not found" }),
  );

  await page.goto("/dia-diem/synthetic-doi-a1");

  // Cover placeholder visible with text
  const fallback = page.locator("[data-image-fallback='true']");
  await expect(fallback.first()).toBeVisible();
  await expect(fallback.first()).toContainText("Ảnh đang được cập nhật");

  // No img element inside the cover
  const coverImgs = await page.locator(".relative.isolate.overflow-hidden.rounded-card img").all();
  expect(coverImgs).toHaveLength(0);

  // Lightbox trigger button is absent for the cover
  const lightboxButton = page.locator(".rounded-card button[aria-label*='Xem ảnh lớn']");
  await expect(lightboxButton).toHaveCount(0);
});
