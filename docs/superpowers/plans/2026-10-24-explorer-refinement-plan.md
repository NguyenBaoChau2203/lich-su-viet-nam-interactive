# Explorer Refinement Implementation Plan

> **Implementing agent:** Execute one numbered task inline in the owner-selected model. Use an executing-plans workflow where available. No subagents, separate AI reviewers or automatic model orchestration. Do not automatically run the next prompt.

**Goal:** Improve globe readability, province context, event zoom/selection and selectable historical journeys with restored path effects and a two-second post-arrival dwell.

**Architecture:** Retain the single Three scene and existing state owner. Decouple interactive zoom from texture sharpness, generalize the authored journey to a validated registry, restore one finite route layer, and add one optional sourced interior-province layer. Keep server publication boundaries and public URL compatibility.

**Stack:** Current Next.js App Router, React, strict TypeScript, installed Three line addons, existing Vitest/Playwright. No new runtime dependency or basemap provider is required by this plan.

**Spec:** `docs/superpowers/specs/2026-10-24-explorer-refinement-design.md`.

**Reviews:** `docs/audits/2026-10-24-explorer-refinement-review.md` and `docs/audits/2026-10-24-explorer-model-routing.md`.

**Prompts:** `docs/agent/prompts/explorer-refinement/README.md`, `task-01.md` through `task-09.md`.

**Status:** Task 09 has performed the owner's integrated audit: **partial acceptance / blocked province requirement**. Fresh code/source/browser evidence verifies Tasks 01–04 and 07–08. Task 05 remains **blocked on incomplete source geometry**; Task 06's renderer/fallback is verified with synthetic fixtures while its required production layer remains outstanding. Exact textbook-printing/pages remain unverified. See the progress record and `docs/audits/2026-10-24-explorer-refinement-final-acceptance.md`. Stop after 09; tests do not replace source approval.

## Global constraints

- Latest request concerns the current globe. Preserve dirty tracked/untracked work, existing source geography/islands, historical records, Word reports and secrets. No reset/clean/stash, unrelated formatting, DB write, push/PR/merge/deploy/publication.
- Use CodeGraph first when present; document missing current symbols, then inspect narrowly. Read relevant installed Next/Three guides before implementation. Keep server queries and client-only renderer boundaries.
- One active agent and one model per task; the owner manually switches the model. Keep work serial in the same workspace, with a compact verified handoff. Do not call another AI/chat/CLI as reviewer or worker.
- Desktop CSS 1280×720, 1366×768, 1440×900, 1920×1080; preserve keyboard, reduced motion and HTML fallback. Mobile/tablet work is deferred.
- No invented coordinates, dates, sources, claims, asset rights, reviewer identities or publication states. The owner selected **34 current provincial-level units** as a disclosed reference layer.
- Preserve URL keys `tu`, `den`, `su-kien`, `ban-do`, `hanh-trinh`, `moc`; legacy zoom parsing to 18 and existing Hồ Chí Minh ID/stop links remain valid.
- Proposed interactive max 11; useful cluster fit + overlap expansion. Never move GPS coordinates to spread markers.
- `JOURNEY_DWELL_MS = 2000` after confirmed arrival. One request identity includes journey, stop and monotonically increasing nonce. Preserve navigation/restore/hidden/manual/motion guards.
- Country stroke/Vietnam outline/province stroke hierarchy; no global labels, province cards, full basemap service, extra Earth texture or continuous effect loop.
- Proposed added province gzip ≤200 KiB / all geographic JSON ≤800 KiB; new journey/UI JS ≤60 KiB gzip; existing image/texture budgets retained. Record actual costs and source gates.
- Every task: focused evidence, inline self-review, `pnpm verify`, diff/status, progress record and ignored task report. No completion claim from another model's report alone.

## File and contract map

| Area | Existing files | Proposed additions |
| --- | --- | --- |
| Lighting | `lib/explorer/cinematic/materials.ts`, `scene.ts` | No general theme framework |
| Event zoom/grouping | `camera.ts`, `projection.ts`, `overlays.ts`, `map-markers.ts`, `GlobeMarkers.tsx`, `CinematicEventMap.tsx` | `lib/explorer/cluster-expansion.ts`, focused tests |
| Journey state | `lib/explorer/journey.ts`, `map-state.ts`, `globe-contract.ts`, `url.ts`, `HistoryExplorer.tsx`, `JourneyPanel.tsx` | `lib/explorer/journeys/registry.ts`, existing-data module, later three content modules |
| Journey path | `scene.ts`, `flight.ts`, `camera-controller.ts`, `CinematicEventMap.tsx` | `lib/explorer/cinematic/journey-path.ts` |
| Provinces | Existing optional country loader/lifecycle and national cap | `scripts/build-vietnam-province-boundaries.mjs`, `public/maps/history-vietnam-province-boundaries.geojson`, provenance, `lib/explorer/cinematic/province-boundaries.ts` |
| Journey UI | Existing header/reader/timeline | `components/explorer/JourneyChooser.tsx` |
| Evidence | Existing public homepage tests | New zoom/registry/timer/path/province/chooser tests; updated checks for changed product requirements |

Freeze these minimal contracts in the owning task, then record them in `docs/audits/2026-10-24-explorer-refinement-progress.md`:

```ts
type HistoryJourney = {
  id: string; title: string; period: string; note: string;
  lessonSlugs: readonly string[];
  stops: readonly JourneyStop[];
};
getJourneyById(id: string): HistoryJourney | undefined;
getJourneyStop(journeyId: string, stopId: string): JourneyStop | undefined;
```

`JourneySelection` remains `{ id, stop }`. `GlobeCameraRequest` gains the journey identity for arrival validation; `onArrive` carries the pair and request nonce. Keep `HISTORY_JOURNEY` as the legacy default-data export if needed by existing consumers, while runtime decisions use the selected registry entry.

`ClusterFocusRequest` carries all distinct member locations, not just the first point. Screen expansion returns original anchor keys/true screen coordinates plus display coordinates and leader geometry; original latitude/longitude remain unchanged. The owning zoom task chooses the smallest fit/expansion API and records it before consumers are changed.

The scene gains focused province/path setters, not a general layer manager. A path request carries selected journey data, stop ID and request nonce; progress is driven by the existing flight/render owner, not a separate timer. Freeze its exact signature in Task 04 and use it for all later journeys. Province data has its own type/validator and 34-unit source metadata; do not relabel it as international boundaries.

## Review focus

1. A plus button can move the camera while distinct points still remain grouped: test actual Hanoi/Sài Gòn members and a coincident fixture separately.
2. Raising zoom exposes near-plane/radial-offset and overlay alignment problems: inspect zoom 8/10/11 and legacy >11 rather than only default overview.
3. A late arrival from journey A can start a timer or path in journey B: test pair+nonce across rapid switch/seek/history/exit.
4. A 34-row name list is not a province geometry dataset: rights, snapshot date, complete topology and code membership are data gates.
5. Two-second playback and animated lines can consume idle frames or interrupt source reading: test focus/source pause, reduced motion, actual arrival timing and settled rendering.

## Task 01 — Readability tuning

**Model / risk:** Gemini 3.8 Flash high, 2/5. **Dependencies:** none beyond preflight. **Files:** `materials.ts`, `scene.ts`; current visual/contrast tests.

- [ ] Capture same-camera world/Vietnam/card/journey baseline and preserve current source assets/geometry.
- [ ] Tune only the spec's border/light parameters; compare actual border and limb pixels. Keep land/sea variation, national outline and marker/text contrast.
- [ ] Inspect four desktop sizes, country joints and selected markers; no CSS brightness filter, new glow library or source changes.
- [ ] Run relevant contrast/layout/country-boundary cases, `pnpm verify`, self-review and handoff. Stop after 01.

**Acceptance:** Slightly brighter geographic reading; no washed-out limb, reduced text/dot contrast or competing country stroke. Human screenshot comparison is required, not assertions of color constants.

## Task 02 — Useful event zoom and truthful declustering

**Model / risk:** GPT-6.1 Sol max, 5/5. **Dependencies:** preflight; retain Task 01 tuning. **Files:** camera/projection/overlay/markers/adapter; new `cluster-expansion.ts`; camera/overlay and browser tests.

- [x] Reproduce the 5.4 cap at Hanoi with plus/wheel/keyboard/cluster zoom. Inventory current published anchors; reuse their distinct coordinates before proposing any sourced correction.
- [x] Write red tests for new-input zoom past 5.4 up to 11, gradual zoom-out from legacy >11, fitting every cluster member within the safe viewport, and no-progress/coincident groups.
- [x] Separate interactive max from imagery advice. Implement all-member fit and bounds-aware marker expansion/leader lines when members still overlap at useful max. Preserve geographic coordinates, accuracy and stable anchor keys.
- [x] Verify actual near/far plane, raised cap/outline/line alignment and HTML hit targets at 8/10/11; use a coherent bounded correction if offsets cause artifacts. Keep the softened 4K texture honest; do not add street tiles/POIs.
- [x] Test Hanoi distinct sites, southern distinct sites, synthetic identical coordinates, multiple locations per event, keyboard/Escape/focus return, selected-card/detail return and filters/history.
- [x] Run focused tests plus retained event/navigation cases and `pnpm verify`; freeze fit/expansion APIs in progress and stop after 02.

**Acceptance:** At least two real previously grouped Hanoi events separate geographically; all members remain individually selectable, including coincident ones. Plus/cluster zoom is not inert at 5.4. No random GPS jitter or invented exact campaign site.

**Task 02 implementation brief (2026-10-24):** Keep `MAX_ZOOM = 18` for restored views and add `MAX_INTERACTIVE_ZOOM = 11`. `fitClusterView(size, { locations, safeArea })` returns `{ view, distinctCount, separated } | null`; it fits every distinct coordinate using the actual camera projection and measured free rectangle. `buildClusterExpansion(anchors, viewport, occupied)` returns stable-keyed screen markers with original `anchor`, display `x/y`, and `unplacedKeys` (the complete HTML list remains available). Expansion and its leaders never modify geographic data. Preserve close selection scale when its location is already visible. Check fixed radial offsets against screen/near-plane geometry before choosing the smallest coherent depth correction. Tests cover fit, collisions, coincident and multi-location fixtures, stale focus/camera cancellation, and all four desktop sizes. Execution and review remain inline in the main agent; stop after 02.

## Task 03 — Registry and 2000 ms playback state

**Model / risk:** GPT-6.1 Sol max, 5/5. **Dependencies:** preserve 02 camera contract. **Files:** journey registry/data, map-state/url/contracts, state owner/reader and existing timer/URL/controller tests.

- [x] Extract existing Hồ Chí Minh data without historical edits and introduce selected-journey lookup/pair validation. Keep its ID, stops, source copy and old URLs compatible.
- [x] Replace hardcoded captions/stop counts/last-stop/seek/return logic with selected record data. Add journey+stop+nonce arrival identity and a monotonic counter; switching cannot reuse an older request's completion.
- [x] Add red tests for wrong-journey stop, unknown pair, switch during flight, same stop ID in separate synthetic test registries, popstate/exit and delayed outgoing detail navigation.
- [x] Introduce `JOURNEY_DWELL_MS = 2000` and matching UI text. Unit clock proves no advance at 1999 ms and exactly one valid advance at 2000; browser timing starts after actual arrival. Pause for reader focus/expanded sources plus existing manual/hidden/reduced-motion behavior.
- [x] Capture exploration snapshot once on entry; switching preserves it; exit restores its filters/view/selection. A journey uses its own sequence rather than filtering stops by exploration years. Last stop pauses.
- [x] Run focused registry/timer/URL/race checks, adjust old eight-second product tests explicitly, run `pnpm verify`, record contracts and stop. No new production journey content yet; synthetic journeys stay test-only.

**Task 03 implementation brief (2026-10-24):** Execute inline in the main agent on `codex/refinement-task-03`; preserve all prior dirty work. Extract the existing data unchanged to `journeys/ho-chi-minh.ts` (empty `lessonSlugs` until separately sourced). A validated `createJourneyRegistry(records)` supplies `journeys`, `getJourneyById(id)`, and pair-aware `getJourneyStop(journeyId, stopId)`; production registers only the legacy default. Known-journey invalid stops recover to its first stop with a notice; unknown journeys are rejected. Keep URL keys and published-only detail inventory rules.

- [x] Add red registry/pair/URL recovery tests and test-only multi-journey fixtures, including overlapping stop IDs and duplicate/empty registry rejection; implement the registry and preserve the exact source data.
- [x] Consolidate runtime transitions into a pure reducer in `journeys/playback.ts`, owned by the existing `HistoryExplorer` component (no independent store/controller). Freeze `JourneyArrival = { journeyId: string; stopId: string; nonce: number }` and `GlobeCameraRequest = JourneyArrival & { view: MapView; instant?: boolean }`. Use a monotonic counter for requests/invalidation, pair+nonce-guarded arrival/dwell actions, one captured exploration snapshot, paused history/switch/seek/exit, and last-stop termination.
- [x] Write fake-clock tests using the same dwell scheduling function consumed by the owner effect: no timer before arrival, unchanged at 1999 ms, one advance at 2000 ms, and stale expiry rejection after pause/switch/seek/manual/hidden/departure/history/exit. Keep delayed camera-controller regression tests.
- [x] Pass the selected journey to reader/caption/link/seek rendering. Add reader focus/source-expansion pause callbacks; explicit playback remains blocked while reading. Propagate arrival identity through the existing camera adapter and reject obsolete callbacks before publishing camera state.
- [x] Rename/update obsolete eight-second browser assertions while retaining actual intercontinental arrival, pause, delayed navigation, restoration, motion and manual-input race coverage. Add focused reading/recovery/last-stop browser cases and four-desktop screenshots under `output/playwright/explorer-refinement/task-03/`.
- [x] Run focused tests, self-review task-owned baseline diffs, fresh `pnpm verify`, selected safe public homepage E2E, `git diff --check`, and status; record signatures/results in progress and ignored Task 03 report. Stop after 03; no path layer, chooser, province or new historical content.

**Review focus:** same stop ID across journeys, same-millisecond repeated seeks, queued expiry after a switch/pause, reading focus or open sources at playback start, history/exit during delayed navigation, and exploration filters hiding published detail targets. All are owned by the registry/runtime/browser checks above.

## Task 04 — Restore finite spherical journey connections

**Model / risk:** GPT-6.1 Sol max, 4/5. **Dependencies:** 03 selected-journey/request contract. **Files:** new `journey-path.ts`, scene/flight/controller/adapter; path geometry and real-render tests.

- [x] Establish a red render case: a multi-stop shared journey has authored connection data but no drawn route. Tests must inspect actual pixels/progress, not only a nonempty data function.
- [x] Build bounded spherical segments/arcs through authored stops up to the current one. Preserve order/repeated cities; handle seam, zero-length and Earth occlusion. Clear on journey exit/change.
- [x] Connect one path setter and current request nonce to the existing flight/render lifecycle. Completed portions remain static; reveal/moving light is finite during a valid flight only. No second clock or idle animation loop.
- [x] Test rapid seeking, switch/exit mid-flight, hidden/resume, reduced motion, retries/unmount and stale completion. Manual camera input must not become a new historical route point.
- [x] Keep schematic wording for all tours; an optional bottom progress effect derives from the same state. Verify country/province geometry remains passive and the path does not intercept clicks.
- [x] Run focused geometry/render/cancellation and retained suites, `pnpm verify`, record path API and stop after 04.

**Task 04 implementation brief (2026-10-24):** Execute inline on `codex/refinement-task-04`, preserving all existing dirty work. The current graph lacks the cinematic symbols; focused source reads confirm the Three scene has no route setter. Use the approved route design and Task 03 registry/arrival contracts without new content. No external writes or later tasks are authorized.

- [x] RED: create `tests/e2e/home-journey-path.spec.ts`; compare actual same-camera canvas pixels for a shared multi-stop journey versus its cleared route. Save both images and numeric differences. Add `tests/unit/explorer-journey-path.test.ts` for spherical ordering, seam/antipodes/repeats/bounds and pair/nonce/disposal.
- [x] Implement `lib/explorer/cinematic/journey-path.ts`: one bounded wide-line batch, shortest spherical interpolation in authored order, leg progress attributes, depth-tested spherical occlusion and a warm static stroke. Reject invalid or oversized input; no fabricated waypoints. Maximum 64 authored stops and 360 segments per leg.
- [x] Freeze `JourneyPathRequest = JourneyArrival & { journey: HistoryJourney }` and `CinematicScene.setJourneyPath(request: JourneyPathRequest | null): void`. Extend the existing scene flight with optional `JourneyArrival`; the controller carries that identity through finish/hidden resume. Flight callbacks provide progress/cancellation synchronously from the existing director; the path owns no clock, timer or frame request.
- [x] Adapt `CinematicEventMap.tsx` using selected registry data. Clear on switch/exit/restore/departure/retry/dispose; retain the selected static authored path on manual cancellation. Reduced motion and instant arrivals display the full static path immediately. Keep current reader/timeline schematic wording.

**Task 04 interface ruling:** `EventMapProps.journeyPathRequest: JourneyPathRequest | null` is derived and memoized by `HistoryExplorer` from the selected registry record/stop and its existing `requestNonce`. It survives a cancelled `cameraRequest`, so a retried scene can restore the selected static connection without a second store or inferred stop ownership. The adapter suppresses the setter during departure as well as suppressing flights. The retry and held-navigation regressions were observed RED before these changes.

- [x] GREEN: prove actual reveal pixels at fixed camera, completed segments, near/far-side occlusion, pair/nonce cancellation, hidden/resume, motion changes, retries, disposal, manual dragging and clickable markers. Capture all four desktops. Run a separate 10-second camera/path capture and idle/hidden checks with no concurrent build/test.
- [x] Self-review only; run fresh `pnpm verify`, scoped public desktop E2E, diff/status. Update the durable progress record and ignored local Task 04 report with exact signatures, comparisons, budgets and limitations. Stop after 04.

**Task 04 verified handoff:** `journeyPathRequest` is also null while the existing owner is `departing`, including retries after history restoration. The one batch sorts after the transparent Vietnam cap with opacity 1; actual stroke-core contrast is 3.199:1 at zoom 8/10/11. Final gates: `pnpm verify` (926 unit / 8 hook tests, lint, strict types, history checks, 102 generated pages), 28 focused path/director/adapter tests, and 110/110 public desktop E2E (15 Task 04 cases). Final isolated 10-second capture: median 8.3 ms / p95 8.5 ms, zero continuing idle/hidden/disposed draws. See the progress audit and `.task-reports/2026-10-24-1604-explorer-refinement-task-04.md` for actual pixels, frozen signatures and remaining baseline server-log issue. Task 05 is unstarted. Stop after 04.

**Review focus:** Same stop ID across different journeys, reused/stale nonces after clear, coincident consecutive milestones and a later return to the same city, almost-antipodal routes, deep-zoom spherical depth versus coarse line chords, synchronous cancellation during progress, and hidden requests that finish instantly on return. Existing tests plus the new geometry/render/lifecycle cases own these conditions.

## Task 05 — Obtain and build 34-unit province geometry

**Model / risk:** GPT-6.1 Sol max, 5/5. **Dependencies:** none on journey content. **Files:** source audit/ledger, offline builder, province artifact/provenance/validator and integrity/topology tests.

- [x] Independent research: recheck the Government framework and signed code appendix, record all 34 code/relation identities, obtain a dated ODbL PBF, reproduce its research extraction twice, and add a rejecting source validator with 18 focused tests. See `docs/audits/2026-10-24-vietnam-province-source-ledger.md` and its two machine-readable source manifests.
- [ ] Read the review's rejected/conditional candidates. Reverify government membership and actual GIS rights. Obtain a complete timestamped source for the owner-selected 34 units, not a center list or old dataset labeled current.
- [ ] Prefer verifiable current source geometry. If using OSM, snapshot administrative relations/shared ways offline, verify 34 official-code matches, document data license/attribution and source IDs. Read-only service failure is not permission to invent geometry or scrape restricted data.
- [ ] Pin source/checksum, validate finite coordinates/valid parts/holes and complete administrative membership. Record source limitations and preserve the existing national/island coverage. A source count alone is insufficient.
- [ ] Build deduplicated interior province edges with source-aware topology, excluding repeated coast/national edges and unreviewed maritime claims. Shared relation way IDs can avoid artificial double edges; polygon sources need an appropriate offline topology tool. Document/review any tool addition; no runtime dependency by default.
- [ ] Test adjacent units share one stroke, lines stay in reviewed national context, unknown parts fail clearly, and builder output is deterministic. Record 34-unit metadata separately from line-feature count.
- [ ] Target province gzip ≤200 KiB, total geographic assets ≤800 KiB, ≤50,000 segments. Verify actual budget rather than deleting national/island data. Create the source/coordinate/topology ledger, run `pnpm verify` and handoff.

**Task 05 data-gate result (2026-10-24): BLOCKED.** The hash-verified Geofabrik extract at `2026-10-23T20:20:51Z` has all 34 relations but is missing 16 of 2,342 referenced ways, all in Khánh Hòa (`1887959`, code `56`), including inner ring way `1120240931`. The exact supplement query timed out. The other 33 units pass source-ring validity checks; that does not clear the incomplete unit. No production builder/artifact/provenance/parser or renderer is created. Research extraction determinism and diagnostic tests are not a completed province layer. Resume 05 only with complete source evidence; 06 remains outstanding.

**Stop:** If rights/currentness/coverage is unresolved, report the concrete missing evidence and keep province implementation outstanding. Do not start 06 on an unverified artifact. Other independent tasks can continue serially.

## Task 06 — Optional province layer integration

**Model / risk:** Gemini 3.8 Flash high, 3/5. **Dependencies:** verified 05 artifact/type contract and 02 local-depth behavior. **Files:** province helper, scene/canvas/adapter credits; optional-layer and four-size tests.

- [ ] Reuse the established optional country-layer loading/disposal pattern without copying its country-only classification validator. Keep core readiness independent.
- [ ] Attach one province line batch above Vietnam fill and below national outline, with CSS-pixel resolution/resize and true depth. Use the spec's subordinate width and sourced coverage; no global province labels or hit layer.
- [ ] Show a readable default Vietnam reference and useful local detail; keep foreign/world context quiet. Missing/invalid/late data retains Earth/events and cannot attach to a stale scene.
- [ ] Add the owner-approved modern-34 disclosure, actual source timestamp/license/attribution. Do not rename historical sites or change event coordinates from province membership.
- [ ] Verify 4 desktop sizes, zoom 8/10/11, overlaps with country/national/path layers, retry/context loss and repeated mount/disposal. Use existing frozen camera/path contracts; escalate a structural defect instead of rewriting them.
- [ ] Run focused optional-layer/contrast checks and `pnpm verify`, report costs and stop after 06.

## Task 07 — Source three additional grade-12 journeys

**Model / risk:** GPT-6.1 Sol max, 4/5. **Dependencies:** 03 registry; independent of a blocked province source. **Files:** three new modules in `lib/explorer/journeys/`, registry exports; source ledger/content tests.

**Task 07 execution brief (2026-10-24):** Execute the owner-dispatched content task inline on `codex/refinement-task-07`, preserving the dirty workspace. CodeGraph does not index the current journey modules; focused reads confirm Task 03's pair registry and Task 04's consumer contract. Keep the existing journey hash, types, camera, timer, path and reader unchanged. The owner authorizes this implementation; no new design/chooser approval is needed.

1. Read source passages directly and record per-stop date/claim evidence separately from coordinate provenance in `docs/audits/2026-10-24-additional-journey-sources.md`. Identify the publisher's series/edition and disclose any unavailable lesson/page evidence. Reuse existing published anchors; new city/region anchors must come from a named, pinned geographic record with an explicit limitation.
2. RED: add focused content tests through the real registry for the required IDs, four/five/four chronological stops, date/source/coordinate precision, lesson mapping, return to Hanoi with distinct venues, published-link allowlist and shared URL pair round trips. These tests validate local content contracts, not external historical truth. Preserve legacy hash assertions.
3. GREEN: add the three authored modules using the unchanged `HistoryJourney`/`JourneyStop` types and register only accepted data. No DB events/slugs or runtime dependencies. Use short original Vietnamese copy and explicit schematic/campaign limitations.
4. Recheck accepted passages and public inventory; self-review task-owned changes. Run focused journey suites, `pnpm history:data:check`, `pnpm verify`, and scoped shared-URL browser smoke checks against a fresh task-owned build. Record paused reload/manual navigation and published-only links.
5. Update Task 07 checkboxes and the durable progress audit with actual evidence, write the ignored local report, inspect diff/status, and stop. Tasks 05/06 blockers remain independent; Task 08 is not authorized.

**Review focus:** date of attack versus capture at Buôn Ma Thuột; a day milestone within a broad campaign; city coordinates never asserted as a building; Hanoi return preserved in authored order; event links justified by the current public inventory; curriculum topic mapping never promoted to page-level verification.

- [x] Check the project's Kết nối tri thức / 2024 series against readable publisher/official material. Record the unavailable exact printing/contents-page comparison and use supported topic navigation as authorized by the latest Task 07 request. Local curriculum comments remain; no textbook transcription/page verification is claimed.
- [x] Build a claim/coordinate ledger for the spec's four/five/four proposed stops. Record source institution/author, URL/access date/locator, date precision, geographical scope and uncertainty. Resolve campaign representative areas honestly; no fabricated dates or coordinates.
- [x] Paraphrase short original summaries. Reuse validated published venue anchors when appropriate; a city label source does not prove a historical site's exact coordinates. Preserve the Hồ Chí Minh content unless a separately evidenced correction is authorized.
- [x] Register `mua-thu-doc-lap-1945`, `khang-chien-chong-phap-1946-1954`, `mua-xuan-1975` only when their required claims/coordinates pass. Needs-evidence material remains outside the production registry with an exact blocker.
- [x] Verify stop order and precision, four journeys total, SGK mapping, pair uniqueness, repeat-Hanoi behavior, sources and published-only event links. Source-only editorial stops need no DB event creation.
- [x] Run content/registry/history checks, `pnpm verify`, record the accepted data contract/remaining issues and stop after 07.

## Task 08 — Journey choice and reading interface

**Model / risk:** Gemini 3.8 Flash high, 3/5. **Dependencies:** 03 callbacks/registry and 07 registered content. **Files:** `JourneyChooser.tsx`, reader/header integration/scoped CSS; chooser/fallback tests.

- [ ] Use the existing state owner's `onChooseJourney(id)` callback; do not create another journey store, timer, event bus or camera controller.
- [ ] Add a compact labeled four-option chooser in journey mode; show the selected period/description, stop list and active state. Use native HTML where practical, with meaningful GET/link fallback for no-JS.
- [ ] Preserve two primary modes, paused switching, source/manual navigation, focus return and internal scrolling. Display the 2 s status accurately; no new settings/dashboard is required.
- [ ] Test four desktop sizes, long Vietnamese titles, keyboard selection/Escape/focus, no-JS, shared links/reload/history, source-only stops and published detail return.
- [ ] Verify line/marker context matches the chosen journey and counts; run focused UI/contrast checks and `pnpm verify`. Stop after 08 without altering registry/controller semantics.

## Task 09 — Integration, regression and final evidence

**Model / risk:** GPT-6.1 Sol max, 5/5. **Dependencies:** all requested features complete, or clearly identify remaining blockers without claiming completion.

- [x] Inspect current task handoffs/code; verify rather than trust prior-model completion reports. Repair only demonstrated defects within this spec; no independent AI reviewer or broad rewrite.
- [ ] Run the full new feature matrix: 4 desktop sizes × default/local cluster/event card × 4 journey choices, plus no-JS/no-WebGL, optional country/province failures, reduced motion, source reading and actual 2 s post-arrival playback.
- [x] Test rapid journey switching/seeking/exit/popstate during flights; delayed detail navigation; group-to-single-to-card focus; near/far-side and route seam; local scale/line offsets at zoom 11 and old bookmarks >11.
- [x] Measure actual served asset/bundle/buffer/draw cost, current 10-second flight frames and settled/hidden/disposing behavior in an uncontended window. Retain the spec's budgets or report a failing required gate; do not use P6/B3 measurements as current proof.
- [x] Run selected safe public desktop E2E plus new tests and `pnpm verify`. Inspect notices, historical source ledger, task-owned diff/status and protected files. No mutation-oriented unrelated E2E on a connected live service.
- [x] Write final feature audit, update verified task checks/progress and required ignored report. Deliver exact evidence/absolute screenshots, deferred items and limitations. Stop after 09; no external publication.

**Task 09 result (2026-10-24): partial / blocked, not complete refinement.** The full-feature matrix checkbox stays open because the production province source/geometry is absent. Current browser coverage passed 111 required + 40 supplemental cases with fresh build `0tTQwPm2Is4l8A6UZNivt`; `pnpm verify` passed 979 unit + 8 hook/setup tests. Reproduced parser validation and optional post-subdivision overrun defects were repaired without changing completed camera/journey/path contracts or budgets. Source/measurement/console/server limits and exact artifacts are in the final acceptance audit. No later task is automatically authorized.

## Verification and handoff

Do not run new test filenames before their task creates them. Suggested focused files: `explorer-cluster-expansion.test.ts`, `explorer-journey-registry.test.ts`, `explorer-journey-playback.test.ts`, `explorer-journey-path.test.ts`, `explorer-province-boundaries.test.ts`, `explorer-journey-content.test.ts`; E2E `home-explorer-refinement.spec.ts` and `home-journey-choices.spec.ts`. Preserve meaningful current camera/state/overlay/country tests, updating obsolete 5.4/eight-second expectations to the new documented behavior.

Final gate after a fresh local build:

```powershell
pnpm verify
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts --workers=1
git diff --check
git status --short
```

Default browser target is localhost:3100; confirm build/process ownership or use a task-owned port through `E2E_BASE_URL`. Do not stop the owner's localhost:3000 server. Full unfiltered `pnpm test:e2e` is conditional on an isolated authorized target because unrelated suites may mutate services or test deferred mobile scope.

Each task updates the durable progress audit with verified API/decision/evidence, not entire logs. Each also creates `.task-reports/YYYY-MM-DD-HHmm-explorer-refinement-task-NN.md`; keep it ignored/unstaged. Screenshots go under `output/playwright/explorer-refinement/task-NN/`.

Default order: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09. If 05 is blocked on data, 07 can proceed after 03; 06 remains blocked, and 09 cannot declare the whole request complete until the province requirement is resolved. Model switches are manual and serial. No prompt authorizes silently skipping an unmet requirement.
