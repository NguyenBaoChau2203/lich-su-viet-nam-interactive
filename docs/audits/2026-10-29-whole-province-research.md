# Whole-province lift and panel-only close — investigation

Date: 2026-10-29, Asia/Bangkok. One main agent performed source inspection, a bounded browser diagnostic and primary-source web/documentation research. Product implementation is not part of this delivery.

## Owner-confirmed outcome

The owner means a click on the **filled geographical interior of a province** must raise that province's complete surface, not just its name/marker. The owner also explicitly confirmed that the locality panel X should **hide only the panel and retain the selected province and information cards**, with no switch to exploration or journey mode.

These requirements supersede the 2026-10-28 plan's X-to-exploration rule. That earlier rule was explicitly implemented; the new close requirement is a contract correction, not evidence that the implementing agent randomly added navigation.

## Current implementation and verified cause

- Branch: `feat/homepage-visual-effects`; HEAD `23a4b0f`, with substantial existing uncommitted implementation. HEAD is not the complete working implementation. Preserve the dirty tree.
- `pnpm agent:status` reports 921 supported source files, no pending changes.
- Installed versions, verified from package files: Three.js 0.186.1 and three-globe 2.45.6.
- `CinematicScene` exposes the national surface and shared province line layer. It has no province cap selection/lift controller or province-area picking API.
- `CinematicEventMap.tsx:95` still publishes `kind: "reference-center"` and `bounds: null`. The HTML locality markers, not polygon meshes, are the current selection target.
- The previous implementation honestly recorded the missing area feature in `docs/audits/2026-10-28-locality-remediation-acceptance.md`: area picking/physical lift were not delivered because the source gate was blocked.
- `HistoryExplorer.tsx:218` sends X through `locality-exit-to-explore`; the reducer at `playback.ts:98` clears locality mode and selection. `LocalityChooser.tsx:42` also renders the X as an anchor whose `exitHref` points out of discovery.
- Fresh headless Edge diagnostic at CSS 1440×900: before X, URL contained `noi-dung=dia-phuong&dia-phuong=ha-noi`, with one chooser and one card cluster. After X, URL became `/?tu=1905&den=2019`, chooser/card cluster counts were zero and the event rail was mounted. This reproduces the reported behavior.

Local diagnostic evidence: `.task-reports/whole-province-20261029/x-probe.json`, `x-before.png`, `x-after.png`. These are ignored local artifacts, not portable source inputs.

## Technology research and recommendation

The existing stack can implement the intended effect. A new map engine is not needed.

| Capability | Primary source checked | Application here |
| --- | --- | --- |
| Filled 3D-object picking | [Three.js Raycaster](https://threejs.org/docs/pages/Raycaster.html), installed r186 source and matching Context7 docs | Raycast province surface meshes and reject hits behind the Earth |
| Curved polygon caps and side surfaces | [three-globe polygon layer](https://github.com/vasturiano/three-globe#polygons-layer), installed 2.45.6 types | Polygon/MultiPolygon geometry and altitude are supported |
| Vertex deformation and bounds | [Three.js BufferGeometry](https://threejs.org/docs/pages/BufferGeometry.html), r186 documentation | If positions change, update attributes and bounds; avoid stale picking/culling |
| Existing project integration | `lib/explorer/cinematic/geography.ts:56` | `createSurfaceCap()` already extracts curved geometry from three-globe, preserves holes and disposes its temporary builder |

**Recommended design, inferred from these APIs and the project's current architecture:** create source-qualified per-province curved caps with the existing helper, add shallow side walls and an outline, raycast the caps through native Three.js, and animate only the selected geometry in the current scene. Keep the current camera, on-demand render scheduling and card projection channel. A new complete ThreeGlobe renderer/controls stack would duplicate existing ownership.

A global mesh group scale moves a curved cap radially if its origin is the globe center; translating a flat extruded shape along world Z does not follow a spherical province. The new plan pins the curved geometry, original footprint, holes, side walls, depth test, Earth occlusion and visual/data assertions explicitly so a renamed marker effect cannot pass.

## Geography remains the material dependency

Read `docs/audits/2026-10-28-locality-province-area-source-gate.md`. The existing OSM-derived reference dataset is short of 16 member ways in Khánh Hòa relation 1887959, including one inner member. Existing reference lines cannot simply be filled into complete province areas.

Additional bounded research on 2026-10-29:

1. The [official OSM API documentation](https://wiki.openstreetmap.org/wiki/API_v0.6) supports full way reads plus way/node version/history reads. This gives a recovery path different from repeatedly polling the previously failing Overpass query. A direct anonymous request for missing way 1120240923 was attempted using Node with system CA trust and PowerShell with normal TLS. Both failed during connection/TLS; no geometry was recovered, no TLS verification was disabled and no object absence was inferred.
2. [geoBoundaries' live VNM ADM1 metadata](https://www.geoboundaries.org/api/current/gbOpen/VNM/ADM1/) returned represented year **2008** and **64** units. The [publisher's API description](https://www.geoboundaries.org/api.html) explains versioned downloads/metadata. This response is not an already-correct 34-unit replacement.
3. [TaliaCao/Vietnam-Shape-Map](https://github.com/TaliaCao/Vietnam-Shape-Map) offers a 34-unit presentation and an MIT repository license, but names Open Development Vietnam as its upstream geometry source. The [upstream dataset page](https://data.vietnam.opendevelopmentmekong.net/vi/dataset/a-phn-tnh) describes 2009-era source geometry and lists access/use restrictions alongside its license fields. Repository software licensing alone does not resolve those upstream restrictions; no file from this chain was admitted.
4. Previously considered Bando/GIS-derived candidates remain recorded in the prior source gate. They were not promoted by this research merely because search results call their repositories open source.

**Practical improvement over the previous all-or-nothing workflow:** validate independent province units first and build an actual 3D vertical demonstration for one independently admitted complete province. Keep a per-unit ledger; do not assume 33 units are valid just because only Khánh Hòa has the known missing-way control. Extend to all 34 after validation/recovery. A one-province demonstration is a development checkpoint, not final acceptance of the owner's any-province requirement.

If a full public network snapshot cannot be recovered, identify the exact needed source export/version/rights, continue independent panel behavior and admitted-unit demonstration work, and report the remaining area coverage. Do not substitute labels, hulls or inferred polygons and say the whole-province feature is finished.

## Plan contract changes

- X becomes a semantic button that changes only panel visibility; it must not dispatch exit, clear, camera or history actions.
- Opening `Theo địa phương` again while already in discovery restores the panel without a new camera request or reset of locality/filter/page.
- Hiding the panel keeps the card cluster/projection alive. Layout measurements exclude hidden panel rectangles.
- Full-area picking and 3D lift are measured independently from labels; browser tests click interior pixels away from every label/button.
- Meaningful selection remains in the existing runtime/URL owner; panel visibility is transient presentation state.

## Verification scope

The current task runs a fresh `pnpm verify` and targeted browser diagnostic; its exact final result is in the local task report. Earlier 212/10/8 browser results are dated evidence from the prior implementation and are not claimed as rerun here. No application code, map asset, dependency, media mapping, database, Word document or external service is changed by this planning task.

Handoff: `docs/superpowers/plans/2026-10-29-whole-province-lift-panel-close-plan.md` and `docs/agent/prompts/2026-10-29-gemini-whole-province-lift.md`.
