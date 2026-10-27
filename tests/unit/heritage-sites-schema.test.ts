import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import type {
  HeritageTier,
  HeritageCertainty,
  UsageBasis,
  HeritageVideo,
  HeritageCover,
  HeritageSiteSummary,
  HeritageSourceCitation,
  HeritageStorySection,
  HeritageCatalog,
  HeritageCatalogResponse,
} from "@/lib/heritage/types";

const root = process.cwd();
const sha = (content: string | Buffer) => createHash("sha256").update(content).digest("hex");

describe("Heritage Sites Schema and Migration (Phase 3)", () => {
  const rootMigrationPath = path.join(root, "supabase/migrations/20261101000000_heritage_sites.sql");
  const releaseMigrationPath = path.join(
    root,
    "supabase/releases/local-heroes-20261027/supabase/migrations/20261101000000_heritage_sites.sql",
  );
  const pgtapTestPath = path.join(root, "supabase/tests/heritage_sites.sql");
  const pgtapFixturePath = path.join(root, "supabase/tests/fixtures/heritage-sites.inc");

  it("ensures migration file exists and is byte-identical to release track mirror", () => {
    expect(existsSync(rootMigrationPath)).toBe(true);
    expect(existsSync(releaseMigrationPath)).toBe(true);

    const rootSql = readFileSync(rootMigrationPath);
    const releaseSql = readFileSync(releaseMigrationPath);

    expect(sha(rootSql)).toBe(sha(releaseSql));
  });

  it("verifies all structural SQL requirements on historical_locations and media_assets", () => {
    const sql = readFileSync(rootMigrationPath, "utf8");

    // Historical locations columns and constraints
    expect(sql).toContain("locality_code text references public.history_localities(code)");
    expect(sql).toContain("heritage_tier text");
    expect(sql).toContain("heritage_rank smallint");
    expect(sql).toContain("heritage_period text");
    expect(sql).toContain("heritage_teaser text");
    expect(sql).toContain("lesson_slug text");

    expect(sql).toContain("historical_locations_heritage_tier_check");
    expect(sql).toContain("historical_locations_heritage_rank_check");
    expect(sql).toContain("historical_locations_heritage_period_check");
    expect(sql).toContain("historical_locations_heritage_teaser_check");
    expect(sql).toContain("historical_locations_lesson_slug_check");
    expect(sql).toContain("historical_locations_heritage_complete");

    // Indexes
    expect(sql).toContain("uq_historical_locations_heritage_rank");
    expect(sql).toContain("uq_historical_locations_one_grade12");
    expect(sql).toContain("idx_historical_locations_locality");

    // Media assets
    expect(sql).toContain("add column usage_basis text");
    expect(sql).toContain("media_assets_usage_basis_check");
    expect(sql).toContain("'open_license','public_domain','permission','coursework_reference'");
  });

  it("verifies story sections, story sources, and videos tables with strict constraints", () => {
    const sql = readFileSync(rootMigrationPath, "utf8");

    expect(sql).toContain("create table public.location_story_sections");
    expect(sql).toContain("references public.historical_locations(id) on delete cascade");
    expect(sql).toContain("certainty in ('verified','approximate','disputed','editorial')");
    expect(sql).toContain("location_story_sections_uncertainty_check");

    expect(sql).toContain("create table public.location_story_sources");
    expect(sql).toContain("references public.location_story_sections(id) on delete cascade");
    expect(sql).toContain("references public.sources(id) on delete restrict");

    expect(sql).toContain("create table public.location_videos");
    expect(sql).toContain("youtube_id ~ '^[A-Za-z0-9_-]{11}$'");
  });

  it("verifies RLS policies on all three new tables", () => {
    const sql = readFileSync(rootMigrationPath, "utf8");

    expect(sql).toContain("alter table public.location_story_sections enable row level security;");
    expect(sql).toContain("alter table public.location_story_sources enable row level security;");
    expect(sql).toContain("alter table public.location_videos enable row level security;");

    // Public read policies
    expect(sql).toContain('create policy "location_story_sections_public"');
    expect(sql).toContain('create policy "location_story_sources_public"');
    expect(sql).toContain('create policy "location_videos_public"');

    // Staff read and review policies
    expect(sql).toContain('create policy "location_story_sections_staff"');
    expect(sql).toContain('create policy "location_story_sources_staff"');
    expect(sql).toContain('create policy "location_videos_staff"');
    expect(sql).toContain('create policy "location_story_sections_review"');
    expect(sql).toContain('create policy "location_story_sources_review"');
    expect(sql).toContain('create policy "location_videos_review"');

    // Editor policies restricted to draft and needs_revision
    expect(sql).toContain('create policy "location_story_sections_editable"');
    expect(sql).toContain('create policy "location_story_sources_editable"');
    expect(sql).toContain('create policy "location_videos_editable"');
  });

  it("verifies public read and editor lock on sources retain 100% of local-heroes branches plus new heritage branches", () => {
    const sql = readFileSync(rootMigrationPath, "utf8");

    // Preserved local-heroes branches in public_read_published
    expect(sql).toContain("event_sources es join public.historical_events e");
    expect(sql).toContain("figure_sources fs join public.historical_figures f");
    expect(sql).toContain("figure_story_sources ss join public.figure_stories s");
    expect(sql).toContain("figure_media_evidence me join public.historical_figures f");
    expect(sql).toContain("media_assets ma join public.figure_media_evidence me");

    // New heritage branch in public_read_published
    expect(sql).toContain(
      "exists(select 1 from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id join public.historical_locations l on l.id=s.location_id where lss.source_id=sources.id and l.workflow_status='published')",
    );

    // Preserved local-heroes branches in source_locked_for_editor
    expect(sql).toContain("public.media_owner_status(ma.event_id,ma.figure_id,ma.location_id)");
    expect(sql).toContain("figure_localities fl join public.historical_figures f");

    // New heritage branch in source_locked_for_editor
    expect(sql).toContain(
      "exists(select 1 from public.location_story_sources lss join public.location_story_sections s on s.id=lss.section_id join public.historical_locations l on l.id=s.location_id where lss.source_id=p_source and l.workflow_status in ('pending_review','published','hidden'))",
    );
  });

  it("verifies pgTAP test file covers assertions D1 through D9 and fixtures", () => {
    expect(existsSync(pgtapTestPath)).toBe(true);
    expect(existsSync(pgtapFixturePath)).toBe(true);

    const testSql = readFileSync(pgtapTestPath, "utf8");
    expect(testSql).toContain("D1_ANON_SEES_PUBLISHED_SECTIONS");
    expect(testSql).toContain("D1_ANON_HIDES_DRAFT_SECTIONS");
    expect(testSql).toContain("D2_ANON_SEES_PUBLISHED_SOURCES");
    expect(testSql).toContain("D2_ANON_HIDES_DRAFT_ONLY_SOURCE");
    expect(testSql).toContain("D3_ANON_CANNOT_INSERT_SECTIONS");
    expect(testSql).toContain("D3_LEARNER_CANNOT_INSERT_SECTIONS");
    expect(testSql).toContain("D4_EDITOR_CANNOT_INSERT_ON_PUBLISHED_SITE");
    expect(testSql).toContain("D4_EDITOR_CAN_INSERT_ON_DRAFT_SITE");
    expect(testSql).toContain("D5_REVIEWER_CAN_CHANGE_STATUS");
    expect(testSql).toContain("D5_REVIEWER_CANNOT_CHANGE_TEASER");
    expect(testSql).toContain("D6_ADMIN_CAN_UPDATE_HERITAGE_TEASER");
    expect(testSql).toContain("D7_REJECT_BAD_YOUTUBE_ID");
    expect(testSql).toContain("D7_REJECT_SHORT_TEASER");
    expect(testSql).toContain("D7_REJECT_TIER_WITHOUT_LOCALITY");
    expect(testSql).toContain("D7_REJECT_SECOND_GRADE12_SAME_LOCALITY");
    expect(testSql).toContain("D7_REJECT_DUPLICATE_RANK_SAME_LOCALITY");
    expect(testSql).toContain("D7_REJECT_APPROXIMATE_WITHOUT_NOTE");
    expect(testSql).toContain("D7_REJECT_INVALID_USAGE_BASIS");
    expect(testSql).toContain("D8_SOURCE_LOCKED_WHEN_SITE_PUBLISHED");
    expect(testSql).toContain("D8_SOURCE_UNLOCKED_WHEN_SITE_DRAFT");
    expect(testSql).toContain("D9_UNLINKED_SOURCE_UNLOCKED");
  });

  it("verifies lib/heritage/types.ts TypeScript definitions", () => {
    const sampleTier: HeritageTier = "grade12";
    const sampleCertainty: HeritageCertainty = "verified";
    const sampleUsage: UsageBasis = "open_license";
    const sampleVideo: HeritageVideo = {
      youtubeId: "AbCdEf12345",
      title: "Sample Video",
      channel: "Official Channel",
      channelUrl: "https://www.youtube.com/@channel",
      note: "Sample note",
      checkedAt: "2026-10-27",
    };
    const sampleCover: HeritageCover = {
      url: "https://example.com/cover.jpg",
      alt: "Sample cover image description",
      focalPoint: null,
      era: "today",
      credit: "Photographer Name",
      usageBasis: sampleUsage,
    };
    const sampleSummary: HeritageSiteSummary = {
      id: "cc000000-0000-4000-9000-000000000001",
      slug: "thanh-co-quang-tri",
      name: "Thành cổ Quảng Trị",
      historicalName: null,
      locality: {
        code: "44",
        slug: "quang-tri",
        officialName: "Tỉnh Quảng Trị",
        referenceFramework: "VN-34-2025",
      },
      tier: sampleTier,
      rank: 1,
      period: "1972",
      teaser: "Đoạn teaser hợp lệ trên 40 ký tự mô tả thành cổ Quảng Trị trong 81 ngày đêm.",
      latitude: 16.75,
      longitude: 107.18,
      accuracyLevel: "exact",
      accuracyNote: null,
      lessonSlug: "chien-dich-ho-chi-minh-1975",
      cover: sampleCover,
      videos: [sampleVideo],
    };
    const sampleCitation: HeritageSourceCitation = {
      id: "bb000000-0000-4000-9000-000000000001",
      title: "Cục Di sản văn hóa",
      authorOrg: "Bộ VHTTDL",
      publisher: null,
      url: "https://dsvh.gov.vn",
      accessedAt: "2026-10-27",
      locator: "mục 1",
      scopeNote: "bối cảnh",
    };
    const sampleSection: HeritageStorySection = {
      id: "dd000000-0000-4000-9000-000000000001",
      order: 1,
      heading: "Bối cảnh",
      body: "Nội dung đoạn bối cảnh lịch sử trên tám mươi ký tự phục vụ việc học tập lịch sử lớp 12.",
      certainty: sampleCertainty,
      uncertaintyNote: null,
      sources: [sampleCitation],
    };
    const sampleCatalog: HeritageCatalog = {
      items: [sampleSummary],
      coverage: {
        totalLocalities: 34,
        representedLocalities: 34,
      },
    };
    const sampleResponse: HeritageCatalogResponse = {
      ok: true,
      data: sampleCatalog,
    };

    expect(sampleResponse.ok).toBe(true);
    expect(sampleSection.sources[0].title).toBe("Cục Di sản văn hóa");
  });
});
