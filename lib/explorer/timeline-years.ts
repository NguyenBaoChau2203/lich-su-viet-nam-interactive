import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";

export type TimelineYear = { year: number; count: number; events: ExplorerEvent[] };
/** Inclusive interval years are navigation choices, not fabricated exact event dates. */
export function buildTimelineYears(events: readonly ExplorerEvent[]): TimelineYear[] {
  const years = new Map<number, Map<string, ExplorerEvent>>();
  for (const event of events) {
    const end = event.endYear ?? event.startYear;
    if (!Number.isSafeInteger(event.startYear) || !Number.isSafeInteger(end) || end < event.startYear) continue;
    for (let year = event.startYear; year <= end; year++) {
      const entries = years.get(year) ?? new Map<string, ExplorerEvent>();
      entries.set(event.slug, event); years.set(year, entries);
    }
  }
  return [...years].sort(([a], [b]) => a - b).map(([year, entries]) => ({ year, count: entries.size, events: [...entries.values()] }));
}

export function normalizeYearRange(from: number, to: number, limits: Pick<ExplorerLimits, "minYear" | "maxYear">): { from: number; to: number } {
  if (!Number.isFinite(from) || !Number.isFinite(to)) return { from: limits.minYear, to: limits.maxYear };
  const clamp = (year: number) => Math.max(limits.minYear, Math.min(limits.maxYear, Math.trunc(year)));
  return { from: clamp(Math.min(from, to)), to: clamp(Math.max(from, to)) };
}
