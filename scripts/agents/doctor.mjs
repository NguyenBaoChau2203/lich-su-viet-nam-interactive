import { access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { loadToolchain } from './toolchain.mjs';

function parseVersion(value) {
  const match = String(value).trim().replace(/^v/, '').match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function versionAtLeast(actual, minimum) {
  const left = parseVersion(actual);
  const right = parseVersion(minimum);
  if (!left || !right) return false;
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return true;
    if (left[index] < right[index]) return false;
  }
  return true;
}

async function exists(rootDir, relativePath) {
  try {
    await access(path.join(rootDir, relativePath));
    return true;
  } catch {
    return false;
  }
}

export async function runDoctor(rootDir = process.cwd()) {
  const checks = [];
  checks.push({
    id: 'node',
    level: versionAtLeast(process.version, '24.14.0') ? 'pass' : 'fail',
    message: `Node ${process.version}; required >=24.14.0`,
  });

  const pnpm = spawnSync('pnpm', ['--version'], { encoding: 'utf8' });
  const pnpmVersion = pnpm.status === 0 ? pnpm.stdout.trim() : 'unavailable';
  checks.push({
    id: 'pnpm',
    level: pnpmVersion === '11.7.0' ? 'pass' : 'fail',
    message: `pnpm ${pnpmVersion}; required 11.7.0`,
  });

  try {
    await loadToolchain(rootDir);
    checks.push({ id: 'toolchain-lock', level: 'pass', message: 'Agent toolchain lock is valid.' });
  } catch (error) {
    checks.push({
      id: 'toolchain-lock',
      level: 'fail',
      message: error instanceof Error ? error.message : 'Agent toolchain lock is invalid.',
    });
  }

  for (const relativePath of [
    'AGENTS.md',
    '.agents/skills',
    '.agents/agents',
    '.codex/agents',
    '.opencode/agents',
  ]) {
    checks.push({
      id: relativePath,
      level: (await exists(rootDir, relativePath)) ? 'pass' : 'fail',
      message: `${relativePath} ${(await exists(rootDir, relativePath)) ? 'present' : 'missing'}.`,
    });
  }

  for (const executable of ['codex', 'agy', 'opencode']) {
    const probe = spawnSync(executable, ['--version'], { encoding: 'utf8' });
    checks.push({
      id: `harness:${executable}`,
      level: probe.status === 0 ? 'pass' : 'warn',
      message: probe.status === 0 ? `${executable} detected.` : `${executable} executable not detected.`,
    });
  }

  return checks;
}

export async function main() {
  const checks = await runDoctor();
  for (const check of checks) {
    console.log(`[${check.level.toUpperCase()}] ${check.message}`);
  }
  if (checks.some((check) => check.level === 'fail')) {
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
