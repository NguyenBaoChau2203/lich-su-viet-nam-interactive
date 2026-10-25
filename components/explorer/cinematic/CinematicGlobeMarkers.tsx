"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { CinematicScene } from "@/lib/explorer/cinematic/scene";
import { buildOverlayLayout, type CuratedPlaceLabel, type OverlayLayout } from "@/lib/explorer/cinematic/overlays";
import { getEventMapAnchors } from "@/lib/explorer/map-markers";
import type { ExplorerEvent } from "@/lib/explorer/types";
import type { JourneyStop } from "@/lib/explorer/journey";

type Props = {
  scene: CinematicScene | null;
  stageRef: RefObject<HTMLDivElement | null>;
  events: readonly ExplorerEvent[];
  labels: readonly CuratedPlaceLabel[];
  selectedEvent: string | null;
  stop: JourneyStop | null;
  onSelect(events: readonly ExplorerEvent[]): void;
};

/** Prototype adapter only. Reuses public anchor/group semantics without importing MapLibre visibility internals. */
export function CinematicGlobeMarkers({ scene, stageRef, events, labels, selectedEvent, stop, onSelect }: Props) {
  const anchors = useMemo(() => getEventMapAnchors(events), [events]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState<OverlayLayout>({ groups: [], labels: [], stop: null });
  useEffect(() => {
    const stage = stageRef.current;
    if (!scene || !stage) return;
    let active = true;
    const update = () => {
      if (!active || !measureRef.current) return;
      const stageRect = stage.getBoundingClientRect();
      // All current readers/controls, including expanded details and the currently selected card.
      // DOM rectangles and the viewport projection are converted to the SAME stage CSS origin.
      const occupied = Array.from(stage.querySelectorAll<HTMLElement>("[data-cg-occupied]")).map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - stageRect.left, right: rect.right - stageRect.left,
          top: rect.top - stageRect.top, bottom: rect.bottom - stageRect.top };
      });
      setLayout(buildOverlayLayout({ viewport: scene.getViewport(), anchors,
        labels: scene.getView().zoom >= 3 ? labels : [], occupied, selectedEvent, stop,
        measure(text) {
          const element = measureRef.current!;
          element.textContent = text;
          const rect = element.getBoundingClientRect();
          return { width: rect.width, height: rect.height };
        },
      }));
    };
    const unsubscribe = scene.subscribe(update);
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    stage.querySelectorAll("[data-cg-occupied]").forEach((element) => observer.observe(element));
    const frame = requestAnimationFrame(update);
    void document.fonts.ready.then(() => { if (active) update(); });
    return () => { active = false; unsubscribe(); observer.disconnect(); cancelAnimationFrame(frame); };
  }, [scene, stageRef, anchors, labels, selectedEvent, stop]);

  const text = (label: string, box: { left: number; top: number }) => (
    <span className="cg-overlay-text" data-cg-label="" aria-hidden="true" style={{ left: box.left, top: box.top }}>{label}</span>
  );
  return <div className="cg-overlay">
    <span ref={measureRef} className="cg-overlay-text cg-label-measure" aria-hidden="true" />
    {scene && layout.groups.map((group) => {
      const entries = [...new Map(group.anchors.map((anchor) => [anchor.event.slug, anchor.event])).values()];
      const approximate = group.anchors.some((anchor) => anchor.location.accuracyLevel !== "exact");
      const description = entries.length === 1 ? entries[0].title : `${entries.length} sự kiện tại khu vực này`;
      return <div key={group.key}>
        <button type="button" className={`cg-event-marker${approximate ? " is-approximate" : ""}`}
          data-cg-anchor={group.key} data-approximate={approximate} data-event-slugs={entries.map((event) => event.slug).join("|")}
          style={{ left: group.x, top: group.y }} aria-label={`${description}${approximate ? " · Vị trí gần đúng" : ""}`}
          aria-pressed={entries.some((event) => event.slug === selectedEvent)}
          title={`${description}${approximate ? " · Vị trí gần đúng" : ""}`}
          onClick={() => onSelect(entries)}><span>{entries.length > 1 ? entries.length : ""}</span></button>
        {group.labelBox && text(group.label, group.labelBox)}
      </div>;
    })}
    {scene && layout.labels.map((label) => <div key={label.id}>{text(label.name, label.box)}</div>)}
    {scene && layout.stop && <div aria-hidden="true">
      <span className="cg-journey-pin" data-cg-stop={stop?.id} style={{ left: layout.stop.x, top: layout.stop.y }} />
      {layout.stop.labelBox && text(layout.stop.label, layout.stop.labelBox)}
    </div>}
  </div>;
}
