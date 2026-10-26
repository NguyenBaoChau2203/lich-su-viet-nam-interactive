import { expect, test } from "@playwright/test";
import { hasHorizontalOverflow } from "./support";

const TARGET_SLUGS = [
  "chien-dich-dien-bien-phu",
  "chien-dich-ho-chi-minh-1975",
];

const VIEWPORTS = [
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

test.describe("Lesson layout regression tests", () => {
  // L1: No horizontal overflow
  for (const slug of TARGET_SLUGS) {
    for (const vp of VIEWPORTS) {
      test(`[L1] ${slug} - no horizontal overflow at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
        await page.waitForTimeout(500);

        const overflow = await hasHorizontalOverflow(page);
        expect(overflow, `Horizontal overflow detected on ${slug} at ${vp.name}`).toBe(false);
      });
    }

    test(`[L1] ${slug} - no horizontal overflow at 1440x900 (dark theme)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.emulateMedia({ colorScheme: "dark" });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const overflow = await hasHorizontalOverflow(page);
      expect(overflow, `Horizontal overflow detected on ${slug} at 1440x900 dark`).toBe(false);
    });
  }

  // L2: Content column width >= 900px at 1440x900 and aligned block edges (+-2px)
  for (const slug of TARGET_SLUGS) {
    test(`[L2] ${slug} - content column width >= 900px and aligned edges at 1440x900`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const contentCol = document.querySelector(".lg\\:grid > .min-w-0");
        if (!contentCol) throw new Error("Content column not found");
        const colRect = contentCol.getBoundingClientRect();

        const selectors = [
          { name: "GoalBox", sel: "section:has(ul.list-disc)" },
          { name: "KeyDates", sel: "ol.lesson-timeline" },
          { name: "BattleGrid", sel: "section[aria-labelledby='dien-bien-tieu-de'] .grid" },
          { name: "ResultsBand", sel: "section[aria-labelledby='ket-qua'] > ul" },
          { name: "FiguresList", sel: "section[aria-labelledby='nhan-vat'] > ul" },
          { name: "TabsRoot", sel: "section[aria-labelledby='tu-lieu'] > div" },
          { name: "FlashcardsList", sel: "section[aria-labelledby='ghi-nho'] > ul" },
        ];

        const blocks: { name: string; left: number; right: number; width: number }[] = [];
        for (const item of selectors) {
          const el = document.querySelector(item.sel);
          if (el) {
            const r = el.getBoundingClientRect();
            blocks.push({
              name: item.name,
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
            });
          }
        }

        return {
          colWidth: colRect.width,
          colLeft: colRect.left,
          colRight: colRect.right,
          blocks,
        };
      });

      expect(metrics.colWidth, `Content column width ${metrics.colWidth} should be >= 900px`).toBeGreaterThanOrEqual(900);

      // Verify blocks align with each other within +-2px tolerance
      // If at Phase 1 some blocks are not redesigned yet, log or verify available blocks
      const baseLeft = metrics.blocks[0]?.left;
      const baseRight = metrics.blocks[0]?.right;

      for (const block of metrics.blocks) {
        expect(
          Math.abs(block.left - baseLeft),
          `Block ${block.name} left (${block.left}) aligns with base left (${baseLeft})`
        ).toBeLessThanOrEqual(2);
        expect(
          Math.abs(block.right - baseRight),
          `Block ${block.name} right (${block.right}) aligns with base right (${baseRight})`
        ).toBeLessThanOrEqual(2);
      }
    });
  }

  // L3: Hero stats right edge within 40px of container right edge at >=1366; CTA visible at 1280x720
  for (const slug of TARGET_SLUGS) {
    test(`[L3] ${slug} - hero stats right edge within 40px at 1366x768`, async ({ page }) => {
      await page.setViewportSize({ width: 1366, height: 768 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const stats = document.querySelector("ul[aria-label='Số liệu chính']");
        const container = stats?.closest(".max-w-\\[80rem\\]");
        if (!stats || !container) throw new Error("Stats or container not found");
        const sRect = stats.getBoundingClientRect();
        const cRect = container.getBoundingClientRect();
        return {
          diff: Math.abs(cRect.right - sRect.right),
          statsRight: sRect.right,
          containerRight: cRect.right,
        };
      });

      expect(metrics.diff, `Stats right (${metrics.statsRight}) vs container right (${metrics.containerRight})`).toBeLessThanOrEqual(40);
    });

    test(`[L3] ${slug} - hero CTA buttons visible without scrolling at 1280x720`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const ctaBottom = await page.evaluate(() => {
        const cta = document.querySelector("a[href='#dien-bien']");
        if (!cta) throw new Error("CTA button not found");
        return cta.getBoundingClientRect().bottom;
      });

      expect(ctaBottom, `CTA bottom (${ctaBottom}) must be <= 720px`).toBeLessThanOrEqual(720);
    });
  }

  // L4: KeyDates balanced columns - number of items in last visual row
  for (const slug of TARGET_SLUGS) {
    test(`[L4] ${slug} - KeyDates balanced timeline rows at 1440x900`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const result = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll("ol.lesson-timeline > li.lesson-timeline__item"));
        if (items.length === 0) throw new Error("No timeline items found");

        const rows: { top: number; count: number }[] = [];
        for (const item of items) {
          const top = Math.round(item.getBoundingClientRect().top);
          const existingRow = rows.find((r) => Math.abs(r.top - top) <= 4);
          if (existingRow) {
            existingRow.count++;
          } else {
            rows.push({ top, count: 1 });
          }
        }

        const totalItems = items.length;
        const firstRowCount = rows[0]?.count || 1;
        const lastRowCount = rows[rows.length - 1]?.count || 0;
        const expectedLast = totalItems % firstRowCount === 0 ? firstRowCount : totalItems % firstRowCount;

        return {
          totalItems,
          firstRowCount,
          lastRowCount,
          expectedLast,
          rowCount: rows.length,
        };
      });

      expect(
        result.lastRowCount,
        `Last row count (${result.lastRowCount}) must equal expected (${result.expectedLast}) for ${result.totalItems} items across ${result.firstRowCount} columns`
      ).toBe(result.expectedLast);
    });
  }

  // L5: Sticky map visibility when scrolling to last step button
  for (const slug of TARGET_SLUGS) {
    test(`[L5] ${slug} - sticky map fully visible when scrolled to last step`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      // Scroll so the last step button is at the bottom of the viewport
      const lastStepBtn = page.locator("nav[aria-label='Các bước diễn biến'] button").last();
      const btnBox = await lastStepBtn.boundingBox();
      if (btnBox) {
        const deltaY = btnBox.y + btnBox.height - 900;
        await page.mouse.wheel(0, deltaY);
        await page.waitForTimeout(400);
      }

      const mapBox = await page.locator("[role='region'][aria-label^='Bản đồ mô phỏng']").boundingBox();
      expect(mapBox, "Map region bounding box must exist").not.toBeNull();

      if (mapBox) {
        expect(mapBox.y, `Map region top (${mapBox.y}) must be >= 64px`).toBeGreaterThanOrEqual(64);
        expect(
          mapBox.y + mapBox.height,
          `Map region bottom (${mapBox.y + mapBox.height}) must be <= window height (900)`
        ).toBeLessThanOrEqual(900);
      }
    });

    test(`[L6] ${slug} - warning callout width equals content width (+-2px)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const widths = await page.evaluate(() => {
        const contentCol = document.querySelector(".lg\\:grid > .min-w-0");
        const callout = document.querySelector("section[aria-labelledby='dien-bien-tieu-de'] [data-callout-variant='warning'], section[aria-labelledby='dien-bien-tieu-de'] .border-warning, section[aria-labelledby='dien-bien-tieu-de'] .rounded-card.border-warning\\/40");
        if (!contentCol || !callout) throw new Error("Content column or callout not found");
        return {
          colWidth: Math.round(contentCol.getBoundingClientRect().width),
          calloutWidth: Math.round(callout.getBoundingClientRect().width),
        };
      });

      expect(
        Math.abs(widths.calloutWidth - widths.colWidth),
        `Callout width (${widths.calloutWidth}) equals content column width (${widths.colWidth})`
      ).toBeLessThanOrEqual(2);
    });
  }
});
