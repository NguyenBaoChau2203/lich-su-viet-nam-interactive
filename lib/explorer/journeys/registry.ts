import type { HistoryJourney, JourneyStop } from "@/lib/explorer/journey";
import { HISTORY_JOURNEY } from "@/lib/explorer/journeys/ho-chi-minh";
import { MUA_THU_DOC_LAP_1945 } from "@/lib/explorer/journeys/mua-thu-doc-lap-1945";
import { KHANG_CHIEN_CHONG_PHAP_1946_1954 } from "@/lib/explorer/journeys/khang-chien-chong-phap-1946-1954";
import { MUA_XUAN_1975 } from "@/lib/explorer/journeys/mua-xuan-1975";
import { formatMapView, parseMapView } from "@/lib/explorer/map-view";

export type JourneyRegistry = {
  readonly journeys: readonly HistoryJourney[];
  getJourneyById(id: string): HistoryJourney | undefined;
  getJourneyStop(journeyId: string, stopId: string): JourneyStop | undefined;
};

/** Validate identity once. Stop IDs are unique within a journey, not globally. */
export function createJourneyRegistry(records: readonly HistoryJourney[]): JourneyRegistry {
  if (!records.length) throw new Error("A journey registry needs at least one journey");
  const byId = new Map<string, HistoryJourney>();
  const stops = new Map<string, Map<string, JourneyStop>>();
  const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  for (const journey of records) {
    if (!slug.test(journey.id) || byId.has(journey.id) || !journey.stops.length)
      throw new Error(`Invalid or duplicate journey: ${journey.id}`);
    const members = new Map<string, JourneyStop>();
    for (const stop of journey.stops) {
      if (!slug.test(stop.id) || members.has(stop.id) || !parseMapView(formatMapView(stop.view)))
        throw new Error(`Invalid or duplicate journey stop: ${journey.id}/${stop.id}`);
      members.set(stop.id, stop);
    }
    byId.set(journey.id, journey);
    stops.set(journey.id, members);
  }
  return Object.freeze({
    journeys: Object.freeze([...records]),
    getJourneyById: (id: string) => byId.get(id),
    getJourneyStop: (journeyId: string, stopId: string) => stops.get(journeyId)?.get(stopId),
  });
}

export const JOURNEY_REGISTRY = createJourneyRegistry([
  HISTORY_JOURNEY, MUA_THU_DOC_LAP_1945, KHANG_CHIEN_CHONG_PHAP_1946_1954, MUA_XUAN_1975,
]);
export const DEFAULT_JOURNEY_ID = HISTORY_JOURNEY.id;
