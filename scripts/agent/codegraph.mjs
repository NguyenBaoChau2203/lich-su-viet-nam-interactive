import { existsSync } from "node:fs";
import path from "node:path";
import { isMain, projectRoot, runTool } from "./runtime.mjs";

export function assessIndex(status, root) {
  if (!status?.initialized) return ["No local index. Run pnpm agent:index if you want CodeGraph."];
  const issues = [];
  if (!status.projectPath || path.resolve(status.projectPath) !== path.resolve(root) || status.worktreeMismatch)
    issues.push("Index belongs to a different checkout/worktree; rebuild in this checkout.");
  if (["added", "modified", "removed"].some(key => status.pendingChanges?.[key] !== 0))
    issues.push("Source changes are pending. Run pnpm agent:sync.");
  if (status.index?.state !== "complete") issues.push("Index is incomplete; run pnpm agent:index.");
  if (status.index?.pendingRefs !== 0) issues.push("References are unresolved; run pnpm agent:sync.");
  if (status.index?.reindexRecommended !== false) issues.push("Extraction version needs a rebuild; run pnpm agent:index.");
  return issues;
}

export function manageIndex(action, { root = projectRoot, run = runTool,
  hasIndex = () => existsSync(path.join(root, ".codegraph", "codegraph.db")) } = {}) {
  if (!["status", "sync", "rebuild"].includes(action)) return { ok: false, message: "Use status, sync or rebuild." };
  if (action !== "rebuild" && !hasIndex()) return { ok: false, message: "No local CodeGraph database. Optional setup: pnpm agent:index." };
  if (action !== "status") {
    const args = action === "rebuild" ? (hasIndex() ? ["index", "--quiet", "."] : ["init", "--yes", "."]) : ["sync", "."];
    const result = run("codegraph", args, { cwd: root, timeout: 180_000 });
    if (result.status !== 0) return { ok: false, message: "CodeGraph update failed or CLI is missing. Check locks and CLI installation; see docs/agent/CODEGRAPH.md." };
  }
  const result = run("codegraph", ["status", "--json", "."], { cwd: root });
  if (result.status !== 0) return { ok: false, message: "CodeGraph status failed or CLI is missing. See docs/agent/CODEGRAPH.md." };
  try {
    const status = JSON.parse(result.stdout);
    const issues = assessIndex(status, root);
    return { ok: issues.length === 0, status, message: issues.length ? issues.join("\n") :
      `CodeGraph complete: ${status.fileCount} supported source files, no pending changes. This does not check documents, chat memory or live databases.` };
  } catch {
    return { ok: false, message: "CodeGraph returned invalid status JSON; index health is unknown." };
  }
}

if (isMain(import.meta.url)) {
  const result = manageIndex(process.argv[2] ?? "status");
  console[result.ok ? "log" : "warn"](result.message);
  process.exitCode = result.ok || process.argv.includes("--optional") ? 0 : 1;
}
