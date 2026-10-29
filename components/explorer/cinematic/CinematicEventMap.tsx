"use client";

import { Globe2, LocateFixed, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CinematicGlobeCanvas } from "@/components/explorer/cinematic/CinematicGlobeCanvas";
import { GlobeMarkers } from "@/components/explorer/GlobeMarkers";
import { LocalityMapMarkers } from "@/components/locality/LocalityMapMarkers";
import { LOCALITY_CENTERS } from "@/lib/heritage/locality-views";
import { CLOSEST_USEFUL_EVENT_ZOOM, journeyFlightDurationMs, panView, vietnamOverviewView, worldOverviewView, zoomView } from "@/lib/explorer/cinematic/camera";
import { createGlobeCameraController, type GlobeCameraController } from "@/lib/explorer/cinematic/camera-controller";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import type { EventMapProps, GlobeCameraRequest, GlobePlaceLabel, GlobeViewport } from "@/lib/explorer/globe-contract";
import { sameJourneyArrival } from "@/lib/explorer/journey";
import type { MapView } from "@/lib/explorer/map-view";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { fitClusterView } from "@/lib/explorer/cluster-expansion";
import type { ProvinceBoundarySource } from "@/lib/explorer/cinematic/province-boundaries";
import { pointerToNdc } from "@/lib/explorer/cinematic/province-areas";
import { loadProvinceAreas, provinceAreaAnchor, provinceAreaPolygons } from "@/lib/locality/province-areas";
import { getEventMapAvailability } from "@/lib/explorer/map-markers";

const INTRO_KEY = "ls12:globe-intro-seen";
const ASSETS = { day: "/maps/globe/earth-day-4096x2048.jpg", normal: "/maps/globe/earth-normal-2048x1024.jpg", specular: "/maps/globe/earth-specular-2048x1024.jpg" };
const PROVINCE_AREAS_URL = "/maps/history-vietnam-province-areas.geojson";
const CLICK_DRAG_PX = 5;

export function CinematicEventMap(props: EventMapProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const callbacks = useRef(props);
  const reducedMotion = usePrefersReducedMotion();
  const [runtime, setRuntime] = useState<{ scene: CinematicScene; camera: GlobeCameraController } | null>(null);
  const scene = runtime?.scene ?? null;
  const camera = runtime?.camera ?? null;
  const [viewport, setViewport] = useState<GlobeViewport | null>(null);
  const [labels, setLabels] = useState<GlobePlaceLabel[]>([]);
  const [boundaryStatus, setBoundaryStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [provinceStatus, setProvinceStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [provinceSource, setProvinceSource] = useState<ProvinceBoundarySource | null>(null);
  const [intro, setIntro] = useState(false);
  const departing = useRef(false);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ id: number; x: number; y: number; moved: number } | null>(null);
  const handledFocus = useRef<{ slug: string; nonce: number } | null>(null);
  const handledPlacesCamera = useRef<number | null>(null);
  const activeJourney = useRef<GlobeCameraRequest | null>(null);
  const areasReady = useRef(false);
  const [areasEpoch, setAreasEpoch] = useState(0);
  const clearInput = useCallback(() => {
    clearTimeout(wheelTimer.current ?? undefined);
    wheelTimer.current = null; drag.current = null;
  }, []);
  useEffect(() => { callbacks.current = props; }, [props]);
  useEffect(() => {
    if (props.readingMode !== "people" && props.readingMode !== "places" && props.readingMode !== "locality") return;
    activeJourney.current = null;
    camera?.cancel(); clearInput(); scene?.setJourneyPath(null);
  }, [props.readingMode, camera, scene, clearInput]);
  useEffect(() => {
    if (!scene) return;
    const abort = new AbortController();
    const mark = (status: "loading" | "ready" | "unavailable") => {
      stageRef.current?.querySelector("[data-testid='globe-map']")?.setAttribute("data-province-areas", status);
    };
    areasReady.current = false;
    mark("loading");
    void loadProvinceAreas(PROVINCE_AREAS_URL, abort.signal).then(async (collection) => {
      if (abort.signal.aborted) return;
      if (!collection) {
        mark("unavailable");
        return;
      }
      await scene.setProvinceAreas(collection);
      if (abort.signal.aborted) return;
      areasReady.current = true;
      mark("ready");
      setAreasEpoch((n) => n + 1);
    });
    return () => {
      abort.abort();
      areasReady.current = false;
      mark("loading");
      void scene.setProvinceAreas(null);
    };
  }, [scene]);
  useEffect(() => () => {
    camera?.dispose();
    clearInput();
  }, [camera, clearInput]);

  const stageSize = useCallback(() => ({ width: stageRef.current?.clientWidth ?? window.innerWidth, height: stageRef.current?.clientHeight ?? window.innerHeight }), []);
  const [initialView] = useState(() => props.view ?? props.cameraRequest?.view ?? vietnamOverviewView({ width: window.innerWidth, height: window.innerHeight }));

  useEffect(() => {
    const abort = new AbortController();
    void fetch("/maps/history-vietnam-labels.json", { signal: abort.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data && !abort.signal.aborted) setLabels(data.labels); })
      .catch(() => { /* Curated labels are optional; event identity and reading remain available. */ });
    return () => abort.abort();
  }, []);

  useEffect(() => {
    if (!scene) return;
    const update = () => setViewport(scene.getViewport());
    update();
    return scene.subscribe(update);
  }, [scene]);

  useEffect(() => {
    const request = props.journeyPathRequest, stop = props.journeyStop, stage = stageRef.current;
    if (!request || !stop || !viewport || !scene || !stage) { callbacks.current.onJourneyAnchor?.(null); return; }
    const origin = stage.getBoundingClientRect(), parent = stage.closest(".home-history-map")?.getBoundingClientRect();
    callbacks.current.onJourneyAnchor?.({ journeyId: request.journeyId, stopId: request.stopId, nonce: request.nonce,
      point: viewport.project(stop.view.lng, stop.view.lat), stageSize: { width: viewport.width, height: viewport.height },
      offset: { x: origin.left - (parent?.left ?? origin.left), y: origin.top - (parent?.top ?? origin.top) } });
  }, [viewport, scene, props.journeyPathRequest, props.journeyStop]);

  const selectionCode = props.localitySelection?.selectedCode;
  const selectionNonce = props.localitySelection?.nonce;
  useEffect(() => {
    if (!scene || !areasReady.current) return;
    scene.setSelectedProvinceArea(selectionCode ?? null, {
      nonce: selectionNonce ?? 0,
      instant: reducedMotion,
    });
  }, [scene, selectionCode, selectionNonce, reducedMotion, areasEpoch]);
  useEffect(() => {
    const selection = callbacks.current.localitySelection, stage = stageRef.current;
    if (!selection?.selectedCode || !viewport || !scene || !stage) { selection?.onProject?.(null); return; }
    const origin = stage.getBoundingClientRect(), parent = stage.closest(".home-history-map")?.getBoundingClientRect();
    const center = LOCALITY_CENTERS[selection.selectedCode];
    const feature = scene.getProvinceAreaFeature(selection.selectedCode);
    const geom = scene.getSelectedProvinceGeometry();
    const raisedRadius =
      geom && geom.status === "admitted" && geom.code === selection.selectedCode ? geom.currentRadius : 1;
    const areaAnchor = feature ? provinceAreaAnchor(feature) : null;
    const anchor = areaAnchor ?? center;
    const visiblePoint = (lat: number, lng: number) => {
      const point = scene.projectGeo(lat, lng, raisedRadius);
      if (!point || point.behind || point.occluded || point.clipped || point.offstage) return null;
      return point;
    };
    let bounds: { left: number; right: number; top: number; bottom: number } | null = null;
    if (feature && !document.hidden) {
      let left = Infinity, right = -Infinity, top = Infinity, bottom = -Infinity, visible = 0;
      for (const polygon of provinceAreaPolygons(feature)) {
        for (const [lng, lat] of polygon[0]) {
          const point = visiblePoint(lat, lng);
          if (!point) continue;
          visible += 1;
          left = Math.min(left, point.x); right = Math.max(right, point.x);
          top = Math.min(top, point.y); bottom = Math.max(bottom, point.y);
        }
      }
      if (visible >= 3 && Number.isFinite(left) && right > left && bottom > top) {
        bounds = { left, right, top, bottom };
      }
    }
    // Once the area layer is loaded, do not fall back to a reference-center leader.
    // An occluded province keeps its cards and hides the leader.
    const kind = feature ? "province-area" : "reference-center";
    const raisedAnchor = document.hidden
      ? null
      : feature
        ? (() => {
            const projected = visiblePoint(anchor.lat, anchor.lng);
            return projected ? { x: projected.x, y: projected.y } : null;
          })()
        : viewport.project(anchor.lng, anchor.lat);
    selection.onProject?.({ code: selection.selectedCode, nonce: selection.nonce,
      point: raisedAnchor,
      bounds: kind === "province-area" ? bounds : null,
      kind,
      // R5: selected-area bounds protect the raised province; label rectangles must not override them.
      presentationBounds: kind === "province-area" ? bounds : null,
      stageSize: { width: viewport.width, height: viewport.height },
      offset: { x: origin.left - (parent?.left ?? origin.left), y: origin.top - (parent?.top ?? origin.top) } });
  }, [viewport, scene, selectionCode, selectionNonce, areasEpoch]);

  useEffect(() => {
    if (!camera || props.restoreRequest === 0) return;
    departing.current = false;
    camera.cancel();
    activeJourney.current = null;
    scene?.setJourneyPath(null);
    clearInput();
    const destination = callbacks.current;
    if (!destination.journeyStop) camera.jumpTo(destination.view ?? vietnamOverviewView(stageSize()));
  }, [camera, scene, props.restoreRequest, stageSize, clearInput]);

  useEffect(() => {
    scene?.setJourneyPath(departing.current ? null : props.journeyPathRequest);
  }, [scene, props.journeyPathRequest]);

  useEffect(() => {
    if (!camera) return;
    const visibility = () => { clearInput(); camera.setVisible(!document.hidden); };
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const preference = () => { if (motion.matches) camera.finish(); };
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", preference);
    visibility(); preference();
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", preference);
    };
  }, [camera, clearInput]);

  useEffect(() => {
    // Cancel at click time, including while Next is waiting for a route response.
    // HistoryExplorer remains the owner of the navigationPending URL-write guard.
    const departure = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.pathname === "/") return;
      departing.current = true;
      camera?.cancel(); clearInput();
      scene?.setJourneyPath(null);
      setIntro(false);
      callbacks.current.onManualInput();
    };
    document.addEventListener("click", departure, true);
    return () => document.removeEventListener("click", departure, true);
  }, [camera, scene, clearInput]);

  useEffect(() => {
    if (!camera || !props.placesCamera || departing.current) return;
    const { view, nonce } = props.placesCamera;
    if (handledPlacesCamera.current === nonce) return;
    handledPlacesCamera.current = nonce;
    clearInput();
    const instant = reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = props.readingMode === "locality" ? 750 : 1100;
    void camera.flyTo(view, instant ? 0 : duration);
  }, [camera, props.placesCamera, props.readingMode, reducedMotion, clearInput]);

  useEffect(() => {
    if (props.readingMode === "people" || props.readingMode === "places" || props.readingMode === "locality" || !scene || !camera || departing.current || camera.isFlying() || drag.current || wheelTimer.current) return;
    const view = props.view;
    if (!view) return;
    const current = scene.getView();
    if (Math.abs(current.lat - view.lat) > 0.0002 || Math.abs(current.lng - view.lng) > 0.0002 || Math.abs(current.zoom - view.zoom) > 0.02)
      camera.jumpTo(view);
  }, [scene, camera, props.view, props.readingMode]);

  useEffect(() => {
    if (!camera || !props.focusRequest || departing.current) return;
    const request = props.focusRequest;
    const previous = handledFocus.current;
    const same = previous?.slug === request.slug && previous.nonce === request.nonce;
    // A restored selection is the same intent. Replaying it would overwrite
    // the user's later pan/zoom. The current flight handles motion changes itself.
    if (same) return;
    const event = props.allEvents.find((item) => item.slug === request.slug);
    const availability = event ? getEventMapAvailability(event) : null;
    clearInput();
    handledFocus.current = request;
    if (!availability || availability.status !== "available") {
      // A summary-only selection supersedes the previous camera destination.
      camera.cancel(); camera.settle(); return;
    }
    const location = availability.anchors[0].location;
    // Selecting a visible local marker must not undo the user's closer view, or
    // jump to an offscreen first location of a multi-location event.
    const current = scene?.getView();
    const visibleMarker = Array.from(stageRef.current?.querySelectorAll<HTMLButtonElement>(".home-event-marker") ?? [])
      .some(marker => marker.dataset.eventSlugs?.split("|").includes(request.slug));
    if (current && visibleMarker && current.zoom >= CLOSEST_USEFUL_EVENT_ZOOM && availability.anchors.some((anchor) =>
      scene?.getViewport().project(anchor.location.longitude, anchor.location.latitude))) {
      camera.cancel(); camera.settle(); return;
    }
    void camera.flyTo({ lat: location.latitude, lng: location.longitude, zoom: CLOSEST_USEFUL_EVENT_ZOOM }, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 900);
  }, [camera, scene, props.focusRequest, props.allEvents, clearInput]);

  useEffect(() => {
    if (!camera || !scene || !props.cameraRequest || departing.current) return;
    const request = props.cameraRequest;
    if (!sameJourneyArrival(request, props.journeyPathRequest)) { scene.setJourneyPath(null); return; }
    clearInput();
    activeJourney.current = request;
    const instant = request.instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    void camera.flyTo(request.view, instant ? 0 : journeyFlightDurationMs(scene.getView(), request.view), () => {
      if (!departing.current && sameJourneyArrival(request, callbacks.current.cameraRequest)) callbacks.current.onArrive(request);
    }, request);
    return () => {
      // Manual input may already own a newer flight before React cleans up this
      // effect. Cancel only the journey intent this effect still owns.
      if (activeJourney.current === request) {
        camera.cancel(); activeJourney.current = null;
      }
    };
  }, [camera, scene, props.cameraRequest, props.journeyPathRequest, clearInput]);

  const manualInput = useCallback(() => {
    activeJourney.current = null;
    camera?.cancel();
    clearInput();
    setIntro(false);
    callbacks.current.onManualInput();
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* Optional storage. */ }
  }, [camera, clearInput]);

  useEffect(() => {
    const canvas = stageRef.current?.querySelector("canvas");
    if (!canvas || !scene || !camera) return;
    const pan = (dx: number, dy: number) => camera.setView(panView(scene.getView(), dx, dy, stageSize()));
    const wheel = (event: WheelEvent) => {
      if (departing.current) return;
      event.preventDefault(); manualInput();
      const pixels = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stageSize().height : 1);
      camera.setView(zoomView(scene.getView(), -pixels * 0.0016));
      wheelTimer.current = setTimeout(() => { wheelTimer.current = null; camera.settle(); }, 160);
    };
    const down = (event: PointerEvent) => {
      if (event.button !== 0 || departing.current) return;
      manualInput(); canvas.focus({ preventScroll: true });
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: 0 };
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      const active = drag.current;
      if (!active || active.id !== event.pointerId) return;
      const dx = event.clientX - active.x, dy = event.clientY - active.y;
      active.moved += Math.hypot(dx, dy);
      pan(dx, dy);
      active.x = event.clientX; active.y = event.clientY;
    };
    const clearPointerIntent = (event: PointerEvent) => {
      if (drag.current?.id !== event.pointerId) return;
      drag.current = null;
      camera.settle();
    };
    const up = (event: PointerEvent) => {
      // R3: only a valid primary pointerup may commit a province selection.
      if (event.type !== "pointerup" || event.button !== 0) {
        clearPointerIntent(event);
        return;
      }
      if (drag.current?.id !== event.pointerId) return;
      const active = drag.current;
      drag.current = null;
      camera.settle();
      const selection = callbacks.current.localitySelection;
      if (!selection || !scene || active.moved >= CLICK_DRAG_PX) return;
      const rect = canvas.getBoundingClientRect();
      const ndc = pointerToNdc(event.clientX, event.clientY, rect);
      const code = scene.pickProvinceArea(ndc);
      if (code) selection.onSelect(code);
    };
    const key = (event: KeyboardEvent) => {
      if (departing.current) return;
      const moves: Record<string, [number, number]> = { ArrowLeft: [90, 0], ArrowRight: [-90, 0], ArrowUp: [0, 90], ArrowDown: [0, -90] };
      if (!moves[event.key] && !["+", "=", "-"].includes(event.key)) return;
      event.preventDefault(); manualInput();
      if (moves[event.key]) pan(...moves[event.key]);
      else camera.setView(zoomView(scene.getView(), event.key === "-" ? -0.5 : 0.5));
      camera.settle();
    };
    const wheelClearsClick = (event: WheelEvent) => {
      drag.current = null;
      wheel(event);
    };
    canvas.addEventListener("wheel", wheelClearsClick, { passive: false });
    canvas.addEventListener("pointerdown", down); canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", clearPointerIntent);
    canvas.addEventListener("lostpointercapture", clearPointerIntent);
    canvas.addEventListener("keydown", key);
    return () => {
      drag.current = null;
      canvas.removeEventListener("wheel", wheelClearsClick); canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", clearPointerIntent);
      canvas.removeEventListener("lostpointercapture", clearPointerIntent);
      canvas.removeEventListener("keydown", key);
    };
  }, [scene, camera, stageSize, manualInput]);

  function onSceneReady(ready: CinematicScene) {
    const controller = createGlobeCameraController(ready, (view) => {
      const arrival = activeJourney.current;
      if (!departing.current && callbacks.current.readingMode !== "people" && callbacks.current.readingMode !== "places" && callbacks.current.readingMode !== "locality" && (!arrival || sameJourneyArrival(arrival, callbacks.current.cameraRequest)))
        callbacks.current.onViewChange(view, arrival ?? undefined);
    });
    controller.setVisible(!document.hidden);
    setRuntime({ scene: ready, camera: controller });
    callbacks.current.onReadyChange(true);
    const opening = callbacks.current;
    if (!departing.current && opening.readingMode !== "people" && opening.readingMode !== "places" && opening.readingMode !== "locality" && opening.restoreRequest === 0 && !opening.view && !opening.selectedEvent && !opening.journeyStop) {
      let seen = false;
      try { seen = sessionStorage.getItem(INTRO_KEY) === "1"; } catch { /* Optional storage. */ }
      const target = vietnamOverviewView(stageSize());
      if (!seen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        controller.setView(worldOverviewView(stageSize()));
        setIntro(true);
        void controller.flyTo(target, 3400, () => setIntro(false));
      } else controller.jumpTo(target);
    }
    setViewport(ready.getViewport());
    try { sessionStorage.setItem(INTRO_KEY, "1"); } catch { /* Optional storage. */ }
  }

  function fly(target: MapView, duration: number) {
    if (departing.current) return;
    manualInput();
    void camera?.flyTo(target, reducedMotion ? 0 : duration);
  }
  function control(action: "in" | "out" | "world" | "vietnam") {
    if (!scene) return;
    const target = action === "world" ? worldOverviewView(stageSize()) : action === "vietnam" ? vietnamOverviewView(stageSize()) : zoomView(scene.getView(), action === "in" ? 1 : -1);
    fly(target, action === "in" || action === "out" ? 250 : 1000);
  }

  return <div className="globe-stage" data-testid="geographic-map" ref={stageRef}>
    <div className="globe-map" data-testid="globe-map" data-ready={Boolean(scene)} data-province-areas="loading">
      <CinematicGlobeCanvas className="globe-map" initialView={initialView} assets={ASSETS} highlightUrl="/maps/vietnam-tabletop.geojson" presentation="homepage"
        onReady={onSceneReady}
        onBoundariesStatus={setBoundaryStatus}
        onProvinceBoundariesStatus={setProvinceStatus}
        onProvinceSourceChange={setProvinceSource}
        onError={() => { setRuntime(null); setViewport(null); setIntro(false); callbacks.current.onReadyChange(false); }} />
    </div>
    {scene && viewport && <GlobeMarkers key={`${props.restoreRequest}:${props.cameraRequest?.journeyId ?? ""}:${props.journeyStop?.id ?? ""}:${props.events.map(event => event.slug).join("|")}`}
      viewport={viewport} stageRef={stageRef} events={props.events} selectedEvent={props.selectedEvent} labels={labels} stop={props.journeyStop}
      entityLabel={props.readingMode === "places" ? { one: "địa danh", many: "địa danh", regionLabel: "Các địa danh tại khu vực", closeLabel: "Đóng nhóm địa danh" } : undefined}
      onSelect={props.onSelect} onReadStop={props.onReadStop} onFocusCluster={(request) => {
        if (departing.current || !camera) return Promise.resolve("cancelled");
        const fit = fitClusterView(stageSize(), request);
        if (!fit) return Promise.resolve("cancelled");
        manualInput();
        return camera.flyTo(fit.view, reducedMotion ? 0 : 500);
      }} />}
    {scene && viewport && props.localitySelection && (
      <LocalityMapMarkers
        viewport={viewport}
        selectedCode={props.localitySelection.selectedCode}
        onSelect={props.localitySelection.onSelect}
      />
    )}
    {props.readingMode !== "people" && props.readingMode !== "places" && props.readingMode !== "locality" && intro && !props.view && !props.selectedEvent && !props.journeyStop && props.restoreRequest === 0 && !reducedMotion && <button type="button" className="globe-skip" onClick={() => {
      manualInput(); camera?.jumpTo(vietnamOverviewView(stageSize()));
      stageRef.current?.querySelector("canvas")?.focus({ preventScroll: true });
    }}>Bỏ qua chuyển cảnh</button>}
    <div className="home-map-tools" role="group" aria-label="Điều khiển địa cầu">
      <button type="button" onClick={() => control("world")} disabled={!scene}><Globe2 size={16} aria-hidden="true" />Toàn cầu</button>
      <button type="button" onClick={() => control("vietnam")} disabled={!scene}><LocateFixed size={16} aria-hidden="true" />Về Việt Nam</button>
      <button type="button" onClick={() => control("out")} disabled={!scene} aria-label="Thu nhỏ bản đồ"><Minus size={18} aria-hidden="true" /></button>
      <button type="button" onClick={() => control("in")} disabled={!scene} aria-label="Phóng to bản đồ"><Plus size={18} aria-hidden="true" /></button>
    </div>
    <details className="globe-attribution"><summary>Nguồn bản đồ</summary>
      <p>Natural Earth · Đường biên giới đất liền hiện đại, khái quát theo Natural Earth; không tái dựng biên giới theo năm đang chọn. Một số đường có phân loại chưa chắc chắn trong nguồn được lược bỏ.{boundaryStatus === "unavailable" && " (Lớp biên giới quốc tế tùy chọn hiện không khả dụng.)"}</p>
      <a href="https://www.naturalearthdata.com/about/terms-of-use/" target="_blank" rel="noreferrer">Dữ liệu địa lý</a> · <a href="/maps/vietnam-tabletop.provenance.json" target="_blank" rel="noreferrer">Phạm vi Việt Nam</a> · <a href="/maps/history-country-boundaries.provenance.json" target="_blank" rel="noreferrer">Ranh giới quốc tế &amp; phân loại</a>
      <p>Ranh giới 34 tỉnh/thành hiện nay là lớp tham chiếu địa lý; không mô tả địa giới tại thời điểm sự kiện.{provinceStatus === "unavailable" && " (Lớp ranh giới tỉnh/thành tùy chọn hiện không khả dụng.)"}</p>
      {provinceSource && <p>Nguồn đường tham chiếu: <time dateTime={provinceSource.sourceTimestamp}>{new Date(provinceSource.sourceTimestamp).toISOString().replace("T", " ").replace(".000Z", " UTC")}</time> · {provinceSource.license.attribution} · <a href={provinceSource.license.url} target="_blank" rel="noreferrer">{provinceSource.license.id}</a> · <a href="/maps/history-vietnam-province-boundaries.provenance.json" target="_blank" rel="noreferrer">Provenance đường</a></p>}
      <p>Bề mặt tỉnh/thành nâng lên khi chọn là lớp diện tích tham chiếu hiện đại (VN-34-2025), tách biệt đường nội thất dùng chung. © OpenStreetMap contributors · ODbL-1.0 · <a href="/maps/history-vietnam-province-areas.provenance.json" target="_blank" rel="noreferrer">Provenance diện tích</a></p>
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap (ODbL)</a> · <a href="/maps/history-vietnam-province-boundaries.provenance.json" target="_blank" rel="noreferrer">Nguồn và xử lý ranh giới tỉnh/thành</a> · <a href="/maps/history-vietnam-province-boundaries.geojson" target="_blank" rel="noreferrer">Dữ liệu đường tham chiếu</a>
      <p><a href="https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-202-2025-qh15-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-119250612174148722.htm" target="_blank" rel="noreferrer">Nghị quyết 202/2025/QH15</a> · <a href="https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/19ttg.signed.pdf" target="_blank" rel="noreferrer">QĐ 19/2025/QĐ-TTg</a></p>
      <p>Ảnh bề mặt: Solar System Scope / INOVE, CC BY 4.0; thu nhỏ và chuyển định dạng. Ảnh toàn cầu không thể hiện chi tiết đường phố.</p>
      <a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">Nguồn ảnh</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">Giấy phép</a> · <a href="/maps/globe/assets.provenance.json" target="_blank" rel="noreferrer">Xử lý và độ phân giải</a>
    </details>
  </div>;
}
