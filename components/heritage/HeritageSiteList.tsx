"use client";

import Link from "next/link";
import { ArrowUpRight, MapPin, Video } from "lucide-react";
import type { MouseEvent } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { buildPlaceDetailHref } from "@/lib/local-heroes/state";
import { eraLabel, tierLabel } from "@/lib/heritage/format";
import type { HeritageSiteSummary } from "@/lib/heritage/types";

type Props = {
  items: HeritageSiteSummary[];
  homeHref: string;
  filtered?: boolean;
  selectedPlaceSlug?: string | null;
  onSelectPlace(slug: string): void;
  buildSelectHref(slug: string): string;
};

const modified = (event: MouseEvent) =>
  event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

export function HeritageSiteList({
  items,
  homeHref,
  filtered = false,
  selectedPlaceSlug = null,
  onSelectPlace,
  buildSelectHref,
}: Props) {
  const HeadingTag = filtered ? "h3" : "h4";

  return (
    <ul className="heritage-site-list space-y-4">
      {items.map((site) => {
        const isSelected = site.slug === selectedPlaceSlug;
        const selectHref = buildSelectHref(site.slug);
        const detailHref = buildPlaceDetailHref(site.slug, homeHref);

        return (
          <li
            key={site.slug}
            data-testid="heritage-row"
            data-site-slug={site.slug}
            className={`heritage-row${isSelected ? " is-selected" : ""}`}
          >
            {site.cover && (
              <div className="heritage-thumb relative shrink-0">
                <SafeImage
                  src={site.cover.url}
                  alt={site.cover.alt}
                  style={site.cover.focalPoint ? { objectPosition: site.cover.focalPoint } : undefined}
                  className="h-20 w-30 rounded object-cover"
                  fallbackClassName="h-20 w-30 rounded"
                />
                <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] text-white px-1.5 py-0.2 rounded">
                  {eraLabel(site.cover.era)}
                </span>
              </div>
            )}

            <div className="heritage-row-content">
              <div className="flex flex-wrap items-center gap-2">
                <HeadingTag className="heritage-row-title text-foreground">
                  {site.name}
                </HeadingTag>
                <span className={`heritage-badge ${site.tier === "grade12" ? "is-grade12" : ""}`}>
                  {tierLabel(site.tier)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span>{site.period}</span>
                {site.videos.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-accent">
                    <Video size={12} aria-hidden="true" />
                    <span>Có video</span>
                  </span>
                )}
              </div>

              <p className="heritage-teaser text-xs text-foreground/85 mt-1.5 line-clamp-3">
                {site.teaser}
              </p>

              <div className="heritage-row-actions mt-2 flex items-center gap-4 text-xs">
                <a
                  href={selectHref}
                  onClick={(event) => {
                    if (!modified(event)) {
                      event.preventDefault();
                      onSelectPlace(site.slug);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  <MapPin size={13} aria-hidden="true" />
                  <span>Xem trên bản đồ</span>
                </a>

                <Link
                  href={detailHref}
                  className="inline-flex items-center gap-0.5 text-accent hover:underline"
                >
                  <span>Đọc câu chuyện</span>
                  <ArrowUpRight size={13} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
