import fs from "node:fs";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { evaluateReadiness } from "@/lib/admin/readiness";
import { flattenLessons, SGK_12 } from "@/lib/sgk/curriculum";
import { validateTimelinePackage } from "../../scripts/build-vietnam-timeline-sql.mjs";

const original = JSON.parse(fs.readFileSync("supabase/content/timeline-2026-10-25/review-package.json", "utf8"));
const reviewed = JSON.parse(fs.readFileSync("supabase/content/timeline-review-2026-10-26/approved-events.json", "utf8"));

describe("owner-delegated timeline publication review", () => {
  it("approves only the exact 22 imported identities without claiming teacher approval", () => {
    expect(reviewed.reviewKind).toBe("owner-delegated-agent-source-review");
    expect(reviewed.teacherApproval).toBe(false);
    expect(reviewed.originalPackageSha256).toBe(createHash("sha256").update(fs.readFileSync(reviewed.originalPackage)).digest("hex"));
    expect(reviewed.events.map((e: { slug: string }) => e.slug).sort()).toEqual(original.events.map((e: { slug: string }) => e.slug).sort());
    expect(reviewed.events).toHaveLength(22);
    expect(reviewed.events.every((e: { workflowStatus: string; decision: string }) => e.workflowStatus === "published" && e.decision === "approve")).toBe(true);
  });

  it("meets shared date, provenance, curriculum and existing administrative readiness rules", () => {
    // Reuse the draft validator only for shared date/source/lesson fields; publication is explicit above.
    expect(validateTimelinePackage({ ...reviewed, inventory: original.inventory, events: reviewed.events.map((e: object) => ({ ...e, workflowStatus: "draft" })) }, flattenLessons(SGK_12))).toEqual([]);
    for (const event of reviewed.events) {
      expect(evaluateReadiness({ kind: "su-kien", content: event.content, sourceCount: event.sources.length,
        hasPrimaryLocation: false, figureCount: 0, unpublishedLinkedCount: 0,
        publicTexts: [event.title, event.summary, event.content], media: { count: 0, missingAlt: 0, missingLicense: 0 } }).blocking, event.slug).toEqual([]);
      expect(event.content, event.slug).not.toMatch(/\b(?:enum|approximate|workflow_status|TODO|FIXME)\b|trường dữ liệu|không gán tọa độ|trước khi công bố/i);
      expect(event.location).toBeNull();
      expect(event.media).toBeNull();
    }
  });

  it("keeps the documented month, movement aftermath and normalization date distinctions", () => {
    const get = (slug: string) => reviewed.events.find((e: { slug: string }) => e.slug === slug);
    expect(get("nguyen-ai-quoc-dai-hoi-tours-1920")).toMatchObject({ startDate: null, endDate: null, datePrecision: "approximate", dateText: "Tháng 12/1920" });
    expect(get("phong-trao-dong-du").dateText).toContain("1905–1908");
    expect(get("phong-trao-dong-du").content).toContain("1909");
    expect(get("binh-thuong-hoa-quan-he-viet-my-1995").content).toContain("12/7/1995");
    expect(get("binh-thuong-hoa-quan-he-viet-my-1995").content).toContain("11/7/1995");
    expect(get("bao-ve-chu-quyen-gac-ma-1988").sources.length).toBeGreaterThanOrEqual(2);
  });
});
