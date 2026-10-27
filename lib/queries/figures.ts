import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { Database } from "@/lib/database.types";
import { PUBLIC_MEDIA_FIELDS, toMediaItems, type MediaItem, type MediaRow } from "@/lib/media";
import { EVENT_CARD_MEDIA, toRelatedEvent, type RelatedEvent, type RelatedEventRow } from "@/lib/queries/events";
import { createPublicClient } from "@/lib/supabase/public";
import { getLocalHeroProfile } from "@/lib/queries/local-heroes";
import type { WorkflowStatus } from "@/lib/utils/labels";
import type { Certainty, LocalHeroProfile, PublicClaim, SourceCitation } from "@/lib/local-heroes/types";
import type { SourceListItem } from "@/components/content/SourceList";

const previewSourceFields = "id,title,author_org,publisher,published_year,url,source_type,citation,accessed_at" as const;
type PreviewEvidence = Pick<Database["public"]["Tables"]["figure_sources"]["Row"],
  "claim_key" | "claim_text" | "certainty" | "uncertainty_note" | "locator" | "scope_note"> & {
  sources: Pick<Database["public"]["Tables"]["sources"]["Row"],
    "id" | "title" | "author_org" | "publisher" | "published_year" | "url" | "source_type" | "citation" | "accessed_at"> | null;
};

function previewClaims(rows: readonly PreviewEvidence[]): PublicClaim[] {
  const groups = new Map<string, PublicClaim>();
  for (const row of rows) {
    const source = row.sources;
    if (!source) continue;
    const claim = groups.get(row.claim_key) ?? {
      key: row.claim_key, text: row.claim_text, certainty: row.certainty as Certainty,
      uncertaintyNote: row.uncertainty_note, sources: [],
    };
    claim.sources.push({
      sourceId: source.id, title: source.title, authorOrg: source.author_org, publisher: source.publisher,
      publishedYear: source.published_year, url: source.url, sourceType: source.source_type as SourceCitation["sourceType"],
      citation: source.citation, accessedAt: source.accessed_at ?? "", locator: row.locator, scopeNote: row.scope_note,
    });
    groups.set(row.claim_key, claim);
  }
  return [...groups.values()];
}

export type FigureLocalityDetail = {
  localityCode: string;
  localityName?: string;
  kind: string;
  historicalPlaceLabel: string;
  explanation: string;
  certainty: string;
  qualifiesForCoverage?: boolean;
  sources?: SourceCitation[];
};

export type FigureStoryDetail = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  isPrimary: boolean;
  sortOrder: number;
  workflowStatus: string;
  claims?: PublicClaim[];
};

export type FigureDetail = {
  id?: string;
  status: WorkflowStatus;
  slug: string;
  name: string;
  otherNames: string | null;
  birthYear: number | null;
  deathYear: number | null;
  birthYearCertainty?: Certainty | null;
  deathYearCertainty?: Certainty | null;
  biography: string | null;
  /** Ảnh chân dung cũ (cột portrait_url) — chỉ dùng khi nhân vật chưa có ảnh trong kho ảnh. */
  portraitUrl: string | null;
  /** Ảnh trong kho ảnh (ảnh bìa = chân dung), có ghi công. */
  media: MediaItem[];
  /** Sự kiện đã công bố có nhân vật này, theo thời gian; `relationship` là vai trò trong sự kiện. */
  events: (RelatedEvent & { relationship: string | null })[];
  isLocalHero?: boolean;
  contributionSummary?: string | null;
  contributionStartYear?: number | null;
  contributionEndYear?: number | null;
  catalogAliases?: string[];
  localities?: FigureLocalityDetail[];
  stories?: FigureStoryDetail[];
  claims?: PublicClaim[];
  sources?: SourceListItem[];
  localHeroProfile?: LocalHeroProfile | null;
};

/** Một nhân vật ĐÃ CÔNG BỐ theo slug kèm các sự kiện đã công bố liên quan (UC05); không có → null. */
export const getFigureDetail = cache(async (slug: string): Promise<FigureDetail | null> =>
  loadFigureDetail(await createPublicClient(), { slug }, true),
);

/** Nạp nhân vật bằng client tùy ý (công khai: ẩn danh + chỉ published; màn hình duyệt: phiên nhân sự, mọi trạng thái). */
export async function loadFigureDetail(
  supabase: SupabaseClient<Database>,
  by: { slug: string } | { id: string },
  publishedOnly: boolean,
): Promise<FigureDetail | null> {
  let query = supabase
    .from("historical_figures")
    .select(
      `id, slug, name, other_names, birth_year, death_year, biography, portrait_url, workflow_status, is_local_hero, contribution_summary, contribution_start_year, contribution_end_year, catalog_aliases,
       media_assets(${PUBLIC_MEDIA_FIELDS}),
       event_figures(relationship, historical_events(slug, title, summary, date_text, date_precision, is_featured, start_year, workflow_status, curriculum_topics(name, slug), ${EVENT_CARD_MEDIA}))`,
    );
  query = "id" in by ? query.eq("id", by.id) : query.eq("slug", by.slug);
  if (publishedOnly) query = query.eq("workflow_status", "published");
  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(`Không tải được nhân vật: ${error.message}`);
  }
  if (!data) return null;

  const events = data.event_figures
    .flatMap((link) => {
      // Sự kiện là null lúc chạy nếu nó chưa published (RLS ẩn với khách).
      const event = link.historical_events as RelatedEventRow | null;
      return event && event.workflow_status === "published"
        ? [{ ...toRelatedEvent(event), relationship: link.relationship }]
        : [];
    })
    .sort((a, b) => a.startYear - b.startYear || a.title.localeCompare(b.title, "vi"));

  let localities: FigureLocalityDetail[] = [];
  let stories: FigureStoryDetail[] = [];
  let claims: PublicClaim[] = [];
  let sources: SourceListItem[] = [];

  // Catalog discovery must not fall through to an unreviewed legacy portrait or child query.
  // Keep the existing view; full claim/citation presentation is owned by Phase 05.
  if (data.is_local_hero && publishedOnly) {
    const profile = await getLocalHeroProfile(data.slug);
    if (!profile) return null;

    const sourceMap = new Map<string, SourceListItem>();
    function addSource(s: SourceCitation) {
      if (!s || !s.sourceId || sourceMap.has(s.sourceId)) return;
      sourceMap.set(s.sourceId, {
        id: s.sourceId,
        title: s.title,
        citation: s.citation,
        url: s.url,
        sourceType: s.sourceType,
        sourceNote: s.authorOrg ? (s.publisher ? `${s.authorOrg} · ${s.publisher}` : s.authorOrg) : s.publisher,
        confidenceNote: s.locator ? (s.scopeNote ? `${s.locator} (${s.scopeNote})` : s.locator) : s.scopeNote,
      });
    }

    profile.claims?.forEach((c) => c.sources?.forEach(addSource));
    profile.associations?.forEach((a) => a.claim?.sources?.forEach(addSource));
    profile.stories?.forEach((st) => st.claims?.forEach((c) => c.sources?.forEach(addSource)));

    const sources = Array.from(sourceMap.values());

    return {
      id: profile.id,
      status: "published",
      slug: profile.slug,
      name: profile.name,
      otherNames: profile.aliases.join(", ") || null,
      birthYear: profile.birthYear,
      deathYear: profile.deathYear,
      birthYearCertainty: profile.birthYearCertainty,
      deathYearCertainty: profile.deathYearCertainty,
      biography: profile.biography,
      portraitUrl: null,
      isLocalHero: true,
      contributionSummary: profile.contributionSummary,
      contributionStartYear: data.contribution_start_year,
      contributionEndYear: data.contribution_end_year,
      catalogAliases: profile.aliases,
      media: profile.gallery.map((image, index) => {
        const labels = [...(image.labels ?? [])];
        if (
          image.depictionKind === "historical_context" &&
          !labels.some((l) => l.includes("Tư liệu bối cảnh") || l.includes("không phải chân dung"))
        ) {
          labels.unshift("Tư liệu bối cảnh, không phải chân dung");
        }
        return {
          id: image.id,
          url: image.url,
          type: "image",
          caption: image.caption,
          altText: image.altText,
          sourceTitle: null,
          labels,
          era: image.era,
          photographer: image.photographer,
          license: image.license,
          licenseUrl: image.licenseUrl,
          sourcePageUrl: image.sourcePageUrl,
          isCover: index === 0,
          focalPoint: image.focalPoint,
          pairId: null,
          width: image.width,
          height: image.height,
        };
      }),
      events: events.filter((event) => profile.events.some((item) => item.slug === event.slug)),
      localities: profile.associations.map((a) => ({
        localityCode: a.locality.code,
        localityName: a.locality.officialName,
        kind: a.kind,
        historicalPlaceLabel: a.historicalPlaceLabel,
        explanation: a.explanation,
        certainty: a.claim.certainty,
        qualifiesForCoverage: a.qualifiesForCoverage,
        sources: a.claim.sources,
      })),
      stories: profile.stories.map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        body: s.body,
        isPrimary: s.isPrimary,
        sortOrder: s.sortOrder,
        workflowStatus: "published",
        claims: s.claims,
      })),
      claims: profile.claims,
      sources,
      localHeroProfile: profile,
    };
  }

  if (data.is_local_hero) {
    // The public catalog returned above. These bounded queries use only the supplied staff session.
    const [claimRes, locRes, storyRes] = await Promise.all([
      supabase.from("figure_sources").select(`*,sources(${previewSourceFields})`).eq("figure_id", data.id).order("claim_key").order("source_id"),
      supabase.from("figure_localities").select("locality_code, relationship_kind, historical_place_label, explanation, certainty, claim_key, primary_source_id").eq("figure_id", data.id).order("locality_code"),
      supabase.from("figure_stories").select(`id,slug,title,summary,body,is_primary,sort_order,workflow_status,figure_story_sources(*,sources(${previewSourceFields}))`).eq("figure_id", data.id).order("sort_order").order("id"),
    ]);
    if (claimRes.error || locRes.error || storyRes.error) throw new Error("Chưa tải được hồ sơ nhân vật. Vui lòng thử lại.");
    claims = previewClaims(claimRes.data ?? []);
    localities = (locRes.data ?? []).map((l) => ({
        localityCode: l.locality_code,
        kind: l.relationship_kind,
        historicalPlaceLabel: l.historical_place_label,
        explanation: l.explanation,
        certainty: l.certainty,
        qualifiesForCoverage: l.certainty === "verified" && l.relationship_kind !== "commemoration",
        sources: claims.find((c) => c.key === l.claim_key)?.sources.filter((s) => s.sourceId === l.primary_source_id) ?? [],
      }));
    stories = (storyRes.data ?? []).map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        summary: s.summary,
        body: s.body,
        isPrimary: s.is_primary,
        sortOrder: s.sort_order,
        workflowStatus: s.workflow_status,
        claims: previewClaims(s.figure_story_sources ?? []),
      }));
    const sourceMap = new Map<string, SourceListItem>();
    for (const claim of [...claims, ...stories.flatMap((s) => s.claims ?? [])]) for (const source of claim.sources) {
      if (!sourceMap.has(source.sourceId)) sourceMap.set(source.sourceId, {
        id: source.sourceId, title: source.title, citation: source.citation, url: source.url,
        sourceType: source.sourceType, sourceNote: source.authorOrg ?? source.publisher,
        confidenceNote: `${source.locator}${source.scopeNote ? ` (${source.scopeNote})` : ""}`,
      });
    }
    sources = [...sourceMap.values()];
  }

  return {
    id: data.id,
    status: data.workflow_status,
    slug: data.slug,
    name: data.name,
    otherNames: data.other_names,
    birthYear: data.birth_year,
    deathYear: data.death_year,
    ...(data.is_local_hero ? {
      birthYearCertainty: claims.find((c) => c.key === "birth_year")?.certainty ?? null,
      deathYearCertainty: claims.find((c) => c.key === "death_year")?.certainty ?? null,
    } : {}),
    biography: data.biography,
    portraitUrl: data.is_local_hero ? null : data.portrait_url,
    media: toMediaItems(data.media_assets as MediaRow[]),
    events,
    isLocalHero: data.is_local_hero,
    contributionSummary: data.contribution_summary,
    contributionStartYear: data.contribution_start_year,
    contributionEndYear: data.contribution_end_year,
    catalogAliases: data.catalog_aliases,
    localities,
    stories,
    ...(data.is_local_hero ? { claims, sources } : {}),
  };
}
