import L from "leaflet";
import { useMemo, useState } from "react";
import { Marker, Popup, Tooltip, useMapEvents } from "react-leaflet";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { getEventMapAnchors, groupMapAnchors } from "@/lib/explorer/map-markers";

type Props = { events: readonly ExplorerEvent[]; selectedEvent: string | null; onSelect(slug: string): void };

export function EventMapMarkers({ events, selectedEvent, onSelect }: Props) {
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((value) => value + 1);
  const map = useMapEvents({ moveend: refresh, zoomend: refresh, resize: refresh });
  const anchors = useMemo(() => getEventMapAnchors(events), [events]);
  const groups = useMemo(() => {
    // Projection changes with zoom and pan; update only when navigation settles.
    void revision;
    return groupMapAnchors(anchors.map((anchor) => {
      const point = map.latLngToContainerPoint([anchor.location.latitude, anchor.location.longitude]);
      return { ...anchor, x: point.x, y: point.y };
    }));
  }, [anchors, map, revision]);

  return groups.map((group) => {
    const unique = [...new Map(group.anchors.map((anchor) => [anchor.event.slug, anchor.event])).values()];
    const selected = group.anchors.some((anchor) => anchor.event.slug === selectedEvent);
    const approximate = group.anchors.some((anchor) => anchor.location.accuracyLevel !== "exact");
    const multiple = unique.length > 1;
    const label = multiple ? `${unique.length} sự kiện tại khu vực này` : unique[0].title;
    const icon = L.divIcon({
      className: `home-event-marker${multiple ? " is-cluster" : ""}${selected ? " is-selected" : ""}${approximate ? " is-approximate" : ""}`,
      html: multiple ? `<span>${unique.length}</span>` : '<span aria-hidden="true"></span>',
      iconSize: multiple ? [36, 36] : [24, 24], iconAnchor: multiple ? [18, 18] : [12, 12],
    });
    return (
      <Marker key={group.key} position={map.containerPointToLatLng([group.x, group.y])} icon={icon} title={label} alt={label}
        eventHandlers={multiple ? undefined : { click: () => onSelect(unique[0].slug) }}>
        <Tooltip direction="top" offset={[0, -12]}>{label}</Tooltip>
        {multiple && <Popup minWidth={230} maxWidth={320}>
          <h2 className="font-serif text-base font-bold">{unique.length} sự kiện tại khu vực này</h2>
          <ul className="mt-2 max-h-52 space-y-2 overflow-y-auto">
            {unique.map((event) => <li key={event.slug}><button type="button" className="text-left text-sm font-semibold underline underline-offset-2"
              onClick={() => { map.closePopup(); onSelect(event.slug); }}>{event.title}<span className="block text-xs font-normal">{event.dateText}</span></button></li>)}
          </ul>
          <button type="button" className="mt-3 text-xs font-bold underline" onClick={() => {
            const bounds = L.latLngBounds(group.anchors.map((anchor) => [anchor.location.latitude, anchor.location.longitude]));
            map.fitBounds(bounds, { maxZoom: Math.min(18, map.getZoom() + 2), padding: [120, 150], animate: false });
            map.closePopup();
          }}>Phóng to khu vực</button>
        </Popup>}
      </Marker>
    );
  });
}
