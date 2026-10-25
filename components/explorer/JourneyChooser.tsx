"use client";

import { useMemo, useRef } from "react";
import { ChevronDown } from "lucide-react";
import type { HistoryJourney, JourneyStop } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";

export type JourneyChooserProps = {
  journeys: readonly HistoryJourney[];
  selectedJourney: HistoryJourney;
  selectedStop: JourneyStop;
  state: MapExplorerState;
  onChooseJourney(id: string): void;
  onSeekStop?(stopId: string): void;
};

export function JourneyChooser({
  journeys,
  selectedJourney,
  selectedStop,
  state,
  onChooseJourney,
  onSeekStop,
}: JourneyChooserProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Validate against the registered entries; unsupported entries never appear.
  const validJourneys = useMemo(() => {
    return journeys.filter((candidate) => {
      const registered = JOURNEY_REGISTRY.getJourneyById(candidate.id);
      return Boolean(registered && registered.id === candidate.id && candidate.stops.length > 0);
    });
  }, [journeys]);

  return (
    <div className="journey-chooser" data-testid="journey-chooser">
      <form
        method="get"
        action="/"
        className="journey-chooser-form"
        data-testid="journey-chooser-form"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const id = data.get("hanh-trinh");
          if (typeof id === "string" && id !== selectedJourney.id) {
            onChooseJourney(id);
          }
        }}
      >
        <label htmlFor="journey-select" className="journey-chooser-label">
          Chọn hành trình
        </label>
        <div className="journey-select-wrapper">
          <select
            id="journey-select"
            name="hanh-trinh"
            className="journey-chooser-select"
            value={selectedJourney.id}
            onChange={(event) => {
              const id = event.target.value;
              if (id && id !== selectedJourney.id) {
                onChooseJourney(id);
              }
            }}
            data-testid="journey-select"
            aria-label="Chọn hành trình lịch sử"
          >
            {validJourneys.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.period}) · {j.stops.length} mốc
              </option>
            ))}
          </select>
        </div>
        <noscript>
          <button type="submit" className="journey-chooser-submit">
            Xem hành trình
          </button>
        </noscript>
      </form>

      <nav
        className="journey-choices-nav"
        aria-label="Danh sách hành trình lịch sử"
        data-testid="journey-choices-nav"
      >
        <ul className="journey-choices-list" role="list">
          {validJourneys.map((j) => {
            const isActive = j.id === selectedJourney.id;
            const href = buildMapExplorerUrl({
              ...state,
              journey: { id: j.id, stop: j.stops[0].id },
              selectedEvent: null,
              view: j.stops[0].view,
            });
            return (
              <li key={j.id} className="journey-choice-item">
                <a
                  data-journey-id={j.id}
                  href={href}
                  className={`journey-choice-button${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => {
                    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                      event.preventDefault();
                      if (!isActive) onChooseJourney(j.id);
                    }
                  }}
                >
                  <span className="journey-choice-title">{j.title}</span>
                  <span className="journey-choice-meta">
                    <strong>{j.period}</strong> · {j.stops.length} mốc
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="journey-selected-summary" data-testid="journey-selected-summary">
        <p className="globe-description" data-testid="journey-title">
          {selectedJourney.title}
        </p>
        <p className="globe-journey-period" data-testid="journey-period">
          Thời kỳ: {selectedJourney.period}
        </p>
        <p className="globe-journey-note" data-testid="journey-note">
          {selectedJourney.note}
        </p>
      </div>

      <details
        ref={detailsRef}
        className="home-map-list journey-stops-details mt-3 border-t border-border pt-2"
        data-testid="journey-stops-list"
        onKeyDown={(event) => {
          if (event.key === "Escape" && detailsRef.current?.open) {
            event.preventDefault();
            event.stopPropagation();
            detailsRef.current.open = false;
            detailsRef.current.querySelector("summary")?.focus();
          }
        }}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <span>Danh sách mốc</span>
          <span className="ml-auto text-accent" data-testid="journey-stop-count">
            {selectedJourney.stops.length} mốc
          </span>
          <ChevronDown size={14} aria-hidden="true" />
        </summary>
        <ol
          className="home-map-list-items mt-2 list-none divide-y divide-border"
          aria-label={`Các mốc trong ${selectedJourney.title}`}
        >
          {selectedJourney.stops.map((item, index) => {
            const isCurrent = item.id === selectedStop.id;
            const href = buildMapExplorerUrl({
              ...state,
              journey: { id: selectedJourney.id, stop: item.id },
              selectedEvent: null,
              view: item.view,
            });
            return (
              <li key={item.id} className="py-2" data-testid="journey-stop-item">
                <a
                  data-stop-id={item.id}
                  href={href}
                  className={`block text-xs ${isCurrent ? "text-accent font-semibold" : "text-foreground hover:underline"}`}
                  aria-current={isCurrent ? "step" : undefined}
                  onClick={(event) => {
                    if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                      event.preventDefault();
                      onSeekStop?.(item.id);
                    }
                  }}
                >
                  <span className="text-muted-foreground">
                    {String(index + 1).padStart(2, "0")} · {item.date}
                  </span>
                  <strong className="block mt-0.5 text-xs font-medium">{item.title}</strong>
                  <small className="block text-muted-foreground mt-0.5">
                    {item.place.split(" · ")[0]}
                  </small>
                </a>
              </li>
            );
          })}
        </ol>
      </details>
    </div>
  );
}
