import { readFile } from 'node:fs/promises';
import path from 'node:path';

const REVISION_PATTERN = /^[0-9a-f]{40}$/;
const REPOSITORY_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const SUPPORTED_HARNESSES = new Set(['codex', 'antigravity', 'opencode']);

function assertToolchain(lock) {
  if (!lock || typeof lock !== 'object' || lock.schemaVersion !== 1) {
    throw new Error('Unsupported agent toolchain schema');
  }

  if (!Array.isArray(lock.upstreams)) {
    throw new Error('Agent toolchain upstreams must be an array');
  }

  const ids = new Set();
  for (const upstream of lock.upstreams) {
    if (!upstream || typeof upstream !== 'object' || typeof upstream.id !== 'string') {
      throw new Error('Invalid agent toolchain upstream');
    }
    if (ids.has(upstream.id)) {
      throw new Error(`Duplicate toolchain upstream id: ${upstream.id}`);
    }
    ids.add(upstream.id);

    if (!REPOSITORY_PATTERN.test(upstream.repository ?? '')) {
      throw new Error(`Invalid toolchain repository for ${upstream.id}`);
    }
    if (!REVISION_PATTERN.test(upstream.revision ?? '')) {
      throw new Error(`Invalid toolchain revision for ${upstream.id}`);
    }
  }

  return lock;
}

export async function loadToolchain(rootDir) {
  const lockPath = path.join(rootDir, 'agent-toolchain.lock.json');
  const content = await readFile(lockPath, 'utf8');
  return assertToolchain(JSON.parse(content));
}

export function commandsForHarness(lock, harness) {
  const validated = assertToolchain(lock);
  if (!SUPPORTED_HARNESSES.has(harness)) {
    throw new Error(`Unsupported coding harness: ${harness}`);
  }

  const superpowers = validated.upstreams.find((upstream) => upstream.id === 'superpowers');
  if (!superpowers) {
    throw new Error('Missing approved superpowers upstream');
  }

  if (harness === 'codex') {
    return [
      'Open /plugins in Codex.',
      'Search for Superpowers and install the official plugin.',
      `Approved Superpowers baseline: ${superpowers.revision}.`,
      'Run pnpm agents:doctor after installation.',
    ];
  }

  if (harness === 'antigravity') {
    return [
      'agy plugin install https://github.com/obra/superpowers',
      `Approved Superpowers baseline remains pinned in agent-toolchain.lock.json at ${superpowers.revision}.`,
      'Run pnpm agents:doctor after installation.',
    ];
  }

  return [
    'OpenCode uses the project-local opencode.json Superpowers git package specification.',
    `Approved Superpowers baseline: ${superpowers.revision}.`,
    'Restart OpenCode after its plugin install resolves, then run pnpm agents:doctor.',
  ];
}
