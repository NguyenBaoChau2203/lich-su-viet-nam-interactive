import { mkdirSync } from "node:fs";
import path from "node:path";
import { expect, test } from "./refinement-test";

// Task 07 verifies authored content through the existing reader. No chooser,
// camera, flight, dwell or source-publication fixture is introduced here.
const output = path.resolve("output/playwright/explorer-refinement/task-07");
const sequences = [
  { id: "mua-thu-doc-lap-1945", first: "ha-noi-1945", last: "ba-dinh-1945", title: "Hà Nội giành chính quyền", count: 4 },
  { id: "khang-chien-chong-phap-1946-1954", first: "ha-noi-1946", last: "geneve-1954", title: "Toàn quốc kháng chiến", count: 5 },
  { id: "mua-xuan-1975", first: "buon-ma-thuot-1975", last: "sai-gon-1975", title: "Tiến công Buôn Ma Thuột", count: 4 },
] as const;
const sizes = [
  { width: 1280, height: 720 }, { width: 1366, height: 768 },
  { width: 1440, height: 900 }, { width: 1920, height: 1080 },
];
const href = (id: string, stop: string) => `/?tu=1954&den=1975&hanh-trinh=${id}&moc=${stop}`;
const detailSlugs: Record<string, string> = {
  "ha-noi-1945": "tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi",
  "ba-dinh-1945": "tuyen-ngon-doc-lap",
  "dien-bien-phu-1954": "chien-dich-dien-bien-phu",
  "geneve-1954": "hiep-dinh-geneve-ve-dong-duong",
  "sai-gon-1975": "chien-dich-ho-chi-minh",
};

for (const size of sizes) {
  for (const sequence of sequences) {
    test(`content shared URL opens paused: ${sequence.id} at ${size.width}x${size.height}`, async ({ page }) => {
      await page.setViewportSize(size);
      await page.goto(href(sequence.id, sequence.first));
      const panel = page.getByTestId("journey-panel");
      await expect(panel.getByRole("heading", { name: sequence.title, exact: true })).toBeVisible();
      await expect(page.getByTestId("globe-map")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
      await expect(panel).toContainText("Đang tạm dừng");
      await expect(page.getByTestId("journey-timeline").getByRole("link")).toHaveCount(sequence.count);
      await expect(page.getByRole("button", { name: "Tạm dừng hành trình", exact: true })).toHaveCount(0);
      await page.waitForTimeout(2200);
      expect(new URL(page.url()).searchParams.get("moc")).toBe(sequence.first);
      await page.reload();
      await expect(panel.getByRole("heading", { name: sequence.title, exact: true })).toBeVisible();
      await expect(panel).toContainText("Đang tạm dừng");
      expect(new URL(page.url()).searchParams.get("hanh-trinh")).toBe(sequence.id);
      await panel.locator(".journey-sources summary").click();
      await expect(panel.locator(".journey-sources a").first()).toBeVisible();
      await expect(panel).toContainText(/không/i);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      mkdirSync(output, { recursive: true });
      await page.screenshot({ path: path.join(output, `${sequence.id}-${size.width}x${size.height}.png`) });
    });
  }
}

test("1945 chronology returns to the distinct Ba Dinh anchor and history remains paused", async ({ page }) => {
  await page.goto(href("mua-thu-doc-lap-1945", "ha-noi-1945"));
  const panel = page.getByTestId("journey-panel");
  await expect(panel).toContainText("Nhà hát Lớn");
  for (const [stop, title] of [["hue-1945", "Huế giành chính quyền"], ["sai-gon-1945", "Sài Gòn giành chính quyền"], ["ba-dinh-1945", "Tuyên bố nền độc lập"]]) {
    await page.getByRole("button", { name: "Mốc tiếp", exact: true }).click();
    await expect(panel.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe(stop);
  }
  await expect(panel).toContainText("Quảng trường Ba Đình");
  await expect(page.getByTestId("journey-timeline").locator('[aria-current="step"]')).toContainText("Quảng trường Ba Đình");
  await expect.poll(() => new URL(page.url()).searchParams.get("ban-do")?.split(",").slice(0, 2)).toEqual(["21.0369", "105.8342"]);
  await page.reload();
  await expect(panel.getByRole("heading", { name: "Tuyên bố nền độc lập", exact: true })).toBeVisible();
  await expect(panel).toContainText("Đang tạm dừng");
  await page.getByRole("button", { name: "Mốc trước", exact: true }).click();
  await expect(panel.getByRole("heading", { name: "Sài Gòn giành chính quyền", exact: true })).toBeVisible();
});

test("new content links only to the live public inventory and source-only stops have no detail link", async ({ page }) => {
  await page.goto("/");
  const publicLinks = await page.getByTestId("explorer-event-link").evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).pathname));
  expect(publicLinks.length).toBeGreaterThan(0);
  for (const sequence of sequences) {
    await page.goto(href(sequence.id, sequence.first));
    const timeline = page.getByTestId("journey-timeline");
    await expect(timeline.getByRole("link")).toHaveCount(sequence.count);
    const stops = await timeline.getByRole("link").evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
    for (const stop of stops) {
      await page.goto(stop);
      const panel = page.getByTestId("journey-panel");
      await expect(panel).toBeVisible();
      const detail = panel.getByRole("link", { name: /Xem chi tiết sự kiện/ });
      const selected = new URL(page.url()).searchParams.get("moc")!;
      const expectedPathname = detailSlugs[selected] ? `/su-kien/${detailSlugs[selected]}` : undefined;
      if (expectedPathname && publicLinks.includes(expectedPathname)) {
        await expect(detail).toHaveCount(1);
        const pathname = new URL((await detail.getAttribute("href"))!, page.url()).pathname;
        expect(pathname).toBe(expectedPathname);
        const response = await page.request.get(pathname);
        expect(response.status()).toBe(200);
      } else {
        await expect(detail).toHaveCount(0);
      }
      await panel.locator(".journey-sources summary").click();
      const coordinateHref = await panel.getByRole("link", { name: /Nguồn tọa độ/ }).getAttribute("href");
      if (coordinateHref!.startsWith("/dia-diem/")) {
        expect((await page.request.get(coordinateHref!)).status()).toBe(200);
      }
    }
  }
});

test("a foreign-city stop recovers only within the selected new journey", async ({ page }) => {
  await page.goto(href("mua-xuan-1975", "hue-1945"));
  await expect(page.getByTestId("journey-notice")).toContainText("Đã mở mốc đầu tiên");
  await expect(page.getByTestId("journey-panel")).toContainText("Tiến công Buôn Ma Thuột");
  await expect.poll(() => new URL(page.url()).searchParams.get("moc")).toBe("buon-ma-thuot-1975");
  await expect(page.getByTestId("journey-panel")).toContainText("Đang tạm dừng");
});

test("source-only new milestones and native source disclosure work by keyboard without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const page = await context.newPage();
    await page.goto(href("mua-xuan-1975", "buon-ma-thuot-1975"));
    const panel = page.getByTestId("journey-panel");
    await expect(panel.getByRole("heading", { name: "Tiến công Buôn Ma Thuột", exact: true })).toBeVisible();
    await expect(panel).toContainText("11/3");
    const next = page.getByTestId("journey-timeline").getByRole("link", { name: /Huế/ });
    await next.click();
    await expect(panel.getByRole("heading", { name: "Giải phóng Huế", exact: true })).toBeVisible();
    await panel.locator(".journey-sources summary").focus();
    await page.keyboard.press("Enter");
    await expect(panel.locator(".journey-sources")).toHaveAttribute("open", "");
    await expect(panel.getByRole("link", { name: "Báo Điện tử Chính phủ · nguồn Bộ Quốc phòng / QĐND", exact: true })).toBeVisible();
  } finally { await context.close(); }
});
