"use client";

import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MediaItem } from "@/lib/media";
import { responsiveImage } from "@/lib/utils/text";

type CoverImageProps = {
  cover: MediaItem;
  onFailedChange?: (failed: boolean) => void;
};

/**
 * Hiển thị ảnh bìa cho DetailCover với phương án dự phòng chuẩn:
 * Nếu ảnh không tải được, hiển thị placeholder màu tối ấm với hoa văn CSS tinh tế
 * và nhãn thông báo ở góc trên bên trái, không làm biến dạng cấu trúc tiêu đề.
 */
export function CoverImage({ cover, onFailedChange }: CoverImageProps) {
  const [failed, setFailed] = useState(false);
  const [prevUrl, setPrevUrl] = useState(cover.url);
  const imgRef = useRef<HTMLImageElement | null>(null);

  if (cover.url !== prevUrl) {
    setPrevUrl(cover.url);
    setFailed(false);
  }

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
      onFailedChange?.(true);
    }
  }, [cover.url, onFailedChange]);

  const handleFail = () => {
    setFailed(true);
    onFailedChange?.(true);
  };

  if (failed) {
    return (
      <div
        data-image-fallback="true"
        aria-label={cover.altText ?? cover.caption ?? "Ảnh bìa"}
        className="relative h-full w-full bg-gradient-to-br from-[#1b1714] to-[#3a2a1c]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 28px),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0, rgba(255, 255, 255, 0.03) 1px, transparent 1px, transparent 28px),
            linear-gradient(135deg, #1b1714 0%, #3a2a1c 100%)
          `,
        }}
      >
        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[12px] text-amber-200/90 backdrop-blur-sm">
          <ImageOff className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Ảnh đang được cập nhật</span>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- ảnh tự lưu nhiều cỡ (srcset), là phần tử LCP
    <img
      ref={(node) => {
        imgRef.current = node;
        if (node?.complete && node.naturalWidth === 0) handleFail();
      }}
      {...responsiveImage(cover.url, 1600)}
      sizes="(min-width: 1152px) 1152px, 100vw"
      alt={cover.altText ?? cover.caption ?? ""}
      fetchPriority="high"
      className="lesson-kenburns h-full w-full object-cover opacity-75"
      style={cover.focalPoint ? { objectPosition: cover.focalPoint } : undefined}
      onError={handleFail}
    />
  );
}
