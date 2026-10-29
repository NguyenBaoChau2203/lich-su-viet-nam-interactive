"use client";

import Link from "next/link";
import { ArrowUpRight, Landmark, MapPin, Video } from "lucide-react";
import { useState, type MouseEvent } from "react";
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

function HeritageSiteRowItem({
  site,
  homeHref,
  filtered,
  isSelected,
  onSelectPlace,
  buildSelectHref,
}: {
  site: HeritageSiteSummary;
  homeHref: string;
  filtered: boolean;
  isSelected: boolean;
  onSelectPlace(slug: string): void;
  buildSelectHref(slug: string): string;
}) {
  const [coverFailed, setCoverFailed] = useState(false);
  const HeadingTag = filtered ? "h3" : "h4";
  const selectHref = buildSelectHref(site.slug);
  const detailHref = buildPlaceDetailHref(site.slug, homeHref);

  return (
    <li
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
            className="h-[80px] w-[120px] rounded object-cover"
            fallbackClassName="h-[80px] w-[120px] rounded"
            onFailedChange={setCoverFailed}
            fallback={
              <div
                data-image-fallback="true"
                className="flex h-[80px] w-[120px] flex-col items-center justify-center gap-1 rounded bg-[#1b1714] p-1 text-center text-muted-foreground/80"
              >
                <Landmark className="h-5 w-5 text-amber-500/70" aria-hidden="true" />
                <span className="text-[11px] leading-tight text-white/70">Ảnh đang cập nhật</span>
              </div>
            }
          />
          {!coverFailed && (
            <span className="absolute bottom-1 left-1 bg-black/80 text-[10px] text-white px-1.5 py-0.2 rounded">
              {eraLabel(site.cover.era)}
            </span>
          )}
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
}

export function HeritageSiteList({
  items,
  homeHref,
  filtered = false,
  selectedPlaceSlug = null,
  onSelectPlace,
  buildSelectHref,
}: Props) {
  return (
    <ul className="heritage-site-list space-y-4">
      {items.map((site) => (
        <HeritageSiteRowItem
          key={site.slug}
          site={site}
          homeHref={homeHref}
          filtered={filtered}
          isSelected={site.slug === selectedPlaceSlug}
          onSelectPlace={onSelectPlace}
          buildSelectHref={buildSelectHref}
        />
      ))}
    </ul>
  );
}
