import type { ScreenPoint } from "@/lib/explorer/globe-contract";
import type { OverlayRect } from "@/lib/explorer/cinematic/overlays";

export type JourneyPopupPlacement = { rect: OverlayRect; side: "above" | "right" | "left" | "below";
  leader: { from: ScreenPoint; to: ScreenPoint } };
type Options = { anchor: ScreenPoint | null; popupSize: { width: number; height: number }; safeRect: OverlayRect; occupied: readonly OverlayRect[] };
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
const overlaps = (a: OverlayRect, b: OverlayRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** All inputs/outputs are stage CSS pixels. The caller excludes its own prior rectangle. */
export function placeJourneyPopup({ anchor, popupSize, safeRect: safe, occupied }: Options): JourneyPopupPlacement | null {
  if (!anchor || ![anchor.x, anchor.y, ...Object.values(safe), popupSize.width, popupSize.height].every(Number.isFinite)) return null;
  const width = Math.min(380, popupSize.width), height = Math.min(440, popupSize.height, safe.bottom - safe.top);
  if (width < 320 || height < 180 || width > safe.right - safe.left) return null;
  const { x, y } = anchor;
  const candidates: [JourneyPopupPlacement["side"], number, number][] = [
    ["above", x - width / 2, y - height - 12], ["right", x + 12, y - height / 2],
    ["left", x - width - 12, y - height / 2], ["below", x - width / 2, y + 12],
  ];
  const pointBox = { left: x - 11.99, right: x + 11.99, top: y - 11.99, bottom: y + 11.99 };
  for (const [side, rawX, rawY] of candidates) {
    const left = clamp(rawX, safe.left, safe.right - width), top = clamp(rawY, safe.top, safe.bottom - height);
    const rect = { left, top, right: left + width, bottom: top + height };
    if (overlaps(rect, pointBox) || occupied.some(item => overlaps(rect, item))) continue;
    return { rect, side, leader: { from: { x: clamp(x, rect.left, rect.right), y: clamp(y, rect.top, rect.bottom) }, to: anchor } };
  }
  return null;
}
