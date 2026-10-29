import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EXPECTED_KHANH_HOA_WAY_IDS, mergeRecovery } from "../../scripts/province-boundaries/merge_khanh_hoa_recovery.mjs";
import {
  countBorderDefects,
  ownersAt,
  simplifyCollection,
  simplifyCollectionIndependent,
  toleranceScreenPixels,
} from "../../scripts/province-boundaries/simplify_areas.mjs";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { parseProvinceAreas } from "@/lib/locality/province-areas";

const shared: number[][] = [[105, 21]];
for (let i = 1; i <= 12; i++) shared.push([105 + i * 0.08, 21 + (i % 2 === 0 ? 0 : 0.12)]);
shared.push([105 + 13 * 0.08, 21]);
const south = [...shared, [shared[shared.length - 1][0], 20.2], [105, 20.2], shared[0]];
const north = [...shared.slice().reverse(), [105, 22.4], [shared[shared.length - 1][0], 22.4], shared[shared.length - 1]];

function pair(coordinatesA: number[][], coordinatesB: number[][]) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { code: "19", officialName: "Thái Nguyên" },
        geometry: { type: "Polygon", coordinates: [coordinatesA] },
      },
      {
        type: "Feature",
        properties: { code: "24", officialName: "Bắc Ninh" },
        geometry: { type: "Polygon", coordinates: [coordinatesB] },
      },
    ],
  };
}

describe("shared-arc province simplification", () => {
  it("keeps one shared border where independent rings cross", () => {
    const source = pair(south, north);
    const independent = simplifyCollectionIndependent(source, 8000);
    const sharedArc = simplifyCollection(source, 8000).collection;
    expect(countBorderDefects(independent).crossings).toBeGreaterThan(0);
    expect(countBorderDefects(sharedArc)).toMatchObject({ crossings: 0, overlaps: 0 });
    const border = sharedArc.features[0].geometry.coordinates[0];
    const neighbor = sharedArc.features[1].geometry.coordinates[0];
    const borderKeys = border.map(([lon, lat]: number[]) => `${lon},${lat}`);
    const neighborKeys = neighbor.map(([lon, lat]: number[]) => `${lon},${lat}`);
    expect(neighborKeys.some((key: string) => borderKeys.includes(key))).toBe(true);
  });

  it("keeps screen error of a 200 m tolerance below one pixel through zoom 8", () => {
    expect(toleranceScreenPixels(200, 8)).toBeLessThan(1);
  });

  it("gives the reviewed border point a single shipped owner and no cross-province defects", () => {
    const shipped = parseProvinceAreas(
      JSON.parse(readFileSync(resolve("public/maps/history-vietnam-province-areas.geojson"), "utf8")),
    );
    const defects = countBorderDefects(shipped);
    expect(defects.crossings).toBe(0);
    expect(defects.overlaps).toBe(0);
    const owners = ownersAt(shipped, 105.88752842741935, 21.328063508064513);
    expect(owners).toEqual(["19"]);
    const samples = JSON.parse(
      readFileSync(resolve("docs/audits/sources/2026-10-29-province-area-interior-samples.json"), "utf8"),
    );
    expect(samples.shortUnits).toEqual([]);
    expect(samples.units.map((unit: { code: string }) => unit.code).sort()).toEqual(
      LOCALITIES.map((row) => row.code).sort(),
    );
    for (const unit of samples.units) {
      expect(unit.points.length).toBeGreaterThanOrEqual(2);
      for (const point of unit.points) {
        expect(ownersAt(shipped, point.lng, point.lat)).toEqual([unit.code]);
      }
    }
  });
});

describe("Khánh Hòa recovery qualification", () => {
  const base = {
    source: { timestamp: "2026-10-23T20:20:51Z", license: "ODbL-1.0" },
    nodes: [] as { id: number; lat: number; lon: number }[],
    ways: [],
    relations: [],
  };
  const recoveryFor = (mutate?: (wayId: number, way: { timestamp: string }, node: { timestamp: string }) => void) => {
    const ways = new Map();
    const nodes = new Map();
    EXPECTED_KHANH_HOA_WAY_IDS.forEach((wayId, index) => {
      const nodeId = 9000 + index;
      const way = { id: wayId, version: 1, timestamp: "2026-02-01T00:00:00Z", tags: {}, nodes: [nodeId] };
      const node = { id: nodeId, lat: 12 + index * 0.01, lon: 109, timestamp: "2026-01-01T00:00:00Z" };
      mutate?.(wayId, way, node);
      ways.set(wayId, way);
      nodes.set(nodeId, node);
    });
    return { ways, nodes };
  };

  it("accepts recovered ways whose timestamps precede the pinned snapshot", () => {
    const result = mergeRecovery(base, recoveryFor());
    expect(result.ok).toBe(true);
    expect(result.addedWays).toHaveLength(EXPECTED_KHANH_HOA_WAY_IDS.length);
  });

  it("blocks a missing timestamp and a timestamp after the snapshot", () => {
    const missing = mergeRecovery(base, recoveryFor((wayId, way) => {
      if (wayId === EXPECTED_KHANH_HOA_WAY_IDS[0]) way.timestamp = "";
    }));
    expect(missing.ok).toBe(false);
    expect(missing.conflicts.some((row: { kind: string }) => row.kind === "MISSING_TIMESTAMP")).toBe(true);

    const future = mergeRecovery(base, recoveryFor((wayId, way) => {
      if (wayId === EXPECTED_KHANH_HOA_WAY_IDS[0]) way.timestamp = "2026-10-24T00:00:00Z";
    }));
    expect(future.conflicts.some((row: { kind: string }) => row.kind === "TIMESTAMP_AFTER_SNAPSHOT")).toBe(true);
  });
});
