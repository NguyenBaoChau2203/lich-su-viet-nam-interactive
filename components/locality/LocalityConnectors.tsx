"use client";

import type { ScreenPoint } from "@/lib/explorer/globe-contract";
import type { Rect } from "@/lib/locality/popup-layout";

export function LocalityConnectors({ anchor, targets, width, height }: { anchor: ScreenPoint | null; targets: readonly Rect[]; width: number; height: number }) {
  if (!anchor) return null;
  return <svg className="locality-connectors" width={width} height={height} aria-hidden="true" focusable="false" data-testid="locality-connectors">
    {targets.map((box, index) => {
      const x = anchor.x < box.left ? box.left : anchor.x > box.right ? box.right : Math.max(box.left, Math.min(box.right, anchor.x));
      const y = Math.max(box.top + 8, Math.min(box.bottom - 8, anchor.y));
      return <path key={index} d={`M ${anchor.x} ${anchor.y} L ${x} ${y}`} vectorEffect="non-scaling-stroke" />;
    })}
  </svg>;
}
