import { describe, it, expect } from "vitest";
import { geoToSvg, GEO_BOUNDS } from "@/features/map/geoUtils";

describe("geoUtils - geoToSvg", () => {
  it("converts Hanoi coordinates accurately to SVG viewBox (0, 0, 1000, 1200)", () => {
    // Ha Noi: lat 21.0285, lng 105.8542
    const pt = geoToSvg(21.0285, 105.8542);
    expect(pt.x).toBeGreaterThan(450);
    expect(pt.x).toBeLessThan(550);
    expect(pt.y).toBeGreaterThan(150);
    expect(pt.y).toBeLessThan(280);
  });

  it("converts Dien Bien Phu coordinates accurately to SVG viewBox", () => {
    // Dien Bien Phu: lat 21.3869, lng 103.0232
    const pt = geoToSvg(21.3869, 103.0232);
    expect(pt.x).toBeGreaterThan(120);
    expect(pt.x).toBeLessThan(220);
    expect(pt.y).toBeGreaterThan(150);
    expect(pt.y).toBeLessThan(250);
  });

  it("converts Saigon / Ho Chi Minh City coordinates accurately", () => {
    // Saigon: lat 10.7769, lng 106.7009
    const pt = geoToSvg(10.7769, 106.7009);
    expect(pt.x).toBeGreaterThan(500);
    expect(pt.x).toBeLessThan(650);
    expect(pt.y).toBeGreaterThan(900);
    expect(pt.y).toBeLessThan(1050);
  });

  it("exports GEO_BOUNDS configuration", () => {
    expect(GEO_BOUNDS.svgWidth).toBe(1000);
    expect(GEO_BOUNDS.svgHeight).toBe(1200);
  });
});
