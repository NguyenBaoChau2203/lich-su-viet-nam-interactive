import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), ".task-reports/lesson-layout-baseline");
fs.mkdirSync(outDir, { recursive: true });

const targetLessons = [
  "chien-dich-dien-bien-phu",
  "chien-dich-ho-chi-minh-1975",
];

const otherLessons = [
  "cach-mang-thang-tam-1945",
  "duong-truong-son",
  "tet-mau-than-1968",
  "dien-bien-phu-tren-khong-1972",
];

const viewports = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  console.log("Starting baseline capture...");

  // 1. Capture target lessons
  for (const slug of targetLessons) {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: vp,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      console.log(`Capturing ${slug} at ${vp.width}x${vp.height} (light)...`);
      await page.goto(`http://localhost:3000/bai-hoc/${slug}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(outDir, `${slug}-${vp.width}x${vp.height}-light-full.png`),
        fullPage: true,
      });

      // At 1440x900, capture tabs and dark theme
      if (vp.width === 1440 && vp.height === 900) {
        // Dark theme full page
        console.log(`Capturing ${slug} at 1440x900 (dark)...`);
        await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
        await page.waitForTimeout(500);
        await page.screenshot({
          path: path.join(outDir, `${slug}-1440x900-dark-full.png`),
          fullPage: true,
        });
        await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
        await page.waitForTimeout(500);

        // Open each tab in Tư liệu
        const tabsList = page.locator("section[aria-labelledby='tu-lieu'] [role='tablist'] [role='tab']");
        const tabCount = await tabsList.count();
        console.log(`Found ${tabCount} tabs in Tư liệu for ${slug}`);
        for (let t = 0; t < tabCount; t++) {
          const tab = tabsList.nth(t);
          const tabText = (await tab.textContent() || "").trim().toLowerCase().replace(/\s+/g, "-");
          await tab.scrollIntoViewIfNeeded();
          await tab.click();
          await page.waitForTimeout(1500);
          const resourceSection = page.locator("section[aria-labelledby='tu-lieu']").first();
          await resourceSection.screenshot({
            path: path.join(outDir, `${slug}-1440x900-light-tab-${tabText}.png`),
          });
        }
      }
      await context.close();
    }
  }

  // 2. Capture other 4 lessons at 1440x900 full page
  for (const slug of otherLessons) {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    console.log(`Capturing other lesson: ${slug} at 1440x900 (light)...`);
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outDir, `${slug}-1440x900-light-full.png`),
      fullPage: true,
    });
    await context.close();
  }

  await browser.close();
  console.log("Baseline capture completed successfully!");
}

main().catch((err) => {
  console.error("Baseline capture error:", err);
  process.exit(1);
});
