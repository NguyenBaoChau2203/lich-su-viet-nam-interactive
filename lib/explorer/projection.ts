import type { GeoBounds, MapFootprint, MapProjection, PointXZ } from "@/lib/explorer/types";

export function getFootprintBounds(footprint: MapFootprint): GeoBounds {
  let west = Infinity;
  let east = -Infinity;
  let south = Infinity;
  let north = -Infinity;

  for (const feature of footprint.features) {
    const polygons =
      feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
    for (const poly of polygons) {
      for (const ring of poly) {
        for (const [lng, lat] of ring) {
          if (lng < west) west = lng;
          if (lng > east) east = lng;
          if (lat < south) south = lat;
          if (lat > north) north = lat;
        }
      }
    }
  }

  if (!Number.isFinite(west) || !Number.isFinite(east) || !Number.isFinite(south) || !Number.isFinite(north)) {
    return { west: 102, east: 116, south: 8, north: 24 };
  }

  return { west, east, south, north };
}

export function createMapProjection(bounds: GeoBounds, maxSpan = 100): MapProjection {
  const centerLng = (bounds.west + bounds.east) / 2;
  const centerLat = (bounds.south + bounds.north) / 2;
  const cosCenterLat = Math.max(Math.cos((centerLat * Math.PI) / 180), 1e-6);

  const lngSpanScaled = Math.abs(bounds.east - bounds.west) * cosCenterLat;
  const latSpan = Math.abs(bounds.north - bounds.south);
  const dominantSpan = Math.max(lngSpanScaled, latSpan, 1e-9);
  const scale = maxSpan / dominantSpan;

  return {
    project(lng: number, lat: number): PointXZ {
      const x = (lng - centerLng) * cosCenterLat * scale;
      const z = -(lat - centerLat) * scale;
      return { x: x === 0 ? 0 : x, z: z === 0 ? 0 : z };
    },
    unproject(point: PointXZ): [number, number] {
      const lng = centerLng + point.x / (cosCenterLat * scale);
      const lat = centerLat - point.z / scale;
      return [lng === 0 ? 0 : lng, lat === 0 ? 0 : lat];
    },
  };
}
