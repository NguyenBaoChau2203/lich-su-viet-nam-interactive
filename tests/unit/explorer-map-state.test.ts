import { describe, expect, it } from "vitest";
import { formatMapView, parseMapView } from "@/lib/explorer/map-view";
import { buildMapEventHref, buildMapExplorerUrl, parseMapExplorerState } from "@/lib/explorer/map-state";
import { getExplorerReturnHref } from "@/lib/explorer/url";

const limits = { minYear: 1930, maxYear: 1975, eventSlugs: ["synthetic-a", "synthetic-b"] };

describe("geographic explorer state (synthetic limits)", () => {
  it("round trips a world view and a known paused journey stop", () => {
    const href = "/?tu=1930&den=1975&ban-do=0,20,0.8&hanh-trinh=ho-chi-minh-1911-1941&moc=paris-1919";
    const state = parseMapExplorerState(new URL(href, "http://local").searchParams, limits);
    expect(state.view).toEqual({ lat: 0, lng: 20, zoom: 0.8 });
    expect(state).toHaveProperty("journey", { id: "ho-chi-minh-1911-1941", stop: "paris-1919" });
    expect(buildMapExplorerUrl(state)).toBe(href);
    expect(getExplorerReturnHref(href, "synthetic-a")).toBe(href);
  });

  it("recovers unknown stops within a known journey in map and detail return URLs", () => {
    const raw = "tu=1930&den=1975&hanh-trinh=ho-chi-minh-1911-1941&moc=unverified-stop";
    expect(parseMapExplorerState(new URLSearchParams(raw), limits)).toMatchObject({
      journey: { id: "ho-chi-minh-1911-1941", stop: "sai-gon-1911" }, journeyNotice: expect.any(String),
    });
    expect(getExplorerReturnHref(`/?${raw}`, "synthetic-a")).toBe("/?tu=1930&den=1975&hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911");
  });
  it("round trips years, event, and geographic view without the old orbit camera", () => {
    const state = { from: 1945, to: 1954, selectedEvent: "synthetic-a", view: { lat: 21.123456, lng: 105.987654, zoom: 8 } };
    const href = buildMapExplorerUrl(state);
    expect(href).not.toContain("goc=");
    expect(parseMapExplorerState(new URL(href, "http://local").searchParams, limits)).toEqual({
      ...state, view: { lat: 21.12346, lng: 105.98765, zoom: 8 },
    });
    expect(getExplorerReturnHref(href, "synthetic-a")).toBe(href);
  });

  it.each(["NaN,105,7", "Infinity,105,7", "86,105,7", "21,181,7", "21,105,-1", "21,105,19", "21,105", "21,105,8,9", "0x10,105,7"])("rejects malformed view %s", (value) => {
    expect(parseMapView(value)).toBeNull();
  });

  it("accepts valid edge and zero coordinates and normalizes precision", () => {
    expect(parseMapView("0,0,4")).toEqual({ lat: 0, lng: 0, zoom: 4 });
    expect(parseMapView("-85,-180,18")).toEqual({ lat: -85, lng: -180, zoom: 18 });
    expect(formatMapView({ lat: 21.123456, lng: 105.123456, zoom: 7.123456 })).toBe("21.12346,105.12346,7.12");
  });

  it("recovers from stale event, reversed range, and a legacy 3D camera", () => {
    expect(parseMapExplorerState(new URLSearchParams("tu=1975&den=1930&su-kien=missing&goc=0,1,100,0,0"), limits)).toEqual({
      from: 1930, to: 1975, selectedEvent: null, view: null,
    });
  });

  it("preserves safe detail return context and rejects external and malformed destinations", () => {
    const state = { from: 1945, to: 1954, selectedEvent: "synthetic-a", view: { lat: 21, lng: 105, zoom: 7 } };
    const detail = new URL(buildMapEventHref("synthetic-a", state), "http://local");
    expect(detail.pathname).toBe("/su-kien/synthetic-a");
    expect(getExplorerReturnHref(detail.searchParams.get("kham-pha"), "synthetic-a")).toBe(buildMapExplorerUrl(state));
    for (const unsafe of ["//evil.example", "/\\evil.example", "https://evil.example", "/?ban-do=NaN,105,7", "/?ban-do=21,105,20", "/?unexpected=yes"]) {
      expect(getExplorerReturnHref(unsafe, "synthetic-a")).toBe("/?su-kien=synthetic-a");
    }
  });
});
