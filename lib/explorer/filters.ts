import type { ExplorerEvent, ExplorerLimits } from "@/lib/explorer/types";

export function getExplorerLimits(events: readonly ExplorerEvent[]): ExplorerLimits | null {
  if (events.length === 0) return null;

  let minYear = Infinity;
  let maxYear = -Infinity;
  const eventSlugs: string[] = [];

  for (const event of events) {
    eventSlugs.push(event.slug);
    const start = event.startYear;
    const end = event.endYear ?? event.startYear;
    if (start < minYear) minYear = start;
    if (end < minYear) minYear = end;
    if (start > maxYear) maxYear = start;
    if (end > maxYear) maxYear = end;
  }

  if (!Number.isFinite(minYear) || !Number.isFinite(maxYear)) return null;

  return { minYear, maxYear, eventSlugs };
}

export function filterExplorerEvents(
  events: readonly ExplorerEvent[],
  from: number,
  to: number,
): ExplorerEvent[] {
  const minBound = Math.min(from, to);
  const maxBound = Math.max(from, to);

  return events.filter((event) => {
    const start = event.startYear;
    const end = event.endYear ?? event.startYear;
    return start <= maxBound && end >= minBound;
  });
}
