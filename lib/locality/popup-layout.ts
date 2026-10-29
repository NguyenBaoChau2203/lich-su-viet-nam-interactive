export type Rect = { left: number; top: number; right: number; bottom: number };
export type CardSize = { key: string; width: number; height: number };
export type LocalityCardPlacement = CardSize & { left: number; top: number; docked: boolean };

export function visibleLocalityCardRects(cards: readonly LocalityCardPlacement[], bottom: number, scrollTop = 0): Rect[] {
  const first = cards[0];
  if (!first) return [];
  let cursor = first.top - scrollTop;
  return cards.map((card) => {
    const top = card.docked ? cursor : card.top;
    cursor += card.height + 12;
    return { left: card.left, top: Math.max(first.top, top), right: card.left + card.width, bottom: Math.min(bottom, top + card.height) };
  }).filter((rect) => rect.bottom > rect.top);
}

const overlaps = (a: Rect, b: Rect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Stage CSS pixels. A dock is one bounded scroll viewport, with cards in normal flow. */
export function placeLocalityCards({ safeRect, occupied, selectedBounds, cardSizes }: {
  safeRect: Rect; occupied: readonly Rect[]; selectedBounds: Rect | null; cardSizes: readonly CardSize[];
}): LocalityCardPlacement[] {
  if (!cardSizes.length) return [];
  const gap = 12;
  const width = Math.min(Math.max(...cardSizes.map((c) => c.width)), Math.max(1, safeRect.right - safeRect.left));
  const forbidden = [...occupied, ...(selectedBounds ? [selectedBounds] : [])];
  const candidates = Array.from(new Set([
    safeRect.left, safeRect.right - width,
    ...forbidden.flatMap((r) => [r.right + gap, r.left - gap - width]),
  ])).filter((left) => left >= safeRect.left && left + width <= safeRect.right).sort((a, b) => a - b);

  // Two columns preserve reading order: places first, then people. Work only on
  // invalidation/measurement; no layout animation loop or pointer-based anchors.
  if (selectedBounds) {
    const split = Math.ceil(cardSizes.length / 2);
    for (const left of candidates) for (const right of candidates) {
      if (right < left + width + gap) continue;
      const used: Rect[] = [];
      const placed = cardSizes.map((card, index) => {
        const column = index < split ? 0 : 1;
        const prior = cardSizes.slice(column ? split : 0, index);
        const top = safeRect.top + prior.reduce((sum, c) => sum + c.height + gap, 0);
        const box = { left: column ? right : left, top, right: (column ? right : left) + card.width, bottom: top + card.height };
        used.push(box);
        return { ...card, left: box.left, top, docked: false };
      });
      if (used.every((r, i) => r.right <= safeRect.right && r.bottom <= safeRect.bottom &&
        !forbidden.some((f) => overlaps(r, f)) && !used.slice(i + 1).some((f) => overlaps(r, f)))) return placed;
    }
  }
  // Prefer a clear column on the right that also clears the selected province/marker.
  // Each child carries the dock viewport's top/width; the DOM owns internal scrolling.
  const dockLeft = [...candidates].reverse().find((left) => !forbidden.some((r) => overlaps(
    { left, top: safeRect.top, right: left + width, bottom: safeRect.bottom }, r,
  ))) ?? Math.max(safeRect.left, safeRect.right - width);
  return cardSizes.map((card) => ({ ...card, width: Math.min(card.width, width), left: dockLeft, top: safeRect.top, docked: true }));
}
