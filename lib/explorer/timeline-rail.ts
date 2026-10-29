import type { TimelineYear } from "./timeline-years";

export type TimelineRailItem = {
  key: string;
  x: number;
  years: readonly TimelineYear[];
  isGroup: boolean;
};

export function layoutTimelineYears(
  years: readonly TimelineYear[],
  width: number,
  limits: { minYear: number; maxYear: number },
): TimelineRailItem[] {
  if (years.length === 0) return [];
  if (years.length === 1 || limits.minYear === limits.maxYear) {
    return [
      {
        key: String(years[0].year),
        x: Math.round(width / 2),
        years: [years[0]],
        isGroup: false,
      },
    ];
  }

  const span = limits.maxYear - limits.minYear;
  const usableWidth = Math.max(0, width - 32);

  const getRawPos = (year: number) => 16 + ((year - limits.minYear) / span) * usableWidth;

  // Initial groups: wrap each year with its raw position
  type Group = {
    years: TimelineYear[];
    positions: number[];
    center: number;
  };

  let groups: Group[] = years.map((y) => {
    const pos = getRawPos(y.year);
    return {
      years: [y],
      positions: [pos],
      center: pos,
    };
  });

  // Iteratively merge adjacent groups whose centers are less than 28px apart
  let merged = true;
  while (merged && groups.length > 1) {
    merged = false;
    const nextGroups: Group[] = [];
    let i = 0;
    while (i < groups.length) {
      if (i === groups.length - 1) {
        nextGroups.push(groups[i]);
        i++;
      } else {
        const curr = groups[i];
        const next = groups[i + 1];
        if (next.center - curr.center < 28) {
          // Merge curr and next
          const combinedYears = [...curr.years, ...next.years];
          const combinedPositions = [...curr.positions, ...next.positions];
          const combinedCenter =
            combinedPositions.reduce((acc, p) => acc + p, 0) / combinedPositions.length;
          nextGroups.push({
            years: combinedYears,
            positions: combinedPositions,
            center: combinedCenter,
          });
          merged = true;
          i += 2;
        } else {
          nextGroups.push(curr);
          i++;
        }
      }
    }
    groups = nextGroups;
  }

  return groups.map((g) => {
    const isGroup = g.years.length > 1;
    const key = isGroup
      ? `group-${g.years[0].year}-${g.years[g.years.length - 1].year}`
      : String(g.years[0].year);
    return {
      key,
      x: Math.round(g.center * 10) / 10,
      years: g.years,
      isGroup,
    };
  });
}

/**
 * Computes which timeline rail items should have their year labels visible
 * by default (resting state) without visual collision, keeping spacing >= minSpacing.
 */
export function computeVisibleYearLabels(
  items: readonly TimelineRailItem[],
  minSpacing = 48,
): Set<string> {
  const visible = new Set<string>();
  if (items.length === 0) return visible;
  if (items.length === 1) {
    visible.add(items[0].key);
    return visible;
  }

  // Always include the first item
  visible.add(items[0].key);
  let lastX = items[0].x;

  const lastIndex = items.length - 1;
  const lastItem = items[lastIndex];

  // For intermediate items, check spacing from lastX and whether room remains for lastItem
  for (let i = 1; i < lastIndex; i++) {
    const item = items[i];
    const distToLast = lastItem.x - item.x;
    if (item.x - lastX >= minSpacing && distToLast >= minSpacing * 0.8) {
      visible.add(item.key);
      lastX = item.x;
    }
  }

  // Always include the last item if it doesn't collide severely with the previous label
  if (lastItem.x - lastX >= minSpacing * 0.7) {
    visible.add(lastItem.key);
  }

  return visible;
}
