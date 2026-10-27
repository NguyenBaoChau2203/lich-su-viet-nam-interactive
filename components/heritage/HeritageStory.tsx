import type { HeritageStorySection, HeritageSourceCitation } from "@/lib/heritage/types";

type Props = {
  sections: HeritageStorySection[];
};

export function HeritageStory({ sections }: Props) {
  if (sections.length === 0) return null;

  // Build an ordered, deduplicated list of citations across all sections
  const orderedSections = [...sections].sort((a, b) => a.order - b.order);
  const citationMap = new Map<string, { citation: HeritageSourceCitation; index: number }>();
  let nextCitationIndex = 1;

  for (const section of orderedSections) {
    for (const source of section.sources) {
      const key = `${source.id}-${source.locator}`;
      if (!citationMap.has(key)) {
        citationMap.set(key, { citation: source, index: nextCitationIndex++ });
      }
    }
  }

  const allCitations = Array.from(citationMap.values()).sort((a, b) => a.index - b.index);

  return (
    <section aria-labelledby="cau-chuyen" className="mt-8">
      <h2 id="cau-chuyen" className="mb-4 font-serif text-2xl font-bold text-foreground">
        Câu chuyện
      </h2>

      <div className="flex flex-col gap-6">
        {orderedSections.map((section) => {
          const sectionCitationIndices = section.sources
            .map((s) => citationMap.get(`${s.id}-${s.locator}`)?.index)
            .filter((idx): idx is number => typeof idx === "number");

          const paragraphs = section.body.split(/\n\s*\n/).filter(Boolean);

          return (
            <div key={section.id} className="rounded-card border border-border/60 bg-surface/30 p-5">
              <h3 className="mb-3 font-serif text-xl font-semibold text-foreground">
                {section.heading}
              </h3>

              <div className="flex flex-col gap-3 leading-relaxed text-foreground">
                {paragraphs.map((p, pIdx) => {
                  const isLastParagraph = pIdx === paragraphs.length - 1;
                  return (
                    <p key={pIdx} className="whitespace-pre-line text-sm sm:text-base">
                      {p}
                      {isLastParagraph && sectionCitationIndices.length > 0 && (
                        <span className="ml-1 inline-flex gap-1">
                          {sectionCitationIndices.map((idx) => (
                            <sup key={idx}>
                              <a
                                href={`#nguon-${idx}`}
                                aria-label={`Nguồn ${idx}`}
                                className="text-accent hover:underline font-semibold"
                              >
                                [{idx}]
                              </a>
                            </sup>
                          ))}
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>

              {section.certainty !== "verified" && section.uncertaintyNote && (
                <div className="mt-4 rounded border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200">
                  <span className="font-semibold">Lưu ý về độ xác thực: </span>
                  <span>{section.uncertaintyNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {allCitations.length > 0 && (
        <div className="mt-8 border-t border-border pt-6">
          <h3 className="mb-3 font-serif text-lg font-semibold text-foreground">
            Nguồn của câu chuyện
          </h3>
          <ol id="nguon-cau-chuyen" className="list-decimal space-y-2 pl-5 text-xs text-muted-foreground">
            {allCitations.map(({ citation, index }) => {
              const publisher = citation.authorOrg || citation.publisher;
              return (
                <li key={`${citation.id}-${index}`} id={`nguon-${index}`}>
                  <span className="font-medium text-foreground">{citation.title}</span>
                  {publisher && <span> — {publisher}</span>}
                  {citation.locator && <span> ({citation.locator})</span>}
                  {citation.scopeNote && <span>. {citation.scopeNote}</span>}
                  {citation.accessedAt && <span> — Đã truy cập: {citation.accessedAt}</span>}
                  {citation.url && (
                    <span>
                      {" · "}
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline underline-offset-2"
                      >
                        Liên kết nguồn
                      </a>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </section>
  );
}
