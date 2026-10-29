import { mkdirSync } from "node:fs";
import path from "node:path";
import type { Page } from "@playwright/test";
import { expect, test } from "./refinement-test";

// Run with the explicit local read-only catalog fixture; no draft data is merged into app code.
const output = path.resolve("output/playwright/journey-timeline");
test.beforeAll(() => mkdirSync(output, { recursive: true }));

async function activateYear(page: Page, year: number) {
  const direct = page.locator(`[data-testid="map-time-controls"] [data-year="${year}"]`);
  if (await direct.isVisible()) {
    await direct.focus();
    await page.keyboard.press("Enter");
    return;
  }
  // If year is grouped, click the group button to open the year picker
  const group = page.locator(`[data-testid="map-time-controls"] button[aria-label*="${year}"]`);
  if ((await group.count()) > 0) {
    await group.first().click();
    const popupYear = page.locator(`[data-testid="map-time-controls"] [data-year="${year}"]`);
    await popupYear.waitFor({ state: "visible" });
    await popupYear.focus();
    await page.keyboard.press("Enter");
    return;
  }
  await direct.click();
}

for (const viewport of [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
]) {
  test(`every year, overlap, same-year identity and detail return ${viewport.width}x${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/?tu=1980&den=2019");

    // Rail has markers and is at most 76px high
    const timeControls = page.getByTestId("map-time-controls");
    await expect(timeControls).toBeVisible();
    const box = await timeControls.boundingBox();
    expect(box?.height).toBeLessThanOrEqual(76);

    const railItems = page.locator('[data-testid="map-time-controls"] [data-rail-key]');
    expect(await railItems.count()).toBeGreaterThan(4);

    await activateYear(page, 2008);
    await expect(page.getByTestId("timeline-visible-count")).toHaveText("1 sự kiện");
    await expect.poll(() => new URL(page.url()).searchParams.get("tu")).toBe("2008");

    await activateYear(page, 2009);
    await expect(page.getByTestId("timeline-visible-count")).toHaveText("2 sự kiện");

    await page.getByRole("button", { name: /Chọn từng sự kiện|Danh sách/ }).click();
    await expect(page.getByTestId("explorer-event-item")).toHaveCount(2);

    const selected = page
      .getByTestId("explorer-event-link")
      .filter({ hasText: "Synthetic second event 2009" });
    await selected.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Synthetic second event 2009");

    const back = page.locator('a[href*="tu=2009"]').first();
    await back.click();
    await expect(page.getByTestId("map-time-controls")).toBeVisible();
    await expect.poll(() => new URL(page.url()).searchParams.get("den")).toBe("2009");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
    ).toBe(true);
    await page.screenshot({
      path: path.join(output, `all-year-navigation-${viewport.width}x${viewport.height}.png`),
    });
  });
}

test("normalized shared bounds, empty ranges, reset and published identity across public routes", async ({
  page,
}) => {
  await page.goto("/?tu=2030&den=2025");
  await expect.poll(() => new URL(page.url()).searchParams.get("tu")).toBe("2019");
  await activateYear(page, 2019);

  await page.goto("/?tu=2005&den=2004");
  await expect(page.getByTestId("timeline-visible-count")).toHaveText("0 sự kiện");
  await expect(
    page.getByText("Không có sự kiện trong khoảng năm này.", { exact: false }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Toàn bộ", exact: true }).click();
  await expect(page.getByTestId("timeline-visible-count")).not.toHaveText("0 sự kiện");

  await activateYear(page, 2019);
  await page.getByRole("button", { name: /Chọn từng sự kiện|Danh sách/ }).click();
  await expect(page.getByTestId("explorer-event-link")).toContainText("CPTPP");

  await page.getByRole("link", { name: "Xem toàn bộ dòng thời gian →", exact: true }).click();
  await expect(
    page.locator('a[href*="/su-kien/cptpp-co-hieu-luc-voi-viet-nam-2019"]').first(),
  ).toBeVisible();

  await page.goto("/tra-cuu?q=CPTPP");
  await expect(
    page.locator('a[href*="/su-kien/cptpp-co-hieu-luc-voi-viet-nam-2019"]').first(),
  ).toBeVisible();

  await page.goto("/su-kien/synthetic-unpublished-draft");
  await expect(page.getByRole("heading", { name: /Không tìm thấy/ })).toBeVisible();
});

for (const event of [
  { year: 2007, slug: "viet-nam-gia-nhap-wto-2007", title: "WTO", sourceHost: "www.wto.org" },
  { year: 2019, slug: "cptpp-co-hieu-luc-voi-viet-nam-2019", title: "CPTPP", sourceHost: "moit.gov.vn" },
]) {
  test(`reviewed later-period event ${event.year}: home, detail, original source and restored range`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`/?tu=${event.year}&den=${event.year}`);
    await page.getByRole("button", { name: /Chọn từng sự kiện|Danh sách/ }).click();
    await page.getByTestId("explorer-event-link").filter({ hasText: event.title }).click();
    await expect(page).toHaveURL(new RegExp(`/su-kien/${event.slug}`));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(event.title);
    const original = page.getByRole("link", { name: "Xem nguồn gốc", exact: true });
    await expect(original.first()).toBeVisible();
    expect(
      await original.evaluateAll((links) =>
        links.map((link) => new URL((link as HTMLAnchorElement).href).hostname),
      ),
    ).toContain(event.sourceHost);
    await page.screenshot({
      path: path.join(output, `reviewed-event-sources-${event.year}.png`),
      fullPage: true,
    });
    await page.getByRole("link", { name: "← Trở lại bản đồ", exact: true }).click();
    await expect(page.getByTestId("map-time-controls")).toBeVisible();
    expect(new URL(page.url()).searchParams.get("tu")).toBe(String(event.year));
    expect(new URL(page.url()).searchParams.get("den")).toBe(String(event.year));
  });
}
