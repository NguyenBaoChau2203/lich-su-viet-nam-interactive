import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { validateSetup } from "./validate-setup.mjs";

describe("agent setup", () => {
  it("has valid shared instructions, skills, and harness adapters", async () => {
    const result = await validateSetup(process.cwd());

    assert.deepEqual(result.errors, []);
    assert.ok(result.skillCount >= 5);
  });

  it("allows additional installed project skills while retaining the required core", async (t) => {
    const root = await mkdtemp(path.join(tmpdir(), "history-agent-setup-"));
    t.after(() => rm(root, { recursive: true, force: true }));

    const files = new Map([
      [
        "AGENTS.md",
        "pnpm verify\nCODEGRAPH_START\ndocs/agent/AI-AGENT-PROMPT-STANDARD.md\n",
      ],
      [".agents/rules/project.md", "# Rules\n"],
      [".agents/hooks.json", "{}\n"],
      [".codex/hooks.json", "{}\n"],
      ["opencode.json", "{}\n"],
      [".env.example", "EXAMPLE_ONLY=1\n"],
      [".github/workflows/ci.yml", "name: test\n"],
      ["docs/agent/START-HERE.md", "# Start\n"],
      [
        "docs/agent/AI-AGENT-PROMPT-STANDARD.md",
        "# AI Agent Prompt Writing Standard\n\n## 4. Required prompt structure\n\n## 10. Prompt review checklist\n",
      ],
      ["docs/agent/AI-AGENT-PROMPT-TEMPLATE.md", "# Template\n"],
      ["docs/product/MVP-SCOPE.md", "# Scope\n"],
      ["scripts/agent/guard-command.mjs", "export {};\n"],
    ]);

    for (const [relativePath, content] of files) {
      const fullPath = path.join(root, relativePath);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, content, "utf8");
    }

    const skills = [
      "build-map-timeline-slice",
      "design-history-story",
      "model-supabase-history",
      "research-history-sources",
      "verify-release-slice",
      "extra-installed-tool",
    ];

    for (const skillName of skills) {
      const skillRoot = path.join(root, ".agents", "skills", skillName);
      await mkdir(path.join(skillRoot, "agents"), { recursive: true });
      await writeFile(
        path.join(skillRoot, "SKILL.md"),
        `---\nname: ${skillName}\ndescription: Test skill\n---\n`,
        "utf8",
      );
      await writeFile(
        path.join(skillRoot, "agents", "openai.yaml"),
        "name: test\n",
        "utf8",
      );
    }

    const result = await validateSetup(root);

    assert.deepEqual(result.errors, []);
    assert.equal(result.skillCount, 6);
  });
});
