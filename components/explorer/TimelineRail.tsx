"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ExplorerLimits } from "@/lib/explorer/types";
import type { TimelineYear } from "@/lib/explorer/timeline-years";
import { layoutTimelineYears, computeVisibleYearLabels } from "@/lib/explorer/timeline-rail";
import type { MapExplorerState } from "@/lib/explorer/map-state";

type Props = {
  years: readonly TimelineYear[];
  limits: ExplorerLimits | null;
  state: MapExplorerState | null;
  onChange(from: number, to: number): void;
};

export function TimelineRail({ years, limits, state, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(800);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const markerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tooltipId = useId();

  // Measure rail width dynamically
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setWidth(el.clientWidth || 800);
    return () => observer.disconnect();
  }, []);

  const items = useMemo(() => {
    if (!limits || years.length === 0) return [];
    return layoutTimelineYears(years, width, limits);
  }, [years, width, limits]);

  const defaultVisibleKeys = useMemo(
    () => computeVisibleYearLabels(items, 48),
    [items],
  );

  // Handle Escape key to dismiss tooltip or open group popover
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        if (activeGroupKey) {
          event.preventDefault();
          const returnTarget = markerRefs.current.get(activeGroupKey);
          setActiveGroupKey(null);
          returnTarget?.focus();
        } else if (hoveredKey) {
          event.preventDefault();
          setHoveredKey(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGroupKey, hoveredKey]);

  if (!limits || items.length === 0) {
    return null;
  }

  const activeGroupItem = items.find((item) => item.isGroup && item.key === activeGroupKey);
  const hoveredItem = items.find((item) => item.key === hoveredKey);

  return (
    <nav
      ref={containerRef}
      className="timeline-rail"
      aria-label="Thước dòng thời gian"
      onKeyDown={(event) => {
        if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          const keys = items.map((i) => i.key);
          const activeIndex = keys.findIndex((k) => k === document.activeElement?.getAttribute("data-rail-key"));
          if (activeIndex >= 0) {
            event.preventDefault();
            let nextIndex = activeIndex;
            if (event.key === "ArrowRight" || event.key === "ArrowDown") {
              nextIndex = Math.min(keys.length - 1, activeIndex + 1);
            } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
              nextIndex = Math.max(0, activeIndex - 1);
            } else if (event.key === "Home") {
              nextIndex = 0;
            } else if (event.key === "End") {
              nextIndex = keys.length - 1;
            }
            markerRefs.current.get(keys[nextIndex])?.focus();
          }
        }
      }}
    >
      <div className="timeline-rail-line" aria-hidden="true" />

      {/* Floating tooltip on hover/focus */}
      {hoveredItem && !activeGroupKey && (
        <div
          id={tooltipId}
          role="tooltip"
          className="timeline-rail-tooltip"
          style={{ left: `${hoveredItem.x}px` }}
        >
          {hoveredItem.isGroup ? (
            <span>
              {hoveredItem.years[0].year}–{hoveredItem.years.at(-1)?.year} · {hoveredItem.years.length} năm
            </span>
          ) : (
            <span>
              {hoveredItem.years[0].year} · {hoveredItem.years[0].count} sự kiện
            </span>
          )}
        </div>
      )}

      {/* Rail marker buttons */}
      <ol className="timeline-rail-list">
        {items.map((item) => {
          const isSelected =
            !item.isGroup &&
            state?.from === item.years[0].year &&
            state?.to === item.years[0].year;
          const containsSelected =
            item.isGroup &&
            state !== null &&
            item.years.some((y) => y.year === state.from && y.year === state.to);

          return (
            <li
              key={item.key}
              className="timeline-rail-item"
              style={{ left: `${item.x}px` }}
            >
              {item.isGroup ? (
                <button
                  type="button"
                  ref={(el) => {
                    if (el) markerRefs.current.set(item.key, el);
                    else markerRefs.current.delete(item.key);
                  }}
                  data-rail-key={item.key}
                  className={`timeline-rail-group-btn ${containsSelected ? "is-active" : ""}`}
                  aria-label={`Nhóm các năm ${item.years[0].year}–${item.years.at(-1)?.year} (${item.years.map((y) => y.year).join(", ")}): ${item.years.length} năm`}
                  aria-haspopup="dialog"
                  aria-expanded={activeGroupKey === item.key}
                  aria-describedby={hoveredKey === item.key ? tooltipId : undefined}
                  onClick={() =>
                    setActiveGroupKey((prev) => (prev === item.key ? null : item.key))
                  }
                  onFocus={() => setHoveredKey(item.key)}
                  onBlur={() => setHoveredKey((prev) => (prev === item.key ? null : prev))}
                  onPointerEnter={() => setHoveredKey(item.key)}
                  onPointerLeave={() => setHoveredKey((prev) => (prev === item.key ? null : prev))}
                >
                  <span className="timeline-rail-group-badge">+{item.years.length}</span>
                </button>
              ) : (
                <button
                  type="button"
                  ref={(el) => {
                    if (el) markerRefs.current.set(item.key, el);
                    else markerRefs.current.delete(item.key);
                  }}
                  data-rail-key={item.key}
                  data-year={item.years[0].year}
                  className={`timeline-rail-dot-btn ${isSelected ? "is-selected" : ""}`}
                  aria-label={`Sự kiện năm ${item.years[0].year}: ${item.years[0].count} sự kiện`}
                  aria-pressed={isSelected}
                  aria-describedby={hoveredKey === item.key ? tooltipId : undefined}
                  onClick={() => onChange(item.years[0].year, item.years[0].year)}
                  onFocus={() => setHoveredKey(item.key)}
                  onBlur={() => setHoveredKey((prev) => (prev === item.key ? null : prev))}
                  onPointerEnter={() => setHoveredKey(item.key)}
                  onPointerLeave={() => setHoveredKey((prev) => (prev === item.key ? null : prev))}
                >
                  <span className="timeline-rail-dot" />
                </button>
              )}
              <span
                className={`timeline-rail-year-label ${
                  defaultVisibleKeys.has(item.key) ? "is-visible" : ""
                } ${isSelected || containsSelected ? "is-selected" : ""}`}
                aria-hidden="true"
              >
                {item.years[0].year}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Expanded group year picker popover */}
      {activeGroupItem && (
        <div
          role="dialog"
          aria-label={`Chọn năm trong khoảng ${activeGroupItem.years[0].year}–${activeGroupItem.years.at(-1)?.year}`}
          className="timeline-rail-group-popover"
          style={{ left: `${Math.max(120, Math.min(width - 120, activeGroupItem.x))}px` }}
        >
          <div className="timeline-rail-group-popover-header">
            <span>
              {activeGroupItem.years[0].year}–{activeGroupItem.years.at(-1)?.year} ({activeGroupItem.years.length} năm)
            </span>
            <button
              type="button"
              className="timeline-rail-group-close"
              aria-label="Đóng bảng chọn năm"
              onClick={() => {
                const returnTarget = markerRefs.current.get(activeGroupItem.key);
                setActiveGroupKey(null);
                returnTarget?.focus();
              }}
            >
              ✕
            </button>
          </div>
          <ol className="timeline-rail-group-year-list">
            {activeGroupItem.years.map((y) => (
              <li key={y.year}>
                <button
                  type="button"
                  data-year={y.year}
                  aria-label={`Sự kiện năm ${y.year}: ${y.count} sự kiện`}
                  aria-pressed={state?.from === y.year && state?.to === y.year}
                  className={`timeline-rail-group-year-btn ${
                    state?.from === y.year && state?.to === y.year ? "is-selected" : ""
                  }`}
                  onClick={() => {
                    onChange(y.year, y.year);
                    setActiveGroupKey(null);
                  }}
                >
                  <strong>{y.year}</strong>
                  <span>{y.count} sự kiện</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </nav>
  );
}
