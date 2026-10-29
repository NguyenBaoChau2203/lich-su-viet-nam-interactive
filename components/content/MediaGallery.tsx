"use client";

import { FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LightboxTrigger } from "@/components/content/Lightbox";
import { MediaCredit, MediaLabels } from "@/components/content/MediaCredit";
import { SafeImage } from "@/components/ui/SafeImage";
import type { MediaItem } from "@/lib/media";
import { responsiveImage } from "@/lib/utils/text";

type MediaGalleryProps = {
  media: MediaItem[];
  onVisibleCountChange?: (count: number) => void;
};

/** Một ảnh có nhãn, chú thích, ghi công; bấm để xem lớn. `wide`: ảnh xen giữa nội dung (khung rộng hơn). */
export function MediaFigure({
  item,
  wide = false,
  onFailedChange,
}: {
  item: MediaItem;
  wide?: boolean;
  onFailedChange?: (failed: boolean) => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <figure>
      <LightboxTrigger mediaId={item.id} label={item.caption ?? item.altText ?? ""}>
        <SafeImage
          {...responsiveImage(item.url, wide ? 900 : 600)}
          sizes={wide ? "(min-width: 1024px) 720px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
          width={item.width ?? undefined}
          height={item.height ?? undefined}
          alt={item.altText ?? item.caption ?? ""}
          className={(wide ? "aspect-[16/9]" : "aspect-[4/3]") + " w-full bg-muted object-cover"}
          style={item.focalPoint ? { objectPosition: item.focalPoint } : undefined}
          fallbackClassName={(wide ? "aspect-[16/9]" : "aspect-[4/3]") + " w-full"}
          onFailedChange={(isFailed) => {
            setFailed(isFailed);
            onFailedChange?.(isFailed);
          }}
        />
      </LightboxTrigger>
      <figcaption className="flex flex-col gap-1.5 p-3 text-sm">
        <MediaLabels item={item} />
        {item.caption && <span className="text-surface-foreground">{item.caption}</span>}
        <MediaCredit item={item} />
      </figcaption>
    </figure>
  );
}

function MediaGalleryItem({
  item,
  onFail,
}: {
  item: MediaItem;
  onFail: (id: string) => void;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  if (item.type === "image") {
    return (
      <li className="overflow-hidden rounded-card border border-border bg-surface">
        <MediaFigure
          item={item}
          onFailedChange={(isFailed) => {
            if (isFailed) {
              setFailed(true);
              onFail(item.id);
            }
          }}
        />
      </li>
    );
  }

  return (
    <li className="overflow-hidden rounded-card border border-border bg-surface">
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start gap-3 p-4 text-sm hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gold"
      >
        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-gold-deep" aria-hidden="true" />
        <span>
          <span className="block font-medium text-accent">
            {item.caption ?? "Tài liệu đính kèm"}
          </span>
          {item.sourceTitle && (
            <span className="text-xs text-muted-foreground">Nguồn: {item.sourceTitle}</span>
          )}
        </span>
      </a>
    </li>
  );
}

/**
 * Ảnh/tài liệu: mỗi ảnh có nhãn trung thực (ảnh tư liệu / ngày nay / minh họa, cảnh dựng lại, tô màu),
 * chú thích, chữ thay thế và dòng ghi công (tác giả · giấy phép · trang gốc).
 */
export function MediaGallery({ media, onVisibleCountChange }: MediaGalleryProps) {
  const [failedIds, setFailedIds] = useState<Set<string>>(() => new Set());

  const handleFail = useCallback((id: string) => {
    setFailedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const visibleCount = media.filter((m) => m.type !== "image" || !failedIds.has(m.id)).length;
    onVisibleCountChange?.(visibleCount);
  }, [media, failedIds, onVisibleCountChange]);

  const visibleItems = media.filter((m) => m.type !== "image" || !failedIds.has(m.id));
  if (visibleItems.length === 0) return null;

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {media.map((item) => (
        <MediaGalleryItem key={item.id} item={item} onFail={handleFail} />
      ))}
    </ul>
  );
}

/**
 * Khung phần "Hình ảnh": Nếu tất cả ảnh đều lỗi và không có tài liệu nào hiển thị được,
 * ẩn hoàn toàn cả tiêu đề và section để không để lại tiêu đề mồ côi rỗng.
 */
export function MediaGallerySection({
  media,
  title = "Hình ảnh",
  titleId = "anh-dia-diem",
  className = "mt-12",
}: {
  media: MediaItem[];
  title?: string;
  titleId?: string;
  className?: string;
}) {
  const [visibleCount, setVisibleCount] = useState<number>(media.length);

  if (visibleCount === 0) return null;

  return (
    <section aria-labelledby={titleId} className={className}>
      <h2 id={titleId} className="mb-4 font-serif text-2xl font-bold text-foreground">
        {title}
      </h2>
      <MediaGallery media={media} onVisibleCountChange={setVisibleCount} />
    </section>
  );
}
