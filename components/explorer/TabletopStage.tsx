"use client";

import {
  Compass,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCw,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { TabletopRuntime, TabletopRuntimeStats } from "@/components/explorer/runtime";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type {
  CameraView,
  MapFootprint,
  MarkerAnchor,
  ProjectedAnchor,
} from "@/lib/explorer/types";
import { cn } from "@/lib/utils/cn";

export type TabletopPhase = "loading" | "ready" | "unsupported" | "error";

export type TabletopDebugHandle = {
  getView: () => CameraView;
  setView: (view: CameraView) => void;
  zoom: (factor: number) => void;
  rotate: (deltaAzimuth: number, deltaPolar: number) => void;
  reset: () => void;
  resize: () => void;
  getStats: () => TabletopRuntimeStats | null;
  simulateContextLoss: () => void;
};

declare global {
  interface Window {
    __tabletop?: TabletopDebugHandle;
  }
}

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export type TabletopStageProps = {
  anchors?: readonly MarkerAnchor[];
  initialView?: CameraView | null;
  onViewChange?: (view: CameraView) => void;
  onLayout?: (anchors: ProjectedAnchor[]) => void;
  className?: string;
};

export function TabletopStage({
  anchors = [],
  initialView = null,
  onViewChange,
  onLayout,
  className,
}: TabletopStageProps) {
  const reducedMotion = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<TabletopRuntime | null>(null);
  const anchorsRef = useRef<readonly MarkerAnchor[]>(anchors);
  const initialViewRef = useRef<CameraView | null>(initialView);
  const onViewChangeRef = useRef(onViewChange);
  const onLayoutRef = useRef(onLayout);

  const [phase, setPhase] = useState<TabletopPhase>("loading");
  const [attempt, setAttempt] = useState(0);
  const [viewSummary, setViewSummary] = useState<CameraView | null>(initialView);

  useEffect(() => {
    anchorsRef.current = anchors;
    runtimeRef.current?.setAnchors(anchors);
  }, [anchors]);

  useEffect(() => {
    onViewChangeRef.current = onViewChange;
  }, [onViewChange]);

  useEffect(() => {
    onLayoutRef.current = onLayout;
  }, [onLayout]);

  useEffect(() => {
    let cancelled = false;

    const cleanupRuntime = () => {
      if (runtimeRef.current) {
        runtimeRef.current.dispose();
        runtimeRef.current = null;
      }
      if (typeof window !== "undefined" && window.__tabletop) {
        delete window.__tabletop;
      }
    };

    async function init() {
      cleanupRuntime();

      if (!webglAvailable()) {
        if (!cancelled) {
          setPhase("unsupported");
        }
        return;
      }

      if (!cancelled) {
        setPhase("loading");
      }

      try {
        const [footprintRes, runtimeMod] = await Promise.all([
          fetch("/maps/vietnam-tabletop.geojson"),
          import("@/components/explorer/runtime"),
        ]);

        if (cancelled) return;
        if (!footprintRes.ok) {
          throw new Error(`Không tải được dữ liệu bản đồ (${footprintRes.status})`);
        }

        const footprint = (await footprintRes.json()) as MapFootprint;
        if (cancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error("Không tìm thấy phần tử canvas cho sa bàn.");
        }

        const runtime = await runtimeMod.createTabletopRuntime({
          canvas,
          footprint,
          reducedMotion,
          onViewChange: (view) => {
            if (cancelled) return;
            setViewSummary(view);
            onViewChangeRef.current?.(view);
          },
          onLayout: (projected) => {
            if (cancelled) return;
            onLayoutRef.current?.(projected);
          },
          onContextLost: () => {
            if (cancelled) return;
            cleanupRuntime();
            setPhase("error");
          },
        });

        if (cancelled) {
          runtime.dispose();
          return;
        }

        runtimeRef.current = runtime;
        runtime.setAnchors(anchorsRef.current);
        if (initialViewRef.current) {
          runtime.setView(initialViewRef.current);
        }
        setViewSummary(runtime.getView());
        setPhase("ready");

        window.__tabletop = {
          getView: () => runtime.getView(),
          setView: (v) => runtime.setView(v),
          zoom: (f) => runtime.zoom(f),
          rotate: (da, dp) => runtime.rotate(da, dp),
          reset: () => runtime.reset(),
          resize: () => runtime.resize(),
          getStats: () => runtime.getStats?.() ?? null,
          simulateContextLoss: () => runtime.simulateContextLoss?.(),
        };
      } catch {
        if (!cancelled) {
          cleanupRuntime();
          setPhase("error");
        }
      }
    }

    void init();

    return () => {
      cancelled = true;
      cleanupRuntime();
    };
  }, [attempt, reducedMotion]);

  useEffect(() => {
    const element = stageRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        runtimeRef.current?.setVisible(entry.isIntersecting);
      },
      { rootMargin: "120px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleZoomIn = useCallback(() => {
    runtimeRef.current?.zoom(0.8);
  }, []);

  const handleZoomOut = useCallback(() => {
    runtimeRef.current?.zoom(1.25);
  }, []);

  const handleRotateLeft = useCallback(() => {
    runtimeRef.current?.rotate(-0.22, 0);
  }, []);

  const handleRotateRight = useCallback(() => {
    runtimeRef.current?.rotate(0.22, 0);
  }, []);

  const handleTiltUp = useCallback(() => {
    runtimeRef.current?.rotate(0, -0.14);
  }, []);

  const handleTiltDown = useCallback(() => {
    runtimeRef.current?.rotate(0, 0.14);
  }, []);

  const handleReset = useCallback(() => {
    runtimeRef.current?.reset();
  }, []);

  const handleRetry = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (phase !== "ready") return;
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          handleRotateLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          handleRotateRight();
          break;
        case "ArrowUp":
          event.preventDefault();
          handleTiltUp();
          break;
        case "ArrowDown":
          event.preventDefault();
          handleTiltDown();
          break;
        case "+":
        case "=":
          event.preventDefault();
          handleZoomIn();
          break;
        case "-":
        case "_":
          event.preventDefault();
          handleZoomOut();
          break;
        case "0":
        case "r":
        case "R":
        case "Home":
          event.preventDefault();
          handleReset();
          break;
      }
    },
    [
      phase,
      handleRotateLeft,
      handleRotateRight,
      handleTiltUp,
      handleTiltDown,
      handleZoomIn,
      handleZoomOut,
      handleReset,
    ],
  );

  const ready = phase === "ready";

  return (
    <div
      ref={stageRef}
      role="region"
      aria-label="Sa bàn Việt Nam 3D. Kéo chuột trái để xoay, cuộn để phóng to/thu nhỏ, kéo chuột phải để dịch chuyển, hoặc dùng các nút điều khiển và phím mũi tên."
      data-testid="tabletop-stage"
      data-phase={phase}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      className={cn(
        "relative isolate flex min-h-[440px] w-full flex-col overflow-hidden rounded-lg border border-border bg-[#132232] text-white shadow-md",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        tabIndex={ready ? 0 : -1}
        onKeyDown={handleKeyDown}
        aria-label="Khung tương tác sa bàn 3D Việt Nam (nhấn phím mũi tên để xoay, + hoặc - để thu phóng, 0 để đặt lại góc nhìn)"
        data-testid="tabletop-canvas"
        className={cn(
          "h-full min-h-[440px] w-full flex-1 cursor-grab outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset active:cursor-grabbing",
          !ready && "invisible",
        )}
      />

      {/* Top-left orientation & provenance badge */}
      <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[calc(100%-325px)] flex-col gap-1 rounded-md border border-white/15 bg-[#0e1a27]/85 px-3 py-2 text-xs text-white/90 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 font-semibold text-[#f3dfb6]">
          <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>Sa bàn lãnh thổ Việt Nam (đất liền, Phú Quốc, Côn Đảo, Hoàng Sa, Trường Sa)</span>
        </div>
        <p className="text-[11px] leading-snug text-white/75">
          Độ dày đế nổi (Y = 0–3) mang tính minh họa trực quan. Nguồn ranh giới: Natural Earth 1:10m (v5.1.2).
        </p>
      </div>

      {/* Top-right accessible camera controls */}
      <div
        role="toolbar"
        aria-label="Điều khiển góc nhìn sa bàn 3D"
        className="absolute right-3 top-3 z-20 flex flex-wrap items-center gap-1 rounded-md border border-white/20 bg-[#0e1a27]/90 p-1.5 shadow-sm backdrop-blur-xs"
      >
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={!ready}
          aria-label="Phóng to sa bàn"
          title="Phóng to (+)"
          data-testid="tabletop-zoom-in"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={!ready}
          aria-label="Thu nhỏ sa bàn"
          title="Thu nhỏ (-)"
          data-testid="tabletop-zoom-out"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleRotateLeft}
          disabled={!ready}
          aria-label="Xoay trái sa bàn"
          title="Xoay trái (←)"
          data-testid="tabletop-rotate-left"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleRotateRight}
          disabled={!ready}
          aria-label="Xoay phải sa bàn"
          title="Xoay phải (→)"
          data-testid="tabletop-rotate-right"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCw className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleTiltUp}
          disabled={!ready}
          aria-label="Nghiêng lên"
          title="Nghiêng lên (↑)"
          data-testid="tabletop-tilt-up"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleTiltDown}
          disabled={!ready}
          aria-label="Nghiêng xuống"
          title="Nghiêng xuống (↓)"
          data-testid="tabletop-tilt-down"
          className="flex h-8 w-8 items-center justify-center rounded-sm text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={!ready}
          aria-label="Đặt lại góc nhìn mặc định"
          title="Đặt lại góc nhìn (0)"
          data-testid="tabletop-reset"
          className="flex h-8 items-center gap-1 rounded-sm px-2 text-xs font-medium text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Bottom status bar showing current camera distance & polar angle */}
      {ready && viewSummary && (
        <div
          data-testid="tabletop-view-readout"
          className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap items-center gap-3 rounded-md border border-white/15 bg-[#0e1a27]/85 px-3 py-1.5 font-mono text-[11px] text-white/85"
        >
          <span>Góc xoay: {Math.round((viewSummary.azimuth * 180) / Math.PI)}°</span>
          <span>Góc nghiêng: {Math.round((viewSummary.polar * 180) / Math.PI)}°</span>
          <span>Khoảng cách: {Math.round(viewSummary.distance)}</span>
        </div>
      )}

      {/* Non-ready overlays: loading, unsupported WebGL, or runtime/context error */}
      {phase === "loading" && (
        <div
          role="status"
          data-testid="tabletop-loading"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#132232]/95 p-6 text-center"
        >
          <Layers className="h-8 w-8 animate-pulse text-[#f3dfb6]" aria-hidden="true" />
          <p className="font-serif text-lg font-semibold text-white">Đang khởi tạo sa bàn Việt Nam 3D…</p>
          <p className="max-w-md text-xs text-white/75">
            Danh sách sự kiện lịch sử bên cạnh luôn sẵn sàng để tra cứu trực tiếp.
          </p>
        </div>
      )}

      {phase === "unsupported" && (
        <div
          role="status"
          data-testid="tabletop-unsupported"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#132232] p-6 text-center"
        >
          <AlertTriangle className="h-8 w-8 text-[#f3dfb6]" aria-hidden="true" />
          <h2 className="font-serif text-lg font-bold text-white">
            Trình duyệt hoặc thiết bị hiện không hỗ trợ đồ họa 3D (WebGL)
          </h2>
          <p className="max-w-md text-sm text-white/85">
            Bạn vẫn có thể đọc toàn bộ niên đại, địa điểm, độ chính xác tọa độ và mở trang chi tiết của từng sự kiện trong danh sách văn bản bên cạnh.
          </p>
        </div>
      )}

      {phase === "error" && (
        <div
          role="alert"
          data-testid="tabletop-error"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#132232] p-6 text-center"
        >
          <AlertTriangle className="h-8 w-8 text-amber-300" aria-hidden="true" />
          <h2 className="font-serif text-lg font-bold text-white">
            Sa bàn 3D tạm dừng do gián đoạn ngữ cảnh đồ họa hoặc kết nối
          </h2>
          <p className="max-w-md text-sm text-white/85">
            Danh sách sự kiện lịch sử bên cạnh vẫn hoạt động bình thường. Bạn có thể bấm nút bên dưới để khôi phục sa bàn 3D.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            data-testid="tabletop-retry"
            className="inline-flex items-center gap-2 rounded-md border border-[#f3dfb6]/50 bg-[#f3dfb6] px-4 py-2 text-xs font-semibold text-[#132232] transition-colors hover:bg-[#f3dfb6]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            <span>Thử tải lại sa bàn 3D</span>
          </button>
        </div>
      )}
    </div>
  );
}
