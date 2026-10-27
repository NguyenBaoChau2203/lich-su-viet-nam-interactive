import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { loadPackage, validatePackage } from "../../scripts/content/local-heroes-validator.mjs";

type ReviewPackage = {
  manifest: { previousManifestHash: string; manifestHash: string; ownerApproval: { status: string } };
  roster: { records: { personKey: string; decision: string }[] };
  coverage: { publicSnapshot: unknown; records: { status: string; completePersonKeys: string[] }[] };
  people: { records: { slug: string; birthYear: number | null }[] };
};

describe("reviewed national content after Phase 07 remediation", () => {
  it("completes every frozen identity and all 34 localities while retaining the separate exact-hash owner checkpoint", () => {
    const result = validatePackage();
    expect(result.valid, JSON.stringify(result.issues)).toBe(true);
    expect(result.acceptedPeople).toBe(35);
    expect(result.completeAcceptedPeople).toBe(35);
    expect(result.representedLocalities).toBe(34);
    expect(result.releaseReady).toBe(false);
    const current = loadPackage().documents as ReviewPackage;
    const prior = loadPackage("supabase/content/local-heroes/snapshots/v17").documents as ReviewPackage;
    expect(current.manifest.previousManifestHash).toBe(prior.manifest.manifestHash);
    expect(current.manifest.ownerApproval.status).toBe("pending");
    expect(current.roster.records.map((r: { personKey: string; decision: string }) => [r.personKey, r.decision]))
      .toEqual(prior.roster.records.map((r: { personKey: string; decision: string }) => [r.personKey, r.decision]));
    expect(current.coverage.publicSnapshot).toBeNull();
    expect(current.coverage.records.every((r: { status: string; completePersonKeys: string[] }) => r.status === "ready_for_review" && r.completePersonKeys.length > 0)).toBe(true);
    expect(current.people.records.find((p: { slug: string }) => p.slug === "nguyen-thai-hoc")?.birthYear).toBeNull();
    expect(readFileSync("supabase/content/local-heroes/snapshots/v17/manifest.json", "utf8")).toContain("84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb");
  });
});
