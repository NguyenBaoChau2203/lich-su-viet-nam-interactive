import type { LocalityRef } from "@/lib/local-heroes/types";

export type HeritageTier = "grade12" | "extended";
export type HeritageCertainty = "verified" | "approximate" | "disputed" | "editorial";
export type UsageBasis = "open_license" | "public_domain" | "permission" | "coursework_reference";

export type HeritageVideo = {
  youtubeId: string;
  title: string;
  channel: string;
  channelUrl: string | null;
  note: string | null;
  checkedAt: string;
};

export type HeritageCover = {
  url: string;
  alt: string;
  focalPoint: string | null;
  era: "historical" | "today" | "illustration";
  credit: string;
  usageBasis: UsageBasis | null;
};

export type HeritageSiteSummary = {
  id: string;
  slug: string;
  name: string;
  historicalName: string | null;
  locality: LocalityRef;
  tier: HeritageTier;
  rank: number;
  period: string;
  teaser: string;
  latitude: number;
  longitude: number;
  accuracyLevel: "exact" | "approximate" | "region" | "unknown";
  accuracyNote: string | null;
  lessonSlug: string | null;
  cover: HeritageCover | null;
  videos: HeritageVideo[];
};

export type HeritageSourceCitation = {
  id: string;
  title: string;
  authorOrg: string | null;
  publisher: string | null;
  url: string | null;
  accessedAt: string | null;
  locator: string;
  scopeNote: string;
};

export type HeritageStorySection = {
  id: string;
  order: number;
  heading: string;
  body: string;
  certainty: HeritageCertainty;
  uncertaintyNote: string | null;
  sources: HeritageSourceCitation[];
};

export type HeritageCatalog = {
  items: HeritageSiteSummary[];
  coverage: {
    totalLocalities: 34;
    representedLocalities: number;
  };
};

export type HeritageCatalogResponse =
  | { ok: true; data: HeritageCatalog }
  | {
      ok: false;
      error: {
        code: "DATA_UNAVAILABLE";
        message: "Chưa tải được danh sách địa danh. Vui lòng thử lại.";
        retryable: true;
      };
    };
