import { describe, expect, it } from "vitest";
import {
  parseLocalHeroState,
  localHeroParams,
  normalizeLocalHeroReturnHref,
  getLocalHeroReturnHref,
  getPlaceReturnHref,
  buildPlaceDetailHref,
  buildLocalHeroHomeHref,
} from "@/lib/local-heroes/state";
import { parseMapExplorerState } from "@/lib/explorer/map-state";

const limits = { minYear: 1905, maxYear: 2019, eventSlugs: ["synthetic-event"] };
const map = { from: 1911, to: 1975, selectedEvent: null, view: { lat: 21, lng: 105, zoom: 5 } };

describe("heritage places URL contract (Section 6.4)", () => {
  it("parses noi-dung=dia-danh and place selection correctly", () => {
    const params = new URLSearchParams("noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=thanh-co-quang-tri");
    const state = parseLocalHeroState(params);
    expect(state.mode).toBe("places");
    expect(state.filters.localityCode).toBe("44");
    expect(state.place).toBe("thanh-co-quang-tri");
  });

  it("parses invalid or overlong place slug as null in places mode", () => {
    const badSlug = new URLSearchParams("noi-dung=dia-danh&dia-danh=INVALID_SLUG!");
    expect(parseLocalHeroState(badSlug).place ?? null).toBeNull();

    const overlong = new URLSearchParams(`noi-dung=dia-danh&dia-danh=${"a".repeat(161)}`);
    expect(parseLocalHeroState(overlong).place ?? null).toBeNull();
  });

  it("never parses place for people or events mode", () => {
    const peopleParams = new URLSearchParams("noi-dung=nhan-vat&dia-danh=thanh-co-quang-tri");
    expect(parseLocalHeroState(peopleParams).place ?? null).toBeNull();

    const eventParams = new URLSearchParams("dia-danh=thanh-co-quang-tri");
    expect(parseLocalHeroState(eventParams).place ?? null).toBeNull();
  });

  it("serializes places mode params without q-nhan-vat or trang-nhan-vat", () => {
    const placesState = {
      mode: "places" as const,
      filters: { localityCode: "44" as const, query: "ignore this", page: 3 },
      place: "thanh-co-quang-tri",
    };
    const params = localHeroParams(placesState);
    expect(params.get("noi-dung")).toBe("dia-danh");
    expect(params.get("dia-phuong")).toBe("quang-tri");
    expect(params.get("dia-danh")).toBe("thanh-co-quang-tri");
    expect(params.has("q-nhan-vat")).toBe(false);
    expect(params.has("trang-nhan-vat")).toBe(false);
  });

  it("serializes places mode with no locality or place selection", () => {
    const placesState = {
      mode: "places" as const,
      filters: { localityCode: null, query: "", page: 1 },
      place: null,
    };
    const params = localHeroParams(placesState);
    expect(params.get("noi-dung")).toBe("dia-danh");
    expect(params.has("dia-phuong")).toBe(false);
    expect(params.has("dia-danh")).toBe(false);
  });

  it("normalizes places return URLs with valid slug", () => {
    const valid = "/?noi-dung=dia-danh&dia-phuong=quang-tri&dia-danh=thanh-co-quang-tri";
    expect(normalizeLocalHeroReturnHref(valid, "/fallback")).toBe(valid);
  });

  it("rejects places return URLs with invalid dia-danh slug", () => {
    const invalidSlug = "/?noi-dung=dia-danh&dia-danh=Bad_Slug!";
    expect(normalizeLocalHeroReturnHref(invalidSlug, "/fallback")).toBe("/fallback");

    const overlongSlug = `/?noi-dung=dia-danh&dia-danh=${"x".repeat(161)}`;
    expect(normalizeLocalHeroReturnHref(overlongSlug, "/fallback")).toBe("/fallback");
  });

  it("rejects unknown noi-dung values in normalizeLocalHeroReturnHref", () => {
    expect(normalizeLocalHeroReturnHref("/?noi-dung=unknown", "/fallback")).toBe("/fallback");
  });

  it("provides getPlaceReturnHref with default fallback", () => {
    expect(getPlaceReturnHref(null)).toBe("/?noi-dung=dia-danh");
    expect(getPlaceReturnHref("invalid")).toBe("/?noi-dung=dia-danh");
    expect(getPlaceReturnHref("/?noi-dung=dia-danh&dia-phuong=ha-noi")).toBe("/?noi-dung=dia-danh&dia-phuong=ha-noi");
  });

  it("builds place detail href with safe encoded return parameter", () => {
    const homeHref = "/?noi-dung=dia-danh&dia-phuong=quang-tri";
    const detailHref = buildPlaceDetailHref("thanh-co-quang-tri", homeHref);
    expect(detailHref).toBe(
      `/dia-diem/thanh-co-quang-tri?kham-pha=${encodeURIComponent(homeHref)}`,
    );

    // Invalid slug falls back to default places page
    expect(buildPlaceDetailHref("INVALID_SLUG", homeHref)).toBe("/?noi-dung=dia-danh");
  });

  it("preserves people return href behavior untouched", () => {
    expect(getLocalHeroReturnHref("/?noi-dung=nhan-vat&dia-phuong=ha-noi")).toBe("/?noi-dung=nhan-vat&dia-phuong=ha-noi");
    expect(getLocalHeroReturnHref(null)).toBe("/?noi-dung=nhan-vat");
  });

  it("round-trips places state with explorer map parameters", () => {
    const placesState = {
      mode: "places" as const,
      filters: { localityCode: "44" as const, query: "", page: 1 },
      place: "thanh-co-quang-tri",
    };
    const href = buildLocalHeroHomeHref(map, placesState);
    const url = new URL(href, "https://example.invalid");
    expect(url.searchParams.get("noi-dung")).toBe("dia-danh");
    expect(url.searchParams.get("dia-phuong")).toBe("quang-tri");
    expect(url.searchParams.get("dia-danh")).toBe("thanh-co-quang-tri");
    expect(parseLocalHeroState(url.searchParams)).toEqual({
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: "thanh-co-quang-tri",
    });
    expect(parseMapExplorerState(url.searchParams, limits)).toEqual(map);
  });
});
