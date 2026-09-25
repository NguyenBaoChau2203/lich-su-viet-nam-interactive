"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { HistoricalEvent, HistoricalPlace } from "@/features/history/types";

export interface EventDetailPopupProps {
  event: HistoricalEvent | null;
  place: HistoricalPlace | null;
  onClose: () => void;
  onTriggerBattle?: (eventId: string) => void;
  className?: string;
}

export function EventDetailPopup({
  event,
  place,
  onClose,
  onTriggerBattle,
  className = "",
}: EventDetailPopupProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  const isBattleEvent =
    event.id.includes("dien-bien-phu") ||
    event.slug.includes("dien-bien-phu") ||
    event.title.toLowerCase().includes("chiến dịch") ||
    event.title.toLowerCase().includes("trận");

  return (
    <article
      role="dialog"
      aria-label={`Chi tiết sự kiện ${event.title}`}
      className={`bg-white/98 backdrop-blur-md border border-amber-900/30 shadow-2xl p-5 max-w-md w-full rounded-md animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {/* Header with Era Badge & Close Button */}
      <div className="flex items-start justify-between gap-3 mb-3 border-b border-amber-900/10 pb-3">
        <div>
          <span className="inline-block bg-red-100 text-red-900 border border-red-300 font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm mb-1.5">
            {event.eraId === "1945-1954" ? "Kháng chiến chống Pháp (1945–1954)" : "Kháng chiến chống Mỹ (1954–1975)"}
          </span>
          <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
            {event.title}
          </h3>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng thẻ thông tin"
          className="text-stone-400 hover:text-stone-800 p-1 rounded hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Meta Info: Time and Place */}
      <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs text-stone-600 mb-3 font-mono">
        <div className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{event.date.display}</span>
        </div>

        {place && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-stone-800">{place.name}</span>
          </div>
        )}
      </div>

      {/* Summary Narrative */}
      <p className="font-serif text-sm text-stone-700 leading-relaxed mb-4 border-l-2 border-red-700/60 pl-3 italic bg-amber-50/40 py-1.5">
        {event.summary}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-amber-900/10">
        {isBattleEvent && onTriggerBattle && (
          <button
            type="button"
            onClick={() => onTriggerBattle(event.id)}
            className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white font-medium text-xs sm:text-sm py-2 px-3 rounded shadow transition-all hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
          >
            <span>⚔️</span>
            <span>Tái hiện diễn biến tiến công (GSAP)</span>
          </button>
        )}

        <Link
          href={`/cau-chuyen/${event.slug}`}
          className="text-center font-serif text-xs text-amber-900 hover:text-red-700 hover:underline py-1 transition-colors"
        >
          Đọc bài viết và khảo chứng tư liệu đầy đủ →
        </Link>
      </div>
    </article>
  );
}
