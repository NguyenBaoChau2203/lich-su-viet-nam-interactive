import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { projectRoot } from "./runtime.mjs";
import { validateSetup } from "./validate-setup.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "history-agent-setup-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const file of ["AGENTS.md", "CLAUDE.md", ".claude", ".agents", ".codex/hooks.json", ".githooks", ".gitattributes",
    ".gitignore", ".env.example", "opencode.json", "package.json", ".github/workflows/ci.yml",
    "scripts/agent", "docs/agent", "docs/product", "codegraph.json", ".node-version", ".codex/config.example.toml"]) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await cp(path.join(projectRoot, file), path.join(root, file), { recursive: true });
  }
  await cp(path.join(projectRoot, "docs/superpowers/specs"), path.join(root, "docs/superpowers/specs"), { recursive: true });
  return root;
}

describe("agent setup", () => {
  it("has valid shared instructions, skills, and harness adapters", async () => {
    const result = await validateSetup(projectRoot);
    assert.deepEqual(result.errors, []);
    assert.ok(result.skillCount >= 5);
  });

  it("allows an additional skill with valid local references", async (t) => {
    const root = await fixture(t);
    const skill = path.join(root, ".agents/skills/extra-installed-tool");
    await mkdir(path.join(skill, "agents"), { recursive: true });
    await writeFile(path.join(skill, "SKILL.md"), "---\nname: extra-installed-tool\ndescription: Use when checking fixtures.\n---\nRead `AGENTS.md`.\n");
    await writeFile(path.join(skill, "agents/openai.yaml"), 'interface:\n  display_name: "Extra tool"\n');
    const result = await validateSetup(root);
    assert.deepEqual(result.errors, []);
    assert.equal(result.skillCount, 6);
  });

  it("rejects empty hook configuration instead of calling it healthy", async (t) => {
    const root = await fixture(t);
    await writeFile(path.join(root, ".codex/hooks.json"), '{"hooks":{"PreToolUse":[]}}');
    assert.match((await validateSetup(root)).errors.join("\n"), /PreToolUse|guard/);
  });

  it("reports valid JSON with invalid value types instead of crashing the checker", async (t) => {
    const root = await fixture(t);
    await writeFile(path.join(root, ".codex/hooks.json"), '{"hooks":{"PreToolUse":{}}}');
    await writeFile(path.join(root, "codegraph.json"), '{"exclude":7}');
    const errors = (await validateSetup(root)).errors.join("\n");
    assert.match(errors, /guard/);
    assert.match(errors, /CodeGraph/);
  });

  it("rejects Antigravity's old flat hook schema and rules without an activation trigger", async (t) => {
    const root = await fixture(t);
    await writeFile(path.join(root, ".agents/hooks.json"), '{"enabled":true,"PreToolUse":[]}');
    await writeFile(path.join(root, ".agents/rules/project.md"), "# No activation metadata\n");
    const errors = (await validateSetup(root)).errors.join("\n");
    assert.match(errors, /Antigravity hook/);
    assert.match(errors, /trigger/);
  });

  it("rejects missing hook scripts and broken skill reference paths", async (t) => {
    const root = await fixture(t);
    await rm(path.join(root, "scripts/agent/guard-command.mjs"));
    const file = path.join(root, ".agents/skills/design-history-story/SKILL.md");
    await writeFile(file, (await readFile(file, "utf8")) + "\nRead `docs/product/missing-scope.md`.\n");
    const errors = (await validateSetup(root)).errors.join("\n");
    assert.match(errors, /guard-command/);
    assert.match(errors, /missing-scope/);
  });

  it("rejects machine-specific paths in the portable MCP example", async (t) => {
    const root = await fixture(t);
    await writeFile(path.join(root, ".codex/config.example.toml"), 'command = "C:/Users/someone/node.exe"\n');
    assert.match((await validateSetup(root)).errors.join("\n"), /portable|machine|absolute/i);
  });

  it("rejects package scripts that point to nonexistent entrypoints", async (t) => {
    const root = await fixture(t);
    const file = path.join(root, "package.json");
    const pkg = JSON.parse(await readFile(file, "utf8"));
    pkg.scripts["agent:sync"] = "node scripts/agent/missing-sync.mjs";
    await writeFile(file, JSON.stringify(pkg));
    assert.match((await validateSetup(root)).errors.join("\n"), /missing-sync|agent:sync/);
  });
});
