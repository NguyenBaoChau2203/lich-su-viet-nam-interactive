import type { ExplorerEvent, ExplorerLocation } from "@/lib/explorer/types";
import type { CardMediaRow } from "@/lib/media";
import { EVENT_CARD_MEDIA, toEventSummary } from "@/lib/queries/events";
import { createPublicClient } from "@/lib/supabase/public";
import { parseAccuracyLevel, type WorkflowStatus } from "@/lib/utils/labels";

type Embedded<T> = T | null;

type ExplorerEventRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  date_text: string;
  date_precision: string;
  is_featured: boolean | null;
  start_year: number;
  end_year: number | null;
  curriculum_topics: unknown;
  media_assets?: CardMediaRow[];
  event_topics?: { curriculum_topics: unknown }[];
  event_locations: {
    location_role: string | null;
    is_primary: boolean | null;
    historical_locations: Embedded<{
      slug: string;
      name: string;
      historical_name: string | null;
      latitude: number | null;
      longitude: number | null;
      accuracy_level: string;
      accuracy_note: string | null;
      workflow_status: WorkflowStatus;
    }>;
  }[];
  event_sources: {
    sources: Embedded<{
      id: string;
    }>;
  }[];
};

export async function getExplorerEvents(): Promise<ExplorerEvent[]> {
  const supabase = await createPublicClient();

  const { data, error } = await supabase
    .from("historical_events")
    .select(
      `id, slug, title, summary, date_text, date_precision, is_featured, start_year, end_year,
       curriculum_topics(name, slug),
       event_locations(location_role, is_primary, historical_locations(slug, name, historical_name, latitude, longitude, accuracy_level, accuracy_note, workflow_status)),
       event_sources(sources(id)),
       ${EVENT_CARD_MEDIA}`,
    )
    .eq("workflow_status", "published")
    .order("start_year", { ascending: true })
    .order("start_date", { ascending: true, nullsFirst: false })
    .order("title", { ascending: true });

  if (error) {
    throw new Error(`Không tải được dữ liệu khám phá sự kiện: ${error.message}`);
  }

  const rows = (data ?? []) as unknown as ExplorerEventRow[];

  return rows.map((row) => {
    const locations: ExplorerLocation[] = (row.event_locations ?? [])
      .flatMap((link) => {
        const loc = link.historical_locations;
        if (!loc || loc.workflow_status !== "published") return [];
        return [
          {
            slug: loc.slug,
            name: loc.name,
            historicalName: loc.historical_name,
            latitude: typeof loc.latitude === "number" && Number.isFinite(loc.latitude) ? loc.latitude : null,
            longitude: typeof loc.longitude === "number" && Number.isFinite(loc.longitude) ? loc.longitude : null,
            accuracyLevel: parseAccuracyLevel(loc.accuracy_level),
            accuracyNote: loc.accuracy_note,
            isPrimary: link.is_primary ?? false,
            role: link.location_role,
          },
        ];
      })
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

    const sourceCount = (row.event_sources ?? []).filter((link) => link.sources !== null).length;

    return {
      ...toEventSummary(row),
      id: row.id,
      startYear: row.start_year,
      endYear: row.end_year ?? null,
      locations,
      sourceCount,
    };
  });
}
