"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ExplorerEventList } from "@/components/explorer/ExplorerEventList";
import { TabletopStage } from "@/components/explorer/TabletopStage";
import { filterExplorerEvents } from "@/lib/explorer/filters";
import { createMapProjection } from "@/lib/explorer/projection";
import type {
  CameraView,
  ExplorerEvent,
  ExplorerLimits,
  ExplorerState,
  MarkerAnchor,
} from "@/lib/explorer/types";
import { buildExplorerUrl } from "@/lib/explorer/url";

export type HistoryExplorerProps = {
  events: readonly ExplorerEvent[];
  limits: ExplorerLimits | null;
  initialState: ExplorerState | null;
  dataError?: string | null;
};

const DEFAULT_VIETNAM_BOUNDS = {
  west: 102.118655,
  east: 115.849152,
  south: 8.263495,
  north: 23.366278,
} as const;

export function HistoryExplorer({
  events,
  limits,
  initialState,
  dataError = null,
}: HistoryExplorerProps) {
  const [state, setState] = useState<ExplorerState | null>(initialState);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const visibleEvents = useMemo(() => {
    if (!state) return events;
    return filterExplorerEvents(events, state.from, state.to);
  }, [events, state]);

  const anchors = useMemo<MarkerAnchor[]>(() => {
    const projection = createMapProjection(DEFAULT_VIETNAM_BOUNDS, 100);
    const list: MarkerAnchor[] = [];
    for (const event of visibleEvents) {
      for (const loc of event.locations) {
        if (loc.longitude !== null && loc.latitude !== null) {
          list.push({
            key: `${event.slug}@${loc.slug}`,
            eventSlug: event.slug,
            locationSlug: loc.slug,
            position: projection.project(loc.longitude, loc.latitude),
            accuracyLevel: loc.accuracyLevel,
          });
        }
      }
    }
    return list;
  }, [visibleEvents]);

  const handleViewChange = useCallback((view: CameraView) => {
    setState((prev) => {
      if (!prev) return prev;
      const next: ExplorerState = { ...prev, view };
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", buildExplorerUrl(next));
        }
      }, 150);
      return next;
    });
  }, []);

  const periodText =
    state && limits
      ? `Giai đoạn ${state.from} – ${state.to}`
      : limits
        ? `Giai đoạn ${limits.minYear} – ${limits.maxYear}`
        : "Chưa có khoảng năm đã công bố";

  return (
    <div
      data-testid="history-explorer"
      className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 lg:px-6"
    >
      {dataError && (
        <div
          role="status"
          data-testid="explorer-data-error"
          className="rounded-md border border-warning/40 bg-warning-bg px-4 py-2.5 text-sm text-foreground"
        >
          {dataError}
        </div>
      )}

      {/* Compact Explorer Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
            Sa bàn lịch sử Việt Nam 3D
          </h1>
          <p className="mt-0.5 text-xs text-foreground/75 lg:text-sm">
            Khám phá không gian địa lý và các sự kiện lịch sử Việt Nam đã thẩm định nguồn ({periodText}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div
            aria-label="Bộ chọn khoảng năm"
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5"
          >
            <label htmlFor="explorer-year-from" className="font-medium text-foreground/80">
              Từ năm
            </label>
            <input
              id="explorer-year-from"
              type="number"
              disabled={!limits || !state}
              min={limits?.minYear}
              max={limits?.maxYear}
              value={state?.from ?? ""}
              onChange={(e) => {
                if (!limits) return;
                const val = Number.parseInt(e.target.value, 10);
                if (!Number.isFinite(val)) return;
                const clamped = Math.min(Math.max(val, limits.minYear), limits.maxYear);
                setState((prev) =>
                  prev
                    ? { ...prev, from: clamped, to: Math.max(prev.to, clamped) }
                    : prev,
                );
              }}
              className="w-16 rounded-xs border border-border bg-background px-1.5 py-0.5 text-center font-mono text-xs text-foreground disabled:opacity-50"
            />
            <label htmlFor="explorer-year-to" className="font-medium text-foreground/80">
              Đến năm
            </label>
            <input
              id="explorer-year-to"
              type="number"
              disabled={!limits || !state}
              min={limits?.minYear}
              max={limits?.maxYear}
              value={state?.to ?? ""}
              onChange={(e) => {
                if (!limits) return;
                const val = Number.parseInt(e.target.value, 10);
                if (!Number.isFinite(val)) return;
                const clamped = Math.min(Math.max(val, limits.minYear), limits.maxYear);
                setState((prev) =>
                  prev
                    ? { ...prev, to: clamped, from: Math.min(prev.from, clamped) }
                    : prev,
                );
              }}
              className="w-16 rounded-xs border border-border bg-background px-1.5 py-0.5 text-center font-mono text-xs text-foreground disabled:opacity-50"
            />
            <button
              type="button"
              disabled={!limits || !state}
              onClick={() => {
                if (!limits) return;
                setState((prev) =>
                  prev ? { ...prev, from: limits.minYear, to: limits.maxYear } : prev,
                );
              }}
              className="rounded-xs border border-border bg-surface-alt px-2 py-0.5 font-medium text-foreground hover:bg-border/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50"
            >
              Toàn bộ
            </button>
          </div>

          <nav aria-label="Lối tắt tư liệu và ôn tập" className="flex items-center gap-1.5">
            <Link
              href="/dong-thoi-gian"
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-medium text-foreground hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Dòng thời gian
            </Link>
            <Link
              href="/muc-luc"
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-medium text-foreground hover:bg-surface-alt focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Mục lục SGK
            </Link>
            <Link
              href="/luyen-thi"
              className="rounded-md border border-border bg-surface px-2.5 py-1.5 font-medium text-foreground/80 hover:bg-surface-alt hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              Ôn tập
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Desktop Split: Raised 3D Tabletop + Readable Event Alternative */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_370px] xl:grid-cols-[minmax(0,1fr)_410px]">
        <TabletopStage
          anchors={anchors}
          initialView={state?.view ?? null}
          onViewChange={handleViewChange}
          className="h-[calc(100vh-230px)] min-h-[450px] max-h-[660px]"
        />
        <ExplorerEventList
          events={visibleEvents}
          state={state}
          hasDataError={Boolean(dataError)}
        />
      </div>
    </div>
  );
}
