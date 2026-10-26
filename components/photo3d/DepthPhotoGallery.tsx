"use client";

import { Box, ExternalLink, Info, Maximize2, Minimize2, MousePointer2, Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createDepthRenderer, sampleDepths, type DepthRenderer } from "@/components/photo3d/depth-renderer";
import { ScanViewer } from "@/components/photo3d/ScanViewer";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { LessonImage, LessonScan3D } from "@/lib/lessons/types";
import { clamp, FOCUS_DEPTH, projectPoint, tiltFromPointer, ZOOM_STEPS, type Vec2 } from "@/lib/photo3d/parallax";
import { cn } from "@/lib/utils/cn";

export type DepthPhotoItem = {
  id: string;
  title: string;
  /** Lời giải thích chung (hiện khi chưa chọn điểm chú thích nào). */
  text?: string;
  /** Ảnh chụp thật (xem dạng có chiều sâu); có thể thiếu nếu chỉ có mô hình quét. */
  image?: LessonImage;
  /** Mô hình quét 3D xoay 360° (Sketchfab). */
  scan?: LessonScan3D;
};

type PhotoItem = DepthPhotoItem & { image: LessonImage };

type Phase = "idle" | "loading" | "ready" | "unsupported";

const CENTER: Vec2 = { x: 0.5, y: 0.5 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Không tải được ${src}`));
    image.src = src;
  });
}

function Credit({ image }: { image: LessonImage }) {
  return (
    <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
      {image.credit}
    </a>
  );
}

/**
 * Một khung "ảnh thật có chiều sâu": ban đầu là ảnh tĩnh; bấm "Xem ảnh 3D" thì dựng WebGL,
 * rê/kéo để nghiêng nhìn, phóng to, các điểm chú thích đánh số di chuyển theo đúng lớp sâu.
 */
function DepthPhotoStageVisual({
  item,
  autoStart,
  onStarted,
  selected,
  onSelectHotspot,
}: {
  item: PhotoItem;
  autoStart: boolean;
  onStarted: () => void;
  selected: number | null;
  onSelectHotspot: (index: number) => void;
}) {
  const { image } = item;
  const hotspots = useMemo(() => image.hotspots ?? [], [image.hotspots]);
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [zoomIndex, setZoomIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rendererRef = useRef<DepthRenderer | null>(null);
  const depthsRef = useRef<number[]>(hotspots.map(() => FOCUS_DEPTH));
  const motion = useRef({ tilt: { x: 0, y: 0 }, target: { x: 0, y: 0 }, pointer: { x: 0.5, y: 0.5 }, lastInput: 0, zoom: 1, center: CENTER });

  const zoom = ZOOM_STEPS[zoomIndex];
  useEffect(() => {
    motion.current.zoom = zoom;
  }, [zoom]);

  const placeMarkers = useCallback(() => {
    const { tilt, zoom: z, center } = motion.current;
    hotspots.forEach((hotspot, index) => {
      const element = markerRefs.current[index];
      if (!element) return;
      const at = projectPoint({ x: hotspot.x / 100, y: hotspot.y / 100 }, depthsRef.current[index], tilt, z, center);
      const visible = at.x > 0.02 && at.x < 0.98 && at.y > 0.02 && at.y < 0.98;
      element.style.left = `${at.x * 100}%`;
      element.style.top = `${at.y * 100}%`;
      element.style.visibility = visible ? "visible" : "hidden";
    });
  }, [hotspots]);

  const start = useCallback(async () => {
    if (phase !== "idle") return;
    onStarted();
    setPhase("loading");
    try {
      const [photo, depth] = await Promise.all([loadImage(image.src), loadImage(image.depthSrc ?? image.src)]);
      depthsRef.current = sampleDepths(depth, hotspots.map((h) => ({ x: h.x / 100, y: h.y / 100 })));
      const renderer = canvasRef.current ? createDepthRenderer(canvasRef.current, photo, depth) : null;
      if (!renderer) {
        setPhase("unsupported");
        return;
      }
      rendererRef.current = renderer;
      setPhase("ready");
      renderer.draw({ x: 0, y: 0 }, 1, CENTER);
      placeMarkers();
    } catch {
      setPhase("unsupported");
    }
  }, [hotspots, image.depthSrc, image.src, onStarted, phase, placeMarkers]);

  useEffect(() => {
    if (!autoStart) return;
    const id = requestAnimationFrame(() => void start());
    return () => cancelAnimationFrame(id);
  }, [autoStart, start]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (phase !== "ready") return;
    let frameId = 0;
    const tick = () => {
      const m = motion.current;
      m.tilt = {
        x: m.tilt.x + (m.target.x - m.tilt.x) * (reducedMotion ? 1 : 0.1),
        y: m.tilt.y + (m.target.y - m.tilt.y) * (reducedMotion ? 1 : 0.1),
      };
      rendererRef.current?.draw(m.tilt, m.zoom, m.center);
      placeMarkers();
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [phase, placeMarkers, reducedMotion]);

  useEffect(() => {
    return () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, []);

  function onPointer(event: React.PointerEvent<HTMLDivElement>) {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const pointer = {
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.height) / rect.height, 0, 1),
    };
    const m = motion.current;
    m.pointer = pointer;
    m.target = tiltFromPointer(pointer);
    m.lastInput = performance.now();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const m = motion.current;
    const step = 0.25;
    const moves: Record<string, Vec2> = {
      ArrowUp: { x: 0, y: step },
      ArrowDown: { x: 0, y: -step },
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
    };
    const move = moves[event.key];
    if (move) {
      event.preventDefault();
      m.target = { x: clamp(m.target.x + move.x, -1, 1), y: clamp(m.target.y + move.y, -1, 1) };
      m.pointer = { x: 0.5 + m.target.x / 2, y: 0.5 + m.target.y / 2 };
      m.lastInput = performance.now();
    } else if (event.key === "+" || event.key === "=") {
      setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1));
    } else if (event.key === "-") {
      setZoomIndex((i) => Math.max(0, i - 1));
    }
  }

  function resetView() {
    const m = motion.current;
    m.target = { x: 0, y: 0 };
    m.pointer = { x: 0.5, y: 0.5 };
    m.lastInput = performance.now();
    setZoomIndex(0);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await frameRef.current?.requestFullscreen?.().catch(() => undefined);
  }

  const ready = phase === "ready";
  const aspect = image.width && image.height ? `${image.width} / ${image.height}` : "4 / 3";

  return (
    <div ref={frameRef} className={cn("relative [perspective:1200px]", fullscreen && "flex items-center justify-center bg-black")}>
      <div
        ref={stageRef}
        role="group"
        tabIndex={ready ? 0 : -1}
        aria-label={`Ảnh 3D: ${item.title}. ${image.alt}. Rê chuột hoặc dùng phím mũi tên để nghiêng nhìn, phím + và − để phóng to.`}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        onKeyDown={onKeyDown}
        className={cn(
          "relative isolate mx-auto w-full touch-pan-y overflow-hidden rounded-card border border-border bg-black shadow-card transition-transform duration-75 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          fullscreen ? "max-h-full max-w-full rounded-none border-0" : "max-h-[min(72vh,40rem)]",
        )}
        style={{ aspectRatio: aspect, maxWidth: fullscreen ? undefined : `calc(min(72vh, 40rem) * ${image.width ?? 4} / ${image.height ?? 3})` }}
        data-testid="photo3d-stage"
        data-phase={phase}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className={cn("absolute inset-0 h-full w-full object-cover", ready && "invisible")} loading="lazy" />
        <canvas ref={canvasRef} className={cn("absolute inset-0 h-full w-full", !ready && "invisible")} aria-hidden="true" data-testid="photo3d-canvas" />

        {hotspots.map((hotspot, index) => (
          <button
            key={hotspot.label}
            ref={(element) => {
              markerRefs.current[index] = element;
            }}
            type="button"
            onClick={() => onSelectHotspot(index)}
            aria-label={`Chi tiết ${index + 1}: ${hotspot.label}`}
            aria-pressed={selected === index}
            className={cn(
              "absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              selected === index ? "bg-gold text-black" : "bg-accent text-white hover:bg-accent/90",
            )}
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
            data-testid="photo3d-hotspot"
          >
            {index + 1}
          </button>
        ))}

        {phase !== "ready" && (
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-10 text-center text-white">
            {phase === "idle" && (
              <Button onClick={() => void start()} data-testid="photo3d-start">
                <Play className="h-4 w-4" aria-hidden="true" />
                Xem ảnh 3D
              </Button>
            )}
            {phase === "loading" && (
              <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm">
                <Box className="h-4 w-4" aria-hidden="true" />
                Đang dựng ảnh 3D…
              </p>
            )}
            {phase === "unsupported" && (
              <p role="alert" className="text-sm">
                Thiết bị này không hiển thị được ảnh 3D (WebGL). Ảnh thật và các chú thích vẫn xem được bình thường.
              </p>
            )}
          </div>
        )}

        {ready && (
          <>
            <div className="absolute right-2 top-2 z-20 flex gap-1 text-white">
              <button type="button" onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))} disabled={zoomIndex === ZOOM_STEPS.length - 1} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 hover:bg-black/75 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label="Phóng to">
                <ZoomIn className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setZoomIndex((i) => Math.max(0, i - 1))} disabled={zoomIndex === 0} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 hover:bg-black/75 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label="Thu nhỏ">
                <ZoomOut className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={resetView} className="flex h-9 items-center gap-1 rounded-full bg-black/55 px-3 text-xs hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label="Về góc nhìn ban đầu">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Góc ban đầu</span>
              </button>
              <button type="button" onClick={() => void toggleFullscreen()} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/55 hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold" aria-label={fullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}>
                {fullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
            <p className="pointer-events-none absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded bg-black/55 px-2 py-1 text-[11px] text-white/85" aria-hidden="true">
              <MousePointer2 className="h-3 w-3" />
              Rê chuột (hoặc kéo) để nghiêng nhìn
              {zoom > 1 && ` · phóng ${zoom}×`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/** Một mục: mô hình quét 360° và/hoặc ảnh thật có chiều sâu; bố cục 2 pane. */
function ExhibitPanel({
  item,
  autoStart,
  onStarted,
}: {
  item: DepthPhotoItem;
  autoStart: boolean;
  onStarted: () => void;
}) {
  const [mode, setMode] = useState<"scan" | "photo">(item.scan ? "scan" : "photo");
  const [selectedHotspotIndex, setSelectedHotspotIndex] = useState<number | null>(null);
  const both = Boolean(item.scan && item.image);

  const hotspots = useMemo(() => item.image?.hotspots ?? [], [item.image?.hotspots]);
  const selectedHotspot = selectedHotspotIndex === null ? null : hotspots[selectedHotspotIndex];

  return (
    <>
      {/* Stage (Left column on desktop, order-2 on mobile) */}
      <div className="order-2 min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-2">
        {mode === "scan" && item.scan ? (
          <ScanViewer scan={item.scan} onStarted={onStarted} showCredit={false} />
        ) : item.image ? (
          <DepthPhotoStageVisual
            item={item as PhotoItem}
            autoStart={autoStart}
            onStarted={onStarted}
            selected={selectedHotspotIndex}
            onSelectHotspot={setSelectedHotspotIndex}
          />
        ) : null}
      </div>

      {/* Details (Right column below picker on desktop, order-3 on mobile) */}
      <div className="order-3 flex flex-col gap-3 lg:col-start-2 lg:row-start-2">
        {both && (
          <div role="group" aria-label="Cách xem" className="flex flex-wrap gap-2">
            {(
              [
                ["scan", "Xoay 360° (mô hình quét)"],
                ["photo", "Ảnh chụp thật (3D chiều sâu)"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={mode === value}
                onClick={() => setMode(value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  mode === value ? "border-foreground bg-foreground text-background" : "border-border bg-surface text-foreground hover:bg-muted",
                )}
                data-testid={`exhibit-mode-${value}`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {mode === "scan" && item.scan ? (
          <>
            {item.text && (
              <p className="flex items-start gap-1.5 rounded-card border border-border bg-muted p-3 text-sm text-surface-foreground" data-testid="photo3d-text">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                {item.text}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Mô hình 3D:{" "}
              <a href={`https://sketchfab.com/3d-models/${item.scan.sketchfabId}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {item.scan.title}
              </a>{" "}
              — tác giả{" "}
              <a href={item.scan.authorUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                {item.scan.author}
              </a>
              , đăng trên Sketchfab. {item.scan.note}{" "}
              <a href={`https://sketchfab.com/3d-models/${item.scan.sketchfabId}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 font-medium text-accent hover:underline">
                Mở trang gốc
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">(mở tab mới)</span>
              </a>
            </p>
          </>
        ) : item.image ? (
          <>
            {hotspots.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label={`Các chi tiết trong ảnh ${item.title}`}>
                {hotspots.map((hotspot, index) => (
                  <li key={hotspot.label}>
                    <button
                      type="button"
                      onClick={() => setSelectedHotspotIndex(index)}
                      aria-pressed={selectedHotspotIndex === index}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                        selectedHotspotIndex === index ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface text-foreground hover:bg-muted",
                      )}
                    >
                      <span className="text-xs font-bold opacity-70">{index + 1}</span>
                      {hotspot.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div aria-live="polite" className="min-h-[3.25rem] rounded-card border border-border bg-muted p-3 text-sm" data-testid="photo3d-text">
              {selectedHotspot ? (
                <>
                  <p className="font-serif font-bold text-foreground">{selectedHotspot.label}</p>
                  <p className="mt-1 text-surface-foreground">{selectedHotspot.text}</p>
                </>
              ) : (
                <p className="flex items-start gap-1.5 text-surface-foreground">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  {item.text ?? item.image.caption}
                </p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Ảnh: {item.image.caption} (<Credit image={item.image} />). Chiều sâu 3D do máy tính ước lượng từ chính ảnh chụp này; điểm ảnh là ảnh thật, không vẽ thêm.
            </p>
          </>
        ) : null}
      </div>
    </>
  );
}

/** Nhiều ảnh 3D cùng chủ đề, chọn bằng thẻ; bố cục 2 pane (Stage trái, Picker + Details phải). */
export function DepthPhotoGallery({ items, label }: { items: DepthPhotoItem[]; label: string }) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const item = items[index];
  const onStarted = useCallback(() => setStarted(true), []);
  if (!item) return null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % items.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index + items.length - 1) % items.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    }
    if (next !== -1) {
      event.preventDefault();
      setIndex(next);
      document.getElementById(`photo3d-tab-${items[next].id}`)?.focus();
    }
  };

  return (
    <div
      id={`photo3d-panel-${items[0].id}`}
      role={items.length > 1 ? "tabpanel" : undefined}
      aria-labelledby={items.length > 1 ? `photo3d-tab-${item.id}` : undefined}
      className="flex flex-col gap-4 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-6"
    >
      {/* Picker: Right column top on desktop, order-1 on mobile. Persistent across item changes! */}
      {items.length > 1 && (
        <div className="order-1 lg:col-start-2 lg:row-start-1">
          <div
            role="tablist"
            aria-label={label}
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="flex flex-wrap gap-2 lg:flex-col lg:flex-nowrap lg:overflow-x-hidden lg:overflow-y-auto lg:max-h-[min(65vh,36rem)] lg:gap-2"
          >
            {items.map((entry, i) => {
              const thumbSrc = entry.image?.src ?? entry.scan?.poster;
              return (
                <button
                  key={entry.id}
                  id={`photo3d-tab-${entry.id}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-controls={`photo3d-panel-${items[0].id}`}
                  tabIndex={i === index ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-card border p-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto lg:w-full",
                    i === index
                      ? "border-accent bg-accent/10 text-foreground ring-1 ring-accent"
                      : "border-border bg-surface text-foreground hover:bg-muted"
                  )}
                  data-testid="photo3d-tab"
                >
                  {thumbSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbSrc}
                      alt=""
                      loading="lazy"
                      className="h-12 w-16 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded bg-muted text-accent" aria-hidden="true">
                      <Box className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1 font-medium text-sm leading-snug text-foreground">
                    {entry.title}
                  </span>
                  {entry.scan && (
                    <span className="shrink-0 rounded bg-black/15 dark:bg-white/15 px-1.5 py-0.5 text-[11px] font-bold">
                      360°
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Exhibit Panel (Stage on left, Details on right under picker) */}
      <ExhibitPanel
        key={item.id}
        item={item}
        autoStart={started}
        onStarted={onStarted}
      />
    </div>
  );
}
