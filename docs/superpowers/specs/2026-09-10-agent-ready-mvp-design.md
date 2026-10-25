# Agent-ready MVP foundation design

**Date:** 2026-09-10

**Status:** Approved for implementation by the project owner

**Source:** The existing project report and the repository/tool review completed in this task

## Goal

Make this repository ready for productive work with Codex, Antigravity, and OpenCode while keeping the first deliverable small enough for a course project.

The required product remains a Vietnamese grade-12 history experience with 25–35 curated events, a timeline, a map, search, event detail, and basic administration. Accounts, quizzes, AI features, 3D, and a game are later options, not foundation requirements.

## Decisions

- Use Next.js, React, TypeScript, Tailwind CSS, Vitest, and Playwright.
- Keep one canonical project contract in `AGENTS.md`.
- Put portable project skills in `.agents/skills/`; do not duplicate whole upstream skill repositories.
- Let OpenCode and Antigravity load Superpowers through their native plugin mechanisms. Codex already has the Superpowers plugin installed.
- Initialize CodeGraph only after source code exists, then let every agent use the same local index.
- Keep Motion for small UI transitions. Introduce GSAP only for a dedicated story route that needs a scroll-controlled timeline. Defer Three.js and a game engine.
- Require historical claims to carry source and confidence metadata; never invent exact dates, places, quotes, or relationships.
- Keep privileged Supabase keys server-only. Database integration is a later vertical slice.

## Repository contract

`AGENTS.md` owns scope, architecture, quality, safety, and workflow. Harness-specific files are thin adapters:

- Antigravity: `.agents/rules/project.md` and `.agents/hooks.json`
- Codex: `.codex/hooks.json`
- OpenCode: `opencode.json`

Project skills cover only repeatable, domain-specific workflows:

1. `research-history-sources`
2. `build-map-timeline-slice`
3. `design-history-story`
4. `model-supabase-history`
5. `verify-release-slice`

## Safety and verification

- Block obviously destructive shell commands and attempts to read or commit secret files.
- Ignore local environment files and Office lock files.
- Make `pnpm verify` the single full quality gate.
- Run lint, type checking, unit tests, and a production build in CI.
- Keep smoke E2E tests available locally and in CI once browser binaries are installed.

## Non-goals for this setup

- No production Supabase project, deployment, authentication, 3D scene, or game.
- No generated historical dataset presented as fact.
- No global Taste Skill rule for the whole app.
- No multi-agent role bureaucracy; each task gets one implementer and one fresh review when useful.

## Acceptance criteria

- A fresh clone can install and run the app with documented commands.
- Codex, Antigravity, and OpenCode see the same project law and skills.
- The home page builds and has a smoke test.
- Agent/tool diagnostics explain what is installed and what remains optional.
- Existing Word documents are byte-for-byte untouched and excluded from commits unless the owner explicitly chooses otherwise.
