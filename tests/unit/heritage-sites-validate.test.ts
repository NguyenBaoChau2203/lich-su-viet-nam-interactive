import { describe, it, expect, afterAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {
  validateHeritagePackage,
  KNOWN_EXISTING_SLUGS,
  ALLOWED_LESSON_SLUGS,
} from "../../scripts/content/heritage-sites-validate.mjs";

const VALID_FIXTURE_PATH = "tests/unit/fixtures/heritage/valid-package";
const TEMP_FIXTURE_PATH = "tests/unit/fixtures/heritage/temp-test-package";

type PackageSitesDoc = {
  schemaVersion: number;
  framework: string;
  sites: Array<Record<string, unknown> & { media: Array<Record<string, unknown>>; videos?: Array<Record<string, unknown>> }>;
};

type PackageEvidenceDoc = {
  schemaVersion: number;
  items: Array<Record<string, unknown>>;
  videos: Array<Record<string, unknown>>;
  notFound: Array<Record<string, unknown>>;
};

function createModifiedPackage(modifier: (docs: { sites: PackageSitesDoc; evidence: PackageEvidenceDoc }) => void) {
  const baseValid = path.resolve(process.cwd(), VALID_FIXTURE_PATH);
  const tempDir = path.resolve(process.cwd(), TEMP_FIXTURE_PATH);
  fs.rmSync(tempDir, { recursive: true, force: true });
  fs.mkdirSync(tempDir, { recursive: true });

  for (const f of ["localities.json", "sources.json", "sites.json", "media-evidence.json"]) {
    fs.copyFileSync(path.join(baseValid, f), path.join(tempDir, f));
  }

  const sitesDoc = JSON.parse(fs.readFileSync(path.join(tempDir, "sites.json"), "utf8"));
  const evidenceDoc = JSON.parse(fs.readFileSync(path.join(tempDir, "media-evidence.json"), "utf8"));

  modifier({ sites: sitesDoc, evidence: evidenceDoc });

  fs.writeFileSync(path.join(tempDir, "sites.json"), JSON.stringify(sitesDoc, null, 2) + "\n");
  fs.writeFileSync(path.join(tempDir, "media-evidence.json"), JSON.stringify(evidenceDoc, null, 2) + "\n");

  const manifest = {
    schemaVersion: 1,
    framework: "VN-34-2025",
    files: {} as Record<string, string>,
  };
  for (const f of ["localities.json", "sources.json", "sites.json"]) {
    manifest.files[f] = crypto
      .createHash("sha256")
      .update(fs.readFileSync(path.join(tempDir, f), "utf8"), "utf8")
      .digest("hex");
  }
  fs.writeFileSync(path.join(tempDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  return TEMP_FIXTURE_PATH;
}

describe("heritage sites package validator hardening (Phase 3)", () => {
  afterAll(() => {
    const tempDir = path.resolve(process.cwd(), TEMP_FIXTURE_PATH);
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("validates the valid fixture package in research mode with 34/34 represented localities and 0 errors", () => {
    const res = validateHeritagePackage(VALID_FIXTURE_PATH, "research");
    expect(res.valid).toBe(true);
    expect(res.issues).toHaveLength(0);
    expect(res.summary?.grade12Represented).toBe(34);
    expect(res.summary?.extendedRepresented).toBe(30);
    expect(res.summary?.totalSites).toBe(64);
  });

  it("validates the valid fixture package in release mode with 34/34 represented localities and 0 errors", () => {
    const rel = validateHeritagePackage(VALID_FIXTURE_PATH, "release");
    expect(rel.valid).toBe(true);
    expect(rel.issues).toHaveLength(0);
    expect(rel.summary?.grade12Represented).toBe(34);
    expect(rel.summary?.extendedRepresented).toBe(30);
    expect(rel.summary?.totalSites).toBe(64);
  });

  it("rejects placeholder photographer 'Wikimedia Commons Contributor'", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      sites.sites[0].media[0].photographer = "Wikimedia Commons Contributor";
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("forbidden placeholder photographer"))).toBe(true);
  });

  it("rejects placeholder photographer matching Cổng Thông tin Điện tử", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      sites.sites[0].media[0].photographer = "Cổng Thông tin Điện tử tỉnh";
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("forbidden placeholder photographer"))).toBe(true);
  });

  it("rejects forbidden Special:FilePath URL pattern", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      sites.sites[0].media[0].fileUrl = "https://commons.wikimedia.org/wiki/Special:FilePath/Sample.jpg";
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("matches forbidden pattern"))).toBe(true);
  });

  it("rejects forbidden /uploads/images/YYYY/MM/ pattern on gov.vn", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      sites.sites[0].media[0].fileUrl = "https://laichau.gov.vn/uploads/images/2021/04/sample.jpg";
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("matches forbidden pattern"))).toBe(true);
  });

  it("rejects media missing matching entry in media-evidence.json", () => {
    const pkg = createModifiedPackage(({ evidence }) => {
      evidence.items.shift(); // remove first evidence item
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("has no matching entry in media-evidence.json"))).toBe(true);
  });

  it("rejects mismatched dimensions between sites.json and media-evidence.json", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      sites.sites[0].media[0].width = 9999;
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("do not match evidence 1200 variant dimensions"))).toBe(true);
  });

  it("rejects invalid pairKey grouping without exactly 1 historical + 1 today", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      const site = sites.sites[0];
      site.media[0].pairKey = "pair-01";
      site.media[0].era = "today";
      // Add second item with today (invalid pair: 2 today)
      site.media.push({
        ...site.media[0],
        key: `${site.key}-second`,
        isCover: false,
        era: "today",
        pairKey: "pair-01",
      });
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("must contain exactly 1 historical and 1 today image"))).toBe(true);
  });

  it("rejects video that has no evidence or was marked removed", () => {
    const pkg = createModifiedPackage(({ sites, evidence }) => {
      sites.sites[0].videos = [
        {
          youtubeId: "W6_bO4m3F6c",
          title: "Video di tích",
          channel: "VTV",
          channelUrl: "https://youtube.com/c/vtv",
          note: null,
          embedCheckedAt: "2026-10-28",
        },
      ];
      evidence.videos = [
        {
          site: sites.sites[0].key,
          youtubeId: "W6_bO4m3F6c",
          verdict: "removed",
          checkedAt: "2026-10-28",
        },
      ];
    });
    const res = validateHeritagePackage(pkg, "research");
    expect(res.valid).toBe(false);
    expect(res.issues.some((i: string) => i.includes("has no valid evidence in media-evidence.json or was marked removed"))).toBe(true);
  });

  it("rejects fabrication heuristic in release mode when > 3 sites share exact photographer and dimensions", () => {
    const pkg = createModifiedPackage(({ sites }) => {
      // 4 sites share exact same photographer and dimensions
      for (let i = 0; i < 4; i++) {
        sites.sites[i].media[0].photographer = "Duplicated Photographer";
        sites.sites[i].media[0].width = 1200;
        sites.sites[i].media[0].height = 800;
      }
    });
    const rel = validateHeritagePackage(pkg, "release");
    expect(rel.valid).toBe(false);
    expect(rel.issues.some((i: string) => i.includes("Fabrication heuristic triggered"))).toBe(true);
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
