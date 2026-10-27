import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityRef } from "@/lib/local-heroes/types";
import type { HeritageSiteSummary } from "./types";

const PLACE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_PLACE_SLUG_LENGTH = 160;

export function parsePlaceSelection(
  params: URLSearchParams | Record<string, string | string[] | undefined> | null | undefined,
): string | null {
  if (!params) return null;

  let raw: string | undefined | null = null;
  if (params instanceof URLSearchParams) {
    raw = params.get("dia-danh");
  } else if (typeof params === "object") {
    const val = params["dia-danh"];
    raw = Array.isArray(val) ? val[0] : val;
  }

  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_PLACE_SLUG_LENGTH) return null;
  if (!PLACE_SLUG_PATTERN.test(trimmed)) return null;

  return trimmed;
}

export type LocalityPlacesGroup = {
  locality: LocalityRef;
  places: HeritageSiteSummary[];
};

export function groupByLocality(items: HeritageSiteSummary[]): LocalityPlacesGroup[] {
  const map = new Map<string, HeritageSiteSummary[]>();

  for (const item of items) {
    const code = item.locality.code;
    const existing = map.get(code);
    if (existing) {
      existing.push(item);
    } else {
      map.set(code, [item]);
    }
  }

  const groups: LocalityPlacesGroup[] = [];
  for (const loc of LOCALITIES) {
    const places = map.get(loc.code);
    if (places && places.length > 0) {
      groups.push({
        locality: loc,
        places: [...places].sort((a, b) => a.rank - b.rank),
      });
    }
  }

  return groups;
}
