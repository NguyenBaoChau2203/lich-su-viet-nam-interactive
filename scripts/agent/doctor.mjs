import { spawnSync } from "node:child_process";
import { accessSync } from "node:fs";
import process from "node:process";

const tools = [
  ["Node.js", "node", ["--version"], true],
  ["pnpm", "pnpm", ["--version"], true],
  ["Git", "git", ["--version"], true],
  ["Codex", "codex", ["--version"], false],
  ["Antigravity launcher", "agy", ["--version"], false],
  ["OpenCode", "opencode", ["--version"], false],
  ["CodeGraph", "codegraph", ["--version"], false],
  ["Chrome DevTools MCP", "chrome-devtools", ["--version"], false],
];

function commandVersion(command, args) {
  const executable = process.platform === "win32" ? "cmd.exe" : command;
  const executableArgs =
    process.platform === "win32"
      ? ["/d", "/s", "/c", [command, ...args].join(" ")]
      : args;
  const result = spawnSync(executable, executableArgs, {
    encoding: "utf8",
    timeout: 10_000,
  });

  if (result.status !== 0) return null;
  return `${result.stdout}${result.stderr}`.trim().split(/\r?\n/)[0];
}

function exists(relativePath) {
  try {
    accessSync(relativePath);
    return true;
  } catch {
    return false;
  }
}

console.log("Agent foundation doctor\n");

let missingRequired = false;
for (const [label, command, args, required] of tools) {
  const version = commandVersion(command, args);
  const status = version ? `OK  ${version}` : required ? "MISSING" : "OPTIONAL / MISSING";
  console.log(`${label.padEnd(24)} ${status}`);
  if (required && !version) missingRequired = true;
}

console.log("");
for (const [label, relativePath] of [
  ["Shared AGENTS.md", "AGENTS.md"],
  ["Project skills", ".agents/skills"],
  ["Codex hook", ".codex/hooks.json"],
  ["Antigravity hook", ".agents/hooks.json"],
  ["OpenCode config", "opencode.json"],
  ["CodeGraph index", ".codegraph"],
]) {
  console.log(`${label.padEnd(24)} ${exists(relativePath) ? "OK" : "MISSING"}`);
}

console.log("\nNext: pnpm agent:check && pnpm verify");
process.exitCode = missingRequired ? 1 : 0;
