import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-2");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();

  for (const vp of [
    { name: "1440x900", width: 1440, height: 900 },
    { name: "1280x720", width: 1280, height: 720 },
  ]) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
      await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);
      const file = path.join(OUT_DIR, `${slug}-${vp.name}-hero.png`);
      const hero = page.locator("section[aria-labelledby='bai-hoc-tieu-de']");
      await hero.screenshot({ path: file });
      console.log(`Saved screenshot: ${file}`);
    }
    await page.close();
  }

  await browser.close();
}

main().catch(console.error);
