import type { BattleScenario, LatLng, StrongpointStatus, UnitDefinition, UnitState } from "@/lib/battles/types";

// Chiến dịch Hồ Chí Minh (26 – 30/4/1975) — bản đồ "5 cánh quân tiến vào Sài Gòn" (viết cứng, không lưu database).
// Nội dung viết lại theo khung SGK Lịch sử 12 (Kết nối tri thức), Bài 8, đối chiếu Sổ nguồn sử liệu docs/audits/2026-10-25-hcm-1975-lesson-sources.md.
//
// Dùng lại bộ máy bản đồ diễn biến: mỗi "cứ điểm" là một mục tiêu then chốt của đối phương — xanh = còn trong tay đối phương,
// viền đỏ nhấp nháy = đang bị tiến công, đỏ sao vàng = quân ta đã làm chủ. Vị trí các cánh quân và mũi tên là SƠ ĐỒ MINH HỌA
// hướng tiến công (Tây Bắc, Bắc, Đông, Đông Nam, Tây Nam), không phải đường hành quân thật.

const PHOTO = "/lessons/chien-dich-ho-chi-minh";

const at = (position: LatLng): UnitState => ({ position, visible: true, status: "active" });
const hidden = (position: LatLng): UnitState => ({ position, visible: false, status: "active" });

/** Mục tiêu then chốt — tọa độ gần đúng theo OpenStreetMap và Sổ nguồn sử liệu. */
export const TARGETS = {
  xuanLoc: [10.935, 107.243],
  bienHoa: [10.957, 106.843],
  dongDu: [11.0, 106.49],
  tanSonNhat: [10.8188, 106.6519],
  boTongThamMuu: [10.7975, 106.6625],
  dinhDocLap: [10.777, 106.6953],
} satisfies Record<string, LatLng>;

type TargetId = keyof typeof TARGETS;

/** Vị trí sơ đồ của 5 cánh quân ở các thời điểm: bao vây (25/4), áp sát (29/4), vào trung tâm (30/4). */
const WINGS = {
  tayBac: { label: "Cánh quân hướng Tây Bắc (Quân đoàn 3)", start: [11.03, 106.42], near: [10.86, 106.6], end: [10.8, 106.665] },
  bac: { label: "Cánh quân hướng Bắc (Quân đoàn 1)", start: [11.1, 106.66], near: [10.9, 106.68], end: [10.792, 106.69] },
  dong: { label: "Cánh quân hướng Đông (Quân đoàn 4)", start: [10.98, 106.98], near: [10.9, 106.8], end: [10.785, 106.705] },
  dongNam: { label: "Cánh quân hướng Đông Nam (Quân đoàn 2)", start: [10.76, 106.98], near: [10.79, 106.78], end: [10.777, 106.7] },
  tayNam: { label: "Cánh quân hướng Tây Nam (Đoàn 232)", start: [10.62, 106.5], near: [10.71, 106.6], end: [10.765, 106.685] },
} satisfies Record<string, { label: string; start: LatLng; near: LatLng; end: LatLng }>;

type WingId = keyof typeof WINGS;
type SpecialUnitId = "thietGiap203" | "phiDoiQuyetThang";
type AllUnitId = WingId | SpecialUnitId;

function makeUnits(
  wingStage: "start" | "near" | "end" | "hidden",
  overrides?: Partial<Record<AllUnitId, UnitState>>,
): Record<string, UnitState> {
  const res: Record<string, UnitState> = {};
  for (const id of Object.keys(WINGS) as WingId[]) {
    res[id] = wingStage === "hidden" ? hidden(WINGS[id].start) : at(WINGS[id][wingStage]);
  }
  res.thietGiap203 = hidden(WINGS.dongNam.start);
  res.phiDoiQuyetThang = hidden(TARGETS.tanSonNhat);
  if (overrides) {
    Object.assign(res, overrides);
  }
  return res;
}

function targets(overrides: Partial<Record<TargetId, StrongpointStatus>>): Record<string, StrongpointStatus> {
  return { ...Object.fromEntries(Object.keys(TARGETS).map((id) => [id, "held" as StrongpointStatus])), ...overrides };
}

const SOUTH = { center: [11.6, 107.3] as LatLng, zoom: 6 };
const SAIGON = { center: [10.86, 106.72] as LatLng, zoom: 10 };

export const chienDichHoChiMinh1975: BattleScenario = {
  slug: "chien-dich-ho-chi-minh-1975",
  title: "Chiến dịch Hồ Chí Minh",
  dateText: "26 – 30/4/1975",
  summary: "Năm cánh quân đồng loạt tiến công vào Sài Gòn; trưa 30/4/1975 lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, chính quyền Sài Gòn đầu hàng.",
  center: SAIGON.center,
  zoom: SAIGON.zoom,
  minZoom: 5,
  maxZoom: 13,
  unitDefinitions: [
    ...(Object.keys(WINGS) as WingId[]).map((id) => ({ id, kind: "vn-infantry" as const, label: WINGS[id].label })),
    { id: "thietGiap203", kind: "vn-armor" as const, label: "Lữ đoàn xe tăng 203 (mũi thọc sâu)" },
    { id: "phiDoiQuyetThang", kind: "vn-aircraft" as const, label: "Phi đội Quyết thắng (A-37)" },
  ] satisfies UnitDefinition[],
  strongpointDefinitions: [
    { id: "xuanLoc", label: "Xuân Lộc", name: "Tuyến phòng thủ Xuân Lộc (\"cánh cửa thép\")", position: TARGETS.xuanLoc },
    { id: "bienHoa", label: "Biên Hòa", name: "Biên Hòa (căn cứ quân sự, sân bay)", position: TARGETS.bienHoa, minorLabel: true },
    { id: "dongDu", label: "Đồng Dù", name: "Căn cứ Đồng Dù (Củ Chi)", position: TARGETS.dongDu, minorLabel: true },
    { id: "tanSonNhat", label: "Tân Sơn Nhất", name: "Sân bay Tân Sơn Nhất", position: TARGETS.tanSonNhat, minorLabel: true },
    { id: "boTongThamMuu", label: "Bộ Tổng tham mưu", name: "Bộ Tổng tham mưu quân đội Sài Gòn", position: TARGETS.boTongThamMuu, minorLabel: true },
    { id: "dinhDocLap", label: "Dinh Độc Lập", name: "Dinh Độc Lập — cơ quan đầu não của chính quyền Sài Gòn", position: TARGETS.dinhDocLap },
  ],
  arrowDefinitions: [
    ...(Object.keys(WINGS) as WingId[]).flatMap((id) => [
      { id: `${id}-ap-sat`, kind: "attack" as const, path: [WINGS[id].start, WINGS[id].near] },
      { id: `${id}-trung-tam`, kind: "attack" as const, path: [WINGS[id].near, WINGS[id].end] },
    ]),
    { id: "thiet-giap-ap-sat", kind: "attack" as const, path: [WINGS.dongNam.start, WINGS.dongNam.near] },
    { id: "thiet-giap-trung-tam", kind: "attack" as const, path: [WINGS.dongNam.near, TARGETS.dinhDocLap] },
    { id: "a37-tap-kich", kind: "attack" as const, path: [[11.25, 107.35], [10.98, 106.92], TARGETS.tanSonNhat] },
  ],
  zoneDefinitions: [
    {
      id: "vong-vay",
      kind: "siege",
      label: "Thế bao vây Sài Gòn (vẽ phác)",
      path: [
        [11.12, 106.4],
        [11.15, 106.75],
        [11.02, 107.02],
        [10.75, 107.02],
        [10.56, 106.78],
        [10.56, 106.45],
        [10.8, 106.32],
      ],
    },
  ],
  legend: [
    { className: "battle-sp battle-sp--held", label: "Mục tiêu còn trong tay đối phương" },
    { className: "battle-sp battle-sp--attacked", label: "Đang bị tiến công" },
    { className: "battle-sp battle-sp--captured", label: "Quân ta đã làm chủ" },
    { className: "battle-unit battle-unit--vn-infantry", label: "Cánh quân bộ binh của ta (vị trí sơ đồ)" },
    { className: "battle-unit battle-unit--vn-armor", label: "Lữ đoàn xe tăng thiết giáp (mũi thọc sâu)" },
    { className: "battle-unit battle-unit--vn-aircraft", label: "Không quân ta (Phi đội Quyết thắng)" },
    { className: "battle-legend-arrow", label: "Hướng tiến công" },
    { className: "battle-legend-siege", label: "Thế bao vây Sài Gòn (vẽ phác)" },
  ],
  steps: [
    {
      id: "thoi-co",
      title: "Thời cơ chiến lược",
      dateText: "3/1975",
      caption:
        "Sau thắng lợi vang dội của các chiến dịch Tây Nguyên và Huế – Đà Nẵng vào tháng 3/1975, cục diện chiến trường miền Nam biến chuyển nhảy vọt có lợi cho cách mạng. Bộ Chính trị Trung ương Đảng nhận định thời cơ chiến lược ngàn năm có một đã chín muồi, quyết định tập trung tối đa lực lượng, phương tiện kỹ thuật để giải phóng miền Nam trước mùa mưa năm 1975. Mệnh lệnh lịch sử \"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa\" thôi thúc toàn quân dồn sức cho trận quyết chiến chiến lược cuối cùng.",
      camera: SOUTH,
      units: makeUnits("hidden"),
      strongpoints: targets({}),
      fact: {
        title: "Ba đòn điểm huyệt chiến lược",
        text: "Cuộc Tổng tiến công và nổi dậy mùa Xuân 1975 phát triển qua ba chiến dịch lớn kế tiếp nhau gồm Tây Nguyên, Huế – Đà Nẵng và Chiến dịch Hồ Chí Minh — đỉnh cao quyết chiến chiến lược giải phóng hoàn toàn miền Nam.",
      },
    },
    {
      id: "xuan-loc",
      title: "Xuân Lộc — \"cánh cửa thép\" bị phá",
      dateText: "9 – 21/4/1975",
      caption:
        "Xuân Lộc (Long Khánh) là cứ điểm phòng ngự then chốt bảo vệ cửa ngõ phía Đông Sài Gòn, được đối phương xây dựng kiên cố và ví như \"cánh cửa thép\" bất khả xâm phạm. Từ ngày 9/4/1975, Quân đoàn 4 cùng lực lượng vũ trang địa phương dũng cảm tiến công, kiên trì bẻ gãy các đợt phản kích điên cuồng của địch. Đêm 20 rạng sáng 21/4, quân đối phương tan vỡ rút chạy; tuyến phòng thủ phía Đông sụp đổ khiến chính quyền Sài Gòn hoang mang cực độ, Nguyễn Văn Thiệu phải tuyên bố từ chức tổng thống.",
      camera: { center: [10.95, 107.05], zoom: 9 },
      units: makeUnits("hidden", { dong: at(WINGS.dong.start) }),
      strongpoints: targets({ xuanLoc: "captured" }),
      image: {
        src: `${PHOTO}/tuong-dai-xuan-loc.webp`,
        alt: "Tượng đài chiến thắng tại ngã ba Xuân Lộc với tượng các chiến sĩ vươn cao",
        caption: "Tượng đài Chiến thắng Xuân Lộc (ảnh năm 2004) — ghi dấu trận đánh bẻ gãy cánh cửa thép phía Đông Sài Gòn.",
        credit: "Mztourist, CC BY-SA 3.0",
      },
      fact: {
        title: "Cánh cửa thép sụp đổ",
        text: "Sau 12 ngày đêm chiến đấu ngoan cường, quân ta giải phóng hoàn toàn thị xã Xuân Lộc, mở toang cửa ngõ phía Đông cho đại quân tiến thẳng vào Sài Gòn.",
      },
    },
    {
      id: "bao-vay",
      title: "Năm cánh quân hình thành thế bao vây",
      dateText: "14 – 25/4/1975",
      caption:
        "Ngày 14/4/1975, Bộ Chính trị quyết định đặt tên cho trận quyết chiến giải phóng Sài Gòn – Gia Định là \"Chiến dịch Hồ Chí Minh\". Hơn 25 vạn quân chủ lực của ta được tổ chức thành năm cánh quân hùng hậu: Tây Bắc (Quân đoàn 3), Bắc (Quân đoàn 1), Đông (Quân đoàn 4), Đông Nam (Quân đoàn 2) và Tây Nam (Đoàn 232), nhanh chóng áp sát, hình thành vòng vây khép chặt từ mọi hướng, chia cắt hoàn toàn các sư đoàn đối phương với trung tâm sào huyệt Sài Gòn.",
      camera: SAIGON,
      units: makeUnits("start", { thietGiap203: at(WINGS.dongNam.start) }),
      strongpoints: targets({ xuanLoc: "captured" }),
      zones: ["vong-vay"],
      image: {
        src: `${PHOTO}/bao-tang-chien-dich.webp`,
        alt: "Tòa nhà Bảo tàng Chiến dịch Hồ Chí Minh với khu trưng bày hiện vật cơ giới",
        caption: "Bảo tàng Chiến dịch Hồ Chí Minh — nơi lưu giữ sa bàn tác chiến 5 cánh quân tiến vào Sài Gòn.",
        credit: "HappyMidnight, CC BY-SA 3.0",
      },
      fact: {
        title: "Chiến dịch mang tên Bác",
        text: "Bức điện số 37/TK ngày 14/4/1975 của Bộ Chính trị phê chuẩn mang tên Bác Hồ kính yêu cho chiến dịch lịch sử giải phóng Sài Gòn, cổ vũ mạnh mẽ ý chí quyết chiến của toàn quân.",
      },
    },
    {
      id: "no-sung",
      title: "17 giờ ngày 26/4: Chiến dịch mở màn",
      dateText: "26 – 27/4/1975",
      caption:
        "Đúng 17 giờ ngày 26/4/1975, pháo binh ta từ các hướng đồng loạt phát hỏa dữ dội, chính thức mở màn Chiến dịch Hồ Chí Minh lịch sử. Các cánh quân hướng Đông và Đông Nam nổ súng tiến công trước nhằm chia cắt Sài Gòn với Vũng Tàu, đồng thời đánh chiếm các căn cứ trọng yếu vòng ngoài như Biên Hòa và căn cứ Đồng Dù ở Củ Chi. Lực lượng đặc công, biệt động dũng cảm đánh chiếm và bảo vệ các cây cầu huyết mạch, dọn đường cho đại quân cơ giới tiến vào nội đô.",
      camera: SAIGON,
      units: makeUnits("start", { thietGiap203: at(WINGS.dongNam.start) }),
      strongpoints: targets({ xuanLoc: "captured", bienHoa: "attacked", dongDu: "attacked" }),
      arrows: [
        ...(Object.keys(WINGS) as WingId[]).map((id) => `${id}-ap-sat`),
        "thiet-giap-ap-sat",
      ],
      zones: ["vong-vay"],
      image: {
        src: `${PHOTO}/phao-130mm-bao-tang.webp`,
        alt: "Khẩu pháo nòng dài 130 mm màu xám đặt trên bệ cỏ tại sân bảo tàng",
        caption: "Khẩu pháo nòng dài 130 mm (M-46) tại Bảo tàng Chiến dịch Hồ Chí Minh — hỏa lực tầm xa phát hỏa mở màn chiến dịch chiều 26/4/1975.",
        credit: "HappyMidnight, CC BY-SA 3.0",
      },
      fact: {
        title: "Đặc công giữ cầu huyết mạch",
        text: "Các đơn vị đặc công và biệt động đã kiên cường đánh chiếm, bảo vệ vẹn nguyên các cây cầu trọng yếu (cầu Rạch Chiếc, cầu Sài Gòn, cầu Bình Phước) không cho đối phương phá hủy.",
      },
    },
    {
      id: "tan-son-nhat",
      title: "Phi đội Quyết thắng ném bom Tân Sơn Nhất",
      dateText: "28/4/1975",
      caption:
        "Chiều 28/4/1975, trong lúc Dương Văn Minh làm lễ nhậm chức tổng thống tại Dinh Độc Lập nhằm tìm kiếm giải pháp thương lượng, Phi đội Quyết thắng của Không quân nhân dân Việt Nam gồm 5 máy bay A-37 thu được của địch đã bất ngờ xuất kích từ sân bay Thành Sơn (Phan Rang). Phi đội dội bom chính xác xuống khu để máy bay tại sân bay Tân Sơn Nhất, phá hủy 24 máy bay địch. Cùng lúc, pháo binh tầm xa của ta bắn phá dữ dội, làm tê liệt hoàn toàn đường di tản bằng máy bay cánh bằng.",
      camera: { center: [10.83, 106.68], zoom: 11 },
      units: makeUnits("near", {
        thietGiap203: at(WINGS.dongNam.near),
        phiDoiQuyetThang: at(TARGETS.tanSonNhat),
      }),
      strongpoints: targets({ xuanLoc: "captured", bienHoa: "captured", dongDu: "captured", tanSonNhat: "attacked" }),
      arrows: [
        ...(Object.keys(WINGS) as WingId[]).map((id) => `${id}-ap-sat`),
        "thiet-giap-ap-sat",
        "a37-tap-kich",
      ],
      zones: ["vong-vay"],
      image: {
        src: `${PHOTO}/may-bay-a37-bao-tang.webp`,
        alt: "Máy bay phản lực cường kích nhỏ A-37 sơn màu ngụy trang đặt trên sân bảo tàng",
        caption: "Máy bay A-37 tại Bảo tàng Chiến dịch Hồ Chí Minh — cùng chủng loại với máy bay Phi đội Quyết thắng dội bom chiều 28/4/1975.",
        credit: "HappyMidnight, CC BY-SA 3.0",
      },
      fact: {
        title: "Đòn không kích sấm sét",
        text: "Phi đội do phi công Nguyễn Thành Trung dẫn đường cùng các phi công Từ Đễ, Nguyễn Văn Lục, Hán Văn Quảng, Hoàng Mai Vượng lập nên chiến công xuất sắc làm rung chuyển đầu não đối phương.",
      },
    },
    {
      id: "tong-cong-kich",
      title: "Tổng công kích, Mỹ di tản bằng trực thăng",
      dateText: "29/4/1975",
      caption:
        "Rạng sáng 29/4/1975, toàn bộ năm cánh quân đồng loạt mở đợt tổng công kích mãnh liệt thọc sâu vào trung tâm Sài Gòn, hiệp đồng chặt chẽ với các đòn nổi dậy của quần chúng nhân dân. Mất hoàn toàn quyền kiểm soát sân bay, quân đội Mỹ buộc phải thực hiện chiến dịch di tản khẩn cấp bằng trực thăng mang tên \"Gió lốc\" (Operation Frequent Wind) ra hạm đội ngoài khơi. Không khí hỗn loạn bao trùm bộ máy đối phương khi các cơ quan đầu não như Bộ Tổng tham mưu và Biệt khu Thủ đô bị bao vây tiêu diệt.",
      camera: SAIGON,
      units: makeUnits("near", {
        thietGiap203: at(WINGS.dongNam.near),
      }),
      strongpoints: targets({ xuanLoc: "captured", bienHoa: "captured", dongDu: "captured", tanSonNhat: "attacked", boTongThamMuu: "attacked" }),
      arrows: [
        ...(Object.keys(WINGS) as WingId[]).map((id) => `${id}-trung-tam`),
        "thiet-giap-trung-tam",
      ],
      zones: ["vong-vay"],
      image: {
        src: `${PHOTO}/truc-thang-uss-okinawa.webp`,
        alt: "Thủy thủ Mỹ đẩy một chiếc trực thăng nghiêng xuống biển từ boong tàu sân bay",
        caption: "Trực thăng bị đẩy xuống biển từ tàu USS Okinawa để lấy chỗ đáp trong chiến dịch di tản Frequent Wind cuối tháng 4/1975.",
        credit: "Thủy quân lục chiến Mỹ, phạm vi công cộng",
      },
      fact: {
        title: "Chiến dịch di tản Gió lốc",
        text: "Chiến dịch Frequent Wind là cuộc di tản bằng trực thăng lớn nhất trong lịch sử quân sự Mỹ; hàng chục trực thăng phải đẩy xuống biển để lấy chỗ cho các chuyến bay tiếp theo.",
      },
    },
    {
      id: "dinh-doc-lap",
      title: "11 giờ 30 phút ngày 30/4: Sài Gòn giải phóng",
      dateText: "30/4/1975",
      caption:
        "Sáng 30/4/1975, các cánh quân tiến thẳng vào trung tâm đầu não của địch. Khoảng 10 giờ 45 phút, xe tăng 390 thuộc Lữ đoàn 203 dũng mãnh húc tung cánh cổng chính Dinh Độc Lập; toàn bộ nội các chính quyền Dương Văn Minh bị bắt giữ. Đúng 11 giờ 30 phút, đồng chí Bùi Quang Thận cắm lá cờ Mặt trận Dân tộc Giải phóng trên nóc Dinh Độc Lập. Dương Văn Minh tuyên bố đầu hàng không điều kiện. Chiến dịch Hồ Chí Minh toàn thắng rực rỡ, non sông Việt Nam thu về một mối.",
      camera: { center: [10.79, 106.69], zoom: 12 },
      units: makeUnits("end", {
        thietGiap203: at(TARGETS.dinhDocLap),
      }),
      strongpoints: targets({ xuanLoc: "captured", bienHoa: "captured", dongDu: "captured", tanSonNhat: "captured", boTongThamMuu: "captured", dinhDocLap: "captured" }),
      arrows: [
        ...(Object.keys(WINGS) as WingId[]).map((id) => `${id}-trung-tam`),
        "thiet-giap-trung-tam",
      ],
      image: {
        src: `${PHOTO}/xe-tang-843-dinh-doc-lap.webp`,
        alt: "Xe tăng T-54 sơn số 843 trưng bày trên bãi cỏ trong khuôn viên Dinh Độc Lập",
        caption: "Xe tăng mang số hiệu 843 trong khuôn viên Dinh Độc Lập ngày nay (xe cùng loại; hai xe nguyên bản 390 và 843 lưu giữ tại Hà Nội).",
        credit: "源義信, CC BY 4.0",
      },
      fact: {
        title: "Lá cờ trên nóc Dinh Độc Lập",
        text: "Đúng 11 giờ 30 phút trưa ngày 30/4/1975, lá cờ cách mạng tung bay trên nóc Dinh Độc Lập, đánh dấu thời khắc lịch sử kết thúc 21 năm kháng chiến chống Mỹ và 30 năm chiến tranh giải phóng.",
      },
    },
  ],
  sources: [
    { title: "Sách giáo khoa Lịch sử 12 (Kết nối tri thức với cuộc sống)", note: "Bài 8. Cuộc kháng chiến chống Mỹ, cứu nước (1954 – 1975)" },
    { title: "Đại tướng Văn Tiến Dũng — Hồi ký \"Đại thắng mùa Xuân\"", note: "NXB Quân đội nhân dân, 1976" },
    { title: "Bảo tàng Chiến dịch Hồ Chí Minh (TP. Hồ Chí Minh)", note: "sơ đồ tác chiến và sa bàn năm cánh quân tiến vào Sài Gòn" },
    { title: "OpenStreetMap", note: "tọa độ địa lý lịch sử các mục tiêu then chốt và địa danh" },
  ],
  disclaimer:
    "Bản đồ minh họa: vị trí các cánh quân và mũi tên chỉ thể hiện HƯỚNG tiến công (Tây Bắc, Bắc, Đông, Đông Nam, Tây Nam), không phải đường hành quân thật; vùng bao vây vẽ phác. Tọa độ các mục tiêu là gần đúng.",
};
