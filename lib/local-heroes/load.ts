import "server-only";
import { unstable_rethrow } from "next/navigation";
import { getLocalHeroPage } from "@/lib/queries/local-heroes";
import { LOCAL_HERO_FAILURE } from "./response";
import type { LocalHeroFilters, LocalHeroPageResponse } from "./types";
export async function loadLocalHeroPage(filters: LocalHeroFilters, signal?: AbortSignal): Promise<LocalHeroPageResponse> {
  try { return { ok: true, data: await (signal ? getLocalHeroPage(filters, signal) : getLocalHeroPage(filters)) }; }
  catch (error) { unstable_rethrow(error); return { ok: false, error: LOCAL_HERO_FAILURE }; }
}
