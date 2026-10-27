"use client";
import { useEffect, useState, type MouseEvent } from "react";
import { LocalitySelect } from "@/components/local-heroes/LocalitySelect";
import { LocalHeroList } from "@/components/local-heroes/LocalHeroList";
import { LOCALITIES } from "@/lib/local-heroes/localities";
import { normalizeLocalHeroQuery } from "@/lib/local-heroes/normalize";
import { buildLocalHeroHomeHref, type LocalHeroUrlState } from "@/lib/local-heroes/state";
import { buildMapExplorerUrl, type MapExplorerState } from "@/lib/explorer/map-state";
import type { LocalHeroFilters, LocalHeroLoadState } from "@/lib/local-heroes/types";
type Props = { map: MapExplorerState; discovery: LocalHeroUrlState; load: LocalHeroLoadState; onChange(filters: LocalHeroFilters): void; onClose(): void; onRetry(): void };
const modified = (event: MouseEvent) => event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
export function LocalHeroesPanel({ map, discovery, load, onChange, onClose, onRetry }: Props) {
  const filters = discovery.filters;
  const [search, setSearch] = useState({ committed: filters.query, draft: filters.query });
  if (search.committed !== filters.query) setSearch({ committed: filters.query, draft: filters.query });
  useEffect(() => {
    const query = normalizeLocalHeroQuery(search.draft);
    if (query === filters.query) return;
    const timer = setTimeout(() => onChange({ ...filters, query, page: 1 }), 250);
    return () => clearTimeout(timer);
  }, [search, filters, onChange]);
  const homeHref = buildLocalHeroHomeHref(map, discovery), exitHref = buildLocalHeroHomeHref(map, { ...discovery, mode: "events" });
  const ready = load.status === "ready" ? load.data : null;
  const mapParams = new URL(buildMapExplorerUrl(map), "https://explorer.invalid").searchParams;
  const pageHref = (page: number) => buildLocalHeroHomeHref(map, { ...discovery, filters: { ...filters, page } });
  const pages = ready ? Array.from(new Set([1, ready.totalPages, ...Array.from({ length: 5 }, (_, i) => filters.page + i - 2)])).filter((p) => p >= 1 && p <= ready.totalPages).sort((a, b) => a - b) : [];
  return <aside id="local-heroes-panel" className="local-heroes-panel" aria-labelledby="local-heroes-heading" data-testid="local-heroes-panel">
    <div className="local-heroes-top"><div><p className="local-heroes-eyebrow">Con người &amp; địa phương</p><h2 id="local-heroes-heading" tabIndex={-1}>Nhân vật cách mạng theo địa phương</h2></div>
      <a className="local-heroes-close" href={exitHref} aria-label="Đóng danh sách nhân vật" onClick={(event) => { if (!modified(event)) { event.preventDefault(); onClose(); } }}>Đóng <span aria-hidden="true">×</span></a></div>
    <form method="get" action="/" className="local-heroes-filters" onSubmit={(event) => { event.preventDefault(); onChange({ ...filters, query: normalizeLocalHeroQuery(search.draft), page: 1 }); }}>
      <input type="hidden" name="noi-dung" value="nhan-vat" />
      {Array.from(mapParams).map(([key, value]) => <input key={key} type="hidden" name={key} value={value} />)}
      <LocalitySelect code={filters.localityCode} onChange={(code) => onChange({ localityCode: code, query: normalizeLocalHeroQuery(search.draft), page: 1 })} />
      <div className="local-heroes-search"><div className="local-heroes-field"><label htmlFor="local-heroes-search">Tên, bí danh hoặc đóng góp</label>
        <input id="local-heroes-search" name="q-nhan-vat" type="search" value={search.draft} onChange={(event) => setSearch({ committed: filters.query, draft: event.target.value })} /></div><button type="submit">Tìm</button></div>
    </form>
    <div className="local-heroes-results" role="region" aria-busy={load.status === "loading"} tabIndex={0} aria-label="Kết quả nhân vật, cuộn để đọc">
      {load.status === "loading" && <p role="status" className="local-heroes-message">Đang tải danh sách nhân vật…</p>}
      {load.status === "error" && <div className="local-heroes-message" role="alert"><p>{load.error.message}</p><a href={homeHref} onClick={(event) => { if (!modified(event)) { event.preventDefault(); onRetry(); } }}>Thử lại</a></div>}
      {ready && <>
        <p className="local-heroes-count" role="status">{ready.totalPeople} nhân vật{filters.localityCode ? ` · ${LOCALITIES.find((l) => l.code === filters.localityCode)?.officialName}` : " · Tất cả địa phương"}</p>
        <p className="local-heroes-coverage">Độ phủ hiện có: {ready.coverage.representedLocalities}/{ready.coverage.totalLocalities} địa phương tham chiếu có hồ sơ đủ điều kiện đọc.</p>
        {ready.items.length ? <LocalHeroList items={ready.items} homeHref={homeHref} localityCode={filters.localityCode} /> : <p className="local-heroes-message">{filters.query ? "Không có nhân vật phù hợp với tìm kiếm này." : "Chưa có hồ sơ đã được thẩm định cho địa phương này."} {filters.localityCode && !filters.query && "Điều này không có nghĩa địa phương không có nhân vật cách mạng."}</p>}
      </>}
    </div>
    {ready && <nav className="local-heroes-pagination" aria-label="Phân trang nhân vật">
      <span>Trang {ready.filters.page}{ready.totalPages ? ` / ${ready.totalPages}` : ""}</span>
      {ready.filters.page > 1 && <a href={pageHref(ready.filters.page - 1)} aria-label="Trang nhân vật trước" onClick={(e) => { if (!modified(e)) { e.preventDefault(); onChange({ ...filters, page: filters.page - 1 }); } }}>←</a>}
      {pages.map((p) => <a key={p} href={pageHref(p)} aria-current={p === ready.filters.page ? "page" : undefined} aria-label={`Trang nhân vật ${p}`} onClick={(e) => { if (!modified(e)) { e.preventDefault(); onChange({ ...filters, page: p }); } }}>{p}</a>)}
      {ready.filters.page < ready.totalPages && <a href={pageHref(ready.filters.page + 1)} aria-label="Trang nhân vật tiếp" onClick={(e) => { if (!modified(e)) { e.preventDefault(); onChange({ ...filters, page: filters.page + 1 }); } }}>→</a>}
    </nav>}
  </aside>;
}
