import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { generateReleaseArtifacts } from "@/scripts/content/heritage-sites-release-sql.mjs";

const root = process.cwd();

describe("Heritage Sites Release SQL Generation (Phase 4)", () => {
  const outDir = path.join(root, ".task-reports/heritage-phase-4-test");
  const pkgDir = "supabase/content/heritage-sites/v1";

  it("generates draft mode release artifacts ending in ROLLBACK by default", () => {
    const res = generateReleaseArtifacts({
      pkgDir,
      outDir,
      mode: "draft",
      doCommit: false,
    });

    expect(res.totalAcceptedSites).toBe(64);
    expect(res.enrolledSitesCount).toBe(2);
    expect(res.newSitesCount).toBe(62);
    expect(res.mode).toBe("draft");
    expect(res.commitMode).toBe(false);

    const importSql = readFileSync(path.join(outDir, "import.sql"), "utf8");
    const rollbackSql = readFileSync(path.join(outDir, "rollback.sql"), "utf8");
    const snapshotJson = JSON.parse(readFileSync(path.join(outDir, "snapshot.json"), "utf8"));
    const readme = readFileSync(path.join(outDir, "README.md"), "utf8");

    expect(importSql.trim().endsWith("ROLLBACK;")).toBe(true);
    expect(rollbackSql.trim().endsWith("COMMIT;")).toBe(true);
    expect(snapshotJson.totalAcceptedSites).toBe(64);
    expect(snapshotJson.enrolledBefore).toHaveLength(2);
    expect(readme).toContain("Heritage Sites (HS-1.0) Release Artifact");

    // Idempotency and constraint checks
    expect(importSql).toContain("ON CONFLICT (slug) DO UPDATE");
    expect(importSql).toContain("ON CONFLICT (location_id, sort_order) DO UPDATE");
    if (importSql.includes("public.location_videos")) {
      expect(importSql).toContain("ON CONFLICT (location_id, youtube_id) DO UPDATE");
    }
    expect(importSql).toContain("WHERE NOT EXISTS");

    // Zero fabricated patterns or temporary tables
    expect(importSql).not.toContain("Special:FilePath");
    expect(importSql).not.toContain("/uploads/images/");
    expect(importSql).not.toContain("CREATE TEMP TABLE");
    expect(importSql).not.toContain("hs_sources_temp");
    expect(importSql).toContain("BEGIN;");
    expect(importSql).toContain("pg_advisory_xact_lock");

    // Rollback preserves enrolled locations while clearing heritage columns
    expect(rollbackSql).toContain("UPDATE public.historical_locations SET");
    expect(rollbackSql).toContain("locality_code = NULL");
    expect(rollbackSql).toContain("DELETE FROM public.historical_locations");
  });

  it("generates publish mode release with COMMIT when --commit is specified", () => {
    const res = generateReleaseArtifacts({
      pkgDir,
      outDir,
      mode: "publish",
      doCommit: true,
    });

    expect(res.mode).toBe("publish");
    expect(res.commitMode).toBe(true);

    const importSql = readFileSync(path.join(outDir, "import.sql"), "utf8");
    expect(importSql.trim().endsWith("COMMIT;")).toBe(true);
    expect(importSql).toContain("'published'");
  });
});
