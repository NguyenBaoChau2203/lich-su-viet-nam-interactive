import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { HISTORY_JOURNEY, getJourneyStop, parseJourneySelection, type HistoryJourney } from "@/lib/explorer/journey";
import { createJourneyRegistry, JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import { buildMapExplorerUrl, parseMapExplorerState } from "@/lib/explorer/map-state";
import { getExplorerReturnHref } from "@/lib/explorer/url";

// Structural fixtures only: never registered or bundled as production history.
function fixture(id: string, stopIds = ["shared-stop", `${id}-last`]): HistoryJourney {
  return { ...HISTORY_JOURNEY, id, title: `Synthetic ${id}`, period: id, lessonSlugs: [],
    stops: stopIds.map((stopId, index) => ({ ...HISTORY_JOURNEY.stops[index], id: stopId })) };
}
const limits = { minYear: 1954, maxYear: 1975, eventSlugs: [] };

describe("validated journey registry", () => {
  it("retains the unchanged legacy default alongside the three accepted milestone sequences", () => {
    expect(JOURNEY_REGISTRY.journeys.map((journey) => journey.id)).toEqual([
      "ho-chi-minh-1911-1941", "mua-thu-doc-lap-1945", "khang-chien-chong-phap-1946-1954", "mua-xuan-1975", "hanh-trinh-tong-hop",
    ]);
    expect(JOURNEY_REGISTRY.getJourneyById(HISTORY_JOURNEY.id)).toBe(HISTORY_JOURNEY);
    expect(getJourneyStop(HISTORY_JOURNEY.id, "paris-1919")).toBe(HISTORY_JOURNEY.stops[3]);
    expect(getJourneyStop("unknown", "paris-1919")).toBeUndefined();
  });

  it("preserves every legacy claim, source, date, coordinate and ID byte for byte as JSON", () => {
    const { lessonSlugs, ...legacy } = HISTORY_JOURNEY;
    expect(lessonSlugs).toEqual([]); // No new lesson mapping is claimed in Task 03.
    expect(createHash("sha256").update(JSON.stringify(legacy)).digest("hex"))
      .toBe("629469195e68027d1b3b7234d3e28c9282f1d99fcc09b5b666365e3dca7247e6");
  });

  it("allows shared stop IDs across records but never looks up a foreign stop", () => {
    const a = fixture("synthetic-a"), b = fixture("synthetic-b");
    const registry = createJourneyRegistry([a, b]);
    expect(registry.getJourneyStop(a.id, "shared-stop")).toBe(a.stops[0]);
    expect(registry.getJourneyStop(b.id, "shared-stop")).toBe(b.stops[0]);
    expect(registry.getJourneyStop(a.id, "synthetic-b-last")).toBeUndefined();
    expect(registry.getJourneyById("toString")).toBeUndefined();
  });

  it("rejects ambiguous, empty and unsafe registry records", () => {
    const a = fixture("synthetic-a");
    expect(() => createJourneyRegistry([])).toThrow();
    expect(() => createJourneyRegistry([a, a])).toThrow();
    expect(() => createJourneyRegistry([{ ...a, stops: [] }])).toThrow();
    expect(() => createJourneyRegistry([fixture("synthetic-a", ["duplicate", "duplicate"])])).toThrow();
    expect(() => createJourneyRegistry([fixture("unsafe&id")])).toThrow();
    expect(() => createJourneyRegistry([fixture("synthetic-a", ["unsafe?stop"])])).toThrow();
    expect(() => createJourneyRegistry([{ ...a, stops: [{ ...a.stops[0], view: { lat: NaN, lng: 0, zoom: 0 } }] }])).toThrow();
  });

  it("recovers a wrong-journey or unknown stop only within its selected journey", () => {
    const a = fixture("synthetic-a"), b = fixture("synthetic-b");
    const registry = createJourneyRegistry([a, b]);
    for (const stop of ["synthetic-a-last", "unknown", null]) {
      const state = parseMapExplorerState(new URLSearchParams({ "hanh-trinh": b.id, ...(stop ? { moc: stop } : {}) }), limits, registry);
      expect(state.journey).toEqual({ id: b.id, stop: b.stops[0].id });
      if (stop) expect(state.journeyNotice).toBeTruthy();
    }
    expect(parseMapExplorerState(new URLSearchParams("hanh-trinh=unknown&moc=shared-stop"), limits, registry).journey).toBeUndefined();
    expect(parseJourneySelection(HISTORY_JOURNEY.id, "unknown")).toEqual({ id: HISTORY_JOURNEY.id, stop: "sai-gon-1911" });
  });

  it("round trips a selected fixture despite exploration years and sanitizes its detail return", () => {
    const b = fixture("synthetic-b");
    const registry = createJourneyRegistry([fixture("synthetic-a"), b]);
    const href = "/?tu=1954&den=1975&hanh-trinh=synthetic-b&moc=synthetic-b-last";
    const state = parseMapExplorerState(new URL(href, "http://local").searchParams, limits, registry);
    expect(state.journey).toEqual({ id: b.id, stop: b.stops[1].id });
    expect(buildMapExplorerUrl(state, registry)).toBe(href);
    expect(getExplorerReturnHref(href, "fallback", registry)).toBe(href);
    expect(getExplorerReturnHref(href.replace("synthetic-b-last", "synthetic-a-last"), "fallback", registry))
      .toBe("/?tu=1954&den=1975&hanh-trinh=synthetic-b&moc=shared-stop");
    expect(getExplorerReturnHref(href.replace("synthetic-b&", "unknown&"), "fallback", registry)).toBe("/?su-kien=fallback");
  });
});
