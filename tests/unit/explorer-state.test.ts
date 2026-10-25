import { describe, expect, it } from "vitest";
import { filterExplorerEvents, getExplorerLimits } from "@/lib/explorer/filters";
import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";
import {
  buildEventDetailHref,
  buildExplorerUrl,
  getExplorerReturnHref,
  parseExplorerState,
} from "@/lib/explorer/url";

// Local synthetic fixture factory — not a product API or historical claim
function syntheticSpan(startYear: number, endYear: number | null, slug = `synthetic-${startYear}-${endYear ?? "single"}`): ExplorerEvent {
  return {
    id: `id-${slug}`,
    slug,
    title: `Synthetic ${slug}`,
    summary: "Synthetic test summary.",
    dateText: endYear ? `${startYear}–${endYear}` : `${startYear}`,
    datePrecision: endYear ? "period" : "year",
    isFeatured: false,
    topicSlugs: [],
    secondaryTopics: [],
    year: startYear,
    startYear,
    endYear,
    locations: [],
    sourceCount: 1,
  };
}

describe("filterExplorerEvents and getExplorerLimits (synthetic fixtures)", () => {
  it("evaluates inclusive interval overlap and treats null endYear as startYear only", () => {
    expect(filterExplorerEvents([syntheticSpan(10, 20)], 20, 25)).toHaveLength(1);
    expect(filterExplorerEvents([syntheticSpan(10, 20)], 21, 25)).toHaveLength(0);
    expect(filterExplorerEvents([syntheticSpan(10, null)], 11, 25)).toHaveLength(0);
    expect(filterExplorerEvents([syntheticSpan(10, null)], 10, 25)).toHaveLength(1);
    expect(filterExplorerEvents([syntheticSpan(10, 20)], 5, 10)).toHaveLength(1);
    expect(filterExplorerEvents([syntheticSpan(10, 20)], 5, 9)).toHaveLength(0);
  });

  it("retains events without locations or coordinates when their years match", () => {
    const noLocationEvent = syntheticSpan(1945, null, "synthetic-no-location");
    expect(filterExplorerEvents([noLocationEvent], 1940, 1950)).toEqual([noLocationEvent]);
  });

  it("returns null limits for empty event arrays and computes minYear/maxYear/eventSlugs from start and end years", () => {
    expect(getExplorerLimits([])).toBeNull();

    const events = [
      syntheticSpan(1930, null, "evt-a"),
      syntheticSpan(1945, 1954, "evt-b"),
      syntheticSpan(1950, 1975, "evt-c"),
    ];
    expect(getExplorerLimits(events)).toEqual({
      minYear: 1930,
      maxYear: 1975,
      eventSlugs: ["evt-a", "evt-b", "evt-c"],
    });
  });
});

describe("parseExplorerState and buildExplorerUrl (synthetic limits)", () => {
  const limits: ExplorerLimits = {
    minYear: 1930,
    maxYear: 1975,
    eventSlugs: ["evt-a", "evt-b"],
  };

  it("parses valid years, known selected event, and valid camera view, and round-trips via buildExplorerUrl", () => {
    const params = new URLSearchParams({
      tu: "1945",
      den: "1954",
      "su-kien": "evt-b",
      goc: "0.1234,0.85,95.5,-10.25,15.5",
    });
    const state = parseExplorerState(params, limits);
    expect(state).toEqual({
      from: 1945,
      to: 1954,
      selectedEvent: "evt-b",
      view: {
        azimuth: 0.123,
        polar: 0.85,
        distance: 95.5,
        targetX: -10.25,
        targetZ: 15.5,
      },
    });

    const url = buildExplorerUrl(state);
    expect(url).toBe("/?tu=1945&den=1954&su-kien=evt-b&goc=0.123,0.85,95.5,-10.25,15.5");
  });

  it("resets malformed or incomplete years to the full known range", () => {
    for (const query of [
      "tu=abc&den=1954",
      "tu=1945.5&den=1954",
      "tu=1945",
      "",
    ]) {
      const state = parseExplorerState(new URLSearchParams(query), limits);
      expect([state.from, state.to], query).toEqual([1930, 1975]);
    }
  });

  it("clears unknown selected event slugs and ignores absent, malformed, or out-of-bounds camera parameters", () => {
    expect(parseExplorerState(new URLSearchParams("su-kien=unknown-slug"), limits).selectedEvent).toBeNull();
    expect(parseExplorerState(new URLSearchParams("su-kien=__proto__"), limits).selectedEvent).toBeNull();
    expect(parseExplorerState(new URLSearchParams(""), limits).view).toBeNull();

    for (const badCamera of [
      "1,2,3",
      "0,0.8,100,0,0,1",
      "NaN,0.8,100,0,0",
      "0,0.2,100,0,0", // polar < 0.25
      "0,1.4,100,0,0", // polar > 1.35
      "0,0.8,20,0,0", // distance < 25
      "0,0.8,260,0,0", // distance > 250
      "0,0.8,100,75,0", // |targetX| > 70
      "0,0.8,100,0,-71", // |targetZ| > 70
      "a".repeat(200), // overly long camera string
    ]) {
      const state = parseExplorerState(new URLSearchParams({ goc: badCamera }), limits);
      expect(state.view, badCamera).toBeNull();
    }
  });
});

describe("buildEventDetailHref and getExplorerReturnHref", () => {
  it("embeds a sanitized explorer return path into kham-pha and reconstructs only allowlisted parameters", () => {
    const href = buildEventDetailHref("chien-dich-dien-bien-phu", {
      from: 1945,
      to: 1954,
      selectedEvent: "chien-dich-dien-bien-phu",
      view: { azimuth: 0, polar: 0.8, distance: 100, targetX: 0, targetZ: 0 },
    });
    expect(href.startsWith("/su-kien/chien-dich-dien-bien-phu?kham-pha=")).toBe(true);

    const parsed = new URL(href, "http://localhost");
    const restored = getExplorerReturnHref(parsed.searchParams.get("kham-pha"), "chien-dich-dien-bien-phu");
    expect(restored).toBe("/?tu=1945&den=1954&su-kien=chien-dich-dien-bien-phu&goc=0,0.8,100,0,0");
  });

  it("rejects external URLs, protocol-relative URLs, backslashes, other pathnames, and unrecognized parameters", () => {
    for (const unsafe of [
      "https://evil.example/phish",
      "http://evil.example",
      "//evil.example/path",
      "/\\evil.example",
      "\\evil.example",
      "javascript:alert(1)",
      "/quan-tri?tu=1945&den=1954",
      "/?tu=1945&den=1954&evil=1",
      null,
      undefined,
      123,
    ]) {
      expect(getExplorerReturnHref(unsafe, "chien-dich-dien-bien-phu"), String(unsafe)).toBe(
        "/?su-kien=chien-dich-dien-bien-phu",
      );
    }
  });
});
