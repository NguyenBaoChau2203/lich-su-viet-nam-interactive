/**
 * Spherical geometry helpers for the cinematic globe. Pure functions only (no Three.js import) so the
 * camera logic can be unit-tested in Node.
 *
 * Coordinate convention (shared with `three-globe`'s `getCoords`, unit radius):
 *   x = cos(lat)·sin(lng),  y = sin(lat),  z = cos(lat)·cos(lng)
 * so longitude 0 faces +Z, longitude 90°E faces +X and the Earth texture needs `rotateY(-π/2)`.
 */
import type { GlobeViewport, ScreenPoint } from "@/lib/explorer/globe-contract";
export type { GlobeViewport, ScreenPoint } from "@/lib/explorer/globe-contract";
export type Vec3 = readonly [number, number, number];
export type ProjectionViewport = { width: number; height: number };
/** Everything a point needs to be projected: a pinhole camera with an optional principal-point shift. */
export type ScreenCamera = {
  position: Vec3;
  forward: Vec3;
  up: Vec3;
  fovDeg: number;
  /** Where the camera's forward axis lands, as a fraction of the stage (0–1). */
  anchor: ScreenPoint;
  near?: number;
  far?: number;
};

const RAD = Math.PI / 180;

/** Preserve the overview hierarchy; local relief is at most 0.2% of camera altitude.
 * Thus the same geographic point stays aligned with its unit-sphere HTML anchor,
 * and even legacy zooms cannot put the camera inside a raised layer.
 */
export function surfaceLayerRadii(distanceToSurface: number) {
  const relief = Math.min(1, Math.max(0, distanceToSurface) * 0.002 / 0.0008);
  return {
    cap: 1 + 0.0004 * relief,
    boundary: 1 + 0.0002 * relief,
    province: 1 + 0.0006 * relief,
    coastline: 1 + 0.0005 * relief,
    outline: 1 + 0.0008 * relief,
  };
}

export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec3, factor: number): Vec3 => [a[0] * factor, a[1] * factor, a[2] * factor];
export const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const length = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
export function normalize(a: Vec3): Vec3 {
  const size = length(a);
  return size === 0 ? [0, 0, 0] : scale(a, 1 / size);
}

export function geoToVector(lat: number, lng: number, radius = 1): Vec3 {
  const phi = lat * RAD;
  const lambda = lng * RAD;
  return [radius * Math.cos(phi) * Math.sin(lambda), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(lambda)];
}

export function vectorToGeo(vector: Vec3): { lat: number; lng: number } {
  const size = length(vector) || 1;
  return {
    lat: Math.asin(Math.max(-1, Math.min(1, vector[1] / size))) / RAD,
    lng: Math.atan2(vector[0], vector[2]) / RAD,
  };
}

/** Outward normal plus the east/north tangents at a position. */
export function localBasis(lat: number, lng: number): { up: Vec3; east: Vec3; north: Vec3 } {
  const phi = lat * RAD;
  const lambda = lng * RAD;
  return {
    up: geoToVector(lat, lng),
    east: [Math.cos(lambda), 0, -Math.sin(lambda)],
    north: [-Math.sin(phi) * Math.sin(lambda), Math.cos(phi), -Math.sin(phi) * Math.cos(lambda)],
  };
}

/**
 * Raised geography is hidden when its unit direction is on the far side of the Earth sphere.
 * Test the unit direction, not the lifted radius: a radius above 1 can push a limb point
 * across a `dot > 1` check even though the camera→point segment still enters the Earth.
 * The exact tangent (`dot <= 1`) counts as occluded so leaders do not sit on the silhouette.
 */
export function isEarthOccluded(cameraPosition: Vec3, lat: number, lng: number): boolean {
  if (![...cameraPosition, lat, lng].every(Number.isFinite)) return true;
  return !isNearSide(cameraPosition, geoToVector(lat, lng, 1));
}

/** A unit-sphere point faces a camera at `cameraPosition` when it lies on the camera side of the horizon plane. */
export function isNearSide(cameraPosition: Vec3, point: Vec3): boolean {
  // For a unit surface point P and exterior camera C the segment C→P meets Earth first at P
  // iff P·(C−P) > 0. A hemisphere/normal test against the camera forward direction is insufficient
  // under perspective. Exclude the exact tangent (and round-off) to avoid horizon flicker.
  return dot(point, cameraPosition) > 1 + 1e-10;
}

/** Pinhole projection into CSS pixels of the stage; `null` when the point is behind the camera. */
export function projectToScreen(camera: ScreenCamera, viewport: ProjectionViewport, point: Vec3): ScreenPoint | null {
  const relative = sub(point, camera.position);
  const depth = dot(relative, camera.forward);
  if (depth <= 1e-9) return null;
  const right = cross(camera.forward, camera.up);
  const focalPixels = viewport.height / (2 * Math.tan((camera.fovDeg * RAD) / 2));
  return {
    x: camera.anchor.x * viewport.width + (dot(relative, right) / depth) * focalPixels,
    y: camera.anchor.y * viewport.height - (dot(relative, camera.up) / depth) * focalPixels,
  };
}

export function createGlobeViewport(camera: ScreenCamera, viewport: ProjectionViewport, zoom = 0): GlobeViewport {
  const near = camera.near ?? 1e-9;
  const far = camera.far ?? Infinity;
  const valid = [viewport.width, viewport.height, ...camera.position, ...camera.forward, ...camera.up,
    camera.fovDeg, camera.anchor.x, camera.anchor.y, near].every(Number.isFinite)
    && viewport.width > 0 && viewport.height > 0 && length(camera.position) > 1
    && camera.fovDeg > 0 && camera.fovDeg < 180 && near > 0 && far > near
    && (Number.isFinite(far) || camera.far === undefined)
    && Math.abs(length(camera.forward) - 1) < 1e-6 && Math.abs(length(camera.up) - 1) < 1e-6
    && Math.abs(dot(camera.forward, camera.up)) < 1e-6;
  return {
    ...viewport,
    zoom,
    project(lng, lat) {
      if (!valid || !Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) return null;
      const point = geoToVector(lat, lng);
      if (!isNearSide(camera.position, point)) return null;
      const depth = dot(sub(point, camera.position), camera.forward);
      if (depth < near || depth > far) return null;
      const screen = projectToScreen(camera, viewport, point);
      // Keep the whole 32×32 interactive target on the stage. Device pixel ratio and document
      // offsets never enter this calculation; HTML and canvas share the same stage rectangle.
      if (!screen || !Number.isFinite(screen.x) || !Number.isFinite(screen.y)
        || screen.x < 16 || screen.y < 16 || screen.x > viewport.width - 16 || screen.y > viewport.height - 16) return null;
      return screen;
    },
  };
}

/** Points on the sphere's silhouette (the limb) as seen from `cameraPosition`. */
export function sphereHorizonPoints(cameraPosition: Vec3, count: number): Vec3[] {
  const distance = length(cameraPosition);
  const axis = scale(cameraPosition, 1 / distance);
  const helper: Vec3 = Math.abs(axis[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const first = normalize(cross(axis, helper));
  const second = cross(axis, first);
  const cosAngle = 1 / distance;
  const sinAngle = Math.sqrt(1 - cosAngle * cosAngle);
  return Array.from({ length: count }, (_, index) => {
    const theta = (index / count) * Math.PI * 2;
    const ring = add(scale(first, Math.cos(theta)), scale(second, Math.sin(theta)));
    return add(scale(axis, cosAngle), scale(ring, sinAngle));
  });
}
