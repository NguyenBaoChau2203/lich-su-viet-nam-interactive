import type { HistoryJourney, JourneySource } from "@/lib/explorer/journey";

// Claim scope, source discrepancies and coordinates are reviewed in the Task 07 ledger.
const citySource: JourneySource = {
  title: "Natural Earth 1:10m Populated Places, v5.1.2", publisher: "Natural Earth contributors",
  url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson",
  accessedAt: "2026-10-24", scope: "Điểm đô thị hiện nay dùng định hướng; không xác định vị trí chiến đấu cụ thể năm 1975.",
};
const exhibitionSource: JourneySource = {
  title: "Thông tin báo chí trưng bày chuyên đề: Non sông liền một dải",
  publisher: "Bảo tàng Lịch sử Quốc gia",
  url: "https://baotanglichsu.vn/VI/Articles/3090/75384/thong-tin-bao-chi-trung-bay-chuyen-dje-non-song-lien-mot-dai.html",
  accessedAt: "2026-10-24",
  scope: "Phần 3, Tài liệu, hiện vật tiêu biểu: Huế 26/3, Đà Nẵng 29/3, xe tăng và lá cờ tại Dinh Độc Lập 30/4/1975. Không dùng chú thích Buôn Ma Thuột để xác định ngày làm chủ thị xã.",
};

export const MUA_XUAN_1975: HistoryJourney = {
  id: "mua-xuan-1975", title: "Mùa Xuân 1975", period: "10/03 — 30/04/1975",
  note: "Bốn mốc chọn lọc của cuộc Tổng tiến công và nổi dậy mùa Xuân 1975. Đường nối là sơ đồ giữa các mốc, không phải tuyến hành quân; mỗi điểm chỉ đại diện một đô thị hoặc khu vực di tích.",
  lessonSlugs: ["8-khang-chien-chong-my-cuu-nuoc"],
  stops: [
    {
      id: "buon-ma-thuot-1975", title: "Tiến công Buôn Ma Thuột", place: "Buôn Ma Thuột · khu vực đô thị", mapLabel: "Buôn Ma Thuột",
      date: "10/03/1975 · bắt đầu tiến công", sortDate: "1975-03-10", datePrecision: "day",
      summary: "Cuộc tiến công Buôn Ma Thuột bắt đầu ngày 10/3. Quân Giải phóng làm chủ thị xã ngày 11/3; hai ngày này đánh dấu diễn biến khác nhau của trận đánh then chốt ở Tây Nguyên.",
      accuracy: "approximate",
      accuracyNote: "Điểm định hướng đô thị Buôn Ma Thuột theo Natural Earth, không phải Sư bộ 23, sân bay hay Ngã Sáu. Ngày hiển thị là ngày bắt đầu tiến công; việc làm chủ thị xã được phân biệt ở ngày 11/3.",
      coordinateSource: { ...citySource, scope: "GeoJSON v5.1.2: name = Buon Me Thuot, adm0name = Vietnam, Point [108.049983, 12.667042]. Điểm đô thị định hướng, không phải mục tiêu quân sự cụ thể." },
      sources: [{
        title: "Chiến thắng Buôn Ma Thuột ngày 10.3.1975, mở màn thắng lợi cho Chiến dịch Tây Nguyên",
        publisher: "Đoàn ĐBQH và HĐND tỉnh Đắk Lắk · Trương Đức Nghị",
        url: "https://dbnd.daklak.gov.vn/chien-thang-buon-ma-thuot-ngay-1031975-mo-man-thang-loi-cho-chien-dich-tay-nguyen-tao-buoc-ngoat-lich-su-quan-trong-cho-dai-thang-mua-xuan-nam-1975-1274.html",
        accessedAt: "2026-10-24",
        scope: "Đoạn mở đầu: tiến công 10/3; đoạn Trong ngày 10/3 nêu các mục tiêu chưa chiếm; đoạn Ngày 11/3 ghi làm chủ mục tiêu. Phân biệt ngày mở trận với làm chủ thị xã.",
      }, {
        title: "Nhớ về chiến dịch mang tính bước ngoặt của mùa Xuân 1975", publisher: "Báo Điện tử Chính phủ · Hà Minh Hồng",
        url: "https://baochinhphu.vn/nho-ve-chien-dich-mang-tinh-buoc-ngoat-cua-mua-xuan-1975-102270035.htm", accessedAt: "2026-10-24",
        scope: "Đoạn Từ ngày 10–11/3/1975 xác định trận then chốt tiến công giải phóng Buôn Ma Thuột; tách khỏi chuẩn bị trước đó và phản kích về sau. Đối chiếu phạm vi trận đánh.",
      }],
      view: { lat: 12.667042, lng: 108.049983, zoom: 6.8 },
    },
    {
      id: "hue-1975", title: "Giải phóng Huế", place: "Huế · khu vực thành phố", mapLabel: "Huế",
      date: "26/03/1975", sortDate: "1975-03-26", datePrecision: "day",
      summary: "Đến ngày 26/3, Huế và toàn tỉnh Thừa Thiên được giải phóng. Đây là mốc kết quả của chiến dịch Trị Thiên trong cuộc tiến công mùa Xuân.",
      accuracy: "approximate",
      accuracyNote: "Tái dùng điểm định hướng cấp thành phố Huế đã công bố, trùng neo đô thị của mốc 1945. Không phải vị trí cắm cờ, cầu Tràng Tiền hay toàn bộ chiến trường Trị Thiên.",
      coordinateSource: {
        title: "Địa điểm đã công bố: khu vực Huế", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/hue", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: hue, địa điểm phụ của sự kiện Mậu Thân đã công bố. Chỉ tái dùng tọa độ đô thị; không dùng sự kiện năm 1968 làm bằng chứng cho năm 1975.",
      },
      sources: [{
        title: "Nghệ thuật vận dụng thời cơ trong Chiến dịch Trị Thiên", publisher: "Báo Điện tử Chính phủ · nguồn Bộ Quốc phòng / QĐND",
        url: "https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm", accessedAt: "2026-10-24",
        scope: "Đoạn cuối Đợt 2 (21–26/3/1975): đến ngày 26/3 giải phóng Huế và toàn tỉnh Thừa Thiên. Không lấy ngày này làm ngày mở đầu chiến dịch.",
      }, { ...exhibitionSource, scope: "Phần 3, Tài liệu, hiện vật tiêu biểu: quân giải phóng qua cầu Tràng Tiền, giải phóng thành phố Huế ngày 26/3/1975. Đối chiếu ngày, không suy ra tọa độ cầu." }],
      view: { lat: 16.4637, lng: 107.5909, zoom: 6.8 },
    },
    {
      id: "da-nang-1975", title: "Giải phóng Đà Nẵng", place: "Đà Nẵng · khu vực thành phố", mapLabel: "Đà Nẵng",
      date: "29/03/1975", sortDate: "1975-03-29", datePrecision: "day",
      summary: "Ngày 29/3, Quân Giải phóng làm chủ thành phố Đà Nẵng. Mốc này tiếp nối thắng lợi ở Huế trong cuộc tiến công mùa Xuân 1975.",
      accuracy: "approximate",
      accuracyNote: "Điểm định hướng cấp thành phố Đà Nẵng theo Natural Earth. Không đánh dấu sở chỉ huy, một hướng tiến công hay toàn bộ phạm vi chiến dịch Huế — Đà Nẵng.",
      coordinateSource: { ...citySource, scope: "GeoJSON v5.1.2: name = Da Nang, adm0name = Vietnam, Point [108.249971, 16.060039]. Điểm định hướng đô thị, không xác định mục tiêu hay hướng tiến công." },
      sources: [{ ...exhibitionSource, scope: "Phần 3, Tài liệu, hiện vật tiêu biểu: Quân Giải phóng hoàn toàn làm chủ thành phố Đà Nẵng ngày 29/3/1975. Chỉ dùng ngày và kết quả ở cấp thành phố, không tọa độ chiến trường." }],
      view: { lat: 16.060039, lng: 108.249971, zoom: 6.8 },
    },
    {
      id: "sai-gon-1975", title: "Cờ giải phóng tại Dinh Độc Lập", place: "Dinh Độc Lập · Sài Gòn", mapLabel: "Sài Gòn",
      date: "30/04/1975", sortDate: "1975-04-30", datePrecision: "day",
      summary: "Ngày 30/4, xe tăng và bộ đội Quân Giải phóng tiến vào Dinh Độc Lập. Lá cờ giải phóng tung bay trên dinh, khép lại chuỗi mốc mùa Xuân được chọn ở đây.",
      accuracy: "approximate",
      accuracyNote: "Tái dùng neo khu vực Dinh Độc Lập đã công bố, khác điểm đô thị Sài Gòn của mốc 1945. Không phải tọa độ xe tăng hay cột cờ; một khu di tích không đại diện toàn địa bàn chiến dịch.",
      coordinateSource: {
        title: "Địa điểm đã công bố: Dinh Độc Lập", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/dinh-doc-lap", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: dinh-doc-lap, địa điểm chính của Chiến dịch Hồ Chí Minh đã công bố; đối chiếu supabase/seed.sql. Tái dùng neo khu vực công trình, không suy ra vị trí xe tăng.",
      },
      sources: [{ ...exhibitionSource, scope: "Phần 3, Tài liệu, hiện vật tiêu biểu: xe tăng tiến vào Dinh Tổng thống Sài Gòn và cờ giải phóng trên dinh ngày 30/4/1975. Không dùng ảnh để suy ra vị trí chính xác của phương tiện." }],
      view: { lat: 10.7772, lng: 106.6953, zoom: 7.2 }, eventSlug: "chien-dich-ho-chi-minh",
    },
  ],
};
