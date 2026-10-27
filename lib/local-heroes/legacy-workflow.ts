import "server-only";
import type { ActionState } from "@/lib/actions/state";
import { reviewLocalHeroGraph, restoreLocalHeroDraft, submitLocalHeroGraph } from "@/lib/actions/local-heroes";
import { createClient } from "@/lib/supabase/server";
import type { LocalHeroMutationResult } from "./admin-types";

/** Existing forms have no story selector. Default to the primary; Phase 03 uses explicit command inputs. */
export async function tryLocalHeroWorkflow(figureId: string, action: "submit" | "restore_draft" | "publish" | "request_revision" | "hide" | "republish", reason?: string | null, observed?: { expectedRevision: string; storyIds?: string[] }): Promise<LocalHeroMutationResult | null> {
  const db = await createClient();
  const { data: f, error } = await db.from("historical_figures").select("is_local_hero,workflow_status,revision:local_hero_revision::text").eq("id", figureId).maybeSingle();
  if (error) return { ok: false, error: { code: "DB_UNAVAILABLE", message: "Chưa tải được hồ sơ. Vui lòng thử lại.", fieldErrors: {}, readiness: null, currentRevision: null } };
  if (!f?.is_local_hero) return null;
  const cas = { figureId, expectedRevision: observed?.expectedRevision ?? f.revision };
  if (action === "restore_draft") return restoreLocalHeroDraft(cas);
  if (action === "submit" || action === "republish") {
    const stories = await db.from("figure_stories").select("id,is_primary,workflow_status").eq("figure_id", figureId);
    if (stories.error) return { ok: false, error: { code: "DB_UNAVAILABLE", message: "Chưa tải được truyện. Vui lòng thử lại.", fieldErrors: {}, readiness: null, currentRevision: null } };
    const storyIds = observed?.storyIds ?? stories.data.filter((s) => s.is_primary && (action === "republish" ? s.workflow_status === "hidden" : s.workflow_status === "draft" || s.workflow_status === "needs_revision")).map((s) => s.id);
    return action === "submit" ? submitLocalHeroGraph({ ...cas, storyIds }) : reviewLocalHeroGraph({ ...cas, action, storyIds });
  }
  return reviewLocalHeroGraph(action === "request_revision" ? { ...cas, action, reason } : { ...cas, action });
}

export function localHeroActionState(result: LocalHeroMutationResult, values: Record<string, string>): ActionState {
  if (result.ok) return { status: "success", message: "Đã cập nhật hồ sơ nhân vật.", values };
  return { status: "error", message: result.error.message, values, ...(result.error.code === "STALE" ? { stale: true } : {}), ...(result.error.readiness ? { warnings: result.error.readiness.blocking.map((i) => i.message) } : {}) };
}
