/**
 * Dữ liệu lịch sử sa bàn chiến thuật Chiến dịch Điện Biên Phủ (13/03/1954 – 07/05/1954).
 * Căn cứ theo Giáo trình Lịch sử Việt Nam Lớp 12 & Tài liệu Viện Lịch sử Quân sự Việt Nam.
 */

export interface TacticalStronghold {
  id: string;
  name: string;
  frenchName: string;
  sector: "north" | "center" | "south";
  cx: number;
  cy: number;
  historicalRole: string;
}

export interface TacticalAttackVector {
  id: string;
  unitName: string;
  pathD: string;
  targetId: string;
  targetName: string;
  strokeColor: string;
}

export interface TacticalBattlePhase {
  phaseId: "dot-1" | "dot-2" | "dot-3";
  phaseNumber: number;
  title: string;
  dateRangeDisplay: string;
  startDate: string;
  endDate: string;
  logSummary: string;
  vectors: TacticalAttackVector[];
  capturedStrongholds: string[];
  tacticalOutcome: string;
}

export interface TacticalCampaignData {
  campaignId: string;
  title: string;
  dateRangeDisplay: string;
  battlefieldCenter: { x: number; y: number };
  tacticalViewBox: string;
  strongholds: TacticalStronghold[];
  phases: TacticalBattlePhase[];
  sourceCitation: string;
}

export const DIEN_BIEN_PHU_CAMPAIGN: TacticalCampaignData = {
  campaignId: "dien-bien-phu-1954",
  title: "Chiến dịch Điện Biên Phủ",
  dateRangeDisplay: "13/03/1954 – 07/05/1954 (56 ngày đêm)",
  battlefieldCenter: { x: 300, y: 240 },
  tacticalViewBox: "120 70 380 340",
  sourceCitation: "Chiến dịch Điện Biên Phủ (1954) - Lịch sử cuộc kháng chiến chống thực dân Pháp (1945–1954), Viện Lịch sử Quân sự Việt Nam - NXB Quân đội Nhân dân.",
  strongholds: [
    // Phân khu Bắc
    {
      id: "him-lam",
      name: "Cứ điểm Him Lam",
      frenchName: "Béatrice",
      sector: "north",
      cx: 360,
      cy: 130,
      historicalRole: "Cụm cứ điểm kiên cố nhất bảo vệ cửa ngõ phía Đông Bắc thung lũng.",
    },
    {
      id: "doc-lap",
      name: "Cứ điểm Đồi Độc Lập",
      frenchName: "Gabrielle",
      sector: "north",
      cx: 260,
      cy: 110,
      historicalRole: "Cứ điểm án ngữ cửa ngõ phía Bắc, được quân Pháp ví như 'con mắt thần'.",
    },
    {
      id: "ban-keo",
      name: "Cứ điểm Bản Kéo",
      frenchName: "Anne-Marie",
      sector: "north",
      cx: 220,
      cy: 155,
      historicalRole: "Cứ điểm bảo vệ hướng Tây Bắc, do binh lính người Thái đồn trú.",
    },

    // Phân khu Trung tâm
    {
      id: "doi-c1",
      name: "Đồi C1",
      frenchName: "Éliane 1",
      sector: "center",
      cx: 335,
      cy: 215,
      historicalRole: "Điểm cao khống chế sườn Đông phân khu trung tâm Mường Thanh.",
    },
    {
      id: "doi-a1",
      name: "Đồi A1",
      frenchName: "Éliane 2",
      sector: "center",
      cx: 345,
      cy: 250,
      historicalRole: "Điểm cao yết hầu quan trọng bậc nhất, chìa khóa mở vào hầm chỉ huy trung tâm.",
    },
    {
      id: "san-bay",
      name: "Sân bay Mường Thanh",
      frenchName: "Piste d'aviation",
      sector: "center",
      cx: 280,
      cy: 235,
      historicalRole: "Cầu hàng không duy nhất tiếp tế lương thảo, đạn dược và quân tăng viện cho tập đoàn cứ điểm.",
    },
    {
      id: "de-castries",
      name: "Hầm Tướng De Castries",
      frenchName: "PC GONO",
      sector: "center",
      cx: 290,
      cy: 265,
      historicalRole: "Sở chỉ huy đầu não của toàn bộ Tập đoàn cứ điểm Điện Biên Phủ.",
    },

    // Phân khu Nam
    {
      id: "hong-cum",
      name: "Cụm Cứ điểm Hồng Cúm",
      frenchName: "Isabelle",
      sector: "south",
      cx: 310,
      cy: 360,
      historicalRole: "Phân khu Nam với sân bay dự bị và trận địa pháo binh yểm trợ từ xa.",
    },
  ],

  phases: [
    {
      phaseId: "dot-1",
      phaseNumber: 1,
      title: "Đợt 1: Đột phá cửa ngõ phía Bắc",
      dateRangeDisplay: "13/03 – 17/03/1954",
      startDate: "1954-03-13",
      endDate: "1954-03-17",
      logSummary:
        "17h05 ngày 13/3/1954, pháo binh ta nổ súng cấp tập. Đại đoàn 312 tiêu diệt Him Lam; tiếp đó Đại đoàn 308 cùng 312 đánh chiếm đồi Độc Lập và bức hàng Bản Kéo. Cửa ngõ phía Bắc tập đoàn cứ điểm hoàn toàn mở toang.",
      capturedStrongholds: ["him-lam", "doc-lap", "ban-keo"],
      tacticalOutcome: "Tiêu diệt 2 tiểu đoàn tinh nhuệ của Pháp, phá hủy thế phòng ngự từ xa phía Bắc.",
      vectors: [
        {
          id: "vec-312-himlam",
          unitName: "Đại đoàn 312 tiến công Him Lam",
          pathD: "M 420 100 Q 390 115 365 128",
          targetId: "him-lam",
          targetName: "Him Lam",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-308-doclap",
          unitName: "Đại đoàn 308 tiến công Đồi Độc Lập",
          pathD: "M 220 80 Q 240 95 258 108",
          targetId: "doc-lap",
          targetName: "Đồi Độc Lập",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-312-doclap",
          unitName: "Đại đoàn 312 phối hợp diệt Độc Lập",
          pathD: "M 300 80 Q 280 95 262 108",
          targetId: "doc-lap",
          targetName: "Đồi Độc Lập",
          strokeColor: "#ea580c",
        },
      ],
    },
    {
      phaseId: "dot-2",
      phaseNumber: 2,
      title: "Đợt 2: Siết chặt vòng vây & Chiếm các điểm cao phía Đông",
      dateRangeDisplay: "30/03 – 26/04/1954",
      startDate: "1954-03-30",
      endDate: "1954-04-26",
      logSummary:
        "Đại đoàn 316, 312, 308 đồng loạt công kích các ngọn đồi phía Đông (C1, D1, E1, A1). Hệ thống chiến hào vây lấn hàng trăm kilômét áp sát lòng chảo, chia cắt hoàn toàn sân bay Mường Thanh, triệt đường tiếp tế đường không.",
      capturedStrongholds: ["doi-c1", "san-bay"],
      tacticalOutcome: "Khống chế sân bay Mường Thanh, thu hẹp không phận tiếp tế dù, đẩy địch vào khủng hoảng tiếp vận.",
      vectors: [
        {
          id: "vec-316-c1",
          unitName: "Đại đoàn 316 tiến công Đồi C1",
          pathD: "M 390 190 Q 360 205 338 213",
          targetId: "doi-c1",
          targetName: "Đồi C1",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-316-a1-dot2",
          unitName: "Đại đoàn 316 chiến đấu giằng co tại A1",
          pathD: "M 410 240 Q 380 245 350 248",
          targetId: "doi-a1",
          targetName: "Đồi A1",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-308-sanbay",
          unitName: "Đại đoàn 308 siết chặt chiến hào cắt đôi sân bay",
          pathD: "M 200 230 Q 240 232 275 235",
          targetId: "san-bay",
          targetName: "Sân bay Mường Thanh",
          strokeColor: "#ea580c",
        },
      ],
    },
    {
      phaseId: "dot-3",
      phaseNumber: 3,
      title: "Đợt 3: Bộc phá đồi A1 & Tổng công kích toàn mặt trận",
      dateRangeDisplay: "01/05 – 07/05/1954",
      startDate: "1954-05-01",
      endDate: "1954-05-07",
      logSummary:
        "20h30 ngày 06/5/1954, khối bộc phá gần 1 tấn phát nổ làm rung chuyển đồi A1, quân ta dũng mãnh xung phong làm chủ hoàn toàn điểm cao. Chiều 07/5, lệnh tổng công kích phát ra, 5 cánh quân hội tụ vào Sở chỉ huy, bắt sống tướng De Castries và toàn bộ bộ tham mưu.",
      capturedStrongholds: ["doi-a1", "de-castries", "hong-cum"],
      tacticalOutcome: "Toàn bộ Tập đoàn cứ điểm bị tiêu diệt và bắt sống; kết thúc thắng lợi 56 ngày đêm chiến dịch lịch sử.",
      vectors: [
        {
          id: "vec-bocpha-a1",
          unitName: "Đại đoàn 316 bộc phá & làm chủ Đồi A1",
          pathD: "M 380 250 L 348 250",
          targetId: "doi-a1",
          targetName: "Đồi A1",
          strokeColor: "#b91c1c",
        },
        {
          id: "vec-tongcongkich-tay",
          unitName: "Cánh quân phía Tây vượt cầu Mường Thanh",
          pathD: "M 230 265 Q 260 265 285 265",
          targetId: "de-castries",
          targetName: "Hầm De Castries",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-tongcongkich-dong",
          unitName: "Cánh quân phía Đông tràn xuống sở chỉ huy",
          pathD: "M 340 265 Q 315 265 295 265",
          targetId: "de-castries",
          targetName: "Hầm De Castries",
          strokeColor: "#dc2626",
        },
        {
          id: "vec-304-hongcum",
          unitName: "Đại đoàn 304 khống chế phân khu Hồng Cúm",
          pathD: "M 280 380 Q 295 370 308 362",
          targetId: "hong-cum",
          targetName: "Hồng Cúm",
          strokeColor: "#ea580c",
        },
      ],
    },
  ],
};
