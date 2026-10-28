process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { processHeritageImage } from "../content/heritage-import-image.mjs";
import { generateRosterAndLedger } from "../content/heritage-sites-roster.mjs";
import { createContactSheet } from "./generate-contact-sheet.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const v1Dir = path.join(root, "supabase/content/heritage-sites/v1");
const sitesPath = path.join(v1Dir, "sites.json");
const evidencePath = path.join(v1Dir, "media-evidence.json");

const BATCH_C_SPECS = [
  {
    site: "khu-di-tich-kim-lien",
    commons: "File:Kim Lien Monuments Park.JPG",
    name: "den-tuong-niem-kim-lien",
    caption: "Cụm đền tưởng niệm và cây đa tại Khu di tích Quốc gia đặc biệt Kim Liên, Nam Đàn, Nghệ An.",
    alt: "Đền tưởng niệm mái ngói truyền thống soi bóng bên cây cổ thụ râm mát tại Khu di tích Kim Liên",
    era: "today",
    year: 2009,
    visual: "Đền tưởng niệm và cây cổ thụ tại Khu di tích Kim Liên Nam Đàn Nghệ An.",
  },
  {
    site: "truong-bon",
    web: "https://cdn.nhandan.vn/images/HvOYxOL7S_B5gKLe14Wz7-X62e0nEym28B3Ga65B_hqI9w0Q_hjQW2ec8Dg4G5q99ssS-SUZcf6rR1lvYNDOVQ/5-bs-11111-3957.jpg",
    page: "https://nhandan.vn/truong-bon-mot-bieu-tuong-cua-tinh-than-viet-nam-post721703.html",
    credit: "Báo Nhân Dân",
    usage: "coursework_reference",
    name: "toan-canh-di-tich-truong-bon",
    caption: "Toàn cảnh Khu di tích Lịch sử Quốc gia Truông Bồn tại xã Mỹ Sơn, huyện Đô Lương, tỉnh Nghệ An.",
    alt: "Toàn cảnh quảng trường, đài tưởng niệm và các công trình di tích Truông Bồn nhìn từ trên cao giữa thung lũng xanh",
    era: "today",
    year: 2022,
    visual: "Toàn cảnh khu di tích Truông Bồn Đô Lương Nghệ An từ trên cao.",
  },
  {
    site: "nga-ba-dong-loc",
    commons: "File:Nga Ba Dong Loc.jpg",
    name: "tuong-dai-nga-ba-dong-loc",
    caption: "Quần thể tượng đài và khu tưởng niệm 10 cô gái thanh niên xung phong tại Ngã ba Đồng Lộc, Hà Tĩnh.",
    alt: "Cụm tượng đài chiến thắng và hồ nước trong khuôn viên di tích lịch sử Ngã ba Đồng Lộc",
    era: "today",
    year: 2013,
    visual: "Cụm tượng đài chiến thắng tại Khu di tích Ngã ba Đồng Lộc Hà Tĩnh.",
  },
  {
    site: "thanh-co-quang-tri",
    commons: "File:Thành cổ Quảng Trị 4.jpg",
    name: "dai-tuong-niem-thanh-co-quang-tri",
    caption: "Đài tưởng niệm trung tâm Thành cổ Quảng Trị, biểu tượng tưởng niệm 81 ngày đêm rực lửa năm 1972.",
    alt: "Đài tưởng niệm hình nấm mồ chung và biểu tượng bát hương khổng lồ giữa trung tâm Thành cổ Quảng Trị",
    era: "today",
    year: 2013,
    visual: "Đài tưởng niệm trung tâm Thành cổ Quảng Trị tri ân các anh hùng liệt sĩ.",
  },
  {
    site: "doi-bo-hien-luong-ben-hai",
    commons: "File:Benhai03.JPG",
    name: "cau-hien-luong-song-ben-hai",
    caption: "Cầu Hiền Lương lịch sử bắc qua sông Bến Hải, vĩ tuyến 17 chia cắt hai miền Nam - Bắc suốt 20 năm.",
    alt: "Cầu Hiền Lương sơn hai màu xanh vàng tượng trưng cho giới tuyến quân sự tạm thời trên dòng sông Bến Hải",
    era: "today",
    year: 2007,
    visual: "Cầu Hiền Lương bắc qua sông Bến Hải tại vĩ tuyến 17 Quảng Trị.",
  },
  {
    site: "ngo-mon-hue",
    commons: "File:Huế (2024) - Meridian Gate - Ngọ Môn (Hoàng thành Huế) - img 02.jpg",
    name: "ngo-mon-hoang-thanh-hue",
    caption: "Cửa Ngọ Môn – cổng chính phía Nam của Hoàng thành Huế, Di sản Văn hóa Thế giới.",
    alt: "Toàn cảnh cổng Ngọ Môn bằng đá uy nghi với Lầu Ngũ Phụng mái ngói thanh lưu ly và hoàng lưu ly",
    era: "today",
    year: 2024,
    visual: "Toàn cảnh cổng Ngọ Môn và Lầu Ngũ Phụng Hoàng thành Huế.",
  },
  {
    site: "kinh-thanh-hue-1968",
    commons: "File:Kỳ Đài (Kinh thành Huế).jpg",
    name: "ky-dai-kinh-thanh-hue",
    caption: "Kỳ Đài Kinh thành Huế – nơi lá cờ Mặt trận Dân tộc Giải phóng miền Nam tung bay trong chiến dịch Tết Mậu Thân 1968.",
    alt: "Cột cờ Kỳ Đài xây bằng gạch ba tầng sừng sững trước Ngọ Môn và Đại Nội Huế",
    era: "today",
    year: 2014,
    visual: "Kỳ Đài ba tầng uy nghi trước Hoàng thành Huế.",
  },
  {
    site: "chien-thang-nui-thanh-1965",
    web: "https://bqn.1cdn.vn/2020/09/22/images.baoquangnam.vn-storage-newsportal-2020-9-21-93089-_tnb-30405-01.jpg",
    page: "https://baoquangnam.vn/di-tich-quoc-gia-chien-thang-nui-thanh-nang-tam-va-lan-toa-3027374.html",
    credit: "Báo Quảng Nam",
    usage: "coursework_reference",
    name: "tuong-dai-chien-thang-nui-thanh",
    caption: "Tượng đài Chiến thắng Núi Thành trên đồi Phú Huề (Quảng Nam), ghi dấu trận đầu đánh Mỹ và thắng Mỹ ngày 26/5/1965.",
    alt: "Tượng đài chiến sĩ Núi Thành giương cao súng trên đỉnh đài cao với bậc thang kỳ vĩ dẫn lên đồi",
    era: "today",
    year: 2020,
    visual: "Tượng đài Chiến thắng Núi Thành trên đỉnh đồi Phú Huề Quảng Nam.",
  },
  {
    site: "khu-den-thap-my-son",
    commons: "File:2024 - Mỹ Sơn Group B, C and D - img 23.jpg",
    name: "quan-the-thap-my-son",
    caption: "Quần thể tháp gạch cổ Chăm Pa tại Thung lũng thánh địa Mỹ Sơn, Di sản Văn hóa Thế giới tại Quảng Nam.",
    alt: "Các tòa tháp Chăm bằng gạch đỏ cổ kính rêu phong nằm giữa thung lũng Mỹ Sơn được bao bọc bởi đồi núi",
    era: "today",
    year: 2024,
    visual: "Quần thể tháp gạch Chăm Pa tại thánh địa Mỹ Sơn Quảng Nam.",
  },
  {
    site: "khu-chung-tich-son-my",
    commons: "File:Monument of the My Lai Massacre (2).jpg",
    name: "tuong-dai-chung-tich-son-my",
    caption: "Tượng đài tưởng niệm nạn nhân vụ thảm sát Mỹ Lai tại Khu chứng tích Sơn Mỹ, Tịnh Khê, Quảng Ngãi.",
    alt: "Tượng đài người phụ nữ bế con tay nắm chặt căm hờn tại Khu chứng tích Sơn Mỹ Quảng Ngãi",
    era: "today",
    year: 2018,
    visual: "Tượng đài tưởng niệm tại Khu chứng tích Sơn Mỹ Quảng Ngãi.",
  },
  {
    site: "dak-to-tan-canh",
    commons: "File:Tượng đài Chiến thắng Đăk Tô - Tân Cảnh (40022454161).jpg",
    name: "tuong-dai-dak-to-tan-canh",
    caption: "Tượng đài Chiến thắng Đắk Tô – Tân Cảnh ghi dấu chiến công giải phóng cứ điểm Tân Cảnh năm 1972.",
    alt: "Tượng đài và xe tăng chiến thắng Đắk Tô - Tân Cảnh sừng sững bên quốc lộ 14 Kon Tum",
    era: "today",
    year: 2018,
    visual: "Tượng đài Chiến thắng Đắk Tô Tân Cảnh với xe tăng lịch sử tại Kon Tum.",
  },
  {
    site: "lang-khang-chien-stor",
    web: "https://gialai.gov.vn/upload/2005340/20250624/Lang-Khang-chien-Stor2_f5f2b.jpg",
    page: "https://gialai.gov.vn/du-khach/di-tich-lich-su-van-hoa/lang-khang-chien-stor.html",
    credit: "Cổng Thông tin Điện tử tỉnh Gia Lai",
    usage: "coursework_reference",
    name: "nha-luu-niem-anh-hung-nup",
    caption: "Nhà lưu niệm Anh hùng Núp tại Làng kháng chiến Stơr, xã Tơ Tung, huyện Kbang, tỉnh Gia Lai.",
    alt: "Nhà rông lưu niệm truyền thống cách điệu thờ Anh hùng Núp giữa khung cảnh núi rừng Kbang Gia Lai",
    era: "today",
    year: 2025,
    visual: "Nhà lưu niệm Anh hùng Núp tại Làng kháng chiến Stơr Gia Lai.",
  },
  {
    site: "bao-tang-quang-trung",
    commons: "File:Bảo Tàng Quang Trung.JPG",
    name: "bao-tang-quang-trung-tay-son",
    caption: "Khu di tích Điện thờ Tây Sơn Tam Kiệt và Bảo tàng Quang Trung tại thị trấn Phú Phong, Tây Sơn, Bình Định.",
    alt: "Điện thờ Tây Sơn Tam Kiệt với kiến trúc cổ truyền trang nghiêm tại Bảo tàng Quang Trung Bình Định",
    era: "today",
    year: 2009,
    visual: "Điện thờ Tây Sơn Tam Kiệt tại Bảo tàng Quang Trung Bình Định.",
  },
  {
    site: "san-bay-thanh-son",
    commons: "File:Douglas A-1H Skyraider of the 1st SOS at Phan Rang Air Base, Vietnam, circa in 1969 (VA065677).jpg",
    name: "san-bay-phan-rang-thanh-son-1969",
    usage: "public_domain",
    caption: "Căn cứ không quân Phan Rang (Sân bay Thành Sơn) nơi Phi đội Quyết thắng cất cánh ném bom sân bay Tân Sơn Nhất tháng 4/1975.",
    alt: "Máy bay trên đường băng căn cứ không quân Phan Rang (Sân bay Thành Sơn) Ninh Thuận năm 1969",
    era: "historical",
    year: 1969,
    visual: "Ảnh tư liệu lịch sử đường băng sân bay Thành Sơn Phan Rang.",
  },
  {
    site: "thap-ba-ponagar",
    commons: "File:Tháp bà Ponagar.JPG",
    name: "thap-ba-ponagar-nha-trang",
    caption: "Quần thể Tháp Bà Ponagar trên đồi Cù Lao nhìn ra cửa sông Cái, Nha Trang, Khánh Hòa.",
    alt: "Các tháp gạch nung cổ kính trầm mặc của quần thể di tích Tháp Bà Ponagar Nha Trang",
    era: "today",
    year: 2010,
    visual: "Tháp gạch Chăm Pa cổ kính tại Tháp Bà Ponagar Nha Trang Khánh Hòa.",
  },
];

async function runBatchC() {
  console.log(`Bắt đầu xử lý Batch C (${BATCH_C_SPECS.length} di tích)...`);

  const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf8"));
  let evidenceData = { schemaVersion: 1, items: [], videos: [], notFound: [] };
  if (fs.existsSync(evidencePath)) {
    try {
      evidenceData = JSON.parse(fs.readFileSync(evidencePath, "utf8"));
    } catch {
      evidenceData = { schemaVersion: 1, items: [], videos: [], notFound: [] };
    }
  }

  const results = [];

  for (const spec of BATCH_C_SPECS) {
    console.log(`\n----------------- ${spec.site} -----------------`);
    try {
      const res = await processHeritageImage({
        commons: spec.commons,
        web: spec.web,
        page: spec.page,
        credit: spec.credit,
        usage: spec.usage || "open_license",
        site: spec.site,
        name: spec.name,
        alt: spec.alt,
        caption: spec.caption,
        era: spec.era || "today",
        year: spec.year,
        author: spec.author,
        cover: true,
        previewDir: ".task-reports/heritage-previews",
        visualCheck: spec.visual,
        searchLog: [`Sourced for Batch C: ${spec.commons || spec.web}`],
        isDryRun: true,
        doUpload: false,
      });

      // Update in sitesData
      const sIndex = sitesData.sites.findIndex((s) => s.key === spec.site);
      if (sIndex < 0) {
        console.error(`Không tìm thấy site "${spec.site}" trong sites.json`);
        continue;
      }

      const siteObj = sitesData.sites[sIndex];
      // Replace media with the verified real image
      siteObj.media = [res.mediaSiteEntry];

      // Remove any fake videos on this site (e.g. nga-ba-dong-loc)
      if (Array.isArray(siteObj.videos)) {
        siteObj.videos = siteObj.videos.filter((v) => v.youtubeId !== "W4P81Jc96zU");
      }

      results.push({
        site: spec.site,
        name: siteObj.name,
        imageTitle: spec.commons || spec.web,
        dimensions: `${res.mediaSiteEntry.width}x${res.mediaSiteEntry.height}`,
        photographer: res.mediaSiteEntry.photographer,
        license: res.mediaSiteEntry.license || res.mediaSiteEntry.usageBasis,
      });
    } catch (err) {
      console.error(`Lỗi khi xử lý ${spec.site}:`, err);
      process.exit(1);
    }
  }

  // Save updated sites.json
  fs.writeFileSync(sitesPath, JSON.stringify(sitesData, null, 2) + "\n");
  console.log(`\n✓ Đã cập nhật thành công ${results.length} sites vào sites.json`);

  // Regenerate roster.md and ledger.md
  generateRosterAndLedger("supabase/content/heritage-sites/v1");
  console.log("✓ Đã tái tạo roster.md và ledger.md");

  // Update manifest.json
  const manifestPath = path.join(v1Dir, "manifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  for (const f of ["sites.json", "roster.md", "ledger.md"]) {
    const content = fs.readFileSync(path.join(v1Dir, f), "utf8");
    manifest.files[f] = crypto.createHash("sha256").update(content, "utf8").digest("hex");
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("✓ Đã cập nhật manifest.json");

  // Create contact sheet for Batch C
  const contactSheetPath = path.join(root, "docs/audits/screenshots/contact-sheet-batch-c.png");
  await createContactSheet(
    "Batch C (15 di tích - Miền Trung & Tây Nguyên)",
    BATCH_C_SPECS.map((s) => s.site),
    contactSheetPath,
  );
  console.log(`✓ Đã tạo contact sheet: ${contactSheetPath}`);

  console.table(results);
}

runBatchC().catch(console.error);
