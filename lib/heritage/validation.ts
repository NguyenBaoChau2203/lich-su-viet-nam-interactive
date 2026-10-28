import { z } from "zod";

export const FORBIDDEN_PHOTOGRAPHERS = new Set([
  "Wikimedia Commons Contributor",
  "Cổng Thông tin Điện tử",
  "Cổng Thông tin Điện tử tỉnh",
]);

export const FORBIDDEN_PHOTOGRAPHER_REGEX = /^Cổng Thông tin Điện tử( tỉnh)?$/i;

export const FORBIDDEN_URL_PATTERNS = [
  /\/uploads\/images\/\d{4}\/\d{2}\//i,
  /Special:FilePath/i,
];

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

export const HeritageMediaItemSchema = z
  .object({
    key: z.string().min(1),
    fileUrl: z.string().refine(
      (url) => {
        if (url.startsWith("storage:locations/heritage/")) return true;
        if (FORBIDDEN_URL_PATTERNS.some((p) => p.test(url))) return false;
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      },
      {
        message:
          "fileUrl must be a valid http/https URL or storage: URI and must not match forbidden patterns (Special:FilePath or /uploads/images/...)",
      },
    ),
    sourcePageUrl: z.string().url(),
    era: z.enum(["historical", "today", "illustration"]),
    yearTaken: z.number().nullable().optional(),
    photographer: z
      .string()
      .nullable()
      .optional()
      .refine(
        (p) => {
          if (!p) return true;
          return !FORBIDDEN_PHOTOGRAPHERS.has(p) && !FORBIDDEN_PHOTOGRAPHER_REGEX.test(p);
        },
        { message: "Photographer is a forbidden placeholder name" },
      ),
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
  })
  .refine(
    (item) => {
      if (item.usageBasis === "open_license") {
        return Boolean(item.license && item.licenseUrl);
      }
      if (item.usageBasis === "coursework_reference") {
        return item.license === null || item.license === undefined;
      }
      return true;
    },
    { message: "License fields must be consistent with usageBasis" },
  );

export const HeritageVideoItemSchema = z.object({
  youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
  title: z.string().trim().min(3).max(200),
  channel: z.string().trim().min(2).max(120),
  channelUrl: z.string().url().nullable().optional(),
  note: z.string().nullable().optional(),
  embedCheckedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const HeritageSiteRecordSchema = z
  .object({
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
  })
  .refine(
    (site) => {
      const covers = site.media.filter((m) => m.isCover);
      if (site.decision === "accepted" && covers.length !== 1) {
        return false;
      }
      return true;
    },
    { message: "Accepted site must have exactly 1 cover image" },
  )
  .refine(
    (site) => {
      const pairGroups = new Map<string, typeof site.media>();
      for (const m of site.media) {
        if (m.pairKey) {
          if (!pairGroups.has(m.pairKey)) pairGroups.set(m.pairKey, []);
          pairGroups.get(m.pairKey)!.push(m);
        }
      }
      for (const items of pairGroups.values()) {
        const hasHist = items.some((i) => i.era === "historical");
        const hasToday = items.some((i) => i.era === "today");
        if (items.length !== 2 || !hasHist || !hasToday) {
          return false;
        }
      }
      return true;
    },
    { message: "Each pairKey group must contain exactly 1 historical and 1 today image" },
  );

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

export const HeritageMediaEvidenceItemSchema = z.object({
  key: z.string().min(1),
  site: z.string().min(1),
  origin: z.enum(["commons", "web"]),
  commons: z
    .object({
      title: z.string(),
      descriptionurl: z.string().url(),
      license: z.string(),
      licenseUrl: z.string().nullable().optional(),
      artist: z.string().nullable().optional(),
      credit: z.string().nullable().optional(),
      originalWidth: z.number().int(),
      originalHeight: z.number().int(),
    })
    .nullable()
    .optional(),
  web: z
    .object({
      pageUrl: z.string().url(),
      imageUrl: z.string().url(),
      credit: z.string(),
      publishedDate: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
  download: z.object({
    url: z.string().url(),
    at: z.string(),
    sha256: z.string().length(64),
    bytes: z.number().int().positive(),
    mime: z.string(),
  }),
  variants: z.record(
    z.string(),
    z.object({
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      bytes: z.number().int().positive(),
      sha256: z.string().length(64),
    }),
  ),
  visualCheck: z.string().min(1),
  searchLog: z.array(z.string()),
});

export const HeritageMediaEvidenceSchema = z.object({
  schemaVersion: z.literal(1),
  items: z.array(HeritageMediaEvidenceItemSchema),
  videos: z.array(
    z.object({
      site: z.string(),
      youtubeId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      oembedTitle: z.string().optional().nullable(),
      authorName: z.string().optional().nullable(),
      authorUrl: z.string().optional().nullable(),
      checkedAt: z.string(),
      verdict: z.enum(["kept", "removed"]),
    }),
  ),
  notFound: z.array(
    z.object({
      site: z.string(),
      queries: z.array(z.string()),
      note: z.string().optional(),
    }),
  ),
});
