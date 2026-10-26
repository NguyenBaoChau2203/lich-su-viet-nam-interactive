import type { ReactNode } from "react";
import type { DepthPhotoItem } from "@/components/photo3d/DepthPhotoGallery";
import type { LessonExhibit, LessonImage } from "@/lib/lessons/types";

/** Nhãn trang trí đầu mỗi chương: CHƯƠNG {index} · {TITLE} */
export function ChapterLabel({ index, title }: { index: number; title: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold-deep"
    >
      <span className="h-px w-8 bg-gold-deep/60" />
      <span>
        CHƯƠNG {index} · {title}
      </span>
    </div>
  );
}

/** Lời dẫn đầu mục / chương thay thế cho đoạn lặp lại `-mt-3 mb-5 text-muted-foreground`. */
export function SectionIntro({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`-mt-3 mb-5 max-w-[70ch] text-muted-foreground ${className}`.trim()}>
      {children}
    </p>
  );
}

/** Tiêu đề mục của chuyên đề: dòng nhỏ (loại nội dung) + tiêu đề lớn. */
export function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <header className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-deep">{eyebrow}</p>
      <h2 id={id} className="mt-1 font-serif text-2xl font-bold text-foreground sm:text-3xl">
        {title}
      </h2>
    </header>
  );
}

export function Credit({ image }: { image: LessonImage }) {
  return (
    <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">
      {image.credit}
    </a>
  );
}

/** Ảnh bài học → mục của thư viện ảnh 3D (tiêu đề ngắn lấy từ chú thích nếu không có). */
export function photoItem(image: LessonImage): DepthPhotoItem {
  const id = image.src.split("/").pop()!.replace(/\.webp$/, "");
  return { id, title: image.title ?? image.caption.split(/[—(,.]/)[0].trim(), image };
}

/** Hiện vật (ảnh thật và/hoặc mô hình quét 360°) → mục của thư viện 3D. */
export function exhibitItem(exhibit: LessonExhibit): DepthPhotoItem {
  const base = exhibit.image ? photoItem(exhibit.image) : { id: `scan-${exhibit.scan!.sketchfabId}` };
  return { ...base, title: exhibit.title, text: exhibit.text, image: exhibit.image, scan: exhibit.scan };
}

export function initials(name: string): string {
  const words = name.split(/\s+/);
  return (words.length > 1 ? words[0][0] + words[words.length - 1][0] : name.slice(0, 2)).toUpperCase();
}
