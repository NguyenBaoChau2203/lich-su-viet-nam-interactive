export type Certainty = "verified" | "approximate" | "disputed" | "editorial";
export type Workflow = "draft" | "pending_review" | "needs_revision" | "published" | "hidden";
export type RelationshipKind = "birthplace" | "home_origin" | "activity" | "commemoration";
export type LocalityCode = "01" | "04" | "08" | "11" | "12" | "14" | "15" | "19" |
  "20" | "22" | "24" | "25" | "31" | "33" | "37" | "38" | "40" | "42" |
  "44" | "46" | "48" | "51" | "52" | "56" | "66" | "68" | "75" | "79" |
  "80" | "82" | "86" | "91" | "92" | "96";
export type LocalityRef = {
  code: LocalityCode; slug: string; officialName: string;
  referenceFramework: "VN-34-2025";
};
export type LocalHeroFilters = { localityCode: LocalityCode | null; query: string; page: number };
export type SourceCitation = {
  sourceId: string; title: string; authorOrg: string | null; publisher: string | null;
  sourceType: "book" | "article" | "official" | "web" | "archive" | "other";
  url: string | null; citation: string; publishedYear: number | null;
  accessedAt: string; locator: string; scopeNote: string;
};
export type PublicClaim = {
  key: string; text: string; certainty: Certainty;
  uncertaintyNote: string | null; sources: SourceCitation[];
};
export type LocalHeroAssociation = {
  id: string; locality: LocalityRef; kind: RelationshipKind;
  historicalPlaceLabel: string; explanation: string; claim: PublicClaim;
  qualifiesForCoverage: boolean;
};
export type LocalHeroImage = {
  id: string; url: string; width: number; height: number; altText: string;
  caption: string; depictionKind: "portrait" | "historical_context";
  era: "historical" | "illustration"; labels: string[];
  photographer: string | null; sourcePageUrl: string;
  license: string | null; licenseUrl: string | null;
  usageBasis: "open_license" | "public_domain" | "permission" | "coursework_reference";
  usageNote: string | null; focalPoint: string | null;
};
export type LocalHeroSummary = {
  id: string; slug: string; name: string; aliases: string[];
  birthYear: number | null; deathYear: number | null;
  birthYearCertainty: Certainty | null; deathYearCertainty: Certainty | null;
  contributionSummary: string; image: LocalHeroImage;
  associations: LocalHeroAssociation[];
};
export type LocalHeroStory = {
  id: string; slug: string; title: string; summary: string; body: string;
  isPrimary: boolean; sortOrder: number; claims: PublicClaim[];
};
export type LocalHeroRelatedEvent = {
  slug: string; title: string; dateText: string; startYear: number;
  relationship: string | null;
};
export type LocalHeroProfile = LocalHeroSummary & {
  biography: string | null; claims: PublicClaim[]; stories: LocalHeroStory[];
  gallery: LocalHeroImage[]; events: LocalHeroRelatedEvent[];
};
export type LocalHeroPage = {
  filters: LocalHeroFilters; pageSize: 12; totalPeople: number; totalPages: number;
  items: LocalHeroSummary[];
  coverage: {
    framework: "VN-34-2025"; totalLocalities: 34; representedLocalities: number;
    byLocality: { code: LocalityCode; eligiblePeople: number }[];
  };
};
export type LocalHeroQueryFailure = {
  code: "DATA_UNAVAILABLE"; message: "Chưa tải được danh sách nhân vật. Vui lòng thử lại.";
  retryable: true;
};
export type LocalHeroPageResponse =
  | { ok: true; data: LocalHeroPage }
  | { ok: false; error: LocalHeroQueryFailure };
export type LocalHeroLoadState =
  | { status: "idle" }
  | { status: "loading"; filters: LocalHeroFilters }
  | { status: "ready"; data: LocalHeroPage }
  | { status: "error"; filters: LocalHeroFilters; error: LocalHeroQueryFailure };
