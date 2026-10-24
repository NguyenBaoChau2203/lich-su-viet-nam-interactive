# Prompt — Phase 2: verify spherical geography and curated overlays

## Mission

Make the accepted cinematic prototype's Vietnam geography, event-anchor projection, Earth occlusion and curated labels correct within their documented source precision.

## Definition of done

- Sourced Polygon/MultiPolygon geometry, holes and existing island coverage render without raised-country artifacts or texture misalignment.
- A renderer-neutral CSS-pixel projection contract passes real coordinate, near/far-side, seam and edge tests.
- Browser captures prove alignment and selective labeling; historical data remains unchanged.

## Sources of truth

Read `shared-contract.md`, the visual spec, Phase 2 of the plan, accepted P1 evidence/owner response and geographic provenance. Confirm P1 acceptance exists before modifying dependent work. The reference's geographic shapes are not authoritative.

## Verified starting state

- The repository has sourced modern generalized Vietnam/world geometry, six curated Vietnamese place labels, published event anchors and an authored approximate journey.
- The old planar projection helper is not suitable for a sphere; old MapLibre-specific projection internals are not a Three.js visibility algorithm.
- P1's final camera/texture alignment must be checked on disk; this prompt is not evidence those changes have been made.

## Scope and hard constraints

In scope: geographic/projection/material corrections and prototype HTML overlays. Out of scope: changing historical coordinates/prose, adding administrative-border datasets merely to imitate the image, production integration or new itinerary data. Inherit all shared historical/security/single-agent rules.

## Relevant files and patterns

- `lib/explorer/cinematic/projection.ts`, `materials.ts`, `camera.ts` — proposed P1 helpers.
- `lib/explorer/map-markers.ts` — reuse anchor/group semantics.
- `components/explorer/GlobeMarkers.tsx` — current semantic/uncertainty behavior to preserve.
- `public/maps/vietnam-tabletop.geojson`, `history-world-land.geojson`, `history-vietnam-labels.json` and provenance.
- Proposed `tests/unit/explorer-cinematic-projection.test.ts`; existing geography/integrity tests.

## Work item — prove geographic placement

**Problem:** A visually attractive sphere can still place Vietnam, islands or event lights on the wrong surface or display far-side points through Earth.

**Required change:** Follow Phase 2. Write red tests for existing source anchors, coordinate order, ±180° seam, invalid values, near/far-side and viewport rejection. Implement the plan's `GlobeViewport.project(lng, lat)` contract relative to stage CSS pixels, returning `null` for occluded points. Respect polygon holes/curvature; use near-surface tint and outline rather than extrusion. Resolve label collisions with real current reading/control rectangles. Keep overseas names tied to visible events or the active authored journey.

**Acceptance:** Three or more existing sourced anchors align with the correct geography; far-side markers disappear while HTML links remain. Modern/generalized boundaries and approximate coordinates keep their disclosures. No generated island dots, leaked global POI labels or historical data changes.

**Verification:** Run focused new projection and existing map-marker/geography tests; inspect world/Vietnam/nearby-coast and far-side captures on the real renderer. Run the shared full gate. Do not require a test-only screenshot mock or delete source-integrity checks.

## Deliverables and stop conditions

Return changed helpers, test/evidence mapping, alignment screenshots, known source limitations and the local P2 report. **STOP at P2.** Do not wire the production homepage or start its shell redesign.

## Final recap

Prove correct georeferenced overlays on the accepted scene, keep historical claims intact, and stop after the P2 handoff.
