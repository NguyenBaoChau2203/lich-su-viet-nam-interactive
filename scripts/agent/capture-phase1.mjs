import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-1");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const file = path.join(OUT_DIR, `${slug}-1440x900-light-full.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`Saved screenshot: ${file}`);
  }

  await browser.close();
}

main().catch(console.error);
