import type { StyleSpecification } from "maplibre-gl";

/** All text is curated HTML; no global label provider or glyph request is used. */
export function buildGlobeStyle(): StyleSpecification {
  return {
    version: 8,
    projection: { type: "globe" },
    sky: { "sky-color": "#050b14", "horizon-color": "#334b62", "fog-color": "#0b1929", "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 0.8, 4, 0.2, 7, 0] },
    sources: {
      world: { type: "geojson", data: "/maps/history-world-land.geojson", tolerance: 0.6 },
      vietnam: { type: "geojson", data: "/maps/vietnam-tabletop.geojson", tolerance: 0.15 },
      journey: { type: "geojson", data: { type: "FeatureCollection", features: [] } },
    },
    layers: [
      { id: "ocean", type: "background", paint: { "background-color": "#0b1b2c" } },
      { id: "world-land", type: "fill", source: "world", paint: { "fill-color": "#263a48" } },
      { id: "world-coastline", type: "line", source: "world", paint: { "line-color": "#526575", "line-width": 0.6, "line-opacity": 0.55 } },
      { id: "vietnam-land", type: "fill", source: "vietnam", paint: { "fill-color": "#6e633e", "fill-opacity": 0.8 } },
      { id: "vietnam-outline", type: "line", source: "vietnam", paint: { "line-color": "#e7c47f", "line-width": 1.25 } },
      { id: "journey-connections", type: "line", source: "journey", paint: { "line-color": "#dfb96f", "line-width": 1.5, "line-dasharray": [3, 3], "line-opacity": 0.7 } },
    ],
  };
}
