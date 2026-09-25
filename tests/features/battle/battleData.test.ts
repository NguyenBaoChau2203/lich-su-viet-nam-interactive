import { describe, it, expect } from "vitest";
import { DIEN_BIEN_PHU_CAMPAIGN } from "@/features/battle/battleData";

describe("DIEN_BIEN_PHU_CAMPAIGN dataset", () => {
  it("contains 3 distinct historical attack phases", () => {
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases).toHaveLength(3);
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[0].phaseId).toBe("dot-1");
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[1].phaseId).toBe("dot-2");
    expect(DIEN_BIEN_PHU_CAMPAIGN.phases[2].phaseId).toBe("dot-3");
  });

  it("has valid enemy strongholds across Northern, Central, and Southern sectors", () => {
    expect(DIEN_BIEN_PHU_CAMPAIGN.strongholds.length).toBeGreaterThanOrEqual(6);
    const sectors = new Set(DIEN_BIEN_PHU_CAMPAIGN.strongholds.map((s) => s.sector));
    expect(sectors.has("north")).toBe(true);
    expect(sectors.has("center")).toBe(true);
    expect(sectors.has("south")).toBe(true);
  });

  it("defines attack vectors with valid SVG paths for each phase", () => {
    for (const phase of DIEN_BIEN_PHU_CAMPAIGN.phases) {
      expect(phase.vectors.length).toBeGreaterThan(0);
      for (const vector of phase.vectors) {
        expect(vector.pathD).toMatch(/^M/);
        expect(vector.unitName).toBeTruthy();
      }
    }
  });

  it("cites historical provenance for educational accuracy", () => {
    expect(DIEN_BIEN_PHU_CAMPAIGN.sourceCitation).toContain("Điện Biên Phủ");
  });
});
