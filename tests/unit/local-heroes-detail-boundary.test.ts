import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const profile = vi.hoisted(() => vi.fn());
vi.mock("@/lib/queries/local-heroes", () => ({ getLocalHeroProfile: profile }));
import { loadFigureDetail } from "@/lib/queries/figures";
const image = { id: "accepted", url: "https://example.invalid/accepted.png", width: 240, height: 160, altText: "Synthetic context", caption: "Synthetic context", depictionKind: "historical_context", era: "historical", labels: [], photographer: null, sourcePageUrl: "https://example.invalid/source", license: null, licenseUrl: null, usageBasis: "coursework_reference", usageNote: "Synthetic policy", focalPoint: null };
const accepted = { id: "synthetic", slug: "synthetic-person", name: "Synthetic person", birthYear: null, deathYear: null, aliases: [], biography: null, contributionSummary: "Synthetic contribution", associations: [], stories: [], gallery: [image], events: [], image };
function database() {
  const q = { select: () => q, eq: () => q, order: () => q, maybeSingle: async () => ({ data: { id: "synthetic", slug: "synthetic-person", name: "Synthetic person", workflow_status: "published", is_local_hero: true, portrait_url: "PRIVATE_PORTRAIT_SENTINEL", media_assets: [], event_figures: [] }, error: null }), then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: [], error: null }).then(resolve) };
  const from = vi.fn(() => q);
  return { from };
}
beforeEach(() => profile.mockReset());
it("does not fall through to a legacy portrait when the public eligible catalog profile is absent", async () => {
  profile.mockResolvedValue(null); const db = database();
  expect(await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { slug: "synthetic-person" }, true)).toBeNull();
  expect(profile).toHaveBeenCalledExactlyOnceWith("synthetic-person");
});
it("uses accepted catalog media through one bounded profile, preserving the existing presentation", async () => {
  profile.mockResolvedValue(accepted); const db = database();
  const detail = await loadFigureDetail(db as unknown as Parameters<typeof loadFigureDetail>[0], { slug: "synthetic-person" }, true);
  expect(detail?.portraitUrl).toBeNull(); expect(detail?.media[0].url).toBe(image.url); expect(detail?.isLocalHero).toBe(true);
  expect(db.from).toHaveBeenCalledExactlyOnceWith("historical_figures"); expect(JSON.stringify(detail)).not.toContain("PRIVATE_PORTRAIT_SENTINEL");
});
