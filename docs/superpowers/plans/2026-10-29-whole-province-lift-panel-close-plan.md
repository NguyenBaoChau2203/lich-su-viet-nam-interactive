# Whole-Province Lift and Panel-Only Close — Implementation Plan

> **Implementer:** Cursor Agent with Auto model selection, one main agent, as selected by the owner on 2026-10-29. This replaces the earlier Gemini-specific execution designation. Execute inline; use an executing-plans workflow if available and adapt all reviews to self-review. No subagents, other AI processes or automatic commits. This document is a plan, not implementation evidence.

**Current execution handoff:** `docs/agent/prompts/2026-10-29-cursor-auto-whole-province-lift.md`. The older Gemini prompt is a previous handoff, not a requirement to select that model.

**Goal:** Clicking the geographical interior of a province raises the entire province surface on the existing globe and keeps its connected cards, while X hides only the locality panel.

**Architecture:** Keep the existing Three.js scene, camera controller, reducer, public readers and projection channel. Add independently source-qualified province geometry, native mesh picking and one selected cap/side-wall/outline layer. Treat panel visibility as transient UI state, separate from mode and selection.

**Spec:** The owner-confirmed product contract below supersedes older close-to-exploration and label-only selection behavior. Read `docs/audits/2026-10-29-whole-province-research.md` for fresh code/browser research, primary documentation and remaining geography limits.

**Installed stack:** Three.js 0.186.1, three-globe 2.45.6, Next.js 16.3.8, React 19, TypeScript strict, current CSS, Vitest and Playwright/Edge. Do not install another renderer, map engine, animation library or triangulator for this task.

## Confirmed product behavior

### A. The geographical area rises

- Pointer activation on any admitted province interior selects that canonical province. The complete exterior shape and its valid islands/multipolygon parts lift; source holes remain empty. Names and dots may accompany selection but do not constitute the feature.
- Show a curved top surface, a fine perimeter outline and a shallow side wall connecting it to the globe. The whole valid province cap moves outward along the spherical radius. Do not enlarge a label, draw a fake rectangular plate or translate a flat map along world Z.
- A chooser row, canonical name label and interior click call the same `selectLocality(code)` callback. One meaningful selected code is owned by the existing runtime and URL.
- A new province lowers the previous cap and raises the new one; no second selected region, stale camera completion or old connector survives. Repeated selection of the same province does not replay all animations.
- The lift is an illustrative interface effect, not terrain height or historical administrative borders. Preserve existing national/island/coastline context and source disclosure.

### B. X hides only the left panel — explicitly owner confirmed

| User action | Required result |
| --- | --- |
| Panel X | Hide the chooser only; retain discovery mode, selected province, physical lift, cards, connectors, query/page, camera and URL |
| Header `Theo địa phương` while the panel is hidden | Reopen the panel with the same state, without a fresh flight or source request solely because it reopened |
| Explicit `Bỏ chọn tỉnh` | Lower the selected cap, clear selected locality/cards through its dedicated action, remain in discovery |
| Explicit `Khám phá` / `Hành trình` | Change the mode intentionally through existing owner actions |
| Back/Forward/detail return | Restore meaningful URL context; no automatic playback |

The 2026-10-28 `locality-exit-to-explore` rule must no longer be used by panel X. Keep intentional exit actions for the header; do not globally redefine every use of that action as hiding a panel.

### C. Presentation and motion

- Keep the current compact panel, thin timeline, connected HTML cards, media fallback and catalog capability. This is a geometry and close-behavior correction, not another complete homepage redesign.
- Proposed default selected lift: **0.006 globe radii**, bounded to **0.003–0.012** during measured tuning. The earlier 0.0015 proposal may be visually too subtle. Record the chosen value and an oblique-view side-wall screenshot; geometry/radius assertions establish actual lift independently of appearance.
- Proposed rise/lower duration **280ms**, cap outline emphasis **160ms**, existing card reveal **220ms** with at most **40ms** stagger. No infinite pulse/bobbing or new camera motion merely from X/reopen.
- Reduced motion renders the final selected shape and cards immediately; the static raised state remains valid. Hidden tabs stop rendering and finite animations are cancellation-safe.
- Hide the panel without closing cards. Recalculate the card safe area from actual visible rectangles, retaining selected province visibility and avoiding controls.

## Known starting state and non-goals

- The existing implementation has one compact shell and card cluster, and `LocalityProjection` already distinguishes `reference-center` from `province-area`. Current publication still uses reference-center/null area bounds.
- The scene has national polygon geometry plus shared province lines; the per-province meshes and lift were explicitly blocked, not delivered.
- The source control identifies 16 missing Khánh Hòa ways, including a hole. No complete 34-area collection is currently admitted.
- Existing `createSurfaceCap()` already uses three-globe to triangulate spherical Polygon/MultiPolygon copies and preserves source holes. Reuse it instead of implementing unreviewed planar triangulation.
- Preserve uncommitted changes and all media-owner work. Do not change historical narratives, sources/images, storage/database policies, admin/account/payment/study modules, Word files or secrets. No dependency upgrades, Git integration or external writes are part of this plan.

## Review focus

1. Tests must click geographical pixels away from names/HTML buttons and prove code identity plus cap lift; a label test cannot stand in for area picking.
2. X/reopen must preserve serialized state, selected code, cards, camera and request nonce without mode switches or history writes.
3. Holes, MultiPolygon/island parts, reverse winding, coastal/offshore clicks, shared-edge ties and far-side occlusion need explicit controls.
4. Panel hiding removes its occupied rectangle; stale rectangle observers and refocus effects must not hide cards, fly the camera or steal keyboard focus.
5. Repeated A→B→A, unmount/context loss and a late geometry load must not leak buffers or restore obsolete selection.

## Proposed file map

| File | Responsibility |
| --- | --- |
| `HistoryExplorer.tsx`, `LocalityChooser.tsx`, `HomeAtlasHeader.tsx`, scoped CSS | Panel visibility, semantic X button, stable reopen/focus |
| `LocalityCardCluster.tsx`, `lib/locality/popup-layout.ts` | Visible occupied rectangles and full projected province bounds |
| New `scripts/province-boundaries/build_areas.py` and a bounded recovery helper if necessary | Reproducible per-unit source assembly/validation; use existing Python/Shapely tooling |
| New `lib/locality/province-areas.ts` | Validated canonical area loader/schema |
| New `lib/explorer/cinematic/province-areas.ts` | Geometry/picking/lift lifecycle in the current scene |
| `geography.ts`, `scene.ts`, `CinematicEventMap.tsx`, `globe-contract.ts`, `lib/locality/projection.ts` | Existing geometry helpers, render scheduling, pointer pipeline and area projection |
| New unit cases plus existing isolated public tests | Pin hide/reopen, geometry/picking/lift and integration behavior |

Resolve paths against the existing feature directories; do not create forwarding modules or another global state store. Existing geometry and layout helpers should be extended narrowly.

## Task 1 — Correct panel X before the geography work

**Files:** `components/explorer/HistoryExplorer.tsx`, `components/locality/LocalityChooser.tsx`, `components/layout/HomeAtlasHeader.tsx`, `components/explorer/explorer-map.css`, `LocalityCardCluster.tsx`; new focused browser cases in `home-locality-overview.spec.ts`.

**Interface:** `localityPanelOpen: boolean` presentation state in `HistoryExplorer`, initially true for a locality entry/direct locality URL. `hideLocalityPanel(): void` and `reopenLocalityPanel(): void` do not dispatch selection, exit, camera or history actions.

- [ ] Write failing browser assertions: selected Hanoi → wait for initial URL canonicalization and camera settlement → capture URL, selected code, cards and camera nonce → click X → panel hidden, all captured meaningful values unchanged → reopen through the header → same state, no camera restart. Use existing fixture readiness helpers instead of a fixed sleep.
- [ ] Replace chooser X's exit anchor with `<button type="button">`, labelled `Ẩn bảng địa phương`. Do not retain an `exitHref` fallback on a hide-only control; modified clicks must not navigate away.
- [ ] Keep the panel mounted if needed to preserve draft search/scroll; use a real hidden state with scoped `.locality-chooser[hidden] { display: none; }` or an equivalent tested mechanism. Hidden content is absent from focus/accessibility order. Do not let existing `display:flex` override hiding.
- [ ] When discovery is already active, the header entry reopens the panel without `people-enter`, mode reset or `setPlacesCameraNonce`. On first deliberate discovery entry, open normally.
- [ ] Separate explicit header exits from the hide callback. Update Escape so a panel dismissal cannot fall through to mode exit; modal/disclosure priority remains intact. Keep clear-selection a visibly named action rather than another ambiguous panel X.
- [ ] Skip hidden/zero-area chooser rectangles in card placement; observe the visibility change so title/cards relayout. Preserve cards and the live projection channel. Refocus the header trigger on hide, and restore the saved panel focus/heading on reopen once.
- [ ] Verify event-entry and journey-entry contexts, both content modes, search/page state, repeated clicks, keyboard activation and reduced motion. Update older tests that intentionally expected X to enter exploration; this is the new owner-confirmed contract.

**Acceptance:** Close/reopen never changes `location.href`, `history.length`, selected locality, mode, cards, camera view/nonce, reader filters or ongoing valid selection work. A deliberate `Khám phá` click still changes modes.

## Task 2 — Build a per-province source admission pipeline

**Inputs:** prior source gate/audit, frozen OSM research input and canonical membership, existing source validator and Python pipeline. No production geometry is invented from the shared line asset.

- [ ] Check actual saved source bytes/hashes. Validate **each** province independently; do not infer that the other 33 are valid merely because only one unit has known missing ways.
- [ ] Assemble relation rings by shared node IDs, respecting outer/inner member roles and reversed way orientation. Reject missing nodes/ways, open or branching chains, unexplained nested relations, invalid rings and duplicate/unknown canonical identities. Assign holes to the correct containing shell and preserve every legitimate MultiPolygon part.
- [ ] Produce a per-unit ledger with `admitted | blocked`, source date/hash/IDs, ring/part/hole counts, topology checks and exact blockers. Derive a first complete province for the vertical demonstration only after its own source and topology gate passes.
- [ ] Try a bounded, different recovery path for the missing OSM ways: official API full reads plus documented way/node history/version reads. Current geometry can fill the pinned snapshot only when element version timestamps and coordinates are proved consistent with that snapshot; otherwise create a separately qualified new input. Never invent an undocumented version/full endpoint or silently mix dates.
- [ ] Keep normal TLS; at most two bounded attempts per origin. The 2026-10-29 connection failures are not evidence the objects do not exist. If network access still fails, record the exact export/IDs/version needed and proceed with independent UI/admitted-unit work instead of polling for hours.
- [ ] Evaluate replacement data only with publisher/upstream rights, represented date, canonical 34 mapping and topology. Do not accept geoBoundaries' observed 2008/64-unit response as modern 34 data, or an MIT code repository as automatic permission for its upstream geometry.
- [ ] Pin raw input and transformation/provenance; build versioned local candidates. Run the old negative control unchanged against its old input. New positive tests belong to a qualified new/per-unit input.

**Outputs:** a typed `ProvinceAreaFeature` whose properties include canonical `code`, and validated Polygon/MultiPolygon geometry; a manifest with framework/date, source/attribution/hash and explicit coverage. Proposed complete public output: `history-vietnam-province-areas.geojson` plus provenance. Do not label a partial artifact complete or include it in the production default path as if all units were admitted.

**Checkpoint:** Demonstrate true lift for one admitted real province before extending nationally. Synthetic geometry is allowed only in isolated tests, clearly labelled; it is never a replacement production province. Final any-province acceptance still requires all 34 admitted identities.

## Task 3 — Create real curved province geometry

**Files:** new `lib/explorer/cinematic/province-areas.ts`; extend `geography.ts` only where reusable helpers are needed.

**Types:** `ProvinceAreaLayer` exposes `group`, `setSelected(code: LocalityCode | null, options: { nonce: number; instant: boolean }): void`, `update(nowMs: number): boolean`, `pick(raycaster: Raycaster, earthDistance: number): LocalityCode | null`, `getSelectedGeometry(): ProvinceSelectionGeometry | null`, `stats()` and `dispose()`. `ProvinceSelectionGeometry` includes code, nonce, cap/outline/side geometry and current/base radius; no label state masquerades as geometry.

- [ ] Add failing geometry tests for Polygon with a hole, MultiPolygon with islands, winding normalization, finite vertices, all components included, unchanged source coordinates and cap counts. Use actual admitted province samples as well as labelled synthetic edge cases.
- [ ] Use `createSurfaceCap()` to obtain curved cap geometry. The helper currently emits a cap near radius 1.0004 and accounts for three-globe's radius 100. Preserve its copy-only winding adaptation and normalize geometry to a documented baseline before selection deformation.
- [ ] Keep original unit-direction vectors `u_i = p_i / |p_i|`. Cap positions at time t are `p_i(t) = (r_base + h(t)) * u_i`. Uniformly scaling a cap around the globe origin is an equivalent operation when the original radius is uniform. Only the cap/top outline may use that scale: side-wall bottoms must remain at the base radius. Do not scale the complete cap-and-wall group and detach its floor. Never scale around a province-local center or translate along global Z.
- [ ] Build side-wall quads along each outer and inner ring from base radius to current raised radius, with correct orientation. A genuine source hole stays open at the top. Build the outline from the same rings at the raised radius. No hole-filling fan, hull or rectangular footprint.
- [ ] Use a restrained `MeshBasicMaterial` cap plus darker side wall and existing thick-line outline support as the initial low-cost material choice; it works without introducing scene lights/shadow maps. Depth testing/writing remains correct. A later material refinement must keep actual geometry and existing lighting behavior.
- [ ] Keep buffers allocated across a finite lift, update required attributes/bounds, and dispose all cached geometries/materials. Reuse existing temporary triangulation builder disposal; do not mount another complete globe/controls/render loop.

**Acceptance:** With labels hidden, the complete province shape still lifts. All selected cap vertices have the intended radius increase within floating-point tolerance, outer/inner side walls bridge the base and raised radii, and all islands move together. Record an oblique view that makes the wall visible. A screenshot of a glowing name cannot satisfy this task.

## Task 4 — Pick the actual province interior

**Files:** `scene.ts`, `CinematicEventMap.tsx`, `globe-contract.ts`, the new layer and `HistoryExplorer.tsx`.

- [ ] Add base-surface picking meshes keyed by canonical code, independent of CSS labels. Static base meshes may be kept out of the rendered scene while participating in explicit raycast tests; selected side walls are not new territory.
- [ ] Convert pointer coordinates using the actual canvas/stage CSS rectangle: `x_ndc = 2*(clientX-left)/width - 1`, `y_ndc = 1 - 2*(clientY-top)/height`. Do not divide by canvas bitmap/DPR dimensions.
- [ ] Use `Raycaster.setFromCamera()` with the existing scene camera, then intersect candidate meshes. Compare with the nearest Earth-surface intersection to reject far-side hits. Use the actual source topology for holes and coastlines; an offshore or hole hit does not select the nearest province.
- [ ] Define deterministic shared-border ties within a documented tolerance, with no label/nearest-center inference. Restrict the candidate set to admitted units only.
- [ ] Preserve map drag: record pointer-down origin and accumulated movement; a proposed 5 CSS px threshold separates click from drag. Pointer cancel, lost capture, wheel input and unmount must not emit a late selection.
- [ ] All interior/name/list paths call the existing canonical selection owner once. Do not mutate a raycast mesh locally and create a second meaningful selected code. No network request or history push on hover.
- [ ] Tests click multiple interior points away from **every** locality label/button, include negative sea/hole/far-side/drag samples, and verify emitted code plus geometry lift. Repeat with nonzero stage offsets and DPR 1/1.5/2.

**Acceptance:** Real interior clicks work without HTML marker help; deleting/hiding labels does not break province picking. List/name selection triggers the same full mesh lift.

## Task 5 — Integrate finite lift, camera and area projection

**Files:** existing scene render scheduler, adapter, `LocalityProjection`, `lib/locality/projection.ts`, card cluster/layout.

- [ ] Add only the province layer to the existing scene. The current scene/camera remain the sole geography owner. Call the finite layer `update(now)` from the existing render scheduler and invalidate only while a lift is active; no independent perpetual requestAnimationFrame/ticker.
- [ ] Initialize selected shape from a valid direct URL after its admitted geometry loads. A stale async build cannot revive a cleared/changed selection. Cancel A's geometry completion if B or departure is newer.
- [ ] For actual areas publish `kind: "province-area"`, non-null projected visible bounds, canonical code and nonce. Keep reference-center fallbacks explicitly tagged; do not report them as successful area geometry.
- [ ] Derive an interior presentation anchor from admitted geometry, not a centroid that may fall in the sea/hole. Project the raised radius through the same camera. Hide offscreen/occluded leaders without removing readable cards.
- [ ] Feed full selected-area bounds into card placement. Exclude the hidden panel rectangle so cards use freed space while keeping the selected surface visible. Preserve the existing CSS-offset/nonce safeguards and measurement-based docking.
- [ ] Hide/reopen changes only panel presentation; do not lower the cap, clear cards, restart the camera or consume a history intent. Explicit mode exit can lower/dispose locality presentation through its own action.

**Acceptance:** Source-derived area, cap, label, card bounds and leader anchor agree during camera movement and lift. X/reopen leaves current camera and lift unchanged. Settled/hidden tabs add zero idle draws.

## Task 6 — One real province demo, then all 34

- [ ] Save a before/after video for one independently admitted real province, with province labels hidden during the area click and an oblique cap/side-wall view. Capture the clicked CSS point, selected code, current lift/radius and component counts.
- [ ] Make the panel X/reopen recording show unchanged URL, selection and cards. Validate after entering discovery from ordinary exploration and from a paused journey; neither may navigate because X was pressed.
- [ ] Extend admission and generation to every canonical unit. Keep the ledger's blocked rows visible in the engineering report; do not claim 34/34 from 33 working meshes.
- [ ] For each admitted unit, test interior sample identity and negative controls, cap part/hole preservation and source-relative simplification. The final area-picking/lift requirement is incomplete until every required unit is admitted and tested.
- [ ] If geometry cannot be qualified, finish the independent panel fix and real admitted-unit demonstration, state the exact missing input and report the area coverage as partial. Do not substitute another polished label/card release for the requested physical province feature.

## Task 7 — Verification and local handoff

- [ ] Run meaningful focused tests: panel hide/reopen, per-unit source assembly, actual cap/skirt geometry, raycast/occlusion, pointer intent, projection/cancellation and card bounds.
- [ ] Apply CSS desktop 1280×720, 1366×768, 1440×900 and 1920×1080; keyboard/focus, reduced motion, zoom/text stress, WebGL/asset failure, direct URLs, Back/Forward and both detail returns. Preserve full catalog and thin timeline behavior.
- [ ] Measure actual added asset bytes/gzip, GPU geometry memory, draw calls, transitions and idle draws. Proposed complete area asset budget ≤400KiB gzip, selected cap/wall/outline ≤3 added draws and ≤6MiB buffers; report real values separately and justify changes before claiming a budget pass.
- [ ] Test baseline/raised meshes when raycast/culling bounds could become stale. Differentiate hardware performance from software browser automation. Do not claim a 30fps target passed from screenshots.
- [ ] Run the complete gate and inspect output. Inspect final diff against the initial dirty ownership and create the required ignored local report. No automatic commit/push/PR/merge/deploy.

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
pnpm verify
# Prepare the dedicated output, not just normal .next; never rebuild a served fixture.
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test home-locality-overview.spec.ts --config playwright.local-heroes.config.ts --project=1280x720 --grep 'O1:' --max-failures=1 --global-timeout=120000
pnpm exec playwright test --config playwright.local-heroes.config.ts --max-failures=1 --global-timeout=900000
pnpm exec playwright test --config playwright.local-heroes-regression.config.ts --max-failures=1 --global-timeout=900000
git diff --check
git status --short
```

Add focused area/panel cases to the isolated public config or a reviewed companion config. Existing O4 only clicks a name marker; expand it with interior-pixel evidence. Replace old X/Escape-to-explore expectations without removing intentional header navigation coverage. Use `O1:` rather than `^O1:` because Playwright full titles include prefixes. Run configs sequentially on their shared fixture port; stop at first failure and diagnose rather than waiting through repeated timeouts. Do not run uninspected legacy database-mutating E2E tests.

## Deliverables and stop conditions

Return: source admission/coverage ledger, scoped source/tests, genuine province lift/side-wall/interior-click video, panel hide/reopen evidence, four-viewport screenshots, exact gate results, measured resource budgets, self-review and `.task-reports/YYYY-MM-DD-HHmm-whole-province-lift.md`.

No missing geography may be fabricated; no partial/label-only result may be called complete. Preserve historical/media ownership and all current valid behavior. Stop at locally verified review; external data publication, Git integration or deployment require a separate explicit owner instruction.
