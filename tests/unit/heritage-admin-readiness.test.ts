import { describe, expect, it } from "vitest";
import { evaluateReadiness, type ReadinessSnapshot } from "@/lib/admin/readiness";

describe("evaluateReadiness for historical locations with heritage tier", () => {
  it("evaluates legacy location without heritage tier normally", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả địa điểm lịch sử",
      publicTexts: ["Hà Nội", "Mô tả địa điểm lịch sử"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toEqual([]);
    expect(result.warnings).toEqual([]);
  });

  it("blocks heritage place when locality is missing", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: null,
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 3,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: true,
        videoCount: 1,
      },
      publicTexts: ["Tên địa điểm"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toContain("Chưa chọn địa phương cho địa danh lịch sử.");
  });

  it("blocks heritage place when teaser is too short or missing", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Quá ngắn",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 3,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: true,
        videoCount: 1,
      },
      publicTexts: ["Tên địa điểm"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toContain("Lời giới thiệu (teaser) phải từ 40 đến 360 ký tự.");
  });

  it("blocks heritage place when sectionsCount < 3 or section has no source", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 2,
        sectionsWithNoSources: 1,
        hasCoverWithUsageBasis: true,
        videoCount: 1,
      },
      publicTexts: ["Tên địa điểm"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toContain("Địa danh lịch sử cần ít nhất 3 phần câu chuyện.");
    expect(result.blocking).toContain("Mỗi phần câu chuyện cần ít nhất 1 nguồn tham khảo.");
  });

  it("blocks heritage place when coordinate is unknown or missing", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "unknown",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "unknown",
        sectionsCount: 3,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: true,
        videoCount: 1,
      },
      publicTexts: ["Tên địa điểm"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toContain("Tọa độ phải được xác định (độ chính xác không được là 'Chưa xác định').");
  });

  it("blocks heritage place without cover image having usage_basis", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 3,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: false,
        videoCount: 1,
      },
      publicTexts: ["Tên địa điểm"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toContain("Cần ít nhất 1 ảnh bìa có thiết lập căn cứ bản quyền/sử dụng.");
  });

  it("warns when no video is attached, but does not block", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 3,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: true,
        videoCount: 0,
      },
      publicTexts: ["Tên địa điểm", "Mô tả"],
      media: { count: 1, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toEqual([]);
    expect(result.warnings).toContain("Chưa có video tư liệu (khuyến khích bổ sung nếu có).");
  });

  it("passes cleanly with zero blocking and zero warnings when fully complete with video", () => {
    const snapshot: ReadinessSnapshot = {
      kind: "dia-diem",
      latitude: 21.0285,
      longitude: 105.8542,
      accuracyLevel: "exact",
      description: "Mô tả đầy đủ",
      heritage: {
        tier: "grade12",
        localityCode: "01",
        teaser: "Một đoạn văn giới thiệu đầy đủ về địa danh lịch sử theo đúng quy định từ 40 đến 360 ký tự.",
        period: "1954",
        latitude: 21.0285,
        longitude: 105.8542,
        accuracyLevel: "exact",
        sectionsCount: 4,
        sectionsWithNoSources: 0,
        hasCoverWithUsageBasis: true,
        videoCount: 2,
      },
      publicTexts: ["Tên địa điểm", "Mô tả đầy đủ", "Bối cảnh"],
      media: { count: 2, missingAlt: 0, missingLicense: 0 },
    };

    const result = evaluateReadiness(snapshot);
    expect(result.blocking).toEqual([]);
    expect(result.warnings).toEqual([]);
  });
});
