# Cinematic globe: source research and visual gap audit

Date: 2026-10-23, Asia/Bangkok. Status: research completed; no renderer migration or UI implementation performed by this task. Research and browser inspection were performed inline by the main agent, without an independent reviewer.

## Owner's requested outcome

Bring the homepage closer to `docs/design/references/cinematic-history-globe/target.png`: a large, detailed Earth, visible curved atmospheric horizon, Vietnam in restrained gold, luminous event markers, minimal editorial navigation, and a thin timeline. Preserve meaningful interaction and the existing historical journey. Prepare small execution phases and English prompts for Gemini.

The attachment is the project's generated concept, not evidence of an identifiable website. Targeted text searches found reusable implementations of its rendering techniques; they did not establish an exact existing site or a complete matching template. This was not a reverse-image search or an exhaustive search of the internet.

## Verified local baseline

CodeGraph was attempted first because `.codegraph/` exists. Its results pointed to older map/homepage symbols and did not cover the current explorer slice adequately; direct inspection then established these findings:

| Area | Current implementation | Gap against the reference |
| --- | --- | --- |
| Earth surface | `lib/explorer/globe-style.ts` uses solid background/fill/line layers | No albedo/relief texture, material response, cloud detail, or directional surface lighting |
| Country camera | `EventMap.tsx` fits Vietnam and sets `maxPitch: 0` | A close top-down view fills the screen without a visible planetary limb; changing gold colors alone cannot fix this |
| World camera | Height-dependent zoom fits a relatively small complete sphere | Reference uses a much larger, partially cropped Earth in the settled Vietnam overview |
| Navigation | Shared `Header` emphasizes study/revision, search, account and theme controls | Reference has a quiet full-width atlas masthead and two primary exploration modes |
| Reading overlays | Left introduction; selected event card on demand | Reference also has a small initial guidance panel on the right; overlays need clearer map-safe regions |
| Timeline | Opaque, bordered bottom container with year controls | Reference uses a thin floating rail and compact filters |
| Labels/markers | Curated HTML overlays, grouping, uncertainty, keyboard access | Good reusable behavior; dot styling and hierarchy need refinement; positions must remain geographic |
| Journey | Seven sourced milestones with playback, arrival/reading delays, cancellation and restoration | Preserve these behaviors; upgrade camera direction and presentation rather than authoring a new biography |

Fresh browser baseline: `output/playwright/globe-source-research/current-home.png`, 1440×900, Microsoft Edge, development server at `http://localhost:3000/?ban-do=16,107,4.5`. This is visual research, not a new complete acceptance test.

Installed dependencies inspected: Next `16.3.8`, React `19.2.8`, Three `^0.186.1`, MapLibre `^6.11.2`. `three-globe`, `globe.gl`, React Three Fiber, and Drei are not direct dependencies. Re-read the lockfile and installed docs at execution time rather than assuming a live upstream example matches the installed version.

## Primary-source shortlist

### 1. Official Three.js Earth example — strongest material/atmosphere reference

- [Live Earth demo](https://threejs.org/examples/webgpu_tsl_earth.html).
- [Audited example source at its most recent file-changing commit](https://github.com/mrdoob/three.js/blob/bae834d3558321fd3b38200735eebfb6acb5e149/examples/webgpu_tsl_earth.html).
- [Three.js license](https://github.com/mrdoob/three.js/blob/dev/LICENSE): MIT; retain the required notice for reused code.
- Source inspected via GitHub connector: blob `0a14d35a152533d26153a4abb110a550115df412`.
- It combines day/night images, packed bump/roughness/cloud channels, directional light, a Fresnel-style atmospheric surface contribution, and an outer atmosphere shell.
- It credits Solar System Scope for textures and a Three.js Journey lesson for inspiration. The paid course is not the source being proposed for copying.
- Browser-rendered screenshot: `output/playwright/globe-source-research/threejs-earth.png`. The sphere, cloud/surface detail and atmospheric edge were visible; no console warnings/errors were recorded at that inspection point. Its on-screen FPS is not a project performance benchmark.
- Limits: its default camera shows the Americas, its UI is a demo inspector, and it has no historical event browsing. The source uses `three/webgpu`, TSL and node materials; it is not a drop-in snippet for a classic `WebGLRenderer` scene.

**Reuse:** material/layer design and appropriately adapted MIT code. Reorient and crop Earth for Vietnam; suppress distracting day/night city lights and clouds near reading targets. Keep code and image licensing separate.

### 2. `three-globe` — recommended geographic object for a Three.js prototype

- [Repository and API](https://github.com/vasturiano/three-globe).
- [Live custom-material example](https://vasturiano.github.io/three-globe/example/custom-material/).
- [Audited example source](https://github.com/vasturiano/three-globe/blob/99d7cda5a2703e7b2cce6cdf5adf5eace02c59db/example/custom-material/index.html).
- [License](https://github.com/vasturiano/three-globe/blob/master/LICENSE): MIT, Vasco Asturiano.
- Source inspected: example blob `5d6010742e361e20e262b8e46607dd218fdbdd88`; `package.json` blob `22c152a633fb5a7e3361995cb2510a4f5790e032` reports `2.45.6`, peer `three >=0.154`. This is inspected repository metadata, not a claim about the registry's future latest release.
- It is a reusable Three.js object, leaving the project in control of renderer, camera, lights and lifecycle. It supports texture/bump inputs, custom globe material, atmospheric halo, points, paths and GeoJSON Polygon/MultiPolygon layers.
- Polygon altitude defaults to a visible extrusion and polygon transitions can grow from the globe. Override these: near-surface overlays only, no tabletop or growing country columns. Its default halo is a starting point, not equivalent to the target's directional atmospheric light.
- Browser screenshot: `output/playwright/globe-source-research/three-globe-custom.png`. The example rendered; a favicon 404 was recorded. No project integration was tested.
- Costs: a new dependency and transitive geographic/data utilities; scene lifecycle, URL state conversion, accessible labels and flight cancellation remain the project's responsibility. Measure these costs in the prototype.

**Reuse:** geographic layer construction and the custom-material example. Prefer one `ThreeGlobe` object inside the installed Three.js scene over installing several globe/React wrappers. Do not copy its unpinned CDN imports or assume example image rights are MIT.

### 3. `globe.gl` — faster complete widget, less direct scene ownership

- [Repository](https://github.com/vasturiano/globe.gl), [live custom styling demo](https://globe.gl/example/custom-globe-styling/).
- [Audited example source](https://github.com/vasturiano/globe.gl/blob/76378d001b9c6f6d10c9c8e0330e2716fa70b322/example/custom-globe-styling/index.html).
- [License](https://github.com/vasturiano/globe.gl/blob/master/LICENSE): MIT.
- It wraps globe rendering with scene/camera/control APIs. Useful for quickly exploring an interactive globe, but it is not a matching history-homepage template.
- Browser screenshot: `output/playwright/globe-source-research/globe-gl-custom.png`; it rendered. The current hosted example emitted a multiple-Three-instances warning and a favicon 404. Its source mixes a bundled widget CDN with a separate Three import; do not reproduce that loading pattern in Next.js.

**Decision:** retain as an alternative, not an additional dependency alongside `three-globe`. A library demo's default camera and dense star texture are not the target composition.

### 4. MapLibre globe atmosphere — lowest migration cost

- [Official atmosphere example](https://maplibre.org/maplibre-gl-js/docs/examples/globe-atmosphere/).
- [Current repository example](https://github.com/maplibre/maplibre-gl-js/blob/main/test/examples/display-a-globe-with-an-atmosphere.html).
- [License](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt): BSD 3-Clause terms.
- Official examples establish that MapLibre can render a globe with raster imagery and atmosphere; flat polygons are a property of our current style, not a universal limitation of MapLibre.
- The documentation page and current repository example use different imagery providers/version snapshots. A provider's sample URL/API key is not a reusable asset license or a project service agreement.
- Preserve MapLibre if a small styled-image/camera experiment meets the target and budgets. The existing URL/pan/zoom/picking behavior would need fewer changes.
- Limits for this target: more constrained material/art direction, the need to validate a visible limb at the Vietnam overview, and likely tiled imagery setup. Raster-without-labels is distinct from the cluttered OSM basemap the owner rejected.

**Decision:** fallback renderer path if the Three.js prototype cannot meet visual/performance/interaction constraints. Do not build two complete production renderers or keep two live canvases.

### 5. Takram `three-geospatial` — advanced atmosphere reference, deferred

- [Repository](https://github.com/takram-design-engineering/three-geospatial).
- [Atmosphere package license with third-party notices](https://github.com/takram-design-engineering/three-geospatial/blob/main/packages/atmosphere/LICENSE).
- The current README describes modular precomputed atmospheric scattering and volumetric clouds, beta/alpha packages, and an API transition for WebGPU.
- Root MIT does not remove the package's additional MIT/BSD/Apache notices. Some examples use optional Google/Cesium services and Git LFS assets.

**Decision:** do not add this stack for the first visual upgrade. The owner needs a readable historical globe, not volumetric weather or physically complete atmospheric simulation. Not browser-benchmarked in this research task.

## Asset sources and separate reuse decisions

| Source | Verified evidence | Recommended use / remaining work |
| --- | --- | --- |
| [Solar System Scope textures](https://www.solarsystemscope.com/textures/) | Publisher page lists Earth day, normal, specular, clouds and night maps, equirectangular projection, and CC BY 4.0 distribution | Preferred prototype imagery. Record exact chosen file URL, creator/credit, license link, checksum, size, and derivatives; publish attribution and note color/size edits. Choose a matched set so coastlines/channels align. |
| [NASA image/media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/) | General NASA media guidance, including third-party/identifier exceptions | Alternative primary imagery. Verify the individual asset and credit; do not treat all images anywhere on a NASA page or all derivative packs as public domain. No asset was downloaded/cleared here. |
| [Natural Earth III texture catalog](https://www.shadedrelief.com/natural3/pages/textures.html) and [terms](https://www.shadedrelief.com/natural3/pages/use.html) | Search indexed the publisher's public-domain statement; direct page access failed in this environment | Interesting atlas-like alternative. Mark conditional, not cleared for ingestion until the executor can read the terms and specific asset directly. |
| Existing `public/maps/*.geojson` and provenance | Sourced modern generalized geography, including existing Vietnam island coverage | Retain as geographic truth; not a historical border reconstruction. Existing provenance has no independent human cartographic sign-off. |
| Generated target image | Owner's art-direction reference | Documentation only. Never use its apparent islands, borders or event dots as coordinates. |

No textures, third-party code, or npm packages were imported into application code by this research task. Only the owner's reference image was copied into project documentation. Demo screenshots were captured for local comparison.

## Recommended route and limits of confidence

Prototype **installed Three.js + one `three-globe` object**, with the official Earth demo as the material/atmosphere reference and a locally hosted, credited texture set. The additional dependency is proposed specifically to avoid hand-authoring spherical GeoJSON triangulation, layer curvature and geographic primitives; installed Three.js remains the renderer. Confirm exact package compatibility, transitive costs and disposal in Phase 0/1. Do not add R3F, Drei, `globe.gl`, GSAP, or a second map engine to the same scene.

Use a classic WebGL2-capable Three.js renderer/material pipeline for the first prototype, adapting the visual techniques rather than blindly mixing TSL/node materials with classic shader materials. A coherent WebGPU/node pipeline with a tested WebGL2 fallback is an alternative only if the executor documents why it reduces work on the installed version. [Official renderer guide](https://threejs.org/manual/en/webgpurenderer.html) explains fallback and material-pipeline differences.

This is a technical recommendation, **not an owner-approved engine migration and not proof of visual parity**. The earlier minimal-globe spec explicitly avoided realistic textures; the new owner request supersedes that visual restraint. Prototype screenshots and an owner visual checkpoint must precede switching the homepage renderer.

Success requires both rendering and composition. No repository above supplies our historical data, curated Vietnamese labels, timeline, event card, page navigation, or sourced biography. Reuse can save building the Earth/layer foundation; it cannot guarantee a pixel-identical result from copying a demo.
