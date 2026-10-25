import type { HistoryJourney, JourneySource } from "@/lib/explorer/journey";

const journeySource: JourneySource = {
  title: "Chủ tịch Hồ Chí Minh và hành trình 30 năm tìm đường cứu nước giải phóng dân tộc",
  publisher: "Cổng thông tin Hồ Chí Minh", accessedAt: "2026-10-23",
  url: "https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013",
  scope: "Các chặng đầu năm 1911, thời gian ở Anh, hoạt động tại Pháp và Liên Xô.",
};
const returnSource: JourneySource = {
  title: "Hành trình đi tìm hình của nước", publisher: "Trang tin Thành ủy TP. Hồ Chí Minh",
  url: "https://hcmcpv.org.vn/tin-tuc/hanh-trinh-di-tim-hinh-cua-nuoc-1491878832", accessedAt: "2026-10-23",
  scope: "Ngày rời Bến Nhà Rồng, đến Marseille, hoạt động ở Anh/Pháp và trở về qua mốc 108 năm 1941.",
};
const citySource: JourneySource = {
  title: "Natural Earth 1:10m Populated Places, v5.1.2", publisher: "Natural Earth contributors",
  url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson",
  accessedAt: "2026-10-23", scope: "Tọa độ điểm đô thị để định hướng; không xác định công trình lịch sử.",
};
const areaSource: JourneySource = {
  title: "Thông tin về các khu bảo vệ hiện có và đề xuất ở Việt Nam, tái bản lần 2: Pắc Bó (15/02/2004)",
  publisher: "Sourcebook các khu bảo vệ Việt Nam, bản lưu tại thiennhienviet.org.vn",
  url: "https://thiennhienviet.org.vn/sourcebook/pdf/Dong%20bac/Pac%20Bo.pdf", accessedAt: "2026-10-23",
  scope: "Trang 1: khu văn hóa lịch sử Pắc Bó, tọa độ khái quát 22°58′N, 106°03′E.",
};
const cityNote = "Điểm định hướng gần đúng ở cấp thành phố theo Natural Earth; không phải tọa độ một công trình hay nơi diễn ra hoạt động cụ thể.";

export const HISTORY_JOURNEY: HistoryJourney = {
  id: "ho-chi-minh-1911-1941", title: "Hành trình của Chủ tịch Hồ Chí Minh", period: "1911 — 1941",
  note: "Các mốc chọn lọc, không bao quát mọi chặng đi. Đường nối các mốc là sơ đồ, không phải tuyến di chuyển thực tế.",
  lessonSlugs: [],
  stops: [
    { id: "sai-gon-1911", title: "Rời Tổ quốc", place: "Bến Nhà Rồng · Sài Gòn", mapLabel: "Sài Gòn", date: "05/06/1911", sortDate: "1911-06-05", datePrecision: "day",
      summary: "Từ Bến Nhà Rồng, Nguyễn Tất Thành lên đường tìm con đường cứu nước.",
      view: { lat: 10.762125, lng: 106.702985, zoom: 6.4 }, accuracy: "approximate", accuracyNote: `${cityNote} Bến Nhà Rồng được giới thiệu trong nội dung, còn bản đồ đánh dấu khu vực Sài Gòn.`,
      coordinateSource: citySource, sources: [returnSource], eventSlug: "nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc" },
    { id: "marseille-1911", title: "Đến Marseille", place: "Marseille · Pháp", date: "06/07/1911", sortDate: "1911-07-06", datePrecision: "day",
      summary: "Tàu đưa Nguyễn Tất Thành tới cảng Marseille ở miền Nam nước Pháp.",
      view: { lat: 43.291925, lng: 5.373064, zoom: 5.5 }, accuracy: "approximate", accuracyNote: cityNote, coordinateSource: citySource, sources: [journeySource, returnSource] },
    { id: "london-1913", title: "Những năm ở Anh", place: "London · Anh", date: "1913", sortDate: "1913", datePrecision: "year",
      summary: "Nguyễn Tất Thành đến Anh, lao động và tìm hiểu đời sống xã hội.",
      view: { lat: 51.501941, lng: -0.118668, zoom: 5.5 }, accuracy: "approximate", accuracyNote: `${cityNote} Mốc ghi theo năm; không khẳng định ngày đến London.`, coordinateSource: citySource, sources: [journeySource] },
    { id: "paris-1919", title: "Tiếng nói tại Pháp", place: "Paris · Pháp", date: "06/1919", sortDate: "1919-06", datePrecision: "month",
      summary: "Nguyễn Ái Quốc gửi Yêu sách của nhân dân An Nam tới Hội nghị Versailles.",
      view: { lat: 48.858092, lng: 2.352992, zoom: 5.7 }, accuracy: "approximate", accuracyNote: `${cityNote} Paris là khu vực hoạt động; điểm này không đánh dấu địa điểm hội nghị tại Versailles.`, coordinateSource: citySource, sources: [journeySource, returnSource], eventSlug: "ban-yeu-sach-cua-nhan-dan-an-nam-1919" },
    { id: "tours-1920", title: "Bước ngoặt ở Tours", place: "Tours · Pháp", date: "12/1920", sortDate: "1920-12", datePrecision: "month",
      summary: "Tại Đại hội Tours, Nguyễn Ái Quốc tham gia thành lập Đảng Cộng sản Pháp.",
      view: { lat: 47.380375, lng: 0.699947, zoom: 5.8 }, accuracy: "approximate", accuracyNote: cityNote, coordinateSource: citySource, sources: [journeySource] },
    { id: "moscow-1923", title: "Hoạt động tại Liên Xô", place: "Moskva · Liên Xô (nay thuộc Nga)", date: "1923", sortDate: "1923", datePrecision: "year",
      summary: "Sau khi đến Petrograd, Nguyễn Ái Quốc tiếp tục tới Moskva để học tập, hoạt động.",
      view: { lat: 55.75411, lng: 37.613577, zoom: 5.2 }, accuracy: "approximate", accuracyNote: `${cityNote} Tọa độ đô thị hiện nay; không định vị nơi ở hay một hội nghị cụ thể.`, coordinateSource: citySource, sources: [journeySource] },
    { id: "pac-bo-1941", title: "Trở về Tổ quốc", place: "Pác Bó · Cao Bằng", date: "28/01/1941", sortDate: "1941-01-28", datePrecision: "day",
      summary: "Nguyễn Ái Quốc trở về qua mốc 108, trực tiếp lãnh đạo cách mạng trong nước.",
      view: { lat: 22.966667, lng: 106.05, zoom: 7 }, accuracy: "approximate",
      accuracyNote: "Vị trí khái quát khu văn hóa lịch sử Pác Bó theo tài liệu khu bảo vệ; không phải tọa độ chính xác cột mốc 108 hay hang Cốc Bó.", coordinateSource: areaSource, sources: [returnSource], eventSlug: "nguyen-ai-quoc-ve-nuoc-lanh-dao-cach-mang" },
  ],
};
