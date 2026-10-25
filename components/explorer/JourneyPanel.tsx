"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import type { HistoryJourney, JourneyStop } from "@/lib/explorer/journey";
import type { JourneyPopupAnchor } from "@/lib/explorer/globe-contract";
import { JOURNEY_DWELL_MS } from "@/lib/explorer/journeys/playback";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";
import { JourneyStopReader } from "./JourneyStopReader";
import { JourneyStopPopup } from "./JourneyStopPopup";

type Props = { journey: HistoryJourney; stop: JourneyStop; state: MapExplorerState; playing: boolean; settled: boolean; travelling: boolean;
  readerActive: boolean; reducedMotion: boolean; mapAvailable: boolean; eventAvailable: boolean; popupOpen?: boolean; readerDismissed?: boolean; anchor?: JourneyPopupAnchor | null;
  onSeek(id: string): void; onPlay(): void; onExit(): void; onReadingChange(active: boolean): void; onCloseReader?(): void; onOpenReader?(): void };

export function JourneyPanel({ journey, stop, state, playing, settled, travelling, readerActive, reducedMotion, mapAvailable, eventAvailable,
  popupOpen = true, readerDismissed = false, anchor = null, onSeek, onPlay, onExit, onReadingChange, onCloseReader, onOpenReader }: Props) {
  const index = journey.stops.findIndex(item => item.id === stop.id);
  return <div className="journey-presentation" data-testid="journey-panel">
    {((!mapAvailable && !readerDismissed) || (popupOpen && !travelling)) && <JourneyStopPopup key={`${journey.id}:${stop.id}`} anchor={anchor} mapAvailable={mapAvailable} onReadingChange={onReadingChange}>
      <div className="journey-panel-top"><span>Mốc {index + 1} / {journey.stops.length}</span>
        <button type="button" onClick={onCloseReader} aria-label="Đóng thông tin mốc"><X size={18} aria-hidden="true" /></button></div>
      <JourneyStopReader journeyId={journey.id} stop={stop} state={state} eventAvailable={eventAvailable} onReadingChange={onReadingChange} />
    </JourneyStopPopup>}
    <section className="journey-controls" aria-label="Điều khiển hành trình">
      <div className="journey-controls-top"><button type="button" className="journey-read-current" onClick={onOpenReader} disabled={travelling && mapAvailable} aria-expanded={popupOpen || (!mapAvailable && !readerDismissed)}>Đọc mốc hiện tại</button>
        <button type="button" onClick={onExit} aria-label="Thoát hành trình">Thoát hành trình</button>
        <noscript><Link href={buildMapExplorerUrl({ ...state, journey: undefined, view: null })} className="journey-exit-noscript">Thoát hành trình</Link></noscript></div>
      <div className="journey-playback"><div>
        <button type="button" onClick={() => onSeek(journey.stops[index - 1].id)} disabled={index === 0} aria-label="Mốc trước"><ChevronLeft size={18} aria-hidden="true" /></button>
        <button type="button" onClick={onPlay} disabled={reducedMotion || !mapAvailable || (!playing && index === journey.stops.length - 1)} aria-label={playing ? "Tạm dừng hành trình" : "Phát hành trình"}>
          {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}{playing ? "Tạm dừng" : "Phát hành trình"}</button>
        <button type="button" onClick={() => onSeek(journey.stops[index + 1].id)} disabled={index === journey.stops.length - 1} aria-label="Mốc tiếp"><ChevronRight size={18} aria-hidden="true" /></button>
      </div><p role="status" aria-live="polite">{reducedMotion ? "Giảm chuyển động: chọn từng mốc để xem." : !mapAvailable ? "Bạn có thể đọc từng mốc khi địa cầu chưa sẵn sàng." : travelling ? "Đang chuyển tới địa điểm…" : readerActive ? "Đang tạm dừng để đọc · đóng nguồn và chọn Phát để tiếp tục." : playing && settled ? `Tự chuyển sau ít nhất ${JOURNEY_DWELL_MS / 1000} giây đọc.` : "Đang tạm dừng · bạn có thể tự khám phá."}</p></div>
    </section>
    <p className="sr-only" role="status" aria-live="polite">{settled ? `Mốc ${index + 1} / ${journey.stops.length}: ${stop.title}` : ""}</p>
    <nav className="journey-timeline" aria-label="Các mốc hành trình" data-testid="journey-timeline">
      <div className="journey-timeline-caption"><strong>{journey.period}</strong><span>Các mốc chọn lọc · vị trí gần đúng</span></div>
      <ol style={{ gridTemplateColumns: `repeat(${journey.stops.length}, minmax(0, 1fr))` }}>{journey.stops.map((item, position) => <li key={item.id}>
        <a href={buildMapExplorerUrl({ ...state, journey: { id: journey.id, stop: item.id }, selectedEvent: null, view: item.view })}
          onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); onSeek(item.id); } }}
          aria-current={item.id === stop.id ? "step" : undefined}>
          <span>{String(position + 1).padStart(2, "0")} · {item.date}</span><strong>{item.place.split(" · ")[0]}</strong>
        </a></li>)}</ol>
      <p>Đường nối các mốc (sơ đồ), không mô tả tuyến di chuyển thực tế.</p>
    </nav>
  </div>;
}
