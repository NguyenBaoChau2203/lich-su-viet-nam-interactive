# Prompt — Task 09: verify the complete explorer refinement and repair regressions

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 5/5. Execute one task inline; this is direct integration/self-review, not an independent AI reviewer.

## Mission

Verify the entire requested refinement against actual code, sources and browser behavior, repair demonstrated in-scope regressions, and deliver a truthful final acceptance report.

## Definition of done

- Brighter readable geography, modern province lines, useful event declustering, four sourced journeys, real finite connectors and 2000 ms post-arrival dwell all pass their criteria.
- Desktop, URL/history, race/cancellation, fallback, accessibility and measured performance gates pass with fresh evidence.
- Required source/feature gaps are explicitly outstanding rather than hidden by a successful old test suite.

## Sources of truth

Read `shared-contract.md`, the complete refinement design/plan, verified progress entries, source ledgers/provenance and actual changed code/tests. A preceding model's report is not proof of current runtime behavior. Use `verify-release-slice` for evidence, adapting all work to the owner's single-agent rule.

## Verified starting state

The planning baseline passed 873 unit tests, 8 hook tests and 68 selected public homepage E2E cases. Those old expectations included the former zoom/eight-second requirements and do not establish this feature's completion. Tasks 01–08 must have actual evidence; if province/current content remains blocked, record the incomplete requirement before testing the rest.

The baseline server emitted `The destination stream closed early` (digest `3840477093`) despite passing browser cases. Check whether it persists and record its reproduction/impact; do not claim clean server logs from browser success alone or expand into unrelated fixes without evidence.

## Scope and hard constraints

In scope: integration audit, demonstrated defect repairs, meaningful regression tests, screenshots and measured asset/render/lifecycle evidence. Out of scope: broader redesign, new features/providers, publication/external writes or replacing completed contracts without a failing reproduction. Apply all shared constraints. No subagent or separate reviewer; call the review self-review accurately.

## Relevant files and patterns

Review the task-owned camera/cluster, journey registry/state, finite path, province builder/layer, chooser and content changes. Extend `tests/e2e/home-explorer-refinement.spec.ts` and `home-journey-choices.spec.ts` plus existing focused tests. Use actual source-ledger and output paths, not assumed names from a prior report.

## Work item — run the integrated acceptance matrix

**Problem:** Individually passing tasks can still lose camera restoration, accept a stale arrival, hide province lines at close scale or never actually draw a path.

**Required change:**

1. Recheck every requested behavior in the browser: country/Earth/atmosphere contrast; province context; real Hanoi/Sài Gòn cluster separation; identical-coordinate expansion with leaders; event card/detail/return; all four journey choices and manual progression.
2. Test CSS 1280×720, 1366×768, 1440×900 and 1920×1080. Include local zoom 8/10/11, legacy bookmarks above 11, country/cap/path/province depth, far-side occlusion and route seam/repeated-city cases.
3. Test rapid journey switch/seek/exit/popstate during flight, hidden/resume, delayed outgoing detail navigation, source expansion/keyboard reading, last-stop pause and restored exploration filters/camera/event. Prove 1999/2000 ms timer boundaries in unit time and browser waiting after actual arrival. Stale pair/nonce cannot progress the new journey.
4. Verify reduced motion, no-JS/no-WebGL and optional country/province asset failure/retry. Actual rendered route/province pixels and hit/focus behavior are required; a fetch, geometry count or caption alone is insufficient.
5. In an uncontended measurement window, record served gzip assets/new UI JS, added line buffers/draw calls, a representative ten-second flight frame sample and settled/hidden/unmounted draw behavior. Apply the design budgets: province at most 200 KiB gzip, total geography at most 800 KiB, added UI/journey JS at most 60 KiB gzip, province/path at most three added draw calls/six MiB buffers, province at most 50,000 segments, median frame at most 33.3 ms and p95 at most 50 ms. Report the precise instrumentation/device and any software-rendering limitation; do not substitute old P6/B3 numbers. Settled/hidden effects must request no continuing draws.
6. Repair only reproduced in-scope defects, rerun the affected checks, and inspect the task-owned diff/new files for source integrity and protected-file changes. Missing evidence remains a failing required gate; do not loosen tests or silently raise budgets to label it complete.

**Acceptance criteria:** All requested features and the integrated guards above have current evidence. Source provenance/currentness/attribution and historic uncertainty remain intact. If any required feature is unresolved, the final result is explicitly partial/blocked with exact evidence, not completion.

## Full verification gate

After creating the new test files and a fresh production build/owned target, run:

```powershell
pnpm verify
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts --workers=1
git diff --check
git status --short
```

Confirm `E2E_BASE_URL` targets the fresh task-owned production process (default 3100); do not stop the owner's 3000 server. Full unfiltered E2E requires an isolated authorized environment because unrelated suites can mutate connected services or test deferred mobile scope. Report exact selected coverage, omitted suites and failed requests/console errors. Shut down only task-owned processes after evidence capture.

## Deliverables and stop conditions

Return a Vietnamese feature-by-feature acceptance result, changed files/repair reasons, exact fresh commands/results, absolute screenshot/source/measurement paths, verified progress and `.task-reports/YYYY-MM-DD-HHmm-explorer-refinement-task-09.md`. Write a durable final feature audit without secrets/full logs. **STOP after 09.** Do not push, create a PR, merge, deploy or publish. Do not claim completion while a required province/content/behavior gate is outstanding.

## Final recap

Prove the complete integrated behavior with fresh evidence, repair only demonstrated regressions, state remaining limitations honestly, and stop before any external action.
