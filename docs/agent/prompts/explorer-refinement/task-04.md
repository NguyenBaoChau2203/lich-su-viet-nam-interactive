# Prompt — Task 04: restore the animated schematic journey connection

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 4/5. Execute one task inline.

## Mission

Render the missing georeferenced journey connection on the current sphere, with finite progress during valid flights and a static readable path after arrival.

## Definition of done

- The selected journey's authored sequence through the active stop is actually visible on Earth.
- Progress follows the existing flight owner; no stale path from another journey and no continuing idle animation.
- Seam/occlusion/repeated points, cancellation, reduced motion and disposal are tested.

## Sources of truth

Read `shared-contract.md`, the route design, Task 04 and Task 03's actual registry/request handoff. The path is schematic, not a reconstructed travel/military route.

## Verified starting state

The data helper remains but the active Three renderer has no journey-route setter/layer. The MapLibre style's old line source does not draw on the current scene. Verify current code before changing it.

## Scope and hard constraints

In scope: bounded route helper/material/batch, scene/flight adapter hook and render/cancellation tests. Out of scope: another animation engine/clock, perpetual trail, altered historical stops, province data or a new camera controller. Apply all shared constraints.

## Relevant files and patterns

New `lib/explorer/cinematic/journey-path.ts`; current `scene.ts`, `flight.ts`, `camera-controller.ts`, `CinematicEventMap.tsx`; registry helper and new path geometry/render tests.

## Work item — connect authored milestones to real scene geometry

**Problem:** A connection array or disclosure caption does not supply the missing visible effect; a separate loop would undermine the on-demand scene and stale-request protection.

**Required change:** Follow Task 04. Write a red actual-render case, construct bounded spherical segments/arcs in authored order, handle seam/zero-length/repeated cities and Earth occlusion. Add a focused path setter carrying selected journey/stop/nonce; freeze its signature in progress. Drive finite current-leg reveal/light from the existing flight/render lifecycle and retain completed segments statically. Clear safely on switch/exit/retry/disposal. Reduced motion shows a static path immediately; manual dragging adds no historical point.

**Acceptance criteria:** Real multi-stop path pixels/progress are present, markers remain clickable and globe depth hides the far side. Rapid seek/switch/exit/hidden cannot draw an obsolete route. No continuing idle/hidden draws or new animation engine. Wording makes schematic interpretation clear.

**Verification:** Geometry and pair/nonce tests plus real route rendering, cancellation/reduced-motion/lifecycle checks and shared full gate. Count/data assertions alone do not prove the fix.

## Deliverables and stop conditions

Return route API, actual comparisons/progress evidence, frame/lifecycle checks, progress record and local Task 04 report. **STOP after 04.** Do not author new historical content or begin provincial work.

## Final recap

Restore a finite truthful path on the existing globe, preserve one motion owner, and stop after Task 04.
