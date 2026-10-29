import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const previewDir = path.join(root, ".task-reports/heritage-previews");
const outDir = path.join(root, "docs/audits/screenshots");

export async function createContactSheet(batchName, siteKeys, outFile) {
  const cellWidth = 320;
  const cellHeight = 220;
  const cols = 4;
  const rows = Math.ceil(siteKeys.length / cols);

  const totalWidth = cols * cellWidth + (cols + 1) * 16;
  const totalHeight = rows * cellHeight + (rows + 1) * 16 + 60; // header space

  const composites = [];

  for (let i = 0; i < siteKeys.length; i++) {
    const key = siteKeys[i];
    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = 16 + col * (cellWidth + 16);
    const y = 60 + 16 + row * (cellHeight + 16);

    // Find preview file matching siteKey
    const files = fs.readdirSync(previewDir).filter((f) => f.startsWith(`${key}-`) && f.endsWith("-preview.webp"));
    if (files.length === 0) continue;

    const file = path.join(previewDir, files[0]);
    const imgBuf = await sharp(file)
      .resize({ width: cellWidth, height: cellHeight - 30, fit: "cover" })
      .toBuffer();

    composites.push({
      input: imgBuf,
      left: x,
      top: y,
    });

    // Add caption SVG
    const label = `${key.slice(0, 32)}`;
    const labelSvg = Buffer.from(`
      <svg width="${cellWidth}" height="24">
        <rect width="${cellWidth}" height="24" fill="#1b1714" rx="4" />
        <text x="8" y="16" fill="#fdfbf7" font-size="11" font-family="sans-serif">${label}</text>
      </svg>
    `);
    composites.push({
      input: labelSvg,
      left: x,
      top: y + cellHeight - 26,
    });
  }

  const escapedBatchName = String(batchName).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const headerSvg = Buffer.from(`
    <svg width="${totalWidth}" height="50">
      <rect width="${totalWidth}" height="50" fill="#2d2218" />
      <text x="20" y="32" fill="#d97706" font-size="18" font-family="sans-serif" font-weight="bold">Heritage Images Contact Sheet — ${escapedBatchName}</text>
    </svg>
  `);
  composites.unshift({ input: headerSvg, left: 0, top: 0 });

  const canvas = sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 18, g: 14, b: 12, alpha: 1 },
    },
  });

  const fullOut = path.resolve(root, outFile);
  fs.mkdirSync(path.dirname(fullOut), { recursive: true });
  await canvas.composite(composites).png().toFile(fullOut);
  console.log(`✓ Contact sheet generated at: ${fullOut}`);
}

const batchArg = process.argv[2] || "Batch A";
const sitesArg = process.argv.slice(3);
if (sitesArg.length > 0) {
  createContactSheet(batchArg, sitesArg, `docs/audits/screenshots/contact-sheet-${batchArg.toLowerCase().replace(/\s+/g, "-")}.png`);
}
