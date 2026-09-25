"use client";

import React, { useRef, useState, useMemo, useCallback } from "react";
import gsap from "gsap";
import { placesCatalog, eventsCatalog } from "@/features/history/catalog";
import type { HistoricalPlace, HistoricalEvent } from "@/features/history/types";
import { VietnamGisMapSvg } from "./VietnamGisMapSvg";
import { EventDetailPopup } from "./EventDetailPopup";
import { PanoramicTimelineBar } from "@/features/timeline/PanoramicTimelineBar";
import { DienBienPhuTacticalLayer } from "@/features/battle/DienBienPhuTacticalLayer";
import { BattlePlaybackBar } from "@/features/battle/BattlePlaybackBar";
import { useBattleGsapTimeline } from "@/features/battle/useBattleGsapTimeline";
import { DIEN_BIEN_PHU_CAMPAIGN } from "@/features/battle/battleData";

export function InteractiveMapStage() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Experience states
  const [mapMode, setMapMode] = useState<"overview" | "tactical-battle">("overview");
  const [viewBox, setViewBox] = useState<string>("0 0 1000 1200");
  const [selectedYear, setSelectedYear] = useState<number>(1954);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>("place-dien-bien");
  const [activeEventId, setActiveEventId] = useState<string | null>("event-chien-dich-dien-bien-phu");
  const [showAccessibleText, setShowAccessibleText] = useState<boolean>(false);

  // GSAP Battle Hook
  const battleControl = useBattleGsapTimeline(DIEN_BIEN_PHU_CAMPAIGN);

  // Resolve current active place and event
  const activePlace = useMemo(() => {
    return placesCatalog.find((p) => p.id === selectedPlaceId) || null;
  }, [selectedPlaceId]);

  const activeEvent = useMemo(() => {
    if (activeEventId) {
      const found = eventsCatalog.find((e) => e.id === activeEventId);
      if (found) return found;
    }
    // Fallback: match by year
    const byYear = eventsCatalog.find((e) => e.date.sortKey.startsWith(`${selectedYear}`));
    return byYear || null;
  }, [activeEventId, selectedYear]);

  // Transition Camera to Battle with GSAP
  const handleTriggerBattle = useCallback(() => {
    setMapMode("tactical-battle");
    setViewBox(DIEN_BIEN_PHU_CAMPAIGN.tacticalViewBox);

    if (svgRef.current) {
      gsap.to(svgRef.current, {
        attr: { viewBox: DIEN_BIEN_PHU_CAMPAIGN.tacticalViewBox },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  }, []);

  // Transition Camera Back to Overview with GSAP
  const handleReturnToOverview = useCallback(() => {
    battleControl.pause();
    setMapMode("overview");
    setViewBox("0 0 1000 1200");

    if (svgRef.current) {
      gsap.to(svgRef.current, {
        attr: { viewBox: "0 0 1000 1200" },
        duration: 1.2,
        ease: "power2.inOut",
      });
    }
  }, [battleControl]);

  // Year Selection
  const handleSelectYear = useCallback((year: number) => {
    setSelectedYear(year);
    // Find matching event for year
    const matching = eventsCatalog.find((e) => e.date.sortKey.startsWith(`${year}`));
    if (matching) {
      setActiveEventId(matching.id);
      if (matching.placeIds && matching.placeIds.length > 0) {
        setSelectedPlaceId(matching.placeIds[0]);
      }
    }
  }, []);

  // Place Selection on Map
  const handleSelectPlace = useCallback((place: HistoricalPlace) => {
    setSelectedPlaceId(place.id);
    const matchingEvent = eventsCatalog.find((e) => e.placeIds && e.placeIds.includes(place.id));
    if (matchingEvent) {
      setActiveEventId(matchingEvent.id);
      const year = parseInt(matchingEvent.date.sortKey.slice(0, 4), 10);
      if (!isNaN(year)) {
        setSelectedYear(year);
      }
    }
  }, []);

  // Map Zoom Controls
  const handleZoomIn = () => {
    if (svgRef.current) {
      const current = svgRef.current.viewBox.baseVal;
      const nw = current.width * 0.8;
      const nh = current.height * 0.8;
      const nx = current.x + (current.width - nw) / 2;
      const ny = current.y + (current.height - nh) / 2;
      gsap.to(svgRef.current, {
        attr: { viewBox: `${nx} ${ny} ${nw} ${nh}` },
        duration: 0.4,
        ease: "power1.out",
      });
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const current = svgRef.current.viewBox.baseVal;
      const nw = current.width * 1.25;
      const nh = current.height * 1.25;
      const nx = current.x + (current.width - nw) / 2;
      const ny = current.y + (current.height - nh) / 2;
      gsap.to(svgRef.current, {
        attr: { viewBox: `${nx} ${ny} ${nw} ${nh}` },
        duration: 0.4,
        ease: "power1.out",
      });
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      const target = mapMode === "tactical-battle" ? DIEN_BIEN_PHU_CAMPAIGN.tacticalViewBox : "0 0 1000 1200";
      gsap.to(svgRef.current, {
        attr: { viewBox: target },
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)] min-h-[640px] flex flex-col overflow-hidden bg-amber-50">
      {/* Top Floating Bar: Status, Mode, View Mode Toggle & Zoom Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Left: Mode Title Banner */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-amber-900/20 shadow-md px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 sm:gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" aria-hidden="true" />
          <div>
            <h2 className="font-serif text-xs sm:text-sm font-bold text-stone-900 leading-tight">
              {mapMode === "overview"
                ? "Bản đồ Lịch sử Toàn cảnh Việt Nam (1945–1975)"
                : "Sa bàn Tác chiến: Chiến dịch Điện Biên Phủ (1954)"}
            </h2>
            <p className="font-mono text-[10px] text-stone-500 hidden sm:block">
              {mapMode === "overview"
                ? "Chọn năm trên thanh thời gian hoặc bấm vào điểm di tích để tìm hiểu"
                : "Tua thời gian hoặc chọn đợt công kích để theo dõi các mũi tiến quân"}
            </p>
          </div>
        </div>

        {/* Right: Map Controls & Text Accessibility Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Accessible Alternative View Button */}
          <button
            type="button"
            onClick={() => setShowAccessibleText(!showAccessibleText)}
            aria-label="Xem diễn biến dạng danh sách văn bản"
            aria-pressed={showAccessibleText}
            className="bg-white/95 backdrop-blur-md border border-amber-900/20 shadow-md text-stone-800 hover:text-red-700 px-2.5 py-1.5 rounded-md font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>📜</span>
            <span className="hidden md:inline">Xem văn bản</span>
          </button>

          {/* Map Zoom Controls */}
          <div
            role="toolbar"
            aria-label="Điều khiển phóng to thu nhỏ bản đồ"
            className="flex bg-white/95 backdrop-blur-md border border-amber-900/20 shadow-md rounded-md overflow-hidden"
          >
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Phóng to"
              className="w-8 h-8 flex items-center justify-center text-stone-800 hover:bg-stone-100 font-bold border-r border-amber-900/10 cursor-pointer"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Thu nhỏ"
              className="w-8 h-8 flex items-center justify-center text-stone-800 hover:bg-stone-100 font-bold border-r border-amber-900/10 cursor-pointer"
            >
              −
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Đặt lại góc nhìn"
              className="w-8 h-8 flex items-center justify-center text-stone-800 hover:bg-stone-100 text-xs cursor-pointer"
            >
              ⟲
            </button>
          </div>
        </div>
      </div>

      {/* Main SVG Map Canvas */}
      <div className="flex-1 w-full h-full relative">
        <VietnamGisMapSvg
          ref={svgRef}
          viewBox={viewBox}
          places={placesCatalog}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={handleSelectPlace}
        >
          {/* Tactical Battle Overlay when in battle mode */}
          {mapMode === "tactical-battle" && (
            <DienBienPhuTacticalLayer
              campaign={DIEN_BIEN_PHU_CAMPAIGN}
              activePhase={battleControl.activePhase}
              progress={battleControl.progress}
            />
          )}
        </VietnamGisMapSvg>

        {/* Event Detail Popup Floating in Overview Mode */}
        {mapMode === "overview" && activeEvent && (
          <div className="absolute top-20 right-4 z-30 max-w-sm sm:max-w-md w-full">
            <EventDetailPopup
              event={activeEvent}
              place={activePlace}
              onClose={() => setActiveEventId(null)}
              onTriggerBattle={handleTriggerBattle}
            />
          </div>
        )}

        {/* Accessible Text Narrative Drawer (Accessible Alternative) */}
        {showAccessibleText && (
          <aside
            role="region"
            aria-label="Bảng tóm tắt nội dung lịch sử dạng văn bản"
            className="absolute top-20 left-4 z-30 max-w-md w-full max-h-[75vh] overflow-y-auto bg-white/98 backdrop-blur-md border border-amber-900/30 shadow-2xl p-5 rounded-md"
          >
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-3">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Toàn bộ Diễn biến Lịch sử (Dạng văn bản)
              </h3>
              <button
                type="button"
                onClick={() => setShowAccessibleText(false)}
                aria-label="Đóng bảng văn bản"
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 font-serif text-xs text-stone-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-red-900 uppercase font-mono text-[11px] mb-1">
                  Kháng chiến chống thực dân Pháp (1945–1954):
                </h4>
                <p>
                  Cách mạng Tháng Tám, Tuyên ngôn Độc lập (2/9/1945), Lời kêu gọi Toàn quốc kháng chiến (19/12/1946), Chiến dịch Biên giới thu - đông (1950), và đỉnh cao là Chiến dịch Điện Biên Phủ (13/3 – 7/5/1954).
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-900 uppercase font-mono text-[11px] mb-1">
                  3 Đợt tiến công Điện Biên Phủ:
                </h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Đợt 1 (13/3 - 17/3/1954):</strong> Tiêu diệt cứ điểm Him Lam, Độc Lập, bức hàng Bản Kéo; mở toang cửa ngõ phía Bắc.</li>
                  <li><strong>Đợt 2 (30/3 - 26/4/1954):</strong> Đột phá các điểm cao phía Đông (C1, D1, E1, A1), siết chặt chiến hào cắt đôi sân bay Mường Thanh.</li>
                  <li><strong>Đợt 3 (01/5 - 07/5/1954):</strong> Bộc phá 1 tấn nổ tung đồi A1, tổng công kích bắt sống tướng De Castries, giải phóng hoàn toàn thung lũng.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-amber-900 uppercase font-mono text-[11px] mb-1">
                  Kháng chiến chống Mỹ cứu nước (1954–1975):
                </h4>
                <p>
                  Phong trào Đồng Khởi Bến Tre (1960), Chiến thắng Ấp Bắc (1963), Cuộc Tổng tiến công và nổi dậy Tết Mậu Thân (1968), Chiến đấu 81 ngày đêm Thành cổ Quảng Trị & Điện Biên Phủ trên không (1972), Chiến dịch Hồ Chí Minh toàn thắng (30/4/1975).
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Floating Bar: Either Panoramic Timeline Bar or Battle Playback Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="pointer-events-auto max-w-4xl mx-auto">
          {mapMode === "overview" ? (
            <PanoramicTimelineBar
              selectedYear={selectedYear}
              onSelectYear={handleSelectYear}
              className="rounded-lg shadow-xl"
            />
          ) : (
            <BattlePlaybackBar
              control={battleControl}
              onClose={handleReturnToOverview}
              className="rounded-lg shadow-xl"
            />
          )}
        </div>
      </div>
    </div>
  );
}
