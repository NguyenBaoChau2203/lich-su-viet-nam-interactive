import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: async () => {} }));
import { getLocalHeroPage } from "@/lib/queries/local-heroes";
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it("does not replay a failed public page RPC through hidden transport retries", async () => {
  vi.useFakeTimers(); vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54329"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_smoke_fixture_not_a_real_key");
  const fetch = vi.fn(async () => new Response(JSON.stringify({ message: "PRIVATE_FAILURE_SENTINEL" }), { status: 503, headers: { "Content-Type": "application/json" } })); vi.stubGlobal("fetch", fetch);
  const pending = expect(getLocalHeroPage({ localityCode: null, query: "", page: 1 })).rejects.toThrow("Chưa tải được danh sách nhân vật");
  await vi.runAllTimersAsync(); await pending;
  expect(fetch).toHaveBeenCalledTimes(1);
});
it("propagates an obsolete caller's abort to the real SDK fetch without replay", async () => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "http://127.0.0.1:54329"); vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_smoke_fixture_not_a_real_key");
  const fetch = vi.fn((_input: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new DOMException("Synthetic abort", "AbortError")), { once: true });
  })); vi.stubGlobal("fetch", fetch);
  const abort = new AbortController(), pending = expect(getLocalHeroPage({ localityCode: "01", query: "", page: 1 }, abort.signal)).rejects.toThrow("Chưa tải được danh sách nhân vật");
  await vi.waitFor(() => expect(fetch).toHaveBeenCalledTimes(1)); abort.abort(); await pending;
  expect(fetch.mock.calls[0][1]?.signal?.aborted).toBe(true); expect(fetch).toHaveBeenCalledTimes(1);
});
