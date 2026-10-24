"use client";

import { useEffect, useRef, useState } from "react";
import type { CinematicAssets, CinematicScene, HighlightCollection } from "@/lib/explorer/cinematic/scene";
import type { MapView } from "@/lib/explorer/map-view";

type Props = {
  initialView: MapView;
  assets: CinematicAssets;
  highlightUrl: string;
  coastlinesUrl?: string;
  countryBoundariesUrl?: string;
  provinceBoundariesUrl?: string;
  onReady?: (scene: CinematicScene) => void;
  onBoundariesStatus?: (status: "loading" | "ready" | "unavailable") => void;
  onProvinceBoundariesStatus?: (status: "loading" | "ready" | "unavailable") => void;
  onError?: (error: unknown) => void;
  className?: string;
  presentation?: "prototype" | "homepage";
};

/**
 * Mount boundary for the cinematic scene. The engine (Three.js + three-globe) is loaded with a dynamic
 * import so it never runs on the server and never joins the initial JavaScript of a page that merely
 * renders this component. Owns readiness/error/retry, resizing, visibility pause and disposal.
 */
export function CinematicGlobeCanvas({
  initialView,
  assets,
  highlightUrl,
  coastlinesUrl = "/maps/history-world-land.geojson",
  countryBoundariesUrl = "/maps/history-country-boundaries.geojson",
  provinceBoundariesUrl = "/maps/history-vietnam-province-boundaries.geojson",
  onReady,
  onBoundariesStatus,
  onProvinceBoundariesStatus,
  onError,
  className,
  presentation = "prototype",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [boundariesStatus, setBoundariesStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [provinceStatus, setProvinceStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [attempt, setAttempt] = useState(0);
  const latest = useRef({
    initialView,
    assets,
    highlightUrl,
    coastlinesUrl,
    countryBoundariesUrl,
    provinceBoundariesUrl,
    onReady,
    onBoundariesStatus,
    onProvinceBoundariesStatus,
    onError,
  });
  useEffect(() => {
    latest.current = {
      initialView,
      assets,
      highlightUrl,
      coastlinesUrl,
      countryBoundariesUrl,
      provinceBoundariesUrl,
      onReady,
      onBoundariesStatus,
      onProvinceBoundariesStatus,
      onError,
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const abort = new AbortController();
    let scene: CinematicScene | null = null;
    let observer: ResizeObserver | null = null;
    const onVisibility = () => scene?.setVisible(document.visibilityState === "visible");
    const timer = setTimeout(() => {
      abort.abort(); scene?.dispose();
      setState("error"); latest.current.onError?.(new Error("Globe loading timed out"));
    }, 20_000);

    setBoundariesStatus("loading");
    setProvinceStatus("loading");

    // Optional country boundaries fetch, handled concurrently with core loading
    const boundariesPromise = latest.current.countryBoundariesUrl
      ? fetch(latest.current.countryBoundariesUrl, { signal: abort.signal })
          .then(async (res) => {
            if (!res.ok) return null;
            const json = await res.json();
            const { parseCountryBoundaries } = await import("@/lib/explorer/cinematic/country-boundaries");
            return parseCountryBoundaries(json);
          })
          .catch(() => null)
      : Promise.resolve(null);

    // Optional province boundaries fetch, handled concurrently with core loading
    const provincePromise = latest.current.provinceBoundariesUrl
      ? fetch(latest.current.provinceBoundariesUrl, { signal: abort.signal })
          .then(async (res) => {
            if (!res.ok) return null;
            const json = await res.json();
            const { parseProvinceBoundaries } = await import("@/lib/explorer/cinematic/province-boundaries");
            return parseProvinceBoundaries(json);
          })
          .catch(() => null)
      : Promise.resolve(null);

    (async () => {
      try {
        const options = latest.current;
        const [{ createCinematicScene }, highlightResponse, coastlinesResponse] = await Promise.all([
          import("@/lib/explorer/cinematic/scene"),
          fetch(options.highlightUrl, { signal: abort.signal }),
          options.coastlinesUrl ? fetch(options.coastlinesUrl, { signal: abort.signal }) : Promise.resolve(null),
        ]);
        if (!highlightResponse.ok) throw new Error("highlight geometry");
        const highlight = (await highlightResponse.json()) as HighlightCollection;
        if (coastlinesResponse && !coastlinesResponse.ok) throw new Error("coastline geometry");
        const coastlines = coastlinesResponse ? ((await coastlinesResponse.json()) as HighlightCollection) : undefined;
        if (abort.signal.aborted) return;
        const created = await createCinematicScene({
          canvas,
          assets: options.assets,
          highlight,
          coastlines,
          initialView: options.initialView,
          signal: abort.signal,
          onContextLost: () => {
            scene?.dispose();
            setState("error");
            latest.current.onError?.(new Error("WebGL context lost"));
          },
        });
        if (abort.signal.aborted) {
          created.dispose();
          return;
        }
        scene = created;
        clearTimeout(timer);
        observer = new ResizeObserver(() => created.resize());
        observer.observe(canvas);
        document.addEventListener("visibilitychange", onVisibility);
        onVisibility();
        setState("ready");
        latest.current.onReady?.(created);

        // Attach optional boundaries when available
        boundariesPromise.then((boundaries) => {
          if (abort.signal.aborted || scene !== created) return;
          let available = Boolean(boundaries);
          try {
            created.setCountryBoundaries(boundaries);
          } catch {
            // Subdivision can reject an envelope-valid source at the render
            // budget boundary. Keep this optional failure out of core readiness.
            created.setCountryBoundaries(null);
            available = false;
          }
          const status = available ? "ready" : "unavailable";
          setBoundariesStatus(status);
          latest.current.onBoundariesStatus?.(status);
        });

        // Attach optional province boundaries when available
        provincePromise.then((provinces) => {
          if (abort.signal.aborted || scene !== created) return;
          let available = Boolean(provinces);
          try {
            created.setProvinceBoundaries(provinces);
          } catch {
            // Valid source edges can exceed the render budget after spherical
            // subdivision. Optional geometry rejection must keep core readiness
            // and retry working, just like an invalid/network-failed asset.
            created.setProvinceBoundaries(null);
            available = false;
          }
          const status = available ? "ready" : "unavailable";
          setProvinceStatus(status);
          latest.current.onProvinceBoundariesStatus?.(status);
        });
      } catch (error) {
        clearTimeout(timer);
        if (abort.signal.aborted) return;
        setState("error");
        latest.current.onError?.(error);
      }
    })();

    return () => {
      abort.abort();
      clearTimeout(timer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene?.dispose();
    };
  }, [attempt]);

  return (
    <div
      className={className}
      data-testid="cinematic-globe"
      data-state={state}
      data-country-boundaries={boundariesStatus}
      data-province-boundaries={provinceStatus}
    >
      <canvas
        key={attempt}
        ref={canvasRef}
        className="cinematic-globe-canvas"
        tabIndex={presentation === "homepage" ? 0 : undefined}
        role="img"
        aria-label="Địa cầu lịch sử. Dùng phím mũi tên để di chuyển, cộng trừ để phóng to thu nhỏ. Nội dung sự kiện có trong danh sách."
      />
      {state === "loading" && (
        <p className={presentation === "homepage" ? "home-map-loading" : "cinematic-globe-status"} role="status">
          Đang mở không gian lịch sử…
        </p>
      )}
      {state === "error" && (
        <div className={presentation === "homepage" ? "home-map-tile-error" : "cinematic-globe-status"} role="status" data-testid={presentation === "homepage" ? "globe-error" : "cinematic-globe-error"}>
          Chưa mở được địa cầu. Bạn vẫn có thể đọc danh sách sự kiện và hành trình.{" "}
          <button
            type="button"
            onClick={() => {
              setState("loading");
              setAttempt((value) => value + 1);
            }}
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
}
