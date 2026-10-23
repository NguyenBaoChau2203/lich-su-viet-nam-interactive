import { describe, expect, it } from "vitest";
import { createMapProjection, getFootprintBounds } from "@/lib/explorer/projection";
import type { GeoBounds, MapFootprint } from "@/lib/explorer/types";

// Synthetic test bounds only — not historical or geographic claims
const syntheticBounds: GeoBounds = {
  west: 0,
  east: 4,
  south: 1,
  north: 5,
};

describe("createMapProjection (synthetic coordinates)", () => {
  it("projects east to +X, north to -Z, centers on bounds, and round-trips accurately", () => {
    const projection = createMapProjection(syntheticBounds);
    const [longitude, latitude] = projection.unproject(projection.project(2, 3));
    expect(longitude).toBeCloseTo(2, 8);
    expect(latitude).toBeCloseTo(3, 8);

    const center = projection.project(2, 3);
    expect(center.x).toBeCloseTo(0, 8);
    expect(center.z).toBeCloseTo(0, 8);

    const eastPoint = projection.project(4, 3);
    const westPoint = projection.project(0, 3);
    expect(eastPoint.x).toBeGreaterThan(0);
    expect(westPoint.x).toBeLessThan(0);

    const northPoint = projection.project(2, 5);
    const southPoint = projection.project(2, 1);
    expect(northPoint.z).toBeLessThan(0);
    expect(southPoint.z).toBeGreaterThan(0);

    // Maximum geographic span is 100 world units by default (north-south span is 4 deg, east-west scaled by cos(3 deg))
    expect(southPoint.z - northPoint.z).toBeCloseTo(100, 6);
  });

  it("scales longitude by cosine of the bounds center latitude and round-trips arbitrary points", () => {
    const highLatBounds: GeoBounds = {
      west: 100,
      east: 110,
      south: 10,
      north: 20,
    };
    const projection = createMapProjection(highLatBounds, 100);
    for (const [lng, lat] of [
      [100, 10],
      [105, 15],
      [109.25, 18.75],
      [102.125, 11.5],
    ] as const) {
      const projected = projection.project(lng, lat);
      const [unLng, unLat] = projection.unproject(projected);
      expect(unLng).toBeCloseTo(lng, 8);
      expect(unLat).toBeCloseTo(lat, 8);
    }

    const west = projection.project(100, 15);
    const east = projection.project(110, 15);
    const south = projection.project(105, 10);
    const north = projection.project(105, 20);
    const cosCenter = Math.cos((15 * Math.PI) / 180);
    expect(south.z - north.z).toBeCloseTo(100, 6);
    expect(east.x - west.x).toBeCloseTo(100 * cosCenter, 6);
  });

  it("computes GeoBounds across Polygon and MultiPolygon features in a synthetic footprint", () => {
    const syntheticFootprint: MapFootprint = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { partId: "synthetic-a", sourceId: "synthetic" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [10, 20],
                [14, 20],
                [14, 25],
                [10, 25],
                [10, 20],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: { partId: "synthetic-b", sourceId: "synthetic" },
          geometry: {
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [8, 18],
                  [9, 18],
                  [9, 19],
                  [8, 19],
                  [8, 18],
                ],
              ],
            ],
          },
        },
      ],
    };

    expect(getFootprintBounds(syntheticFootprint)).toEqual({
      west: 8,
      east: 14,
      south: 18,
      north: 25,
    });
  });
});
