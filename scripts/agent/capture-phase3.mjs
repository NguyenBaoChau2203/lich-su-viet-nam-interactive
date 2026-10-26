import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-3");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    // Screen view of chapter 1
    const ch1 = page.locator("#chuong-mo-dau");
    if (await ch1.count() > 0) {
      await ch1.scrollIntoViewIfNeeded();
      const file = path.join(OUT_DIR, `${slug}-1440x900-chapter1.png`);
      await ch1.screenshot({ path: file });
      console.log(`Saved screenshot: ${file}`);
    }

    // Print preview emulation
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(500);
    const printFile = path.join(OUT_DIR, `${slug}-print-chapter1.png`);
    if (await ch1.count() > 0) {
      await ch1.screenshot({ path: printFile });
      console.log(`Saved print screenshot: ${printFile}`);
    }
    await page.emulateMedia({ media: "screen" });
  }

  await browser.close();
}

main().catch(console.error);
