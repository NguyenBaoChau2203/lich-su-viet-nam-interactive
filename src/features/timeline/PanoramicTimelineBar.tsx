"use client";

import React from "react";

export interface TimelineMilestone {
  year: number;
  label: string;
  era: "1945-1954" | "1954-1975";
  shortDescription: string;
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  { year: 1945, label: "Cách mạng Tháng Tám", era: "1945-1954", shortDescription: "Tuyên ngôn Độc lập 2/9" },
  { year: 1946, label: "Toàn quốc Kháng chiến", era: "1945-1954", shortDescription: "Lời kêu gọi toàn quốc kháng chiến" },
  { year: 1950, label: "Chiến dịch Biên giới", era: "1945-1954", shortDescription: "Khai thông biên giới Việt - Trung" },
  { year: 1954, label: "Chiến thắng Điện Biên Phủ", era: "1945-1954", shortDescription: "Lừng lẫy năm châu & Hiệp định Genève" },
  { year: 1960, label: "Phong trào Đồng Khởi", era: "1954-1975", shortDescription: "Bến Tre & Mặt trận Dân tộc Giải phóng" },
  { year: 1963, label: "Chiến thắng Ấp Bắc", era: "1954-1975", shortDescription: "Đánh bại chiến thuật Trực thăng vận" },
  { year: 1968, label: "Tết Mậu Thân", era: "1954-1975", shortDescription: "Tổng tiến công và nổi dậy đồng loạt" },
  { year: 1972, label: "Điện Biên Phủ trên không", era: "1954-1975", shortDescription: "Thành cổ Quảng Trị & 12 ngày đêm Hà Nội" },
  { year: 1975, label: "Đại thắng Mùa Xuân", era: "1954-1975", shortDescription: "Chiến dịch Hồ Chí Minh toàn thắng" },
];

export interface PanoramicTimelineBarProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  className?: string;
}

export function PanoramicTimelineBar({
  selectedYear,
  onSelectYear,
  className = "",
}: PanoramicTimelineBarProps) {
  const milestoneYears = TIMELINE_MILESTONES.map((m) => m.year);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const currentIndex = milestoneYears.indexOf(selectedYear);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = currentIndex < milestoneYears.length - 1 ? currentIndex + 1 : 0;
      onSelectYear(milestoneYears[nextIndex]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : milestoneYears.length - 1;
      onSelectYear(milestoneYears[prevIndex]);
    }
  };

  return (
    <nav
      role="region"
      aria-label="Dòng thời gian lịch sử Việt Nam 1945–1975"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`bg-white/95 backdrop-blur-md border border-amber-900/20 shadow-lg px-4 py-3 select-none focus:outline-none focus:ring-2 focus:ring-red-600 ${className}`}
    >
      {/* Era Banner */}
      <div className="flex items-center justify-between text-xs font-mono border-b border-amber-900/10 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-700" aria-hidden="true" />
          <span className="font-bold tracking-wider text-red-900 uppercase">1945–1954</span>
          <span className="text-stone-500 hidden sm:inline">Kháng chiến chống thực dân Pháp</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-500 hidden sm:inline">Kháng chiến chống Mỹ cứu nước</span>
          <span className="font-bold tracking-wider text-amber-900 uppercase">1954–1975</span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-700" aria-hidden="true" />
        </div>
      </div>

      {/* Horizontal Milestone Strip */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
        {TIMELINE_MILESTONES.map((milestone) => {
          const isSelected = selectedYear === milestone.year;

          return (
            <button
              key={milestone.year}
              type="button"
              onClick={() => onSelectYear(milestone.year)}
              aria-label={`Năm ${milestone.year}: ${milestone.label}`}
              aria-pressed={isSelected}
              className={`flex flex-col items-center min-w-[56px] sm:min-w-[76px] px-1.5 py-1.5 rounded transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isSelected
                  ? "bg-red-700 text-white shadow-md scale-105"
                  : "bg-amber-50/70 hover:bg-amber-100 text-stone-800 border border-amber-900/10"
              }`}
            >
              <span
                className={`font-mono text-xs sm:text-sm font-bold ${
                  isSelected ? "text-white" : "text-stone-900"
                }`}
              >
                {milestone.year}
              </span>
              <span
                className={`text-[10px] leading-tight truncate max-w-[70px] hidden md:block text-center mt-0.5 ${
                  isSelected ? "text-amber-100 font-medium" : "text-stone-600"
                }`}
                title={milestone.label}
              >
                {milestone.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
