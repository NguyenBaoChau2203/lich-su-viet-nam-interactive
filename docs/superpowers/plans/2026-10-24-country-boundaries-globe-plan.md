# Country Boundaries on the Cinematic Globe — Implementation Plan

> **For the implementing agent:** Use an inline executing-plans workflow, one phase per task. The owner's single-agent rule overrides subagent and independent AI reviewer recommendations. Do not automatically run the next phase. This is a new narrow extension, not a rerun of the seven cinematic-globe phases.

**Goal:** Add subtle sourced country land borders to the existing Earth so neighboring nations are distinguishable, preserving Vietnam/event prominence and all current interactions.

**Architecture:** Ship one compact versioned Natural Earth line asset; project its open/disconnected lines onto the current sphere; attach one passive line batch to the existing scene. Fetch the layer independently so optional-border failure never disables core event discovery.

**Tech stack:** Current Next.js/React/strict TypeScript, installed Three `0.186.1` line addons, Node script, Vitest and Playwright. No added dependency, imagery provider or renderer.

**Spec:** `docs/superpowers/specs/2026-10-24-country-boundaries-globe-design.md`.

**Review:** `docs/audits/2026-10-24-country-boundaries-globe-review.md`.

**Prompts:** `docs/agent/prompts/country-boundaries/README.md`, then `phase-0.md` through `phase-3.md`.

**Status:** Proposed, no implementation tasks completed by the review task. The 50m source/style/budget are recommendations, not a claimed owner selection or completed map review.

## Global constraints

- Preserve the current cinematic scene, textures, camera presets, intro/journey director, event data and HTML controls. Do not roll back to the earlier 2D/tabletop scopes.
- Use one agent, inspect the dirty workspace, use CodeGraph first when applicable and read installed framework docs before code. Do not overwrite unrelated tracked/untracked work, Word, secrets or `.env`.
- Desktop CSS sizes: 1280×720, 1366×768, 1440×900, 1920×1080. Preserve keyboard, reduced motion, fallbacks and existing responsive support; mobile/tablet work is deferred.
- No new historical facts/coordinates, border reconstruction by year, provinces, country labels, maritime/claim-line supplements, database changes, npm dependencies or renderer migrations.
- Keep modern/generalized source limitations and the proposed class policy explicit. The reference is art direction, not geographic authority.
- One canvas/context, one passive boundary object, no new continuous render loop or pointer layer.
- Preserve `navigationPending`, `restoreRequest`, safe detail return URLs and flight cancellation. Optional geometry must not change URL/camera/selection state.
- Proposed budgets: boundary gzip ≤150 KiB; all runtime geography ≤600 KiB; ≤60,000 boundary segments; added geometry target ≤4 MiB; at most one added draw call. The new total explicitly amends the earlier 500 KiB proposal for this extension.
- Run focused checks, `pnpm verify` and an ignored `.task-reports/` report at every handoff. No push, PR, merge, deploy, external mutation or publication.

## Review focus

1. Wrong coordinate nesting can close an open line or connect disconnected MultiLineString parts; pin both with geometry tests.
2. Wrong property case or premature stripping can silently erase source boundary classifications; pin selection/omission/provenance before rendering.
3. Higher/coarser global borders can compete with or double Vietnam's gold outline; pin layer depth and inspect shared-edge close views.
4. An optional fetch or late callback can break core readiness or attach to a disposed scene; test slow/failing asset and navigation/retry races.
5. Screenshot-only success can hide far-side lines, resize width errors or idle rendering; verify real pixel regions, DPR/resize and renderer behavior.

## File map and interfaces

| Action | Path | Responsibility |
| --- | --- | --- |
| Create | `scripts/build-country-boundaries.mjs` | Pinned-source normalization and deterministic output/provenance generation |
| Create | `public/maps/history-country-boundaries.geojson` | Compact ordinary international land lines only |
| Create | `public/maps/history-country-boundaries.provenance.json` | Source/hash/class policy/omission records and limitations |
| Create | `lib/explorer/cinematic/country-boundaries.ts` | Line types, strict processed-data parser and spherical segments |
| Modify | `lib/explorer/cinematic/scene.ts` | Attach/remove/dispose one line batch, width/depth/resize and diagnostic count |
| Modify | `components/explorer/cinematic/CinematicGlobeCanvas.tsx` | Independent optional loading, stale/abort guards and status |
| Modify | `components/explorer/cinematic/CinematicEventMap.tsx` | Map-source disclosure only; no input/controller rewrite |
| Modify | `public/maps/globe/ATTRIBUTION.md` | Attribute the added vector source separately from image licenses |
| Create | `tests/unit/explorer-country-boundaries.test.ts` | Source policy, geometry, validation, hashes/budget |
| Modify | `tests/unit/explorer-globe.test.ts` | Count the full runtime geography set and use the explicit new total cap |
| Create | `tests/e2e/home-country-boundaries.spec.ts` | Real drawn border, optional failure and lifecycle behavior |

Existing helpers: `geoToVector`, vector operations in `projection.ts`; existing `LineSegments2` Vietnam outline and resolution handling in `scene.ts`; current `CinematicScene.dispose` registry. The polygon-only `surfaceOutlineSegments` remains a polygon helper.

Proposed minimal contracts, all in the feature slice:

```ts
type CountryBoundaryCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    properties: {
      sourceId: number;
      sourceClass: string;
      viewClass: "International boundary (verify)";
    };
    geometry:
      | { type: "LineString"; coordinates: [number, number][] }
      | { type: "MultiLineString"; coordinates: [number, number][][] };
  }[];
};

function parseCountryBoundaries(input: unknown): CountryBoundaryCollection;
function countryBoundarySegments(
  data: CountryBoundaryCollection,
  radius?: number,
  stepDeg?: number,
): Float32Array;
```

The parser throws on malformed processed data; the optional loading boundary catches it and degrades to no extra layer. `countryBoundarySegments` defaults to radius `1.0002`, angular step `0.25`, returns independent xyz segment endpoints, and never closes or connects line parts. Add to `CinematicScene`: `setCountryBoundaries(data: CountryBoundaryCollection | null): void`; stats may add `countryBorderSegments: number` for audit. No renderer vectors enter public URLs.

## Phase 0 — Source, policy and reproducible artifact

**Checkpoint B0:** One sourced compact asset and meaningful input/integrity tests; no rendered change yet.

**Consumes:** Review/source evidence and proposed design. **Produces:** builder, runtime asset, provenance/class inventory, type/parser and budget checks.

- [ ] Capture current status/hashes and confirm the core scene still uses only coastlines/Vietnam outline. Read current rules, review, spec and installed docs relevant to changed code.
- [ ] Re-fetch the pinned 50m raw file or use a hash-verified original. Expected source SHA-256 is in the review. Distinguish repository tag `v5.1.2` from layer catalog version `5.1.0`. Verify source terms/policy directly.
- [ ] Write failing tests for uppercase `FEATURECLA`/`FCLASS_VN`, null fallback, override to ordinary, override to `Unrecognized`/`Admin-1 boundary`, unknown/missing classes, valid line types and deterministic output. Fixtures must be explicitly synthetic or source-derived; no invented map claims.
- [ ] Implement a small builder with an offline `--input` path option and explicit source metadata. Keep `sourceId`, `sourceClass`, `viewClass`; round geographic decimals to four places without rounding IDs. Omit nonordinary effective classes, record IDs/counts/reasons, and preserve open/disconnected geometry. Validate before atomic output; errors do not replace a valid artifact with partial data.
- [ ] Reproduce the candidate inventory: 390 raw features → 357 ordinary features under this exact source/policy. A different count is a source/filter change to investigate, not a number to force. Source points are generalized modern geography, not exact legal or historical borders.
- [ ] Produce the GeoJSON/provenance and update vector credits. Implement the strict runtime parser. Extend budget tests to count all four runtime geography assets, assert ≤150 KiB boundary / ≤600 KiB total and exact hash/provenance. Do not weaken precision/island checks or leave the new asset out of the sum.
- [ ] Run `pnpm exec vitest run tests/unit/explorer-country-boundaries.test.ts tests/unit/explorer-globe.test.ts`, `pnpm verify`, diff/status checks and the B0 local report. Stop.

If the old 500 KiB cap is retained by owner decision, evaluate the pinned 110m fallback from the review; do not change resolution/class policy silently. Phase 1 must use the artifact actually selected and documented.

## Phase 1 — Spherical line geometry and optional integration

**Checkpoint B1:** Actual country lines render on the same Earth; failed/late optional data cannot break core discovery.

**Consumes:** B0 processed line asset/types. **Produces:** spherical segment helper, one attached batch, independent loader/status and geometry/failure regressions.

- [ ] Add red tests: a two-point line is one segment with no closing edge; disconnected parts remain disconnected; `[lng, lat]` ordering; short arc across ±180°; long-segment subdivision; finite radius/bounds; degenerate points; invalid input; segment-count guard. Existing polygon tests must stay green.
- [ ] Implement the pure segment helper using the current coordinate convention. Never flatten all line coordinates into a single path. Do not import line geometry into the polygon cap builder.
- [ ] Add `setCountryBoundaries` to the current scene. Remove/dispose a prior batch before replacement, set pixel resolution at attach and resize, register cleanup, keep true depth testing and request one invalidated frame. Start from the spec's near-surface radius/order; one batched draw only.
- [ ] Start border fetch concurrently in `CinematicGlobeCanvas` with a handled optional result. Core engine/highlight/imagery readiness must not await it. After the scene exists, attach only the current nonaborted result. Missing/invalid data sets border status `unavailable`, not the fatal renderer state. Aborting an old attempt makes its callback inert.
- [ ] Add browser checks proving actual border-region pixels differ between a ready asset and blocked asset at the same restored camera. Use source-derived near-side samples and a stable reduced-motion page; a fetch-200 or segment-count assertion alone is not proof of rendering.
- [ ] Exercise 404, malformed JSON/geometry and delayed response after navigation/retry/context loss. Assert Earth readiness, one canvas, working event/card interaction, unchanged URL state and no unhandled error. Keep core image-error recovery unchanged.
- [ ] Run focused unit/new E2E cases, retained core homepage tests and `pnpm verify`; report B1 and stop. Do not tune the global camera, surface textures or authored journey to make line tests pass.

## Phase 2 — Match the reference's line hierarchy

**Checkpoint B2:** Country borders read clearly in real screenshots while Vietnam/events remain dominant.

**Consumes:** B1 integration. **Produces:** calibrated stroke settings, source disclosure and same-camera comparisons.

- [ ] Capture default/world/card/European journey states at all four desktop sizes. Compare border-present vs blocked-optional-asset captures and the concept; do not stretch/crop the concept into a supposed geographic match.
- [ ] Tune the spec's slate stroke/width ranges. Test DPR 1 and capped high DPR, resize and closest useful event view. Inspect contiguous joints for round-cap beads, coastline overlap, horizon popping and shared Vietnam-edge double strokes.
- [ ] Keep Vietnam's existing gold cap/outline intact. If source-scale differences cause visible duplicate shared edges, apply the smallest source-aware suppression/clip and add a regression; do not use a broad region box or alter source geography without provenance.
- [ ] Verify true far-side occlusion in a world rotation and a nearby tilted view; selecting a border must not create UI or intercept an event click. Do not add country-name labels or hover cards.
- [ ] Add modern-boundary/class-policy copy to `Nguồn bản đồ`, including optional-unavailable status when relevant. Keep source links reachable by keyboard and existing text/marker contrast intact.
- [ ] Run new/retained public layout and contrast checks, `pnpm verify`, document remaining differences and provide the B2 comparison/report. Stop before the final acceptance phase; no new renderer or broader redesign.

## Phase 3 — Final regression, performance and handoff

**Checkpoint B3:** Verified country-boundary extension with fresh full gates, bounded costs and explicit remaining limitations.

- [ ] Run all four existing public homepage files plus `home-country-boundaries.spec.ts` on a fresh local production build. Include filter/card/detail return, legacy URL/reload/history, intro, seek/exit/stale-flight protection, no-JS/no-WebGL, optional border failure and four desktop sizes.
- [ ] In a separate measurement window without concurrent test/build/browser load, compare same-camera boundary-off/on draw calls and frame intervals, asset payload, geometry buffers, idle/hidden behavior and repeated disposal. Use the same 10-second flight and disclosed browser/backend/DPR/method; do not reuse P6's numbers as current results.
- [ ] Confirm added border gzip ≤150 KiB, total runtime geography ≤600 KiB, one extra draw call, segment/buffer target, median ≤33.3 ms and p95 ≤50 ms, zero continuing idle/hidden work and no additional live context. Report exact regressions or budget failures instead of hiding them in a different denominator.
- [ ] Check the full four-size visual matrix, three source-derived inland line samples, seam/far-side evidence, Vietnam prominence, keyboard/source access and optional-failure recovery. Do not claim close texture parity or a historical-border model.
- [ ] Run `pnpm verify`, `git diff --check`, review task-owned tracked/untracked changes and notices. Record completion only where fresh evidence exists. Write the final extension audit/local report and stop at B3. No PR/push/merge/deploy/publish.

## Verification commands and environment

After the new test files exist:

```powershell
pnpm exec vitest run tests/unit/explorer-country-boundaries.test.ts tests/unit/explorer-globe.test.ts tests/unit/explorer-cinematic-projection.test.ts
pnpm verify
pnpm exec playwright test tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts --workers=1
git diff --check
git status --short
```

Inspect `playwright.config.ts`: default production port is 3100. Confirm the build and process owner; use a separate task-owned port if occupied. Do not stop the owner's dev server. Public suites above are scoped read-only; full unfiltered `pnpm test:e2e` is conditional on an isolated authorized environment, since unrelated suites may exercise external writes or mobile scope.

Screenshots: `output/playwright/country-boundaries/phase-N/`. Local handoff report: `.task-reports/YYYY-MM-DD-HHmm-country-boundaries-phase-N.md`, including scope, changes, commands/results, screenshots, not-done items and risks. Never stage ignored outputs or reports. Continue 0 → 1 → 2 → 3 only through separate explicit phase tasks.
