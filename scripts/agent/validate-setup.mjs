import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const requiredFiles = [
  "AGENTS.md",
  ".agents/rules/project.md",
  ".agents/hooks.json",
  ".codex/hooks.json",
  "opencode.json",
  ".env.example",
  ".github/workflows/ci.yml",
  "docs/agent/START-HERE.md",
  "docs/agent/AI-AGENT-PROMPT-STANDARD.md",
  "docs/agent/AI-AGENT-PROMPT-TEMPLATE.md",
  "docs/product/MVP-SCOPE.md",
  "scripts/agent/guard-command.mjs",
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

export async function validateSetup(root) {
  const errors = [];

  for (const relativePath of requiredFiles) {
    if (!(await exists(path.join(root, relativePath)))) {
      errors.push(`Missing required file: ${relativePath}`);
    }
  }

  for (const relativePath of [
    ".agents/hooks.json",
    ".codex/hooks.json",
    "opencode.json",
  ]) {
    try {
      JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
    } catch (error) {
      errors.push(`Invalid JSON in ${relativePath}: ${error.message}`);
    }
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
  const result = await validateSetup(process.cwd());
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
