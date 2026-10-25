# Cinematic globe Phase 0 baseline audit and reuse package

Date: 2026-10-23 (Asia/Bangkok). Status: Phase 0 baseline frozen (`Checkpoint P0`). No production UI or renderer files were modified.

## 1. Workspace state and file hash snapshot

- **Branch:** `codex/3d-map-design`
- **HEAD commit:** `0594a7fd5ac4882e70959311b8543cb5963f9b41`
- **Workspace condition:** Dirty feature workspace preserved intact per `shared-contract.md` (tracked modifications in `app/(public)/page.tsx`, `components/explorer/HistoryExplorer.tsx`, `lib/explorer/url.ts`, `package.json`, `pnpm-lock.yaml`, etc., plus untracked explorer, public route, and root Word report files). No reset, stash, clean, or checkout from `HEAD` was performed.

### Relevant baseline file hashes (SHA-256)

| File path | Bytes | SHA-256 |
| --- | ---: | --- |
| `app/(public)/page.tsx` | 2,243 | `bde80c528fdcdc66d1f0db22e9cfc68433cb7b7fb805bff22f3155ebc535e73e` |
| `components/explorer/HistoryExplorer.tsx` | 12,373 | `383b916c623047e5eda04d35d31406403c68cc29fcaff05ef2cc97b9e5017088` |
| `components/explorer/EventMap.tsx` | 12,742 | `21571e9bd2bc96a4fb2a313ace9df06087c01022f5d6cdad8c24cca83aa90d9f` |
| `components/explorer/GlobeMarkers.tsx` | 7,407 | `cd8346fcc09238d43e68ee3ae2e86469b9dd8b68178def2a493cfa320e76f4d6` |
| `components/explorer/MapEventCard.tsx` | 3,338 | `1b9e7feda17b43e6efe37fdc93e74cf2d8a75e3b1eb0e12905cd78c031c35457` |
| `components/explorer/MapEventList.tsx` | 2,518 | `d470bf728ca4cf50e22cc6b91250de96310a3e47b0522683edc9cf0c2a412e57` |
| `components/explorer/MapTimeControls.tsx` | 3,183 | `b8e4b4c864973cc2ba801e6e04872bf28d4624d1988f0e151cafc27f6bfbcb11` |
| `components/explorer/JourneyPanel.tsx` | 4,859 | `7f7838bc5be8468df07c570ba4de25f6021cb7e82eed7198fa1feac25fbcd242` |
| `components/explorer/explorer-map.css` | 12,284 | `813b751f290da9d3875a3e3990680763ec5667336951d24bbd66878009ec2a03` |
| `lib/explorer/globe-style.ts` | 1,485 | `f6d9ed0c6a9961a0ef1aec27f9b332991610d5cfd776725e889a352fa0591da4` |
| `lib/explorer/journey.ts` | 7,699 | `3a3e5127d070d3ddf9956a9ba967fad0a066a57c93da8b826074831109c8e7d2` |
| `lib/explorer/map-markers.ts` | 2,476 | `ee7ad423b0381a77044129d06624cf99621153fac745e4d1439186f8d76dbc1f` |
| `lib/explorer/map-state.ts` | 1,447 | `cd1fa3411ca9be63c09530c909fd7c7c6213a1e0dbb7a4edc6d4ab6045a99b85` |
| `lib/explorer/map-view.ts` | 803 | `5c41b0512a20096eff2de58aabc6d3fc5a6aa0c9da149944c24ad1068dc34b34` |
| `lib/explorer/projection.ts` | 1,918 | `a11969bf4bc47f95c1eb764bf622a406154728fd6db2df8122f98df8fd6cf4d3` |
| `lib/explorer/url.ts` | 6,061 | `aba38e258d5ca8b22185dc94850454d3dd12c2c4fbfabecca5d9899284ec27d3` |
| `public/maps/history-world-land.geojson` | 1,257,963 | `d2a0f8661ec662ba9bdd45072b2800a2c917102d2291a6d93a1401a2479a28cb` |
| `public/maps/history-world-land.provenance.json` | 1,010 | `8a999e03b5088956b77859ac46a2467f140dbf3c453dcab9063ae9aad7c6914c` |
| `public/maps/vietnam-tabletop.geojson` | 105,197 | `2239001e2c4030421949a760feb4e1ddae5abe192bd7827344848851a431a895` |
| `public/maps/vietnam-tabletop.provenance.json` | 4,782 | `485b9da431fbd019fec0e4f723ed1eb9adfe655f164dd1d78a26717a7a0f40ae` |
| `public/maps/history-vietnam-labels.json` | 1,071 | `af6491c8bf671ccf4444d1507406e23fd223b824e1ba6b67a92cfbe3f31aefac` |
| `docs/design/references/cinematic-history-globe/target.png` | 2,370,100 | `ba06dec963645d4231beb4c7eecd29a8dc23510b98d30a44e1c967d5ca4e2cc7` |
| `package.json` | 1,776 | `96e39237f4147ca857f8eb8c42458c65173998dc894d9805fe41a7df63eb0a03` |
| `pnpm-lock.yaml` | 183,409 | `0194f23dce232d7bcf8ce88a430b47a0655b4d1868c996165d862735cacfea69` |
| `tests/unit/explorer-globe.test.ts` | 3,612 | `cd4dcf085e8cd2737285e62b3a3a5ed49e40a343028b2627980f1409e99b6d5c` |
| `tests/unit/explorer-map-markers.test.ts` | 3,785 | `2908adf9b177a34e3eed16e75ea5fb0245eed8f28b2806632290422bc158cacf` |
| `tests/unit/explorer-map-state.test.ts` | 3,516 | `50cd8999abf9ea04d77637a8b56c3b68dd34065c9a680efaf3ab54feb4bb5652` |
| `tests/e2e/home-map.spec.ts` | 9,943 | `c10da149fb10ab8141f44a954444dfedc42443354b52b87e84b61697488baba1` |
| `tests/e2e/home-globe.spec.ts` | 13,079 | `f06033ef1d5edacb20df393be57f7b2c36be6c25af81c21e9ba07bf962d50446` |

## 2. Browser visual baseline and environment

Captured against a fresh local production build (`pnpm build` followed by `next start -p 3100`, leaving the user's `localhost:3000` dev server untouched):

- **Browser:** Microsoft Edge (`HeadlessChrome/155.0.0.0 Safari/537.36 Edg/155.0.0.0`) via `@playwright/test` (`channel: "msedge"`).
- **Graphics backend:** `WebGL 2.0 (OpenGL ES 3.0 Chromium)` — `ANGLE (Intel, Intel(R) UHD Graphics (0x00009A68) Direct3D11 vs_5_0 ps_5_0, D3D11)`, `devicePixelRatio: 1`.
- **Console / page errors during capture:** `0` console errors, `0` uncaught page errors.

### Recorded baseline screenshots (`output/playwright/cinematic-globe/phase-0/`)

| State | Viewport | URL | Screenshot path |
| --- | --- | --- | --- |
| Settled Vietnam overview | 1440×900 | `http://localhost:3100/?tu=1911&den=1986&ban-do=14.76473,104.83489,4.7` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\vietnam-1440x900.png` |
| World overview | 1440×900 | `http://localhost:3100/?tu=1911&den=1986&ban-do=18,107,1.7` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\world-1440x900.png` |
| Selected event card (`Chiến dịch Điện Biên Phủ`) | 1440×900 | `http://localhost:3100/?tu=1911&den=1986&su-kien=chien-dich-dien-bien-phu&ban-do=21.386,103.023,6.5` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\card-1440x900.png` |
| Journey (`Rời Tổ quốc`, milestone 1/7) | 1440×900 | `http://localhost:3100/?tu=1911&den=1986&ban-do=10.76212,106.70299,6.4&hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\journey-1440x900.png` |
| Settled Vietnam overview (short desktop) | 1280×720 | `http://localhost:3100/?tu=1911&den=1986&ban-do=14.3389,103.81754,4.21` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\vietnam-1280x720.png` |
| World overview (short desktop) | 1280×720 | `http://localhost:3100/?tu=1911&den=1986&ban-do=18,107,1.31` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\world-1280x720.png` |
| Selected event card (short desktop) | 1280×720 | `http://localhost:3100/?tu=1911&den=1986&su-kien=chien-dich-dien-bien-phu&ban-do=21.386,103.023,6.5` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\card-1280x720.png` |
| Journey (short desktop) | 1280×720 | `http://localhost:3100/?tu=1911&den=1986&ban-do=10.76212,106.70299,6.4&hanh-trinh=ho-chi-minh-1911-1941&moc=sai-gon-1911` | `D:\lich-su-viet-nam-interactive\output\playwright\cinematic-globe\phase-0\journey-1280x720.png` |

### Six-category visual baseline vs `target.png` (pre-prototype score: 2/12)

| Category | Current baseline state | Score (0–2) | Concrete gap to resolve in Phases 1–3 |
| --- | --- | :---: | --- |
| 1. Camera & planetary scale | `vietnamView` fits `[[101.7, 7.5], [113, 23.8]]` with `maxPitch: 0` (`zoom: 4.7` at 1440×900, `4.21` at 1280×720), producing a flat top-down crop with no visible Earth limb; `worldView` (`zoom: 1.7` / `1.31`) renders a small centered ball (`~460px` diameter). | 0 | Orient and tilt the camera in Phase 1 so the default settled Vietnam overview shows a large cropped sphere whose curved limb crosses the upper-right quadrant while keeping mainland Vietnam inside x=36–62%, y=20–72%. |
| 2. Material & surface detail | `buildGlobeStyle()` uses flat solid fills (`#0b1b2c` ocean, `#263a48` land, `#6e633e` Vietnam) with no albedo texture, terrain relief, or water specular response. | 0 | Apply the matched label-free Solar System Scope Earth day (`4096×2048`), normal (`2048×1024`), and specular (`2048×1024`) maps in Phase 1. |
| 3. Atmosphere & lighting | Static MapLibre `sky` blend (`#334b62` horizon fading to `0` by zoom 7); no directional sun lighting, Fresnel surface rim, or sparse space starfield. | 0 | Add directional sunlight, Fresnel surface contribution, back-side atmospheric limb shell, and sparse procedural stars in Phase 1. |
| 4. Vietnam treatment & geographic alignment | Sourced `vietnam-tabletop.geojson` renders at accurate coordinates with `#6e633e` fill and `#e7c47f` outline, including Hoàng Sa and Trường Sa; however, solid fill hides underlying terrain and event markers are oversized (`36px` bordered discs). | 1 | Keep sourced GeoJSON alignment flush to the sphere with translucent gold tint that preserves underlying terrain relief and refine markers in Phases 1–4. |
| 5. Composition & shell hierarchy | Shared study `Header` (`Lịch sử 12`, study dropdowns, search input, theme toggle, login) dominates the top bar; mode toggle sits inside the left overlay; no initial right guidance card; bottom timeline is a heavy bordered box. | 0 | Introduce `HomeAtlasHeader`, right initial guidance card (`Khám phá một sự kiện`), and thin floating time rail over a bottom scrim in Phase 3. |
| 6. Readability & accessibility | Vietnamese serif/sans typography, keyboard navigation, Escape dismissal, and WCAG AA contrast pass automated axe checks (`home-map.spec.ts`), though dense shell chrome competes with the map. | 1 | Preserve WCAG AA contrast, focus order, and HTML fallbacks while decluttering the shell in Phase 3. |

## 3. Framework documentation and dependency evaluation

### Installed runtime and documentation check

- **Installed versions verified in `node_modules`:** `next@16.3.8`, `react@19.2.8`, `react-dom@19.2.8`, `three@0.186.1`, `@types/three@0.186.0`, `maplibre-gl@6.11.2`, `sharp@0.35.5`.
- **Next.js App Router guides reviewed (`node_modules/next/dist/docs/`):**
  - `01-app/01-getting-started/05-server-and-client-components.md`: `app/(public)/page.tsx` remains an async Server Component that fetches published events/limits on the server and passes serializable props to `HistoryExplorer` (`"use client"`).
  - `01-app/02-guides/lazy-loading.md`: `ssr: false` with `next/dynamic` must live inside a Client Component (`HistoryExplorer.tsx`), which is already how `EventMap` is loaded.
- **Three.js package exports reviewed (`node_modules/three/package.json`):** `three@0.186.1` exports both classic WebGL (`three` -> `./build/three.module.js`) and WebGPU/TSL (`three/webgpu`, `three/tsl`). Because `three-globe` is built on classic `THREE.Object3D` / `THREE.Mesh` / `THREE.ShaderMaterial` and `WebGLRenderer` is universally supported across the project's Playwright Edge/D3D11 environment, Phase 1 will use a coherent classic `WebGLRenderer` + `MeshStandardMaterial` / custom `ShaderMaterial` pipeline rather than mixing TSL `NodeMaterial` with `three-globe`.

### Proposed single dependency: `three-globe@2.45.6`

- **Registry metadata (`pnpm view three-globe@2.45.6`):**
  - **Version:** `2.45.6`
  - **License:** `MIT` (Copyright (c) Vasco Asturiano)
  - **Tarball:** `https://registry.npmjs.org/three-globe/-/three-globe-2.45.6.tgz`
  - **Integrity:** `sha512-pVaHWVo5vUiFlLxc6gbQxwTTVjrscbpBfiOzuZlx1SHDXiV/yErhfMnivJkEPMRuw0n+lujrMQe8LWr4a01anw==` (SHA-1: `358282be8716bf9159de28d6a86ddb19b0e40dda`)
  - **Peer dependencies:** `{ "three": ">=0.154" }` — directly compatible with installed `three@0.186.1`.
  - **Direct dependencies (all MIT/ISC/BSD):** `@tweenjs/tween.js` (`18 - 25`), `accessor-fn` (`1`), `d3-array` (`3`), `d3-color` (`3`), `d3-geo` (`3`), `d3-interpolate` (`3`), `d3-scale` (`4`), `d3-scale-chromatic` (`3`), `data-bind-mapper` (`1`), `frame-ticker` (`1`), `h3-js` (`4`), `index-array-by` (`1`), `kapsule` (`^1.16`), `three-conic-polygon-geometry` (`2.1.3`, `peerDependencies: { "three": ">=0.72.0" }`), `three-geojson-geometry` (`2.1.1`, `peerDependencies: { "three": ">=0.72.0" }`), `three-slippy-map-globe` (`1.0.6`, `peerDependencies: { "three": ">=0.154" }`), `tinycolor2` (`1`).
- **Why existing project helpers do not replace `three-globe`:**
  - `lib/explorer/projection.ts` (`createMapProjection`) is a flat 2D planar equirectangular projection (`PointXZ = { x, z }`) built for the earlier extruded tabletop slab. It cannot triangulate polygons onto a sphere, subdivide interior polygon vertices so country fills follow planetary curvature without cutting chords beneath the sphere surface, or interpolate great-circle lines.
  - `three-globe` (via `three-conic-polygon-geometry` and `three-geojson-geometry`) provides tested spherical polygon triangulation with holes and interior Voronoi/Delaunay subdivision plus spherical line/arc generation inside a single `THREE.Object3D`, while leaving camera, renderer, lighting, and custom materials under our direct control.
- **Phase 0 boundary:** `three-globe` is **not** installed in Phase 0 (`package.json` and `pnpm-lock.yaml` remain untouched). Its actual bundled gzip size will be measured in Phase 1 against the `≤400 KiB` helper / `≤800 KiB` cold globe JS budget.

## 4. Acquired Earth texture set and provenance (`public/maps/globe/`)

Only the three required label-free equirectangular maps from the primary audited publisher (**Solar System Scope / INOVE**, <https://www.solarsystemscope.com/textures/>, **CC BY 4.0**) were acquired and processed into `public/maps/globe/`:

| Local file | Role | Upstream URL & SHA-256 | Local dimensions & format | Local size | Local SHA-256 | Decoded GPU memory (with mipmaps) |
| --- | --- | --- | --- | ---: | --- | ---: |
| `public/maps/globe/earth-day-4096x2048.jpg` | Label-free day albedo (`sRGB`) | `https://www.solarsystemscope.com/textures/download/8k_earth_daymap.jpg` (`88ab060b6e7d241cfc590c69f528fab2b3247b738d40124cb590999a6fe44abc`, 8192×4096, 4,565,076 B) | 4096×2048 MozJPEG (4:2:0, q=84) | 604,686 B (590.51 KiB) | `dd19f035724ef42464c89a4feb0d46ad4cbdf9fa591fed9bf4c861768e16cfa2` | 42.67 MiB |
| `public/maps/globe/earth-normal-2048x1024.jpg` | Tangent-space terrain normal map | `https://www.solarsystemscope.com/textures/download/2k_earth_normal_map.tif` (`f518ce2646ca935dbc17e316041de4fea7a5da0ec441e4eb22e711eabd843ba2`, 2048×1024 TIFF, 521,376 B) | 2048×1024 MozJPEG (4:4:4, q=92) | 74,177 B (72.44 KiB) | `8cb5fd182d1647104825de7f62a441fea00eb0f45e0a68aeb7b37d6792d2f0a5` | 10.67 MiB |
| `public/maps/globe/earth-specular-2048x1024.jpg` | Land/water specular & roughness mask | `https://www.solarsystemscope.com/textures/download/2k_earth_specular_map.tif` (`6b90ecfce248591a1ecc9a3e49acca1a7059b6828877e718302ed9a6b4471bd7`, 2048×1024 TIFF, 338,524 B) | 2048×1024 MozJPEG (4:2:0, q=85) | 133,396 B (130.27 KiB) | `465ce53d3185694ce0878b97e7a4a2a1b39e14f6522dbd8717a08b93bbd321f7` | 10.67 MiB |
| **Total** | **3 matched textures** | **Solar System Scope (CC BY 4.0)** | — | **812,259 B (793.22 KiB)** | — | **64.00 MiB** |

- **Budget compliance:**
  - Initial globe images transfer size: `793.22 KiB` (`0.77 MiB`), well within the `≤3 MiB` provisional budget.
  - Estimated decoded RGBA8 GPU memory including mipmaps ($\times 4/3$): `64.00 MiB`, well within the `≤96 MiB` provisional budget.
  - Existing compressed geographic vector/label assets (`history-world-land.geojson`, `vietnam-tabletop.geojson`, `history-vietnam-labels.json`): `454,321 B` (`443.67 KiB` gzip), within the `≤500 KiB` budget.
- **Why clouds and night maps were omitted from initial acquisition:**
  - The visual spec notes that cloud detail is optional/subordinate and must never obscure Vietnam or active milestones, and night city lights are not historical evidence. Omitting separate 4K cloud/night maps saves `~85 MiB` of decoded GPU memory while keeping the surface over Vietnam crisp.
- **Provenance and credit records created:**
  - `public/maps/globe/assets.provenance.json`
  - `public/maps/globe/ATTRIBUTION.md`

## 5. Verification baseline and known pre-existing issues

1. **Focused explorer unit suite:**
   - Command: `pnpm exec vitest run tests/unit/explorer-map-state.test.ts tests/unit/explorer-map-markers.test.ts tests/unit/explorer-globe.test.ts`
   - Result: **3 test files passed (25/25 tests passed)**.
2. **Public homepage E2E baseline against fresh local build (`localhost:3100`):**
   - Command: `pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts --workers=1`
   - Result: **22/22 tests passed (0 failures)** in 1.8m.
   - **Pre-existing non-fatal server log observation:** During tests that intentionally abort routes, disable WebGL, or close browser contexts immediately after navigation (`unsupported WebGL`, `failed geographic asset`, `pending filter URL writes`), Next.js `start` prints `[WebServer] ⨯ Error: The destination stream closed early. (digest: '3840477093')` to stderr when the client closes the HTTP stream before server streaming completes. This is pre-existing framework stream-cancellation logging, not a test failure or client error.
3. **Full verification gate (`pnpm verify`):**
   - Executed before Phase 0 handoff (includes `pnpm agent:check`, `pnpm history:data:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`).

## 6. Remaining unknowns for Phase 1

- **Actual bundled gzip size of `three-globe@2.45.6`:** Must be measured in Phase 1 after adding the dependency to verify compliance with the `≤400 KiB` added helper / `≤800 KiB` total cold globe JS budget.
- **Close-zoom texture sharpness at `zoom: 8` (`Chiến dịch Điện Biên Phủ`):** Must be inspected in Phase 1 on the `4096×2048` day map to verify whether `4096×2048` + normal map detail remains sufficiently crisp at `zoom: 8` or if max event-selection camera distance should be tuned.
- **10-second camera flight frame-time distribution (`median ≤33.3 ms`, `p95 ≤50 ms`):** Must be measured on the Phase 1 prototype scene under the recorded `ANGLE (Intel UHD Graphics Direct3D11)` configuration.
