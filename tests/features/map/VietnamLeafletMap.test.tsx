import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { VietnamLeafletMap } from "@/features/map/VietnamLeafletMap";
import type { HistoricalPlace } from "@/features/history/types";

const mockPlaces: HistoricalPlace[] = [
  {
    id: "place-ha-noi",
    name: "Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    precision: "approximate",
  },
  {
    id: "place-dien-bien",
    name: "Điện Biên Phủ",
    lat: 21.3869,
    lng: 103.0232,
    precision: "approximate",
  },
];

describe("VietnamLeafletMap Component", () => {
  it("renders the interactive map container with accessible region label", () => {
    render(
      <VietnamLeafletMap
        places={mockPlaces}
        selectedPlaceId="place-dien-bien"
        onSelectPlace={vi.fn()}
        mapMode="overview"
      />
    );

    const mapRegion = screen.getByRole("region", { name: /bản đồ số tương tác việt nam/i });
    expect(mapRegion).toBeInTheDocument();
  });

  it("displays sovereign archipelagoes (Hoàng Sa and Trường Sa) badges", () => {
    render(
      <VietnamLeafletMap
        places={mockPlaces}
        selectedPlaceId={null}
        onSelectPlace={vi.fn()}
        mapMode="overview"
      />
    );

    expect(screen.getAllByText(/quần đảo hoàng sa/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/quần đảo trường sa/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders tiles layer attribution", () => {
    render(
      <VietnamLeafletMap
        places={mockPlaces}
        selectedPlaceId={null}
        onSelectPlace={vi.fn()}
        mapMode="overview"
      />
    );

    expect(screen.getByText(/openstreetmap/i)).toBeInTheDocument();
  });
});
