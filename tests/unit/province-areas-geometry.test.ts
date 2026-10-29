import { describe, expect, it } from "vitest";
import { BufferGeometry, Float32BufferAttribute } from "three";
import {
  PROVINCE_AREA_BASE_RADIUS,
  PROVINCE_AREA_LIFT,
  meanRadius,
  pointerToNdc,
  ringWallSample,
} from "@/lib/explorer/cinematic/province-areas";
import { parseProvinceAreas, provinceAreaPolygons } from "@/lib/locality/province-areas";

const square = (holes: number[][][] = []) => ({
  type: "Polygon" as const,
  coordinates: [
    [
      [105, 21],
      [106, 21],
      [106, 22],
      [105, 22],
      [105, 21],
    ],
    ...holes,
  ],
});

const multi = {
  type: "MultiPolygon" as const,
  coordinates: [
    square().coordinates,
    [
      [
        [107, 20],
        [107.2, 20],
        [107.2, 20.2],
        [107, 20.2],
        [107, 20],
      ],
    ],
  ],
};

function collection(features: unknown[]) {
  return parseProvinceAreas({
    type: "FeatureCollection",
    schemaVersion: 1,
    boundaryKind: "province-area",
    referenceFramework: "VN-34-2025",
    coverageStatus: "partial-demo",
    admittedCount: features.length,
    sourceTimestamp: "2026-10-23T20:20:51Z",
    sourceSnapshotSha256: "test",
    license: { id: "ODbL-1.0", url: "https://opendatacommons.org/licenses/odbl/1-0/", attribution: "© OpenStreetMap contributors" },
    features,
  });
}

describe("province area schema and geometry helpers", () => {
  it("admits Polygon with a hole and MultiPolygon islands without inventing rings", () => {
    const hole = [
      [105.4, 21.4],
      [105.6, 21.4],
      [105.6, 21.6],
      [105.4, 21.6],
      [105.4, 21.4],
    ];
    const parsed = collection([
      {
        type: "Feature",
        id: "province-area:01",
        properties: {
          code: "01",
          officialName: "Thành phố Hà Nội",
          boundaryKind: "province-area",
          referenceFramework: "VN-34-2025",
          osmRelationId: 1,
          partCount: 1,
          holeCount: 1,
        },
        geometry: square([hole]),
      },
      {
        type: "Feature",
        id: "province-area:31",
        properties: {
          code: "31",
          officialName: "Thành phố Hải Phòng",
          boundaryKind: "province-area",
          referenceFramework: "VN-34-2025",
          osmRelationId: 2,
          partCount: 2,
          holeCount: 0,
        },
        geometry: multi,
      },
    ]);
    expect(parsed.features).toHaveLength(2);
    const hanoi = provinceAreaPolygons(parsed.features[0]);
    expect(hanoi).toHaveLength(1);
    expect(hanoi[0]).toHaveLength(2);
    const haiPhong = provinceAreaPolygons(parsed.features[1]);
    expect(haiPhong).toHaveLength(2);
  });

  it("rejects unknown codes and non-area geometry", () => {
    expect(() =>
      collection([
        {
          type: "Feature",
          properties: { code: "99", boundaryKind: "province-area" },
          geometry: square(),
        },
      ]),
    ).toThrow(/Invalid or duplicate province code/);
  });

  it("keeps wall bottoms at base radius while tops use the raised radius", () => {
    const ring = square().coordinates[0] as [number, number][];
    const sample = ringWallSample(ring, PROVINCE_AREA_BASE_RADIUS, PROVINCE_AREA_BASE_RADIUS + PROVINCE_AREA_LIFT);
    expect(sample.bottom).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS, 6);
    expect(sample.top).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS + PROVINCE_AREA_LIFT, 6);
    expect(sample.delta).toBeCloseTo(PROVINCE_AREA_LIFT, 6);
  });

  it("converts pointer CSS coordinates with nonzero stage offsets using CSS size, not DPR", () => {
    const rect = { left: 120, top: 80, width: 800, height: 600 } as DOMRect;
    expect(pointerToNdc(120, 80, rect)).toEqual({ x: -1, y: 1 });
    expect(pointerToNdc(520, 380, rect)).toEqual({ x: 0, y: 0 });
    expect(pointerToNdc(920, 680, rect)).toEqual({ x: 1, y: -1 });
  });

  it("measures radial lift on a synthetic cap", () => {
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new Float32BufferAttribute(
        [
          PROVINCE_AREA_BASE_RADIUS, 0, 0,
          0, PROVINCE_AREA_BASE_RADIUS, 0,
          0, 0, PROVINCE_AREA_BASE_RADIUS,
        ],
        3,
      ),
    );
    expect(meanRadius(geometry)).toBeCloseTo(PROVINCE_AREA_BASE_RADIUS, 6);
  });
});
