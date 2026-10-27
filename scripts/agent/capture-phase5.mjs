import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-5");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const resSec = page.locator("section[aria-labelledby='ket-qua']");
    if (await resSec.count() > 0) {
      await resSec.scrollIntoViewIfNeeded();
      const file = path.join(OUT_DIR, `${slug}-1440x900-results.png`);
      await resSec.screenshot({ path: file });
      console.log(`Saved screenshot: ${file}`);
    }

    const figSec = page.locator("section[aria-labelledby='nhan-vat']");
    if (await figSec.count() > 0) {
      await figSec.scrollIntoViewIfNeeded();
      const file = path.join(OUT_DIR, `${slug}-1440x900-figures.png`);
      await figSec.screenshot({ path: file });
      console.log(`Saved screenshot: ${file}`);
    }
  }

  await browser.close();
}

main().catch(console.error);
