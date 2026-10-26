import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import type { ExplorerEvent } from "@/lib/explorer/types";
import { buildMapEventHref, type MapExplorerState } from "@/lib/explorer/map-state";
import { accuracyLevelLabels, datePrecisionLabels } from "@/lib/utils/labels";
import { getLessonForEvent } from "@/lib/lessons";

type Props = { event: ExplorerEvent; state: MapExplorerState | null; onClose(): void };

export function MapEventCard({ event, state, onClose }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const lesson = getLessonForEvent(event.slug);
  const detailHref = lesson ? `/bai-hoc/${lesson.slug}` : buildMapEventHref(event.slug, state);

  return (
    <section className="home-map-event-card" aria-labelledby="map-event-heading" data-testid="map-event-card">
      <button type="button" onClick={onClose} aria-label="Đóng thông tin sự kiện"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-accent">
        <X size={18} aria-hidden="true" />
      </button>
      {event.cover && <SafeImage src={event.cover.url} alt={event.cover.alt} className="h-28 w-full shrink-0 bg-muted object-cover" fallbackClassName="h-28 shrink-0" />}
      <div tabIndex={0} role="region" aria-label="Nội dung tóm tắt sự kiện"
        className="min-h-0 overflow-y-auto p-5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent">
        <p className="pr-9 text-xs font-bold uppercase tracking-wide text-accent">{event.dateText || event.startYear}</p>
        {event.datePrecision !== "exact" && <p className="mt-1 text-xs text-muted-foreground">{datePrecisionLabels[event.datePrecision]}</p>}
        <h2 id="map-event-heading" ref={heading} tabIndex={-1} className="mt-2 font-serif text-xl font-bold leading-snug text-foreground outline-none">{event.title}</h2>
        <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
          {event.locations.map((location) => <li key={location.slug} className="flex items-start gap-1.5">
            <MapPin size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
            <span>{location.name}{location.accuracyLevel !== "exact" && ` · ${accuracyLevelLabels[location.accuracyLevel]}`}
              {location.accuracyNote && <span className="block">{location.accuracyNote}</span>}</span>
          </li>)}
          {event.locations.length === 0 && <li>Địa điểm đang được bổ sung.</li>}
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-foreground">{event.summary}</p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><BookOpen size={14} aria-hidden="true" />{event.sourceCount} nguồn tham khảo</p>
      </div>
      <Link href={detailHref} data-testid="map-event-detail"
        className="flex shrink-0 items-center justify-between border-t border-border px-5 py-4 text-sm font-bold text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent">
        Xem chi tiết <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
