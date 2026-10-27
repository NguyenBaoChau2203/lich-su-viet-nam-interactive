import { chienDichHoChiMinh1975, TARGETS } from "@/lib/battles/chien-dich-ho-chi-minh-1975";
import type { LatLng } from "@/lib/battles/types";
import type { MapCamKey, MapFilmScript } from "@/lib/mapfilm/types";

// Phim trên bản đồ 3D — Chiến dịch Hồ Chí Minh (26 – 30/4/1975).
// Mỗi cảnh ứng với một bước của bản đồ 2D (lib/battles/chien-dich-ho-chi-minh-1975.ts),
// dùng chung tọa độ mục tiêu, mũi tên và vùng.
// Thời điểm trong cảnh là "thời gian phim", được nén cho trải nghiệm trực quan.

const PHOTO = "/lessons/chien-dich-ho-chi-minh";

// Vị trí các trận địa pháo tầm xa và bãi phóng
const PHAO_NHON_TRACH: LatLng = [10.72, 106.85];
const PHAO_CU_CHI: LatLng = [11.05, 106.45];
const PHAO_BIEN_HOA: LatLng = [10.98, 106.9];

// Cổng chính Dinh Độc Lập
const CONG_DINH: LatLng = [10.7766, 106.6948];

const SOUTH_END: MapCamKey = { t: 36, center: [11.0, 107.1], zoom: 8.0, pitch: 52, bearing: -15 };

export const chienDichHoChiMinhMapFilm: MapFilmScript = {
  slug: "chien-dich-ho-chi-minh",
  title: "Chiến dịch Hồ Chí Minh trên bản đồ 3D",
  scenario: chienDichHoChiMinh1975,
  poster: { src: `${PHOTO}/xe-tang-390-dinh-doc-lap.webp`, alt: "Xe tăng 390 húc đổ cổng Dinh Độc Lập ngày 30/4/1975" },
  lesson: { href: "/bai-hoc/chien-dich-ho-chi-minh-1975", title: "Chiến dịch Hồ Chí Minh" },
  origin: TARGETS.dinhDocLap,
  toVerify: [
    "Sơ đồ 5 cánh quân tiến công là minh họa theo tư liệu Bảo tàng Chiến dịch Hồ Chí Minh.",
    "Thứ tự và thời điểm các đòn tiến công trong từng cảnh được nén cho phim 3D, không theo giờ thực tế.",
  ],
  scenes: [
    // 1. Thời cơ chiến lược: toàn cảnh miền Nam sau thắng lợi Tây Nguyên và Huế – Đà Nẵng
    {
      stepId: "thoi-co",
      duration: 36,
      chapter: { title: "Thời cơ chiến lược", clock: "Tháng 3 – 4/1975" },
      camera: [
        { t: 0, center: [14.0, 108.0], zoom: 6.2, pitch: 35, bearing: 0 },
        { t: 10, center: [13.0, 107.8], zoom: 6.6, pitch: 42, bearing: -5 },
        { t: 20, center: [11.8, 107.4], zoom: 7.2, pitch: 48, bearing: -10 },
        SOUTH_END,
      ],
      subtitles: [
        { t0: 1, t1: 8.5, text: "Sau thắng lợi Tây Nguyên và Huế – Đà Nẵng tháng 3/1975, cục diện chiến trường biến chuyển nhảy vọt." },
        { t0: 9.5, t1: 17.5, text: "Bộ Chính trị nhận định thời cơ chiến lược đã đến, quyết định giải phóng miền Nam trước mùa mưa năm 1975." },
        { t0: 18.5, t1: 26.5, text: "Điện mật của Đại tướng Võ Nguyên Giáp thôi thúc: Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa." },
        { t0: 27.5, t1: 35.5, text: "Các quân đoàn chủ lực ngày đêm cơ động theo đường Trường Sơn và duyên hải, dồn dập áp sát Sài Gòn." },
      ],
      factAt: 26,
      extraArrows: [
        { id: "tc-tay-nguyen", kind: "attack", t0: 2, t1: 8, path: [[14.4, 108.0], [13.98, 108.0], [12.67, 108.04]] },
        { id: "tc-hue-danang", kind: "attack", t0: 6, t1: 14, path: [[16.46, 107.59], [16.07, 108.22], [15.2, 108.8]] },
        { id: "tc-co-dong-nam", kind: "attack", t0: 16, t1: 28, path: [[15.2, 108.8], [13.5, 109.2], [11.95, 109.2], [10.95, 107.24]] },
      ],
      actions: [
        { type: "label", id: "l-tay-nguyen", at: [12.67, 108.04], text: "Tây Nguyên (tháng 3/1975)", t0: 2, t1: 16, tone: "place" },
        { type: "label", id: "l-danang", at: [16.07, 108.22], text: "Huế – Đà Nẵng (tháng 3/1975)", t0: 6, t1: 18, tone: "place" },
        { type: "label", id: "l-hoang-sa", at: [16.5, 112.0], text: "Quần đảo Hoàng Sa (Việt Nam)", t0: 1, t1: 32, tone: "place" },
        { type: "label", id: "l-truong-sa", at: [10.0, 114.3], text: "Quần đảo Trường Sa (Việt Nam)", t0: 1, t1: 32, tone: "place" },
        { type: "label", id: "l-menh-lenh", at: [12.2, 107.8], text: "\"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa\"", t0: 19, t1: 34 },
      ],
    },

    // 2. Xuân Lộc: đập tan cánh cửa thép phía Đông Sài Gòn
    {
      stepId: "xuan-loc",
      duration: 36,
      chapter: { title: "Trận chiến Xuân Lộc", clock: "9/4 – 21/4/1975" },
      camera: [
        { ...SOUTH_END, t: 0 },
        { t: 8, center: [10.94, 107.24], zoom: 11.5, pitch: 58, bearing: -30 },
        { t: 18, center: [10.935, 107.243], zoom: 12.8, pitch: 62, bearing: -20, ease: "linear" },
        { t: 28, center: [10.92, 107.15], zoom: 11.8, pitch: 55, bearing: -50 },
        { t: 36, center: [10.9, 107.0], zoom: 10.5, pitch: 50, bearing: -60 },
      ],
      subtitles: [
        { t0: 1, t1: 8.5, text: "Xuân Lộc là cánh cửa thép bảo vệ cửa ngõ phía Đông Sài Gòn, tập trung sư đoàn 18 và thiết giáp ngụy." },
        { t0: 9.5, t1: 17.5, text: "Ngày 9/4/1975, Quân đoàn 4 mở đợt tiến công quyết liệt, kiên trì đập tan các tuyến phòng ngự kiên cố." },
        { t0: 18.5, t1: 26.5, text: "Trước nguy cơ bị tiêu diệt, đêm 20 rạng sáng 21/4 địch tháo chạy; cánh cửa thép chính thức sụp đổ." },
        { t0: 27.5, t1: 35.5, text: "Cửa ngõ phía Đông mở toang, Nguyễn Văn Thiệu từ chức; đại quân ta thẳng tiến về sào huyệt Sài Gòn." },
      ],
      factAt: 20,
      extraArrows: [
        { id: "xl-cong-kich", kind: "attack", t0: 8, t1: 16, path: [[11.02, 107.35], [10.96, 107.28], TARGETS.xuanLoc] },
      ],
      actions: [
        { type: "strongpoint", id: "xuanLoc", t: 8, status: "attacked" },
        { type: "barrage", from: [[11.02, 107.32]], target: TARGETS.xuanLoc, t0: 8.5, t1: 15, rounds: 12, spread: 130, seed: 71 },
        { type: "march", id: "qd4-xuan-loc", kind: "infantry", side: "mt", path: [[11.02, 107.35], [10.96, 107.28], TARGETS.xuanLoc], t0: 10, t1: 18, count: 5 },
        { type: "strongpoint", id: "xuanLoc", t: 21, status: "captured" },
        { type: "label", id: "l-xl-pha-vo", at: TARGETS.xuanLoc, text: "21/4: Cánh cửa thép Xuân Lộc bị phá vỡ", t0: 21.5, t1: 34 },
      ],
    },

    // 3. Năm cánh quân hình thành thế bao vây
    {
      stepId: "bao-vay",
      duration: 38,
      chapter: { title: "Năm cánh quân bao vây", clock: "14/4 – 25/4/1975" },
      camera: [
        { t: 0, center: [10.9, 107.0], zoom: 10.5, pitch: 50, bearing: -60 },
        { t: 8, center: [10.86, 106.72], zoom: 10.0, pitch: 54, bearing: 0 },
        { t: 20, center: [10.86, 106.72], zoom: 10.4, pitch: 56, bearing: 15, ease: "linear" },
        { t: 30, center: [10.83, 106.7], zoom: 10.6, pitch: 58, bearing: 30 },
        { t: 38, center: [10.82, 106.69], zoom: 10.8, pitch: 58, bearing: 20 },
      ],
      subtitles: [
        { t0: 1, t1: 8.5, text: "Ngày 14/4/1975, Bộ Chính trị phê chuẩn đặt tên cho chiến dịch giải phóng Sài Gòn là Chiến dịch Hồ Chí Minh." },
        { t0: 9.5, t1: 18.0, text: "Hơn 25 vạn quân chủ lực của ta tổ chức thành năm cánh quân hùng mạnh, khép chặt vòng vây tứ phía." },
        { t0: 19.0, t1: 27.5, text: "Năm cánh quân gồm: Quân đoàn 3 (Tây Bắc), Quân đoàn 1 (Bắc), Quân đoàn 4 (Đông), Quân đoàn 2 (Đông Nam) và Đoàn 232 (Tây Nam)." },
        { t0: 28.5, t1: 37.5, text: "Thế trận bao vây hoàn tất, cắt đứt hoàn toàn liên lạc giữa các sư đoàn phòng thủ vòng ngoài với nội đô." },
      ],
      factAt: 14,
      actions: [
        { type: "zone", id: "vong-vay", t0: 8, t1: 16 },
        { type: "reveal", ids: ["dongDu", "bienHoa", "tanSonNhat", "boTongThamMuu", "dinhDocLap"], t0: 9, t1: 18 },
        { type: "label", id: "l-cd-hcm", at: [10.75, 106.62], text: "Chiến dịch mang tên Bác (14/4/1975)", t0: 2, t1: 14 },
        { type: "label", id: "l-qd3", at: [11.03, 106.42], text: "Tây Bắc: Quân đoàn 3", t0: 18, t1: 36, tone: "place" },
        { type: "label", id: "l-qd1", at: [11.1, 106.66], text: "Bắc: Quân đoàn 1", t0: 19, t1: 36, tone: "place" },
        { type: "label", id: "l-qd4", at: [10.98, 106.98], text: "Đông: Quân đoàn 4", t0: 20, t1: 36, tone: "place" },
        { type: "label", id: "l-qd2", at: [10.76, 106.98], text: "Đông Nam: Quân đoàn 2", t0: 21, t1: 36, tone: "place" },
        { type: "label", id: "l-d232", at: [10.62, 106.5], text: "Tây Nam: Đoàn 232", t0: 22, t1: 36, tone: "place" },
      ],
    },

    // 4. Mở màn: 17 giờ ngày 26/4 nổ súng
    {
      stepId: "no-sung",
      duration: 40,
      chapter: { title: "Nổ súng mở màn", clock: "17 giờ ngày 26/4 – 27/4/1975" },
      camera: [
        { t: 0, center: [10.82, 106.69], zoom: 10.8, pitch: 58, bearing: 20 },
        { t: 6, center: [10.88, 106.82], zoom: 11.6, pitch: 60, bearing: -10 },
        { t: 16, center: [10.957, 106.843], zoom: 12.6, pitch: 62, bearing: -25, ease: "linear" },
        { t: 26, center: [10.98, 106.52], zoom: 12.4, pitch: 62, bearing: 45 },
        { t: 34, center: [10.85, 106.72], zoom: 11.2, pitch: 56, bearing: 10 },
        { t: 40, center: [10.83, 106.7], zoom: 11.0, pitch: 54, bearing: 0 },
      ],
      subtitles: [
        { t0: 1.5, t1: 9.0, text: "Đúng 17 giờ ngày 26/4/1975, pháo tầm xa đồng loạt nổ súng rền vang, chính thức mở màn chiến dịch lịch sử." },
        { t0: 10.0, t1: 18.0, text: "Cánh quân hướng Đông và Đông Nam tiến công trước, cắt đứt đường rút chạy ra biển của địch." },
        { t0: 19.0, t1: 27.5, text: "Ta đồng loạt công kích các căn cứ trọng yếu vòng ngoài như căn cứ Đồng Dù (Củ Chi) và sân bay Biên Hòa." },
        { t0: 28.5, t1: 39.0, text: "Các chiến sĩ đặc công, biệt động dũng cảm đánh chiếm và giữ vững cầu Rạch Chiếc, cầu Sài Gòn, dọn đường cho cơ giới." },
      ],
      unitMove: [6, 28],
      factAt: 30,
      actions: [
        { type: "barrage", from: [PHAO_BIEN_HOA], target: TARGETS.bienHoa, t0: 2, t1: 9, rounds: 12, spread: 120, seed: 72 },
        { type: "strongpoint", id: "bienHoa", t: 4, status: "attacked" },
        { type: "arrow", arrow: "dong-ap-sat", t0: 5, t1: 14 },
        { type: "march", id: "xp-bienhoa", kind: "infantry", side: "mt", path: { arrow: "dong-ap-sat" }, t0: 6, t1: 16, count: 4 },
        { type: "barrage", from: [PHAO_CU_CHI], target: TARGETS.dongDu, t0: 15, t1: 23, rounds: 12, spread: 120, seed: 73 },
        { type: "strongpoint", id: "dongDu", t: 17, status: "attacked" },
        { type: "arrow", arrow: "tayBac-ap-sat", t0: 18, t1: 26 },
        { type: "march", id: "xp-dongdu", kind: "infantry", side: "mt", path: { arrow: "tayBac-ap-sat" }, t0: 19, t1: 27, count: 4 },
        { type: "arrow", arrow: "thiet-giap-ap-sat", t0: 24, t1: 32 },
        { type: "march", id: "tank-ap-sat", kind: "tank", side: "mt", path: { arrow: "thiet-giap-ap-sat" }, t0: 25, t1: 34, count: 4 },
        { type: "label", id: "l-dac-cong-cau", at: [10.81, 106.76], text: "Đặc công chiếm và giữ cầu Rạch Chiếc, cầu Sài Gòn", t0: 28, t1: 39 },
      ],
    },

    // 5. Phi đội Quyết thắng ném bom Tân Sơn Nhất
    {
      stepId: "tan-son-nhat",
      duration: 40,
      chapter: { title: "Không kích Tân Sơn Nhất", clock: "Chiều 28/4/1975" },
      camera: [
        { t: 0, center: [10.83, 106.7], zoom: 11.0, pitch: 54, bearing: 0 },
        { t: 6, center: [10.825, 106.66], zoom: 13.0, pitch: 62, bearing: -40 },
        { t: 15, center: [10.8188, 106.6519], zoom: 14.2, pitch: 65, bearing: -55, ease: "linear" },
        { t: 26, center: [10.82, 106.655], zoom: 13.8, pitch: 62, bearing: -30 },
        { t: 34, center: [10.81, 106.66], zoom: 12.8, pitch: 58, bearing: 0 },
        { t: 40, center: [10.8, 106.67], zoom: 12.2, pitch: 55, bearing: 15 },
      ],
      subtitles: [
        { t0: 1.5, t1: 8.5, text: "Chiều 28/4, khi Dương Văn Minh nhậm chức tại Dinh Độc Lập, Phi đội Quyết thắng bất ngờ xuất kích." },
        { t0: 9.5, t1: 17.5, text: "Năm máy bay A-37 do phi công Nguyễn Thành Trung dẫn đường dội bom chính xác xuống sân bay Tân Sơn Nhất." },
        { t0: 18.5, t1: 27.0, text: "24 máy bay địch bị phá hủy; kết hợp pháo binh tầm xa khống chế, đường di tản hàng không bị cắt đứt hoàn toàn." },
        { t0: 28.0, t1: 39.0, text: "Các căn cứ Đồng Dù và Biên Hòa bị tiêu diệt; vòng vây siết chặt ngay sát sào huyệt cuối cùng của đối phương." },
      ],
      unitMove: [4, 25],
      factAt: 20,
      actions: [
        { type: "strongpoint", id: "bienHoa", t: 3, status: "captured" },
        { type: "strongpoint", id: "dongDu", t: 5, status: "captured" },
        { type: "arrow", arrow: "a37-tap-kich", t0: 3, t1: 11 },
        { type: "march", id: "a37-strike", kind: "jet", side: "mt", path: { arrow: "a37-tap-kich" }, t0: 4, t1: 18, count: 5 },
        { type: "blast", at: TARGETS.tanSonNhat, t: 12.5, kind: "blast", scale: 1.6 },
        { type: "blast", at: [10.821, 106.654], t: 14.0, kind: "blast", scale: 1.4 },
        { type: "blast", at: [10.816, 106.649], t: 15.5, kind: "fire", scale: 1.8, t1: 39 },
        { type: "strongpoint", id: "tanSonNhat", t: 14, status: "attacked" },
        { type: "barrage", from: [PHAO_NHON_TRACH], target: TARGETS.tanSonNhat, t0: 18, t1: 28, rounds: 14, spread: 200, seed: 74 },
        { type: "label", id: "l-phi-doi-quyet-thang", at: [10.825, 106.66], text: "Phi đội Quyết thắng dội bom phá hủy 24 máy bay địch", t0: 12, t1: 24 },
        { type: "label", id: "l-tsn-te-liet", at: TARGETS.tanSonNhat, text: "Sân bay Tân Sơn Nhất tê liệt hoàn toàn", t0: 25, t1: 38 },
      ],
    },

    // 6. Tổng công kích vào nội đô, Mỹ di tản bằng trực thăng
    {
      stepId: "tong-cong-kich",
      duration: 42,
      chapter: { title: "Tổng công kích vào nội đô", clock: "29/4 – rạng sáng 30/4/1975" },
      camera: [
        { t: 0, center: [10.8, 106.67], zoom: 12.2, pitch: 55, bearing: 15 },
        { t: 6, center: [10.795, 106.67], zoom: 13.5, pitch: 62, bearing: 25 },
        { t: 16, center: [10.788, 106.68], zoom: 14.0, pitch: 64, bearing: 45, ease: "linear" },
        { t: 26, center: [10.78, 106.69], zoom: 14.2, pitch: 65, bearing: 60 },
        { t: 34, center: [10.778, 106.694], zoom: 14.8, pitch: 66, bearing: 75 },
        { t: 42, center: [10.777, 106.6953], zoom: 15.0, pitch: 66, bearing: 90 },
      ],
      subtitles: [
        { t0: 1.5, t1: 9.0, text: "Rạng sáng 29/4/1975, năm cánh quân đồng loạt tổng công kích, thọc sâu thẳng vào trung tâm đầu não Sài Gòn." },
        { t0: 10.0, t1: 18.5, text: "Sân bay tê liệt, Mỹ phải mở chiến dịch Gió lốc (Frequent Wind), dùng trực thăng di tản khẩn cấp ra hạm đội ngoài khơi." },
        { t0: 19.5, t1: 28.5, text: "Quân ta nhanh chóng đánh chiếm Bộ Tổng tham mưu, Biệt khu Thủ đô và làm chủ hoàn toàn sân bay Tân Sơn Nhất." },
        { t0: 29.5, t1: 41.0, text: "Lữ đoàn xe tăng 203 dẫn đầu cánh quân Đông Nam băng qua cầu Sài Gòn, dũng mãnh tiến thẳng tới Dinh Độc Lập." },
      ],
      unitMove: [5, 26],
      factAt: 16,
      actions: [
        // Dinh Độc Lập và cổng dinh sừng sững ở trung tâm (cờ Sài Gòn)
        { type: "march", id: "m-palace-6", kind: "palace", side: "arvn", path: [TARGETS.dinhDocLap, [10.77701, 106.6953]], t0: 0, t1: 42, count: 1 },
        { type: "march", id: "m-gate-6", kind: "gate", side: "arvn", path: [CONG_DINH, [10.77661, 106.6948]], t0: 0, t1: 42, count: 1 },
        // Trực thăng UH-1 di tản ra biển
        { type: "march", id: "uh1-evac", kind: "helicopter", side: "arvn", path: [TARGETS.dinhDocLap, [10.65, 106.85], [10.35, 107.1]], t0: 6, t1: 24, count: 4, fadeAtEnd: true },
        { type: "label", id: "l-frequent-wind", at: [10.74, 106.78], text: "Chiến dịch di tản Gió lốc (Frequent Wind)", t0: 7, t1: 22 },
        // Tiến công Bộ Tổng tham mưu
        { type: "strongpoint", id: "boTongThamMuu", t: 16, status: "attacked" },
        // Xe tăng 203 thọc sâu vào trung tâm
        { type: "arrow", arrow: "thiet-giap-trung-tam", t0: 20, t1: 30 },
        { type: "march", id: "tank-trung-tam", kind: "tank", side: "mt", path: { arrow: "thiet-giap-trung-tam" }, t0: 22, t1: 38, count: 4 },
        { type: "label", id: "l-thoc-sau", at: [10.785, 106.7], text: "Lữ đoàn xe tăng 203 thọc sâu vào Dinh Độc Lập", t0: 28, t1: 41 },
      ],
    },

    // 7. Toàn thắng: 11 giờ 30 phút ngày 30/4/1975
    {
      stepId: "dinh-doc-lap",
      duration: 42,
      chapter: { title: "Non sông thu về một mối", clock: "11 giờ 30 phút ngày 30/4/1975" },
      camera: [
        { t: 0, center: [10.777, 106.6953], zoom: 15.0, pitch: 66, bearing: 90 },
        { t: 6, center: CONG_DINH, zoom: 16.2, pitch: 68, bearing: 110 },
        { t: 14, center: [10.777, 106.6953], zoom: 16.5, pitch: 70, bearing: 130, ease: "linear" },
        { t: 24, center: [10.777, 106.6953], zoom: 16.0, pitch: 65, bearing: 180 },
        { t: 34, center: [10.777, 106.6953], zoom: 14.5, pitch: 58, bearing: 240, ease: "linear" },
        { t: 42, center: [10.777, 106.6953], zoom: 13.0, pitch: 50, bearing: 300 },
      ],
      subtitles: [
        { t0: 1.5, t1: 9.0, text: "10 giờ 45 phút ngày 30/4/1975, xe tăng 390 húc tung cổng chính Dinh Độc Lập, tiến thẳng vào sân dinh." },
        { t0: 10.0, t1: 18.0, text: "Các chiến sĩ Lữ đoàn 203 nhanh chóng tiến lên tầng thượng, bắt giữ toàn bộ nội các chính quyền Dương Văn Minh." },
        { t0: 19.0, t1: 28.0, text: "Đúng 11 giờ 30 phút, đồng chí Bùi Quang Thận giương cao lá cờ cách mạng tung bay kiêu hãnh trên nóc Dinh." },
        { t0: 29.0, t1: 41.0, text: "Dương Văn Minh đọc lời tuyên bố đầu hàng không điều kiện. Chiến dịch Hồ Chí Minh toàn thắng, đất nước hoàn toàn thống nhất!" },
      ],
      unitMove: [2, 14],
      factAt: 24,
      actions: [
        // Dinh Độc Lập với cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc
        { type: "march", id: "m-palace-7", kind: "palace", side: "mt", path: [TARGETS.dinhDocLap, [10.77701, 106.6953]], t0: 0, t1: 42, count: 1 },
        { type: "march", id: "m-gate-7", kind: "gate", side: "arvn", path: [CONG_DINH, [10.77661, 106.6948]], t0: 0, t1: 42, count: 1 },
        // Xe tăng 390 và 843 húc cổng và tiến vào sân
        { type: "march", id: "tank-huc-cong", kind: "tank", side: "mt", path: [[10.7762, 106.6943], CONG_DINH, TARGETS.dinhDocLap], t0: 4, t1: 18, count: 2 },
        // Chấn động và khói bụi khi xe tăng húc đổ cánh cổng sắt
        { type: "blast", at: CONG_DINH, t: 10.8, kind: "grenade", scale: 1.8 },
        // Các cứ điểm còn lại được giải phóng
        { type: "strongpoint", id: "boTongThamMuu", t: 10, status: "captured" },
        { type: "strongpoint", id: "tanSonNhat", t: 12, status: "captured" },
        { type: "strongpoint", id: "dinhDocLap", t: 16, status: "captured" },
        { type: "label", id: "l-huc-cong", at: CONG_DINH, text: "10h45: Xe tăng 390 húc đổ cổng Dinh Độc Lập", t0: 8, t1: 19 },
        { type: "label", id: "l-cam-co", at: TARGETS.dinhDocLap, text: "11h30: Cắm cờ Giải phóng trên nóc Dinh Độc Lập", t0: 20, t1: 34 },
        { type: "label", id: "l-dau-hang", at: [10.775, 106.697], text: "Dương Văn Minh tuyên bố đầu hàng không điều kiện", t0: 30, t1: 41 },
      ],
    },
  ],
};
