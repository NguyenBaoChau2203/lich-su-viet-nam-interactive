"use client";

import { useEffect, useEffectEvent, useId, useMemo, useRef, useState, type RefObject } from "react";
import { buildOverlayLayout, type OverlayLayout, type OverlayRect } from "@/lib/explorer/cinematic/overlays";
import { buildClusterExpansion, getMapSafeArea, placeClusterPanel, type ClusterFocusRequest, type ExpandedMapAnchor } from "@/lib/explorer/cluster-expansion";
import { MAX_INTERACTIVE_ZOOM } from "@/lib/explorer/cinematic/camera";
import { getEventMapAnchors } from "@/lib/explorer/map-markers";
import type { GlobePlaceLabel, GlobeViewport } from "@/lib/explorer/globe-contract";
import type { ExplorerEvent } from "@/lib/explorer/types";
import type { JourneyStop } from "@/lib/explorer/journey";

export type EntityLabel = {
  one: string;
  many: string;
  regionLabel: string;
  closeLabel?: string;
};

const DEFAULT_ENTITY_LABEL: EntityLabel = {
  one: "sự kiện",
  many: "sự kiện",
  regionLabel: "Các sự kiện tại khu vực",
  closeLabel: "Đóng nhóm sự kiện",
};

type Props = {
  viewport: GlobeViewport; stageRef: RefObject<HTMLDivElement | null>;
  events: readonly ExplorerEvent[]; selectedEvent: string | null;
  labels: readonly GlobePlaceLabel[]; stop: JourneyStop | null;
  entityLabel?: EntityLabel;
  onSelect(slug: string): void; onFocusCluster(request: ClusterFocusRequest): Promise<"arrived" | "cancelled">;
  onReadStop?(): void;
};
const OCCUPIED = ".home-atlas-header, .home-map-intro, .home-map-guidance, .home-map-event-card, .journey-popup, .journey-controls, .journey-reader-fallback, .home-map-time, .journey-timeline, .home-map-tools, .globe-attribution, .home-map-notice, .home-map-tile-error, .globe-skip";
const targetBox = ({ x, y }: { x: number; y: number }): OverlayRect => ({ left: x - 20, right: x + 20, top: y - 20, bottom: y + 20 });
type MarkerLayout = OverlayLayout & {
  occupied: OverlayRect[]; panel: OverlayRect | null; expanded: ExpandedMapAnchor[];
  projection: GlobeViewport | null; openKey: string | null;
};

/** Semantic HTML overlays consume only CSS-pixel projection and geographic camera commands. */
export function GlobeMarkers({ viewport, stageRef, events, selectedEvent, labels, stop, entityLabel = DEFAULT_ENTITY_LABEL, onSelect, onFocusCluster, onReadStop }: Props) {
  const entity = entityLabel;
  const anchors = useMemo(() => getEventMapAnchors(events), [events]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const explanationId = useId();
  const revision = useRef(0);
  const focusExpanded = useRef(false);
  const [focusKeys, setFocusKeys] = useState<string[]>([]);
  const [layout, setLayout] = useState<MarkerLayout>({ groups: [], labels: [], stop: null, occupied: [], panel: null,
    expanded: [], projection: null, openKey: null });
  const [open, setOpen] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => () => { revision.current++; }, []);
  const measureLayout = useEffectEvent(() => {
    const stage = stageRef.current;
    const shell = stage?.closest(".home-history-map");
    if (!stage || !shell || !measureRef.current) return;
    const origin = stage.getBoundingClientRect();
    const measured = Array.from(shell.querySelectorAll<HTMLElement>(OCCUPIED)).flatMap((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width && rect.height && element.checkVisibility() ? [{ element, box: { left: rect.left - origin.left, right: rect.right - origin.left,
        top: rect.top - origin.top, bottom: rect.bottom - origin.top } }] : [];
    });
    // A popup is twelve pixels from the geographic point. Its rectangle blocks
    // labels, but must not hide that point through the marker's larger hit box.
    const occupied = measured.filter(item => !item.element.matches(".journey-popup")).map(item => item.box);
    const popupRects = measured.filter(item => item.element.matches(".journey-popup")).map(item => item.box);
    const options = { viewport, anchors, labels: viewport.zoom >= 3 ? labels : [], occupied, labelObstacles: popupRects, entityNoun: entity.many, selectedEvent, stop,
      measure(text: string) {
        const element = measureRef.current!;
        element.textContent = text;
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      },
    };
    const base = buildOverlayLayout(options);
    const group = base.groups.find(group => group.key === open);
    const panel = group ? placeClusterPanel(group, viewport, [...occupied, ...base.groups.map(targetBox)]) : null;
    const expansion = expanded && group && panel ? buildClusterExpansion(group.anchors, viewport,
      [...occupied, panel, ...base.groups.map(targetBox)]).markers : [];
    const next = panel ? buildOverlayLayout({ ...options, labelObstacles: [...popupRects, panel, ...expansion.map(targetBox)] }) : base;
    setLayout({ ...next, panel, expanded: expansion, occupied, projection: viewport, openKey: open });
  });
  useEffect(() => {
    const stage = stageRef.current;
    const shell = stage?.closest(".home-history-map");
    if (!stage || !shell) return;
    let active = true;
    const update = () => { if (active) measureLayout(); };
    // The viewport changes every flight frame. Keep native subscriptions for
    // the mounted overlay, and read current layout inputs in the Effect Event.
    const resize = new ResizeObserver(update);
    const observed = new Set<Element>();
    const observe = () => {
      const targets = new Set<Element>([stage, ...shell.querySelectorAll(OCCUPIED)]);
      for (const element of observed) if (!targets.has(element)) { resize.unobserve(element); observed.delete(element); }
      for (const element of targets) if (!observed.has(element)) { resize.observe(element); observed.add(element); }
      update();
    };
    const mutation = new MutationObserver((records) => {
      // Measuring text changes this overlay's own DOM. Only external shell
      // changes should trigger another measurement; otherwise it feeds itself.
      if (records.some((record) => {
        const el = record.target instanceof Element ? record.target : record.target.parentElement;
        return !el || !el.closest(".globe-overlay");
      })) observe();
    });
    mutation.observe(shell, { childList: true, subtree: true, attributes: true, attributeFilter: ["open"] });
    observe();
    void document.fonts.ready.then(() => { if (active) update(); });
    return () => { active = false; resize.disconnect(); mutation.disconnect(); };
  }, [stageRef]);
  useEffect(() => {
    measureLayout();
  }, [viewport, stageRef, anchors, labels, stop, selectedEvent, open, expanded]);

  useEffect(() => {
    if (layout.projection !== viewport) return;
    if (focusExpanded.current && layout.expanded.length && layout.openKey === open) {
      overlayRef.current?.querySelector<HTMLButtonElement>(".globe-expanded-marker")?.focus({ preventScroll: true });
      focusExpanded.current = false;
    }
    if (focusKeys.length) {
      const marker = Array.from(overlayRef.current?.querySelectorAll<HTMLButtonElement>(".home-event-marker:not(.globe-expanded-marker)") ?? [])
        .find(button => button.dataset.anchorKeys?.split("|").some(key => focusKeys.includes(key)));
      const active = document.activeElement;
      if (marker && (active === document.body || active === stageRef.current?.querySelector("canvas"))) marker.focus({ preventScroll: true });
      if (marker) setFocusKeys([]);
    }
  }, [layout, viewport, open, focusKeys, stageRef]);

  function closeCluster(focus = true) {
    revision.current++;
    focusExpanded.current = false;
    if (focus) {
      const marker = Array.from(overlayRef.current?.querySelectorAll<HTMLButtonElement>(".home-event-marker:not(.globe-expanded-marker)") ?? [])
        .find(button => button.dataset.anchorKeys === open);
      (marker ?? stageRef.current?.querySelector<HTMLCanvasElement>("canvas"))?.focus({ preventScroll: true });
    }
    setOpen(null); setExpanded(false);
  }
  const text = (label: string, box: { left: number; top: number }) => <span className="globe-overlay-text" data-globe-label="" aria-hidden="true" style={{ left: box.left, top: box.top }}>{label}</span>;

  return <div className="globe-overlay" ref={overlayRef} onKeyDown={(event) => {
    if (event.key === "Escape" && open) { event.stopPropagation(); closeCluster(); }
  }}>
    <span ref={measureRef} className="globe-overlay-text globe-label-measure" aria-hidden="true" />
    {layout.labels.map((label) => <div key={label.id}>{text(label.name, label.box)}</div>)}
    {open && expanded && layout.openKey === open && <>
      <svg className="globe-cluster-leaders" width={viewport.width} height={viewport.height} aria-hidden="true">
        {layout.expanded.map(marker => <line key={marker.key} x1={marker.anchor.x} y1={marker.anchor.y} x2={marker.x} y2={marker.y} />)}
      </svg>
      {layout.expanded.map((marker, index) => <div className="globe-event-position" key={marker.key} style={{ left: marker.x, top: marker.y, zIndex: 10 }}>
        <button type="button" className={`home-event-marker globe-expanded-marker${marker.event.slug === selectedEvent ? " is-selected" : ""}${marker.location.accuracyLevel !== "exact" ? " is-approximate" : ""}`}
          title={marker.event.title} aria-label={`${marker.event.title} · ${marker.location.historicalName || marker.location.name}${marker.location.accuracyLevel !== "exact" ? " · Vị trí gần đúng" : ""}`}
          aria-describedby={explanationId} aria-pressed={marker.event.slug === selectedEvent}
          data-event-slugs={marker.event.slug} data-anchor-keys={marker.key} data-approximate={marker.location.accuracyLevel !== "exact"}
          data-anchor-lat={marker.location.latitude} data-anchor-lng={marker.location.longitude}
          onClick={() => onSelect(marker.event.slug)}><span>{index + 1}</span></button>
      </div>)}
    </>}
    {layout.groups.map((group) => {
      const entries = [...new Map(group.anchors.map((anchor) => [anchor.event.slug, anchor.event])).values()];
      const single = group.anchors.length === 1; const selected = entries.some((event) => event.slug === selectedEvent);
      const approximate = group.anchors.some((anchor) => anchor.location.accuracyLevel !== "exact");
      const description = entries.length === 1 ? `${entries[0].title}${single ? "" : ` · ${group.anchors.length} địa điểm`}` : `${entries.length} ${entity.many} tại khu vực này`;
      const popupHeight = Math.min(260, viewport.height - 160);
      return <div key={group.key}>
        {group.labelBox && text(group.label, group.labelBox)}
        <div className="globe-event-position" style={{ left: group.x, top: group.y, zIndex: open === group.key ? 40 : 5 }}>
          <button type="button" title={description} aria-label={`${description}${approximate ? " · Vị trí gần đúng" : ""}`}
            aria-pressed={selected} aria-expanded={single ? undefined : open === group.key}
            data-event-slugs={entries.map((event) => event.slug).join("|")} data-approximate={approximate} data-anchor-keys={group.key}
            className={`home-event-marker${single ? "" : " is-cluster"}${selected ? " is-selected" : ""}${approximate ? " is-approximate" : ""}`}
            onClick={() => {
              if (single) { onSelect(entries[0].slug); return; }
              if (open === group.key) { closeCluster(); return; }
              revision.current++; setOpen(group.key);
              const coincident = new Set(group.anchors.map(anchor => `${anchor.location.latitude},${anchor.location.longitude}`)).size === 1;
              setExpanded(viewport.zoom >= MAX_INTERACTIVE_ZOOM || coincident);
              focusExpanded.current = viewport.zoom >= MAX_INTERACTIVE_ZOOM || coincident;
            }}><span>{single ? "" : entries.length === 1 ? group.anchors.length : entries.length}</span></button>
          {!single && open === group.key && layout.openKey === open && layout.panel && <div className="globe-cluster" style={{ bottom: "auto", top: layout.panel.top - group.y,
            maxHeight: Math.min(popupHeight, layout.panel.bottom - layout.panel.top), width: layout.panel.right - layout.panel.left, left: layout.panel.left - group.x }} role="region" aria-label={entity.regionLabel}>
            <button type="button" className="globe-cluster-close" onClick={() => closeCluster()} aria-label={entity.closeLabel ?? `Đóng nhóm ${entity.many}`}>×</button>
            {expanded && <p className="globe-cluster-note" id={explanationId}>Các mốc gần nhau được tách để chọn; đường nối chỉ về vị trí gốc. Danh sách bên dưới giữ đủ sự kiện.</p>}
            <ul>{entries.map((event) => <li key={event.slug}><button type="button" onClick={() => { if (!expanded) closeCluster(); onSelect(event.slug); }}>
              {expanded && <span className="globe-cluster-entry-index" aria-hidden="true">{layout.expanded.flatMap((marker, index) => marker.event.slug === event.slug ? [index + 1] : []).join(", ")}</span>}
              {event.dateText || event.startYear} · {event.title}</button></li>)}</ul>
            {!expanded && <button type="button" className="globe-cluster-zoom" onClick={() => { setExpanded(true); focusExpanded.current = true; }}>Tách các mốc để chọn</button>}
            <button type="button" className="globe-cluster-zoom" onClick={async () => {
              const keys = group.anchors.map(anchor => anchor.key);
              closeCluster(false);
              stageRef.current?.querySelector("canvas")?.focus({ preventScroll: true });
              const ownRevision = revision.current;
              const result = await onFocusCluster({ locations: group.anchors.map(({ location }) => ({ lat: location.latitude, lng: location.longitude })),
                safeArea: getMapSafeArea(viewport, layout.occupied) });
              // Arrival can resolve before the scene publishes its final draw.
              // Wait for that draw so focus cannot land on a disappearing group.
              if (result === "arrived") await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
              if (result === "arrived" && ownRevision === revision.current) setFocusKeys(keys);
            }}>Phóng to khu vực</button>
          </div>}
        </div>
      </div>;
    })}
    {stop && layout.stop && <div>
      <button type="button" className="globe-journey-pin" aria-label={`Đọc mốc: ${stop.title}`} onClick={onReadStop} style={{ position: "absolute", left: layout.stop.x, top: layout.stop.y, pointerEvents: "auto" }} />
      {layout.stop.labelBox && text(layout.stop.label, layout.stop.labelBox)}
    </div>}
  </div>;
}
