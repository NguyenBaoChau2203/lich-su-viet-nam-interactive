"use client";

import React from "react";
import type { BattleTimelineControl } from "./useBattleGsapTimeline";

export interface BattlePlaybackBarProps {
  control: BattleTimelineControl;
  onClose: () => void;
  className?: string;
}

export function BattlePlaybackBar({
  control,
  onClose,
  className = "",
}: BattlePlaybackBarProps) {
  const {
    progress,
    isPlaying,
    activePhase,
    currentDateDisplay,
    currentNarrative,
    togglePlay,
    seek,
    jumpToPhase,
  } = control;

  return (
    <div
      role="region"
      aria-label="Bộ điều khiển diễn biến tiến công chiến dịch"
      className={`bg-white/98 backdrop-blur-md border border-amber-900/30 shadow-2xl p-4 rounded-lg flex flex-col gap-3 select-none ${className}`}
    >
      {/* Top Bar: Title, Date and Close/Return Button */}
      <div className="flex items-center justify-between gap-3 border-b border-amber-900/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
          </span>
          <span className="font-serif font-bold text-sm text-stone-900">
            Sa bàn Chiến dịch Điện Biên Phủ (1954)
          </span>
          <span className="font-mono text-xs bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded font-semibold">
            {currentDateDisplay}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Quay lại bản đồ toàn cảnh"
          className="flex items-center gap-1.5 text-xs font-mono text-stone-700 hover:text-red-700 border border-stone-300 hover:border-red-400 bg-stone-50 hover:bg-red-50 px-2.5 py-1 rounded transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          <span>⟲</span>
          <span className="hidden sm:inline">Quay lại bản đồ toàn cảnh</span>
        </button>
      </div>

      {/* Middle Row: Play/Pause, Slider, and 3 Phase Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng diễn biến" : "Phát diễn biến"}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-red-700 hover:bg-red-800 text-white shadow transition-transform active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600"
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-4 h-4 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Time Scrubber Slider */}
        <div className="flex-1 min-w-[160px] flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={progress}
            onChange={(e) => seek(parseFloat(e.target.value))}
            role="slider"
            aria-label="Thời gian diễn biến chiến dịch"
            className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        {/* 3 Attack Phase Jump Buttons */}
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => jumpToPhase("dot-1")}
            aria-label="Đợt 1 (13/3 – 17/3)"
            aria-pressed={activePhase === "dot-1"}
            className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
              activePhase === "dot-1"
                ? "bg-red-700 text-white border-red-700 font-bold"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            Đợt 1 (13/3)
          </button>
          <button
            type="button"
            onClick={() => jumpToPhase("dot-2")}
            aria-label="Đợt 2 (30/3 – 26/4)"
            aria-pressed={activePhase === "dot-2"}
            className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
              activePhase === "dot-2"
                ? "bg-red-700 text-white border-red-700 font-bold"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            Đợt 2 (30/3)
          </button>
          <button
            type="button"
            onClick={() => jumpToPhase("dot-3")}
            aria-label="Đợt 3 (01/5 – 07/5)"
            aria-pressed={activePhase === "dot-3"}
            className={`px-2 py-1 rounded border transition-colors cursor-pointer ${
              activePhase === "dot-3"
                ? "bg-red-700 text-white border-red-700 font-bold"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
            }`}
          >
            Đợt 3 (01/5 - 07/5)
          </button>
        </div>
      </div>

      {/* Live Narrative Log Box */}
      <div className="font-serif text-xs text-stone-700 bg-amber-50/60 border border-amber-900/15 p-2.5 rounded leading-relaxed">
        <span className="font-bold text-red-900 uppercase font-mono text-[10px] block mb-1">
          Nhật ký chiến trường:
        </span>
        {currentNarrative}
      </div>
    </div>
  );
}
