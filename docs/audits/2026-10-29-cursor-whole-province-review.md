# Cursor whole-province handoff review — 2026-10-29

## Verdict

**Request changes.** The panel-only X behavior is verified in the tested flow, and a real province cap/side-wall/outline implementation now exists. The any-province feature remains a partial demonstration, with reproducible selection and rendering defects. Do not treat a passing `pnpm verify` or the two focused browser cases as acceptance of all geography, camera, input and resource contracts.

This is a review of Cursor's report and the current dirty checkout, performed inline by one main agent. It does not implement the fixes below. It preserves existing contributor work and the earlier media-owner boundary.

Reviewed report: `.task-reports/2026-10-29-0910-cursor-auto-whole-province-lift.md`.

Requirements: `docs/agent/prompts/2026-10-29-cursor-auto-whole-province-lift.md` and `docs/superpowers/plans/2026-10-29-whole-province-lift-panel-close-plan.md`, particularly the owner's confirmed panel-only X contract.

## Findings, ordered by priority

### R1 — P1: Selecting an unsupported province keeps the previous province raised

Location: `lib/explorer/cinematic/province-areas.ts:287–290`.

`setSelected()` returns immediately when `units.get(code)` is absent. It does not clear or lower an existing selection. This is exercised by normal chooser navigation because the public asset contains only codes `01` and `31`, while all 34 chooser rows remain available.

Reproduction on the isolated production fixture:

1. Select Hà Nội and wait for its lift.
2. Select Cao Bằng (`04`) in the chooser.
3. The URL and card cluster change to Cao Bằng, but `getSelectedProvinceGeometry()` still returns Hà Nội (`01`), radius `1.0064`, with its old nonce. The camera also moves to Cao Bằng, leaving a mismatched province layer behind.

Evidence: `.task-reports/cursor-review-20261029/browser-probe.json`, `beforeHide` and `afterUnsupported`; screenshot `03-cao-bang-with-hanoi-geometry.png`. No page error occurred: this is a state/visual identity defect.

Required correction: when a new canonical selection has no admitted mesh, remove/lower the previous province presentation and retain an explicitly tagged reference fallback for the new selection. Never keep A's shape for B's cards. Add transitions for admitted → unsupported → admitted, including Back/Forward and rapid changes.

### R2 — P1: Fixed lift can put the camera underneath the cap at an allowed zoom

Locations: `lib/explorer/cinematic/province-areas.ts:25–27,213–215`; integration with `lib/explorer/cinematic/scene.ts:421–447` and `lib/explorer/cinematic/camera.ts:89–115,166–168`.

The selected cap always reaches radius `1.0064`, independently of the current camera altitude and near plane. Interactive zoom can reach 11. At latitude 21.028 and 1280×720, the existing camera equations put the camera at radius approximately `1.0058476425`: below the selected top surface. At 1366×768 it is also below the cap. At heights 900 and 1080, the cap's center is in front of the camera but closer than its near plane. The existing national layers already adapt relief to camera distance; the new province layer bypasses that protection.

The mounted production scene was exercised at zooms 7, 9, 10 and 11. Screenshots show clipping/distorted wall presentation at close views. Pixel differences remain nonzero because portions of the outline/walls can still render; this review does **not** claim the entire selected layer disappears.

Evidence: `.task-reports/cursor-review-20261029/zoom-probe.json`, `zoom-10-raised.png`, `zoom-11-raised.png`, and the four-height calculations in `admission-probe.json`. The zoom probe uses the existing scene API to set supported views; the public zoom control uses the same camera view model and permits zoom 11.

Required correction: define a camera-safe effective lift or clearance policy within the existing camera/scene owner. Keep the cap in front of the near plane and the camera outside the raised surface throughout allowed interactive and restored views. A near-plane adjustment alone cannot fix a camera already below the cap. Synchronize walls, picking/presentation and projections with the resulting radius. Add close-zoom and restore regressions at all four desktop sizes.

### R3 — P2: Pointer cancellation and lost capture can select a province

Location: `components/explorer/cinematic/CinematicEventMap.tsx:297–307,319–325`.

The same `up` handler is registered for `pointerup`, `pointercancel` and `lostpointercapture`. When accumulated movement is below 5 CSS pixels, that handler performs a raycast and calls the selection callback for all three event types. A canceled pointer interaction is therefore interpreted as a completed click.

Browser reproductions started with no selected province. Both a dispatched cancellation after a real mouse down and a native `releasePointerCapture()` before mouse up resulted in a Hà Nội URL, card cluster and raised geometry. The cancellation case uses a synthetic cancellation event; the lost-capture case uses the browser's capture-release behavior.

Evidence: `browser-probe.json`, `afterPointerCancel` and `afterLostCapture`; reproduction code is preserved in `browser-probe.mjs`.

Required correction: only a valid primary `pointerup` may commit a selection. Cancellation/lost capture must clear pointer intent without selecting. Retain normal drag settlement and verify wheel, unmount and canceled interactions cannot emit a late selection.

### R4 — P2: The admission pipeline certifies incomplete or invalid topology

Locations: `scripts/province-boundaries/build_areas.mjs:62–69,94–97,133–171,220`.

The new assembler checks closed chains, missing coordinates, coordinate ranges and a hole representative point, but it does not implement the full topology admission promised by the plan. It silently ignores relation members, chooses a next way at branches instead of rejecting ambiguity, and does not reject self-crossing rings or fully validate shell/hole relationships.

Two review-only synthetic negative controls were run against the actual exported `buildProvinceAreas()`:

| Input | Required status | Actual status |
| --- | --- | --- |
| Self-crossing bow-tie outer ring | blocked | admitted |
| Valid outer way plus unresolved outer relation member | blocked | admitted; relation member silently ignored |

Evidence: `.task-reports/cursor-review-20261029/admission-probe.mjs` and `admission-probe.json`. These synthetic fixtures are not production geography and were not added to the public map.

This does **not** prove the current 33 candidate features are invalid. A separate read of the pinned source found no nested outer/inner relation members or branched endpoints in the available ways. It proves the new gate cannot yet support the claimed topology assurance or safely qualify a changed/recovered input.

Required correction: block unexplained members and ambiguous topology; verify simple rings, shell/hole containment/intersection rules and all source components. Add genuine negative/positive admission tests, then rerun qualification of the real candidates before promoting their status beyond the checks actually performed.

### R5 — P2: Card layout and leaders still use label/base-sphere geometry

Locations: `components/explorer/cinematic/CinematicEventMap.tsx:123–146`; `components/locality/LocalityCardCluster.tsx:89–92`; `lib/locality/province-areas.ts:148–160`.

Area bounds are calculated, but `presentationBounds` prefers the HTML label rectangle whenever the label node exists. `LocalityCardCluster` passes those presentation bounds to card placement, so the newly calculated province bounds do not protect the complete raised province from card overlap during ordinary labeled use. The projection uses `viewport.project(lng, lat)`, which projects radius 1, rather than the raised cap's current radius.

The proposed interior anchor is an average of the first exterior ring's vertices. It is not guaranteed to be inside the province or outside holes. The actual helper returns `(1, 1)` inside the hole of a valid review-only square-with-hole fixture. The two shipped demo anchors were checked and are inside their actual polygons; the defect concerns the algorithm's required general behavior, not a demonstrated wrong anchor for those two assets.

Evidence: source wiring above and `admission-probe.json`, `anchorControl`.

Required correction: use visible selected-area bounds when `kind === "province-area"`, project the actual raised surface, and choose a source-derived point verified inside the selected shell and outside every hole. Preserve the clearly tagged reference-center fallback, code/nonce validation and occlusion behavior. Test a concave polygon, a polygon with a hole, islands, labels hidden, and camera/lift movement.

### R6 — P2: Every lift frame replaces buffers; selected draws exceed the proposed budget

Locations: `lib/explorer/cinematic/province-areas.ts:213–226,292–300`.

`applyHeight()` creates a new wall geometry, computes normals, disposes the old wall geometry, disposes the old outline and creates a new outline geometry on every animation frame. The plan explicitly requires keeping those buffers allocated through the finite lift. The current implementation repeatedly allocates/uploads source-sized data during the animation.

Mounted-scene measurements show 12 draw calls with the selection cleared and 17 with the selection present: **5 additional draws**, above the plan's proposed selected-layer budget of 3. The cap and wall use transparent double-sided materials; the count is consistent with two passes for each plus the outline. This review does not infer a frame-rate failure from draw counts alone.

Evidence: `zoom-probe.json` (same scene with selection on/off), Cursor's existing `output/playwright/local-heroes/performance/1280x720.json`, and the implementation above.

Required correction: allocate cap/wall/outline buffers once per source selection and update their attributes/bounds through the finite animation. Measure actual GPU buffer bytes and draw calls, and either meet the agreed budget or explicitly qualify a justified revision. Preserve visual correctness if adjusting transparency/culling. Retain the existing on-demand render owner and zero settled draws.

## What is verified

| Contract | Review result |
| --- | --- |
| X hides only the chooser | Passed in the directly exercised overview flow |
| X/reopen preserve URL, history length, cards, selected code, camera view and selection nonce | Passed in the direct browser probe after settlement |
| Real province-interior activation | Hà Nội interior sample selected canonical `01` with labels hidden; real layer implementation present |
| Desktop focused cases O15/O16 | Fresh 8/8 pass at 1280×720, 1366×768, 1440×900, 1920×1080 |
| Full local `pnpm verify` | Fresh exit 0: 42 history checks; 1326 unit/component tests across 125 files; 26 agent script tests; typecheck and 110-page production build passed |
| Lint | No errors; three warnings: unused `_camera`, `positiveId`, `object` |
| `git diff --check` | Passed |
| All 34 provinces selectable/raised | Incomplete; not accepted |
| Actual cap vertices/holes/islands, negative raycasts and close-camera clearance | Not established by O15/O16 or the five new geometry helper tests |

The new unit file tests schema structure and small helpers. It does not construct `createProvinceAreaLayer()` or inspect its complete cap/wall buffers and raycasts. O16 reads a reported radius calculated from the animation clock, plus vertex counts; it does not measure every cap vertex radius, hole preservation or all MultiPolygon parts. These tests are useful but narrower than the planned physical-geometry acceptance.

Verification command:

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
pnpm verify
pnpm exec playwright test home-locality-overview.spec.ts --config playwright.local-heroes.config.ts --grep 'O15:|O16:' --max-failures=1 --global-timeout=180000
git diff --check
```

The dedicated fixture build dated 09:00 was newer than the reviewed feature source files. No product source changed during this review. The browser runs used that inspected, isolated, read-only fixture, not a live Supabase backend. External images in diagnostic probes were substituted with the existing synthetic thumbnail.

## Coverage and report accuracy

- The public path is hardwired to `history-vietnam-province-areas.partial.geojson`, containing **only Hà Nội (01) and Hải Phòng (31)**. Public bytes remeasured: 241,276 raw / 78,125 gzip. This budget figure is for two features, not the complete national asset.
- The full candidate ledger reports 33 assembled units and one blocked unit, Khánh Hòa (56). Its topology assurance remains subject to R4; do not equate 33 assembled with 33 independently fully certified.
- The pinned research gzip hash independently matches `5504fab937f8f991a4926334e441da1f9f1b6a9219ec303eff82dd44f41c76d0`; timestamp `2026-10-23T20:20:51Z`. The Khánh Hòa missing-way blocker is preserved. No recovered ways or new geography were published during review.
- Cursor's report correctly discloses the partial demo, missing national production promotion and incomplete broad E2E runs. Its phrase “P0–P6 completed” must be read with those limitations; P5's all-province completion and P6's full acceptance evidence are still pending.
- The fresh review corroborates `pnpm verify` and O15/O16. The historical full 1280 overview and other focused test claims remain Cursor-provided evidence; the preserved original results JSON reports 16 passing 1280 overview cases. The full feature/regression configurations and public smoke check were not rerun by this review.
- Keyboard/reduced-motion, journey-entry hide/reopen, WebGL/asset failure, detail returns and national coverage need the broader acceptance matrix after fixes. Do not infer they all passed from these eight cases.
- Media uploads, missing heritage images and external storage ownership remain a separate handoff. This review neither fixes them nor attributes them to the new province work.

## Recommended implementation order

1. Fix R1 and R2 with focused regressions; these affect visible correctness during normal selection/zoom.
2. Fix R3 and R5 so canceled input cannot select and cards follow the actual province geometry.
3. Harden admission (R4) before national source promotion; qualify each real unit without fabricating Khánh Hòa.
4. Reuse buffers and measure the full layer budget (R6).
5. Add actual geometry/raycast/negative-control tests, then execute the planned browser matrix and release gate with bounded first-failure behavior.
6. Report source-qualified, shipped and browser-tested province counts separately. Keep the partial state explicit until all required units and contracts pass.

## Review artifacts

Local ignored evidence is under `.task-reports/cursor-review-20261029/`: fresh `verify.log`, `focused-browser.log`, direct browser/zoom/admission probe scripts and JSON, screenshots and video. The original Cursor result JSON and its remaining 1280 O15/O16 videos were copied before the focused rerun so evidence was not silently overwritten. Fresh focused run videos for all four viewports are under `output/playwright/local-heroes/artifacts/`.

No product source fix, dependency installation, secret inspection, database/storage write, commit, push, PR or deployment was performed by this review.
