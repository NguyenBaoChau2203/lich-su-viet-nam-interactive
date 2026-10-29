import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LocalHeroFilters, LocalHeroPage } from "@/lib/local-heroes/types";
import type { HeritageCatalog } from "@/lib/heritage/types";

vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ events: vi.fn(), people: vi.fn(), places: vi.fn() }));
vi.mock("@/components/explorer/HistoryExplorer", () => ({ HistoryExplorer: () => null }));
vi.mock("@/lib/queries/explorer", () => ({ getExplorerEvents: mocks.events }));
vi.mock("@/lib/queries/local-heroes", () => ({ getLocalHeroPage: mocks.people }));
vi.mock("@/lib/queries/heritage", () => ({ getHeritageCatalog: mocks.places }));

import HomePage from "@/app/(public)/page";
import { GET } from "@/app/api/local-heroes/route";

const empty = (filters: LocalHeroFilters): LocalHeroPage => ({
  filters: { ...filters, page: 1 },
  pageSize: 12,
  totalPeople: 0,
  totalPages: 0,
  items: [],
  coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 0, byLocality: [] },
});

const emptyHeritage: HeritageCatalog = {
  items: [],
  coverage: { totalLocalities: 34, representedLocalities: 0 },
};

describe("homepage and public GET boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.events.mockResolvedValue([]);
    mocks.people.mockImplementation(async (filters: LocalHeroFilters) => empty(filters));
    mocks.places.mockResolvedValue(emptyHeritage);
  });

  it("does not query people in default event mode even with retained people preferences", async () => {
    const element = await HomePage({ searchParams: Promise.resolve({ "q-nhan-vat": "Đặng", "dia-phuong": "ha-noi" }) });
    expect(mocks.people).not.toHaveBeenCalled();
    expect(mocks.places).not.toHaveBeenCalled();
    expect(element.props.initialPeople.mode).toBe("events");
    expect(element.props.initialPeopleLoad).toEqual({ status: "idle" });
    expect(element.props.initialPlacesLoad).toEqual({ status: "idle" });
  });

  it("does not query people or places for chooser overview without a locality", async () => {
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "dia-phuong" }) });
    expect(mocks.people).not.toHaveBeenCalled();
    expect(mocks.places).not.toHaveBeenCalled();
    expect(element.props.initialPeople.mode).toBe("locality");
    expect(element.props.initialPeople.filters.localityCode).toBeNull();
    expect(element.props.initialPeopleLoad).toEqual({ status: "idle" });
    expect(element.props.initialPlacesLoad).toEqual({ status: "idle" });
  });

  it("initiates both people and places readers concurrently for overview with valid locality", async () => {
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "dia-phuong", "dia-phuong": "ha-noi" }) });
    expect(mocks.people).toHaveBeenCalledExactlyOnceWith({ localityCode: "01", query: "", page: 1 });
    expect(mocks.places).toHaveBeenCalledOnce();
    expect(element.props.initialPeople.mode).toBe("locality");
    expect(element.props.initialPeopleLoad.status).toBe("ready");
    expect(element.props.initialPlacesLoad.status).toBe("ready");
  });

  it("resolves a legacy selected-place URL to its catalog locality during SSR", async () => {
    mocks.places.mockResolvedValue({ ...emptyHeritage, items: [{
      id: "synthetic-place", slug: "synthetic-place", name: "Synthetic place", historicalName: null,
      locality: { code: "44", slug: "quang-tri", officialName: "Tỉnh Quảng Trị", referenceFramework: "VN-34-2025" },
      tier: "grade12", rank: 1, period: "Synthetic period", teaser: "Synthetic excerpt", latitude: 16, longitude: 107,
      accuracyLevel: "approximate", accuracyNote: null, lessonSlug: null, cover: null, videos: [],
    }] });
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "dia-danh", "dia-danh": "synthetic-place" }) });
    expect(element.props.initialPeople).toEqual({ mode: "places", filters: { localityCode: "44", query: "", page: 1 }, place: "synthetic-place" });
    expect(mocks.people).not.toHaveBeenCalled();
    expect(mocks.places).toHaveBeenCalledOnce();
  });

  it("isolates event failure and clamps one bounded SSR people result without a second query", async () => {
    mocks.events.mockRejectedValue(new Error("PRIVATE_EVENT_SENTINEL"));
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "nhan-vat", "dia-phuong": ["ha-noi", "cao-bang"], "trang-nhan-vat": "999999" }) });
    expect(mocks.people).toHaveBeenCalledExactlyOnceWith({ localityCode: "01", query: "", page: 999999 });
    expect(element.props.initialPeople.filters.page).toBe(1);
    expect(element.props.initialPeopleLoad.status).toBe("ready");
    expect(element.props.dataError).toContain("Chưa tải được dữ liệu sự kiện");
    expect(JSON.stringify(element.props)).not.toContain("PRIVATE_EVENT_SENTINEL");
  });

  it("keeps SSR people failure distinct from empty data and event availability", async () => {
    mocks.people.mockRejectedValue(new Error("PRIVATE_PEOPLE_SENTINEL"));
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "nhan-vat" }) });
    expect(element.props.dataError).toBeNull();
    expect(element.props.initialPeopleLoad.status).toBe("error");
    expect(JSON.stringify(element.props)).not.toContain("PRIVATE_PEOPLE_SENTINEL");
  });

  it("normalizes GET input once, returns empty success and forbids caching", async () => {
    const response = await GET(new Request("http://localhost/api/local-heroes?dia-phuong=cao-bang&dia-phuong=ha-noi&q-nhan-vat=%20%C4%90%E1%BA%B7ng%20%20&trang-nhan-vat=0"));
    expect(mocks.people).toHaveBeenCalledExactlyOnceWith({ localityCode: "04", query: "Đặng", page: 1 }, expect.any(AbortSignal));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ ok: true, data: { totalPeople: 0 } });
  });

  it("returns fixed 503 retry errors without private database details", async () => {
    mocks.people.mockRejectedValue(new Error("PRIVATE_DATABASE_SENTINEL"));
    const response = await GET(new Request("http://localhost/api/local-heroes"));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: { code: "DATA_UNAVAILABLE", message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.", retryable: true } });
  });
});
