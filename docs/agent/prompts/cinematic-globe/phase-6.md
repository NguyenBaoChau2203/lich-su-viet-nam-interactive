# Prompt — Phase 6: verify visual fidelity and desktop release quality

## Mission

Produce an evidence-backed acceptance package for the integrated cinematic homepage, correcting only defects needed to meet the agreed visual, behavioral, accessibility and performance criteria.

## Definition of done

- Final renders are compared to both the concept and the owner's accepted P1 prototype at all four desktop sizes.
- Public event/journey/navigation/fallback behavior and keyboard/reduced-motion checks pass with fresh evidence.
- Asset/engine transfer, texture memory, flight frame timing and idle/hidden behavior are measured against the spec's provisional budgets.
- Source credits, task-owned diffs and final report are complete; remaining differences are explicit.

## Sources of truth

Read `shared-contract.md`, visual spec and target PNG, actual P1 acceptance, P0 asset/license audit and P2–P5 implementation evidence. Use Phase 6 of the plan as the bounded acceptance checklist. Tests and screenshots do not create new owner approval.

## Verified starting state

- P0–P5 must exist on disk; confirm their current implementation and unresolved issues rather than marking unchecked plan tasks complete by assumption.
- `pnpm verify` excludes browser E2E. Mixed E2E files may include mobile or external mutation scenarios and need scope inspection.
- The baseline's previous frame counters were not sustained GPU benchmarks. The new renderer needs its own measured evidence.
- Known pre-existing server navigation logs must be separated from new errors; do not claim a clean console/server without checking.

## Scope and hard constraints

In scope: acceptance audit, targeted fixes, four-desktop screenshots, read-only public flows, performance/memory measurement and final documents. Out of scope: new features, historical/data rewrites, mobile/tablet testing, external publication, PR/push/merge or database mutation. Use one agent and self-review directly.

## Relevant files and patterns

- Current cinematic scene/camera/material/projection files and homepage shell/marker/card components.
- `public/maps/globe/assets.provenance.json`, `ATTRIBUTION.md` and code license notices.
- Public homepage E2E and unit tests, `playwright.config.ts`, this plan's completed phase evidence.
- New acceptance audit under `docs/audits/2026-10-23-cinematic-globe-acceptance.md`; local report under `.task-reports/`.

## Work item — prove the complete visual slice

**Problem:** Functional checks alone previously allowed a visually different result; attractive screenshots alone can conceal performance, navigation or access defects.

**Required change:** Follow Phase 6. Capture world/default/card/journey/closest-useful-zoom/reduced-motion at 1280×720, 1366×768, 1440×900 and 1920×1080. Verify real DOM bounds and focus/source/list paths. Measure cold/warm transfer, initial readiness, decoded texture+mipmap memory estimate, lazy engine gzip, repeatable 10-second camera frame intervals, idle stop, hidden pause and repeated mount/disposal. Recheck local assets/licenses and repair only demonstrated acceptance defects.

**Acceptance:** Meet the spec's explicit visual requirements and provisional budgets or report each unmet limit with evidence and practical impact; do not declare completion while a required gate fails. No unseen markers intercept clicks; no duplicate scene/context/listener accumulation; fallback remains readable. Final source credits accurately distinguish code and images.

**Verification:** Run history checks, unit tests, selected safe public desktop E2E and `pnpm verify` with fresh output; inspect task-owned diff/status and the four-size browser matrix. Only run full `pnpm test:e2e` when its target/scenarios are isolated and authorized as the shared contract requires. Record exact omissions and never claim all tests passed from a selected run.

## Deliverables and stop conditions

Return the final audit, absolute screenshot paths, visual comparison scores/differences, browser/hardware/backend/DPR/method/measurements, commands/results, changed files, intentionally deferred scope and absolute local P6 report. Update plan checks only with corresponding evidence. **STOP at P6.** Do not deploy, publish, push, merge or create a PR.

## Final recap

Prove the complete cinematic desktop slice with honest visual and engineering evidence, preserve historical integrity, and stop at the local handoff.
