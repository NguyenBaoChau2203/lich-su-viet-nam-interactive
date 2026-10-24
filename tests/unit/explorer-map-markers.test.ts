import { describe, expect, it } from "vitest";
import { getEventMapAnchors, groupMapAnchors, getMapGroupLabel } from "@/lib/explorer/map-markers";
import type { ExplorerEvent, ExplorerLocation } from "@/lib/explorer/types";

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
