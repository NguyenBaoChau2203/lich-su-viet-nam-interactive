import { beforeEach, describe, expect, it, vi } from "vitest";
import { foldLocalHeroQuery, normalizeLocalHeroFilters, normalizeLocalHeroQuery } from "@/lib/local-heroes/normalize";

vi.mock("server-only", () => ({}));
const rpc = vi.hoisted(() => vi.fn());
vi.mock("@/lib/supabase/public", () => ({ createPublicClient: async () => ({ rpc: (...args: unknown[]) => {
  const result = rpc(...args);
  const operation = { retry: () => operation, abortSignal: () => operation, then: result.then.bind(result) };
  return operation;
} }) }));
import { getLocalHeroPage, getLocalHeroProfile, LocalHeroQueryError } from "@/lib/queries/local-heroes";

describe("local hero public queries", () => {
  beforeEach(() => rpc.mockReset());
  it("normalizes composed and decomposed Vietnamese without splitting code points", () => {
    expect(normalizeLocalHeroQuery("  Đặng\u200b\u0001\t  😀  ")).toBe("Đặng 😀");
    expect(Array.from(normalizeLocalHeroQuery("😀".repeat(121)))).toHaveLength(120);
    expect(foldLocalHeroQuery("ĐẶNG\u00a0Văn")).toBe("dang van");
    expect(normalizeLocalHeroFilters({ localityCode: "99", query: null, page: "01" })).toEqual({ localityCode: null, query: "", page: 1 });
    expect(normalizeLocalHeroFilters({ localityCode: "04", query: "Kim", page: "999999" }).page).toBe(999999);
  });
  it("uses one anonymous GET RPC for the bounded page/count/coverage snapshot", async () => {
    const page = { filters: { localityCode: null, query: "", page: 1 }, pageSize: 12, totalPeople: 0, totalPages: 0, items: [], coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 0, byLocality: [] } };
    rpc.mockResolvedValue({ data: page, error: null });
    expect(await getLocalHeroPage({ localityCode: null, query: "", page: 1 })).toEqual(page);
    expect(rpc).toHaveBeenCalledExactlyOnceWith("local_hero_page", { p_locality_code: null, p_query: "", p_page: 1 }, { get: true });
  });
  it("keeps database outages distinct from empty or absent results", async () => {
    rpc.mockResolvedValue({ data: null, error: { message: "PRIVATE_SENTINEL" } });
    await expect(getLocalHeroProfile("synthetic-person")).rejects.toThrow(LocalHeroQueryError);
    await expect(getLocalHeroPage({ localityCode: null, query: "", page: 1 })).rejects.not.toThrow("PRIVATE_SENTINEL");
    rpc.mockResolvedValue({ data: null, error: null });
    expect(await getLocalHeroProfile("synthetic-person")).toBeNull();
    expect(await getLocalHeroProfile("../forged")).toBeNull();
    expect(rpc).toHaveBeenCalledTimes(3);
  });
});
