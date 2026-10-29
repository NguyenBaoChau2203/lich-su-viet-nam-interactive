import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildProvinceAreas, ringSelfIntersects } from "../../scripts/province-boundaries/build_areas.mjs";
import { parseProvinceAreas, provinceAreaAnchor } from "@/lib/locality/province-areas";
import { cameraSafeProvinceLift, PROVINCE_AREA_BASE_RADIUS, PROVINCE_AREA_LIFT } from "@/lib/explorer/cinematic/province-areas";

const membership = JSON.parse(
  readFileSync(resolve("docs/audits/sources/2026-10-24-vietnam-province-membership.json"), "utf8"),
);

describe("province area admission and camera-safe lift", () => {
  it("blocks bow-tie rings and unexplained relation members", () => {
    expect(
      ringSelfIntersects([
        [0, 0],
        [1, 1],
        [0, 1],
        [1, 0],
        [0, 0],
      ]),
    ).toBe(true);

    const bowTie = buildProvinceAreas(
      {
        nodes: [
          { id: 1, lon: 0, lat: 0 },
          { id: 2, lon: 1, lat: 1 },
          { id: 3, lon: 0, lat: 1 },
          { id: 4, lon: 1, lat: 0 },
        ],
        ways: [{ id: 10, nodes: [1, 2, 3, 4, 1] }],
        relations: [{ id: 100, members: [{ type: "w", ref: 10, role: "outer" }] }],
      },
      { units: [{ code: "01", officialName: "Hanoi", osmRelationId: 100 }] },
    );
    expect(bowTie.ledger[0].status).toBe("blocked");
    expect(bowTie.ledger[0].blockers.join(" ")).toMatch(/SELF_INTERSECTING/);

    const nested = buildProvinceAreas(
      {
        nodes: [
          { id: 1, lon: 105, lat: 21 },
          { id: 2, lon: 106, lat: 21 },
          { id: 3, lon: 106, lat: 22 },
          { id: 4, lon: 105, lat: 22 },
        ],
        ways: [{ id: 10, nodes: [1, 2, 3, 4, 1] }],
        relations: [
          {
            id: 100,
            members: [
              { type: "w", ref: 10, role: "outer" },
              { type: "r", ref: 999, role: "outer" },
            ],
          },
        ],
      },
      { units: [{ code: "01", officialName: "Hanoi", osmRelationId: 100 }] },
    );
    expect(nested.ledger[0].status).toBe("blocked");
    expect(nested.ledger[0].blockers.join(" ")).toMatch(/NESTED_RELATION_UNRESOLVED|UNEXPECTED_MEMBER/);
  });

  it("keeps the incomplete pinned input negative control blocked for Khánh Hòa without recovery", () => {
    const legacy = JSON.parse(
      readFileSync(resolve("docs/audits/sources/2026-10-29-province-area-incomplete-control.json"), "utf8"),
    );
    const khanhHoa = legacy.blocked[0];
    expect(khanhHoa?.code).toBe("56");
    expect(khanhHoa?.status).toBe("blocked");
    expect(khanhHoa?.blockers).toContain("MISSING_WAY");
    expect(khanhHoa?.missingWays?.length).toBe(16);
    expect(legacy.admittedCount).toBe(33);
  });

  it("ships a complete runtime asset whose codes equal the canonical 34 set", () => {
    const shipped = parseProvinceAreas(
      JSON.parse(readFileSync(resolve("public/maps/history-vietnam-province-areas.geojson"), "utf8")),
    );
    const expected = membership.units.map((unit: { code: string }) => unit.code).sort();
    expect(shipped.coverageStatus).toBe("complete");
    expect(shipped.features.map((f) => f.properties.code)).toEqual(expected);
    expect(shipped.features.some((f) => f.properties.code === "56")).toBe(true);
    const completeLedger = JSON.parse(
      readFileSync(resolve("docs/audits/sources/2026-10-29-province-area-admission-complete.json"), "utf8"),
    );
    expect(completeLedger.units.every((row: { status: string }) => row.status === "admitted")).toBe(true);
    expect(completeLedger.units).toHaveLength(34);
  });

  it("rejects complete coverage that omits a canonical code", () => {
    expect(() =>
      parseProvinceAreas({
        type: "FeatureCollection",
        schemaVersion: 1,
        boundaryKind: "province-area",
        referenceFramework: "VN-34-2025",
        coverageStatus: "complete",
        admittedCount: 1,
        sourceTimestamp: "2026-10-23T20:20:51Z",
        sourceSnapshotSha256: "x",
        license: { id: "ODbL-1.0", url: "https://opendatacommons.org/licenses/odbl/1-0/", attribution: "© OSM" },
        features: [
          {
            type: "Feature",
            properties: {
              code: "01",
              officialName: "Hanoi",
              boundaryKind: "province-area",
              referenceFramework: "VN-34-2025",
              osmRelationId: 1,
              partCount: 1,
              holeCount: 0,
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [105, 21],
                  [106, 21],
                  [106, 22],
                  [105, 22],
                  [105, 21],
                ],
              ],
            },
          },
        ],
      }),
    ).toThrow(/canonical 34/);
  });

  it("chooses an interior anchor outside holes for a square-with-hole", () => {
    const feature = parseProvinceAreas({
      type: "FeatureCollection",
      schemaVersion: 1,
      boundaryKind: "province-area",
      referenceFramework: "VN-34-2025",
      coverageStatus: "partial-demo",
      admittedCount: 1,
      sourceTimestamp: "2026-10-23T20:20:51Z",
      sourceSnapshotSha256: "x",
      license: { id: "ODbL-1.0", url: "https://opendatacommons.org/licenses/odbl/1-0/", attribution: "© OSM" },
      features: [
        {
          type: "Feature",
          properties: {
            code: "01",
            officialName: "Hanoi",
            boundaryKind: "province-area",
            referenceFramework: "VN-34-2025",
            osmRelationId: 1,
            partCount: 1,
            holeCount: 1,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [0, 0],
                [4, 0],
                [4, 4],
                [0, 4],
                [0, 0],
              ],
              [
                [1, 1],
                [3, 1],
                [3, 3],
                [1, 3],
                [1, 1],
              ],
            ],
          },
        },
      ],
    }).features[0];
    const anchor = provinceAreaAnchor(feature);
    expect(anchor).not.toBeNull();
    expect(anchor!.lng).not.toBeCloseTo(2, 5);
    expect(anchor!.lat).not.toBeCloseTo(2, 5);
    // Must not land in the hole around (2,2).
    expect(!(anchor!.lng > 1 && anchor!.lng < 3 && anchor!.lat > 1 && anchor!.lat < 3)).toBe(true);
  });

  it("clamps lift so the camera stays outside the raised cap", () => {
    const close = cameraSafeProvinceLift({
      cameraRadius: 1.0058476425,
      near: 0.0029,
      baseRadius: PROVINCE_AREA_BASE_RADIUS,
      requestedLift: PROVINCE_AREA_LIFT,
    });
    expect(close).toBeLessThan(PROVINCE_AREA_LIFT);
    expect(PROVINCE_AREA_BASE_RADIUS + close).toBeLessThan(1.0058476425);
    const open = cameraSafeProvinceLift({
      cameraRadius: 1.2,
      near: 0.05,
      requestedLift: PROVINCE_AREA_LIFT,
    });
    expect(open).toBeCloseTo(PROVINCE_AREA_LIFT, 6);
  });
});
