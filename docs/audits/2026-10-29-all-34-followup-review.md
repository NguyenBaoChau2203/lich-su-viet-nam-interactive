# All-34 province completion — follow-up review

Reviewed on 2026-10-29, Asia/Bangkok, by one main agent. Target report: `.task-reports/2026-10-29-1131-complete-all-34-provinces.md`.

## Verdict

**Request changes.** The default asset and nominal runtime now cover all 34 canonical units, a substantial improvement over the two-unit demo. The panel-only X fix and the previous Hanoi → Cao Bang identity fix work in the exercised flow. However, source optimization introduces overlapping province areas, deselection can be undone by camera updates, leaders remain visible through the Earth, and outline buffers are still recreated during animation. The acceptance evidence is narrower than the report's “complete for acceptance” claim.

This review does not implement product fixes. The accompanying follow-up plan and Cursor prompt address the confirmed remaining scope without restarting completed national integration or source recovery.

## Findings

### F1 — P1: Independent ring simplification introduces ambiguous shared borders

Locations: `scripts/province-boundaries/simplify_areas.mjs:72–85,96–122,148–158`; shipped `public/maps/history-vietnam-province-areas.geojson`.

The generator applies Douglas–Peucker independently to each province ring. Adjacent provinces therefore receive different simplified versions of what should be the same shared border. Its size/count condition can promote the result without a national overlap/gap or shared-arc check.

A review-only proper-segment-intersection scan found **807 proper crossings across 57 pairs of outer rings belonging to different province codes** in the shipped asset. These are crossings between boundary segments, not a count of overlap polygons or a measured overlap area. The scan found no proper self-crossing/degenerate rings under its narrower per-ring checks; that does not certify all topology.

Concrete source-versus-output sample:

```text
longitude = 105.88752842741935
latitude  = 21.328063508064513
unsimplified candidate membership = [19]       (Thái Nguyên)
shipped simplified membership    = [19, 24]   (Thái Nguyên and Bắc Ninh)
actual native browser click      = 24         (Bắc Ninh)
```

With labels hidden, the browser committed `/...?dia-phuong=bac-ninh`, card code `24` and raised geometry `24`. This demonstrates an actual ambiguity in the displayed/pick geometry, not merely a theoretical optimization concern.

Generalization can move a border within an approved error budget, so this review does not require every point near an original border to retain its unsimplified membership. The blocking defect is that the optimized neighboring polygons overlap and disagree on the shared border. Fix the common topology and its picking consistently; do not hardcode a preferred code for this coordinate or patch only the raycast result.

Evidence: `.task-reports/all-34-review-20261029/topology-probe.json`, `boundary-pick-probe.json`, `boundary-wrong-province.png`, and their reproducible diagnostic scripts.

### F2 — P1: Camera clearance resurrects a province after deselection

Location: `lib/explorer/cinematic/province-areas.ts:332–341,351–365`.

`setSelected(null)` begins a finite lowering animation with target height zero. The next camera update calls `recomputeLift()`, which treats the outgoing visual as an active selection and resets its target to `effectiveLift`. That cancels lowering and leaves the province raised after the owner has cleared it.

Reproduction used ordinary UI with reduced motion disabled: select Hà Nội, click `Bỏ chọn Thành phố Hà Nội`, then zoom. The URL had no `dia-phuong`, the chooser showed all localities and no cards remained, but scene geometry still reported code `01`, current/target radius `1.0064`. The stale geometry persisted well beyond the 280ms animation. Camera movement back to the overview can trigger the defect even before the additional zoom.

Evidence: `behavior-probe.json`, `justCleared` and `afterClearAndZoom`, plus `cleared-then-zoom.png` and the recorded WebM.

Required correction: distinguish the desired owner selection from a departing visual. Camera safety may constrain the outgoing surface, but cannot turn a clear/exit into a new raise. Include resize, flight progress, hidden/visible restoration and explicit mode exit.

### F3 — P2: Raised-area projection does not reject Earth occlusion

Locations: `lib/explorer/cinematic/scene.ts:618–621`; `components/explorer/cinematic/CinematicEventMap.tsx:130–157`.

The new raised-radius projection labels a point `behind` only when projected Z exceeds 1. Being inside the camera's clipping range does not mean the point is on the visible side of Earth. The adapter uses that incomplete flag to publish area bounds and leader anchors.

After explicitly waiting for the complete province layer, the review selected Hà Nội and set the existing scene view to `{lat:-21,lng:-74,zoom:7}`, the opposite side. The connector element remained present and the screenshot shows leader lines across the dark Earth while the selected province is occluded. Cards should remain readable, but the leader and occluded area projection must be hidden.

The existing O10 case moves the camera after base-globe readiness and does not explicitly wait for area-layer readiness. Its reported pass does not contradict the reproduced failure after the new projection path is active; readiness timing can leave it testing the older reference-center fallback.

Evidence: `behavior-probe.json`, `farSide`, and `far-side-connectors.png`.

### F4 — P2: Outline updates still allocate replacement GPU position buffers

Location: `lib/explorer/cinematic/province-areas.ts:256–271`; installed `node_modules/three/examples/jsm/lines/LineSegmentsGeometry.js`, `setPositions()`.

Cap/wall reuse improved and the selected material change removes the old double-sided draw overhead. However, every height update still calls `outlineGeometry.setPositions(Array.from(outline))`. The installed implementation creates a new typed array and `InstancedInterleavedBuffer` and replaces `instanceStart`/`instanceEnd`. Keeping the geometry object does not keep its underlying position buffer.

In one mounted scene, five raise/clear cycles changed WebGL counters from **62 creates / 0 deletes** to **225 creates / 42 deletes**. The difference in explicit create-minus-delete counts increased by 121 despite ending with selection cleared. This does not measure permanent driver memory retention or garbage collection; it corroborates continuing allocation churn and missing explicit release of superseded buffers. Geometry-count-only tests miss it.

Required correction: update the existing interleaved storage or radially scale the same outline around the globe origin. Keep wall bottoms at the camera-safe base and the top at the current cap radius. Test buffer identity and actual resource lifecycle, not just mesh/geometry object counts.

Evidence: `behavior-probe.json`, `buffersBefore`/`buffersAfter`; actual installed Three.js source.

### F5 — P2: The acceptance matrix overstates physical-geometry and national correctness

Locations: `tests/e2e/home-province-areas-national.spec.ts:83–124,127–195`; `tests/unit/province-areas-national-coverage.test.ts`; `docs/audits/2026-10-29-all-34-province-acceptance.md`.

The national suite genuinely exercises 34 direct URLs and 34 pointer selections per viewport. Its scope is useful, but:

- It uses one anchor per unit from the same shipped geometry/helper; it does not prove two independent source-qualified interior samples, disconnected components, hole negatives or shared-border consistency.
- `meshPassed: true` is written after checking reported radius and positive vertex counts. The getter derives its radius from animation state; the test does not inspect all actual cap/wall vertices, holes or component participation.
- The purported second unit-test sample only compares the anchor's longitude with a mid-edge longitude; it never verifies a second interior point or raycast.
- Both national cases force reduced motion, so they cannot catch the non-reduced clear/flight defect in F2.
- Source optimization is not followed by a gate establishing shared topology, and the final set-equality JSON cannot make that missing property true.
- Requested oblique/full-surface/side-wall video remains missing from the claimed final acceptance. A fresh review successfully recorded a browser WebM with the existing Playwright package; system ffmpeg is also present. The review did not install a browser, ffmpeg or a dependency. Record usable evidence or report the exact capture limitation rather than treating a final PNG/vertex count as equivalent proof.

Required correction: separate nominal coverage from actual mesh, input, topology and motion acceptance. Add readiness-aware negative/lifecycle and independent mesh/source tests, derive acceptance flags only from those outcomes, and regenerate the matrix after the full gate passes. Preserve historical reports as dated evidence; add an explicit correction to the current-state/acceptance claim.

## Verified improvements and fresh checks

| Area | Result |
| --- | --- |
| Complete default public asset | 34 canonical identities shipped and loaded by the default URL |
| Khánh Hòa recovery | All 16 saved way exports present; the inspected recovered way/node timestamps precede the pinned snapshot; no missing node timestamps or after-snapshot nodes found in those files |
| Source admission assurance | Improved negative controls, but current optimization/shared topology and future merge qualification still require stronger fail-closed checks |
| X/reopen | Direct probe retained URL/history, selected geometry, cards and camera |
| Hanoi → Cao Bang | Direct probe changed geometry/cards to code 04 correctly |
| `pnpm verify` | Fresh exit 0: 42 history checks, 1334 unit/component tests across 127 files, 26 script tests, typecheck and 110-page build passed; one lint warning |
| National suite @1280×720 | Fresh **2/2 pass**, each looping over all 34 units, about 2.7 minutes; this confirms its nominal URL/pick assertions, not F1–F5 acceptance |
| Direct diagnostic page errors | None in the recorded behavior probe |
| `git diff --check` | Passed |

The fresh browser runs used the existing dedicated isolated production fixture, built at 11:00 after the relevant feature edits. Custom diagnostics used the existing synthetic thumbnail for optional remote images. The fixture is read-only and no live Supabase data/storage was changed. The national runner's known synthetic-image DNS errors were logged separately from browser runtime defects.

The original report's 220 feature, 8 national/four-viewports, 10 regression and 8 smoke results remain contributor-provided historical evidence. This review freshly reran the full non-browser gate and the two national cases at 1280×720, and performed the documented targeted probes. It does not claim a fresh full 220-case or four-viewport national rerun.

The national tests write two acceptance JSON files. Their original bytes were backed up and restored after the review run; fresh review copies are retained under `.task-reports/all-34-review-20261029/`. No product source or test was edited.

## Follow-up

Execute `docs/superpowers/plans/2026-10-29-all-34-correctness-followup-plan.md` through `docs/agent/prompts/2026-10-29-cursor-auto-all-34-correctness-followup.md`. Retain the completed national loader, compatible source recovery, valid camera work, input-cancel fix and panel-only X. Correct F1–F5 and prove their regression gates before renewing a full-completion claim.
