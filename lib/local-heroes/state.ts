export { normalizeLocalHeroQuery, foldLocalHeroQuery } from "./normalize";
import { normalizeLocalHeroFilters } from "./normalize";
import { LOCALITIES } from "./localities";
import type { LocalHeroFilters } from "./types";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";
import { getLegacyExplorerReturnHref } from "@/lib/explorer/url";
import { parseJourneySelection } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, type JourneyRegistry } from "@/lib/explorer/journeys/registry";
import { parsePlaceSelection } from "@/lib/heritage/state";

/**
 * Shared locality discovery state across historical events, local heroes, and heritage places.
 */
export type LocalHeroUrlState = {
  mode: "events" | "people" | "places" | "locality";
  filters: LocalHeroFilters;
  place?: string | null;
};

export type LocalHeroRuntimeState = {
  discovery: LocalHeroUrlState;
  suspended: { state: MapExplorerState; exploration: MapExplorerState | null } | null;
};

export type LocalHeroRuntimeAction =
  | { type: "locality-select"; code: LocalHeroFilters["localityCode"] }
  | { type: "locality-clear-selection" }
  | { type: "locality-exit-to-explore" }
  | { type: "people-enter"; mode?: "people" | "places" | "locality" }
  | { type: "people-change"; filters: LocalHeroFilters; keepPlace?: boolean }
  | { type: "people-exit" }
  | { type: "place-select"; slug: string | null };

export const LOCAL_HERO_KEYS = ["noi-dung", "dia-phuong", "q-nhan-vat", "trang-nhan-vat", "dia-danh"] as const;

export function parseLocalHeroState(params: URLSearchParams): LocalHeroUrlState {
  const noiDung = params.get("noi-dung");
  const mode =
    noiDung === "dia-phuong"
      ? "locality"
      : noiDung === "dia-danh"
        ? "places"
        : noiDung === "nhan-vat"
          ? "people"
          : "events";
  const state: LocalHeroUrlState = {
    mode,
    filters: normalizeLocalHeroFilters({
      localityCode: LOCALITIES.find((l) => l.slug === params.get("dia-phuong"))?.code,
      query: mode === "locality" ? "" : params.get("q-nhan-vat"),
      page: mode === "locality" ? 1 : params.get("trang-nhan-vat"),
    }),
  };
  if (mode === "places") {
    state.place = parsePlaceSelection(params);
  }
  return state;
}

export function localHeroFilterKey(filters: LocalHeroFilters): string {
  return JSON.stringify(normalizeLocalHeroFilters(filters));
}

export function localHeroParams(people: LocalHeroUrlState): URLSearchParams {
  const params = new URLSearchParams();
  if (people.mode === "locality") {
    params.set("noi-dung", "dia-phuong");
    const locality = LOCALITIES.find((l) => l.code === people.filters.localityCode);
    if (locality) params.set("dia-phuong", locality.slug);
    return params;
  }
  if (people.mode === "places") {
    params.set("noi-dung", "dia-danh");
    const locality = LOCALITIES.find((l) => l.code === people.filters.localityCode);
    if (locality) params.set("dia-phuong", locality.slug);
    if (people.place) params.set("dia-danh", people.place);
    return params;
  }
  if (people.mode === "people") params.set("noi-dung", "nhan-vat");
  const filters = normalizeLocalHeroFilters(people.filters);
  const locality = LOCALITIES.find((l) => l.code === filters.localityCode);
  if (locality) params.set("dia-phuong", locality.slug);
  if (filters.query) params.set("q-nhan-vat", filters.query);
  if (filters.page > 1) params.set("trang-nhan-vat", String(filters.page));
  return params;
}

function appendPeople(base: string, people: LocalHeroUrlState): string {
  const query = localHeroParams(people).toString();
  return query ? `${base}${base.includes("?") ? "&" : "?"}${query}` : base;
}

export function buildLocalHeroHomeHref(map: MapExplorerState, people: LocalHeroUrlState): string {
  return appendPeople(buildMapExplorerUrl(map), people);
}

export function buildLocalHeroDetailHref(slug: string, homeHref: string): string {
  if (slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) return "/?noi-dung=nhan-vat";
  return `/nhan-vat/${slug}?kham-pha=${encodeURIComponent(getLocalHeroReturnHref(homeHref))}`;
}

export function buildPlaceDetailHref(slug: string, homeHref: string): string {
  if (slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(slug)) return "/?noi-dung=dia-danh";
  return `/dia-diem/${slug}?kham-pha=${encodeURIComponent(getPlaceReturnHref(homeHref))}`;
}

/** Input from searchParams is already transport-decoded once. Never decode it into another URL. */
export function normalizeLocalHeroReturnHref(
  value: unknown,
  fallback: string,
  registry: JourneyRegistry = JOURNEY_REGISTRY,
): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.length > 8192 || /%(?![a-f0-9]{2})/iu.test(value)) return fallback;
  let parsed: URL;
  try {
    const decodedForValidation = decodeURIComponent(value);
    if (Array.from(decodedForValidation).length > 2048 || /[\\\u0000-\u001f\u007f-\u009f]/u.test(decodedForValidation)) return fallback;
    parsed = new URL(value, "http://explorer.local");
  } catch { return fallback; }
  if (parsed.origin !== "http://explorer.local" || parsed.pathname !== "/" || parsed.hash || parsed.username || parsed.password) return fallback;
  const params = parsed.searchParams, base = new URLSearchParams();
  const mapKeys = ["tu", "den", "su-kien", "goc", "ban-do", "hanh-trinh", "moc"];
  for (const key of params.keys()) {
    if (params.getAll(key).length !== 1 || ![...mapKeys, ...LOCAL_HERO_KEYS].includes(key as (typeof LOCAL_HERO_KEYS)[number])) return fallback;
    if (mapKeys.includes(key)) base.set(key, params.get(key)!);
  }
  if (params.has("noi-dung") && params.get("noi-dung") !== "nhan-vat" && params.get("noi-dung") !== "dia-danh" && params.get("noi-dung") !== "dia-phuong") return fallback;
  if (params.has("dia-phuong") && !LOCALITIES.some((l) => l.slug === params.get("dia-phuong"))) return fallback;
  if (params.has("trang-nhan-vat") && !/^[1-9][0-9]{0,5}$/u.test(params.get("trang-nhan-vat")!)) return fallback;
  if (params.has("dia-danh")) {
    const diaDanh = params.get("dia-danh")!;
    if (diaDanh.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(diaDanh)) return fallback;
  }
  if (params.has("su-kien") && (params.get("su-kien")!.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(params.get("su-kien")!))) return fallback;
  if (params.has("hanh-trinh") || params.has("moc")) {
    const selection = parseJourneySelection(params.get("hanh-trinh"), params.get("moc"), registry);
    if (!selection || selection.stop !== params.get("moc") || selection.id !== params.get("hanh-trinh")) return fallback;
  }
  const baseHref = base.size ? getLegacyExplorerReturnHref(`/?${base}`, "", registry, 8192) : "/";
  if (base.size && baseHref === "/") return fallback;
  return appendPeople(baseHref, parseLocalHeroState(params));
}

export function getLocalHeroReturnHref(value: unknown): string {
  return normalizeLocalHeroReturnHref(value, "/?noi-dung=nhan-vat");
}

export function getPlaceReturnHref(value: unknown): string {
  return normalizeLocalHeroReturnHref(value, "/?noi-dung=dia-danh");
}
