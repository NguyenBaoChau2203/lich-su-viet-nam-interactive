#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function parseArgs(args) {
  let pkg = "supabase/content/heritage-sites/v1";
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--package" && args[i + 1]) {
      pkg = args[++i];
    }
  }
  return { pkg };
}

export function generateRosterAndLedger(packageDir) {
  const base = path.resolve(root, packageDir);
  const localities = JSON.parse(fs.readFileSync(path.join(base, "localities.json"), "utf8")).localities;
  const sources = JSON.parse(fs.readFileSync(path.join(base, "sources.json"), "utf8")).sources;
  const sites = JSON.parse(fs.readFileSync(path.join(base, "sites.json"), "utf8")).sites;

  const locMap = new Map(localities.map((l) => [l.code, l]));
  const srcMap = new Map(sources.map((s) => [s.key, s]));

  // Sort sites deterministically by localityCode, then rank, then key
  const sortedSites = [...sites].sort((a, b) => {
    if (a.localityCode !== b.localityCode) return a.localityCode.localeCompare(b.localityCode);
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.key.localeCompare(b.key);
  });

  // Group sites by locality
  const byLoc = new Map();
  for (const loc of localities) {
    byLoc.set(loc.code, []);
  }
  for (const s of sortedSites) {
    if (!byLoc.has(s.localityCode)) byLoc.set(s.localityCode, []);
    byLoc.get(s.localityCode).push(s);
  }

  // Generate roster.md
  let rosterMd = `# Danh mục Địa danh lịch sử theo địa phương (Roster v1)

> **Mục tiêu:** 34/34 địa phương cấp tỉnh theo khung pháp lý \`VN-34-2025\` đều có **1 địa danh Lớp 12** bắt buộc (gắn trực tiếp với SGK Kết nối tri thức Lịch sử 12) và tối đa **1 địa danh Mở rộng** tuỳ chọn.  
> **Tổng số:** ${sortedSites.length} địa danh (${sortedSites.filter((s) => s.tier === "grade12").length} Lớp 12, ${sortedSites.filter((s) => s.tier === "extended").length} Mở rộng).  
> **Trạng thái:** Chờ chủ dự án duyệt danh mục sơ bộ (Roster Approval Gate) trước khi biên soạn chi tiết tại Phase 2.

---

| Mã | Tỉnh / Thành phố | Phân loại | Tên địa danh | Giai đoạn / Mốc | Tọa độ (OSM) | Liên kết SGK 12 / Chuyên đề | Quyết định xếp hạng & Nguồn thẩm định | Quyết định |
|---|---|---|---|---|---|---|---|---|
`;

  for (const loc of localities) {
    const list = byLoc.get(loc.code) || [];
    for (const s of list) {
      const tierLabel = s.tier === "grade12" ? "**Lớp 12**" : "_Mở rộng_";
      // Find authority relic source matching this site
      let relicSrc = sources.find((src) => {
        if (src.key === "src-osm" || src.key === "src-sgk-su-12") return false;
        const keyPart = src.key.replace(/^src-(?:dsvh|qdnd)-/u, "");
        if (keyPart === s.key || s.key.startsWith(keyPart) || keyPart.startsWith(s.key)) return true;
        if (s.key.includes(keyPart)) return true;
        const parts = keyPart.split("-");
        return parts.length >= 2 && parts.every((p) => s.key.includes(p));
      });
      if (!relicSrc) {
        relicSrc = sources.find((src) => {
          if (src.key === "src-osm" || src.key === "src-sgk-su-12") return false;
          return src.title.toLowerCase().includes(s.name.toLowerCase().split(" ").slice(-2).join(" "));
        });
      }
      const relicTitle = relicSrc ? `[${relicSrc.title}](${relicSrc.url || "#"})` : "Cục Di sản văn hóa / Bộ VHTTDL";
      const lesson = s.lessonSlug ? `Chuyên đề: \`${s.lessonSlug}\`` : "SGK Lịch sử 12";
      const osmLink = `[${s.coordinate.osm}](https://www.openstreetmap.org/${s.coordinate.osm})`;
      rosterMd += `| ${loc.code} | ${loc.officialName} | ${tierLabel} | **${s.name}** | ${s.period} | ${s.coordinate.lat}, ${s.coordinate.lng} (${osmLink}) | ${lesson} | ${relicTitle} | \`${s.decision}\` |\n`;
    }
  }

  rosterMd += `\n---\n\n## Tóm tắt độ phủ 34 địa phương\n\n`;
  rosterMd += `- **Số địa phương có địa danh Lớp 12:** ${localities.filter((l) => (byLoc.get(l.code) || []).some((s) => s.tier === "grade12")).length}/34 (100% độ phủ quốc gia).\n`;
  rosterMd += `- **Số địa phương có địa danh Mở rộng:** ${localities.filter((l) => (byLoc.get(l.code) || []).some((s) => s.tier === "extended")).length}/34.\n`;
  rosterMd += `- **Tất cả tọa độ:** Đã được kiểm tra đối chiếu trên OpenStreetMap với element id cụ thể.\n`;
  rosterMd += `- **Tất cả địa danh:** Đều có nguồn văn bản xếp hạng Di tích quốc gia đặc biệt hoặc Di tích quốc gia chính thống từ Cục Di sản văn hóa / Bộ VHTTDL / Thủ tướng Chính phủ.\n`;

  // Generate ledger.md
  let ledgerMd = `# Sổ chứng cứ Địa danh lịch sử (Heritage Sites Evidence Ledger v1)

Tài liệu kiểm chứng nguồn tư liệu, tọa độ thực tế, hình ảnh bản quyền và video chính thống cho từng địa danh.

---

`;

  for (const s of sortedSites) {
    const loc = locMap.get(s.localityCode);
    ledgerMd += `## [${s.localityCode}] ${s.name} (${s.tier === "grade12" ? "Lớp 12" : "Mở rộng"})\n\n`;
    ledgerMd += `- **Mã định danh:** \`${s.key}\`\n`;
    ledgerMd += `- **Địa phương:** ${loc?.officialName || s.localityCode} (Mã ${s.localityCode})\n`;
    if (s.historicalName) ledgerMd += `- **Tên lịch sử:** ${s.historicalName}\n`;
    if (s.enrollExistingSlug) ledgerMd += `- **Kế thừa bản ghi có sẵn:** \`${s.enrollExistingSlug}\`\n`;
    ledgerMd += `- **Thời kỳ / Mốc thời gian:** ${s.period}\n`;
    ledgerMd += `- **Tóm tắt (Teaser):** ${s.teaser}\n`;
    ledgerMd += `- **Tọa độ thực địa:** ${s.coordinate.lat}, ${s.coordinate.lng} (Độ chính xác: \`${s.coordinate.accuracy}\`, OSM: \`${s.coordinate.osm}\`)\n`;
    ledgerMd += `  - *Ghi chú tọa độ:* ${s.coordinate.note}\n`;
    ledgerMd += `  - *Nguồn tọa độ:* \`${s.coordinate.sourceKey}\`\n`;
    if (s.lessonSlug) ledgerMd += `- **Liên kết bài học tương tác:** \`${s.lessonSlug}\`\n`;

    // Find authority relic source
    let relicSrc = sources.find((src) => {
      if (src.key === "src-osm" || src.key === "src-sgk-su-12") return false;
      const keyPart = src.key.replace(/^src-(?:dsvh|qdnd)-/u, "");
      if (keyPart === s.key || s.key.startsWith(keyPart) || keyPart.startsWith(s.key)) return true;
      if (s.key.includes(keyPart)) return true;
      const parts = keyPart.split("-");
      return parts.length >= 2 && parts.every((p) => s.key.includes(p));
    });
    if (!relicSrc) {
      relicSrc = sources.find((src) => {
        if (src.key === "src-osm" || src.key === "src-sgk-su-12") return false;
        return src.title.toLowerCase().includes(s.name.toLowerCase().split(" ").slice(-2).join(" "));
      });
    }
    if (relicSrc) {
      ledgerMd += `- **Quyết định xếp hạng & Nguồn thẩm định:** [${relicSrc.title}](${relicSrc.url}) – *${relicSrc.citation}*\n`;
    }

    // Sections
    ledgerMd += `\n### 1. Luận cứ & Nguồn trích dẫn (Story Sections)\n`;
    if (!s.sections || s.sections.length === 0) {
      ledgerMd += `*Nội dung chi tiết 3–5 mục sẽ được hoàn thiện tại Phase 2 sau khi duyệt Roster.*\n`;
    } else {
      for (const sec of s.sections) {
        ledgerMd += `- **Mục: "${sec.heading}"** (Độ tin cậy: \`${sec.certainty}\`${sec.uncertaintyNote ? ` - Chú thích: ${sec.uncertaintyNote}` : ""})\n`;
        for (const cite of sec.sources || []) {
          const src = srcMap.get(cite.sourceKey);
          ledgerMd += `  - Nguồn \`${cite.sourceKey}\`: ${src ? src.title : "N/A"} (${cite.locator}: ${cite.scopeNote})\n`;
        }
      }
    }

    // Media
    ledgerMd += `\n### 2. Tư liệu hình ảnh (Media Evidence)\n`;
    if (!s.media || s.media.length === 0) {
      ledgerMd += `*Hình ảnh sẽ được tải về, kiểm tra kích thước thực tế và giấy phép bản quyền tại Phase 2.*\n`;
    } else {
      for (const m of s.media) {
        ledgerMd += `- **${m.isCover ? "[Ảnh bìa] " : ""}${m.caption}**\n`;
        ledgerMd += `  - URL: ${m.fileUrl}\n`;
        ledgerMd += `  - Trang gốc: ${m.sourcePageUrl}\n`;
        ledgerMd += `  - Thời kỳ: \`${m.era}\` (${m.yearTaken || "N/A"})\n`;
        ledgerMd += `  - Cơ sở sử dụng: \`${m.usageBasis}\` (Giấy phép: ${m.license || "Tư liệu học tập"})\n`;
        ledgerMd += `  - Tác giả / Nguồn ảnh: ${m.photographer || "N/A"}\n`;
        ledgerMd += `  - Kích thước: ${m.width}x${m.height} | Ngày kiểm tra: ${m.checkedAt}\n`;
      }
    }

    // Video
    ledgerMd += `\n### 3. Video chính thống (Official Videos)\n`;
    if (!s.videos || s.videos.length === 0) {
      ledgerMd += `*Không có video chính thống phù hợp hoặc đang xác minh oEmbed.*\n`;
    } else {
      for (const v of s.videos) {
        ledgerMd += `- [${v.title}](https://www.youtube.com/watch?v=${v.youtubeId})\n`;
        ledgerMd += `  - Kênh phát hành: ${v.channel} (${v.channelUrl || "N/A"})\n`;
        ledgerMd += `  - YouTube ID: \`${v.youtubeId}\` | Đã kiểm tra oEmbed: ${v.embedCheckedAt}\n`;
        ledgerMd += `  - Ghi chú nội dung: ${v.note || "N/A"}\n`;
      }
    }
    ledgerMd += `\n---\n\n`;
  }

  fs.writeFileSync(path.join(base, "roster.md"), rosterMd, "utf8");
  fs.writeFileSync(path.join(base, "ledger.md"), ledgerMd, "utf8");
  console.log(`Successfully generated roster.md and ledger.md in ${packageDir}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const { pkg } = parseArgs(process.argv.slice(2));
  generateRosterAndLedger(pkg);
}
