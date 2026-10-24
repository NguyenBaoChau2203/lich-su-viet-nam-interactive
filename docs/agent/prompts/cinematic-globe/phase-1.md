# Prompt — Phase 1: prove the cinematic Earth appearance

## Mission

Build a local visual prototype that demonstrates the reference's large Earth framing, surface detail and atmospheric limb around a usable Vietnam overview before migrating the real homepage.

## Definition of done

- Real prototype screenshots at 1440×900 and 1280×720 show the required framing, texture, lighting and sourced Vietnam highlight.
- The six-category visual review scores at least 10/12 with no zero and identifies remaining differences honestly.
- Camera logic and provisional cost/performance evidence are recorded. The production homepage remains on its current renderer.
- The owner receives the prototype comparison for the explicit P1 visual decision.

## Sources of truth

Read `shared-contract.md`, the visual spec, reference PNG, source audit, completed P0 baseline audit and Phase 1 of the plan. Do not infer owner acceptance from this prompt or a self-review score.

## Verified starting state

- Existing MapLibre behavior is the baseline, not a visual match to the concept.
- P0 must have selected exact source/dependency/asset inputs. Verify its artifacts before using them.
- The official Earth example uses a node/TSL renderer pipeline; the selected project pipeline must be internally coherent.
- Unknown until measured: final camera parameters, texture detail at close range, new bundle/memory/frame costs.

## Scope and hard constraints

In scope: isolated localhost prototype, one justified dependency, local credited imagery, scene/material/camera helpers and relevant tests. Out of scope: replacing `EventMap` on the homepage, complete event/journey wiring, historical edits or public deployment. Use one agent; retain MIT/CC BY notices and one npm Three instance.

## Relevant files and patterns

- Proposed `components/explorer/cinematic/CinematicGlobePrototype.tsx` and `CinematicGlobeCanvas.tsx` — local preview and mount boundary.
- Proposed `lib/explorer/cinematic/{scene,materials,projection,camera}.ts` — focused scene helpers.
- `public/maps/vietnam-tabletop.geojson`, its provenance and P0 image manifest — real geography and imagery.
- Proposed `tests/unit/explorer-cinematic-camera.test.ts` — camera logic proof. Use real-browser preview capture for this phase; production `home-cinematic-globe.spec.ts` coverage begins in Phase 3.
- Keep the preview harness under ignored `output/prototypes/`, outside the public route tree, as described in the plan.

## Work item — establish a credible visual proof

**Problem:** The current flat fill and close top-down camera cannot demonstrate the reference's material depth or curved horizon.

**Required change:** Follow Phase 1. Adapt the verified Earth/custom-material source into a single scene; calibrate large partially cropped Earth/Vietnam framing; add a thin physically aligned atmospheric shell and restrained near-surface highlight. Include a minimal preview-only HTML composition scaffold so the camera is evaluated with the actual reading/control regions; do not build fake event interactions. No raised polygon slabs or CSS-scaled flat background. Keep imagery label-free and stars subordinate. Introduce meaningful camera conversion tests and round-trip the existing serialized zoom values. Record asset memory including mipmaps and inspect the closest useful event-selection view for blur. Follow the plan's preview cleanup rules; ignored TypeScript apps are still included by the root typecheck.

**Acceptance:** The default Vietnam overview shows a visible planetary limb, readable Vietnam and surface detail at both prototype sizes. No imagery/overlay offset, opaque clouds over Vietnam, seam or z-fighting. The old production UI remains usable. Meet the spec's visual score and provisional budgets or report concrete evidence of the failed limit.

**Verification:** Real-browser screenshots and a side-by-side concept/prototype comparison; camera unit checks; repeatable flight measurement; shared full gate. Do not claim the demo's FPS counter is a project benchmark. Mark browser-only/engine limitations explicitly.

## Deliverables and stop conditions

Return the comparison images, exact camera/renderer/asset choices, score by category, fresh test results and local report. **STOP at P1 and wait for the owner's actual visual acceptance.** Do not replace the homepage or begin Phase 2. If appearance is still materially wrong, report that and keep the task in the prototype phase.

## Final recap

Prove the Earth appearance with a working local prototype, preserve production behavior, and stop for the P1 visual checkpoint.
