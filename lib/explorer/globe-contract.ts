import type { JourneyArrival, JourneyStop } from "@/lib/explorer/journey";
import type { MapView } from "@/lib/explorer/map-view";
import type { ExplorerEvent } from "@/lib/explorer/types";
import type { JourneyPathRequest } from "@/lib/explorer/cinematic/journey-path";

export type ScreenPoint = { x: number; y: number };
/** CSS pixels relative to the map stage; null for invalid, offstage or Earth-occluded points. */
export type GlobeViewport = {
  width: number;
  height: number;
  zoom: number;
  project(lng: number, lat: number): ScreenPoint | null;
};
export type GlobePlaceLabel = { id: string; name: string; lng: number; lat: number };

export type GlobeCameraRequest = JourneyArrival & { view: MapView; instant?: boolean };
export type EventMapProps = {
  events: readonly ExplorerEvent[]; allEvents: readonly ExplorerEvent[]; view: MapView | null;
  selectedEvent: string | null; focusRequest: { slug: string; nonce: number } | null;
  journeyStop: JourneyStop | null; cameraRequest: GlobeCameraRequest | null;
  journeyPathRequest: JourneyPathRequest | null;
  restoreRequest: number;
  onSelect(slug: string): void; onViewChange(view: MapView, arrival?: JourneyArrival): void;
  onManualInput(): void; onArrive(arrival: JourneyArrival): void;
  onReadyChange(ready: boolean): void;
};
