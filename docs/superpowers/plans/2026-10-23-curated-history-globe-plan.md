# Curated History Globe Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task, inline in the main agent. The owner's single-agent policy overrides workflows recommending subagents or independent AI reviewers. Steps use checkbox syntax for tracking.

**Goal:** Replace the homepage raster map with a minimal dark globe, curated time-filtered events, and a sourced Hồ Chí Minh journey.

**Architecture:** One existing MapLibre renderer owns the geographic camera and sourced local geometry. React/HTML owns selection, time filters, readable fallback, and journey controls. Preserve event identity and the current event detail-return flow; a small sourced journey registry supplies ordered editorial milestones without remote database writes.

**Tech Stack:** Next.js 16.3.8 App Router, React 19, strict TypeScript, installed MapLibre GL JS 6.11.2, Vitest, Playwright/Edge. No new dependency.

**Spec:** `docs/superpowers/specs/2026-10-23-curated-history-globe-design.md` (approved 2026-10-23).

## Global constraints

- Execute directly in one agent. Preserve the existing dirty working tree and current `codex/3d-map-design` branch; do not move untracked application files into an incomplete checkout.
- Laptop/PC CSS viewports: 1280×720, 1366×768, 1440×900, 1920×1080. Keyboard, contrast, reduced motion, and static text remain required.
- No OSM raster/demo/satellite basemap or automatic global labels. No new package, account/quiz scope, Word edits, secret reads, external writes, staging, commit, push, PR, or deployment.
- Record historical and coordinate evidence separately. Show approximate city positions as approximate. Route connections are schematic.
- Use the installed Next.js guides before component edits. Only published event records enter ordinary event browsing; editorial journey stops carry their own reviewed sources.

## Review focus

1. World-level camera URLs and old valid map links must both restore; invalid journey/stop values must not select arbitrary content.
2. Intro or journey callbacks must not override newer user input, a new milestone, browser history, or route navigation.
3. Far-side/overlapping markers and labels must not become misleading clickable geography; the HTML list remains complete.
4. Failed WebGL/worker/geometry and reduced-motion users must retain events, sources, filters, and journey reading.
5. Approximate city coordinates must never imply exact venue position or a documented transport route.

## Task 1: Geographic assets, reviewed journey data, and URL model

**Files:** Add `public/maps/history-world-land.geojson` and provenance, `lib/explorer/journey.ts`, `lib/explorer/globe-style.ts`, `docs/audits/2026-10-23-globe-journey-sources.md`; modify `lib/explorer/map-view.ts`, `map-state.ts`, `url.ts`; test `tests/unit/explorer-globe.test.ts` and existing map-state tests.

**Interfaces:** `HistoryJourney`/`JourneyStop` hold ordered dated/precise sourced content and bounded camera targets; `getJourneyStop(id)` resolves known IDs; `MapExplorerState` accepts optional known journey/stop state. Existing event/filter fields retain their meanings.

- [x] Write failing tests for world zoom roundtrip, old valid URLs, unknown journey/stop rejection, sourced-stop completeness, and a style without raster/foreign label providers.
- [x] Run the focused Vitest files and confirm new behavior fails.
- [x] Acquire versioned generalized world land with provenance/checksum; retain sourced Vietnam geometry as flat geometry. Research a small selected 1911–1941 journey, recording dates, place granularity, and coordinate evidence. Do not infer itinerary order from unrelated event associations.
- [x] Implement bounded state parsing/building and the minimal style/data types; include safe detail return URLs.
- [x] Run the focused tests and inspect all new historical claims against their sources.

## Task 2: Globe and event exploration

**Files:** Replace `components/explorer/EventMap.tsx`; add `GlobeStage.tsx` or a small runtime helper if needed, `GlobeMarkers.tsx`; modify `HistoryExplorer.tsx` and `explorer-map.css`. Preserve existing event card/list/time controls where possible.

**Interfaces:** Existing event selection and `onViewChange(MapView)` remain; the globe additionally consumes a known journey stop/camera request and reports readiness/manual interruption. Exactly one map instance owns movement.

- [x] Add browser assertions for a globe canvas/local geometry, no OSM requests, visible actual event markers, intro interruption, and meaningful settled view URLs.
- [x] Implement a client-only MapLibre globe with local worker, owned dark style, scoped curated HTML labels, flat Vietnam geometry, grouped event buttons, and far-side hiding.
- [x] Add a skippable 3–4 second fresh-entry flight; restored/deep-linked views and reduced motion skip it. Manual camera input cancels active flights. Make zoom/reset controls and keyboard interaction work.
- [x] Connect real event selection, filtering, focus return, detail navigation, no-coordinate HTML reading, resize, and error/retry states. Suppress idle animation and clean up map resources.
- [x] Run narrow unit/type checks and the new public browser flow; inspect the screen and adjust padding/layout at the four desktop viewports.

## Task 3: Authored journey controls and camera sequencing

**Files:** Add `components/explorer/JourneyPanel.tsx`, `lib/explorer/journey-state.ts` if logic warrants it; integrate in `HistoryExplorer.tsx`/map runtime; extend unit and browser tests.

**Interfaces:** Known milestone selection updates paused URL state; play/pause is transient. Exploration state is snapshotted while touring. The map exposes completed/cancelled flight state so reading time starts after arrival.

- [x] Add failing tests for selection/seek bounds, stale flight cancellation, manual-input pause, and saved exploration state.
- [x] Implement start/pause/resume, previous/next, selectable milestone list, source links/accuracy notes, and exit restoration. Show journey range separately from the ordinary filter.
- [x] Add at least eight seconds of settled reading between autoplay stops, hidden-tab pause, schematic route labelling, and immediate transitions/manual progression under reduced motion.
- [x] Exercise seek during flight, repeated navigation, shared paused stop URLs, and detail return without restarting the intro.

## Task 4: Release verification and review

**Files:** Update `tests/e2e/home-map.spec.ts` to the new renderer (remove obsolete Leaflet/tile assertions), relevant public/a11y expectations if required, and completion evidence in this plan.

- [x] Run fresh `pnpm verify` and read every stage's outcome.
- [x] Run focused public/read-only desktop E2E for globe, filters, cards, detail return, journey, errors, keyboard, reduced motion, and no-JavaScript reading. Do not run staff/payment DB-write cases.
- [x] Capture and inspect screenshots at all four desktop viewports, an event card, and the journey. Check accessibility with axe and browser console/network evidence.
- [x] Record transfer sizes and available movement/idle measurements with browser/device caveats; do not claim physical laptop performance from software-rendered automation.
- [x] Review task-owned changes inline against the approved spec, inspect Git status/diff, and write the ignored local `.task-reports/` report with evidence and remaining limits.

No extra implementation permission is required: the owner explicitly approved execution of the design in this session. Review and verification run inline; no separate agent is authorized.

## Completion evidence (2026-10-23)

Implemented inline in one agent. Final `pnpm verify` started 18:45:17 and passed: 781 unit cases/62 files, eight agent-hook cases, all lint/type/content/build stages, 102 static pages. Final production public/read-only browser selection passed 32/32, including four-viewports map/card/journey capture, both root theme accessibility scans, interrupted intro/navigation, and mid-flight exit/history regressions.

Geography transfer: 454,423 bytes gzip (443.8 KiB). Edge 155/Intel UHD/D3D11 compositor sample: idle zero DrawFrame events/2 seconds; movement median 8.406 ms, p95 13.368 ms. This is automated-environment evidence, not a universal hardware guarantee.

Rulings and remaining limits: kept the dirty codex/3d-map-design workspace intact; no independent AI reviewer or external writes; seven selected approximate journey locations; no complete curriculum corpus or new event-detail simulations; three-second journey-flight default remains a possible timing refinement. Pre-existing Next.js stream-close logs remain recorded. Full task history, files, failures/fixes and final evidence: `.task-reports/2026-10-23-1850-curated-history-globe-implementation.md` (ignored local report).
