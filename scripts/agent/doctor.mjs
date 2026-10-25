import { existsSync } from "node:fs";
import { manageIndex } from "./codegraph.mjs";
import { isMain, projectRoot, runTool } from "./runtime.mjs";
import { validateSetup } from "./validate-setup.mjs";

export function assessRuntime(nodeVersion, pnpmVersion) {
  const issues = [];
  if (!/^v24\./.test(nodeVersion ?? "")) issues.push("Node 24.x is required by the repository runtime contract.");
  if (pnpmVersion !== "11.7.0") issues.push("pnpm 11.7.0 is required; use packageManager from package.json.");
  return issues;
}

async function main() {
  console.log("AI agent workspace doctor (local observations; no authentication probes)\n");
  const pnpm = runTool("pnpm", ["--version"]);
  const issues = assessRuntime(process.version, pnpm.status === 0 ? pnpm.stdout.trim() : null);
  const git = runTool("git", ["--version"]);
  if (git.status !== 0) issues.push("Git is required.");
  console.log(`Node: ${process.version}; pnpm: ${pnpm.status === 0 ? pnpm.stdout.trim() : "MISSING"}`);
  console.log(`Git: ${git.status === 0 ? git.stdout.trim() : "MISSING"}`);
  const setup = await validateSetup(projectRoot);
  issues.push(...setup.errors);
  console.log(`Shared contracts: ${setup.errors.length ? "INVALID" : `OK (${setup.skillCount} skills)`}`);
  const hooks = runTool("git", ["config", "--get", "core.hooksPath"]);
  console.log(`Git sync hooks: ${hooks.status === 0 && hooks.stdout.trim() === ".githooks" ? "configured; execution tested separately" : "not configured / custom; run pnpm agent:setup or integrate manually"}`);
  for (const [label, command] of [["Codex", "codex"], ["Antigravity", "agy"], ["Claude Code", "claude"], ["CodeGraph", "codegraph"]]) {
    const result = runTool(command, ["--version"], { timeout: 5000 });
    console.log(`${label}: ${result.status === 0 ? `${result.stdout}${result.stderr}`.trim().split(/\r?\n/)[0] : "OPTIONAL / unavailable"}`);
  }
  const graph = manageIndex("status");
  console.log(`CodeGraph: ${graph.ok ? "OK" : "OPTIONAL / attention"}: ${graph.message}`);
  console.log(`Private Codex config: ${existsSync(new URL("../../.codex/config.toml", import.meta.url)) ? "present (not shared)" : "absent (optional example provided)"}`);
  console.log("Agent hook trust, MCP connections, browser availability and service login must be verified in each app. File presence does not establish activation.");
  for (const issue of issues) console.error(`- ${issue}`);
  console.log("\nNext: pnpm verify; read docs/agent/START-HERE.md for browser smoke and optional tools.");
  process.exitCode = issues.length ? 1 : 0;
}

if (isMain(import.meta.url)) await main();
