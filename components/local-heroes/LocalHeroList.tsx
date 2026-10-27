"use client";
import Image from "next/image";
import { useState } from "react";
import { buildLocalHeroDetailHref } from "@/lib/local-heroes/state";
import type { LocalHeroImage, LocalHeroSummary, LocalityCode, RelationshipKind } from "@/lib/local-heroes/types";
const relationship: Record<RelationshipKind, string> = { birthplace: "Nơi sinh", home_origin: "Quê quán", activity: "Hoạt động", commemoration: "Tưởng niệm" };
function Thumbnail({ image }: { image: LocalHeroImage }) {
  const [failed, setFailed] = useState(false);
  return <div className="local-hero-thumbnail">{failed ? <span data-testid="local-hero-image-error">Ảnh tạm thời không tải được</span>
    : <Image src={image.url} alt={image.altText} width={120} height={80} loading="lazy" onError={() => setFailed(true)} />}
    {image.depictionKind === "historical_context" && <span className="local-hero-image-label">Tư liệu bối cảnh</span>}</div>;
}
export function LocalHeroList({ items, homeHref, localityCode }: { items: LocalHeroSummary[]; homeHref: string; localityCode: LocalityCode | null }) {
  return <ol className="local-hero-list">{items.map((person) => {
    const associations = person.associations.filter((a) => a.qualifiesForCoverage && (!localityCode || a.locality.code === localityCode));
    const life = [
      { year: person.birthYear, certainty: person.birthYearCertainty, label: "Sinh", uncertain: "Năm sinh" },
      { year: person.deathYear, certainty: person.deathYearCertainty, label: "Mất", uncertain: "Năm mất" },
    ].filter((date) => date.year !== null).map((date) => date.certainty === "verified" ? `${date.label} ${date.year}`
      : date.certainty === "approximate" ? `${date.label} khoảng ${date.year}` : `${date.uncertain} chưa thống nhất`).join(" · ");
    return <li key={person.id} data-testid="local-hero-row" data-person-id={person.id}>
      <Thumbnail key={person.image.id} image={person.image} /><div className="local-hero-copy">
        <h3>{person.name}</h3>
        {life && <p className="local-hero-life">{life}</p>}
        <p>{person.contributionSummary}</p>
        <ul className="local-hero-associations">{associations.map((a) => <li key={a.id}>{relationship[a.kind]} · {a.locality.officialName}</li>)}</ul>
        <p className="local-hero-source">Nguồn: {associations[0]?.claim.sources[0]?.title ?? "Đã dẫn trong hồ sơ"}</p>
        <a href={buildLocalHeroDetailHref(person.slug, homeHref)}>Xem câu chuyện<span className="sr-only"> của {person.name}</span> <span aria-hidden="true">↗</span></a>
      </div>
    </li>;
  })}</ol>;
}
