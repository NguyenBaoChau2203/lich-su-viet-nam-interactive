import Link from "next/link";
import { ArrowLeft, Navigation } from "lucide-react";
import { AccuracyBadge } from "@/components/content/AccuracyBadge";
import { BeforeAfterSlider } from "@/components/content/BeforeAfterSlider";
import { DetailCover } from "@/components/content/DetailCover";
import { LightboxProvider } from "@/components/content/Lightbox";
import { MediaGallerySection } from "@/components/content/MediaGallery";
import { CompactTimeline } from "@/components/content/CompactTimeline";
import { MiniMapLazy } from "@/components/map/MiniMapLazy";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { arrangeMedia, googleMapsLink } from "@/lib/media";
import type { LocationDetail } from "@/lib/queries/locations";
import { splitParagraphs } from "@/lib/utils/text";
import { cn } from "@/lib/utils/cn";
import { tierLabel } from "@/lib/heritage/format";
import { getLesson } from "@/lib/lessons";
import { HeritageStory } from "@/components/heritage/HeritageStory";
import { HeritageVideos } from "@/components/heritage/HeritageVideos";
import { LocalityPeople } from "@/components/heritage/LocalityPeople";

type LocationDetailViewProps = {
  location: LocationDetail;
  /** Xem trước ở màn hình duyệt: bố cục một cột vừa khung, không breadcrumb. */
  preview?: boolean;
  returnHref?: string | null;
};

/** Nội dung trang chi tiết địa điểm (UC05) — dùng chung cho trang công khai và xem trước ở màn hình duyệt. */
export function LocationDetailView({ location, preview = false, returnHref }: LocationDetailViewProps) {
  const paragraphs = splitParagraphs(location.description);
  const hasCoordinates = location.latitude !== null && location.longitude !== null;
  const { cover, pairs, gallery } = arrangeMedia(location.media);
  const maps = hasCoordinates ? googleMapsLink(location.latitude!, location.longitude!, location.accuracyLevel) : null;
  const lesson = location.heritage?.lessonSlug ? getLesson(location.heritage.lessonSlug) : null;

  return (
    <LightboxProvider items={location.media}>
      <article className={preview ? "" : "mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6"}>
        {!preview && (
          <div className="mb-4 flex flex-col gap-2">
            {returnHref && (
              <div>
                <Link
                  href={returnHref}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <ArrowLeft size={16} aria-hidden="true" />
                  <span>Trở lại địa danh theo địa phương</span>
                </Link>
              </div>
            )}
            <Breadcrumb
              items={[{ label: "Trang chủ", href: "/" }, { label: "Địa điểm" }, { label: location.name }]}
            />
          </div>
        )}

        <header className={cover ? "" : preview ? "max-w-3xl" : "mt-4 max-w-3xl"}>
          {cover ? (
            <DetailCover cover={cover}>
              <h1 className="max-w-3xl text-balance font-serif text-3xl font-bold text-white drop-shadow sm:text-5xl">
                {location.name}
              </h1>
              {location.historicalName && (
                <p className="mt-2 text-lg text-[#f3d9a4]">Tên lịch sử: {location.historicalName}</p>
              )}
            </DetailCover>
          ) : (
            <>
              <h1 className="text-balance font-serif text-3xl font-bold text-foreground sm:text-4xl">
                {location.name}
              </h1>
              {location.historicalName && (
                <p className="mt-2 text-lg text-gold-deep">Tên lịch sử: {location.historicalName}</p>
              )}
            </>
          )}

          {location.heritage && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className={cn("heritage-badge", location.heritage.tier === "grade12" && "is-grade12")}>
                {tierLabel(location.heritage.tier)}
              </span>
              <span className="heritage-badge">
                Thuộc {location.heritage.locality.officialName} — địa giới hành chính 2025
              </span>
              {location.heritage.period && (
                <span className="heritage-badge">{location.heritage.period}</span>
              )}
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Độ chính xác tọa độ:</span>
            <AccuracyBadge level={location.accuracyLevel} />
          </div>
          {location.accuracyNote && (
            <p className="mt-2 text-sm text-muted-foreground">{location.accuracyNote}</p>
          )}
        </header>

        <div className={preview ? "mt-8 flex flex-col gap-10" : "mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]"}>
          <div className="flex min-w-0 flex-col gap-10">
            {location.story && location.story.length > 0 && (
              <HeritageStory sections={location.story} />
            )}

            {paragraphs.length > 0 && (
              <section aria-labelledby="gioi-thieu">
                <h2 id="gioi-thieu" className="mb-4 font-serif text-2xl font-bold text-foreground">
                  Giới thiệu
                </h2>
                <div className="flex max-w-3xl flex-col gap-4 leading-relaxed text-foreground">
                  {paragraphs.map((paragraph, index) => (
                    <p key={index} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {pairs.length > 0 && (
              <section aria-labelledby="xua-va-nay">
                <h2 id="xua-va-nay" className="mb-4 font-serif text-2xl font-bold text-foreground">
                  Xưa và nay
                </h2>
                <div className="flex flex-col gap-8">
                  {pairs.map((pair) => (
                    <BeforeAfterSlider key={pair.before.id} before={pair.before} after={pair.after} />
                  ))}
                </div>
              </section>
            )}

            {location.videos && location.videos.length > 0 && (
              <HeritageVideos videos={location.videos} />
            )}

            <section aria-labelledby="su-kien-tai-day">
              <h2 id="su-kien-tai-day" className="mb-4 font-serif text-2xl font-bold text-foreground">
                Sự kiện tại địa điểm này
              </h2>
              {location.events.length > 0 ? (
                <CompactTimeline
                  label={`Sự kiện diễn ra tại ${location.name}`}
                  events={location.events.map((event) => ({
                    ...event,
                    note: event.isPrimary ? "Địa điểm chính" : event.role,
                  }))}
                />
              ) : (
                <EmptyState
                  title="Chưa có sự kiện"
                  description="Chưa có sự kiện đã công bố nào gắn với địa điểm này."
                />
              )}
            </section>
          </div>

          <aside aria-label="Vị trí và thông tin đến thăm" className="flex min-w-0 flex-col gap-4">
            {lesson && (
              <section aria-labelledby="hoc-sau" className="rounded-card border border-border bg-surface p-4">
                <h2 id="hoc-sau" className="font-serif text-lg font-bold text-surface-foreground">
                  Học sâu trong chuyên đề
                </h2>
                <p className="mt-1 font-medium text-sm text-foreground">{lesson.title}</p>
                {lesson.tagline && (
                  <p className="mt-1 text-xs text-muted-foreground">{lesson.tagline}</p>
                )}
                <Link
                  href={`/bai-hoc/${lesson.slug}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  <span>Học bài này</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </section>
            )}

            {location.heritage?.locality && (
              <LocalityPeople
                localityCode={location.heritage.locality.code}
                localityName={location.heritage.locality.officialName}
              />
            )}

            {hasCoordinates ? (
              <MiniMapLazy
                locations={[
                  {
                    slug: location.slug,
                    name: location.name,
                    latitude: location.latitude!,
                    longitude: location.longitude!,
                    accuracyLevel: location.accuracyLevel,
                    isCurrent: true,
                  },
                ]}
                fullMapHref={`/ban-do?dia-diem=${location.slug}`}
              />
            ) : (
              <p className="rounded-card border border-dashed border-border p-4 text-sm text-muted-foreground">
                Địa điểm này chưa có tọa độ nên chưa hiển thị trên bản đồ.
              </p>
            )}

            {maps && (
              <section aria-labelledby="den-tham" className="rounded-card border border-border bg-surface p-4">
                <h2 id="den-tham" className="font-serif text-lg font-bold text-surface-foreground">
                  Đến thăm
                </h2>
                {location.accuracyNote && (
                  <p className="mt-1 text-sm text-muted-foreground">{location.accuracyNote}</p>
                )}
                <a
                  href={maps.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <Navigation className="h-4 w-4" aria-hidden="true" />
                  {maps.label}
                </a>
                <p className="mt-2 text-xs text-muted-foreground">
                  Giờ mở cửa và giá vé có thể thay đổi — hãy xem thông báo của ban quản lý di tích trước khi đi.
                </p>
              </section>
            )}
          </aside>
        </div>

        {gallery.length > 0 && (
          <MediaGallerySection media={gallery} title="Hình ảnh" titleId="anh-dia-diem" />
        )}
      </article>
    </LightboxProvider>
  );
}
