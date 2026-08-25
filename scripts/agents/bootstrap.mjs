import process from 'node:process';
import { commandsForHarness, loadToolchain } from './toolchain.mjs';

function readHarness(argv) {
  const args = argv.filter((arg) => arg !== '--');
  const index = args.indexOf('--harness');
  if (index === -1 || !args[index + 1]) {
    throw new Error('Usage: pnpm agents:bootstrap -- --harness codex|antigravity|opencode');
  }
  return args[index + 1];
}

export async function main(argv = process.argv.slice(2), rootDir = process.cwd()) {
  const harness = readHarness(argv);
  const lock = await loadToolchain(rootDir);
  const guidance = commandsForHarness(lock, harness);

  console.log(`Bootstrap guidance for ${harness}:`);
  for (const line of guidance) {
    console.log(`- ${line}`);
  }
  console.log('No third-party installation command was executed automatically.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
