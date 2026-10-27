import "server-only";
import { unstable_rethrow } from "next/navigation";
import { createPublicClient } from "@/lib/supabase/public";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type {
  HeritageCatalog,
  HeritageCover,
  HeritageSiteSummary,
  HeritageTier,
  HeritageVideo,
  UsageBasis,
} from "@/lib/heritage/types";

export class HeritageQueryError extends Error {
  readonly code = "DATA_UNAVAILABLE" as const;
  constructor(message = "Chưa tải được danh sách địa danh. Vui lòng thử lại.") {
    super(message);
    this.name = "HeritageQueryError";
  }
}

type RawHeritageMedia = {
  file_url: string;
  alt_text: string | null;
  media_type: string | null;
  is_cover: boolean | null;
  focal_point: string | null;
  sort_order: number | null;
  era: string | null;
  photographer: string | null;
  license: string | null;
  usage_basis: string | null;
};

type RawHeritageVideo = {
  youtube_id: string;
  title: string;
  channel: string;
  channel_url: string | null;
  note: string | null;
  embed_checked_at: string;
  sort_order: number;
};

type RawHeritageLocality = {
  code: string;
  slug: string;
  official_name: string;
  reference_framework: string;
};

type RawHeritageLocation = {
  id: string;
  slug: string;
  name: string;
  historical_name: string | null;
  latitude: number;
  longitude: number;
  accuracy_level: string;
  accuracy_note: string | null;
  heritage_tier: string;
  heritage_rank: number;
  heritage_period: string;
  heritage_teaser: string;
  lesson_slug: string | null;
  locality_code: string;
  history_localities: RawHeritageLocality | null;
  media_assets: RawHeritageMedia[];
  location_videos: RawHeritageVideo[];
};

function pickCover(rows: readonly RawHeritageMedia[]): HeritageCover | null {
  const images = rows.filter((r) => r.media_type === "image" || !r.media_type);
  const chosen =
    images.find((r) => r.is_cover) ??
    [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0];

  if (!chosen) return null;

  const era =
    chosen.era === "today" || chosen.era === "illustration" ? chosen.era : "historical";

  return {
    url: chosen.file_url,
    alt: chosen.alt_text ?? "",
    focalPoint: chosen.focal_point,
    era,
    credit: chosen.photographer ?? chosen.license ?? "",
    usageBasis: (chosen.usage_basis as UsageBasis) ?? null,
  };
}

export async function getHeritageCatalog(signal?: AbortSignal): Promise<HeritageCatalog> {
  try {
    const db = await createPublicClient();
    const timeout = AbortSignal.timeout(5000);
    const combinedSignal = signal ? AbortSignal.any([signal, timeout]) : timeout;

    const { data, error } = await db
      .from("historical_locations")
      .select(
        `
        id,
        slug,
        name,
        historical_name,
        latitude,
        longitude,
        accuracy_level,
        accuracy_note,
        heritage_tier,
        heritage_rank,
        heritage_period,
        heritage_teaser,
        lesson_slug,
        locality_code,
        history_localities (
          code,
          slug,
          official_name,
          reference_framework
        ),
        media_assets (
          file_url,
          alt_text,
          media_type,
          is_cover,
          focal_point,
          sort_order,
          era,
          photographer,
          license,
          usage_basis
        ),
        location_videos (
          youtube_id,
          title,
          channel,
          channel_url,
          note,
          embed_checked_at,
          sort_order
        )
      `,
      )
      .eq("workflow_status", "published")
      .not("heritage_tier", "is", null)
      .not("latitude", "is", null)
      .order("locality_code", { ascending: true })
      .order("heritage_rank", { ascending: true })
      .abortSignal(combinedSignal);

    if (error) {
      throw new HeritageQueryError(error.message);
    }

    if (!data) {
      return {
        items: [],
        coverage: {
          totalLocalities: 34,
          representedLocalities: 0,
        },
      };
    }

    const rows = data as unknown as RawHeritageLocation[];
    const grade12Localities = new Set<string>();

    const items: HeritageSiteSummary[] = rows.map((row) => {
      const locality = row.history_localities;
      if (row.heritage_tier === "grade12" && row.locality_code) {
        grade12Localities.add(row.locality_code);
      }

      const videos: HeritageVideo[] = (row.location_videos ?? [])
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((v) => ({
          youtubeId: v.youtube_id,
          title: v.title,
          channel: v.channel,
          channelUrl: v.channel_url ?? null,
          note: v.note ?? null,
          checkedAt: v.embed_checked_at,
        }));

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        historicalName: row.historical_name,
        locality: {
          code: (locality?.code ?? row.locality_code) as LocalityCode,
          slug: locality?.slug ?? "",
          officialName: locality?.official_name ?? "",
          referenceFramework: "VN-34-2025",
        },
        tier: row.heritage_tier as HeritageTier,
        rank: row.heritage_rank,
        period: row.heritage_period,
        teaser: row.heritage_teaser,
        latitude: row.latitude,
        longitude: row.longitude,
        accuracyLevel: row.accuracy_level as "exact" | "approximate" | "region" | "unknown",
        accuracyNote: row.accuracy_note,
        lessonSlug: row.lesson_slug,
        cover: pickCover(row.media_assets ?? []),
        videos,
      };
    });

    return {
      items,
      coverage: {
        totalLocalities: 34,
        representedLocalities: grade12Localities.size,
      },
    };
  } catch (error) {
    unstable_rethrow(error);
    throw new HeritageQueryError();
  }
}
