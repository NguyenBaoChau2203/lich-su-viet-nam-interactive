import { describe, it, expect } from "vitest";
import { validateHeritagePackage, KNOWN_EXISTING_SLUGS, ALLOWED_LESSON_SLUGS } from "../../scripts/content/heritage-sites-validate.mjs";

describe("heritage sites package validator", () => {
  it("validates the v1 research package with 34/34 represented localities and 0 errors", () => {
    const res = validateHeritagePackage("supabase/content/heritage-sites/v1", "research");
    expect(res.valid).toBe(true);
    expect(res.issues).toHaveLength(0);
    expect(res.summary).not.toBeNull();
    expect(res.summary?.grade12Represented).toBe(34);
    expect(res.summary?.totalSites).toBe(64);
    expect(res.summary?.heldSites).toBe(64);
    expect(res.summary?.acceptedSites).toBe(0);
  });

  it("known existing slugs contains published seed locations", () => {
    expect(KNOWN_EXISTING_SLUGS.has("dinh-doc-lap")).toBe(true);
    expect(KNOWN_EXISTING_SLUGS.has("ben-nha-rong")).toBe(true);
    expect(KNOWN_EXISTING_SLUGS.has("pac-bo-cao-bang")).toBe(true);
    expect(KNOWN_EXISTING_SLUGS.has("dien-bien-phu")).toBe(true);
  });

  it("allowed lesson slugs matches interactive curriculum catalog", () => {
    expect(ALLOWED_LESSON_SLUGS.has("cach-mang-thang-tam-1945")).toBe(true);
    expect(ALLOWED_LESSON_SLUGS.has("chien-dich-dien-bien-phu")).toBe(true);
    expect(ALLOWED_LESSON_SLUGS.has("duong-truong-son")).toBe(true);
    expect(ALLOWED_LESSON_SLUGS.has("tet-mau-than-1968")).toBe(true);
    expect(ALLOWED_LESSON_SLUGS.has("dien-bien-phu-tren-khong-1972")).toBe(true);
    expect(ALLOWED_LESSON_SLUGS.has("chien-dich-ho-chi-minh-1975")).toBe(true);
  });
});
