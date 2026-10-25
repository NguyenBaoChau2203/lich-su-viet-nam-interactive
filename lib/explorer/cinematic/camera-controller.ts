import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import { formatMapView, parseMapView, type MapView } from "@/lib/explorer/map-view";
import type { JourneyArrival } from "@/lib/explorer/journey";

type CameraTransport = Pick<CinematicScene, "getView" | "setView" | "flyTo" | "cancelFlight">;
type Outcome = "arrived" | "cancelled";
type Intent = { view: MapView; arrival?: JourneyArrival; onArrive?: () => void; resolve(outcome: Outcome): void };

/** The scene alone animates. This adapter publishes settled geographic state and invalidates stale completions. */
export function createGlobeCameraController(scene: CameraTransport, onSettle: (view: MapView) => void) {
  let revision = 0;
  let disposed = false;
  let visible = true;
  let intent: Intent | null = null;
  const cancel = () => {
    revision++;
    const old = intent;
    intent = null;
    scene.cancelFlight();
    old?.resolve("cancelled");
  };
  const settle = () => {
    if (disposed || !visible) return;
    const view = parseMapView(formatMapView(scene.getView()));
    if (view) onSettle(view);
  };
  const run = (current: Intent, duration: number) => {
    const ownRevision = ++revision;
    scene.cancelFlight();
    void scene.flyTo(current.view, duration, current.arrival).then((result) => {
      if (disposed || ownRevision !== revision || intent !== current) return;
      if (result !== "arrived") { cancel(); return; }
      settle();
      // A settle subscriber may synchronously restore, navigate or request a new stop.
      if (disposed || ownRevision !== revision || intent !== current) return;
      intent = null;
      current.onArrive?.();
      current.resolve("arrived");
    });
  };
  return {
    isFlying: () => intent !== null,
    cancel,
    settle,
    setView(view: MapView) {
      if (disposed) return;
      cancel();
      scene.setView(view);
    },
    jumpTo(view: MapView) {
      if (disposed) return;
      cancel();
      scene.setView(view);
      settle();
    },
    flyTo(view: MapView, duration: number, onArrive?: () => void, arrival?: JourneyArrival): Promise<Outcome> {
      if (disposed) return Promise.resolve("cancelled");
      cancel();
      return new Promise((resolve) => {
        intent = { view, arrival, onArrive, resolve };
        if (visible) run(intent, duration);
      });
    },
    finish() {
      if (!disposed && visible && intent) run(intent, 0);
    },
    setVisible(next: boolean) {
      if (disposed || visible === next) return;
      visible = next;
      if (!next) {
        revision++;
        scene.cancelFlight();
      } else if (intent) run(intent, 0);
    },
    dispose() {
      disposed = true;
      cancel();
    },
  };
}

export type GlobeCameraController = ReturnType<typeof createGlobeCameraController>;
