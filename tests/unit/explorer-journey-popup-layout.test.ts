import { describe, expect, it } from "vitest";
import { placeJourneyPopup } from "@/lib/explorer/journeys/popup-layout";

const safeRect = { left: 16, top: 76, right: 1264, bottom: 604 };
const popupSize = { width: 360, height: 280 };
const overlap = (a: typeof safeRect, b: typeof safeRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
describe("journey popup CSS geometry", () => {
  it("prefers above with a twelve-pixel gap and a leader to the actual point", () => {
    const result = placeJourneyPopup({ anchor: { x: 700, y: 420 }, popupSize, safeRect, occupied: [] })!;
    expect(result.side).toBe("above");
    expect(result.rect).toEqual({ left: 520, right: 880, top: 128, bottom: 408 });
    expect(result.leader.to).toEqual({ x: 700, y: 420 });
  });
  it.each([[20, 80], [1260, 80], [20, 600], [1260, 600], [700, 90], [700, 590]])("flips/clamps at edge %i,%i without covering the point", (x, y) => {
    const result = placeJourneyPopup({ anchor: { x, y }, popupSize, safeRect, occupied: [] })!;
    expect(result).not.toBeNull();
    expect(result.rect.left).toBeGreaterThanOrEqual(16);
    expect(result.rect.top).toBeGreaterThanOrEqual(76);
    expect(result.rect.right).toBeLessThanOrEqual(1264);
    expect(result.rect.bottom).toBeLessThanOrEqual(604);
    expect(overlap(result.rect, { left: x - 11, right: x + 11, top: y - 11, bottom: y + 11 })).toBe(false);
  });
  it("avoids occupied header, chooser, rail and tools", () => {
    const occupied = [{ left: 16, top: 76, right: 350, bottom: 500 }, { left: 480, top: 100, right: 700, bottom: 410 }];
    const result = placeJourneyPopup({ anchor: { x: 700, y: 420 }, popupSize, safeRect, occupied })!;
    expect(result.side).toBe("right");
    expect(occupied.some(rect => overlap(rect, result.rect))).toBe(false);
  });
  it("bounds oversized reading content to safe height", () => {
    const result = placeJourneyPopup({ anchor: { x: 700, y: 350 }, popupSize: { width: 360, height: 900 }, safeRect, occupied: [] })!;
    expect(result.rect.bottom - result.rect.top).toBeLessThanOrEqual(440);
  });
  it("returns fallback for unavailable anchors, unusable area or nonfinite geometry", () => {
    expect(placeJourneyPopup({ anchor: null, popupSize, safeRect, occupied: [] })).toBeNull();
    expect(placeJourneyPopup({ anchor: { x: NaN, y: 100 }, popupSize, safeRect, occupied: [] })).toBeNull();
    expect(placeJourneyPopup({ anchor: { x: 100, y: 100 }, popupSize, safeRect: { left: 16, top: 76, right: 250, bottom: 200 }, occupied: [] })).toBeNull();
  });
  it("keeps geometry stage-local so the rendering boundary can add the parent offset", () => {
    const input = { anchor: { x: 700, y: 420 }, popupSize, safeRect, occupied: [] };
    const result = placeJourneyPopup(input)!;
    const parentOffset = { x: 40, y: 60 };
    expect(result.rect.left + parentOffset.x).toBe(560);
    expect(result.leader.to.y + parentOffset.y).toBe(480);
    expect(result.rect.right - result.rect.left).toBe(360);
  });
});
