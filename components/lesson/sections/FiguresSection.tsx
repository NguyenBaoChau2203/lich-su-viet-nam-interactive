import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FlipCard } from "@/components/lesson/FlipCard";
import { Credit, initials, SectionHeading } from "@/components/lesson/sections/shared";
import { SafeImage } from "@/components/ui/SafeImage";
import { balancedColumns, COLS, type ColCount } from "@/lib/lessons/layout";
import { cn } from "@/lib/utils/cn";
import type { Lesson } from "@/lib/lessons/types";

/** Nhân vật: thẻ lật (ảnh + vai trò ở mặt trước, tiểu sử ngắn ở mặt sau). */
export function FiguresSection({ lesson }: { lesson: Lesson }) {
  const cols = balancedColumns(lesson.figures.length, 2, 4) as ColCount;
  const colClass = COLS[cols] || "lg:grid-cols-4";

  return (
    <section aria-labelledby="nhan-vat">
      <SectionHeading id="nhan-vat" eyebrow="Nhân vật" title="Những con người làm nên lịch sử" />
      <ul className={cn("grid gap-x-4 gap-y-6 sm:grid-cols-2", colClass)}>
        {lesson.figures.map((figure) => (
          <li key={figure.name} className="row-span-2 grid grid-rows-subgrid gap-2">
            <FlipCard
              className="h-full min-h-[18rem]"
              front={
                <>
                  {figure.image ? (
                    <SafeImage
                      src={figure.image.src}
                      alt={figure.image.alt}
                      className="aspect-[4/3] w-full rounded-md object-cover object-top"
                      fallbackClassName="aspect-[4/3] rounded-md"
                    />
                  ) : (
                    <span
                      className="flex aspect-[4/3] w-full items-center justify-center rounded-md bg-muted font-serif text-4xl font-bold text-accent"
                      aria-hidden="true"
                    >
                      {initials(figure.name)}
                    </span>
                  )}
                  <span className="mt-3 block font-serif text-lg font-bold">{figure.name}</span>
                  <span className="block text-sm text-muted-foreground">{figure.role}</span>
                </>
              }
              back={
                <>
                  <span className="block font-serif text-lg font-bold">{figure.name}</span>
                  <span className="mt-2 block text-sm leading-relaxed">{figure.text}</span>
                </>
              }
            />
            <div className="flex flex-col gap-1 text-sm">
              {figure.href ? (
                <Link
                  href={figure.href}
                  className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
                >
                  Xem trang nhân vật
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
              {figure.image ? (
                <p className="text-xs text-muted-foreground">
                  Ảnh: <Credit image={figure.image} />
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
