# Prompt — Task 03: generalize journeys and use a two-second dwell

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 5/5. Execute one task inline.

## Mission

Replace single-journey runtime assumptions with a validated registry and change default autoplay to 2000 ms after actual arrival without introducing stale-flight/timer navigation bugs.

## Definition of done

- Selected journey records drive lookup, captions, stops, links and playback; existing Hồ Chí Minh URLs/data remain compatible.
- Pair+nonce arrival validation protects switching/seeking/history/exit.
- The two-second dwell, reading pause and existing motion/manual/hidden safeguards have fresh tests.

## Sources of truth

Read `shared-contract.md`, multi-journey/dwell design, Task 03 and current progress/contracts. Do not add the new production historical journeys yet.

## Verified starting state

Current state/reader/parser hardcode `HISTORY_JOURNEY`; `getJourneyStop` is single-ID and the settled-stop timer/copy use 8000 ms. Old tests passing that behavior do not meet the new request.

## Scope and hard constraints

In scope: registry/contracts/state/parser/reader generalization, timer/copy and tests. Out of scope: new historical claims, path rendering, province geometry or independent stores/controllers. Preserve existing source content and all shared navigation/publication rules.

## Relevant files and patterns

`lib/explorer/journey.ts`, new `journeys/registry.ts` and default-data module, `map-state.ts`, `url.ts`, `globe-contract.ts`, `HistoryExplorer.tsx`, `JourneyPanel.tsx`, camera adapter and registry/timer/URL E2E/unit tests.

## Work item — make selection and playback safe across journeys

**Problem:** Titles alone cannot add journeys; stop-only completion and a stale timer can advance another journey after switching.

**Required change:** Follow Task 03's interfaces. Preserve default data/IDs; validate journey+stop pairs. Add a monotonic request nonce and pair-aware arrival callback. Preserve the exploration snapshot across journey switches and restore it on exit. Introduce `JOURNEY_DWELL_MS=2000`, start after arrival only, cancel on pause/switch/seek/map input/hidden/departure, stop at the last milestone and pause for reader focus/expanded sources. Use selected periods and current published inventory for detail links.

**Acceptance criteria:** Unit clock proves no advance at 1999 ms and one at 2000; browser proves arrival precedes dwell. Wrong-journey/unknown stops recover safely; shared/reloaded journeys open paused. Rapid switch/seek/history cannot accept old arrivals or overwrite camera/URL. Synthetic registry fixtures stay test-only.

**Verification:** New registry/timer tests, retained delayed-navigation/restore/motion cases and shared full gate. Rename/update old eight-second assertions to the new product requirement while retaining their race coverage.

## Deliverables and stop conditions

Return frozen registry/arrival/callback signatures, behavior evidence, checks, progress and local Task 03 report. **STOP after 03.** Do not populate new journeys, add a chooser store or implement the path layer.

## Final recap

Create a safe multi-journey foundation and true 2 s post-arrival dwell, preserve old links, and stop after Task 03.
