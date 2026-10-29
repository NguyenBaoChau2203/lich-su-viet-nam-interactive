import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MapEventCard } from "@/components/explorer/MapEventCard";
import { MapEventList } from "@/components/explorer/MapEventList";
import { getEventMapAnchors, getEventMapAvailability, groupMapAnchors, getMapGroupLabel, MAP_LOCATION_UNAVAILABLE_EXPLANATION } from "@/lib/explorer/map-markers";
import type { ExplorerEvent, ExplorerLocation } from "@/lib/explorer/types";
import type { MapExplorerState } from "@/lib/explorer/map-state";

// All records in this file are synthetic UI/mathematics fixtures, not historical claims.
const location = (slug: string, latitude: number | null, longitude: number | null): ExplorerLocation => ({
  slug, name: slug, latitude, longitude, historicalName: null, accuracyLevel: "approximate", accuracyNote: "Synthetic", isPrimary: true, role: null,
});
const event = (slug: string, locations: ExplorerLocation[]): ExplorerEvent => ({
  id: slug, slug, title: slug, summary: "Synthetic", dateText: "1954", datePrecision: "year", isFeatured: false,
  topicSlugs: [], secondaryTopics: [], startYear: 1954, endYear: null, locations, sourceCount: 1,
});

describe("event map anchors", () => {
  it("names a close group by its curated city without pretending far-apart places share a city", () => {
    const anchors = getEventMapAnchors([event("synthetic-a", [location("one", 21, 105)]), event("synthetic-b", [location("two", 21.01, 105.01)])]);
    const group = groupMapAnchors(anchors.map((anchor) => ({ ...anchor, x: 100, y: 100 })))[0];
    const labels = [{ name: "Synthetic city", lat: 21, lng: 105 }];
    expect(getMapGroupLabel(group, labels)).toBe("Synthetic city");
    const distant = { ...group, anchors: [...group.anchors, { ...group.anchors[0], location: { ...group.anchors[0].location, slug: "far", latitude: 10, longitude: 106 } }] };
    expect(getMapGroupLabel(distant, labels)).toBe("2 sự kiện");
  });

  it("retains a single place's historical name at its own marker", () => {
    const anchors = getEventMapAnchors([event("synthetic-a", [{ ...location("one", 21, 105), historicalName: "Synthetic historical place" }])]);
    const group = groupMapAnchors(anchors.map((anchor) => ({ ...anchor, x: 100, y: 100 })))[0];
    expect(getMapGroupLabel(group, [])).toBe("Synthetic historical place");
  });
  it("retains all valid public locations, including zero coordinates, without inventing missing ones", () => {
    const anchors = getEventMapAnchors([
      event("synthetic-a", [location("zero", 0, 0), location("second", 21, 105)]),
      event("synthetic-missing", [location("missing", null, 105), location("invalid", 100, 105), location("nan", NaN, 105)]),
    ]);
    expect(anchors.map((anchor) => anchor.key)).toEqual(["synthetic-a@zero", "synthetic-a@second"]);
    expect(anchors[0].location.accuracyLevel).toBe("approximate");
  });

  it("groups overlapping screen positions while preserving distinct event and location identities", () => {
    const anchors = getEventMapAnchors([
      event("synthetic-a", [location("shared", 21, 105)]),
      event("synthetic-b", [location("shared", 21, 105)]),
      event("synthetic-c", [location("far", 16, 108)]),
    ]).map((anchor, index) => ({ ...anchor, x: index === 2 ? 300 : index * 10, y: 100 }));
    const groups = groupMapAnchors(anchors);
    expect(groups).toHaveLength(2);
    expect(groups[0].anchors.map((anchor) => anchor.event.slug)).toEqual(["synthetic-a", "synthetic-b"]);
    expect(groups.flatMap((group) => group.anchors)).toHaveLength(3);
    expect(groupMapAnchors([...anchors].reverse()).map((group) => group.key)).toEqual(groups.map((group) => group.key));
  });

  it("separates markers beyond the threshold and keeps separate positions for multi-location events", () => {
    const anchors = getEventMapAnchors([event("synthetic-a", [location("one", 21, 105), location("two", 10, 106)])]);
    expect(groupMapAnchors(anchors.map((anchor, index) => ({ ...anchor, x: index * 37, y: 0 })))).toHaveLength(2);
    expect(groupMapAnchors([])).toEqual([]);
  });

  it("groups diagonal 32px hit areas too, so distinct controls cannot intercept each other", () => {
    const anchors = getEventMapAnchors([event("a", [location("one", 21, 105)]), event("b", [location("two", 21, 105)])]);
    expect(groupMapAnchors(anchors.map((anchor, index) => ({ ...anchor, x: index * 30, y: index * 30 })))).toHaveLength(1);
  });
});

const mapState: MapExplorerState = { from: 1954, to: 1975, selectedEvent: null, view: { lat: 15.5, lng: 106.4, zoom: 3.32 } };

describe("event map availability", () => {
  it("retains every public place and accuracy note when only some places have map coordinates", () => {
    const unmapped = { ...location("synthetic-unmapped-place", null, null), accuracyNote: "Synthetic unmapped uncertainty" };
    const mapped = { ...location("synthetic-mapped-place", 21, 105), accuracyNote: "Synthetic mapped uncertainty" };
    const mixed = event("synthetic-mixed-card", [unmapped, mapped]);
    const card = renderToStaticMarkup(createElement(MapEventCard, { event: mixed, state: mapState, onClose: () => undefined }));
    expect(card).toContain("synthetic-unmapped-place");
    expect(card).toContain("Synthetic unmapped uncertainty");
    expect(card).toContain("synthetic-mapped-place");
    expect(card).toContain("Synthetic mapped uncertainty");
    expect(getEventMapAnchors([mixed]).map((anchor) => anchor.location.slug)).toEqual(["synthetic-mapped-place"]);
    expect(card).toContain("1 nguồn tham khảo");
  });

  it("uses one eligibility rule for empty, partial, non-finite, out-of-range, zero and secondary locations", () => {
    expect(getEventMapAvailability(event("synthetic-empty", []))).toEqual({ status: "unavailable", reason: "no-public-location" });
    expect(getEventMapAvailability(event("synthetic-null", [location("partial", null, 105)]))).toEqual({ status: "unavailable", reason: "missing-coordinates" });
    expect(getEventMapAvailability(event("synthetic-half", [location("half", 16, null)]))).toEqual({ status: "unavailable", reason: "missing-coordinates" });
    for (const bad of [NaN, Infinity, -Infinity, 100, -90]) {
      const result = getEventMapAvailability(event("synthetic-invalid", [location("bad", bad, 105)]));
      expect(result.status).toBe("unavailable");
      if (result.status === "unavailable") expect(result.reason).toBe("invalid-coordinates");
    }
    const outOfRange = getEventMapAvailability(event("synthetic-lng", [location("bad", 16, 181)]));
    expect(outOfRange.status).toBe("unavailable");
    if (outOfRange.status === "unavailable") expect(outOfRange.reason).toBe("invalid-coordinates");
    const zero = getEventMapAvailability(event("synthetic-zero", [location("zero", 0, 0)]));
    expect(zero).toMatchObject({ status: "available" });
    if (zero.status === "available") expect(zero.anchors.map((anchor) => anchor.key)).toEqual(["synthetic-zero@zero"]);
    const mixed = getEventMapAvailability(event("synthetic-mixed", [location("primary", 100, 200), location("secondary", 16, 108)]));
    expect(mixed.status).toBe("available");
    if (mixed.status === "available") {
      expect(mixed.anchors.map((anchor) => anchor.location.slug)).toEqual(["secondary"]);
      expect(mixed.anchors[0].location).toMatchObject({ latitude: 16, longitude: 108 });
    }
    expect(getEventMapAnchors([event("synthetic-empty", []), event("synthetic-mixed", [location("primary", NaN, 105), location("secondary", 21, 105)])]).map((anchor) => anchor.key))
      .toEqual(["synthetic-mixed@secondary"]);
  });

  it("explains a summary-only event and keeps a map action only for an eligible location", () => {
    const html = renderToStaticMarkup(createElement(MapEventList, {
      events: [event("synthetic-empty", []), event("synthetic-mappable", [location("point", 16, 108)])],
      state: mapState,
      onSelect: () => undefined,
      detailsRef: { current: null },
    }));
    expect(html).toContain('data-event-slug="synthetic-empty"');
    expect(html).toContain("Xem tóm tắt");
    expect(html).not.toContain("Xem tóm tắt trên bản đồ");
    expect(html).toContain(MAP_LOCATION_UNAVAILABLE_EXPLANATION);
    expect(html).toContain("Xem vị trí trên bản đồ");
    expect(html).toContain('data-map-availability="no-public-location"');
    expect(html).toContain('data-map-availability="available"');
    const card = renderToStaticMarkup(createElement(MapEventCard, { event: event("synthetic-empty", []), state: mapState, onClose: () => undefined }));
    expect(card).toContain(MAP_LOCATION_UNAVAILABLE_EXPLANATION);
    expect(card).not.toContain("Địa điểm đang được bổ sung.");
    expect(card).toContain("Synthetic");
    expect(card).toContain("1 nguồn tham khảo");
  });
});
