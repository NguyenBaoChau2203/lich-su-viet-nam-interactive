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

const BATCH_B_SPECS = [
  {
    site: "khoi-nghia-bac-son",
    web: "https://dltm-cdn.vnptit3.vn/resources/portal//Images/LSN/phucvt.lsn/dia%20diem/Di%20t%c3%adch%20L%e1%bb%8bch%20S%e1%bb%ad%20-%20VH/baotang_bacson.jpg_636692575102221816.jpg",
    page: "http://langsontourism.com.vn/vi/khoinghiabacson",
    credit: "Trung tâm Thông tin Xúc tiến Du lịch Lạng Sơn",
    usage: "coursework_reference",
    name: "bao-tang-khoi-nghia-bac-son",
    caption: "Bảo tàng Khởi nghĩa Bắc Sơn tại thôn Long Đống, xã Bắc Quỳnh, lưu giữ các hiện vật tiêu biểu của cuộc khởi nghĩa 1940.",
    alt: "Tòa nhà Bảo tàng Khởi nghĩa Bắc Sơn hai tầng kiến trúc truyền thống nép mình bên những dãy núi đá vôi hùng vĩ",
    era: "today",
    year: 2021,
    visual: "Bảo tàng Khởi nghĩa Bắc Sơn tại Lạng Sơn bên chân núi đá vôi.",
  },
  {
    site: "ai-chi-lang",
    commons: "File:Chi Lăng 2.jpg",
    name: "thung-lung-ai-chi-lang",
    caption: "Núi Mã Yên và thung lũng Ải Chi Lăng, nơi ghi dấu chiến thắng Chi Lăng – Xương Giang năm 1427.",
    alt: "Núi Mã Yên nhấp nhô giữa thung lũng xanh ngát của khu di tích Ải Chi Lăng Lạng Sơn",
    era: "today",
    year: 2013,
    visual: "Núi Mã Yên và quang cảnh thung lũng Ải Chi Lăng Lạng Sơn.",
  },
  {
    site: "mo-than-deo-nai",
    web: "https://assets.baoquangninh.vn/images/OlyUTCBq9YKfKAvTlrypRzTzmd7DUiThaCzGL6BrcTKbSrs9JNo4ybWs0IAZZMSpvgBz2tpxuoTr30Hji32qIg/images939247_Tra4.jpg",
    page: "https://baoquangninh.vn/di-tich-noi-bac-ho-ve-tham-mo-deo-nai-post2342565.html",
    credit: "Báo Quảng Ninh",
    usage: "coursework_reference",
    name: "bia-bac-ho-ve-tham-mo-deo-nai",
    caption: "Bia lưu niệm tại tầng than mỏ Đèo Nai ghi dấu ngày Bác Hồ về thăm công nhân vùng mỏ (30/3/1959).",
    alt: "Bia đá tưởng niệm Bác Hồ về thăm mỏ than Đèo Nai bên khai trường khai thác than lộ thiên Cẩm Phả",
    era: "today",
    year: 2022,
    visual: "Bia lưu niệm Bác Hồ về thăm mỏ than Đèo Nai tại Cẩm Phả Quảng Ninh.",
  },
  {
    site: "bai-coc-bach-dang",
    commons: "File:Cọc Bạch Đằng.jpg",
    name: "bai-coc-yen-giang",
    caption: "Dấu tích những hàng cọc gỗ lim dưới lòng sông tại bãi cọc Yên Giang (Quảng Ninh) trong chiến thắng Bạch Đằng 1288.",
    alt: "Những thân cọc gỗ đen thẫm cắm thẳng đứng nhô lên khỏi bùn lầy tại bãi cọc Bạch Đằng Yên Giang",
    era: "today",
    year: 2012,
    visual: "Những chiếc cọc gỗ lim tại bãi cọc Yên Giang Bạch Đằng Quảng Ninh.",
  },
  {
    site: "atk-ii-hiep-hoa",
    commons: "File:HiepHoaCayDa.JPG",
    name: "cay-da-cho-van-atk-ii",
    caption: "Cây đa Chợ Vân, một trong những địa điểm lịch sử thuộc An toàn khu II (ATK II) Hiệp Hòa, Bắc Giang thời kỳ tiền khởi nghĩa.",
    alt: "Cây đa cổ thụ Chợ Vân cành lá xum xuê bên đường làng thuộc di tích ATK II Hiệp Hòa",
    era: "today",
    year: 2009,
    visual: "Cây đa Chợ Vân thuộc di tích ATK II Hiệp Hòa Bắc Giang.",
  },
  {
    site: "khoi-nghia-yen-the",
    commons: "File:Hoàng Hoa Thám riding a horse.png",
    name: "hoang-hoa-tham-tren-ngua",
    usage: "public_domain",
    caption: "Thủ lĩnh khởi nghĩa Yên Thế Hoàng Hoa Thám (Đề Thám) trên lưng ngựa tại đồn Phồn Xương.",
    alt: "Bức ảnh tư liệu lịch sử chụp Đề Thám Hoàng Hoa Thám trang nghiêm trên lưng ngựa trong phong trào khởi nghĩa Yên Thế",
    era: "historical",
    year: 1905,
    visual: "Ảnh tư liệu Đề Thám Hoàng Hoa Thám cưỡi ngựa trong khởi nghĩa Yên Thế.",
  },
  {
    site: "chien-thang-song-lo-doan-hung",
    commons: "File:Tượng đài chiến thắng Sông Lô.jpg",
    name: "tuong-dai-song-lo",
    caption: "Tượng đài Chiến thắng Sông Lô trên đỉnh núi Đồn (thị trấn Đoan Hùng, Phú Thọ) ghi dấu chiến công thu đông 1947.",
    alt: "Tượng đài Chiến thắng Sông Lô vươn cao trên đồi nhìn xuống dòng sông Lô lịch sử",
    era: "today",
    year: 2021,
    visual: "Tượng đài Chiến thắng Sông Lô trên đỉnh đồi Đoan Hùng Phú Thọ.",
  },
  {
    site: "khu-di-tich-den-hung",
    commons: "File:Đền Hùng.JPG",
    name: "cong-vao-den-hung",
    caption: "Cổng vào Khu di tích lịch sử quốc gia đặc biệt Đền Hùng trên núi Nghĩa Lĩnh, Phú Thọ.",
    alt: "Cổng vào Đền Hùng uy nghi với mái ngói cổ kính rợp bóng cây cổ thụ trên núi Nghĩa Lĩnh",
    era: "today",
    year: 2011,
    visual: "Cổng chính Khu di tích lịch sử Đền Hùng núi Nghĩa Lĩnh.",
  },
  {
    site: "ben-k15-do-son",
    web: "https://imgchinhsachcuocsong.vnanet.vn/MediaUpload/Org/2026/03/30/125118-vna_potal_hai_phong_dai_le_ho_quoc_tieu_tai_cau_an_cau_sieu_anh_hung_liet_si_tai_ben_tau_khong_so_stand.jpg",
    page: "https://chinhsachcuocsong.vnanet.vn/ben-tau-khong-so-k15-dia-chi-do-nhac-nho-the-he-tre-ve-gia-tri-cua-hoa-binh-doc-lap/83591.html",
    credit: "Thông tấn xã Việt Nam (TTXVN)",
    usage: "coursework_reference",
    name: "tuong-dai-ben-k15-do-son",
    caption: "Tượng đài Di tích lịch sử quốc gia đặc biệt Đường Hồ Chí Minh trên biển tại Bến K15 Đồ Sơn, Hải Phòng.",
    alt: "Tượng đài cánh buồm bằng đá vươn cao tại di tích Bến K15 Đồ Sơn nơi xuất phát của các đoàn tàu không số",
    era: "today",
    year: 2026,
    visual: "Tượng đài cánh buồm kỷ niệm Đường Hồ Chí Minh trên biển tại Bến K15 Đồ Sơn.",
  },
  {
    site: "con-son-kiep-bac",
    commons: "File:Den kiep bac.jpg",
    name: "cong-nghi-mon-den-kiep-bac",
    caption: "Đền Kiếp Bạc thờ Hưng Đạo Đại Vương Trần Quốc Tuấn tại thành phố Chí Linh, Hải Dương.",
    alt: "Cổng nghi môn và sân tiền tế Đền Kiếp Bạc uy nghiêm bên dòng sông Lục Đầu",
    era: "today",
    year: 2008,
    visual: "Cổng nghi môn và đền Kiếp Bạc Chí Linh Hải Dương.",
  },
  {
    site: "tieng-trong-tien-hai",
    web: "https://dongchau.hungyen.gov.vn/updload_ubt/userfiles/files/%C4%91%C3%ACnh%20l%C3%A0ng%20nho%20l%C3%A2m%201.jpg",
    page: "https://dongchau.hungyen.gov.vn/dinh-lang-nho-lam-to-chuc-le-ky-niem-ngay-truyen-thong-cach-mang-c260.html",
    credit: "Cổng Thông tin Điện tử xã Đông Châu",
    usage: "coursework_reference",
    name: "dinh-lang-nho-lam-le-ky-niem",
    caption: "Đình làng Nho Lâm ghi dấu sự kiện Tiếng trống Tiền Hải ngày 14/10/1930 trong ngày hội truyền thống cách mạng.",
    alt: "Mặt tiền di tích lịch sử Đình làng Nho Lâm với mái ngói cổ truyền trong ngày kỷ niệm truyền thống cách mạng",
    era: "today",
    year: 2025,
    visual: "Đình làng Nho Lâm nơi vang lên tiếng trống Tiền Hải 1930.",
  },
  {
    site: "pho-hien",
    commons: "File:Văn miếu Xích Đằng 01.JPG",
    name: "tam-quan-van-mieu-xich-dang",
    caption: "Cổng tam quan Văn miếu Xích Đằng, biểu tượng văn hiến nghìn năm của đất Phố Hiến, Hưng Yên.",
    alt: "Cổng tam quan hai tầng mái ngói cổ kính rêu phong của Văn miếu Xích Đằng Phố Hiến",
    era: "today",
    year: 2011,
    visual: "Cổng tam quan Văn miếu Xích Đằng Phố Hiến Hưng Yên.",
  },
  {
    site: "nha-may-det-nam-dinh",
    commons: "File:Sơ đồ Nhà máy Dệt Nam Định (Bảo tàng tỉnh Nam Định).jpg",
    name: "so-do-nha-may-det-nam-dinh",
    usage: "public_domain",
    caption: "Sơ đồ lịch sử Nhà máy Dệt Nam Định thời kỳ phong trào công nhân đấu tranh lưu giữ tại Bảo tàng tỉnh Nam Định.",
    alt: "Bản đồ sơ đồ kiến trúc và quy hoạch Nhà máy Dệt Nam Định lưu giữ tại Bảo tàng tỉnh Nam Định",
    era: "historical",
    year: 1925,
    visual: "Bản vẽ sơ đồ mặt bằng Nhà máy Dệt Nam Định thời Pháp thuộc tại Bảo tàng Nam Định.",
  },
  {
    site: "co-do-hoa-lu",
    commons: "File:Gate at Hoa Lu - Vietnam - August 2023.jpg",
    name: "cong-vao-co-do-hoa-lu",
    caption: "Cổng vào Cố đô Hoa Lư, kinh đô đầu tiên của nhà nước phong kiến tập quyền Việt Nam dưới triều Đinh - Tiền Lê.",
    alt: "Cổng thành bằng đá với mái ngói cong truyền thống soi bóng nước thanh bình tại Cố đô Hoa Lư Ninh Bình",
    era: "today",
    year: 2023,
    visual: "Cổng vòm đá Cố đô Hoa Lư soi bóng bên hồ nước non Ninh Bình.",
  },
  {
    site: "cau-ham-rong",
    commons: "File:Ham Rong Bridge.jpg",
    name: "cau-ham-rong-song-ma",
    caption: "Cầu Hàm Rồng bắc qua sông Mã, biểu tượng ý chí kiên cường của quân dân Thanh Hóa trong kháng chiến chống Mỹ.",
    alt: "Cầu thép Hàm Rồng vững chãi bắc ngang dòng sông Mã uốn lượn dưới chân núi Rồng",
    era: "today",
    year: 2012,
    visual: "Cầu Hàm Rồng bắc qua sông Mã Thanh Hóa.",
  },
  {
    site: "thanh-nha-ho",
    commons: "File:Tay Do castle South gate.JPG",
    name: "cong-nam-thanh-nha-ho",
    usage: "public_domain",
    caption: "Cổng Nam Thành nhà Hồ (Tây Đô) xây bằng những khối đá lớn độc đáo thế kỷ XIV, Di sản văn hóa thế giới.",
    alt: "Cổng Nam thành đá nhà Hồ với ba vòm cuốn đồ sộ bằng đá xanh nguyên khối sừng sững giữa trời",
    era: "today",
    year: 2008,
    visual: "Cổng Nam Thành nhà Hồ với 3 vòm cuốn bằng khối đá xanh đồ sộ.",
  },
];

async function runBatchB() {
  console.log(`Bắt đầu xử lý Batch B (${BATCH_B_SPECS.length} di tích)...`);

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

  for (const spec of BATCH_B_SPECS) {
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
        searchLog: [`Sourced for Batch B: ${spec.commons || spec.web}`],
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

  // Create contact sheet for Batch B
  const contactSheetPath = path.join(root, "docs/audits/screenshots/contact-sheet-batch-b.png");
  await createContactSheet(
    "Batch B (16 di tích - Miền Bắc & Bắc Trung Bộ)",
    BATCH_B_SPECS.map((s) => s.site),
    contactSheetPath,
  );
  console.log(`✓ Đã tạo contact sheet: ${contactSheetPath}`);

  console.table(results);
}

runBatchB().catch(console.error);
