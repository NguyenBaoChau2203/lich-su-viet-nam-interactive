"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { LocalHeroList } from "@/components/local-heroes/LocalHeroList";
import { HeritageSiteList } from "@/components/heritage/HeritageSiteList";
import { buildLocalHeroHomeHref, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";
import { normalizeLocalHeroQuery } from "@/lib/local-heroes/normalize";
import type { LocalHeroFilters, LocalHeroLoadState } from "@/lib/local-heroes/types";
import type { HeritageLoadState } from "@/lib/heritage/types";
import { compareHeritageSites } from "@/lib/locality/overview";
import { groupByLocality } from "@/lib/heritage/state";

type Props = { map: MapExplorerState; discovery: LocalHeroUrlState; people: LocalHeroLoadState; places: HeritageLoadState;
  onChange(filters: LocalHeroFilters): void; onSelectPlace(slug: string): void; onRetryPeople(): void; onRetryPlaces(): void };
const modified = (e: MouseEvent) => e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;

/** Complete bounded catalog access inside the sole locality shell. */
export function LocalityResults({ map, discovery, people, places, onChange, onSelectPlace, onRetryPeople, onRetryPlaces }: Props) {
  const filters = discovery.filters;
  const [search, setSearch] = useState({ committed: filters.query, draft: filters.query });
  if (search.committed !== filters.query) setSearch({ committed: filters.query, draft: filters.query });
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [discovery.mode]);
  useEffect(() => {
    if (discovery.mode !== "people") return;
    const query = normalizeLocalHeroQuery(search.draft);
    if (query === filters.query) return;
    const timer = setTimeout(() => onChange({ ...filters, query, page: 1 }), 250);
    return () => clearTimeout(timer);
  }, [search.draft, filters, discovery.mode, onChange]);
  const homeHref = buildLocalHeroHomeHref(map, discovery);
  const pageHref = (page: number) => buildLocalHeroHomeHref(map, { ...discovery, filters: { ...filters, page } });
  const ready = people.status === "ready" ? people.data : null;
  const pages = ready ? [...new Set([1, ready.totalPages, filters.page - 1, filters.page, filters.page + 1])].filter((p) => p >= 1 && p <= ready.totalPages).sort((a, b) => a - b) : [];
  const mapParams = new URL(buildMapExplorerUrl(map), "https://explorer.invalid").searchParams;
  const placeItems = places.status === "ready" ? (filters.localityCode
    ? places.data.items.filter((site) => site.locality.code === filters.localityCode)
    : groupByLocality(places.data.items).flatMap((group) => group.places)).sort(compareHeritageSites) : [];
  return <section className="locality-results" data-testid="locality-results">
    <h3 ref={heading} tabIndex={-1}>{discovery.mode === "people" ? "Nhân vật gắn với địa phương" : "Địa danh lịch sử theo địa phương"}</h3>
    {discovery.mode === "people" ? <>
      <form method="get" action="/" className="locality-results-search" onSubmit={(e) => { e.preventDefault(); onChange({ ...filters, query: normalizeLocalHeroQuery(search.draft), page: 1 }); }}>
        <input type="hidden" name="noi-dung" value="nhan-vat" />
        {Array.from(mapParams).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
        <input type="hidden" name="dia-phuong" value={new URL(homeHref, "https://explorer.invalid").searchParams.get("dia-phuong") ?? ""} />
        <label htmlFor="local-heroes-search">Tên, bí danh hoặc đóng góp</label>
        <div><input id="local-heroes-search" name="q-nhan-vat" type="search" value={search.draft} onChange={(e) => setSearch({ committed: filters.query, draft: e.target.value })} /><button type="submit">Tìm</button></div>
      </form>
      <div className="local-heroes-results" role="region" tabIndex={0} aria-label="Kết quả nhân vật, cuộn để đọc" aria-busy={people.status === "loading"}>
        {people.status === "loading" && <p role="status">Đang tải danh sách nhân vật…</p>}
        {people.status === "error" && <div role="alert"><p>{people.error.message}</p><button type="button" onClick={onRetryPeople}>Thử lại</button></div>}
        {ready && <><p className="local-heroes-count" role="status">{ready.totalPeople} nhân vật</p>
          <p className="local-heroes-coverage">Độ phủ hiện có: {ready.coverage.representedLocalities}/{ready.coverage.totalLocalities} địa phương tham chiếu có hồ sơ đủ điều kiện đọc.</p>
          {ready.items.length ? <LocalHeroList items={ready.items} homeHref={homeHref} localityCode={filters.localityCode} /> : <p>{filters.query ? "Không có nhân vật phù hợp với tìm kiếm này." : "Chưa có hồ sơ đã được thẩm định cho địa phương này. Điều này không có nghĩa địa phương không có nhân vật cách mạng."}</p>}
        </>}
      </div>
      {ready && <nav className="local-heroes-pagination" aria-label="Phân trang nhân vật"><span>Trang {ready.filters.page}{ready.totalPages ? ` / ${ready.totalPages}` : ""}</span>
        {[...(ready.filters.page > 1 ? [{ page: ready.filters.page - 1, label: "Trang nhân vật trước", text: "←" }] : []),
          ...pages.map((p) => ({ page: p, label: `Trang nhân vật ${p}`, text: String(p) })),
          ...(ready.filters.page < ready.totalPages ? [{ page: ready.filters.page + 1, label: "Trang nhân vật tiếp", text: "→" }] : [])].map((item) => <a key={item.label} href={pageHref(item.page)} aria-label={item.label} aria-current={item.text === String(ready.filters.page) ? "page" : undefined} onClick={(e) => { if (!modified(e)) { e.preventDefault(); onChange({ ...filters, page: item.page }); } }}>{item.text}</a>)}
      </nav>}
    </> : <div className="local-heroes-results" role="region" tabIndex={0} aria-label="Kết quả địa danh, cuộn để đọc" aria-busy={places.status === "loading"}>
      {places.status === "loading" && <p role="status">Đang tải danh sách địa danh…</p>}
      {places.status === "error" && <div role="alert"><p>{places.error.message}</p><button type="button" onClick={onRetryPlaces}>Thử lại</button></div>}
      {places.status === "ready" && <><p className="local-heroes-count" role="status">{placeItems.length} địa danh</p>
        <p className="local-heroes-coverage">Độ phủ hiện có: {places.data.coverage.representedLocalities}/{places.data.coverage.totalLocalities} địa phương tham chiếu có địa danh đã được thẩm định.</p>
        {placeItems.length ? <HeritageSiteList items={placeItems} homeHref={homeHref} filtered selectedPlaceSlug={discovery.place} onSelectPlace={onSelectPlace}
          buildSelectHref={(slug) => buildLocalHeroHomeHref(map, { ...discovery, place: slug })} /> : <p>Chưa có địa danh đã được thẩm định cho địa phương này. Điều này không có nghĩa địa phương không có di tích lịch sử.</p>}
      </>}
    </div>}
  </section>;
}
