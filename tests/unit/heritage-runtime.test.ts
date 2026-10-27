import { describe, expect, it } from "vitest";
import {
  createExplorerRuntime,
  reduceExplorerRuntime,
} from "@/lib/explorer/journeys/playback";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import type { MapExplorerState } from "@/lib/explorer/map-state";

const initialMapState: MapExplorerState = {
  from: 1911,
  to: 1941,
  selectedEvent: "synthetic-event",
  view: { lat: 21.028, lng: 105.854, zoom: 6 },
};

describe("heritage places runtime reducer (Section 6.5)", () => {
  it("enters places mode from events mode and suspends exploration", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY);
    expect(runtime.people.discovery.mode).toBe("events");
    expect(runtime.people.suspended).toBeNull();

    const entered = reduceExplorerRuntime(runtime, {
      type: "people-enter",
      mode: "places",
    });

    expect(entered.people.discovery.mode).toBe("places");
    expect(entered.people.suspended).not.toBeNull();
    expect(entered.people.suspended?.state).toEqual(initialMapState);
    expect(entered.cameraRequest).toBeNull();
    expect(entered.playing).toBe(false);
  });

  it("switches from places mode to people mode without re-suspending", () => {
    const initialPlaces = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY, {
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: "thanh-co-quang-tri",
    });
    expect(initialPlaces.people.suspended).not.toBeNull();
    const originalSuspended = initialPlaces.people.suspended;

    const switchedToPeople = reduceExplorerRuntime(initialPlaces, {
      type: "people-enter",
      mode: "people",
    });

    expect(switchedToPeople.people.discovery.mode).toBe("people");
    // Preserves original localityCode
    expect(switchedToPeople.people.discovery.filters.localityCode).toBe("44");
    // Place is cleared when switching to people
    expect(switchedToPeople.people.discovery.place ?? null).toBeNull();
    // Suspended state is kept unchanged (no double suspension)
    expect(switchedToPeople.people.suspended).toEqual(originalSuspended);

    // Switch back to places
    const switchedBack = reduceExplorerRuntime(switchedToPeople, {
      type: "people-enter",
      mode: "places",
    });
    expect(switchedBack.people.discovery.mode).toBe("places");
    expect(switchedBack.people.discovery.filters.localityCode).toBe("44");
  });

  it("selects and deselects a place via place-select action", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY, {
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: null,
    });

    const selected = reduceExplorerRuntime(runtime, {
      type: "place-select",
      slug: "thanh-co-quang-tri",
    });
    expect(selected.people.discovery.place).toBe("thanh-co-quang-tri");

    const deselected = reduceExplorerRuntime(selected, {
      type: "place-select",
      slug: null,
    });
    expect(deselected.people.discovery.place).toBeNull();
  });

  it("clears selected place on locality change unless keepPlace is true", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY, {
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: "thanh-co-quang-tri",
    });

    // Locality changed without keepPlace -> clears place
    const changedLocality = reduceExplorerRuntime(runtime, {
      type: "people-change",
      filters: { localityCode: "01", query: "", page: 1 },
    });
    expect(changedLocality.people.discovery.filters.localityCode).toBe("01");
    expect(changedLocality.people.discovery.place).toBeNull();

    // Locality changed with keepPlace: true -> keeps place
    const keptPlace = reduceExplorerRuntime(runtime, {
      type: "people-change",
      filters: { localityCode: "01", query: "", page: 1 },
      keepPlace: true,
    });
    expect(keptPlace.people.discovery.place).toBe("thanh-co-quang-tri");
  });

  it("exits places mode and restores exact suspended explorer state", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY, {
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: "thanh-co-quang-tri",
    });

    const exited = reduceExplorerRuntime(runtime, { type: "people-exit" });
    expect(exited.people.discovery.mode).toBe("events");
    expect(exited.people.discovery.place ?? null).toBeNull();
    expect(exited.people.suspended).toBeNull();
    expect(exited.state).toEqual(initialMapState);
  });

  it("ignores explorer and journey playback actions while in places mode", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY, {
      mode: "places",
      filters: { localityCode: "44", query: "", page: 1 },
      place: null,
    });

    // Actions that must be ignored
    expect(reduceExplorerRuntime(runtime, { type: "choose-journey", id: "ho-chi-minh-1911-1941" })).toBe(runtime);
    expect(reduceExplorerRuntime(runtime, { type: "seek", stopId: "paris-1919" })).toBe(runtime);
    expect(reduceExplorerRuntime(runtime, { type: "play" })).toBe(runtime);
    expect(reduceExplorerRuntime(runtime, { type: "select-event", slug: "other-event" })).toBe(runtime);
    expect(reduceExplorerRuntime(runtime, { type: "period", from: 1945, to: 1954, eventSlugs: [] })).toBe(runtime);
  });

  it("restores places discovery from popstate / pageshow restore action", () => {
    const runtime = createExplorerRuntime(initialMapState, JOURNEY_REGISTRY);

    const restored = reduceExplorerRuntime(runtime, {
      type: "restore",
      state: initialMapState,
      people: {
        mode: "places",
        filters: { localityCode: "44", query: "", page: 1 },
        place: "thanh-co-quang-tri",
      },
    });

    expect(restored.people.discovery.mode).toBe("places");
    expect(restored.people.discovery.filters.localityCode).toBe("44");
    expect(restored.people.discovery.place).toBe("thanh-co-quang-tri");
    expect(restored.people.suspended).not.toBeNull();
  });
});
