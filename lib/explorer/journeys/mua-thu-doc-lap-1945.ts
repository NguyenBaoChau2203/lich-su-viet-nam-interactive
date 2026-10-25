import type { HistoryJourney, JourneySource } from "@/lib/explorer/journey";

// Passage/coordinate review: docs/audits/2026-10-24-additional-journey-sources.md.
// Lesson navigation is topic-level; the owner's textbook printing/pages are not verified.
const uprisingSource: JourneySource = {
  title: "Tổng khởi nghĩa Cách mạng tháng Tám năm 1945",
  publisher: "Bảo tàng Lịch sử Quốc gia · Nguyễn Thị Ngọc Anh",
  url: "https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html",
  accessedAt: "2026-10-24",
  scope: "Các mục Hà Nội 19/8, Huế 23/8, Sài Gòn 25/8; đoạn kết về Tuyên ngôn tại Ba Đình ngày 2/9/1945. Không cung cấp tọa độ.",
};

export const MUA_THU_DOC_LAP_1945: HistoryJourney = {
  id: "mua-thu-doc-lap-1945",
  title: "Mùa thu độc lập 1945",
  period: "19/08 — 02/09/1945",
  note: "Bốn mốc chọn lọc từ khởi nghĩa đến tuyên bố độc lập, trở lại Hà Nội theo thời gian. Đường nối là sơ đồ, không phải tuyến di chuyển của một người hay lực lượng.",
  lessonSlugs: ["6-cach-mang-thang-tam-nam-1945"],
  stops: [
    {
      id: "ha-noi-1945", title: "Hà Nội giành chính quyền", place: "Nhà hát Lớn · Hà Nội", mapLabel: "Hà Nội",
      date: "19/08/1945", sortDate: "1945-08-19", datePrecision: "day",
      summary: "Từ cuộc mít tinh trước Nhà hát Lớn, quần chúng tiến tới các cơ quan trọng yếu. Khởi nghĩa giành chính quyền ở Hà Nội thắng lợi trong ngày 19/8.",
      accuracy: "approximate",
      accuracyNote: "Neo khu vực Nhà hát Lớn được tái dùng từ địa điểm đã công bố. Đây là nơi tập hợp mít tinh, không phải toàn bộ địa bàn khởi nghĩa hay vị trí của từng đoàn người.",
      coordinateSource: {
        title: "Địa điểm đã công bố: Nhà hát Lớn Hà Nội", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/nha-hat-lon-ha-noi", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: nha-hat-lon-ha-noi, đối chiếu supabase/seed.sql, khối historical_locations. Tái dùng neo khu vực công trình, không nâng thành tọa độ khảo sát lịch sử.",
      },
      sources: [{ ...uprisingSource, scope: "Mục Giành chính quyền tại Hà Nội 19/8/1945: tập hợp trước Nhà hát Lớn, tiến tới công sở và thắng lợi tối 19/8. Không cung cấp tọa độ." }],
      view: { lat: 21.0245, lng: 105.8578, zoom: 7.2 }, eventSlug: "tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi",
    },
    {
      id: "hue-1945", title: "Huế giành chính quyền", place: "Huế · khu vực thành phố", mapLabel: "Huế",
      date: "23/08/1945", sortDate: "1945-08-23", datePrecision: "day",
      summary: "Ngày 23/8, nhân dân từ các huyện tiến về Huế, biểu tình và chiếm các công sở. Chính quyền cách mạng được thiết lập tại Huế.",
      accuracy: "approximate",
      accuracyNote: "Điểm định hướng cấp thành phố Huế, tái dùng từ kho địa điểm đã công bố. Không định vị một công sở, Ngọ Môn hay lễ thoái vị; mốc này nói về ngày giành chính quyền.",
      coordinateSource: {
        title: "Địa điểm đã công bố: khu vực Huế", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/hue", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: hue, địa điểm phụ của sự kiện Mậu Thân đã công bố. Chỉ tái dùng tọa độ đô thị; không dùng sự kiện năm 1968 làm bằng chứng cho năm 1945.",
      },
      sources: [{ ...uprisingSource, scope: "Mục Giành chính quyền tại Huế 23/8/1945: ngày khởi nghĩa, quần chúng về thành phố và chiếm công sở. Không phải ngày lễ thoái vị; không cung cấp tọa độ." }],
      view: { lat: 16.4637, lng: 107.5909, zoom: 6.8 },
    },
    {
      id: "sai-gon-1945", title: "Sài Gòn giành chính quyền", place: "Sài Gòn · khu vực đô thị", mapLabel: "Sài Gòn",
      date: "25/08/1945", sortDate: "1945-08-25", datePrecision: "day",
      summary: "Quần chúng Sài Gòn, Chợ Lớn và vùng lân cận tham gia khởi nghĩa. Sáng 25/8, lực lượng cách mạng làm chủ thành phố.",
      accuracy: "approximate",
      accuracyNote: "Điểm định hướng khu vực đô thị Sài Gòn đã công bố, không phải Dinh Độc Lập, Bến Nhà Rồng hay một địa điểm mít tinh riêng. Khởi nghĩa diễn ra trên nhiều đường phố và công sở.",
      coordinateSource: {
        title: "Địa điểm đã công bố: khu vực Sài Gòn", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/sai-gon", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: sai-gon, địa điểm đô thị của sự kiện Mậu Thân đã công bố. Tái dùng điểm định hướng thành phố, không suy ra vị trí cụ thể của hoạt động năm 1945.",
      },
      sources: [{ ...uprisingSource, scope: "Mục Giành chính quyền tại Sài Gòn 25/8/1945: quần chúng Sài Gòn–Chợ Lớn tham gia, lực lượng cách mạng làm chủ sáng 25/8. Không cung cấp tọa độ." }],
      view: { lat: 10.7769, lng: 106.7009, zoom: 6.8 },
    },
    {
      id: "ba-dinh-1945", title: "Tuyên bố nền độc lập", place: "Quảng trường Ba Đình · Hà Nội", mapLabel: "Hà Nội",
      date: "02/09/1945", sortDate: "1945-09-02", datePrecision: "day",
      summary: "Tại Ba Đình, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập, tuyên bố sự ra đời của nước Việt Nam Dân chủ Cộng hòa.",
      accuracy: "approximate",
      accuracyNote: "Neo khu vực Quảng trường Ba Đình được tái dùng từ địa điểm đã công bố, khác neo Nhà hát Lớn. Không khẳng định vị trí chính xác của lễ đài năm 1945.",
      coordinateSource: {
        title: "Địa điểm đã công bố: Quảng trường Ba Đình", publisher: "Kho địa điểm công khai của dự án",
        url: "/dia-diem/quang-truong-ba-dinh", accessedAt: "2026-10-24",
        scope: "Bản đọc công khai: quang-truong-ba-dinh, đối chiếu supabase/seed.sql, khối historical_locations. Tái dùng neo khu vực quảng trường hiện nay, không định vị lễ đài lịch sử.",
      },
      sources: [{ ...uprisingSource, scope: "Đoạn kết bắt đầu Ngày 2/9/1945: Chủ tịch Hồ Chí Minh đọc Tuyên ngôn tại Quảng trường Ba Đình, khai sinh nước Việt Nam Dân chủ Cộng hòa. Không cung cấp tọa độ." }],
      view: { lat: 21.0369, lng: 105.8342, zoom: 7.2 }, eventSlug: "tuyen-ngon-doc-lap",
    },
  ],
};
