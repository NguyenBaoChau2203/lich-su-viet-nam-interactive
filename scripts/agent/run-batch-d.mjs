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

const BATCH_D_SPECS = [
  {
    site: "buon-ma-thuot-1975",
    commons: "File:Buôn Ma Thuột city square.jpg",
    name: "tuong-dai-chien-thang-buon-ma-thuot",
    caption: "Tượng đài Chiến thắng Buôn Ma Thuột tại Ngã Sáu trung tâm thành phố Buôn Ma Thuột, Đắk Lắk.",
    alt: "Tượng đài Chiến thắng Buôn Ma Thuột với biểu tượng xe tăng và hoa tiêu thép giữa vòng xoay Ngã Sáu",
    era: "today",
    year: 2011,
    visual: "Tượng đài Chiến thắng Buôn Ma Thuột tại Ngã Sáu trung tâm thành phố.",
  },
  {
    site: "vung-ro-phu-yen",
    commons: "File:Vịnh Vũng Rô.jpg",
    name: "vinh-vung-ro-ben-tau-khong-so",
    caption: "Vịnh Vũng Rô – Di tích Quốc gia đặc biệt nơi gắn liền với huyền thoại Tàu Không số Đường Hồ Chí Minh trên biển, thị xã Đông Hòa, Phú Yên.",
    alt: "Vịnh biển Vũng Rô với làn nước xanh ngắt được che chắn bởi các dãy núi non hùng vĩ",
    era: "today",
    year: 2011,
    visual: "Toàn cảnh Vịnh Vũng Rô di tích bến Tàu Không số tại Phú Yên.",
  },
  {
    site: "truong-duc-thanh",
    commons: "File:Trường Dục Thanh.jpg",
    name: "khu-di-tich-truong-duc-thanh",
    caption: "Khu di tích Lịch sử Trường Dục Thanh, nơi thầy giáo Nguyễn Tất Thành từng dạy học năm 1910 trước khi ra đi tìm đường cứu nước, thành phố Phan Thiết, Bình Thuận.",
    alt: "Dãy nhà cổ bằng gỗ mái ngói rêu phong của Trường Dục Thanh bên dòng sông Cà Ty",
    era: "today",
    year: 2012,
    visual: "Khu di tích Trường Dục Thanh với các gian nhà cổ truyền thống tại Phan Thiết.",
  },
  {
    site: "nha-lao-thieu-nhi-da-lat",
    commons: "File:Da Lat Children's Prison 02.jpg",
    name: "cong-vao-nha-lao-thieu-nhi-da-lat",
    caption: "Cổng vào Di tích Lịch sử Nhà lao Thiếu nhi Đà Lạt trên đồi Chi Lăng, thành phố Đà Lạt, Lâm Đồng.",
    alt: "Cổng vào di tích Nhà lao Thiếu nhi Đà Lạt với bia di tích lịch sử quốc gia",
    era: "today",
    year: 2012,
    visual: "Cổng vào và bia di tích Nhà lao Thiếu nhi Đà Lạt.",
  },
  {
    site: "chien-thang-xuan-loc-1975",
    web: "https://media.vietnamplus.vn/images/0f-btEj60lGt0BFs9lOY11sL-kerZiOPU-JLWRiZf0fEEa8Ekr7CveJymyhoJdpvO68Kok39VxEegRpLRCZeeA/720.jpg",
    page: "https://www.vietnamplus.vn/khoanh-khac-va-su-kien-ngay-2141975-dap-tan-canh-cua-thep-xuan-loc-post1034024.vnp",
    credit: "Tư liệu TTXVN / VietnamPlus",
    usage: "coursework_reference",
    name: "dap-tan-canh-cua-thep-xuan-loc",
    caption: "Quân giải phóng tiến công đập tan 'cánh cửa thép' Xuân Lộc ngày 21/4/1975, mở toang cửa ngõ phía Đông Bắc tiến vào Sài Gòn.",
    alt: "Hình ảnh lịch sử quân giải phóng tiến công giải phóng Xuân Lộc năm 1975",
    era: "historical",
    year: 1975,
    author: "Tư liệu TTXVN",
    visual: "Tư liệu ảnh lịch sử quân giải phóng giải phóng Xuân Lộc tháng 4/1975.",
  },
  {
    site: "can-cu-ta-thiet",
    web: "https://media.vietnamplus.vn/images/9cgL5XPNTuTvOC7riffqUP5bCc6Xz1jmbx5UTQ7TqRWYDUp4qK-gcP5L4QrC4FuT/Loc_Ninh_.jpg",
    page: "https://www.vietnamplus.vn/50-nam-thu-do-khang-chien-vung-dat-do-loc-ninh-o-binh-phuoc-post780152.vnp",
    credit: "Sỹ Tuyên / TTXVN",
    usage: "coursework_reference",
    name: "can-cu-ta-thiet-loc-ninh",
    caption: "Vùng đất đỏ Lộc Ninh – Căn cứ Tà Thiết, nơi đặt Sở Chỉ huy Chiến dịch Hồ Chí Minh lịch sử năm 1975, tỉnh Bình Phước.",
    alt: "Vùng đất lịch sử Lộc Ninh nơi tọa lạc Căn cứ Quân giải phóng miền Nam Tà Thiết",
    era: "today",
    year: 2022,
    author: "Sỹ Tuyên/TTXVN",
    visual: "Địa bàn di tích Căn cứ Tà Thiết Lộc Ninh Bình Phước.",
  },
  {
    site: "dinh-doc-lap",
    commons: "File:Palacio de la Reunificación, Ciudad Ho Chi Minh, Vietnam, 2013-08-14, DD 03.JPG",
    name: "mat-tien-dinh-doc-lap",
    caption: "Mặt tiền Di tích Quốc gia đặc biệt Dinh Độc Lập (Hội trường Thống Nhất), Quận 1, Thành phố Hồ Chí Minh.",
    alt: "Mặt tiền kiến trúc Dinh Độc Lập với thảm cỏ xanh và đài phun nước phía trước",
    era: "today",
    year: 2013,
    visual: "Mặt tiền Dinh Độc Lập với kiến trúc đặc trưng và đài phun nước.",
  },
  {
    site: "dia-dao-cu-chi",
    commons: "File:Cu Chi Tunnel Entry (1).jpg",
    name: "cua-ham-dia-dao-cu-chi",
    caption: "Cửa hầm ngụy trang bí mật tại Di tích Quốc gia đặc biệt Địa đạo Củ Chi, huyện Củ Chi, Thành phố Hồ Chí Minh.",
    alt: "Miệng nắp hầm địa đạo Củ Chi được ngụy trang khéo léo bằng lá cây khô giữa rừng",
    era: "today",
    year: 2004,
    visual: "Cửa hầm bí mật địa đạo Củ Chi ngụy trang bằng lá khô.",
  },
  {
    site: "can-cu-trung-uong-cuc-mien-nam",
    commons: "File:Ngã Ba vào Trung ương Cục miền Nam - panoramio.jpg",
    name: "duong-vao-can-cu-trung-uong-cuc",
    caption: "Đường vào Khu di tích Quốc gia đặc biệt Căn cứ Trung ương Cục miền Nam (Rừng Rùm Đuôn), huyện Tân Biên, tỉnh Tây Ninh.",
    alt: "Con đường rợp bóng cây cổ thụ dẫn vào khu di tích Căn cứ Trung ương Cục miền Nam",
    era: "today",
    year: 2010,
    visual: "Đường rừng vào Căn cứ Trung ương Cục miền Nam tại Tây Ninh.",
  },
  {
    site: "nga-tu-duc-hoa",
    commons: "File:CongVienVoVanTan.JPG",
    name: "cong-vien-tuong-dai-vo-van-tan",
    caption: "Công viên và Tượng đài đồng chí Võ Văn Tần tại Khu di tích Lịch sử Ngã tư Đức Hòa, thị trấn Đức Hòa, huyện Đức Hòa, Long An.",
    alt: "Tượng đài đồng chí Võ Văn Tần uy nghi giữa công viên tại Ngã tư Đức Hòa",
    era: "today",
    year: 2017,
    visual: "Tượng đài đồng chí Võ Văn Tần tại khu di tích Ngã tư Đức Hòa Long An.",
  },
  {
    site: "chien-thang-ap-bac-1963",
    web: "https://media.vietnamplus.vn/images/9cgL5XPNTuTvOC7riffqUObSo5mjqcLIN0EP9DSNCgCr3LnyR7_0lcgeIwLJbOPC4ZfxPEX5tqxeS5gy8czelQ/chien_thang_ap__bac_3112.jpg",
    page: "https://www.vietnamplus.vn/chien-thang-ap-bac-buoc-ngoat-trong-cuoc-khang-chien-chong-my-post839211.vnp",
    credit: "Minh Trí / TTXVN",
    usage: "coursework_reference",
    name: "tuong-dai-chien-thang-ap-bac",
    caption: "Cụm tượng đài Ba chiến sĩ gang thép tại Khu di tích Quốc gia đặc biệt Chiến thắng Ấp Bắc, thị xã Cai Lậy, tỉnh Tiền Giang.",
    alt: "Tượng đài ba chiến sĩ gang thép sừng sững tại di tích Chiến thắng Ấp Bắc",
    era: "today",
    year: 2023,
    author: "Minh Trí/TTXVN",
    visual: "Tượng đài Ba chiến sĩ gang thép tại di tích Chiến thắng Ấp Bắc.",
  },
  {
    site: "mo-cu-pho-bang-nguyen-sinh-sac",
    commons: "File:Mộ Nguyễn Sinh Sắc ở Cao Lãnh.jpg",
    name: "lang-mo-cu-pho-bang-nguyen-sinh-sac",
    caption: "Khu lăng mộ Cụ Phó bảng Nguyễn Sinh Sắc – thân sinh Chủ tịch Hồ Chí Minh tại phường 4, thành phố Cao Lãnh, Đồng Tháp.",
    alt: "Mái vòm hình cánh sen cách điệu che chở phần mộ Cụ Phó bảng Nguyễn Sinh Sắc",
    era: "today",
    year: 2012,
    visual: "Vòm mộ hình hoa sen của Cụ Phó bảng Nguyễn Sinh Sắc tại Cao Lãnh.",
  },
  {
    site: "dong-khoi-ben-tre-1960",
    commons: "File:Nha truyen thong Dong Khoi.JPG",
    name: "nha-truyen-thong-dong-khoi",
    caption: "Nhà truyền thống Khu di tích Quốc gia đặc biệt Đồng Khởi tại xã Định Thủy, huyện Mỏ Cày Nam, tỉnh Bến Tre.",
    alt: "Nhà truyền thống Đồng Khởi Bến Tre với kiến trúc hình khối hiện đại và biểu tượng ngọn lửa thiêng",
    era: "today",
    year: 2011,
    visual: "Nhà truyền thống di tích phong trào Đồng Khởi tại Định Thủy Mỏ Cày Nam Bến Tre.",
  },
  {
    site: "khu-tuong-niem-vo-van-kiet",
    commons: "File:Phù điêu Võ Văn Kiệt.jpg",
    name: "phu-dieu-khu-tuong-niem-vo-van-kiet",
    caption: "Bức phù điêu khắc họa chân dung và cuộc đời Cố Thủ tướng Võ Văn Kiệt tại Khu tưởng niệm ở thị trấn Vũng Liêm, Vĩnh Long.",
    alt: "Bức phù điêu nghệ thuật bằng gốm đỏ tái hiện hình ảnh Thủ tướng Võ Văn Kiệt gắn bó với nhân dân Nam Bộ",
    era: "today",
    year: 2021,
    visual: "Bức phù điêu tại Khu tưởng niệm Cố Thủ tướng Võ Văn Kiệt tại Vũng Liêm Vĩnh Long.",
  },
  {
    site: "nha-tu-phu-quoc",
    commons: "File:Phu Quoc Prison 02.jpg",
    name: "trai-giam-tu-binh-phu-quoc",
    caption: "Khu di tích Quốc gia đặc biệt Trại giam Tù binh Chiến tranh Phú Quốc (Nhà lao Cây Dừa), thành phố Phú Quốc, Kiên Giang.",
    alt: "Các dãy nhà giam mái tôn, hàng rào thép gai và chòi canh gác tại Nhà tù Phú Quốc",
    era: "today",
    year: 2015,
    visual: "Các dãy lán trại giam và hàng rào dây thép gai tại Trại giam Tù binh Phú Quốc.",
  },
  {
    site: "khu-luu-niem-ton-duc-thang",
    commons: "File:Le mémorial du Président Ton Duc Thang (île du Tigre, Vietnam) (6635518367).jpg",
    name: "nha-tuong-niem-chu-tich-ton-duc-thang",
    caption: "Đền tưởng niệm Chủ tịch Tôn Đức Thắng tại Khu lưu niệm ở Cù lao Ông Hổ, xã Mỹ Hòa Hưng, thành phố Long Xuyên, An Giang.",
    alt: "Đền tưởng niệm Chủ tịch Tôn Đức Thắng với kiến trúc đền cổ truyền thống giữa vườn cây râm mát",
    era: "today",
    year: 2012,
    visual: "Khu đền tưởng niệm Bác Tôn tại Cù lao Ông Hổ Mỹ Hòa Hưng An Giang.",
  },
  {
    site: "chien-thang-chuong-thien-1973",
    commons: "File:ChuongThien2-73.jpg",
    name: "tuong-dai-chien-thang-75-luot-tieu-doan-chuong-thien",
    caption: "Tượng đài Chiến thắng 75 lượt tiểu đoàn ngụy tại Di tích Quốc gia đặc biệt Chiến thắng Chương Thiện, thành phố Vị Thanh, Hậu Giang.",
    alt: "Cụm tượng đài chiến thắng Chương Thiện vươn cao với các phù điêu tái hiện khí thế tiến công của quân dân miền Tây",
    era: "today",
    year: 2021,
    visual: "Cụm tượng đài Chiến thắng Chương Thiện tại thành phố Vị Thanh Hậu Giang.",
  },
  {
    site: "kham-lon-can-tho",
    commons: "File:Khám lớn Cần Thơ.jpg",
    name: "di-tich-kham-lon-can-tho",
    caption: "Di tích Lịch sử Khám Lớn Cần Thơ, nơi thực dân Pháp và chính quyền Sài Gòn giam cầm những chiến sĩ cách mạng kiên trung tại Cần Thơ.",
    alt: "Tường thành kiên cố và cổng sắt của Di tích Khám Lớn Cần Thơ",
    era: "today",
    year: 2012,
    visual: "Tường đá và cổng sắt của di tích Khám Lớn Cần Thơ.",
  },
  {
    site: "khoi-nghia-hon-khoai-1940",
    commons: "File:Hon Khoai Island.jpg",
    name: "hon-khoai-noi-khoi-nghia-nam-1940",
    caption: "Đảo Hòn Khoai – Di tích Lịch sử nơi nổ ra cuộc Khởi nghĩa Hòn Khoai năm 1940 do thầy giáo Phan Ngọc Hiển lãnh đạo, huyện Ngọc Hiển, Cà Mau.",
    alt: "Đảo Hòn Khoai xanh mướt nổi bật giữa biển trời mênh mông cực Nam Tổ quốc",
    era: "today",
    year: 2016,
    visual: "Đảo Hòn Khoai ngoài khơi biển Cà Mau nơi diễn ra Khởi nghĩa Hòn Khoai 1940.",
  },
  {
    site: "ben-vam-lung",
    web: "https://media.vietnamplus.vn/images/3D2ICSGw-FGdbx8FKgBYyNq1BZotOAp44hAN9M6bxen6f51CenlnsCZHamFIfdLy/ttxvn-ben-vam-lung1.jpg",
    page: "https://www.vietnamplus.vn/ca-mau-bao-ton-di-tich-ben-vam-lung-diem-cuoi-duong-ho-chi-minh-tren-bien-post1034895.vnp",
    credit: "Huỳnh Anh / TTXVN",
    usage: "coursework_reference",
    name: "tuong-dai-ben-vam-lung-duong-ho-chi-minh-tren-bien",
    caption: "Bến Vàm Lũng – Điểm cuối đường Hồ Chí Minh trên biển, Di tích Lịch sử Quốc gia đặc biệt tại xã Tân Ân, huyện Ngọc Hiển, Cà Mau.",
    alt: "Tượng đài kỷ niệm chiến công Tàu Không số tại bến Vàm Lũng giữa rừng ngập mặn Cà Mau",
    era: "today",
    year: 2021,
    author: "Huỳnh Anh/TTXVN",
    visual: "Tượng đài kỷ niệm bến Vàm Lũng đường Hồ Chí Minh trên biển Cà Mau.",
  },
];

async function runBatchD() {
  console.log(`Bắt đầu xử lý Batch D (${BATCH_D_SPECS.length} di tích)...`);

  const sitesData = JSON.parse(fs.readFileSync(sitesPath, "utf8"));
  const results = [];

  for (const spec of BATCH_D_SPECS) {
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
        searchLog: [`Sourced for Batch D: ${spec.commons || spec.web}`],
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

  // Create contact sheet for Batch D
  const contactSheetPath = path.join(root, "docs/audits/screenshots/contact-sheet-batch-d.png");
  await createContactSheet(
    "Batch D (20 di tích - Nam Trung Bộ, Đông Nam Bộ, Tây Nam Bộ)",
    BATCH_D_SPECS.map((s) => s.site),
    contactSheetPath,
  );
  console.log(`✓ Đã tạo contact sheet: ${contactSheetPath}`);

  console.table(results);
}

runBatchD().catch(console.error);
