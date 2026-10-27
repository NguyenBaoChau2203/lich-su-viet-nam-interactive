import { describe, expect, it } from "vitest";
import { catalogStoryInputs } from "@/lib/local-heroes/admin-form";
import { graphSchema } from "@/lib/local-heroes/validation";

describe("catalog read graph to form command", () => {
  it("removes server workflow fields without mutating a loaded story or its evidence", () => {
    const story = { id: "a0000000-0000-4000-8000-000000000002", slug: "synthetic-story", title: "Synthetic story", summary: "", body: "", sortOrder: 0, isPrimary: true, sources: [], workflow: "draft" as const, reviewNote: "PRIVATE_REVIEW_SENTINEL" };
    const stories = catalogStoryInputs([story]);
    expect(stories).toEqual([{ id: story.id, slug: story.slug, title: story.title, summary: "", body: "", sortOrder: 0, isPrimary: true, sources: [] }]);
    expect(story.reviewNote).toBe("PRIVATE_REVIEW_SENTINEL");
    expect(JSON.stringify(stories)).not.toContain("PRIVATE_REVIEW_SENTINEL");
    const figure = { name: "Synthetic person", slug: "synthetic-person", otherNames: null, birthYear: null, deathYear: null, biography: null, isLocalHero: true, contributionSummary: null, contributionStartYear: null, contributionEndYear: null, catalogAliases: [] };
    const command = { figureId: null, expectedRevision: null, figure, sources: [], localities: [], stories, mediaEvidence: [] };
    expect(graphSchema.safeParse(command).success).toBe(true);
    expect(graphSchema.safeParse({ ...command, stories: [story] }).success).toBe(false);
  });
});
