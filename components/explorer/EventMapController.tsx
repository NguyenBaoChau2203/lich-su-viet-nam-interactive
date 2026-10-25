import { useEffect } from "react";
import { Minus, Plus, Scan } from "lucide-react";
import { useMap, useMapEvents } from "react-leaflet";
import type { LatLngBoundsExpression } from "leaflet";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { getEventMapAnchors } from "@/lib/explorer/map-markers";
import { parseMapView, type MapView } from "@/lib/explorer/map-view";

// Initial camera framing only; this does not define historical or territorial boundaries.
export const VIETNAM_MAP_BOUNDS: LatLngBoundsExpression = [[8.1, 102], [23.6, 110.5]];
type Props = { view: MapView | null; allEvents: readonly ExplorerEvent[]; focusRequest: { slug: string; nonce: number } | null; onViewChange(view: MapView): void };

export function EventMapController({ view, allEvents, focusRequest, onViewChange }: Props) {
  const map = useMap();
  useMapEvents({
    moveend() {
      const center = map.getCenter().wrap();
      const next = parseMapView(`${center.lat},${center.lng},${map.getZoom()}`);
      if (next) onViewChange(next);
    },
  });

  useEffect(() => {
    if (!view) return;
    const center = map.getCenter();
    if (Math.abs(center.lat - view.lat) > 0.00002 || Math.abs(center.lng - view.lng) > 0.00002 || Math.abs(map.getZoom() - view.zoom) > 0.02) {
      map.setView([view.lat, view.lng], view.zoom, { animate: false });
    }
  }, [map, view]);

  useEffect(() => {
    if (!focusRequest) return;
    const anchor = getEventMapAnchors(allEvents).find((item) => item.event.slug === focusRequest.slug);
    if (anchor) map.setView([anchor.location.latitude, anchor.location.longitude], Math.max(map.getZoom(), 8), { animate: false });
  }, [map, allEvents, focusRequest]);

  useEffect(() => {
    const element = map.getContainer();
    element.setAttribute("aria-label", "Bản đồ vị trí sự kiện. Dùng phím mũi tên để di chuyển, cộng trừ để thu phóng.");
    element.setAttribute("data-testid", "geographic-map");
    const observer = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [map]);

  return (
    <div className="home-map-tools" aria-label="Điều khiển bản đồ">
      <button type="button" aria-label="Phóng to bản đồ" onClick={() => map.zoomIn(1, { animate: false })}><Plus size={20} aria-hidden="true" /></button>
      <button type="button" aria-label="Thu nhỏ bản đồ" onClick={() => map.zoomOut(1, { animate: false })}><Minus size={20} aria-hidden="true" /></button>
      <button type="button" aria-label="Xem toàn cảnh Việt Nam" onClick={() => map.fitBounds(VIETNAM_MAP_BOUNDS, { paddingTopLeft: [300, 30], paddingBottomRight: [100, 150], animate: false })}><Scan size={19} aria-hidden="true" /></button>
    </div>
  );
}
