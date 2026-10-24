import type { ExplorerEvent, ExplorerLocation } from "@/lib/explorer/types";

export type EventMapAnchor = {
  key: string;
  event: ExplorerEvent;
  location: ExplorerLocation & { latitude: number; longitude: number };
};
export type ProjectedMapAnchor = EventMapAnchor & { x: number; y: number };
export type EventMapGroup = { key: string; x: number; y: number; anchors: ProjectedMapAnchor[] };

/** A city-level label is used only when every grouped location is nearby. */
export function getMapGroupLabel(group: EventMapGroup, labels: readonly { name: string; lat: number; lng: number }[]): string {
  const first = group.anchors[0];
  if (!first) return "";
  if (new Set(group.anchors.map((anchor) => anchor.location.slug)).size === 1)
    return first.location.historicalName || first.location.name;
  const city = labels.find((label) => group.anchors.every(({ location }) =>
    Math.hypot((location.longitude - label.lng) * Math.cos(label.lat * Math.PI / 180), location.latitude - label.lat) * 111.195 <= 25));
  return city?.name ?? `${new Set(group.anchors.map((anchor) => anchor.event.slug)).size} sự kiện`;
}

export function getEventMapAnchors(events: readonly ExplorerEvent[]): EventMapAnchor[] {
  return events.flatMap((event) => event.locations.flatMap((location) => {
    const { latitude, longitude } = location;
    if (latitude === null || longitude === null || !Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
    if (Math.abs(latitude) > 85 || Math.abs(longitude) > 180) return [];
    return [{ key: `${event.slug}@${location.slug}`, event, location: { ...location, latitude, longitude } }];
  }));
}

export function groupMapAnchors(anchors: readonly ProjectedMapAnchor[], radius = 36): EventMapGroup[] {
  const groups: EventMapGroup[] = [];
  for (const anchor of [...anchors].sort((a, b) => a.key.localeCompare(b.key))) {
    if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) continue;
    const group = groups.find((candidate) => Math.abs(candidate.x - anchor.x) <= radius && Math.abs(candidate.y - anchor.y) <= radius);
    if (!group) {
      groups.push({ key: anchor.key, x: anchor.x, y: anchor.y, anchors: [anchor] });
    } else {
      const count = group.anchors.length;
      group.x = (group.x * count + anchor.x) / (count + 1);
      group.y = (group.y * count + anchor.y) / (count + 1);
      group.anchors.push(anchor);
      group.key = group.anchors.map((item) => item.key).join("|");
    }
  }
  // Moving centroids can bring previously separate targets together. Merge to a
  // fixed point so the final square hit areas, including diagonals, stay disjoint.
  for (let i = 0; i < groups.length; i++) {
    const a = groups[i];
    const j = groups.findIndex((b, index) => index > i && Math.abs(a.x - b.x) <= radius && Math.abs(a.y - b.y) <= radius);
    if (j < 0) continue;
    const b = groups.splice(j, 1)[0];
    a.anchors = [...a.anchors, ...b.anchors].sort((a, b) => a.key.localeCompare(b.key));
    a.x = a.anchors.reduce((sum, anchor) => sum + anchor.x, 0) / a.anchors.length;
    a.y = a.anchors.reduce((sum, anchor) => sum + anchor.y, 0) / a.anchors.length;
    a.key = a.anchors.map(anchor => anchor.key).join("|");
    i = -1;
  }
  return groups;
}
