# Prompt — Task 02: restore useful event zoom and declustering

**Recommended model:** GPT-6.1 Sol, reasoning max. **Complexity:** 5/5. Execute one task inline.

## Mission

Let users zoom beyond the current 5.4 cap, separate real nearby event locations and select coincident events without falsifying geographic coordinates.

## Definition of done

- Plus/wheel/keyboard/cluster requests reach useful local zoom up to the proposed max 11.
- Real Hanoi/southern anchors separate where geographically possible; remaining overlaps have usable screen expansion/leader lines and an honest explanation.
- Legacy views, precision, hit/focus, filter and detail/history behavior remain correct.

## Sources of truth

Read `shared-contract.md`, the design's zoom section, Task 02 in the plan, review coordinate inventory and latest progress. Keep Task 01 tuning.

## Verified starting state

The review reproduced an unchanged zoom 5.4 after plus and cluster zoom. `zoomView` caps new input; old tests expect it. The public page already has distinct Nhà hát Lớn, Ba Đình, Hanoi-area, Bến Nhà Rồng, Sài Gòn-area and Dinh Độc Lập points. Do not assume every cluster needs new coordinates.

## Scope and hard constraints

In scope: camera input bounds, all-member cluster fit, truthful screen expansion, overlay/depth corrections proven necessary and tests. Out of scope: invented/moved GPS, bulk historical edits, street tiles/POIs, new renderer or journey changes. Preserve legacy URL decoding up to 18 and all shared rules.

## Relevant files and patterns

`camera.ts`, `projection.ts`, `overlays.ts`, `map-markers.ts`, `GlobeMarkers.tsx`, `CinematicEventMap.tsx`; proposed `lib/explorer/cluster-expansion.ts`; camera/overlay tests and new refinement E2E.

## Work item — separate camera scale from image sharpness

**Problem:** An image-detail cap prevents distinct source locations from separating; repeated cluster zoom centers only the first anchor and can become inert.

**Required change:** Follow Task 02. Write red tests for zoom beyond 5.4, cap 11, graceful legacy zoom-out, safe-area fit of every distinct member, coincident inputs, stable screen expansion and focus. Reuse published coordinates. Keep softened texture as context and verify cap/outline/line/HTML alignment and near planes at 8/10/11. Provide a deterministic selectable expansion when useful zoom cannot separate anchors, with leaders back to original positions and no geographic jitter.

**Acceptance criteria:** At least two real Hanoi events separate geographically; every member remains selectable, including identical-coordinate fixtures. Mouse/keyboard controls move the real view. Cluster expansion respects ≥32 px targets, overlays, Escape and card/detail focus return. Filters and URL/reload/history remain correct.

**Verification:** Meaningful geometry/group tests, actual Hanoi/southern/coincident browser cases, legacy/navigation races, then shared full gate. Update the old cap tests explicitly; do not delete their legacy restoration checks.

## Deliverables and stop conditions

Return before/after evidence, final fit/expansion API, tests, progress update and local Task 02 report. **STOP after 02.** Do not fix the journey registry/path or add new location claims without evidence.

## Final recap

Restore useful truthful event selection beyond 5.4, preserve camera/history integrity, and stop after Task 02.
