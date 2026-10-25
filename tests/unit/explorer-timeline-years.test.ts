import { describe, expect, it } from "vitest";
import { buildTimelineYears, normalizeYearRange } from "@/lib/explorer/timeline-years";
import { parseExplorerState } from "@/lib/explorer/url";
import { filterExplorerEvents } from "@/lib/explorer/filters";
import type { ExplorerEvent } from "@/lib/explorer/types";

const event = (slug: string, startYear: number, endYear: number | null = null) => ({ slug, id: slug, startYear, endYear, locations: [] }) as unknown as ExplorerEvent;
describe("all data-supported timeline years", () => {
  it("retains more than eight years, inclusive interval middles and ends and each same-year identity once", () => {
    const events = Array.from({ length: 12 }, (_, i) => event(`single-${i}`, 1980 + i));
    const span = event("period", 2007, 2010), same = event("same-year", 2009);
    const years = buildTimelineYears([...events, span, same, same]);
    expect(years.map(item => item.year)).toEqual([1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 2007, 2008, 2009, 2010]);
    expect(years.find(item => item.year === 2009)?.events.map(item => item.slug)).toEqual(["period", "same-year"]);
    expect(years.find(item => item.year === 2009)?.count).toBe(2);
    expect(filterExplorerEvents([span, same], 2008, 2008)).toEqual([span]);
    expect(buildTimelineYears([])).toEqual([]);
  });
  it.each([[2025, 2030, 2019, 2019], [1800, 1850, 1911, 1911], [2007, 1986, 1986, 2007], [1800, 2030, 1911, 2019]])("normalizes %i..%i identically for state and URL", (from, to, expectedFrom, expectedTo) => {
    const limits = { minYear: 1911, maxYear: 2019, eventSlugs: [] };
    expect(normalizeYearRange(from, to, limits)).toEqual({ from: expectedFrom, to: expectedTo });
    const parsed = parseExplorerState(new URLSearchParams({ tu: String(from), den: String(to) }), limits);
    expect([parsed.from, parsed.to]).toEqual([expectedFrom, expectedTo]);
  });
});
