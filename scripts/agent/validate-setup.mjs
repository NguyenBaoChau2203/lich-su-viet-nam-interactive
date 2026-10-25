import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { projectRoot } from "./runtime.mjs";

const requiredFiles = [
  "AGENTS.md",
  ".agents/rules/project.md",
  ".agents/hooks.json",
  ".codex/hooks.json",
  "CLAUDE.md",
  ".claude/settings.json",
  "opencode.json",
  ".env.example",
  ".github/workflows/ci.yml",
  "docs/agent/START-HERE.md",
  "docs/agent/AI-AGENT-PROMPT-STANDARD.md",
  "docs/agent/AI-AGENT-PROMPT-TEMPLATE.md",
  "docs/product/MVP-SCOPE.md",
  "scripts/agent/guard-command.mjs",
  "scripts/agent/codegraph.mjs",
  "scripts/agent/runtime.mjs",
  "scripts/agent/setup.mjs",
  ".codex/config.example.toml",
  ".node-version",
  "codegraph.json",
  "docs/agent/CODEGRAPH.md",
  "docs/agent/CURRENT-STATE.md",
  ".githooks/post-checkout",
  ".githooks/post-merge",
  ".githooks/post-commit",
];

const requiredSkills = [
  "build-map-timeline-slice",
  "design-history-story",
  "model-supabase-history",
  "research-history-sources",
  "verify-release-slice",
];

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  return Object.fromEntries(
    match[1]
      .split(/\r?\n/)
      .map((line) => line.match(/^([a-z]+):\s*(.+)$/))
      .filter(Boolean)
      .map((parts) => [parts[1], parts[2]]),
  );
}

const array = value => Array.isArray(value) ? value : [];

export async function validateSetup(root) {
  const errors = [];

  for (const relativePath of requiredFiles) {
    if (!(await exists(path.join(root, relativePath)))) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  const configs = {};
  for (const relativePath of [
    ".agents/hooks.json",
    ".codex/hooks.json",
    ".claude/settings.json",
    "opencode.json",
    "codegraph.json",
    "package.json",
  ]) {
    try {
      configs[relativePath] = JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
    } catch (error) {
      errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    }
  }

  const codexEntry = array(configs[".codex/hooks.json"]?.hooks?.PreToolUse).find(entry => {
    try { return entry && new RegExp(entry.matcher).test("Bash"); } catch { return false; }
  });
  const codexGuard = array(codexEntry?.hooks).find(hook => hook?.type === "command" &&
    typeof hook.command === "string" && hook.command.includes("scripts/agent/guard-command.mjs"));
  if (!codexGuard || !Number.isInteger(codexGuard.timeout) || !(codexGuard.timeout > 0 && codexGuard.timeout <= 30))
    errors.push("Codex PreToolUse must invoke the command guard with a bounded timeout.");
  const agentHooks = configs[".agents/hooks.json"]?.["history-command-guard"];
  if (agentHooks?.enabled !== true || !array(agentHooks?.PreToolUse).some(hook =>
    hook?.matcher === "run_command" && array(hook.hooks).some(handler => handler?.type === "command" && handler.command === codexGuard?.command)))
    errors.push("The Antigravity hook adapter must retain the shared command guard (runtime support requires local verification).");
  if (!array(configs[".claude/settings.json"]?.hooks?.PreToolUse).some(entry =>
    entry?.matcher === "^Bash$" && array(entry.hooks).some(hook => hook?.command && hook.command === codexGuard?.command)))
    errors.push("Claude Code PreToolUse must invoke the shared command guard.");
  if (await exists(path.join(root, "CLAUDE.md"))) {
    if (!(await readFile(path.join(root, "CLAUDE.md"), "utf8")).includes("@AGENTS.md"))
      errors.push("CLAUDE.md must import the canonical AGENTS.md instructions.");
  }
  if (await exists(path.join(root, ".agents/rules/project.md"))) {
    if (parseFrontmatter(await readFile(path.join(root, ".agents/rules/project.md"), "utf8")).trigger !== "always_on")
      errors.push("Antigravity project rule must declare trigger: always_on.");
  }

  const pkg = configs["package.json"];
  for (const name of ["agent:setup", "agent:check", "agent:doctor", "agent:status", "agent:sync", "agent:index"]) {
    const script = pkg?.scripts?.[name];
    const entrypoint = typeof script === "string" ? script.match(/^node (scripts\/agent\/[a-z-]+\.mjs)(?:\s|$)/)?.[1] : null;
    if (!entrypoint || !(await exists(path.join(root, entrypoint)))) errors.push(`Invalid or missing entrypoint for ${name}.`);
  }
  if (pkg?.packageManager !== "pnpm@11.7.0" || pkg?.engines?.node !== ">=24 <25")
    errors.push("Use the shared Node 24 and pnpm 11.7.0 runtime contract.");
  for (const pattern of ["outputs/", "output/", ".task-reports/"]) {
    if (!array(configs["codegraph.json"]?.exclude).includes(pattern)) errors.push(`CodeGraph must exclude local artifacts: ${pattern}`);
  }
  const portablePath = path.join(root, ".codex/config.example.toml");
  if (await exists(portablePath)) {
    const template = await readFile(portablePath, "utf8");
    if (/["'](?:[a-z]:[\\/]|\/(?:Users|home|mnt|opt)\/)/i.test(template))
      errors.push("Portable MCP example must not contain machine-specific absolute paths.");
  }
  if (await exists(path.join(root, ".gitignore"))) {
    const ignored = await readFile(path.join(root, ".gitignore"), "utf8");
    for (const pattern of ["/.codex/config.toml", "/.task-reports/"])
      if (!ignored.split(/\r?\n/).includes(pattern)) errors.push(`Shared .gitignore must protect ${pattern}.`);
  }

  const agentsPath = path.join(root, "AGENTS.md");
  if (await exists(agentsPath)) {
    const instructions = await readFile(agentsPath, "utf8");
    if (!instructions.includes("pnpm verify")) {
      errors.push("AGENTS.md must define the pnpm verify quality gate.");
    }
    if (!instructions.includes("CODEGRAPH_START")) {
      errors.push("AGENTS.md must retain the CodeGraph instruction block.");
    }
    if (!instructions.includes("AI-AGENT-PROMPT-STANDARD.md")) {
      errors.push("AGENTS.md must reference the AI agent prompt writing standard.");
    }
    if (!instructions.includes("## Single-agent execution")) errors.push("AGENTS.md must preserve the owner's single-agent execution policy.");
  }

  const promptStandardPath = path.join(
    root,
    "docs",
    "agent",
    "AI-AGENT-PROMPT-STANDARD.md",
  );
  if (await exists(promptStandardPath)) {
    const standard = await readFile(promptStandardPath, "utf8");
    for (const requiredSection of [
      "# AI Agent Prompt Writing Standard",
      "## 4. Required prompt structure",
      "## 10. Prompt review checklist",
    ]) {
      if (!standard.includes(requiredSection)) {
        errors.push(`Prompt standard is missing required section: ${requiredSection}`);
      }
    }
  }

  const skillsRoot = path.join(root, ".agents", "skills");
  let skillDirectories = [];
  try {
    skillDirectories = (await readdir(skillsRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();
  } catch (error) {
    errors.push(`Cannot read .agents/skills: ${error.message}`);
  }

  const missingSkills = requiredSkills.filter(
    (skillName) => !skillDirectories.includes(skillName),
  );
  if (missingSkills.length > 0) {
    errors.push(
      `Missing required project skills: ${missingSkills.join(", ")}. Found: ${skillDirectories.join(", ") || "none"}.`,
    );
  }

  for (const skillName of skillDirectories) {
    const skillFile = path.join(skillsRoot, skillName, "SKILL.md");
    if (!(await exists(skillFile))) {
      errors.push(`Missing SKILL.md for ${skillName}.`);
      continue;
    }

    const markdown = await readFile(skillFile, "utf8");
    if (requiredSkills.includes(skillName)) {
      const adapterPath = path.join(root, ".claude/skills", skillName, "SKILL.md");
      if (!(await exists(adapterPath)) || !(await readFile(adapterPath, "utf8")).includes(`.agents/skills/${skillName}/SKILL.md`))
        errors.push(`Missing Claude skill adapter for ${skillName}.`);
    }
    for (const match of markdown.matchAll(/`((?:docs\/[^`]+|AGENTS)\.(?:md|mjs))`/g)) {
      if (!(await exists(path.join(root, match[1])))) errors.push(`Broken local reference in ${skillName}: ${match[1]}`);
    }
    const frontmatter = parseFrontmatter(markdown);
    if (frontmatter.name !== skillName) {
      errors.push(`Skill name does not match its directory: ${skillName}.`);
    }
    if (!frontmatter.description || frontmatter.description.length > 1024) {
      errors.push(`Skill description is missing or too long: ${skillName}.`);
    }
    if (markdown.includes("TODO")) {
      errors.push(`Skill still contains TODO text: ${skillName}.`);
    }
    if (
      !(await exists(path.join(skillsRoot, skillName, "agents", "openai.yaml")))
    ) {
      errors.push(`Missing agents/openai.yaml for ${skillName}.`);
    }
  }

  return { errors, skillCount: skillDirectories.length };
}

async function main() {
  const result = await validateSetup(projectRoot);
  if (result.errors.length) {
    for (const error of result.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Agent setup valid (${result.skillCount} project skills).`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
