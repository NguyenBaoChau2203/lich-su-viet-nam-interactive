# P5 cinematic intro and authored journey

## Mission and authority

Implement only Phase 5: finite world-to-Vietnam entry and interruptible geographic flights through the existing seven sourced milestones. The owner's P5 request, shared execution contract, accepted cinematic visual direction, Phase 5 of the cinematic plan and P4 neutral boundary govern this task. Stop before P6.

## Verified starting state

- P4 has one scene flight owner and an adapter revision guard for asynchronous settlements. The scene's absolute flight clock currently runs across hidden time; the integrated adapter does not cancel on route departure or visibility changes.
- The intro is 3400 ms, but its skip button still starts a 1000 ms flight. Session/restored/selection/journey/reduced-motion suppression already exists and needs retained regression coverage.
- Every journey flight currently takes 3000 ms. Interpolation turns and zooms simultaneously; there is no deliberate pull-back/turn/approach separation.
- `HistoryExplorer` owns playback, eight-second post-arrival reading, navigation protection and restoration. Preserve that owner. Existing reading-copy animation is 180 ms with reduced-motion override and needs no additional engine.
- CodeGraph was tried first but returned unrelated indexed camera symbols; current cinematic symbols are absent. Focused direct reads were used without reindexing. Installed Next.js client boundary and lazy-loading guides were read; Three r186 documentation was consulted through Context7.
- The dirty feature workspace is preserved as required by the shared contract. Task-start source copies and protected historical/state/dependency hashes are under ignored `output/prototypes/cinematic-globe/p5-before/`.

## Constraints and implementation decisions

- One agent implements, tests and explicitly self-reviews inline. No subagents, staging, commit, external writes or service changes.
- Preserve dates, coordinates, authored zooms, order, precision notes, publication rules, URL shape, P4 fallback/accessibility behavior and the existing playback owner.
- One on-demand render loop samples one generation-controlled flight director. The adapter guards settled geographic/arrival callbacks; no competing animation loop.
- Use great-circle geographic targets, never a straight camera chord through Earth. Long flights pull back, turn at a world context scale, then approach; local flights use limited pull-back and shorter duration. Intro remains 3400 ms, starts at the accepted world preset and skips immediately.
- Hidden state cancels old physical work and invalidates completions. On return, the latest still-requested useful target settles instantly and playback stays paused. Runtime reduced motion also finishes only the current intent instantly. A manual input, restore, departure or unmount discards pending work entirely.
- Keep the existing 180 ms reading-copy entrance and reduced-motion rule. No canvas fades, new assets, dependencies, biography or P6 benchmarking.

## Implementation plan

- [x] Task 1 — Add red path/duration and lifecycle regressions; verify the failures. Implement staged spherical paths and a testable single scene flight director. Verify newest-only, exactly-once completion, instant changes, cancellation, visibility and disposal.
- [x] Task 2 — Connect adapter visibility/motion/departure cancellation and immediate intro skip. Add real-browser regressions for interruption, seeking, hidden return, runtime motion, route departure and restored physical camera/URL after the full canceled duration. Retain existing playback/source/navigation regressions.
- [x] Task 3 — Run focused unit checks, `pnpm verify` and all three safe public homepage browser suites on a fresh task-owned production target. Capture overseas travel and return at desktop sizes, inspect real browser/backend and review task-owned diffs/protected hashes. Record results and local report; stop at P5.

## Interface checks and review focus

- Task 1 scene promises feed Task 2 adapter arrival; cancellation must resolve once without settlement, and a callback that restores/replaces an intent must suppress its now-stale arrival.
- Task 2 visibility must cooperate with canvas rendering suspension and owner playback pause; hidden time must not advance a flight or reading timer. Newer hidden seeks and manual cancellation must replace/discard the pending target.
- Delayed departure must cancel animation/input timers without a URL write that cancels the route. Popstate may reactivate the existing mounted explorer.
- Retry and runtime motion changes must not replay a consumed focus, completed intro or settled manual view.
- Author review is self-review, not an independent review. No historical source reclassification or new source claim is authorized.

## Verification and deliverables

Required: red-to-green path/cancellation evidence; fresh focused unit results; `pnpm verify`; `pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1`; `git diff --check`; `git status --short`; protected hash comparison. Browser evidence must identify browser/backend and desktop viewports without claiming universal smoothness. Store captures in `output/playwright/cinematic-globe/phase-5/` and logs/harnesses under `output/prototypes/cinematic-globe/`. Write an ignored local P5 report with absolute links and clearly report failures or omitted scope. Do not begin P6.

## Evidence and results

Task-start baseline: four focused unit files / 50 tests passed. New red coverage reproduced simultaneous turn before world context and a stale arrival after a settlement subscriber restored another view; the duration/visibility/finish APIs and physical director were initially absent. `p5-unit-red.log` records six failing assertions plus the missing director module. The first green attempt exposed floating-point `acos` distance on identical locations; duration now uses the stable `atan2(cross length, dot)` angular distance. Seven focused files / 92 tests pass (`p5-unit-green.log`).

Four real-browser regressions were reproduced against the task-owned production baseline on port 3225: the skip action exceeded its 600 ms settlement window, runtime reduced motion left the world control flying, a hidden newer seek failed to settle on return, and a physical canvas kept changing during a held detail response. The first exploratory browser run also contained incorrect rounded-coordinate and timeline-label fixtures; those were corrected to the existing `toFixed` URL representation and `Bến Nhà Rồng` timeline label. The corrected hidden/departure red run fails on the intended behavior (`p5-browser-red-corrected.log`), independently of those fixtures. Baseline build passed; no baseline-pass claim is made for new assertions.

Implementation now keeps a current adapter intent across visibility suspension while invalidating its old physical generation. Return finishes only that current intent instantly; a newer seek replaces it and manual/restore/departure/unmount discards it. Reduced-motion changes finish the current intent without rerunning consumed requests when motion is enabled again. Route departure clears physical travel and pending input settlement while retaining the owner's navigation guard. Intro skip jumps immediately and focuses the canvas. Historical registry, playback owner, neutral contract and existing 180 ms reading-copy motion are untouched.

The first `pnpm verify` stopped at lint on two redundant synchronous intro-state updates in effects. Those updates and their now-unused transient ref were removed; existing declarative selection/restore conditions already suppress the button. The subsequent complete gate passes: five project skills, 42 history checks, ESLint, strict TypeScript, 67 unit files / 853 tests, eight hook tests and production build 102/102 pages. Full log: `output/prototypes/cinematic-globe/p5-verify.log`.

With `E2E_BASE_URL=http://localhost:3225`, against that freshly built production target:

```powershell
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1
```

**49/49 passed in 247.72 seconds; zero skipped, flaky or unexpected results.** Logs and JSON: `output/prototypes/cinematic-globe/p5-home-e2e.log` and `p5-home-e2e.json`. Existing filter/group/keyboard, source precision, published-only detail/return, shared paused journeys, delayed navigation, retry/no-WebGL/no-JS and far-side behavior all pass. Exit/popstate assertions now wait 4000 ms, exceeding the maximum 3600 ms canceled flight plus URL debounce, and compare the physical projected marker with its saved position within one CSS pixel.

The browser measured the finite intro at **3404.5 ms** using DOM visibility marks at 1440×900; a one-second exact canvas comparison confirms the settled image remains still. Immediate skip and runtime motion-control tests settle within their 600 ms windows, including the existing URL debounce. The reading regression waits 7300 ms after intercontinental arrival and remains at Marseille, then observes the next stop and confirms pause prevents further advancement after another 8500 ms.

`node output/prototypes/cinematic-globe/verify-p5-extra.mjs` also passes with zero JavaScript errors: reduced motion during an actual journey flight settles at Marseille; a subsequent manual view survives motion opt-in and 4000 ms; hiding a current flight without a newer seek holds its URL and returns instantly to Moskva in paused state. It captures the existing authored Moskva → Pác Bó return and its exact settled `22.96667,106.05,7` view. Browser hidden-state tests dispatch controlled visibility events with both visibility properties updated; they are not a claim of coverage for every native OS/browser background lifecycle.

## Files and visual evidence

Production changes: `lib/explorer/cinematic/camera.ts` (path/duration), new `flight.ts` (one physical director), `scene.ts` (samples the director in its existing loop), `camera-controller.ts` (current intent, cancellation, visibility and exactly-once arrival), and `components/explorer/cinematic/CinematicEventMap.tsx` (intro, request and lifecycle wiring).

Tests: `tests/unit/explorer-cinematic-camera.test.ts`, `explorer-globe-camera-controller.test.ts`, new `explorer-cinematic-flight.test.ts`, `tests/e2e/home-globe.spec.ts` and `home-cinematic-globe.spec.ts`. This audit records the implementation plan and evidence. Ignored harnesses/logs/captures and the local report are not staged or committed.

Ten flight captures are under `output/playwright/cinematic-globe/phase-5/`: outbound/return context and arrival at 1280×720 and 1440×900, plus `moscow-pac-bo-context-1440x900.png` and `moscow-pac-bo-arrival-1440x900.png`. All were visually inspected inline. Long-flight context shows Europe and Vietnam on the planet with readable panels; final markers retain approximate-location labels and the authored scale. Retained shell tests pass all four desktop viewports (1280×720, 1366×768, 1440×900, 1920×1080). Backend/timing records are next to the captures.

Browser/backend: Microsoft Edge / HeadlessChrome 155 on Windows x64; WebGL 2; ANGLE, Intel UHD Graphics (0x00009A68), D3D11; DPR 1. This is behavior and visual evidence on that setup. No universal smoothness, FPS, transfer/memory budget or final P6 performance claim is made.

## Self-review, limits and stop boundary

`node output/prototypes/cinematic-globe/review-p5.mjs` confirms all 12 protected historical/state/contract/geography/dependency files retain their task-start SHA-256, and the index is empty. The implementation author reviewed the 842-line task-owned diff plus new source/tests and this audit directly. This is self-review, not an independent review. `git diff --check` passes with pre-existing line-ending notices; `git status --short` was inspected and saved as `p5-git-status.txt`. No critical/important P5 finding remains.

The task-owned server logged four `The destination stream closed early` notices (digest `3840477093`), matching the pre-existing P4 baseline. All 49 browser tests pass; no clean-server-log claim is made. Global 4096×2048 imagery remains soft at the unchanged authored close zooms (including Sài Gòn 6.4 and Pác Bó 7). P5 preserves those presets and has not changed imagery, material or geography to disguise that existing limit.

No database/content/publication or dependency change; no new biography/media/stops; no GSAP, canvas fade or persistent rotation; no staff/payment/account mutation suites; no mobile/tablet, Firefox/Safari or native OS background-lifecycle certification. P6 final visual acceptance and performance scope remain unstarted. No staging, commit, push, PR, deployment or publication.

P5 is complete. The ignored local handoff report is `.task-reports/2026-10-24-0119-cinematic-globe-phase-5.md`. Stop at P5.
