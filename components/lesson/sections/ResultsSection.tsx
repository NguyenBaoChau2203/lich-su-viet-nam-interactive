import { Quote } from "lucide-react";
import { CountUp } from "@/components/lesson/CountUp";
import { Credit, SectionHeading } from "@/components/lesson/sections/shared";
import { SafeImage } from "@/components/ui/SafeImage";
import { balancedColumns, COLS, type ColCount } from "@/lib/lessons/layout";
import { cn } from "@/lib/utils/cn";
import type { Lesson } from "@/lib/lessons/types";

/** Kết quả (số liệu), ảnh toàn cảnh, ý nghĩa lịch sử và câu trích. */
export function ResultsSection({ lesson }: { lesson: Lesson }) {
  const resultCols = balancedColumns(lesson.results.length, 2, 4) as ColCount;
  const colClass = COLS[resultCols] || "lg:grid-cols-3";

  return (
    <section aria-labelledby="ket-qua">
      <SectionHeading
        id="ket-qua"
        eyebrow="Kết quả và ý nghĩa"
        title={lesson.copy.resultsTitle}
      />

      {lesson.results.length > 0 && (
        <ul
          className={cn(
            "grid rounded-card border border-border bg-surface divide-y sm:divide-y-0 sm:divide-x divide-border sm:grid-cols-3",
            colClass
          )}
        >
          {lesson.results.map((stat) => (
            <li key={stat.label} className="p-6 text-left">
              <span className="block font-serif text-5xl font-bold text-accent">
                <CountUp value={stat.value} />
                {stat.suffix}
              </span>
              <span className="mt-2 block text-sm text-muted-foreground">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      )}

      {lesson.resultsImage && !lesson.resultsImage.depthSrc && (
        <figure className="mt-8 overflow-hidden rounded-card border border-border bg-surface">
          <SafeImage
            src={lesson.resultsImage.src}
            alt={lesson.resultsImage.alt}
            className="max-h-[32rem] w-full object-cover"
            fallbackClassName="aspect-[16/9]"
          />
          <figcaption className="p-3 text-sm text-surface-foreground">
            {lesson.resultsImage.caption}{" "}
            <span className="text-xs text-muted-foreground">
              (<Credit image={lesson.resultsImage} />)
            </span>
          </figcaption>
        </figure>
      )}

      <ul className="mt-10 grid gap-x-12 gap-y-8 lg:grid-cols-2">
        {lesson.significance.map((item, idx) => {
          const num = String(idx + 1).padStart(2, "0");
          return (
            <li key={item.title} className="flex gap-4">
              <span aria-hidden="true" className="w-12 shrink-0 font-serif text-3xl font-bold text-gold">
                {num}
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-surface-foreground leading-relaxed">{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>

      {lesson.quote && (
        <div className="mt-12 border-y border-gold/50 py-8 text-center">
          <figure className="mx-auto max-w-3xl">
            <Quote className="mx-auto h-8 w-8 text-gold" aria-hidden="true" />
            <blockquote className="mt-3 whitespace-pre-line font-serif text-2xl italic leading-relaxed text-foreground sm:text-3xl">
              {lesson.quote.text}
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">
              — {lesson.quote.author}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
