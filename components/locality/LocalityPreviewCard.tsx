"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { HeritageVideoDialog } from "@/components/heritage/HeritageVideoDialog";
import type { HeritageSiteSummary } from "@/lib/heritage/types";
import type { LocalHeroSummary, LocalityCode, RelationshipKind } from "@/lib/local-heroes/types";
import { buildLocalHeroDetailHref, buildPlaceDetailHref } from "@/lib/local-heroes/state";

const RELATIONSHIP_LABELS: Record<RelationshipKind, string> = {
  birthplace: "Nơi sinh",
  home_origin: "Quê quán",
  activity: "Hoạt động",
  commemoration: "Tưởng niệm",
};

export type LocalityPreviewCardProps =
  | {
      kind: "place";
      item: HeritageSiteSummary;
      homeHref: string;
      staggerIndex?: number;
      selected?: boolean;
    }
  | {
      kind: "person";
      item: LocalHeroSummary;
      localityCode: LocalityCode;
      homeHref: string;
      staggerIndex?: number;
    };

export function LocalityPreviewCard(props: LocalityPreviewCardProps) {
  const [imageError, setImageError] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null), videoButton = useRef<HTMLButtonElement>(null);
  const selected = props.kind === "place" && props.selected;
  useEffect(() => { if (selected) heading.current?.focus({ preventScroll: true }); }, [selected]);
  const staggerDelay = (props.staggerIndex ?? 0) * 45;

  if (props.kind === "place") {
    const { item, homeHref } = props;
    const cover = item.cover;
    const detailHref = buildPlaceDetailHref(item.slug, homeHref);
    const eraLabel =
      cover?.era === "historical"
        ? "Tư liệu lịch sử"
        : cover?.era === "today"
          ? "Ảnh ngày nay"
          : cover?.era === "illustration"
            ? "Hình minh họa"
            : null;

    return (
      <article
        className="locality-preview-card is-place"
        data-testid={selected ? "heritage-card" : "locality-preview-place"}
        style={props.staggerIndex === undefined ? undefined : { animationDelay: `${staggerDelay}ms` }}
      >
        <div className="locality-preview-media">
          {cover?.url ? (
            <SafeImage
              key={cover.url}
              src={cover.url}
              alt={cover.alt || item.name}
              width={260}
              height={146}
              className="locality-preview-img"
              fallbackClassName="locality-preview-media-fallback"
              style={cover.focalPoint ? { objectPosition: cover.focalPoint } : undefined}
            />
          ) : (
            <div className="locality-preview-media-fallback">
              <span>{imageError ? "Ảnh tạm thời không tải được" : "Tư liệu di tích"}</span>
            </div>
          )}
          {eraLabel && <span className="locality-preview-era-badge">{eraLabel}</span>}
        </div>

        <div className="locality-preview-content">
          <div className="locality-preview-meta">
            <span
              className={`locality-preview-tier-badge ${
                item.tier === "grade12" ? "is-grade12" : "is-extended"
              }`}
            >
              {item.tier === "grade12" ? "Trọng điểm Lớp 12" : "Mở rộng"}
            </span>
            {item.period && <span className="locality-preview-period">{item.period}</span>}
          </div>

          <h3 ref={heading} tabIndex={selected ? -1 : undefined} className="locality-preview-title">{item.name}</h3>
          {item.teaser && <p className="locality-preview-teaser">{item.teaser}</p>}
          {cover?.credit && <p className="locality-preview-credit">{cover.credit}</p>}
          {selected && item.historicalName && <p className="locality-preview-credit">Tên lịch sử: {item.historicalName}</p>}
          {selected && item.accuracyLevel !== "exact" && <p className="locality-preview-credit">Vị trí gần đúng{item.accuracyNote ? ` · ${item.accuracyNote}` : ""}</p>}
          {selected && item.videos.length > 0 && <button ref={videoButton} type="button" className="locality-preview-link" onClick={() => setVideoOpen(true)}>Xem video tư liệu</button>}
          {selected && videoOpen && item.videos.length > 0 && <HeritageVideoDialog video={item.videos[0]} siteName={item.name} open={videoOpen} onClose={() => { setVideoOpen(false); requestAnimationFrame(() => videoButton.current?.focus({ preventScroll: true })); }} />}
          {selected && item.lessonSlug && <Link href={`/bai-hoc/${item.lessonSlug}`} className="locality-preview-link">Học sâu trong chuyên đề</Link>}

          <Link href={detailHref} className="locality-preview-link">
            Đọc câu chuyện <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </article>
    );
  }

  // kind === "person"
  const { item, localityCode, homeHref } = props;
  const image = item.image;
  const detailHref = buildLocalHeroDetailHref(item.slug, homeHref);
  const matchedAssoc = item.associations.find((a) => a.qualifiesForCoverage && a.locality.code === localityCode);
  const relKind = matchedAssoc?.kind;
  const relLabel = relKind ? RELATIONSHIP_LABELS[relKind] : "Gắn với địa phương";

  const depictionLabel =
    image?.depictionKind === "historical_context"
      ? "Tư liệu bối cảnh"
      : image?.depictionKind === "portrait"
        ? "Chân dung"
        : null;
  const association = item.associations.find((a) => a.qualifiesForCoverage && a.locality.code === localityCode);

  return (
    <article
      className="locality-preview-card is-person"
      data-testid="locality-preview-person"
      style={props.staggerIndex === undefined ? undefined : { animationDelay: `${staggerDelay}ms` }}
    >
      <div className="locality-preview-media">
        {image?.url && !imageError ? (
          <Image
            src={image.url}
            alt={image.altText || item.name}
            width={260}
            height={146}
            className="locality-preview-img"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="locality-preview-media-fallback">
            <span>{imageError ? "Ảnh tạm thời không tải được" : "Chân dung nhân vật"}</span>
          </div>
        )}
        {depictionLabel && (
          <span className="locality-preview-era-badge">{depictionLabel}</span>
        )}
      </div>

      <div className="locality-preview-content">
        <div className="locality-preview-meta">
          <span className="locality-preview-relation-badge">{relLabel}</span>
        </div>

        <h3 className="locality-preview-title">{item.name}</h3>
        {item.contributionSummary && (
          <p className="locality-preview-teaser">{item.contributionSummary}</p>
        )}
        {association?.claim.certainty !== "verified" && association?.claim.uncertaintyNote && <p className="locality-preview-credit">{association.claim.uncertaintyNote}</p>}
        {image?.caption && <p className="locality-preview-credit">{image.caption}</p>}
        <p className="locality-preview-credit">Nguồn: {association?.claim.sources[0]?.title ?? "Đã dẫn trong hồ sơ"}</p>

        <Link href={detailHref} className="locality-preview-link">
          Xem câu chuyện <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
