import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LocalHeroFilters, LocalHeroPage } from "@/lib/local-heroes/types";
vi.mock("server-only", () => ({}));
const mocks = vi.hoisted(() => ({ events: vi.fn(), people: vi.fn() }));
vi.mock("@/components/explorer/HistoryExplorer", () => ({ HistoryExplorer: () => null }));
vi.mock("@/lib/queries/explorer", () => ({ getExplorerEvents: mocks.events }));
vi.mock("@/lib/queries/local-heroes", () => ({ getLocalHeroPage: mocks.people }));
import HomePage from "@/app/(public)/page";
import { GET } from "@/app/api/local-heroes/route";
const empty = (filters: LocalHeroFilters): LocalHeroPage => ({ filters: { ...filters, page: 1 }, pageSize: 12, totalPeople: 0, totalPages: 0, items: [], coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: 0, byLocality: [] } });
describe("homepage and public GET boundary", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.events.mockResolvedValue([]); mocks.people.mockImplementation(async (filters: LocalHeroFilters) => empty(filters)); });
  it("does not query people in default event mode even with retained people preferences", async () => {
    const element = await HomePage({ searchParams: Promise.resolve({ "q-nhan-vat": "Đặng", "dia-phuong": "ha-noi" }) });
    expect(mocks.people).not.toHaveBeenCalled(); expect(element.props.initialPeople.mode).toBe("events"); expect(element.props.initialPeopleLoad).toEqual({ status: "idle" });
  });
  it("isolates event failure and clamps one bounded SSR people result without a second query", async () => {
    mocks.events.mockRejectedValue(new Error("PRIVATE_EVENT_SENTINEL"));
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "nhan-vat", "dia-phuong": ["ha-noi", "cao-bang"], "trang-nhan-vat": "999999" }) });
    expect(mocks.people).toHaveBeenCalledExactlyOnceWith({ localityCode: "01", query: "", page: 999999 });
    expect(element.props.initialPeople.filters.page).toBe(1); expect(element.props.initialPeopleLoad.status).toBe("ready"); expect(element.props.dataError).toContain("Chưa tải được dữ liệu sự kiện");
    expect(JSON.stringify(element.props)).not.toContain("PRIVATE_EVENT_SENTINEL");
  });
  it("keeps SSR people failure distinct from empty data and event availability", async () => {
    mocks.people.mockRejectedValue(new Error("PRIVATE_PEOPLE_SENTINEL"));
    const element = await HomePage({ searchParams: Promise.resolve({ "noi-dung": "nhan-vat" }) });
    expect(element.props.dataError).toBeNull(); expect(element.props.initialPeopleLoad.status).toBe("error"); expect(JSON.stringify(element.props)).not.toContain("PRIVATE_PEOPLE_SENTINEL");
  });
  it("normalizes GET input once, returns empty success and forbids caching", async () => {
    const response = await GET(new Request("http://localhost/api/local-heroes?dia-phuong=cao-bang&dia-phuong=ha-noi&q-nhan-vat=%20%C4%90%E1%BA%B7ng%20%20&trang-nhan-vat=0"));
    expect(mocks.people).toHaveBeenCalledExactlyOnceWith({ localityCode: "04", query: "Đặng", page: 1 }, expect.any(AbortSignal)); expect(response.status).toBe(200); expect(response.headers.get("Cache-Control")).toBe("no-store"); expect(await response.json()).toMatchObject({ ok: true, data: { totalPeople: 0 } });
  });
  it("returns fixed 503 retry errors without private database details", async () => {
    mocks.people.mockRejectedValue(new Error("PRIVATE_DATABASE_SENTINEL"));
    const response = await GET(new Request("http://localhost/api/local-heroes"));
    expect(response.status).toBe(503); expect(await response.json()).toEqual({ ok: false, error: { code: "DATA_UNAVAILABLE", message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.", retryable: true } });
  });
});
