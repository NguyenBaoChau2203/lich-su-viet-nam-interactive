import { Callout } from "@/components/ui/Callout";
import { cn } from "@/lib/utils/cn";
import type { Lesson } from "@/lib/lessons/types";

/** "Học xong chuyên đề này, em có thể…" — yêu cầu cần đạt theo SGK. */
export function GoalBox({ lesson }: { lesson: Lesson }) {
  const isMultiCol = lesson.textbook.objectives.length >= 4;

  return (
    <section aria-label="Yêu cầu cần đạt">
      <Callout variant="goal" title="Học xong chuyên đề này, em có thể…">
        <p className="mb-2 text-sm text-muted-foreground">
          {lesson.textbook.series} · {lesson.textbook.lesson}
        </p>
        <ul
          className={cn(
            "list-disc pl-5",
            isMultiCol
              ? "grid gap-y-1.5 lg:grid-cols-2 lg:gap-x-10"
              : "flex flex-col gap-1.5"
          )}
        >
          {lesson.textbook.objectives.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Callout>
    </section>
  );
}
