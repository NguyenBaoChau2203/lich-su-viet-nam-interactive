# Prompt — Task 08: expose accessible journey choice and reading controls

**Recommended model:** Gemini 3.8 Flash, thinking high. **Complexity:** 3/5. Execute one task inline.

## Mission

Expose the verified four-journey registry in a compact desktop interface that matches the cinematic globe and keeps reading, switching and returning predictable.

## Definition of done

- Users can choose all verified journeys with mouse or keyboard and see the correct period/stops/active state.
- The existing state owner drives every transition; no duplicate selection/timer/camera state is added.
- Four desktop sizes, shared URLs, reader focus and HTML fallback remain usable.

## Sources of truth

Read `shared-contract.md`, Task 08 and the interface sections of the design, actual Task 03 callbacks/registry and Task 07 verified content handoff. Validate that entries are actually registered before presenting them.

## Verified starting state

The previous reader/header were single-journey. Task 03 owns registry, pair validation, snapshot restoration and 2000 ms post-arrival playback. Task 07 owns historical data. This task consumes those contracts rather than recreating their state. Confirm their actual signatures and passing behavior first.

## Scope and hard constraints

In scope: `JourneyChooser.tsx`, bounded header/reader integration and scoped presentation/accessibility tests. Out of scope: new global store, event bus, timer, playback settings/dashboard, historical rewrites, new dependencies or camera/path redesign. Apply all shared constraints; mobile/tablet work is deferred while existing responsive behavior remains intact.

## Relevant files and patterns

Inspect `components/explorer/HistoryExplorer.tsx`, `JourneyPanel.tsx`, existing mode navigation/form/link fallbacks and scoped explorer CSS. Use the state owner's `onChooseJourney(id)` or the exact frozen equivalent. Follow existing accessible control/list patterns and published-only links.

## Work item — connect choices and reader to the selected registry entry

**Problem:** A menu that changes only a label or starts its own playback state can leave the globe on another journey and break URL/history restoration.

**Required change:**

1. Add a compact labeled four-option chooser in journey mode, using native HTML where practical. Show selected title, period, short schematic note, stop count/list and active state from the registry. Keep the two primary modes clear.
2. Call the existing selection callback; switching remains paused and preserves the original exploration snapshot. No second source of truth, automatic autoplay on entry or separate timer.
3. Keep manual seek/play/pause, expanded source reading, focus return and published detail navigation functional. Describe the status as a two-second wait after arrival, not a fixed two-second whole flight. Reader focus/source expansion must not cause the panel to advance underneath reading.
4. Provide meaningful HTML GET/link navigation when JavaScript is absent. Source-only stops remain readable without fabricated detail links. Keep internal reader scrolling within the available short desktop height.
5. Check long Vietnamese titles and four desktop sizes without covering map controls/marker targets. Retain visible focus and required text/control contrast.

**Acceptance criteria:** Choosing any registered journey updates its title/count/stops and matching camera/path context through the existing owner. Keyboard selection, Escape/focus return where relevant, browser reload/history and exit-to-exploration work. No-JS users can navigate authored content. No unsupported entry appears as a functioning choice.

**Verification:** Add meaningful chooser/reader/HTML-fallback cases and `home-journey-choices.spec.ts` using actual test conventions. Exercise all four viewports, manual source reading, shared URLs, source-only stops and detail return; inspect console/network and rendered screenshots. Run focused UI/state cases, scoped public desktop E2E, `pnpm verify`, diff/status.

## Deliverables and stop conditions

Return changed UI files, exact browser/test evidence, absolute screenshots, verified progress and local Task 08 report. **STOP after 08.** Do not rewrite registry/controller semantics or begin the final audit. If the frozen callback is broken, supply a focused reproduction for repair rather than adding a parallel state system. After two unsuccessful structural attempts, hand the concrete failure to the owner without invoking another model.

## Final recap

Expose verified journeys through the existing state owner, prove readable desktop/keyboard/HTML behavior, and stop after Task 08.
