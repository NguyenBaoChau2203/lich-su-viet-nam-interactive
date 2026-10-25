import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  cameraPoseToView,
  interpolateView,
  journeyFlightDurationMs,
  panView,
  tiltDegForZoom,
  viewToCameraPose,
  vietnamOverviewView,
  worldOverviewView,
  zoomView,
  type GlobeStageSize,
} from "@/lib/explorer/cinematic/camera";
import {
  dot,
  geoToVector,
  isNearSide,
  localBasis,
  projectToScreen,
  sphereHorizonPoints,
  vectorToGeo,
  cross,
} from "@/lib/explorer/cinematic/projection";
import { formatMapView, type MapView } from "@/lib/explorer/map-view";
import { HISTORY_JOURNEY } from "@/lib/explorer/journey";

const DESKTOP_VIEWPORTS: GlobeStageSize[] = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const LEGACY_ZOOMS = [1.2, 4.5, 6.5, 8, 10, 11];

/** Mainland Vietnam = the polygon with the largest bounding box in the sourced tabletop GeoJSON. */
function mainlandBounds() {
  const file = path.resolve(import.meta.dirname, "../../public/maps/vietnam-tabletop.geojson");
  const data = JSON.parse(fs.readFileSync(file, "utf8")) as {
    features: { geometry: { type: string; coordinates: number[][][] | number[][][][] } }[];
  };
  const polygons: number[][][][] = [];
  for (const feature of data.features) {
    if (feature.geometry.type === "Polygon") polygons.push(feature.geometry.coordinates as number[][][]);
    else if (feature.geometry.type === "MultiPolygon") polygons.push(...(feature.geometry.coordinates as number[][][][]));
  }
  let best: { minLng: number; maxLng: number; minLat: number; maxLat: number; area: number } | null = null;
  for (const polygon of polygons) {
    const ring = polygon[0];
    const lngs = ring.map((point) => point[0]);
    const lats = ring.map((point) => point[1]);
    const box = { minLng: Math.min(...lngs), maxLng: Math.max(...lngs), minLat: Math.min(...lats), maxLat: Math.max(...lats), area: 0 };
    box.area = (box.maxLng - box.minLng) * (box.maxLat - box.minLat);
    if (!best || box.area > best.area) best = box;
  }
  return best!;
}

describe("globe geometry", () => {
  it("round-trips latitude/longitude through unit vectors, including the antimeridian and poles", () => {
    for (const [lat, lng] of [[21.03, 105.85], [-33.9, -151.2], [0, 179.999], [0, -179.999], [89.9, 12], [-89.9, -170]]) {
      const back = vectorToGeo(geoToVector(lat, lng));
      expect(back.lat).toBeCloseTo(lat, 8);
      expect(Math.abs(((back.lng - lng + 540) % 360) - 180)).toBeLessThan(1e-7);
    }
  });

  it("places east to the right and north up when viewed from outside the sphere", () => {
    for (const [lat, lng] of [[0, 0], [21, 106], [-40, -70], [60, 170]]) {
      const { up, east, north } = localBasis(lat, lng);
      expect(dot(up, east)).toBeCloseTo(0, 10);
      expect(dot(up, north)).toBeCloseTo(0, 10);
      const viewForward: [number, number, number] = [-up[0], -up[1], -up[2]];
      // right = forward × up(screen) for a camera looking at the surface with north up.
      const right = cross(viewForward, north);
      expect(dot(right, east)).toBeGreaterThan(0.999);
    }
  });
});

describe("cinematic camera ↔ serialized MapView", () => {
  it("keeps the legacy zoom meaning: the area scale of a 512 px Web-Mercator map at the view centre", () => {
    for (const viewport of DESKTOP_VIEWPORTS) {
      for (const zoom of LEGACY_ZOOMS) {
        for (const lat of [10.76, 21.03, 40]) {
          const view: MapView = { lat, lng: 107, zoom };
          const pose = viewToCameraPose(view, viewport);
          const step = 0.002;
          const at = (dLat: number, dLng: number) => projectToScreen(pose, viewport, geoToVector(lat + dLat, 107 + dLng))!;
          const origin = at(0, 0);
          const east = at(0, step);
          const north = at(step, 0);
          const areaPerSquareDegree =
            Math.abs((east.x - origin.x) * (north.y - origin.y) - (north.x - origin.x) * (east.y - origin.y)) / (step * step);
          // Mercator: (512·2^z/360) px per degree of longitude, stretched by 1/cos(lat) in latitude.
          const expected = (512 * 2 ** zoom / 360) ** 2 / Math.cos((lat * Math.PI) / 180);
          expect(Math.abs(areaPerSquareDegree / expected - 1)).toBeLessThan(0.01);
        }
      }
    }
  });

  it("stays within 8% of the legacy per-axis pixel density even in the tilted overview", () => {
    const viewport = { width: 1440, height: 900 };
    const view = vietnamOverviewView(viewport);
    const pose = viewToCameraPose(view, viewport);
    const origin = projectToScreen(pose, viewport, geoToVector(view.lat, view.lng))!;
    const east = projectToScreen(pose, viewport, geoToVector(view.lat, view.lng + 0.01))!;
    const perDegree = Math.hypot(east.x - origin.x, east.y - origin.y) / 0.01;
    expect(Math.abs(perDegree / ((512 * 2 ** view.zoom) / 360) - 1)).toBeLessThan(0.08);
  });

  it("round-trips existing serialized zooms and positions without changing the URL representation", () => {
    const places: [number, number][] = [[21.03, 105.85], [21.386, 103.023], [10.76212, 106.70299], [0, 179.99], [0, -179.99], [83, 20], [-80, -40]];
    for (const viewport of DESKTOP_VIEWPORTS) {
      for (const zoom of [...LEGACY_ZOOMS, 0.5, 2, 3.8, 12, 17.5]) {
        for (const [lat, lng] of places) {
          const view: MapView = { lat, lng, zoom };
          const back = cameraPoseToView(viewToCameraPose(view, viewport), viewport)!;
          expect(formatMapView(back)).toBe(formatMapView(view));
        }
      }
    }
  });

  it("puts the serialized centre on the reading-area anchor rather than the exact canvas centre", () => {
    const viewport = { width: 1440, height: 900 };
    const pose = viewToCameraPose({ lat: 16, lng: 107, zoom: 4 }, viewport);
    const point = projectToScreen(pose, viewport, geoToVector(16, 107))!;
    expect(point.x).toBeCloseTo(viewport.width * pose.anchor.x, 6);
    expect(point.y).toBeCloseTo(viewport.height * pose.anchor.y, 6);
    expect(pose.anchor.y).toBeLessThan(0.5);
  });

  it("keeps close event-selection views top-down and tilts only the broad overview", () => {
    expect(tiltDegForZoom(6.5)).toBe(0);
    expect(tiltDegForZoom(8)).toBe(0);
    expect(tiltDegForZoom(4)).toBeGreaterThan(15);
    let previous = tiltDegForZoom(4);
    for (let zoom = 4; zoom <= 7; zoom += 0.1) {
      const tilt = tiltDegForZoom(zoom);
      expect(tilt).toBeLessThanOrEqual(previous + 1e-9);
      previous = tilt;
    }
  });

  it("never puts the camera inside the planet or clips the visible surface for any supported zoom", () => {
    const viewport = { width: 1440, height: 900 };
    for (let zoom = 0; zoom <= 18; zoom += 0.5) {
      const pose = viewToCameraPose({ lat: 21, lng: 106, zoom }, viewport);
      const radius = Math.hypot(...pose.position);
      expect(radius).toBeGreaterThan(1);
      expect(pose.near).toBeGreaterThan(0);
      expect(pose.near).toBeLessThan(radius - 1 + 1e-9);
      expect(pose.far).toBeGreaterThan(radius + 1.0);
    }
  });
});

describe("Vietnam overview framing against the visual spec", () => {
  const bounds = mainlandBounds();

  it.each(DESKTOP_VIEWPORTS)("frames mainland Vietnam inside x 36–62% and y 20–72% at $width×$height", (viewport) => {
    const pose = viewToCameraPose(vietnamOverviewView(viewport), viewport);
    const corners = [
      [bounds.minLat, bounds.minLng], [bounds.minLat, bounds.maxLng], [bounds.maxLat, bounds.minLng], [bounds.maxLat, bounds.maxLng],
      [(bounds.minLat + bounds.maxLat) / 2, bounds.minLng], [(bounds.minLat + bounds.maxLat) / 2, bounds.maxLng],
    ].map(([lat, lng]) => projectToScreen(pose, viewport, geoToVector(lat, lng))!);
    // Take the extremes over a dense lattice so curved parallels/meridians cannot hide an overshoot.
    const lattice: { x: number; y: number }[] = [...corners];
    for (let i = 0; i <= 20; i++) {
      for (let j = 0; j <= 20; j++) {
        const lat = bounds.minLat + ((bounds.maxLat - bounds.minLat) * i) / 20;
        const lng = bounds.minLng + ((bounds.maxLng - bounds.minLng) * j) / 20;
        lattice.push(projectToScreen(pose, viewport, geoToVector(lat, lng))!);
      }
    }
    const xs = lattice.map((point) => point.x / viewport.width);
    const ys = lattice.map((point) => point.y / viewport.height);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0.36);
    expect(Math.max(...xs)).toBeLessThanOrEqual(0.62);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0.2);
    expect(Math.max(...ys)).toBeLessThanOrEqual(0.72);
    // Whole mainland must face the camera.
    expect([[bounds.minLat, bounds.minLng], [bounds.maxLat, bounds.maxLng], [bounds.minLat, bounds.maxLng], [bounds.maxLat, bounds.minLng]].every(([lat, lng]) => isNearSide(pose.position, geoToVector(lat, lng)))).toBe(true);
  });

  it.each(DESKTOP_VIEWPORTS)("shows a large cropped sphere with a limb in the upper/right background at $width×$height", (viewport) => {
    const pose = viewToCameraPose(vietnamOverviewView(viewport), viewport);
    const horizon = sphereHorizonPoints(pose.position, 720)
      .map((point) => projectToScreen(pose, viewport, point))
      .filter((point): point is { x: number; y: number } => point !== null);
    const xs = horizon.map((point) => point.x);
    const ys = horizon.map((point) => point.y);
    // Diameter exceeds the viewport height.
    expect(Math.max(...ys) - Math.min(...ys)).toBeGreaterThan(viewport.height);
    // Part of the limb is visible and curves through the upper/right half of the frame.
    const inside = horizon.filter((point) => point.x >= 0 && point.x <= viewport.width && point.y >= 0 && point.y <= viewport.height);
    expect(inside.length).toBeGreaterThan(40);
    expect(inside.some((point) => point.x > viewport.width * 0.6 && point.y < viewport.height * 0.6)).toBe(true);
    // The sphere is not a floating ball: the reading centre is surface, the top-right corner is space.
    const centre = geoToVector(...([vietnamOverviewView(viewport).lat, vietnamOverviewView(viewport).lng] as [number, number]));
    expect(isNearSide(pose.position, centre)).toBe(true);
    expect(Math.min(...xs)).toBeLessThan(viewport.width * 0.5);
  });

  it("scales with viewport height so Vietnam keeps the same share of a shorter laptop screen", () => {
    const heightShare = (viewport: GlobeStageSize) => {
      const pose = viewToCameraPose(vietnamOverviewView(viewport), viewport);
      const top = projectToScreen(pose, viewport, geoToVector(bounds.maxLat, (bounds.minLng + bounds.maxLng) / 2))!;
      const bottom = projectToScreen(pose, viewport, geoToVector(bounds.minLat, (bounds.minLng + bounds.maxLng) / 2))!;
      return (bottom.y - top.y) / viewport.height;
    };
    const tall = heightShare({ width: 1440, height: 900 });
    const short = heightShare({ width: 1280, height: 720 });
    expect(Math.abs(tall - short)).toBeLessThan(0.03);
  });

  it("world preset shows the complete sphere with margin", () => {
    for (const viewport of DESKTOP_VIEWPORTS) {
      const pose = viewToCameraPose(worldOverviewView(viewport), viewport);
      const horizon = sphereHorizonPoints(pose.position, 360).map((point) => projectToScreen(pose, viewport, point)!);
      for (const point of horizon) {
        expect(point.x).toBeGreaterThan(0);
        expect(point.x).toBeLessThan(viewport.width);
        expect(point.y).toBeGreaterThan(viewport.height * 0.04);
        expect(point.y).toBeLessThan(viewport.height * 0.96);
      }
    }
  });
});

describe("drag panning", () => {
  it("allows local camera scale up to 11 while letting old closer bookmarks zoom back out gradually", () => {
    expect(zoomView({ lat: 21, lng: 105, zoom: 4.5 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 5.5 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 5.4 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 6.4 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 10.8 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 11 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 11 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 11 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 8 }, -1)).toEqual({ lat: 21, lng: 105, zoom: 7 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 8 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 9 });
    // Retain legacy restoration and gradual exit rather than clamping the saved scale on load/input.
    expect(zoomView({ lat: 21, lng: 105, zoom: 18 }, -1)).toEqual({ lat: 21, lng: 105, zoom: 17 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 13 }, 1)).toEqual({ lat: 21, lng: 105, zoom: 13 });
    expect(zoomView({ lat: 21, lng: 105, zoom: 11.5 }, -1)).toEqual({ lat: 21, lng: 105, zoom: 10.5 });
    expect(zoomView({ lat: 0, lng: 179, zoom: 0.2 }, -1)).toEqual({ lat: 0, lng: 179, zoom: 0 });
  });

  it("moves the surface under the pointer by the dragged pixels for small drags", () => {
    const viewport = { width: 1440, height: 900 };
    for (const zoom of [4, 5.5, 8]) {
      const view: MapView = { lat: 16, lng: 107, zoom };
      const before = viewToCameraPose(view, viewport);
      const anchor = geoToVector(view.lat, view.lng);
      const anchorBefore = projectToScreen(before, viewport, anchor)!;
      const panned = panView(view, 30, -20, viewport);
      const after = viewToCameraPose(panned, viewport);
      const anchorAfter = projectToScreen(after, viewport, anchor)!;
      expect(anchorAfter.x - anchorBefore.x).toBeGreaterThan(24);
      expect(anchorAfter.x - anchorBefore.x).toBeLessThan(36);
      expect(anchorAfter.y - anchorBefore.y).toBeLessThan(-14);
      expect(anchorAfter.y - anchorBefore.y).toBeGreaterThan(-26);
    }
  });

  it("clamps latitude and wraps longitude instead of producing an invalid URL view", () => {
    const viewport = { width: 1440, height: 900 };
    const north = panView({ lat: 84, lng: 179, zoom: 3 }, 0, 4000, viewport);
    expect(north.lat).toBeLessThanOrEqual(85);
    const east = panView({ lat: 0, lng: 179.5, zoom: 6 }, -4000, 0, viewport);
    expect(east.lng).toBeGreaterThanOrEqual(-180);
    expect(east.lng).toBeLessThanOrEqual(180);
  });
});

describe("interruptible flight interpolation", () => {
  const start: MapView = { lat: 18, lng: 65, zoom: 1.7 };
  const end: MapView = { lat: 15.2, lng: 106.5, zoom: 4 };

  it("starts and ends exactly on the requested views", () => {
    expect(interpolateView(start, end, 0)).toEqual(start);
    expect(interpolateView(start, end, 1)).toEqual(end);
  });

  it("crosses the antimeridian the short way", () => {
    const west: MapView = { lat: 10, lng: 178, zoom: 5 };
    const east: MapView = { lat: 10, lng: -178, zoom: 5 };
    for (let t = 0.1; t < 1; t += 0.1) {
      const view = interpolateView(west, east, t);
      expect(Math.abs(view.lng)).toBeGreaterThan(177.9);
    }
  });

  it("pulls back for long flights and stays inside the supported zoom range", () => {
    const far: MapView = { lat: 40, lng: -100, zoom: 6 };
    const near: MapView = { lat: 21, lng: 105.8, zoom: 6 };
    const middle = interpolateView(far, near, 0.5);
    expect(middle.zoom).toBeLessThan(6 - 0.5);
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const view = interpolateView(far, near, Math.min(1, t));
      expect(view.zoom).toBeGreaterThanOrEqual(0);
      expect(view.zoom).toBeLessThanOrEqual(18);
      expect(Math.abs(view.lat)).toBeLessThanOrEqual(85);
    }
  });

  it("does not pull back when the destination is the same place", () => {
    const same = interpolateView({ ...end }, { ...end, zoom: 5 }, 0.5);
    expect(same.zoom).toBeGreaterThanOrEqual(4.4);
  });

  it("reveals world context before turning between Vietnam and Marseille, then approaches the destination", () => {
    const from = HISTORY_JOURNEY.stops[0].view;
    const to = HISTORY_JOURNEY.stops[1].view;
    const viewport = { width: 1440, height: 900 };
    const pullingBack = interpolateView(from, to, 0.18, viewport);
    expect(pullingBack.lat).toBeCloseTo(from.lat, 7);
    expect(pullingBack.lng).toBeCloseTo(from.lng, 7);
    expect(pullingBack.zoom).toBeLessThan(from.zoom - 2);
    const context = interpolateView(from, to, 0.5, viewport);
    const pose = viewToCameraPose(context, viewport);
    for (const stop of [from, to]) {
      const point = geoToVector(stop.lat, stop.lng);
      expect(isNearSide(pose.position, point)).toBe(true);
      const screen = projectToScreen(pose, viewport, point)!;
      expect(screen.x).toBeGreaterThan(0);
      expect(screen.x).toBeLessThan(viewport.width);
      expect(screen.y).toBeGreaterThan(0);
      expect(screen.y).toBeLessThan(viewport.height);
    }
    const approaching = interpolateView(from, to, 0.85, viewport);
    expect(approaching.lat).toBeCloseTo(to.lat, 7);
    expect(approaching.lng).toBeCloseTo(to.lng, 7);
    expect(approaching.zoom).toBeGreaterThan(context.zoom);
  });

  it("gives nearby Paris–Tours a shorter flight without an unnecessary world zoom", () => {
    const paris = HISTORY_JOURNEY.stops[3].view;
    const tours = HISTORY_JOURNEY.stops[4].view;
    expect(journeyFlightDurationMs(paris, tours)).toBeLessThan(1500);
    expect(journeyFlightDurationMs(HISTORY_JOURNEY.stops[0].view, HISTORY_JOURNEY.stops[1].view)).toBeGreaterThanOrEqual(3000);
    for (let i = 0; i <= 100; i++) expect(interpolateView(paris, tours, i / 100).zoom).toBeGreaterThan(5);
    expect(journeyFlightDurationMs(paris, paris)).toBe(0);
  });

  it("keeps every authored leg and return outside Earth, including antipodal and seam targets", () => {
    const authored = HISTORY_JOURNEY.stops.map((stop) => stop.view);
    const legs = authored.slice(1).flatMap((to, index) => [[authored[index], to], [to, authored[index]]]);
    legs.push([{ lat: 0, lng: 0, zoom: 6 }, { lat: 0, lng: 180, zoom: 6 }]);
    legs.push([{ lat: 10, lng: 179, zoom: 6 }, { lat: 10, lng: -179, zoom: 6 }]);
    for (const viewport of DESKTOP_VIEWPORTS) for (const [from, to] of legs) {
      for (let i = 0; i <= 100; i++) {
        const view = interpolateView(from, to, i / 100, viewport);
        expect(Object.values(view).every(Number.isFinite)).toBe(true);
        const pose = viewToCameraPose(view, viewport);
        expect(Math.hypot(...pose.position)).toBeGreaterThan(1);
        expect(dot(pose.target, pose.position)).toBeGreaterThan(1);
      }
    }
  });
});
