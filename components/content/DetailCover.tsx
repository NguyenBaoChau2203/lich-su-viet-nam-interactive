"use client";

import { useState, type ReactNode } from "react";
import { MediaCredit, MediaLabels } from "@/components/content/MediaCredit";
import { LightboxTrigger } from "@/components/content/Lightbox";
import { CoverImage } from "@/components/content/CoverImage";
import type { MediaItem } from "@/lib/media";

/**
 * Ảnh bìa toàn chiều ngang ở đầu trang chi tiết (GĐ2): ảnh thật trước, chữ sau. Tiêu đề (children) chồng lên
 * phần dưới ảnh trên nền tối dần; bấm ảnh để xem lớn. Nhãn trung thực và ghi công nằm ngay dưới ảnh.
 */
export function DetailCover({ cover, children }: { cover: MediaItem; children: ReactNode }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="mt-4">
      <div className="relative isolate overflow-hidden rounded-card bg-[#1b1714] text-white">
        <LightboxTrigger
          mediaId={cover.id}
          label={cover.caption ?? cover.altText ?? ""}
          className="absolute inset-0 -z-10"
          disabled={failed}
        >
          <CoverImage cover={cover} onFailedChange={setFailed} />
        </LightboxTrigger>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
        <div className="pointer-events-none flex min-h-[18rem] flex-col justify-end p-5 sm:min-h-[24rem] sm:p-8 [&_a]:pointer-events-auto">
          {children}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        <MediaLabels item={cover} />
        {cover.caption ? (
          <p className="text-sm text-muted-foreground">
            {failed && <span className="mr-1 text-amber-500/90 font-medium">(Ảnh hiện không tải được)</span>}
            {cover.caption}
          </p>
        ) : failed ? (
          <p className="text-sm text-amber-500/90 font-medium">(Ảnh hiện không tải được)</p>
        ) : null}
        <MediaCredit item={cover} />
      </div>
    </div>
  );
}
