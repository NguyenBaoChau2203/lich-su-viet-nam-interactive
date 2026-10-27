import type { Certainty, Workflow, LocalityCode, RelationshipKind } from "./types";

export type EvidenceInput = {
  claimKey: string; sourceId: string; claimText: string; locator: string;
  scopeNote: string; certainty: Certainty; uncertaintyNote: string | null;
};
export type LocalityInput = {
  id: string; localityCode: LocalityCode; kind: RelationshipKind;
  historicalPlaceLabel: string; explanation: string; claimKey: string;
  primarySourceId: string; certainty: Certainty; uncertaintyNote: string | null;
};
export type StoryInput = {
  id: string; slug: string; title: string; summary: string; body: string;
  sortOrder: number; isPrimary: boolean; sources: EvidenceInput[];
};
export type MediaEvidenceInput = {
  mediaId: string; depictionKind: "portrait" | "historical_context";
  decision: "accepted" | "held"; identitySourceId: string; identityLocator: string;
  identityCertainty: Certainty;
  usageBasis: "open_license" | "public_domain" | "permission" | "coursework_reference" | "unknown";
  usageSourceId: string | null; usageLocator: string | null; usageNote: string | null;
  checkedAt: string | null;
};
export type LocalHeroGraphInput = {
  figureId: string | null; expectedRevision: string | null;
  figure: {
    name: string; slug: string; otherNames: string | null; birthYear: number | null;
    deathYear: number | null; biography: string | null; isLocalHero: true;
    contributionSummary: string | null; contributionStartYear: number | null;
    contributionEndYear: number | null; catalogAliases: string[];
  };
  sources: EvidenceInput[]; localities: LocalityInput[];
  stories: StoryInput[]; mediaEvidence: MediaEvidenceInput[];
};
export type SubmitLocalHeroGraphInput = {
  figureId: string; expectedRevision: string; storyIds: string[];
};
export type ReviewLocalHeroGraphInput =
  | { figureId: string; expectedRevision: string; action: "publish" | "hide" }
  | { figureId: string; expectedRevision: string; action: "request_revision"; reason: string }
  | { figureId: string; expectedRevision: string; action: "republish"; storyIds: string[] };
export type RestoreLocalHeroDraftInput = { figureId: string; expectedRevision: string };
export type ReadinessCode =
  | "IDENTITY_SOURCE_REQUIRED" | "CONTRIBUTION_SOURCE_REQUIRED" | "PERIOD_SOURCE_REQUIRED"
  | "PERIOD_OUT_OF_SCOPE" | "DISPLAYED_CLAIM_SOURCE_REQUIRED" | "LOCALITY_REQUIRED"
  | "LOCALITY_MAPPING_REQUIRED" | "PRIMARY_STORY_REQUIRED" | "STORY_SOURCE_REQUIRED"
  | "STORY_LENGTH" | "IMAGE_REQUIRED" | "IMAGE_IDENTITY" | "IMAGE_USAGE"
  | "SOURCE_METADATA" | "UNCERTAINTY_NOTE_REQUIRED" | "INDEPENDENT_SOURCES_REQUIRED"
  | "INTERNAL_NOTE" | "CITATION_MARKER_INVALID";
export type ReadinessIssue = { code: ReadinessCode; path: string; message: string };
export type LocalHeroReadiness = { blocking: ReadinessIssue[]; warnings: ReadinessIssue[] };
export type LocalHeroAdminGraph = Omit<LocalHeroGraphInput, "figureId" | "expectedRevision" | "stories"> & {
  figureId: string; revision: string; workflow: Workflow; reviewNote: string | null;
  stories: (StoryInput & { workflow: Workflow; reviewNote: string | null })[];
  readiness: LocalHeroReadiness;
};
export type LocalHeroMutationResult =
  | { ok: true; data: { figureId: string; slug: string; revision: string;
      workflow: Workflow; readiness: LocalHeroReadiness } }
  | { ok: false; error: {
      code: "INVALID_INPUT" | "UNAUTHENTICATED" | "FORBIDDEN" | "NOT_FOUND" |
        "STALE" | "INVALID_TRANSITION" | "READINESS_FAILED" | "CONFLICT" | "DB_UNAVAILABLE";
      message: string; fieldErrors: Record<string, string[]>;
      readiness: LocalHeroReadiness | null; currentRevision: string | null;
    } };
