"use client";

import Link from "next/link";
import { BookOpen, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import { openSearch, SearchOverlay } from "@/components/layout/SearchOverlay";
import { DEFAULT_JOURNEY_ID } from "@/lib/explorer/journeys/registry";

type Props = {
  journeyActive: boolean;
  journeyButtonRef: RefObject<HTMLButtonElement | null>;
  onExplore(): void;
  onJourney(): void;
};

export function HomeAtlasHeader({ journeyActive, journeyButtonRef, onExplore, onJourney }: Props) {
  const secondary = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const dismiss = (event: PointerEvent) => {
      if (secondary.current && event.target instanceof Node && !secondary.current.contains(event.target)) secondary.current.open = false;
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  return <>
    <header className="home-atlas-header" data-testid="home-atlas-header">
      <Link href="/" className="home-atlas-brand">Lịch sử Việt Nam</Link>
      <nav className="home-atlas-modes" aria-label="Cách khám phá">
        <button type="button" aria-pressed={!journeyActive} onClick={onExplore}>Khám phá</button>
        <button type="button" ref={journeyButtonRef} aria-pressed={journeyActive} onClick={onJourney}>Hành trình</button>
        <noscript>
          <span className="home-atlas-modes-noscript">
            <Link href="/?kham-pha=1" className={!journeyActive ? "is-active" : ""}>Khám phá</Link>
            <Link href={`/?hanh-trinh=${DEFAULT_JOURNEY_ID}&moc=sai-gon-1911`} className={journeyActive ? "is-active" : ""}>Hành trình</Link>
          </span>
        </noscript>
      </nav>
      <div className="home-atlas-links">
        <Link href="/tra-cuu" aria-keyshortcuts="/ Control+K" onClick={(event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          if (secondary.current) secondary.current.open = false;
          openSearch();
        }}><Search size={16} aria-hidden="true" /><span>Tìm kiếm</span></Link>
        <details ref={secondary} className="home-atlas-secondary" onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
        }} onKeyDown={(event) => {
          if (event.key === "Escape" && secondary.current?.open) {
            event.preventDefault(); event.stopPropagation(); secondary.current.open = false;
            secondary.current.querySelector("summary")?.focus();
          }
        }}>
          <summary><BookOpen size={16} aria-hidden="true" />Học &amp; ôn tập<ChevronDown size={14} aria-hidden="true" /></summary>
          <nav aria-label="Học tập và các trang khác">
            <Link href="/muc-luc">Học theo bài</Link>
            <Link href="/trac-nghiem">Ôn tập theo bài</Link>
            <Link href="/luyen-thi">Luyện thi THPT</Link>
            <Link href="/kham-pha">Khám phá thêm</Link>
            <Link href="/ho-chieu">Tiến độ học tập</Link>
            <Link href="/tai-khoan">Tài khoản</Link>
            <Link href="/huong-dan">Hướng dẫn sử dụng</Link>
          </nav>
        </details>
      </div>
    </header>
    <SearchOverlay />
  </>;
}
