import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const work = ".task-reports/local-heroes-live-release-20261027/unit";
mkdirSync(work, { recursive: true });
const baselinePath = "tests/unit/fixtures/local-heroes-live-baseline.json";
const evidencePath = "docs/audits/sources/2026-10-27-local-heroes-live-legacy-evidence.json";
const generate = (out: string, baseline = baselinePath, evidence = evidencePath) => spawnSync(process.execPath,
  ["scripts/content/prepare-local-heroes-live-release.mjs", "--baseline", baseline, "--evidence", evidence, "--out", out],
  { encoding: "utf8", windowsHide: true, timeout: 30000 });
const sha = (bytes: string | Buffer) => createHash("sha256").update(bytes).digest("hex");

describe("authorized live enrollment preparation", () => {
  it("reproduces 35 complete graphs while preserving exact canonical base fields and known legacy media", () => {
    const a = mkdtempSync(path.join(work, "a-")), b = mkdtempSync(path.join(work, "b-"));
    const result = generate(a); expect(result.status, result.stderr).toBe(0); expect(generate(b).status).toBe(0);
    for (const file of ["snapshot.json", "publish.sql", "rollback-content.sql", "artifact-hashes.json"])
      expect(readFileSync(path.join(a, file)).equals(readFileSync(path.join(b, file))), file).toBe(true);
    const snapshot = JSON.parse(readFileSync(path.join(a, "snapshot.json"), "utf8"));
    const before = JSON.parse(readFileSync(baselinePath, "utf8"));
    expect(snapshot.people).toHaveLength(35);
    expect(snapshot.canonicalEnrollments).toHaveLength(3);
    expect(snapshot.representedLocalities).toBe(34);
    expect(snapshot.expectedDatabaseCounts.historical_figures).toBe(41);
    for (const prior of snapshot.canonicalEnrollments) {
      const original = before.figures.find((p: { id: string }) => p.id === prior.id);
      const row = snapshot.rows.historical_figures.find((p: { id: string }) => p.id === prior.id);
      for (const [key, value] of Object.entries(original)) expect(row[key], `${original.slug}.${key}`).toEqual(value);
      for (const key of ["biography", "birth_year", "death_year"])
        expect(snapshot.rows.figure_sources.some((s: { figure_id: string; claim_key: string; claim_text: string }) => s.figure_id === prior.id && s.claim_key === key && s.claim_text === String(original[key]))).toBe(true);
    }
    expect(snapshot.preserved.figureMedia).toEqual(before.figureMedia);
    for (const legacy of before.figureMedia.filter((m: { is_cover: boolean }) => m.is_cover)) {
      const added = snapshot.rows.media_assets.find((m: { figure_id: string }) => m.figure_id === legacy.figure_id);
      if (added) expect(added.is_cover, "The existing unique legacy cover must remain untouched").toBe(false);
    }
    expect(snapshot.rows.historical_figures.every((p: { workflow_status: string }) => p.workflow_status === "published")).toBe(true);
    expect(snapshot.rows.figure_stories.every((p: { workflow_status: string }) => p.workflow_status === "published")).toBe(true);
    const sql = readFileSync(path.join(a, "publish.sql"), "utf8");
    expect(sql).toContain("private.local_hero_assert_graph");
    expect(sql).toContain("BEFORE_IMAGE_CONFLICT");
    expect(sql).toContain("BEFORE_IMAGE_CONFLICT:CATALOG_DRAFT");
    expect(sql).toContain("UNEXPECTED_GRAPH_LINK");
    expect(sql).toContain("SET CONSTRAINTS ALL IMMEDIATE");
    expect(sql.trim().endsWith("COMMIT;")).toBe(true);
    expect(sql).not.toContain("INSERT INTO auth.users");
    expect(sql).not.toContain("DISABLE TRIGGER");
    const rollback = readFileSync(path.join(a, "rollback-content.sql"), "utf8");
    expect(rollback).toContain("ROLLBACK_CONFLICT");
    expect(rollback).toContain("CANONICAL_BASE_PRESERVED");
  }, 15000);

  it("refuses a changed before image rather than broadening legacy enrollment", () => {
    const directory = mkdtempSync(path.join(work, "changed-"));
    const before = JSON.parse(readFileSync(baselinePath, "utf8"));
    before.figures.find((p: { slug: string }) => p.slug === "pham-van-dong").name = "Different identity";
    const baseline = path.join(directory, "baseline.json"); writeFileSync(baseline, JSON.stringify(before));
    const result = generate(path.join(directory, "out"), baseline);
    expect(result.status).not.toBe(0); expect(result.stderr).toContain("BEFORE_IMAGE_MISMATCH");
    expect(existsSync(path.join(directory, "out/publish.sql"))).toBe(false);
  });

  it("rejects a different canonical identity even if its before-image hash is rebound", () => {
    const directory = mkdtempSync(path.join(work, "identity-"));
    const before = JSON.parse(readFileSync(baselinePath, "utf8")), evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    before.figures.find((p: { slug: string }) => p.slug === "le-duan").id = "10000000-0000-4000-8000-000000000001";
    const baseline = path.join(directory, "baseline.json"), file = path.join(directory, "evidence.json");
    writeFileSync(baseline, JSON.stringify(before)); evidence.baselineSha256 = sha(readFileSync(baseline)); writeFileSync(file, JSON.stringify(evidence));
    const result = generate(path.join(directory, "out"), baseline, file);
    expect(result.status).not.toBe(0); expect(result.stderr).toContain("CANONICAL_IDENTITY_CONFLICT");
  });

  it("refuses unsupported preserved life-date/biography claims", () => {
    const directory = mkdtempSync(path.join(work, "evidence-"));
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.entries.find((p: { slug: string }) => p.slug === "le-duan").claims.find((c: { field: string }) => c.field === "death_year").decision = "held";
    const file = path.join(directory, "evidence.json"); writeFileSync(file, JSON.stringify(evidence));
    const result = generate(path.join(directory, "out"), baselinePath, file);
    expect(result.status).not.toBe(0); expect(result.stderr).toContain("LEGACY_EVIDENCE_REQUIRED");
  });

  it("rejects non-NFC supplemental source metadata before preparing any live SQL", () => {
    const directory = mkdtempSync(path.join(work, "nfc-"));
    const evidence = JSON.parse(readFileSync(evidencePath, "utf8"));
    evidence.sourceRecords[0].title = "Cafe\u0301";
    const file = path.join(directory, "evidence.json"); writeFileSync(file, JSON.stringify(evidence));
    const result = generate(path.join(directory, "out"), baselinePath, file);
    expect(result.status).not.toBe(0); expect(result.stderr).toContain("SOURCE_METADATA_INVALID");
    expect(existsSync(path.join(directory, "out/publish.sql"))).toBe(false);
  });
});
