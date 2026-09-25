import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("Home Page - Map-First Experience", () => {
  it("renders the product-level H1 and preview disclosure banner", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Khám phá Lịch sử Việt Nam 1945–1975/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getAllByText(/BẢN XEM TRƯỚC · DỮ LIỆU ĐANG THẨM TRA/i).length
    ).toBeGreaterThanOrEqual(1);
  });

  it("renders interactive GIS map canvas with sovereign archipelagoes", () => {
    render(<Home />);

    expect(
      screen.getByRole("region", { name: /bản đồ.*tương tác việt nam/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/quần đảo hoàng sa/i)).toBeInTheDocument();
    expect(screen.getByText(/quần đảo trường sa/i)).toBeInTheDocument();
  });

  it("renders panoramic timeline bar with era navigation", () => {
    render(<Home />);

    expect(
      screen.getByRole("region", { name: /dòng thời gian lịch sử/i })
    ).toBeInTheDocument();

    expect(screen.getByText("1945–1954")).toBeInTheDocument();
    expect(screen.getByText("1954–1975")).toBeInTheDocument();
  });

  it("allows toggling accessible text narrative drawer", () => {
    render(<Home />);

    const toggleBtn = screen.getByRole("button", { name: /xem diễn biến dạng danh sách văn bản/i });
    expect(toggleBtn).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(
      screen.getByRole("region", { name: /bảng tóm tắt nội dung lịch sử dạng văn bản/i })
    ).toBeInTheDocument();
  });

  it("switches to tactical battle mode when clicking battle CTA", () => {
    render(<Home />);

    const battleBtn = screen.getByRole("button", { name: /tái hiện diễn biến tiến công/i });
    expect(battleBtn).toBeInTheDocument();

    fireEvent.click(battleBtn);

    // Verify battle mode activates with battle playback controls
    expect(
      screen.getByRole("region", { name: /bộ điều khiển diễn biến tiến công/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Sa bàn Chiến dịch Điện Biên Phủ/i)).toBeInTheDocument();
  });
});
