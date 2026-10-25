import type { HistoryJourney, JourneySource } from "@/lib/explorer/journey";

// Bounded claims and representative areas: docs/audits/2026-10-24-additional-journey-sources.md.
const citySource: JourneySource = {
  title: "Natural Earth 1:10m Populated Places, v5.1.2", publisher: "Natural Earth contributors",
  url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson",
  accessedAt: "2026-10-24", scope: "Điểm đô thị hiện nay dùng định hướng vùng chiến dịch; không xác định một trận địa lịch sử.",
};

export const KHANG_CHIEN_CHONG_PHAP_1946_1954: HistoryJourney = {
  id: "khang-chien-chong-phap-1946-1954", title: "Những mốc kháng chiến chống Pháp", period: "1946 — 1954",
  note: "Năm mốc chọn lọc từ Toàn quốc kháng chiến đến Tuyên bố Genève, không bao quát cuộc kháng chiến từ năm 1945. Đường nối là sơ đồ, không phải đường hành quân; các chiến dịch dùng khu vực đại diện.",
  lessonSlugs: ["7-khang-chien-chong-phap"],
  stops: [
    {
      id: "ha-noi-1946", title: "Toàn quốc kháng chiến", place: "Hà Nội · khu vực trung tâm", mapLabel: "Hà Nội",
      date: "19/12/1946", sortDate: "1946-12-19", datePrecision: "day",
      summary: "Tối 19/12, quân dân Hà Nội nổ súng chiến đấu. Cuộc kháng chiến trên phạm vi toàn quốc bắt đầu, mở ra chặng đường kháng chiến lâu dài.",
      accuracy: "approximate",
      accuracyNote: "Tái dùng điểm định hướng cấp thành phố Hà Nội đã công bố. Không đánh dấu ngôi nhà ở Vạn Phúc, nơi soạn lời kêu gọi hay trận địa pháo; chiến đấu diễn ra ở nhiều nơi.",
      coordinateSource: {
        title: "Địa điểm đã công bố: khu vực trung tâm Hà Nội", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/ha-noi-khu-vuc-trung-tam", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: ha-noi-khu-vuc-trung-tam, đối chiếu supabase/seed.sql. Chỉ tái dùng tọa độ định hướng đô thị, không tái dùng vai trò địa điểm Đại hội VI cho năm 1946.",
      },
      sources: [{
        title: "19-12-1946: Ngày toàn quốc kháng chiến", publisher: "Bảo tàng Lịch sử Quốc gia · Phương Anh (tổng hợp)",
        url: "https://baotanglichsu.vn/vi/Articles/2002/68312/19-12-1946-ngay-toan-quoc-khang-chien.html", accessedAt: "2026-10-24",
        scope: "Đoạn Chấp hành mệnh lệnh chiến đấu: tín hiệu tối 19/12/1946 và quân dân Hà Nội nổ súng mở đầu kháng chiến toàn quốc. Không định vị nơi soạn/phát lời kêu gọi.",
      }],
      view: { lat: 21.0285, lng: 105.8542, zoom: 6.8 },
    },
    {
      id: "viet-bac-1947", title: "Bảo vệ căn cứ Việt Bắc", place: "Việt Bắc · lấy khu vực Bắc Kạn làm đại diện", mapLabel: "Việt Bắc",
      date: "07/10/1947 · mở đầu", sortDate: "1947-10-07", datePrecision: "day",
      summary: "Ngày 7/10, quân Pháp mở cuộc tiến công lên Việt Bắc, trong đó có cuộc nhảy dù xuống Bắc Kạn. Quân dân Việt Bắc tổ chức chiến đấu bảo vệ căn cứ kháng chiến.",
      accuracy: "approximate",
      accuracyNote: "Điểm đô thị Bắc Kạn làm đại diện định hướng cho vùng Việt Bắc rộng hơn. Không phải bãi nhảy dù, vị trí cơ quan đầu não hay ranh giới chiến dịch. Ngày hiển thị là ngày mở đầu cuộc tiến công.",
      coordinateSource: { ...citySource, scope: "GeoJSON v5.1.2: name = Bắc Kạn, adm0name = Vietnam, Point [105.833333, 22.133333]. Điểm đô thị đại diện vùng, không định vị bãi nhảy dù hay toàn căn cứ Việt Bắc." },
      sources: [{
        title: "Lịch sử Biên niên Đảng Cộng sản Việt Nam — Tập 3", publisher: "Tư liệu Văn kiện Đảng · Cổng TTĐT ĐCSVN",
        url: "https://tulieuvankien.dangcongsan.vn/van-kien-tu-lieu-ve-dang/book/lich-su-dang/lich-su-bien-nien-dang-cong-san-viet-nam-tap-3-176?categoryId=102000083",
        accessedAt: "2026-10-24",
        scope: "Phần năm 1947, mục Cuộc phản công Việt Bắc thắng lợi và các mục 9/10, 15/10: Pháp tiến công ngày 7/10, nhảy dù Bắc Kạn, quân dân phản công. Chỉ dùng ngày mở đầu, không ấn định ngày kết thúc.",
      }],
      view: { lat: 22.133333, lng: 105.833333, zoom: 6.4 },
    },
    {
      id: "bien-gioi-1950", title: "Mở chiến dịch Biên giới", place: "Cao Bằng — Lạng Sơn · khu vực chiến dịch", mapLabel: "Biên giới 1950",
      date: "16/09/1950 · mở đầu", sortDate: "1950-09-16", datePrecision: "day",
      summary: "Trận tiến công Đông Khê ngày 16/9 mở đầu chiến dịch Biên giới. Các trận đánh tiếp theo làm thay đổi thế trận trên tuyến Cao Bằng — Lạng Sơn.",
      accuracy: "approximate",
      accuracyNote: "Điểm đô thị Cao Bằng làm đại diện cho khu vực chiến dịch Cao Bằng — Lạng Sơn. Không phải tọa độ Đông Khê, núi Báo Đông hay tuyến hành quân. Ngày hiển thị là ngày trận mở đầu.",
      coordinateSource: { ...citySource, scope: "GeoJSON v5.1.2: name = Cao Bằng, adm0name = Vietnam, Point [106.268005, 22.663998]. Điểm đô thị định hướng vùng chiến dịch, không phải tọa độ trận Đông Khê." },
      sources: [{
        title: "Di tích Núi Báo Đông nơi Chủ tịch Hồ Chí Minh quan sát trận đánh Đồn Đông Khê, Chiến dịch Biên giới 1950",
        publisher: "Bảo tàng Hồ Chí Minh",
        url: "https://baotanghochiminh.vn/di-tich-nui-bao-dong-noi-chu-tich-ho-chi-minh-quan-sat-tran-danh-don-dong-khe-chien-dich-bien-gioi-1950.htm",
        accessedAt: "2026-10-24",
        scope: "Đoạn nổ súng 16/9/1950 tại Đông Khê mở đầu chiến dịch; đoạn tiếp theo về rút khỏi Cao Bằng, đường số 4 và kết quả chiến dịch. Không cung cấp tọa độ trận địa.",
      }],
      view: { lat: 22.663998, lng: 106.268005, zoom: 6.4 },
    },
    {
      id: "dien-bien-phu-1954", title: "Chiến thắng Điện Biên Phủ", place: "Điện Biên Phủ · khu vực lòng chảo", mapLabel: "Điện Biên Phủ",
      date: "07/05/1954", sortDate: "1954-05-07", datePrecision: "day",
      summary: "Ngày 7/5, đợt tiến công cuối cùng kết thúc bằng thắng lợi tại Điện Biên Phủ. Tập đoàn cứ điểm của quân Pháp bị đánh bại.",
      accuracy: "approximate",
      accuracyNote: "Tái dùng neo khu vực lòng chảo Điện Biên Phủ đã công bố. Không định vị đồi A1, hầm chỉ huy hay toàn bộ hệ thống cứ điểm; điểm chỉ đại diện địa bàn chiến dịch.",
      coordinateSource: {
        title: "Địa điểm đã công bố: khu vực Điện Biên Phủ", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/dien-bien-phu", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: dien-bien-phu, địa điểm chính của chiến dịch đã công bố; đối chiếu supabase/seed.sql. Giữ nguyên độ chính xác vùng lòng chảo, không nâng thành một cứ điểm.",
      },
      sources: [{
        title: "Trận quyết chiến chiến lược — Tiêu diệt tập đoàn cứ điểm Điện Biên Phủ. Đợt III: Đòn quyết định",
        publisher: "Bảo tàng Lịch sử Quốc gia · Huệ – Chính (tổng hợp)",
        url: "https://baotanglichsu.vn/vi/Articles/2002/67999/tran-quyet-chien-chien-luoc-tieu-diet-tap-djoan-cu-djiem-djien-bien-phu-13-3-7-5-1954-djot-iii-djon-quyet-djinh.html",
        accessedAt: "2026-10-24",
        scope: "Diễn biến đợt cuối và đoạn kết về ngày 7/5/1954, tập đoàn cứ điểm bị tiêu diệt. Không dùng số ngày đêm trong bài hay suy ra mọi chiến sự chấm dứt cùng ngày.",
      }],
      view: { lat: 21.386, lng: 103.023, zoom: 7 }, eventSlug: "chien-dich-dien-bien-phu",
    },
    {
      id: "geneve-1954", title: "Tuyên bố cuối cùng tại Genève", place: "Genève · Thụy Sĩ", mapLabel: "Genève",
      date: "21/07/1954", sortDate: "1954-07-21", datePrecision: "day",
      summary: "Tuyên bố cuối cùng của Hội nghị Genève ghi nhận các hiệp định đình chỉ chiến sự ở Đông Dương và nêu nguyên tắc tôn trọng độc lập, chủ quyền.",
      accuracy: "approximate",
      accuracyNote: "Tái dùng điểm định hướng cấp thành phố Genève đã công bố, không phải phòng họp hay trụ sở hội nghị. Mốc ghi ngày Tuyên bố cuối cùng, không gộp mọi văn kiện hoặc chữ ký vào một ngày.",
      coordinateSource: {
        title: "Địa điểm đã công bố: thành phố Genève", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/geneve-thuy-si", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: geneve-thuy-si, đối chiếu supabase/seed.sql. Tái dùng điểm định hướng đô thị, giữ nguyên ghi chú chưa xác định chính xác địa điểm họp.",
      },
      sources: [{
        title: "The Final Declaration on Indochina — FRUS 1952–1954, Volume XVI, document 1038",
        publisher: "U.S. Department of State · Office of the Historian",
        url: "https://history.state.gov/historicaldocuments/frus1952-54v16/d1038", accessedAt: "2026-10-24",
        scope: "IC/43 Rev.2, đề ngày Geneva, 21 July 1954; điều 1–2 ghi nhận các hiệp định đình chỉ chiến sự, điều 12 về chủ quyền. Không khẳng định mọi phái đoàn ký Tuyên bố.",
      }],
      view: { lat: 46.2044, lng: 6.1432, zoom: 5.8 }, eventSlug: "hiep-dinh-geneve-ve-dong-duong",
    },
  ],
};
