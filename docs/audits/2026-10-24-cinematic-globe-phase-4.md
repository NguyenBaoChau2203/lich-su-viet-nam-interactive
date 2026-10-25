# P4 cinematic event integration

## Mission and authority

Replace only the homepage rendering boundary with the accepted cinematic scene. Preserve published-event discovery, filters, selected cards, detail return, geographic URLs, cancellation, accessibility and reading fallbacks. Stop at P4.

Sources: the owner's P4 request; `docs/agent/prompts/cinematic-globe/shared-contract.md`; Phase 4 of `docs/superpowers/plans/2026-10-23-cinematic-history-globe-plan.md`; the cinematic visual spec; the accepted P1 decision recorded in the P2/P3 audits; completed P2 projection/overlays and P3 shell; preserved behavioral requirements in the curated-globe spec.

## Verified starting state

- `EventMapProps` and `GlobeCameraRequest` are declared in `EventMap.tsx`. Their properties and callback meanings will move unchanged into `lib/explorer/globe-contract.ts`.
- `HistoryExplorer` owns filtering, selection, journey playback, URL writes, `navigationPending` and `restoreRequest`. Only its type import needs changing.
- The dynamic client-only `EventMap` boundary currently mounts MapLibre. P2 supplies one on-demand Three scene, pure CSS-pixel/occlusion projection and measured overlay layout; P3 supplies the public atlas shell.
- CodeGraph has no indexed current explorer symbols. Focused direct reads were used; no reindexing.
- Installed Next 16.3.8 lazy-loading, server/client component and native history guides were read.
- Fresh baseline: six focused unit files / 78 tests pass. Task-start copies and protected-file hashes are under ignored `output/prototypes/cinematic-globe/p4-before/`.

## Constraints and decisions

- One agent performs implementation, verification and explicitly labelled self-review inline. Preserve all dirty tracked/untracked work. No staging, commit, push, external mutation, content/query/schema changes or P5 work.
- Keep the existing feature workspace. The shared contract takes precedence over creating a clean worktree from an incomplete HEAD.
- Keep `MapView = { lat, lng, zoom }` and the exact existing `tu`, `den`, `su-kien`, `ban-do`, `hanh-trinh`, `moc` semantics. Never serialize vectors, tilt or roll.
- Keep legacy URL scale through the existing camera conversion rather than clamping restored zooms to one close view. New interactive zoom/focus uses the P1 useful texture limit (5.4); a restored closer bookmark may zoom back out without jumping to that limit. Disclose the imagery's global resolution in attribution.
- One live canvas/context and one flight owner. Publish rounded settled views after flight completion or input settlement; per-frame projection updates never write URLs.
- Reuse anchor/group/uncertainty helpers and P2 occupied-rectangle layout. Keep HTML cluster selection, focus restoration, manual interruption, no-JS and no-WebGL reading.

## Implementation plan

- [x] Retain existing navigation races; add failing camera-settlement/cancellation and browser integration assertions before production replacement.
- [x] Move shared types to a neutral contract, including `GlobeViewport` with CSS dimensions, zoom and nullable projection.
- [x] Add a small camera adapter with cancellation tokens and settled geographic callbacks. Connect scene readiness, retry, intro, view restoration, focus, camera requests, pointer/wheel/keyboard and controls behind `EventMap`.
- [x] Adapt `GlobeMarkers` to viewport/onZoomTo, reuse P2 measured layout and existing semantic cluster UI. Keep selected labels and approximate-location disclosure.
- [x] Update renderer-specific E2E selectors and explicitly allow only approved local globe imagery/geography; reject unrelated provider requests. Add real canvas/marker movement, grouped zoom/filter/history/detail journeys, compatibility and context-loss recovery.
- [x] Run fresh focused unit tests, production build, the three public homepage suites and `pnpm verify`. Verify 1280×720 and 1440×900 journeys, four-size shell, keyboard/reduced motion/loading/error/retry/no-WebGL/no-JS.
- [x] Inspect screenshots and task-owned diffs, compare protected hashes, record exact evidence/limitations, create the ignored local P4 report and stop.

## Review focus

1. An old asynchronous completion after manual input, history restoration, retry or unmount must not emit or report arrival.
2. A late intro/view URL write must not cancel a delayed outgoing detail navigation.
3. Geographic markers must follow the actual rendered camera and cull the far side while HTML reading survives.
4. Restored zooms 1.2, 4.5, 6.5 and 8 must retain geographic centre and scale without replaying the intro.
5. Expanded lists, cards, source panels and clusters must remain readable at the short desktop size; map wheel input must not consume reading-panel scrolling.

## Evidence and results

Fresh narrow unit verification: seven files / 84 tests pass. `pnpm verify` passes: five project skills, 42 history checks, ESLint, strict TypeScript, 66 unit files / 840 tests, eight hook tests and production build 102/102 pages. Full output: `output/prototypes/cinematic-globe/p4-verify-final.log`. The baseline production build passed, and the existing delayed-outgoing-navigation and flight/history restoration tests passed before replacement (two browser tests). The initial integration policy test failed against the legacy renderer because the approved Earth texture was absent.

Two additional real-browser regressions reproduced integration defects before fixes: a consumed event focus replayed after journey exit (`21.41679,105.98403,4.4` was overwritten by `21.386,103.023,5.4`); an old wheel timer wrote two card return URLs during a new focus flight instead of one settled URL. The adapter now consumes focus intents and invalidates input timers before new requests. Both regressions pass in the final full browser run.

An exploratory grouped-zoom journey initially expected an event outside the newly zoomed region to remain visible. The browser showed correct geographic/occupied-region culling, with no JavaScript errors. The journey now explicitly returns to the country overview before selecting a different region; grouping/zoom assertions remain. The exploratory batch was canceled and is not counted as passing evidence.

Evidence copies use `.ts.txt` / `.tsx.txt` because the root TypeScript glob includes ignored directories. Original import paths continue to receive type-only re-exports from `EventMap`; the production owner imports the neutral contract. No root compiler exclusion or unrelated P3 evidence was changed.

The first complete public run passed 38/40; the two failures were fixed world-zoom `<2` assumptions from the old renderer (the accepted height-dependent P1 world preset is 2.07 at 720 px and 2.39 at 900 px). Assertions now test real geographic zoom-out, the [18,107] reset and one settled card URL change. The retained camera tests prove the complete sphere fits with margin at all four sizes. A focused four-test rerun passes, including actual separation of a published northern cluster, selection of the separated event, filtering, detail and return at both required journey sizes. No renderer preset was changed to satisfy an obsolete numeric threshold.

`node output/prototypes/cinematic-globe/verify-p4-extra.mjs` passes on the final build: two sizes, ten real default/selected/filtered-selected/expanded-journey-source/world captures, zero label/UI/target intersections, zero obscured targets, zero axe violations, zero JavaScript errors, one canvas, and zero idle draw calls in each 500 ms observation (12 records total, including two idle measurements). This is lifecycle/reading verification, not a P6 flight performance benchmark. Browser: Edge/HeadlessChrome 155, Windows, Intel UHD / ANGLE D3D11, WebGL 2, DPR 1.

`node output/prototypes/cinematic-globe/review-p4.mjs` passes: the owner changes only its type import, shared prop declarations are verbatim, and all 13 protected files retain their SHA-256. Review is self-review by the implementation author, not independent review. Task-start diffs are saved under `output/prototypes/cinematic-globe/p4-task-owned.diff`; new source files were reviewed directly.

The next full browser run passed 40/40. A subsequent self-review strengthened real context-loss recovery to compare physical marker positions after a settled pan and a pending wheel burst. It reproduced an 84.39 CSS-pixel mismatch despite a correct saved URL: cleanup cleared the timer but left its ref truthy, blocking the new scene's view synchronization. Cleanup now clears both input refs. The strengthened regression passes (one browser test / 5.0s), retaining the original texture failure, reading links, retry and one-live-context assertions; restored marker position is within one CSS pixel. A fresh `pnpm verify` also passes after this fix with the same 840 unit / eight hook / 102-page totals.

## Final gate and stopping point

With `E2E_BASE_URL=http://localhost:3224`, against the fresh full-gate production build:

```powershell
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1
```

**40/40 passed in 2.7 minutes (164.8 seconds); zero skipped, flaky or unexpected results.** Full log and JSON: `output/prototypes/cinematic-globe/p4-home-e2e-final.log` and `p4-home-e2e-final.json`. No staff/account/payment or external-write E2E was run. Shell captures retain all four desktop sizes; real grouped/filter/detail-return and legacy-camera journeys run at 1280×720 and 1440×900. `git diff --check` passes with pre-existing line-ending notices; the index is empty.

The task-owned Next server logged four `The destination stream closed early` messages, digest `3840477093`, also recorded by the P0/P2/P3 baseline. All 40 browser tests and normal browser error checks pass. This pre-existing server notice was not investigated as a separate framework task; no clean-server-log claim is made.

Texture detail remains the P1 global 4096×2048 limit: new zoom/focus is bounded at 5.4, legacy URLs retain their geographic zoom and can step outward gradually. Browser compatibility evidence is Edge 155/WebGL 2 on Windows; Firefox/Safari and mobile/tablet were not tested in this phase. Existing sourced geography/precision and seven milestones remain unchanged. No new material, camera framing, historical content, dependency, query/schema, biography, P5 choreography or P6 performance/visual-approval work is included.

P4 is complete. Final review was performed by the implementation author; no outstanding critical/important P4 finding remains. The ignored local report is `.task-reports/2026-10-24-0039-cinematic-globe-phase-4.md`. Stop at P4; no staging, commit, push, PR or deployment.
