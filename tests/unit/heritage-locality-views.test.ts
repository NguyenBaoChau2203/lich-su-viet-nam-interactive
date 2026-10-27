import { describe, expect, it } from "vitest";
import { PROVINCES } from "@/lib/provinces";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityCode } from "@/lib/local-heroes/types";
import {
  LOCALITY_CENTERS,
  PROVINCE_NAME_TO_LOCALITY_CODE,
  localityFallbackView,
} from "@/lib/heritage/locality-views";

describe("Heritage Locality Views (Phase 4)", () => {
  it("ensures all 34 locality codes have a defined centre", () => {
    expect(LOCALITIES).toHaveLength(34);

    for (const loc of LOCALITIES) {
      const code = loc.code as LocalityCode;
      const center = LOCALITY_CENTERS[code];

      expect(center, `Missing centre for locality ${code} (${loc.officialName})`).toBeDefined();
      expect(center.lat).toBeGreaterThan(8.0);
      expect(center.lat).toBeLessThan(24.0);
      expect(center.lng).toBeGreaterThan(102.0);
      expect(center.lng).toBeLessThan(118.0);
      expect(center.label.length).toBeGreaterThan(1);
    }
  });

  it("ensures every PROVINCES entry maps to exactly one valid locality code", () => {
    expect(PROVINCES).toHaveLength(34);
    const mappedCodes = new Set<string>();

    for (const prov of PROVINCES) {
      const code = PROVINCE_NAME_TO_LOCALITY_CODE[prov.name];
      expect(code, `Missing mapping for province: ${prov.name}`).toBeDefined();
      expect(LOCALITIES.some((l) => l.code === code)).toBe(true);
      mappedCodes.add(code);
    }

    expect(mappedCodes.size).toBe(34);
  });

  it("returns appropriate fallback view for given locality codes", () => {
    const hn = localityFallbackView("01");
    expect(hn.zoom).toBe(7);
    expect(hn.lat).toBeCloseTo(21.028);
    expect(hn.lng).toBeCloseTo(105.854);

    const hcm = localityFallbackView("79");
    expect(hcm.zoom).toBe(7);
    expect(hcm.lat).toBeCloseTo(10.776);
    expect(hcm.lng).toBeCloseTo(106.701);
  });
});
