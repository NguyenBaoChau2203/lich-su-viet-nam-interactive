import { SectionHeading } from "@/components/lesson/sections/shared";
import { balancedColumns, COLS, type ColCount } from "@/lib/lessons/layout";
import { cn } from "@/lib/utils/cn";
import type { Lesson } from "@/lib/lessons/types";

/** "Những mốc cần nhớ": các mốc thời gian chính của chuyên đề theo dòng thời gian ngang cân bằng. */
export function KeyDates({ lesson }: { lesson: Lesson }) {
  const cols = balancedColumns(lesson.keyDates.length, 3, 5) as ColCount;
  const colClass = COLS[cols] || "lg:grid-cols-4";

  return (
    <section aria-labelledby="moc-thoi-gian">
      <SectionHeading id="moc-thoi-gian" eyebrow="Dòng thời gian" title="Những mốc cần nhớ" />
      <ol className={cn("lesson-timeline grid gap-x-6 gap-y-8 sm:grid-cols-2", colClass)}>
        {lesson.keyDates.map((item) => (
          <li key={item.date} className="lesson-timeline__item">
            <p className="font-serif text-lg font-bold text-accent">{item.date}</p>
            <p className="mt-1 text-sm text-surface-foreground">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
