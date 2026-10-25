export type MapView = { lat: number; lng: number; zoom: number };

export function parseMapView(raw: string | null): MapView | null {
  if (!raw || raw.length > 70) return null;
  const parts = raw.split(",");
  if (parts.length !== 3 || parts.some((part) => !/^-?\d+(?:\.\d+)?$/.test(part))) return null;
  const [lat, lng, zoom] = parts.map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(zoom)) return null;
  if (Math.abs(lat) > 85 || Math.abs(lng) > 180 || zoom < 0 || zoom > 18) return null;
  return { lat: Number(lat.toFixed(5)), lng: Number(lng.toFixed(5)), zoom: Number(zoom.toFixed(2)) };
}

export function formatMapView(view: MapView): string {
  return [Number(view.lat.toFixed(5)), Number(view.lng.toFixed(5)), Number(view.zoom.toFixed(2))].join(",");
}
