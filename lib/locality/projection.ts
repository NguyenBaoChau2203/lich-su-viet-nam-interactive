import type { LocalityProjection, ScreenPoint } from "@/lib/explorer/globe-contract";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { Rect } from "@/lib/locality/popup-layout";

export function localityAnchorFor(projection: LocalityProjection | null, code: LocalityCode, nonce: number): ScreenPoint | null {
  if (!projection || projection.code !== code || projection.nonce !== nonce || !projection.point) return null;
  const { point, stageSize, offset } = projection;
  if (![point.x, point.y, offset.x, offset.y, stageSize.width, stageSize.height].every(Number.isFinite) ||
    point.x < 0 || point.y < 0 || point.x > stageSize.width || point.y > stageSize.height) return null;
  return { x: point.x + offset.x, y: point.y + offset.y };
}

export function localityPresentationBoundsFor(projection: LocalityProjection | null, code: LocalityCode, nonce: number): Rect | null {
  if (!localityAnchorFor(projection, code, nonce) || !projection?.presentationBounds) return null;
  const rect = projection.presentationBounds, offset = projection.offset;
  if (![rect.left, rect.right, rect.top, rect.bottom].every(Number.isFinite) || rect.right <= rect.left || rect.bottom <= rect.top) return null;
  return { left: rect.left + offset.x - 6, top: rect.top + offset.y - 6, right: rect.right + offset.x + 6, bottom: rect.bottom + offset.y + 6 };
}

/** Camera frames update the cluster, never the explorer/history owner. */
export function createLocalityProjectionChannel() {
  let snapshot: LocalityProjection | null = null;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
    publish(next: LocalityProjection | null) {
      if (next === snapshot) return;
      snapshot = next;
      listeners.forEach((listener) => listener());
    },
  };
}
export type LocalityProjectionChannel = ReturnType<typeof createLocalityProjectionChannel>;
