"use client";

import React, { forwardRef } from "react";
import type { HistoricalPlace } from "@/features/history/types";
import { MapMarkerLayer } from "./MapMarkerLayer";

export interface VietnamGisMapSvgProps {
  viewBox?: string;
  places?: readonly HistoricalPlace[];
  selectedPlaceId?: string | null;
  onSelectPlace?: (place: HistoricalPlace) => void;
  children?: React.ReactNode;
  className?: string;
}

export const VietnamGisMapSvg = forwardRef<SVGSVGElement, VietnamGisMapSvgProps>(
  function VietnamGisMapSvg(
    {
      viewBox = "0 0 1000 1200",
      places = [],
      selectedPlaceId = null,
      onSelectPlace = () => {},
      children,
      className = "",
    },
    ref
  ) {
    return (
      <div
        role="region"
        aria-label="Bản đồ tương tác Việt Nam 1945–1975"
        className={`relative w-full h-full overflow-hidden bg-[#f4ece1] border border-amber-900/20 select-none ${className}`}
      >
        <svg
          ref={ref}
          viewBox={viewBox}
          className="w-full h-full transition-transform duration-300 ease-out"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="false"
        >
          <defs>
            {/* Vintage Paper Texture Filter */}
            <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e2ecf5" />
              <stop offset="50%" stopColor="#d5e5f2" />
              <stop offset="100%" stopColor="#c8ddec" />
            </linearGradient>

            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdfaf3" />
              <stop offset="100%" stopColor="#f7f0e3" />
            </linearGradient>

            <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Sea / Oceanic Background */}
          <rect width="1000" height="1200" fill="url(#seaGradient)" />

          {/* Sea Wave Lines / Old Cartography Waterlines */}
          <g opacity="0.25" stroke="#7eaec7" strokeWidth="0.8" fill="none">
            <path d="M 600,100 Q 750,150 900,120" />
            <path d="M 620,250 Q 780,280 920,240" />
            <path d="M 680,450 Q 820,490 950,460" />
            <path d="M 580,700 Q 750,750 940,710" />
            <path d="M 500,900 Q 680,950 880,920" />
            <path d="M 100,1050 Q 250,1100 400,1070" />
          </g>

          {/* Land Border Shadow */}
          <path
            d="M 190,140 
               C 220,100 320,60 420,80 
               C 490,90 560,110 590,150 
               C 620,190 570,220 530,230 
               C 500,240 480,270 490,320 
               C 500,380 540,430 570,480 
               C 600,530 630,590 650,660 
               C 670,730 680,810 650,870 
               C 620,930 550,960 480,990 
               C 420,1020 360,1070 330,1120 
               C 310,1150 270,1140 280,1100 
               C 290,1050 330,1000 350,950 
               C 360,910 330,880 320,840 
               C 300,780 350,720 370,660 
               C 390,600 360,530 330,470 
               C 300,410 270,360 250,300 
               C 230,240 170,180 190,140 Z"
            fill="#d9ceb9"
            opacity="0.4"
            transform="translate(4, 5)"
          />

          {/* Mainland Vietnam Vector Path */}
          <path
            d="M 190,140 
               C 220,100 320,60 420,80 
               C 490,90 560,110 590,150 
               C 620,190 570,220 530,230 
               C 500,240 480,270 490,320 
               C 500,380 540,430 570,480 
               C 600,530 630,590 650,660 
               C 670,730 680,810 650,870 
               C 620,930 550,960 480,990 
               C 420,1020 360,1070 330,1120 
               C 310,1150 270,1140 280,1100 
               C 290,1050 330,1000 350,950 
               C 360,910 330,880 320,840 
               C 300,780 350,720 370,660 
               C 390,600 360,530 330,470 
               C 300,410 270,360 250,300 
               C 230,240 170,180 190,140 Z"
            fill="url(#landGradient)"
            stroke="#9c7c58"
            strokeWidth="2.2"
            strokeLinejoin="round"
            filter="url(#shadowFilter)"
          />

          {/* Major Historical Rivers (Sông Hồng, Sông Cửu Long) */}
          <g stroke="#92b8d0" strokeWidth="2.5" fill="none" opacity="0.75" strokeLinecap="round">
            {/* Sông Hồng */}
            <path d="M 280,70 Q 380,140 490,210" />
            <path d="M 330,100 Q 420,160 490,210" />
            {/* Sông Cửu Long (Mê Kông) */}
            <path d="M 310,960 Q 380,990 440,1010" />
            <path d="M 330,990 Q 400,1030 460,1040" />
          </g>

          {/* Phú Quốc Island */}
          <ellipse
            cx="210"
            cy="1040"
            rx="20"
            ry="35"
            transform="rotate(-15 210 1040)"
            fill="url(#landGradient)"
            stroke="#9c7c58"
            strokeWidth="1.8"
          />
          <text
            x="210"
            y="1085"
            textAnchor="middle"
            className="font-serif text-[10px] fill-amber-900 font-semibold select-none"
          >
            Đảo Phú Quốc
          </text>

          {/* QUẦN ĐẢO HOÀNG SA (PARACEL ISLANDS) */}
          <g id="quan-dao-hoang-sa" className="select-none">
            <rect
              x="710"
              y="370"
              width="180"
              height="110"
              fill="#eef5fb"
              fillOpacity="0.7"
              stroke="#b18b5e"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              rx="4"
            />
            {/* Islands dots */}
            <circle cx="750" cy="405" r="4.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="780" cy="415" r="5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="830" cy="400" r="4" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="845" cy="440" r="4.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="800" cy="450" r="3.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <text
              x="800"
              y="392"
              textAnchor="middle"
              className="font-serif text-[12px] font-bold fill-red-900 tracking-wider uppercase select-none drop-shadow-sm"
            >
              QUẦN ĐẢO HOÀNG SA
            </text>
            <text
              x="800"
              y="472"
              textAnchor="middle"
              className="font-mono text-[9px] fill-amber-900/80 uppercase tracking-widest select-none"
            >
              (Việt Nam)
            </text>
          </g>

          {/* QUẦN ĐẢO TRƯỜNG SA (SPRATLY ISLANDS) */}
          <g id="quan-dao-truong-sa" className="select-none">
            <rect
              x="680"
              y="740"
              width="230"
              height="160"
              fill="#eef5fb"
              fillOpacity="0.7"
              stroke="#b18b5e"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              rx="4"
            />
            {/* Islands dots */}
            <circle cx="720" cy="780" r="4.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="760" cy="800" r="5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="820" cy="775" r="4" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="860" cy="830" r="5.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="790" cy="860" r="4" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <circle cx="840" cy="875" r="4.5" fill="#a47547" stroke="#ffffff" strokeWidth="1" />
            <text
              x="795"
              y="765"
              textAnchor="middle"
              className="font-serif text-[12px] font-bold fill-red-900 tracking-wider uppercase select-none drop-shadow-sm"
            >
              QUẦN ĐẢO TRƯỜNG SA
            </text>
            <text
              x="795"
              y="892"
              textAnchor="middle"
              className="font-mono text-[9px] fill-amber-900/80 uppercase tracking-widest select-none"
            >
              (Việt Nam)
            </text>
          </g>

          {/* Compass Rose (La bàn cổ trang nhã góc trên bên phải) */}
          <g transform="translate(850, 100)" opacity="0.6" className="select-none pointer-events-none">
            <circle r="36" fill="none" stroke="#a6835d" strokeWidth="1" />
            <circle r="30" fill="none" stroke="#a6835d" strokeWidth="0.5" strokeDasharray="2 2" />
            <polygon points="0,-32 7,-8 0,-14" fill="#dc2626" />
            <polygon points="0,-32 -7,-8 0,-14" fill="#991b1b" />
            <polygon points="0,32 7,8 0,14" fill="#665c54" />
            <polygon points="0,32 -7,8 0,14" fill="#3c3836" />
            <polygon points="-32,0 -8,7 -14,0" fill="#665c54" />
            <polygon points="32,0 8,7 14,0" fill="#665c54" />
            <text x="0" y="-36" textAnchor="middle" className="font-serif text-[11px] font-bold fill-red-800">
              B
            </text>
            <text x="0" y="46" textAnchor="middle" className="font-serif text-[10px] font-bold fill-stone-700">
              N
            </text>
          </g>

          {/* Custom tactical / battle layers */}
          {children}

          {/* Historical Place Markers Layer */}
          <MapMarkerLayer
            places={places}
            selectedPlaceId={selectedPlaceId}
            onSelectPlace={onSelectPlace}
          />
        </svg>
      </div>
    );
  }
);
