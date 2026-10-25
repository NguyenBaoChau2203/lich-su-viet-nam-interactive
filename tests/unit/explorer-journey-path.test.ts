import { describe, expect, it } from "vitest";
import { buildJourneyPath, createJourneyPathLayer } from "@/lib/explorer/cinematic/journey-path";
import { HISTORY_JOURNEY, type HistoryJourney, type JourneyArrival } from "@/lib/explorer/journey";
import { createCameraFlightDirector } from "@/lib/explorer/cinematic/flight";
import { createGlobeCameraController } from "@/lib/explorer/cinematic/camera-controller";

function fixture(points: [number, number][], id = "test-route"): HistoryJourney {
  return { ...HISTORY_JOURNEY, id, stops: points.map(([lat, lng], index) => ({
    ...HISTORY_JOURNEY.stops[0], id: `stop-${index}`, view: { lat, lng, zoom: 3 },
  })) };
}

describe("authored spherical journey geometry", () => {
  it("preserves a later return to the same city and skips only zero-length legs", () => {
    const journey = fixture([[0, 0], [0, 90], [0, 90], [0, 0], [40, 50]]);
    const path = buildJourneyPath(journey, "stop-3")!;
    expect(path.selectedIndex).toBe(3);
    expect(path.positions.slice(0, 3)).toEqual(new Float32Array([0, 0, 1]));
    expect(path.positions.slice(-3)).toEqual(new Float32Array([0, 0, 1]));
    expect(path.progressStart.some(t => t >= 1 && t < 2)).toBe(false);
    expect(path.progressStart.some(t => t >= 2 && t < 3)).toBe(true);
    // The fourth stop is never included when selecting the third.
    expect(Math.max(...path.progressEnd)).toBe(3);
    expect(path.positions.every(Number.isFinite)).toBe(true);
  });

  it("takes the short seam crossing above the Pacific rather than a chord across Earth", () => {
    const path = buildJourneyPath(fixture([[0, 179], [0, -179]]), "stop-1")!;
    for (let i = 0; i < path.positions.length; i += 3) {
      const [x, y, z] = path.positions.slice(i, i + 3);
      expect(Math.hypot(x, y, z)).toBeCloseTo(1, 6);
      expect(z).toBeLessThan(-0.999);
    }
    expect(path.positions.length / 6).toBeLessThanOrEqual(5);
  });

  it.each([180, 179.999999, 0.000001])("handles a finite %s degree leg with exact endpoints", lng => {
    const path = buildJourneyPath(fixture([[0, 0], [0, lng]]), "stop-1")!;
    expect(path.positions.length).toBeGreaterThan(0);
    expect(path.positions.every(Number.isFinite)).toBe(true);
    for (let i = 0; i < path.positions.length; i += 3)
      expect(Math.hypot(...path.positions.slice(i, i + 3))).toBeCloseTo(1, 6);
    expect(path.positions.at(-1)).toBeCloseTo(Math.cos(lng * Math.PI / 180), 6);
    expect(path.positions.length / 6).toBeLessThanOrEqual(360);
  });

  it("handles first/all-coincident stops and rejects unknown, invalid or oversized sequences", () => {
    const journey = fixture([[0, 180], [0, -180], [0, 180]]);
    expect(buildJourneyPath(journey, "stop-0")!.positions.length).toBe(0);
    expect(buildJourneyPath(journey, "stop-2")!.positions.length).toBe(0);
    expect(buildJourneyPath(journey, "unknown")).toBeNull();
    expect(buildJourneyPath(fixture([[0, 0], [NaN, 20]]), "stop-1")).toBeNull();
    expect(buildJourneyPath(fixture([[0, 0], [91, 20]]), "stop-1")).toBeNull();
    expect(buildJourneyPath(fixture(Array.from({ length: 65 }, () => [0, 0])), "stop-64")).toBeNull();
  });

  it("bounds a worst-case authored batch without silently truncating the selected sequence", () => {
    const path = buildJourneyPath(fixture(Array.from({ length: 64 }, (_, i) => [0, i % 2 ? 180 : 0])), "stop-63")!;
    expect(path.positions.length / 6).toBeLessThanOrEqual(63 * 360);
    expect(path.positions.byteLength + path.progressStart.byteLength + path.progressEnd.byteLength).toBeLessThan(1024 * 1024);
    expect(Math.max(...path.progressEnd)).toBe(63);
  });
});

describe("one flight owner and pair/nonce path progress", () => {
  const a = fixture([[0, 0], [0, 60], [0, 90]], "journey-a");
  const b = fixture([[0, 0], [40, 0], [60, 0]], "journey-b");
  const identity = (journeyId: string, nonce: number): JourneyArrival => ({ journeyId, stopId: "stop-2", nonce });

  it("never reveals a nonexistent leg at the first milestone", () => {
    const layer = createJourneyPathLayer();
    const arrival = { journeyId: a.id, stopId: "stop-0", nonce: 1 };
    layer.setRequest({ ...arrival, journey: a });
    layer.startFlight(arrival); layer.progressFlight(arrival, 0.5);
    expect(layer.stats().reveal).toBe(0);
    expect(layer.stats().segments).toBe(0);
    layer.dispose();
  });

  it("rejects stale/wrong pairs and late progress after cancellation, clear and disposal", () => {
    const layer = createJourneyPathLayer();
    const old = identity(a.id, 1), current = identity(b.id, 2);
    layer.setRequest({ ...old, journey: a });
    layer.startFlight(old); layer.progressFlight(old, 0.25);
    expect(layer.stats().reveal).toBe(1.25);
    layer.setRequest({ ...current, journey: b });
    layer.startFlight(current);
    layer.progressFlight(old, 0.9); layer.finishFlight(old);
    expect(layer.stats().reveal).toBe(1);
    expect(layer.setRequest({ ...old, journey: a })).toBe(false);
    expect(layer.setRequest({ ...current, journeyId: a.id, journey: a })).toBe(false);
    layer.finishFlight(current);
    layer.progressFlight(current, 0.4);
    expect(layer.stats().reveal).toBe(2);
    layer.setRequest(null);
    expect(layer.setRequest({ ...current, journey: b })).toBe(false);
    expect(layer.group.children).toHaveLength(0);
    layer.dispose();
    expect(layer.setRequest({ ...identity(a.id, 3), journey: a })).toBe(false);
    expect(layer.group.children).toHaveLength(0);
  });

  it("disposes replaced/cleared geometry once and keeps exactly one passive batch", () => {
    const layer = createJourneyPathLayer();
    layer.setRequest({ ...identity(a.id, 1), journey: a });
    const mesh = layer.group.children[0] as import("three").Mesh;
    let released = 0;
    mesh.geometry.addEventListener("dispose", () => released++);
    layer.setRequest({ ...identity(b.id, 2), journey: b });
    expect(released).toBe(1);
    expect(layer.group.children).toHaveLength(1);
    const next = layer.group.children[0] as import("three").Mesh;
    next.geometry.addEventListener("dispose", () => released++);
    layer.setRequest(null); layer.dispose(); layer.dispose();
    expect(released).toBe(2);
  });

  it("samples finite reveal from the director, makes cancellation static, and has no idle updates", async () => {
    const layer = createJourneyPathLayer();
    const request = { ...identity(a.id, 1), journey: a };
    layer.setRequest(request);
    let view = { lat: 0, lng: 0, zoom: 3 }, now = 0, updates = 0;
    const director = createCameraFlightDirector({
      getView: () => view, applyView: next => { view = next; }, viewport: () => ({ width: 1440, height: 900 }),
      now: () => now, requestFrame() {},
      onFlightStart: arrival => layer.startFlight(arrival),
      onFlightProgress: (arrival, progress) => { updates++; layer.progressFlight(arrival, progress); },
      onFlightEnd: arrival => layer.finishFlight(arrival),
    });
    const flight = director.flyTo({ lat: 0, lng: 90, zoom: 3 }, 1000, request);
    now = 250; director.advance(now);
    expect(layer.stats().reveal).toBe(1.25);
    director.cancelFlight();
    expect(await flight).toBe("cancelled");
    expect(layer.stats().reveal).toBe(2);
    const stopped = updates;
    now = 5000; expect(director.advance(now)).toBe(false);
    expect(updates).toBe(stopped);
    expect(await director.flyTo(view, 0, request)).toBe("arrived");
    expect(layer.stats().reveal).toBe(2);
    const hidden = director.flyTo(view, 1000, request);
    director.setVisible(false);
    expect(await hidden).toBe("cancelled");
    expect(layer.stats().reveal).toBe(2);
    director.dispose(); layer.dispose();
  });

  it("carries the latest pair/nonce through the real adapter's hidden resume and motion finish", async () => {
    const layer = createJourneyPathLayer();
    let view = { lat: 0, lng: 0, zoom: 3 }, now = 0;
    const director = createCameraFlightDirector({
      getView: () => view, applyView: next => { view = next; }, viewport: () => ({ width: 1440, height: 900 }),
      now: () => now, requestFrame() {}, onFlightStart: arrival => layer.startFlight(arrival),
      onFlightProgress: (arrival, progress) => layer.progressFlight(arrival, progress),
      onFlightEnd: arrival => layer.finishFlight(arrival),
    });
    const adapter = createGlobeCameraController({ ...director, getView: () => view }, () => {});
    const old = { ...identity(a.id, 1), journey: a }, current = { ...identity(b.id, 2), journey: b };
    const arrivals: string[] = [];
    layer.setRequest(old);
    const first = adapter.flyTo(a.stops[2].view, 1000, () => arrivals.push(a.id), old);
    now = 250; director.advance(now);
    expect(layer.stats().reveal).toBe(1.25);
    director.setVisible(false); adapter.setVisible(false);
    layer.setRequest(current);
    const second = adapter.flyTo(b.stops[2].view, 1000, () => arrivals.push(b.id), current);
    expect(await first).toBe("cancelled");
    director.setVisible(true); adapter.setVisible(true);
    expect(await second).toBe("arrived");
    expect(layer.stats().reveal).toBe(2);
    expect(layer.stats().request?.journeyId).toBe(b.id);
    expect(arrivals).toEqual([b.id]);
    const thirdRequest = { ...current, nonce: 3 };
    layer.setRequest(thirdRequest);
    const third = adapter.flyTo(b.stops[2].view, 1000, undefined, thirdRequest);
    now = 500; director.advance(now);
    expect(layer.stats().reveal).toBe(1.25);
    adapter.finish();
    expect(await third).toBe("arrived");
    expect(layer.stats().reveal).toBe(2);
    expect(layer.stats().active).toBe(false);
    adapter.dispose(); director.dispose(); layer.dispose();
  });

  it("a synchronous seek from progress cannot erase or complete the replacement flight", async () => {
    const layer = createJourneyPathLayer();
    const old = { ...identity(a.id, 1), journey: a }, current = { ...identity(b.id, 2), journey: b };
    let view = { lat: 0, lng: 0, zoom: 3 }, now = 0;
    let replacement: Promise<"arrived" | "cancelled"> | undefined;
    const director = createCameraFlightDirector({
      getView: () => view, applyView: next => { view = next; }, viewport: () => ({ width: 1440, height: 900 }),
      now: () => now, requestFrame() {}, onFlightStart: arrival => layer.startFlight(arrival),
      onFlightProgress: (arrival, progress) => {
        layer.progressFlight(arrival, progress);
        if (arrival?.journeyId === a.id && progress === 1) {
          layer.setRequest(current);
          replacement = director.flyTo(b.stops[2].view, 1000, current);
        }
      },
      onFlightEnd: arrival => layer.finishFlight(arrival),
    });
    layer.setRequest(old);
    const first = director.flyTo(a.stops[2].view, 1000, old);
    now = 1000;
    expect(director.advance(now)).toBe(true);
    expect(await first).toBe("cancelled");
    expect(layer.stats().request?.journeyId).toBe(b.id);
    expect(layer.stats().reveal).toBe(1);
    now = 2000;
    expect(director.advance(now)).toBe(false);
    expect(await replacement).toBe("arrived");
    expect(view).toEqual(b.stops[2].view);
    expect(layer.stats().reveal).toBe(2);
    director.dispose(); layer.dispose();
  });
});
