"use client";

import React, { forwardRef } from "react";
import type { TacticalCampaignData } from "./battleData";

export interface DienBienPhuTacticalLayerProps {
  campaign: TacticalCampaignData;
  activePhase: "dot-1" | "dot-2" | "dot-3";
}

export const DienBienPhuTacticalLayer = forwardRef<SVGGElement, DienBienPhuTacticalLayerProps>(
  function DienBienPhuTacticalLayer(
    { campaign, activePhase },
    ref
  ) {
    const phase1Captured = new Set(["him-lam", "doc-lap", "ban-keo"]);
    const phase2Captured = new Set(["him-lam", "doc-lap", "ban-keo", "doi-c1", "san-bay"]);
    const phase3Captured = new Set([
      "him-lam",
      "doc-lap",
      "ban-keo",
      "doi-c1",
      "san-bay",
      "doi-a1",
      "de-castries",
      "hong-cum",
    ]);

    const currentCaptured =
      activePhase === "dot-1"
        ? phase1Captured
        : activePhase === "dot-2"
        ? phase2Captured
        : phase3Captured;

    const currentPhaseData = campaign.phases.find((p) => p.phaseId === activePhase) || campaign.phases[0];

    return (
      <g ref={ref} id="dien-bien-phu-tactical-layer" className="select-none">
        {/* Local Valley Backdrop (Thung lũng Mường Thanh) */}
        <ellipse
          cx="290"
          cy="240"
          rx="145"
          ry="175"
          fill="#eddcc7"
          fillOpacity="0.85"
          stroke="#b08b5e"
          strokeWidth="1.5"
          strokeDasharray="6 3"
        />

        {/* Sông Nậm Rốm uốn lượn qua lòng chảo */}
        <path
          d="M 270,95 Q 260,160 280,210 Q 295,250 280,300 Q 265,340 290,400"
          stroke="#4682b4"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          opacity="0.85"
        />
        <text
          x="245"
          y="180"
          className="font-serif text-[9px] fill-[#2c5270] italic font-semibold select-none"
          transform="rotate(65 245 180)"
        >
          Sông Nậm Rốm
        </text>

        {/* Trận địa pháo binh Đại đoàn 351 trên sườn núi */}
        <g id="tran-dia-phao-351" opacity="0.9">
          <circle cx="410" cy="115" r="9" fill="#991b1b" stroke="#ffffff" strokeWidth="1.5" />
          <text x="410" y="102" textAnchor="middle" className="font-mono text-[9px] font-bold fill-red-950">
            Pháo binh 351
          </text>
        </g>

        {/* Hệ thống chiến hào siết chặt vòng vây (Đợt 2 & Đợt 3) */}
        {(activePhase === "dot-2" || activePhase === "dot-3") && (
          <g id="chien-hao-vay-lan" stroke="#b45309" strokeWidth="1.8" strokeDasharray="3 2" fill="none" opacity="0.8">
            <ellipse cx="290" cy="245" rx="75" ry="55" />
            <path d="M 230,225 L 340,225" stroke="#dc2626" strokeWidth="2" strokeDasharray="4 2" />
          </g>
        )}

        {/* Cứ điểm địch */}
        <g id="strongholds-group">
          {campaign.strongholds.map((sh) => {
            const isCaptured = currentCaptured.has(sh.id);
            const isCenterHq = sh.id === "de-castries";
            const isA1 = sh.id === "doi-a1";

            return (
              <g
                key={sh.id}
                id={`stronghold-${sh.id}`}
                transform={`translate(${sh.cx}, ${sh.cy})`}
                className="transition-all duration-300"
              >
                {/* A1 blast wave explosion effect during phase 3 */}
                {isA1 && activePhase === "dot-3" && (
                  <circle
                    r="24"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Stronghold marker pin */}
                <rect
                  x={isCenterHq ? -12 : -8}
                  y={isCenterHq ? -12 : -8}
                  width={isCenterHq ? 24 : 16}
                  height={isCenterHq ? 24 : 16}
                  rx={3}
                  fill={isCaptured ? "#dc2626" : "#4b5563"}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="shadow-md"
                />

                {/* Star on captured / Cross on defended */}
                {isCaptured ? (
                  <polygon
                    points="0,-4 1.2,-1 4.5,-1 1.8,1 2.8,4.2 0,2.2 -2.8,4.2 -1.8,1 -4.5,-1 -1.2,-1"
                    fill="#fef08a"
                  />
                ) : (
                  <circle r={isCenterHq ? 3.5 : 2.5} fill="#ffffff" />
                )}

                {/* Stronghold Label */}
                <text
                  y={isCenterHq ? 22 : 16}
                  textAnchor="middle"
                  className={`font-serif text-[10px] select-none font-bold ${
                    isCaptured ? "fill-red-950 font-bold" : "fill-stone-800"
                  } drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]`}
                >
                  {sh.name}
                </text>
                <text
                  y={isCenterHq ? 30 : 23}
                  textAnchor="middle"
                  className="font-mono text-[8px] fill-stone-500 italic"
                >
                  ({sh.frenchName})
                </text>
              </g>
            );
          })}
        </g>

        {/* Các mũi tên tiến công của đợt hiện tại */}
        <g id="attack-vectors-group">
          {currentPhaseData.vectors.map((vec) => (
            <g key={vec.id} id={vec.id}>
              <path
                d={vec.pathD}
                fill="none"
                stroke={vec.strokeColor}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray="6 3"
                className="animate-pulse"
              />
              <text
                className="font-mono text-[8.5px] font-bold fill-red-900 drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
              >
                <textPath href={`#${vec.id}`} startOffset="45%" textAnchor="middle">
                  ▶ {vec.unitName}
                </textPath>
              </text>
            </g>
          ))}
        </g>
      </g>
    );
  }
);
