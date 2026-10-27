import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const work = ".task-reports/local-heroes-remediation/artifact-unit";
const reviewPath = "docs/audits/sources/2026-10-27-local-heroes-remediation-content-review.json";
mkdirSync(work, { recursive: true });
const run = (out: string, review = reviewPath, pkg = "supabase/content/local-heroes/national-v1") =>
  spawnSync(process.execPath, ["scripts/content/prepare-local-heroes-release.mjs", "--out", out, "--review", review, "--package", pkg], { encoding: "utf8", windowsHide: true });

describe("complete national draft artifact", () => {
  it("reproduces all 35 reviewed graphs and 34 localities with stable canonical IDs and rollback-only SQL", () => {
    const a = mkdtempSync(path.join(work, "a-")), b = mkdtempSync(path.join(work, "b-"));
    const first = run(a);
    expect(first.status, first.stderr).toBe(0);
    expect(run(b).status).toBe(0);
    for (const name of ["snapshot.json", "draft-import.sql", "local-promotion-rehearsal.sql", "rollback.sql", "artifact-hashes.json"])
      expect(readFileSync(path.join(a, name)).equals(readFileSync(path.join(b, name))), `${name} must be byte-identical`).toBe(true);
    const snapshot = JSON.parse(readFileSync(path.join(a, "snapshot.json"), "utf8"));
    expect(snapshot.people).toHaveLength(35);
    expect(snapshot.reviewCompletePeople).toBe(35);
    expect(snapshot.representedLocalities).toBe(34);
    expect(snapshot.rows.figure_stories).toHaveLength(35);
    expect(snapshot.rows.figure_media_evidence).toHaveLength(35);
    expect(snapshot.people.every((p: { mode: string }) => p.mode === "reviewed_graph")).toBe(true);
    expect(snapshot.rows.historical_figures.every((p: { workflow_status: string }) => p.workflow_status === "draft")).toBe(true);
    expect(snapshot.people.find((p: { slug: string }) => p.slug === "pham-van-dong").id).toBe("c6eb511d-898f-4fab-8875-42ddd0700cd4");
    expect(snapshot.nationalReleaseReady).toBe(false);
    expect(readFileSync(path.join(a, "draft-import.sql"), "utf8").trim().endsWith("ROLLBACK;")).toBe(true);
  }, 15000);

  it("reproduces the exact preserved v17 artifact instead of applying its acceptance overlay to new bytes", () => {
    const out = mkdtempSync(path.join(work, "v17-"));
    const result = run(out, "docs/audits/sources/2026-10-27-local-heroes-phase-07-content-review.json", "supabase/content/local-heroes/snapshots/v17");
    expect(result.status, result.stderr).toBe(0);
    expect(readFileSync(path.join(out, "snapshot.json"))).toEqual(readFileSync("supabase/content/local-heroes/release-phase-07/snapshot.json"));
  });

  it.each(["missing-fingerprint", "held-image", "unchecked-claim"])("refuses %s before producing any SQL", (caseName) => {
    const directory = mkdtempSync(path.join(work, `${caseName}-`));
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    if (caseName === "missing-fingerprint") review.inputFiles.pop();
    if (caseName === "held-image") review.imageChecks.find((m: { id: string }) => m.id === "media-remediation-huynh-van-nghe").decision = "held";
    if (caseName === "unchecked-claim") review.admittedClaimIds = review.admittedClaimIds.filter((id: string) => id !== "clm-remediation-vo-van-ky-paragraph-3");
    const file = path.join(directory, "review.json"), out = path.join(directory, "out");
    writeFileSync(file, JSON.stringify(review));
    const result = run(out, file);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(caseName === "missing-fingerprint" ? "Acceptance overlay does not match" : "Graph is not admitted");
    expect(existsSync(path.join(out, "draft-import.sql"))).toBe(false);
  });
});
