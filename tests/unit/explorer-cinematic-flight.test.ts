import { describe, expect, it } from "vitest";
import { createCameraFlightDirector } from "@/lib/explorer/cinematic/flight";
import type { MapView } from "@/lib/explorer/map-view";

const origin = { lat: 10.762125, lng: 106.702985, zoom: 6.4 };
const overseas = { lat: 43.291925, lng: 5.373064, zoom: 5.5 };
const restored = { lat: 16, lng: 107, zoom: 4.5 };

function sceneDriver() {
  let view: MapView = origin;
  let now = 0;
  const frames: MapView[] = [];
  const director = createCameraFlightDirector({
    getView: () => view,
    applyView: (next) => { view = next; frames.push(next); },
    now: () => now,
    viewport: () => ({ width: 1440, height: 900 }),
    requestFrame() {},
  });
  return { director, frames, view: () => view, tick(ms: number) { now = ms; return director.advance(now); } };
}

describe("the scene's single camera flight director", () => {
  it("arrives exactly once on the exact target and stops requesting animation", async () => {
    const scene = sceneDriver();
    const outcomes: string[] = [];
    const flight = scene.director.flyTo(overseas, 3400).then((outcome) => outcomes.push(outcome));
    expect(scene.tick(1500)).toBe(true);
    expect(scene.view()).not.toEqual(overseas);
    expect(outcomes).toEqual([]);
    expect(scene.tick(3400)).toBe(false);
    await flight;
    const settledFrames = scene.frames.length;
    expect(scene.tick(8000)).toBe(false);
    expect(scene.frames).toHaveLength(settledFrames);
    expect(scene.view()).toEqual(overseas);
    expect(outcomes).toEqual(["arrived"]);
  });

  it("a restored view survives ticks well beyond the old flight duration", async () => {
    const scene = sceneDriver();
    const flight = scene.director.flyTo(overseas, 3400);
    scene.tick(900);
    scene.director.setView(restored);
    expect(await flight).toBe("cancelled");
    scene.tick(10_000);
    expect(scene.view()).toEqual(restored);
  });

  it("seek spam cancels every earlier physical path and only arrives at the newest target", async () => {
    const scene = sceneDriver();
    const first = scene.director.flyTo(overseas, 3400);
    scene.tick(600);
    const second = scene.director.flyTo(origin, 3400);
    scene.tick(800);
    const third = scene.director.flyTo(restored, 700);
    scene.tick(1500);
    expect(await Promise.all([first, second, third])).toEqual(["cancelled", "cancelled", "arrived"]);
    expect(scene.view()).toEqual(restored);
  });

  it("hiding cancels physical travel instead of advancing across hidden wall-clock time", async () => {
    const scene = sceneDriver();
    const flight = scene.director.flyTo(overseas, 3400);
    scene.tick(900);
    const atHide = scene.view();
    scene.director.setVisible(false);
    expect(await flight).toBe("cancelled");
    scene.tick(20_000);
    scene.director.setVisible(true);
    scene.tick(21_000);
    expect(scene.view()).toEqual(atHide);
  });

  it("an instant skip cancels the previous path and applies a useful view immediately", async () => {
    const scene = sceneDriver();
    const old = scene.director.flyTo(overseas, 3400);
    const skip = scene.director.flyTo(restored, 0);
    expect(scene.view()).toEqual(restored);
    expect(await Promise.all([old, skip])).toEqual(["cancelled", "arrived"]);
    scene.tick(10_000);
    expect(scene.view()).toEqual(restored);
  });

  it("disposal cancels the pending arrival and rejects later animation and instant writes", async () => {
    const scene = sceneDriver();
    const flight = scene.director.flyTo(overseas, 3400);
    scene.tick(900);
    const atDispose = scene.view();
    scene.director.dispose();
    expect(await flight).toBe("cancelled");
    expect(await scene.director.flyTo(restored, 0)).toBe("cancelled");
    scene.director.setView(restored);
    scene.tick(20_000);
    expect(scene.view()).toEqual(atDispose);
  });
});
