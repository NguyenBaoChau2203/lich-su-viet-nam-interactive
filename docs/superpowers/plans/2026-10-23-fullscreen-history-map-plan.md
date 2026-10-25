# Full-viewport History Map Implementation Plan

> Execute inline with one agent using superpowers:executing-plans. The owner's correction supplies the requested behavior; do not restart an approval cycle for the discarded tabletop design. Self-review is not independent review.

**Goal:** Replace the homepage tabletop with a full-viewport 2D map containing time-filtered event positions, zoom/pan, summary cards, and safe navigation to/from event detail.

**Spec:** `../specs/2026-10-23-fullscreen-history-map-design.md`.

**Architecture:** Retain the published server query and existing inclusive filtering; lazy-load React Leaflet; use pure modules for geographic URL state and marker grouping; keep SSR-readable alternatives.

## Global constraints

- Preserve the existing dirty/untracked workspace and current `codex/3d-map-design` branch. Snapshot task-owned file content before editing; do not recreate files from HEAD.
- Use existing libraries, providers, historical data, precision labels, and event routes. No external writes, Word edits, secret reads, or deployment.
- Verify only laptop/PC: 1280×720, 1366×768, 1440×900, 1920×1080, with mouse/trackpad and keyboard.
- Keep the navigation header; omit the footer/mobile tab tail only on `/`. Other routes preserve their public shell.
- Keep event simulations and artifact viewers unchanged.

## Review focus

1. Missing/invalid coordinates and multi-location events: never fabricate markers; keep text links. Test in map-marker unit tests and browser list.
2. Overlapping locations and dense markers: group by 36 CSS pixels while retaining every event, expose individual choices, and allow closer zoom. Test stable grouping and shared-location choices.
3. Stale/malformed URLs, out-of-range views, filtered-out selections, and malicious return URLs: validate allowlisted state and restore without NaN or external navigation. Test state and return helpers.
4. Short laptop height and overlays: map/card/time controls must coexist without clipping. Check all four desktop viewports and keyboard focus/Escape.
5. Failed tiles, no JavaScript, reduced motion, and browser navigation: content remains readable and state returns coherently. Test browser fallbacks and complete event journey.

## Task 1 — Map state and marker contracts

**Files:** Create `lib/explorer/{map-view,map-state,map-markers}.ts` and `tests/unit/explorer-map-{state,markers}.test.ts`; extend `lib/explorer/url.ts` only for safe geographic return state.

**Interfaces:** MapView `{lat,lng,zoom}`; MapExplorerState uses existing year/selection fields with MapView. `parseMapView`, `formatMapView`, `parseMapExplorerState`, `buildMapExplorerUrl`, `buildMapEventHref`; `getEventMapAnchors` and `groupMapAnchors` retain event/location identities. Geographic URL key `ban-do` contains latitude,longitude,zoom; latitude ±85, longitude ±180, zoom 4–18.

- [x] Write and run failing tests for view/URL validation and round trips, safe return URLs, interval semantics, coordinate validity, stable grouping, shared-point events, and multi-location identity retention.
- [x] Implement pure functions; retain legacy tabletop helpers for their remaining isolated tests.
- [x] Rerun focused tests and self-review; do not create additional event/database representations.

## Task 2 — Full-viewport map and event interaction

**Files:** Replace `components/explorer/HistoryExplorer.tsx`; add `{EventMap,EventMapController,EventMapMarkers,MapEventCard,MapEventList,MapTimeControls}.tsx` and `explorer-map.css` beside it; add `components/layout/PublicPageTail.tsx`; update public layout, homepage, and event route.

- [x] Keep a full-width, viewport-height map below the existing header; place compact title, optional list, time controls, and selection card above it.
- [x] Lazy-load Leaflet, reuse existing OSM tiles, use country fit bounds, grouped markers and direct summary selection. Use mouse/wheel/trackpad and keyboard controls without WebGL.
- [x] Filter markers/list with the same events; show source count and precision accurately; preserve links without JavaScript and when data/tiles fail.
- [x] Persist allowlisted geographic state; close selection with Escape/focus return; add safe “Trở lại bản đồ” on public event detail.
- [x] Keep the public footer and mobile tab components on other routes. Do not alter event simulation implementations.

## Task 3 — Browser evidence and scope alignment

**Files:** Replace the obsolete homepage tabletop E2E contract with `tests/e2e/home-map.spec.ts`; add a deterministic synthetic browser fixture helper if needed. Update AGENTS/MVP and clearly mark the prior tabletop spec/master/prompt as superseded for the homepage.

- [x] Verify a published event on the actual local app and the complete map → card → detail → return journey.
- [x] Test deterministic shared markers, time changes, URL reload/Back/Forward, malformed values, empty ranges, failed tiles, no JavaScript, reduced motion, dragging/wheel/buttons, focus/Escape, and no homepage Three.js runtime requests.
- [x] Capture all four desktop viewports and visually inspect the actual layout.
- [x] Run `pnpm verify`, the focused `home-map` browser suite, and `git diff --check`; inspect current status and the task-owned diff against baseline. Never run mutating staff/payment suites against an unapproved database.
- [x] Write `.task-reports/YYYY-MM-DD-HHmm-fullscreen-history-map.md` with exact evidence and any limitations. Leave pre-existing untracked files uncommitted when their earlier content cannot be separated safely.

## Execution ledger

- Design records the owner's latest correction directly. Engineering defaults are the implementer's choices: existing Leaflet/OSM, compact overlays, geographic view URL, and 36-pixel screen-space grouping.
- Task baseline saved outside the repository before edits; existing feature branch retained to preserve the current app.
- No separate AI reviewer or worker is allowed by the owner.

## Completion evidence

Completed inline on 2026-10-23. Fresh pnpm verify passed: 61 Vitest files / 772 tests, 8 agent-script tests, and the production build (102 static pages). The focused production browser run passed 22 tests; a final production recheck of viewport layout, keyboard/accessibility, and partial-tile retry passed 3 tests after the final overlay adjustment. No mobile/tablet or mutating staff/payment suites were run.

Additional rulings: cancel pending geographic URL writes before link navigation (a delayed-navigation regression failed before the fix and passed afterward); initialize Leaflet with bounds alone when no saved view exists (the installed MapContainer gives center/zoom priority over bounds); keep the detail action outside the scrollable card body. Failed OSM tile requests expose a bounded, user-triggered retry. No provider was changed.
