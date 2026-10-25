import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { describe, expect, it } from "vitest";
import { HISTORY_JOURNEY, getJourneyStop, parseJourneySelection, getJourneyConnections } from "@/lib/explorer/journey";
import { buildGlobeStyle } from "@/lib/explorer/globe-style";

describe("curated globe content and geography", () => {
  it("serves a globe with local geography and no provider labels or raster sources", () => {
    const style = buildGlobeStyle();
    expect(style.projection).toEqual({ type: "globe" });
    expect(Object.values(style.sources).every((source) => source.type === "geojson")).toBe(true);
    expect(JSON.stringify(style)).not.toMatch(/https?:|raster|glyphs|satellite|symbol/);
    expect(style.layers.some((layer) => layer.id === "vietnam-outline")).toBe(true);
  });

  it("ships world land geometry with an integrity record and no names to leak", () => {
    const path = "public/maps/history-world-land.geojson";
    const data = JSON.parse(readFileSync(path, "utf8"));
    const provenance = JSON.parse(readFileSync("public/maps/history-world-land.provenance.json", "utf8"));
    expect(data.type).toBe("FeatureCollection");
    expect(data.features.length).toBeGreaterThan(100);
    expect(data.features.every((f: { properties: object }) => Object.keys(f.properties).length === 0)).toBe(true);
    expect(provenance.sha256).toBe(createHash("sha256").update(readFileSync(path)).digest("hex"));
    expect(provenance.sourceUrl).toMatch(/^https:/);
    // All four runtime geographic assets with explicit boundary cap and amended total budget
    const boundaryPath = "public/maps/history-country-boundaries.geojson";
    const boundaryProvenance = JSON.parse(readFileSync("public/maps/history-country-boundaries.provenance.json", "utf8"));
    expect(boundaryProvenance.sha256).toBe(createHash("sha256").update(readFileSync(boundaryPath)).digest("hex"));

    const boundaryGzip = gzipSync(readFileSync(boundaryPath)).length;
    expect(boundaryGzip).toBeLessThanOrEqual(150 * 1024);

    const runtimeGeographyAssets = [
      path,
      "public/maps/vietnam-tabletop.geojson",
      "public/maps/history-vietnam-labels.json",
      boundaryPath,
    ];
    const totalGzip = runtimeGeographyAssets.reduce((sum, asset) => sum + gzipSync(readFileSync(asset)).length, 0);
    expect(totalGzip).toBeLessThanOrEqual(600 * 1024);
  });

  it("keeps the selected journey ordered, sourced, and honest about coordinate precision", () => {
    expect(HISTORY_JOURNEY.stops.length).toBeGreaterThanOrEqual(5);
    const stops = HISTORY_JOURNEY.stops;
    expect(new Set(stops.map((stop) => stop.id)).size).toBe(stops.length);
    expect(stops.map((stop) => stop.sortDate)).toEqual(stops.map((stop) => stop.sortDate).sort());
    for (const stop of stops) {
      expect(stop.sources.length).toBeGreaterThan(0);
      expect(stop.sources.every((s) => s.publisher && s.accessedAt && s.scope && s.url.startsWith("https://"))).toBe(true);
      expect(stop.coordinateSource.url).toMatch(/^https:/);
      expect(stop.accuracy).toBe("approximate");
      expect(stop.accuracyNote.length).toBeGreaterThan(20);
      expect(stop.view.zoom).toBeLessThanOrEqual(7.5);
      expect(getJourneyStop(HISTORY_JOURNEY.id, stop.id)).toBe(stop);
    }
  });

  it("rejects unknown journeys and recovers unknown stops within the known journey", () => {
    expect(parseJourneySelection("unknown", "paris-1919")).toBeUndefined();
    expect(parseJourneySelection(HISTORY_JOURNEY.id, "https://evil.example")?.stop).toBe(HISTORY_JOURNEY.stops[0].id);
    expect(parseJourneySelection(HISTORY_JOURNEY.id, null)?.stop).toBe(HISTORY_JOURNEY.stops[0].id);
  });

  it("connects only authored milestones up to the selected stop as a schematic", () => {
    expect(getJourneyConnections(HISTORY_JOURNEY.id, "missing").features).toEqual([]);
    expect(getJourneyConnections(HISTORY_JOURNEY.id, HISTORY_JOURNEY.stops[0].id).features).toEqual([]);
    const route = getJourneyConnections(HISTORY_JOURNEY.id, "paris-1919");
    expect(route.features).toHaveLength(1);
    expect(route.features[0].geometry.coordinates).toHaveLength(4);
    expect(route.features[0].geometry.coordinates.at(-1)).toEqual([2.352992, 48.858092]);
    expect(route.features[0].properties.schematic).toBe(true);
  });
});
