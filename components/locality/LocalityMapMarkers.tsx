"use client";

import { useMemo } from "react";
import type { GlobeViewport } from "@/lib/explorer/globe-contract";
import type { LocalityCode } from "@/lib/local-heroes/types";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { LOCALITY_CENTERS } from "@/lib/heritage/locality-views";

type Props = {
  viewport: GlobeViewport;
  selectedCode: LocalityCode | null;
  onSelect(code: LocalityCode): void;
};

type ProjectedMarker = {
  code: LocalityCode;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
};

export function LocalityMapMarkers({ viewport, selectedCode, onSelect }: Props) {
  const visibleMarkers = useMemo(() => {
    const candidates: ProjectedMarker[] = [];

    // Project each canonical locality center
    for (const loc of LOCALITIES) {
      const center = LOCALITY_CENTERS[loc.code];
      if (!center) continue;

      const point = viewport.project(center.lng, center.lat);
      if (!point) continue; // Occluded behind globe or out of bounds

      // Keep within visible viewport with padding
      if (
        point.x < 10 ||
        point.x > viewport.width - 10 ||
        point.y < 50 ||
        point.y > viewport.height - 30
      ) {
        continue;
      }

      const approxWidth = loc.officialName.length * 7 + 24;
      const height = 24;
      candidates.push({
        code: loc.code,
        label: loc.officialName,
        x: point.x,
        y: point.y,
        width: approxWidth,
        height,
        isSelected: selectedCode === loc.code,
      });
    }

    // Sort so selected locality is prioritized and placed first
    candidates.sort((a, b) => (b.isSelected ? 1 : 0) - (a.isSelected ? 1 : 0));

    // Collision handling: do not overlap markers
    const placed: ProjectedMarker[] = [];
    for (const marker of candidates) {
      if (marker.isSelected) {
        placed.push(marker);
        continue;
      }
      const markerLeft = marker.x - marker.width / 2;
      const markerRight = marker.x + marker.width / 2;
      const markerTop = marker.y - marker.height / 2;
      const markerBottom = marker.y + marker.height / 2;

      const collides = placed.some((other) => {
        const otherLeft = other.x - other.width / 2;
        const otherRight = other.x + other.width / 2;
        const otherTop = other.y - other.height / 2;
        const otherBottom = other.y + other.height / 2;

        return !(
          markerRight < otherLeft - 8 ||
          markerLeft > otherRight + 8 ||
          markerBottom < otherTop - 4 ||
          markerTop > otherBottom + 4
        );
      });

      if (!collides) {
        placed.push(marker);
      }
    }

    return placed;
  }, [viewport, selectedCode]);

  return (
    <div
      className="locality-globe-markers-overlay"
      data-testid="locality-globe-markers"
      aria-label="Địa danh tham chiếu trên địa cầu"
    >
      {visibleMarkers.map((marker) => (
        <button
          key={marker.code}
          type="button"
          data-locality-marker={marker.code}
          data-testid={`locality-marker-${marker.code}`}
          className={`locality-globe-marker ${marker.isSelected ? "is-selected" : ""}`}
          style={{
            left: `${Math.round(marker.x)}px`,
            top: `${Math.round(marker.y)}px`,
          }}
          onClick={() => onSelect(marker.code)}
          aria-label={`Chọn địa phương ${marker.label}`}
          aria-pressed={marker.isSelected}
        >
          <span className="locality-globe-dot" aria-hidden="true" />
          <span className="locality-globe-label">{marker.label}</span>
        </button>
      ))}
    </div>
  );
}
