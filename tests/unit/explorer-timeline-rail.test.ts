import { describe, expect, it } from "vitest";
import { layoutTimelineYears, computeVisibleYearLabels } from "@/lib/explorer/timeline-rail";
import type { TimelineYear } from "@/lib/explorer/timeline-years";

function makeYear(year: number, count = 1): TimelineYear {
  return { year, count, events: [] };
}

describe("layoutTimelineYears (Task 4)", () => {
  it("returns empty array when years array is empty", () => {
    expect(layoutTimelineYears([], 800, { minYear: 1900, maxYear: 2000 })).toEqual([]);
  });

  it("centers a single-year dataset at width / 2", () => {
    const years = [makeYear(1945, 3)];
    const items = layoutTimelineYears(years, 600, { minYear: 1945, maxYear: 1945 });
    expect(items).toHaveLength(1);
    expect(items[0].key).toBe("1945");
    expect(items[0].x).toBe(300);
    expect(items[0].isGroup).toBe(false);
    expect(items[0].years).toEqual(years);
  });

  it("positions widely spaced years individually with at least 28px spacing", () => {
    const years = [makeYear(1900), makeYear(1950), makeYear(2000)];
    const items = layoutTimelineYears(years, 1000, { minYear: 1900, maxYear: 2000 });
    expect(items).toHaveLength(3);
    expect(items.every((item) => !item.isGroup)).toBe(true);
    expect(items[0].x).toBe(16); // 16px left inset
    expect(items[2].x).toBe(1000 - 16); // 16px right inset
    expect(items[1].x).toBe(500); // 16 + 0.5 * 968 = 500
  });

  it("groups dense adjacent years when spacing is less than 28px", () => {
    // 10 years in a 100px span -> ~10px per year -> will group
    const years = [
      makeYear(1940),
      makeYear(1941),
      makeYear(1942),
      makeYear(1943),
      makeYear(1944),
      makeYear(1945),
    ];
    // In dense width, markers must group:
    const denseItems = layoutTimelineYears(years, 100, { minYear: 1940, maxYear: 1945 });
    expect(denseItems.length).toBeLessThan(years.length);
    expect(denseItems.some((item) => item.isGroup)).toBe(true);

    // Every year is preserved exactly once across groups
    const collectedYears = denseItems.flatMap((item) => item.years.map((y) => y.year));
    expect(collectedYears).toEqual([1940, 1941, 1942, 1943, 1944, 1945]);
  });

  it("maintains minimum 28px center spacing between consecutive items", () => {
    const years = Array.from({ length: 30 }, (_, i) => makeYear(1911 + i));
    const items = layoutTimelineYears(years, 500, { minYear: 1911, maxYear: 1940 });

    for (let i = 1; i < items.length; i++) {
      expect(items[i].x - items[i - 1].x).toBeGreaterThanOrEqual(28 - 0.001);
    }
  });

  it("preserves first and last years in the first and last rail items", () => {
    const years = [makeYear(1911), makeYear(1912), makeYear(1913), makeYear(1945), makeYear(1975)];
    const items = layoutTimelineYears(years, 300, { minYear: 1911, maxYear: 1975 });
    expect(items[0].years[0].year).toBe(1911);
    expect(items[items.length - 1].years.at(-1)?.year).toBe(1975);
  });

  it("is deterministic across resizes and does not duplicate event counts", () => {
    const years = [makeYear(2007, 1), makeYear(2008, 1), makeYear(2009, 2), makeYear(2010, 1)];
    const itemsSmall = layoutTimelineYears(years, 200, { minYear: 2007, maxYear: 2010 });
    const itemsLarge = layoutTimelineYears(years, 800, { minYear: 2007, maxYear: 2010 });

    const totalYearsSmall = itemsSmall.reduce((sum, item) => sum + item.years.length, 0);
    const totalYearsLarge = itemsLarge.reduce((sum, item) => sum + item.years.length, 0);
    expect(totalYearsSmall).toBe(4);
    expect(totalYearsLarge).toBe(4);
  });
});

describe("computeVisibleYearLabels", () => {
  it("returns empty set when items are empty", () => {
    expect(computeVisibleYearLabels([])).toEqual(new Set());
  });

  it("labels the single item when only one item exists", () => {
    const items = [{ key: "1945", x: 300, years: [makeYear(1945)], isGroup: false }];
    expect(computeVisibleYearLabels(items)).toEqual(new Set(["1945"]));
  });

  it("labels first, spaced middle and last items without overlapping", () => {
    const items = [
      { key: "1905", x: 16, years: [makeYear(1905)], isGroup: false },
      { key: "1910", x: 44, years: [makeYear(1910)], isGroup: false }, // too close to 16 (< 48)
      { key: "1930", x: 150, years: [makeYear(1930)], isGroup: false }, // >= 48
      { key: "1945", x: 220, years: [makeYear(1945)], isGroup: false }, // >= 48
      { key: "1954", x: 260, years: [makeYear(1954)], isGroup: false }, // too close to 220 (40 < 48)
      { key: "1975", x: 400, years: [makeYear(1975)], isGroup: false }, // last item
    ];
    const visible = computeVisibleYearLabels(items, 48);
    expect(visible.has("1905")).toBe(true);
    expect(visible.has("1910")).toBe(false);
    expect(visible.has("1930")).toBe(true);
    expect(visible.has("1945")).toBe(true);
    expect(visible.has("1954")).toBe(false);
    expect(visible.has("1975")).toBe(true);
  });
});
