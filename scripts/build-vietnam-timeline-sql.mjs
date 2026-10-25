import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const realDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const webUrl = value => { try { return ["https:", "http:"].includes(new URL(value).protocol); } catch { return false; } };

/** Structural admission to a local draft package; this cannot certify historical truth. */
export function validateTimelinePackage(data, lessons) {
  const errors = [], identities = new Set(), sourceIds = new Set();
  for (const source of data.sources ?? []) {
    if (!source.id || sourceIds.has(source.id) || !source.title || !source.institution || !webUrl(source.url) || !realDate(source.accessedAt)) errors.push(`Invalid source ${source.id}`);
    sourceIds.add(source.id);
  }
  for (const event of data.events ?? []) {
    const fail = message => errors.push(`${event.slug}: ${message}`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug) || identities.has(event.slug)) fail("duplicate/invalid identity");
    if (!data.inventory?.some(item => item.slug === event.slug)) fail("identity absent from bounded inventory");
    identities.add(event.slug);
    if (event.workflowStatus !== "draft" || event.evidence !== "verified") fail("only source-reviewed draft artifacts admitted");
    if (!event.title || !event.summary || !event.content || !event.topic || !event.dateText) fail("missing narrative fields");
    if (!["exact", "year", "period", "approximate", "disputed"].includes(event.datePrecision)) fail("invalid date precision");
    if (!Number.isInteger(event.startYear) || (event.endYear !== null && (!Number.isInteger(event.endYear) || event.endYear < event.startYear))) fail("invalid year interval");
    for (const [key, year] of [["startDate", event.startYear], ["endDate", event.endYear ?? event.startYear]]) {
      if (event[key] !== null && (!realDate(event[key]) || Number(event[key].slice(0, 4)) !== year)) fail(`invalid ${key}`);
    }
    if (event.datePrecision === "exact" && !event.startDate) fail("exact date lacks day evidence");
    if (event.startDate && event.endDate && event.startDate > event.endDate) fail("reversed day interval");
    if (!event.sources?.length || event.sources.some(ref => !sourceIds.has(ref.id) || !ref.locator || !ref.scope)) fail("missing claim evidence/locator");
    if (!event.lessonRefs?.length || event.lessonRefs.some(ref => !lessons.some(lesson => lesson.slug === ref.lessonSlug && lesson.sections.some(section => section.id === ref.sectionId)))) fail("unknown lesson section");
    if (event.location && (!event.location.slug || !["approximate", "region"].includes(event.location.accuracy) || !event.location.sourceId || !sourceIds.has(event.location.sourceId) || !event.location.scope)) fail("unsupported coordinate precision");
    if (event.media !== null) fail("media must be separately reviewed; this package has no cleared event media");
  }
  return errors;
}

const sql = value => value === null || value === undefined ? "null" : typeof value === "number" ? String(value) : `'${String(value).replaceAll("'", "''")}'`;
const uuid = value => { const h = createHash("sha256").update(`timeline-2026-10-25:${value}`).digest("hex"); return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-8${h.slice(17,20)}-${h.slice(20,32)}`; };

/** Insert-only. Existing different content, published rows and hand edits are never rewritten. */
export function buildTimelineImport(data) {
  const out = ["-- Local review artifact only. No remote application/publication is authorized.",
    "-- Preconditions: current migrations, required curriculum topics, staff review of this package.",
    "-- Existing slugs with different content are skipped; reconcile them explicitly in administration.", "begin;", "set local lock_timeout = '5s';"];
  const topics = [...new Set(data.events.flatMap(event => [event.topic, ...(event.secondaryTopics ?? [])]))];
  out.push(`do $preflight$ begin\nif exists (select 1 from (values ${topics.map(topic => `(${sql(topic)})`).join(", ")}) required(slug) left join public.curriculum_topics t using (slug) where t.id is null) then\nraise exception 'Required curriculum topics missing; no content imported';\nend if;\nend $preflight$;`);
  for (const source of data.sources) out.push(`insert into public.sources (id,title,author_org,publisher,url,source_type,citation,accessed_at)\nselect ${[uuid(source.id), source.title, source.institution, source.institution, source.url, "official", `${source.institution}; accessed ${source.accessedAt}. Claim locators are in event_sources and the versioned ledger.`, source.accessedAt].map(sql).join(", ")}\nwhere not exists (select 1 from public.sources where url = ${sql(source.url)}) on conflict (id) do nothing;`);
  for (const event of data.events) {
    const values = [event.title, event.slug, event.startYear, event.endYear, event.startDate, event.endDate, event.dateText, event.datePrecision, event.summary, event.content, "draft"].map(sql).join(", ");
    out.push(`\n-- ${event.slug}\ninsert into public.historical_events (topic_id,title,slug,start_year,end_year,start_date,end_date,date_text,date_precision,summary,content,workflow_status)\nselect t.id, ${values} from public.curriculum_topics t where t.slug = ${sql(event.topic)} on conflict (slug) do nothing;`);
    const eligible = `select id from public.historical_events where slug = ${sql(event.slug)} and workflow_status = 'draft' and title = ${sql(event.title)} and summary = ${sql(event.summary)} and content = ${sql(event.content)} and start_year = ${event.startYear} and end_year is not distinct from ${sql(event.endYear)} and start_date is not distinct from ${sql(event.startDate)}::date and end_date is not distinct from ${sql(event.endDate)}::date and date_precision = ${sql(event.datePrecision)} and date_text = ${sql(event.dateText)} and topic_id = (select id from public.curriculum_topics where slug = ${sql(event.topic)})`;
    for (const ref of event.sources) {
      const source = data.sources.find(item => item.id === ref.id);
      out.push(`insert into public.event_sources (event_id,source_id,source_note,confidence_note)\nselect e.id, s.id, ${sql(`${ref.locator} — ${ref.scope}`)}, ${sql("Bounded source review; not human publication approval.")} from (${eligible}) e cross join lateral (select id from public.sources where url = ${sql(source.url)} order by id limit 1) s on conflict (event_id,source_id) do nothing;`);
    }
    for (const [order, ref] of event.lessonRefs.entries()) out.push(`insert into public.sgk_lesson_events (lesson_slug,section_id,event_id,sort_order)\nselect ${sql(ref.lessonSlug)}, ${sql(ref.sectionId)}, e.id, ${order} from (${eligible}) e on conflict (lesson_slug,section_id,event_id) do nothing;`);
    for (const topic of event.secondaryTopics ?? []) out.push(`insert into public.event_topics (event_id,topic_id)\nselect e.id,t.id from (${eligible}) e cross join public.curriculum_topics t where t.slug = ${sql(topic)} on conflict (event_id,topic_id) do nothing;`);
  }
  out.push("commit;", "-- Inspect inserted/skipped counts before review. No workflow transition to published is included.");
  return out.join("\n\n") + "\n";
}

export function buildReviewedMarkdown(event, sources, existing) {
  return ["---", `mode: ${existing ? "update" : "new"}`, `slug: ${event.slug}`, `title: ${event.title}`, `topic: ${event.topic}`,
    `start_year: ${event.startYear}`, `end_year: ${event.endYear ?? ""}`.trimEnd(), `start_date: ${event.startDate ?? ""}`.trimEnd(), `end_date: ${event.endDate ?? ""}`.trimEnd(),
    `date_text: ${event.dateText}`, `date_precision: ${event.datePrecision}`, `summary: ${event.summary}`, "workflow_status: draft",
    "location_scope: coordinate-free", `lesson_refs: ${event.lessonRefs.map(ref => `${ref.lessonSlug}#${ref.sectionId}`).join("; ")}`, "---", "",
    event.content, "", "## Nguồn cho phạm vi nội dung này", "",
    ...event.sources.map(ref => { const source = sources.find(item => item.id === ref.id); return `- [${source.title}](${source.url}) — ${source.institution}. Truy cập ${source.accessedAt}. Vị trí đối chiếu: ${ref.locator}. Phạm vi: ${ref.scope}`; }), "",
    "Trạng thái local: bản nháp có đối chiếu nguồn trong phạm vi nêu trên; chưa phải phê duyệt công bố của con người.", ""].join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const input = "supabase/content/timeline-2026-10-25/review-package.json";
  const data = JSON.parse(readFileSync(input, "utf8"));
  const { SGK_12, flattenLessons } = await import("../lib/sgk/curriculum.ts");
  const errors = validateTimelinePackage(data, flattenLessons(SGK_12));
  if (errors.length) throw new Error(errors.join("\n"));
  writeFileSync("supabase/seed-vietnam-timeline-2026-10-25.sql", buildTimelineImport(data), "utf8");
  const directory = "supabase/content/timeline-2026-10-25/reviewed-events";
  mkdirSync(directory, { recursive: true });
  for (const event of data.events) writeFileSync(`${directory}/${event.slug}.md`, buildReviewedMarkdown(event, data.sources,
    data.inventory.find(item => item.slug === event.slug)?.decision === "reuse"), "utf8");
  console.log(`${data.events.length} bounded draft artifacts validated; insert-only SQL prepared locally, not applied.`);
}
