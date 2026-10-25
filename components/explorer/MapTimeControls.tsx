import Link from "next/link";
import { useMemo, useRef } from "react";
import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";
import { buildTimelineYears } from "@/lib/explorer/timeline-years";
import { filterExplorerEvents } from "@/lib/explorer/filters";
import type { MapExplorerState } from "@/lib/explorer/map-state";

type Props = { events: readonly ExplorerEvent[]; limits: ExplorerLimits | null; state: MapExplorerState | null; onChange(from: number, to: number): void; onOpenEvents?(): void };

export function MapTimeControls({ events, limits, state, onChange, onOpenEvents }: Props) {
  const years = useMemo(() => buildTimelineYears(events), [events]);
  const strip = useRef<HTMLOListElement>(null);
  const count = state ? filterExplorerEvents(events, state.from, state.to).length : events.length;
  return (
    <section className="home-map-time" aria-label="Dòng thời gian trên bản đồ" data-testid="map-time-controls">
      <div className="home-map-time-row">
        <div className="home-map-time-caption">
          <h2>Dòng thời gian</h2>
          <p>{state ? `${state.from} — ${state.to}` : "Các dấu mốc"} · <span data-testid="timeline-visible-count">{count} sự kiện</span></p>
        </div>
        <form method="get" className="flex flex-wrap items-center gap-2 text-sm" onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          onChange(Number(data.get("tu")), Number(data.get("den")));
        }}>
          <label htmlFor="explorer-year-from" className="text-xs text-muted-foreground">Từ năm</label>
          <input key={`from-${state?.from}`} id="explorer-year-from" name="tu" type="number" required min={limits?.minYear} max={limits?.maxYear}
            defaultValue={state?.from} disabled={!limits} className="home-map-year" />
          <label htmlFor="explorer-year-to" className="text-xs text-muted-foreground">Đến năm</label>
          <input key={`to-${state?.to}`} id="explorer-year-to" name="den" type="number" required min={limits?.minYear} max={limits?.maxYear}
            defaultValue={state?.to} disabled={!limits} className="home-map-year" />
          <button type="submit" disabled={!limits} className="home-map-filter">Lọc thời gian</button>
          <button type="button" disabled={!limits} onClick={() => limits && onChange(limits.minYear, limits.maxYear)}
            className="px-2 py-2 text-xs font-semibold text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-accent">Toàn bộ</button>
        </form>
      </div>
      {years.length > 0 && <nav className="home-year-index" aria-label="Chọn một năm có sự kiện">
        <button type="button" aria-label="Cuộn đến các năm trước" onClick={() => strip.current?.scrollBy({ left: -320 })}>←</button>
        <ol ref={strip} className="home-year-strip">{years.map(({ year, count }) => <li key={year}>
          <button type="button" onClick={() => onChange(year, year)} data-year={year}
            onFocus={event => event.currentTarget.scrollIntoView({ block: "nearest", inline: "nearest" })}
            aria-label={`Sự kiện năm ${year}: ${count} sự kiện`} aria-pressed={state?.from === year && state?.to === year}>
            <strong>{year}</strong><span>{count} sự kiện</span>
          </button></li>)}</ol>
        <button type="button" aria-label="Cuộn đến các năm sau" onClick={() => strip.current?.scrollBy({ left: 320 })}>→</button>
      </nav>}
      <div className="home-year-links"><span>Chỉ mục năm có sự kiện</span><button type="button" onClick={onOpenEvents}>Chọn từng sự kiện ({count})</button>
        <Link href="/dong-thoi-gian">Xem toàn bộ dòng thời gian →</Link></div>
    </section>
  );
}
