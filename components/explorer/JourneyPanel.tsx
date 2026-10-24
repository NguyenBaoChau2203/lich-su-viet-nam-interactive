"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HistoryJourney, JourneyStop } from "@/lib/explorer/journey";
import { JOURNEY_DWELL_MS } from "@/lib/explorer/journeys/playback";
import { buildMapEventHref, buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";

type Props = { journey: HistoryJourney; stop: JourneyStop; state: MapExplorerState; playing: boolean; settled: boolean; travelling: boolean;
  readerActive: boolean; reducedMotion: boolean; mapAvailable: boolean; eventAvailable: boolean;
  onSeek(id: string): void; onPlay(): void; onExit(): void; onReadingChange(active: boolean): void };

export function JourneyPanel({ journey, stop, state, playing, settled, travelling, readerActive, reducedMotion, mapAvailable, eventAvailable, onSeek, onPlay, onExit, onReadingChange }: Props) {
  const index = journey.stops.findIndex((item) => item.id === stop.id);
  const heading = useRef<HTMLHeadingElement>(null);
  const reading = useRef<HTMLDivElement>(null);
  const sources = useRef<HTMLDetailsElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    onReadingChange(Boolean(reading.current?.contains(document.activeElement) || sources.current?.open));
  }, [journey.id, stop.id, onReadingChange]);
  return <>
    <section className="home-map-event-card journey-panel" aria-labelledby="journey-stop-heading" data-testid="journey-panel">
      <div className="journey-panel-top"><span>Mốc {index + 1} / {journey.stops.length}</span>
        <button type="button" onClick={onExit} aria-label="Thoát hành trình"><X size={18} aria-hidden="true" /></button>
        <noscript>
          <Link href={buildMapExplorerUrl({ ...state, journey: undefined, view: null })} className="journey-exit-noscript" aria-label="Thoát hành trình">
            Thoát
          </Link>
        </noscript>
      </div>
      <div className="journey-reading" key={`${journey.id}:${stop.id}`} ref={reading} tabIndex={0} role="region" aria-label="Nội dung mốc hành trình"
        onFocusCapture={() => onReadingChange(true)}
        onBlurCapture={(event) => onReadingChange(Boolean(sources.current?.open || (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))))}>
        <p className="journey-date">{stop.date}</p>
        <h2 id="journey-stop-heading" tabIndex={-1} ref={heading}>{stop.title}</h2>
        <p className="journey-place">{stop.place}</p>
        <p className="journey-summary">{stop.summary}</p>
        <p className="journey-accuracy">Vị trí gần đúng · {stop.datePrecision === "day" ? "Ngày có nguồn đối chiếu" : stop.datePrecision === "month" ? "Mốc ghi theo tháng" : "Mốc ghi theo năm"}</p>
        <details className="journey-sources" ref={sources} key={`${journey.id}:${stop.id}`}
          onToggle={(event) => onReadingChange(event.currentTarget.open || Boolean(reading.current?.contains(document.activeElement)))}>
          <summary>Nguồn và độ chính xác</summary>
          <p>{stop.accuracyNote}</p>
          <ul>{stop.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}</a><span>{source.title}</span></li>)}</ul>
          <a href={stop.coordinateSource.url} target="_blank" rel="noreferrer">Nguồn tọa độ · {stop.coordinateSource.publisher}</a>
          <p className="journey-source-date">Truy cập nguồn: {stop.coordinateSource.accessedAt}</p>
        </details>
        {eventAvailable && stop.eventSlug && <Link className="journey-detail" href={buildMapEventHref(stop.eventSlug, state)}>Xem chi tiết sự kiện →</Link>}
      </div>
      <div className="journey-playback">
        <div><button type="button" onClick={() => onSeek(journey.stops[index - 1].id)} disabled={index === 0} aria-label="Mốc trước"><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" onClick={onPlay} disabled={reducedMotion || !mapAvailable || (!playing && index === journey.stops.length - 1)} aria-label={playing ? "Tạm dừng hành trình" : "Phát hành trình"}>
            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? "Tạm dừng" : "Phát hành trình"}</button>
          <button type="button" onClick={() => onSeek(journey.stops[index + 1].id)} disabled={index === journey.stops.length - 1} aria-label="Mốc tiếp"><ChevronRight size={18} aria-hidden="true" /></button></div>
        <p role="status" aria-live="polite">{reducedMotion ? "Giảm chuyển động: chọn từng mốc để xem." : !mapAvailable ? "Bạn có thể đọc từng mốc khi địa cầu chưa sẵn sàng." : travelling ? "Đang chuyển tới địa điểm…" : readerActive ? "Đang tạm dừng để đọc · đóng nguồn và rời vùng đọc để phát." : playing && settled ? `Tự chuyển sau ít nhất ${JOURNEY_DWELL_MS / 1000} giây đọc.` : "Đang tạm dừng · bạn có thể tự khám phá."}</p>
      </div>
    </section>
    <nav className="journey-timeline" aria-label="Các mốc hành trình" data-testid="journey-timeline">
      <div className="journey-timeline-caption"><strong>{journey.period}</strong><span>Các mốc chọn lọc · vị trí gần đúng</span></div>
      <ol style={{ gridTemplateColumns: `repeat(${journey.stops.length}, minmax(0, 1fr))` }}>{journey.stops.map((item, position) => <li key={item.id}>
        <a href={buildMapExplorerUrl({ ...state, journey: { id: journey.id, stop: item.id }, selectedEvent: null, view: item.view })}
          onClick={(event) => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onSeek(item.id); } }}
          aria-current={item.id === stop.id ? "step" : undefined}>
          <span>{String(position + 1).padStart(2, "0")} · {item.date}</span><strong>{item.place.split(" · ")[0]}</strong>
        </a>
      </li>)}</ol>
      <p>Đường nối các mốc (sơ đồ), không mô tả tuyến di chuyển thực tế.</p>
    </nav>
  </>;
}
