"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { JourneyStop } from "@/lib/explorer/journey";
import { resolveJourneyMedia, type JourneyStopMedia } from "@/lib/explorer/journeys/media";
import { buildMapEventHref, type MapExplorerState } from "@/lib/explorer/map-state";

export function JourneyMedia({ media }: { media: JourneyStopMedia | null }) {
  const [failed, setFailed] = useState(false);
  return <figure className="journey-media">
    <div className="journey-media-frame">{media && !failed
      ? <Image src={media.url} alt={media.alt} width={media.width} height={media.height} unoptimized loading="eager" onError={() => setFailed(true)} />
      : <p role="status">{failed ? "Không tải được ảnh. Bạn vẫn có thể đọc thông tin và nguồn bên dưới." : "Mốc này chưa có ảnh đủ bằng chứng về nội dung và quyền sử dụng."}</p>}</div>
    {media && <figcaption>{media.kind === "illustration" ? "Minh họa lịch sử" : media.kind === "document" ? "Tài liệu" : "Ảnh lịch sử"} · {media.caption}
      <span>{media.creator} · <a href={media.rightsUrl} target="_blank" rel="noreferrer">{media.rights}</a> · <a href={media.sourcePage} target="_blank" rel="noreferrer">Trang ảnh gốc</a></span></figcaption>}
  </figure>;
}

export function JourneyStopReader({ journeyId, stop, state, eventAvailable, onReadingChange }: {
  journeyId: string; stop: JourneyStop; state: MapExplorerState; eventAvailable: boolean; onReadingChange(active: boolean): void;
}) {
  const reading = useRef<HTMLDivElement>(null);
  const sources = useRef<HTMLDetailsElement>(null);
  return <div className="journey-reading" ref={reading} tabIndex={0} role="region" aria-label="Nội dung mốc hành trình"
    onPointerEnter={() => onReadingChange(true)}
    onPointerLeave={() => onReadingChange(Boolean(sources.current?.open || reading.current?.contains(document.activeElement)))}
    onFocusCapture={() => onReadingChange(true)}
    onBlurCapture={event => onReadingChange(Boolean(sources.current?.open || (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))))}
    onClickCapture={() => onReadingChange(true)}>
    <p className="journey-date">{stop.date}</p>
    <h2 id="journey-stop-heading" tabIndex={-1}>{stop.title}</h2>
    <p className="journey-place">{stop.place}</p>
    <p className="journey-summary">{stop.summary}</p>
    <JourneyMedia key={`${journeyId}:${stop.id}`} media={resolveJourneyMedia(journeyId, stop.id)} />
    <p className="journey-accuracy">Vị trí gần đúng · {stop.datePrecision === "day" ? "Ngày có nguồn đối chiếu" : stop.datePrecision === "month" ? "Mốc ghi theo tháng" : "Mốc ghi theo năm"}</p>
    <details className="journey-sources" ref={sources}
      onToggle={event => onReadingChange(event.currentTarget.open || Boolean(reading.current?.contains(document.activeElement)))}>
      <summary>Nguồn và độ chính xác</summary>
      <p>{stop.accuracyNote}</p>
      <ul>{stop.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a><span>{source.title}</span></li>)}</ul>
      <a href={stop.coordinateSource.url} target="_blank" rel="noreferrer">Nguồn tọa độ · {stop.coordinateSource.publisher}</a>
      <p className="journey-source-date">Truy cập nguồn: {stop.coordinateSource.accessedAt}</p>
    </details>
    {eventAvailable && stop.eventSlug && <Link className="journey-detail" href={buildMapEventHref(stop.eventSlug, state)}>Xem chi tiết sự kiện →</Link>}
  </div>;
}
