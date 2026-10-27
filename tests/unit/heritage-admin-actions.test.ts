import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { parseYouTubeId } from "@/lib/heritage/youtube";
import { locationSchema, mediaSchema } from "@/lib/validation/content";

describe("parseYouTubeId", () => {
  it("extracts 11-char ID directly", () => {
    expect(parseYouTubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("  dQw4w9WgXcQ  ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from youtu.be links", () => {
    expect(parseYouTubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("http://youtu.be/dQw4w9WgXcQ?t=10")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts ID from standard youtube.com links", () => {
    expect(parseYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://www.youtube.com/v/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(parseYouTubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid inputs", () => {
    expect(parseYouTubeId("")).toBeNull();
    expect(parseYouTubeId("not-a-youtube-url")).toBeNull();
    expect(parseYouTubeId("https://vimeo.com/123456789")).toBeNull();
    expect(parseYouTubeId("https://youtube.com/watch?v=tooShort")).toBeNull();
  });
});

describe("locationSchema with heritage tier validation", () => {
  it("allows standard legacy location without heritage fields", () => {
    const validLegacy = {
      name: "Cột cờ Hà Nội",
      historical_name: null,
      slug: "cot-co-ha-noi",
      description: "Di tích lịch sử",
      latitude: "21.032",
      longitude: "105.839",
      accuracy_level: "exact",
      accuracy_note: null,
      heritage_tier: "",
      locality_code: "",
      heritage_rank: "",
      heritage_period: "",
      heritage_teaser: "",
      lesson_slug: "",
    };

    const parsed = locationSchema.safeParse(validLegacy);
    expect(parsed.success).toBe(true);
  });

  it("requires locality, rank, period, and teaser when tier is grade12", () => {
    const invalidHeritage = {
      name: "Thành cổ Quảng Trị",
      historical_name: null,
      slug: "thanh-co-quang-tri",
      description: "Di tích",
      latitude: "16.75",
      longitude: "107.19",
      accuracy_level: "exact",
      accuracy_note: null,
      heritage_tier: "grade12",
      locality_code: "",
      heritage_rank: "",
      heritage_period: "",
      heritage_teaser: "Quá ngắn",
      lesson_slug: "",
    };

    const parsed = locationSchema.safeParse(invalidHeritage);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const paths = parsed.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("locality_code");
      expect(paths).toContain("heritage_rank");
      expect(paths).toContain("heritage_period");
      expect(paths).toContain("heritage_teaser");
    }
  });

  it("accepts valid heritage fields when tier is grade12", () => {
    const validHeritage = {
      name: "Thành cổ Quảng Trị",
      historical_name: null,
      slug: "thanh-co-quang-tri",
      description: "Di tích lịch sử quốc gia đặc biệt",
      latitude: "16.75",
      longitude: "107.19",
      accuracy_level: "exact",
      accuracy_note: null,
      heritage_tier: "grade12",
      locality_code: "44",
      heritage_rank: "1",
      heritage_period: "28/6 – 16/9/1972",
      heritage_teaser: "Nơi diễn ra cuộc chiến đấu 81 ngày đêm bảo vệ Thành cổ Quảng Trị mùa hè đỏ lửa năm 1972.",
      lesson_slug: "chien-dich-ho-chi-minh-1975",
    };

    const parsed = locationSchema.safeParse(validHeritage);
    expect(parsed.success).toBe(true);
  });
});

describe("mediaSchema with usage_basis validation", () => {
  const baseMedia = {
    owner_kind: "dia-diem",
    owner_id: "11111111-1111-4111-8111-111111111111",
    file_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Test.jpg",
    alt_text: "Ảnh tư liệu",
    era: "today",
  };

  it("requires license when usage_basis is open_license", () => {
    const invalid = {
      ...baseMedia,
      usage_basis: "open_license",
      license: "",
    };
    const res = mediaSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it("allows coursework_reference with empty license", () => {
    const valid = {
      ...baseMedia,
      usage_basis: "coursework_reference",
      license: "",
      photographer: "Báo Nhân Dân",
      source_page_url: "https://nhandan.vn/bai-viet",
    };
    const res = mediaSchema.safeParse(valid);
    expect(res.success).toBe(true);
  });

  it("rejects coursework_reference when license string is non-empty", () => {
    const invalid = {
      ...baseMedia,
      usage_basis: "coursework_reference",
      license: "CC BY 4.0",
    };
    const res = mediaSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toContain("để trống ô giấy phép");
    }
  });
});
