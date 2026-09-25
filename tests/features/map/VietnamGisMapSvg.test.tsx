import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { VietnamGisMapSvg } from "@/features/map/VietnamGisMapSvg";
import type { HistoricalPlace } from "@/features/history/types";

const mockPlaces: HistoricalPlace[] = [
  {
    id: "place-ha-noi",
    name: "Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    precision: "approximate",
    historicalNote: "Thủ đô Hà Nội",
  },
  {
    id: "place-dien-bien",
    name: "Điện Biên Phủ",
    lat: 21.3869,
    lng: 103.0232,
    precision: "approximate",
    historicalNote: "Thung lũng Mường Thanh",
  },
];

describe("VietnamGisMapSvg Component", () => {
  it("renders SVG with accessible region role and sovereign archipelagoes", () => {
    render(
      <VietnamGisMapSvg
        viewBox="0 0 1000 1200"
        places={mockPlaces}
        selectedPlaceId={null}
        onSelectPlace={vi.fn()}
      />
    );

    const mapRegion = screen.getByRole("region", { name: /bản đồ tương tác việt nam/i });
    expect(mapRegion).toBeInTheDocument();

    expect(screen.getByText(/quần đảo hoàng sa/i)).toBeInTheDocument();
    expect(screen.getByText(/quần đảo trường sa/i)).toBeInTheDocument();
  });

  it("renders markers for provided historical places with coordinates", () => {
    render(
      <VietnamGisMapSvg
        viewBox="0 0 1000 1200"
        places={mockPlaces}
        selectedPlaceId={null}
        onSelectPlace={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: /địa điểm hà nội/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /địa điểm điện biên phủ/i })).toBeInTheDocument();
  });

  it("fires onSelectPlace when clicking a marker or pressing Enter/Space", () => {
    const handleSelect = vi.fn();
    render(
      <VietnamGisMapSvg
        viewBox="0 0 1000 1200"
        places={mockPlaces}
        selectedPlaceId={null}
        onSelectPlace={handleSelect}
      />
    );

    const dienBienBtn = screen.getByRole("button", { name: /địa điểm điện biên phủ/i });
    fireEvent.click(dienBienBtn);
    expect(handleSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "place-dien-bien" }));

    fireEvent.keyDown(dienBienBtn, { key: "Enter" });
    expect(handleSelect).toHaveBeenCalledTimes(2);
  });
});
