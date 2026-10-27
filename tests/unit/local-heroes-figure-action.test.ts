import { beforeEach, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ saveGraph: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireRole: vi.fn(async () => ({ role: "editor" })) }));
vi.mock("@/lib/actions/local-heroes", () => ({ saveLocalHeroGraph: mocks.saveGraph }));
import { saveFigureAction } from "@/lib/actions/content";
import { initialActionState } from "@/lib/actions/state";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.saveGraph.mockResolvedValue({ ok: false, error: { code: "INVALID_INPUT", message: "Synthetic evidence still incomplete", fieldErrors: {}, readiness: null } });
});

it.each(["", "   ", "\t"])("keeps an unknown lifespan blank when the form contains %j", async (blank) => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ is_local_hero: "true", name: "Synthetic person", slug: "synthetic-person", birth_year: blank, death_year: blank, catalog_graph_json: "{}" })) form.set(key, value);
  await saveFigureAction(initialActionState, form);
  expect(mocks.saveGraph).toHaveBeenCalledWith(expect.objectContaining({ figure: expect.objectContaining({ birthYear: null, deathYear: null }) }));
});

it("accepts padded valid years and rejects a nonnumeric year before saving", async () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({ is_local_hero: "true", name: "Synthetic person", slug: "synthetic-person", birth_year: " 1900 ", death_year: " 1980 ", catalog_graph_json: "{}" })) form.set(key, value);
  await saveFigureAction(initialActionState, form);
  expect(mocks.saveGraph).toHaveBeenCalledWith(expect.objectContaining({ figure: expect.objectContaining({ birthYear: 1900, deathYear: 1980 }) }));
  mocks.saveGraph.mockClear();
  form.set("birth_year", "unknown");
  const result = await saveFigureAction(initialActionState, form);
  expect(result).toMatchObject({ status: "error", fieldErrors: { birth_year: expect.any(String) } });
  expect(mocks.saveGraph).not.toHaveBeenCalled();
});
