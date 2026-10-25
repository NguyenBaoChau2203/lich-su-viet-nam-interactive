---
name: build-map-timeline-slice
description: Use when building or changing the project's historical event browsing across data, timeline, map, search and detail UI.
---

# Build a Map–Timeline Slice

## Before coding

- Read `AGENTS.md` and the current feature spec.
- Read `docs/agent/CURRENT-STATE.md` to locate the existing explorer, shared event query and tests. Extend those paths rather than rebuilding the initial slice.
- Use CodeGraph first when its database is usable; check/sync through `docs/agent/CODEGRAPH.md` and use targeted file reads for unsupported or missing files.
- Require research when adding/changing historical claims. Reuse existing sourced records for interaction-only work; do not force new research for unchanged facts.
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

- Follow the approved globe design in `docs/superpowers/specs/2026-10-23-curated-history-globe-design.md` and current amendments linked in `docs/agent/CURRENT-STATE.md`. Do not restore the superseded tabletop or tiled-map homepage. Event-detail simulations have their own scope.
- Preserve existing imported modules without adding account, quiz, payment, game or unrelated story features to a core browsing task.
- Do not introduce a second event representation for each view.
- Do not present approximate coordinates or dates as exact.

## Verify

Run focused tests, `pnpm lint`, `pnpm typecheck`, and finally `pnpm verify`. Report the tested journey and deferred work.
