import { rectanglesOverlap, type OverlayRect } from "@/lib/explorer/cinematic/overlays";
import { MAX_INTERACTIVE_ZOOM, MIN_ZOOM, panView, viewToCameraPose, wrapLongitude, type GlobeStageSize } from "@/lib/explorer/cinematic/camera";
import { geoToVector, isNearSide, projectToScreen } from "@/lib/explorer/cinematic/projection";
import type { ProjectedMapAnchor } from "@/lib/explorer/map-markers";
import type { MapView } from "@/lib/explorer/map-view";

export type ClusterFocusRequest = { locations: readonly { lat: number; lng: number }[]; safeArea: OverlayRect };
export type ClusterFit = { view: MapView; distinctCount: number; separated: boolean };
export type ExpandedMapAnchor = ProjectedMapAnchor & { anchor: { x: number; y: number } };

const targetBox = ({ x, y }: { x: number; y: number }): OverlayRect => ({ left: x - 16, right: x + 16, top: y - 16, bottom: y + 16 });
const area = (box: OverlayRect) => Math.max(0, box.right - box.left) * Math.max(0, box.bottom - box.top);

/** Largest free rectangle inside the stage, with space for focus outlines. Measured UI is authoritative. */
export function getMapSafeArea(size: GlobeStageSize, occupied: readonly OverlayRect[]): OverlayRect {
  const bounds = { left: 12, right: size.width - 12, top: 12, bottom: size.height - 12 };
  const blocked = occupied.map(box => ({ left: Math.max(bounds.left, box.left - 8), right: Math.min(bounds.right, box.right + 8),
    top: Math.max(bounds.top, box.top - 8), bottom: Math.min(bounds.bottom, box.bottom + 8) })).filter(box => area(box) > 0);
  const xs = [...new Set([bounds.left, bounds.right, ...blocked.flatMap(box => [box.left, box.right])])].sort((a, b) => a - b);
  let best = { ...bounds, right: bounds.left, bottom: bounds.top };
  for (const [index, left] of xs.entries()) for (const right of xs.slice(index + 1)) {
    let top = bounds.top;
    const vertical = blocked.filter(box => box.left < right && box.right > left).sort((a, b) => a.top - b.top);
    for (const box of [...vertical, { top: bounds.bottom, bottom: bounds.bottom }]) {
      const candidate = { left, right, top, bottom: box.top };
      if (area(candidate) > area(best)) best = candidate;
      top = Math.max(top, box.bottom);
    }
  }
  return best;
}

/** All coordinates participate; screen placement is solved with the same tilted spherical camera as the renderer. */
export function fitClusterView(size: GlobeStageSize, { locations, safeArea }: ClusterFocusRequest): ClusterFit | null {
  if (!locations.length || locations.some(({ lat, lng }) => !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 85 || Math.abs(lng) > 180)
    || safeArea.right - safeArea.left < 40 || safeArea.bottom - safeArea.top < 40) return null;
  const distinct = [...new Map(locations.map(location => [`${location.lat},${location.lng}`, location])).values()]
    .sort((a, b) => a.lat - b.lat || a.lng - b.lng);
  const reference = distinct[0].lng;
  const lngs = distinct.map(location => reference + wrapLongitude(location.lng - reference));
  const centre = { lat: (Math.min(...distinct.map(p => p.lat)) + Math.max(...distinct.map(p => p.lat))) / 2,
    lng: wrapLongitude((Math.min(...lngs) + Math.max(...lngs)) / 2) };
  const atZoom = (zoom: number) => {
    let candidate = { ...centre, zoom };
    for (let step = 0; step < 6; step++) {
      const pose = viewToCameraPose(candidate, size);
      const points = distinct.map(({ lat, lng }) => {
        const world = geoToVector(lat, lng);
        return isNearSide(pose.position, world) ? projectToScreen(pose, size, world) : null;
      });
      if (points.some(p => !p)) return null;
      const projected = points as { x: number; y: number }[];
      const x = (Math.min(...projected.map(p => p.x)) + Math.max(...projected.map(p => p.x))) / 2;
      const y = (Math.min(...projected.map(p => p.y)) + Math.max(...projected.map(p => p.y))) / 2;
      const dx = (safeArea.left + safeArea.right) / 2 - x;
      const dy = (safeArea.top + safeArea.bottom) / 2 - y;
      if (Math.abs(dx) + Math.abs(dy) < 0.001) break;
      candidate = panView(candidate, dx, dy, size);
    }
    const pose = viewToCameraPose(candidate, size);
    const points = distinct.map(({ lat, lng }) => projectToScreen(pose, size, geoToVector(lat, lng))!);
    if (points.some(point => !point || point.x - 20 < safeArea.left || point.x + 20 > safeArea.right
      || point.y - 20 < safeArea.top || point.y + 20 > safeArea.bottom)) return null;
    return { view: candidate, points };
  };
  let low = MIN_ZOOM; let high = MAX_INTERACTIVE_ZOOM;
  let fitted = atZoom(high);
  if (!fitted) {
    // At world scale the whole sphere may be too small to reach an offset
    // safe rectangle. Feasibility need not extend down to zoom 0. Find the
    // highest feasible bracket first, then refine that bracket precisely.
    let bracketed = false;
    for (let zoom = MAX_INTERACTIVE_ZOOM - 0.25; zoom >= MIN_ZOOM; zoom -= 0.25) {
      if (!atZoom(zoom)) continue;
      low = zoom; high = zoom + 0.25; bracketed = true; break;
    }
    if (!bracketed) return null;
    for (let step = 0; step < 28; step++) {
      const middle = (low + high) / 2;
      if (atZoom(middle)) low = middle; else high = middle;
    }
    fitted = atZoom(Math.floor(low * 100) / 100);
  }
  if (!fitted) return null;
  const separated = distinct.length === locations.length && fitted.points.every((a, index) => fitted.points.slice(index + 1)
    .every(b => Math.abs(a.x - b.x) > 36 || Math.abs(a.y - b.y) > 36));
  return { view: fitted.view, distinctCount: distinct.length, separated };
}

/** Place the scrolling list beside its true group without covering the shell or the group's hit target. */
export function placeClusterPanel(at: { x: number; y: number }, size: GlobeStageSize, occupied: readonly OverlayRect[]): OverlayRect {
  const safe = getMapSafeArea(size, [...occupied, targetBox(at)]);
  const width = Math.min(280, safe.right - safe.left);
  const height = Math.min(260, safe.bottom - safe.top);
  const left = Math.max(safe.left, Math.min(at.x + 28, safe.right - width));
  const top = Math.max(safe.top, Math.min(at.y - 60, safe.bottom - height));
  return { left, right: left + width, top, bottom: top + height };
}

/** Deterministic screen-only fan-out. Unplaced members always remain in the complete HTML group list. */
export function buildClusterExpansion(anchors: readonly ProjectedMapAnchor[], size: GlobeStageSize, occupied: readonly OverlayRect[]): { markers: ExpandedMapAnchor[]; unplacedKeys: string[] } {
  const markers: ExpandedMapAnchor[] = []; const unplacedKeys: string[] = [];
  if (!anchors.length) return { markers, unplacedKeys };
  const ordered = [...anchors].sort((a, b) => a.key.localeCompare(b.key));
  const centre = { x: ordered.reduce((sum, anchor) => sum + anchor.x, 0) / ordered.length, y: ordered.reduce((sum, anchor) => sum + anchor.y, 0) / ordered.length };
  const candidates: { x: number; y: number }[] = [];
  for (let x = -Math.ceil(size.width / 44); x <= Math.ceil(size.width / 44); x++)
    for (let y = -Math.ceil(size.height / 44); y <= Math.ceil(size.height / 44); y++) {
      if (Math.hypot(x, y) < 1.5) continue;
      const point = { x: centre.x + x * 44, y: centre.y + y * 44 };
      if (point.x >= 20 && point.y >= 20 && point.x <= size.width - 20 && point.y <= size.height - 20) candidates.push(point);
    }
  candidates.sort((a, b) => Math.hypot(a.x - centre.x, a.y - centre.y) - Math.hypot(b.x - centre.x, b.y - centre.y) || a.y - b.y || a.x - b.x);
  const blocked = [...occupied];
  for (const anchor of ordered) {
    const point = candidates.find(point => !blocked.some(box => rectanglesOverlap(targetBox(point), box, 4)));
    if (!point) { unplacedKeys.push(anchor.key); continue; }
    markers.push({ ...anchor, ...point, anchor: { x: anchor.x, y: anchor.y } });
    blocked.push(targetBox(point));
  }
  return { markers, unplacedKeys };
}
