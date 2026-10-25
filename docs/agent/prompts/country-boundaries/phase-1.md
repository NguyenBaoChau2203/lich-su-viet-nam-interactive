# Prompt — B1: render country lines as optional context on the existing Earth

## Mission

Attach the sourced country-boundary layer to the current Three.js Earth without changing its renderer, camera behavior or core readiness when optional data fails.

## Definition of done

- Open/disconnected source lines follow the real sphere and are drawn in one passive batch.
- Boundary loading is independent of core readiness; failure/late results preserve working Earth/events and one scene.
- Geometry, drawn-pixel and optional-loading regressions pass with the shared gate.

## Sources of truth

Read `shared-contract.md`, the design, actual B0 artifacts/report and Phase 1 of the plan. Verify B0's source/class/budget decision rather than assuming its output exists.

## Verified starting state

- `scene.ts` already uses Three line addons for Vietnam; no new dependency is needed.
- `surfaceOutlineSegments` accepts Polygon/MultiPolygon rings and cannot be used for LineString input by a type cast.
- The current loader awaits core imports/highlight/coastlines; the new optional asset must not be appended as another fatal dependency.
- Existing scene disposal, invalidate/resize methods and camera race protection must remain intact.

## Scope and hard constraints

In scope: spherical line helper, one scene setter/batch, independent optional fetch/status, geometry and browser regressions. Out of scope: camera/intro/journey redesign, global shell changes, texture expansion, labels/provinces/maritime lines and historical edits. Apply all shared single-agent/security/source constraints.

## Relevant files and patterns

- `lib/explorer/cinematic/country-boundaries.ts`, `projection.ts`, `scene.ts`.
- `components/explorer/cinematic/CinematicGlobeCanvas.tsx` and current scene disposer/invalidation pattern.
- New unit tests and `tests/e2e/home-country-boundaries.spec.ts`; retained public homepage tests.

## Work item — add geometry without creating a new failure path

**Problem:** Correct source data still needs line-specific spherical subdivision, genuine Earth occlusion and safe asynchronous attachment.

**Required change:** Follow B1. Write red tests for two-point/no-closing-edge behavior, disconnected parts, coordinate order, seam, subdivision, invalid/degenerate input and segment limits. Implement the plan's `countryBoundarySegments` and scene `setCountryBoundaries` contracts. Use one installed Three line batch, depth testing, explicit resize/disposal and a single invalidated redraw. Load/parse the optional asset concurrently; only the current live scene receives it. Failed/malformed/slow data must not trigger the renderer-error UI or change URL/camera state.

**Acceptance criteria:** Three source-derived near-side regions show actual line pixels compared with the same camera and the asset blocked. Far-side lines remain hidden. 404, invalid JSON/geometry and delayed completion during navigation/retry retain one working Earth, selectable events and no stale scene attachment. Count/request assertions supplement rather than replace render evidence.

**Verification:** Focused geometry and optional-failure browser cases, existing event/navigation races and the shared full gate. Use a fresh local production target and stable reduced-motion snapshots.

## Deliverables and stop conditions

Return contracts/lifecycle changes, actual render/failure evidence, files/check results and the local B1 report. **STOP at B1.** Do not redesign the visual shell, change authored data or begin B2 styling work.

## Final recap

Draw one safe optional country-line layer on the real scene, preserve core behavior, and stop after B1.
