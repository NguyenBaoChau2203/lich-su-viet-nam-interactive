"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { LocalityOverviewData } from "@/lib/locality/overview";
import { placeLocalityCards, visibleLocalityCardRects, type CardSize, type Rect } from "@/lib/locality/popup-layout";
import { localityAnchorFor, localityPresentationBoundsFor, type LocalityProjectionChannel } from "@/lib/locality/projection";
import { LocalityPreviewCard } from "./LocalityPreviewCard";
import { LocalityConnectors } from "./LocalityConnectors";

type Props = {
  localityCode: LocalityCode; nonce: number; projection: LocalityProjectionChannel; overview: LocalityOverviewData;
  mode: "locality" | "places" | "people"; homeHref: string; placesHref: string; peopleHref: string;
  selectedPlace: boolean; onClear(): void; onClosePlace(): void; onRetryPlaces(): void; onRetryPeople(): void;
  onViewAll(mode: "places" | "people"): void;
};
const modified = (e: MouseEvent) => e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
const serverSnapshot = () => null;
type Measurements = { width: number; height: number; safeRect: Rect; occupied: Rect[]; sizes: CardSize[] };

/** At most four HTML previews; keeps data/focus separate from camera frames. */
export function LocalityCardCluster(props: Props) {
  const { localityCode, nonce, projection, overview, mode } = props;
  const root = useRef<HTMLDivElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const [measurements, setMeasurements] = useState<Measurements | null>(null);
  const [dockPosition, setDockPosition] = useState({ code: localityCode, top: 0 });
  const dockScroll = dockPosition.code === localityCode ? dockPosition.top : 0;
  const projected = useSyncExternalStore(projection.subscribe, projection.getSnapshot, serverSnapshot);
  const anchor = localityAnchorFor(projected, localityCode, nonce);
  const name = LOCALITIES.find((l) => l.code === localityCode)?.officialName ?? "Địa phương";

  const sections = useMemo(() => {
    const groups: { kind: "places" | "people"; label: string; cards: { key: string; node: ReactNode }[] }[] = [];
    if (mode !== "people") {
      const section = overview.places;
      groups.push({ kind: "places", label: "Địa danh lịch sử", cards: section.status === "ready" && section.items.length
        ? section.items.map((item) => ({ key: `place:${item.slug}`, node: <LocalityPreviewCard kind="place" item={item} homeHref={props.homeHref} selected={props.selectedPlace} /> }))
        : [{ key: `places:${section.status}`, node: <div className="locality-section-status" role={section.status === "error" ? "alert" : "status"}>
          <h3>Địa danh lịch sử</h3><p>{section.status === "error" ? section.error : section.status === "loading" ? "Đang tải địa danh…" : "Chưa có địa danh đã được thẩm định. Điều này không có nghĩa địa phương không có di tích lịch sử."}</p>
          {section.status === "error" && <button type="button" onClick={props.onRetryPlaces}>Thử lại địa danh</button>}</div> }] });
    }
    if (mode !== "places") {
      const section = overview.people;
      groups.push({ kind: "people", label: "Nhân vật gắn với địa phương", cards: section.status === "ready" && section.items.length
        ? section.items.map((item) => ({ key: `person:${item.slug}`, node: <LocalityPreviewCard kind="person" item={item} localityCode={localityCode} homeHref={props.homeHref} /> }))
        : [{ key: `people:${section.status}`, node: <div className="locality-section-status" role={section.status === "error" ? "alert" : "status"}>
          <h3>Nhân vật gắn với địa phương</h3><p>{section.status === "error" ? section.error : section.status === "loading" ? "Đang tải nhân vật…" : "Chưa có hồ sơ đã được thẩm định. Điều này không có nghĩa địa phương không có nhân vật cách mạng."}</p>
          {section.status === "error" && <button type="button" onClick={props.onRetryPeople}>Thử lại nhân vật</button>}</div> }] });
    }
    return groups;
  }, [mode, overview, localityCode, props.homeHref, props.selectedPlace, props.onRetryPeople, props.onRetryPlaces]);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const cards = root.current?.querySelector(".locality-cluster-cards");
    if (cards) cards.scrollTop = 0;
  }, [localityCode]);
  useLayoutEffect(() => {
    const element = root.current, explorer = element?.closest<HTMLElement>(".home-history-map");
    if (!element || !explorer) return;
    const read = () => {
      const origin = explorer.getBoundingClientRect();
      const relative = (node: Element): Rect => { const r = node.getBoundingClientRect(); return { left: r.left - origin.left, top: r.top - origin.top, right: r.right - origin.left, bottom: r.bottom - origin.top }; };
      const shell = explorer.querySelector<HTMLElement>(".locality-chooser"), header = explorer.querySelector(".home-atlas-header");
      // Skip a hidden/zero-area chooser so cards reclaim the freed left column.
      const shellRect = shell && !shell.hidden && shell.getClientRects().length ? relative(shell) : null;
      const top = (header ? relative(header).bottom : 60) + 16;
      const titleLeft = shellRect ? shellRect.right + 16 : 16;
      element.style.setProperty("--cluster-title-left", `${titleLeft}px`);
      element.style.setProperty("--cluster-title-top", `${top}px`);
      const title = element.querySelector(".locality-cluster-heading");
      const titleBottom = title ? relative(title).bottom : top + 76;
      const safeRect = { left: 16, right: origin.width - 16, top: titleBottom + 12, bottom: origin.height - 88 };
      const occupied = [
        shellRect,
        title ? relative(title) : null,
        ...Array.from(explorer.querySelectorAll(".home-map-tools, .globe-attribution, .locality-globe-marker.is-selected, .home-atlas-header")).map(relative),
      ].filter((r): r is Rect => Boolean(r));
      const sizes = Array.from(element.querySelectorAll<HTMLElement>("[data-locality-card-key]")).map((node) => ({
        key: node.dataset.localityCardKey!, width: Math.min(260, Math.max(180, origin.width - titleLeft - 16)), height: node.getBoundingClientRect().height,
      }));
      const next = { width: origin.width, height: origin.height, safeRect, occupied, sizes };
      setMeasurements((prev) => JSON.stringify(prev) === JSON.stringify(next) ? prev : next);
    };
    read();
    // Camera approach moves the selected HTML marker after first paint; re-read so occupied stays truthful.
    const frame = requestAnimationFrame(() => read());
    const unsub = projection.subscribe(() => { read(); requestAnimationFrame(read); });
    const observer = new ResizeObserver(read);
    observer.observe(explorer);
    for (const node of explorer.querySelectorAll(".locality-chooser, .home-atlas-header, .home-map-tools, .globe-attribution, .locality-cluster-heading, .locality-globe-marker.is-selected, [data-locality-card-key]")) observer.observe(node);
    return () => { cancelAnimationFrame(frame); unsub(); observer.disconnect(); };
  }, [sections, projection, localityCode, nonce, projected?.point?.x, projected?.point?.y, projected?.presentationBounds?.left, projected?.presentationBounds?.right, projected?.presentationBounds?.top, projected?.presentationBounds?.bottom]);

  // Prefer source-derived raised-area bounds when kind is province-area; otherwise fall back to the anchor.
  const markerRect = localityPresentationBoundsFor(projected, localityCode, nonce)
    ?? (anchor ? { left: anchor.x - 36, right: anchor.x + 36, top: anchor.y - 36, bottom: anchor.y + 36 } : null);
  const placements = measurements ? placeLocalityCards({ ...measurements, selectedBounds: markerRect, cardSizes: measurements.sizes }) : [];
  const docked = !placements.length || placements.some((p) => p.docked);
  const dock = placements[0];
  const dockStyle: CSSProperties | undefined = dock && measurements ? { left: dock.left, top: dock.top, width: dock.width, maxHeight: Math.max(80, measurements.safeRect.bottom - dock.top) } : undefined;
  const targets = measurements ? visibleLocalityCardRects(placements, measurements.safeRect.bottom, docked ? dockScroll : 0) : [];

  return <div ref={root} className={`locality-card-cluster${docked ? " is-docked" : ""}`} role="region" aria-labelledby="locality-selection-heading" data-testid="locality-card-cluster" data-locality-code={localityCode} data-projection-kind={projected?.kind ?? "unavailable"}>
    {measurements && <LocalityConnectors anchor={anchor} targets={targets} width={measurements.width} height={measurements.height} />}
    <div className="locality-cluster-heading">
      <div><h2 id="locality-selection-heading" ref={heading} tabIndex={-1}>{name}</h2>
        <button type="button" onClick={props.selectedPlace ? props.onClosePlace : props.onClear} aria-label={props.selectedPlace ? "Đóng thông tin địa danh" : `Bỏ chọn ${name}`}>×</button></div>
      <p>Liên kết nội dung theo địa phương · vị trí tham chiếu</p>
      <nav aria-label="Toàn bộ nội dung địa phương">
        <a href={props.placesHref} data-testid="locality-view-all-places" onClick={(e) => { if (!modified(e)) { e.preventDefault(); props.onViewAll("places"); } }}>Xem tất cả địa danh{overview.places.status === "ready" ? ` (${overview.places.total})` : ""}</a>
        <a href={props.peopleHref} data-testid="locality-view-all-people" onClick={(e) => { if (!modified(e)) { e.preventDefault(); props.onViewAll("people"); } }}>Xem tất cả nhân vật{overview.people.status === "ready" ? ` (${overview.people.total})` : ""}</a>
      </nav>
    </div>
    <div className="locality-cluster-cards" style={docked ? dockStyle : undefined} onScroll={(event) => setDockPosition({ code: localityCode, top: event.currentTarget.scrollTop })}>
      {sections.map((section) => <section className="locality-cluster-section" key={section.kind} aria-label={section.label} data-testid={`locality-${section.kind}-section`}>
        <h3 className="sr-only">{section.label}</h3>
        {section.cards.map((card, index) => {
          const placement = placements.find((p) => p.key === card.key);
          const style = !docked && placement ? { left: placement.left, top: placement.top, width: placement.width } : undefined;
          return <div key={card.key} data-locality-card-key={card.key} className="locality-cluster-card" style={{ ...style, "--card-delay": `${index * 40}ms` } as CSSProperties}>{card.node}</div>;
        })}
      </section>)}
    </div>
  </div>;
}
