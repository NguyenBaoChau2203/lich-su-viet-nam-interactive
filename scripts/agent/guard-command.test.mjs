import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
});
