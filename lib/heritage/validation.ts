import { z } from "zod";

export const HeritageCoordinateSchema = z.object({
  lat: z.number().min(8.0).max(23.5),
  lng: z.number().min(102.0).max(117.5),
  accuracy: z.enum(["exact", "approximate", "region"]),
  note: z.string().optional().nullable(),
  osm: z.string().min(1),
  sourceKey: z.string().min(1),
});

export const HeritageSectionSourceCitationSchema = z.object({
  sourceKey: z.string().min(1),
  locator: z.string().min(1),
  scopeNote: z.string().min(1),
});

export const HeritageStorySectionSchema = z.object({
  heading: z.string().trim().min(2).max(120),
  body: z.string().trim().min(80).max(4000),
  certainty: z.enum(["verified", "approximate", "disputed", "editorial"]),
  uncertaintyNote: z.string().nullable().optional(),
  sources: z.array(HeritageSectionSourceCitationSchema).min(1),
});

export const HeritageMediaItemSchema = z.object({
  key: z.string().min(1),
  fileUrl: z.string().url(),
  sourcePageUrl: z.string().url(),
  era: z.enum(["historical", "today", "illustration"]),
  yearTaken: z.number().nullable().optional(),
  photographer: z.string().nullable().optional(),
  license: z.string().nullable().optional(),
  licenseUrl: z.string().nullable().optional(),
  usageBasis: z.enum(["open_license", "public_domain", "permission", "coursework_reference"]),
  caption: z.string().min(15),
  altText: z.string().min(10),
  isCover: z.boolean(),
  pairKey: z.string().nullable().optional(),
  isReenactment: z.boolean().optional(),
  isColorized: z.boolean().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const HeritageVideoItemSchema = z.object({
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string().trim().min(3).max(200),
  channel: z.string().trim().min(2).max(120),
  channelUrl: z.string().url().nullable().optional(),
  note: z.string().nullable().optional(),
  embedCheckedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const HeritageSiteRecordSchema = z.object({
  key: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160),
  enrollExistingSlug: z.string().nullable().optional(),
  decision: z.enum(["accepted", "held", "rejected"]),
  decisionNote: z.string().optional().nullable(),
  name: z.string().trim().min(2).max(120),
  historicalName: z.string().nullable().optional(),
  localityCode: z.string().regex(/^\d{2}$/),
  tier: z.enum(["grade12", "extended"]),
  rank: z.number().int().min(1).max(9),
  period: z.string().trim().min(1).max(60),
  teaser: z.string().trim().min(40).max(360),
  description: z.string().optional().nullable(),
  coordinate: HeritageCoordinateSchema,
  lessonSlug: z.string().nullable().optional(),
  eventSlugs: z.array(z.string()).optional(),
  sections: z.array(HeritageStorySectionSchema),
  media: z.array(HeritageMediaItemSchema),
  videos: z.array(HeritageVideoItemSchema),
});

export const HeritageSourceRecordSchema = z.object({
  key: z.string().min(1),
  title: z.string().trim().min(1),
  authorOrg: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  sourceType: z.enum(["book", "article", "official", "web", "archive", "other"]),
  url: z.string().nullable().optional(),
  citation: z.string().trim().min(1),
  publishedYear: z.number().int().nullable().optional(),
  accessedAt: z.string().nullable().optional(),
});

export const HeritagePackageSchema = z.object({
  schemaVersion: z.literal(1),
  framework: z.literal("VN-34-2025"),
  sites: z.array(HeritageSiteRecordSchema),
});
