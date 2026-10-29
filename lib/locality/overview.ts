import type { LocalityCode } from "@/lib/local-heroes/types";
import type { HeritageLoadState, HeritageSiteSummary } from "@/lib/heritage/types";
import type { LocalHeroLoadState, LocalHeroSummary } from "@/lib/local-heroes/types";

export type LocalitySectionPlaces =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; total: number; items: HeritageSiteSummary[] };

export type LocalitySectionPeople =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "ready"; total: number; items: LocalHeroSummary[] };

export type LocalityOverviewData = {
  localityCode: LocalityCode | null;
  places: LocalitySectionPlaces;
  people: LocalitySectionPeople;
};

export function compareHeritageSites(a: HeritageSiteSummary, b: HeritageSiteSummary): number {
  const tierA = a.tier === "grade12" ? 0 : 1;
  const tierB = b.tier === "grade12" ? 0 : 1;
  if (tierA !== tierB) return tierA - tierB;
  if (a.rank !== b.rank) return a.rank - b.rank;
  return a.slug.localeCompare(b.slug);
}

export function buildLocalityOverview(
  localityCode: LocalityCode | null,
  heritage: HeritageLoadState,
  people: LocalHeroLoadState,
): LocalityOverviewData {
  if (!localityCode) {
    return {
      localityCode: null,
      places: { status: "ready", total: 0, items: [] },
      people: { status: "ready", total: 0, items: [] },
    };
  }

  // 1. Places derivation
  let places: LocalitySectionPlaces;
  if (heritage.status === "loading" || heritage.status === "idle") {
    places = { status: "loading" };
  } else if (heritage.status === "error") {
    places = { status: "error", error: heritage.error.message };
  } else {
    const matchingSites = heritage.data.items
      .filter((item) => item.locality.code === localityCode)
      .sort(compareHeritageSites);
    places = {
      status: "ready",
      total: matchingSites.length,
      items: matchingSites.slice(0, 2),
    };
  }

  // 2. People derivation with stale-key check
  let peopleSection: LocalitySectionPeople;
  if (people.status === "loading" || people.status === "idle") {
    peopleSection = { status: "loading" };
  } else if (people.status === "error") {
    // Check loading-key mismatch
    if (people.filters.localityCode !== localityCode) {
      peopleSection = { status: "loading" };
    } else {
      peopleSection = { status: "error", error: people.error.message };
    }
  } else {
    // status === "ready"
    // Stale response guard: check if loaded data belongs to current locality
    if (people.data.filters.localityCode !== localityCode) {
      peopleSection = { status: "loading" };
    } else {
      peopleSection = {
        status: "ready",
        total: people.data.totalPeople,
        items: people.data.items.slice(0, 2),
      };
    }
  }

  return {
    localityCode,
    places,
    people: peopleSection,
  };
}
