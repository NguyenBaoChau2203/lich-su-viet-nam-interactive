# P6 cinematic globe acceptance

## Mission and authority

Audit only the integrated P0–P5 cinematic desktop homepage against the shared contract, visual spec, concept PNG, accepted P1 prototype and Phase 6 checklist. Correct demonstrated acceptance defects only. Preserve historical content, the dirty feature workspace and external services. Stop at the local P6 handoff.

P2 records the owner's actual P1 decision on 2026-10-23: “Tôi chấp nhận P1; tiếp tục P2”. The saved P1 images are the accepted visual evidence; a self-review score or a new render is not new owner approval.

## Verified starting state and rulings

- P0 asset manifest/baseline, P1 prototype images and P2–P5 audits, source and tests exist on disk. P5 reports 49 selected public browser cases, not the entire E2E suite.
- CodeGraph was attempted first. It does not index the current cinematic files; focused direct reads were used without reindexing.
- Keep `codex/3d-map-design` and its tracked/untracked changes. Capture task-start hashes and status; do not stash, reset, stage or commit.
- Read installed Next 16.3.8 client/server and lazy-loading guides. Keep the existing server query and dynamic renderer boundary.
- P1 has saved accepted captures at 1280×720 and 1440×900 only. Compare all four final sizes to those originals with their dimensions disclosed; do not label newly generated sizes as owner-accepted P1 images.
- P1's CPU submission/`gl.finish` timings are not sustained GPU benchmarks. P6 will measure actual WebGL draw-bearing frames and use asynchronous GPU timer queries if the backend exposes them, with unsupported measurements explicitly reported.
- Global 4K imagery is already known to soften at authored journey/legacy close zooms. Check useful event selection and report that limit without changing authored geography or silently clamping bookmarked views.
- Existing `The destination stream closed early` / digest `3840477093` server notices must be counted separately from new errors.

## Bounded execution checklist

- [x] Capture world/default/card/journey/closest useful event zoom/reduced motion at 1280×720, 1366×768, 1440×900 and 1920×1080. Inspect source geometry bounds, selected marker visibility, limb, material and comparison images.
- [x] Check real DOM bounds, hit testing, keyboard/focus, cluster/list/source reading, scrolling, contrast and non-homepage navigation. Retain no-JS/no-WebGL/loading/error/retry behavior.
- [x] Measure cold/warm asset transfer and readiness, actual production lazy chunks and gzip, texture allocations/mipmaps, repeatable ten-second flight frames, idle stop, hidden pause and repeated disposal with backend/DPR/hardware/method recorded.
- [x] Recheck local asset hashes, dimensions, rights and code notices. Make targeted fixes only with reproduced evidence and appropriate regression coverage.
- [x] Run fresh history checks, unit tests, the three inspected read-only public desktop homepage E2E files plus four new P6 cases and `pnpm verify`. Full account/staff/payment/mutation and mobile suites are excluded.
- [x] Self-review task-owned diff/status and protected hashes; update only evidenced P6 plan checks. Write the ignored local report and stop.

## Acceptance result — 2026-10-24

The bounded local P6 acceptance package passes its fresh behavior, visual score, desktop layout, accessibility repair, renderer-budget and verification gates on the recorded laptop/browser configuration. Visual self-review is **11/12 at each of the four desktop sizes**, with no zero. This is the implementation author's self-review, not independent review or a new owner approval. The saved P1 decision remains the owner approval of the rendering direction.

The 4K texture remains visibly soft near event/journey locations. The globe is useful for event orientation and selection, not street/site inspection. Material-detail parity is scored partial; do not describe the renderer as a pixel-identical reproduction or a full-product launch certification. Whole-homepage JavaScript also slightly exceeds 800 KiB when unrelated Next/React/shared code is included; see the explicit scope and figures below.

## P0–P5 dependency audit

| Phase | Current evidence checked in P6 | Remaining qualification |
| --- | --- | --- |
| P0 | All three image dimensions, bytes and SHA-256 match `assets.provenance.json`; original geographic assets remain unchanged; publisher permission and Natural Earth terms re-opened. | Modern/generalized geography and seasonal imagery are not historical reconstruction. |
| P1 | P2 audit records the actual owner response; original accepted overview/world/close captures remain on disk. Current default presets, images and materials preserve that direction. | Accepted original image sizes are only 1280×720 and 1440×900. Old P1 frame/submission counters are not reused as GPU evidence. |
| P2 | Current projection/overlay/geography logic and source integrity tests pass; four-size sourced-mainland projections and real DOM hit tests pass. | Natural Earth precision, source islands, approximate locations and the Versailles caveat remain unchanged. |
| P3 | One `main`, one `h1`, 60 px masthead, usable left reading area, one right reader/guidance panel and thin bottom rail. Fresh four-size bounds and screenshots pass. | Real filters/list/search/study access add necessary HTML compared with the P1 preview scaffold. |
| P4 | Fresh public browser tests cover groups, real camera input, filters, legacy views, selection, detail/return, reload/history and delayed navigation. | No external mutation or unrelated account/payment/staff test is included. |
| P5 | Fresh tests cover finite intro/skip, hidden/motion/departure cancellation, rapid seeks, restoration after full canceled-flight duration and arrival-before-reading timing. | Controlled visibility events exercise application behavior, not every native OS background lifecycle. |

## Four-size visual evidence

All final originals are CSS-scale screenshots at browser DPR 1 under the absolute directory:

`D:/lich-su-viet-nam-interactive/output/playwright/cinematic-globe/phase-6/`

For **each** of 1280×720, 1366×768, 1440×900 and 1920×1080 there are `world`, `default`, `card`, `journey`, `closest-useful-zoom` and `reduced-motion` PNG/DOM-JSON pairs: **24 required originals**. Additional `event-list`, `journey-sources` and `source-credits` pairs make **36 matrix captures**. Supplemental last-source keyboard and fallback/retry images are separate.

[Absolute screenshot index](../../output/playwright/cinematic-globe/phase-6/screenshots.md) lists all 24 required originals and the eight comparison/contact boards. `screenshot-paths.json` is the corresponding absolute-path inventory. Comparison boards letterbox rather than crop or stretch the reference. The 1280×720 accepted P1 original is used for the 1366×768 and 1920×1080 comparison; it is not relabeled as an accepted prototype render at those sizes.

| Criterion (0 absent / 1 partial / 2 meets explicit target) | 1280×720 | 1366×768 | 1440×900 | 1920×1080 | Self-review observation |
| --- | :---: | :---: | :---: | :---: | --- |
| Camera / planetary scale | 2 | 2 | 2 | 2 | Large cropped sphere and upper/right curved limb in the settled default; complete sphere in world mode. |
| Material / surface detail | 1 | 1 | 1 | 1 | Real label-free terrain, subdued slate/olive land and navy ocean; less fine detail than the concept and soft at close zoom. |
| Atmosphere / directional light | 2 | 2 | 2 | 2 | Thin blue-white true limb, directional lighting and sparse procedural stars preserve P1's accepted treatment. |
| Vietnam / geographic alignment | 2 | 2 | 2 | 2 | Sourced flush tint/outline, terrain visible through tint, source islands retained, no invented concept geography. |
| Composition | 2 | 2 | 2 | 2 | Masthead, left serif heading, right guidance/reader and light bottom rail fit; real event list and controls remain usable. |
| Readability / access | 2 | 2 | 2 | 2 | Repaired text/dot contrast, measured collision layout, visible focus, keyboard/source/list/fallback paths. |
| **Total** | **11/12** | **11/12** | **11/12** | **11/12** | Meets ≥10/12 with no zero; not an automated image-similarity score. |

At 1440×900, the source mainland projects to **x=580.18–714.51, y=241.17–492.26 CSS px** (40.29–49.62% width, 26.80–54.70% height), within the specified x=36–62%, y=20–72% reading region. Projected Earth diameter is **1545.54 px**, exceeding the 900 px viewport. The same assertions pass all four sizes; full geometry/horizon points are in `geography-<size>.json`.

Explicit visual differences: source geography differs from the generated concept; no copied international borders or invented islands; real clusters/approximate rings are larger than decorative reference dots; labels now have a restrained dark backing for contrast; the real shell includes event count/list/filter/source controls; the heading wraps to three lines at 1920×1080, within the 2–3 line target. Close imagery at selection zoom **5.4**, authored Sài Gòn **6.4**, Pác Bó **7**, and larger legacy/manual zooms is soft. P6 does not change authored stops/bookmarks or add a new imagery level to disguise that existing limit.

## Accessibility, hit testing and fallbacks

- `visual-matrix.json`: all four sizes pass page fit, visible control bounds, zero control intersections, rail-height limits, real marker center hit testing and 32 px targets. Far-side pins are absent from both DOM and hit paths while HTML links remain.
- Twelve axe runs (default/card/journey × four sizes) record zero WCAG-tagged violations. Axe cannot resolve every contrast check against a WebGL background; those incomplete results are supplemented, not treated as automatic passes.
- `contrast-before.json` records the reproduced 2.37–4.35:1 label failures. `contrast.json` measures actual composited screenshot pixels after repair: minimum map-label contrast **11.90:1**, minimum sampled small text **5.10:1**, and all sampled large text above 3:1. It excludes inactive controls and measures captured glyph interiors rather than anti-aliased edge pixels. These measurements cover the recorded states, not every possible arbitrary pan.
- The four durable P6 E2E regressions independently require ≥4.5:1 for rendered labels and ≥3:1 between the 8 px event dot and its immediate edge. They also require named control groups. The prior named-generic-div ARIA incomplete items are absent after the role fix.
- Keyboard: skip link → main, cluster open/dismiss with focus return, selection → heading → Escape → valid origin/list, last event-list action, last expanded source link, then detail link via Tab. Expanded readers scroll within the viewport; wheel over reading content does not zoom the map. `extra-behavior.json` records all four last-source/detail paths.
- Reduced motion uses instant manual camera/stop changes and disables autonomous journey playback. Runtime motion changes, delayed route navigation and stale-flight restoration remain covered by the retained public E2E tests.
- Fresh no-JS, no-WebGL, missing-image and event-data failure captures are `fallback-<mode>-1280x720.png`; `retry-restored-1280x720.png` shows recovery with one canvas. Missing imagery/no-WebGL retain readable published event links and manual authored journey reading. Deliberately induced console/network errors are categorized in `extra-behavior.json`; normal matrix captures record zero console warnings/errors and zero uncaught page errors.
- A representative study/detail route retains the shared non-homepage header; search/menu Escape and focus paths pass the retained browser cases. No-JS source and journey HTML are preserved.

## Measurement configuration and method

Recorded machine: **MSI GF63 Thin 11UD**, **Intel Core i5-11400H @ 2.70 GHz**, six cores / twelve logical processors, approximately 16 GB RAM (16,850,272,256 physical bytes). Windows x64; Microsoft Edge / HeadlessChrome **155.0.0.0**. Actual WebGL backend: **WebGL 2.0, ANGLE Intel UHD Graphics (0x00009A68), D3D11**, Intel driver **32.0.101.7088**. The installed RTX 3050 Ti is not the backend used by these runs.

Target: fresh local Next **16.3.8 production** server, `http://localhost:3226`, using configured public server queries in read-only flows. No database mutation or environment/credential inspection. Browser cache is explicitly cleared for the cold sample; two normal reloads are warm. Server/data caches were already warm from browser verification. No network/CPU throttling is emulated. Readiness means the actual scene's `data-ready=true` after loading/first render, not a universal LCP/TTI guarantee.

Frame tests use **DPR 1.5 at all four CSS sizes**, three repetitions each. A separate DPR 2 check confirms the renderer caps at 1.5 (1440×900 CSS → 2160×1350 buffer). Each 10,000 ms window alternates the existing Sài Gòn/Marseille requests at 0/3000/6000/9000 ms. This keeps the real integrated director, rendering, projection and HTML overlay updates active. No other test/browser/build runs concurrently during the timed final measurements.

The local probe counts only requestAnimationFrame callbacks that actually issue WebGL draws; it does not count compositor-only ticks as rendered globe frames. GPU elapsed diagnostics use asynchronous [Khronos EXT_disjoint_timer_query_webgl2](https://registry.khronos.org/webgl/extensions/EXT_disjoint_timer_query_webgl2/) around draw-bearing callbacks, reject disjoint samples and never call `gl.finish`. CPU callback time and GPU command elapsed time remain distinct in the raw records. This is repeatable ten-second evidence on one setup, not long-duration thermal/power or multi-GPU certification.

## Transfer, memory and JavaScript budgets

| Metric | Final evidence | Spec provisional limit | Outcome |
| --- | ---: | ---: | --- |
| Initial images, compressed payload | 812,259 B / 793.22 KiB | ≤3 MiB | Pass |
| Initial images, CDP wire count incl headers | 815,783 B / 796.66 KiB | ≤3 MiB | Pass |
| Geography, served gzip payload (three files) | 454,423 B / 443.77 KiB | ≤500 KiB | Pass |
| Geography, wire count incl headers | 458,529 B / 447.78 KiB | ≤500 KiB | Pass even including headers |
| Texture estimate, RGBA8 plus full mip chains | 64.00 MiB, plus negligible 1 px defaults | ≤96 MiB | Pass |
| Added geographic helper chunk, served gzip | 352,587 B / 344.32 KiB | ≤400 KiB | Pass |
| Full cold globe graph incl Three, state owner, adapter, scene and helper (six chunks) | 565,530 B / 552.28 KiB served gzip; 550.48 KiB normalized gzip-9 | ≤800 KiB | Pass |
| Rendering engine/Three/helper subset (four chunks) | 543,852 B / 531.11 KiB served gzip; 529.32 KiB normalized gzip-9 | Disclosed subset, not “free” installed Three | Included above |

For transparency, the **entire homepage** loads **823,190 B / 803.90 KiB of compressed JS bodies** including Next/React, shared shell/search and globe code (801.51 KiB normalized gzip-9). An interpretation applying the 800 KiB cap to the entire page, rather than the specified globe graph, would exceed it by **3.90 KiB served** or **1.51 KiB normalized**. That stricter whole-page limit is not claimed as met. No unrelated framework/search refactor was made to conceal this distinction. The exact served graph and whole-page totals are recorded in `performance.json` and `budget-summary.json`.

The three actual image uploads are 4096×2048, 2048×1024 and 2048×1024; material reuse does not duplicate their GPU allocation. Exact per-level decoded estimates and local hash/dimension checks are in `assets-and-notices.json`. This is a conservative texture allocation estimate, not a measurement of total driver VRAM, framebuffers, process memory or JS heap.

| Browser-cache state | Scene readiness | Image CDP wire count | Geography CDP wire count | JS CDP wire count |
| --- | ---: | ---: | ---: | ---: |
| Cold | 1708.4 ms | 815,783 B | 458,529 B | 846,815 B incl headers |
| Warm reload 1 | 747.8 ms | 3,405 B | 3,404 B | 0 B |
| Warm reload 2 | 715.5 ms | 3,405 B | 3,404 B | 0 B |

Warm images revalidate with 304; geography is served from a revalidated browser cache representation. Resource Timing uses its standardized 300 B header accounting while CDP reports actual response wire counts, so those totals intentionally differ. Cached `encodedBodySize` metadata is not a warm download. Localhost readiness is not a WAN promise; no explicit readiness-time threshold exists in the visual spec.

## Camera frames, idle, hidden and disposal

All twelve final flight windows pass **median ≤33.3 ms and p95 ≤50 ms**. Ranges below are across the three complete repetitions, not a selected best run.

| CSS viewport / DPR 1.5 | Rendered frames per 10 s run | Median frame interval | p95 frame interval | GPU-command elapsed p95 (diagnostic) |
| --- | --- | --- | --- | --- |
| 1280×720 | 1196 / 1196 / 1200 | 8.3 ms | 8.5 ms | 5.62–5.72 ms |
| 1366×768 | 1158 / 1138 / 1148 | 8.3 ms | 8.5–16.5 ms | 6.22–6.39 ms |
| 1440×900 | 972 / 967 / 970 | 8.4 ms | 16.7 ms | 7.34–7.52 ms |
| 1920×1080 | 635 / 686 / 687 | 16.6 ms | 16.8–25.0 ms | 10.13–11.00 ms |

Final raw GPU samples have zero disjoint/pending/impossible-duration results. One preliminary pre-repair run returned an impossible ~960,768 ms timer result despite an unset disjoint flag; it remains preserved under `before-accessibility/` and `performance-first.json` and is not used as the final benchmark. The P1 report's CPU submission numbers labeled as GPU time are not comparable to these query results. The normative spec gate is the rendered-frame interval, not the separate informal P1 GPU-time table.

- **Idle:** each size records **0 WebGL draws, 0 rAF callbacks, 0 pending rAF** over 1500 ms after settlement.
- **Hidden:** controlled hidden state records **0 draws, 0 rAF callbacks, 0 pending rAF** over 4000 ms; URL is held and the latest target resumes as paused Marseille. Native OS background scheduling is not certified.
- **Five SPA mount/dispose cycles:** exactly one live/connected context while mounted, zero after navigation to the study route. Per scene, all three image textures, 17 buffers and six programs receive explicit deletion. Four Three-owned 1 px placeholder handles are reclaimed with actual context loss. Old contexts remain lost; no second live scene appears.
- Canvas listeners are empty after each disposal; document/media/window listener counts remain constant across the five cycles. The probe retains old references for audit, so these records are not used to claim a JS heap leak measurement. `lifecycle.json` also confirms the DPR 2 cap.

## Sources, credits and protected content

All local Earth image bytes/dimensions/hashes match the P0 manifest. [Solar System Scope / INOVE](https://www.solarsystemscope.com/textures/) still supplies the image set under CC BY 4.0; [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/) still place its geographic data in the public domain. Recheck date: 2026-10-24; acquisition dates and transformations are preserved.

`ATTRIBUTION.md` now accurately describes integrated use of three-globe 2.45.6 and the one npm Three 0.186.1 instance, separates image/data rights from MIT code/example references and records installed copyright notices. Installed Three, three-globe and transitive geometry MIT notices were inspected and hashed. No texture replacement, new asset download, dependency, external service, historical prose, source classification or authored itinerary change was made. Original code-adaptation headers remain intact.

## Fresh verification and failed-attempt accounting

1. `pnpm verify` before repair — passed; baseline was green despite the composited-contrast defects.
2. `pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1` with local `E2E_BASE_URL` — **49/49 passed** before repair, not the whole repository E2E suite.
3. New `home-cinematic-acceptance.spec.ts` — **4/4 failed against the old production build** on the intended contrast/named-group assertions. A focused 1280×720 red run also reproduces dot-edge contrast **1.56:1**. Logs: `p6-accessibility-red.log`, `p6-accessibility-red-with-dots.log`.
4. Narrow geometry/overlay integrity check — **3 files / 34 tests passed**. A first post-edit full gate stopped at TypeScript in the new test's DOM cleanup; the test was corrected to remove its temporary style through `parentNode`.
5. Final `pnpm verify` — **passed**: agent setup (five project skills), **42 history checks**, ESLint, strict TypeScript, **67 unit files / 853 tests**, **eight hook tests**, production build **102 pages**. Full log: `output/prototypes/cinematic-globe/p6-verify-final-2.log`.
6. Final read-only public desktop command, against that fresh production build:

   ```powershell
   $env:E2E_BASE_URL='http://localhost:3226'
   pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts --workers=1
   ```

   **53/53 passed**, 265.7 seconds, zero skipped/flaky/unexpected tests. JSON/log: `p6-home-e2e-final.json` / `p6-home-e2e-final.log` under `output/prototypes/cinematic-globe/`.
7. `capture-p6.mjs`, `contrast-p6.mjs`, `extra-p6.mjs`, final `measure-p6.mjs`, `lifecycle-p6.mjs`, `audit-p6-assets.mjs` — passed with the evidence and limitations above. Initial capture harness assumptions about Escape focus and asynchronous keyboard scrolling were corrected; old logs remain. The initial disposal-counter failure is explained below, not hidden.
8. `git diff --check`, explicit task-owned whitespace/hash/diff review and `git status --short` — inspected for handoff. No files are staged. The task-start source reconstruction matches saved SHA-256 before producing diffs; no comparison to an incomplete HEAD is substituted.

`pnpm verify` excludes browser E2E. Full `pnpm test:e2e` was intentionally not run: other files include mobile, account/staff/payment and external mutation scenarios, outside the authorized isolated read-only target. No claim that all repository E2E tests passed is made. Expected NO_COLOR/FORCE_COLOR runner warnings and pre-existing server stream-cancellation notices are recorded separately in the final log summary; no clean-server-console claim is made.

Server log inspection counted **five** known stream-close notices before repair and **seven** on the final production target, all digest `3840477093`; the temporary red-test server recorded zero. No other `Error:` line was found in those task-owned server logs. These notices match the P0–P5 navigation/context teardown baseline. The final task-owned server was closed after verification; no user server was stopped. See `server-log-summary.json`.

## Changed files, self-review and stop boundary

Task-owned product changes are only `components/explorer/explorer-map.css`, `components/explorer/cinematic/CinematicEventMap.tsx` and `components/explorer/MapTimeControls.tsx`. The durable browser regression is `tests/e2e/home-cinematic-acceptance.spec.ts`; documentation changes are this audit, the evidenced P6 plan checkboxes and `public/maps/globe/ATTRIBUTION.md`. Harnesses, screenshots, baseline snapshots, logs and the local handoff report remain ignored and unstaged.

Self-review checked actual task-owned diffs including untracked source, the new browser test, server/client boundaries, accessibility, protected hashes, notices and failure accounting. No feature/data/schema change, renderer redesign or new import/dependency was introduced. No independent AI reviewer was used. Historical registries, geo sources, publication/return/navigation logic, accounts/exams/payments, Word reports and environment files were preserved.

Deferred: mobile/tablet, Firefox/Safari, multiple GPU/driver systems, native OS background lifecycle, long thermal/power runs, regional imagery/detail levels, broader MVP historical-content completion, any whole-page-800-KiB optimization and external release. Existing stream-close logs remain a known framework/navigation observation. Stop at **P6 local handoff**: no stage/commit, push, PR, merge, deployment, publication or database mutation.

Absolute local handoff report: `D:/lich-su-viet-nam-interactive/.task-reports/2026-10-24-0222-cinematic-globe-phase-6.md`.

## Demonstrated defects and targeted repair plan

The first four-size composited screenshot contrast audit found small map labels at 2.37–4.35:1 over gold terrain, below 4.5:1. Axe reported these WebGL-backed nodes as incomplete rather than violations. It also flagged named generic `div` elements (`home-map-tools`, `home-map-ticks`) for manual ARIA review. Add a restrained dark label backing whose measured dimensions participate in existing collision layout, and give the two actual control collections `role="group"`. Add a real-browser screenshot contrast/named-group regression, observe it fail on the existing production build, then apply these three local fixes and rerun the full visual/behavior/verification evidence. Historical records, camera presets and materials remain outside this repair.

Adjacent-pixel inspection also found the Huế event dot below 3:1 against nearby gold terrain at the two smaller sizes (minimum about 1.61:1 at a 10 px sample radius). The browser regression reproduces sub-3:1 contrast at the actual immediate edge (5 px radius). Add only a 2 px dark edge around single 8 px dots; retain the 32 px target, approximate rings and cluster styling.

The first performance harness completed all twelve flight samples and four idle checks, then stopped on an overstrict assumption that every WebGL texture must have an explicit `deleteTexture` call before context loss. Separate five-cycle inspection confirms Three's four context-owned placeholder handles are released by context destruction; the three image textures, all 17 buffers and six programs are explicitly deleted, zero contexts remain live, and listener counts stay constant. Preserve the original failed harness log and raw counters; do not label it an application leak.
