#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const BASE = process.env.BASE || "http://127.0.0.1:3000";

async function main() {
  console.log("=== BẮT ĐẦU KIỂM TRA BROWSER ĐỐI VỚI ẢNH ĐỊA DANH (BROWSER CHECK) ===");
  console.log(`URL mục tiêu: ${BASE}\n`);

  const sitesPath = path.resolve(root, "supabase/content/heritage-sites/v1/sites.json");
  const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf8"));
  const acceptedSites = sitesData.sites.filter((s) => s.decision === "accepted");

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "vi-VN",
  });
  const page = await context.newPage();

  const results = {
    timestamp: new Date().toISOString(),
    base: BASE,
    homepageList: null,
    detailPages: [],
    summary: {
      totalPagesChecked: 0,
      totalImagesEncountered: 0,
      failedImagesCount: 0,
      fallbackPlaceholdersCount: 0,
    },
  };

  // 1. Check Homepage places panel
  console.log("1. Kiểm tra trang chủ danh sách địa danh (?noi-dung=dia-danh)...");
  try {
    await page.goto(`${BASE}/?noi-dung=dia-danh`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.waitForTimeout(3000);

    // Scroll results panel in steps to trigger image loading
    const resultsRegion = page.locator('[role="region"][aria-label*="địa danh"], [role="region"][aria-label*="Kết quả địa danh"]');
    if (await resultsRegion.count() > 0) {
      for (let s = 0; s < 5; s++) {
        await resultsRegion.evaluate((el) => { el.scrollTop += 800; });
        await page.waitForTimeout(400);
      }
    } else {
      // Fallback scroll on body / main
      for (let s = 0; s < 5; s++) {
        await page.evaluate(() => window.scrollBy(0, 800));
        await page.waitForTimeout(400);
      }
    }

    const panelImages = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll("main img, [role='region'] img, aside img"));
      const fallbacks = Array.from(document.querySelectorAll("[data-image-fallback='true'], div[role='img']"));
      return {
        images: imgs.map((img) => ({
          src: img.src,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          failed: img.complete && img.naturalWidth === 0,
        })),
        fallbackCount: fallbacks.length,
      };
    });

    const failedPanelImgs = panelImages.images.filter((i) => i.failed).length;
    results.homepageList = {
      url: `${BASE}/?noi-dung=dia-danh`,
      totalImages: panelImages.images.length,
      failedImages: failedPanelImgs,
      fallbackCount: panelImages.fallbackCount,
      images: panelImages.images,
    };
    results.summary.totalPagesChecked++;
    results.summary.totalImagesEncountered += panelImages.images.length;
    results.summary.failedImagesCount += failedPanelImgs;
    results.summary.fallbackPlaceholdersCount += panelImages.fallbackCount;

    console.log(`   ✓ Trang danh sách: ${panelImages.images.length} ảnh (${failedPanelImgs} ảnh hỏng naturalWidth=0, ${panelImages.fallbackCount} fallback placeholders)`);
  } catch (err) {
    console.error(`   ✗ Lỗi kiểm tra trang danh sách: ${err.message}`);
    results.homepageList = { error: err.message };
  }

  // 2. Check each detail page
  console.log("\n2. Kiểm tra các trang chi tiết /dia-diem/<slug> (64 địa danh)...");
  for (let idx = 0; idx < acceptedSites.length; idx++) {
    const site = acceptedSites[idx];
    const url = `${BASE}/dia-diem/${site.key}`;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
      await page.waitForTimeout(1000);

      const pageMedia = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll("main img"));
        const fallbacks = Array.from(document.querySelectorAll("[data-image-fallback='true'], div[role='img']"));
        return {
          images: imgs.map((img) => ({
            src: img.src,
            complete: img.complete,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            failed: img.complete && img.naturalWidth === 0,
          })),
          fallbackCount: fallbacks.length,
        };
      });

      const failedImgs = pageMedia.images.filter((i) => i.failed).length;
      results.detailPages.push({
        slug: site.key,
        url,
        totalImages: pageMedia.images.length,
        failedImages: failedImgs,
        fallbackCount: pageMedia.fallbackCount,
        images: pageMedia.images,
      });

      results.summary.totalPagesChecked++;
      results.summary.totalImagesEncountered += pageMedia.images.length;
      results.summary.failedImagesCount += failedImgs;
      results.summary.fallbackPlaceholdersCount += pageMedia.fallbackCount;

      if (failedImgs > 0 && idx < 5) {
        console.log(`   [Chi tiết #${idx + 1}] /dia-diem/${site.key}: ${failedImgs}/${pageMedia.images.length} ảnh hỏng naturalWidth=0`);
      }
    } catch (err) {
      results.detailPages.push({
        slug: site.key,
        url,
        error: err.message,
      });
      console.warn(`   ✗ Lỗi tải /dia-diem/${site.key}: ${err.message}`);
    }
  }

  await browser.close();

  // Save results
  const outDir = path.resolve(root, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "heritage-image-browser-check.json");
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");

  console.log(`\n=== TỔNG KẾT KIỂM TRA TRÌNH DUYỆT (BROWSER CHECK) ===`);
  console.log(`- Tổng số trang đã kiểm tra: ${results.summary.totalPagesChecked}`);
  console.log(`- Tổng số phần tử <img> bắt gặp: ${results.summary.totalImagesEncountered}`);
  console.log(`- Số ảnh bị hỏng hiển thị (naturalWidth === 0): ${results.summary.failedImagesCount}`);
  console.log(`- Số placeholder fallback ghi nhận: ${results.summary.fallbackPlaceholdersCount}`);
  console.log(`✓ Đã lưu kết quả JSON: ${outPath}`);
}

main().catch((err) => {
  console.error("Fatal browser check error:", err);
  process.exit(1);
});
