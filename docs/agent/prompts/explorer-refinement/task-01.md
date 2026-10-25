# Prompt — Task 01: brighten geographic reading

**Recommended model:** Gemini 3.8 Flash, thinking high. **Complexity:** 2/5. Execute one task inline.

## Mission

Make country borders, the Earth reading surface and atmospheric limb slightly brighter while preserving the established navy/gold hierarchy and readable event UI.

## Definition of done

- Same-camera comparisons demonstrate the restrained improvement at four desktop sizes.
- Vietnam/events remain visually dominant, no white limb blowout or weaker text/dot contrast.
- Focused browser/full checks and the required handoff are recorded.

## Sources of truth

Read `shared-contract.md`, the design's light/line section, Task 01 in the plan and the progress audit. Do not implement later tasks.

## Verified starting state

The review found `BOUNDARY_SLATE=#56605a`, Earth ambient 0.22 and atmosphere intensity 0.92. Recheck current code. Country borders are already implemented; this is not another renderer/data migration.

## Scope and hard constraints

In scope: bounded material/stroke tuning and visual evidence. Out of scope: camera/zoom, journey state/data, province geometry, source assets and new dependencies. Inherit all shared protections.

## Relevant files and patterns

`lib/explorer/cinematic/materials.ts`, `scene.ts`; existing contrast/layout and `home-country-boundaries.spec.ts` checks. Keep current line depth/resolution and geometry intact.

## Work item — tune the current materials

**Problem:** The owner finds contextual borders and overall/atmospheric lighting too dark.

**Required change:** Follow Task 01. Capture fixed-camera baseline, try the spec's small parameter ranges, choose the least change that improves reading and inspect real border joints/limb/text backgrounds. Do not use a CSS brightness filter or broad bloom effect.

**Acceptance criteria:** Four desktop comparisons remain usable; country context is clearer, gold Vietnam/markers stay stronger, text ≥4.5:1 and meaningful controls/dots ≥3:1. No geometry/source change or endless effect loop.

**Verification:** Real screenshots and retained contrast/layout/country cases, then shared full gate. No trivial unit tests of hex values. Preserve any existing baseline warnings accurately.

## Deliverables and stop conditions

Return comparisons, chosen parameters, checks, progress update and local Task 01 report. **STOP after 01.** Do not fix zoom or start another prompt; record structural concerns for the owner.

## Final recap

Improve the existing light hierarchy with bounded edits, prove readability, and stop at the Task 01 handoff.
