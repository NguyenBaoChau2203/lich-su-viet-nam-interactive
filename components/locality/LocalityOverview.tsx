"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowRight, RefreshCw, X } from "lucide-react";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { LocalityOverviewData } from "@/lib/locality/overview";
import { LocalityPreviewCard } from "./LocalityPreviewCard";

const modified = (event: MouseEvent) =>
  event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

type Props = {
  localityCode: LocalityCode;
  overview: LocalityOverviewData;
  homeHref: string;
  placesHref: string;
  peopleHref: string;
  onChangeLocality(): void;
  onClose(): void;
  onRetryPlaces(): void;
  onRetryPeople(): void;
  onViewAllPlaces?(): void;
  onViewAllPeople?(): void;
};

export function LocalityOverview({
  localityCode,
  overview,
  homeHref,
  placesHref,
  peopleHref,
  onChangeLocality,
  onClose,
  onRetryPlaces,
  onRetryPeople,
  onViewAllPlaces,
  onViewAllPeople,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const locality = LOCALITIES.find((l) => l.code === localityCode);
  const officialName = locality?.officialName ?? "Địa phương";

  // Focus heading once when locality changes
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [localityCode]);

  // Escape key: closes dossier back to chooser
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) {
        if (document.querySelector("dialog[open]")) return;
        event.preventDefault();
        onChangeLocality();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onChangeLocality]);

  return (
    <aside
      className="locality-overview-dossier"
      aria-labelledby="locality-dossier-heading"
      data-testid="locality-overview-dossier"
    >
      {/* Top Header */}
      <div className="locality-dossier-header">
        <div className="locality-dossier-caption">
          <span className="locality-dossier-eyebrow">Theo địa phương</span>
          <h2 id="locality-dossier-heading" ref={headingRef} tabIndex={-1}>
            {officialName}
          </h2>
        </div>
        <div className="locality-dossier-actions">
          <button
            type="button"
            onClick={onChangeLocality}
            className="locality-dossier-change-btn"
            aria-label="Chọn địa phương khác"
          >
            Đổi địa phương
          </button>
          <button
            type="button"
            onClick={onClose}
            className="locality-dossier-close-btn"
            aria-label="Đóng hồ sơ địa phương"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="locality-dossier-hint">
        Khám phá địa danh và nhân vật qua các hồ sơ có nguồn dẫn. Một số hồ sơ hiện có:
      </p>

      {/* Inner scrollable reading region */}
      <div className="locality-dossier-body">
        {/* Section 1: Heritage Places */}
        <section
          className="locality-dossier-section"
          aria-labelledby="locality-places-heading"
          data-testid="locality-places-section"
        >
          <div className="locality-section-header">
            <h3 id="locality-places-heading">Địa danh lịch sử</h3>
            {overview.places.status === "ready" && (
              <span className="locality-section-count">
                {overview.places.total} địa danh
              </span>
            )}
          </div>

          {overview.places.status === "loading" && (
            <div className="locality-section-loading" role="status">
              <span>Đang tải thông tin địa danh...</span>
            </div>
          )}

          {overview.places.status === "error" && (
            <div className="locality-section-error" role="alert">
              <p>{overview.places.error}</p>
              <button
                type="button"
                onClick={onRetryPlaces}
                className="locality-section-retry-btn"
              >
                <RefreshCw size={13} aria-hidden="true" /> Thử lại
              </button>
            </div>
          )}

          {overview.places.status === "ready" && (
            <>
              {overview.places.items.length === 0 ? (
                <p className="locality-section-empty">
                  Chưa có địa danh nào được ghi nhận cho địa phương này.
                </p>
              ) : (
                <div className="locality-card-grid">
                  {overview.places.items.map((site, index) => (
                    <LocalityPreviewCard
                      key={site.id}
                      kind="place"
                      item={site}
                      homeHref={homeHref}
                      staggerIndex={index}
                    />
                  ))}
                </div>
              )}

              <div className="locality-section-footer">
                <a
                  href={placesHref}
                  className="locality-catalog-link"
                  data-testid="locality-view-all-places"
                  onClick={(event) => {
                    if (!modified(event)) {
                      event.preventDefault();
                      onViewAllPlaces?.();
                    }
                  }}
                >
                  Xem tất cả địa danh ({overview.places.total}){" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </>
          )}
        </section>

        {/* Section 2: Historical People */}
        <section
          className="locality-dossier-section"
          aria-labelledby="locality-people-heading"
          data-testid="locality-people-section"
        >
          <div className="locality-section-header">
            <h3 id="locality-people-heading">Nhân vật gắn với địa phương</h3>
            {overview.people.status === "ready" && (
              <span className="locality-section-count">
                {overview.people.total} nhân vật
              </span>
            )}
          </div>

          {overview.people.status === "loading" && (
            <div className="locality-section-loading" role="status">
              <span>Đang tải thông tin nhân vật...</span>
            </div>
          )}

          {overview.people.status === "error" && (
            <div className="locality-section-error" role="alert">
              <p>{overview.people.error}</p>
              <button
                type="button"
                onClick={onRetryPeople}
                className="locality-section-retry-btn"
              >
                <RefreshCw size={13} aria-hidden="true" /> Thử lại
              </button>
            </div>
          )}

          {overview.people.status === "ready" && (
            <>
              {overview.people.items.length === 0 ? (
                <p className="locality-section-empty">
                  Chưa có nhân vật nào được ghi nhận cho địa phương này.
                </p>
              ) : (
                <div className="locality-card-grid">
                  {overview.people.items.map((person, index) => (
                    <LocalityPreviewCard
                      key={person.id}
                      kind="person"
                      item={person}
                      localityCode={localityCode}
                      homeHref={homeHref}
                      staggerIndex={index + 2}
                    />
                  ))}
                </div>
              )}

              <div className="locality-section-footer">
                <a
                  href={peopleHref}
                  className="locality-catalog-link"
                  data-testid="locality-view-all-people"
                  onClick={(event) => {
                    if (!modified(event)) {
                      event.preventDefault();
                      onViewAllPeople?.();
                    }
                  }}
                >
                  Xem tất cả nhân vật ({overview.people.total}){" "}
                  <ArrowRight size={14} aria-hidden="true" />
                </a>
              </div>
            </>
          )}
        </section>
      </div>
    </aside>
  );
}
