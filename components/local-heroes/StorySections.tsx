import type { PublicClaim, SourceCitation } from "@/lib/local-heroes/types";
import type { SourceListItem } from "@/components/content/SourceList";
import { cn } from "@/lib/utils/cn";

export type StoryItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  isPrimary: boolean;
  sortOrder: number;
  workflowStatus?: string;
  claims?: PublicClaim[];
};

type StorySectionsProps = {
  stories: StoryItem[];
  sources?: SourceListItem[];
  className?: string;
};

/**
 * Tách và dựng một đoạn văn bản có chứa mã chú dẫn [[cite:<claim-key>]].
 * Mỗi mã chú dẫn sẽ được phân giải thành số thứ tự của nguồn trong danh mục nguồn tham khảo.
 */
function renderParagraphWithCitations(
  text: string,
  claims: PublicClaim[] | undefined,
  sources: SourceListItem[] | undefined,
  paragraphKey: string | number,
) {
  // Bóc tách theo mẫu [[cite:key]]
  const parts = text.split(/(\[\[cite:[^\]]+\]\])/g);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    const citeMatch = part.match(/^\[\[cite:([^\]]+)\]\]$/);
    if (!citeMatch) {
      if (part) {
        elements.push(<span key={index}>{part}</span>);
      }
      return;
    }

    const claimKey = citeMatch[1].trim();
    const claim = claims?.find((c) => c.key === claimKey);
    const claimSources: SourceCitation[] = claim?.sources ?? [];

    if (claimSources.length === 0) {
      // Trường hợp claim không có nguồn cụ thể trong story
      return;
    }

    claimSources.forEach((src, srcIdx) => {
      let sourceNum = -1;
      if (sources && sources.length > 0) {
        const foundIdx = sources.findIndex((s) => s.id === src.sourceId);
        if (foundIdx >= 0) {
          sourceNum = foundIdx + 1;
        }
      }

      const displayLabel = sourceNum > 0 ? `[${sourceNum}]` : `[Nguồn]`;
      elements.push(
        <sup key={`${index}-${srcIdx}`} className="ml-0.5 select-none font-mono text-xs font-semibold">
          <a
            href={`#nguon-${src.sourceId}`}
            className="text-accent underline underline-offset-2 hover:text-accent/80 focus-visible:outline-2 focus-visible:outline-accent"
            title={`${src.title}${src.locator ? ` (${src.locator})` : ""}`}
            aria-label={`Chú thích nguồn: ${src.title}`}
          >
            {displayLabel}
          </a>
        </sup>,
      );
    });

    if (claim?.certainty === "disputed" && claim.uncertaintyNote) {
      elements.push(
        <span
          key={`${index}-disputed`}
          className="ml-1 inline-block rounded border border-amber-300 bg-amber-50 px-1.5 py-0.2 text-[11px] text-amber-800"
          title={claim.uncertaintyNote}
        >
          {claim.uncertaintyNote}
        </span>,
      );
    }
  });

  return (
    <p key={paragraphKey} className="leading-relaxed text-foreground">
      {elements}
    </p>
  );
}

/**
 * Hiển thị các câu chuyện lịch sử của nhân vật theo đúng tiêu chuẩn tư liệu:
 * - Phân biệt truyện chính và truyện bổ trợ
 * - Hiển thị tóm tắt và nội dung đầy đủ
 * - Chú dẫn nguồn tại chỗ theo mã [[cite:...]] nối tới mục Nguồn tham khảo
 * - Hoạt động bình thường cả khi không có JavaScript
 */
export function StorySections({ stories, sources, className }: StorySectionsProps) {
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {stories.map((story) => {
        const paragraphs = story.body
          .split(/\r?\n\r?\n/)
          .map((p) => p.trim())
          .filter(Boolean);

        return (
          <article
            key={story.id}
            id={`cau-chuyen-${story.slug}`}
            className="flex flex-col gap-3 rounded-card border border-border bg-surface p-5 sm:p-6 shadow-xs"
          >
            <div className="flex flex-wrap items-center gap-2">
              {story.isPrimary && (
                <span className="rounded-full border border-gold/30 bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-gold-deep">
                  Truyện chính
                </span>
              )}
              {story.workflowStatus && story.workflowStatus !== "published" && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                  Bản thảo ({story.workflowStatus})
                </span>
              )}
              <h3 className="font-serif text-xl font-bold text-foreground">{story.title}</h3>
            </div>

            {story.summary && (
              <p className="border-l-2 border-gold/40 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                {story.summary}
              </p>
            )}

            <div className="mt-2 flex flex-col gap-3">
              {paragraphs.map((p, pIdx) => renderParagraphWithCitations(p, story.claims, sources, pIdx))}
            </div>
          </article>
        );
      })}
    </div>
  );
}
