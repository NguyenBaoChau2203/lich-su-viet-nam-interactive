# Prompt — B2: match country-line hierarchy to the reference

## Mission

Tune the integrated country-border strokes so the map gains the reference's national separation while Vietnam and historical events remain the visual focus.

## Definition of done

- Same-camera present/blocked comparisons at all four desktop sizes show subtle readable inland country separation.
- Vietnam shared edges, seam/horizon and line joints are clean; labels/click targets remain usable.
- Map sources disclose modern generalized boundaries and the applied omission policy.

## Sources of truth

Read `shared-contract.md`, reference PNG, proposed design, B0/B1 evidence and Phase 2 of the plan. Use real source geometry, never trace the concept.

## Verified starting state

- B1 must have a real optional batch and working lifecycle tests; confirm it before styling.
- The existing Vietnam outline is gold and 1.5 CSS px; contextual lines must remain subordinate.
- Current coastlines are 50m physical geography while Vietnam uses finer national geometry; visible shared-edge differences are possible.
- The old outline uses opaque stroke color to avoid round-cap beads; inspect the chosen country material at joints instead of assuming transparency is harmless.

## Scope and hard constraints

In scope: country line color/width/depth/resize tuning, bounded shared-edge correction if evidenced, source copy and visual checks. Out of scope: replacing textures/camera, adding country/province labels, a political-map interface or historical borders. Keep all shared constraints, keyboard access and existing Vietnam/island data.

## Relevant files and patterns

- `lib/explorer/cinematic/scene.ts`, `country-boundaries.ts` and installed line addons.
- `CinematicGlobeCanvas.tsx` optional status, `CinematicEventMap.tsx` map sources, vector attribution.
- New boundary browser tests and existing four-size/contrast homepage tests.

## Work item — calibrate the passive atlas layer

**Problem:** Oversized gold/gray strokes, translucent joint beads or duplicate shared edges can make the added layer more distracting than the missing one.

**Required change:** Follow B2. Start from the spec's warm slate and width ranges, with real depth occlusion and current Vietnam dominance. Capture default/world/card/European-journey states at 1280×720, 1366×768, 1440×900 and 1920×1080, plus DPR/resize and near-edge detail. If shared-edge duplication is visible, apply the smallest source-aware fix and test it; do not use broad bounding-box deletion or alter the national outline. Add the proposed modern-boundary/source-policy disclosure and optional-unavailable copy inside map sources.

**Acceptance criteria:** Country boundaries are visible yet quieter than Vietnam/events, with no seams, far-side leakage, bright beaded joints or parallel country/Vietnam strokes. Controls and marker hits remain unchanged; source links remain keyboard reachable. No new labels or focus targets arise from passive line geometry.

**Verification:** Same-camera boundary-present/blocked/reference comparisons, real click/keyboard/contrast/layout checks and shared full gate. Record any residual source-scale difference honestly instead of claiming pixel identity with generated geography.

## Deliverables and stop conditions

Return the four-size comparison set, final stroke choices, shared-edge/occlusion evidence, checks and local B2 report. **STOP at B2.** Do not start new polish features or execute B3 automatically.

## Final recap

Deliver restrained country separation with clean Vietnam hierarchy, preserve access and source honesty, and stop after B2.
