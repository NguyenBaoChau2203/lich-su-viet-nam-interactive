import type { StoryInput } from "./admin-types";

/** Staff read DTOs carry workflow fields that strict write commands must never accept. */
export function catalogStoryInputs(stories: readonly StoryInput[]): StoryInput[] {
  return stories.map(({ id, slug, title, summary, body, sortOrder, isPrimary, sources }) =>
    ({ id, slug, title, summary, body, sortOrder, isPrimary, sources }));
}
