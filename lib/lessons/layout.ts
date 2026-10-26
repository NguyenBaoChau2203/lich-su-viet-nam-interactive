/**
 * Number of columns (within [min, max]) that leaves the fewest empty slots in the last row; ties → more columns.
 */
export function balancedColumns(count: number, min = 2, max = 5): number {
  if (count <= min) return Math.max(1, count);
  let best = max;
  let bestEmpty = Infinity;
  for (let c = max; c >= min; c--) {
    const empty = (c - (count % c)) % c;
    if (empty < bestEmpty) {
      best = c;
      bestEmpty = empty;
    }
  }
  return best;
}

export const COLS = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
} as const;

export type ColCount = keyof typeof COLS;
