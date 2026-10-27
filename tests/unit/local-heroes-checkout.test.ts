import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";

it("preserves audited SQL bytes when Git checks out with Windows newline conversion enabled", () => {
  mkdirSync(".task-reports", { recursive: true });
  const directory = mkdtempSync(path.resolve(".task-reports/local-heroes-checkout-"));
  const git = (...args: string[]) => execFileSync("git", ["-C", directory, ...args], { stdio: "pipe", windowsHide: true });
  const files = [
    "supabase/content/local-heroes/live-release-20261027-v5/publish.sql",
    "supabase/migrations/20261031000001_local_hero_catalog.sql",
    "supabase/releases/local-heroes-20261027/supabase/migrations/20261027000000_system_public_baseline.sql",
  ];
  const hash = (file: string) => createHash("sha256").update(readFileSync(file)).digest("hex");
  try {
    git("init", "--quiet");
    git("config", "core.autocrlf", "true");
    copyFileSync(".gitattributes", path.join(directory, ".gitattributes"));
    for (const file of files) {
      mkdirSync(path.dirname(path.join(directory, file)), { recursive: true });
      copyFileSync(file, path.join(directory, file));
    }
    git("add", "--", ".gitattributes", ...files);
    for (const file of files) rmSync(path.join(directory, file));
    git("checkout-index", "--all");
    for (const file of files) expect(hash(path.join(directory, file)), file).toBe(hash(file));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 15000);
