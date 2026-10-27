import { CompactTimeline } from "@/components/content/CompactTimeline";
import { LightboxProvider, LightboxTrigger } from "@/components/content/Lightbox";
import { MediaCredit, MediaLabels } from "@/components/content/MediaCredit";
import { MediaGallery } from "@/components/content/MediaGallery";
import { RichContent } from "@/components/content/RichContent";
import { SourceList } from "@/components/content/SourceList";
import { StorySections } from "@/components/local-heroes/StorySections";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { SafeImage } from "@/components/ui/SafeImage";
import type { FigureDetail } from "@/lib/queries/figures";
import { arrangeMedia } from "@/lib/media";
import { parseRichText } from "@/lib/utils/rich-text";
import { formatLifespan, resizeCommonsImage, responsiveImage } from "@/lib/utils/text";

type FigureDetailViewProps = {
  figure: FigureDetail;
  /** Xem trước ở màn hình duyệt: bố cục một cột vừa khung, không breadcrumb. */
  preview?: boolean;
  explorerReturnHref?: string;
};

const relationshipLabels: Record<string, string> = {
  birthplace: "Nơi sinh",
  home_origin: "Quê quán",
  activity: "Địa bàn hoạt động",
  commemoration: "Tưởng niệm",
};

function formatHeroLifespan(figure: FigureDetail): string | null {
  if (!figure.isLocalHero) {
    return formatLifespan(figure.birthYear, figure.deathYear);
  }

  const parts: string[] = [];
  if (figure.birthYear !== null || figure.birthYearCertainty) {
    if (figure.birthYearCertainty === "disputed") {
      parts.push("Năm sinh chưa thống nhất");
    } else if (figure.birthYearCertainty === "approximate" && figure.birthYear !== null) {
      parts.push(`Sinh khoảng ${figure.birthYear}`);
    } else if (figure.birthYear !== null) {
      parts.push(`Sinh ${figure.birthYear}`);
    }
  }

  if (figure.deathYear !== null || figure.deathYearCertainty) {
    if (figure.deathYearCertainty === "disputed") {
      parts.push("Năm mất chưa thống nhất");
    } else if (figure.deathYearCertainty === "approximate" && figure.deathYear !== null) {
      parts.push(`Mất khoảng ${figure.deathYear}`);
    } else if (figure.deathYear !== null) {
      parts.push(`Mất ${figure.deathYear}`);
    }
  }

  if (parts.length === 2 && figure.birthYearCertainty === "verified" && figure.deathYearCertainty === "verified") {
    return `${figure.birthYear} – ${figure.deathYear}`;
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

/** Nội dung trang chi tiết nhân vật (UC05) — dùng chung cho trang công khai và xem trước ở màn hình duyệt. */
export function FigureDetailView({ figure, preview = false, explorerReturnHref }: FigureDetailViewProps) {
  const lifespan = formatHeroLifespan(figure);
  // Tiểu sử dùng cùng định dạng với nội dung sự kiện (đoạn, "> trích dẫn — nguồn", **đậm**, "### mục").
  const biography = parseRichText(figure.biography);
  const { cover: portrait, gallery } = arrangeMedia(figure.media);

  return (
    <LightboxProvider items={figure.media}>
      <article className={preview ? "" : "mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6"}>
        {!preview && (
          <Breadcrumb
            items={[{ label: "Trang chủ", href: explorerReturnHref ?? "/" }, { label: "Nhân vật" }, { label: figure.name }]}
          />
        )}

        <header className={preview ? "flex flex-col gap-6 sm:flex-row sm:items-start" : "mt-4 flex flex-col gap-6 sm:flex-row sm:items-start"}>
          {portrait ? (
            // Chân dung hoặc ảnh tư liệu từ kho ảnh: lớn, bấm để xem cỡ lớn, có nhãn và ghi công ngay bên dưới.
            <figure className="w-48 shrink-0 sm:w-60">
              <LightboxTrigger mediaId={portrait.id} label={portrait.caption ?? `Chân dung ${figure.name}`}>
                <SafeImage
                  {...responsiveImage(portrait.url, 480)}
                  sizes="240px"
                  alt={portrait.altText ?? `Chân dung ${figure.name}`}
                  priority
                  className="aspect-[3/4] w-full rounded-card border border-border bg-muted object-cover"
                  style={portrait.focalPoint ? { objectPosition: portrait.focalPoint } : { objectPosition: "50% 25%" }}
                  fallbackClassName="aspect-[3/4] w-full rounded-card border border-border"
                />
              </LightboxTrigger>
              <figcaption className="mt-2 flex flex-col gap-1">
                <MediaLabels item={portrait} />
                {portrait.caption && <span className="text-xs text-muted-foreground">{portrait.caption}</span>}
                <MediaCredit item={portrait} />
              </figcaption>
            </figure>
          ) : !figure.isLocalHero && figure.portraitUrl ? (
            <SafeImage
              src={resizeCommonsImage(figure.portraitUrl, 400)}
              alt={`Chân dung ${figure.name}`}
              className="aspect-[3/4] w-40 shrink-0 rounded-card border border-border bg-muted object-cover sm:w-48"
              fallbackClassName="aspect-[3/4] w-40 shrink-0 rounded-card border border-border sm:w-48"
            />
          ) : figure.isLocalHero ? (
            <div className="flex aspect-[3/4] w-48 shrink-0 flex-col items-center justify-center rounded-card border border-dashed border-border bg-muted/40 p-4 text-center text-xs text-muted-foreground sm:w-60">
              <span className="font-medium">Chưa có ảnh tư liệu được thẩm định</span>
            </div>
          ) : null}

          <div className="min-w-0">
            <h1 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
              {figure.name}
            </h1>
            {lifespan && <p className="mt-2 text-lg font-medium text-gold-deep">{lifespan}</p>}
            {figure.otherNames && (
              <p className="mt-1 text-muted-foreground">Còn được biết đến: {figure.otherNames}</p>
            )}
            {figure.isLocalHero && (
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full border border-gold/30 bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-deep">
                  Nhân vật lịch sử địa phương
                </span>
              </div>
            )}
          </div>
        </header>

        {figure.contributionSummary && (
          <section aria-labelledby="dong-gop-tieu-bieu" className="mt-8 rounded-card border border-border bg-surface p-5">
            <h2 id="dong-gop-tieu-bieu" className="font-serif text-2xl font-bold text-foreground">
              Đóng góp tiêu biểu
            </h2>
            <p className="mt-2 leading-relaxed text-foreground">{figure.contributionSummary}</p>
            {figure.contributionStartYear && figure.contributionEndYear && (
              <p className="mt-2 text-sm font-medium text-gold-deep">
                Thời kỳ hoạt động: {figure.contributionStartYear} – {figure.contributionEndYear}
              </p>
            )}
          </section>
        )}

        {figure.localities && figure.localities.length > 0 && (
          <section aria-labelledby="dia-phuong-gan-bo" className="mt-8">
            <h2 id="dia-phuong-gan-bo" className="mb-3 font-serif text-2xl font-bold text-foreground">
              Gắn với địa phương
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {figure.localities.map((loc, i) => {
                const label = relationshipLabels[loc.kind] ?? loc.kind;
                const isCommemoration = loc.kind === "commemoration" || loc.qualifiesForCoverage === false;

                return (
                  <div key={i} className="flex flex-col justify-between rounded-lg border border-border bg-surface p-4 text-sm shadow-xs">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-serif font-bold text-foreground">
                          {loc.historicalPlaceLabel || loc.localityName || loc.localityCode}
                        </span>
                        <span className="rounded bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold-deep">
                          {label}
                        </span>
                      </div>
                      {loc.localityName && loc.historicalPlaceLabel && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Thuộc: {loc.localityName}
                        </p>
                      )}
                      {isCommemoration && (
                        <div className="mt-1.5">
                          <span className="inline-block rounded border border-border/80 bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                            Quan hệ tưởng niệm / bổ sung
                          </span>
                        </div>
                      )}
                      {loc.certainty === "approximate" && (
                        <div className="mt-1.5">
                          <span className="inline-block rounded border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                            Địa danh ước tính / gần đúng
                          </span>
                        </div>
                      )}
                      {loc.certainty === "disputed" && (
                        <div className="mt-1.5">
                          <span className="inline-block rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-900">
                            Địa danh còn tranh luận
                          </span>
                        </div>
                      )}
                      {loc.explanation && (
                        <p className="mt-2 text-xs leading-relaxed text-foreground">
                          {loc.explanation}
                        </p>
                      )}
                    </div>

                    {loc.sources && loc.sources.length > 0 && (
                      <div className="mt-3 border-t border-border/50 pt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Nguồn: </span>
                        {loc.sources.map((src, sIdx) => (
                          <span key={src.sourceId}>
                            {sIdx > 0 && ", "}
                            <a
                              href={`#nguon-${src.sourceId}`}
                              className="text-accent underline hover:text-accent/80"
                              title={src.title}
                            >
                              {src.title}
                            </a>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {figure.stories && figure.stories.length > 0 && (
          <section aria-labelledby="cau-chuyen-lich-su-chi-tiet" className="mt-10">
            <h2 id="cau-chuyen-lich-su-chi-tiet" className="mb-4 font-serif text-2xl font-bold text-foreground">
              Câu chuyện lịch sử
            </h2>
            <StorySections stories={figure.stories} sources={figure.sources} />
          </section>
        )}

        <div className={preview ? "mt-8 flex flex-col gap-10" : "mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"}>
          <section aria-labelledby="tieu-su">
            <h2 id="tieu-su" className="mb-4 font-serif text-2xl font-bold text-foreground">
              Tiểu sử
            </h2>
            {biography.length > 0 ? (
              <RichContent sections={biography} headingLevel={3} />
            ) : (
              <p className="text-muted-foreground">Chưa có tiểu sử được công bố.</p>
            )}
          </section>

          <section aria-labelledby="su-kien-lien-quan">
            <h2 id="su-kien-lien-quan" className="mb-4 font-serif text-2xl font-bold text-foreground">
              Sự kiện liên quan
            </h2>
            {figure.events.length > 0 ? (
              <CompactTimeline
                label={`Sự kiện liên quan đến ${figure.name}`}
                explorerReturnHref={explorerReturnHref}
                events={figure.events.map((event) => ({ ...event, note: event.relationship }))}
              />
            ) : (
              <EmptyState
                title="Chưa có sự kiện liên quan"
                description="Chưa có sự kiện đã công bố nào gắn với nhân vật này."
              />
            )}
          </section>
        </div>

        {gallery.length > 0 && (
          <section aria-labelledby="anh-nhan-vat" className="mt-12">
            <h2 id="anh-nhan-vat" className="mb-4 font-serif text-2xl font-bold text-foreground">
              Hình ảnh
            </h2>
            <MediaGallery media={gallery} />
          </section>
        )}

        {figure.sources && figure.sources.length > 0 && (
          <section aria-labelledby="nguon-tham-khao" className="mt-12">
            <h2 id="nguon-tham-khao" className="mb-4 font-serif text-2xl font-bold text-foreground">
              Nguồn tham khảo
            </h2>
            <SourceList sources={figure.sources} />
          </section>
        )}

        {explorerReturnHref && (
          <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
            <a
              href={explorerReturnHref}
              className="text-sm font-medium text-accent underline underline-offset-4 hover:text-accent/80 focus-visible:outline-2"
            >
              ← Quay lại danh sách nhân vật
            </a>
          </div>
        )}
      </article>
    </LightboxProvider>
  );
}
