import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mock = vi.hoisted(() => ({ rows: {} as Record<string, unknown>, calls: [] as string[], guard: vi.fn(), errorTable: "" }));
vi.mock("@/lib/auth", () => ({ requireRole: mock.guard }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ from: (table: string) => {
  mock.calls.push(table);
  const outcome = () => ({ data: Object.hasOwn(mock.rows, table) ? mock.rows[table] : [], error: mock.errorTable === table ? { message: "PRIVATE_OUTAGE_SENTINEL" } : null });
  const q = { select: () => q, eq: () => q, order: () => q, in: () => q, maybeSingle: async () => outcome(), then: (resolve: (v: unknown) => unknown) => Promise.resolve(outcome()).then(resolve) };
  return q;
} }) }));
import { getLocalHeroAdminGraph } from "@/lib/queries/local-heroes-admin";
const id = "a0000000-0000-4000-8000-000000000001";
beforeEach(() => {
  mock.calls.length = 0; mock.errorTable = ""; mock.guard.mockReset();
  mock.rows = {
    historical_figures: { id, revision: "9007199254740993", name: "Synthetic draft", slug: "synthetic-draft", other_names: null, birth_year: null, death_year: null, biography: null, contribution_summary: null, contribution_start_year: null, contribution_end_year: null, catalog_aliases: [], workflow_status: "draft", review_note: "PRIVATE_STAFF_PREVIEW" },
    figure_sources: [], figure_localities: [], figure_story_sources: [], media_assets: [],
    figure_stories: [1, 2, 3].map((n) => ({ id: "a0000000-0000-4000-8000-00000000001" + n, slug: "synthetic-story-" + n, title: "Synthetic story", summary: "", body: "", sort_order: n, is_primary: n === 1, workflow_status: "draft", review_note: null })),
    figure_media_evidence: [{ media_id: "a0000000-0000-4000-8000-000000000002", depiction_kind: "historical_context", decision: "held", identity_source_id: id, identity_locator: "Synthetic lead", identity_certainty: "approximate", usage_basis: "unknown", usage_source_id: null, usage_locator: null, usage_note: null, checked_at: "2026-10-26T00:00:00+00:00", identity: null, usage: null }],
  };
});
it("batches all staff child reads and serializes opaque revisions and UTC timestamps", async () => {
  const graph = await getLocalHeroAdminGraph(id);
  expect(graph?.revision).toBe("9007199254740993");
  expect(graph?.mediaEvidence[0].checkedAt).toBe("2026-10-26T00:00:00.000Z");
  expect(graph?.stories).toHaveLength(3);
  expect(graph?.reviewNote).toBe("PRIVATE_STAFF_PREVIEW");
  expect(graph?.readiness.blocking.some((i) => i.code === "IMAGE_REQUIRED")).toBe(true);
  expect(mock.calls).toHaveLength(7);
  expect(mock.calls.filter((table) => table === "figure_story_sources")).toHaveLength(1);
  expect(mock.guard).toHaveBeenCalledExactlyOnceWith(["editor", "reviewer", "system_admin"]);
});
it("does not turn an outage into a missing record or expose database details", async () => {
  mock.errorTable = "figure_localities";
  await expect(getLocalHeroAdminGraph(id)).rejects.not.toThrow("PRIVATE_OUTAGE_SENTINEL");
  mock.errorTable = ""; mock.rows.historical_figures = null;
  expect(await getLocalHeroAdminGraph(id)).toBeNull();
  mock.calls.length = 0;
  expect(await getLocalHeroAdminGraph("forged-id")).toBeNull();
  expect(mock.calls).toEqual([]);
});
