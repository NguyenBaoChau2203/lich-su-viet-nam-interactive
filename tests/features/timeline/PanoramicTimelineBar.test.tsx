import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PanoramicTimelineBar } from "@/features/timeline/PanoramicTimelineBar";

describe("PanoramicTimelineBar Component", () => {
  it("renders 1945–1954 and 1954–1975 eras with accessible landmarks", () => {
    render(
      <PanoramicTimelineBar
        selectedYear={1954}
        onSelectYear={vi.fn()}
      />
    );

    expect(screen.getByRole("region", { name: /dòng thời gian lịch sử/i })).toBeInTheDocument();
    expect(screen.getByText("1945–1954")).toBeInTheDocument();
    expect(screen.getByText("1954–1975")).toBeInTheDocument();
  });

  it("calls onSelectYear when clicking a year milestone button", () => {
    const handleSelectYear = vi.fn();
    render(
      <PanoramicTimelineBar
        selectedYear={1945}
        onSelectYear={handleSelectYear}
      />
    );

    const year1954Btn = screen.getByRole("button", { name: /năm 1954/i });
    fireEvent.click(year1954Btn);
    expect(handleSelectYear).toHaveBeenCalledWith(1954);
  });

  it("supports keyboard navigation with ArrowLeft and ArrowRight", () => {
    const handleSelectYear = vi.fn();
    render(
      <PanoramicTimelineBar
        selectedYear={1950}
        onSelectYear={handleSelectYear}
      />
    );

    const timelineContainer = screen.getByRole("region", { name: /dòng thời gian lịch sử/i });
    fireEvent.keyDown(timelineContainer, { key: "ArrowRight" });
    expect(handleSelectYear).toHaveBeenCalledWith(1954);

    fireEvent.keyDown(timelineContainer, { key: "ArrowLeft" });
    expect(handleSelectYear).toHaveBeenCalledWith(1946);
  });
});
