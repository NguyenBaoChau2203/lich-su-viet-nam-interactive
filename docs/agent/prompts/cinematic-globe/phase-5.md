# Prompt — Phase 5: direct the intro and authored journey camera

## Mission

Give the integrated globe a finite world-to-Vietnam introduction and readable, interruptible flights through the existing seven-stop Hồ Chí Minh journey.

## Definition of done

- Fresh entry approaches Vietnam in 3–4 seconds and can be skipped/interrupted; restored and reduced-motion views do not replay it.
- Intercontinental travel reveals geographic context; nearby flights are shorter and do not cross through Earth.
- Reading time, pause/seek/exit/history behavior and all seven sourced milestones remain correct.
- Delayed callbacks cannot overwrite a newer stop/restored view or cancel outgoing navigation.

## Sources of truth

Read `shared-contract.md`, the accepted visual spec, current authored journey/source audit, P4 contract and Phase 5 of the plan. Do not alter dates, coordinates, itinerary order or publication rules to make transitions easier.

## Verified starting state

- `lib/explorer/journey.ts` has seven selected sourced stops, approximate coordinates and schematic connections.
- Existing `HistoryExplorer` starts its eight-second reading delay after arrival; manual input, hidden state and reduced motion pause playback.
- Existing tests cover stale seek callbacks, shared paused journeys, draft-link exclusion, delayed detail navigation and exit/popstate during a flight.
- Confirm the integrated renderer's cancellation semantics rather than assuming they survived replacement.

## Scope and hard constraints

In scope: one camera director, finite intro, route transitions, subtle reading-copy motion and relevant tests. Out of scope: new biography/media, heavy postprocessing, GSAP, perpetual rotation or rewriting playback state. Inherit all shared single-agent/history/security rules.

## Relevant files and patterns

- `lib/explorer/cinematic/camera.ts`, `scene.ts`, `components/explorer/EventMap.tsx` and cinematic canvas.
- `HistoryExplorer.tsx`, `JourneyPanel.tsx`, `lib/explorer/journey.ts` and neutral contract.
- `tests/unit/explorer-cinematic-camera.test.ts`, `tests/e2e/home-globe.spec.ts` and cinematic browser tests.

## Work item — make camera motion serve the journey

**Problem:** A direct zoom can lose world context; poorly canceled flights can corrupt restored state even when an animation appears smooth.

**Required change:** Follow Phase 5. Add one cancellation/generation-controlled flight path and exactly-once arrival notifications. World-to-Vietnam intro respects session/restored/motion state. Long travel pulls back, turns and approaches; short travel avoids unnecessary world zoom. Manual input, newer requests, `restoreRequest`, route departure and unmount cancel old work; hidden state pauses safely. Keep the original seven stops and eight-second post-arrival reading delay. Copy fading may be 150–200 ms; do not hide bad paths with full-canvas fades.

**Acceptance:** Repeated seeking, play/pause, drag/wheel, page hide, runtime motion changes, exit and popstate all settle on the current requested view. After waiting beyond a canceled flight's duration, URL/camera still match restored state. Reduced motion uses instant useful views, shared journeys open paused, and source/detail links keep existing precision/publication behavior.

**Verification:** Red→green cancellation/path tests plus both public homepage suites and the cinematic suite. Capture an intercontinental transition and return. Run shared full gate, recording browser/backend rather than claiming universal smoothness.

## Deliverables and stop conditions

Return motion/path decisions, regression evidence, captures and local P5 report. **STOP at P5.** Do not add new itinerary stops or begin final release/performance scope beyond the required phase checks.

## Final recap

Deliver finite geographic storytelling with reliable interruption/restoration, preserve the authored history, and stop after P5.
