# Slim Timeline and Locality Popups Implementation Plan

> **For the implementing agent:** Execute inline with one main agent, adapting `superpowers:executing-plans` when available. Owner policy prohibits subagents and separate AI reviewers. This is a proposed plan for Gemini 3.8 Flash High; implementation starts only when the owner hands it off for execution. Do not commit or publish as an automatic plan step.

**Goal:** Restore a thin homepage event rail and let learners open one animated locality dossier containing both heritage and historical-person cards.

**Architecture:** Extend the existing explorer reducer, discovery URL contract, two public readers, and single globe adapter. Add a bounded combined overview without replacing complete catalog modes or duplicating data. Use CSS for short UI transitions and the current globe controller for geographical movement.

**Tech stack:** Installed Next.js 16.3.8, React 19, strict TypeScript, existing atlas CSS, Vitest, Playwright/Edge. No new dependency.

**Spec:** `docs/superpowers/specs/2026-10-28-home-timeline-locality-popups-design.md`.

## Global constraints

- Read `AGENTS.md`, `docs/agent/CURRENT-STATE.md`, the design above, and installed Next.js guides before code. Current planning baseline: `feat/homepage-visual-effects` at `23a4b0f`; inspect current HEAD rather than assuming it remains unchanged.
- Preserve the approved globe and its single camera/history owner. Modern reference lines are not province selection polygons.
- Desktop acceptance: CSS 1280×720, 1366×768, 1440×900, 1920×1080, keyboard, reduced motion, and static/WebGL failure alternatives. Preserve existing responsive support.
- Reuse sourced records and admitted images; no new historical claims, person ranking, invented portraits, or remote publication.
- Maintain old URLs and strict detail-return validation. Add only `noi-dung=dia-phuong` for the new `locality` overview.
- Use one main agent for implementation, tests, and self-review. Do not stage/commit, modify external services, or touch Word files and unrelated work.
- The empty untracked root `node.cmd` can cause script commands to exit successfully without executing Node. In this Windows checkout use `$env:NoDefaultCurrentDirectoryInExePath = '1'` before package commands and inspect substantive output. Do not delete unrelated command files or disable hooks. This flag was verified to restore actual `agent:check` execution during planning.

## Review focus

1. Rapid A→B→A locality changes, closing during a request, and retries must never show mismatched cards or move the camera back to an old intent.
2. Detail return validation and SSR initialization must support the new overview mode; a client-only visual state is insufficient.
3. Dense/interval years, single-year catalogs, and zero results must remain navigable without fake dates or duplicate unique-event counts.
4. A people-reader error or delayed response must not blank successfully loaded heritage cards, and vice versa.
5. Dossier/chooser/search/video interactions must consume Escape once, restore usable focus, and fit the smallest desktop height.

## Proposed file map

| Files | Responsibility |
| --- | --- |
| `components/explorer/MapTimeControls.tsx` | Replace resting boxed year controls; retain filter/list/reset callbacks |
| New `components/explorer/TimelineRail.tsx`, `lib/explorer/timeline-rail.ts` | Accessible slim rail and pure width-aware year grouping |
| `components/explorer/explorer-map.css` | Scoped rail, dossier, selector, transition, and reduced-motion styles |
| `lib/local-heroes/state.ts`, `lib/explorer/journeys/playback.ts` | Overview mode, existing transitions, URL/return allowlist and snapshots |
| `app/(public)/page.tsx`, `lib/local-heroes/use-local-hero-page.ts`, `hooks/useHeritageCatalog.ts` | Conditional SSR/client concurrent reads with current response guards |
| `components/explorer/HistoryExplorer.tsx`, `components/layout/HomeAtlasHeader.tsx` | Shared overview entry and sole meaningful state/history integration |
| New `components/locality/LocalityChooser.tsx`, `LocalityOverview.tsx`, `LocalityPreviewCard.tsx` | Canonical selection; one dossier with independent sections; discriminated preview cards |
| New `components/locality/LocalityMapMarkers.tsx`; `components/explorer/cinematic/CinematicEventMap.tsx`, `lib/explorer/globe-contract.ts` | Project canonical reference anchors through the current globe overlay |
| New `lib/locality/overview.ts` | Pure filtering/order/preview derivation; no duplicate fetched catalog |
| Existing `HeritagePanel`, `LocalHeroesPanel`, `LocalityTabs` | Keep full catalogs; add return-to-overview navigation |
| Existing fixture configs and new targeted tests | Isolated public behavior, never legacy database mutations |

Do not introduce new files that merely forward props or duplicate an existing card's factual formatting. A small shared formatting extraction is acceptable when both preview and list need it; do not rewrite unrelated components.

## Task 1 — Pin the baseline and executable acceptance

**Inspect:** the file map above; `tests/e2e/home-timeline-coverage.spec.ts`, `home-local-heroes.spec.ts`, `home-heritage-sites.spec.ts`, `tests/e2e/fixtures/local-heroes/catalog.mjs`, `tests/e2e/fixtures/heritage-sites/catalog.mjs`, `playwright.local-heroes.config.ts`, `playwright.local-heroes-regression.config.ts`.

- [ ] Read the approved globe amendments and local Next.js server/client and lazy-loading guides. Confirm the current branch and preserve existing changes.
- [ ] Run substantive baseline `pnpm verify` with the Windows environment flag above. Capture existing failures separately from new behavior; do not call a zero-output script a passed gate.
- [ ] Build the dedicated browser fixture with `node scripts/agent/local-heroes-e2e.mjs build` before its first browser run and after any source change being tested. `pnpm verify` builds the normal `.next` output; the fixture starts `.next-local-heroes` through its environment-specific `distDir`. A successful normal build does not refresh this fixture build.
- [ ] Run one bounded baseline case first: `pnpm exec playwright test home-local-heroes.spec.ts --config playwright.local-heroes.config.ts --project=1280x720 --grep "^homepage locality entry exposes a bounded public list$" --max-failures=1 --global-timeout=120000`. Inspect its actual result before expanding coverage. On failure, diagnose the first error/build mismatch; do not wait through all viewports or increase timeouts.
- [ ] Capture the current homepage, places panel, and people panel in the isolated fixture browser at the four desktop viewports. Record the current timeline bounding height and overlapping rectangles.
- [ ] Confirm fixture suites use disposable read-only local catalogs. Add synthetic fixtures for mixed content, no people, no places, delayed independent responses, broken images, and rapid locality switching. Keep fixtures outside production catalogs.

**Deliverable:** Baseline evidence and fixtures needed by later tasks. This does not include remote data mutations.

## Task 2 — Add the shared overview URL/runtime contract

**Modify:** `lib/local-heroes/state.ts`, `lib/explorer/journeys/playback.ts`.
**Tests:** `tests/unit/local-heroes-state.test.ts`, `heritage-url-state.test.ts`, `heritage-runtime.test.ts`, `local-heroes-timeline-return.test.ts`; create `tests/unit/locality-overview-state.test.ts` if the new assertions do not fit cleanly.

**Interfaces:** Extend `LocalHeroUrlState.mode` to `"events" | "people" | "places" | "locality"`. Serialize `locality` as `noi-dung=dia-phuong`; use existing `filters.localityCode`. Overview preview requests always use empty query/page 1 without leaking full-catalog filters into preview fetching. Existing builders keep their names and signatures.

- [ ] Add failing tests for overview parse/build round trip, safe invalid locality, old URL equivalence, overview detail-return validation, invalid return rejection, chooser URL without a locality, and locality-specific return URLs from both detail types.
- [ ] Add reducer tests for entering overview from event and paused/playing journey contexts; switching overview/full catalogs; closing to the chooser; exiting discovery; restoring the original filter, camera snapshot, selected event, and paused journey without duplicate snapshot ownership.
- [ ] Extend existing actions for overview where sufficient. Add a dedicated `locality-clear` transition only if clearing through `people-change` cannot preserve the required snapshot. Do not maintain separate React state for selected locality.
- [ ] Run the focused unit tests and inspect diffs before proceeding.

**Acceptance:** Old links retain behavior; overview survives reload/Back/Forward/strict return normalization; the reducer remains the single owner.

## Task 3 — Load both sections without coupling failure or fetching every profile

**Modify:** `app/(public)/page.tsx`, `lib/local-heroes/use-local-hero-page.ts`, `hooks/useHeritageCatalog.ts`, `components/explorer/HistoryExplorer.tsx`.
**Tests:** extend `tests/unit/local-heroes-public-entry.test.ts`, `local-heroes-transport.test.ts`; add `tests/unit/locality-overview.test.ts` for pure derivation.

**Interfaces:** `buildLocalityOverview(localityCode: LocalityCode, heritage: HeritageLoadState, people: LocalHeroLoadState): LocalityOverviewData` in new `lib/locality/overview.ts`. `LocalityOverviewData` has independent `places` and `people` states, each `loading | error | ready`. Ready states contain a total and at most two preview items; totals derive from the filtered place catalog and people `totalPeople`, respectively. Empty is `ready` with zero items, not an error.

- [ ] Write failing assertions for two independent reader activations, no reader requests on event entry, no all-locality people request for a chooser, a single bounded people page per selected locality, and correct SSR data for direct overview URLs.
- [ ] Add pure derivation tests for deterministic tier/rank/slug place order, maximum two per type, eligible person association for the selected locality, loading-key mismatch, one-sided failure, genuine zero results, and totals from actual loaded readers.
- [ ] Activate both existing readers for a selected overview locality. Keep API request parameters appropriate to each existing endpoint; do not send a new overview value and assume a hook that only accepts people mode will fetch.
- [ ] Extend the people hook's current-mode/key/nonce checks to overview, with abort on changes/unmount. Keep full-catalog page clamping separate from the bounded preview request.
- [ ] Reuse valid initial loads without a duplicate hydration request. Retrying one section must not replay/fetch the other successful section.
- [ ] Run focused tests. In browser, delay A's request, choose B, resolve A, and confirm only B appears. Repeat while closing and reentering.

**Acceptance:** Both sections can render independently and no stale locality or all-pages download is introduced.

## Task 4 — Replace the boxed year rail with the thin rail

**Modify/create:** `MapTimeControls.tsx`, new `TimelineRail.tsx`, `lib/explorer/timeline-rail.ts`, scoped CSS.
**Tests:** existing `explorer-timeline-years.test.ts`; new `tests/unit/explorer-timeline-rail.test.ts`; update `tests/e2e/home-timeline-coverage.spec.ts` to behavior-based selectors.

**Interfaces:** `layoutTimelineYears(years: readonly TimelineYear[], width: number, limits: { minYear: number; maxYear: number }): TimelineRailItem[]`. Items contain a stable key, CSS x position, and nonempty `years` members. Use 16px endpoint inset, 28px minimum center spacing after grouping, chronological ordering, and a centered single-year case. This helper changes presentation only. `TimelineRail` consumes those items and calls existing `onChange(year, year)` only on an exact year activation.

- [ ] Add failing tests for empty/single/dense years, deterministic resize regrouping, first/last year retention, every member year preserved exactly once, interval-year membership unchanged, and no duplicate unique-event count from grouped years.
- [ ] Render a 1px rule, 4–6px dots, selected cue, ≥28px hit targets, clamped hover/focus labels, and grouped-year pickers. Match the design's keyboard behavior and retain a text-list alternative.
- [ ] Move the required numeric range form into `Lọc năm`; keep normalization, reset and list/full-timeline navigation. The closed rail height must be ≤76px at all four viewports.
- [ ] Update tests that assumed `.home-year-strip` was always visible. Preserve actual `data-year` controls inside the group picker, and assert selected year/URL/count rather than reintroducing boxes to satisfy old selectors.
- [ ] Verify 2008 interval membership, two distinct 2009 events, empty range/reset, reversed/out-of-bound inputs, and event detail return using existing fixtures.

**Acceptance:** The reference's thin appearance is achieved without dropping chronological or accessibility behavior; dedicated timeline/journey UI remains intact.

## Task 5 — Build the locality chooser and four-card dossier

**Create:** `components/locality/LocalityChooser.tsx`, `LocalityOverview.tsx`, `LocalityPreviewCard.tsx`.
**Modify:** header/explorer integration, both complete catalog panels, scoped CSS.
**Tests:** new `tests/e2e/home-locality-overview.spec.ts`; existing full catalog suites.

**Interfaces:** `LocalityOverview` consumes the canonical locality, `LocalityOverviewData`, validated `homeHref`, and callbacks `onChangeLocality`, `onClose`, `onRetryPlaces`, `onRetryPeople`. Preview card input is a discriminated union `{ kind: "place"; item: HeritageSiteSummary } | { kind: "person"; item: LocalHeroSummary; localityCode: LocalityCode }`; use existing link builders and factual formatters.

- [ ] Test the chooser's full canonical set, local text search, direct shared URL, and native form fallback. Search is a chooser affordance; it must not overwrite the people catalog query.
- [ ] Implement one nonmodal dossier with the design's sizes, two sections, maximum four previews, independent loading/error/retry/empty states, solid readable cards, and the two `Xem tất cả` links.
- [ ] Preserve image depiction/era, locality relationship, uncertainty, credit/source access and focal-point behavior. Do not add historical prose or label all profiles as heroes.
- [ ] Add `Về tổng quan địa phương` to full catalogs for a selected locality. Entering a complete catalog and returning must retain the exploration snapshot and selected locality.
- [ ] Implement coordinated focus and Escape behavior. Test a dropdown/disclosure, video/search overlay, heading focus, origin restoration, detail navigation, and repeated Back/Forward.
- [ ] Inspect WebGL failure and JavaScript-disabled direct overview URLs: the chooser, loaded factual cards and real detail links must remain reachable.

**Acceptance:** A learner can choose a locality, see both kinds, open either detail, return to the same overview, open full results, and exit back to exploration.

## Task 6 — Add locality anchor selection and the short reveal

**Create/modify:** `LocalityMapMarkers.tsx`, `globe-contract.ts`, `CinematicEventMap.tsx`, explorer integration and scoped CSS.
**Tests:** overview E2E; extend camera/runtime tests only for changed intent/cancellation behavior.

**Interfaces:** Add optional `localitySelection` payload `{ selectedCode: LocalityCode | null; onSelect(code: LocalityCode): void }` to `EventMapProps` for overview mode. Render HTML anchor buttons in the existing globe overlay, using its current `GlobeViewport.project()`. Reference centers remain imported from `lib/heritage/locality-views.ts`. Use one nonce-tagged request through the existing camera adapter; do not fake event objects for province labels or instantiate a new renderer.

- [ ] Test map-label activation yields the same state/URL as the chooser; hidden/occluded labels cannot be clicked; duplicate labels do not collide with existing event/heritage markers.
- [ ] Limit displayed labels through collision handling; all 34 canonical localities remain selectable in the chooser. Never hit-test province line segments as filled polygons.
- [ ] Apply 220ms shell/card entry, 45ms card stagger, 120ms exit, and 140ms hover emphasis. Use the design's maximum four-card/500ms cosmetic budget and no infinite floating.
- [ ] Use the existing camera owner for the proposed 650–900ms approach; honor manual interruption/new intent/reduced motion. Do not serialize the reference camera movement into the suspended ordinary-exploration snapshot.
- [ ] Test rapid switching, page hiding, close during flight, window resize, no WebGL, and reduced motion. Observer/listener/request cleanup must not create an idle rendering/timer loop.

**Acceptance:** Map names and textual choices open the same dossier; animation enhances entry without delaying reading or stealing camera ownership.

## Task 7 — Verification, self-review, and local handoff

- [ ] Extend `playwright.local-heroes.config.ts` to include the new overview fixture suite. Keep its isolation, all four projects, and existing public coverage.
- [ ] Run focused unit tests throughout development. Run existing public fixture and regression suites; do not run admin/auth/payment legacy suites against the system database.
- [ ] Perform desktop acceptance at all four CSS sizes, keyboard, reduced motion, no WebGL, JavaScript-disabled direct URLs, 200% zoom/text, broken media, partial failures, and URL history restoration.
- [ ] Measure timeline height, document overflow, dossier/close-button bounds and overlaps. Capture before/after screenshots and a short entrance recording if available. A screenshot alone does not prove motion timing or return-state correctness.
- [ ] Record browser/device and distinguish software-rendered automation from actual hardware performance. Confirm no new dependency, no idle animation, and no multi-page people fetch.
- [ ] Run the full gate below, inspect full outputs and final diff, create the local report, and stop for the owner to review. No automatic commit, remote mutation, publication, or deployment.

```powershell
# Windows command resolution only; leave existing local files/hooks untouched.
$env:NoDefaultCurrentDirectoryInExePath = '1'
pnpm exec vitest run tests/unit/explorer-timeline-years.test.ts tests/unit/explorer-timeline-rail.test.ts tests/unit/locality-overview.test.ts tests/unit/local-heroes-state.test.ts tests/unit/heritage-url-state.test.ts tests/unit/heritage-runtime.test.ts
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test --config playwright.local-heroes.config.ts --max-failures=1 --global-timeout=900000
pnpm exec playwright test --config playwright.local-heroes-regression.config.ts --max-failures=1 --global-timeout=900000
pnpm verify
git diff --check
git status --short
```

`playwright.local-heroes.config.ts` currently hardcodes Edge and fixture port 3114, forbids external base-URL overrides, and starts its own fixture server. The regression config inherits it. Do not run both suites simultaneously on that port. The regression config currently lists only its `legacy-desktop` project: the new overview suite must provide four-viewport coverage explicitly rather than treating that regression project as four viewports. Run isolated smoke only with the repository's documented smoke build/environment; do not replace a user's configured dev build/environment with fixture values.

The 15-minute global browser limit is an investigation budget, not evidence that an unfinished suite passed. A failed or timed-out run must be reported and diagnosed before rerunning. After fixing a shared failure, repeat the narrow case and then the complete acceptance suites; do not hide failures by reducing required coverage. Never rebuild a fixture output while another test run is serving it.

## Deliverables and stop condition

- Implemented scoped source changes and behavioral tests; no unrequested dependency or historical data diff.
- Before/after screenshots at all four desktop viewports and recorded motion/reduced-motion checks.
- Fresh command results and remaining limitations, labelled self-review.
- `.task-reports/YYYY-MM-DD-HHmm-home-timeline-locality-popups.md`, ignored and never staged.
- Stop after the locally verified UI handoff. Push, PR, merge, deployment, and database publication require a separate explicit owner instruction.
