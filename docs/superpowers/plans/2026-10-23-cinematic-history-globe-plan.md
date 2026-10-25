# Cinematic History Globe Implementation Plan

> **For the implementing agent:** Execute one phase at a time, inline, in the owner's chosen Gemini environment. Use an executing-plans workflow where available. The owner's single-agent rule overrides subagent/reviewer recommendations. Stop at each named checkpoint; do not automatically execute the next prompt.

**Goal:** Bring the homepage close to the supplied Earth concept while retaining sourced event discovery, shareable exploration state and the current seven-stop journey.

**Architecture:** First prove a textured, atmospherically lit Vietnam overview in an isolated local prototype. The recommended prototype is installed Three.js plus one `three-globe` object; keep the production MapLibre renderer until the visual checkpoint is accepted. Reuse the existing `HistoryExplorer` state owner, public queries, cards and journey model during integration.

**Tech stack:** Existing Next.js App Router / React / strict TypeScript / Tailwind and CSS, installed Three.js, proposed pinned `three-globe`, existing Vitest and Playwright. No R3F/Drei/GSAP or external imagery service is required by the proposed route.

**Spec:** `docs/superpowers/specs/2026-10-23-cinematic-history-globe-visual-design.md`.

**Source audit:** `docs/audits/2026-10-23-cinematic-globe-source-research.md`.

**Execution prompts:** `docs/agent/prompts/cinematic-globe/README.md`, then `phase-0.md` through `phase-6.md`.

**Status:** Plan only, all implementation tasks unchecked. New visual requirements come from the owner; the renderer migration remains a recommendation to prove. Do not confuse earlier minimal-globe completion with completion of this upgrade.

## Global constraints

- Use one agent for investigation, implementation, self-review and verification. Do not spawn subagents or an external AI reviewer.
- Inspect the dirty workspace before edits; use CodeGraph first when available. Preserve all unrelated work, root Word reports, `.env` and historical content.
- Latest owner request takes precedence over the earlier spec's instruction to avoid realistic Earth textures. Preserve its functional/source/accessibility requirements.
- Optimize and verify desktop CSS 1280×720, 1366×768, 1440×900, 1920×1080; preserve existing responsive support. Mobile/tablet design and testing are deferred.
- Treat the concept as art direction, never geometry. Do not invent coordinates, dates, place membership, sources, asset licenses or publication state.
- No historical corpus expansion, DB migration/write, exam/revision feature work, detail-page simulation rebuild, push, PR, merge, deployment or external publication.
- Read relevant installed `node_modules/next/dist/docs/` guides before code. Keep the root page a Server Component and the renderer behind a client-only dynamic boundary.
- One active renderer/context and one camera animation owner. Do not import npm and CDN Three together or mix classic shader/node material pipelines by accident.
- Run focused checks during work and `pnpm verify` at each phase handoff. Create the required ignored `.task-reports/` report with fresh evidence.
- Visual approval is a distinct owner checkpoint after Phase 1; tests alone cannot approve appearance. Elapsed time or a missing reply is not approval.

## Review focus

1. A correct spherical projection can still miss the concept: reject a small floating ball or a flat country crop at the default Vietnam overview.
2. A 4K global texture may blur at local zoom: inspect the closest useful event-selection view, not only the world screenshot.
3. Near-surface polygon triangulation/UV mismatch can color the wrong coast or drop islands: check real geometry and anchor alignment, including holes and the seam.
4. A renderer replacement can pass screenshots but lose navigation: preserve delayed outgoing-link and canceled-flight restoration regressions.
5. Focus or sources can be hidden behind visual overlays: check keyboard paths and dynamic occupied rectangles at 1280×720.

## File and interface map

Existing files to retain as product logic:

- `app/(public)/page.tsx`: published events, limits, initial URL state and readable server output.
- `components/explorer/HistoryExplorer.tsx`: filters, selected event, URL lifecycle, `navigationPending`, journey state, `restoreRequest` and playback timing.
- `components/explorer/MapEventCard.tsx`, `MapEventList.tsx`, `MapTimeControls.tsx`, `JourneyPanel.tsx`: semantic HTML controls and reading.
- `lib/explorer/map-state.ts`, `map-view.ts`, `map-markers.ts`, `url.ts`, `journey.ts`: shared state/data and pure helpers.
- `public/maps/history-world-land.geojson`, `vietnam-tabletop.geojson`, `history-vietnam-labels.json` and provenance: current sourced geography.

Proposed files, created only by their owning phase:

| File | Responsibility | Phase |
| --- | --- | --- |
| `docs/audits/2026-10-23-cinematic-globe-baseline.md` | Reproducible local starting state, selected source/dependency/asset evidence | 0 |
| `public/maps/globe/assets.provenance.json` | Exact local image paths, original URLs, creators, licenses, hashes, dimensions, derivative notes | 0/1 |
| `public/maps/globe/ATTRIBUTION.md` | Required image/code credits, kept alongside assets | 0/1 |
| `components/explorer/cinematic/CinematicGlobePrototype.tsx` | Isolated visual proof, not a public production route | 1 |
| `components/explorer/cinematic/CinematicGlobeCanvas.tsx` | Scene mounting, readiness/error, resize, input, cleanup | 1/4 |
| `lib/explorer/cinematic/scene.ts` | One Three renderer/scene/control lifecycle | 1 |
| `lib/explorer/cinematic/materials.ts` | Earth/atmosphere/near-surface highlight materials | 1 |
| `lib/explorer/cinematic/projection.ts` | Geographic vector, near-side visibility and screen projection helpers | 1/2 |
| `lib/explorer/cinematic/camera.ts` | Serialized zoom conversion, presets, interruptible flights | 1/4/5 |
| `lib/explorer/globe-contract.ts` | Renderer-neutral `EventMapProps` and HTML marker projection contract | 4 |
| `components/layout/HomeAtlasHeader.tsx` | Homepage masthead; callbacks owned by `HistoryExplorer` | 3 |
| `components/layout/PublicPageHeader.tsx` | Select shared non-homepage header vs homepage-owned masthead | 3 |
| `tests/unit/explorer-cinematic-camera.test.ts` | Camera conversions / interpolation boundaries | 1/4/5 |
| `tests/unit/explorer-cinematic-projection.test.ts` | Geographic alignment, near-side clipping, seam | 2 |
| `tests/e2e/home-cinematic-globe.spec.ts` | Real visual/state/layout acceptance | 3/4/6 |

Reuse existing helpers before adding files. Keep modules focused; do not create a general rendering framework. The old planar `lib/explorer/projection.ts` is not a spherical projection and must not be repurposed silently.

Integration contracts to freeze before Phase 4:

```ts
type ScreenPoint = { x: number; y: number };
type GlobeViewport = {
  width: number;
  height: number;
  zoom: number;
  project(lng: number, lat: number): ScreenPoint | null;
};
```

`project` returns CSS pixels relative to the map stage, and `null` for non-finite, out-of-viewport or Earth-occluded locations. A renderer-neutral `GlobeMarkers` receives this snapshot, curated labels, events, selected event, active stop, `onSelect(slug)`, and `onZoomTo(lng, lat, zoom)`. Preserve grouping with existing `groupMapAnchors` rather than rebuilding event relationships.

Move `EventMapProps` and `GlobeCameraRequest` from `EventMap.tsx` without changing their meanings. The public serialized camera remains `MapView = { lat, lng, zoom }`. Camera conversion helpers in `camera.ts` must round-trip this representation; no renderer vector or quaternion belongs in a public URL. A documented deterministic camera tilt/bearing profile avoids creating unsaved orientation state. Do not add free roll in this scope.

## Phase 0 — Freeze the baseline and reuse inputs

**Checkpoint P0:** A reliable, licensed input package and a bounded prototype decision. No homepage UI/renderer change.

**Consumes:** Existing repository, source audit, reference PNG. **Produces:** baseline audit, source/dependency decision, asset manifest, baseline screenshots and verification output.

- [ ] Inspect branch/status and snapshot relevant existing file hashes. Keep the current dirty feature workspace; do not rebuild it from HEAD. If isolation is needed, preserve both tracked and untracked app files deliberately rather than checking out an incomplete clean branch.
- [ ] Re-open the actual homepage and capture world, settled Vietnam, selected card and journey at 1440×900; capture the short 1280×720 layout. Record URL/browser/backend and known failures separately from new changes.
- [ ] Re-read installed Three/Next docs, resolve the exact proposed `three-globe` package version and peer dependencies, and inspect the proposed dependency path. Explain why it removes geographic work not solved by an existing project helper; measure the actual bundled cost in Phase 1.
- [ ] Select a matched label-free Earth imagery set from the audited publisher. Download only the required files to local versioned asset paths, record source/creator/license/access date/size/dimensions/SHA-256, and list transformations. Default 4096×2048 day map; add normal/specular only if used. Do not acquire every 8K map.
- [ ] Establish tests: `pnpm exec vitest run tests/unit/explorer-map-state.test.ts tests/unit/explorer-map-markers.test.ts tests/unit/explorer-globe.test.ts`; run the two public homepage E2E files against a known local production build. Record baseline failures honestly.
- [ ] Write `docs/audits/2026-10-23-cinematic-globe-baseline.md`, run `pnpm verify`, create the local report and stop at P0.

**Reject P0 if:** exact asset permission cannot be read, source URLs are placeholders, app/publication state is guessed, or the plan proposes adding several 3D frameworks without evidence. Use an alternative verified source rather than inventing a license.

## Phase 1 — Prove the cinematic Earth before migration

**Checkpoint P1:** Owner-visible prototype comparison and explicit visual acceptance, before replacing the homepage renderer.

**Consumes:** P0 package. **Produces:** textured scene, calibrated camera presets, first camera tests, real screenshots and a visual scorecard. Production homepage stays on its current renderer.

- [ ] Add the single dependency chosen in P0 only if justified. Use the installed npm Three instance and locally hosted assets. Retain notices for adapted source.
- [ ] Implement the prototype in `components/explorer/cinematic/` and a local preview harness outside the public route tree, for example an ignored HTML/JavaScript harness under `output/prototypes/cinematic-globe/` served on a task-owned localhost port. The root TypeScript config includes all `**/*.ts`/`**/*.tsx`, including ignored folders: do not leave a nested TypeScript preview app that contaminates the root build. If the React preview requires a temporary local Next route, use `app/(public)/__globe-prototype/page.tsx`, record its use, and remove that route before build/handoff; preserve reusable scene components and screenshot evidence. Do not deploy a demo route or expose debug inspector UI in production.
- [ ] Establish a failing reproducible visual baseline: current flat view vs concept, with six named absent/partial categories. Add meaningful pure tests for camera conversions when logic is introduced; do not unit-test color constants or mock a screenshot into passing.
- [ ] Render textured Earth, light and thin atmosphere, a near-surface sourced Vietnam highlight and sparse stars. Calibrate world and Vietnam overview presets to the spec's frame ranges. Tune perspective and view target, not an arbitrary CSS scale on a flat map.
- [ ] Include a minimal preview-only HTML masthead/title/guidance/timeline scaffold using the reference's copy and occupied regions, so camera framing and composition can be judged together. This is not the Phase 3 production shell; do not implement fake clickable event hotspots to fill the screenshot.
- [ ] Define reversible `zoom`/distance or visible-extent mapping; compare legacy URL zooms 1.2, 4.5, 6.5 and 8 at 1280×720 and 1440×900. Keep latitude/longitude stable; do not clamp all old local views to the same camera.
- [ ] Inspect default and closest useful selection zoom for texture blur, UV seam, cloud obstruction, highlight z-fighting and clipped atmosphere. Measure provisional asset/decoded texture/engine costs and a repeatable flight.
- [ ] Capture 1440×900 and 1280×720 screenshots, annotate the six-category comparison, and list remaining differences. Require ≥10/12, no zero, and no core framing/material/atmosphere defect. The score is human self-review, not independent approval.
- [ ] Run focused tests plus `pnpm verify`, write the report, present the screenshots, and **stop for the owner's actual visual decision**. If the image is still materially different, revise this phase; do not proceed to wire all features.

**Fallback:** If Three cost/controls/texture resolution fail, document evidence and prove a small MapLibre imagery/atmosphere alternative against the same visual criteria. Select one path at P1; do not maintain two production rendering strategies.

## Phase 2 — Verify geography and curated overlays

**Checkpoint P2:** Geographic layers and projection are accurate within the documented source precision. Prototype remains the integration target.

**Consumes:** Accepted P1 scene/presets and existing source assets. **Produces:** tested overlay projection/layer helpers and geography comparison captures.

- [ ] Write red tests for at least three known existing source anchors, near/far-side cases, latitude/longitude order, ±180° seam, viewport-edge rejection and invalid numeric input. Verify coordinate alignment against the actual texture's projection/orientation, not arbitrary visual dots.
- [ ] Use Polygon/MultiPolygon data with holes and all existing island coverage; keep overlay altitude effectively flush. Disable extrusion/growth defaults. Resample curvature only as needed to prevent long chords cutting through Earth.
- [ ] Preserve provenance and the disclaimer that boundaries are modern/generalized, not historical reconstruction. If an inconsistency is found, record it; do not redraw a boundary from the concept.
- [ ] Implement `GlobeViewport.project` with correct Earth occlusion under perspective and camera tilt. Do not copy the old MapLibre inverse-projection trick into Three unchanged; use segment/sphere visibility or equivalent tested geometry.
- [ ] Feed the existing curated labels and event anchors into a prototype overlay. Keep historical data unchanged, overseas labels relevant, and approximate points visibly distinct. Use actual overlay rectangles for label collisions.
- [ ] Verify the world view, Vietnam overview, Hanoi/central/southern anchors and far-side points in browser. Run the new unit tests, existing geography/provenance tests and `pnpm verify`; record P2 evidence and stop.

## Phase 3 — Recompose the homepage shell

**Checkpoint P3:** The masthead, reading areas and timeline match the concept's hierarchy on all four desktop sizes. Scene integration is still staged.

**Consumes:** Accepted visual direction and geometry prototype; existing HTML state/control components. **Produces:** homepage-specific navigation, initial guidance and lighter timeline styling.

- [ ] Introduce `PublicPageHeader` using the existing `PublicPageTail` pathname-isolation pattern. Non-homepage routes retain the shared `Header`; `HistoryExplorer` renders `HomeAtlasHeader` on the homepage with the real existing mode callbacks. Do not use a custom event bus or duplicate the mode controls in two places.
- [ ] Move study/revision access into a compact secondary navigation entry while preserving access to existing routes, search and keyboard navigation. Keep one `main`, one `h1`, skip link and visible focus.
- [ ] Build the left title/hint and right initial guidance. A selected event or active journey replaces the guidance; never stack three permanent cards.
- [ ] Restyle `MapTimeControls`, card and journey shell with thin rules, readable serif hierarchy, controlled translucency and bottom scrim. Keep semantic labels and all filter behavior. Do not hide the usable HTML event list to improve a screenshot.
- [ ] Add desktop DOM assertions for normal explorer page fit, control bounds, no overlap of interactive controls, no duplicate mode buttons, and preserved navigation on a representative non-homepage route.
- [ ] Capture default/card/journey at all four desktop sizes and inspect keyboard/focus/contrast. Run relevant E2E, `pnpm verify`, create report and stop at P3.

## Phase 4 — Integrate event discovery and URL camera state

**Checkpoint P4:** One new renderer drives the real homepage with existing event/filter/detail behavior and backward-compatible URLs.

**Consumes:** P1-selected renderer, P2 projection, P3 shell, `EventMapProps`. **Produces:** production renderer adapter, neutral marker interface, passing event/navigation regressions.

- [ ] Write/retain red browser regressions for real pan/wheel/button/keyboard zoom, grouping selection, filtering, selected card and detail return. Include the existing delayed outgoing navigation test before replacing the renderer.
- [ ] Move only the shared types to `lib/explorer/globe-contract.ts`; update imports without changing callback semantics. Keep `EventMap.tsx` as a thin dynamic boundary/adapter or replace its implementation, not the state owner. Never mount old and new canvases together.
- [ ] Adapt `GlobeMarkers` to the neutral projection contract. Reuse `getEventMapAnchors`, `groupMapAnchors`, `getMapGroupLabel`, date/location uncertainty and HTML focus handling. Keep marker hit targets usable even when visible dots become smaller.
- [ ] Connect `onSelect`, `onViewChange`, `focusRequest`, readiness/error/retry and manual-input callbacks. Real pointer movement must change the geographic camera and cluster separation, not just trigger decorative animation.
- [ ] Keep `tu`, `den`, `su-kien`, `ban-do`, `hanh-trinh`, `moc` parsing/serialization and return URL validation. Ensure legacy `ban-do` views, browser history and reload restore the intended place/zoom. Preserve the navigation-pending guard in `HistoryExplorer`.
- [ ] Replace renderer-specific assertions such as `.maplibregl-canvas` and blanket raster wording with engine-neutral behavior and a local-asset/no-unrelated-provider allowlist. Keep meaningful failure coverage; do not delete far-side, source-integrity, keyboard, no-JS or race tests just to make the migration green.
- [ ] Run unit tests, `home-map.spec.ts`, relevant `home-globe.spec.ts`, `home-cinematic-globe.spec.ts` and `pnpm verify`. Inspect error/retry/no-WebGL/no-JS cases; report P4 and stop.

## Phase 5 — Direct the intro and existing journey

**Checkpoint P5:** Finite cinematic flights enhance the existing seven milestones without breaking cancellation, reading time or restoration.

**Consumes:** Real renderer adapter, existing `HISTORY_JOURNEY`/playback state. **Produces:** interruptible camera director and journey visual captures.

- [ ] Start from the existing seek/restore/navigation regression tests. Add red coverage for a user interrupt during intro, short vs intercontinental flights, stale completion after exit/popstate, and runtime reduced-motion changes in the selected renderer.
- [ ] Implement one flight controller with a cancel/generation token and exactly-once arrival notification. `restoreRequest`, a newer focus/flight request, manual input, route navigation, hidden page or unmount invalidates old completions.
- [ ] Fresh entry only: 3–4 second world-to-Vietnam intro, no persistent auto-rotation. Skip for restored URL/selection/journey/session/reduced motion. Manual input and `Bỏ qua` immediately transfer control.
- [ ] Intercontinental transitions pull back enough to show context, turn, then approach; nearby stops use a shorter path. Avoid traveling through Earth or taking the long way around a seam. Copy fade is optional 150–200 ms; do not fade the whole canvas to hide a broken camera transition.
- [ ] Preserve seven sourced stops, approximate coordinates, schematic path status, arrival-then-8-second reading delay, paused shared links, source reading, and published-only detail links. No new historical itinerary/media is introduced.
- [ ] Test seek spam, play/pause, map drag/wheel, page hide/resume, exit and browser history while a long flight is in progress; wait beyond the canceled flight's full duration before checking restored URL/camera.
- [ ] Run both public homepage E2E files, focused camera tests and `pnpm verify`; capture Vietnam-to-overseas and return states, create P5 report, stop.

## Phase 6 — Visual acceptance, performance and final handoff

**Checkpoint P6:** Evidence-backed release candidate for the visual slice; no external publication.

**Consumes:** Integrated P0–P5 slice and owner-approved P1 visual direction. **Produces:** final screenshots, visual audit, performance/compatibility evidence and local handoff report.

- [x] Compare final default overview to the concept and accepted prototype. Capture world/default/card/journey/closest-useful-zoom/reduced-motion at four desktop sizes. Identify any remaining visual differences honestly.
- [x] Inspect focus order, contrast, panel scroll, expanded sources/list, clustered keyboard selection, and non-homepage header behavior. Check DOM bounds as well as screenshots.
- [x] Measure cold/warm local asset transfer, decoded texture and mipmap memory estimates, lazy engine gzip cost, initial ready time, ten-second camera frame intervals and settled idle rendering. Use the spec's provisional limits and record hardware/browser/backend/DPR/method; compositor frames are not a substitute for renderer GPU measurements.
- [x] Verify hidden-page pause, repeated mount/unmount, cleanup/disposal, retry and missing-image fallback. Do not keep running two scenes or leaking listeners/textures across navigation. Surface a retryable error while HTML content remains available.
- [x] Run `pnpm history:data:check`, `pnpm test`, safe public desktop E2E coverage and `pnpm verify` with fresh output. Inspect mixed E2E suites before selecting them; do not run staff/payment/database mutation tests against a connected live service. Run full `pnpm test:e2e` only with an isolated authorized target and the agreed desktop selection; otherwise report the exact selected command and omitted scope.
- [x] Run `git diff --check`, review task-owned tracked/untracked files and source/asset notices. Do not stage ignored output, `.task-reports`, Word or secrets. Update this plan's completed checks only with evidence.
- [x] Write the final ignored report, give absolute artifact paths, list remaining risks and stop at P6. Do not push/commit unrelated work, create a PR, deploy or publish.

P6 evidence (2026-10-24): [final acceptance audit](../../audits/2026-10-23-cinematic-globe-acceptance.md), 24 required screenshots plus supplementary states, four concept/P1/final comparison boards, 11/12 visual self-review at each desktop size, 53 selected public desktop E2E passes and fresh `pnpm verify`. Twelve final 10-second frame windows, actual GPU-query diagnostics, cold/warm transfer, mipmap estimates and five disposal cycles are recorded under `output/playwright/cinematic-globe/phase-6/`. The audit explicitly distinguishes the 552.28 KiB globe graph from 803.90 KiB whole-homepage compressed JS, 4K close-zoom softness, accepted P1 source-image dimensions and known stream-close logs. No new owner approval is inferred. Prior-phase checkboxes are not retroactively filled from reports. Local report: `.task-reports/2026-10-24-0222-cinematic-globe-phase-6.md`. Stop at P6.

## Safe verification commands

From the workspace root, narrow logic checks:

```powershell
pnpm exec vitest run tests/unit/explorer-map-state.test.ts tests/unit/explorer-map-markers.test.ts tests/unit/explorer-globe.test.ts
pnpm exec vitest run tests/unit/explorer-cinematic-camera.test.ts tests/unit/explorer-cinematic-projection.test.ts
```

The new test files are created by their phases; do not run missing-file commands and claim they passed. `pnpm test` already includes all current unit/agent-hook tests.

For local public UI integration after a fresh production build:

```powershell
pnpm verify
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1
git diff --check
git status --short
```

Inspect `playwright.config.ts`: by default it starts/reuses localhost:3100. Confirm the target build is current; if a stale server owns that port, use a separate task-owned port and set `E2E_BASE_URL` for this process. Never terminate the user's localhost:3000 dev server. Browser tests must assert behavior on the actual renderer, not a stubbed map.

Every handoff includes changed files, fresh commands/results, screenshots, unresolved differences and `.task-reports/YYYY-MM-DD-HHmm-<phase>.md`. Use Vietnamese for the owner's recap and English for repository task instructions.

## Execution order and review boundary

Run 0 → 1 → owner visual decision → 2 → 3 → 4 → 5 → 6. Each prompt is a separate bounded task; later phase prompts inherit the spec and shared contract. Do not ask Gemini to run all phases in one pass. A failed visual gate returns to Phase 1; a failed behavior gate stays in its owning phase. A source/package change after P1 requires rechecking the affected visual/performance evidence.
