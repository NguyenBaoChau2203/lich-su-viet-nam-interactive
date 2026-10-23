---
name: build-map-timeline-slice
description: Implement one verified historical event end-to-end across data, timeline, map, search, and detail UI. Use when building or changing the project's core event browsing experience.
---

# Build a Map–Timeline Slice

## Before coding

- Read `AGENTS.md` and the current feature spec.
- Use CodeGraph first when `.codegraph/` exists.
- Require a researched event record; invoke `research-history-sources` if provenance is missing.
- Define one observable learner journey and its acceptance test.

## Implement vertically

1. Add or update the typed event model, including provenance and uncertainty.
2. Write a failing unit or component test for the smallest behavior.
3. Render the same event identity and date semantics in timeline, map, search result, and detail view.
4. Keep meaningful filter state in the URL.
5. Use accessible HTML before custom widgets; ensure keyboard focus can reach the event from both timeline and map alternatives.
6. Provide a textual location/event list when the visual map is unavailable.
7. Make the test pass, then simplify duplicated transformations.

## Boundaries

- Do not add accounts, quizzes, unrelated 3D, a game, or story animation to complete a core slice; the approved Three.js Vietnam tabletop and event detail scope follows `docs/superpowers/specs/2026-10-23-3d-vietnam-map-explorer-design.md`.
- Do not introduce a second event representation for each view.
- Do not present approximate coordinates or dates as exact.

## Verify

Run focused tests, `pnpm lint`, `pnpm typecheck`, and finally `pnpm verify`. Report the tested journey and deferred work.
