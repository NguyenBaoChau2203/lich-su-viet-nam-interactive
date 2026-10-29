# All-34 Province Correctness Follow-up — Implementation Plan

> **Executor:** Cursor Agent with Auto, one main agent. Execute inline using an executing-plans workflow where available; adapt reviews to self-review. No subagents, other AI processes or automatic Git integration.

**Goal:** Retain national 34-unit functionality while correcting the five confirmed follow-up findings and producing acceptance evidence that measures real topology, geometry, motion and visibility.

**Architecture:** Keep the current owner/reducer, Three.js scene/camera, finite render scheduler and published readers. Repair selection lifecycle inside the province presentation layer; derive a shared-border-preserving national asset from the already recovered input; add radius-aware visible projection and stable outline storage.

**Stack:** Existing Next/React/TypeScript, Three.js/three-globe, Node source pipeline, Vitest and Playwright/Edge. Reuse installed tools. A robust pinned local topology validator may be justified if existing tooling is insufficient; no new runtime map/renderer dependency.

**Sources:** `docs/audits/2026-10-29-all-34-followup-review.md`, the owner-approved behavior in `docs/superpowers/plans/2026-10-29-whole-province-lift-panel-close-plan.md`, and the earlier all-34 execution contract. Latest task prompt: `docs/agent/prompts/2026-10-29-cursor-auto-all-34-correctness-followup.md`.

## Constraints and review focus

- Preserve all 34 canonical codes, compatible recovered source data, thin timeline, combined cards, input-cancel fix and panel-only X. Do not restart the homepage or replace a real area with a label effect.
- Do not repair a shared-border defect by choosing an arbitrary preferred code, changing only the raycast or using a nearest-center rule. Rendered shapes, picking and projection must use the same qualified geometry.
- Keep geographic generalization explicit. Source-relative error can move a border within its qualified tolerance; it cannot create overlapping neighboring ownership or unexplained gaps.
- Camera callbacks must never reselect a cleared province, and a hidden selected province must not project a visible leader through Earth.
- Test after the complete optional area layer is ready and with real motion enabled for lifecycle cases. Base-globe readiness and reduced-motion cases alone cannot prove these contracts.
- Test underlying buffer identity and actual cap/wall geometry. Positive vertex counts and an animation clock are insufficient.
- Preserve contributor changes; no Word/secret/remote media changes, commit, push, PR, merge or deploy. Desktop scope remains the four approved CSS sizes.

## Task 1 — Preserve clear/exit intent through camera updates (F2)

**Modify:** `lib/explorer/cinematic/province-areas.ts`, only necessary owner/adapter wiring. **Tests:** add focused lifecycle cases to `tests/unit/province-areas-geometry.test.ts` or a nearby layer test; create `tests/e2e/home-province-areas-lifecycle.spec.ts` and include it in a reviewed isolated config.

**Interface:** Preserve `setSelected(code, {nonce, instant})`, `setCameraClearance()`, `update()` and disposal. Keep the last desired owner selection/transition purpose distinct from an outgoing visual; this private mirror is not another meaningful application-state store.

- [ ] Reproduce non-reduced Hà Nội → clear → overview camera/zoom, including clear during an active approach. After the finite lowering completes, no selected province geometry remains while URL/cards/chooser indicate no selection.
- [ ] Add a failing layer test: select A, begin lowering, change camera clearance repeatedly, advance time beyond the transition. Require no resurrection and final disposal.
- [ ] Record null/exit intent immediately. Camera safety may clamp current outgoing geometry but must retain its zero target and cannot turn it into a new raise. A newer explicit B selection may supersede the outgoing visual through the existing code/nonce owner.
- [ ] Test clear plus flight ticks, wheel, resize, mode exit, visibility restoration and delayed area completion. Retain normal camera-safe lift for active selection and idempotent same-selection behavior.
- [ ] Verify X/reopen still retain the selected province/camera/nonce; explicit clear has different behavior.

**Acceptance:** No code/camera completion can revive a cleared or departed province. Normal-motion and reduced-motion cases pass; the existing close-camera protection remains intact.

## Task 2 — Preserve shared topology through asset optimization (F1)

**Modify:** `scripts/province-boundaries/simplify_areas.mjs`, `build_areas.mjs`, qualified source/provenance and validators as needed. **Tests:** create `tests/unit/province-areas-simplification.test.ts`, extend admission/national coverage tests. **Outputs:** complete area asset/provenance, topology audit/metrics and source-generation commands.

**Input:** Reuse the existing complete unsimplified candidate and pinned/recovered source with verified hashes. Do not refetch all 16 ways merely to restart a completed checkpoint. The current saved exports have compatible observed timestamps; make that check reproducible/fail-closed for future input.

- [ ] Pin a negative regression for neighboring rings whose independent simplifications cross or overlap. Add the currently shipped boundary sample near `(105.88752842741935, 21.328063508064513)` as a dataset regression with source/output membership recorded.
- [ ] Derive common arcs from source way/node identity or an equivalent robust topology graph, preserving junctions. Simplify a shared arc once and reuse exactly the same sequence in both neighboring rings, reversing orientation where needed. Reuse existing pipeline capabilities if they already provide this.
- [ ] Preserve every qualified component, hole, identity and ring orientation. Validate degeneracies, self-crossings, shell/hole and component relationships after simplification/quantization, not only on the original candidate.
- [ ] Add a national check for shared-arc equality and introduced gaps/positive-area overlaps. Legitimate shared edges/vertices are allowed. Distinguish any pre-existing source anomaly from an optimization regression; record/block unresolved anomalies rather than fabricating a patch.
- [ ] At the reviewed coordinate require consistent single ownership under the new qualified displayed geometry. Do not force code 19 or 24 by a special-case rule. Compare source-relative error and use independent samples outside the qualified uncertainty band for exact source membership assertions.
- [ ] Qualify a chosen tolerance with measured source/screen error at the intended desktop views. The old 200m value and small gzip count alone are not an accuracy gate. Preserve the aggregate budget without sacrificing source topology; report an unmet budget rather than silently weakening it.
- [ ] Enforce source timestamp/version rules in recovery qualification, including nodes and duplicates/conflicts. Add future/missing timestamp and incompatible shared-node controls. Keep the compatible current recovery and original incomplete-input negative control.
- [ ] Make generation and post-generation validation reproducible from documented pinned inputs/hashes. A source path found only in one user's ignored folder is insufficient as the sole recipe. Run the resulting check from `pnpm verify` or an explicitly documented required checked-in command.

**Acceptance:** Exactly 34 canonical units; common optimized borders agree; no unqualified introduced overlaps/gaps; source-qualified parts/holes preserved; new complete default asset and matching provenance pass topology and budget gates. Rendering and picking use that same output.

## Task 3 — Project only visible raised geometry (F3)

**Modify:** `lib/explorer/cinematic/scene.ts`, relevant pure projection helpers, `CinematicEventMap.tsx`, projection types if necessary. **Tests:** pure visibility cases plus readiness-aware O10/F34 browser cases.

**Interface:** Provide one existing-camera projection path that can project a geographic point at its actual radius and indicate clipping, stage bounds and Earth occlusion. Preserve raw debug projection semantics if other tests need them; the UI must use the visible-surface contract.

- [ ] Reproduce selected Hà Nội → wait for full area readiness → opposite-side view `{lat:-21,lng:-74,zoom:7}`. Require readable cards and no leader/visible area anchor.
- [ ] Test raised visible point, far-side point, silhouette/tangent, near/far clip and offstage cases. Use segment-to-Earth occlusion up to the projected point with a documented radius-aware tolerance; a clip-space Z check alone is insufficient.
- [ ] Publish only visible selected-area bounds/anchors through the existing code/nonce projection channel. Handle a partially visible province without reporting hidden components as visible.
- [ ] Restore the leader exactly when actual selected geometry becomes visible again; do not clear the meaningful selection or move the camera merely to hide a leader.
- [ ] Test during finite lift/camera frames, after resize and hidden/visible restoration at all four desktops. Fix O10 readiness so it cannot accidentally pass through the reference-center fallback.

**Acceptance:** No leader crosses the opaque Earth from a hidden province; visible leaders/area bounds remain aligned with actual raised geometry. Cards and keyboard access survive occlusion.

## Task 4 — Keep outline storage stable and measure resources (F4)

**Modify:** province layer and scoped measurement tests. **Pattern:** reuse the existing `outlineTemplate`/line geometry. Update its interleaved buffer in place or radially scale the same outline around the globe origin; do not call a buffer-allocating `setPositions()` on every height update.

- [ ] Add a failing test that records the outline's `instanceStart`/`instanceEnd` interleaved-buffer identity throughout a finite lift and camera-safe retarget.
- [ ] Allocate outline positions once per source selection. Keep cap/wall/outline endpoints consistent; scale only the top/outline when appropriate, never detach wall bottoms.
- [ ] Track WebGL create/delete and buffer uploads on repeated warm-up/select/clear/exit cycles. Verify a bounded settled baseline and explicit disposal for superseded or failed layers; do not infer this from a constant geometry count.
- [ ] Measure actual selected bytes/draws and settled/hidden draws, including static pick-layer cost. Preserve the <=3 selected draw, <=6MiB selected-buffer and zero idle-draw targets; account for the complete asset aggregate <=400KiB gzip target separately.

**Acceptance:** No outline position-buffer replacement during the finite animation; repeated cycles do not keep accumulating unaccounted live resources. Report actual hardware/browser and limitations rather than claiming permanent driver memory retention from create-minus-delete alone.

## Task 5 — Replace nominal acceptance with evidence for the real contracts (F5)

**Modify:** national/lifecycle E2E, geometry/admission/simplification tests, isolated config(s), matrix exporter/audit and `CURRENT-STATE.md` if its current claim overstates completion.

- [ ] Preserve the useful all-34 direct-URL/single-anchor tests, but label their scope accurately. Derive `meshPassed` only from actual geometry assertions, not a literal flag following radius/count checks.
- [ ] Obtain at least two independently source-qualified interior samples per unit and component/hole samples where applicable. Use source/topology membership expectations separate from the renderer's display-anchor helper. Include shared-border negative/ownership checks and the reviewed overlap regression.
- [ ] Inspect the real cap/wall buffers: finite positions, vertex radii, base/top wall attachment, all qualified parts and no triangles filling holes. An animation-clock radius/part count cannot substitute for these checks.
- [ ] Test F1–F4 negative paths and normal-motion lifecycle. Wait for actual complete-layer readiness; add DPR/offset, drag/cancel, close/restored camera, Back/Forward, detail returns and image/area-load failure cases from the original contract.
- [ ] Execute all-34 coverage at four desktops with batching where safe, plus representative normal-motion/oblique full-surface recordings and X/reopen invariance. Existing Playwright recording succeeded during review; use available recording tools or report an exact unresolved capture issue.
- [ ] Write raw test artifacts under `output/playwright/` with asset/code hashes and unique run IDs. Export durable acceptance matrices only from qualified completed results. Do not have ordinary test runs silently overwrite the reviewed source-of-truth audit files.
- [ ] Record source-qualified, shipped, runtime-built, actual-mesh-tested and browser-tested sets separately. Require each to equal canonical membership and include topology/lifecycle/resource/capture gate status; set equality alone cannot imply all contracts passed.
- [ ] Supersede the previous completion claim with a dated correction and fresh evidence; preserve the earlier report as history. Self-review all findings before the final gate.

**Acceptance:** F1–F5 closure links to current test evidence, full all-34/four-desktop contract passes, required recordings are present, and no required failure is concealed behind a green count.

## Final verification and handoff

Use `NoDefaultCurrentDirectoryInExePath=1` in the local shell. Run narrow tests during each task. Rebuild the dedicated fixture after product/asset edits, never while serving its output. Register lifecycle cases with a source-inspected isolated config; preserve separate JSON outputs. Run configs sequentially, stop at first failure and diagnose instead of extending timeouts repeatedly.

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
pnpm verify
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test --config playwright.province-areas.config.ts --project=1280x720 --grep 'F34-' --max-failures=1 --global-timeout=180000
pnpm exec playwright test --config playwright.province-areas.config.ts --max-failures=1 --global-timeout=900000
pnpm exec playwright test --config playwright.local-heroes.config.ts --max-failures=1 --global-timeout=900000
pnpm exec playwright test --config playwright.local-heroes-regression.config.ts --max-failures=1 --global-timeout=900000
# Ensure no server is serving normal .next before the separate smoke build.
pnpm build:smoke
$env:E2E_CHANNEL = 'msedge'
pnpm exec playwright test --config playwright.smoke.config.ts --max-failures=1 --global-timeout=300000
git diff --check
git status --short
```

Include the new deterministic source/post-optimization topology checks in the gate and report their exact commands. Do not run the uninspected legacy DB-mutating E2E collection.

Deliver scoped code/data/tests, source/provenance, the corrected all-34 acceptance audit/matrix, four-desktop and oblique video evidence, resource measurements, Vietnamese self-review handoff and ignored `.task-reports/YYYY-MM-DD-HHmm-all-34-correctness-followup.md`. Stop at locally verified handoff without committing, pushing, PR creation or deployment. A genuine unresolved source/tool/gate blocker must be reported as incomplete, with independent fixes preserved.
