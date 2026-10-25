# Prompt — Phase 4: integrate real event discovery with the cinematic renderer

## Mission

Connect the accepted cinematic scene to the real homepage event/filter/card/detail flows and existing URL camera state using one renderer.

## Definition of done

- Pan, wheel, keyboard and controls change the actual geographic view; events/grouping/filter/card/detail work on it.
- Legacy/shared URLs, reload, browser history and detail return preserve useful place/zoom and filter state.
- Existing navigation/cancellation/accessibility/fallback regressions remain covered with renderer-neutral assertions.
- Fresh unit/browser/full-gate evidence and the local report are available.

## Sources of truth

Read `shared-contract.md`, accepted P1 renderer decision, visual spec, completed P2/P3 interfaces and Phase 4 of the plan. Preserve the earlier minimal-globe behavioral spec where the visual proposal does not supersede it.

## Verified starting state

- `EventMap.tsx` currently declares `EventMapProps` and `GlobeCameraRequest`; confirm their current signatures.
- `HistoryExplorer` owns filters/URL/journey state and contains `navigationPending` and `restoreRequest` race protections.
- `GlobeMarkers` currently depends on MapLibre projection/events; its grouping and uncertainty semantics are reusable.
- Existing E2E tests include renderer-specific selectors and a prohibition on old raster basemap requests; legitimate new local textures require narrower, behavior-based expectations.

## Scope and hard constraints

In scope: renderer adapter, neutral shared types/projection, event UI connection and relevant tests. Out of scope: new historical content, query/schema changes, rewriting the state owner or deleting race tests to pass. Inherit all shared rules. Use one scene; no new public camera vector format.

## Relevant files and patterns

- `components/explorer/EventMap.tsx`, `HistoryExplorer.tsx`, `GlobeMarkers.tsx` and existing card/time/list components.
- Proposed `lib/explorer/globe-contract.ts`; `lib/explorer/cinematic/` and `components/explorer/cinematic/`.
- `lib/explorer/map-view.ts`, `map-state.ts`, `url.ts`, `map-markers.ts`.
- `tests/e2e/home-map.spec.ts`, `home-globe.spec.ts`, `home-cinematic-globe.spec.ts`; camera/state/marker unit tests.

## Work item — replace only the rendering boundary

**Problem:** A prototype does not yet provide the published-event navigation and persistence of the current homepage.

**Required change:** Follow Phase 4. Move existing prop types to the neutral contract without changing meanings. Connect the new renderer behind the existing dynamic adapter. Feed `GlobeViewport`/`onZoomTo` to semantic markers and reuse anchor/group helpers. Emit settled geographic views, not every animation frame. Keep year/event/journey query keys, safe detail returns and cancel/restore navigation protections. Preserve loading/retry/no-JS/no-WebGL reading. Update renderer-specific tests to validate the new real canvas and an explicit local-asset/provider policy without losing historical/source/far-side checks.

**Acceptance:** A published event can be found by zoom/group selection, filtered, opened in a card/detail and returned to the same exploration context. Old `ban-do` values preserve intended geographic location/scale. Delayed outgoing navigation cannot be canceled by a late camera/URL update. Markers behind Earth remain absent, HTML links remain readable, and exactly one scene is mounted.

**Verification:** Meaningful red→green camera/URL tests and real pan/wheel/group/filter/history/detail browser journeys; the three public homepage suites and shared full gate. Verify at the short desktop size and at 1440×900, retaining the four-size shell coverage.

## Deliverables and stop conditions

Return behavior/test mapping, type/adapter changes, screenshots, compatibility limitations and local P4 report. **STOP at P4.** Do not expand the biography, add new transitions beyond integration needs or start Phase 5.

## Final recap

Ship a single integrated renderer with unchanged meaningful event/URL behavior, prove regressions, and stop after P4.
