import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const root = process.cwd();
const work = path.join(root, ".task-reports/local-heroes-phase-07/artifact-unit");
const reviewPath = "docs/audits/sources/2026-10-27-local-heroes-phase-07-content-review.json";
const sha = (bytes: Buffer | string) => createHash("sha256").update(bytes).digest("hex");
mkdirSync(work, { recursive: true });
function generate(out: string, review = reviewPath) {
  return spawnSync(process.execPath, ["scripts/content/prepare-local-heroes-release.mjs", "--out", out, "--review", review, "--package", "supabase/content/local-heroes/snapshots/v17"], {
    cwd: root, encoding: "utf8", windowsHide: true,
  });
}

describe("draft-only local release artifact", () => {
  it("reproduces identical bytes, keeps every selected identity and excludes held graphs from import", () => {
    const a = mkdtempSync(path.join(work, "a-")), b = mkdtempSync(path.join(work, "b-"));
    const first = generate(a);
    expect(first.status, first.stderr).toBe(0);
    expect(generate(b).status).toBe(0);
    expect(generate(a).status).toBe(0);
    for (const name of ["snapshot.json", "draft-import.sql", "local-promotion-rehearsal.sql", "rollback.sql", "artifact-hashes.json"]) {
      expect(sha(readFileSync(path.join(a, name)))).toBe(sha(readFileSync(path.join(b, name))));
    }
    const snapshot = JSON.parse(readFileSync(path.join(a, "snapshot.json"), "utf8"));
    expect(snapshot.people).toHaveLength(35);
    expect(new Set(snapshot.people.map((p: { id: string }) => p.id)).size).toBe(35);
    expect(snapshot.people.find((p: { slug: string }) => p.slug === "van-tien-dung").id).toBe("c0bcb4b3-9a6a-4f02-aae5-2d38dbc3c15a");
    expect(snapshot.rows.historical_figures.every((p: { workflow_status: string }) => p.workflow_status === "draft")).toBe(true);
    expect(snapshot.rows.figure_stories).toHaveLength(2);
    expect(snapshot.rows.figure_media_evidence).toHaveLength(2);
    expect(snapshot.rows.media_assets.some((m: { file_url: string }) => m.file_url.includes("1839.4.jpg"))).toBe(false);
    expect(snapshot.nationalReleaseReady).toBe(false);
    expect(snapshot.reviewCompletePeople).toBe(2);
    const sql = readFileSync(path.join(a, "draft-import.sql"), "utf8");
    expect(sql).toContain("ON CONFLICT DO NOTHING");
    expect(sql).toContain("IDENTITY_OR_CONTENT_CONFLICT");
    expect(sql.trim().endsWith("ROLLBACK;")).toBe(true);
    expect(readFileSync(path.join(a, "local-promotion-rehearsal.sql"), "utf8").trim().endsWith("ROLLBACK;")).toBe(true);
  });

  it("rejects a stale acceptance overlay before writing any artifact", () => {
    const directory = mkdtempSync(path.join(work, "stale-"));
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    review.inputManifestHash = "0".repeat(64);
    const file = path.join(directory, "review.json");
    writeFileSync(file, JSON.stringify(review));
    const result = generate(path.join(directory, "out"), file);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Acceptance overlay does not match the input manifest");
  });

  it("rejects an attempt to admit an unchecked graph or a held image", () => {
    const directory = mkdtempSync(path.join(work, "held-"));
    const review = JSON.parse(readFileSync(reviewPath, "utf8"));
    review.people.find((p: { personKey: string }) => p.personKey === "new:huynh-van-nghe").acceptance = "complete_for_local_rehearsal";
    const file = path.join(directory, "review.json");
    writeFileSync(file, JSON.stringify(review));
    const result = generate(path.join(directory, "out"), file);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Graph is not admitted by the source/story/media acceptance decisions");
  });
});
