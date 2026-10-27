import "server-only";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";
import type { EvidenceInput, LocalHeroAdminGraph } from "@/lib/local-heroes/admin-types";
import type { Certainty, LocalityCode, RelationshipKind } from "@/lib/local-heroes/types";
import { evaluateLocalHeroReadiness } from "@/lib/local-heroes/readiness";
import { uuidSchema } from "@/lib/local-heroes/validation";

type CitationRow = Database["public"]["Tables"]["figure_sources"]["Row"] | Database["public"]["Tables"]["figure_story_sources"]["Row"];
const evidence = (r: CitationRow): EvidenceInput => ({ claimKey: r.claim_key, sourceId: r.source_id, claimText: r.claim_text, locator: r.locator, scopeNote: r.scope_note, certainty: r.certainty as Certainty, uncertaintyNote: r.uncertainty_note });
const sourceFields = "id,title,author_org,publisher,published_year,url,source_type,citation,accessed_at" as const;
const unavailable = () => new Error("Chưa tải được hồ sơ nhân vật. Vui lòng thử lại.");

export async function getLocalHeroAdminGraph(figureId: string): Promise<LocalHeroAdminGraph | null> {
  await requireRole(["editor", "reviewer", "system_admin"]);
  if (!uuidSchema.safeParse(figureId).success) return null;
  const db = await createClient();
  const parent = await db.from("historical_figures").select("*,revision:local_hero_revision::text").eq("id", figureId).eq("is_local_hero", true).maybeSingle();
  if (parent.error) throw unavailable();
  if (!parent.data) return null;
  const f = parent.data;
  const [claims, localities, stories, mediaEvidence, media] = await Promise.all([
    db.from("figure_sources").select(`*,sources(${sourceFields})`).eq("figure_id", figureId).order("claim_key").order("source_id"),
    db.from("figure_localities").select("*").eq("figure_id", figureId).order("locality_code").order("relationship_kind"),
    db.from("figure_stories").select("*").eq("figure_id", figureId).order("sort_order").order("id"),
    db.from("figure_media_evidence").select(`*,identity:sources!figure_media_evidence_identity_source_id_fkey(${sourceFields}),usage:sources!figure_media_evidence_usage_source_id_fkey(${sourceFields})`).eq("figure_id", figureId).order("media_id"),
    db.from("media_assets").select(`*,sources(${sourceFields})`).eq("figure_id", figureId),
  ]);
  if (claims.error || localities.error || stories.error || mediaEvidence.error || media.error) throw unavailable();
  const storyIds = stories.data.map((s) => s.id);
  const storyClaims = storyIds.length ? await db.from("figure_story_sources").select(`*,sources(${sourceFields})`).in("story_id", storyIds).order("claim_key").order("source_id") : { data: [], error: null };
  if (storyClaims.error) throw unavailable();
  const graph: Omit<LocalHeroAdminGraph, "readiness"> = {
    figureId: f.id, revision: f.revision, workflow: f.workflow_status, reviewNote: f.review_note,
    figure: { name: f.name, slug: f.slug, otherNames: f.other_names, birthYear: f.birth_year, deathYear: f.death_year, biography: f.biography, isLocalHero: true, contributionSummary: f.contribution_summary, contributionStartYear: f.contribution_start_year, contributionEndYear: f.contribution_end_year, catalogAliases: f.catalog_aliases },
    sources: claims.data.map(evidence),
    localities: localities.data.map((l) => ({ id: l.id, localityCode: l.locality_code as LocalityCode, kind: l.relationship_kind as RelationshipKind, historicalPlaceLabel: l.historical_place_label, explanation: l.explanation, claimKey: l.claim_key, primarySourceId: l.primary_source_id, certainty: l.certainty as Certainty, uncertaintyNote: l.uncertainty_note })),
    stories: stories.data.map((s) => ({ id: s.id, slug: s.slug, title: s.title, summary: s.summary, body: s.body, sortOrder: s.sort_order, isPrimary: s.is_primary, workflow: s.workflow_status, reviewNote: s.review_note, sources: storyClaims.data.filter((c) => c.story_id === s.id).map(evidence) })),
    mediaEvidence: mediaEvidence.data.map((m) => ({ mediaId: m.media_id, depictionKind: m.depiction_kind as "portrait" | "historical_context", decision: m.decision as "accepted" | "held", identitySourceId: m.identity_source_id, identityLocator: m.identity_locator, identityCertainty: m.identity_certainty as Certainty, usageBasis: m.usage_basis as LocalHeroAdminGraph["mediaEvidence"][number]["usageBasis"], usageSourceId: m.usage_source_id, usageLocator: m.usage_locator, usageNote: m.usage_note, checkedAt: m.checked_at ? new Date(m.checked_at).toISOString() : null })),
  };
  const sourceRows = [...claims.data.map((r) => r.sources), ...storyClaims.data.map((r) => r.sources), ...mediaEvidence.data.flatMap((r) => [r.identity, r.usage]), ...media.data.map((r) => r.sources)].filter((s): s is NonNullable<typeof s> => s !== null);
  return { ...graph, readiness: evaluateLocalHeroReadiness(graph, sourceRows, media.data) };
}
