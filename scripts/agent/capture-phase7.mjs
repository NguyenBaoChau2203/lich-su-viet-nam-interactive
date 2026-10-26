import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-7");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const reviewSec = page.locator("section[aria-labelledby='ghi-nho']");
    if ((await reviewSec.count()) > 0) {
      await reviewSec.scrollIntoViewIfNeeded();
      await reviewSec.screenshot({ path: path.join(OUT_DIR, `${slug}-review.png`) });
    }

    const sourcesSec = page.locator("section[aria-labelledby='nguon']");
    if ((await sourcesSec.count()) > 0) {
      await sourcesSec.scrollIntoViewIfNeeded();
      await sourcesSec.screenshot({ path: path.join(OUT_DIR, `${slug}-sources.png`) });
    }
  }

  console.log("Screenshots captured in .task-reports/lesson-layout-phase-7/");
  await browser.close();
}

main().catch(console.error);
