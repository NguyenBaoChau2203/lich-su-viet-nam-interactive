import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(process.cwd(), ".task-reports/lesson-layout-phase-6");
fs.mkdirSync(OUT_DIR, { recursive: true });

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const slug of ["chien-dich-dien-bien-phu", "chien-dich-ho-chi-minh-1975"]) {
    await page.goto(`http://localhost:3000/bai-hoc/${slug}`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const tuLieuSec = page.locator("section[aria-labelledby='tu-lieu']");
    if ((await tuLieuSec.count()) > 0) {
      await tuLieuSec.scrollIntoViewIfNeeded();

      // Video tab
      const videoTab = page.locator("button[id$='-video']");
      if ((await videoTab.count()) > 0) {
        await videoTab.click();
        await page.waitForTimeout(400);
        await tuLieuSec.screenshot({ path: path.join(OUT_DIR, `${slug}-video.png`) });
      }

      // Hien vat tab
      const hienVatTab = page.locator("button[id$='-hien-vat']");
      if ((await hienVatTab.count()) > 0) {
        await hienVatTab.click();
        await page.waitForTimeout(400);
        await tuLieuSec.screenshot({ path: path.join(OUT_DIR, `${slug}-hien-vat.png`) });
      }

      // Sa ban tab
      const saBanTab = page.locator("button[id$='-sa-ban']");
      if ((await saBanTab.count()) > 0) {
        await saBanTab.click();
        await page.waitForTimeout(400);
        await tuLieuSec.screenshot({ path: path.join(OUT_DIR, `${slug}-sa-ban.png`) });
      }

      // Mo hinh 3D tab (if any)
      const moHinhTab = page.locator("button[id$='-mo-hinh-3d']");
      if ((await moHinhTab.count()) > 0) {
        await moHinhTab.click();
        await page.waitForTimeout(400);
        await tuLieuSec.screenshot({ path: path.join(OUT_DIR, `${slug}-mo-hinh-3d.png`) });
      }

      // Ngay nay tab (if any)
      const ngayNayTab = page.locator("button[id$='-ngay-nay']");
      if ((await ngayNayTab.count()) > 0) {
        await ngayNayTab.click();
        await page.waitForTimeout(400);
        await tuLieuSec.screenshot({ path: path.join(OUT_DIR, `${slug}-ngay-nay.png`) });
      }
    }
  }

  console.log("Screenshots captured in .task-reports/lesson-layout-phase-6/");
  await browser.close();
}

main().catch(console.error);
