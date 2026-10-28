import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const outDir = path.resolve(process.cwd(), "docs/audits/screenshots");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "vi-VN",
  });
  const page = await context.newPage();

  // 1. Capture Lai Chau row on panel
  console.log("Capturing Lai Chau row...");
  await page.goto("http://127.0.0.1:3000/?noi-dung=dia-danh", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Filter or scroll to Lai Chau row
  const laiChauRow = page.locator('[data-site-slug="chien-thang-lai-chau-1953"]');
  if (await laiChauRow.count() > 0) {
    await laiChauRow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await laiChauRow.screenshot({ path: path.join(outDir, "phase1-laichau-row-1440x900.png") });
    console.log("Saved phase1-laichau-row-1440x900.png");
  } else {
    // Also capture full panel as fallback
    await page.screenshot({ path: path.join(outDir, "phase1-laichau-row-1440x900.png") });
  }

  // Also capture the panel view with Lai Chau
  await page.screenshot({ path: path.join(outDir, "phase1-places-panel-1440x900.png") });
  console.log("Saved phase1-places-panel-1440x900.png");

  // 2. Capture /dia-diem/atk-cho-don cover
  console.log("Capturing ATK Cho Don cover...");
  await page.goto("http://127.0.0.1:3000/dia-diem/atk-cho-don", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);

  // Full page screenshot or cover screenshot
  const coverArea = page.locator("article header, .rounded-card.bg-\\[\\#1b1714\\]").first();
  if (await coverArea.count() > 0) {
    await coverArea.screenshot({ path: path.join(outDir, "phase1-atk-cho-don-cover-crop-1440x900.png") });
  }
  await page.screenshot({ path: path.join(outDir, "phase1-atk-cho-don-cover-1440x900.png") });
  console.log("Saved phase1-atk-cho-don-cover-1440x900.png");

  await browser.close();
  console.log("Finished capturing screenshots!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
