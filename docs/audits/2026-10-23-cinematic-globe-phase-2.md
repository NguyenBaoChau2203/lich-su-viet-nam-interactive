# Cinematic globe Phase 2 — execution and evidence

## Scope and checkpoint

The owner explicitly accepted P1 in this chat on 2026-10-23: “Tôi chấp nhận P1; tiếp tục P2”. This records the actual response; the earlier P1 self-review score was not acceptance. P2 remains confined to the local prototype, spherical geography, projection and curated HTML overlays. Production homepage integration and shell redesign remain later phases.

## Verified starting state

- Current feature branch: `codex/3d-map-design`; preserve its existing dirty tracked/untracked work in place, as required by the shared contract.
- CodeGraph is present but its exploration does not contain current cinematic/explorer symbols. Focused direct reads are used without reindexing.
- P1 on disk uses a unit sphere, longitude 0 on +Z, longitude 90E on +X, and `SphereGeometry.rotateY(-PI/2)`. The cap shader derives matching equirectangular UVs. These assumptions require independent geometry/renderer checks.
- P1 has only a behind-camera pinhole projection, no occlusion/viewport contract and no event/curated-label overlay. Existing source datasets and disclosures are retained.
- Fresh baseline: four existing camera/marker/globe/footprint files passed, 36 tests (`pnpm exec vitest run tests/unit/explorer-cinematic-camera.test.ts tests/unit/explorer-map-markers.test.ts tests/unit/explorer-globe.test.ts tests/unit/explorer-footprint.test.ts`).

## P2 implementation plan

1. Write failing projection tests for existing sourced northern/central/southern anchors, coordinate order, seam, numeric validation, perspective horizon, clipping and stage CSS edges. Check against Three's camera projection and actual Earth geometry UVs independently.
2. Implement a renderer-neutral `GlobeViewport.project(lng, lat)` returning stage CSS pixels or `null`, and expose the current viewport through the existing single scene lifecycle.
3. Verify cap-only Polygon/MultiPolygon triangulation, holes, all sourced islands and curvature; correct demonstrated surface/material defects without editing source geometry.
4. Add prototype-only event/group/approximate markers and curated labels. Measure actual text and current reading/control rectangles, prioritize selected content, and retain HTML event/detail/source links when markers are culled. Use only existing events or the active authored journey for overseas names.
5. Capture the real renderer at the four desktop sizes, world/Vietnam/nearby coast/far side, plus loading/error/retry, keyboard and reduced-motion paths. Run focused tests and the shared full gate, review changes inline, create the local report and stop at P2.

## Implementation and rulings

- `projection.ts` now exports `GlobeViewport` and `createGlobeViewport(camera, stageSize)`. `project(lng, lat)` returns stage-relative CSS pixels or `null` for invalid coordinates/camera, Earth occlusion, camera clipping or a point within 16 CSS pixels of a stage edge. The sphere visibility test uses the perspective horizon plane `P · C > 1`, with a small tangent tolerance. It is independent of MapLibre and device pixel ratio.
- `camera.ts` calls its dimensions `GlobeStageSize`, distinguishing size from the projecting viewport. P1 presets, texture orientation and materials remain as checked on disk; no visual recalibration was needed.
- `geography.ts` builds only caps, disables sides/growth/strokes from the builder, verifies all source polygons have arrived before merging and resamples outlines along the spherical surface. A real raycast regression found the upstream spherical-bounds winding assumption: a valid RFC 7946 counterclockwise exterior selected the complement and filled a test hole (six ray hits). The adapter now normalizes winding on a render copy; both exterior conventions pass. The actual Vietnam source has 15 features / 71 polygons / zero holes; synthetic hole fixtures test the renderer contract, not additional geography.
- `scene.ts` exposes the current projecting viewport and a render subscription, using the existing one-renderer/on-demand lifecycle. `CinematicGlobeMarkers.tsx` reuses `getEventMapAnchors`, `groupMapAnchors` and `getMapGroupLabel`. Text dimensions and all current `[data-cg-occupied]` DOM rectangles are measured in the same stage coordinate system. Labels can move left/right or be omitted; obscured marker hit targets are also omitted.
- The prototype retains event reading/detail links and displays original approximation notes. The six sourced domestic city labels remain the sole independent place-label dataset. Overseas labels come from currently visible public event anchors or the active existing authored stop. A local public HTML snapshot supplied 10 published events / 11 locations; no database access, content editing or itinerary authoring was added.
- Real loading/error/retry checks found that force-disposing a renderer left the reused canvas context lost. Retry now mounts a fresh canvas; texture failure and real `WEBGL_lose_context` both recover with one live canvas. Reading-panel wheel events no longer zoom the globe; Escape restores map-input focus.
- Ruling: retain the dirty feature workspace rather than create a clean worktree, as the shared contract explicitly requires preserving the current uncommitted P1 state. No files were staged or committed. Review was performed inline by the implementation author, not independently.

## Test and evidence mapping

All captures below are real Edge/WebGL output under `output/playwright/cinematic-globe/phase-2/`. Synthetic polygon fixtures are mathematical test inputs run through the actual cap builder/raycaster; no screenshot renderer was mocked.

| Requirement | Evidence | Result |
| --- | --- | --- |
| Northern / central / southern source alignment | `tests/unit/explorer-cinematic-projection.test.ts`; Earth mesh UV raycasts; `anchor-quang-truong-ba-dinh-*`, `anchor-hue-*`, `anchor-dinh-doc-lap-*` | Three sourced city anchors match the independent Three camera/mesh; nine existing public Vietnamese locations project in the overview. |
| Occlusion, perspective tangent, coordinate order, invalid input, clip planes, seam, viewport edges | 23 projection/texture tests; `far-side-with-links-*`; `antimeridian-1440x900.png`; `extra-verification.json` | Far-side points return `null`; all ten HTML event links persist. ±180° maps to the identical CSS point; ±179.999° remains continuous. |
| Polygon / MultiPolygon / holes / curvature / islands | Real cap builder + Raycaster in `verify-p2.mjs` and `verify-p2-extra.mjs` | 71/71 source polygons, 4,340 cap triangles, 4,420 outline segments. Hole: zero ray hits; solid region and both MultiPolygon islands: one hit each. Both winding conventions pass. Source object remains unchanged. |
| Near-surface cap | Live geometry measurement in `verification.json` | Vertex radius 1.00039993–1.00040007; minimum actual triangle-face distance to Earth's center 1.00033821 (closest-point calculation), so faces remain outside the unit Earth. No sides/base/extrusion. |
| CSS origin / pixel density | `stage-offset-dpr2-1440x900.png` | Stage origin (43,27), device scale 2, renderer cap 1.5: camera parity error about 3.2e-13 CSS px; measured HTML marker error about 0.0043 CSS px. |
| Selective labels / actual occupied rectangles | Six overlay unit tests; live rectangle assertions on all four sizes, selected reader and expanded list | No measured text/text, text/reader/control or marker-target/reader/control intersections; no page overflow. |
| Overseas relevance / original uncertainty | `active-authored-paris-1440x900.png`, `occluded-authored-paris-1440x900.png` | Only the active authored Paris stop is added in that mode; its approximation, Versailles caveat and two sources persist even when occluded. |
| Keyboard / reduced motion / fallback | `loading-*`, `empty-events-*`, `texture-error-html-links-*`, `retry-restored-*`, `context-loss-retry-*`, `no-javascript-links-*` | Arrow navigation, Escape/focus restoration, instantaneous reduced-motion controls, reader scrolling, empty event reading, real context recovery and ten static no-JavaScript links pass. |
| Historical/source preservation | SHA-256 comparison of 45 protected files | No changes to the source GeoJSON/provenance/labels, authored journey, repository historical content or protected production explorer files. Existing source-integrity tests remain. |

Captures exist at **1280×720, 1366×768, 1440×900 and 1920×1080** for Vietnam, world, selected approximate event, three close source anchors and the antipodal view with HTML links. Additional 1440×900 evidence covers seam, source disclosures, journey, failure/retry and stage offset.

Browser configuration: Microsoft Edge / HeadlessChrome 155.0.0.0 on Windows; `ANGLE (Intel, Intel(R) UHD Graphics (0x00009A68) Direct3D11 vs_5_0 ps_5_0, D3D11)`, WebGL 2.0. Normal captures use device scale 1; an additional capture uses device scale 2. Scene stats: six draw calls, six geometries, three textures; estimated texture+mipmap allocation 64 MiB. No browser errors were recorded during the normal capture flow. This phase does not repeat or claim the P1 10-second flight performance benchmark.

## Fresh verification

1. Baseline: four files / 36 tests passed before implementation.
2. Red → green: the P1 projection adapter failed 16 behavioral assertions before occlusion/validation/edge handling; the basic overlay adapter failed five assertions before collision/priority/journey layout. The real hole and retry regressions failed before their corresponding fixes.
3. `pnpm exec vitest run tests/unit/explorer-cinematic-overlays.test.ts tests/unit/explorer-cinematic-projection.test.ts tests/unit/explorer-map-markers.test.ts tests/unit/explorer-globe.test.ts tests/unit/explorer-footprint.test.ts tests/unit/explorer-cinematic-camera.test.ts` — **6 files / 65 tests passed**.
4. `node output/prototypes/cinematic-globe/build.mjs main.jsx dist-p2` followed by `node output/prototypes/cinematic-globe/verify-p2.mjs` and `node output/prototypes/cinematic-globe/verify-p2-extra.mjs` — **passed**. Local Vite reports its existing client-directive/large-chunk warnings; this browser-only harness is not a Next route. The final harness JS measurement was 577.3 KiB gzip, including local verification imports.
5. `pnpm verify` — **passed on the final implementation**: five project skills valid, 42 history checks, ESLint, strict TypeScript, 65 unit files / 834 tests, eight hook tests and production build 102/102 pages. Full local output: `output/prototypes/cinematic-globe/p2-verify-final.log`.
6. Against the freshly built, task-owned local production server on port 3219: `pnpm test:e2e tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts --workers=1 --grep 'marker, detail|far side|published event detail'` with `E2E_BASE_URL=http://localhost:3219` — **3 passed (12.9s)**. This is a safe public/read-only selection, not the full account/staff/payment E2E suite.
7. `git diff --check` — passed, with existing line-ending notices. Status and task-owned files reviewed; index empty. Git's ordinary diff omits pre-existing untracked P1 files, so those files were also reviewed directly.

The task-owned Next server logged `The destination stream closed early` (digest `3840477093`) around browser context/request teardown; the P0 report records the same baseline message. The three public E2E tests and normal prototype browser checks passed. Task-owned servers/browser were closed after evidence capture; the user's port 3000 process was retained.

## Precision limits and stopping point

Natural Earth Vietnam is generalized at 1:10,000,000 and world land at 1:50,000,000; both show modern geography, not historical administrative borders. The six city points and authored journey are orientation aids at their recorded approximation. Tiny source islands may be subpixel at national/world scale; all polygon members are retained without substituting point symbols. The label-free 4096×2048 imagery is soft at the tested close view (legacy zoom 5.4) and is not venue/street imagery. These limits are disclosed, not corrected by inventing coordinates or borders.

P2 is complete within these limits. No production homepage wiring, shell redesign, new administrative-border dataset, itinerary data, historical claims, dependency addition, push/PR/deployment or external mutation is included. P1 camera/material choices remain in place. Self-review found no outstanding critical/important P2 defect; it is not an independent review.

## Reference checks

The camera parity check uses the documented [Three PerspectiveCamera view-offset API](https://threejs.org/docs/pages/PerspectiveCamera.html). Cap-side/altitude/curvature configuration was checked against the upstream [three-globe polygons documentation](https://github.com/vasturiano/three-globe/blob/master/README.md#polygons-layer) and the installed `three-conic-polygon-geometry@2.1.3` source. The existing geographic provenance files remain the authority for shapes; these rendering references do not establish geographic precision.
