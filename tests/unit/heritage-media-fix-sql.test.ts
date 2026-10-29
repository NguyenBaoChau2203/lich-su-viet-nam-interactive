import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { generateMediaFixSql } from "@/scripts/content/heritage-media-fix-sql.mjs";

const root = process.cwd();

describe("Heritage Media Fix Corrective SQL Generation (Phase 4)", () => {
  const outDir = path.join(root, ".task-reports/heritage-fix-sql-test");
  const pkgDir = "supabase/content/heritage-sites/v1";
  const beforeFile = "supabase/content/heritage-sites/release-v1-media-fix/before.json";

  it("generates draft corrective SQL ending in ROLLBACK by default", () => {
    const res = generateMediaFixSql({
      package: pkgDir,
      before: beforeFile,
      out: outDir,
      mode: "draft",
      commit: false,
    });

    expect(res.counts.totalSites).toBe(64);
    expect(res.counts.mediaDeleted).toBe(64);
    expect(res.counts.mediaInserted).toBe(64);
    expect(res.counts.videosDeleted).toBe(4);
    expect(res.commitMode).toBe(false);

    const applySql = readFileSync(path.join(outDir, "apply.sql"), "utf8");
    const rollbackSql = readFileSync(path.join(outDir, "rollback.sql"), "utf8");
    const snapshotJson = JSON.parse(readFileSync(path.join(outDir, "snapshot.json"), "utf8"));

    expect(applySql.trim().endsWith("ROLLBACK;")).toBe(true);
    expect(rollbackSql.trim().endsWith("COMMIT;")).toBe(true);

    // Advisory lock & safety assertions
    expect(applySql).toContain("pg_advisory_xact_lock(18012, 3402)");
    expect(applySql).toContain("heritage media drift");
    expect(applySql).toContain("POST_VERIFY_FAIL");

    // Zero fake videos or Special:FilePath in new inserts
    const insertSection = applySql.slice(applySql.indexOf("-- 4. Insert"));
    expect(insertSection).not.toContain("Special:FilePath");
    expect(insertSection).not.toContain("/uploads/images/");
    expect(applySql).not.toContain("CREATE TEMP TABLE");
    expect(applySql).not.toContain("hs_sources_temp");

    // Enrolled sites protection (pre-existing covers not deleted)
    expect(applySql).toContain("dinh-doc-lap");
    expect(applySql).toContain("pac-bo-cao-bang");
  });

  it("generates publish mode corrective SQL ending in COMMIT when --commit is specified", () => {
    const res = generateMediaFixSql({
      package: pkgDir,
      before: beforeFile,
      out: outDir,
      mode: "publish",
      commit: true,
    });

    expect(res.mode).toBe("publish");
    expect(res.commitMode).toBe(true);

    const applySql = readFileSync(path.join(outDir, "apply.sql"), "utf8");
    expect(applySql.trim().endsWith("COMMIT;")).toBe(true);
  });
});
