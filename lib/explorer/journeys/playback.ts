import type { GlobeCameraRequest } from "@/lib/explorer/globe-contract";
import { sameJourneyArrival, type JourneyArrival } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";
import type { MapExplorerState } from "@/lib/explorer/map-state";
import type { MapView } from "@/lib/explorer/map-view";
import { parseLocalHeroState, type LocalHeroRuntimeAction, type LocalHeroRuntimeState, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { normalizeLocalHeroFilters } from "@/lib/local-heroes/normalize";

export const JOURNEY_DWELL_MS = 2000;

export type ExplorerRuntime = {
  state: MapExplorerState;
  exploration: MapExplorerState | null;
  people: LocalHeroRuntimeState;
  cameraRequest: GlobeCameraRequest | null;
  settledArrival: JourneyArrival | null;
  requestNonce: number;
  restoreRequest: number;
  focusRequest: { slug: string; nonce: number } | null;
  popupOpen: boolean;
  readerDismissed: boolean;
  playing: boolean; readerActive: boolean; hidden: boolean; reducedMotion: boolean; departing: boolean;
};

export type ExplorerAction =
  | LocalHeroRuntimeAction
  | { type: "choose-journey"; id: string }
  | { type: "seek"; stopId: string }
  | { type: "arrive" | "dwell"; arrival: JourneyArrival }
  | { type: "play" | "pause" | "manual" | "depart" | "exit" | "close-event" | "close-reader" }
  | { type: "open-reader"; unavailable?: boolean }
  | { type: "reading"; active: boolean }
  | { type: "visibility"; hidden: boolean }
  | { type: "motion"; reduced: boolean }
  | { type: "restore"; state: MapExplorerState; people?: LocalHeroUrlState }
  | { type: "select-event"; slug: string }
  | { type: "view"; view: MapView; arrival?: JourneyArrival }
  | { type: "period"; from: number; to: number; eventSlugs: readonly string[] };

function requestFor(state: MapExplorerState, nonce: number, registry: JourneyRegistry, instant = false): GlobeCameraRequest | null {
  const journey = state.journey;
  const stop = journey && registry.getJourneyStop(journey.id, journey.stop);
  return stop && journey ? { journeyId: journey.id, stopId: stop.id, nonce, view: stop.view, ...(instant ? { instant: true } : {}) } : null;
}

export function createExplorerRuntime(state: MapExplorerState, registry: JourneyRegistry = JOURNEY_REGISTRY, discovery: LocalHeroUrlState = parseLocalHeroState(new URLSearchParams())): ExplorerRuntime {
  const isSuspended = discovery.mode !== "events";
  const people: LocalHeroRuntimeState = {
    discovery: {
      mode: discovery.mode,
      filters: normalizeLocalHeroFilters(discovery.filters),
      ...(discovery.mode === "places" ? { place: discovery.place ?? null } : {}),
    },
    suspended: isSuspended ? { state: structuredClone(state), exploration: null } : null,
  };
  return {
    state,
    people,
    exploration: null,
    cameraRequest: isSuspended ? null : requestFor(state, 0, registry, true),
    settledArrival: null,
    requestNonce: 0,
    restoreRequest: 0,
    focusRequest: !isSuspended && !state.journey && state.selectedEvent && !state.view ? { slug: state.selectedEvent, nonce: 0 } : null,
    popupOpen: false,
    readerDismissed: false,
    playing: false,
    readerActive: false,
    hidden: false,
    reducedMotion: false,
    departing: false,
  };
}

function currentArrival(runtime: ExplorerRuntime, arrival: JourneyArrival): boolean {
  return !runtime.departing && !runtime.hidden && sameJourneyArrival(runtime.cameraRequest, arrival)
    && runtime.state.journey?.id === arrival.journeyId && runtime.state.journey.stop === arrival.stopId;
}

/** Pure transitions only. HistoryExplorer remains the sole runtime and timer owner. */
export function reduceExplorerRuntime(runtime: ExplorerRuntime, action: ExplorerAction, registry: JourneyRegistry = JOURNEY_REGISTRY): ExplorerRuntime {
  if (runtime.departing && action.type !== "restore") return runtime;
  if (runtime.people.discovery.mode !== "events" && ["choose-journey", "seek", "play", "arrive", "dwell", "reading", "open-reader", "select-event", "period", "close-event", "view", "exit"].includes(action.type)) return runtime;
  const nonce = runtime.requestNonce + 1;
  const journey = runtime.state.journey && registry.getJourneyById(runtime.state.journey.id);
  const requestStop = (state: MapExplorerState, playing = false): ExplorerRuntime => ({ ...runtime, state,
    cameraRequest: requestFor(state, nonce, registry), settledArrival: null, requestNonce: nonce, playing, popupOpen: false, readerDismissed: false, readerActive: false });
  switch (action.type) {
    case "locality-select":
    case "locality-clear-selection": {
      if (runtime.people.discovery.mode === "events") return runtime;
      const code = action.type === "locality-select" ? action.code : null;
      const filters = normalizeLocalHeroFilters({ localityCode: code, query: "", page: 1 });
      if (runtime.people.discovery.mode === "locality" && runtime.people.discovery.filters.localityCode === filters.localityCode) return runtime;
      return { ...runtime, people: { ...runtime.people, discovery: { mode: "locality", filters } },
        cameraRequest: null, settledArrival: null, focusRequest: null, requestNonce: nonce, playing: false };
    }
    case "locality-exit-to-explore": {
      const suspended = runtime.people.suspended;
      if (runtime.people.discovery.mode === "events" || !suspended) return runtime;
      // X intentionally exits the journey. Explicit restore/Back and people-exit
      // retain their saved-context semantics independently of this action.
      const ordinary = suspended.state.journey ? suspended.exploration : suspended.state;
      const state: MapExplorerState = ordinary ? structuredClone(ordinary) : {
        ...suspended.state, journey: undefined, journeyNotice: undefined, selectedEvent: null,
      };
      return { ...runtime, state, exploration: null,
        people: { discovery: { mode: "events", filters: normalizeLocalHeroFilters({}) }, suspended: null },
        playing: false, readerActive: false, popupOpen: false, readerDismissed: true,
        cameraRequest: null, settledArrival: null, focusRequest: null,
        requestNonce: nonce, restoreRequest: runtime.restoreRequest + 1 };
    }
    case "people-enter": {
      const targetMode = action.mode ?? "people";
      if (runtime.people.discovery.mode === targetMode) return runtime;
      if (runtime.people.discovery.mode !== "events") {
        const nextDiscovery: LocalHeroUrlState = {
          ...runtime.people.discovery,
          mode: targetMode,
        };
        if (targetMode === "locality") nextDiscovery.filters = { localityCode: nextDiscovery.filters.localityCode, query: "", page: 1 };
        if (targetMode === "places") {
          nextDiscovery.place = runtime.people.discovery.place ?? null;
        } else {
          delete nextDiscovery.place;
        }
        return {
          ...runtime,
          people: {
            ...runtime.people,
            discovery: nextDiscovery,
          },
        };
      }
      const nextDiscovery: LocalHeroUrlState = {
        ...runtime.people.discovery,
        mode: targetMode,
      };
      if (targetMode === "locality") nextDiscovery.filters = { localityCode: nextDiscovery.filters.localityCode, query: "", page: 1 };
      if (targetMode === "places") nextDiscovery.place = null;
      else delete nextDiscovery.place;
      return {
        ...runtime,
        state: structuredClone(runtime.state),
        exploration: structuredClone(runtime.exploration),
        people: {
          discovery: nextDiscovery,
          suspended: structuredClone({ state: runtime.state, exploration: runtime.exploration }),
        },
        playing: false,
        readerActive: false,
        popupOpen: false,
        readerDismissed: true,
        cameraRequest: null,
        settledArrival: null,
        focusRequest: null,
        requestNonce: nonce,
      };
    }
    case "place-select":
      if (runtime.people.discovery.mode !== "places") return runtime;
      return {
        ...runtime,
        people: {
          ...runtime.people,
          discovery: {
            ...runtime.people.discovery,
            place: action.slug,
          },
        },
      };
    case "people-change": {
      const previous = runtime.people.discovery.filters, filters = normalizeLocalHeroFilters(action.filters);
      if (filters.localityCode !== previous.localityCode || filters.query !== previous.query) filters.page = 1;
      const localityChanged = filters.localityCode !== previous.localityCode;
      const nextDiscovery: LocalHeroUrlState = {
        ...runtime.people.discovery,
        filters,
      };
      if (runtime.people.discovery.mode === "places") {
        nextDiscovery.place = localityChanged && !action.keepPlace ? null : (runtime.people.discovery.place ?? null);
      } else {
        delete nextDiscovery.place;
      }
      return { ...runtime, people: { ...runtime.people, discovery: nextDiscovery } };
    }
    case "people-exit": {
      const suspended = runtime.people.suspended;
      if (!suspended) return runtime;
      const state = structuredClone(suspended.state), cameraRequest = requestFor(state, nonce, registry, true);
      const nextDiscovery: LocalHeroUrlState = {
        ...runtime.people.discovery,
        mode: "events",
      };
      delete nextDiscovery.place;
      return { ...runtime, state, exploration: structuredClone(suspended.exploration),
        people: { discovery: nextDiscovery, suspended: null },
        playing: false, readerActive: false, popupOpen: false, readerDismissed: true, focusRequest: null,
        cameraRequest: cameraRequest && { ...cameraRequest, view: state.view ?? cameraRequest.view }, settledArrival: null, requestNonce: nonce, restoreRequest: runtime.restoreRequest + 1 };
    }
    case "choose-journey": {
      const selected = registry.getJourneyById(action.id);
      if (!selected) return runtime;
      const state = { ...runtime.state, journey: { id: selected.id, stop: selected.stops[0].id }, selectedEvent: null, journeyNotice: undefined };
      return { ...requestStop(state), exploration: runtime.state.journey ? runtime.exploration : runtime.state };
    }
    case "seek": {
      if (!journey || !registry.getJourneyStop(journey.id, action.stopId)) return runtime;
      return requestStop({ ...runtime.state, journey: { id: journey.id, stop: action.stopId }, journeyNotice: undefined });
    }
    case "play":
      if (!journey || runtime.readerActive || runtime.hidden || runtime.reducedMotion || runtime.state.journey?.stop === journey.stops.at(-1)?.id) return runtime;
      return requestStop(runtime.state, true);
    case "pause": return { ...runtime, playing: false };
    case "close-reader": return { ...runtime, popupOpen: false, readerDismissed: true, playing: false, readerActive: false };
    case "open-reader": return journey && (action.unavailable || !runtime.cameraRequest || sameJourneyArrival(runtime.cameraRequest, runtime.settledArrival))
      ? { ...runtime, popupOpen: true, readerDismissed: false, playing: false } : runtime;
    case "manual": case "depart":
      return { ...runtime, playing: false, cameraRequest: null, settledArrival: null, requestNonce: nonce, departing: action.type === "depart" };
    case "arrive":
      if (!currentArrival(runtime, action.arrival) || sameJourneyArrival(runtime.settledArrival, action.arrival)) return runtime;
      return { ...runtime, settledArrival: action.arrival, popupOpen: true, readerDismissed: false,
        playing: runtime.playing && action.arrival.stopId !== journey?.stops.at(-1)?.id };
    case "dwell": {
      if (!runtime.playing || runtime.readerActive || runtime.reducedMotion || !currentArrival(runtime, action.arrival)
        || !sameJourneyArrival(runtime.settledArrival, action.arrival) || !journey) return runtime;
      const index = journey.stops.findIndex((stop) => stop.id === action.arrival.stopId);
      const next = journey.stops[index + 1];
      return next ? requestStop({ ...runtime.state, journey: { id: journey.id, stop: next.id } }, true) : { ...runtime, playing: false };
    }
    case "reading": return { ...runtime, readerActive: action.active, playing: runtime.playing && !action.active };
    case "visibility": return { ...runtime, hidden: action.hidden, playing: runtime.playing && !action.hidden };
    case "motion": return { ...runtime, reducedMotion: action.reduced, playing: runtime.playing && !action.reduced };
    case "restore": {
      const exploration = action.state.journey ? (runtime.state.journey ? runtime.exploration : runtime.state) : null;
      const restored = createExplorerRuntime(action.state, registry, action.people);
      if (restored.people.suspended) restored.people.suspended.exploration = structuredClone(exploration);
      return { ...runtime, ...restored, hidden: runtime.hidden, reducedMotion: runtime.reducedMotion, exploration,
        requestNonce: nonce, restoreRequest: runtime.restoreRequest + 1,
        focusRequest: restored.focusRequest && { ...restored.focusRequest, nonce },
        cameraRequest: restored.cameraRequest && { ...restored.cameraRequest, nonce } };
    }
    case "exit":
      return { ...runtime, state: runtime.exploration ?? { ...runtime.state, journey: undefined, journeyNotice: undefined, view: null },
        exploration: null, playing: false, readerActive: false, cameraRequest: null, settledArrival: null, popupOpen: false,
        requestNonce: nonce, restoreRequest: runtime.restoreRequest + 1 };
    case "select-event":
      return { ...runtime, state: { ...runtime.state, journey: undefined, journeyNotice: undefined, selectedEvent: action.slug },
        playing: false, cameraRequest: null, settledArrival: null, exploration: null, requestNonce: nonce,
        focusRequest: { slug: action.slug, nonce } };
    case "close-event": return { ...runtime, state: { ...runtime.state, selectedEvent: null } };
    case "view": {
      if (action.arrival && !currentArrival(runtime, action.arrival)) return runtime;
      const before = runtime.state.view, view = action.view;
      return before?.lat === view.lat && before.lng === view.lng && before.zoom === view.zoom ? runtime : { ...runtime, state: { ...runtime.state, view } };
    }
    case "period":
      if (runtime.state.journey) return runtime;
      return { ...runtime, state: { ...runtime.state, from: action.from, to: action.to,
        selectedEvent: action.eventSlugs.includes(runtime.state.selectedEvent ?? "") ? runtime.state.selectedEvent : null } };
  }
}

/** One cancellable dwell, scheduled by the owner's effect only after validated arrival. */
export function scheduleJourneyDwell(runtime: Pick<ExplorerRuntime, "settledArrival" | "cameraRequest" | "playing" | "readerActive" | "hidden" | "reducedMotion" | "departing">, advance: (arrival: JourneyArrival) => void): () => void {
  const arrival = runtime.settledArrival;
  if (!arrival || !runtime.playing || runtime.readerActive || runtime.reducedMotion || runtime.hidden || runtime.departing
    || !sameJourneyArrival(runtime.cameraRequest, arrival)) return () => {};
  const timer = setTimeout(() => advance(arrival), JOURNEY_DWELL_MS);
  return () => clearTimeout(timer);
}
