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

  // L7: No clipping on flip cards (front and back faces)
  for (const slug of TARGET_SLUGS) {
    test(`[L7] ${slug} - no clipping on flip cards (front and back)`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const clippingIssues = await page.evaluate(() => {
        const faces = Array.from(document.querySelectorAll<HTMLElement>(".flip-card__face"));
        const issues: { text: string; scrollHeight: number; clientHeight: number }[] = [];
        for (const face of faces) {
          if (face.scrollHeight > face.clientHeight + 1) {
            issues.push({
              text: (face.textContent || "").slice(0, 40).replace(/\s+/g, " "),
              scrollHeight: face.scrollHeight,
              clientHeight: face.clientHeight,
            });
          }
        }
        return issues;
      });

      expect(clippingIssues, `Clipping found in flip card faces: ${JSON.stringify(clippingIssues)}`).toEqual([]);
    });
  }

  // L8: Figures card tops and bottoms are equal within row (+-2px)
  for (const slug of TARGET_SLUGS) {
    test(`[L8] ${slug} - figures card tops and bottoms are equal within row`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const rowMismatches = await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll<HTMLElement>("section[aria-labelledby='nhan-vat'] ul > li button.flip-card"));
        if (cards.length === 0) return [{ error: "No figure cards found" }];

        const rows: { top: number; bottom: number; items: { name: string; top: number; bottom: number }[] }[] = [];
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const top = Math.round(r.top);
          const bottom = Math.round(r.bottom);
          const name = (card.textContent || "").slice(0, 25).trim();

          const existingRow = rows.find((row) => Math.abs(row.top - top) <= 4);
          if (existingRow) {
            existingRow.items.push({ name, top, bottom });
          } else {
            rows.push({ top, bottom, items: [{ name, top, bottom }] });
          }
        }

        const errors: string[] = [];
        for (const row of rows) {
          if (row.items.length <= 1) continue;
          const baseBottom = row.items[0].bottom;
          const baseTop = row.items[0].top;
          for (const item of row.items) {
            if (Math.abs(item.top - baseTop) > 2) {
              errors.push(`Top mismatch in row: ${item.name} top=${item.top} vs base=${baseTop}`);
            }
            if (Math.abs(item.bottom - baseBottom) > 2) {
              errors.push(`Bottom mismatch in row: ${item.name} bottom=${item.bottom} vs base=${baseBottom}`);
            }
          }
        }
        return errors;
      });

      expect(rowMismatches, `Figure card alignment mismatches: ${rowMismatches.join(", ")}`).toEqual([]);
    });
  }

  // L9: Video tab: all video frames have equal width (+-1px); empty area under any column <= 48px
  for (const slug of TARGET_SLUGS) {
    test(`[L9] ${slug} - video tab equal widths and aligned bottoms at 1440x900`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const videoTab = page.locator("[data-resource='video']");
      if ((await videoTab.count()) > 0) {
        const metrics = await page.evaluate(() => {
          const frames = Array.from(document.querySelectorAll("[data-resource='video'] figure .aspect-video"));
          const figs = Array.from(document.querySelectorAll("[data-resource='video'] figure"));
          if (frames.length === 0) return { error: "No video frames found", maxWidthDiff: 0, maxRowBottomDiff: 0 };

          const widths = frames.map((f) => Math.round(f.getBoundingClientRect().width));
          const baseWidth = widths[0];
          const widthDiffs = widths.map((w) => Math.abs(w - baseWidth));

          // Group figures by row (similar top within 20px)
          const rows: { top: number; bottoms: number[] }[] = [];
          for (const fig of figs) {
            const r = fig.getBoundingClientRect();
            const top = Math.round(r.top);
            const bottom = Math.round(r.bottom);
            const existingRow = rows.find((row) => Math.abs(row.top - top) <= 20);
            if (existingRow) {
              existingRow.bottoms.push(bottom);
            } else {
              rows.push({ top, bottoms: [bottom] });
            }
          }

          const rowDiffs = rows.map((r) => {
            if (r.bottoms.length <= 1) return 0;
            return Math.max(...r.bottoms) - Math.min(...r.bottoms);
          });

          return {
            widths,
            maxWidthDiff: Math.max(...widthDiffs),
            maxRowBottomDiff: Math.max(...rowDiffs, 0),
          };
        });

        expect(metrics.maxWidthDiff, `Video frame width diff (${metrics.maxWidthDiff}) must be <= 1px`).toBeLessThanOrEqual(1);
        expect(metrics.maxRowBottomDiff, `Video column bottom diff in same row (${metrics.maxRowBottomDiff}) must be <= 48px`).toBeLessThanOrEqual(48);
      }
    });
  }

  // L10: Galleries: for every role=tablist inside [data-resource], scrollWidth <= clientWidth
  for (const slug of TARGET_SLUGS) {
    test(`[L10] ${slug} - gallery tablists have no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const tabs = ["hien-vat", "sa-ban", "ngay-nay", "mo-hinh-3d"];
      for (const tabId of tabs) {
        const tabBtn = page.locator(`button[id$='-${tabId}']`);
        if ((await tabBtn.count()) > 0) {
          await tabBtn.click();
          await page.waitForTimeout(300);

          const result = await page.evaluate((tid) => {
            const container = document.querySelector(`[data-resource='${tid}']`);
            if (!container) return { exists: false, errors: [] };
            const tablists = Array.from(container.querySelectorAll<HTMLElement>("[role='tablist']"));
            const errors: string[] = [];

            for (const tl of tablists) {
              if (tl.scrollWidth > tl.clientWidth + 1) {
                errors.push(`Tablist ${tl.getAttribute("aria-label")} has scrollWidth ${tl.scrollWidth} > clientWidth ${tl.clientWidth}`);
              }
              const tabs = Array.from(tl.querySelectorAll<HTMLElement>("[role='tab']"));
              const tlRect = tl.getBoundingClientRect();
              for (const tab of tabs) {
                const tr = tab.getBoundingClientRect();
                if (tr.left < tlRect.left - 2 || tr.right > tlRect.right + 2) {
                  errors.push(`Tab ${tab.textContent?.slice(0, 20)} is outside tablist bounds`);
                }
              }
            }
            return { exists: true, errors };
          }, tabId);

          if (result.exists) {
            expect(result.errors, `L10 errors in tab ${tabId}: ${result.errors.join(", ")}`).toEqual([]);
          }
        }
      }
    });
  }

  // L11: Galleries at >=1366: stage and picker are side by side and picker top equals stage top (+-4px)
  for (const slug of TARGET_SLUGS) {
    test(`[L11] ${slug} - gallery stage and picker side by side at 1440x900`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const tabs = ["hien-vat", "sa-ban", "ngay-nay", "mo-hinh-3d"];
      for (const tabId of tabs) {
        const tabBtn = page.locator(`button[id$='-${tabId}']`);
        if ((await tabBtn.count()) > 0) {
          await tabBtn.click();
          await page.waitForTimeout(300);

          const metrics = await page.evaluate((tid) => {
            const container = document.querySelector(`[data-resource='${tid}']`);
            if (!container) return { exists: false };
            const picker = container.querySelector<HTMLElement>("[role='tablist']");
            const stage = container.querySelector<HTMLElement>("[data-testid='photo3d-stage'], [data-testid='scan-stage'], [data-testid='model-stage']");
            if (!picker || !stage) return { exists: false, noPane: true };

            const pr = picker.getBoundingClientRect();
            const sr = stage.getBoundingClientRect();

            return {
              exists: true,
              pickerLeft: pr.left,
              stageRight: sr.right,
              pickerTop: pr.top,
              stageTop: sr.top,
              topDiff: Math.abs(pr.top - sr.top),
            };
          }, tabId);

          if (metrics.exists && !metrics.noPane && metrics.pickerLeft !== undefined && metrics.stageRight !== undefined && metrics.topDiff !== undefined) {
            expect(metrics.pickerLeft, `In tab ${tabId}, picker left (${metrics.pickerLeft}) must be > stage right (${metrics.stageRight})`).toBeGreaterThan(metrics.stageRight);
            expect(metrics.topDiff, `In tab ${tabId}, picker top (${metrics.pickerTop}) must equal stage top (${metrics.stageTop}) within 4px`).toBeLessThanOrEqual(4);
          }
        }
      }
    });
  }

  // L12: Quiz CTA button height <= 56px (single line)
  for (const slug of TARGET_SLUGS) {
    test(`[L12] ${slug} - quiz CTA button height <= 56px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(500);

      const quizBtn = page.locator("section[aria-labelledby='ghi-nho'] a[href*='/trac-nghiem/']");
      if ((await quizBtn.count()) > 0) {
        const box = await quizBtn.boundingBox();
        expect(box, "Quiz button bounding box should exist").not.toBeNull();
        if (box) {
          expect(box.height, `Quiz CTA button height (${box.height}) must be <= 56px`).toBeLessThanOrEqual(56);
        }
      }
    });
  }
});
