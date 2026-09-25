import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BattlePlaybackBar } from "@/features/battle/BattlePlaybackBar";
import type { BattleTimelineControl } from "@/features/battle/useBattleGsapTimeline";

describe("BattlePlaybackBar Component", () => {
  const createMockControl = (overrides = {}): BattleTimelineControl => ({
    progress: 0.35,
    isPlaying: false,
    activePhase: "dot-1",
    currentDateDisplay: "15/03/1954",
    currentNarrative: "Đại đoàn 312 và 308 tiêu diệt các cứ điểm Him Lam và Độc Lập.",
    play: vi.fn(),
    pause: vi.fn(),
    togglePlay: vi.fn(),
    seek: vi.fn(),
    jumpToPhase: vi.fn(),
    ...overrides,
  });

  it("renders playback controls, time slider and phase jump buttons", () => {
    const mockControl = createMockControl();
    render(<BattlePlaybackBar control={mockControl} onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: /phát diễn biến/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /thời gian diễn biến/i })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /đợt 1/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /đợt 2/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /đợt 3/i })).toBeInTheDocument();
  });

  it("toggles play/pause when clicking play button", () => {
    const togglePlayMock = vi.fn();
    const mockControl = createMockControl({ isPlaying: false, togglePlay: togglePlayMock });
    render(<BattlePlaybackBar control={mockControl} onClose={vi.fn()} />);

    const playBtn = screen.getByRole("button", { name: /phát diễn biến/i });
    fireEvent.click(playBtn);
    expect(togglePlayMock).toHaveBeenCalledTimes(1);
  });

  it("calls jumpToPhase when clicking attack phase buttons", () => {
    const jumpMock = vi.fn();
    const mockControl = createMockControl({ jumpToPhase: jumpMock });
    render(<BattlePlaybackBar control={mockControl} onClose={vi.fn()} />);

    const dot2Btn = screen.getByRole("button", { name: /đợt 2/i });
    fireEvent.click(dot2Btn);
    expect(jumpMock).toHaveBeenCalledWith("dot-2");

    const dot3Btn = screen.getByRole("button", { name: /đợt 3/i });
    fireEvent.click(dot3Btn);
    expect(jumpMock).toHaveBeenCalledWith("dot-3");
  });

  it("calls onClose when clicking return button", () => {
    const handleClose = vi.fn();
    const mockControl = createMockControl();
    render(<BattlePlaybackBar control={mockControl} onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: /quay lại bản đồ toàn cảnh/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
