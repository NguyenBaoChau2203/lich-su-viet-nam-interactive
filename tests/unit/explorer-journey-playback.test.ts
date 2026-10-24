import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HISTORY_JOURNEY, type HistoryJourney, type JourneyArrival } from "@/lib/explorer/journey";
import { createJourneyRegistry } from "@/lib/explorer/journeys/registry";
import { createExplorerRuntime, reduceExplorerRuntime, scheduleJourneyDwell, JOURNEY_DWELL_MS, type ExplorerAction } from "@/lib/explorer/journeys/playback";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";

const a: HistoryJourney = { ...HISTORY_JOURNEY, id: "synthetic-a", title: "Synthetic A", period: "A", lessonSlugs: [],
  stops: HISTORY_JOURNEY.stops.slice(0, 3).map((stop, index) => ({ ...stop, id: index === 0 ? "shared-stop" : `a-${index}` })) };
const b: HistoryJourney = { ...a, id: "synthetic-b", title: "Synthetic B", period: "B",
  stops: a.stops.map((stop, index) => ({ ...stop, id: index === 0 ? "shared-stop" : `b-${index}`, view: { ...stop.view, lat: index } })) };
const registry = createJourneyRegistry([a, b]);
const exploration: MapExplorerState = { from: 1954, to: 1954, selectedEvent: "published-fixture", view: { lat: 16, lng: 107, zoom: 12 } };

// Simulates React's effect cleanup using the actual reducer and scheduling helper.
// No synthetic data is imported by runtime modules.
function owner(initial: MapExplorerState = exploration) {
  let runtime = createExplorerRuntime(initial, registry);
  let cancel = () => {};
  const dispatch = (action: ExplorerAction) => {
    cancel();
    runtime = reduceExplorerRuntime(runtime, action, registry);
    cancel = scheduleJourneyDwell(runtime, (arrival) => dispatch({ type: "dwell", arrival }));
  };
  return { get current() { return runtime; }, dispatch, cancel: () => cancel() };
}
const arrive = (runtime: ReturnType<typeof owner>) => runtime.dispatch({ type: "arrive", arrival: runtime.current.cameraRequest! });

describe("journey playback in the existing explorer owner", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("starts 2000 ms only after actual arrival: no advance at 1999, exactly one at 2000", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    app.dispatch({ type: "play" });
    vi.advanceTimersByTime(10_000);
    expect(app.current.state.journey?.stop).toBe("shared-stop");
    expect(vi.getTimerCount()).toBe(0);
    arrive(app);
    expect(JOURNEY_DWELL_MS).toBe(2000);
    vi.advanceTimersByTime(1999);
    expect(app.current.state.journey?.stop).toBe("shared-stop");
    vi.advanceTimersByTime(1);
    expect(app.current.state.journey).toEqual({ id: a.id, stop: "a-1" });
    expect(app.current.settledArrival).toBeNull();
    vi.advanceTimersByTime(10_000);
    expect(app.current.state.journey?.stop).toBe("a-1");
  });

  it("rejects wrong-journey arrivals, unknown stops and repeated same-millisecond seeks", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    const first = app.current.cameraRequest!;
    app.dispatch({ type: "seek", stopId: "shared-stop" });
    const latest = app.current.cameraRequest!;
    expect(latest.nonce).toBeGreaterThan(first.nonce);
    for (const arrival of [first, { ...latest, journeyId: b.id }, { ...latest, stopId: "unknown" }]) {
      app.dispatch({ type: "arrive", arrival });
      expect(app.current.settledArrival).toBeNull();
    }
    const before = app.current;
    app.dispatch({ type: "seek", stopId: "b-1" });
    expect(app.current).toBe(before);
    arrive(app);
    expect(app.current.settledArrival).toEqual(latest);
  });

  it("preserves the exploration snapshot across switches and never accepts a foreign view/arrival/expiry", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    app.dispatch({ type: "play" }); arrive(app);
    const old = app.current.cameraRequest!;
    vi.advanceTimersByTime(1999);
    app.dispatch({ type: "view", view: old.view, arrival: old });
    app.dispatch({ type: "choose-journey", id: b.id });
    expect(app.current.playing).toBe(false);
    expect(app.current.cameraRequest?.nonce).toBeGreaterThan(old.nonce);
    for (const action of [{ type: "arrive", arrival: old }, { type: "dwell", arrival: old }, { type: "view", view: old.view, arrival: old }] satisfies ExplorerAction[]) {
      const before = app.current;
      app.dispatch(action);
      expect(app.current).toBe(before);
    }
    vi.advanceTimersByTime(5000);
    expect(app.current.state.journey).toEqual({ id: b.id, stop: "shared-stop" });
    expect(app.current.exploration).toEqual(exploration);
    app.dispatch({ type: "exit" });
    expect(app.current.state).toEqual(exploration);
    expect(app.current.restoreRequest).toBe(1);
  });

  it.each<ExplorerAction>([
    { type: "pause" }, { type: "manual" }, { type: "visibility", hidden: true },
    { type: "motion", reduced: true }, { type: "reading", active: true }, { type: "depart" },
    { type: "seek", stopId: "a-2" }, { type: "restore", state: exploration }, { type: "exit" },
  ])("cancels the dwell and rejects an already queued expiry on $type", (action) => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    app.dispatch({ type: "play" }); arrive(app);
    const old = app.current.cameraRequest!;
    vi.advanceTimersByTime(1999);
    app.dispatch(action);
    const expected = app.current.state;
    vi.advanceTimersByTime(10_000);
    app.dispatch({ type: "dwell", arrival: old });
    expect(app.current.state).toEqual(expected);
    expect(app.current.playing).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("pause during travel never fabricates arrival and play resumes with a fresh nonce", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    app.dispatch({ type: "play" });
    app.dispatch({ type: "pause" });
    expect(app.current.settledArrival).toBeNull();
    const old = app.current.cameraRequest!;
    app.dispatch({ type: "play" });
    app.dispatch({ type: "arrive", arrival: old });
    vi.advanceTimersByTime(4000);
    expect(app.current.settledArrival).toBeNull();
    expect(app.current.state.journey?.stop).toBe("shared-stop");
  });

  it("reader focus or open sources blocks playback until released, without auto-resuming", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id }); arrive(app);
    app.dispatch({ type: "reading", active: true });
    app.dispatch({ type: "play" });
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "reading", active: false });
    vi.advanceTimersByTime(4000);
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "play" }); arrive(app);
    expect(vi.getTimerCount()).toBe(1);
  });

  it("ends playback immediately at the last authored stop without looping", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: b.id });
    app.dispatch({ type: "seek", stopId: "b-1" });
    app.dispatch({ type: "play" }); arrive(app);
    vi.advanceTimersByTime(2000);
    expect(app.current.state.journey?.stop).toBe("b-2");
    arrive(app);
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "play" });
    vi.advanceTimersByTime(20_000);
    expect(app.current.state.journey?.stop).toBe("b-2");
    expect(vi.getTimerCount()).toBe(0);
  });

  it("restores shared/history pairs paused and invalidates even an arrival for the same pair", () => {
    const shared = { ...exploration, journey: { id: b.id, stop: "shared-stop" } };
    const app = owner(shared);
    expect(app.current.playing).toBe(false);
    expect(app.current.cameraRequest).toMatchObject({ journeyId: b.id, stopId: "shared-stop", instant: true });
    const old = app.current.cameraRequest!;
    app.dispatch({ type: "restore", state: shared });
    app.dispatch({ type: "arrive", arrival: old });
    expect(app.current.settledArrival).toBeNull();
    expect(app.current.cameraRequest!.nonce).toBeGreaterThan(old.nonce);
  });

  it("freezes all state and URL writes after departure until history restores", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    const old: JourneyArrival = app.current.cameraRequest!;
    app.dispatch({ type: "depart" });
    const href = buildMapExplorerUrl(app.current.state, registry);
    for (const action of [{ type: "arrive", arrival: old }, { type: "dwell", arrival: old },
      { type: "view", view: b.stops[0].view }, { type: "choose-journey", id: b.id }] satisfies ExplorerAction[]) app.dispatch(action);
    expect(buildMapExplorerUrl(app.current.state, registry)).toBe(href);
    app.dispatch({ type: "restore", state: exploration });
    expect(app.current.departing).toBe(false);
    expect(app.current.state).toEqual(exploration);
  });

  it("does not resume after hidden/motion safeguards clear and cancels on effect disposal", () => {
    const app = owner();
    app.dispatch({ type: "choose-journey", id: a.id });
    app.dispatch({ type: "visibility", hidden: true }); app.dispatch({ type: "play" });
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "visibility", hidden: false });
    app.dispatch({ type: "motion", reduced: true }); app.dispatch({ type: "play" });
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "motion", reduced: false });
    expect(app.current.playing).toBe(false);
    app.dispatch({ type: "play" }); arrive(app);
    app.cancel(); vi.advanceTimersByTime(20_000);
    expect(app.current.state.journey?.stop).toBe("shared-stop");
  });
});
