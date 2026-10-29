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
import { LocalityChooser } from "@/components/locality/LocalityChooser";
import { LocalityResults } from "@/components/locality/LocalityResults";
import { LocalityCardCluster } from "@/components/locality/LocalityCardCluster";
import { createLocalityProjectionChannel } from "@/lib/locality/projection";
import { buildLocalityOverview } from "@/lib/locality/overview";
import { buildLocalHeroHomeHref, parseLocalHeroState, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { useLocalHeroPage } from "@/lib/local-heroes/use-local-hero-page";
import { useHeritageCatalog } from "@/hooks/useHeritageCatalog";
import { heritageMarkerEvents } from "@/lib/heritage/markers";
import { localityFallbackView } from "@/lib/heritage/locality-views";
import { vietnamOverviewView } from "@/lib/explorer/cinematic/camera";
import type { LocalHeroFilters, LocalHeroLoadState, LocalityCode } from "@/lib/local-heroes/types";
import type { HeritageLoadState } from "@/lib/heritage/types";
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
  initialPlacesLoad?: HeritageLoadState;
};

const explorerReducer = (runtime: ExplorerRuntime, action: ExplorerAction) => reduceExplorerRuntime(runtime, action);

export function HistoryExplorer({
  events,
  limits,
  initialState,
  dataError = null,
  initialPeople,
  initialPeopleLoad = { status: "idle" },
  initialPlacesLoad = { status: "idle" },
}: HistoryExplorerProps) {
  const [runtime, dispatch] = useReducer(explorerReducer,
    initialState ?? { from: 1911, to: 1941, selectedEvent: null, view: null }, (state) => createExplorerRuntime(state, JOURNEY_REGISTRY, initialPeople));
  const { state, playing, cameraRequest, settledArrival, restoreRequest, focusRequest, readerActive, hidden, reducedMotion: playbackReducedMotion, departing } = runtime;
  const reducedMotion = usePrefersReducedMotion();
  const peopleActive = runtime.people.discovery.mode === "people";
  const placesActive = runtime.people.discovery.mode === "places";
  const overviewActive = runtime.people.discovery.mode === "locality";
  const localityActive = peopleActive || placesActive || overviewActive;
  const peopleMap = runtime.people.suspended?.state ?? state;
  const journey = state.journey ? getJourneyById(state.journey.id) : undefined;
  const stop = state.journey ? getJourneyStop(state.journey.id, state.journey.stop) ?? null : null;
  const journeyPathRequest = useMemo(() => !localityActive && !departing && journey && stop
    ? { journey, journeyId: journey.id, stopId: stop.id, nonce: runtime.requestNonce } : null,
  [localityActive, departing, journey, stop, runtime.requestNonce]);
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
  const [localityProjection] = useState(createLocalityProjectionChannel);
  // Transient UI only: hide/reopen must not touch selection, camera or history.
  const [localityPanelOpen, setLocalityPanelOpen] = useState(true);

  const localityCode = runtime.people.discovery.filters.localityCode;
  const selectedPlaceSlug = runtime.people.discovery.place;

  // Heritage Places Catalog
  const heritageCatalog = useHeritageCatalog(placesActive || (overviewActive && Boolean(localityCode)), initialPlacesLoad);
  const catalogData = heritageCatalog.load.status === "ready" ? heritageCatalog.load.data : null;
  const allHeritageSites = useMemo(() => catalogData?.items ?? [], [catalogData]);

  const visibleHeritageSites = useMemo(() => {
    if (!localityCode) return allHeritageSites;
    return allHeritageSites.filter((site) => site.locality.code === localityCode);
  }, [allHeritageSites, localityCode]);

  const selectedHeritageSite = useMemo(() => {
    if (!selectedPlaceSlug) return null;
    return allHeritageSites.find((site) => site.slug === selectedPlaceSlug) ?? null;
  }, [allHeritageSites, selectedPlaceSlug]);
  useEffect(() => {
    // Old selected-place URLs may omit the locality. Resolve only against the
    // validated catalog identity, never against nearest reference coordinates.
    if (!placesActive || !selectedHeritageSite || localityCode === selectedHeritageSite.locality.code) return;
    historyIntent.current = "replace";
    dispatch({ type: "people-change", filters: { localityCode: selectedHeritageSite.locality.code, query: "", page: 1 }, keepPlace: true });
  }, [placesActive, selectedHeritageSite, localityCode]);

  const [placesCameraNonce, setPlacesCameraNonce] = useState(() => localityActive && !initialState?.view ? 1 : 0);
  const placesCameraView = useMemo(() => {
    if (!localityActive) return null;
    if (selectedHeritageSite) return { lat: selectedHeritageSite.latitude, lng: selectedHeritageSite.longitude, zoom: 9 };
    if (localityCode) return localityFallbackView(localityCode);
    return vietnamOverviewView({ width: typeof window !== "undefined" ? window.innerWidth : 1280, height: typeof window !== "undefined" ? window.innerHeight : 720 });
  }, [localityActive, selectedHeritageSite, localityCode]);

  const lastPlacesIntent = useRef<{ mode: string; locality: string | null; place: string | null; restore: number }>({
    mode: runtime.people.discovery.mode,
    locality: localityCode,
    place: selectedPlaceSlug ?? null,
    restore: restoreRequest,
  });

  const cameraActive = placesActive || overviewActive || (peopleActive && Boolean(localityCode));
  useEffect(() => {
    if (!cameraActive) return;
    const currentIntent = {
      mode: runtime.people.discovery.mode,
      locality: localityCode,
      place: selectedPlaceSlug ?? null,
      restore: restoreRequest,
    };
    if (lastPlacesIntent.current.restore !== restoreRequest && state.view) {
      // A saved URL/detail view has priority over a new presentation flight.
      lastPlacesIntent.current = currentIntent;
      setPlacesCameraNonce(0);
      return;
    }
    const changed =
      lastPlacesIntent.current.mode !== currentIntent.mode ||
      lastPlacesIntent.current.locality !== currentIntent.locality ||
      lastPlacesIntent.current.place !== currentIntent.place;
    if (changed) {
      lastPlacesIntent.current = currentIntent;
      setPlacesCameraNonce((n) => n + 1);
    }
  }, [cameraActive, localityCode, selectedPlaceSlug, runtime.people.discovery.mode, restoreRequest, state.view]);

  const placesCamera = useMemo(() => {
    if (!cameraActive || !placesCameraView || placesCameraNonce === 0) return null;
    return { view: placesCameraView, nonce: placesCameraNonce };
  }, [cameraActive, placesCameraView, placesCameraNonce]);

  const changePeople = useCallback((filters: LocalHeroFilters) => {
    historyIntent.current = "push"; dispatch({ type: "people-change", filters });
  }, []);
  const clampPeople = useCallback((filters: LocalHeroFilters) => {
    historyIntent.current = "replace"; dispatch({ type: "people-change", filters });
  }, []);
  const peoplePage = useLocalHeroPage(runtime.people.discovery, initialPeopleLoad, clampPeople);

  const localityOverview = useMemo(() => {
    if (!localityActive || !localityCode) return null;
    const overview = buildLocalityOverview(localityCode, heritageCatalog.load, peoplePage.load);
    if (selectedHeritageSite && placesActive) overview.places = { status: "ready", total: visibleHeritageSites.length, items: [selectedHeritageSite] };
    return overview;
  }, [localityActive, localityCode, heritageCatalog.load, peoplePage.load, selectedHeritageSite, placesActive, visibleHeritageSites.length]);

  const enterLocality = useCallback(() => {
    peopleTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLocalityPanelOpen(true);
    historyIntent.current = "push";
    dispatch({ type: "people-enter", mode: "locality" });
    setPlacesCameraNonce((n) => n + 1);
  }, []);
  const reopenLocalityPanel = useCallback(() => {
    setLocalityPanelOpen(true);
  }, []);
  const onLocalityHeader = useCallback(() => {
    if (localityActive) {
      // Already in discovery: reopen the panel only — no mode/camera/history write.
      if (!localityPanelOpen) reopenLocalityPanel();
      return;
    }
    enterLocality();
  }, [localityActive, localityPanelOpen, enterLocality, reopenLocalityPanel]);
  const selectLocalityFromChooser = useCallback((code: LocalityCode | null) => {
    historyIntent.current = "push";
    dispatch(code ? { type: "locality-select", code } : { type: "locality-clear-selection" });
  }, []);
  const changeLocalityToChooser = useCallback(() => {
    historyIntent.current = "push";
    dispatch({ type: "locality-clear-selection" });
    setLocalityPanelOpen(true);
    requestAnimationFrame(() => document.querySelector<HTMLSelectElement>(".locality-chooser:not([hidden]) select")?.focus({ preventScroll: true }));
  }, []);
  const enterPeople = useCallback(() => {
    peopleTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLocalityPanelOpen(true);
    historyIntent.current = "push"; dispatch({ type: "people-enter", mode: "people" });
  }, []);
  const enterPlaces = useCallback(() => {
    peopleTrigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setLocalityPanelOpen(true);
    historyIntent.current = "push";
    dispatch({ type: "people-enter", mode: "places" });
    setPlacesCameraNonce((n) => n + 1);
  }, []);
  const selectPlace = useCallback((slug: string) => {
    historyIntent.current = "push";
    const site = allHeritageSites.find((item) => item.slug === slug);
    if (site && site.locality.code !== localityCode) {
      // Commit the catalog's locality and record as one user intent. Leaving
      // canonicalization to the later restore effect would consume this push.
      dispatch({ type: "people-change", filters: { localityCode: site.locality.code, query: "", page: 1 } });
    }
    dispatch({ type: "place-select", slug });
  }, [allHeritageSites, localityCode]);
  const closePlace = useCallback(() => {
    historyIntent.current = "push";
    dispatch({ type: "place-select", slug: null });
  }, []);
  const switchLocalityMode = useCallback((mode: "places" | "people" | "locality") => {
    setLocalityPanelOpen(true);
    historyIntent.current = "push";
    dispatch({ type: "people-enter", mode });
  }, []);
  /** Explicit header exit to exploration — not used by panel X. */
  const closePeople = useCallback(() => {
    historyIntent.current = "push"; dispatch({ type: "locality-exit-to-explore" });
    setLocalityPanelOpen(true);
    const trigger = peopleTrigger.current;
    if (trigger?.isConnected && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
    else peopleLink.current?.focus({ preventScroll: true });
  }, []);
  /** Panel X: hide chooser only; keep mode, selection, cards, camera and URL. */
  const hideLocalityPanel = useCallback(() => {
    setLocalityPanelOpen(false);
    peopleLink.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!localityActive) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || document.querySelector("dialog[open], [data-search-overlay]")) return;
      const target = event.target instanceof Element ? event.target : null;
      const disclosure = target?.closest<HTMLDetailsElement>("details[open]");
      event.preventDefault();
      if (disclosure) { disclosure.open = false; disclosure.querySelector("summary")?.focus(); }
      else if (selectedPlaceSlug) closePlace();
      else if (localityCode) changeLocalityToChooser();
      else if (localityPanelOpen) hideLocalityPanel();
      // Panel already hidden: do not fall through to mode exit.
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [localityActive, localityCode, selectedPlaceSlug, localityPanelOpen, closePlace, changeLocalityToChooser, hideLocalityPanel]);

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
    if (localityActive || !selectedEvent) return;
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") closeEvent(); };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [localityActive, selectedEvent, closeEvent]);

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
    <section className={`home-history-map${stop ? " is-journey" : ""}${peopleActive ? " is-people" : ""}${placesActive ? " is-places" : ""}${overviewActive ? " is-locality" : ""}`}
      data-testid="history-explorer"
      data-places-camera-nonce={placesCameraNonce}
      aria-label="Khám phá lịch sử trên địa cầu">
      <HomeAtlasHeader journeyActive={Boolean(stop)} journeyButtonRef={journeyButton}
        peopleActive={peopleActive} placesActive={placesActive} overviewActive={overviewActive} peopleLinkRef={peopleLink}
        localityHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "locality" })}
        peopleHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "people" })}
        placesHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "places" })}
        localityPanelOpen={localityPanelOpen}
        onLocality={onLocalityHeader} onPeople={enterPeople} onPlaces={enterPlaces}
        onExplore={() => { if (localityActive) closePeople(); else if (stop) exitJourney(); }}
        onJourney={() => { if (localityActive) { closePeople(); onChooseJourney(state.journey?.id ?? DEFAULT_JOURNEY_ID); } else enterJourney(); }} />
      <div className="absolute inset-0 z-0" data-testid="home-event-map">
        <EventMap
          events={placesActive ? heritageMarkerEvents(visibleHeritageSites) : localityActive ? [] : visibleEvents}
          allEvents={events}
          view={state?.view ?? null}
          selectedEvent={placesActive ? (selectedPlaceSlug ? `place:${selectedPlaceSlug}` : null) : peopleActive ? null : selectedEvent?.slug ?? null}
          readingMode={placesActive ? "places" : peopleActive ? "people" : overviewActive ? "locality" : "events"}
          placesCamera={placesCamera}
          localitySelection={localityActive ? {
            selectedCode: localityCode, nonce: runtime.requestNonce,
            onSelect: selectLocalityFromChooser, onProject: localityProjection.publish,
          } : null}
          focusRequest={localityActive || stop ? null : focusRequest}
          onSelect={(slug) => {
            if (placesActive) {
              selectPlace(slug.startsWith("place:") ? slug.slice(6) : slug);
            } else {
              selectEvent(slug);
            }
          }}
          onViewChange={updateView}
          journeyStop={localityActive ? null : stop} cameraRequest={localityActive ? null : cameraRequest}
          journeyPathRequest={journeyPathRequest}
          restoreRequest={restoreRequest} onManualInput={pauseJourney} onArrive={arrive} onReadyChange={onReadyChange}
          onJourneyAnchor={setJourneyAnchor} onReadStop={openReader} />
      </div>
      {localityActive ? (
        <LocalityChooser
          selectedCode={localityCode}
          mode={runtime.people.discovery.mode as "locality" | "places" | "people"}
          overviewHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "locality" })}
          placesHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "places" })}
          peopleHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "people" })}
          hidden={!localityPanelOpen}
          onSelect={selectLocalityFromChooser}
          onSwitchMode={switchLocalityMode}
          onHide={hideLocalityPanel}
        >
          {(peopleActive || placesActive) && <LocalityResults map={peopleMap} discovery={runtime.people.discovery} people={peoplePage.load} places={heritageCatalog.load}
            onChange={changePeople} onSelectPlace={selectPlace} onRetryPeople={peoplePage.retry} onRetryPlaces={heritageCatalog.retry} />}
        </LocalityChooser>
      ) : (
        <div className="home-map-intro">
          <h1>{journey && stop ? "Khám phá hành trình" : placesActive ? "Địa danh theo địa phương" : "Lịch sử qua những địa danh"}</h1>
          {placesActive ? <p className="globe-hint">Chọn địa phương để xem các địa danh đã được thẩm định.</p> : peopleActive ? <p className="globe-hint">Chọn địa phương để đọc những hồ sơ có nguồn dẫn.</p> : journey && stop ? (
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
      )}
      {dataError && <p role="status" className="home-map-notice" data-testid="explorer-data-error">{dataError}</p>}
      {state.journeyNotice && <p role="status" className="home-map-notice" data-testid="journey-notice">{state.journeyNotice}</p>}
      {!localityActive && !stop && !dataError && visibleEvents.length === 0 && <p role="status" className="home-map-notice">Không có sự kiện trong khoảng năm này. Hãy chọn khoảng khác hoặc “Toàn bộ”.</p>}
      <p className="sr-only" role="status" aria-live="polite">{visibleEvents.length} sự kiện trong khoảng thời gian đang chọn.</p>
      {!localityActive && !stop && !selectedEvent && <aside className="home-map-guidance" aria-labelledby="home-map-guidance-heading" data-testid="home-map-guidance">
        <h2 id="home-map-guidance-heading">Khám phá một sự kiện</h2>
        <p>Chọn một điểm trên bản đồ để xem thời gian, địa điểm và câu chuyện lịch sử.</p>
        <button type="button" onClick={enterJourney}>Xem hành trình <ArrowRight size={16} aria-hidden="true" /></button>
      </aside>}
      {!localityActive && !stop && selectedEvent && <MapEventCard key={selectedEvent.slug} event={selectedEvent} state={state} onClose={closeEvent} />}
      {localityActive && localityCode && localityOverview && <LocalityCardCluster
        localityCode={localityCode} nonce={runtime.requestNonce} projection={localityProjection} overview={localityOverview}
        mode={runtime.people.discovery.mode as "locality" | "places" | "people"} selectedPlace={Boolean(selectedHeritageSite)}
        homeHref={buildLocalHeroHomeHref(peopleMap, runtime.people.discovery)}
        placesHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "places" })}
        peopleHref={buildLocalHeroHomeHref(peopleMap, { ...runtime.people.discovery, mode: "people" })}
        onClear={changeLocalityToChooser} onClosePlace={closePlace} onRetryPlaces={heritageCatalog.retry} onRetryPeople={peoplePage.retry} onViewAll={switchLocalityMode} />}
      {localityActive ? <h1 className="sr-only">Khám phá lịch sử theo địa phương</h1> : journey && stop ? (
        <JourneyPanel key={journey.id} journey={journey} stop={stop} state={state} playing={playing} settled={sameJourneyArrival(settledArrival, cameraRequest)} travelling={Boolean(cameraRequest && !sameJourneyArrival(settledArrival, cameraRequest))} reducedMotion={reducedMotion} mapAvailable={mapReady}
          popupOpen={runtime.popupOpen} readerDismissed={runtime.readerDismissed} anchor={sameJourneyArrival(journeyAnchor, journeyPathRequest) ? journeyAnchor : null}
          onOpenReader={openReader} onCloseReader={closeReader}
          readerActive={readerActive} eventAvailable={events.some((event) => event.slug === stop.eventSlug)} onSeek={seek} onPlay={togglePlayback} onExit={exitJourney} onReadingChange={onReadingChange} />
      ) : (
        <MapTimeControls events={events} limits={limits} state={state} onChange={changePeriod} onOpenEvents={() => {
          if (listRef.current) { listRef.current.open = true; listRef.current.querySelector("summary")?.focus(); }
        }} />
      )}
      <noscript>
        <div className="home-map-notice">
          <p>
            {placesActive
              ? "JavaScript đang tắt. Bạn vẫn có thể chọn địa phương bằng biểu mẫu. Hoặc chọn đọc các hành trình:"
              : peopleActive
                ? "JavaScript đang tắt. Bạn vẫn có thể chọn địa phương, tìm kiếm và chuyển trang bằng biểu mẫu. Hoặc chọn đọc các hành trình:"
                : overviewActive
                  ? "JavaScript đang tắt. Bạn vẫn có thể chọn địa phương bằng danh sách phía trên. Hoặc chọn đọc các hành trình:"
                  : "JavaScript đang tắt. Mở “Danh sách sự kiện” để đọc, hoặc chọn đọc các hành trình:"}
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
