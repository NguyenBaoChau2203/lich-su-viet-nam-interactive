import type { Metadata } from "next";
import { pickCover } from "@/lib/media";
import { shareImage } from "@/lib/site";
import { notFound } from "next/navigation";
import { FigureDetailView } from "@/components/content/detail/FigureDetailView";
import { getFigureDetail } from "@/lib/queries/figures";
import { truncateForMeta } from "@/lib/utils/text";
import { getLocalHeroReturnHref } from "@/lib/local-heroes/state";

type FigurePageProps = { params: Promise<{ slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ params }: FigurePageProps): Promise<Metadata> {
  const { slug } = await params;
  const figure = await getFigureDetail(slug);
  if (!figure) return { title: "Không tìm thấy nội dung" };

  const description = truncateForMeta(
    figure.contributionSummary ?? figure.biography ?? `${figure.name} trong chương trình Lịch sử Việt Nam lớp 12.`,
  );
  return {
    title: figure.name,
    description,
    openGraph: {
      title: figure.name,
      description,
      type: "profile",
      images: [shareImage("nhan-vat", figure.slug, figure.name, pickCover(figure.media) !== null)],
    },
  };
}

export default async function FigurePage({ params, searchParams }: FigurePageProps) {
  const { slug } = await params;
  const figure = await getFigureDetail(slug);
  if (!figure) notFound();

  const query = searchParams ? await searchParams : {};
  const homeHref = figure.isLocalHero || query["kham-pha"] !== undefined ? getLocalHeroReturnHref(query["kham-pha"]) : undefined;
  return <>
    {homeHref && <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6"><a className="text-accent underline underline-offset-4 focus-visible:outline-2" href={homeHref}>← Trở lại nhân vật theo địa phương</a></div>}
    <FigureDetailView figure={figure} explorerReturnHref={homeHref} />
  </>;
}
