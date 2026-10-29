import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { parseProvinceAreas, provinceAreaAnchor, provinceAreaPolygons } from "@/lib/locality/province-areas";

function pointInRing(point: readonly [number, number], ring: readonly (readonly [number, number])[]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + Number.EPSILON) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

describe("national province-area coverage", () => {
  const shipped = parseProvinceAreas(
    JSON.parse(readFileSync(resolve("public/maps/history-vietnam-province-areas.geojson"), "utf8")),
  );
  const expected = LOCALITIES.map((row) => row.code).sort();

  it("matches canonical locality codes exactly once", () => {
    expect(shipped.coverageStatus).toBe("complete");
    expect(shipped.features.map((f) => f.properties.code)).toEqual(expected);
    expect(new Set(shipped.features.map((f) => f.properties.code)).size).toBe(34);
  });

  it("provides a verified interior anchor for every shipped unit", () => {
    for (const feature of shipped.features) {
      const anchor = provinceAreaAnchor(feature);
      expect(anchor, feature.properties.code).not.toBeNull();
      const polygons = provinceAreaPolygons(feature);
      let inside = false;
      for (const polygon of polygons) {
        const [outer, ...holes] = polygon;
        if (!pointInRing([anchor!.lng, anchor!.lat], outer)) continue;
        if (holes.some((hole) => pointInRing([anchor!.lng, anchor!.lat], hole))) continue;
        inside = true;
      }
      expect(inside, `${feature.properties.code} anchor outside shells or inside a hole`).toBe(true);
      // This anchor is one interior point. Two source-qualified samples per unit are asserted
      // in province-areas-simplification.test.ts and are not implied by a mid-edge longitude.
    }
  });
});
