// Privacy-safe fictional records for browser behavior, never historical content.
import { readFileSync } from "node:fs";
export const localities = JSON.parse(readFileSync(new URL("./localities.json", import.meta.url), "utf8"));
const citation = { sourceId: "synthetic-source", title: "Synthetic archive", authorOrg: "Synthetic institution", publisher: null, sourceType: "archive", url: "https://example.invalid/source", citation: "Fictional test evidence", publishedYear: null, accessedAt: "2026-10-26", locator: "Synthetic section", scopeNote: "Test only" };
const association = (code, kind = "activity") => ({ id: `synthetic-${code}-${kind}`, locality: localities.find((l) => l.code === code), kind,
  historicalPlaceLabel: "Synthetic historical label", explanation: "Synthetic association; no historical claim", qualifiesForCoverage: kind !== "commemoration",
  claim: { key: `locality:${code}:${kind}`, text: "Synthetic mapping", certainty: "verified", uncertaintyNote: null, sources: [citation] } });
export const people = Array.from({ length: 36 }, (_, i) => ({ id: `10000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`, slug: `synthetic-person-${String(i + 1).padStart(2, "0")}`,
  name: i === 0 ? "Đặng Nhân Vật Giả" : `Nhân vật mẫu ${String(i + 1).padStart(2, "0")}`, aliases: i === 0 ? ["Bí danh giả"] : [], birthYear: null, deathYear: null, birthYearCertainty: null, deathYearCertainty: null,
  contributionSummary: "Đóng góp giả định % _ dùng kiểm thử; không phải hồ sơ lịch sử.",
  image: { id: `synthetic-image-${i + 1}`, url: `https://example.invalid/local-heroes/${i === 1 ? "broken" : i + 1}.png`, width: 240, height: 160, altText: "Tư liệu tổng hợp phục vụ kiểm thử", caption: "Synthetic context; not a portrait", depictionKind: "historical_context", era: "illustration", labels: ["Tư liệu bối cảnh, không phải chân dung", "Tư liệu kiểm thử"], photographer: "Synthetic fixture", sourcePageUrl: "https://example.invalid/source", license: null, licenseUrl: null, usageBasis: "coursework_reference", usageNote: "Test only", focalPoint: null },
  associations: i === 0 ? [association("01"), association("04", "home_origin"), association("96", "commemoration")]
    : [association(i < 14 ? "01" : localities[(i - 13) % 33].code)] }));
const fold = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[đĐ]/gu, "d").toLocaleLowerCase("vi");
export function pageResult(code, query, rawPage) {
  const tokens = fold(query).split(" ").filter(Boolean);
  const rows = people.filter((p) => (!code || p.associations.some((a) => a.locality.code === code && a.qualifiesForCoverage)) && tokens.every((t) => fold([p.name, ...p.aliases, p.contributionSummary].join(" ")).includes(t)))
    .sort((a, b) => a.name.localeCompare(b.name, "vi") || (a.slug < b.slug ? -1 : 1));
  const totalPages = Math.ceil(rows.length / 12), page = Math.max(1, Math.min(rawPage, totalPages || 1));
  const byLocality = localities.map((l) => ({ code: l.code, eligiblePeople: people.filter((p) => p.associations.some((a) => a.locality.code === l.code && a.qualifiesForCoverage)).length }));
  return { filters: { localityCode: code || null, query, page }, pageSize: 12, totalPeople: rows.length, totalPages, items: rows.slice((page - 1) * 12, page * 12),
    coverage: { framework: "VN-34-2025", totalLocalities: 34, representedLocalities: byLocality.filter((l) => l.eligiblePeople).length, byLocality } };
}
export function profileResult(slug) {
  const p = people.find((p) => p.slug === slug);
  if (!p) return null;
  const storyClaim = { key: "synthetic-story-claim", text: "Synthetic story claim text", certainty: "verified", uncertaintyNote: null, sources: [citation] };
  return {
    ...p,
    biography: "Tiểu sử chi tiết phục vụ kiểm thử giao diện.",
    claims: [{ key: "contribution", text: p.contributionSummary, certainty: "verified", uncertaintyNote: null, sources: [citation] }],
    stories: [
      { id: "synthetic-story", slug: "synthetic-story", title: "Câu chuyện kiểm thử", summary: "Tóm tắt câu chuyện kiểm thử phục vụ xác minh giao diện.", body: "Dữ liệu tổng hợp chỉ phục vụ kiểm thử [[cite:synthetic-story-claim]] để kiểm tra liên kết nguồn tham khảo.", isPrimary: true, sortOrder: 0, claims: [storyClaim] },
    ],
    gallery: [p.image],
    events: [{ slug: events[0].slug, title: events[0].title, startYear: events[0].start_year, dateText: events[0].date_text, relationship: "Tham gia phong trào" }],
  };
}
export const events = [
  ["nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc", 1911], ["ban-yeu-sach-cua-nhan-dan-an-nam-1919", 1919], ["tuyen-ngon-doc-lap", 1945], ["chien-dich-dien-bien-phu", 1954], ["chien-dich-ho-chi-minh", 1975], ["synthetic-year-2019", 2019], ["synthetic-year-1905", 1905],
].map(([slug, year], i) => ({ id: `20000000-0000-4000-8000-${String(i + 1).padStart(12, "0")}`, slug, title: `Synthetic event ${year}`, summary: "Synthetic navigation fixture", content: "Synthetic navigation fixture.", start_year: year, end_year: null, date_text: String(year), date_precision: "year", workflow_status: "published", is_featured: false, curriculum_topics: { name: "Synthetic topic", slug: "synthetic-topic" }, media_assets: [], event_figures: [], event_topics: [], event_locations: [], event_sources: [{ sources: { id: "synthetic-source", title: "Synthetic source", citation: "Synthetic fixture", url: "https://example.invalid/source", source_type: "archive" } }] }));
