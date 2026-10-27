import { beforeEach, describe, expect, it, vi } from "vitest";
import { graphSchema, reviewSchema } from "@/lib/local-heroes/validation";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ state: vi.fn(), rpc: vi.fn(), revalidate: vi.fn() }));
vi.mock("@/lib/auth", () => ({ getStaffState: mocks.state }));
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ rpc: mocks.rpc }) }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
import { saveLocalHeroGraph, reviewLocalHeroGraph, restoreLocalHeroDraft } from "@/lib/actions/local-heroes";

const draft = () => ({ figureId: null, expectedRevision: null, figure: { name: "Synthetic draft", slug: "synthetic-draft", otherNames: null, birthYear: null, deathYear: null, biography: null, isLocalHero: true, contributionSummary: null, contributionStartYear: null, contributionEndYear: null, catalogAliases: [] }, sources: [], localities: [], stories: [], mediaEvidence: [] });
const success = { ok: true, data: { figureId: "a0000000-0000-4000-8000-000000000001", slug: "synthetic-draft", revision: "9007199254740993", workflow: "draft", readiness: { blocking: [], warnings: [] } } };
describe("local hero session commands", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.state.mockResolvedValue({ status: "active", staff: { id: "synthetic", role: "editor" } }); mocks.rpc.mockResolvedValue({ data: success, error: null }); });
  it("saves incomplete drafts and accepts evidenced coursework use without a fabricated license", async () => {
    expect(graphSchema.safeParse(draft()).success).toBe(true);
    const value = { ...draft(), mediaEvidence: [{ mediaId: "a0000000-0000-4000-8000-000000000002", depictionKind: "historical_context", decision: "accepted", identitySourceId: "a0000000-0000-4000-8000-000000000003", identityLocator: "Synthetic source paragraph", identityCertainty: "verified", usageBasis: "coursework_reference", usageSourceId: null, usageLocator: null, usageNote: "LH-1.0.0-draft.1 coursework attribution https://example.invalid/original", checkedAt: "2026-10-26T00:00:00Z" }] };
    expect(graphSchema.safeParse(value).success).toBe(true);
    expect(await saveLocalHeroGraph(draft())).toEqual(success);
    expect(mocks.revalidate).toHaveBeenCalledWith("/");
    expect(mocks.rpc).toHaveBeenCalledExactlyOnceWith("local_hero_save_graph", { p_command: draft() });
  });
  it("rejects unknown properties, unsafe rich text, mismatched revisions and forged status", async () => {
    for (const value of [{ ...draft(), role: "system_admin" }, { ...draft(), figure: { ...draft().figure, workflow: "published" } }, { ...draft(), figure: { ...draft().figure, biography: "<script>bad</script>" } }, { ...draft(), figureId: "a0000000-0000-4000-8000-000000000001" }]) {
      expect((await saveLocalHeroGraph(value)).ok).toBe(false);
    }
    expect(mocks.rpc).not.toHaveBeenCalled();
    expect(reviewSchema.safeParse({ figureId: success.data.figureId, expectedRevision: "9223372036854775808", action: "publish" }).success).toBe(false);
    expect(reviewSchema.safeParse({ figureId: success.data.figureId, expectedRevision: "9007199254740993", action: "publish" }).success).toBe(true);
  });
  it("returns explicit auth denials without redirects or a privileged client", async () => {
    mocks.state.mockResolvedValue({ status: "anonymous" });
    expect(await saveLocalHeroGraph(draft())).toMatchObject({ ok: false, error: { code: "UNAUTHENTICATED", currentRevision: null } });
    mocks.state.mockResolvedValue({ status: "locked" });
    expect(await saveLocalHeroGraph(draft())).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    mocks.state.mockResolvedValue({ status: "active", staff: { role: "reviewer" } });
    expect(await saveLocalHeroGraph(draft())).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(await restoreLocalHeroDraft({ figureId: success.data.figureId, expectedRevision: "1" })).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });
  it("sanitizes outages and preserves safe stale revision without automatic replay", async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: { code: "08006", message: "PRIVATE_SECRET_SENTINEL" } });
    const out = await saveLocalHeroGraph(draft());
    expect(out).toMatchObject({ ok: false, error: { code: "DB_UNAVAILABLE" } });
    expect(JSON.stringify(out)).not.toContain("PRIVATE_SECRET_SENTINEL");
    expect(mocks.revalidate).not.toHaveBeenCalled();
    mocks.state.mockResolvedValue({ status: "active", staff: { role: "reviewer" } });
    mocks.rpc.mockResolvedValue({ data: { ok: false, error: { code: "STALE", message: "Hồ sơ đã thay đổi.", fieldErrors: {}, readiness: null, currentRevision: "9007199254740993" } }, error: null });
    expect(await reviewLocalHeroGraph({ figureId: success.data.figureId, expectedRevision: "1", action: "publish" })).toMatchObject({ ok: false, error: { code: "STALE", currentRevision: "9007199254740993" } });
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
  it("maps transaction serialization and deadlock failures to stale without retry", async () => {
    for (const code of ["40001", "40P01"]) {
      mocks.rpc.mockResolvedValue({ data: null, error: { code, message: "PRIVATE_DATABASE_DETAIL" } });
      expect(await saveLocalHeroGraph(draft())).toMatchObject({ ok: false, error: { code: "STALE", currentRevision: null } });
    }
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});
