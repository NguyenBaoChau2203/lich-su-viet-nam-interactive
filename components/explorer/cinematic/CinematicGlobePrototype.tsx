"use client";

import { Globe2, LocateFixed, Minus, Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CinematicGlobeCanvas } from "@/components/explorer/cinematic/CinematicGlobeCanvas";
import { CinematicGlobeMarkers } from "@/components/explorer/cinematic/CinematicGlobeMarkers";
import {
  MAX_ZOOM,
  panView,
  vietnamOverviewView,
  worldOverviewView,
} from "@/lib/explorer/cinematic/camera";
import type { CinematicAssets, CinematicScene } from "@/lib/explorer/cinematic/scene";
import type { MapView } from "@/lib/explorer/map-view";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { ExplorerEvent } from "@/lib/explorer/types";
import type { CuratedPlaceLabel } from "@/lib/explorer/cinematic/overlays";
import type { JourneyStop } from "@/lib/explorer/journey";

/** The preview may zoom past the production cap so the owner can judge texture blur honestly. */
const PREVIEW_MAX_ZOOM = Math.min(MAX_ZOOM, 8);
const PREVIEW_MIN_ZOOM = 0.8;
const NO_EVENTS: readonly ExplorerEvent[] = [];
const NO_LABELS: readonly CuratedPlaceLabel[] = [];

type Props = {
  assets: CinematicAssets;
  highlightUrl: string;
  /** Serialized `ban-do` view to open at; defaults to the Vietnam overview for the current stage size. */
  initialView?: MapView | null;
  onSceneReady?: (scene: CinematicScene) => void;
  events?: readonly ExplorerEvent[];
  labels?: readonly CuratedPlaceLabel[];
  stop?: JourneyStop | null;
  /** Local preview may link to the separately running public app. */
  detailBaseUrl?: string;
};

/**
 * Preview-only composition scaffold. It reproduces the reference's reading and control regions so camera
 * framing can be judged with the real occupied rectangles. P2 adds public event/curated overlays and a small
 * reader; the masthead, journey CTA and timeline remain composition placeholders for the later shell phase.
 */
export function CinematicGlobePrototype({ assets, highlightUrl, initialView, onSceneReady, events = NO_EVENTS, labels = NO_LABELS, stop = null, detailBaseUrl = "" }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<CinematicScene | null>(null);
  const [scene, setScene] = useState<CinematicScene | null>(null);
  const [reading, setReading] = useState<readonly ExplorerEvent[]>([]);
  const selectedEvent = reading.length === 1 ? reading[0] : null;
  const reducedMotion = usePrefersReducedMotion();
  const [startView] = useState<MapView>(() => {
    if (initialView) return initialView;
    const height = typeof window === "undefined" ? 900 : window.innerHeight;
    return vietnamOverviewView({ width: 1, height });
  });
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);

  const stageViewport = useCallback(() => {
    const rect = stageRef.current?.getBoundingClientRect();
    return { width: rect?.width ?? 1440, height: rect?.height ?? 900 };
  }, []);

  const flyTo = useCallback(
    (target: MapView, duration = 1200) => {
      void sceneRef.current?.flyTo(target, reducedMotion ? 0 : duration);
    },
    [reducedMotion],
  );

  const zoomBy = useCallback(
    (delta: number, instant = false) => {
      const scene = sceneRef.current;
      if (!scene) return;
      const view = scene.getView();
      const zoom = Math.min(PREVIEW_MAX_ZOOM, Math.max(PREVIEW_MIN_ZOOM, view.zoom + delta));
      if (instant) scene.setView({ ...view, zoom });
      else flyTo({ ...view, zoom }, 260);
    },
    [flyTo],
  );

  // Wheel must be a non-passive native listener to prevent page scroll over the globe.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-cg-occupied]")) return;
      event.preventDefault();
      sceneRef.current?.cancelFlight();
      zoomBy(-event.deltaY * 0.0016, true);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  const pan = (dx: number, dy: number) => {
    const scene = sceneRef.current;
    if (!scene) return;
    scene.setView(panView(scene.getView(), dx, dy, stageViewport()));
  };

  return (
    <div className="cg-proto" ref={stageRef} onKeyDown={(event) => {
      if (event.key === "Escape" && reading.length) {
        setReading([]); stageRef.current?.querySelector<HTMLElement>(".cg-input")?.focus();
      }
    }}>
      <CinematicGlobeCanvas
        className="cg-stage"
        initialView={startView}
        assets={assets}
        highlightUrl={highlightUrl}
        onReady={(scene) => {
          sceneRef.current = scene;
          setScene(scene);
          onSceneReady?.(scene);
        }}
        onError={() => { sceneRef.current = null; setScene(null); }}
      />
      <div
        className="cg-input"
        tabIndex={0}
        role="application"
        aria-label="Điều khiển địa cầu: mũi tên để di chuyển, cộng và trừ để phóng to hoặc thu nhỏ."
        onPointerDown={(event) => {
          sceneRef.current?.cancelFlight();
          drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          const active = drag.current;
          if (!active || active.id !== event.pointerId) return;
          pan(event.clientX - active.x, event.clientY - active.y);
          active.x = event.clientX;
          active.y = event.clientY;
        }}
        onPointerUp={(event) => {
          if (drag.current?.id === event.pointerId) drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          const step = 90;
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [step, 0],
            ArrowRight: [-step, 0],
            ArrowUp: [0, step],
            ArrowDown: [0, -step],
          };
          if (moves[event.key]) {
            event.preventDefault();
            pan(...moves[event.key]);
          } else if (event.key === "+" || event.key === "=") zoomBy(0.5, true);
          else if (event.key === "-") zoomBy(-0.5, true);
        }}
      />

      <CinematicGlobeMarkers scene={scene} stageRef={stageRef} events={events} labels={labels}
        selectedEvent={selectedEvent?.slug ?? null} stop={stop} onSelect={setReading} />

      <header className="cg-masthead" aria-hidden="true" data-cg-occupied="">
        <span className="cg-brand">Lịch sử Việt Nam</span>
        <nav className="cg-nav">
          <span className="cg-nav-active">Khám phá</span>
          <span>Hành trình</span>
        </nav>
      </header>

      <section className="cg-intro" aria-label="Giới thiệu" data-cg-occupied="">
        <h1>Lịch sử qua những địa danh</h1>
        <span className="cg-rule" aria-hidden="true" />
        <p>Kéo để di chuyển · Cuộn để phóng to</p>
      </section>

      <aside className="cg-guide" data-cg-occupied="" aria-label="Thông tin trên bản đồ">
        {stop ? <>
          <h2>{stop.title}</h2><p>{stop.date} · {stop.place}</p><p>{stop.summary}</p>
          <p className="cg-accuracy">Vị trí gần đúng. {stop.accuracyNote}</p>
          {stop.sources.map((source) => <p key={source.url}><a href={source.url}>{source.publisher} · {source.title}</a></p>)}
        </> : reading.length ? <>
          <button type="button" className="cg-reader-close" aria-label="Đóng thông tin sự kiện" onClick={() => {
            setReading([]); stageRef.current?.querySelector<HTMLElement>(".cg-input")?.focus();
          }}>×</button>
          {selectedEvent ? <>
            <h2>{selectedEvent.title}</h2><p>{selectedEvent.dateText}</p><p>{selectedEvent.summary}</p>
            {selectedEvent.locations.map((location) => <p className="cg-accuracy" key={location.slug}>
              {location.historicalName || location.name} · {location.accuracyLevel === "exact" ? "Tọa độ chính xác theo nguồn" : "Vị trí gần đúng"}
              {location.accuracyNote ? `. ${location.accuracyNote}` : ""}</p>)}
            <a className="cg-cta" href={`${detailBaseUrl}/su-kien/${selectedEvent.slug}`}>Đọc chi tiết và nguồn</a>
          </> : <><h2>Các sự kiện tại khu vực</h2><ul>{reading.map((event) => <li key={event.slug}>
            <button type="button" onClick={() => setReading([event])}>{event.dateText} · {event.title}</button>
          </li>)}</ul></>}
        </> : <>
        <h2>Khám phá một sự kiện</h2>
        <p>Chọn một điểm trên bản đồ để xem thời gian, địa điểm và câu chuyện lịch sử.</p>
        <span className="cg-rule" />
        <span className="cg-cta">Xem hành trình ›</span>
        </>}
      </aside>

      <div className="cg-scrim" aria-hidden="true" />
      <div className="cg-timeline" aria-hidden="true" data-cg-occupied="">
        <div className="cg-timeline-row">
          <span className="cg-timeline-label">Dòng thời gian</span>
          <span className="cg-select">Từ năm</span>
          <span className="cg-select">Đến năm</span>
          <span className="cg-apply">Áp dụng</span>
        </div>
        <div className="cg-rail">
          {[0, 8, 14, 22, 30, 38, 46, 52, 56, 64, 70, 80, 90, 100].map((left) => (
            <i key={left} style={{ left: `${left}%` }} />
          ))}
        </div>
      </div>

      <div className="cg-tools" role="group" aria-label="Điều khiển địa cầu" data-cg-occupied="">
        <button type="button" onClick={() => flyTo(worldOverviewView(stageViewport()), 1600)}>
          <Globe2 size={16} aria-hidden="true" />
          Toàn cầu
        </button>
        <button type="button" className="cg-tool-active" onClick={() => flyTo(vietnamOverviewView(stageViewport()), 1600)}>
          <LocateFixed size={16} aria-hidden="true" />
          Về Việt Nam
        </button>
        <button type="button" aria-label="Thu nhỏ bản đồ" onClick={() => zoomBy(-1)}>
          <Minus size={18} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Phóng to bản đồ" onClick={() => zoomBy(1)}>
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>

      <details className="cg-event-list" data-cg-occupied="">
        <summary>Danh sách sự kiện ({events.length})</summary>
        <ul>{events.map((event) => <li key={event.slug}>
          <a href={`${detailBaseUrl}/su-kien/${event.slug}`}>{event.dateText} · {event.title}</a>
        </li>)}</ul>
        {!events.length && <p>Chưa có sự kiện để hiển thị.</p>}
      </details>
      <details className="cg-credit" data-cg-occupied="">
        <summary>Nguồn bản đồ</summary>
        <p>
          Ảnh bề mặt: Solar System Scope (CC BY 4.0). Đường viền Việt Nam: Natural Earth, ranh giới hiện đại được khái
          quát; không tái dựng địa giới theo từng năm.
          Nhãn đô thị là điểm định hướng gần đúng. Đường bờ thế giới khái quát ở tỉ lệ 1:50 triệu;
          Việt Nam và các đảo theo lớp 1:10 triệu. Không bổ sung các đảo không có trong dữ liệu nguồn.
        </p>
      </details>
    </div>
  );
}
