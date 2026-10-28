import fs from "node:fs";

async function verifyUrls() {
  const results = JSON.parse(fs.readFileSync(".task-reports/storage-upload-results.json", "utf8"));
  console.log(`Kiểm tra ${results.length} URL công khai trên Supabase Storage...`);

  let ok = 0;
  let fail = 0;

  for (const item of results) {
    try {
      const res = await fetch(item.publicUrl, { method: "HEAD" });
      const ctype = res.headers.get("content-type");
      if (res.ok && ctype?.includes("webp")) {
        ok++;
      } else {
        fail++;
        console.error(`FAIL: ${item.site} -> HTTP ${res.status}, type: ${ctype}`);
      }
    } catch (e) {
      fail++;
      console.error(`ERROR: ${item.site} -> ${e.message}`);
    }
  }

  console.log(`\nKết quả kiểm tra URL công khai:`);
  console.log(`OK (200 image/webp): ${ok} / ${results.length}`);
  console.log(`Lỗi: ${fail}`);

  if (fail > 0) process.exit(1);
}

verifyUrls();
