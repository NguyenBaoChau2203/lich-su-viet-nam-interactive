# Agent-ready MVP foundation implementation plan

> **Execution mode:** Implemented in the current session on `codex/agent-ready-foundation`. The owner asked for the repository to be ready for work the next morning.

**Goal:** Create a small, verified application foundation and a portable agent operating layer for Codex, Antigravity, and OpenCode.

**Architecture:** A Next.js App Router shell provides the executable baseline. `AGENTS.md` is the canonical contract, `.agents/skills` contains portable domain workflows, and harness files only bridge their native plugin/hook systems to that contract.

**Tech stack:** Node.js 24, pnpm 11, Next.js, React, TypeScript, Tailwind CSS, ESLint, Vitest, Testing Library, Playwright, GitHub Actions.

---

### Task 1: Buildable application shell

**Files:** `package.json`, `pnpm-lock.yaml`, `src/app/**`, root tool configs, tests

1. Create a minimal Next.js TypeScript App Router project.
2. Add a Vietnamese neutral landing page that describes the MVP without implementing product features.
3. Add a unit test and a browser smoke test.
4. Add `lint`, `typecheck`, `test`, `test:e2e`, `build`, and `verify` scripts.
5. Run the baseline checks.

### Task 2: Canonical agent contract and project skills

**Files:** `AGENTS.md`, `.agents/rules/project.md`, `.agents/skills/**`

1. Write the concise project contract from the approved scope.
2. Initialize each skill with the official skill-creator script.
3. Replace templates with short imperative workflows and UI metadata.
4. Validate every skill with `quick_validate.py`.

### Task 3: Harness adapters and guards

**Files:** `.agents/hooks.json`, `.codex/hooks.json`, `opencode.json`, `scripts/agent/**`

1. Add a tested command classifier for destructive operations and secrets.
2. Add thin native hook configurations where supported.
3. Configure OpenCode to load Superpowers and inherit `AGENTS.md`/`.agents/skills`.
4. Add an agent setup validator and doctor command.

### Task 4: Tool installation and indexing

**Files:** `.codegraph/**` (generated), machine-local agent configuration

1. Install Superpowers for Antigravity and configure it for OpenCode.
2. Install CodeGraph, wire detected agents, and initialize this project after source exists.
3. Record exact detected tool versions in the generated doctor output, not in project law.

### Task 5: CI and morning handoff

**Files:** `.github/workflows/ci.yml`, `docs/agent/START-HERE.md`, `.env.example`, `.gitignore`

1. Add CI for install, lint, typecheck, tests, build, and agent setup validation.
2. Document the first commands and three ready-to-copy prompts.
3. Run `pnpm verify`, skill validation, hook checks, and Git status review.
4. Stage only project files; never stage the Word documents or Office lock file.

## Self-review

- The plan implements only the foundation and one neutral screen.
- Supabase, map, animation libraries, 3D, and game dependencies are deferred until a vertical slice needs them.
- There is one canonical contract and no symlink-based configuration.
- Every completion claim requires fresh command output.
