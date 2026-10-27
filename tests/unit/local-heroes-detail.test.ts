import { describe, expect, it, vi, beforeEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("server-only", () => ({}));
const mockProfile = vi.hoisted(() => vi.fn());
vi.mock("@/lib/queries/local-heroes", () => ({ getLocalHeroProfile: mockProfile }));
vi.mock("next/image", () => ({ default: (props: Record<string, unknown>) => createElement("img", props) }));

import { loadFigureDetail, type FigureDetail } from "@/lib/queries/figures";
import { FigureDetailView } from "@/components/content/detail/FigureDetailView";
import { StorySections } from "@/components/local-heroes/StorySections";
import { getLocalHeroReturnHref } from "@/lib/local-heroes/state";
import type { LocalHeroProfile, SourceCitation, PublicClaim } from "@/lib/local-heroes/types";

const mockSource: SourceCitation = {
  sourceId: "source-1",
  title: "Đại Nam thực lục",
  authorOrg: "Quốc sử quán triều Nguyễn",
  publisher: "NXB Giáo Dục",
  sourceType: "book",
  url: "https://example.invalid/dainam",
  citation: "Tập 1, tr. 100",
  publishedYear: 1962,
  accessedAt: "2026-10-26",
  locator: "Tập 1, tr. 100",
  scopeNote: "Ghi chép chính sử",
};

const mockSource2: SourceCitation = {
  sourceId: "source-2",
  title: "Lịch sử Đảng bộ Hà Nội",
  authorOrg: "Thành ủy Hà Nội",
  publisher: "NXB Hà Nội",
  sourceType: "official",
  url: null,
  citation: "Tr. 45–48",
  publishedYear: 2010,
  accessedAt: "2026-10-26",
  locator: "Tr. 45–48",
  scopeNote: "Tài liệu lưu trữ Thành ủy",
};

const mockClaim: PublicClaim = {
  key: "activity:ha-noi",
  text: "Hoạt động cách mạng tại nội thành Hà Nội",
  certainty: "verified",
  uncertaintyNote: null,
  sources: [mockSource],
};

const mockStoryClaim: PublicClaim = {
  key: "story-cl-1",
  text: "Lãnh đạo phong trào công nhân",
  certainty: "verified",
  uncertaintyNote: null,
  sources: [mockSource2],
};

const sampleProfile: LocalHeroProfile = {
  id: "hero-1",
  slug: "nguyen-van-a",
  name: "Nguyễn Văn A",
  aliases: ["Anh Ba", "Bí danh X"],
  birthYear: 1890,
  deathYear: 1945,
  birthYearCertainty: "verified",
  deathYearCertainty: "verified",
  contributionSummary: "Lãnh đạo phong trào yêu nước và cách mạng giải phóng dân tộc.",
  biography: "Tiểu sử chi tiết của đồng chí Nguyễn Văn A qua các thời kỳ.",
  image: {
    id: "img-1",
    url: "https://example.invalid/hero-a.jpg",
    width: 600,
    height: 800,
    altText: "Chân dung Nguyễn Văn A",
    caption: "Nguyễn Văn A tại chiến khu",
    depictionKind: "portrait",
    era: "historical",
    labels: ["Tư liệu lịch sử"],
    photographer: "Lưu trữ Quốc gia",
    sourcePageUrl: "https://example.invalid/archive/hero-a",
    license: "Phạm vi công cộng",
    licenseUrl: null,
    usageBasis: "coursework_reference",
    usageNote: "Tài liệu học tập lịch sử lớp 12",
    focalPoint: "50% 25%",
  },
  associations: [
    {
      id: "assoc-1",
      locality: { code: "01", slug: "ha-noi", officialName: "Thành phố Hà Nội", referenceFramework: "VN-34-2025" },
      kind: "activity",
      historicalPlaceLabel: "Khu Ba Đình, Hà Nội",
      explanation: "Địa bàn hoạt động bí mật trong giai đoạn 1930–1945.",
      qualifiesForCoverage: true,
      claim: mockClaim,
    },
    {
      id: "assoc-2",
      locality: { code: "04", slug: "cao-bang", officialName: "Tỉnh Cao Bằng", referenceFramework: "VN-34-2025" },
      kind: "commemoration",
      historicalPlaceLabel: "Khu tưởng niệm Cao Bằng",
      explanation: "Công trình tưởng niệm được xây dựng năm 1980.",
      qualifiesForCoverage: false,
      claim: {
        key: "commemoration:cao-bang",
        text: "Kỷ niệm và vinh danh sau năm 1975",
        certainty: "verified",
        uncertaintyNote: "Công trình vinh danh, không phải địa bàn hoạt động trực tiếp",
        sources: [mockSource2],
      },
    },
  ],
  stories: [
    {
      id: "story-1",
      slug: "nguyen-van-a-va-phong-trao-ba-dinh",
      title: "Nguyễn Văn A và phong trào Ba Đình",
      summary: "Cuộc đấu tranh kiên cường tại Hà Nội trong những năm tiền khởi nghĩa.",
      body: "Đồng chí Nguyễn Văn A trực tiếp chỉ đạo phong trào công nhân tại khu Ba Đình [[cite:story-cl-1]]. Cuộc đấu tranh đã quy tụ hàng ngàn quần chúng nhân dân tham gia biểu tình.",
      isPrimary: true,
      sortOrder: 1,
      claims: [mockStoryClaim],
    },
  ],
  gallery: [
    {
      id: "img-1",
      url: "https://example.invalid/hero-a.jpg",
      width: 600,
      height: 800,
      altText: "Chân dung Nguyễn Văn A",
      caption: "Nguyễn Văn A tại chiến khu",
      depictionKind: "portrait",
      era: "historical",
      labels: ["Tư liệu lịch sử"],
      photographer: "Lưu trữ Quốc gia",
      sourcePageUrl: "https://example.invalid/archive/hero-a",
      license: "Phạm vi công cộng",
      licenseUrl: null,
      usageBasis: "coursework_reference",
      usageNote: "Tài liệu học tập lớp 12",
      focalPoint: "50% 25%",
    },
    {
      id: "img-2",
      url: "https://example.invalid/context-monument.jpg",
      width: 800,
      height: 600,
      altText: "Khu tưởng niệm Ba Đình",
      caption: "Di tích lịch sử Ba Đình (Tư liệu bối cảnh, không phải chân dung)",
      depictionKind: "historical_context",
      era: "historical",
      labels: ["Tư liệu bối cảnh, không phải chân dung"],
      photographer: "Nhiếp ảnh chiến khu",
      sourcePageUrl: "https://example.invalid/archive/monument",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      usageBasis: "open_license",
      usageNote: null,
      focalPoint: null,
    },
  ],
  events: [
    {
      slug: "khoi-nghia-ha-noi-1945",
      title: "Khởi nghĩa giành chính quyền tại Hà Nội",
      dateText: "19/08/1945",
      startYear: 1945,
      relationship: "Chỉ đạo phong trào",
    },
  ],
  claims: [
    {
      key: "contribution",
      text: "Lãnh đạo phong trào yêu nước và cách mạng",
      certainty: "verified",
      uncertaintyNote: null,
      sources: [mockSource],
    },
  ],
};

function createMockDb(
  figureRow: Record<string, unknown>,
  figureLocalities: Record<string, unknown>[] = [],
  figureStories: Record<string, unknown>[] = []
) {
  const q = {
    select: () => q,
    eq: () => q,
    order: () => q,
    maybeSingle: async () => ({ data: figureRow, error: null }),
    then: (resolve: (value: unknown) => unknown) =>
      Promise.resolve({ data: figureLocalities, error: null }).then(resolve),
  };
  return {
    from: vi.fn((table: string) => {
      if (table === "figure_localities") {
        const loc = {
          select: () => loc,
          eq: () => loc,
          order: () => loc,
          then: (resolve: (value: unknown) => unknown) =>
            Promise.resolve({ data: figureLocalities, error: null }).then(resolve),
        };
        return loc;
      }
      if (table === "figure_stories") {
        const stories = {
          select: () => stories,
          eq: () => stories,
          order: () => stories,
          then: (resolve: (value: unknown) => unknown) =>
            Promise.resolve({ data: figureStories, error: null }).then(resolve),
        };
        return stories;
      }
      return q;
    }),
  };
}

describe("Local Heroes Detail Query and Boundary", () => {
  beforeEach(() => {
    mockProfile.mockReset();
  });

  it("public catalog reader returns full profile with eligible stories and sources while excluding draft stories", async () => {
    mockProfile.mockResolvedValue(sampleProfile);
    const db = createMockDb({
      id: "hero-1",
      slug: "nguyen-van-a",
      name: "Nguyễn Văn A",
      workflow_status: "published",
      is_local_hero: true,
      portrait_url: null,
      media_assets: [],
      event_figures: [
        {
          relationship: "Chỉ đạo phong trào",
          historical_events: {
            slug: "khoi-nghia-ha-noi-1945",
            title: "Khởi nghĩa giành chính quyền tại Hà Nội",
            summary: "Mô tả sự kiện",
            date_text: "19/08/1945",
            date_precision: "day",
            is_featured: true,
            start_year: 1945,
            workflow_status: "published",
            curriculum_topics: { name: "Cách mạng tháng Tám", slug: "cach-mang-thang-tam" },
            media_assets: [],
          },
        },
      ],
    });

    const detail = await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { slug: "nguyen-van-a" }, true);
    expect(detail).not.toBeNull();
    expect(detail?.name).toBe("Nguyễn Văn A");
    expect(detail?.isLocalHero).toBe(true);
    expect(detail?.stories).toHaveLength(1);
    expect(detail?.stories?.[0].title).toBe("Nguyễn Văn A và phong trào Ba Đình");
    expect(detail?.stories?.[0].claims).toBeDefined();
    expect(detail?.localities).toHaveLength(2);
    expect(detail?.sources).toBeDefined();
    expect(detail?.sources?.length).toBeGreaterThanOrEqual(2);
  });

  it("reviewer preview includes draft and pending stories through staff query boundary", async () => {
    const draftStory = {
      id: "story-draft",
      slug: "chuyen-chua-cong-bo",
      title: "Chuyện chưa công bố",
      summary: "Bản thảo nghiên cứu",
      body: "Nội dung bản thảo",
      is_primary: false,
      sort_order: 2,
      workflow_status: "draft",
    };
    const db = createMockDb(
      {
        id: "hero-1",
        slug: "nguyen-van-a",
        name: "Nguyễn Văn A",
        workflow_status: "draft",
        is_local_hero: true,
        portrait_url: null,
        media_assets: [],
        event_figures: [],
        review_note: "Ghi chú kiểm duyệt nội bộ cần sửa",
      },
      [{ locality_code: "01", relationship_kind: "activity", historical_place_label: "Hà Nội", explanation: "Mô tả", certainty: "verified" }],
      [draftStory]
    );

    const detail = await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { id: "hero-1" }, false);
    expect(detail).not.toBeNull();
    expect(detail?.stories).toHaveLength(1);
    expect(detail?.stories?.[0].title).toBe("Chuyện chưa công bố");
    expect(detail?.stories?.[0].workflowStatus).toBe("draft");
    expect(mockProfile).not.toHaveBeenCalled();
  });

  it("legacy noncatalog figure preserves biography, portraitUrl fallback and related events without local-heroes fields", async () => {
    const db = createMockDb({
      id: "legacy-1",
      slug: "phan-boi-chau",
      name: "Phan Bội Châu",
      workflow_status: "published",
      is_local_hero: false,
      portrait_url: "https://example.invalid/legacy-portrait.jpg",
      biography: "Chí sĩ yêu nước đầu thế kỷ XX.",
      media_assets: [],
      event_figures: [],
    });

    const detail = await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { slug: "phan-boi-chau" }, true);
    expect(detail).not.toBeNull();
    expect(detail?.isLocalHero).toBe(false);
    expect(detail?.portraitUrl).toBe("https://example.invalid/legacy-portrait.jpg");
    expect(detail?.biography).toBe("Chí sĩ yêu nước đầu thế kỷ XX.");
    expect(mockProfile).not.toHaveBeenCalled();
  });
});

describe("Local Heroes Detail Presentation", () => {
  it("renders logical heading hierarchy from h1 to h2 sections and story h3", () => {
    const figure: FigureDetail = {
      id: "hero-1",
      status: "published",
      slug: "nguyen-van-a",
      name: "Nguyễn Văn A",
      otherNames: "Anh Ba",
      birthYear: 1890,
      deathYear: 1945,
      birthYearCertainty: "verified",
      deathYearCertainty: "verified",
      biography: "Tiểu sử chi tiết.",
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: "Lãnh đạo phong trào yêu nước.",
      contributionStartYear: 1930,
      contributionEndYear: 1945,
      catalogAliases: ["Anh Ba"],
      media: [
        {
          id: "img-1",
          url: "https://example.invalid/hero-a.jpg",
          type: "image",
          caption: "Nguyễn Văn A tại chiến khu",
          altText: "Chân dung Nguyễn Văn A",
          sourceTitle: null,
          labels: ["Tư liệu lịch sử"],
          era: "historical",
          photographer: "Lưu trữ Quốc gia",
          license: "Phạm vi công cộng",
          licenseUrl: null,
          sourcePageUrl: "https://example.invalid/archive/hero-a",
          isCover: true,
          focalPoint: "50% 25%",
          pairId: null,
          width: 600,
          height: 800,
        },
      ],
      events: [
        {
          slug: "khoi-nghia-ha-noi-1945",
          title: "Khởi nghĩa Hà Nội",
          summary: "Tóm tắt sự kiện",
          dateText: "1945",
          datePrecision: "year",
          isFeatured: false,
          topicName: "Cách mạng",
          topicSlug: "cach-mang",
          topicSlugs: ["cach-mang"],
          secondaryTopics: [],
          year: 1945,
          startYear: 1945,
          relationship: "Chỉ đạo phong trào",
        },
      ],
      localities: [
        {
          localityCode: "01",
          kind: "activity",
          historicalPlaceLabel: "Ba Đình, Hà Nội",
          explanation: "Hoạt động bí mật",
          certainty: "verified",
          sources: [mockSource],
        },
      ],
      stories: [
        {
          id: "story-1",
          slug: "chuyen-ba-dinh",
          title: "Phong trào Ba Đình",
          summary: "Tóm tắt câu chuyện",
          body: "Đồng chí Nguyễn Văn A lãnh đạo phong trào [[cite:story-cl-1]].",
          isPrimary: true,
          sortOrder: 1,
          workflowStatus: "published",
          claims: [mockStoryClaim],
        },
      ],
      sources: [
        {
          id: "source-1",
          title: "Đại Nam thực lục",
          citation: "Tập 1, tr. 100",
          url: "https://example.invalid/dainam",
          sourceType: "book",
        },
        {
          id: "source-2",
          title: "Lịch sử Đảng bộ Hà Nội",
          citation: "Tr. 45–48",
          url: null,
          sourceType: "official",
        },
      ],
    };

    const html = renderToStaticMarkup(createElement(FigureDetailView, { figure, explorerReturnHref: "/?noi-dung=nhan-vat&dia-phuong=ha-noi" }));

    // Heading 1 for person name
    expect(html).toContain("<h1");
    expect(html).toContain("Nguyễn Văn A</h1>");

    // Sections with Heading 2
    expect(html).toContain("Đóng góp tiêu biểu");
    expect(html).toContain("Gắn với địa phương");
    expect(html).toContain("Câu chuyện lịch sử");
    expect(html).toContain("Tiểu sử");
    expect(html).toContain("Sự kiện liên quan");
    expect(html).toContain("Nguồn tham khảo");

    // Story Heading 3
    expect(html).toContain("<h3");
    expect(html).toContain("Phong trào Ba Đình</h3>");
  });

  it("parses story citation markers [[cite:key]] into accessible references linked to bibliography", () => {
    const stories = [
      {
        id: "story-1",
        slug: "chuyen-ba-dinh",
        title: "Phong trào Ba Đình",
        summary: "Tóm tắt câu chuyện",
        body: "Đồng chí Nguyễn Văn A lãnh đạo phong trào [[cite:story-cl-1]] tại Hà Nội.",
        isPrimary: true,
        sortOrder: 1,
        workflowStatus: "published",
        claims: [mockStoryClaim],
      },
    ];

    const allSources = [
      { id: "source-1", title: "Đại Nam thực lục", citation: "Tập 1, tr. 100", sourceType: "book" as const },
      { id: "source-2", title: "Lịch sử Đảng bộ Hà Nội", citation: "Tr. 45–48", sourceType: "official" as const },
    ];

    const html = renderToStaticMarkup(createElement(StorySections, { stories, sources: allSources }));
    expect(html).toContain("Phong trào Ba Đình");
    expect(html).toContain("Truyện chính");
    expect(html).toContain('href="#nguon-source-2"');
    expect(html).toContain("[2]");
  });

  it("renders uncertain life dates with clear distinctions instead of asserting exact dates", () => {
    const figureApprox: FigureDetail = {
      status: "published",
      slug: "approx-hero",
      name: "Nhân vật ước tính",
      otherNames: null,
      birthYear: 1892,
      deathYear: 1950,
      birthYearCertainty: "approximate",
      deathYearCertainty: "approximate",
      biography: null,
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: "Đóng góp",
      media: [],
      events: [],
    };

    const htmlApprox = renderToStaticMarkup(createElement(FigureDetailView, { figure: figureApprox }));
    expect(htmlApprox).toContain("khoảng 1892");
    expect(htmlApprox).toContain("khoảng 1950");

    const figureDisputed: FigureDetail = {
      status: "published",
      slug: "disputed-hero",
      name: "Nhân vật tranh luận",
      otherNames: null,
      birthYear: 1885,
      deathYear: 1940,
      birthYearCertainty: "disputed",
      deathYearCertainty: "verified",
      biography: null,
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: "Đóng góp",
      media: [],
      events: [],
    };

    const htmlDisputed = renderToStaticMarkup(createElement(FigureDetailView, { figure: figureDisputed }));
    expect(htmlDisputed).toContain("Năm sinh chưa thống nhất");
    expect(htmlDisputed).not.toContain("1885 – 1940");
  });

  it("distinguishes qualifying locality relationships from commemoration", () => {
    const figure: FigureDetail = {
      status: "published",
      slug: "test-hero",
      name: "Nhân vật test",
      otherNames: null,
      birthYear: 1900,
      deathYear: 1960,
      birthYearCertainty: "verified",
      deathYearCertainty: "verified",
      biography: null,
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: "Đóng góp",
      media: [],
      events: [],
      localities: [
        {
          localityCode: "01",
          kind: "birthplace",
          historicalPlaceLabel: "Phủ Hoài Đức, tỉnh Hà Đông",
          explanation: "Nơi sinh theo gia phả và sắc lệnh",
          certainty: "verified",
          qualifiesForCoverage: true,
        },
        {
          localityCode: "04",
          kind: "commemoration",
          historicalPlaceLabel: "Khu tưởng niệm Cao Bằng",
          explanation: "Công trình dựng năm 1980",
          certainty: "verified",
          qualifiesForCoverage: false,
        },
      ],
    };

    const html = renderToStaticMarkup(createElement(FigureDetailView, { figure }));
    expect(html).toContain("Nơi sinh");
    expect(html).toContain("Phủ Hoài Đức, tỉnh Hà Đông");
    expect(html).toContain("Tưởng niệm");
    expect(html).toContain("Quan hệ tưởng niệm / bổ sung");
  });

  it("honors honest image labels for historical context and shows media credits", () => {
    const figure: FigureDetail = {
      status: "published",
      slug: "context-hero",
      name: "Nhân vật tư liệu bối cảnh",
      otherNames: null,
      birthYear: 1900,
      deathYear: 1960,
      birthYearCertainty: "verified",
      deathYearCertainty: "verified",
      biography: null,
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: "Đóng góp",
      media: [
        {
          id: "ctx-1",
          url: "https://example.invalid/context.jpg",
          type: "image",
          caption: "Di tích lịch sử nơi họp chi bộ",
          altText: "Di tích lịch sử",
          sourceTitle: null,
          labels: ["Tư liệu bối cảnh, không phải chân dung"],
          era: "historical",
          photographer: "Bảo tàng Lịch sử",
          license: "Public domain",
          licenseUrl: null,
          sourcePageUrl: "https://example.invalid/source-page",
          isCover: true,
          focalPoint: null,
          pairId: null,
          width: 800,
          height: 600,
        },
      ],
      events: [],
    };

    const html = renderToStaticMarkup(createElement(FigureDetailView, { figure }));
    expect(html).toContain("Tư liệu bối cảnh, không phải chân dung");
    expect(html).toContain("Ảnh: Bảo tàng Lịch sử");
    expect(html).toContain("Public domain");
    expect(html).toContain("Trang gốc");
  });

  it("integrates safe return URL preserving people filters, search, and page", () => {
    const validHomeHref = "/?noi-dung=nhan-vat&dia-phuong=ha-noi&q-nhan-vat=Dang&trang-nhan-vat=2";
    const returnHref = getLocalHeroReturnHref(validHomeHref);
    expect(returnHref).toBe(validHomeHref);

    // Malicious return targets must safely normalize to default people home
    expect(getLocalHeroReturnHref("https://malicious.invalid/evil")).toBe("/?noi-dung=nhan-vat");
    expect(getLocalHeroReturnHref("//malicious.invalid/evil")).toBe("/?noi-dung=nhan-vat");
    expect(getLocalHeroReturnHref("/admin/dashboard")).toBe("/?noi-dung=nhan-vat");
  });
});
