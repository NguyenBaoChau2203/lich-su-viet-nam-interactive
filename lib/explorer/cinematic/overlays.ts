import { getMapGroupLabel, groupMapAnchors, type EventMapAnchor, type EventMapGroup } from "@/lib/explorer/map-markers";
import type { JourneyStop } from "@/lib/explorer/journey";
import type { GlobePlaceLabel, GlobeViewport } from "@/lib/explorer/globe-contract";

export type OverlayRect = { left: number; right: number; top: number; bottom: number };
export type CuratedPlaceLabel = GlobePlaceLabel;
export type OverlayGroup = EventMapGroup & { label: string; labelSide?: "left" | "right"; labelBox?: OverlayRect };
export type OverlayLayout = {
  groups: OverlayGroup[];
  labels: (CuratedPlaceLabel & { x: number; y: number; box: OverlayRect })[];
  stop: { x: number; y: number; label: string; labelBox?: OverlayRect } | null;
};
type LayoutOptions = {
  viewport: GlobeViewport;
  anchors: readonly EventMapAnchor[];
  labels: readonly CuratedPlaceLabel[];
  occupied: readonly OverlayRect[];
  labelObstacles?: readonly OverlayRect[];
  entityNoun?: string;
  measure(text: string): { width: number; height: number };
  selectedEvent?: string | null;
  stop?: JourneyStop | null;
};

export function rectanglesOverlap(a: OverlayRect, b: OverlayRect, gap = 0): boolean {
  return a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;
}
const targetBox = ({ x, y }: { x: number; y: number }): OverlayRect => ({ left: x - 16, right: x + 16, top: y - 16, bottom: y + 16 });

export function buildOverlayLayout({ viewport, anchors, labels, occupied, labelObstacles = [], entityNoun, measure, selectedEvent, stop }: LayoutOptions): OverlayLayout {
  const blocked = [...occupied, ...labelObstacles];
  const freeTarget = (point: { x: number; y: number }) => !occupied.some((box) => rectanglesOverlap(targetBox(point), box, 4));
  const placeText = (text: string, point: { x: number; y: number }) => {
    const { width, height } = measure(text);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
    for (const side of ["right", "left"] as const) {
      const left = side === "right" ? point.x + 24 : point.x - 24 - width;
      const box = { left, right: left + width, top: point.y - height / 2, bottom: point.y + height / 2 };
      if (box.left < 12 || box.top < 12 || box.right > viewport.width - 12 || box.bottom > viewport.height - 12
        || blocked.some((other) => rectanglesOverlap(box, other, 6))) continue;
      blocked.push(box);
      return { side, box };
    }
  };
  if (stop) {
    const point = viewport.project(stop.view.lng, stop.view.lat);
    const label = `${stop.mapLabel || stop.place.split(" · ")[0]} · Vị trí gần đúng`;
    const visible = point && freeTarget(point);
    const placed = visible ? placeText(label, point) : undefined;
    return { groups: [], labels: [], stop: visible ? { ...point, label, labelBox: placed?.box } : null };
  }
  const groups: OverlayGroup[] = groupMapAnchors(anchors.flatMap((anchor) => {
    const point = viewport.project(anchor.location.longitude, anchor.location.latitude);
    return point ? [{ ...anchor, ...point }] : [];
  })).filter(freeTarget).map((group) => ({ ...group, label: getMapGroupLabel(group, labels, entityNoun) }))
    .sort((a, b) => Number(b.anchors.some((anchor) => anchor.event.slug === selectedEvent))
      - Number(a.anchors.some((anchor) => anchor.event.slug === selectedEvent)));
  blocked.push(...groups.map(targetBox));
  for (const group of groups) {
    const placed = placeText(group.label, group);
    if (placed) { group.labelSide = placed.side; group.labelBox = placed.box; }
  }
  const placedLabels: OverlayLayout["labels"] = [];
  for (const label of labels) {
    const point = viewport.project(label.lng, label.lat);
    if (!point || !freeTarget(point) || groups.some((group) => Math.hypot(group.x - point.x, group.y - point.y) < 65)) continue;
    const placed = placeText(label.name, point);
    if (placed) placedLabels.push({ ...label, ...point, box: placed.box });
  }
  return { groups, labels: placedLabels, stop: null };
}
