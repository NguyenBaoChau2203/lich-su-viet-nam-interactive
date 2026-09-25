import React from "react";
import type { HistoricalPlace } from "@/features/history/types";
import { geoToSvg } from "./geoUtils";

interface MapMarkerLayerProps {
  places: readonly HistoricalPlace[];
  selectedPlaceId: string | null;
  onSelectPlace: (place: HistoricalPlace) => void;
  activeTopicColor?: string;
}

export function MapMarkerLayer({
  places,
  selectedPlaceId,
  onSelectPlace,
  activeTopicColor = "#dc2626",
}: MapMarkerLayerProps) {
  const handleKeyDown = (e: React.KeyboardEvent, place: HistoricalPlace) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelectPlace(place);
    }
  };

  return (
    <g className="map-marker-layer" role="group" aria-label="Các địa danh lịch sử trên bản đồ">
      {places.map((place) => {
        if (typeof place.lat !== "number" || typeof place.lng !== "number") return null;
        const pt = geoToSvg(place.lat, place.lng);
        const isSelected = selectedPlaceId === place.id;

        return (
          <g
            key={place.id}
            role="button"
            tabIndex={0}
            aria-label={`Địa điểm ${place.name}`}
            aria-pressed={isSelected}
            onClick={() => onSelectPlace(place)}
            onKeyDown={(e) => handleKeyDown(e, place)}
            className="cursor-pointer focus:outline-none group select-none transition-transform duration-200"
            transform={`translate(${pt.x}, ${pt.y})`}
          >
            {/* Outer pulsating glow when selected */}
            {isSelected && (
              <>
                <circle
                  r={22}
                  fill="none"
                  stroke={activeTopicColor}
                  strokeWidth={2}
                  className="animate-ping opacity-75"
                />
                <circle
                  r={16}
                  fill={activeTopicColor}
                  fillOpacity={0.2}
                />
              </>
            )}

            {/* Base marker pin */}
            <circle
              r={isSelected ? 9 : 6}
              fill={isSelected ? activeTopicColor : "#b91c1c"}
              stroke="#ffffff"
              strokeWidth={isSelected ? 2.5 : 1.5}
              className="transition-all duration-200 group-hover:scale-125 shadow-md"
            />

            {/* Inner dot */}
            <circle
              r={isSelected ? 3.5 : 2}
              fill="#ffffff"
            />

            {/* Label caption */}
            <text
              y={isSelected ? -14 : -10}
              textAnchor="middle"
              className={`font-serif text-[11px] select-none pointer-events-none transition-all duration-200 ${
                isSelected
                  ? "fill-ink font-bold text-[13px] drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]"
                  : "fill-ink-soft group-hover:fill-ink font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
              }`}
            >
              {place.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}
