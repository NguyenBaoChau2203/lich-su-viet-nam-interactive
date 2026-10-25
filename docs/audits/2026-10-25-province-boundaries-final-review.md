# Final review of the Vietnam province reference layer

Date: 2026-10-25, Asia/Bangkok. Review base: `e0f273a56db0856e3b37a60a66b0be249b75441b`. Branch: `codex/province-boundaries-final-review`.

The owner requested a final review, necessary optimization, a local commit and a local browser handoff after implementing the [completion plan](../superpowers/plans/2026-10-25-vietnam-province-boundaries-completion-plan.md). One main agent performed this review and verification directly; no separate AI reviewer or independent human/source authority is claimed.

## Review result

Source, builder, production artifact, optional loading, render ordering, attribution and desktop tests have been inspected. No additional runtime correction is currently justified by the inspected code and fresh checks. Keep the existing measured simplification, single batched province layer and stable observer lifecycle. Do not introduce a speculative visual rewrite or a new rendering dependency.

**Handoff gate passed.** Fresh full verification, offline reproduction, real-data measurement and all 162 selected public desktop browser cases passed. No additional application runtime code was changed in this final review; this audit records why the existing implementation and optimization were retained.

## Confirmed feature and scope

- The two real public province files exist and return HTTP 200 with hashes identical to the checked disk files. Core, country and province layers reach ready on the fresh production build.
- The artifact is a community-source modern shared-interior reference-line layer for 34 units. It is not complete province polygons, point-in-province classification, legal/survey geography or a reconstruction of borders at an event's date.
- The new source audit derives ownership before looking up available ways. It passes with 1,726 shared ways, no missing shared way/node, 32 policy exclusions, 1,694 eligible ways, 58 pairs and all 34 units represented.
- The original full-source validator still exits 2 with 16 missing single-owner ways and `productionReady=false`. Its failure is retained as an intentional negative control; no missing coordinates or physical locations were inferred.
- Spatial exclusions and source channel handling remain explicit in the source review and provenance. The final artifact has 62 line features and represents 1,692 ways after display masking. All 58 pairs and 34 units remain represented.
- Province lines are drawn in one batch after the Vietnam fill, below the national outline, with globe depth occlusion and no marker hit testing. Optional-layer failure does not make the core globe unavailable. Source metadata clears on error/retry/context loss and late results cannot overwrite a new attempt.
- The modern-reference disclosure, actual UTC source timestamp, OSM credit, ODbL URL, downloadable derivative and provenance are retained. Government document links are separated correctly.

## Fresh reproducibility and budget evidence

Two new offline builds, each preceded by the pinned-byte source gate, reproduced the current public GeoJSON and provenance exactly. The Python gzip stream also reproduced exactly. No source or runtime asset was replaced during this review.

| Item | Fresh result | Gate |
| --- | ---: | ---: |
| Runtime province GeoJSON | 503,329 bytes | Report raw separately |
| Runtime Node gzip, level 6 | 170,874 bytes | 204,800 bytes |
| Deterministic Python gzip, level 6 | 173,550 bytes | 204,800 bytes |
| Default runtime geography gzip | 757,805 bytes | 819,200 bytes |
| Raw / actual spherical province segments | 18,489 / 18,489 | 50,000 / 50,000 |
| Source-relative projected simplification | 40 m tolerance | At most 80 m |
| Five inspected near-side z11 source samples | Maximum 1.087919 CSS px | At most 3 CSS px |
| Province GPU increment | 1 draw / 443,932 buffer bytes | Included in combined gate |
| Province + measured authored paths | 2 draws / at most 456,288 buffer bytes | 3 draws / 6 MiB |

Checked artifact SHA-256: `01ae6a329e978323f85621aa656558bb0b1e2acbc71845e8040856afda9436cd`. Checked provenance SHA-256: `8d30ec1b2b845b31356669aed12f01d032256af88a9e0ff5be6047e1278eadfb`.

Source-relative deviation describes the transformation from the pinned OSM input, not geographic survey accuracy. Five z11 composited samples have p95 stroke-core contrast 3.296–6.245:1. This does not claim the same contrast for every antialiased pixel.

## Fresh performance measurement

The isolated driver uses real production geometry and actual mounted scene/GPU buffer counters; no province route mocking or production debug API is added. It ran after the builds and before browser regression, without concurrent agent build/tests.

- Fresh build: `0QNRSftFnY8EHs2FTSx-U`, served at `http://127.0.0.1:3000`.
- Windows, Intel Core i5-11400H, Intel UHD ANGLE Direct3D11, Edge 156.0.4314.42, CSS 1440×900, DPR 1.
- Ten-second camera flight: 1,163 recorded frame intervals, median 8.3 ms, p95 8.5 ms, p95 CPU submission 0.6 ms.
- Settled and hidden measurement windows: zero additional draws. After explicit scene disposal, tracked GPU buffers and bytes are zero.
- The hidden check exercises the native visibility handler at a simulated DOM boundary. Frame timing is rAF/CPU submission, not GPU-fence timing or a guarantee for other hardware.
- The measurement page recorded zero unhandled page errors.

## Fresh verification

```powershell
node scripts/audit-vietnam-province-interior-source.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --membership docs/audits/sources/2026-10-24-vietnam-province-membership.json --report .task-reports/province-final-review-work/source-audit.json
uv run --offline --with shapely==2.1.2 python -m unittest discover -s scripts/province-boundaries -p "test_*.py"
pnpm exec vitest run tests/unit/explorer-province-interior-source.test.ts tests/unit/explorer-province-production-artifact.test.ts tests/unit/explorer-province-boundaries.test.ts
pnpm verify
```

Results: scoped source exit 0; Python 13/13; focused unit 54/54. `pnpm verify` exit 0: history checks 42/42, lint, strict TypeScript, 1,000 unit tests / 78 files, eight hook/setup tests and a production build generating 102 pages. The 42 history tests also run in the full unit gate and are not an additional unique-test count.

The eleven-file public homepage regression passed **162/162 in 778.499 seconds**, with zero skipped, flaky or unexpected cases, against the fresh port-3000 production target with one worker and per-case diagnostics. It includes the four desktop sizes, real source pixels, selected events, four journeys and paths, 2,000 ms arrival dwell, URL/history restoration, keyboard/focus, reduced motion, no-JS/no-WebGL and injected optional-layer failures. Account/admin/staff/payment mutation suites and mobile/tablet are outside this review.

```powershell
$env:E2E_BASE_URL='http://127.0.0.1:3000'
$env:REFINEMENT_DIAGNOSTICS_DIR='output/playwright/province-final-review/diagnostics'
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts tests/e2e/home-journey-path.spec.ts tests/e2e/home-province-boundaries.spec.ts tests/e2e/home-journey-content.spec.ts tests/e2e/home-final-review.spec.ts --workers=1
git diff --check
```

All 162 diagnostic records passed and contain zero unhandled page errors. Four HTTP errors are explicit country/province failure injections identified by their test titles; there is no accepted natural province failure. The 437 failed requests comprise 399 local abort/navigation/prefetch events, five injected failures and 33 existing external detail-route OSM tile failures. Console diagnostics contain 43 errors and five warnings; no globally clean-console claim is made. The local server recorded seven stream-close messages with digest `3840477093`. The prior review also recorded this symptom. Its root cause remains unresolved; no framework workaround or log suppression is included in this province-layer review.

## Preservation and remaining limits

The 18 protected map/texture/journey hashes match review entry. No event/journey content, national/island/country geometry, framework dependency, database, Word document, private environment file or external service was changed by this review. The ignored raw PBF/research input is used only for offline reproduction and is not shipped.

The existing full-polygon uncertainty, official/OSM name-prefix discrepancies and exact textbook-printing/page gap remain recorded in the source ledger. Existing detail-route external OSM tile failures and stream-close symptoms are classified above; they are not silently attributed to province geometry or suppressed. The owner-authorized local commit covers the 25 implementation/plan/prompt files and this review audit; protected academic and ignored local artifacts remain outside it.

Local evidence: `output/playwright/province-final-review/`, `.task-reports/province-final-review-work/` and `.task-reports/2026-10-25-0845-province-final-review.md`. These are ignored local artifacts, not commit inputs. Only the task's code, checked public data, tests, source record and project documentation are intended for the owner-authorized local commit. No push, merge, PR, deploy or publication is authorized.
