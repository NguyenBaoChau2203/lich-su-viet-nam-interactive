import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const publicProfile = vi.hoisted(() => vi.fn());
vi.mock("@/lib/queries/local-heroes", () => ({ getLocalHeroProfile: publicProfile }));
import { loadFigureDetail } from "@/lib/queries/figures";

const source = {
  id: "source-preview", title: "Synthetic preview archive", author_org: "Synthetic archive",
  publisher: null, published_year: null, url: "https://example.invalid/preview", source_type: "archive",
  citation: "Synthetic reference", accessed_at: "2026-10-27",
};
const citation = {
  claim_key: "story-evidence", source_id: source.id, claim_text: "Synthetic scoped claim",
  locator: "Synthetic paragraph 2", scope_note: "Synthetic story scope", certainty: "verified",
  uncertainty_note: null, sources: source,
};

function client(failedTable?: string) {
  const rows: Record<string, unknown> = {
    historical_figures: {
      id: "figure-preview", slug: "synthetic-preview", name: "Synthetic preview person",
      workflow_status: "pending_review", is_local_hero: true, media_assets: [], event_figures: [],
      birth_year: null, death_year: null, biography: null, portrait_url: null, catalog_aliases: [],
    },
    figure_sources: [{ ...citation, claim_key: "identity" }],
    figure_localities: [{ locality_code: "01", relationship_kind: "activity", historical_place_label: "Synthetic place",
      explanation: "Synthetic association", certainty: "verified", claim_key: "identity", primary_source_id: source.id }],
    figure_stories: [{ id: "story-preview", slug: "synthetic-story", title: "Synthetic draft story", summary: "Synthetic summary",
      body: "Synthetic narrative [[cite:story-evidence]].", is_primary: true, sort_order: 0, workflow_status: "pending_review",
      figure_story_sources: [citation] }],
  };
  return {
    from: vi.fn((table: string) => {
      const result = { data: rows[table] ?? [], error: table === failedTable ? { message: "PRIVATE_DB_DIAGNOSTIC" } : null };
      const query = { select: () => query, eq: () => query, order: () => query,
        maybeSingle: async () => result,
        then: (resolve: (value: typeof result) => unknown) => Promise.resolve(result).then(resolve) };
      return query;
    }),
  };
}

describe("catalog staff preview evidence", () => {
  it("keeps draft story citations and source locators available to the reviewer without a public reader", async () => {
    publicProfile.mockClear();
    const db = client();
    const detail = await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { id: "figure-preview" }, false);
    expect(detail?.stories?.[0].claims?.[0]).toMatchObject({
      key: "story-evidence", sources: [{ sourceId: "source-preview", locator: "Synthetic paragraph 2" }],
    });
    expect(detail?.sources).toEqual(expect.arrayContaining([expect.objectContaining({ id: "source-preview", title: source.title })]));
    expect(detail?.localities?.[0].sources?.[0].sourceId).toBe(source.id);
    expect(publicProfile).not.toHaveBeenCalled();
    expect(db.from).toHaveBeenCalledTimes(4);
  });

  it.each(["figure_sources", "figure_localities", "figure_stories"])("fails visibly and sanitizes a %s preview outage", async (table) => {
    const db = client(table);
    await expect(loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { id: "figure-preview" }, false))
      .rejects.toThrow("Chưa tải được hồ sơ nhân vật. Vui lòng thử lại.");
  });
});
