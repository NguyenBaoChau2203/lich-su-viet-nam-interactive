import "server-only";
import { unstable_rethrow } from "next/navigation";
import { getHeritageCatalog } from "@/lib/queries/heritage";
import type { HeritageCatalogResponse } from "./types";

export const HERITAGE_CATALOG_FAILURE = {
  code: "DATA_UNAVAILABLE",
  message: "Chưa tải được danh sách địa danh. Vui lòng thử lại.",
  retryable: true,
} as const;

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
