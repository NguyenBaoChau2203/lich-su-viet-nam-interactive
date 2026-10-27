import type { Metadata } from "next";
import { pickCover } from "@/lib/media";
import { shareImage } from "@/lib/site";
import { notFound } from "next/navigation";
import { LocationDetailView } from "@/components/content/detail/LocationDetailView";
import { getLocationDetail } from "@/lib/queries/locations";
import { truncateForMeta } from "@/lib/utils/text";
import { getPlaceReturnHref } from "@/lib/local-heroes/state";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type LocationPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParamsRecord>;
};

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getLocationDetail(slug);
  if (!location) return { title: "Không tìm thấy nội dung" };

  const description = truncateForMeta(
    location.heritage?.teaser ??
      location.description ??
      `${location.name} — địa điểm trong chương trình Lịch sử Việt Nam lớp 12.`,
  );
  return {
    title: location.name,
    description,
    openGraph: {
      title: location.name,
      description,
      type: "website",
      images: [shareImage("dia-diem", location.slug, location.name, pickCover(location.media) !== null)],
    },
  };
}

export default async function LocationPage({ params, searchParams }: LocationPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams ? searchParams : Promise.resolve({} as SearchParamsRecord),
  ]);
  const location = await getLocationDetail(slug);
  if (!location) notFound();

  const khamPhaParam = resolvedSearchParams["kham-pha"];
  const rawKhamPha =
    typeof khamPhaParam === "string"
      ? khamPhaParam
      : Array.isArray(khamPhaParam) && typeof khamPhaParam[0] === "string"
        ? khamPhaParam[0]
        : null;

  const returnHref = rawKhamPha !== null ? getPlaceReturnHref(rawKhamPha) : null;

  return <LocationDetailView location={location} returnHref={returnHref} />;
}
