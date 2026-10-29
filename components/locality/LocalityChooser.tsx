"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { Search, X } from "lucide-react";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityCode } from "@/lib/local-heroes/types";
import { foldLocalHeroQuery } from "@/lib/local-heroes/normalize";
import { LocalitySelect } from "@/components/local-heroes/LocalitySelect";
import { LocalityTabs } from "@/components/heritage/LocalityTabs";

type Props = {
  selectedCode: LocalityCode | null;
  mode: "locality" | "places" | "people";
  placesHref: string; peopleHref: string; overviewHref: string;
  hidden?: boolean;
  onSelect(code: LocalityCode | null): void;
  onSwitchMode(mode: "places" | "people" | "locality"): void;
  onHide(): void;
  children?: ReactNode;
};

export function LocalityChooser({ selectedCode, mode, placesHref, peopleHref, overviewHref, hidden = false, onSelect, onSwitchMode, onHide, children }: Props) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const locality = LOCALITIES.find((l) => l.code === selectedCode);
  const wasHidden = useRef(hidden);
  useEffect(() => {
    if (hidden) {
      wasHidden.current = true;
      return;
    }
    // Focus the heading on first mount and once after a hide→reopen cycle.
    if (!wasHidden.current) headingRef.current?.focus({ preventScroll: true });
    else {
      wasHidden.current = false;
      headingRef.current?.focus({ preventScroll: true });
    }
  }, [hidden]);
  useEffect(() => {
    // Only selection changes list scroll, never a projection/image update.
    listRef.current?.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selectedCode]);
  const filteredLocalities = useMemo(() => {
    const folded = foldLocalHeroQuery(query);
    return folded ? LOCALITIES.filter((l) => foldLocalHeroQuery(l.officialName).includes(folded)) : LOCALITIES;
  }, [query]);
  return (
    <aside id="locality-chooser" className="locality-chooser" hidden={hidden} aria-labelledby="locality-chooser-heading" data-testid="locality-chooser">
      <div className="locality-chooser-top">
        <div className="locality-chooser-caption"><span className="locality-chooser-eyebrow">Khám phá lịch sử</span>
          <h2 id="locality-chooser-heading" ref={headingRef} tabIndex={-1}>Theo địa phương</h2>
        </div>
        <button type="button" className="locality-chooser-close" aria-label="Ẩn bảng địa phương" onClick={onHide}>
          <X size={18} aria-hidden="true" />
        </button>
      </div>
      <nav className="locality-overview-tab" aria-label="Tổng quan địa phương">
        <a href={overviewHref} aria-current={mode === "locality" ? "page" : undefined} onClick={(e) => {
          if (e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
          e.preventDefault(); onSwitchMode("locality");
        }} data-testid={mode === "places" ? "heritage-return-overview" : "local-heroes-return-overview"}>Tổng quan · cả hai nhóm</a>
      </nav>
      <LocalityTabs active={mode === "locality" ? null : mode} placesHref={placesHref} peopleHref={peopleHref} onSwitch={onSwitchMode} />
      <div className="locality-chooser-body">
        <form method="get" action="/" className="locality-chooser-form" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" name="noi-dung" value="dia-phuong" />
          <LocalitySelect code={selectedCode} onChange={onSelect} />
          <noscript><button type="submit">Xem địa phương</button></noscript>
        </form>
        {locality && <p className="locality-current" role="status">Đang chọn: {locality.officialName}</p>}
        <details className="locality-choices" open={mode === "locality"}>
          <summary>Chọn trong 34 tỉnh, thành phố</summary>
          <div className="locality-chooser-search">
            <label htmlFor={inputId} className="sr-only">Tìm kiếm địa phương</label>
            <div className="locality-chooser-search-input-wrap">
              <Search size={14} className="locality-chooser-search-icon" aria-hidden="true" />
              <input id={inputId} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm địa phương..." className="locality-chooser-search-input" />
              {query && <button type="button" className="locality-chooser-search-clear" onClick={() => setQuery("")} aria-label="Xóa tìm kiếm">×</button>}
            </div>
          </div>
          <div className="locality-chooser-list-wrap" ref={listRef}>
            <ul className="locality-chooser-list">{filteredLocalities.map((loc) => <li key={loc.code}>
              <button type="button" data-locality-code={loc.code} aria-pressed={selectedCode === loc.code}
                className={`locality-chooser-item${selectedCode === loc.code ? " is-selected" : ""}`} onClick={() => onSelect(loc.code)}>{loc.officialName}</button>
            </li>)}{!filteredLocalities.length && <li className="locality-chooser-empty">Không tìm thấy địa phương phù hợp.</li>}</ul>
          </div>
        </details>
        {children}
      </div>
    </aside>
  );
}
