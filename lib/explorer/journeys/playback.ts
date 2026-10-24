import type { GlobeCameraRequest } from "@/lib/explorer/globe-contract";
import { sameJourneyArrival, type JourneyArrival } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";
import type { MapExplorerState } from "@/lib/explorer/map-state";
import type { MapView } from "@/lib/explorer/map-view";

export const JOURNEY_DWELL_MS = 2000;

export type ExplorerRuntime = {
  state: MapExplorerState;
  exploration: MapExplorerState | null;
  cameraRequest: GlobeCameraRequest | null;
  settledArrival: JourneyArrival | null;
  requestNonce: number;
  restoreRequest: number;
  focusRequest: { slug: string; nonce: number } | null;
  playing: boolean; readerActive: boolean; hidden: boolean; reducedMotion: boolean; departing: boolean;
};

export type ExplorerAction =
  | { type: "choose-journey"; id: string }
  | { type: "seek"; stopId: string }
  | { type: "arrive" | "dwell"; arrival: JourneyArrival }
  | { type: "play" | "pause" | "manual" | "depart" | "exit" | "close-event" }
  | { type: "reading"; active: boolean }
  | { type: "visibility"; hidden: boolean }
  | { type: "motion"; reduced: boolean }
  | { type: "restore"; state: MapExplorerState }
  | { type: "select-event"; slug: string }
  | { type: "view"; view: MapView; arrival?: JourneyArrival }
  | { type: "period"; from: number; to: number; eventSlugs: readonly string[] };

function requestFor(state: MapExplorerState, nonce: number, registry: JourneyRegistry, instant = false): GlobeCameraRequest | null {
  const journey = state.journey;
  const stop = journey && registry.getJourneyStop(journey.id, journey.stop);
  return stop && journey ? { journeyId: journey.id, stopId: stop.id, nonce, view: stop.view, ...(instant ? { instant: true } : {}) } : null;
}

export function createExplorerRuntime(state: MapExplorerState, registry: JourneyRegistry = JOURNEY_REGISTRY): ExplorerRuntime {
  return { state, exploration: null, cameraRequest: requestFor(state, 0, registry, true),
    settledArrival: null, requestNonce: 0, restoreRequest: 0,
    focusRequest: !state.journey && state.selectedEvent && !state.view ? { slug: state.selectedEvent, nonce: 0 } : null,
    playing: false, readerActive: false, hidden: false, reducedMotion: false, departing: false };
}

function currentArrival(runtime: ExplorerRuntime, arrival: JourneyArrival): boolean {
  return !runtime.departing && !runtime.hidden && sameJourneyArrival(runtime.cameraRequest, arrival)
    && runtime.state.journey?.id === arrival.journeyId && runtime.state.journey.stop === arrival.stopId;
}

/** Pure transitions only. HistoryExplorer remains the sole runtime and timer owner. */
export function reduceExplorerRuntime(runtime: ExplorerRuntime, action: ExplorerAction, registry: JourneyRegistry = JOURNEY_REGISTRY): ExplorerRuntime {
  if (runtime.departing && action.type !== "restore") return runtime;
  const nonce = runtime.requestNonce + 1;
  const journey = runtime.state.journey && registry.getJourneyById(runtime.state.journey.id);
  const requestStop = (state: MapExplorerState, playing = false): ExplorerRuntime => ({ ...runtime, state,
    cameraRequest: requestFor(state, nonce, registry), settledArrival: null, requestNonce: nonce, playing });
  switch (action.type) {
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
    case "manual": case "depart":
      return { ...runtime, playing: false, cameraRequest: null, settledArrival: null, requestNonce: nonce, departing: action.type === "depart" };
    case "arrive":
      if (!currentArrival(runtime, action.arrival) || sameJourneyArrival(runtime.settledArrival, action.arrival)) return runtime;
      return { ...runtime, settledArrival: action.arrival,
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
    case "restore":
      return { ...runtime, state: action.state, playing: false, readerActive: false, departing: false,
        exploration: action.state.journey ? (runtime.state.journey ? runtime.exploration : runtime.state) : null,
        cameraRequest: requestFor(action.state, nonce, registry, true), settledArrival: null,
        requestNonce: nonce, restoreRequest: runtime.restoreRequest + 1,
        focusRequest: !action.state.journey && !action.state.view && action.state.selectedEvent ? { slug: action.state.selectedEvent, nonce } : runtime.focusRequest };
    case "exit":
      return { ...runtime, state: runtime.exploration ?? { ...runtime.state, journey: undefined, journeyNotice: undefined, view: null },
        exploration: null, playing: false, readerActive: false, cameraRequest: null, settledArrival: null,
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
