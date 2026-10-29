import { describe, expect, it } from "vitest";
import {
  parseLocalHeroState,
  localHeroParams,
  buildLocalHeroHomeHref,
  buildLocalHeroDetailHref,
  buildPlaceDetailHref,
  normalizeLocalHeroReturnHref,
} from "@/lib/local-heroes/state";
import {
  createExplorerRuntime,
  reduceExplorerRuntime,
} from "@/lib/explorer/journeys/playback";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import type { MapExplorerState } from "@/lib/explorer/map-state";

const map: MapExplorerState = {
  from: 1911,
  to: 1975,
  selectedEvent: "synthetic-event",
  view: { lat: 21, lng: 105, zoom: 5 },
};

describe("locality overview URL and return contract (Task 2)", () => {
  it("round-trips noi-dung=dia-phuong and valid localityCode", () => {
    const state = {
      mode: "locality" as const,
      filters: { localityCode: "01" as const, query: "", page: 1 },
    };
    const href = buildLocalHeroHomeHref(map, state);
    const params = new URL(href, "https://example.invalid").searchParams;

    expect(params.get("noi-dung")).toBe("dia-phuong");
    expect(params.get("dia-phuong")).toBe("ha-noi");
    expect(params.has("q-nhan-vat")).toBe(false);
    expect(params.has("trang-nhan-vat")).toBe(false);
    expect(params.has("dia-danh")).toBe(false);

    const parsed = parseLocalHeroState(params);
    expect(parsed.mode).toBe("locality");
    expect(parsed.filters.localityCode).toBe("01");
    expect(parsed.filters.query).toBe("");
    expect(parsed.filters.page).toBe(1);
    expect(parsed.place ?? null).toBeNull();
  });

  it("parses overview without locality as chooser state (localityCode = null)", () => {
    const params = new URLSearchParams("noi-dung=dia-phuong");
    const parsed = parseLocalHeroState(params);
    expect(parsed.mode).toBe("locality");
    expect(parsed.filters.localityCode).toBeNull();
    expect(parsed.filters.query).toBe("");
    expect(parsed.filters.page).toBe(1);

    const serialized = localHeroParams(parsed);
    expect(serialized.get("noi-dung")).toBe("dia-phuong");
    expect(serialized.has("dia-phuong")).toBe(false);
  });

  it("normalizes invalid locality slug safely to null in overview mode", () => {
    const params = new URLSearchParams("noi-dung=dia-phuong&dia-phuong=unknown-locality");
    const parsed = parseLocalHeroState(params);
    expect(parsed.mode).toBe("locality");
    expect(parsed.filters.localityCode).toBeNull();
  });

  it("enforces empty query and page 1 for overview mode without leaking catalog filters", () => {
    const params = new URLSearchParams(
      "noi-dung=dia-phuong&dia-phuong=quang-tri&q-nhan-vat=some-search&trang-nhan-vat=3&dia-danh=thanh-co",
    );
    const parsed = parseLocalHeroState(params);
    expect(parsed.mode).toBe("locality");
    expect(parsed.filters.localityCode).toBe("44");
    expect(parsed.filters.query).toBe("");
    expect(parsed.filters.page).toBe(1);
    expect(parsed.place ?? null).toBeNull();
  });

  it("preserves old URL modes: events, people, places", () => {
    expect(parseLocalHeroState(new URLSearchParams("noi-dung=dia-danh&dia-phuong=ha-noi")).mode).toBe("places");
    expect(parseLocalHeroState(new URLSearchParams("noi-dung=nhan-vat&dia-phuong=ha-noi")).mode).toBe("people");
    expect(parseLocalHeroState(new URLSearchParams("dia-phuong=ha-noi")).mode).toBe("events");
  });

  it("validates overview return URLs in normalizeLocalHeroReturnHref", () => {
    const validWithLocality = "/?noi-dung=dia-phuong&dia-phuong=ha-noi";
    expect(normalizeLocalHeroReturnHref(validWithLocality, "/fallback")).toBe(validWithLocality);

    const validChooser = "/?noi-dung=dia-phuong";
    expect(normalizeLocalHeroReturnHref(validChooser, "/fallback")).toBe(validChooser);

    const withMap = "/?tu=1911&den=1945&noi-dung=dia-phuong&dia-phuong=quang-tri";
    expect(normalizeLocalHeroReturnHref(withMap, "/fallback")).toBe(withMap);

    const withJourney = "/?hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911&noi-dung=dia-phuong&dia-phuong=ha-noi";
    expect(normalizeLocalHeroReturnHref(withJourney, "/fallback")).toBe(withJourney);
  });

  it("rejects invalid overview return URLs", () => {
    expect(normalizeLocalHeroReturnHref("/?noi-dung=dia-phuong&dia-phuong=not-real", "/fallback")).toBe("/fallback");
    expect(normalizeLocalHeroReturnHref("/?noi-dung=dia-phuong&noi-dung=dia-phuong", "/fallback")).toBe("/fallback");
    expect(normalizeLocalHeroReturnHref("/?noi-dung=dia-phuong&extra=param", "/fallback")).toBe("/fallback");
  });

  it("builds detail links with overview return URLs correctly", () => {
    const overviewHref = "/?noi-dung=dia-phuong&dia-phuong=quang-tri";
    const personDetail = buildLocalHeroDetailHref("synthetic-person", overviewHref);
    expect(personDetail).toBe(`/nhan-vat/synthetic-person?kham-pha=${encodeURIComponent(overviewHref)}`);

    const placeDetail = buildPlaceDetailHref("thanh-co-quang-tri", overviewHref);
    expect(placeDetail).toBe(`/dia-diem/thanh-co-quang-tri?kham-pha=${encodeURIComponent(overviewHref)}`);
  });
});

describe("locality overview runtime reducer (Task 2)", () => {
  it("entering discovery from an event URL clears retained people query/page preferences", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, { mode: "events", filters: { localityCode: "01", query: "alias", page: 2 } });
    const entered = reduceExplorerRuntime(runtime, { type: "people-enter", mode: "locality" });
    expect(entered.people.discovery.filters).toEqual({ localityCode: "01", query: "", page: 1 });
  });
  it("returning from searched/paginated full results requests an unfiltered first-page overview", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, { mode: "people", filters: { localityCode: "01", query: "alias", page: 2 } });
    const overview = reduceExplorerRuntime(runtime, { type: "people-enter", mode: "locality" });
    expect(overview.people.discovery.filters).toEqual({ localityCode: "01", query: "", page: 1 });
  });
  it("clears the province and selected place while remaining in discovery", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, {
      mode: "places", filters: { localityCode: "01", query: "alias", page: 2 }, place: "synthetic-place",
    });
    const cleared = reduceExplorerRuntime(runtime, { type: "locality-clear-selection" });
    expect(cleared.people.discovery).toEqual({ mode: "locality", filters: { localityCode: null, query: "", page: 1 } });
    expect(cleared.people.suspended).toEqual(runtime.people.suspended);
    expect(cleared.cameraRequest).toBeNull();
    expect(cleared.requestNonce).toBeGreaterThan(runtime.requestNonce);
  });

  it("selects a canonical province from every content mode with both groups open", () => {
    for (const mode of ["locality", "places", "people"] as const) {
      const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, { mode, filters: { localityCode: "01", query: "alias", page: 2 } });
      const selected = reduceExplorerRuntime(runtime, { type: "locality-select", code: "44" });
      expect(selected.people.discovery).toEqual({ mode: "locality", filters: { localityCode: "44", query: "", page: 1 } });
      expect(reduceExplorerRuntime(selected, { type: "locality-select", code: "44" })).toBe(selected);
    }
  });

  it("chooser X exits to the ordinary pre-journey snapshot without reviving playback", () => {
    let runtime = createExplorerRuntime(map, JOURNEY_REGISTRY);
    runtime = reduceExplorerRuntime(runtime, { type: "choose-journey", id: "ho-chi-minh-1911-1941" });
    const arrival = runtime.cameraRequest!;
    runtime = reduceExplorerRuntime(runtime, { type: "people-enter", mode: "locality" });
    const exited = reduceExplorerRuntime(runtime, { type: "locality-exit-to-explore" });
    expect(exited.state).toEqual(map);
    expect(exited.state.journey).toBeUndefined();
    expect(exited.people.discovery).toEqual({ mode: "events", filters: { localityCode: null, query: "", page: 1 } });
    expect(exited.people.suspended).toBeNull();
    expect(exited.cameraRequest).toBeNull();
    expect(exited.playing).toBe(false);
    expect(reduceExplorerRuntime(exited, { type: "arrive", arrival })).toBe(exited);
    expect(reduceExplorerRuntime(exited, { type: "locality-exit-to-explore" })).toBe(exited);
    expect(new URL(buildLocalHeroHomeHref(exited.state, exited.people.discovery), "https://example.invalid").searchParams.has("hanh-trinh")).toBe(false);
    const restored = reduceExplorerRuntime(exited, { type: "restore", state: runtime.state, people: runtime.people.discovery });
    expect(restored.people.discovery.mode).toBe("locality");
    expect(restored.people.suspended?.state.journey?.id).toBe("ho-chi-minh-1911-1941");
  });

  it("chooser X from a direct journey link keeps its validated period/view and clears journey/event", () => {
    const state = { ...map, journey: { id: "ho-chi-minh-1911-1941", stop: "sai-gon-1911" } };
    const runtime = createExplorerRuntime(state, JOURNEY_REGISTRY, { mode: "locality", filters: { localityCode: "01", query: "", page: 1 } });
    const exited = reduceExplorerRuntime(runtime, { type: "locality-exit-to-explore" });
    expect(exited.state).toEqual({ ...map, selectedEvent: null, journey: undefined, journeyNotice: undefined });
    expect(exited.exploration).toBeNull();
    expect(exited.restoreRequest).toBeGreaterThan(0);
  });

  it("enters overview mode from events mode and suspends exploration", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY);
    expect(runtime.people.discovery.mode).toBe("events");
    expect(runtime.people.suspended).toBeNull();

    const entered = reduceExplorerRuntime(runtime, {
      type: "people-enter",
      mode: "locality",
    });

    expect(entered.people.discovery.mode).toBe("locality");
    expect(entered.people.suspended).not.toBeNull();
    expect(entered.people.suspended?.state).toEqual(map);
    expect(entered.cameraRequest).toBeNull();
    expect(entered.playing).toBe(false);
  });

  it("switches among locality overview, places, and people without re-suspending", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, {
      mode: "locality",
      filters: { localityCode: "01", query: "", page: 1 },
    });
    expect(runtime.people.suspended).not.toBeNull();
    const originalSuspended = runtime.people.suspended;

    // Switch to places
    const toPlaces = reduceExplorerRuntime(runtime, {
      type: "people-enter",
      mode: "places",
    });
    expect(toPlaces.people.discovery.mode).toBe("places");
    expect(toPlaces.people.discovery.filters.localityCode).toBe("01");
    expect(toPlaces.people.suspended).toEqual(originalSuspended);

    // Switch to people
    const toPeople = reduceExplorerRuntime(toPlaces, {
      type: "people-enter",
      mode: "people",
    });
    expect(toPeople.people.discovery.mode).toBe("people");
    expect(toPeople.people.discovery.filters.localityCode).toBe("01");
    expect(toPeople.people.suspended).toEqual(originalSuspended);

    // Switch back to locality overview
    const toOverview = reduceExplorerRuntime(toPeople, {
      type: "people-enter",
      mode: "locality",
    });
    expect(toOverview.people.discovery.mode).toBe("locality");
    expect(toOverview.people.discovery.filters.localityCode).toBe("01");
    expect(toOverview.people.suspended).toEqual(originalSuspended);
  });

  it("updates localityCode in overview mode via people-change", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, {
      mode: "locality",
      filters: { localityCode: "01", query: "", page: 1 },
    });

    const changed = reduceExplorerRuntime(runtime, {
      type: "people-change",
      filters: { localityCode: "44", query: "", page: 1 },
    });
    expect(changed.people.discovery.filters.localityCode).toBe("44");

    // Clear to chooser
    const cleared = reduceExplorerRuntime(changed, {
      type: "people-change",
      filters: { localityCode: null, query: "", page: 1 },
    });
    expect(cleared.people.discovery.filters.localityCode).toBeNull();
  });

  it("exits overview mode via people-exit and restores suspended exploration state", () => {
    const runtime = createExplorerRuntime(map, JOURNEY_REGISTRY, {
      mode: "locality",
      filters: { localityCode: "01", query: "", page: 1 },
    });

    const exited = reduceExplorerRuntime(runtime, { type: "people-exit" });
    expect(exited.people.discovery.mode).toBe("events");
    expect(exited.people.suspended).toBeNull();
    expect(exited.state.from).toBe(map.from);
    expect(exited.state.to).toBe(map.to);
    expect(exited.state.selectedEvent).toBe(map.selectedEvent);
    expect(exited.restoreRequest).toBeGreaterThan(0);
  });

  it("entering overview during journey playback pauses journey and preserves journey state", () => {
    const journeyState: MapExplorerState = {
      from: 1911,
      to: 1941,
      selectedEvent: null,
      view: null,
      journey: { id: "ho-chi-minh-1911-1941", stop: "sai-gon-1911" },
    };
    let runtime = createExplorerRuntime(journeyState, JOURNEY_REGISTRY);
    runtime = reduceExplorerRuntime(runtime, { type: "play" });
    expect(runtime.playing).toBe(true);

    const entered = reduceExplorerRuntime(runtime, {
      type: "people-enter",
      mode: "locality",
    });
    expect(entered.playing).toBe(false);
    expect(entered.people.discovery.mode).toBe("locality");
    expect(entered.people.suspended?.state.journey?.id).toBe("ho-chi-minh-1911-1941");

    const exited = reduceExplorerRuntime(entered, { type: "people-exit" });
    expect(exited.people.discovery.mode).toBe("events");
    expect(exited.state.journey?.id).toBe("ho-chi-minh-1911-1941");
    expect(exited.state.journey?.stop).toBe("sai-gon-1911");
  });
});
