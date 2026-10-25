import { chmod, readdir } from "node:fs/promises";
import path from "node:path";
import { isMain, projectRoot, runTool } from "./runtime.mjs";

export async function setupHooks(root = projectRoot) {
  const git = (...args) => runTool("git", args, { cwd: root });
  const tree = git("rev-parse", "--show-toplevel");
  if (tree.status !== 0 || path.resolve(tree.stdout.trim()) !== path.resolve(root))
    return { ok: false, message: "Run setup in a complete Git checkout of this repository." };
  const configured = git("config", "--get", "core.hooksPath");
  if (configured.status !== 0 && configured.status !== 1)
    return { ok: false, message: "Cannot inspect Git hook configuration; no changes made." };
  if (configured.status === 0 && configured.stdout.trim() !== ".githooks")
    return { ok: false, message: "Existing custom core.hooksPath preserved. See docs/agent/START-HERE.md for manual integration." };
  if (configured.status === 1) {
    const hookPath = git("rev-parse", "--git-path", "hooks");
    if (hookPath.status !== 0) return { ok: false, message: "Cannot locate Git hooks; no changes made." };
    try {
      const entries = await readdir(path.resolve(root, hookPath.stdout.trim()));
      if (entries.some(name => !name.endsWith(".sample")))
        return { ok: false, message: "Existing Git hook scripts preserved. See docs/agent/START-HERE.md for manual integration." };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  // Validate/chmod all shipped hooks before changing Git's effective directory.
  for (const hook of ["post-commit", "post-checkout", "post-merge"])
    await chmod(path.join(root, ".githooks", hook), 0o755);
  const result = git("config", "--local", "core.hooksPath", ".githooks");
  return { ok: result.status === 0, message: result.status === 0 ?
    "Local Git sync hooks enabled (.githooks). Optional CodeGraph: pnpm agent:index. Next: pnpm agent:doctor." : "Could not configure local Git hooks." };
}

if (isMain(import.meta.url)) {
  try {
    const result = await setupHooks();
    console[result.ok ? "log" : "error"](result.message);
    process.exitCode = result.ok ? 0 : 1;
  } catch {
    console.error("Hook setup failed; inspect the checkout and docs/agent/START-HERE.md.");
    process.exitCode = 1;
  }
}
