"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { LocalitySelect } from "@/components/local-heroes/LocalitySelect";
import { LocalityTabs } from "@/components/heritage/LocalityTabs";
import { HeritageSiteList } from "@/components/heritage/HeritageSiteList";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { groupByLocality } from "@/lib/heritage/state";
import { buildLocalHeroHomeHref, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";
import type { LocalityCode } from "@/lib/local-heroes/types";
import type { HeritageLoadState } from "@/lib/heritage/types";

type Props = {
  map: MapExplorerState;
  discovery: LocalHeroUrlState;
  load: HeritageLoadState;
  onLocalityChange(localityCode: LocalityCode | null): void;
  onSelectPlace(slug: string): void;
  onSwitchMode(mode: "places" | "people"): void;
  onClose(): void;
  onRetry(): void;
  onReturnOverview?(): void;
};

const modified = (event: MouseEvent) =>
  event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

export function HeritagePanel({
  map,
  discovery,
  load,
  onLocalityChange,
  onSelectPlace,
  onSwitchMode,
  onClose,
  onRetry,
  onReturnOverview,
}: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const selectedLocalityCode = discovery.filters.localityCode;
  const selectedPlaceSlug = discovery.place ?? null;

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const homeHref = buildLocalHeroHomeHref(map, discovery);
  const exitHref = buildLocalHeroHomeHref(map, { ...discovery, mode: "events" });
  const peopleHref = buildLocalHeroHomeHref(map, { ...discovery, mode: "people" });
  const placesHref = buildLocalHeroHomeHref(map, { ...discovery, mode: "places" });
  const overviewHref = selectedLocalityCode
    ? buildLocalHeroHomeHref(map, { ...discovery, mode: "locality" })
    : null;

  const mapParams = new URL(buildMapExplorerUrl(map), "https://explorer.invalid").searchParams;

  const catalog = load.status === "ready" ? load.data : null;
  const allSites = catalog?.items ?? [];

  const visibleSites = selectedLocalityCode
    ? allSites.filter((site) => site.locality.code === selectedLocalityCode)
    : allSites;

  const grouped = !selectedLocalityCode && catalog ? groupByLocality(allSites) : [];
  const selectedLocality = LOCALITIES.find((l) => l.code === selectedLocalityCode);

  const buildSelectHref = (slug: string) =>
    buildLocalHeroHomeHref(map, { ...discovery, place: slug });

  return (
    <aside
      id="locality-panel"
      className="local-heroes-panel heritage-panel"
      aria-labelledby="heritage-heading"
      data-testid="heritage-panel"
    >
      <div className="local-heroes-top">
        <div>
          <p className="local-heroes-eyebrow">Di sản &amp; địa phương</p>
          <h2 id="heritage-heading" ref={headingRef} tabIndex={-1}>
            Địa danh lịch sử theo địa phương
          </h2>
        </div>
        <a
          className="local-heroes-close"
          href={exitHref}
          aria-label="Đóng danh sách địa danh"
          onClick={(event) => {
            if (!modified(event)) {
              event.preventDefault();
              onClose();
            }
          }}
        >
          Đóng <span aria-hidden="true">×</span>
        </a>
      </div>

      <LocalityTabs
        active="places"
        placesHref={placesHref}
        peopleHref={peopleHref}
        onSwitch={onSwitchMode}
      />

      {overviewHref && (
        <div className="locality-return-overview">
          <a
            href={overviewHref}
            className="locality-return-overview-link"
            data-testid="heritage-return-overview"
            onClick={(event) => {
              if (!modified(event)) {
                event.preventDefault();
                onReturnOverview?.();
              }
            }}
          >
            ← Về tổng quan địa phương
          </a>
        </div>
      )}

      <form
        method="get"
        action="/"
        className="local-heroes-filters"
        onSubmit={(event) => event.preventDefault()}
      >
        <input type="hidden" name="noi-dung" value="dia-danh" />
        {Array.from(mapParams).map(([key, value]) => (
          <input key={key} type="hidden" name={key} value={value} />
        ))}
        <LocalitySelect
          code={selectedLocalityCode}
          onChange={(code) => onLocalityChange(code)}
        />
      </form>

      <div
        className="local-heroes-results"
        role="region"
        aria-busy={load.status === "loading"}
        aria-label="Kết quả địa danh, cuộn để đọc"
        tabIndex={0}
      >
        {load.status === "loading" && (
          <p role="status" className="local-heroes-message">
            Đang tải danh sách địa danh…
          </p>
        )}

        {load.status === "error" && (
          <div className="local-heroes-message" role="alert">
            <p>{load.error.message}</p>
            <a
              href={homeHref}
              onClick={(event) => {
                if (!modified(event)) {
                  event.preventDefault();
                  onRetry();
                }
              }}
            >
              Thử lại
            </a>
          </div>
        )}

        {catalog && (
          <>
            <p className="local-heroes-count" role="status">
              {visibleSites.length} địa danh ·{" "}
              {selectedLocality ? selectedLocality.officialName : "Tất cả địa phương"}
            </p>
            <p className="local-heroes-coverage">
              Độ phủ hiện có: {catalog.coverage.representedLocalities}/
              {catalog.coverage.totalLocalities} địa phương tham chiếu có địa danh đã được thẩm định.
            </p>

            {visibleSites.length === 0 ? (
              <p className="local-heroes-message">
                Chưa có địa danh đã được thẩm định cho địa phương này. Điều này không có nghĩa địa phương không có di tích lịch sử.
              </p>
            ) : selectedLocalityCode ? (
              <HeritageSiteList
                items={visibleSites}
                homeHref={homeHref}
                filtered={true}
                selectedPlaceSlug={selectedPlaceSlug}
                onSelectPlace={onSelectPlace}
                buildSelectHref={buildSelectHref}
              />
            ) : (
              <div className="space-y-6">
                {grouped.map((group) => (
                  <section key={group.locality.code} className="locality-group">
                    <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2 border-b border-border/50 pb-1">
                      {group.locality.officialName} ({group.places.length})
                    </h3>
                    <HeritageSiteList
                      items={group.places}
                      homeHref={homeHref}
                      filtered={false}
                      selectedPlaceSlug={selectedPlaceSlug}
                      onSelectPlace={onSelectPlace}
                      buildSelectHref={buildSelectHref}
                    />
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
