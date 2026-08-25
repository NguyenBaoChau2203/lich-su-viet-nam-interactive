import { describe, expect, test } from 'vitest';
import { commandsForHarness, loadToolchain } from '../../scripts/agents/toolchain.mjs';

const approvedIds = ['design-dna', 'motion-design-skill', 'superpowers', 'taste-skill'];

describe('agent toolchain lock', () => {
  test('loads exactly the approved upstreams with pinned SHA revisions', async () => {
    const lock = await loadToolchain(process.cwd());

    expect(lock.schemaVersion).toBe(1);
    expect(lock.upstreams.map((upstream) => upstream.id).sort()).toEqual(approvedIds);

    for (const upstream of lock.upstreams) {
      expect(upstream.revision).toMatch(/^[0-9a-f]{40}$/);
    }
  });

  test.each(['codex', 'antigravity', 'opencode'] as const)(
    'provides deterministic bootstrap guidance for %s',
    async (harness) => {
      const lock = await loadToolchain(process.cwd());
      const first = commandsForHarness(lock, harness);
      const second = commandsForHarness(lock, harness);

      expect(first.length).toBeGreaterThan(0);
      expect(first).toEqual(second);
      expect(first.every((line) => line.trim().length > 0)).toBe(true);
    },
  );

  test('rejects an invalid upstream revision', async () => {
    const lock = await loadToolchain(process.cwd());
    const invalid = structuredClone(lock);
    invalid.upstreams[0]!.revision = 'not-a-sha';

    expect(() => commandsForHarness(invalid, 'codex')).toThrow(
      `Invalid toolchain revision for ${invalid.upstreams[0]!.id}`,
    );
  });
});
