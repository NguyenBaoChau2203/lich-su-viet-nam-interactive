import { interpolateView, type GlobeStageSize } from "@/lib/explorer/cinematic/camera";
import type { MapView } from "@/lib/explorer/map-view";
import type { JourneyArrival } from "@/lib/explorer/journey";

type Outcome = "arrived" | "cancelled";
type Flight = { from: MapView; to: MapView; start: number; duration: number; generation: number; arrival?: JourneyArrival; resolve(outcome: Outcome): void };
type Options = {
  getView(): MapView;
  applyView(view: MapView): void;
  viewport(): GlobeStageSize;
  now(): number;
  requestFrame(): void;
  onFlightStart?(arrival?: JourneyArrival): void;
  onFlightProgress?(arrival: JourneyArrival | undefined, progress: number): void;
  onFlightEnd?(arrival?: JourneyArrival): void;
};

/** One physical flight, sampled by the scene's existing on-demand loop; owns no timers or animation loop. */
export function createCameraFlightDirector(options: Options) {
  let flight: Flight | null = null;
  let generation = 0;
  let visible = true;
  let disposed = false;
  const cancelFlight = () => {
    generation++;
    const old = flight;
    flight = null;
    if (old) options.onFlightEnd?.(old.arrival);
    old?.resolve("cancelled");
  };
  return {
    cancelFlight,
    setView(view: MapView) {
      if (disposed) return;
      cancelFlight();
      options.applyView(view);
      options.requestFrame();
    },
    flyTo(target: MapView, duration: number, arrival?: JourneyArrival): Promise<Outcome> {
      cancelFlight();
      if (disposed || !visible) return Promise.resolve("cancelled");
      const ownGeneration = generation;
      options.onFlightStart?.(arrival);
      if (duration <= 0) {
        options.applyView(target);
        if (ownGeneration === generation && !disposed) {
          options.onFlightProgress?.(arrival, 1);
          options.onFlightEnd?.(arrival);
        }
        options.requestFrame();
        return Promise.resolve(ownGeneration === generation && !disposed ? "arrived" : "cancelled");
      }
      return new Promise((resolve) => {
        flight = { from: { ...options.getView() }, to: { ...target }, start: options.now(), duration, generation: ownGeneration, arrival, resolve };
        options.requestFrame();
      });
    },
    advance(now: number): boolean {
      const current = flight;
      if (!current || disposed || !visible) return false;
      const progress = Math.min(1, Math.max(0, (now - current.start) / current.duration));
      options.applyView(interpolateView(current.from, current.to, progress, options.viewport()));
      if (current.generation !== generation) return flight !== null;
      options.onFlightProgress?.(current.arrival, progress);
      if (current.generation !== generation) return flight !== null;
      if (progress >= 1) {
        flight = null;
        options.onFlightEnd?.(current.arrival);
        current.resolve("arrived");
      }
      return flight !== null;
    },
    setVisible(next: boolean) {
      visible = next;
      if (!next) cancelFlight();
    },
    dispose() {
      disposed = true;
      cancelFlight();
    },
  };
}
