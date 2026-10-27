import { describe, expect, it } from "vitest";
import { parsePlaceSelection, groupByLocality } from "@/lib/heritage/state";
import { tierLabel, eraLabel, usageLabel, videoCountLabel } from "@/lib/heritage/format";
import { heritageMarkerEvents } from "@/lib/heritage/markers";
import type { HeritageCover, HeritageSiteSummary } from "@/lib/heritage/types";

describe("Heritage State, Formatters, and Markers (Phase 4)", () => {
  describe("parsePlaceSelection", () => {
    it("parses valid place slugs", () => {
      expect(parsePlaceSelection(new URLSearchParams("dia-danh=thanh-co-quang-tri"))).toBe(
        "thanh-co-quang-tri",
      );
      expect(parsePlaceSelection({ "dia-danh": "nha-tu-hoa-lo" })).toBe("nha-tu-hoa-lo");
      expect(parsePlaceSelection({ "dia-danh": ["doi-a1-dien-bien-phu"] })).toBe(
        "doi-a1-dien-bien-phu",
      );
    });

    it("rejects invalid slugs and returns null", () => {
      expect(parsePlaceSelection(new URLSearchParams("dia-danh=Thanh_Co"))).toBeNull();
      expect(parsePlaceSelection(new URLSearchParams("dia-danh=<script>"))).toBeNull();
      expect(parsePlaceSelection(new URLSearchParams("dia-danh=a".repeat(161)))).toBeNull();
      expect(parsePlaceSelection(null)).toBeNull();
      expect(parsePlaceSelection({})).toBeNull();
    });
  });

  describe("formatters", () => {
    it("formats tier labels correctly", () => {
      expect(tierLabel("grade12")).toBe("Lớp 12");
      expect(tierLabel("extended")).toBe("Mở rộng");
    });

    it("formats era labels correctly", () => {
      expect(eraLabel("today")).toBe("Ảnh ngày nay");
      expect(eraLabel("historical")).toBe("Tư liệu lịch sử");
      expect(eraLabel("illustration")).toBe("Minh họa");
    });

    it("formats usage labels correctly", () => {
      const coverRef: HeritageCover = {
        url: "https://example.com/a.jpg",
        alt: "Alt text",
        focalPoint: null,
        era: "today",
        credit: "Báo Nhân Dân",
        usageBasis: "coursework_reference",
      };
      expect(usageLabel(coverRef)).toBe("Tư liệu học tập — Báo Nhân Dân");

      const coverOpen: HeritageCover = {
        ...coverRef,
        credit: "Wikimedia Commons",
        usageBasis: "open_license",
      };
      expect(usageLabel(coverOpen)).toBe("Giấy phép mở — Wikimedia Commons");
    });

    it("formats video counts correctly", () => {
      expect(videoCountLabel(0)).toBe("");
      expect(videoCountLabel(1)).toBe("1 video");
      expect(videoCountLabel(2)).toBe("2 video");
    });
  });

  describe("groupByLocality and heritageMarkerEvents", () => {
    const mockSites: HeritageSiteSummary[] = [
      {
        id: "site-1",
        slug: "thanh-co-quang-tri",
        name: "Thành cổ Quảng Trị",
        historicalName: null,
        locality: {
          code: "44",
          slug: "quang-tri",
          officialName: "Tỉnh Quảng Trị",
          referenceFramework: "VN-34-2025",
        },
        tier: "grade12",
        rank: 1,
        period: "1972",
        teaser: "Teaser của thành cổ Quảng Trị trên 40 ký tự mô tả cuộc chiến 81 ngày đêm.",
        latitude: 16.75,
        longitude: 107.18,
        accuracyLevel: "exact",
        accuracyNote: null,
        lessonSlug: null,
        cover: null,
        videos: [],
      },
      {
        id: "site-2",
        slug: "dia-dao-vinh-moc",
        name: "Địa đạo Vịnh Mốc",
        historicalName: null,
        locality: {
          code: "44",
          slug: "quang-tri",
          officialName: "Tỉnh Quảng Trị",
          referenceFramework: "VN-34-2025",
        },
        tier: "extended",
        rank: 2,
        period: "1965-1972",
        teaser: "Teaser của địa đạo Vịnh Mốc trên 40 ký tự mô tả làng hầm huyền thoại.",
        latitude: 17.04,
        longitude: 107.11,
        accuracyLevel: "exact",
        accuracyNote: null,
        lessonSlug: null,
        cover: null,
        videos: [],
      },
      {
        id: "site-3",
        slug: "nha-tu-hoa-lo",
        name: "Nhà tù Hỏa Lò",
        historicalName: null,
        locality: {
          code: "01",
          slug: "ha-noi",
          officialName: "Thành phố Hà Nội",
          referenceFramework: "VN-34-2025",
        },
        tier: "grade12",
        rank: 1,
        period: "1896-1954",
        teaser: "Teaser của nhà tù Hỏa Lò trên 40 ký tự mô tả di tích lịch sử đặc biệt.",
        latitude: 21.025,
        longitude: 105.846,
        accuracyLevel: "exact",
        accuracyNote: null,
        lessonSlug: null,
        cover: null,
        videos: [],
      },
    ];

    it("groups places by locality in LOCALITIES order and sorts by rank", () => {
      const groups = groupByLocality(mockSites);
      expect(groups).toHaveLength(2);
      expect(groups[0].locality.code).toBe("01"); // Hà Nội comes before Quảng Trị (44)
      expect(groups[0].places).toHaveLength(1);
      expect(groups[1].locality.code).toBe("44");
      expect(groups[1].places).toHaveLength(2);
      expect(groups[1].places[0].rank).toBe(1);
      expect(groups[1].places[1].rank).toBe(2);
    });

    it("maps sites to ExplorerEvent markers with place: slug prefix", () => {
      const events = heritageMarkerEvents(mockSites);
      expect(events).toHaveLength(3);
      expect(events[0].slug).toBe("place:thanh-co-quang-tri");
      expect(events[0].title).toBe("Thành cổ Quảng Trị");
      expect(events[0].locations).toHaveLength(1);
      expect(events[0].locations[0].latitude).toBe(16.75);
      expect(events[0].locations[0].longitude).toBe(107.18);
      expect(events[0].locations[0].isPrimary).toBe(true);
    });
  });
});
