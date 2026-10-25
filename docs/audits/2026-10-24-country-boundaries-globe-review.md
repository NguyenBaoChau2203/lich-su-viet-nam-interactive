# Review: cinematic homepage and missing country boundaries

Date: 2026-10-24, Asia/Bangkok. Scope: review the implemented cinematic homepage and plan a country-boundary extension. No runtime code, geographic production assets, dependencies or historical content were changed by this review.

The owner reports all previous prompts have run and the result is broadly satisfactory, with country boundaries still missing compared with the concept. This audit checks current code, fresh browser behavior and source data. It is a scoped main-agent review, not a security audit of the whole repository or a new certification of every P6 performance claim.

## What is implemented

- `components/explorer/EventMap.tsx` now delegates to `CinematicEventMap`; the real homepage uses one Three.js cinematic scene, not the former MapLibre homepage adapter.
- `scene.ts` constructs a textured Earth, directional atmosphere, procedural stars, a near-surface Vietnam cap and gold outline. It reuses a temporary `three-globe@2.45.6` builder for spherical cap geometry and disposes that builder.
- `HomeAtlasHeader`, initial guidance, event reader and thin time rail are present. The study/revision entry is secondary; public detail/study routes retain their shared header.
- Geographic marker projection, grouping and label collision handling are separated from renderer-specific map APIs. The adapter connects actual pointer/wheel/keyboard camera input and event/detail return.
- Intro, journey flights, source reading, pause/seek and navigation/cancellation protection are implemented in the current camera/controller/state files.
- Three locally hosted Earth images have provenance and separate image/code attribution. No production country-boundary asset exists in the audited scene/loading path.

Fresh visual evidence, captured from the new local production build:

- `output/playwright/country-borders-review/default-1440x900.png`.
- `output/playwright/country-borders-review/default-1280x720.png`.
- `output/playwright/country-borders-review/world-1440x900.png`.
- `output/playwright/country-borders-review/journey-paris-1440x900.png`.

Compared with `docs/design/references/cinematic-history-globe/target.png`, the large Earth, dark surface, atmospheric limb and atlas shell are established. Surface detail remains softer than the concept at close zoom, as already disclosed in P6; this is separate from the missing boundary layer and is not part of this extension.

## Findings, ordered by relevance

### F1 — Country boundaries are absent from the data/rendering path

Evidence: `CinematicGlobeCanvas.tsx` loads the Vietnam highlight and `/maps/history-world-land.geojson`. `CinematicSceneOptions` accepts `highlight` and optional `coastlines`; `scene.ts` renders the world geometry with `surfaceOutlineSegments` as low-opacity coastline strokes, then draws the Vietnam gold outline.

`history-world-land.provenance.json` explicitly describes physical land/coastline context with no added borders. That asset joins land across adjacent countries. Its outer/inner rings cannot reveal an inland international frontier. The missing lines are therefore not an opacity setting or a texture-loading fault.

Action: add a separate sourced land-boundary LineString/MultiLineString layer to the existing scene. Preserve current coastlines and the stronger Vietnam outline. No renderer migration or repetition of the previous seven phases is needed.

The prior P6 report already disclosed the absence of international lines. This is an explicitly requested extension of that scope, not evidence that its existing behavior tests failed to implement country borders.

### F2 — The existing polygon-outline helper cannot consume boundary-line GeoJSON

Evidence: `HighlightCollection` and `surfaceOutlineSegments` in `geography.ts` operate on Polygon/MultiPolygon rings. The proposed Natural Earth boundary asset contains LineString and MultiLineString features, including disconnected parts. Casting it to `HighlightCollection` would misinterpret coordinate nesting and can fail or join unrelated points.

Action: add a focused line-collection type/parser and spherical segment helper. Do not close open lines, connect disconnected parts or rebuild country polygon caps merely to obtain borders. Retain the existing `geoToVector(lat, lng)` convention; incoming GeoJSON is `[lng, lat]`.

### F3 — A useful 50m layer needs an explicit geography-budget amendment

Fresh local gzip calculation for the three current geography files: **454,423 B / 443.77 KiB**. The current test and previous spec use a **500 KiB** cap for those files.

The inspected 50m source, compacted to selected IDs/classes and four-decimal coordinates and filtered by the proposed policy, is **132,508 B / 129.40 KiB gzip**. Simply appending it would produce about **573.17 KiB**, above the old cap. A full unprocessed source would be still larger.

Action: the proposed extension sets a visible new target of **≤150 KiB added boundary payload and ≤600 KiB total geography**, with a test that includes all runtime geographic assets. This is a proposal, not a retroactive claim that the old 500 KiB gate covered the new layer. The 110m fallback is approximately 23.15 KiB and fits the old cap, with more generalized lines that need visual review near Vietnam.

### F4 — A decorative layer must not become a new fatal loading dependency

Evidence: the current canvas loader awaits core imports, highlight and coastline fetches before creating the scene, and a failed coastline request enters the general renderer error state. That is existing behavior, not a newly introduced failure. Copying that pattern for an additional optional country layer would make a missing border file disable otherwise usable Earth/event discovery.

Action: load the new boundary asset independently; attach it to the existing scene when ready. A missing/invalid/slow boundary file should retain the Earth, events, cards and journey. Keep core-asset retry behavior intact. Cancel/ignore late results after retry, context loss, route departure or unmount.

## Primary geographic source research

Read on 2026-10-24:

- [Natural Earth 50m Admin 0 boundary catalog](https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-0-boundary-lines-2/).
- [Natural Earth public-domain terms](https://www.naturalearthdata.com/about/terms-of-use/).
- [Natural Earth boundary classification/POV policy](https://www.naturalearthdata.com/about/disputed-boundaries-policy/).
- [Pinned 50m source](https://github.com/nvkelso/natural-earth-vector/blob/v5.1.2/geojson/ne_50m_admin_0_boundary_lines_land.geojson).
- [Pinned 110m alternative](https://github.com/nvkelso/natural-earth-vector/blob/v5.1.2/geojson/ne_110m_admin_0_boundary_lines_land.geojson).

The catalog identifies land lines as dataset version 5.1.0; the inspected repository snapshot is tag `v5.1.2`. Record both identifiers rather than asserting that every individual dataset has the repository tag's version. The GitHub connector failed with `Transport closed`; the same public pinned raw URLs were fetched successfully as a read-only fallback. Files were saved only under the ignored local review working directory, not imported into `public/`.

| Measured source | 50m | 110m |
| --- | ---: | ---: |
| Original UTF-8 bytes | 760,189 | 340,010 |
| Original gzip bytes, local Node default | 191,636 | 35,856 |
| Features / coordinate points | 390 / 19,859 | 331 / 3,108 |
| Ordinary features after proposed POV/class filter | 357 | 302 |
| Compact ordinary-only candidate bytes | 413,412 | 112,647 |
| Compact candidate gzip bytes | 132,508 | 23,710 |

Original SHA-256:

- 50m: `2faac4f6b34386f3d21b6e018cf151f241f00e5c936d44dd17d7d9bfb147fa48`.
- 110m: `d42479fd79552cca4eec7f85fcdca717a790d29ff06be7676f1af0568c6d3f7c`.

These are source/candidate measurements, not final served transfer, geometry allocation or FPS measurements. The future build must remeasure its exact artifact and HTTP payload.

## Classification and map interpretation

The real source properties are uppercase: `NE_ID`, `FEATURECLA`, `FCLASS_VN`, `MIN_ZOOM`. Do not read a nonexistent lowercase `featurecla` and treat missing classification as an ordinary boundary.

The proposed effective class is `FCLASS_VN ?? FEATURECLA`: an explicit Natural Earth Vietnam-view override, otherwise its default class. This is a source-defined visualization policy, not an independently approved legal or historical map. Keep both original and effective class in provenance/output.

In 50m, effective classes count: 357 `International boundary (verify)`, 16 `Disputed (please verify)`, 6 `Line of control (please verify)`, 5 `Indefinite (please verify)`, 3 `Unrecognized`, 2 `Indeterminant frontier`, and 1 `Admin-1 boundary`.

First extension scope: show only the source's ordinary international-land class as thin solid contextual lines. Omit the other classes and record their IDs/counts/reasons. Do not convert them into ordinary solid national borders. Dashed disputed/control lines need a separately reviewed addition if requested. Do not import maritime/claim-line supplements, province boundaries, roads or POI labels.

The original class name's word `verify` is not proof that the project has independently verified it. The layer is illustrative modern geography; time filtering does not reconstruct borders for 1911, 1945 or other selected years. Preserve existing Vietnam mainland/island coverage and its source limitations; do not derive new territorial claims from the generated reference.

## Review evidence and limits

- Fresh `pnpm verify`: exit 0; lint/typecheck pass, **853 Vitest tests / 67 files**, **8 agent-hook tests**, production build with 102 static pages. One static lesson page exceeded its first 60-second generation attempt and succeeded on retry; the build ultimately passed. This audit does not attribute that retry to renderer code.
- Fresh public desktop E2E: **53/53 passed in 4.9 minutes**, using `home-map.spec.ts`, `home-globe.spec.ts`, `home-cinematic-globe.spec.ts` and `home-cinematic-acceptance.spec.ts`, one worker, fresh local production target `http://127.0.0.1:3100`. Includes four desktop sizes, real input/selection/grouping/filter/card/detail/history, delayed navigation, journey/intro/cancellation, contrast and fallback checks. This is the selected public scope, not the full account/payment/staff/mobile suite.
- Browser research confirms the missing inland lines and the working shell on a current production build. No new boundary render or performance benchmark was executed because this task is planning only.
- Existing P6 texture/bundle/GPU measurements remain attributed to P6. Its report distinguishes the globe graph from the slightly larger whole-homepage JS and close-zoom softness; those figures were not independently re-benchmarked here.
- During the fresh public navigation tests the server again logged `The destination stream closed early`, digest `3840477093`, already recorded before this extension. All 53 assertions passed. The root cause was not established here; do not describe server logs as clean or silently attribute this pre-existing symptom to a future boundary layer.
- The old implementation plan still says plan-only/unchecked although newer code and phase audits exist. Read current code plus phase audits when continuing; do not infer that the old work must be rerun from its checklist status.
- CodeGraph was attempted first but did not index the new cinematic scene; focused direct reads supplied the current evidence. No reindex was performed.

## Proposed next work

Use the small extension in `docs/superpowers/specs/2026-10-24-country-boundaries-globe-design.md` and the four-phase plan `docs/superpowers/plans/2026-10-24-country-boundaries-globe-plan.md`. The recommended source/appearance/budget choices are proposals for the next implementation, not already-applied changes or owner-approved geographic sign-off.
