import { describe, expect, it } from "vitest";
import { buildOverlayLayout, type OverlayRect } from "@/lib/explorer/cinematic/overlays";
import { getEventMapAnchors } from "@/lib/explorer/map-markers";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { HISTORY_JOURNEY } from "@/lib/explorer/journey";

// Synthetic UI geometry only. No fixtures in this file add historical claims.
const event = (slug: string, lng: number): ExplorerEvent => ({
  id: slug, slug, title: slug, summary: "Synthetic", dateText: "1954", datePrecision: "year",
  isFeatured: false, topicSlugs: [], secondaryTopics: [], startYear: 1954, endYear: null, sourceCount: 1,
  locations: [{ slug, name: slug, historicalName: null, longitude: lng, latitude: 20, accuracyLevel: "approximate",
    accuracyNote: "Synthetic coordinate", isPrimary: true, role: null }],
});
const anchors = getEventMapAnchors([event("one", 100), event("two", 110), event("far-side", -100)]);
const viewport = { width: 800, height: 600, zoom: 4, project: (lng: number) => lng < 0 ? null : { x: lng === 100 ? 400 : 560, y: 300 } };
const measure = () => ({ width: 100, height: 24 });
const overlaps = (a: OverlayRect, b: OverlayRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

describe("prototype spherical overlays", () => {
  it("projects before grouping, preserving public identity and approximate semantics while hiding occluded anchors", () => {
    const layout = buildOverlayLayout({ viewport, anchors, labels: [], occupied: [], measure });
    expect(layout.groups.map((group) => group.anchors[0].event.slug)).toEqual(["one", "two"]);
    expect(layout.groups[0].anchors[0].location.accuracyNote).toBe("Synthetic coordinate");
    expect(anchors).toHaveLength(3); // Culling never deletes the event data used by HTML links.
  });

  it("moves labels around the current measured card, then hides them when neither side fits", () => {
    const card = { left: 425, right: 700, top: 250, bottom: 350 };
    const result = buildOverlayLayout({ viewport, anchors: anchors.slice(0, 1), labels: [], occupied: [card], measure });
    expect(result.groups[0].labelSide).toBe("left");
    expect(overlaps(result.groups[0].labelBox!, card)).toBe(false);
    const expanded = { left: 250, right: 700, top: 250, bottom: 280 };
    const hidden = buildOverlayLayout({ viewport, anchors: anchors.slice(0, 1), labels: [], occupied: [card, expanded],
      measure: () => ({ width: 160, height: 60 }) });
    expect(hidden.groups[0].labelBox).toBeUndefined();
  });

  it("uses real label dimensions and every occupied rectangle rather than a fixed left exclusion box", () => {
    const labels = [{ id: "city", name: "Synthetic city", lng: 100, lat: 20 }];
    const clear = buildOverlayLayout({ viewport, anchors: [], labels, occupied: [], measure });
    expect(clear.labels).toHaveLength(1);
    const controls = { left: 300, right: 700, top: 280, bottom: 340 };
    expect(buildOverlayLayout({ viewport, anchors: [], labels, occupied: [controls], measure }).labels).toEqual([]);
    const wide = buildOverlayLayout({ viewport, anchors: [], labels, occupied: [], measure: () => ({ width: 790, height: 24 }) });
    expect(wide.labels).toEqual([]);
  });

  it("removes marker hit targets underneath the current reading or control rectangles", () => {
    const occupied = [{ left: 385, right: 450, top: 285, bottom: 350 }];
    expect(buildOverlayLayout({ viewport, anchors, labels: [], occupied, measure }).groups.map((group) => group.anchors[0].event.slug))
      .toEqual(["two"]);
  });

  it("prioritizes the selected group when measured labels compete for space", () => {
    const near = { ...viewport, project: (lng: number) => ({ x: lng === 100 ? 400 : 450, y: 300 }) };
    const layout = buildOverlayLayout({ viewport: near, anchors: anchors.slice(0, 2), labels: [], occupied: [], measure,
      selectedEvent: "two" });
    expect(layout.groups[0].anchors[0].event.slug).toBe("two");
    expect(layout.groups[0].labelBox).toBeDefined();
    const boxes = layout.groups.flatMap((group) => group.labelBox ? [group.labelBox] : []);
    if (boxes.length === 2) expect(overlaps(boxes[0], boxes[1])).toBe(false);
  });

  it("ties an overseas journey name to the active authored stop and applies the same occlusion", () => {
    const stop = HISTORY_JOURNEY.stops.find((stop) => stop.id === "paris-1919")!;
    const visible = buildOverlayLayout({ viewport, anchors, labels: [], occupied: [], measure, stop });
    expect(visible.stop?.label).toContain("Paris");
    expect(visible.stop?.label).toContain("Vị trí gần đúng");
    expect(visible.groups).toEqual([]);
    const hidden = buildOverlayLayout({ viewport: { ...viewport, project: () => null }, anchors, labels: [], occupied: [], measure, stop });
    expect(hidden.stop).toBeNull();
  });

  it("keeps labels clear of expansion controls without deleting their true anchor targets", () => {
    const obstacles = [{ left: 420, right: 550, top: 280, bottom: 320 }];
    const result = buildOverlayLayout({ viewport, anchors: anchors.slice(0, 1), labels: [], occupied: [], labelObstacles: obstacles, measure });
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0].labelSide).toBe("left");
    expect(overlaps(result.groups[0].labelBox!, obstacles[0])).toBe(false);
  });
});
