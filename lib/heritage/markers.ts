import type { ExplorerEvent, ExplorerLocation } from "@/lib/explorer/types";
import type { HeritageSiteSummary } from "./types";

export function heritageMarkerEvents(sites: readonly HeritageSiteSummary[]): ExplorerEvent[] {
  return sites.map((site) => {
    const location: ExplorerLocation = {
      slug: site.slug,
      name: site.name,
      historicalName: site.historicalName,
      latitude: site.latitude,
      longitude: site.longitude,
      accuracyLevel: site.accuracyLevel,
      accuracyNote: site.accuracyNote,
      isPrimary: true,
      role: null,
    };

    return {
      id: site.id,
      slug: `place:${site.slug}`,
      title: site.name,
      summary: site.teaser,
      dateText: site.period,
      datePrecision: "year",
      isFeatured: false,
      startYear: 0,
      endYear: null,
      topicSlugs: [],
      secondaryTopics: [],
      sourceCount: 0,
      locations: [location],
    };
  });
}
