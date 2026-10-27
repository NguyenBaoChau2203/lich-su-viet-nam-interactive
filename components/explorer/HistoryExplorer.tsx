"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { MapEventCard } from "@/components/explorer/MapEventCard";
import { MapEventList } from "@/components/explorer/MapEventList";
import { MapTimeControls } from "@/components/explorer/MapTimeControls";
import { JourneyPanel } from "@/components/explorer/JourneyPanel";
import { JourneyChooser } from "@/components/explorer/JourneyChooser";
import { LocalHeroesPanel } from "@/components/explorer/LocalHeroesPanel";
import { buildLocalHeroHomeHref, parseLocalHeroState, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { useLocalHeroPage } from "@/lib/local-heroes/use-local-hero-page";
import type { LocalHeroFilters, LocalHeroLoadState } from "@/lib/local-heroes/types";
import { HomeAtlasHeader } from "@/components/layout/HomeAtlasHeader";
import { filterExplorerEvents } from "@/lib/explorer/filters";
import { normalizeYearRange } from "@/lib/explorer/timeline-years";
import { buildMapExplorerUrl, parseMapExplorerState, type MapExplorerState } from "@/lib/explorer/map-state";
import type { MapView } from "@/lib/explorer/map-view";
import type { JourneyPopupAnchor } from "@/lib/explorer/globe-contract";
import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";
import { getJourneyById, getJourneyStop, sameJourneyArrival, type JourneyArrival } from "@/lib/explorer/journey";
import { DEFAULT_JOURNEY_ID, JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import { createExplorerRuntime, reduceExplorerRuntime, scheduleJourneyDwell, type ExplorerAction, type ExplorerRuntime } from "@/lib/explorer/journeys/playback";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import "./explorer-map.css";

const EventMap = dynamic(() => import("@/components/explorer/EventMap"), {
  ssr: false,
  loading: () => <div className="home-map-loading" role="status">Đang mở không gian lịch sử…</div>,
});

export type HistoryExplorerProps = {
  events: readonly ExplorerEvent[];
  limits: ExplorerLimits | null;
  initialState: MapExplorerState | null;
  dataError?: string | null;
  initialPeople?: LocalHeroUrlState;
  initialPeopleLoad?: LocalHeroLoadState;
};

const explorerReducer = (runtime: ExplorerRuntime, action: ExplorerAction) => reduceExplorerRuntime(runtime, action);

export function HistoryExplorer({ events, limits, initialState, dataError = null, initialPeople, initialPeopleLoad = { status: "idle" } }: HistoryExplorerProps) {
  const [runtime, dispatch] = useReducer(explorerReducer,
    initialState ?? { from: 1911, to: 1941, selectedEvent: null, view: null }, (state) => createExplorerRuntime(state, JOURNEY_REGISTRY, initialPeople));
  const { state, playing, cameraRequest, settledArrival, restoreRequest, focusRequest, readerActive, hidden, reducedMotion: playbackReducedMotion, departing } = runtime;
  const reducedMotion = usePrefersReducedMotion();
  const peopleActive = runtime.people.discovery.mode === "people";
  const peopleMap = runtime.people.suspended?.state ?? state;
  const journey = state.journey ? getJourneyById(state.journey.id) : undefined;
  const stop = state.journey ? getJourneyStop(state.journey.id, state.journey.stop) ?? null : null;
  const journeyPathRequest = useMemo(() => !peopleActive && !departing && journey && stop
    ? { journey, journeyId: journey.id, stopId: stop.id, nonce: runtime.requestNonce } : null,
  [peopleActive, departing, journey, stop, runtime.requestNonce]);
  const [mapReady, setMapReady] = useState(false);
  const [journeyAnchor, setJourneyAnchor] = useState<JourneyPopupAnchor | null>(null);
  const focusReader = useRef(false);
  const journeyButton = useRef<HTMLButtonElement>(null);
  const selectionOrigin = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLDetailsElement>(null);
  const navigationPending = useRef(false);
  const historyIntent = useRef<"push" | "replace" | "restore">("replace");
  const peopleTrigger = useRef<HTMLElement | null>(null);
  const peopleLink = useRef<HTMLAnchorElement>(null);
  const changePeople = useCallback((filters: LocalHeroFilters) => {
    historyIntent.current = "push"; dispatch({ type: "people-change", filters });
  }, []);
  const clampPeople = useCallback((filters: LocalHeroFilters) => {
    historyIntent.current = "replace"; dispatch({ type: "people-change", filters });
  }, []);
  const peoplePage = useLocalHeroPage(runtime.people.discovery, initialPeopleLoad, clampPeople);
  const enterPeople = useCallback(() => {
    peopleTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    historyIntent.current = "push"; dispatch({ type: "people-enter" });
  }, []);
  const closePeople = useCallback(() => {
    historyIntent.current = "push"; dispatch({ type: "people-exit" });
    const trigger = peopleTrigger.current;
    if (trigger?.isConnected && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
    else peopleLink.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!peopleActive) return;
    document.getElementById("local-heroes-heading")?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape" && !event.defaultPrevented) { event.preventDefault(); closePeople(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [peopleActive, closePeople]);
  const visibleEvents = useMemo(() => state ? filterExplorerEvents(events, state.from, state.to) : events, [events, state]);
  const selectedEvent = visibleEvents.find((event) => event.slug === state?.selectedEvent) ?? null;

  useEffect(() => {
    if (!state || navigationPending.current) return;
    const intent = historyIntent.current;
    historyIntent.current = "replace";
    const write = () => {
      if (navigationPending.current || window.location.pathname !== "/") return;
      const href = buildLocalHeroHomeHref(runtime.people.suspended?.state ?? state, runtime.people.discovery);
      if (`${window.location.pathname}${window.location.search}` === href) return;
      window.history[intent === "push" ? "pushState" : "replaceState"](window.history.state, "", href);
    };
    if (intent === "push") write();
    const timer = intent === "replace" ? setTimeout(write, 150) : undefined;
    // Freeze all later camera/filter writes too: a flight may finish while an
    // outgoing Link is still waiting for server content on this mounted page.
    const cancelForLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== "/") {
        navigationPending.current = true;
        dispatch({ type: "depart" });
        clearTimeout(timer);
      }
    };
    document.addEventListener("click", cancelForLink, true);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", cancelForLink, true);
    };
  }, [state, runtime.people]);

  useEffect(() => {
    const restore = () => {
      navigationPending.current = false;
      historyIntent.current = "restore";
      const params = new URLSearchParams(window.location.search);
      const next = parseMapExplorerState(params, limits ?? { minYear: 1911, maxYear: 1941, eventSlugs: [] });
      dispatch({ type: "restore", state: next, people: parseLocalHeroState(params) });
    };
    const returned = (event: PageTransitionEvent) => { if (event.persisted || navigationPending.current) restore(); };
    window.addEventListener("popstate", restore);
    window.addEventListener("pageshow", returned);
    return () => { window.removeEventListener("popstate", restore); window.removeEventListener("pageshow", returned); };
  }, [limits]);

  const selectEvent = useCallback((slug: string) => {
    selectionOrigin.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dispatch({ type: "select-event", slug });
    if (listRef.current) listRef.current.open = false;
  }, []);

  const pauseJourney = useCallback(() => dispatch({ type: "manual" }), []);
  const arrive = useCallback((arrival: JourneyArrival) => {
    if (!navigationPending.current) dispatch({ type: "arrive", arrival });
  }, []);
  const onReadingChange = useCallback((active: boolean) => dispatch({ type: "reading", active }), []);
  const openReader = useCallback(() => {
    const heading = document.getElementById("journey-stop-heading");
    const fallback = document.querySelector<HTMLDetailsElement>(".journey-reader-fallback");
    if (fallback) fallback.open = true;
    if (heading) heading.focus({ preventScroll: true });
    else focusReader.current = true;
    dispatch({ type: "open-reader", unavailable: !mapReady });
  }, [mapReady]);
  const closeReader = useCallback(() => {
    dispatch({ type: "close-reader" });
    document.querySelector<HTMLButtonElement>(".journey-read-current")?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!runtime.popupOpen || !focusReader.current) return;
    const fallback = document.querySelector<HTMLDetailsElement>(".journey-reader-fallback");
    if (fallback) fallback.open = true;
    document.getElementById("journey-stop-heading")?.focus({ preventScroll: true });
    focusReader.current = false;
  }, [runtime.popupOpen]);
  useEffect(() => {
    if (peopleActive || !stop || (!runtime.popupOpen && (mapReady || runtime.readerDismissed))) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { event.preventDefault(); closeReader(); } };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [peopleActive, stop, runtime.popupOpen, runtime.readerDismissed, mapReady, closeReader]);
  const onReadyChange = useCallback((ready: boolean) => {
    setMapReady(ready);
    if (!ready) dispatch({ type: "pause" });
  }, []);

  const seek = useCallback((stopId: string) => dispatch({ type: "seek", stopId }), []);
  // The future chooser calls this same owner callback; it needs no other store.
  const onChooseJourney = useCallback((id: string) => dispatch({ type: "choose-journey", id }), []);

  function enterJourney() {
    if (stop) return;
    onChooseJourney(DEFAULT_JOURNEY_ID);
    if (listRef.current) listRef.current.open = false;
  }

  function exitJourney() {
    dispatch({ type: "exit" });
    journeyButton.current?.focus();
  }

  function togglePlayback() {
    if (playing) { dispatch({ type: "pause" }); return; }
    if (!stop || !mapReady || reducedMotion || document.hidden || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    dispatch({ type: "play" });
  }

  useEffect(() => {
    return scheduleJourneyDwell({ playing, settledArrival, cameraRequest, readerActive, hidden, reducedMotion: playbackReducedMotion, departing },
      (arrival) => { if (!navigationPending.current) dispatch({ type: "dwell", arrival }); });
  }, [playing, settledArrival, cameraRequest, readerActive, hidden, playbackReducedMotion, departing]);

  useEffect(() => {
    const visibility = () => dispatch({ type: "visibility", hidden: document.hidden });
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => dispatch({ type: "motion", reduced: motion.matches });
    visibility(); changed();
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", changed);
    return () => { document.removeEventListener("visibilitychange", visibility); motion.removeEventListener("change", changed); };
  }, []);

  const closeEvent = useCallback(() => {
    dispatch({ type: "close-event" });
    const origin = selectionOrigin.current;
    if (origin?.isConnected && origin.getClientRects().length) origin.focus();
    else listRef.current?.querySelector("summary")?.focus();
  }, []);

  useEffect(() => {
    if (peopleActive || !selectedEvent) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") closeEvent(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [peopleActive, selectedEvent, closeEvent]);

  const updateView = useCallback((view: MapView, arrival?: JourneyArrival) => {
    if (!navigationPending.current) dispatch({ type: "view", view, arrival });
  }, []);

  function changePeriod(from: number, to: number) {
    if (!limits || !Number.isFinite(from) || !Number.isFinite(to)) return;
    const { from: lower, to: upper } = normalizeYearRange(from, to, limits);
    const matching = filterExplorerEvents(events, lower, upper);
    dispatch({ type: "period", from: lower, to: upper, eventSlugs: matching.map((event) => event.slug) });
  }

  return (
    <section className={`home-history-map${stop ? " is-journey" : ""}${peopleActive ? " is-people" : ""}`} data-testid="history-explorer" aria-label="Khám phá lịch sử trên địa cầu">
      <HomeAtlasHeader journeyActive={Boolean(stop)} journeyButtonRef={journeyButton}
        peopleActive={peopleActive} peopleLinkRef={peopleLink} peopleHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "people" })} onPeople={enterPeople}
        onExplore={() => { if (peopleActive) closePeople(); if (stop) exitJourney(); }} onJourney={() => { if (peopleActive) closePeople(); enterJourney(); }} />
      <div className="absolute inset-0 z-0" data-testid="home-event-map">
        <EventMap events={peopleActive ? [] : visibleEvents} allEvents={events} view={state?.view ?? null} selectedEvent={peopleActive ? null : selectedEvent?.slug ?? null}
          readingMode={peopleActive ? "people" : "events"}
          focusRequest={peopleActive || stop ? null : focusRequest} onSelect={selectEvent} onViewChange={updateView}
          journeyStop={peopleActive ? null : stop} cameraRequest={peopleActive ? null : cameraRequest}
          journeyPathRequest={journeyPathRequest}
          restoreRequest={restoreRequest} onManualInput={pauseJourney} onArrive={arrive} onReadyChange={onReadyChange}
          onJourneyAnchor={setJourneyAnchor} onReadStop={openReader} />
      </div>
      <div className="home-map-intro">
        <h1>{journey && stop ? "Khám phá hành trình" : "Lịch sử qua những địa danh"}</h1>
        {peopleActive ? <p className="globe-hint">Chọn địa phương để đọc những hồ sơ có nguồn dẫn.</p> : journey && stop ? (
          <JourneyChooser
            journeys={JOURNEY_REGISTRY.journeys}
            selectedJourney={journey}
            selectedStop={stop}
            state={state}
            onChooseJourney={onChooseJourney}
            onSeekStop={seek}
          />
        ) : (
          <>
            <p className="globe-hint">Kéo để di chuyển · Cuộn để phóng to</p>
            <MapEventList events={visibleEvents} state={state} onSelect={selectEvent} detailsRef={listRef} />
          </>
        )}
      </div>
      {dataError && <p role="status" className="home-map-notice" data-testid="explorer-data-error">{dataError}</p>}
      {state.journeyNotice && <p role="status" className="home-map-notice" data-testid="journey-notice">{state.journeyNotice}</p>}
      {!peopleActive && !stop && !dataError && visibleEvents.length === 0 && <p role="status" className="home-map-notice">Không có sự kiện trong khoảng năm này. Hãy chọn khoảng khác hoặc “Toàn bộ”.</p>}
      <p className="sr-only" role="status" aria-live="polite">{visibleEvents.length} sự kiện trong khoảng thời gian đang chọn.</p>
      {!peopleActive && !stop && !selectedEvent && <aside className="home-map-guidance" aria-labelledby="home-map-guidance-heading" data-testid="home-map-guidance">
        <h2 id="home-map-guidance-heading">Khám phá một sự kiện</h2>
        <p>Chọn một điểm trên bản đồ để xem thời gian, địa điểm và câu chuyện lịch sử.</p>
        <button type="button" onClick={enterJourney}>Xem hành trình <ArrowRight size={16} aria-hidden="true" /></button>
      </aside>}
      {!peopleActive && !stop && selectedEvent && <MapEventCard key={selectedEvent.slug} event={selectedEvent} state={state} onClose={closeEvent} />}
      {peopleActive ? <LocalHeroesPanel map={peopleMap} discovery={runtime.people.discovery} load={peoplePage.load} onChange={changePeople} onClose={closePeople} onRetry={peoplePage.retry} /> : journey && stop ? <JourneyPanel key={journey.id} journey={journey} stop={stop} state={state} playing={playing} settled={sameJourneyArrival(settledArrival, cameraRequest)} travelling={Boolean(cameraRequest && !sameJourneyArrival(settledArrival, cameraRequest))} reducedMotion={reducedMotion} mapAvailable={mapReady}
        popupOpen={runtime.popupOpen} readerDismissed={runtime.readerDismissed} anchor={sameJourneyArrival(journeyAnchor, journeyPathRequest) ? journeyAnchor : null}
        onOpenReader={openReader} onCloseReader={closeReader}
        readerActive={readerActive} eventAvailable={events.some((event) => event.slug === stop.eventSlug)} onSeek={seek} onPlay={togglePlayback} onExit={exitJourney} onReadingChange={onReadingChange} />
        : <MapTimeControls events={events} limits={limits} state={state} onChange={changePeriod} onOpenEvents={() => {
          if (listRef.current) { listRef.current.open = true; listRef.current.querySelector("summary")?.focus(); }
        }} />}
      <noscript>
        <div className="home-map-notice">
          <p>
            {peopleActive ? "JavaScript đang tắt. Bạn vẫn có thể chọn địa phương, tìm kiếm và chuyển trang bằng biểu mẫu. Hoặc chọn đọc các hành trình:" : "JavaScript đang tắt. Mở “Danh sách sự kiện” để đọc, hoặc chọn đọc các hành trình:"}
          </p>
          <ul className="mt-1 flex flex-wrap gap-2 text-xs">
            {JOURNEY_REGISTRY.journeys.map((j) => (
              <li key={j.id}>
                <Link
                  href={buildMapExplorerUrl({
                    ...state,
                    journey: { id: j.id, stop: j.stops[0].id },
                    selectedEvent: null,
                    view: j.stops[0].view,
                  })}
                  className="text-accent underline underline-offset-2"
                >
                  {j.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </section>
  );
}
