import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventDetailPopup } from "@/features/map/EventDetailPopup";
import type { HistoricalEvent, HistoricalPlace } from "@/features/history/types";

describe("EventDetailPopup Component", () => {
  const mockEvent: HistoricalEvent = {
    id: "event-chien-dich-dien-bien-phu",
    slug: "chien-dich-dien-bien-phu",
    title: "Chiến dịch Điện Biên Phủ",
    date: {
      sortKey: "1954-05-07",
      display: "13/03/1954 – 07/05/1954",
      precision: "range",
    },
    eraId: "1945-1954",
    topicIds: ["khang-chien-chong-phap"],
    placeIds: ["place-dien-bien"],
    summary: "Đòn quyết chiến chiến lược đập tan tập đoàn cứ điểm Pháp tại Mường Thanh.",
    learningPurpose: "Nắm vững 3 đợt tiến công và ý nghĩa quốc tế của chiến thắng.",
    editorialStatus: "needs_evidence",
    relatedStoryIds: [],
    claimIds: [],
    mediaIds: [],
  };

  const mockPlace: HistoricalPlace = {
    id: "place-dien-bien",
    name: "Điện Biên Phủ",
    lat: 21.3869,
    lng: 103.0232,
    precision: "approximate",
  };

  it("renders event title, dates, summary and place name", () => {
    render(
      <EventDetailPopup
        event={mockEvent}
        place={mockPlace}
        onClose={vi.fn()}
        onTriggerBattle={vi.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Chiến dịch Điện Biên Phủ" })).toBeInTheDocument();
    expect(screen.getByText(/13\/03\/1954/)).toBeInTheDocument();
    expect(screen.getAllByText(/Điện Biên Phủ/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Đòn quyết chiến chiến lược/)).toBeInTheDocument();
  });

  it("shows battle CTA button for Dien Bien Phu and triggers onTriggerBattle on click", () => {
    const handleTriggerBattle = vi.fn();
    render(
      <EventDetailPopup
        event={mockEvent}
        place={mockPlace}
        onClose={vi.fn()}
        onTriggerBattle={handleTriggerBattle}
      />
    );

    const battleBtn = screen.getByRole("button", { name: /tái hiện diễn biến tiến công/i });
    expect(battleBtn).toBeInTheDocument();
    fireEvent.click(battleBtn);
    expect(handleTriggerBattle).toHaveBeenCalledWith(mockEvent.id);
  });

  it("calls onClose when clicking close button or pressing Escape", () => {
    const handleClose = vi.fn();
    render(
      <EventDetailPopup
        event={mockEvent}
        place={mockPlace}
        onClose={handleClose}
        onTriggerBattle={vi.fn()}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /đóng thẻ thông tin/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
