import type { EventSummary } from "@/lib/queries/events";
import type { AccuracyLevel, DatePrecision } from "@/lib/utils/labels";

export type { AccuracyLevel, DatePrecision, EventSummary };

export type GeoBounds = { west: number; east: number; south: number; north: number };
export type PointXZ = { x: number; z: number };
export type LinearRing = readonly (readonly [number, number])[];
export type PolygonCoordinates = readonly LinearRing[];
export type MapGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: readonly PolygonCoordinates[] };
export type MapFootprint = {
  type: "FeatureCollection";
  features: readonly {
    type: "Feature";
    properties: { partId: string; sourceId: string; name?: string; partKind?: string };
    geometry: MapGeometry;
  }[];
};
export type MapProjection = {
  project(lng: number, lat: number): PointXZ;
  unproject(point: PointXZ): [number, number];
};
export type ExplorerLocation = {
  slug: string;
  name: string;
  historicalName: string | null;
  latitude: number | null;
  longitude: number | null;
  accuracyLevel: AccuracyLevel;
  accuracyNote: string | null;
  isPrimary: boolean;
  role: string | null;
};
export type ExplorerEvent = EventSummary & {
  id: string;
  startYear: number;
  endYear: number | null;
  locations: ExplorerLocation[];
  sourceCount: number;
};
export type CameraView = {
  azimuth: number;
  polar: number;
  distance: number;
  targetX: number;
  targetZ: number;
};
export type ExplorerState = {
  from: number;
  to: number;
  selectedEvent: string | null;
  view: CameraView | null;
};
export type ExplorerLimits = {
  minYear: number;
  maxYear: number;
  eventSlugs: readonly string[];
};
export type MarkerAnchor = {
  key: string;
  eventSlug: string;
  locationSlug: string;
  position: PointXZ;
  accuracyLevel: AccuracyLevel;
};
export type ProjectedAnchor = MarkerAnchor & { screenX: number; screenY: number; visible: boolean };
export type MarkerGroup = { key: string; members: ProjectedAnchor[]; screenX: number; screenY: number };
