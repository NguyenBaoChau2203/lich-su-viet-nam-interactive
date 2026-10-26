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
});
