import "server-only";
import { unstable_rethrow } from "next/navigation";
import { getHeritageCatalog } from "@/lib/queries/heritage";
import { HERITAGE_CATALOG_FAILURE, type HeritageCatalogResponse } from "./types";

export { HERITAGE_CATALOG_FAILURE };

export async function loadHeritageCatalog(signal?: AbortSignal): Promise<HeritageCatalogResponse> {
  try {
    const data = await getHeritageCatalog(signal);
    return { ok: true, data };
  } catch (error) {
    unstable_rethrow(error);
    return {
      ok: false,
      error: HERITAGE_CATALOG_FAILURE,
    };
  }
}
