import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";
import type { MapExplorerState } from "@/lib/explorer/map-state";

type Props = { events: readonly ExplorerEvent[]; limits: ExplorerLimits | null; state: MapExplorerState | null; onChange(from: number, to: number): void };

export function MapTimeControls({ events, limits, state, onChange }: Props) {
  const years = [...new Set(events.map((event) => event.startYear))].sort((a, b) => a - b);
  const ticks = years.length <= 8 ? years : Array.from({ length: 8 }, (_, index) => years[Math.round(index * (years.length - 1) / 7)]);
  return (
    <section className="home-map-time" aria-label="Dòng thời gian trên bản đồ" data-testid="map-time-controls">
      <div className="home-map-time-row">
        <div className="home-map-time-caption">
          <h2>Dòng thời gian</h2>
          <p>{state ? `${state.from} — ${state.to}` : "Các dấu mốc"}</p>
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
      {ticks.length > 0 && <div className="home-map-ticks" role="group" aria-label="Chọn một năm có sự kiện">
        {ticks.map((year) => <button type="button" key={year} onClick={() => onChange(year, year)}
          aria-label={`Sự kiện năm ${year}`} aria-pressed={state?.from === year && state?.to === year}
          className="relative px-2 text-xs font-semibold text-muted-foreground hover:text-accent focus-visible:outline-2 focus-visible:outline-accent">{year}</button>)}
      </div>}
    </section>
  );
}
