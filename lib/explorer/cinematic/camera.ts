/**
 * Camera model for the cinematic globe.
 *
 * The public/serialized camera stays the existing `MapView = { lat, lng, zoom }` (`ban-do=lat,lng,zoom`).
 * Nothing about the 3D camera (vectors, tilt, roll) is persisted: every pose is derived from that view
 * and the stage size by the deterministic profile below, and `cameraPoseToView` is its exact inverse.
 *
 * Meaning of `zoom` (kept from the MapLibre renderer so old bookmarks restore the same place and scale):
 * at the view centre the surface is shown `512·2^zoom / 360` CSS pixels per degree of longitude, i.e. the
 * area scale of a Web-Mercator map with 512 px tiles. For a tilted camera this area scale is preserved,
 * so zoom 4.5 occupies the same screen area whether the globe is looking straight down or obliquely.
 */
import type { MapView } from "@/lib/explorer/map-view";
import {
  add,
  cross,
  dot,
  geoToVector,
  localBasis,
  normalize,
  projectToScreen,
  scale,
  sphereHorizonPoints,
  sub,
  vectorToGeo,
  type ProjectionViewport,
  type ScreenCamera,
  type ScreenPoint,
  type Vec3,
} from "@/lib/explorer/cinematic/projection";

export type GlobeStageSize = ProjectionViewport;

export type CameraPose = ScreenCamera & {
  /** Surface point (the serialized view centre) the camera looks at. */
  target: Vec3;
  /** Distance from the camera to `target`, in Earth radii. */
  distanceToTarget: number;
  tiltDeg: number;
  near: number;
  far: number;
};

const RAD = Math.PI / 180;
const TWO_PI = Math.PI * 2;

/** Balanced perspective field of view: shows curved planetary horizon while keeping Vietnam map-readable. */
export const CAMERA_FOV_DEG = 38;
/** Camera is placed to the south-south-west of the view centre, so the limb crowns at the top and curves down the right. */
export const CAMERA_AZIMUTH_DEG = 192;
/** Where the serialized view centre lands on the stage: slightly left of and above the canvas middle. */
export const VIEW_ANCHOR: ScreenPoint = { x: 0.455, y: 0.405 };

/** Overview zoom at a 900 px stage; other heights scale so Vietnam keeps the same share of the screen. */
export const OVERVIEW_ZOOM_AT_900 = 3.64;
const OVERVIEW_TILT_DEG = 30;
const WORLD_TILT_DEG = 10;
export const MIN_ZOOM = 0;
export const MAX_ZOOM = 18;
export const MAX_INTERACTIVE_ZOOM = 11;
const MAX_LAT = 85;
/** Imagery-sharpness advice/default event framing (Phase 1), independent of the interactive camera limit. */
export const CLOSEST_USEFUL_EVENT_ZOOM = 5.4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const smoothstep = (edge0: number, edge1: number, value: number) => {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
const focalLength = (height: number, fovDeg = CAMERA_FOV_DEG) => height / (2 * Math.tan((fovDeg * RAD) / 2));

export function overviewZoomForHeight(height: number): number {
  return Number((OVERVIEW_ZOOM_AT_900 + Math.log2(Math.max(1, height) / 900)).toFixed(2));
}

/** Application-owned tilt: oblique for the broad overview, straight down once the learner zooms into places. */
export function tiltDegForZoom(zoom: number, overviewZoom = OVERVIEW_ZOOM_AT_900): number {
  const relative = zoom - overviewZoom;
  if (relative >= 0) return OVERVIEW_TILT_DEG * (1 - smoothstep(0, 2, relative));
  return WORLD_TILT_DEG + (OVERVIEW_TILT_DEG - WORLD_TILT_DEG) * smoothstep(-2.3, 0, relative);
}

/** Radians of arc per pixel inverse: pixels per radian of surface at the view centre for a legacy zoom. */
function legacyPixelsPerRadian(zoom: number, lat: number) {
  const cosLat = Math.max(Math.cos(clamp(lat, -MAX_LAT, MAX_LAT) * RAD), 1e-6);
  return (512 * 2 ** zoom) / (TWO_PI * cosLat);
}

export function viewToCameraPose(view: MapView, viewport: GlobeStageSize): CameraPose {
  const zoom = clamp(view.zoom, MIN_ZOOM, MAX_ZOOM);
  const lat = clamp(view.lat, -MAX_LAT, MAX_LAT);
  const { up: target, east, north } = localBasis(lat, view.lng);
  const tiltDeg = tiltDegForZoom(zoom, overviewZoomForHeight(viewport.height));
  const tilt = tiltDeg * RAD;
  const azimuth = CAMERA_AZIMUTH_DEG * RAD;
  const horizontal = add(scale(north, Math.cos(azimuth)), scale(east, Math.sin(azimuth)));
  const towardCamera = add(scale(target, Math.cos(tilt)), scale(horizontal, Math.sin(tilt)));
  // Area scale at the centre: (focal/D)² · cos(tilt) = legacyPixelsPerRadian².
  const distance = (focalLength(viewport.height) * Math.sqrt(Math.cos(tilt))) / legacyPixelsPerRadian(zoom, lat);
  const position = add(target, scale(towardCamera, distance));
  const forward = scale(towardCamera, -1);
  // North at the view centre stays vertical on screen: no roll is ever introduced.
  const up = normalize(add(north, scale(forward, -dot(north, forward))));
  const radius = Math.hypot(...position);
  return {
    position,
    forward,
    up,
    fovDeg: CAMERA_FOV_DEG,
    anchor: VIEW_ANCHOR,
    target,
    distanceToTarget: distance,
    tiltDeg,
    near: Math.max(0.5 * (radius - 1), 1e-6),
    far: radius + 1.2,
  };
}

/** Exact inverse of `viewToCameraPose` for poses built by it; `null` if the camera looks away from the planet. */
export function cameraPoseToView(
  pose: Pick<ScreenCamera, "position" | "forward" | "fovDeg">,
  viewport: GlobeStageSize,
): MapView | null {
  const b = dot(pose.position, pose.forward);
  const c = dot(pose.position, pose.position) - 1;
  const discriminant = b * b - c;
  if (discriminant < 0) return null;
  const distance = -b - Math.sqrt(discriminant);
  if (distance <= 0) return null;
  const target = add(pose.position, scale(pose.forward, distance));
  const { lat, lng } = vectorToGeo(target);
  const cosTilt = clamp(-dot(pose.forward, target), 1e-6, 1);
  const pixelsPerRadian = (focalLength(viewport.height, pose.fovDeg) * Math.sqrt(cosTilt)) / distance;
  const cosLat = Math.max(Math.cos(clamp(lat, -MAX_LAT, MAX_LAT) * RAD), 1e-6);
  const zoom = Math.log2((pixelsPerRadian * TWO_PI * cosLat) / 512);
  return { lat, lng, zoom };
}

export function vietnamOverviewView(viewport: GlobeStageSize): MapView {
  return { lat: 15.5, lng: 106.4, zoom: overviewZoomForHeight(viewport.height) };
}

/** Whole sphere with margin: the largest zoom whose limb fits within 80% of the stage height. */
export function worldOverviewView(viewport: GlobeStageSize): MapView {
  const centre = { lat: 18, lng: 107 };
  const extent = (zoom: number) => {
    const pose = viewToCameraPose({ ...centre, zoom }, viewport);
    const ys = sphereHorizonPoints(pose.position, 180).map((point) => projectToScreen(pose, viewport, point)!.y);
    return Math.max(...ys) - Math.min(...ys);
  };
  let low = MIN_ZOOM;
  let high = 4;
  for (let step = 0; step < 40; step++) {
    const middle = (low + high) / 2;
    if (extent(middle) > viewport.height * 0.8) high = middle;
    else low = middle;
  }
  return { ...centre, zoom: Number(low.toFixed(2)) };
}

export function wrapLongitude(lng: number): number {
  return ((((lng + 180) % 360) + 360) % 360) - 180;
}

/** Camera scale is independent of imagery detail. Restored closer views can step out gradually. */
export function zoomView(view: MapView, delta: number): MapView {
  return { ...view, zoom: clamp(view.zoom + delta, MIN_ZOOM, Math.max(MAX_INTERACTIVE_ZOOM, view.zoom)) };
}

/** Move the view so the surface follows a drag of (dx, dy) CSS pixels; valid for any tilt (uses the local Jacobian). */
export function panView(view: MapView, dx: number, dy: number, viewport: GlobeStageSize): MapView {
  const pose = viewToCameraPose(view, viewport);
  const step = 1e-3;
  const at = (lat: number, lng: number) => projectToScreen(pose, viewport, geoToVector(lat, lng))!;
  const origin = at(view.lat, view.lng);
  const east = at(view.lat, view.lng + step);
  const north = at(view.lat + step, view.lng);
  const a = (east.x - origin.x) / step;
  const b = (north.x - origin.x) / step;
  const c = (east.y - origin.y) / step;
  const d = (north.y - origin.y) / step;
  const determinant = a * d - b * c;
  if (Math.abs(determinant) < 1e-12) return view;
  // Solve J·(dLng, dLat) = (-dx, -dy): the point that must reach the anchor is the one `drag` pixels behind it.
  const dLng = (d * -dx - b * -dy) / determinant;
  const dLat = (-c * -dx + a * -dy) / determinant;
  return {
    lat: clamp(view.lat + dLat, -MAX_LAT, MAX_LAT),
    lng: wrapLongitude(view.lng + dLng),
    zoom: view.zoom,
  };
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const travelAngle = (from: MapView, to: MapView) => {
  const start = geoToVector(from.lat, from.lng);
  const end = geoToVector(to.lat, to.lng);
  return Math.atan2(Math.hypot(...cross(start, end)), dot(start, end));
};

/** Editorial travel time, independent of the post-arrival dwell owned by HistoryExplorer. */
export function journeyFlightDurationMs(from: MapView, to: MapView): number {
  const degrees = travelAngle(from, to) / RAD;
  const zoomChange = Math.abs(to.zoom - from.zoom);
  if (degrees < 1e-6 && zoomChange < 1e-6) return 0;
  if (degrees < 12) return Math.round(clamp(650 + degrees * 65 + zoomChange * 100, 650, 1500));
  if (degrees < 30) return Math.round(1600 + ((degrees - 12) / 18) * 800);
  return Math.round(Math.min(3600, 3000 + (degrees - 30) * 8));
}

/**
 * Geographic targets follow a great circle; every pose is derived outside Earth.
 * Long travel first pulls back (0–25%), turns at world scale (25–72%), then approaches.
 * Nearby travel has a small continuous lift. No full-canvas fade or unsaved camera roll.
 */
export function interpolateView(from: MapView, to: MapView, t: number, viewport: GlobeStageSize = { width: 1440, height: 900 }): MapView {
  if (t <= 0) return { ...from };
  if (t >= 1) return { ...to };
  const start = geoToVector(from.lat, from.lng);
  const end = geoToVector(to.lat, to.lng);
  const angle = Math.acos(clamp(dot(start, end), -1, 1));
  const tangent = sub(end, scale(start, dot(start, end)));
  // Antipodes have no unique shortest arc. Choose a deterministic eastward arc rather than divide by sin(π).
  const direction = Math.hypot(...tangent) < 1e-8 ? localBasis(from.lat, from.lng).east : normalize(tangent);
  const along = (u: number): Vec3 => angle < 1e-9 ? start : add(scale(start, Math.cos(angle * u)), scale(direction, Math.sin(angle * u)));
  const degrees = angle / RAD;
  let progress = easeInOut(t);
  let zoom: number;
  if (degrees >= 30) {
    const middle = vectorToGeo(along(0.5));
    // Account for Mercator latitude scale as well as stage height, so both ends fit during the turn.
    const cosLat = Math.cos(Math.max(Math.abs(from.lat), Math.abs(to.lat), Math.abs(middle.lat)) * RAD);
    const worldZoom = overviewZoomForHeight(viewport.height) - 1.3 + Math.log2(Math.max(0.1, cosLat) / Math.cos(18 * RAD));
    const cruise = Math.max(MIN_ZOOM, Math.min(from.zoom, to.zoom, worldZoom));
    progress = easeInOut(clamp((t - 0.25) / 0.47, 0, 1));
    if (t < 0.25) zoom = from.zoom + (cruise - from.zoom) * easeInOut(t / 0.25);
    else if (t <= 0.72) zoom = cruise;
    else zoom = cruise + (to.zoom - cruise) * easeInOut((t - 0.72) / 0.28);
  } else {
    const lift = Math.min(0.65, degrees / 20, Math.min(from.zoom, to.zoom));
    zoom = from.zoom + (to.zoom - from.zoom) * progress - lift * Math.sin(Math.PI * progress) ** 2;
  }
  const { lat, lng } = vectorToGeo(along(progress));
  return { lat: clamp(lat, -MAX_LAT, MAX_LAT), lng: wrapLongitude(lng), zoom: clamp(zoom, MIN_ZOOM, MAX_ZOOM) };
}
