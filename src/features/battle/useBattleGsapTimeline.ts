"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import type { TacticalCampaignData } from "./battleData";

export interface BattleTimelineControl {
  timeline: gsap.core.Timeline | null;
  progress: number;
  isPlaying: boolean;
  activePhase: "dot-1" | "dot-2" | "dot-3";
  currentDateDisplay: string;
  currentNarrative: string;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (progress: number) => void;
  jumpToPhase: (phaseId: "dot-1" | "dot-2" | "dot-3") => void;
}

export function useBattleGsapTimeline(
  campaign: TacticalCampaignData,
  containerRef?: React.RefObject<SVGGElement | null>
): BattleTimelineControl {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activePhase, setActivePhase] = useState<"dot-1" | "dot-2" | "dot-3">("dot-1");

  // Determine active phase and date display based on timeline progress
  const getPhaseFromProgress = useCallback((prog: number): "dot-1" | "dot-2" | "dot-3" => {
    if (prog < 0.35) return "dot-1";
    if (prog < 0.72) return "dot-2";
    return "dot-3";
  }, []);

  const getDateDisplayFromProgress = useCallback((prog: number): string => {
    if (prog < 0.1) return "13/03/1954 (Nổ súng mở màn)";
    if (prog < 0.25) return "15/03/1954 (Tiêu diệt Đồi Độc Lập)";
    if (prog < 0.35) return "17/03/1954 (Bức hàng Bản Kéo)";
    if (prog < 0.45) return "30/03/1954 (Công kích cụm đồi phía Đông)";
    if (prog < 0.6) return "15/04/1954 (Siết chặt vòng vây sân bay)";
    if (prog < 0.72) return "26/04/1954 (Kết thúc Đợt 2)";
    if (prog < 0.85) return "01/05/1954 (Bắt đầu tổng công kích)";
    if (prog < 0.95) return "06/05/1954 (Bộc phá 1 tấn đồi A1)";
    return "07/05/1954 (Toàn thắng tại Mường Thanh)";
  }, []);

  // Initialize GSAP Master Timeline
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const baseDuration = prefersReducedMotion ? 0.01 : 12;

    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => {
        const currentProg = tl.progress();
        setProgress(currentProg);
        setActivePhase(getPhaseFromProgress(currentProg));
      },
      onComplete: () => {
        setIsPlaying(false);
      },
    });

    // Segment 1: Phase 1 (0 to 0.33)
    tl.addLabel("dot-1", 0);
    tl.to(
      {},
      {
        duration: baseDuration * 0.33,
        ease: "none",
      }
    );

    // Segment 2: Phase 2 (0.33 to 0.70)
    tl.addLabel("dot-2", baseDuration * 0.33);
    tl.to(
      {},
      {
        duration: baseDuration * 0.37,
        ease: "none",
      }
    );

    // Segment 3: Phase 3 (0.70 to 1.0)
    tl.addLabel("dot-3", baseDuration * 0.70);
    tl.to(
      {},
      {
        duration: baseDuration * 0.30,
        ease: "none",
      }
    );

    timelineRef.current = tl;

    return () => {
      tl.kill();
    };
  }, [getPhaseFromProgress]);

  const play = useCallback(() => {
    if (!timelineRef.current) return;
    if (timelineRef.current.progress() >= 0.999) {
      timelineRef.current.progress(0);
    }
    timelineRef.current.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    if (!timelineRef.current) return;
    timelineRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback(
    (newProgress: number) => {
      if (!timelineRef.current) return;
      const clamped = Math.max(0, Math.min(1, newProgress));
      timelineRef.current.progress(clamped);
      setProgress(clamped);
      setActivePhase(getPhaseFromProgress(clamped));
    },
    [getPhaseFromProgress]
  );

  const jumpToPhase = useCallback(
    (phaseId: "dot-1" | "dot-2" | "dot-3") => {
      if (!timelineRef.current) return;
      const targetProg = phaseId === "dot-1" ? 0 : phaseId === "dot-2" ? 0.35 : 0.75;
      seek(targetProg);
    },
    [seek]
  );

  const currentPhaseData = campaign.phases.find((p) => p.phaseId === activePhase) || campaign.phases[0];

  return {
    timeline: timelineRef.current,
    progress,
    isPlaying,
    activePhase,
    currentDateDisplay: getDateDisplayFromProgress(progress),
    currentNarrative: currentPhaseData.logSummary,
    play,
    pause,
    togglePlay,
    seek,
    jumpToPhase,
  };
}
