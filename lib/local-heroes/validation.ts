import { z } from "zod";
import { LOCALITIES } from "./localities";

const text = (max: number, blank = false) => z.string().transform((s) => s.normalize("NFC").trim()).refine((s) => (blank || s.length > 0) && Array.from(s).length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/u.test(s), "Văn bản không hợp lệ.");
const richText = (max: number) => text(max, true).refine((s) => !/<\/?[a-z!]|!\[|\]\(\s*(?:javascript|data|vbscript):/iu.test(s), "Nội dung có định dạng không được hỗ trợ.");
export const uuidSchema = z.string().regex(/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/iu).transform((s) => s.toLowerCase());
export const revisionSchema = z.string().regex(/^(0|[1-9][0-9]{0,18})$/u).refine((s) => s.length < 19 || s <= "9223372036854775807", "Phiên bản không hợp lệ.");
const year = z.number().int().min(1).max(2200).nullable();
const certainty = z.enum(["verified", "approximate", "disputed", "editorial"]);
const slug = z.string().max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u);
const claimKey = z.string().max(160).regex(/^[a-z][a-z0-9_-]*(?::[a-z0-9_-]+)*$/u);
const locality = z.enum(LOCALITIES.map((l) => l.code));
const evidenceSchema = z.strictObject({ claimKey, sourceId: uuidSchema, claimText: text(20000), locator: text(2000), scopeNote: text(2000), certainty, uncertaintyNote: text(2000).nullable() }).refine((s) => !["approximate", "disputed"].includes(s.certainty) || Boolean(s.uncertaintyNote), { path: ["uncertaintyNote"], message: "Cần giải thích mức độ chưa chắc chắn." });
const localitySchema = z.strictObject({ id: uuidSchema, localityCode: locality, kind: z.enum(["birthplace", "home_origin", "activity", "commemoration"]), historicalPlaceLabel: text(500), explanation: text(2000), claimKey, primarySourceId: uuidSchema, certainty, uncertaintyNote: text(2000).nullable() }).refine((r) => r.claimKey === `locality:${r.localityCode}:${r.kind}` && (!["approximate", "disputed"].includes(r.certainty) || Boolean(r.uncertaintyNote)), "Quan hệ và chứng cứ địa phương không khớp.");
const storySchema = z.strictObject({ id: uuidSchema, slug, title: text(200), summary: text(600, true), body: richText(20000), sortOrder: z.number().int().min(0).max(2147483647), isPrimary: z.boolean(), sources: z.array(evidenceSchema).max(300) });
const mediaEvidenceSchema = z.strictObject({ mediaId: uuidSchema, depictionKind: z.enum(["portrait", "historical_context"]), decision: z.enum(["accepted", "held"]), identitySourceId: uuidSchema, identityLocator: text(2000), identityCertainty: certainty, usageBasis: z.enum(["open_license", "public_domain", "permission", "coursework_reference", "unknown"]), usageSourceId: uuidSchema.nullable(), usageLocator: text(2000).nullable(), usageNote: text(2000).nullable(), checkedAt: z.iso.datetime({ offset: false }).nullable() }).refine((m) => m.decision !== "accepted" || m.identityCertainty === "verified" && Boolean(m.checkedAt) && m.usageBasis !== "unknown" && (m.usageBasis === "coursework_reference" ? Boolean(m.usageNote) : Boolean(m.usageSourceId && m.usageLocator)), "Ảnh được chấp nhận cần chứng cứ nhận diện và quyền sử dụng.");
const figureSchema = z.strictObject({ name: text(200), slug, otherNames: text(2000, true).nullable(), birthYear: year, deathYear: year, biography: richText(20000).nullable(), isLocalHero: z.literal(true), contributionSummary: text(600).nullable(), contributionStartYear: year, contributionEndYear: year, catalogAliases: z.array(text(160)).max(20) }).refine((f) => (f.birthYear === null || f.deathYear === null || f.birthYear <= f.deathYear) && (f.contributionStartYear === null && f.contributionEndYear === null || f.contributionStartYear !== null && f.contributionEndYear !== null && f.contributionStartYear <= f.contributionEndYear) && new Set(f.catalogAliases).size === f.catalogAliases.length, "Năm hoặc bí danh không hợp lệ.");
const cas = { figureId: uuidSchema, expectedRevision: revisionSchema };
export const graphSchema = z.strictObject({ figureId: uuidSchema.nullable(), expectedRevision: revisionSchema.nullable(), figure: figureSchema, sources: z.array(evidenceSchema).max(300), localities: z.array(localitySchema).max(136), stories: z.array(storySchema).max(30), mediaEvidence: z.array(mediaEvidenceSchema).max(50) }).superRefine((g, ctx) => {
  if ((g.figureId === null) !== (g.expectedRevision === null)) ctx.addIssue({ code: "custom", path: ["expectedRevision"], message: "Mã hồ sơ và phiên bản phải cùng có hoặc cùng trống." });
  const ids = [...g.localities.map((x) => x.id), ...g.stories.map((x) => x.id), ...g.mediaEvidence.map((x) => x.mediaId)];
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Mã con bị trùng." });
  const refs = g.sources.map((s) => s.claimKey + "/" + s.sourceId);
  if (new Set(refs).size !== refs.length) ctx.addIssue({ code: "custom", path: ["sources"], message: "Trích dẫn bị trùng." });
});
const storyIds = z.array(uuidSchema).min(1).max(30).refine((s) => new Set(s).size === s.length);
export const submitSchema = z.strictObject({ ...cas, storyIds });
export const restoreSchema = z.strictObject(cas);
export const reviewSchema = z.union([
  z.strictObject({ ...cas, action: z.enum(["publish", "hide"]) }),
  z.strictObject({ ...cas, action: z.literal("request_revision"), reason: text(2000).refine((s) => Array.from(s).length >= 5) }),
  z.strictObject({ ...cas, action: z.literal("republish"), storyIds }),
]);

const readinessIssueSchema = z.strictObject({ code: z.enum(["IDENTITY_SOURCE_REQUIRED", "CONTRIBUTION_SOURCE_REQUIRED", "PERIOD_SOURCE_REQUIRED", "PERIOD_OUT_OF_SCOPE", "DISPLAYED_CLAIM_SOURCE_REQUIRED", "LOCALITY_REQUIRED", "LOCALITY_MAPPING_REQUIRED", "PRIMARY_STORY_REQUIRED", "STORY_SOURCE_REQUIRED", "STORY_LENGTH", "IMAGE_REQUIRED", "IMAGE_IDENTITY", "IMAGE_USAGE", "SOURCE_METADATA", "UNCERTAINTY_NOTE_REQUIRED", "INDEPENDENT_SOURCES_REQUIRED", "INTERNAL_NOTE", "CITATION_MARKER_INVALID"]), path: z.string(), message: z.string() });
export const readinessSchema = z.strictObject({ blocking: z.array(readinessIssueSchema), warnings: z.array(readinessIssueSchema) });
export const mutationResultSchema = z.discriminatedUnion("ok", [
  z.strictObject({ ok: z.literal(true), data: z.strictObject({ figureId: uuidSchema, slug, revision: revisionSchema, workflow: z.enum(["draft", "pending_review", "needs_revision", "published", "hidden"]), readiness: readinessSchema }) }),
  z.strictObject({ ok: z.literal(false), error: z.strictObject({ code: z.enum(["INVALID_INPUT", "UNAUTHENTICATED", "FORBIDDEN", "NOT_FOUND", "STALE", "INVALID_TRANSITION", "READINESS_FAILED", "CONFLICT", "DB_UNAVAILABLE"]), message: z.string().max(500), fieldErrors: z.record(z.string(), z.array(z.string())), readiness: readinessSchema.nullable(), currentRevision: revisionSchema.nullable() }) }),
]);
