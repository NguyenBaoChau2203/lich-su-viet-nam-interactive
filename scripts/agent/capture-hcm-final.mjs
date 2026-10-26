import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), ".task-reports/hcm1975-final");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  console.log("Navigating to /bai-hoc/chien-dich-ho-chi-minh-1975...");
  await page.goto("http://localhost:3000/bai-hoc/chien-dich-ho-chi-minh-1975", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  // 1. Hero
  console.log("Capturing hero...");
  await page.screenshot({ path: path.join(outDir, "hcm-01-hero.png") });

  // 2. Diễn biến 2D map
  console.log("Capturing 2D battle map...");
  const battleSection = page.locator("section[aria-label*='diễn biến' i], section:has(#ban-do-dien-bien), [data-section='battle']").first();
  if (await battleSection.count() > 0) {
    await battleSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await battleSection.screenshot({ path: path.join(outDir, "hcm-chapter-dien-bien.png") });
  } else {
    await page.evaluate(() => window.scrollTo(0, 1100));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, "hcm-chapter-dien-bien.png") });
  }

  // 3. Tư liệu: Hiện vật tab
  console.log("Capturing resource section (Hiện vật)...");
  const resourceSection = page.locator("section[aria-labelledby='tu-lieu']").first();
  if (await resourceSection.count() > 0) {
    await resourceSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await resourceSection.screenshot({ path: path.join(outDir, "hcm-chapter-tu-lieu-hien-vat.png") });

    // Click tab "Mô hình 3D"
    const modelTab = resourceSection.locator("button:has-text('Mô hình 3D')").first();
    if (await modelTab.count() > 0) {
      console.log("Clicking Mô hình 3D tab...");
      await modelTab.click();
      await page.waitForTimeout(1500);
      await resourceSection.screenshot({ path: path.join(outDir, "hcm-chapter-tu-lieu-mo-hinh.png") });
    }

    // Click tab "Sa bàn 3D"
    const sabanTab = resourceSection.locator("button:has-text('Sa bàn 3D')").first();
    if (await sabanTab.count() > 0) {
      console.log("Clicking Sa bàn 3D tab...");
      await sabanTab.click();
      await page.waitForTimeout(1500);
      await resourceSection.screenshot({ path: path.join(outDir, "hcm-chapter-tu-lieu-sa-ban.png") });
    }

    // Click tab "Di tích ngày nay"
    const ditichTab = resourceSection.locator("button:has-text('Di tích ngày nay')").first();
    if (await ditichTab.count() > 0) {
      console.log("Clicking Di tích ngày nay tab...");
      await ditichTab.click();
      await page.waitForTimeout(1500);
      await resourceSection.screenshot({ path: path.join(outDir, "hcm-chapter-tu-lieu-ngay-nay.png") });
    }
  }

  // 4. Kết quả & Ý nghĩa
  console.log("Capturing results section...");
  const resultsSection = page.locator("section:has(#ket-qua), section[aria-label*='kết quả' i]").first();
  if (await resultsSection.count() > 0) {
    await resultsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await resultsSection.screenshot({ path: path.join(outDir, "hcm-chapter-ket-qua.png") });
  }

  // 5. Nhân vật
  console.log("Capturing figures section...");
  const figuresSection = page.locator("section:has(#nhan-vat), section[aria-label*='nhân vật' i]").first();
  if (await figuresSection.count() > 0) {
    await figuresSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await figuresSection.screenshot({ path: path.join(outDir, "hcm-chapter-nhan-vat.png") });
  }

  // 6. Nguồn & Tra cứu
  console.log("Capturing sources section...");
  const sourcesSection = page.locator("section:has(#nguon-tu-lieu), section[aria-label*='nguồn' i]").first();
  if (await sourcesSection.count() > 0) {
    await sourcesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await sourcesSection.screenshot({ path: path.join(outDir, "hcm-chapter-nguon.png") });
  }

  // 7. Bản đồ 3D HCM
  console.log("Capturing 3D Map Film /ban-do-3d/chien-dich-ho-chi-minh...");
  await page.goto("http://localhost:3000/ban-do-3d/chien-dich-ho-chi-minh", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, "hcm-mapfilm-overview.png") });

  // 8. Mô hình 3D độc lập
  console.log("Capturing /mo-hinh-3d/xe-tang-t54-390...");
  await page.goto("http://localhost:3000/mo-hinh-3d/xe-tang-t54-390", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, "model-xe-tang-390.png") });

  console.log("Capturing /mo-hinh-3d/dinh-doc-lap...");
  await page.goto("http://localhost:3000/mo-hinh-3d/dinh-doc-lap", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(outDir, "model-dinh-doc-lap.png") });

  // 9. Viewport responsiveness checks across desktop viewports
  const viewports = [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
    { width: 1920, height: 1080 },
  ];

  for (const vp of viewports) {
    console.log(`Checking viewport ${vp.width}x${vp.height}...`);
    await page.setViewportSize(vp);
    await page.goto("http://localhost:3000/bai-hoc/chien-dich-ho-chi-minh-1975", {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(outDir, `hcm-viewport-${vp.width}x${vp.height}.png`) });
  }

  await browser.close();

  console.log("\n=== CONSOLE ERRORS REPORT ===");
  if (consoleErrors.length === 0) {
    console.log("ZERO console errors detected! 100% clean.");
  } else {
    console.log(`Found ${consoleErrors.length} console errors:`);
    consoleErrors.forEach((err) => console.log(`- ${err}`));
  }
}

main().catch((err) => {
  console.error("Capture script error:", err);
  process.exit(1);
});
