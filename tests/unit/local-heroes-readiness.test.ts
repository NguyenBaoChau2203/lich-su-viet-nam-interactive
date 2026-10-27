import { describe, expect, it } from "vitest";
import { evaluateLocalHeroReadiness } from "@/lib/local-heroes/readiness";
import { evaluateReadiness } from "@/lib/admin/readiness";
import type { LocalHeroAdminGraph } from "@/lib/local-heroes/admin-types";
import type { Database } from "@/lib/database.types";

const sourceId = "a0000000-0000-4000-8000-000000000001", mediaId = "a0000000-0000-4000-8000-000000000002";
const evidence = (claimKey: string) => ({ claimKey, sourceId, claimText: "Synthetic claim", locator: "Synthetic paragraph", scopeNote: "Synthetic scope", certainty: "verified" as const, uncertaintyNote: null });
const source = { id: sourceId, title: "Synthetic source", author_org: "Synthetic archive", publisher: null, published_year: null, url: "https://example.invalid/source", source_type: "archive", citation: "Synthetic citation", accessed_at: "2026-10-26" } satisfies Database["public"]["Tables"]["sources"]["Row"];
const graph = (): Omit<LocalHeroAdminGraph, "readiness"> => ({ figureId: sourceId, revision: "1", workflow: "draft", reviewNote: null, figure: { name: "Synthetic person", slug: "synthetic-person", otherNames: null, birthYear: null, deathYear: null, biography: null, isLocalHero: true, contributionSummary: "Synthetic contribution", contributionStartYear: 1940, contributionEndYear: 1950, catalogAliases: [] }, sources: [evidence("identity"), evidence("contribution"), evidence("period"), evidence("locality:01:activity")], localities: [{ id: sourceId, localityCode: "01", kind: "activity", historicalPlaceLabel: "Synthetic historical place", explanation: "Synthetic sourced mapping", claimKey: "locality:01:activity", primarySourceId: sourceId, certainty: "verified", uncertaintyNote: null }], stories: [{ id: sourceId, slug: "synthetic-story", title: "Synthetic story", summary: "Synthetic summary", body: "từ ".repeat(360) + "[[cite:story]]", sortOrder: 0, isPrimary: true, sources: [evidence("story")], workflow: "draft", reviewNote: null }], mediaEvidence: [{ mediaId, depictionKind: "historical_context", decision: "accepted", identitySourceId: sourceId, identityLocator: "Synthetic original page", identityCertainty: "verified", usageBasis: "coursework_reference", usageSourceId: null, usageLocator: null, usageNote: "LH-1.0.0-draft.1 coursework attribution https://example.invalid/source", checkedAt: "2026-10-26T00:00:00Z" }] });
const media = { id: mediaId, figure_id: sourceId, source_id: sourceId, media_type: "image", era: "historical", file_url: "https://example.invalid/image.jpg", caption: "Tư liệu bối cảnh, không phải chân dung", alt_text: "Synthetic document", source_page_url: "https://example.invalid/source", photographer: "Unknown author, Synthetic archive", width: 480, height: 300, is_reenactment: false, is_colorized: false, license: null, license_url: null };

describe("catalog structural readiness", () => {
  it("accepts evidenced coursework use and a selected draft primary without circular published prerequisites", () => {
    const readiness = evaluateLocalHeroReadiness(graph(), [source], [media]);
    expect(readiness.blocking).toEqual([]);
    expect(evaluateReadiness({ kind: "nhan-vat", biography: null, localHero: readiness, media: { count: 1, missingAlt: 0, missingLicense: 1 } }).blocking).toEqual([]);
    expect(evaluateReadiness({ kind: "nhan-vat", biography: null, media: { count: 1, missingAlt: 0, missingLicense: 1 } }).blocking).toHaveLength(1);
  });
  it("holds uncertain identity, unsourced displayed aliases and unknown usage", () => {
    const g = graph(); g.figure.catalogAliases = ["Unsourced alias"]; g.mediaEvidence[0].identityCertainty = "approximate"; g.mediaEvidence[0].usageBasis = "unknown";
    expect(evaluateLocalHeroReadiness(g, [source], [media]).blocking.map((x) => x.code)).toEqual(expect.arrayContaining(["DISPLAYED_CLAIM_SOURCE_REQUIRED", "IMAGE_IDENTITY", "IMAGE_USAGE"]));
  });
  it("ignores unselected drafts and rejects broken paragraph citations and last mappings", () => {
    const g = graph(); g.stories.push({ ...g.stories[0], id: mediaId, isPrimary: false, body: "Private unfinished draft", sources: [] });
    expect(evaluateLocalHeroReadiness(g, [source], [media]).blocking).toEqual([]);
    g.stories[0].body += "\n\nUncited paragraph"; g.localities[0].kind = "commemoration";
    expect(evaluateLocalHeroReadiness(g, [source], [media]).blocking.map((x) => x.code)).toEqual(expect.arrayContaining(["STORY_SOURCE_REQUIRED", "LOCALITY_MAPPING_REQUIRED"]));
  });
  it("reports malformed disputed source metadata without throwing", () => {
    const g = graph(); g.sources[0].certainty = "disputed"; g.sources[0].uncertaintyNote = "Synthetic dispute";
    const malformed = { ...source, author_org: null, publisher: null, url: "SYNTHETIC_INVALID_URL" };
    expect(() => evaluateLocalHeroReadiness(g, [malformed], [media])).not.toThrow();
    expect(evaluateLocalHeroReadiness(g, [malformed], [media]).blocking.some((i) => i.code === "SOURCE_METADATA")).toBe(true);
  });
});
