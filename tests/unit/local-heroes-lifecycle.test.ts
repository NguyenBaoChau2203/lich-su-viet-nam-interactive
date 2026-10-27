import { describe, expect, it } from "vitest";
import { createExplorerRuntime, reduceExplorerRuntime as reduce } from "@/lib/explorer/journeys/playback";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
const state = { from: 1911, to: 1975, selectedEvent: "synthetic-event", view: { lat: 21, lng: 105, zoom: 5 } };
describe("people mode in the existing explorer owner", () => {
  it("gives restored event focus a fresh intent after the common restore transition", () => {
    const selected = { ...state, view: null };
    let r = createExplorerRuntime(selected); const previous = r.focusRequest!.nonce;
    r = reduce(r, { type: "manual" }); r = reduce(r, { type: "restore", state: selected });
    expect(r.focusRequest!.nonce).toBeGreaterThan(previous);
  });
  it("pauses playback, invalidates arrival and preserves both nested snapshots on entry and exit", () => {
    let r = reduce(createExplorerRuntime(state), { type: "choose-journey", id: "ho-chi-minh-1911-1941" });
    r = reduce(r, { type: "play" }); expect(r.playing).toBe(true);
    const before = structuredClone(r), stale = r.cameraRequest!;
    r = reduce(r, { type: "people-enter" });
    expect(r.playing).toBe(false); expect(r.cameraRequest).toBeNull(); expect(r.focusRequest).toBeNull(); expect(r.popupOpen).toBe(false);
    expect(r.people.discovery.mode).toBe("people"); expect(r.people.suspended?.state).toEqual(before.state); expect(r.people.suspended?.exploration).toEqual(state);
    expect(reduce(r, { type: "arrive", arrival: stale })).toBe(r); expect(reduce(r, { type: "dwell", arrival: stale })).toBe(r);
    expect(reduce(r, { type: "view", view: { lat: 1, lng: 2, zoom: 3 }, arrival: stale })).toBe(r);
    expect(reduce(r, { type: "play" }).playing).toBe(false);
    r.state.view!.lat = 1;
    r = reduce(r, { type: "people-exit" }); expect(r.state).toEqual(before.state); expect(r.exploration).toEqual(state); expect(r.playing).toBe(false);
    expect(r.restoreRequest).toBeGreaterThan(before.restoreRequest);
    expect(reduce(r, { type: "exit" }).state).toEqual(state);
  });
  it("resets only people pagination on filter changes and preserves inactive preferences", () => {
    let r = reduce(createExplorerRuntime(state), { type: "people-enter" });
    r = reduce(r, { type: "people-change", filters: { localityCode: "01", query: "", page: 8 } }); expect(r.people.discovery.filters.page).toBe(1);
    r = reduce(r, { type: "people-change", filters: { localityCode: "01", query: "", page: 3 } }); expect(r.people.discovery.filters.page).toBe(3);
    r = reduce(r, { type: "people-change", filters: { localityCode: "01", query: "Bí danh", page: 3 } }); expect(r.people.discovery.filters.page).toBe(1);
    r = reduce(r, { type: "people-exit" }); expect(r.people.discovery).toEqual({ mode: "events", filters: { localityCode: "01", query: "Bí danh", page: 1 } });
    expect(r.state).toEqual(state); expect(reduce(r, { type: "people-enter" }).people.discovery.filters.query).toBe("Bí danh");
  });
  it("reconstructs deep links and browser restoration paused, clearing departure without sharing snapshots", () => {
    const discovery = { mode: "people" as const, filters: { localityCode: "04" as const, query: "Đặng", page: 2 } };
    let r = createExplorerRuntime(state, JOURNEY_REGISTRY, discovery);
    expect(r.people.suspended?.state).toEqual(state); expect(r.people.suspended?.state).not.toBe(state); expect(r.cameraRequest).toBeNull();
    r = reduce(r, { type: "depart" }); expect(r.departing).toBe(true);
    r = reduce(r, { type: "restore", state, people: discovery }); expect(r.departing).toBe(false); expect(r.playing).toBe(false); expect(r.people.discovery).toEqual(discovery);
    r = reduce(r, { type: "restore", state }); expect(r.people.discovery).toEqual({ mode: "events", filters: { localityCode: null, query: "", page: 1 } });
  });
});
