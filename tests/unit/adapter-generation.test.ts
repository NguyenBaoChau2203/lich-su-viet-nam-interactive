import { describe, expect, test } from 'vitest';
import {
  renderAntigravityAgent,
  renderCodexAgent,
  renderOpenCodeAgent,
} from '../../scripts/agents/generate-adapters.mjs';

const roles = [
  'orchestrator',
  'architect',
  'historian-researcher',
  'experience-designer',
  'motion-3d-engineer',
  'data-engineer',
  'reviewer',
] as const;

describe('coding-agent adapter generation', () => {
  for (const id of roles) {
    test(`all renderers point ${id} back to its canonical role file`, () => {
      const role = {
        id,
        description: `${id} test role`,
        canonicalFile: `.agents/roles/${id}.md`,
        readOnly: id === 'reviewer',
      };

      expect(renderAntigravityAgent(role)).toContain(role.canonicalFile);
      expect(renderOpenCodeAgent(role)).toContain(role.canonicalFile);
      expect(renderCodexAgent(role)).toContain(role.canonicalFile);
    });
  }

  test('OpenCode reviewer denies edits', () => {
    const output = renderOpenCodeAgent({
      id: 'reviewer',
      description: 'Review implementation evidence.',
      canonicalFile: '.agents/roles/reviewer.md',
      readOnly: true,
    });

    expect(output).toMatch(/edit:\s*deny/);
    expect(output).toMatch(/write:\s*deny/);
  });

  test('Codex adapter contains the required identity and instructions fields', () => {
    const output = renderCodexAgent({
      id: 'architect',
      description: 'Own architecture boundaries.',
      canonicalFile: '.agents/roles/architect.md',
      readOnly: false,
    });

    expect(output).toMatch(/^name\s*=/m);
    expect(output).toMatch(/^description\s*=/m);
    expect(output).toMatch(/^developer_instructions\s*=/m);
  });

  test('Antigravity adapter has name and description YAML frontmatter', () => {
    const output = renderAntigravityAgent({
      id: 'architect',
      description: 'Own architecture boundaries.',
      canonicalFile: '.agents/roles/architect.md',
      readOnly: false,
    });

    expect(output).toMatch(/^---\nname:\s*architect\ndescription:/);
    expect(output).toContain('\n---\n');
  });
});
