import Link from "next/link";
import { ChevronDown, MapPin } from "lucide-react";
import type { RefObject } from "react";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { buildMapEventHref, type MapExplorerState } from "@/lib/explorer/map-state";

type Props = { events: readonly ExplorerEvent[]; state: MapExplorerState | null; onSelect(slug: string): void; detailsRef: RefObject<HTMLDetailsElement | null> };

export function MapEventList({ events, state, onSelect, detailsRef }: Props) {
  return (
    <details className="home-map-list mt-4 border-t border-border pt-3" ref={detailsRef} data-testid="explorer-event-list">
      <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
        Danh sách sự kiện <span className="ml-auto text-accent" data-testid="explorer-event-count">{events.length}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </summary>
      <ul className="home-map-list-items mt-3 list-none divide-y divide-border" aria-label="Sự kiện trong khoảng thời gian đã chọn">
        {events.map((event) => (
          <li key={event.slug} className="py-3" data-testid="explorer-event-item">
            <span className="text-xs font-semibold text-accent">{event.dateText || event.startYear}</span>
            <h2 className="mt-1 font-serif text-sm font-bold leading-snug">
              <Link href={buildMapEventHref(event.slug, state)} className="text-foreground underline-offset-4 hover:underline" data-testid="explorer-event-link">{event.title}</Link>
            </h2>
            <button type="button" onClick={() => onSelect(event.slug)} data-event-slug={event.slug}
              className="mt-2 flex items-center gap-1 text-xs font-medium text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              <MapPin size={13} aria-hidden="true" /> Xem tóm tắt trên bản đồ
            </button>
            {event.locations.every((location) => location.latitude === null || location.longitude === null) && (
              <p className="mt-1 text-xs text-muted-foreground">Chưa có tọa độ để đánh dấu.</p>
            )}
          </li>
        ))}
        {events.length === 0 && <li className="py-3 text-sm text-muted-foreground">Chưa có sự kiện phù hợp.</li>}
      </ul>
    </details>
  );
}
