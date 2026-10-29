import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const outDir = 'docs/audits/screenshots';
fs.mkdirSync(outDir, { recursive: true });

const targetSlugs = [
  'nha-tu-hoa-lo',
  'doi-a1-dien-bien-phu',
  'cau-ham-rong',
  'nga-ba-dong-loc',
  'dia-dao-cu-chi',
  'ben-vam-lung'
];

async function main() {
  console.log('=== CHỤP ẢNH BẰNG CHỨNG GIAO DIỆN LIVE (PLAYWRIGHT) ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // 1. Kham Pha / Explorer panel
  console.log('Đang truy cập http://localhost:3000/kham-pha ...');
  await page.goto('http://localhost:3000/kham-pha', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // Allow globe / map to initialize

  const explorerPath = path.join(outDir, 'live-repair-kham-pha-panel.png');
  await page.screenshot({ path: explorerPath, fullPage: false });
  console.log(`✓ Đã chụp màn hình panel khám phá: ${explorerPath}`);

  // 2. Capture 6 detail pages
  for (const slug of targetSlugs) {
    const url = `http://localhost:3000/dia-diem/${slug}`;
    console.log(`\nĐang truy cập ${url} ...`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    // Verify main cover image loaded
    const imgInfo = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const cover = imgs.find(img => img.src && img.src.includes('storage/v1/object/public/media'));
      if (!cover) return { found: false, anyImgs: imgs.map(i => i.src) };
      return {
        found: true,
        src: cover.src,
        naturalWidth: cover.naturalWidth,
        naturalHeight: cover.naturalHeight,
        complete: cover.complete
      };
    });

    console.log(`  Ảnh di tích (${slug}):`, imgInfo);

    const shotPath = path.join(outDir, `live-repair-detail-${slug}.png`);
    await page.screenshot({ path: shotPath, fullPage: false });
    console.log(`  ✓ Đã lưu ảnh: ${shotPath}`);
  }

  await browser.close();
  console.log('\n=== HOÀN TẤT CHỤP ẢNH TẤT CẢ GIAO DIỆN LIVE ===');
}

main().catch(err => {
  console.error('Lỗi khi chụp màn hình:', err);
  process.exit(1);
});
