# All-34 province-area acceptance — corrected 2026-10-29

One main agent. Modern OSM-derived **VN-34-2025** reference areas only. These polygons are present-day reference geometry, not historical administrative borders.

## Superseded same-day claim

An earlier version of this audit, and the preserved local report `.task-reports/2026-10-29-1131-complete-all-34-provinces.md`, described the shipped asset as per-ring Douglas–Peucker with 16,000 points and gzip 81,316 bytes, and pointed runtime/mesh/pick evidence at `docs/audits/sources/2026-10-29-all-34-*.json`.

Those nine JSON files remain the 2026-10-29T04:30:51.554Z export (`schemaVersion` 1). Hà Nội’s cap vertex count there is 1,155. The corrected 1280×720 runtime row records 1,182. Use the files in the next sections for F1–F5.

## Set equality

Canonical membership is `docs/audits/sources/2026-10-24-vietnam-province-membership.json`. Qualified admission codes are `docs/audits/sources/2026-10-29-province-area-admission-complete.json`. Shipped codes are the 34 features in `public/maps/history-vietnam-province-areas.geojson` (`coverageStatus: complete`).

Compared locally after the browser runs: canonical = qualified = shipped = runtime = interior-pick for every desktop below.

| Viewport | Runtime rows | `meshPassed` failures | Interior-pick rows | Codes equal |
| --- | ---: | ---: | ---: | --- |
| 1280×720 | 34 | 0 | 34 | yes |
| 1366×768 | 34 | 0 | 34 | yes |
| 1440×900 | 34 | 0 | 34 | yes |
| 1920×1080 | 34 | 0 | 34 | yes |

Codes: `01 04 08 11 12 14 15 19 20 22 24 25 31 33 37 38 40 42 44 46 48 51 52 56 66 68 75 79 80 82 86 91 92 96`.

Every runtime row in those four files has `runtimeBuilt: true`, `status: "admitted"`, and `meshPassed: true`. After the restored-camera correction, the framing camera uses a slightly compressed surface radius, so the recorded bases are about 1.000092–1.000148 and the caps are exactly 0.006 above that base. They are no longer the constant 1.0004 / 1.0064. Multipart/hole counts that repeat on every viewport: `31` has 2 parts; `56` has 8 parts and 1 hole. Those counts come from the admitted source rings.

## What each check proves

| Check | Proves | Does not prove |
| --- | --- | --- |
| Qualified admission | The 34 canonical codes were admitted from the pinned source, including recovered Khánh Hòa `56` | Shared-border topology of the simplified asset |
| Shipped GeoJSON + provenance | Shared-arc Douglas–Peucker at 200 m wrote 34 features, 101 shared arcs, 0 crossings, 0 overlaps, gzip 80,012 bytes | A second independent survey of OSM |
| Unit topology | A staircase fixture crosses under independent per-ring simplification and stays clean under shared-arc simplification. The shipped asset has 0 crossings and 0 overlaps. The reviewed point `lng=105.88752842741935 lat=21.328063508064513` has shipped owner `19` only | Browser picking |
| Source owner of that point | A local read of the gitignored candidate `.task-reports/province-areas-candidate-20261029-complete/history-vietnam-province-areas.partial.geojson` also returns owner `19` | A CI fixture; that candidate is not in the repository gate |
| Interior samples | `docs/audits/sources/2026-10-29-province-area-interior-samples.json` has 34 units and 2 points each. The generator keeps a point only when source and output both name that single code. A local recheck of all 68 points returned 0 mismatches. The unit test rechecks shipped ownership | The national browser click |
| Runtime / `meshPassed` | For each code and desktop, a direct URL built an admitted mesh whose cap radii match `currentRadius` within 0.001, wall bottoms match `baseRadius`, wall tops match `currentRadius`, and `nonFinite` / `wallOtherHits` are 0. `meshPassed` is that conjunction | A stored copy of the raw hit counts; the JSON keeps the boolean plus vertex/part/hole counts |
| Interior pick | After labels were hidden, one shipped-anchor canvas click selected that code | A second source-qualified sample |
| F34-clear | With normal motion, clearing Cao Bằng stays clear after the zoom button, a wheel event, and 700 ms | Reduced-motion only |
| F34-occlusion | An opposite-side camera (`lat -21, lng -74, zoom 7`) removes connector paths and keeps the Hà Nội card | That leaders are hidden on the near side |
| F34-outline | The outline position buffer identity holds across 160 ms, and five clear/reselect cycles add fewer than 40 net WebGL buffer creates after warmup | Retained GPU memory |
| F34-surface | With normal motion, Cà Mau stays raised after the camera moves to `lat 6.2, lng 107.4, zoom 5.2`. Cap and wall radii still match. The card stays | A close-up where the wall reads as a tall silhouette; at this distance the extrusion is a thin rim and the radius audit is the wall measurement |
| F34-panel / O15 / O16 | X hides the chooser only. Reopening “Theo địa phương” keeps the selection, URL, and history length | A clear or a new flight |
| O2 | The four-card dossier still clears the selected label on all four desktops, including 1440×900 | Province topology |

Machine-readable rows:

- `output/playwright/province-areas/matrix/runtime-{1280x720,1366x768,1440x900,1920x1080}.json` (`schemaVersion` 2, `kind: runtime-mesh`)
- `output/playwright/province-areas/matrix/interior-pick-*.json` (`kind: interior-pick`)

## Asset

Provenance `public/maps/history-vietnam-province-areas.provenance.json`, `createdAt` 2026-10-29T06:35:27.413Z.

| Field | Value |
| --- | --- |
| Algorithm | `shared-arc-douglas-peucker`, 200 m, 4 decimal degrees |
| Points | 367,775 → 15,994 |
| Shared arcs | 101 |
| Crossings / overlaps | 0 / 0 |
| Raw / gzip | 309,879 / 80,012 bytes |
| Gzip budget ≤400 KiB | met |
| Output SHA-256 | `b7562c3d4f255a38d713d9838570082a0516c4448421b5aba9ac0031f167f9fe` |
| Gzip SHA-256 | `6ce8bc61dfdc6690aab796e8a24c421fc06c25ca464c69c29990cdc25a53b5dc` |
| Input SHA-256 | `d10ec0031e8b75542ac9bc5dfd3bc308a671144694a731ae506c327d2b095b0d` |
| Source snapshot | `2026-10-23T20:20:51Z`, SHA-256 `9428ce3e7a5c0325010a05ea713bcc5b5800f939dae0073082fc13fd8271968e` |
| Screen error at zoom 8 | 0.654 px |

The 16 Khánh Hòa ways were not downloaded again. `mergeRecovery` still requires those way ids and now rejects a missing element timestamp or a timestamp after the pinned snapshot.

## Browser evidence

National URL and pick runs use `video: retain-on-failure`. They passed, so their durable captures are the finished screenshots:

- `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts\home-province-areas-nation-a0050-sed-geometry-via-direct-URL-{1280x720,1366x768,1440x900,1920x1080}\test-finished-1.png`
- `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts\home-province-areas-nation-7bf10-s-hidden-for-every-locality-{1280x720,1366x768,1440x900,1920x1080}\test-finished-1.png`

Lifecycle recordings (`video: on`, non-zero WebM on each desktop):

- Clear: `...\home-province-areas-lifecy-7ff7a-esurrect-a-cleared-province-{viewport}\video.webm`
- Occlusion: `...\home-province-areas-lifecy-9fa6e-des-leaders-and-keeps-cards-{viewport}\video.webm`
- Outline cycles: `...\home-province-areas-lifecy-e3c4e-d-clear-cycles-stay-bounded-{viewport}\video.webm`
- Panel X: `...\home-province-areas-lifecy-ef9cd-el-X-hides-only-the-chooser-{viewport}\video.webm`
- Oblique Cà Mau surface and side-wall radii: `...\home-province-areas-lifecy-98660-he-raised-cap-and-side-wall-{viewport}\video.webm` and `test-finished-1.png`

`{viewport}` is `1280x720`, `1366x768`, `1440x900`, or `1920x1080`. The parent directory is `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts`.

## Gates observed for this correction

| Gate | Result |
| --- | --- |
| `pnpm verify` (log `.task-reports/2026-10-29-verify-f1-f5.log`) | History checks 42; ESLint 0 errors and 1 existing unused `_camera` warning; unit/component 1349 tests / 130 files; script tests 26; `next build` printed the route table |
| `node scripts/agent/local-heroes-e2e.mjs build` | Log ends on the completed Next route table (`.task-reports/2026-10-29-local-heroes-rebuild-f1f5.log`) |
| Province `F34-` @ 1280×720 | 4 passed (20.4s) |
| Full province config before the later surface case | 24 passed (11.8m) |
| `F34-surface` @ four desktops, added after that run | 4 passed (25.5s) |
| `playwright.local-heroes.config.ts` | 220 passed (12.8m), including O2, O10, O15, O16 |
| `playwright.local-heroes-regression.config.ts` | 10 passed (36.4s) |
| `pnpm build:smoke` | exit 0 |
| Smoke Playwright, `E2E_CHANNEL=msedge` | 8 passed (34.3s) |
| Shared-arc unit file after locking owner `19` | 5 passed |

`example.invalid` DNS errors during the feature server are the synthetic image fixture.

The full province config was not started again after `F34-surface` existed, so there is no single 28-test log. The 24-test log plus the 4-test surface log are the F1–F5 browser evidence.

## C1 restored close camera (2026-10-29)

A direct `/?noi-dung=dia-phuong&dia-phuong=ha-noi&ban-do=21.028,105.854,11` and the same URL at zoom 18 used to attach the area layer at cap radius 1.0064. At 1280×720 the zoom 11 camera radius is about 1.0058476425, and the zoom 18 camera radius is 1.0000456847068233, which is below the constant base 1.0004. Clearance that arrived before the layer existed was discarded.

`setProvinceAreas` now applies the current viewport and pose (`cameraRadius`, `near`, `distanceToTarget`) after the epoch check and before the layer is added. The drawable base is `provinceAreaSurfaceRadius`, which is `surfaceLayerRadii(distance).cap`. Pick meshes, walls, outlines and the geometry audit use that same base. A finished animation removes the cap only when `departing` is set, so a zero-lift selection at zoom 18 stays mounted. The saved zoom is not rewritten and no new flight is started.

Browser proof is `F34-restored-camera`: 12 passed (direct zoom 11 and 18, reduced motion and `no-preference`, four desktops, before wheel or zoom) plus the delayed-fetch case that moves the scene to zoom 18 while the GeoJSON is held and still leaves the URL at zoom 11. A later recapture of those 12 tests passed again (exit 0) and is the artifact set currently on disk:

- `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts\home-province-areas-lifecy-6e8f0-tay-outside-the-cap-reduce--{viewport}\video.webm`
- `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts\home-province-areas-lifecy-6c51c-side-the-cap-no-preference--{viewport}\video.webm`
- `D:\lich-su-viet-nam-interactive\output\playwright\province-areas\artifacts\home-province-areas-lifecy-248e2--uses-the-newest-close-pose-{viewport}\video.webm`

`{viewport}` is `1280x720`, `1366x768`, `1440x900`, or `1920x1080`. Each folder also has `test-finished-1.png`. That frame is the zoom 18 view, so the gold surface fills the canvas; the clearance claim is the measured radii, not a visible provincial outline.

The full province config after this correction passed 39 tests inside the 900s budget. `N34-pick` at 1920×1080 did not start before that budget and passed alone afterward (1.4m, exit 0). Feature 220, regression 10, `pnpm verify` (1354 unit/component tests), `pnpm build:smoke`, and smoke Playwright (8 passed, Edge) were run after the correction. Playwright replaces `output/playwright/province-areas/artifacts` on each province run, so the national finished screenshots listed above are no longer in that directory. The matrix JSON from the full run remains.
