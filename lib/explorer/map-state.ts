import type { ExplorerLimits, ExplorerState } from "@/lib/explorer/types";
import { formatMapView, parseMapView, type MapView } from "@/lib/explorer/map-view";
import { buildExplorerUrl, parseExplorerState } from "@/lib/explorer/url";
import { parseJourneySelection, type JourneySelection } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";

export type MapExplorerState = Omit<ExplorerState, "view"> & { view: MapView | null; journey?: JourneySelection; journeyNotice?: string };

export function parseMapExplorerState(params: URLSearchParams, limits: ExplorerLimits, registry: JourneyRegistry = JOURNEY_REGISTRY): MapExplorerState {
  const state = parseExplorerState(params, limits);
  const id = params.get("hanh-trinh"), stop = params.get("moc");
  const journey = parseJourneySelection(id, stop, registry);
  const journeyNotice = (id || stop) && !journey ? "Hành trình không khả dụng. Bạn có thể chọn hành trình khác."
    : journey && stop !== null && stop !== journey.stop ? "Mốc không thuộc hành trình đã chọn. Đã mở mốc đầu tiên." : undefined;
  return { ...state, view: parseMapView(params.get("ban-do")), ...(journey ? { journey } : {}), ...(journeyNotice ? { journeyNotice } : {}) };
}

export function buildMapExplorerUrl(state: MapExplorerState, registry: JourneyRegistry = JOURNEY_REGISTRY): string {
  const base = buildExplorerUrl({ ...state, view: null });
  const view = state.view ? `${base}&ban-do=${formatMapView(state.view)}` : base;
  const journey = state.journey && parseJourneySelection(state.journey.id, state.journey.stop, registry);
  return journey ? `${view}&hanh-trinh=${journey.id}&moc=${journey.stop}` : view;
}

export function buildMapEventHref(slug: string, state: MapExplorerState | null): string {
  const path = `/su-kien/${encodeURIComponent(slug)}`;
  return state ? `${path}?kham-pha=${encodeURIComponent(buildMapExplorerUrl({ ...state, selectedEvent: slug }))}` : path;
}
