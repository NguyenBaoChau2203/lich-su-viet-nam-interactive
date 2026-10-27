import type { Database } from "@/lib/database.types";
import type { EvidenceInput, LocalHeroAdminGraph, LocalHeroReadiness, ReadinessCode } from "./admin-types";

type Source = Database["public"]["Tables"]["sources"]["Row"];
type BaseMedia = Pick<Database["public"]["Tables"]["media_assets"]["Row"], "id" | "figure_id" | "source_id" | "media_type" | "era" | "file_url" | "caption" | "alt_text" | "source_page_url" | "photographer" | "width" | "height" | "is_reenactment" | "is_colorized" | "license" | "license_url">;
const nonblank = (v: string | null | undefined) => Boolean(v?.trim());
const https = (v: string | null) => { try { const u = new URL(v ?? ""); return u.protocol === "https:" && !u.username && !u.password && !/[\s\u0000-\u001f\u007f]/u.test(v ?? ""); } catch { return false; } };
const words = (v: string) => v.replace(/\[\[cite:[^\]]+\]\]/gu, "").replace(/^\s*#{1,6}\s+/gmu, "").replace(/\*\*|__/gu, "").trim().split(/\p{White_Space}+/u).filter(Boolean).length;
const origin = (s: Source) => { try { return (s.author_org?.trim() || s.publisher?.trim() || (s.url ? new URL(s.url).hostname : "")).toLocaleLowerCase("vi"); } catch { return ""; } };

/** Structural readiness; draft stories can be selected before simultaneous submission. DB checks remain authoritative. */
export function evaluateLocalHeroReadiness(graph: Omit<LocalHeroAdminGraph, "readiness">, sources: readonly Source[], media: readonly BaseMedia[], storyIds?: readonly string[]): LocalHeroReadiness {
  const result: LocalHeroReadiness = { blocking: [], warnings: [] };
  const add = (ok: boolean, code: ReadinessCode, path: string, message: string) => { if (!ok) result.blocking.push({ code, path, message }); };
  const metadata = new Map(sources.map((s) => [s.id, s]));
  const checkSource = (id: string, path: string) => {
    const s = metadata.get(id);
    add(Boolean(s && nonblank(s.title) && nonblank(s.citation) && (nonblank(s.author_org) || nonblank(s.publisher)) && s.accessed_at && (s.url === null || https(s.url))), "SOURCE_METADATA", path, "Nguồn cần tên, cơ quan, trích dẫn, ngày truy cập và URL an toàn nếu có.");
    add(!s || !/\b(?:TODO|FIXME)\b/iu.test([s.title, s.author_org, s.publisher, s.citation].join(" ")), "INTERNAL_NOTE", path, "Còn ghi chú nội bộ trong thông tin nguồn.");
  };
  const checkEvidence = (rows: readonly EvidenceInput[], path: string) => {
    for (const r of rows) {
      checkSource(r.sourceId, path + "." + r.claimKey);
      add(!["approximate", "disputed"].includes(r.certainty) || nonblank(r.uncertaintyNote), "UNCERTAINTY_NOTE_REQUIRED", path + "." + r.claimKey, "Cần ghi rõ điều chưa chắc chắn.");
      add(!/\b(?:TODO|FIXME)\b/iu.test([r.claimText, r.locator, r.scopeNote, r.uncertaintyNote].join(" ")), "INTERNAL_NOTE", path + "." + r.claimKey, "Còn ghi chú nội bộ trong nội dung công khai.");
      if (r.certainty === "disputed") {
        const origins = rows.filter((x) => x.claimKey === r.claimKey).map((x) => metadata.get(x.sourceId)).filter((s): s is Source => Boolean(s)).map(origin);
        add(new Set(origins.filter(Boolean)).size >= 2, "INDEPENDENT_SOURCES_REQUIRED", path + "." + r.claimKey, "Dữ kiện tranh luận cần ít nhất hai nguồn có xuất xứ độc lập.");
      }
    }
  };
  checkEvidence(graph.sources, "sources");
  const has = (key: string, verified = false) => graph.sources.some((s) => s.claimKey === key && (!verified || s.certainty === "verified"));
  add(has("identity", true), "IDENTITY_SOURCE_REQUIRED", "sources.identity", "Cần nguồn xác minh danh tính.");
  add(has("contribution", true), "CONTRIBUTION_SOURCE_REQUIRED", "sources.contribution", "Cần nguồn xác minh đóng góp.");
  add(has("period", true), "PERIOD_SOURCE_REQUIRED", "sources.period", "Cần nguồn xác minh thời kỳ đóng góp.");
  const f = graph.figure;
  add(Boolean(f.contributionSummary && f.contributionStartYear !== null && f.contributionEndYear !== null && f.contributionStartYear <= 1975 && f.contributionEndYear >= 1858), "PERIOD_OUT_OF_SCOPE", "figure", "Đóng góp cần khoảng thời gian có nguồn giao với 1858–1975.");
  for (const [needed, key] of [[Boolean(f.biography), "biography"], [f.birthYear !== null, "birth_year"], [f.deathYear !== null, "death_year"], [f.catalogAliases.length > 0, "aliases"]] as const) add(!needed || has(key, key === "aliases"), "DISPLAYED_CLAIM_SOURCE_REQUIRED", "sources." + key, "Dữ kiện hiển thị cần nguồn riêng, bí danh phải được xác minh.");
  add(graph.localities.some((l) => l.certainty === "verified" && l.kind !== "commemoration" && graph.sources.some((s) => s.claimKey === l.claimKey && s.sourceId === l.primarySourceId && s.certainty === "verified")), "LOCALITY_MAPPING_REQUIRED", "localities", "Cần quan hệ lịch sử và ánh xạ địa phương được xác minh.");
  const selected = graph.stories.filter((s) => storyIds ? storyIds.includes(s.id) : graph.workflow === "pending_review" || graph.workflow === "published" ? s.workflow === graph.workflow : s.isPrimary);
  add(selected.filter((s) => s.isPrimary).length === 1, "PRIMARY_STORY_REQUIRED", "stories", "Cần chọn đúng một truyện chính.");
  for (const s of selected) {
    const at = "stories." + s.id, keys = new Set(s.sources.map((x) => x.claimKey));
    checkEvidence(s.sources, at + ".sources");
    add(nonblank(s.summary) && s.sources.length > 0 && s.body.split(/\n\s*\n/u).filter((p) => p.trim()).every((p) => /^\s*#{1,6} /u.test(p) || /\[\[cite:[^\]]+\]\]/u.test(p)), "STORY_SOURCE_REQUIRED", at, "Cần tóm tắt và trích dẫn thuộc chính truyện này cho mỗi đoạn.");
    add(!s.isPrimary || words(s.body) >= 350 && words(s.body) <= 700, "STORY_LENGTH", at + ".body", "Truyện chính cần 350–700 từ.");
    const markers = [...s.body.matchAll(/\[\[cite:([^\]]+)\]\]/gu)].map((m) => m[1]);
    add(markers.every((k) => keys.has(k)) && !s.body.replace(/\[\[cite:[^\]]+\]\]/gu, "").includes("[[cite:"), "CITATION_MARKER_INVALID", at + ".body", "Truyện có ký hiệu trích dẫn không khớp.");
    add(!/\b(?:TODO|FIXME)\b/iu.test(s.title + s.summary + s.body), "INTERNAL_NOTE", at, "Còn ghi chú nội bộ trong truyện.");
  }
  const images = graph.mediaEvidence.filter((m) => m.decision === "accepted");
  add(images.length > 0, "IMAGE_REQUIRED", "mediaEvidence", "Cần ít nhất một ảnh có chứng cứ được chấp nhận.");
  for (const m of images) {
    const base = media.find((b) => b.id === m.mediaId && b.figure_id === graph.figureId), at = "mediaEvidence." + m.mediaId;
    checkSource(m.identitySourceId, at + ".identitySourceId");
    if (m.usageSourceId) checkSource(m.usageSourceId, at + ".usageSourceId");
    if (base?.source_id) checkSource(base.source_id, at + ".sourceId");
    add(Boolean(base && base.media_type === "image" && ["historical", "illustration"].includes(base.era) && nonblank(base.alt_text) && nonblank(base.caption) && nonblank(base.photographer) && (base.width ?? 0) > 0 && (base.height ?? 0) > 0 && https(base.source_page_url) && https(base.file_url) && m.identityCertainty === "verified" && m.checkedAt && nonblank(m.identityLocator) && (m.depictionKind === "portrait" ? base.era === "historical" && !base.is_reenactment && !base.is_colorized : base.caption?.includes("Tư liệu bối cảnh, không phải chân dung"))), "IMAGE_IDENTITY", at, "Cần xác minh đúng ảnh, nhãn bối cảnh, kích thước và ghi công.");
    add(m.usageBasis !== "unknown" && (m.usageBasis === "coursework_reference" ? nonblank(m.usageNote) : Boolean(m.usageSourceId && nonblank(m.usageLocator))) && (m.usageBasis !== "open_license" || Boolean(base?.license && https(base.license_url))), "IMAGE_USAGE", at, "Cần chứng cứ sử dụng ảnh; không tự tạo giấy phép.");
  }
  add(!/\b(?:TODO|FIXME)\b/iu.test([f.name, f.biography, f.contributionSummary, ...f.catalogAliases].join(" ")), "INTERNAL_NOTE", "figure", "Còn ghi chú nội bộ trong nội dung nhân vật.");
  return result;
}
