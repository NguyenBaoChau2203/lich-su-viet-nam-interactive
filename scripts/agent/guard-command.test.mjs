import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import { classifyCommand, extractCommand } from "./guard-command.mjs";

describe("extractCommand", () => {
  it("supports Codex and Antigravity hook payloads", () => {
    assert.equal(
      extractCommand({ tool_input: { command: "pnpm test" } }),
      "pnpm test",
    );
    assert.equal(
      extractCommand({ tool_args: { CommandLine: "pnpm lint" } }),
      "pnpm lint",
    );
    assert.equal(extractCommand({ tool_input: { cmd: "pnpm verify" } }), "pnpm verify");
    assert.equal(extractCommand({ tool_args: { cmd: "pnpm lint" } }), "pnpm lint");
    assert.equal(extractCommand({ toolCall: { name: "run_command", args: { CommandLine: "pnpm verify" } } }), "pnpm verify");
  });
});

describe("classifyCommand", () => {
  it("allows normal development commands and env templates", () => {
    for (const command of [
      "pnpm verify",
      "git status --short",
      "Get-Content .env.example",
      'rg "git reset --hard" docs',
      "Remove-Item -LiteralPath ./tmp -Recurse -Force",
    ]) {
      assert.deepEqual(classifyCommand(command), { allowed: true });
    }
  });

  it("blocks destructive git and disk commands", () => {
    for (const command of [
      "git reset --hard HEAD~1",
      "git -C . reset --hard HEAD~1",
      "git restore --worktree .",
      "git clean -fd",
      "git checkout -- .",
      "git push origin main --force",
      "rm -rf /",
      "Remove-Item -Recurse -Force C:\\",
      "format C:",
    ]) {
      assert.equal(classifyCommand(command).allowed, false, command);
    }
  });

  it("does not echo a rejected shell command into the transcript", () => {
    const result = classifyCommand("git reset --hard private-command-text");
    assert.equal(result.allowed, false);
    assert.doesNotMatch(result.reason, /private-command-text/);
  });

  it("blocks attempts to read or stage secret files", () => {
    for (const command of [
      "Get-Content .env.local",
      "type .env",
      "git add .env.production",
      "cat credentials.pem",
    ]) {
      assert.equal(classifyCommand(command).allowed, false, command);
    }
  });
});

describe("hook CLI", () => {
  it("runs the configured hook from a nested directory and preserves the blocking exit code", () => {
    const config = JSON.parse(readFileSync(".codex/hooks.json", "utf8"));
    const command = config.hooks.PreToolUse[0].hooks[0].command;
    for (const [cmd, expected] of [["pnpm verify", 0], ["git reset --hard", 2]]) {
      const result = spawnSync(command, { cwd: path.resolve("scripts"), shell: true,
        input: JSON.stringify({ tool_input: { cmd } }), encoding: "utf8", windowsHide: true });
      assert.equal(result.status, expected, result.stderr);
    }
  });
  it("returns exit code 2 and a reason for Codex", () => {
    const result = spawnSync(process.execPath, ["scripts/agent/guard-command.mjs"], {
      cwd: process.cwd(),
      input: JSON.stringify({ tool_input: { command: "git reset --hard" } }),
      encoding: "utf8",
    });

    assert.equal(result.status, 2);
    assert.match(result.stderr, /blocked/i);
  });

  it("returns zero for an allowed Antigravity command", () => {
    const result = spawnSync(process.execPath, ["scripts/agent/guard-command.mjs"], {
      cwd: process.cwd(),
      input: JSON.stringify({ tool_args: { CommandLine: "pnpm test" } }),
      encoding: "utf8",
    });

    assert.equal(result.status, 0);
    assert.equal(result.stderr, "");
  });

  it("returns Antigravity's JSON decision contract for its current camelCase payload", () => {
    for (const [CommandLine, decision] of [["pnpm verify", "allow"], ["git reset --hard", "deny"]]) {
      const result = spawnSync(process.execPath, ["scripts/agent/guard-command.mjs"], {
        input: JSON.stringify({ toolCall: { name: "run_command", args: { CommandLine } } }), encoding: "utf8" });
      assert.equal(result.status, 0);
      assert.equal(JSON.parse(result.stdout).decision, decision);
    }
  });
});
