import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

function quoted(value) {
  return JSON.stringify(String(value));
}

function canonicalInstruction(role) {
  return `Read ${role.canonicalFile} before acting. Treat that file as the canonical role contract and follow root AGENTS.md plus approved specs/plans.`;
}

export function renderAntigravityAgent(role) {
  return `---\nname: ${role.id}\ndescription: ${quoted(role.description)}\n---\n\n${canonicalInstruction(role)}\n`;
}

export function renderOpenCodeAgent(role) {
  const permission = role.readOnly
    ? `\npermissions:\n  - action: edit\n    resource: "*"\n    effect: deny`
    : '';
  return `---\ndescription: ${quoted(role.description)}\nmode: subagent${permission}\n---\n\n${canonicalInstruction(role)}\n`;
}

export function renderCodexAgent(role) {
  return `name = ${quoted(role.id)}\ndescription = ${quoted(role.description)}\ndeveloper_instructions = ${quoted(canonicalInstruction(role))}\n`;
}

async function writeAdapter(rootDir, relativePath, content) {
  const target = path.join(rootDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, 'utf8');
}

export async function generateAdapters(rootDir = process.cwd()) {
  const registryPath = path.join(rootDir, '.agents/roles/registry.json');
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  if (registry.schemaVersion !== 1 || !Array.isArray(registry.roles)) {
    throw new Error('Invalid role registry');
  }

  for (const role of registry.roles) {
    await writeAdapter(
      rootDir,
      `.agents/agents/${role.id}/agent.md`,
      renderAntigravityAgent(role),
    );
    await writeAdapter(rootDir, `.opencode/agents/${role.id}.md`, renderOpenCodeAgent(role));
    await writeAdapter(rootDir, `.codex/agents/${role.id}.toml`, renderCodexAgent(role));
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateAdapters().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
