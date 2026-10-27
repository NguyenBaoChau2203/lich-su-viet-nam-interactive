import "server-only";
import { unstable_rethrow } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import { normalizeLocalHeroFilters } from "@/lib/local-heroes/normalize";
import type { LocalHeroFilters, LocalHeroPage, LocalHeroProfile } from "@/lib/local-heroes/types";

export class LocalHeroQueryError extends Error {
  readonly code = "DATA_UNAVAILABLE" as const;
  constructor() {
    super("Chưa tải được danh sách nhân vật. Vui lòng thử lại.");
    this.name = "LocalHeroQueryError";
  }
}

export async function getLocalHeroPage(input: LocalHeroFilters, signal?: AbortSignal): Promise<LocalHeroPage> {
  try {
    const filters = normalizeLocalHeroFilters(input);
    const db = await createPublicClient();
    const timeout = AbortSignal.timeout(5000);
    const { data, error } = await db.rpc("local_hero_page", { p_locality_code: filters.localityCode, p_query: filters.query, p_page: filters.page }, { get: true })
      .retry(false).abortSignal(signal ? AbortSignal.any([signal, timeout]) : timeout);
    if (error || !data) throw new LocalHeroQueryError();
    return data as unknown as LocalHeroPage;
  } catch (error) {
    unstable_rethrow(error);
    throw new LocalHeroQueryError();
  }
}

export async function getLocalHeroProfile(slug: string): Promise<LocalHeroProfile | null> {
  if (typeof slug !== "string" || slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) return null;
  try {
    const db = await createPublicClient();
    const { data, error } = await db.rpc("local_hero_profile", { p_slug: slug }, { get: true }).retry(false).abortSignal(AbortSignal.timeout(5000));
    if (error) throw new LocalHeroQueryError();
    return data as unknown as LocalHeroProfile | null;
  } catch (error) {
    unstable_rethrow(error);
    throw new LocalHeroQueryError();
  }
}
