import { describe, expect, it } from "vitest";
import { buildLocalityOverview, compareHeritageSites } from "@/lib/locality/overview";
import { HERITAGE_CATALOG_FAILURE, type HeritageLoadState, type HeritageSiteSummary } from "@/lib/heritage/types";
import type { LocalHeroLoadState, LocalHeroSummary } from "@/lib/local-heroes/types";

function mockHeritageSite(overrides: Partial<HeritageSiteSummary>): HeritageSiteSummary {
  return {
    id: "site-1",
    slug: "site-slug",
    name: "Site Name",
    historicalName: null,
    locality: { code: "01", slug: "ha-noi", officialName: "Hà Nội", referenceFramework: "VN-34-2025" },
    tier: "grade12",
    rank: 1,
    period: "1945",
    teaser: "Teaser text",
    latitude: 21.0,
    longitude: 105.8,
    accuracyLevel: "exact",
    accuracyNote: null,
    lessonSlug: null,
    cover: null,
    videos: [],
    ...overrides,
  };
}

function mockPerson(overrides: Partial<LocalHeroSummary>): LocalHeroSummary {
  return {
    id: "person-1",
    slug: "person-slug",
    name: "Person Name",
    aliases: [],
    birthYear: 1900,
    deathYear: 1980,
    birthYearCertainty: "verified",
    deathYearCertainty: "verified",
    contributionSummary: "Summary",
    image: {
      id: "img-1",
      url: "https://example.com/img.jpg",
      width: 120,
      height: 80,
      altText: "Alt text",
      caption: "Caption",
      depictionKind: "portrait",
      era: "historical",
      labels: [],
      photographer: null,
      sourcePageUrl: "https://example.com",
      license: null,
      licenseUrl: null,
      usageBasis: "public_domain",
      usageNote: null,
      focalPoint: null,
    },
    associations: [
      {
        id: "assoc-1",
        locality: { code: "01", slug: "ha-noi", officialName: "Hà Nội", referenceFramework: "VN-34-2025" },
        kind: "birthplace",
        historicalPlaceLabel: "Hà Nội",
        explanation: "Sinh ra tại Hà Nội",
        claim: { key: "locality:01:birthplace", text: "Sinh", certainty: "verified", uncertaintyNote: null, sources: [] },
        qualifiesForCoverage: true,
      },
    ],
    ...overrides,
  };
}

describe("buildLocalityOverview pure derivation (Task 3)", () => {
  it("sorts places deterministically by tier (grade12 first), rank, and slug", () => {
    const p1 = mockHeritageSite({ slug: "c-site", tier: "extended", rank: 1 });
    const p2 = mockHeritageSite({ slug: "a-site", tier: "grade12", rank: 2 });
    const p3 = mockHeritageSite({ slug: "b-site", tier: "grade12", rank: 1 });
    const p4 = mockHeritageSite({ slug: "d-site", tier: "grade12", rank: 1 });

    const sorted = [p1, p2, p3, p4].sort(compareHeritageSites);
    expect(sorted.map((s) => s.slug)).toEqual(["b-site", "d-site", "a-site", "c-site"]);
  });

  it("limits places to at most 2 items and preserves total count", () => {
    const s1 = mockHeritageSite({ id: "1", slug: "site-1", rank: 1 });
    const s2 = mockHeritageSite({ id: "2", slug: "site-2", rank: 2 });
    const s3 = mockHeritageSite({ id: "3", slug: "site-3", rank: 3 });

    const heritageState: HeritageLoadState = {
      status: "ready",
      data: {
        items: [s1, s2, s3],
        coverage: { totalLocalities: 34, representedLocalities: 1 },
      },
    };
    const peopleState: LocalHeroLoadState = {
      status: "loading",
      filters: { localityCode: "01", query: "", page: 1 },
    };

    const overview = buildLocalityOverview("01", heritageState, peopleState);
    expect(overview.places.status).toBe("ready");
    if (overview.places.status === "ready") {
      expect(overview.places.total).toBe(3);
      expect(overview.places.items).toHaveLength(2);
      expect(overview.places.items[0].slug).toBe("site-1");
      expect(overview.places.items[1].slug).toBe("site-2");
    }
  });

  it("limits people to at most 2 items and preserves totalPeople from response", () => {
    const p1 = mockPerson({ id: "p1", slug: "person-1" });
    const p2 = mockPerson({ id: "p2", slug: "person-2" });
    const p3 = mockPerson({ id: "p3", slug: "person-3" });

    const heritageState: HeritageLoadState = { status: "loading" };
    const peopleState: LocalHeroLoadState = {
      status: "ready",
      data: {
        items: [p1, p2, p3],
        pageSize: 12,
        totalPages: 2,
        totalPeople: 15,
        filters: { localityCode: "01", query: "", page: 1 },
        coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 1, byLocality: [] },
      },
    };

    const overview = buildLocalityOverview("01", heritageState, peopleState);
    expect(overview.people.status).toBe("ready");
    if (overview.people.status === "ready") {
      expect(overview.people.total).toBe(15);
      expect(overview.people.items).toHaveLength(2);
      expect(overview.people.items.map((p) => p.slug)).toEqual(["person-1", "person-2"]);
    }
  });

  it("guards against stale people data when localityCode does not match", () => {
    const p1 = mockPerson({ id: "p1", slug: "person-hanoi" });
    const peopleState: LocalHeroLoadState = {
      status: "ready",
      data: {
        items: [p1],
        pageSize: 12,
        totalPages: 1,
        totalPeople: 1,
        filters: { localityCode: "01", query: "", page: 1 },
        coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 1, byLocality: [] },
      },
    };

    // Requested locality is "44" (Quảng Trị), but peopleState has "01" (Hà Nội)
    const overview = buildLocalityOverview("44", { status: "loading" }, peopleState);
    expect(overview.people.status).toBe("loading");
  });

  it("supports one-sided failure without erasing successful section", () => {
    const s1 = mockHeritageSite({ id: "1", slug: "site-1" });
    const heritageState: HeritageLoadState = {
      status: "ready",
      data: { items: [s1], coverage: { totalLocalities: 34, representedLocalities: 1 } },
    };
    const peopleState: LocalHeroLoadState = {
      status: "error",
      filters: { localityCode: "01", query: "", page: 1 },
      error: { code: "DATA_UNAVAILABLE", message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.", retryable: true },
    };

    const overview = buildLocalityOverview("01", heritageState, peopleState);
    expect(overview.places.status).toBe("ready");
    expect(overview.people.status).toBe("error");

    // Reverse: people ready, heritage error
    const p1 = mockPerson({ id: "p1", slug: "person-1" });
    const reverseOverview = buildLocalityOverview(
      "01",
      { status: "error", error: HERITAGE_CATALOG_FAILURE },
      {
        status: "ready",
        data: {
          items: [p1],
          pageSize: 12,
          totalPages: 1,
          totalPeople: 1,
          filters: { localityCode: "01", query: "", page: 1 },
          coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 1, byLocality: [] },
        },
      },
    );
    expect(reverseOverview.places.status).toBe("error");
    expect(reverseOverview.people.status).toBe("ready");
  });

  it("returns ready with zero items for genuine empty results (not an error)", () => {
    const heritageState: HeritageLoadState = {
      status: "ready",
      data: { items: [], coverage: { totalLocalities: 34, representedLocalities: 0 } },
    };
    const peopleState: LocalHeroLoadState = {
      status: "ready",
      data: {
        items: [],
        pageSize: 12,
        totalPages: 0,
        totalPeople: 0,
        filters: { localityCode: "01", query: "", page: 1 },
        coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 0, byLocality: [] },
      },
    };

    const overview = buildLocalityOverview("01", heritageState, peopleState);
    expect(overview.places.status).toBe("ready");
    if (overview.places.status === "ready") {
      expect(overview.places.total).toBe(0);
      expect(overview.places.items).toEqual([]);
    }
    expect(overview.people.status).toBe("ready");
    if (overview.people.status === "ready") {
      expect(overview.people.total).toBe(0);
      expect(overview.people.items).toEqual([]);
    }
  });

  it("returns ready with zero items when localityCode is null (chooser state)", () => {
    const overview = buildLocalityOverview(
      null,
      { status: "loading" },
      { status: "loading", filters: { localityCode: null, query: "", page: 1 } },
    );
    expect(overview.places.status).toBe("ready");
    expect(overview.people.status).toBe("ready");
  });
});
