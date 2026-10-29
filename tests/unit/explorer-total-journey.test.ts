import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { JourneyStopReader } from "@/components/explorer/JourneyStopReader";
import { buildJourneyPath } from "@/lib/explorer/cinematic/journey-path";
import { HISTORY_JOURNEY, type HistoryJourney, type JourneyStop } from "@/lib/explorer/journey";
import { KHANG_CHIEN_CHONG_PHAP_1946_1954 } from "@/lib/explorer/journeys/khang-chien-chong-phap-1946-1954";
import { resolveJourneyMedia } from "@/lib/explorer/journeys/media";
import { MUA_THU_DOC_LAP_1945 } from "@/lib/explorer/journeys/mua-thu-doc-lap-1945";
import { MUA_XUAN_1975 } from "@/lib/explorer/journeys/mua-xuan-1975";
import { createExplorerRuntime, reduceExplorerRuntime, type ExplorerAction } from "@/lib/explorer/journeys/playback";
import { createJourneyRegistry, DEFAULT_JOURNEY_ID, JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import { createTotalJourney, TOTAL_JOURNEY_ID } from "@/lib/explorer/journeys/total";
import { buildMapExplorerUrl, parseMapExplorerState } from "@/lib/explorer/map-state";

const BASE = [HISTORY_JOURNEY, MUA_THU_DOC_LAP_1945, KHANG_CHIEN_CHONG_PHAP_1946_1954, MUA_XUAN_1975] as const;
const EXPECTED_ORIGINS = [
  ["ho-chi-minh-1911-1941", "sai-gon-1911"],
  ["ho-chi-minh-1911-1941", "marseille-1911"],
  ["ho-chi-minh-1911-1941", "london-1913"],
  ["ho-chi-minh-1911-1941", "paris-1919"],
  ["ho-chi-minh-1911-1941", "tours-1920"],
  ["ho-chi-minh-1911-1941", "moscow-1923"],
  ["ho-chi-minh-1911-1941", "pac-bo-1941"],
  ["mua-thu-doc-lap-1945", "ha-noi-1945"],
  ["mua-thu-doc-lap-1945", "hue-1945"],
  ["mua-thu-doc-lap-1945", "sai-gon-1945"],
  ["mua-thu-doc-lap-1945", "ba-dinh-1945"],
  ["khang-chien-chong-phap-1946-1954", "ha-noi-1946"],
  ["khang-chien-chong-phap-1946-1954", "viet-bac-1947"],
  ["khang-chien-chong-phap-1946-1954", "bien-gioi-1950"],
  ["khang-chien-chong-phap-1946-1954", "dien-bien-phu-1954"],
  ["khang-chien-chong-phap-1946-1954", "geneve-1954"],
  ["mua-xuan-1975", "buon-ma-thuot-1975"],
  ["mua-xuan-1975", "hue-1975"],
  ["mua-xuan-1975", "da-nang-1975"],
  ["mua-xuan-1975", "sai-gon-1975"],
] as const;

function synthetic(id: string, stops: { id: string; sortDate: string; place: string; eventSlug?: string }[], lessonSlugs: string[] = []): HistoryJourney {
  return {
    id, title: `Synthetic ${id}`, period: id, note: "Synthetic schematic fixture, not a travel route.", lessonSlugs,
    stops: stops.map((item, index) => ({
      ...HISTORY_JOURNEY.stops[0],
      id: item.id, title: item.id, place: item.place, date: item.sortDate, sortDate: item.sortDate,
      eventSlug: item.eventSlug, view: { ...HISTORY_JOURNEY.stops[0].view, lat: index },
      sources: HISTORY_JOURNEY.stops[0].sources.map((source) => ({ ...source })),
      coordinateSource: { ...HISTORY_JOURNEY.stops[0].coordinateSource },
    })),
  };
}

describe("derived total journey", () => {
  it("keeps every baseline source milestone once, in chronological order, without mutating the sources", () => {
    const before = structuredClone(BASE);
    const total = createTotalJourney(BASE);
    expect(BASE).toEqual(before);
    expect(total.id).toBe(TOTAL_JOURNEY_ID);
    expect(total.stops).toHaveLength(20);
    expect(total.stops.map((stop) => [stop.origin?.journeyId, stop.origin?.stopId])).toEqual(EXPECTED_ORIGINS);
    expect(new Set(total.stops.map((stop) => stop.id)).size).toBe(20);
    expect(total.stops[0].origin).toEqual({ journeyId: "ho-chi-minh-1911-1941", stopId: "sai-gon-1911" });
    expect(total.stops.at(-1)?.origin).toEqual({ journeyId: "mua-xuan-1975", stopId: "sai-gon-1975" });
    const rank = (value: string) => {
      const [year, month = "00", day = "00"] = value.split("-");
      return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };
    expect(total.stops.map((stop) => rank(stop.sortDate))).toEqual([...total.stops.map((stop) => rank(stop.sortDate))].sort());
    const source = HISTORY_JOURNEY.stops[0];
    const derived = total.stops[0];
    expect(derived.summary).toBe(source.summary);
    expect(derived.date).toBe(source.date);
    expect(derived.datePrecision).toBe(source.datePrecision);
    expect(derived.view).toEqual(source.view);
    expect(derived.view).not.toBe(source.view);
    expect(derived.sources).toEqual(source.sources);
    expect(derived.sources).not.toBe(source.sources);
    expect(derived.accuracyNote).toBe(source.accuracyNote);
    expect(derived.eventSlug).toBe(source.eventSlug);
    expect(total.lessonSlugs).toEqual(["6-cach-mang-thang-tam-nam-1945", "7-khang-chien-chong-phap", "8-khang-chien-chong-my-cuu-nuoc"]);
    expect(total.note).toBe("Tổng hợp các mốc từ những hành trình hiện có theo thứ tự thời gian. Đường nối là sơ đồ, không phải tuyến di chuyển thực tế.");
    expect(createTotalJourney(BASE)).toEqual(total);
    expect(HISTORY_JOURNEY.stops.every((stop) => stop.origin === undefined)).toBe(true);
  });

  it("preserves repeated places, equal dates, missing event links and rejects a colliding derived id", () => {
    const first = synthetic("synthetic-a", [
      { id: "shared-stop", sortDate: "1954-01-01", place: "Synthetic harbor", eventSlug: "synthetic-event" },
      { id: "later", sortDate: "1954-01-01", place: "Synthetic harbor" },
    ], ["shared-lesson"]);
    const second = synthetic("synthetic-b", [
      { id: "shared-stop", sortDate: "1954-01-01", place: "Synthetic harbor" },
      { id: "after", sortDate: "1954-02-01", place: "Synthetic ridge" },
    ], ["shared-lesson", "b-only"]);
    const total = createTotalJourney([first, second]);
    expect(total.stops.map((stop) => stop.origin)).toEqual([
      { journeyId: "synthetic-a", stopId: "shared-stop" },
      { journeyId: "synthetic-a", stopId: "later" },
      { journeyId: "synthetic-b", stopId: "shared-stop" },
      { journeyId: "synthetic-b", stopId: "after" },
    ]);
    expect(total.stops.map((stop) => stop.id)).toEqual([
      "synthetic-a-shared-stop", "synthetic-a-later", "synthetic-b-shared-stop", "synthetic-b-after",
    ]);
    expect(total.stops.filter((stop) => stop.place === "Synthetic harbor")).toHaveLength(3);
    expect(total.stops[1].eventSlug).toBeUndefined();
    expect(total.lessonSlugs).toEqual(["shared-lesson", "b-only"]);
    expect(first.stops[0].id).toBe("shared-stop");
    expect(() => createTotalJourney([
      synthetic("a-b", [{ id: "c", sortDate: "1954-01-01", place: "One" }]),
      synthetic("a", [{ id: "b-c", sortDate: "1954-01-02", place: "Two" }]),
    ])).toThrow(/duplicate/i);
    expect(() => createTotalJourney([])).toThrow();
  });

  it("registers the total fifth, keeps the legacy default, and round-trips composite stop URLs", () => {
    expect(JOURNEY_REGISTRY.journeys.map((journey) => journey.id)).toEqual([
      "ho-chi-minh-1911-1941", "mua-thu-doc-lap-1945", "khang-chien-chong-phap-1946-1954", "mua-xuan-1975", TOTAL_JOURNEY_ID,
    ]);
    expect(DEFAULT_JOURNEY_ID).toBe("ho-chi-minh-1911-1941");
    expect(JOURNEY_REGISTRY.getJourneyById(HISTORY_JOURNEY.id)).toBe(HISTORY_JOURNEY);
    const total = JOURNEY_REGISTRY.getJourneyById(TOTAL_JOURNEY_ID)!;
    expect(total.stops).toHaveLength(20);
    expect(buildJourneyPath(total, total.stops.at(-1)!.id)?.selectedIndex).toBe(19);
    const limits = { minYear: 1911, maxYear: 1975, eventSlugs: [] };
    const href = `/?tu=1911&den=1975&hanh-trinh=${TOTAL_JOURNEY_ID}&moc=${total.stops[8].id}`;
    const state = parseMapExplorerState(new URL(href, "http://local").searchParams, limits);
    expect(state.journey).toEqual({ id: TOTAL_JOURNEY_ID, stop: total.stops[8].id });
    expect(buildMapExplorerUrl(state)).toBe(href);
    expect(parseMapExplorerState(new URLSearchParams("hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911"), limits).journey)
      .toEqual({ id: "ho-chi-minh-1911-1941", stop: "sai-gon-1911" });
  });

  it("resolves reviewed media from the original milestone while navigation keeps the total identity", () => {
    const total = createTotalJourney(BASE);
    for (const stop of total.stops) {
      const origin = stop.origin!;
      const media = resolveJourneyMedia(origin.journeyId, origin.stopId);
      expect(media, `${origin.journeyId}:${origin.stopId}`).not.toBeNull();
      expect(resolveJourneyMedia(total.id, stop.id)).toBeNull();
      expect(media).toEqual(resolveJourneyMedia(origin.journeyId, origin.stopId));
    }
    const stop = total.stops[0];
    const html = renderToStaticMarkup(createElement(JourneyStopReader, {
      journeyId: total.id, stop,
      state: { from: 1911, to: 1975, selectedEvent: null, view: stop.view, journey: { id: total.id, stop: stop.id } },
      eventAvailable: true, onReadingChange: () => undefined,
    }));
    expect(html).toContain(resolveJourneyMedia(stop.origin!.journeyId, stop.origin!.stopId)!.url);
    expect(decodeURIComponent(html)).toContain(`hanh-trinh=${total.id}`);
    expect(decodeURIComponent(html)).toContain(`moc=${stop.id}`);
    const missing = { ...stop, origin: { journeyId: "missing-journey", stopId: "missing-stop" } } satisfies JourneyStop;
    const fallback = renderToStaticMarkup(createElement(JourneyStopReader, {
      journeyId: total.id, stop: missing,
      state: { from: 1911, to: 1975, selectedEvent: null, view: stop.view, journey: { id: total.id, stop: stop.id } },
      eventAvailable: false, onReadingChange: () => undefined,
    }));
    expect(fallback).toContain("Mốc này chưa có ảnh đủ bằng chứng về nội dung và quyền sử dụng.");
  });

  it("crosses each source-journey boundary and stops at the final milestone", () => {
    const total = createTotalJourney(BASE);
    const registry = createJourneyRegistry([...BASE, total]);
    const limits = { from: 1911, to: 1975, selectedEvent: null, view: null };
    let runtime = createExplorerRuntime(limits, registry);
    const dispatch = (action: ExplorerAction) => { runtime = reduceExplorerRuntime(runtime, action, registry); };
    dispatch({ type: "choose-journey", id: TOTAL_JOURNEY_ID });
    const boundaries = [
      ["ho-chi-minh-1911-1941", "pac-bo-1941", "mua-thu-doc-lap-1945", "ha-noi-1945"],
      ["mua-thu-doc-lap-1945", "ba-dinh-1945", "khang-chien-chong-phap-1946-1954", "ha-noi-1946"],
      ["khang-chien-chong-phap-1946-1954", "geneve-1954", "mua-xuan-1975", "buon-ma-thuot-1975"],
    ] as const;
    for (const [fromJourney, fromStop, toJourney, toStop] of boundaries) {
      const current = total.stops.find((stop) => stop.origin?.journeyId === fromJourney && stop.origin.stopId === fromStop)!;
      const next = total.stops.find((stop) => stop.origin?.journeyId === toJourney && stop.origin.stopId === toStop)!;
      dispatch({ type: "seek", stopId: current.id });
      dispatch({ type: "play" });
      const arrival = runtime.cameraRequest!;
      expect(arrival).toMatchObject({ journeyId: TOTAL_JOURNEY_ID, stopId: current.id });
      dispatch({ type: "arrive", arrival });
      dispatch({ type: "dwell", arrival });
      expect(runtime.state.journey).toEqual({ id: TOTAL_JOURNEY_ID, stop: next.id });
      expect(runtime.cameraRequest?.stopId).toBe(next.id);
      dispatch({ type: "arrive", arrival: runtime.cameraRequest! });
      dispatch({ type: "seek", stopId: current.id });
      expect(runtime.state.journey?.stop).toBe(current.id);
      dispatch({ type: "seek", stopId: next.id });
    }
    const penultimate = total.stops.at(-2)!;
    const last = total.stops.at(-1)!;
    dispatch({ type: "seek", stopId: penultimate.id });
    dispatch({ type: "play" });
    dispatch({ type: "arrive", arrival: runtime.cameraRequest! });
    dispatch({ type: "dwell", arrival: runtime.settledArrival! });
    expect(runtime.state.journey).toEqual({ id: TOTAL_JOURNEY_ID, stop: last.id });
    expect(runtime.cameraRequest?.stopId).toBe(last.id);
    dispatch({ type: "arrive", arrival: runtime.cameraRequest! });
    expect(runtime.playing).toBe(false);
    const settled = runtime.settledArrival!;
    dispatch({ type: "dwell", arrival: settled });
    expect(runtime.state.journey).toEqual({ id: TOTAL_JOURNEY_ID, stop: last.id });
    expect(runtime.playing).toBe(false);
    dispatch({ type: "choose-journey", id: HISTORY_JOURNEY.id });
    const stale = settled;
    const before = runtime;
    dispatch({ type: "arrive", arrival: stale });
    expect(runtime).toBe(before);
    expect(runtime.state.journey?.id).toBe(HISTORY_JOURNEY.id);
  });
});
