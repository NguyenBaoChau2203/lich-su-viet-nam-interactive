import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LocalHeroAdminGraph } from "@/lib/local-heroes/admin-types";
import { catalogStoryInputs } from "@/lib/local-heroes/admin-form";
import { evaluateLocalHeroReadiness } from "@/lib/local-heroes/readiness";

// Mocks for server actions
vi.mock("server-only", () => ({}));
const mockRpc = vi.hoisted(() => vi.fn());
const mockStaffState = vi.hoisted(() => vi.fn());
const mockRevalidatePath = vi.hoisted(() => vi.fn());

vi.mock("next/cache", () => ({
  revalidatePath: mockRevalidatePath,
}));

vi.mock("@/lib/auth", () => ({
  getStaffState: mockStaffState,
  requireRole: vi.fn(async (roles: string[]) => {
    const s = await mockStaffState();
    if (s.status !== "active" || !roles.includes(s.staff.role)) {
      throw new Error("FORBIDDEN");
    }
    return s.staff;
  }),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    rpc: mockRpc,
    from: vi.fn(),
  }),
}));

import {
  saveLocalHeroGraph,
  reviewLocalHeroGraph,
  restoreLocalHeroDraft,
} from "@/lib/actions/local-heroes";

function createValidAdminGraph(): {
  graph: Omit<LocalHeroAdminGraph, "readiness">;
  sources: Parameters<typeof evaluateLocalHeroReadiness>[1];
  media: Parameters<typeof evaluateLocalHeroReadiness>[2];
} {
  const figureId = "a0000000-0000-4000-8000-000000000001";
  const source1Id = "b0000000-0000-4000-8000-000000000001";
  const source2Id = "b0000000-0000-4000-8000-000000000002";
  const media1Id = "c0000000-0000-4000-8000-000000000001";

  const sources = [
    {
      id: source1Id,
      title: "Lịch sử phong trào Ba Đình",
      author_org: "Viện Sử học",
      publisher: "NXB Khoa học Xã hội",
      published_year: 1985,
      url: "https://example.com/ba-dinh",
      source_type: "book",
      citation: "Viện Sử học (1985), Lịch sử phong trào Ba Đình.",
      accessed_at: "2026-10-20",
    },
    {
      id: source2Id,
      title: "Hồ sơ di tích quốc gia",
      author_org: "Bộ Văn hóa",
      publisher: "Bộ Văn hóa",
      published_year: 2010,
      url: "https://example.com/di-tich",
      source_type: "document",
      citation: "Bộ Văn hóa (2010), Quyết định xếp hạng di tích.",
      accessed_at: "2026-10-20",
    },
  ];

  const media = [
    {
      id: media1Id,
      figure_id: figureId,
      source_id: source1Id,
      media_type: "image",
      era: "historical",
      file_url: "https://example.com/dinh-cong-trang.jpg",
      caption: "Chân dung Đinh Công Tráng",
      alt_text: "Ảnh chân dung lịch sử Đinh Công Tráng",
      source_page_url: "https://commons.wikimedia.org/wiki/File:DinhCongTrang.jpg",
      photographer: "Tư liệu lưu trữ",
      width: 400,
      height: 500,
      is_reenactment: false,
      is_colorized: false,
      license: "public_domain",
      license_url: "https://creativecommons.org/publicdomain/mark/1.0/",
    },
  ];

  // 370 Vietnamese words body with valid cite marker
  const storyBodyParagraph = "Đinh Công Tráng là một thủ lĩnh kiệt xuất của phong trào Cần Vương cuối thế kỷ 19. ".repeat(25) + "[[cite:ref_ba_dinh]]";

  const graph: Omit<LocalHeroAdminGraph, "readiness"> = {
    figureId,
    revision: "1",
    workflow: "draft",
    reviewNote: null,
    figure: {
      name: "Đinh Công Tráng",
      slug: "dinh-cong-trang",
      otherNames: null,
      birthYear: 1842,
      deathYear: 1887,
      biography: "Thủ lĩnh khởi nghĩa Ba Đình trong phong trào Cần Vương.",
      isLocalHero: true,
      contributionSummary: "Lãnh đạo khởi nghĩa Ba Đình chống thực dân Pháp (1886–1887).",
      contributionStartYear: 1886,
      contributionEndYear: 1887,
      catalogAliases: [],
    },
    sources: [
      {
        claimKey: "identity",
        sourceId: source1Id,
        claimText: "Xác minh nhân thân Đinh Công Tráng.",
        locator: "Tr. 45",
        scopeNote: "Nhân thân",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "contribution",
        sourceId: source1Id,
        claimText: "Xác minh đóng góp lãnh đạo Ba Đình.",
        locator: "Tr. 60-80",
        scopeNote: "Khởi nghĩa Ba Đình",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "period",
        sourceId: source1Id,
        claimText: "Khởi nghĩa diễn ra 1886–1887.",
        locator: "Tr. 65",
        scopeNote: "Thời kỳ hoạt động",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "biography",
        sourceId: source1Id,
        claimText: "Tiểu sử chi tiết.",
        locator: "Tr. 46",
        scopeNote: "Tiểu sử",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "birth_year",
        sourceId: source1Id,
        claimText: "Sinh năm 1842.",
        locator: "Tr. 45",
        scopeNote: "Năm sinh",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "death_year",
        sourceId: source1Id,
        claimText: "Hy sinh năm 1887.",
        locator: "Tr. 120",
        scopeNote: "Năm mất",
        certainty: "verified",
        uncertaintyNote: null,
      },
      {
        claimKey: "locality:38:activity",
        sourceId: source1Id,
        claimText: "Căn cứ Ba Đình thuộc Thanh Hóa.",
        locator: "Tr. 70",
        scopeNote: "Địa bàn",
        certainty: "verified",
        uncertaintyNote: null,
      },
    ],
    localities: [
      {
        id: "d0000000-0000-4000-8000-000000000001",
        localityCode: "38", // Thanh Hóa
        kind: "activity",
        historicalPlaceLabel: "Chiến khu Ba Đình, Nga Sơn, Thanh Hóa",
        explanation: "Chỉ huy căn cứ Ba Đình chống Pháp.",
        claimKey: "locality:38:activity",
        primarySourceId: source1Id,
        certainty: "verified",
        uncertaintyNote: null,
      },
    ],
    stories: [
      {
        id: "e0000000-0000-4000-8000-000000000001",
        slug: "khoi-nghia-ba-dinh",
        title: "Khởi nghĩa Ba Đình rực lửa",
        summary: "Cuộc chiến đấu kiên cường tại căn cứ Ba Đình.",
        body: storyBodyParagraph,
        sortOrder: 0,
        isPrimary: true,
        workflow: "draft",
        reviewNote: null,
        sources: [
          {
            claimKey: "ref_ba_dinh",
            sourceId: source1Id,
            claimText: "Tường thuật trận đánh Ba Đình.",
            locator: "Tr. 85-95",
            scopeNote: "Chiến trận",
            certainty: "verified",
            uncertaintyNote: null,
          },
        ],
      },
    ],
    mediaEvidence: [
      {
        mediaId: media1Id,
        depictionKind: "portrait",
        decision: "accepted",
        identitySourceId: source1Id,
        identityLocator: "Ảnh tư liệu trang phụ bản",
        identityCertainty: "verified",
        usageBasis: "open_license",
        usageSourceId: source1Id,
        usageLocator: "Trang thông tin bản quyền",
        usageNote: null,
        checkedAt: "2026-10-20T10:00:00Z",
      },
    ],
  };

  return { graph, sources, media };
}

describe("Local Heroes Admin Administration and Review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStaffState.mockResolvedValue({
      status: "active",
      staff: { id: "editor-user-id", role: "editor", email: "editor@example.com" },
    });
  });

  describe("Work item 1: Draft authoring and graph commands", () => {
    it("saves valid draft graph through atomic action and revalidates paths", async () => {
      const { graph } = createValidAdminGraph();
      mockRpc.mockResolvedValue({
        data: {
          ok: true,
          data: {
            figureId: graph.figureId,
            slug: graph.figure.slug,
            revision: "2",
            workflow: "draft",
            readiness: { blocking: [], warnings: [] },
          },
        },
        error: null,
      });

      const input = {
        figureId: graph.figureId,
        expectedRevision: graph.revision,
        figure: graph.figure,
        sources: graph.sources,
        localities: graph.localities,
        stories: graph.stories.map((s) => ({
          id: s.id,
          slug: s.slug,
          title: s.title,
          summary: s.summary,
          body: s.body,
          sortOrder: s.sortOrder,
          isPrimary: s.isPrimary,
          sources: s.sources,
        })),
        mediaEvidence: graph.mediaEvidence,
      };

      const result = await saveLocalHeroGraph(input);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.revision).toBe("2");
        expect(result.data.workflow).toBe("draft");
      }
      expect(mockRpc).toHaveBeenCalledWith("local_hero_save_graph", { p_command: expect.any(Object) });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/");
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/nhan-vat/${graph.figure.slug}`);
    });

    it("rejects malformed locality claims without calling the database", async () => {
      const { graph } = createValidAdminGraph();
      // Invalid claimKey that doesn't match locality:code:kind
      const badGraph = {
        figureId: graph.figureId,
        expectedRevision: graph.revision,
        figure: graph.figure,
        sources: graph.sources,
        localities: [
          {
            ...graph.localities[0],
            claimKey: "locality:mismatched_key",
          },
        ],
        stories: catalogStoryInputs(graph.stories),
        mediaEvidence: graph.mediaEvidence,
      };

      const result = await saveLocalHeroGraph(badGraph);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_INPUT");
      }
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("detects and rejects duplicate child IDs in the input graph", async () => {
      const { graph } = createValidAdminGraph();
      const duplicateId = graph.localities[0].id;
      const badGraph = {
        figureId: graph.figureId,
        expectedRevision: graph.revision,
        figure: graph.figure,
        sources: graph.sources,
        localities: graph.localities,
        stories: [
          {
            ...graph.stories[0],
            id: duplicateId, // Duplicated ID from locality
          },
        ],
        mediaEvidence: graph.mediaEvidence,
      };

      const result = await saveLocalHeroGraph(badGraph);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_INPUT");
      }
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("detects stale workflow changes when revision CAS fails", async () => {
      mockRpc.mockResolvedValue({
        data: null,
        error: { code: "40001", message: "serialization_failure" },
      });

      const { graph } = createValidAdminGraph();
      const input = {
        figureId: graph.figureId,
        expectedRevision: "1",
        figure: graph.figure,
        sources: graph.sources,
        localities: graph.localities,
        stories: catalogStoryInputs(graph.stories),
        mediaEvidence: graph.mediaEvidence,
      };

      const result = await saveLocalHeroGraph(input);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("STALE");
        expect(result.error.message).toContain("Hồ sơ đã thay đổi");
      }
      expect(mockRpc).toHaveBeenCalledExactlyOnceWith("local_hero_save_graph", { p_command: input });
    });

    it("rejects unauthorized actors (learner role) from mutating the catalog", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "learner-id", role: "learner", email: "student@example.com" },
      });

      const { graph } = createValidAdminGraph();
      const result = await saveLocalHeroGraph({
        figureId: graph.figureId,
        expectedRevision: "1",
        figure: graph.figure,
        sources: graph.sources,
        localities: graph.localities,
        stories: graph.stories,
        mediaEvidence: graph.mediaEvidence,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("rejects anonymous or locked staff actors from mutating drafts", async () => {
      mockStaffState.mockResolvedValue({
        status: "anonymous",
      });

      const { graph } = createValidAdminGraph();
      const result = await saveLocalHeroGraph({
        figureId: graph.figureId,
        expectedRevision: "1",
        figure: graph.figure,
        sources: graph.sources,
        localities: graph.localities,
        stories: graph.stories,
        mediaEvidence: graph.mediaEvidence,
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("UNAUTHENTICATED");
      }
    });
  });

  describe("Work item 2: Readiness evaluation and workflow transitions", () => {
    it("evaluates a complete graph as ready with 0 blocking issues", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const readiness = evaluateLocalHeroReadiness(graph, sources, media);
      expect(readiness.blocking).toHaveLength(0);
    });

    it("flags missing identity, contribution and period sources", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const strippedGraph = {
        ...graph,
        sources: graph.sources.filter(
          (s) => !["identity", "contribution", "period"].includes(s.claimKey),
        ),
      };

      const readiness = evaluateLocalHeroReadiness(strippedGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("IDENTITY_SOURCE_REQUIRED");
      expect(codes).toContain("CONTRIBUTION_SOURCE_REQUIRED");
      expect(codes).toContain("PERIOD_SOURCE_REQUIRED");
    });

    it("flags contribution period that does not intersect 1858–1975", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const outOfScopeGraph = {
        ...graph,
        figure: {
          ...graph.figure,
          contributionStartYear: 1780,
          contributionEndYear: 1802,
        },
      };

      const readiness = evaluateLocalHeroReadiness(outOfScopeGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("PERIOD_OUT_OF_SCOPE");
    });

    it("flags primary story with word count below 350 or above 700", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const shortStoryGraph = {
        ...graph,
        stories: [
          {
            ...graph.stories[0],
            body: "Đoạn văn quá ngắn chỉ có vài từ. [[cite:ref_ba_dinh]]",
          },
        ],
      };

      const readiness = evaluateLocalHeroReadiness(shortStoryGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("STORY_LENGTH");
    });

    it("flags invalid citation markers and internal notes in stories", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const invalidCiteGraph = {
        ...graph,
        stories: [
          {
            ...graph.stories[0],
            body: graph.stories[0].body + " [[cite:non_existent_ref]] TODO kiểm tra thêm",
          },
        ],
      };

      const readiness = evaluateLocalHeroReadiness(invalidCiteGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("CITATION_MARKER_INVALID");
      expect(codes).toContain("INTERNAL_NOTE");
    });

    it("flags missing accepted image or unverified image identity", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const noImageGraph = {
        ...graph,
        mediaEvidence: [
          {
            ...graph.mediaEvidence[0],
            decision: "held" as const,
          },
        ],
      };

      const readiness = evaluateLocalHeroReadiness(noImageGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("IMAGE_REQUIRED");
    });

    it("enforces uncertainty note when certainty is approximate or disputed", () => {
      const { graph, sources, media } = createValidAdminGraph();
      const uncertainGraph = {
        ...graph,
        sources: [
          ...graph.sources,
          {
            claimKey: "approx_claim",
            sourceId: sources[0].id,
            claimText: "Thông tin gần đúng",
            locator: "Tr. 1",
            scopeNote: "",
            certainty: "approximate" as const,
            uncertaintyNote: null, // Missing note
          },
        ],
      };

      const readiness = evaluateLocalHeroReadiness(uncertainGraph, sources, media);
      const codes = readiness.blocking.map((i) => i.code);
      expect(codes).toContain("UNCERTAINTY_NOTE_REQUIRED");
    });

    it("allows reviewer and admin to execute review transitions", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "reviewer-id", role: "reviewer", email: "reviewer@example.com" },
      });

      mockRpc.mockResolvedValue({
        data: {
          ok: true,
          data: {
            figureId: "a0000000-0000-4000-8000-000000000001",
            slug: "dinh-cong-trang",
            revision: "3",
            workflow: "published",
            readiness: { blocking: [], warnings: [] },
          },
        },
        error: null,
      });

      const result = await reviewLocalHeroGraph({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "2",
        action: "publish",
      });

      expect(result.ok).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith("local_hero_review_graph", { p_command: expect.any(Object) });
    });

    it("rejects editors from directly invoking reviewer promotions", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "editor-id", role: "editor", email: "editor@example.com" },
      });

      const result = await reviewLocalHeroGraph({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "2",
        action: "publish",
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("routes revision requests through permitted transitions with reason", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "reviewer-id", role: "reviewer", email: "reviewer@example.com" },
      });

      mockRpc.mockResolvedValue({
        data: {
          ok: true,
          data: {
            figureId: "a0000000-0000-4000-8000-000000000001",
            slug: "dinh-cong-trang",
            revision: "3",
            workflow: "needs_revision",
            readiness: { blocking: [], warnings: [] },
          },
        },
        error: null,
      });

      const result = await reviewLocalHeroGraph({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "2",
        action: "request_revision",
        reason: "Cần bổ sung nguồn thẩm định cho địa bàn hoạt động.",
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.data.workflow).toBe("needs_revision");
      }
    });

    it("requires reason of at least 5 characters for request_revision", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "reviewer-id", role: "reviewer", email: "reviewer@example.com" },
      });

      const result = await reviewLocalHeroGraph({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "2",
        action: "request_revision",
        reason: "Ngắn", // Less than 5 characters
      });

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.code).toBe("INVALID_INPUT");
      }
      expect(mockRpc).not.toHaveBeenCalled();
    });

    it("only allows system_admin to restore drafts from published/hidden states", async () => {
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "reviewer-id", role: "reviewer", email: "reviewer@example.com" },
      });

      // Reviewer cannot restore drafts
      const reviewerResult = await restoreLocalHeroDraft({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "3",
      });
      expect(reviewerResult.ok).toBe(false);
      if (!reviewerResult.ok) {
        expect(reviewerResult.error.code).toBe("FORBIDDEN");
      }

      // System admin can restore drafts
      mockStaffState.mockResolvedValue({
        status: "active",
        staff: { id: "admin-id", role: "system_admin", email: "admin@example.com" },
      });
      mockRpc.mockResolvedValue({
        data: {
          ok: true,
          data: {
            figureId: "a0000000-0000-4000-8000-000000000001",
            slug: "dinh-cong-trang",
            revision: "4",
            workflow: "draft",
            readiness: { blocking: [], warnings: [] },
          },
        },
        error: null,
      });

      const adminResult = await restoreLocalHeroDraft({
        figureId: "a0000000-0000-4000-8000-000000000001",
        expectedRevision: "3",
      });
      expect(adminResult.ok).toBe(true);
      if (adminResult.ok) {
        expect(adminResult.data.workflow).toBe("draft");
      }
    });
  });
});
