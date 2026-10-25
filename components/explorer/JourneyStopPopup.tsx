"use client";

import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { JourneyPopupAnchor } from "@/lib/explorer/globe-contract";
import { placeJourneyPopup, type JourneyPopupPlacement } from "@/lib/explorer/journeys/popup-layout";

const OCCUPIED = ".home-map-intro, .journey-controls, .home-map-tools, .globe-attribution, .home-map-notice, .home-map-tile-error";
export function JourneyStopPopup({ anchor, mapAvailable, children, onReadingChange }: {
  anchor: JourneyPopupAnchor | null; mapAvailable: boolean; children: ReactNode; onReadingChange(active: boolean): void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const focusInside = useRef(false);
  const [placement, setPlacement] = useState<JourneyPopupPlacement | null>(null);
  const measure = useEffectEvent(() => {
    const shell = container.current?.closest<HTMLElement>(".home-history-map");
    if (!shell || !anchor?.point) { setPlacement(null); return; }
    const origin = shell.getBoundingClientRect();
    const rectOf = (element: Element) => {
      const r = element.getBoundingClientRect();
      return { left: r.left - origin.left - anchor.offset.x, right: r.right - origin.left - anchor.offset.x,
        top: r.top - origin.top - anchor.offset.y, bottom: r.bottom - origin.top - anchor.offset.y };
    };
    const header = shell.querySelector(".home-atlas-header"), rail = shell.querySelector(".journey-timeline");
    const safeRect = { left: 16, right: anchor.stageSize.width - 16, top: header ? rectOf(header).bottom + 16 : 16,
      bottom: rail ? rectOf(rail).top - 16 : anchor.stageSize.height - 16 };
    const occupied = Array.from(shell.querySelectorAll<HTMLElement>(OCCUPIED)).filter(el => el.checkVisibility()).map(rectOf);
    let next: JourneyPopupPlacement | null = null;
    for (const height of [440, 400, 360, 320, 280, 240, 200]) {
      next = placeJourneyPopup({ anchor: anchor.point, popupSize: { width: 360, height }, safeRect, occupied });
      if (next) break;
    }
    setPlacement(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
  });
  useEffect(() => { measure(); }, [anchor]);
  useEffect(() => {
    const shell = container.current?.closest(".home-history-map");
    if (!shell) return;
    const resize = new ResizeObserver(() => measure());
    const observed = new Set<Element>();
    const observe = () => {
      const targets = new Set([shell, ...shell.querySelectorAll(`${OCCUPIED}, .home-atlas-header, .journey-timeline`)]);
      for (const el of observed) if (!targets.has(el)) { resize.unobserve(el); observed.delete(el); }
      for (const el of targets) if (!observed.has(el)) { resize.observe(el); observed.add(el); }
      measure();
    };
    const mutation = new MutationObserver(records => {
      if (records.some(r => !(r.target instanceof Element && (r.target.closest(".journey-popup-host") || r.target.closest(".globe-overlay"))))) observe();
    });
    mutation.observe(shell, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    observe();
    return () => { resize.disconnect(); mutation.disconnect(); };
  }, []);
  const positioned = Boolean(anchor?.point && placement);
  const lastPositioned = useRef(positioned);
  useLayoutEffect(() => {
    const element = container.current;
    if (lastPositioned.current !== positioned && focusInside.current) {
      if (positioned) element?.querySelector<HTMLHeadingElement>("#journey-stop-heading")?.focus({ preventScroll: true });
      else element?.closest(".home-history-map")?.querySelector<HTMLButtonElement>(".journey-read-current")?.focus({ preventScroll: true });
    }
    lastPositioned.current = positioned;
  }, [positioned]);
  const offset = anchor?.offset ?? { x: 0, y: 0 };
  return <div className="journey-popup-host" ref={container} onFocusCapture={() => { focusInside.current = true; }}
    onBlurCapture={event => {
      focusInside.current = event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget);
      onReadingChange(focusInside.current || Boolean(container.current?.querySelector(".journey-sources[open]")));
    }}
    onPointerLeave={() => onReadingChange(focusInside.current || Boolean(container.current?.querySelector(".journey-sources[open]")))}>
    {positioned && placement && <svg className="journey-popup-leader" aria-hidden="true"><line
      x1={placement.leader.from.x + offset.x} y1={placement.leader.from.y + offset.y}
      x2={placement.leader.to.x + offset.x} y2={placement.leader.to.y + offset.y} /></svg>}
    {positioned && placement
      ? <section className="journey-popup" data-testid="journey-popup" aria-labelledby="journey-stop-heading"
        data-anchor-x={anchor?.point?.x} data-anchor-y={anchor?.point?.y}
        style={{ left: placement.rect.left + offset.x, top: placement.rect.top + offset.y, width: placement.rect.right - placement.rect.left, height: placement.rect.bottom - placement.rect.top }}>{children}</section>
      : <details className="journey-reader-fallback" data-testid="journey-reader-fallback" open={!mapAvailable}
        onToggle={event => onReadingChange(event.currentTarget.open || focusInside.current)}>
        <summary>{mapAvailable ? "Đọc thông tin mốc tại đây" : "Đọc thông tin mốc khi địa cầu chưa sẵn sàng"}</summary>
        <section aria-labelledby="journey-stop-heading">{children}</section>
      </details>}
  </div>;
}
