import { describe, expect, it } from "vitest";
import { buildLocalHeroDetailHref, buildLocalHeroHomeHref, getLocalHeroReturnHref, parseLocalHeroState, normalizeLocalHeroQuery, foldLocalHeroQuery } from "@/lib/local-heroes/state";
import { parseMapExplorerState } from "@/lib/explorer/map-state";
import { getExplorerReturnHref } from "@/lib/explorer/url";
const limits = { minYear: 1905, maxYear: 2019, eventSlugs: ["synthetic-event"] };
const map = { from: 1911, to: 1975, selectedEvent: "synthetic-event", view: { lat: 21, lng: 105, zoom: 5 } };
const people = { mode: "people" as const, filters: { localityCode: "01" as const, query: "Đặng Bí danh", page: 2 } };
describe("local heroes URL contract", () => {
  it("round-trips the exact contracted keys and opaque locality codes", () => {
    const href = buildLocalHeroHomeHref(map, people), p = new URL(href, "https://example.invalid").searchParams;
    expect(p.get("noi-dung")).toBe("nhan-vat"); expect(p.get("dia-phuong")).toBe("ha-noi"); expect(p.get("q-nhan-vat")).toBe("Đặng Bí danh"); expect(p.get("trang-nhan-vat")).toBe("2");
    expect(parseLocalHeroState(p)).toEqual(people);
    expect(parseMapExplorerState(p, limits)).toEqual(map);
  });
  it("normalizes composed and decomposed Vietnamese without splitting code points", () => {
    const query = " Đa\u0323\u0306ng\u200b \t Bí\n danh \ufeff ";
    expect(normalizeLocalHeroQuery(query)).toBe("Đặng Bí danh"); expect(foldLocalHeroQuery(query)).toBe("dang bi danh");
    const parsed = parseLocalHeroState(new URLSearchParams({ "q-nhan-vat": "😀".repeat(121) }));
    expect(Array.from(parsed.filters.query)).toHaveLength(120); expect(parsed.filters.query).not.toContain("\ufffd");
  });
  it.each(["0", "-1", "01", "1.2", "1000000", "NaN", "Infinity", "", "2e2"])("normalizes invalid page %s and unknown locality safely", (page) => {
    expect(parseLocalHeroState(new URLSearchParams({ "noi-dung": "nhan-vat", "dia-phuong": "unknown", "trang-nhan-vat": page })).filters).toEqual({ localityCode: null, query: "", page: 1 });
  });
  it("retains inactive preferences, first GET values and literal aliases without borrowing event years", () => {
    const state = parseLocalHeroState(new URLSearchParams("noi-dung=other&dia-phuong=cao-bang&dia-phuong=ha-noi&q-nhan-vat=B%C3%AD+danh+%25+_&trang-nhan-vat=999999"));
    expect(state).toEqual({ mode: "events", filters: { localityCode: "04", query: "Bí danh % _", page: 999999 } });
    const p = new URL(buildLocalHeroHomeHref(map, state), "https://example.invalid").searchParams;
    expect(p.has("noi-dung")).toBe(false); expect(p.get("dia-phuong")).toBe("cao-bang"); expect(p.get("tu")).toBe("1911");
    const defaults = buildLocalHeroHomeHref(map, { mode: "events", filters: { localityCode: null, query: "", page: 1 } });
    expect(defaults).not.toMatch(/noi-dung|dia-phuong|q-nhan-vat|trang-nhan-vat/u);
  });
  it("preserves existing event camera and exact journey keys through detail transport", () => {
    const p = new URLSearchParams("tu=1911&den=1975&su-kien=synthetic-event&goc=0,0.7,100,2,-3&ban-do=21,105,5&hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919");
    const href = buildLocalHeroHomeHref(parseMapExplorerState(p, limits), people);
    const restored = new URL(getLocalHeroReturnHref(href), "https://example.invalid").searchParams;
    for (const [key, value] of p) expect(restored.get(key)).toBe(value);
    const detail = new URL(buildLocalHeroDetailHref("synthetic-person", href), "https://example.invalid");
    expect(detail.pathname).toBe("/nhan-vat/synthetic-person"); expect(detail.searchParams.get("kham-pha")).toBe(href);
    expect(getExplorerReturnHref(href, "synthetic-event")).toBe(href);
  });
  it("accepts a long encoded Vietnamese return without recursively decoding its query", () => {
    const href = buildLocalHeroHomeHref(map, { ...people, filters: { ...people.filters, query: "Đặng ".repeat(24).trim() } });
    expect(href.length).toBeGreaterThan(240); expect(getLocalHeroReturnHref(href)).toBe(href);
    const literal = buildLocalHeroHomeHref(map, { ...people, filters: { ...people.filters, query: "%2Fquan-tri" } });
    expect(parseLocalHeroState(new URL(getLocalHeroReturnHref(literal), "https://example.invalid").searchParams).filters.query).toBe("%2Fquan-tri");
  });
  it.each(["https://evil.invalid/", "//evil.invalid/", "/quan-tri", "/%2f%2fevil.invalid/", "/?noi-dung=nhan-vat#x", "/?noi-dung=nhan-vat&noi-dung=nhan-vat", "/?tu=1911&tu=1912&den=1941", "/?noi-dung=nhan-vat&admin=1", "/?noi-dung=nhan-vat&q-nhan-vat=%E0%A4", "/?noi-dung=nhan-vat&q-nhan-vat=%xx", "/?noi-dung=nhan-vat&q-nhan-vat=%00", "/\\evil.invalid", "/?dia-phuong=unknown", "/?trang-nhan-vat=0", "/?tu=1975&den=1911", "/?tu=1911", "/?goc=0,99,100,0,0", "/?ban-do=90,0,5", "/?hanh-trinh=ho-chi-minh-1911-1941&moc=not-a-stop", "/?q-nhan-vat=" + "x".repeat(2049)])("rejects external duplicate malformed and overlong return URLs: %s", (value) => {
    expect(getLocalHeroReturnHref(value)).toBe("/?noi-dung=nhan-vat");
  });
});
