import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { validateTimelinePackage, buildTimelineImport } from "../../scripts/build-vietnam-timeline-sql.mjs";
import { applyAssignments, flattenLessons, placementsForEvent, SGK_12 } from "@/lib/sgk/curriculum";

const lessons = flattenLessons(SGK_12);
const source = { id: "test-source", title: "Synthetic institutional source", institution: "Test institution", url: "https://example.org/source", accessedAt: "2026-10-25", publishedAt: null };
const event = { slug: "synthetic-event", title: "Synthetic", topic: "cong-cuoc-doi-moi", secondaryTopics: [], startYear: 2019, endYear: 2019, startDate: "2019-01-14", endDate: "2019-01-14", dateText: "14/1/2019", datePrecision: "exact", summary: "Synthetic summary", content: "Synthetic narrative", evidence: "verified", workflowStatus: "draft", location: null, media: null, lessonRefs: [{ lessonSlug: "14-doi-ngoai-tu-nam-1975-den-nay", sectionId: "muc-2" }], sources: [{ id: "test-source", locator: "Opening paragraph", scope: "Date and summary" }] };
const fixture = () => ({ sources: [{ ...source }], events: [structuredClone(event)], inventory: [{ slug: event.slug }] });
describe("bounded local Vietnamese timeline review package", () => {
  it("keeps the actual prepared package structurally admitted and separate from public workflow", () => {
    const data = JSON.parse(fs.readFileSync("supabase/content/timeline-2026-10-25/review-package.json", "utf8"));
    expect(validateTimelinePackage(data, lessons)).toEqual([]);
    expect(new Set(data.inventory.map((item: { slug: string }) => item.slug)).size).toBe(data.inventory.length);
    for (const batch of data.batches) expect(batch.slugs.length).toBeLessThanOrEqual(3);
    const mapped = flattenLessons(applyAssignments(SGK_12, data.events.flatMap((event: ReturnType<typeof fixture>["events"][number]) => event.lessonRefs.map((ref, sortOrder) => ({ ...ref, eventSlug: event.slug, sortOrder })))));
    for (const event of data.events) expect(placementsForEvent(event.slug, mapped).length).toBe(event.lessonRefs.length);
  });
  it("accepts bounded provenance, actual lesson sections and no invented coordinate", () => {
    expect(validateTimelinePackage(fixture(), lessons)).toEqual([]);
  });
  it.each([{ sources: [] }, { startDate: "2019-02-30" }, { datePrecision: "verified" }, { workflowStatus: "published" }, { evidence: "needs_evidence" }, { lessonRefs: [{ lessonSlug: "wrong", sectionId: "muc-1" }] }, { location: { slug: "guessed", accuracy: "exact" } }, { media: { url: "https://example.org/unreviewed.jpg" } }])("rejects unsafe content %o", patch => {
    const data = fixture(); Object.assign(data.events[0], patch);
    expect(validateTimelinePackage(data, lessons).length).toBeGreaterThan(0);
  });
  it("rejects duplicate stable identities and missing claim locators", () => {
    const data = fixture(); data.events.push({ ...data.events[0] });
    expect(validateTimelinePackage(data, lessons).join(" ")).toMatch(/duplicate/i);
    data.events.pop(); data.events[0].sources[0].locator = "";
    expect(validateTimelinePackage(data, lessons).length).toBeGreaterThan(0);
  });
  it("builds deterministic insert-only draft SQL with sources and real section links", () => {
    const data = fixture();
    expect(validateTimelinePackage(data, lessons)).toEqual([]);
    const sql = buildTimelineImport(data);
    expect(sql).toContain("'draft'");
    expect(sql).toContain("public.event_sources");
    expect(sql).toContain("public.sgk_lesson_events");
    expect(sql).toContain("on conflict (slug) do nothing");
    expect(sql).not.toMatch(/update public\.historical_events/i);
    expect(buildTimelineImport(fixture())).toBe(sql);
  });
});
