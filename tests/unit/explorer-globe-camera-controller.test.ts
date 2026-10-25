import { describe, expect, it } from "vitest";
import { createGlobeCameraController } from "@/lib/explorer/cinematic/camera-controller";
import { buildMapExplorerUrl } from "@/lib/explorer/map-state";
import type { MapView } from "@/lib/explorer/map-view";

// Control only the asynchronous transport. The real adapter decides whether a
// completion can publish a geographic view or arrival to the explorer owner.
function transport(initial: MapView) {
  let view = initial;
  const flights: { target: MapView; resolve(result: "arrived" | "cancelled"): void }[] = [];
  return {
    engine: {
      getView: () => view,
      setView: (next: MapView) => { view = next; },
      cancelFlight() {}, // An already queued completion may still arrive.
      flyTo(target: MapView) {
        return new Promise<"arrived" | "cancelled">((resolve) => flights.push({ target, resolve }));
      },
    },
    progress: (next: MapView) => { view = next; },
    finish(index: number, result: "arrived" | "cancelled" = "arrived") {
      flights[index].resolve(result);
    },
  };
}

describe("settled geographic camera boundary", () => {
  const start = { lat: 16, lng: 107, zoom: 4.5 };
  const target = { lat: 20, lng: 105, zoom: 5.4 };

  it("writes one rounded, shareable view after arrival and never serializes intermediate frames", async () => {
    const driver = transport(start);
    const urls: string[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => urls.push(buildMapExplorerUrl({
      from: 1954, to: 1954, selectedEvent: "synthetic-event", view,
    })));
    const flight = camera.flyTo(target, 900, () => arrivals.push("stop"));
    driver.progress({ lat: 18, lng: 106, zoom: 3 });
    expect(urls).toEqual([]);
    expect(arrivals).toEqual([]);
    driver.progress({ lat: 20.000001, lng: 104.999999, zoom: 5.40001 });
    driver.finish(0);
    expect(await flight).toBe("arrived");
    expect(urls).toEqual(["/?tu=1954&den=1954&su-kien=synthetic-event&ban-do=20,105,5.4"]);
    expect(arrivals).toEqual(["stop"]);
  });

  it("restoration invalidates a queued old arrival instead of overwriting the restored URL", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const flight = camera.flyTo(target, 3000, () => arrivals.push("old-stop"));
    driver.progress({ lat: 18, lng: 106, zoom: 2 });
    camera.jumpTo(start);
    driver.finish(0);
    expect(await flight).toBe("cancelled");
    expect(views).toEqual([start]);
    expect(arrivals).toEqual([]);
  });

  it("manual pan cancels a flight, remains silent during movement and publishes at gesture end", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const flight = camera.flyTo(target, 3000);
    camera.setView({ lat: 17, lng: 108, zoom: 4.5 });
    camera.setView({ lat: 17.5, lng: 109, zoom: 4.5 });
    driver.finish(0);
    expect(await flight).toBe("cancelled");
    expect(views).toEqual([]);
    camera.settle();
    expect(views).toEqual([{ lat: 17.5, lng: 109, zoom: 4.5 }]);
  });

  it("only the newest seek reports arrival even when completions resolve out of order", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const old = camera.flyTo(target, 3000, () => arrivals.push("old"));
    const next = camera.flyTo(start, 0, () => arrivals.push("new"));
    driver.progress(start);
    driver.finish(1);
    expect(await next).toBe("arrived");
    driver.finish(0);
    expect(await old).toBe("cancelled");
    expect(views).toEqual([start]);
    expect(arrivals).toEqual(["new"]);
  });

  it("unmount and retry suppress all old callbacks", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const flight = camera.flyTo(target, 3000, () => { throw new Error("stale arrival"); });
    camera.dispose();
    driver.finish(0);
    expect(await flight).toBe("cancelled");
    camera.settle();
    expect(views).toEqual([]);
  });

  it("does not report arrival if settlement itself restores a newer view", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => {
      views.push(view);
      if (view.lat === target.lat) camera.jumpTo(start);
    });
    const flight = camera.flyTo(target, 3000, () => arrivals.push("stale"));
    driver.progress(target); driver.finish(0);
    expect(await flight).toBe("cancelled");
    expect(views).toEqual([target, start]);
    expect(arrivals).toEqual([]);
  });

  it("invalidates hidden completions and settles only the latest requested stop on return", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const old = camera.flyTo(target, 3000, () => arrivals.push("old"));
    camera.setVisible(false);
    driver.finish(0);
    await Promise.resolve();
    expect(views).toEqual([]);
    expect(arrivals).toEqual([]);
    const latest = camera.flyTo(start, 3000, () => arrivals.push("current"));
    expect(await old).toBe("cancelled");
    camera.setVisible(true);
    driver.progress(start); driver.finish(1);
    expect(await latest).toBe("arrived");
    expect(views).toEqual([start]);
    expect(arrivals).toEqual(["current"]);
  });

  it("manual cancellation while hidden discards the pending destination", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const flight = camera.flyTo(target, 3000, () => { throw new Error("discarded arrival"); });
    camera.setVisible(false); camera.cancel(); camera.setVisible(true);
    driver.finish(0);
    expect(await flight).toBe("cancelled");
    expect(views).toEqual([]);
    expect(camera.isFlying()).toBe(false);
  });

  it("finishes the current intent once when reduced motion is enabled during travel", async () => {
    const driver = transport(start);
    const views: MapView[] = [];
    const arrivals: string[] = [];
    const camera = createGlobeCameraController(driver.engine, (view) => views.push(view));
    const flight = camera.flyTo(target, 3000, () => arrivals.push("current"));
    camera.finish();
    driver.progress(target); driver.finish(1);
    expect(await flight).toBe("arrived");
    driver.finish(0); await Promise.resolve();
    camera.finish();
    expect(views).toEqual([target]);
    expect(arrivals).toEqual(["current"]);
  });
});
