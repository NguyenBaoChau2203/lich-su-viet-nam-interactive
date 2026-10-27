"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { HeritageVideoDialog } from "./HeritageVideoDialog";
import { buildPlaceDetailHref } from "@/lib/local-heroes/state";
import { eraLabel, tierLabel } from "@/lib/heritage/format";
import { lessonCatalog } from "@/lib/lessons/catalog";
import type { HeritageSiteSummary } from "@/lib/heritage/types";

type Props = {
  site: HeritageSiteSummary;
  homeHref: string;
  onClose(): void;
};

export function HeritageSiteCard({ site, homeHref, onClose }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const wasVideoOpen = useRef(false);
  const activeVideoIndex = 0;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [site.slug]);

  useEffect(() => {
    if (wasVideoOpen.current && !videoDialogOpen) {
      requestAnimationFrame(() => {
        videoButtonRef.current?.focus({ preventScroll: true });
      });
    }
    wasVideoOpen.current = videoDialogOpen;
  }, [videoDialogOpen]);

  const lesson = site.lessonSlug ? lessonCatalog.find((l) => l.slug === site.lessonSlug) : null;
  const activeVideo = site.videos.length > 0 ? (site.videos[activeVideoIndex] ?? site.videos[0]) : null;

  return (
    <>
      <aside
        className="home-map-event-card heritage-card"
        data-testid="heritage-card"
        aria-labelledby="heritage-card-heading"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thông tin địa danh"
          className="heritage-card-close"
        >
          <X size={16} aria-hidden="true" />
        </button>

        {site.cover && (
          <div className="heritage-card-media relative">
            <SafeImage
              src={site.cover.url}
              alt={site.cover.alt}
              className="h-36 w-full object-cover"
              fallbackClassName="h-36"
            />
            <span className="absolute bottom-2 left-2 bg-black/75 text-xs text-white px-2 py-0.5 rounded">
              {eraLabel(site.cover.era)}
            </span>
          </div>
        )}

        <div className="heritage-card-body" role="region" aria-label="Nội dung tóm tắt địa danh" tabIndex={0}>
          <p className="text-xs font-semibold text-accent uppercase tracking-wider">
            {site.period} · {tierLabel(site.tier)}
          </p>

          <h2
            id="heritage-card-heading"
            ref={headingRef}
            tabIndex={-1}
            className="text-xl font-serif font-bold text-foreground mt-1 outline-none"
          >
            {site.name}
          </h2>

          {site.historicalName && (
            <p className="text-xs text-muted-foreground italic mt-0.5">
              Tên lịch sử: {site.historicalName}
            </p>
          )}

          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <span>📍 {site.locality.officialName}</span>
            {site.accuracyLevel !== "exact" && <span>· Vị trí gần đúng</span>}
          </p>

          <p className="text-sm text-foreground/90 mt-3 leading-relaxed">
            {site.teaser}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {site.videos.length > 0 && (
              <button
                ref={videoButtonRef}
                type="button"
                onClick={() => setVideoDialogOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-accent/60 text-xs font-medium text-accent hover:bg-muted"
              >
                <Video size={14} aria-hidden="true" />
                <span>Xem video ({site.videos.length})</span>
              </button>
            )}

            {site.lessonSlug && (
              <Link
                href={`/bai-hoc/${site.lessonSlug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <BookOpen size={14} aria-hidden="true" />
                <span>Học sâu: {lesson?.title ?? site.lessonSlug}</span>
              </Link>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border mt-auto flex justify-end">
          <Link
            href={buildPlaceDetailHref(site.slug, homeHref)}
            className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline underline-offset-4"
          >
            <span>Đọc câu chuyện</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      {videoDialogOpen && site.videos.length > 0 && (
        <HeritageVideoDialog
          video={activeVideo}
          siteName={site.name}
          open={videoDialogOpen}
          onClose={() => {
            setVideoDialogOpen(false);
            videoButtonRef.current?.focus({ preventScroll: true });
          }}
        />
      )}
    </>
  );
}
