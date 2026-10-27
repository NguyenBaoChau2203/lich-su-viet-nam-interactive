import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const mock = vi.hoisted(() => ({ parent: vi.fn(), stories: vi.fn(), submit: vi.fn(), review: vi.fn(), restore: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ from: () => { const q = { select: () => q, eq: () => q, maybeSingle: mock.parent, then: (resolve: (v: unknown) => unknown) => mock.stories().then(resolve) }; return q; } }) }));
vi.mock("@/lib/actions/local-heroes", () => ({ submitLocalHeroGraph: mock.submit, reviewLocalHeroGraph: mock.review, restoreLocalHeroDraft: mock.restore }));
import { tryLocalHeroWorkflow } from "@/lib/local-heroes/legacy-workflow";
beforeEach(() => { vi.clearAllMocks(); mock.parent.mockResolvedValue({ data: { is_local_hero: true, revision: "9007199254740993", workflow_status: "draft" }, error: null }); mock.stories.mockResolvedValue({ data: [{ id: "primary", is_primary: true, workflow_status: "draft" }, { id: "private", is_primary: false, workflow_status: "draft" }], error: null }); mock.submit.mockResolvedValue({ ok: true }); });
it("dispatches catalog submission with an opaque revision and selected primary only", async () => {
  await tryLocalHeroWorkflow("synthetic-id", "submit");
  expect(mock.submit).toHaveBeenCalledExactlyOnceWith({ figureId: "synthetic-id", expectedRevision: "9007199254740993", storyIds: ["primary"] });
});
it("preserves the observed revision and explicit story selection instead of silently using a newer revision", async () => {
  await tryLocalHeroWorkflow("synthetic-id", "submit", null, { expectedRevision: "1", storyIds: ["primary", "selected-secondary"] });
  expect(mock.submit).toHaveBeenCalledExactlyOnceWith({ figureId: "synthetic-id", expectedRevision: "1", storyIds: ["primary", "selected-secondary"] });
});
it("preserves noncatalog workflow and keeps a failed lookup distinct", async () => {
  mock.parent.mockResolvedValue({ data: { is_local_hero: false }, error: null });
  expect(await tryLocalHeroWorkflow("synthetic-id", "hide")).toBeNull();
  expect(mock.review).not.toHaveBeenCalled();
  mock.parent.mockResolvedValue({ data: null, error: { message: "PRIVATE_SENTINEL" } });
  const out = await tryLocalHeroWorkflow("synthetic-id", "hide");
  expect(out).toMatchObject({ ok: false, error: { code: "DB_UNAVAILABLE" } });
  expect(JSON.stringify(out)).not.toContain("PRIVATE_SENTINEL");
});
