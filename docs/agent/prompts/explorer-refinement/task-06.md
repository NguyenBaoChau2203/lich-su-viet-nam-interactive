# Prompt — Task 06: integrate the optional Vietnam province boundary layer

**Recommended model:** Gemini 3.8 Flash, thinking high. **Complexity:** 3/5. Execute one task inline.

## Mission

Render Task 05's verified interior province edges on the existing globe with readable subordinate styling and safe optional-data lifecycle behavior.

## Definition of done

- Current province borders are visible inside Vietnam at the overview and useful local scales.
- The layer preserves the gold national outline, route/marker readability and current camera behavior.
- Failure, late loading, reduced motion and disposal do not break Earth/events.

## Sources of truth

Read `shared-contract.md`, Task 06 in the plan, the province/depth sections of the design and verified Task 05/02 progress contracts. Verify the actual artifact/provenance, not just a previous completion report.

## Verified starting state

Country edges already use an optional loader and a batched line path. Vietnam has separate raised fill/outline geometry; placing a province line at the existing country radius can hide it below the fill. Task 05 must have passed before production integration. Unknown/unverified source input is not an acceptable fallback.

## Scope and hard constraints

In scope: a focused province setter/helper, optional load/abort/disposal path, line styling and source disclosure/credits. Out of scope: camera/registry/controller rewrites, geometry research shortcuts, global province labels, province click targets or another renderer/animation loop. Apply all shared constraints and use the already frozen contracts. If a structural defect is found, report/reproduce it instead of expanding the task into a rewrite.

## Relevant files and patterns

Inspect `lib/explorer/cinematic/province-boundaries.ts`, `scene.ts`, `CinematicEventMap.tsx`, existing optional country loading and scene retry/context lifecycle, the credits/disclosure UI, and Task 05's artifact/provenance. Add focused lifecycle/render cases using existing conventions.

## Work item — attach one passive, readable province batch

**Problem:** Province data can load successfully while being hidden under Vietnam's cap or repeatedly attached after a stale scene has been disposed.

**Required change:**

1. Use the province-specific validator and one line batch; load optionally, abort on replacement/disposal and ignore stale completion. Core readiness/events must not await it.
2. Place the stroke above the Vietnam fill and below the national gold outline. Preserve true Earth depth/occlusion, stable CSS-pixel widths and resize resolution. Match the design's hierarchy rather than making all borders equally bright.
3. Make the layer readable at the default Vietnam reference and local zooms 8/10/11 while keeping world/foreign context quiet. Do not add labels, POIs or a province interaction layer.
4. Include a Vietnamese disclosure that these are 34 current reference units, not the borders of the displayed historical year; show the actual represented/source date, source credit and license materials from Task 05.
5. Preserve frozen camera/path/state APIs, one render owner and country/island coverage. Optional failure keeps existing events and geography usable; retries must not duplicate buffers or listeners.

**Acceptance criteria:** Actual rendered province strokes are distinguishable from national/country edges; all four desktop sizes retain usable cards/controls; no z-fighting, hidden-under-cap effect or route/marker interception at local scale. Missing/invalid/late data and repeated mount/disposal do not leak or block the map.

**Verification:** Real same-camera screenshots at overview/local scale plus meaningful optional-failure/retry/lifecycle cases. Check keyboard, reduced motion, credits and console/network. Run the focused province/country/render tests, scoped public desktop E2E, `pnpm verify`, diff/status. Report measured added buffers/draw calls/asset cost; a nonzero line count alone does not prove visibility.

## Deliverables and stop conditions

Return changed files, actual visual/failure evidence, costs, verified progress and local Task 06 report. **STOP after 06.** Do not start historical content or a new controller. If Task 05 is not verified, stop before production integration and identify its missing evidence. After two unsuccessful structural attempts, hand the concrete failure back to the owner; do not launch another model.

## Final recap

Integrate only verified modern province data as a passive optional layer, prove actual visibility and safe failure, and stop after Task 06.
