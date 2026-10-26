import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-4");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const mapSec = page.locator("section[aria-labelledby='dien-bien-tieu-de']");
    if (await mapSec.count() > 0) {
      await mapSec.scrollIntoViewIfNeeded();
      const file = path.join(OUT_DIR, `${slug}-1440x900-map.png`);
      await mapSec.screenshot({ path: file });
      console.log(`Saved screenshot: ${file}`);
    }
  }

  // Bach Dang check
  await page.goto("http://localhost:3000/tai-hien/bach-dang-938", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const bdFile = path.join(OUT_DIR, "bach-dang-938-1440x900.png");
  await page.screenshot({ path: bdFile, fullPage: true });
  console.log(`Saved screenshot: ${bdFile}`);

  await browser.close();
}

main().catch(console.error);
