"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";
import { buildTimelineYears } from "@/lib/explorer/timeline-years";
import { filterExplorerEvents } from "@/lib/explorer/filters";
import type { MapExplorerState } from "@/lib/explorer/map-state";
import { TimelineRail } from "./TimelineRail";

type Props = {
  events: readonly ExplorerEvent[];
  limits: ExplorerLimits | null;
  state: MapExplorerState | null;
  onChange(from: number, to: number): void;
  onOpenEvents?(): void;
};

export function MapTimeControls({ events, limits, state, onChange, onOpenEvents }: Props) {
  const years = useMemo(() => buildTimelineYears(events), [events]);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterPopoverRef = useRef<HTMLDivElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  const count = state ? filterExplorerEvents(events, state.from, state.to).length : events.length;

  // Escape closes filter disclosure and returns focus to trigger
  useEffect(() => {
    if (!filterOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        setFilterOpen(false);
        filterTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filterOpen]);

  return (
    <section
      className="home-map-time"
      aria-label="Dòng thời gian trên bản đồ"
      data-testid="map-time-controls"
    >
      <div className="home-map-time-top">
        <div className="home-map-time-caption">
          <h2>Dòng thời gian</h2>
          <p>
            {state ? `${state.from} — ${state.to}` : "Các dấu mốc"} ·{" "}
            <span data-testid="timeline-visible-count">{count} sự kiện</span>
          </p>
        </div>

        <div className="home-map-time-actions">
          <button
            type="button"
            ref={filterTriggerRef}
            aria-expanded={filterOpen}
            aria-controls="home-map-filter-dialog"
            className="home-map-action-btn"
            onClick={() => setFilterOpen((o) => !o)}
          >
            Lọc năm
          </button>
          <button
            type="button"
            disabled={!limits}
            className="home-map-action-btn"
            onClick={() => limits && onChange(limits.minYear, limits.maxYear)}
          >
            Toàn bộ
          </button>
          <button
            type="button"
            className="home-map-action-btn"
            onClick={onOpenEvents}
            aria-label={`Chọn từng sự kiện (${count})`}
          >
            Danh sách ({count})
          </button>
        </div>
      </div>

      {/* Thin timeline rail */}
      <TimelineRail
        years={years}
        limits={limits}
        state={state}
        onChange={onChange}
      />

      {/* Expanded filter disclosure popup */}
      <div
        id="home-map-filter-dialog"
        ref={filterPopoverRef}
        role="region"
        aria-label="Bộ lọc khoảng năm"
        className="home-map-filter-popover"
        hidden={!filterOpen}
      >
        <form
          method="get"
          className="home-map-filter-form"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            onChange(Number(data.get("tu")), Number(data.get("den")));
            setFilterOpen(false);
            filterTriggerRef.current?.focus();
          }}
        >
          <div className="home-map-filter-inputs">
            <label htmlFor="explorer-year-from">Từ năm</label>
            <input
              key={`from-${state?.from}`}
              id="explorer-year-from"
              name="tu"
              type="number"
              required
              min={limits?.minYear}
              max={limits?.maxYear}
              defaultValue={state?.from}
              disabled={!limits}
              className="home-map-year"
            />
            <label htmlFor="explorer-year-to">Đến năm</label>
            <input
              key={`to-${state?.to}`}
              id="explorer-year-to"
              name="den"
              type="number"
              required
              min={limits?.minYear}
              max={limits?.maxYear}
              defaultValue={state?.to}
              disabled={!limits}
              className="home-map-year"
            />
            <button
              type="submit"
              disabled={!limits}
              className="home-map-filter"
            >
              Lọc thời gian
            </button>
            <button
              type="button"
              className="home-map-filter-close"
              onClick={() => {
                setFilterOpen(false);
                filterTriggerRef.current?.focus();
              }}
            >
              Đóng
            </button>
          </div>
          <div className="home-map-filter-links">
            <Link href="/dong-thoi-gian">Xem toàn bộ dòng thời gian →</Link>
          </div>
        </form>
      </div>
    </section>
  );
}
