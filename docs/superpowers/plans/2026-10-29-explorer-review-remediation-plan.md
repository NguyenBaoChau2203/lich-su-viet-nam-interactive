# Explorer Review Remediation Plan

**Authorization:** The owner explicitly requested implementing all four findings from the 2026-10-29 self-review. Execute inline with one main agent. Preserve the dirty working tree, original journey records, source data and existing locality/province behavior. No Git integration or external publication is authorized.

**Sources:** `AGENTS.md`, `docs/agent/CURRENT-STATE.md`, the original explorer map/total journey plan, and `.task-reports/2026-10-29-1456-explorer-map-total-journey-self-review.md`. Reconfirm relevant source and use current installed Next.js documentation before edits.

## Scope and acceptance

1. **F1 — Cancel stale event travel.** Add an animated browser regression selecting an eligible event, then a summary-only event before arrival. The new summary/URL must remain selected; the camera must stop and persist the interrupted view instead of completing the old flight. Keep latest-intent and restoration semantics, including repeated selections, valid secondary anchors and journey flights. Implement through the existing camera owner only.
2. **F2 — Reveal the active total milestone.** Add browser checks for a late-stop deep link, previous/next, playback, reload and desktop resize. The current timeline link must fit inside its horizontal scroller. Reveal it with the minimum horizontal scroll, without changing focus or page scroll. Respect reduced motion and preserve manual scrolling when the selection is unchanged.
3. **F3 — Preserve public place text.** Add a unit regression with one public location missing coordinates and another eligible location. Both names and accuracy notes must remain in the summary. Use coordinate eligibility for map actions only; retain the unavailable explanation and existing accuracy/source labels.
4. **F4 — Repair the existing chooser contract.** Reproduce the existing four-versus-five failure, then update the test to exercise all five choices while retaining the authored journeys' exact stop counts. Include this public regression in the isolated fixture configuration so future feature checks collect it.

## Files and implementation order

- Tests first: `tests/unit/explorer-map-markers.test.ts`, `tests/e2e/home-explorer-map-availability.spec.ts`, `tests/e2e/home-total-journey.spec.ts`; confirm intended failures. Reuse the independently observed F4 failure at `home-journey-choices.spec.ts:155` and rerun its corrected case after the fix.
- Small production fixes: `components/explorer/MapEventCard.tsx`, `components/explorer/cinematic/CinematicEventMap.tsx`, `components/explorer/JourneyPanel.tsx`.
- Existing chooser and fixture collection: `tests/e2e/home-journey-choices.spec.ts`, `playwright.explorer-map-journey.config.ts`. Collect only the inspected public chooser regression rather than unrelated legacy tests.
- Keep each production change tied to its failing behavior test. Run focused tests after the corresponding fix; self-review the task delta against saved starting copies.

## Verification and deliverables

- Use `$env:NoDefaultCurrentDirectoryInExePath='1'` for package commands in this checkout.
- Run relevant unit files and the isolated GET-only fixture E2E suite in Edge at CSS 1280×720, 1366×768, 1440×900 and 1920×1080. Include normal/reduced motion, keyboard/focus, missing/invalid/mixed locations, deep links, playback and reading/static/WebGL failure alternatives.
- Run `pnpm verify`, `$env:E2E_CHANNEL='msedge'; pnpm test:e2e:smoke`, `git diff --check` and CodeGraph health. Record every failure and retry honestly. Do not run data-mutating legacy tests against live Supabase.
- Create an ignored `.task-reports/YYYY-MM-DD-HHmm-explorer-review-remediation.md` with scope, exact changed files, RED/GREEN and final gate evidence, screenshots, remaining limitations and a final self-review.
- Stop after local remediation and verified handoff. Do not stage/commit, push, open a PR, merge, deploy, publish, modify secrets or Word files, add historical coordinates, or change the live database. Missing-location research remains a separate held content task.

## Execution record

Completed locally on 2026-10-29 with one main agent. F1–F3 were reproduced RED before production fixes; the final clock-controlled F1 test was independently rechecked against the old early-return behavior and failed as intended. F4's existing failing chooser contract now passes and is collected by the isolated configuration. Final results: 28 focused unit tests, 19 public desktop E2E passes with 6 designed skips, `pnpm verify` passing with 1350 unit tests / 26 script tests / successful production build, and 8 smoke passes. Full evidence, intermediate failures, self-review and remaining pre-existing warnings are in `.task-reports/2026-10-29-1517-explorer-review-remediation.md`. No commit or external write occurred.
