import { chienDichHoChiMinh1975 } from "@/lib/battles/chien-dich-ho-chi-minh-1975";
import type { Lesson, LessonImage, LessonScan3D } from "@/lib/lessons/types";

// Chuyên đề tương tác: Chiến dịch Hồ Chí Minh (26 – 30/4/1975) — GĐ7 nâng cấp giao diện và chiều sâu tương tác.
// Nội dung VIẾT LẠI theo khung SGK Lịch sử 12 (Kết nối tri thức), Bài 8, đối chiếu Sổ nguồn sử liệu docs/audits/2026-10-25-hcm-1975-lesson-sources.md.
// Mọi hình ảnh lấy từ Wikimedia Commons (CC BY, CC BY-SA, CC0 hoặc phạm vi công cộng); không dùng ảnh báo chí 1975 còn bản quyền.
// Mô hình 3D Sketchfab CC BY 4.0 đã xác minh qua oEmbed ngày 25/10/2026. Video YouTube từ các đài truyền hình chính thống (VTV24, QPVN).

const PHOTO = "/lessons/chien-dich-ho-chi-minh";
const COMMONS = "https://commons.wikimedia.org/wiki/File:";
const sketchfabPoster = (id: string, path: string) => `https://media.sketchfab.com/models/${id}/thumbnails/${path}`;

const SCAN_DINH_DOC_LAP: LessonScan3D = {
  sketchfabId: "2c4905c6a1fd4fb18981886a77ba4fa9",
  title: "Dinh Độc Lập | Independence Palace",
  author: "Hoàng Huy",
  authorUrl: "https://sketchfab.com/danghoanghuy69",
  poster: sketchfabPoster("2c4905c6a1fd4fb18981886a77ba4fa9", "19a8891e25e04c65a3e4b3ffae222f9e/5c117713a07146a38d2a8f49bf9b6378.jpeg"),
  note: "Mô hình 3D Dinh Độc Lập (Hội trường Thống Nhất), di tích lịch sử quốc gia đặc biệt tại TP. Hồ Chí Minh.",
  sizeMb: 28,
};

const SCAN_XE_TANG_T54: LessonScan3D = {
  sketchfabId: "6bde9f748c3e472e878d333998b506f9",
  title: "T-54/T-55 Tank",
  author: "SGAstudio",
  authorUrl: "https://sketchfab.com/SGAstudios3DandGameDevelopment",
  poster: sketchfabPoster("6bde9f748c3e472e878d333998b506f9", "5a863f400f8f434db9027d035117b6f8/f39f5a681f894b2688a066fab995ecf8.jpeg"),
  note: "Mô hình 3D xe tăng hạng trung T-54/T-55, loại xe tăng dẫn đầu mũi thọc sâu tiến vào Dinh Độc Lập trưa 30/4/1975.",
  sizeMb: 32,
};

const SCAN_MAY_BAY_A37: LessonScan3D = {
  sketchfabId: "181dcd131e4342e89df5bafaf96be1b1",
  title: "A-37 Dragonfly",
  author: "manilov.ap",
  authorUrl: "https://sketchfab.com/manilov.ap",
  poster: sketchfabPoster("181dcd131e4342e89df5bafaf96be1b1", "d089cb2ead0249d6940fffa93c44397a/4c98abe4158c454d980ae41e9f618279.jpeg"),
  note: "Mô hình 3D máy bay phản lực A-37 Dragonfly, cùng chủng loại với phi đội Quyết thắng ném bom Tân Sơn Nhất.",
  sizeMb: 16,
};

const SCAN_TRUC_THANG_UH1: LessonScan3D = {
  sketchfabId: "29ae1fb161a04128b006089b95ab1017",
  title: "UH-1 Huey Helicopter",
  author: "bunnellrl1",
  authorUrl: "https://sketchfab.com/bunnellrl1",
  poster: sketchfabPoster("29ae1fb161a04128b006089b95ab1017", "a7aad34000ff412290fcfb4a9794234b/f6dbab4b1c634d46811cf255a976c11c.jpeg"),
  note: "Mô hình 3D trực thăng UH-1 Huey do quân đội Mỹ sử dụng trong chiến dịch di tản Frequent Wind cuối tháng 4/1975.",
  sizeMb: 18,
};

const SCAN_BITEXCO_SAIGON: LessonScan3D = {
  sketchfabId: "66f45144e7a44fdaa841f7eed78a28a2",
  title: "Tòa tháp Bitexco Sài Gòn",
  author: "Hoàng Huy",
  authorUrl: "https://sketchfab.com/danghoanghuy69",
  poster: sketchfabPoster("66f45144e7a44fdaa841f7eed78a28a2", "957507765b304171b3065a34d2e53a2a/4e8ee67d47ad4be7903c8720134f2c67.jpeg"),
  note: "Mô hình 3D tòa tháp Bitexco Financial Tower, một trong những biểu tượng kiến trúc hiện đại của TP. Hồ Chí Minh ngày nay.",
  sizeMb: 12,
};

const XE_TANG_390: LessonImage = {
  src: `${PHOTO}/xe-tang-390-dinh-doc-lap.webp`,
  alt: "Xe tăng T-54 sơn số 390 đỗ dưới tán cây cổ thụ trong khuôn viên Dinh Độc Lập",
  caption: "Xe tăng mang số hiệu 390 trong khuôn viên Dinh Độc Lập ngày nay (xe cùng loại; xe nguyên bản lưu giữ tại Hà Nội) — ảnh năm 2023.",
  credit: "源義信, CC BY 4.0",
  sourceUrl: `${COMMONS}2023-12-10_T-54_tank_No._390_at_the_Independence_Palace,_Saigon_01.jpg`,
  title: "Xe tăng 390",
  width: 1120,
  height: 840,
  depthSrc: `${PHOTO}/xe-tang-390-dinh-doc-lap-depth.webp`,
  hotspots: [
    { label: "Pháo chính 100 mm", text: "Pháo D-10T cỡ 100 mm uy lực, vũ khí tiến công chính của xe tăng T-54.", x: 26, y: 38 },
    { label: "Tháp pháo đúc", text: "Tháp pháo bán cầu bằng thép đúc dày, bảo vệ kíp xe trước hỏa lực bắn thẳng.", x: 52, y: 32 },
    { label: "Xích xe vượt cản", text: "Hệ thống xích thép bản rộng giúp xe vượt qua địa hình bùn lầy và chướng ngại vật.", x: 50, y: 78 },
    { label: "Số hiệu 390", text: "Số hiệu 390 sơn trên tháp pháo; chiếc xe húc đổ cổng chính Dinh Độc Lập trưa 30/4/1975.", x: 58, y: 44 },
  ],
};

const XE_TANG_843: LessonImage = {
  src: `${PHOTO}/xe-tang-843-dinh-doc-lap.webp`,
  alt: "Xe tăng T-54 sơn số 843 trưng bày trên bãi cỏ trong khuôn viên Dinh Độc Lập",
  caption: "Xe tăng mang số hiệu 843 trong khuôn viên Dinh Độc Lập (xe cùng loại; xe nguyên bản lưu giữ tại Hà Nội) — ảnh năm 2023.",
  credit: "源義信, CC BY 4.0",
  sourceUrl: `${COMMONS}2023-12-10_T-54_tank_No._843_at_the_Independence_Palace,_Saigon_01.jpg`,
  title: "Xe tăng 843",
  width: 1000,
  height: 750,
  depthSrc: `${PHOTO}/xe-tang-843-dinh-doc-lap-depth.webp`,
  hotspots: [
    { label: "Khẩu pháo 100 mm", text: "Nòng pháo với bộ phận hút khói đặc trưng của phiên bản nâng cấp T-54B.", x: 28, y: 35 },
    { label: "Tháp pháo đúc", text: "Tháp pháo dạng vòm tròn bằng thép đúc dày chịu lực của xe tăng T-54B.", x: 52, y: 30 },
    { label: "Thân vỏ xe bọc thép", text: "Vỏ giáp thép bảo vệ kíp xe trước các loại đạn súng bộ binh và mảnh đạn pháo.", x: 50, y: 65 },
    { label: "Số hiệu 843", text: "Số hiệu 843 gắn với Đại đội trưởng Bùi Quang Thận — người cắm cờ trên nóc Dinh trưa 30/4/1975.", x: 58, y: 42 },
  ],
};

const CONG_DINH_DOC_LAP: LessonImage = {
  src: `${PHOTO}/cong-dinh-doc-lap.webp`,
  alt: "Cánh cổng sắt lớn của Dinh Độc Lập gắn hoa văn sắt rèn mở ra hướng đại lộ",
  caption: "Cổng chính Dinh Độc Lập — nơi ghi dấu vết tích xe tăng giải phóng húc đổ trưa 30/4/1975 (ảnh năm 2014).",
  credit: "Clay Gilliland, CC BY-SA 2.0",
  sourceUrl: `${COMMONS}Independence_Palace_or_Reunification_Palace_(12110620484).jpg`,
  title: "Cổng Dinh Độc Lập",
  width: 1400,
  height: 788,
  depthSrc: `${PHOTO}/cong-dinh-doc-lap-depth.webp`,
  hotspots: [
    { label: "Cánh cổng sắt rèn", text: "Cánh cổng sắt đúc hoa văn kiên cố bị xe tăng 390 húc tung vào lúc 10 giờ 45 phút trưa 30/4/1975.", x: 50, y: 55 },
    { label: "Trụ cổng bê tông", text: "Trụ cổng vững chắc hai bên cổng chính nhìn thẳng ra đại lộ Lê Duẩn.", x: 15, y: 45 },
    { label: "Tòa nhà Dinh Độc Lập", text: "Tòa nhà chính Dinh Độc Lập phía sau thảm cỏ xanh mướt.", x: 50, y: 35 },
  ],
};

const MAY_BAY_A37: LessonImage = {
  src: `${PHOTO}/may-bay-a37-bao-tang.webp`,
  alt: "Máy bay phản lực cường kích nhỏ A-37 sơn màu ngụy trang đặt trên sân bảo tàng",
  caption: "Máy bay A-37 trưng bày tại Bảo tàng Chiến dịch Hồ Chí Minh — cùng loại với máy bay Phi đội Quyết thắng dùng ném bom sân bay Tân Sơn Nhất ngày 28/4/1975 (ảnh năm 2012).",
  credit: "HappyMidnight, CC BY-SA 3.0",
  sourceUrl: `${COMMONS}A-37_Dragonfly_at_Museum_of_Ho_Chi_Minh_Campaign,_HCMC,_Vietnam.JPG`,
  title: "Máy bay A-37",
  width: 1200,
  height: 517,
  depthSrc: `${PHOTO}/may-bay-a37-bao-tang-depth.webp`,
  hotspots: [
    { label: "Buồng lái đôi", text: "Khoang lái 2 chỗ ngồi cạnh nhau cho phép phi công quan sát chiến trường thuận lợi.", x: 62, y: 35 },
    { label: "Thùng dầu đầu cánh", text: "Thùng nhiên liệu phụ gắn cố định ở đầu mỗi cánh để tăng bán kính chiến đấu.", x: 88, y: 65 },
    { label: "Động cơ phản lực J85", text: "Hai động cơ phản lực General Electric J85 gắn hai bên sườn thân máy bay.", x: 45, y: 42 },
    { label: "Giá treo bom", text: "Các điểm treo vũ khí dưới cánh mang bom ném xuống đường băng Tân Sơn Nhất.", x: 30, y: 60 },
  ],
};

const TRUC_THANG_UH1: LessonImage = {
  src: `${PHOTO}/truc-thang-uh1-bao-tang.webp`,
  alt: "Trực thăng quân sự UH-1 sơn màu xanh rêu trưng bày ngoài trời tại bảo tàng",
  caption: "Trực thăng UH-1 Huey trưng bày tại TP. Hồ Chí Minh — loại trực thăng dùng trong chiến dịch di tản Frequent Wind cuối tháng 4/1975.",
  credit: "calflier001, CC BY-SA 2.0",
  sourceUrl: `${COMMONS}WAR_REMNANTS_MUSEUM_SAIGON_VIETNAM_JAN_2012_(7021992875).jpg`,
  title: "Trực thăng UH-1 Huey",
  width: 1400,
  height: 1053,
  depthSrc: `${PHOTO}/truc-thang-uh1-bao-tang-depth.webp`,
  hotspots: [
    { label: "Cánh quạt nâng 2 lá", text: "Cánh quạt chính 2 lá tạo lực nâng đặc trưng của dòng máy bay trực thăng UH-1 Huey.", x: 50, y: 18 },
    { label: "Khoang chở người", text: "Khoang hành khách rộng rãi có cửa trượt hai bên, dùng chở quân và di tản người.", x: 55, y: 55 },
    { label: "Càng trượt thép", text: "Càng hạ cánh kim loại nhẹ giúp trực thăng đáp trên mọi địa hình kể cả nóc nhà.", x: 55, y: 82 },
    { label: "Cánh quạt đuôi", text: "Cánh quạt đuôi nhỏ giúp triệt tiêu mô men xoay và điều khiển hướng bay.", x: 12, y: 40 },
  ],
};

const SAN_THUONG_DINH_DOC_LAP: LessonImage = {
  src: `${PHOTO}/san-thuong-dinh-doc-lap.webp`,
  alt: "Bãi đáp trực thăng trên sân thượng Dinh Độc Lập với các vòng tròn sơn đỏ đánh dấu vết bom",
  caption: "Bãi trực thăng sân thượng Dinh Độc Lập — hai vòng tròn sơn đỏ khoanh vị trí bom rơi sáng 8/4/1975 (ảnh 2012).",
  credit: "calflier001, CC BY-SA 2.0",
  sourceUrl: `${COMMONS}INDEPENDENCE_PALACE_ROOFTOP_HELIPAD_SAIGON_HO_CHI_MINH_CITY_VIETNAM_JAN_2012_(7041535977).jpg`,
  title: "Sân thượng Dinh Độc Lập",
  width: 771,
  height: 581,
  depthSrc: `${PHOTO}/san-thuong-dinh-doc-lap-depth.webp`,
  hotspots: [
    { label: "Vết bom nổ sáng 8/4", text: "Vòng tròn sơn đỏ khoanh vị trí quả bom ném trúng nóc Dinh sáng ngày 8/4/1975.", x: 48, y: 72 },
    { label: "Bãi đỗ trực thăng", text: "Bãi đáp trực thăng trên nóc Dinh Độc Lập dành cho các chuyến di tản khẩn cấp.", x: 50, y: 52 },
    { label: "Toàn cảnh Sài Gòn", text: "Tầm nhìn từ sân thượng bao quát trung tâm thành phố và đại lộ Lê Duẩn.", x: 80, y: 35 },
  ],
};

const HAM_CHI_HUY_DINH_DOC_LAP: LessonImage = {
  src: `${PHOTO}/ham-chi-huy-dinh-doc-lap.webp`,
  alt: "Căn phòng ngầm với hệ thống bản đồ quân sự lớn trên tường và bàn liên lạc máy móc",
  caption: "Trung tâm chỉ huy tác chiến dưới tầng hầm Dinh Độc Lập với bản đồ quân sự và thiết bị liên lạc.",
  credit: "Jorge Láscar, CC BY 2.0",
  sourceUrl: `${COMMONS}Independence_Palace_(36992715252).jpg`,
  title: "Hầm chỉ huy Dinh Độc Lập",
  width: 1400,
  height: 788,
  depthSrc: `${PHOTO}/ham-chi-huy-dinh-doc-lap-depth.webp`,
  hotspots: [
    { label: "Bản đồ tác chiến quân sự", text: "Hệ thống bản đồ theo dõi chiến sự toàn miền Nam đặt kín trên các vách tường hầm.", x: 65, y: 38 },
    { label: "Bàn máy thông tin liên lạc", text: "Bàn liên lạc điện đàm tác chiến nối thẳng tới các quân đoàn và bộ chỉ huy vùng.", x: 38, y: 65 },
    { label: "Tường hầm bê tông chống bom", text: "Tường và trần hầm đúc bê tông cốt thép dày chống chịu pháo binh và bom khoan.", x: 15, y: 35 },
  ],
};

const PHAO_130MM: LessonImage = {
  src: `${PHOTO}/phao-130mm-bao-tang.webp`,
  alt: "Khẩu pháo nòng dài 130 mm màu xám đặt trên bệ cỏ tại sân bảo tàng",
  caption: "Pháo nòng dài 130 mm tại Bảo tàng Chiến dịch Hồ Chí Minh — hỏa lực tầm xa khống chế các mục tiêu trọng yếu.",
  credit: "HappyMidnight, CC BY-SA 3.0",
  sourceUrl: `${COMMONS}130mm_gun_at_Museum_of_Ho_Chi_Minh_Campaign,_HCMC,_Vietnam.JPG`,
  title: "Pháo nòng dài 130 mm",
  width: 1400,
  height: 796,
  depthSrc: `${PHOTO}/phao-130mm-bao-tang-depth.webp`,
  hotspots: [
    { label: "Nòng pháo dài 130 mm", text: "Nòng pháo dài uy lực cho tầm bắn xa tới hơn 27 km, chế áp sân bay Tân Sơn Nhất.", x: 30, y: 22 },
    { label: "Lá chắn thép bảo vệ", text: "Tấm thép chắn mảnh đạn bảo vệ an toàn cho pháo thủ khi thao tác chiến đấu.", x: 58, y: 45 },
    { label: "Càng pháo bám đất", text: "Hai càng pháo xòe rộng cắm sâu xuống mặt đất giúp pháo đứng vững khi bắn.", x: 82, y: 75 },
    { label: "Bánh xe lốp cao su", text: "Bánh xe chịu lực lớn phục vụ xe kéo cơ động nhanh trên đường hành quân.", x: 50, y: 72 },
  ],
};

const DINH_THONG_NHAT: LessonImage = {
  src: `${PHOTO}/dinh-thong-nhat.webp`,
  alt: "Mặt tiền tòa nhà Dinh Thống Nhất màu trắng, nhiều tầng, phía trước là bãi cỏ và đài phun nước",
  caption: "Dinh Độc Lập — nay là Hội trường Thống Nhất — nhìn từ phía đại lộ Lê Duẩn (ảnh năm 2009).",
  credit: "Eustaquio Santimano, CC BY 2.0",
  sourceUrl: `${COMMONS}Reunification_Palace,_Ho_Chi_Minh_City,_Vietnam.jpg`,
  title: "Hội trường Thống Nhất",
  width: 1200,
  height: 694,
  depthSrc: `${PHOTO}/dinh-thong-nhat-depth.webp`,
  hotspots: [
    { label: "Rèm hoa đá", text: "Các thanh chắn nắng cách điệu hình hoa văn đốt trúc trang trí mặt tiền theo thiết kế của KTS Ngô Viết Thụ.", x: 50, y: 38 },
    { label: "Thảm cỏ và đài phun nước", text: "Quảng trường thảm cỏ hình tròn cùng đài phun nước phía trước mặt tiền đại lộ Lê Duẩn.", x: 50, y: 75 },
    { label: "Nóc Dinh Độc Lập", text: "Nơi cắm lá cờ Mặt trận Dân tộc Giải phóng lúc 11 giờ 30 phút trưa ngày 30/4/1975.", x: 50, y: 12 },
  ],
};

const BAO_TANG_CHIEN_DICH: LessonImage = {
  src: `${PHOTO}/bao-tang-chien-dich.webp`,
  alt: "Tòa nhà Bảo tàng Chiến dịch Hồ Chí Minh, phía trước trưng bày xe tăng và pháo",
  caption: "Bảo tàng Chiến dịch Hồ Chí Minh (TP. Hồ Chí Minh), nơi trưng bày về năm cánh quân và diễn biến chiến dịch (ảnh năm 2012).",
  credit: "HappyMidnight, CC BY-SA 3.0",
  sourceUrl: `${COMMONS}Museum_of_Ho_Chi_Minh_Campaign.JPG`,
  title: "Bảo tàng Chiến dịch",
  width: 1200,
  height: 797,
  depthSrc: `${PHOTO}/bao-tang-chien-dich-depth.webp`,
  hotspots: [
    { label: "Tòa nhà bảo tàng", text: "Nơi lưu giữ hàng ngàn hiện vật, bản đồ và sa bàn về Chiến dịch Hồ Chí Minh 1975.", x: 50, y: 40 },
    { label: "Hiện vật cơ giới", text: "Khu vực trưng bày ngoài trời các loại xe tăng, máy bay và pháo binh tham gia chiến dịch.", x: 25, y: 75 },
  ],
};

const TUONG_DAI_XUAN_LOC: LessonImage = {
  src: `${PHOTO}/tuong-dai-xuan-loc.webp`,
  alt: "Tượng đài chiến thắng tại ngã ba Xuân Lộc với tượng các chiến sĩ vươn cao",
  caption: "Tượng đài Chiến thắng Xuân Lộc (Đồng Nai) — ghi dấu trận phá vỡ \"cánh cửa thép\" tháng 4/1975.",
  credit: "Mztourist, CC BY-SA 3.0",
  sourceUrl: `${COMMONS}PAVN_victory_monument_Xuan_Loc.jpg`,
  title: "Tượng đài Xuân Lộc",
  width: 375,
  height: 500,
  depthSrc: `${PHOTO}/tuong-dai-xuan-loc-depth.webp`,
  hotspots: [
    { label: "Cụm tượng chiến sĩ", text: "Hình tượng các chiến sĩ quân giải phóng xung kích phá tan tuyến phòng ngự kiên cố.", x: 50, y: 35 },
    { label: "Bệ đài tưởng niệm", text: "Bệ đài khắc ghi chiến công oanh liệt giải phóng Xuân Lộc ngày 21/4/1975.", x: 50, y: 80 },
  ],
};

const CAU_RACH_CHIEC: LessonImage = {
  src: `${PHOTO}/cau-rach-chiec.webp`,
  alt: "Cầu Rạch Chiếc bắc qua sông trên xa lộ dẫn vào trung tâm thành phố",
  caption: "Cầu Rạch Chiếc trên Xa lộ Hà Nội ngày nay — nơi các chiến sĩ đặc công kiên cường chiến đấu giữ cầu tháng 4/1975.",
  credit: "Nguyen Thanh, CC BY 3.0",
  sourceUrl: `${COMMONS}Cau_Rach_Chiec,_xa_lo_Hanoi,_quan_2,_tphcmvn_-_panoramio.jpg`,
  title: "Cầu Rạch Chiếc",
  width: 1400,
  height: 786,
  depthSrc: `${PHOTO}/cau-rach-chiec-depth.webp`,
  hotspots: [
    { label: "Thân cầu Rạch Chiếc", text: "Cây cầu huyết mạch cửa ngõ phía Đông dẫn đường cho Quân đoàn 2 tiến thẳng vào Sài Gòn.", x: 50, y: 45 },
    { label: "Dòng sông Rạch Chiếc", text: "Dòng sông nơi diễn ra trận chiến đấu ác liệt của các chiến sĩ đặc công giữ vững cầu.", x: 50, y: 78 },
  ],
};

const DINH_DOC_LAP_2025: LessonImage = {
  src: `${PHOTO}/dinh-doc-lap-2025.webp`,
  alt: "Dinh Độc Lập nhìn chéo từ bên hông, kiến trúc khối vuông với các thanh chắn nắng dọc",
  caption: "Dinh Độc Lập (Hội trường Thống Nhất) năm 2025 — Di tích quốc gia đặc biệt.",
  credit: "David Stanley, CC BY 4.0",
  sourceUrl: `${COMMONS}Independence_Palace.jpg`,
  title: "Dinh Độc Lập 2025",
  width: 1024,
  height: 768,
  depthSrc: `${PHOTO}/dinh-doc-lap-2025-depth.webp`,
  hotspots: [
    { label: "Mặt bên Dinh Độc Lập", text: "Khối nhà vuông vắn với các thanh lam chắn nắng dọc theo kiến trúc hiện đại của Ngô Viết Thụ.", x: 45, y: 55 },
    { label: "Hàng cây cổ thụ", text: "Khuôn viên rợp bóng cây xanh bao quanh di tích quốc gia đặc biệt.", x: 20, y: 70 },
  ],
};

const TRUC_THANG_USS_OKINAWA: LessonImage = {
  src: `${PHOTO}/truc-thang-uss-okinawa.webp`,
  alt: "Trực thăng bị đẩy xuống biển từ boong tàu sân bay USS Okinawa trong chiến dịch di tản",
  caption: "Trực thăng của đối phương bị đẩy xuống biển từ tàu sân bay USS Okinawa trong chiến dịch di tản Frequent Wind cuối tháng 4/1975.",
  credit: "Thủy quân lục chiến Hoa Kỳ, phạm vi công cộng",
  sourceUrl: `${COMMONS}Operation_Frequent_Wind_-_Helicopter_pushed_overboard.jpg`,
};

const VAN_TIEN_DUNG_PORTRAIT: LessonImage = {
  src: `${PHOTO}/van-tien-dung.webp`,
  alt: "Chân dung Đại tướng Văn Tiến Dũng năm 1954",
  caption: "Đại tướng Văn Tiến Dũng (1917–2002).",
  credit: "Bộ Quốc phòng Việt Nam / Wikimedia Commons, phạm vi công cộng",
  sourceUrl: `${COMMONS}Van_Tien_Dung_1954.jpg`,
};

const PHAM_HUNG_PORTRAIT: LessonImage = {
  src: `${PHOTO}/pham-hung.webp`,
  alt: "Chân dung đồng chí Phạm Hùng thời kỳ kháng chiến",
  caption: "Đồng chí Phạm Hùng (1912–1988).",
  credit: "Ảnh tư liệu lưu trữ / Wikimedia Commons, phạm vi công cộng",
  sourceUrl: `${COMMONS}Pham_Hung.jpg`,
};

const LE_DUC_THO_PORTRAIT: LessonImage = {
  src: `${PHOTO}/le-duc-tho.webp`,
  alt: "Chân dung đồng chí Lê Đức Thọ tại sân bay Orly năm 1972",
  caption: "Đồng chí Lê Đức Thọ năm 1972.",
  credit: "Wikimedia Commons, CC BY-SA 3.0 nl",
  sourceUrl: `${COMMONS}Le_Duc_Tho_at_Orly_Field_1972_(cropped).jpg`,
};

const NGUYEN_THANH_TRUNG_PORTRAIT: LessonImage = {
  src: `${PHOTO}/nguyen-thanh-trung.webp`,
  alt: "Trung úy phi công Nguyễn Thành Trung đội mũ bay sau chuyến bay ném bom Dinh Độc Lập ngày 8/4/1975",
  caption: "Phi công Nguyễn Thành Trung sau khi ném bom Dinh Độc Lập (8/4/1975).",
  credit: "Ảnh tư liệu lịch sử / Bảo tàng Lịch sử Quân sự, phạm vi công cộng",
  sourceUrl: `${COMMONS}Nguyen_Thanh_Trung_1975.jpg`,
};

export const chienDichHoChiMinhLesson: Lesson = {
  slug: "chien-dich-ho-chi-minh-1975",
  eventSlug: "chien-dich-ho-chi-minh",
  title: "Chiến dịch Hồ Chí Minh",
  dateText: "26 – 30/4/1975",
  tagline: "Năm cánh quân thần tốc tiến vào Sài Gòn; trưa 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập — miền Nam hoàn toàn giải phóng, đất nước thống nhất.",
  copy: {
    cardDescription: "Bản đồ năm cánh quân tiến vào Sài Gòn từng ngày, mô hình 3D, hiện vật xoay 360°, video tư liệu và trắc nghiệm.",
    mapTitle: "Xem năm cánh quân tiến vào Sài Gòn",
    mapHint: "Bản đồ đi từ toàn cảnh miền Nam tháng 3/1975 vào Sài Gòn; mục tiêu nào quân ta làm chủ sẽ chuyển từ ô xanh sang ô đỏ sao vàng.",
    videoTitle: "Video tư liệu",
    resultsTitle: "Vì sao chiến thắng mùa Xuân 1975 có ý nghĩa to lớn?",
    todayTitle: "Những địa danh lịch sử ngày nay",
  },
  hero: XE_TANG_390,
  heroStats: [
    { value: 5, label: "cánh quân đồng loạt tiến vào Sài Gòn" },
    { value: 3, label: "chiến dịch lớn của cuộc Tổng tiến công và nổi dậy mùa Xuân 1975" },
    { value: 21, label: "năm kháng chiến chống Mỹ, cứu nước (1954 – 1975)" },
  ],
  textbook: {
    series: "SGK Lịch sử 12 — Kết nối tri thức với cuộc sống",
    lesson: "Bài 8. Cuộc kháng chiến chống Mỹ, cứu nước (1954 – 1975)",
    objectives: [
      "Nêu được bối cảnh lịch sử, chủ trương của Đảng và thời cơ chiến lược giải phóng miền Nam đầu năm 1975.",
      "Trình bày được diễn biến chính của Chiến dịch Hồ Chí Minh trên bản đồ: thế bao vây của 5 cánh quân, các mục tiêu then chốt và thời khắc lịch sử trưa 30/4/1975.",
      "Nhận biết và phân tích được vai trò của các hiện vật, nhân vật tiêu biểu và nghệ thuật quân sự đỉnh cao trong chiến dịch.",
      "Đánh giá được kết quả và ý nghĩa lịch sử to lớn của thắng lợi cuộc kháng chiến chống Mỹ, cứu nước đối với dân tộc và thời đại.",
    ],
  },
  keyDates: [
    { date: "10/3/1975", text: "Trận Buôn Ma Thuột nổ súng thắng lợi, mở màn Chiến dịch Tây Nguyên" },
    { date: "26/3/1975", text: "Thành phố Huế hoàn toàn giải phóng" },
    { date: "29/3/1975", text: "Giải phóng thành phố Đà Nẵng, đập tan căn cứ quân sự liên hợp của đối phương" },
    { date: "14/4/1975", text: "Bộ Chính trị đặt tên chiến dịch giải phóng Sài Gòn là \"Chiến dịch Hồ Chí Minh\"" },
    { date: "21/4/1975", text: "Tuyến phòng thủ Xuân Lộc (\"cánh cửa thép\") bị phá vỡ; Nguyễn Văn Thiệu từ chức" },
    { date: "26/4/1975", text: "17 giờ: Chiến dịch Hồ Chí Minh chính thức phát lệnh nổ súng mở màn" },
    { date: "28/4/1975", text: "Phi đội Quyết thắng ném bom Tân Sơn Nhất; Dương Văn Minh nhậm chức tổng thống" },
    { date: "29/4/1975", text: "Quân ta tổng công kích toàn mặt trận; Mỹ vội vã di tản bằng trực thăng" },
    { date: "30/4/1975", text: "11 giờ 30 phút: Cờ cách mạng tung bay trên nóc Dinh Độc Lập; chiến dịch toàn thắng" },
    { date: "2/5/1975", text: "Tỉnh Châu Đốc được giải phóng — toàn bộ miền Nam hoàn toàn giải phóng" },
  ],
  battle: chienDichHoChiMinh1975,
  mapFilm: "chien-dich-ho-chi-minh",
  models3d: [
    "xe-tang-t54-843",
    "xe-tang-t54-390",
    "dinh-doc-lap",
    "may-bay-a37",
    "truc-thang-uh1",
  ],
  resultsScan: SCAN_DINH_DOC_LAP,
  resultsImage: DINH_THONG_NHAT,
  artifacts: [
    {
      title: "Xe tăng T-54 số hiệu 390",
      text: "Chiếc xe tăng T-54 mang số hiệu 390 thuộc Đại đội 4, Tiểu đoàn 1, Lữ đoàn xe tăng 203 do Trung úy Vũ Đăng Toàn chỉ huy. Trưa 30/4/1975, xe tăng 390 đã dũng mãnh húc đổ cổng chính Dinh Độc Lập, mở đường cho quân giải phóng tiến vào bắt sống toàn bộ nội các chính quyền Sài Gòn. Chiếc xe nguyên bản hiện là Bảo vật quốc gia lưu giữ tại Hà Nội.",
      image: XE_TANG_390,
      scan: SCAN_XE_TANG_T54,
    },
    {
      title: "Xe tăng T-54B số hiệu 843",
      text: "Xe tăng T-54B số hiệu 843 do Đại đội trưởng Bùi Quang Thận trực tiếp chỉ huy, dẫn đầu đội hình thọc sâu tiến vào Dinh Độc Lập qua cổng phụ. Sau khi xe dừng trong sân Dinh, đồng chí Bùi Quang Thận đã cầm cờ chạy lên nóc Dinh Độc Lập cắm cờ chiến thắng. Chiếc xe nguyên bản là Bảo vật quốc gia đợt 1 được công nhận năm 2012.",
      image: XE_TANG_843,
    },
    {
      title: "Cổng chính Dinh Độc Lập",
      text: "Cánh cổng sắt kiên cố nằm trên trục đại lộ Thống Nhất (nay là đường Lê Duẩn). Thời khắc lịch sử chiếc xe tăng giải phóng húc tung cánh cổng trưa 30/4/1975 đã trở thành biểu tượng bất diệt cho sự sụp đổ hoàn toàn của chế độ thực dân mới, mở toang cánh cửa hòa bình và thống nhất cho non sông.",
      image: CONG_DINH_DOC_LAP,
    },
    {
      title: "Máy bay cường kích A-37 (Phi đội Quyết thắng)",
      text: "Chiếc máy bay phản lực A-37 cùng loại với 5 chiếc máy bay do Phi đội Quyết thắng sử dụng chiều ngày 28/4/1975. Đòn không kích bất ngờ, táo bạo vào sân bay Tân Sơn Nhất đã làm tê liệt hoàn toàn tuyến hàng không quân sự của đối phương, thể hiện tài thao lược và nghệ thuật phối hợp tác chiến điêu luyện của Quân đội nhân dân Việt Nam.",
      image: MAY_BAY_A37,
      scan: SCAN_MAY_BAY_A37,
    },
    {
      title: "Trực thăng UH-1 Huey (Cuộc di tản Gió lốc)",
      text: "Trực thăng UH-1 do quân đội Mỹ trang bị, phương tiện chủ lực trong chiến dịch di tản khẩn cấp Frequent Wind ngày 29–30/4/1975. Hàng trăm chiếc UH-1 từ các nóc nhà và bãi đáp tại Sài Gòn bay ra biển chở theo binh lính và cố vấn Mỹ, nhiều chiếc bị đẩy xuống biển để lấy chỗ đáp trên boong tàu sân bay.",
      image: TRUC_THANG_UH1,
      scan: SCAN_TRUC_THANG_UH1,
    },
    {
      title: "Bãi trực thăng và vết bom nóc Dinh Độc Lập",
      text: "Sân thượng Dinh Độc Lập có bãi đỗ trực thăng đặc biệt dành riêng cho tổng thống chính quyền Sài Gòn. Ngày nay, hai vòng tròn sơn đỏ trên mặt sàn vẫn được giữ nguyên vẹn để đánh dấu chính xác nơi 2 quả bom phát nổ từ trận không kích quả cảm của phi công Nguyễn Thành Trung sáng ngày 8/4/1975.",
      image: SAN_THUONG_DINH_DOC_LAP,
    },
    {
      title: "Trung tâm chỉ huy tác chiến dưới tầng hầm Dinh Độc Lập",
      text: "Hệ thống hầm chỉ huy kiên cố được xây dựng bằng bê tông cốt thép dày, có khả năng chống chịu pháo hạng nặng và bom phá. Nơi đây từng đặt toàn bộ trang thiết bị thông tin tác chiến liên lạc tối tân nối liền với các vùng chiến thuật và Lầu Năm Góc trước khi bị quân giải phóng tiếp quản trưa 30/4/1975.",
      image: HAM_CHI_HUY_DINH_DOC_LAP,
    },
    {
      title: "Pháo nòng dài 130 mm M-46 (Hỏa lực tầm xa)",
      text: "Khẩu pháo nòng dài 130 mm (M-46) có tầm bắn xa trên 27 km. Trong Chiến dịch Hồ Chí Minh, các lữ đoàn pháo binh của ta đã bố trí những trận địa pháo 130 mm khóa chặt sân bay Tân Sơn Nhất, sân bay Biên Hòa và chi viện hỏa lực chính xác cho các cánh quân thọc sâu.",
      image: PHAO_130MM,
    },
  ],
  videos: [
    {
      youtubeId: "TnQYFiXX1Zg",
      title: "Chiến dịch Hồ Chí Minh trong 4 phút",
      channel: "VTV24",
      note: "Tóm tắt trực quan diễn biến và sự phối hợp 5 cánh quân — xem trước phần bản đồ.",
    },
    {
      youtubeId: "bPwhnZWX-5k",
      title: "51 năm Ngày Giải phóng miền Nam, thống nhất đất nước",
      channel: "VTV24",
      note: "Phóng sự tài liệu tổng kết ý nghĩa lịch sử ngày 30/4 — liên hệ thực tiễn và ôn tập.",
    },
    {
      youtubeId: "gzFbBjCbGMY",
      title: "Chiến dịch Hồ Chí Minh bắt đầu",
      channel: "VTV24",
      note: "Thời khắc 17 giờ ngày 26/4/1975 và những đòn tiến công phá vỡ vòng ngoài Sài Gòn.",
    },
    {
      youtubeId: "FM1rvymqyow",
      title: "Đại Thắng Mùa Xuân 1975: Hành Trình Tiến Về Sài Gòn Giải Phóng Miền Nam",
      channel: "Truyền hình Quốc phòng Việt Nam (QPVN)",
      note: "Thước phim tư liệu quân sự chuyên sâu về khí thế thần tốc tiến vào giải phóng Dinh Độc Lập.",
    },
  ],
  results: [
    { value: 5, label: "cánh quân cùng tiến vào trung tâm Sài Gòn" },
    { value: 30, label: "năm chiến tranh giải phóng dân tộc (1945 – 1975) khép lại" },
    { value: 21, label: "năm kháng chiến chống Mỹ, cứu nước kết thúc thắng lợi" },
  ],
  significance: [
    {
      title: "Kết thúc 21 năm kháng chiến chống Mỹ và 30 năm chiến tranh giải phóng",
      text: "Thắng lợi kết thúc vẻ vang 21 năm kháng chiến chống Mỹ, cứu nước và 30 năm chiến tranh giải phóng dân tộc, bảo vệ Tổ quốc (1945 – 1975); chấm dứt vĩnh viễn ách thống trị của chủ nghĩa thực dân và đế quốc trên đất nước ta.",
    },
    {
      title: "Hoàn thành cách mạng dân tộc dân chủ, non sông thu về một mối",
      text: "Miền Nam hoàn toàn giải phóng, non sông liền một dải, tạo cơ sở vững chắc để thống nhất đất nước về mặt nhà nước và đưa cả nước cùng tiến lên con đường xây dựng chủ nghĩa xã hội.",
    },
    {
      title: "Mở ra kỷ nguyên mới rực rỡ trong lịch sử dân tộc",
      text: "Đất nước bước vào kỷ nguyên độc lập, tự do và thống nhất; khẳng định sức mạnh đại đoàn kết toàn dân tộc và tầm vóc nghệ thuật quân sự Việt Nam thời đại Hồ Chí Minh, nâng cao vị thế của Việt Nam trên trường quốc tế.",
    },
    {
      title: "Cổ vũ mạnh mẽ phong trào giải phóng dân tộc trên thế giới",
      text: "Thắng lợi của nhân dân ta tác động sâu sắc đến nội tình nước Mỹ và cục diện thế giới, cổ vũ to lớn các dân tộc bị áp bức đang đấu tranh kiên cường vì độc lập dân tộc, hòa bình, dân chủ và tiến bộ xã hội.",
    },
  ],
  quote: {
    text: "Tiến lên! Chiến sĩ, đồng bào,\nBắc Nam sum họp, xuân nào vui hơn!",
    author: "Chủ tịch Hồ Chí Minh, thơ chúc Tết Kỷ Dậu 1969",
  },
  figures: [
    {
      name: "Văn Tiến Dũng",
      role: "Tư lệnh Chiến dịch Hồ Chí Minh",
      text: "Đại tướng, Tổng Tham mưu trưởng Quân đội nhân dân Việt Nam; trực tiếp chỉ huy các chiến dịch Tây Nguyên và Hồ Chí Minh trong mùa Xuân 1975.",
      href: "/nhan-vat/van-tien-dung",
      image: VAN_TIEN_DUNG_PORTRAIT,
    },
    {
      name: "Phạm Hùng",
      role: "Chính ủy Chiến dịch Hồ Chí Minh",
      text: "Ủy viên Bộ Chính trị, Bí thư Trung ương Cục miền Nam; cùng Bộ Chỉ huy chiến dịch lãnh đạo, chỉ đạo các lực lượng tiến công và nổi dậy giải phóng Sài Gòn.",
      image: PHAM_HUNG_PORTRAIT,
    },
    {
      name: "Lê Đức Thọ",
      role: "Đại diện Bộ Chính trị tại mặt trận",
      text: "Ủy viên Bộ Chính trị, được cử vào chiến trường cùng Bộ Chỉ huy chiến dịch truyền đạt và chỉ đạo thực hiện quyết tâm giải phóng Sài Gòn trước mùa mưa.",
      href: "/nhan-vat/le-duc-tho",
      image: LE_DUC_THO_PORTRAIT,
    },
    {
      name: "Nguyễn Thành Trung",
      role: "Phi công Phi đội Quyết thắng",
      text: "Ngày 8/4/1975 lái máy bay ném bom Dinh Độc Lập rồi bay về vùng giải phóng; chiều 28/4 trực tiếp dẫn đầu Phi đội Quyết thắng ném bom sân bay Tân Sơn Nhất.",
      image: NGUYEN_THANH_TRUNG_PORTRAIT,
    },
  ],
  flashcards: [
    { question: "Chiến dịch giải phóng Sài Gòn – Gia Định chính thức được Bộ Chính trị đặt tên là gì vào ngày 14/4/1975?", answer: "Chiến dịch Hồ Chí Minh." },
    { question: "Tuyến phòng thủ nào được đối phương coi là \"cánh cửa thép\" bảo vệ Sài Gòn từ phía Đông?", answer: "Tuyến phòng thủ Xuân Lộc (Long Khánh)." },
    { question: "Chiến dịch Hồ Chí Minh chính thức mở màn vào thời gian nào?", answer: "Đúng 17 giờ ngày 26/4/1975." },
    { question: "Lực lượng ta tiến công vào Sài Gòn gồm mấy cánh quân, từ những hướng nào?", answer: "Gồm 5 cánh quân: Tây Bắc, Bắc, Đông, Đông Nam và Tây Nam." },
    { question: "Chiều 28/4/1975, sự kiện không quân tiêu biểu nào đã làm tê liệt sân bay Tân Sơn Nhất?", answer: "Phi đội Quyết thắng dùng máy bay A-37 ném bom phá hủy nhiều máy bay địch tại sân bay Tân Sơn Nhất." },
    { question: "Chiếc xe tăng nào đã húc đổ cánh cổng chính Dinh Độc Lập trưa ngày 30/4/1975?", answer: "Xe tăng mang số hiệu 390 (do Trung úy Vũ Đăng Toàn chỉ huy)." },
    { question: "Ai là người đã cắm lá cờ Mặt trận Dân tộc Giải phóng trên nóc Dinh Độc Lập lúc 11 giờ 30 phút ngày 30/4/1975?", answer: "Đại đội trưởng Bùi Quang Thận (chỉ huy xe tăng 843)." },
    { question: "Tỉnh cuối cùng ở miền Nam được giải phóng trong cuộc Tổng tiến công mùa Xuân 1975 là tỉnh nào, ngày nào?", answer: "Tỉnh Châu Đốc (An Giang), ngày 2/5/1975." },
  ],
  quiz: [
    {
      question: "Bộ Chính trị Trung ương Đảng đề ra chủ trương giải phóng miền Nam trong kế hoạch nào?",
      choices: [
        "Trong hai năm 1975 – 1976, nếu thời cơ đến lập tức giải phóng trong năm 1975",
        "Hoàn thành giải phóng toàn bộ miền Nam ngay trong năm 1974",
        "Kéo dài cuộc kháng chiến đến hết năm 1980 để xây dựng lực lượng",
        "Đợi mùa mưa năm 1975 kết thúc mới mở cuộc tổng tiến công",
      ],
      correct: 0,
      explanation: "Cuối 1974 – đầu 1975, Bộ Chính trị đề ra kế hoạch 1975 – 1976 nhưng nhấn mạnh nếu thời cơ đến thì lập tức giải phóng ngay trong năm 1975.",
    },
    {
      question: "Tuyến phòng thủ nào của địch được mệnh danh là \"cánh cửa thép\" bảo vệ Sài Gòn từ phía Đông bị ta phá vỡ ngày 21/4/1975?",
      choices: [
        "Tuyến phòng thủ Xuân Lộc",
        "Căn cứ liên hợp quân sự Đà Nẵng",
        "Tuyến phòng thủ Phan Rang",
        "Căn cứ Đồng Dù (Củ Chi)",
      ],
      correct: 0,
      explanation: "Trận đánh Xuân Lộc (9 – 21/4/1975) do Quân đoàn 4 chủ công đã đập tan \"cánh cửa thép\", mở toang cửa ngõ tiến vào Sài Gòn.",
    },
    {
      question: "Bức điện lịch sử đổi tên chiến dịch giải phóng Sài Gòn – Gia Định thành \"Chiến dịch Hồ Chí Minh\" được Bộ Chính trị thông qua vào ngày nào?",
      choices: [
        "Ngày 14/4/1975",
        "Ngày 26/4/1975",
        "Ngày 8/4/1975",
        "Ngày 30/4/1975",
      ],
      correct: 0,
      explanation: "Ngày 14/4/1975, Bộ Chính trị gửi bức điện số 37/TK đồng ý đặt tên cho chiến dịch giải phóng Sài Gòn – Gia Định là Chiến dịch Hồ Chí Minh.",
    },
    {
      question: "Chiến dịch Hồ Chí Minh chính thức phát lệnh nổ súng mở màn vào thời điểm nào?",
      choices: [
        "17 giờ ngày 26/4/1975",
        "5 giờ sáng ngày 28/4/1975",
        "11 giờ 30 phút ngày 30/4/1975",
        "0 giờ ngày 29/4/1975",
      ],
      correct: 0,
      explanation: "Đúng 17 giờ ngày 26/4/1975, pháo binh ta đồng loạt phát hỏa mở màn chiến dịch từ các hướng Đông và Đông Nam.",
    },
    {
      question: "Chiều 28/4/1975, trận đánh nào của quân ta đã làm tê liệt hoàn toàn đường hàng không quân sự tại sân bay Tân Sơn Nhất?",
      choices: [
        "Phi đội Quyết thắng ném bom sân bay Tân Sơn Nhất",
        "Trận đánh thọc sâu của xe tăng Lữ đoàn 203",
        "Cuộc tập kích tên lửa phòng không vào Dinh Độc Lập",
        "Đòn tiến công của đặc công đánh sập cầu Sài Gòn",
      ],
      correct: 0,
      explanation: "5 máy bay A-37 của Phi đội Quyết thắng ném bom chiều 28/4 đã phá hủy 24 máy bay địch, làm đường bay Tân Sơn Nhất tê liệt hoàn toàn.",
    },
    {
      question: "Hiện vật trong bức ảnh gắn liền với sự kiện lịch sử trọng đại nào trưa ngày 30/4/1975?",
      image: XE_TANG_390,
      choices: [
        "Xe tăng 390 húc đổ cổng chính Dinh Độc Lập",
        "Xe tăng 843 húc đổ cổng phụ Dinh Độc Lập",
        "Đoàn xe thiết giáp đánh chiếm sân bay Tân Sơn Nhất",
        "Xe tăng bảo vệ Đài phát thanh Sài Gòn",
      ],
      correct: 0,
      explanation: "Xe tăng T-54 số hiệu 390 do Vũ Đăng Toàn chỉ huy đã dũng mãnh húc tung cánh cổng chính Dinh Độc Lập vào khoảng 10 giờ 45 phút trưa 30/4/1975.",
    },
    {
      question: "Người chiến sĩ giải phóng đã cắm lá cờ cách mạng trên nóc Dinh Độc Lập lúc 11 giờ 30 phút ngày 30/4/1975 là ai?",
      choices: [
        "Bùi Quang Thận",
        "Vũ Đăng Toàn",
        "Nguyễn Thành Trung",
        "Phạm Xuân Thệ",
      ],
      correct: 0,
      explanation: "Đại đội trưởng xe tăng Bùi Quang Thận (chỉ huy xe 843) đã mang lá cờ Mặt trận Dân tộc Giải phóng lên cắm trên nóc Dinh Độc Lập lúc 11 giờ 30 phút.",
    },
    {
      question: "Hình ảnh trực thăng bị đẩy xuống biển từ boong tàu chiến phản ánh chiến dịch di tản nào của Mỹ cuối tháng 4/1975?",
      image: TRUC_THANG_USS_OKINAWA,
      choices: [
        "Chiến dịch di tản Frequent Wind (\"Gió lốc\")",
        "Chiến dịch Linebacker II",
        "Kế hoạch quân sự Nava",
        "Cuộc hành quân Lam Sơn 719",
      ],
      correct: 0,
      explanation: "Chiến dịch Frequent Wind (29–30/4/1975) là cuộc di tản bằng trực thăng lớn nhất lịch sử của Mỹ khi quân giải phóng khép chặt vòng vây Sài Gòn.",
    },
    {
      question: "Tỉnh cuối cùng ở miền Nam được giải phóng, đánh dấu thắng lợi trọn vẹn của cuộc Tổng tiến công mùa Xuân 1975 là:",
      choices: [
        "Châu Đốc (nay thuộc An Giang) ngày 2/5/1975",
        "Cần Thơ ngày 30/4/1975",
        "Cà Mau ngày 1/5/1975",
        "Vũng Tàu ngày 29/4/1975",
      ],
      correct: 0,
      explanation: "Ngày 2/5/1975, tỉnh Châu Đốc (nay thuộc An Giang) được giải phóng, khép lại trọn vẹn cuộc Tổng tiến công và nổi dậy mùa Xuân 1975.",
    },
    {
      question: "Tòa nhà lịch sử trong ảnh (Dinh Độc Lập — nay là Hội trường Thống Nhất) do kiến trúc sư Việt Nam nào thiết kế?",
      image: DINH_THONG_NHAT,
      choices: [
        "Kiến trúc sư Ngô Viết Thụ",
        "Kiến trúc sư Huỳnh Tấn Phát",
        "Kiến trúc sư Nguyễn Cao Luyện",
        "Kiến trúc sư Võ Trọng Nghĩa",
      ],
      correct: 0,
      explanation: "Dinh Độc Lập do Kiến trúc sư Ngô Viết Thụ thiết kế, khánh thành năm 1966 với bố cục mang đậm nét triết học phương Đông và văn hóa Việt Nam.",
    },
  ],
  todayScans: [
    {
      title: "Biểu tượng đô thị TP. Hồ Chí Minh",
      text: "Thành phố Hồ Chí Minh ngày nay — trung tâm kinh tế, văn hóa năng động và hiện đại của đất nước thống nhất.",
      scan: SCAN_BITEXCO_SAIGON,
    },
  ],
  today: [
    DINH_THONG_NHAT,
    CONG_DINH_DOC_LAP,
    SAN_THUONG_DINH_DOC_LAP,
    BAO_TANG_CHIEN_DICH,
    TUONG_DAI_XUAN_LOC,
    CAU_RACH_CHIEC,
    DINH_DOC_LAP_2025,
  ],
  toVerify: [
    "Số bài, số trang và cách SGK trình bày năm cánh quân (Quân đoàn 1, 2, 3, 4 và Đoàn 232) cùng hướng tiến công của từng cánh.",
    "Ngày Bộ Chính trị đặt tên Chiến dịch Hồ Chí Minh: 14/4/1975 theo bức điện số 37/TK.",
    "Mốc 17 giờ ngày 26/4/1975 bắt đầu chiến dịch; khoảng 10 giờ 45 phút xe tăng vào Dinh Độc Lập; 11 giờ 30 phút cắm cờ.",
    "Xuân Lộc: quân ta tiến công từ 9/4, đối phương rút chạy ngày 21/4/1975.",
    "Phi đội Quyết thắng ném bom sân bay Tân Sơn Nhất chiều 28/4/1975 (thành phần 5 phi công: Nguyễn Thành Trung, Từ Đễ, Nguyễn Văn Lục, Hán Văn Quảng, Hoàng Mai Vượng).",
    "Ngày 2/5/1975 Châu Đốc được giải phóng — mốc giải phóng hoàn toàn miền Nam.",
    "Vai trò của Phạm Hùng (Chính ủy chiến dịch) và Lê Đức Thọ (đại diện Bộ Chính trị) — đối chiếu tài liệu chính thống.",
    "Vị trí các cánh quân trên bản đồ chỉ là sơ đồ hướng tiến công, không phải đường hành quân thật.",
  ],
};
