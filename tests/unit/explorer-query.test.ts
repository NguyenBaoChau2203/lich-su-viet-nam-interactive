import { beforeEach, describe, expect, it, vi } from "vitest";

const { createPublicClientMock } = vi.hoisted(() => ({
  createPublicClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/public", () => ({
  createPublicClient: createPublicClientMock,
}));

import { getExplorerEvents } from "@/lib/queries/explorer";

function createQueryChain(rows: unknown[], error: { message: string } | null = null) {
  const calls: { method: string; args: unknown[] }[] = [];
  const chain = {
    select(fields: string) {
      calls.push({ method: "select", args: [fields] });
      return chain;
    },
    eq(column: string, value: unknown) {
      calls.push({ method: "eq", args: [column, value] });
      return chain;
    },
    order(column: string, opts: unknown) {
      calls.push({ method: "order", args: [column, opts] });
      return chain;
    },
    then(onFulfilled: (val: { data: unknown[]; error: { message: string } | null }) => unknown) {
      return Promise.resolve({ data: rows, error }).then(onFulfilled);
    },
  };
  return {
    calls,
    from(table: string) {
      calls.push({ method: "from", args: [table] });
      return chain;
    },
  };
}

describe("getExplorerEvents (synthetic mocked public client)", () => {
  beforeEach(() => {
    createPublicClientMock.mockReset();
  });

  it("queries published historical_events in a single select without N+1 queries and maps locations, endYear, and sourceCount", async () => {
    // Synthetic test rows only — not historical claims
    const syntheticRows = [
      {
        id: "evt-synthetic-1",
        slug: "su-kien-tong-hop-1",
        title: "Sự kiện tổng hợp 1 (synthetic)",
        summary: "Mô tả ngắn thử nghiệm 1.",
        date_text: "1945 – 1954",
        date_precision: "period",
        is_featured: true,
        start_year: 1945,
        end_year: 1954,
        curriculum_topics: { name: "Chủ đề thử", slug: "chu-de-thu" },
        media_assets: [],
        event_topics: [{ curriculum_topics: { name: "Chủ đề phụ", slug: "chu-de-phu" } }, { curriculum_topics: null }],
        event_locations: [
          {
            location_role: "Địa điểm phụ",
            is_primary: false,
            historical_locations: {
              slug: "dia-diem-khong-toa-do",
              name: "Địa điểm không tọa độ (synthetic)",
              historical_name: "Tên cũ",
              latitude: 0,
              longitude: 0,
              accuracy_level: "approximate",
              accuracy_note: "Ghi chú thử",
              workflow_status: "published",
            },
          },
          {
            location_role: "Địa điểm chính",
            is_primary: true,
            historical_locations: {
              slug: "dia-diem-chinh",
              name: "Địa điểm chính (synthetic)",
              historical_name: null,
              latitude: 21.0,
              longitude: 105.0,
              accuracy_level: "exact",
              accuracy_note: null,
              workflow_status: "published",
            },
          },
          {
            location_role: "Địa điểm ẩn bởi RLS",
            is_primary: false,
            historical_locations: null,
          },
          {
            location_role: "Địa điểm chưa công bố",
            is_primary: false,
            historical_locations: {
              slug: "dia-diem-nhap",
              name: "Địa điểm nháp (synthetic)",
              historical_name: null,
              latitude: 10.0,
              longitude: 106.0,
              accuracy_level: "exact",
              accuracy_note: null,
              workflow_status: "draft",
            },
          },
        ],
        event_sources: [
          { sources: { id: "src-1" } },
          { sources: null },
          { sources: { id: "src-2" } },
        ],
      },
    ];

    const chain = createQueryChain(syntheticRows);
    createPublicClientMock.mockResolvedValue(chain);

    const events = await getExplorerEvents();

    expect(createPublicClientMock).toHaveBeenCalledTimes(1);
    const fromCalls = chain.calls.filter((c) => c.method === "from");
    expect(fromCalls).toEqual([{ method: "from", args: ["historical_events"] }]);
    expect(chain.calls).toContainEqual({ method: "eq", args: ["workflow_status", "published"] });
    // Must not filter event_locations.is_primary = true because all locations are needed
    expect(chain.calls.some((c) => c.method === "eq" && c.args[0] === "event_locations.is_primary")).toBe(false);

    expect(events).toHaveLength(1);
    const evt = events[0];
    expect(evt.id).toBe("evt-synthetic-1");
    expect(evt.slug).toBe("su-kien-tong-hop-1");
    expect(evt.startYear).toBe(1945);
    expect(evt.endYear).toBe(1954);
    expect(evt.datePrecision).toBe("period");
    expect(evt.sourceCount).toBe(2);

    // Only published non-null locations survive; primary location sorted first; numeric zero preserved
    expect(evt.locations).toHaveLength(2);
    expect(evt.locations[0]).toEqual({
      slug: "dia-diem-chinh",
      name: "Địa điểm chính (synthetic)",
      historicalName: null,
      latitude: 21.0,
      longitude: 105.0,
      accuracyLevel: "exact",
      accuracyNote: null,
      isPrimary: true,
      role: "Địa điểm chính",
    });
    expect(evt.locations[1]).toEqual({
      slug: "dia-diem-khong-toa-do",
      name: "Địa điểm không tọa độ (synthetic)",
      historicalName: "Tên cũ",
      latitude: 0,
      longitude: 0,
      accuracyLevel: "approximate",
      accuracyNote: "Ghi chú thử",
      isPrimary: false,
      role: "Địa điểm phụ",
    });
  });

  it("throws a clear Vietnamese error message when the database query fails", async () => {
    const chain = createQueryChain([], { message: "connection timeout" });
    createPublicClientMock.mockResolvedValue(chain);

    await expect(getExplorerEvents()).rejects.toThrow(/connection timeout/);
  });
});
