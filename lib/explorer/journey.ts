import type { MapView } from "@/lib/explorer/map-view";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";

export type JourneySource = { title: string; publisher: string; url: string; accessedAt: string; scope: string };
export type JourneyStop = {
  id: string; title: string; place: string; mapLabel?: string; date: string; sortDate: string;
  datePrecision: "day" | "month" | "year"; summary: string;
  accuracy: "approximate"; accuracyNote: string; coordinateSource: JourneySource;
  sources: readonly JourneySource[]; view: MapView; eventSlug?: string;
  origin?: { journeyId: string; stopId: string };
};
export type JourneySelection = { id: string; stop: string };

export type HistoryJourney = {
  id: string; title: string; period: string; note: string;
  lessonSlugs: readonly string[];
  stops: readonly JourneyStop[];
};
export type JourneyArrival = { journeyId: string; stopId: string; nonce: number };

export function sameJourneyArrival(a: JourneyArrival | null | undefined, b: JourneyArrival | null | undefined): boolean {
  return Boolean(a && b && a.journeyId === b.journeyId && a.stopId === b.stopId && a.nonce === b.nonce);
}

// Legacy data export; runtime selection always goes through the registry.
export { HISTORY_JOURNEY } from "@/lib/explorer/journeys/ho-chi-minh";
export const getJourneyById = JOURNEY_REGISTRY.getJourneyById;
export const getJourneyStop = JOURNEY_REGISTRY.getJourneyStop;

/** Ordered editorial connections; these are deliberately not transport routes. */
export function getJourneyConnections(journeyId: string, stopId: string): GeoJSON.FeatureCollection<GeoJSON.LineString, { schematic: boolean }> {
  const journey = getJourneyById(journeyId);
  const index = journey?.stops.findIndex((stop) => stop.id === stopId) ?? -1;
  return { type: "FeatureCollection", features: !journey || index < 1 ? [] : [{ type: "Feature", properties: { schematic: true },
    geometry: { type: "LineString", coordinates: journey.stops.slice(0, index + 1).map((stop) => [stop.view.lng, stop.view.lat]) } }] };
}

export function parseJourneySelection(id: string | null, stop: string | null, registry: JourneyRegistry = JOURNEY_REGISTRY): JourneySelection | undefined {
  const journey = id ? registry.getJourneyById(id) : undefined;
  if (!journey) return undefined;
  const known = (stop ? registry.getJourneyStop(journey.id, stop) : undefined) ?? journey.stops[0];
  return { id: journey.id, stop: known.id };
}
