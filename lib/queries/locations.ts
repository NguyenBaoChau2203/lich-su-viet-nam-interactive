import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";
import type { Database } from "@/lib/database.types";
import type { LocalityCode, LocalityRef } from "@/lib/local-heroes/types";
import type {
  HeritageCertainty,
  HeritageStorySection,
  HeritageTier,
  HeritageVideo,
} from "@/lib/heritage/types";
import { PUBLIC_MEDIA_FIELDS, pickCardCover, toMediaItems, type CardCover, type CardMediaRow, type MediaItem, type MediaRow } from "@/lib/media";
import { EVENT_CARD_MEDIA, toRelatedEvent, type RelatedEvent, type RelatedEventRow } from "@/lib/queries/events";
import { createPublicClient } from "@/lib/supabase/public";
import { parseAccuracyLevel, type AccuracyLevel, type WorkflowStatus } from "@/lib/utils/labels";

export type MapLocationEvent = {
  slug: string;
  title: string;
  dateText: string;
  topicSlug?: string;
  /** Chủ đề chính + chủ đề phụ, để lọc bản đồ theo chủ đề. */
  topicSlugs: string[];
  /** Địa điểm này là địa điểm CHÍNH của sự kiện. */
  isPrimary: boolean;
};

/** Địa điểm đã công bố CÓ TỌA ĐỘ, kèm các sự kiện đã công bố liên quan (UC03). */
export type MapLocation = {
  id: string;
  slug: string;
  name: string;
  historicalName: string | null;
  latitude: number;
  longitude: number;
  accuracyLevel: AccuracyLevel;
  accuracyNote: string | null;
  events: MapLocationEvent[];
  /** Ảnh thu nhỏ trong popup bản đồ (ảnh bìa của địa điểm). */
  cover?: CardCover;
};

type EmbeddedEvent = {
  slug: string;
  title: string;
  date_text: string;
  workflow_status: string;
  curriculum_topics: { slug: string } | null;
  event_topics: { curriculum_topics: { slug: string } | null }[];
};

/**
 * Địa điểm published có tọa độ + sự kiện published liên quan, sắp theo tên.
 * Địa điểm không có tọa độ thì không đưa vào (không tạo marker).
 */
export async function getMapLocations(): Promise<MapLocation[]> {
  const supabase = await createPublicClient();

  const { data, error } = await supabase
    .from("historical_locations")
    .select(
      "id, slug, name, historical_name, latitude, longitude, accuracy_level, accuracy_note, event_locations(is_primary, historical_events(slug, title, date_text, workflow_status, start_year, curriculum_topics(slug), event_topics(curriculum_topics(slug)))), media_assets(file_url, alt_text, media_type, is_cover, focal_point, sort_order)",
    )
    .eq("workflow_status", "published")
    .not("latitude", "is", null)
    .not("longitude", "is", null)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Không tải được địa điểm trên bản đồ: ${error.message}`);
  }

  return data.flatMap((location) => {
    // Cột nullable nhưng đã lọc `not is null` ở trên; kiểm tra lại để thu hẹp kiểu.
    if (location.latitude === null || location.longitude === null) return [];

    const events = location.event_locations
      .flatMap((link) => {
        // Sự kiện là null lúc chạy nếu nó chưa published (RLS ẩn với khách).
        const event = link.historical_events as (EmbeddedEvent & { start_year: number }) | null;
        if (!event || event.workflow_status !== "published") return [];
        return [{ event, isPrimary: link.is_primary ?? false }];
      })
      // Sự kiện xếp theo thời gian trong popup/danh sách.
      .sort((a, b) => a.event.start_year - b.event.start_year)
      .map(({ event, isPrimary }) => ({
        slug: event.slug,
        title: event.title,
        dateText: event.date_text,
        topicSlug: event.curriculum_topics?.slug,
        topicSlugs: [event.curriculum_topics?.slug, ...event.event_topics.map((link) => link.curriculum_topics?.slug)].filter(
          (slug): slug is string => Boolean(slug),
        ),
        isPrimary,
      }));

    return [
      {
        id: location.id,
        slug: location.slug,
        name: location.name,
        historicalName: location.historical_name,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracyLevel: parseAccuracyLevel(location.accuracy_level),
        accuracyNote: location.accuracy_note,
        events,
        cover: pickCardCover(location.media_assets as CardMediaRow[]),
      },
    ];
  });
}

export type LocationDetail = {
  status: WorkflowStatus;
  slug: string;
  name: string;
  historicalName: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  accuracyLevel: AccuracyLevel;
  accuracyNote: string | null;
  /** Ảnh địa điểm (ảnh ngày nay, ảnh xưa nếu có), có ghi công. */
  media: MediaItem[];
  /** Sự kiện đã công bố diễn ra tại địa điểm, theo thời gian; `role` là vai trò của địa điểm trong sự kiện. */
  events: (RelatedEvent & { role: string | null; isPrimary: boolean })[];
  /** Thông tin di sản địa phương nếu là địa danh theo địa phương đã công bố. */
  heritage: {
    tier: HeritageTier;
    rank: number;
    period: string;
    teaser: string;
    locality: LocalityRef;
    lessonSlug: string | null;
  } | null;
  /** Các đoạn câu chuyện đã thẩm định kèm nguồn trích dẫn. */
  story: HeritageStorySection[];
  /** Video tư liệu chính thống. */
  videos: HeritageVideo[];
};

/** Một địa điểm ĐÃ CÔNG BỐ theo slug kèm các sự kiện đã công bố liên quan (UC05); không có → null. */
export const getLocationDetail = cache(async (slug: string): Promise<LocationDetail | null> =>
  loadLocationDetail(await createPublicClient(), { slug }, true),
);

type RawSectionSource = {
  locator: string;
  scope_note: string;
  sources: {
    id: string;
    title: string;
    author_org: string | null;
    publisher: string | null;
    url: string | null;
    accessed_at: string | null;
  } | null;
};

type RawStorySection = {
  id: string;
  sort_order: number;
  heading: string;
  body: string;
  certainty: string;
  uncertainty_note: string | null;
  location_story_sources: RawSectionSource[];
};

type RawLocationVideo = {
  youtube_id: string;
  title: string;
  channel: string;
  channel_url: string | null;
  note: string | null;
  embed_checked_at: string;
  sort_order: number;
};

/** Nạp địa điểm bằng client tùy ý (công khai: ẩn danh + chỉ published; màn hình duyệt: phiên nhân sự, mọi trạng thái). */
export async function loadLocationDetail(
  supabase: SupabaseClient<Database>,
  by: { slug: string } | { id: string },
  publishedOnly: boolean,
): Promise<LocationDetail | null> {
  let query = supabase
    .from("historical_locations")
    .select(
      `slug, name, historical_name, description, latitude, longitude, accuracy_level, accuracy_note, workflow_status,
       heritage_tier, heritage_rank, heritage_period, heritage_teaser, lesson_slug, locality_code,
       history_localities(code, slug, official_name, reference_framework),
       media_assets(${PUBLIC_MEDIA_FIELDS}),
       location_videos(youtube_id, title, channel, channel_url, note, embed_checked_at, sort_order),
       location_story_sections(
         id, sort_order, heading, body, certainty, uncertainty_note,
         location_story_sources(locator, scope_note, sources(id, title, author_org, publisher, url, accessed_at))
       ),
       event_locations(location_role, is_primary, historical_events(slug, title, summary, date_text, date_precision, is_featured, start_year, workflow_status, curriculum_topics(name, slug), ${EVENT_CARD_MEDIA}))`,
    );
  query = "id" in by ? query.eq("id", by.id) : query.eq("slug", by.slug);
  if (publishedOnly) query = query.eq("workflow_status", "published");
  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new Error(`Không tải được địa điểm: ${error.message}`);
  }
  if (!data) return null;

  const events = data.event_locations
    .flatMap((link) => {
      // Sự kiện là null lúc chạy nếu nó chưa published (RLS ẩn với khách).
      const event = link.historical_events as RelatedEventRow | null;
      return event && event.workflow_status === "published"
        ? [{ ...toRelatedEvent(event), role: link.location_role, isPrimary: link.is_primary ?? false }]
        : [];
    })
    .sort((a, b) => a.startYear - b.startYear || a.title.localeCompare(b.title, "vi"));

  const rawHeritage = data as unknown as {
    heritage_tier: string | null;
    heritage_rank: number | null;
    heritage_period: string | null;
    heritage_teaser: string | null;
    lesson_slug: string | null;
    locality_code: string | null;
    history_localities: {
      code: string;
      slug: string;
      official_name: string;
      reference_framework: string;
    } | null;
    location_story_sections: RawStorySection[];
    location_videos: RawLocationVideo[];
  };

  const heritage =
    rawHeritage.heritage_tier && rawHeritage.history_localities
      ? {
          tier: rawHeritage.heritage_tier as HeritageTier,
          rank: rawHeritage.heritage_rank ?? 1,
          period: rawHeritage.heritage_period ?? "",
          teaser: rawHeritage.heritage_teaser ?? "",
          locality: {
            code: rawHeritage.history_localities.code as LocalityCode,
            slug: rawHeritage.history_localities.slug,
            officialName: rawHeritage.history_localities.official_name,
            referenceFramework: "VN-34-2025" as const,
          },
          lessonSlug: rawHeritage.lesson_slug,
        }
      : null;

  const story: HeritageStorySection[] = (rawHeritage.location_story_sections ?? [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((section) => {
      const sources = (section.location_story_sources ?? [])
        .filter((lss) => Boolean(lss.sources))
        .sort((a, b) => (a.sources?.title ?? "").localeCompare(b.sources?.title ?? "", "vi"))
        .map((lss) => ({
          id: lss.sources!.id,
          title: lss.sources!.title,
          authorOrg: lss.sources!.author_org,
          publisher: lss.sources!.publisher,
          url: lss.sources!.url,
          accessedAt: lss.sources!.accessed_at,
          locator: lss.locator,
          scopeNote: lss.scope_note,
        }));

      return {
        id: section.id,
        order: section.sort_order,
        heading: section.heading,
        body: section.body,
        certainty: section.certainty as HeritageCertainty,
        uncertaintyNote: section.uncertainty_note,
        sources,
      };
    });

  const videos: HeritageVideo[] = (rawHeritage.location_videos ?? [])
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
    status: data.workflow_status,
    slug: data.slug,
    name: data.name,
    historicalName: data.historical_name,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    accuracyLevel: parseAccuracyLevel(data.accuracy_level),
    accuracyNote: data.accuracy_note,
    media: toMediaItems(data.media_assets as MediaRow[]),
    events,
    heritage,
    story,
    videos,
  };
}
