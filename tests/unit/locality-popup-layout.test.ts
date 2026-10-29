import { describe, expect, it } from "vitest";
import { placeLocalityCards, visibleLocalityCardRects, type Rect } from "@/lib/locality/popup-layout";

const overlaps = (a: Rect, b: Rect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

describe("locality card placement", () => {
  it("connects only visible portions of docked cards while the column scrolls", () => {
    const cards = [0, 1, 2].map((key) => ({ key: String(key), left: 1000, top: 170, width: 260, height: 200, docked: true }));
    expect(visibleLocalityCardRects(cards, 600, 212)).toEqual([
      { left: 1000, top: 170, right: 1260, bottom: 370 },
      { left: 1000, top: 382, right: 1260, bottom: 582 },
    ]);
  });
  for (const [width, height] of [[1280, 720], [1366, 768], [1440, 900], [1920, 1080]]) {
    it(`keeps measured cards, selection and occupied controls separate at ${width}×${height}`, () => {
      const safeRect = { left: 16, top: 76, right: width - 16, bottom: height - 88 };
      const occupied = [{ left: 16, top: 76, right: 376, bottom: height - 24 }];
      const selectedBounds = { left: width / 2 - 40, top: height / 2 - 40, right: width / 2 + 40, bottom: height / 2 + 40 };
      const cardSizes = [0, 1, 2, 3].map((key) => ({ key: String(key), width: 250, height: 260 }));
      const placements = placeLocalityCards({ safeRect, occupied, selectedBounds, cardSizes });
      expect(placements).toHaveLength(4);
      if (placements.some((p) => p.docked)) {
        // A scroll column shares one safe viewport; children scroll in normal flow.
        expect(placements.every((p) => p.docked)).toBe(true);
        expect(placements[0].left).toBeGreaterThanOrEqual(occupied[0].right);
      } else {
        const boxes = placements.map((p) => ({ left: p.left, top: p.top, right: p.left + p.width, bottom: p.top + p.height }));
        for (let i = 0; i < boxes.length; i++) {
          const box = boxes[i];
          expect(box.left).toBeGreaterThanOrEqual(safeRect.left);
          expect(box.top).toBeGreaterThanOrEqual(safeRect.top);
          expect(box.right).toBeLessThanOrEqual(safeRect.right);
          expect(box.bottom).toBeLessThanOrEqual(safeRect.bottom);
          expect([...occupied, selectedBounds].some((r) => overlaps(r, box))).toBe(false);
          expect(boxes.slice(i + 1).some((r) => overlaps(r, box))).toBe(false);
        }
      }
      expect(placeLocalityCards({ safeRect, occupied, selectedBounds, cardSizes })).toEqual(placements);
    });
  }
  it("docks long measured text and unavailable anchors without losing any cards", () => {
    const placements = placeLocalityCards({ safeRect: { left: 384, top: 76, right: 624, bottom: 272 }, occupied: [], selectedBounds: null,
      cardSizes: [0, 1, 2, 3].map((key) => ({ key: String(key), width: 260, height: 600 })) });
    expect(placements.map((p) => p.key)).toEqual(["0", "1", "2", "3"]);
    expect(placements.every((p) => p.docked && p.width <= 240 && p.left >= 384)).toBe(true);
  });
  it("handles an empty collection without an animation or placeholder", () => {
    expect(placeLocalityCards({ safeRect: { left: 0, top: 0, right: 1280, bottom: 720 }, occupied: [], selectedBounds: null, cardSizes: [] })).toEqual([]);
  });
});
