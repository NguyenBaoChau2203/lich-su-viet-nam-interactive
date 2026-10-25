import Link from "next/link";
import { BookOpen, Calendar, MapPin } from "lucide-react";
import type { ExplorerEvent, ExplorerState } from "@/lib/explorer/types";
import { buildEventDetailHref } from "@/lib/explorer/url";
import { accuracyLevelLabels, datePrecisionLabels } from "@/lib/utils/labels";

export type ExplorerEventListProps = {
  events: readonly ExplorerEvent[];
  state: ExplorerState | null;
  hasDataError?: boolean;
};

export function ExplorerEventList({ events, state, hasDataError = false }: ExplorerEventListProps) {
  return (
    <section
      aria-labelledby="explorer-event-list-heading"
      data-testid="explorer-event-list"
      className="flex h-full flex-col rounded-lg border border-border bg-surface p-4 shadow-xs"
    >
      <div className="flex items-baseline justify-between gap-2 border-b border-border pb-3">
        <h2 id="explorer-event-list-heading" className="font-serif text-lg font-bold text-foreground">
          Sự kiện lịch sử đã công bố
        </h2>
        <span
          data-testid="explorer-event-count"
          className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-foreground/80"
        >
          {events.length} sự kiện
        </span>
      </div>

      {events.length === 0 ? (
        <div
          role="status"
          data-testid="explorer-event-empty"
          className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center text-sm text-foreground/75"
        >
          {hasDataError ? (
            <p>Chưa tải được danh sách sự kiện từ cơ sở dữ liệu. Sa bàn địa lý vẫn có thể xoay và thu phóng.</p>
          ) : (
            <p>Chưa có sự kiện đã công bố trong khoảng thời gian đang chọn.</p>
          )}
        </div>
      ) : (
        <ul className="mt-3 flex max-h-[calc(100vh-310px)] min-h-[360px] flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {events.map((event) => {
            const detailHref = state
              ? buildEventDetailHref(event.slug, state)
              : `/su-kien/${encodeURIComponent(event.slug)}`;
            const yearLabel =
              event.endYear && event.endYear !== event.startYear
                ? `${event.startYear}–${event.endYear}`
                : `${event.startYear}`;

            return (
              <li
                key={event.id}
                data-testid="explorer-event-item"
                data-event-slug={event.slug}
                className="rounded-md border border-border bg-background p-3 transition-colors hover:border-accent/50"
              >
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-foreground/75">
                  <span className="inline-flex items-center gap-1 font-semibold text-accent">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{event.dateText || yearLabel}</span>
                  </span>
                  {event.datePrecision !== "exact" && (
                    <span
                      data-testid="explorer-date-precision"
                      className="rounded-xs border border-border bg-surface-alt px-1.5 py-0.5 text-[11px] text-foreground/80"
                    >
                      {datePrecisionLabels[event.datePrecision]}
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-foreground/75">
                    <BookOpen className="h-3 w-3" aria-hidden="true" />
                    <span>{event.sourceCount} nguồn</span>
                  </span>
                </div>

                <h3 className="mt-1 font-serif text-base font-bold leading-snug text-foreground">
                  <Link
                    href={detailHref}
                    data-testid="explorer-event-link"
                    className="underline-offset-4 hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {event.title}
                  </Link>
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/80">{event.summary}</p>

                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-foreground/75">
                  {event.locations.length === 0 ? (
                    <span className="italic">Chưa gắn địa điểm tọa độ cụ thể</span>
                  ) : (
                    event.locations.map((loc) => (
                      <span
                        key={loc.slug}
                        className="inline-flex items-center gap-1 rounded-xs bg-surface-alt px-1.5 py-0.5 text-foreground"
                      >
                        <MapPin className="h-3 w-3 text-accent" aria-hidden="true" />
                        <span>{loc.name}</span>
                        {loc.accuracyLevel !== "exact" && (
                          <span className="text-foreground/75">({accuracyLevelLabels[loc.accuracyLevel]})</span>
                        )}
                      </span>
                    ))
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
