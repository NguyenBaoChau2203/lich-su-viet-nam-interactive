"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";
import { getStaffState } from "@/lib/auth";
import { contentPaths } from "@/lib/admin/content-kinds";
import { reviewPaths } from "@/lib/queries/review";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/database.types";
import type { LocalHeroMutationResult } from "@/lib/local-heroes/admin-types";
import { graphSchema, mutationResultSchema, restoreSchema, reviewSchema, submitSchema } from "@/lib/local-heroes/validation";

type Command = "local_hero_save_graph" | "local_hero_submit_graph" | "local_hero_review_graph" | "local_hero_restore_draft";
const failure = (code: "UNAUTHENTICATED" | "FORBIDDEN" | "INVALID_INPUT" | "DB_UNAVAILABLE" | "STALE" | "CONFLICT", fieldErrors: Record<string, string[]> = {}): LocalHeroMutationResult => ({ ok: false, error: { code, message: { UNAUTHENTICATED: "Vui lòng đăng nhập.", FORBIDDEN: "Bạn không có quyền thực hiện thao tác này.", INVALID_INPUT: "Dữ liệu không hợp lệ.", DB_UNAVAILABLE: "Chưa lưu được hồ sơ. Vui lòng thử lại.", STALE: "Hồ sơ đã thay đổi. Hãy tải lại trước khi lưu.", CONFLICT: "Dữ liệu trùng hoặc còn được tham chiếu." }[code], fieldErrors, readiness: null, currentRevision: null } });

async function execute(command: Command, schema: z.ZodType, input: unknown): Promise<LocalHeroMutationResult> {
  try {
    const state = await getStaffState();
    if (state.status === "anonymous") return failure("UNAUTHENTICATED");
    if (state.status !== "active") return failure("FORBIDDEN");
    const allowed = command === "local_hero_restore_draft" ? ["system_admin"] : command === "local_hero_review_graph" ? ["reviewer", "system_admin"] : ["editor", "system_admin"];
    if (!allowed.includes(state.staff.role)) return failure("FORBIDDEN");
    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) (fields[issue.path.join(".") || "graph"] ??= []).push("Dữ liệu không hợp lệ.");
      return failure("INVALID_INPUT", fields);
    }
    const db = await createClient();
    const { data, error } = await db.rpc(command, { p_command: parsed.data as Json });
    if (error) return failure(["40001", "40P01"].includes(error.code) ? "STALE" : ["23505", "23503"].includes(error.code) ? "CONFLICT" : error.code === "42501" ? "FORBIDDEN" : ["22023", "22P02", "23514", "23502"].includes(error.code) ? "INVALID_INPUT" : "DB_UNAVAILABLE");
    const result = mutationResultSchema.safeParse(data);
    if (!result.success) return failure("DB_UNAVAILABLE");
    const outcome: LocalHeroMutationResult = result.data;
    if (outcome.ok) {
      revalidatePath("/");
      revalidatePath(`/nhan-vat/${outcome.data.slug}`);
      revalidatePath(contentPaths.list("nhan-vat"));
      revalidatePath(contentPaths.edit("nhan-vat", outcome.data.figureId));
      revalidatePath(reviewPaths.queue);
    }
    return outcome;
  } catch { return failure("DB_UNAVAILABLE"); }
}

export async function saveLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult> { return execute("local_hero_save_graph", graphSchema, input); }
export async function submitLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult> { return execute("local_hero_submit_graph", submitSchema, input); }
export async function reviewLocalHeroGraph(input: unknown): Promise<LocalHeroMutationResult> { return execute("local_hero_review_graph", reviewSchema, input); }
export async function restoreLocalHeroDraft(input: unknown): Promise<LocalHeroMutationResult> { return execute("local_hero_restore_draft", restoreSchema, input); }
