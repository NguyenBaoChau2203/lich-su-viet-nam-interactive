import { describe, expect, it } from "vitest";
import { buildClusterExpansion, fitClusterView, getMapSafeArea, placeClusterPanel } from "@/lib/explorer/cluster-expansion";
import { createGlobeViewport } from "@/lib/explorer/cinematic/projection";
import { viewToCameraPose } from "@/lib/explorer/cinematic/camera";
import { rectanglesOverlap } from "@/lib/explorer/cinematic/overlays";
import { getEventMapAnchors } from "@/lib/explorer/map-markers";
import type { ExplorerEvent } from "@/lib/explorer/types";

// Synthetic geometry fixtures, not new historical coordinates or production content.
const size = { width: 1280, height: 720 };
const safeArea = { left: 350, right: 940, top: 80, bottom: 600 };

const target = (x: number, y: number) => ({ left: x - 16, right: x + 16, top: y - 16, bottom: y + 16 });
const fixture = (slug: string): ExplorerEvent => ({
  id: slug, slug, title: slug, summary: "Synthetic", dateText: "1954", datePrecision: "year", isFeatured: false,
  topicSlugs: [], secondaryTopics: [], startYear: 1954, endYear: null, sourceCount: 1,
  locations: [{ slug, name: slug, historicalName: null, longitude: 105, latitude: 20, accuracyLevel: "region",
    accuracyNote: "Synthetic", isPrimary: true, role: null }],
});
const anchors = getEventMapAnchors([fixture("c"), fixture("a"), fixture("b")]).map(anchor => ({ ...anchor, x: 610, y: 330 }));

describe("all-member camera fit", () => {
  it("uses every distinct member and the actual asymmetric safe area rather than the first point", () => {
    const locations = [{ lat: 20, lng: 105 }, { lat: 22, lng: 106 }, { lat: 20, lng: 105 }];
    const result = fitClusterView(size, { locations, safeArea })!;
    expect(result.distinctCount).toBe(2);
    expect(result.separated).toBe(false); // The duplicate still needs individual screen selection.
    expect(result.view.zoom).toBeGreaterThan(5.4);
    expect(result.view.zoom).toBeLessThan(11);
    expect(result.view.lng).not.toBe(locations[0].lng);
    const viewport = createGlobeViewport(viewToCameraPose(result.view, size), size, result.view.zoom);
    for (const location of locations) {
      const point = viewport.project(location.lng, location.lat)!;
      expect(point).not.toBeNull();
      expect(point.x - 16).toBeGreaterThanOrEqual(safeArea.left);
      expect(point.x + 16).toBeLessThanOrEqual(safeArea.right);
      expect(point.y - 16).toBeGreaterThanOrEqual(safeArea.top);
      expect(point.y + 16).toBeLessThanOrEqual(safeArea.bottom);
    }
    expect(fitClusterView(size, { locations: [...locations].reverse(), safeArea })).toEqual(result);
  });

  it("reaches 11 for close distinct inputs and reports residual or coincident overlaps honestly", () => {
    const close = [{ lat: 20, lng: 105 }, { lat: 20.02, lng: 105.03 }];
    expect(fitClusterView(size, { locations: close, safeArea })).toMatchObject({ view: { zoom: 11 }, separated: true });
    expect(fitClusterView(size, { locations: [close[0], close[0]], safeArea })).toMatchObject({
      view: { zoom: 11 }, distinctCount: 1, separated: false,
    });
    expect(fitClusterView(size, { locations: [close[0], { lat: 20.00001, lng: 105.00001 }], safeArea })?.separated).toBe(false);
  });

  it("fits a lower free strip even when the world-scale sphere cannot reach that screen area", () => {
    const locations = [{ lat: 20, lng: 105 }, { lat: 22, lng: 106 }];
    const lowerStrip = { left: 12, right: 1268, top: 340, bottom: 610 };
    const result = fitClusterView(size, { locations, safeArea: lowerStrip });
    expect(result).not.toBeNull();
    expect(result!.view.zoom).toBeGreaterThan(5.4);
    const viewport = createGlobeViewport(viewToCameraPose(result!.view, size), size, result!.view.zoom);
    for (const location of locations) {
      const point = viewport.project(location.lng, location.lat)!;
      expect(point.y - 16).toBeGreaterThanOrEqual(lowerStrip.top);
      expect(point.y + 16).toBeLessThanOrEqual(lowerStrip.bottom);
    }
  });

  it("handles the seam, invalid/empty input and unavailable safe space without invalid camera commands", () => {
    const result = fitClusterView(size, { locations: [{ lat: 10, lng: 179.9 }, { lat: 10, lng: -179.9 }], safeArea })!;
    expect(Math.abs(result.view.lng)).toBeGreaterThan(179);
    expect(Object.values(result.view).every(Number.isFinite)).toBe(true);
    expect(fitClusterView(size, { locations: [], safeArea })).toBeNull();
    expect(fitClusterView(size, { locations: [{ lat: NaN, lng: 0 }], safeArea })).toBeNull();
    expect(fitClusterView(size, { locations: [{ lat: 20, lng: 105 }], safeArea: { ...safeArea, right: 360 } })).toBeNull();
  });
});

describe("truthful screen expansion", () => {
  it("returns stable disjoint 32px targets, leader origins and original event/location metadata", () => {
    const occupied = [{ left: 600, right: 930, top: 100, bottom: 300 }];
    const result = buildClusterExpansion(anchors, size, occupied);
    expect(result.unplacedKeys).toEqual([]);
    expect(result.markers.map(marker => marker.key)).toEqual([...anchors.map(a => a.key)].sort());
    for (const [index, marker] of result.markers.entries()) {
      expect(marker.anchor).toEqual({ x: 610, y: 330 });
      expect(marker.location).toEqual(anchors.find(anchor => anchor.key === marker.key)!.location);
      expect(marker.x).toBeGreaterThanOrEqual(16);
      expect(marker.x).toBeLessThanOrEqual(size.width - 16);
      expect(marker.y).toBeGreaterThanOrEqual(16);
      expect(marker.y).toBeLessThanOrEqual(size.height - 16);
      for (const box of occupied) expect(rectanglesOverlap(target(marker.x, marker.y), box, 4)).toBe(false);
      for (const other of result.markers.slice(index + 1)) expect(rectanglesOverlap(target(marker.x, marker.y), target(other.x, other.y), 4)).toBe(false);
    }
    expect(buildClusterExpansion([...anchors].reverse(), size, occupied)).toEqual(result);
    expect(anchors.every(anchor => anchor.x === 610 && anchor.location.longitude === 105)).toBe(true);
  });

  it("keeps different locations of one event and returns overflow keys for the complete HTML list", () => {
    const multi = [...anchors, { ...anchors[0], key: "c@second", location: { ...anchors[0].location, slug: "second" } }];
    expect(buildClusterExpansion(multi, size, []).markers).toHaveLength(4);
    const blocked = buildClusterExpansion(multi, size, [{ left: 0, right: size.width, top: 0, bottom: size.height }]);
    expect(blocked.markers).toEqual([]);
    expect(blocked.unplacedKeys).toHaveLength(4);
  });

  it("places the panel and fit rectangle clear of measured overlays, including expanded attribution", () => {
    const occupied = [{ left: 0, right: 320, top: 0, bottom: 400 }, { left: 950, right: 1280, top: 80, bottom: 600 },
      { left: 0, right: 1280, top: 0, bottom: 60 }, { left: 0, right: 1280, top: 620, bottom: 720 }];
    const safe = getMapSafeArea(size, occupied);
    expect(safe.right - safe.left).toBeGreaterThan(500);
    for (const box of occupied) expect(rectanglesOverlap(safe, box)).toBe(false);
    const panel = placeClusterPanel({ x: 610, y: 330 }, size, occupied);
    expect(panel.right - panel.left).toBeGreaterThanOrEqual(240);
    for (const box of occupied) expect(rectanglesOverlap(panel, box)).toBe(false);
  });
});
