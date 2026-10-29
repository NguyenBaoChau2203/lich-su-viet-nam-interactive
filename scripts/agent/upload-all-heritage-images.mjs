process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processHeritageImage } from "../content/heritage-import-image.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const planPath = path.join(root, "supabase/content/heritage-sites/v1/upload-plan.json");

async function runUpload() {
  const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
  console.log(`Bắt đầu tải lên Supabase Storage cho ${plan.length} di tích...`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < plan.length; i++) {
    const item = plan[i];
    console.log(`\n[${i + 1}/${plan.length}] Đang xử lý và tải lên: ${item.site} (${item.name})...`);

    try {
      const res = await processHeritageImage({
        commons: item.commons,
        web: item.web,
        page: item.page,
        credit: item.credit,
        usage: item.usage || "open_license",
        site: item.site,
        name: item.name,
        alt: item.alt,
        caption: item.caption,
        era: item.era || "today",
        year: item.year,
        cover: true,
        previewDir: ".task-reports/heritage-previews",
        visualCheck: item.visual,
        searchLog: [`Authorized upload: ${item.commons || item.web}`],
        isDryRun: false,
        doUpload: true,
      });

      successCount++;
      results.push({
        site: item.site,
        name: item.name,
        publicUrl: res.mediaSiteEntry.fileUrl,
        width: res.mediaSiteEntry.width,
        height: res.mediaSiteEntry.height,
        status: "OK",
      });
      console.log(`✓ Đã tải lên thành công: ${res.mediaSiteEntry.fileUrl}`);
    } catch (err) {
      failCount++;
      console.error(`✗ Thất bại khi tải lên ${item.site}:`, err.message);
      results.push({
        site: item.site,
        name: item.name,
        error: err.message,
        status: "FAIL",
      });
    }
  }

  console.log(`\n=== TỔNG KẾT TẢI LÊN STORAGE ===`);
  console.log(`Thành công: ${successCount} / ${plan.length}`);
  console.log(`Thất bại: ${failCount}`);

  fs.writeFileSync(
    path.join(root, ".task-reports/storage-upload-results.json"),
    JSON.stringify(results, null, 2)
  );

  if (failCount > 0) {
    console.error("Dừng lại do có ảnh tải lên thất bại.");
    process.exit(1);
  }
}

runUpload().catch(console.error);
