# Vietnam Province Reference Boundaries Completion Plan

> **Executor:** GPT-6.1 Sol, reasoning max. One main agent executes all phases serially with `superpowers:executing-plans` where available. No subagents, separate AI reviewers, automatic model calls or phase-specific prompts. This document and its single companion prompt form one work package. Status: proposed; application changes have not been made in the planning task.

**Goal:** Make real source-derived interior reference boundaries among Vietnam's 34 selected provincial-level units visible on the existing homepage globe, with reproducible data, honest provenance and production-data acceptance.

**Architecture:** Reuse the existing optional province renderer and its schema. Add a scoped source audit and an offline deterministic builder for shared interior linework, then validate and serve the real artifact. Keep the original full-polygon research gate intact and explicitly distinguish that unresolved product from this reference-line layer.

**Tech stack:** Existing Next.js/React/TypeScript/Three, Node built-ins, Vitest and Playwright; offline Python through `uv`, with Shapely 2.1.2 for geometry operations if needed. No new runtime dependency, basemap service or Earth texture.

**Spec:** `docs/superpowers/specs/2026-10-24-explorer-refinement-design.md`, amended only by the explicit scope decision below. Existing desktop scope and camera/path/performance contracts remain authoritative. Companion prompt: `docs/agent/prompts/2026-10-25-vietnam-province-boundaries-completion.md`.

## Confirmed request and current failure

The owner clarified on 2026-10-25 that the missing feature is **the administrative boundaries between 34 provinces/cities**, not journey connections. This is a modern reference layer, not historical-year border reconstruction, clickable province areas or official cadastral geometry.

Fresh checks on local build after commit `e0f273a56db0856e3b37a60a66b0be249b75441b`:

| Check | Observed result |
| --- | --- |
| Homepage | HTTP 200 |
| `/maps/history-vietnam-province-boundaries.geojson` | HTTP 404; file absent |
| `/maps/history-vietnam-province-boundaries.provenance.json` | HTTP 404; file absent |
| Production builder | `scripts/build-vietnam-province-boundaries.mjs` absent |
| Mounted renderer | Core `ready`, countries `ready`, provinces `unavailable` |
| Full research audit | Exit 2; 34/34 identities, 2,326/2,342 referenced ways, 16 missing ways, all in Khánh Hòa relation 1887959 |
| Independent membership audit | All 16 absent ways have one provincial owner in the selected source relations; none is shared by two provinces |
| Shared-way graph | 1,726 shared ways, **zero missing shared ways and zero missing shared nodes** |
| Existing exclusion policy | 32 shared ways excluded by maritime/disputed/national-membership criteria |
| Eligible graph before spatial review | **1,694 ways, 144,617 segments, 58 province pairs, all 34 units represented** |

The immediate failure is an absent production asset/builder. Making a color brighter cannot display a file returning 404. Earlier renderer tests use explicitly synthetic fixtures; their passing results did not establish that real province data exists.

The source gap is real, but previous work coupled the requested line layer to reconstruction of complete province polygons. The source graph already contains the mutual boundaries needed for a narrower derived layer, subject to the additional checks below. Counts alone do not prove geographic quality or authorize bypassing a source gate.

## Explicit scope amendment

**Proposed decision for this execution:** validate and distribute a layer of source-derived **shared interior reference lines**, using the selected 34-unit crosswalk. Do not require complete outer/inner polygon reconstruction to draw that narrower layer.

This expressly supersedes the old full-polygon prerequisite **only for this line layer**. It does not declare the original research snapshot complete. Preserve `scripts/validate-vietnam-province-source.mjs` and its existing failing regression: the pinned input still has missing ways and full province polygons remain `needs_evidence`.

Create a separate scoped audit whose success means `complete-for-shared-interior-lines`. Every missing source object must be classified from complete relation membership; any missing eligible/shared way or referenced node fails this new gate. Preserve the full audit's missing-way report in provenance. Do not merely remove its errors or set its `productionReady` flag to true.

Single-owner membership does **not** prove that a missing object is offshore or maritime. Make no such location claim. It proves only that it cannot be a mutual edge under the selected shared-way representation. Do not invent its coordinates, close its ring or alter national/island geometry. This implementation cannot be reused as a complete province-fill, point-in-province or legal-boundary dataset.

If the graph fails identity, ownership, spatial review, coverage, topology or source-version checks, obtain compatible complete source data for the affected scope and rerun the checks. Do not force the scoped result to pass.

## Global constraints

- One active agent; preserve unrelated tracked/untracked work. Use CodeGraph first when present; read specifically flagged/stale files directly. Do not reindex without an owner request.
- Create a short local `codex/` branch for execution if needed. Do not commit, stage, push, merge, create PRs, publish or deploy unless requested during execution. Do not modify Word, private environment files, credentials or external services.
- Keep event coordinates/content, four journeys, the 2000 ms post-arrival dwell, camera limits/URL state, finite paths, stable overlay observers and current country error handling.
- Preserve current national/island/world/country/curated-label files byte for byte. Use the national geometry as an immutable display-context mask, not a newly asserted legal authority.
- Keep `ProvinceBoundaryCollection` schemaVersion 1 and its existing runtime fields. Put source-scope/coverage decisions in companion provenance and source-review records; do not ship research fixtures as production data.
- No OSM tiles, global labels, roads, POIs, province cards, remote runtime geography queries, second scene/context or continuous animation loop. Province lines are passive geometry.
- Desktop CSS 1280×720, 1366×768, 1440×900, 1920×1080; keyboard, contrast, reduced motion, no-JS/no-WebGL fallback retained. Mobile/tablet work is deferred.
- Province gzip ≤200 KiB; total **runtime** geographic JSON/GeoJSON gzip ≤800 KiB. Both source and actual post-subdivision province segments ≤50,000. Combined added province/path draw calls ≤3 and buffers ≤6 MiB; retain existing image/bundle/frame/idle budgets.
- Use small read-only source requests and cached pinned input. Honor server errors/rate limits and TLS. Never loop indefinitely across endpoints or silently substitute `latest` data while keeping old hashes/date.

## Review focus

1. A missing single-owner way later gains a second owner: the new audit must fail rather than retain a permanent allowlist of 16 IDs.
2. Two differently labeled source objects encode the same edge, or a junction disappears during simplification: detect duplicate undirected edges, preserve junctions and reject new crossings/gaps.
3. A 34-unit name list plus a few lines is presented as coverage: compare all source-eligible pairs/units and explain every spatial exclusion; do not require exactly 34 line features.
4. Old tests expect the real production request to 404: replace that baseline expectation and retain an explicit injected-404 test.
5. A real artifact parses but is invisible, or only synthetic fixtures look correct: require unmocked HTTP 200, ready status and same-camera rendered-pixel differences, including local zoom and journeys.

## Files and responsibilities

| File | Responsibility |
| --- | --- |
| New `scripts/audit-vietnam-province-interior-source.mjs` | Pure scoped source audit plus offline CLI; never writes geometry |
| New `scripts/province-boundaries/build_interior.py` | Shared graph chains, source-aware clipping, bounded simplification and deterministic candidate output |
| New `scripts/province-boundaries/test_build_interior.py` | Synthetic topology/clipping/simplification/determinism tests |
| New `scripts/build-vietnam-province-boundaries.mjs` | Small CLI entry point and output/path/source guards; invokes the offline builder |
| New `docs/audits/sources/2026-10-25-province-interior-source-review.json` | Reviewed scope, source hashes, eligibility/exclusions/coverage and full-polygon limitation |
| New `public/maps/history-vietnam-province-boundaries.geojson` | Actual runtime line artifact in the existing schema |
| New `public/maps/history-vietnam-province-boundaries.provenance.json` | Scope, transformations, license, artifact/source hashes, real budgets and uncertainty |
| Existing `lib/explorer/cinematic/province-boundaries.ts` | Reuse parser/segment generation; add only the metadata type needed by the UI |
| Existing `CinematicGlobeCanvas.tsx`, `CinematicEventMap.tsx`, `scene.ts` | Optional loading, source metadata/credit and visibility tuning only where demonstrated necessary |
| New `tests/unit/explorer-province-interior-source.test.ts` | Positive/negative source-scope behavior |
| New `tests/unit/explorer-province-production-artifact.test.ts` | Real production file existence, provenance, schema, graph coverage, hashes and budgets |
| Existing `tests/e2e/home-province-boundaries.spec.ts`, `refinement-evidence.ts` | Unmocked real-data acceptance and retained injected failure/fixture tests |
| Existing design/progress/source ledger documents | Record this explicit scope amendment and current result without rewriting previous evidence |

Do not add a general layer framework or refactor unrelated render/state modules.

## Phase 0 — Reproduce and freeze the acceptance boundary

- [ ] Record branch/status; hash existing national/island/world/country/label assets and journey data. Preserve the owner's local server and browser; manage only task-owned processes.
- [ ] Recheck the missing asset/provenance and mounted `unavailable` status. Add the red unmocked production test now; GET must eventually return 200 and the layer must be `ready` without `page.route` supplying geometry.
- [ ] Reproduce the full research failure and independent interior inventory. Do not infer physical location from owner counts.
- [ ] Update the current design's source-gate subsection with the explicit line-only amendment above before implementation. Keep the previous dated acceptance findings intact.

**Gate:** a real failing acceptance case, pinned input/hash inventory and explicit source-scope decision exist. No fake public artifact has been created.

## Phase 1 — Prove source completeness for the requested line layer

**Inputs:** local research gzip `.task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz`; crosswalk `docs/audits/sources/2026-10-24-vietnam-province-membership.json`; existing source evidence/ledger. The research JSON SHA-256 is `587a00e6aedc42f461c100fcaa33c4ac80f78dd5c00afddc1f7d748e9e3fef3c`; its gzip SHA-256 is `5504fab937f8f991a4926334e441da1f9f1b6a9219ec303eff82dd44f41c76d0`. PBF source hash is `c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90`, timestamp `2026-10-23T20:20:51Z`. Verify actual bytes instead of trusting this paragraph.

**Interface:** export the pure `auditProvinceInteriorSource(input, membership)` from the new `.mjs` audit. Return JSON containing `scope: "shared-interior-lines"`, `status: "pass" | "fail"`, `fullPolygonStatus: "needs_evidence"`, source timestamp, identity/ownership/pair/segment counts, eligible way IDs, classified exclusions and issues. The CLI must verify raw decompressed and compressed input bytes against their pins **before** invoking the pure auditor, and append those verified hashes to its report; never compute the raw-file hash by reserializing a parsed object. CLI: `--input`, `--membership`, `--report`; exit 0 for this scope only, exit 2 on failure. No public output.

- [ ] Write red tests: a missing shared way/node; missing or duplicated unit; unrecognized role; non-manifold owner count; reversed duplicate edge; stale/mismatched source manifest; an absent single-owner object that must remain reported without becoming eligible.
- [ ] Derive owners from all 34 relation memberships **before** looking up available ways. Validate official IDs/codes, version metadata, source license, finite coordinates and every referenced eligible node.
- [ ] Apply the existing maritime/disputed/national-member exclusions, with reason codes and source IDs. Independently inspect untagged coastal/water extensions; shared ownership alone is not a land-context certificate.
- [ ] Require the pinned baseline to explain 1,726 shared ways, 32 policy exclusions, 1,694 candidates, 58 source pairs and 34 represented units before clipping. These numbers diagnose this snapshot; do not hardcode them as universal validity rules for future snapshots.
- [ ] Write the scoped source-review JSON and a traceable exclusion list. Keep the full-source validator's 16 missing-way failure unchanged. If cached input is absent, use the existing extraction recipe/pinned publisher file and checksum; if unavailable, report the exact retrieval blocker rather than accepting a differently dated source without review.

**Gate:** no missing eligible way/node, no identity/ownership/edge issue, and complete classified membership for this scope. Passing this gate does not prove complete province polygons or surveyed accuracy.

## Phase 2 — Build truthful, bounded and repeatable linework

**CLI contract:** `node scripts/build-vietnam-province-boundaries.mjs --input <research.json.gz> --membership <crosswalk.json> --mask <national.geojson> --source-review <review.json> --output-dir <candidate-directory>`. Candidate output initially stays under ignored task storage; do not overwrite source files or write approved public output before the gates below pass.

- [ ] Write Python red tests for a shared edge appearing once, a triple junction, a closed shared loop, disconnected parts, clipping/holes, a reversed duplicate, unsafe output paths and reordered-input determinism.
- [ ] Build one undirected node/edge graph. Create maximal nonbranching chains for each sorted province pair, freezing endpoints, cross-pair junctions and policy transitions. Do not simplify each province independently or infer missing connections.
- [ ] Restrict display geometry to the existing immutable national land/island context. Record every clip/exclusion and its source IDs. This is display masking, not a new administrative claim. Preserve legitimate source interior boundaries along rivers; do not classify all water contact as maritime. Unexpected inland dangling chains or an unexplained loss of an entire source pair fail review.
- [ ] Simplify each canonical shared chain once, preserving its frozen vertices and closed-loop validity. Use explicit projected units, not a tolerance described as metres while operating on longitude/latitude degrees. Try the smallest passing tolerance from 0, 5, 10, 20, 40 and 80 projected metres; do not exceed 80. Record actual projection and measured displacement from source; do not claim survey accuracy.
- [ ] Require no new crossings, duplicate segments or lost junctions; source-to-display screen deviation must be ≤3 CSS px at useful local zoom 11 for inspected near-side chains. Treat clip endpoints separately and document their origin. If a tolerance fails topology, retry smaller locally; do not delete a valid boundary to meet the budget.
- [ ] Produce existing schemaVersion-1 runtime fields: source timestamp, raw research-snapshot hash, 34 official unit records with relation ID/revision, ODbL license/credit and LineString features with sorted distinct code pairs and traceable sourceEdgeIds. Keep feature IDs/order/orientation stable; use deterministic float precision, JSON ordering and gzip mtime 0.
- [ ] Build twice from the same inputs into separate candidate directories; compare artifact/provenance hashes. Provenance contains source and transformation versions/parameters, scoped source result, all exclusions, pre/post coverage, gzip/segment figures and `fullPolygonStatus: "needs_evidence"`; it must not contain changing wall-clock build times that defeat determinism.

**Gate:** no unexplained pair/unit loss, no fabricated geometry, bounded source-relative deviation, deterministic bytes and candidate size within budget. Full polygon reconstruction remains out of scope.

## Phase 3 — Validate and promote a real production artifact

- [ ] Add the real artifact test. Use the actual `parseProvinceBoundaries` and `provinceBoundarySegments(data, PROVINCE_ALTITUDE, 0.25)`; count the resulting buffer, not just source vertices.
- [ ] Assert both files exist, hashes/provenance match, 34 identities are correct, nonempty real features have only reviewed source IDs/pairs, duplicates are rejected, every required unit/pair is represented or has an explicit accepted mask exclusion, and TEST-ONLY/example.invalid fixtures cannot pass the production-source gate.
- [ ] Validate candidate artifacts with a test-only `PROVINCE_ARTIFACT_DIR` override pointing to the ignored candidate directory. Never use that override to hide absent production files. Clear it before testing public output and before the full gate.
- [ ] Require province ≤200 KiB gzip, all runtime geography ≤800 KiB gzip, raw and actual subdivided province segments ≤50,000. Include all shipped geometry that the page fetches; do not move a runtime fetch to an uncounted path. Report raw and gzip sizes separately.
- [ ] After candidate validation succeeds, copy only reviewed GeoJSON/provenance into the expected `public/maps` paths, then rerun the same test against those actual public files with no override.
- [ ] Retain source/license access: credit `© OpenStreetMap contributors`, ODbL URL, original publisher/snapshot, source IDs and reproducible transformation recipe; make the actual derived GeoJSON/provenance available through their real local URLs. Do not invent an accessible archive or download link.

**Gate:** the real production files pass the production test; no raw PBF/research cache is copied into the browser bundle or mistaken for runtime output.

## Phase 4 — Integrate visible lines and accurate source copy

- [ ] Reuse current optional loading/disposal/abort/retry and budget rejection. Keep `setProvinceBoundaries` and the existing adaptive `surfaceLayerRadii` ordering: above Vietnam fill, below the gold national outline, occluded on the far side, passive to clicks.
- [ ] Use actual-source screenshots before adjusting style. If necessary, tune only province stroke brightness/width so it is distinguishable at Vietnam overview and zoom 8/10/11 while the national outline remains dominant. Do not change global Earth/country lighting or event positions.
- [ ] Add a narrow metadata callback if required for source copy: `ProvinceBoundarySource = Pick<ProvinceBoundaryCollection, "sourceTimestamp" | "license">`; optional `onProvinceSourceChange(source: ProvinceBoundarySource | null)` from the canvas. Emit only for valid, successfully attached data; clear on retry/failure. The parent owns display metadata without another fetch/store/timer. Do not pass a second callback argument directly to a React state setter.
- [ ] Keep exact UI disclosure: `Ranh giới 34 tỉnh/thành hiện nay là lớp tham chiếu địa lý; không mô tả địa giới tại thời điểm sự kiện.` Show the represented source date in UTC, credit, and a real provenance link; do not hardcode today's date or present this as a legal/survey boundary map.
- [ ] Correct source labels if needed: link Resolution 202 to its Government page and Decision 19 to its actual PDF separately; do not label the Decision PDF as both documents.

**Gate:** unmocked local requests return 200, province status is `ready`, actual source metadata is displayed, lines are visible and all map/journey interactions remain usable.

## Phase 5 — Production acceptance and final handoff

- [ ] Replace the old natural-404 production expectation in `home-province-boundaries.spec.ts` with unmocked real-data acceptance. Keep the 404 behavior as a separate explicit route injection; keep malformed/aborted/late/over-budget/context retry and clearly labeled synthetic tests.
- [ ] Prove real province pixels by same-camera canvas comparison before/after clearing **only** the province layer, with country/highlight/path unchanged. Include overview and near-side views in northern, central and southern Vietnam; choose viewpoints from reviewed source chains rather than invented historical anchors. Include Khánh Hòa's available shared interior borders.
- [ ] Test desktop 1280×720, 1366×768, 1440×900, 1920×1080, plus zoom 8/10/11, far-side occlusion, one selected event and a selected journey with its path simultaneously. A fetch, line count or synthetic screenshot alone is insufficient.
- [ ] Verify keyboard/focus, reduced motion, no-JS/no-WebGL, optional data errors and retry. Preserve useful cluster zoom, all four journeys, 2000 ms arrival dwell, URL/history restoration, country failure handling and stable observers.
- [ ] Measure actual buffers/draw calls and one disclosed 10-second camera run without concurrent build/tests. Preserve existing median ≤33.3 ms / p95 ≤50 ms and no continuing idle/hidden draw requests. Record device/renderer limits instead of reusing prior benchmarks.
- [ ] Run scoped pipeline tests, production artifact tests, the full `pnpm verify`, then the eleven-file public homepage regression command below against a fresh owned target. Classify expected injected failures separately; the real province URL must no longer appear as an expected 404.
- [ ] Update the existing design/progress/ledger with the precise completed **line-layer** scope and remaining full-polygon limitation. Create the required ignored local report, inspect task-owned diff/status and protected hashes, and leave a verified local homepage available for owner testing. Stop after this complete slice; no extra prompt is required.

## Verification commands

Create the new files before running their commands. Use actual cached tool availability; the shell's `python` shortcut was unavailable earlier, so prefer `uv run` rather than asking the owner to install a new application dependency.

```powershell
node scripts/audit-vietnam-province-interior-source.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --membership docs/audits/sources/2026-10-24-vietnam-province-membership.json --report .task-reports/province-boundaries-completion-work/source-audit.json
uv run --offline --with shapely==2.1.2 python -m unittest discover -s scripts/province-boundaries -p "test_*.py"
pnpm exec vitest run tests/unit/explorer-province-interior-source.test.ts tests/unit/explorer-province-production-artifact.test.ts tests/unit/explorer-province-boundaries.test.ts
pnpm verify
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts tests/e2e/home-journey-path.spec.ts tests/e2e/home-province-boundaries.spec.ts tests/e2e/home-journey-content.spec.ts tests/e2e/home-final-review.spec.ts --workers=1
git diff --check
git status --short
```

The original full-source command must still report the known 16 missing ways/exit 2 for the unchanged pinned research input. That is an intentionally preserved negative control, not a failed new line-layer acceptance. Unit tests running in a clean checkout must validate committed production data without requiring a large ignored PBF or network access. Pipeline reproduction separately requires the pinned input and offline tool cache.

Use `E2E_BASE_URL` for the actual fresh task-owned server; localhost:3000 may already belong to the owner's running test session. Do not stop it without verifying task ownership. Do not run unrelated account/admin/staff/payment mutation suites or deferred mobile/tablet tests. Never claim the full project E2E suite passed when only the listed public files ran.

## Completion and stop conditions

Success requires real public GeoJSON/provenance, scoped source validation, deterministic bounded output, real rendered province lines and fresh regression evidence together. If any required scope/source/topology/budget/visibility gate fails, finish independent investigation and report the exact failing evidence; do not mark the layer complete, relax the validator or silently return to synthetic fixtures.

The final Vietnamese handoff must name changed files, source-scope decision, exact commands/results, absolute screenshots, actual costs, remaining full-polygon uncertainty, local URL and `.task-reports/YYYY-MM-DD-HHmm-province-boundaries-completion.md`. No invented reviewer, approval identity, historical coordinate, asset rights or completion claim.

## Primary technical references checked on 2026-10-25

- [Geofabrik extract details](https://download.geofabrik.de/technical.html): regional extracts and clip polygons explain why a downloaded file's integrity is distinct from relation completeness. This does not prove the exact cause of each missing local way.
- [Osmium extract reference](https://docs.osmcode.org/osmium/latest/osmium-extract.html): relation-completeness options vary by strategy/type; a successful extract is not a certificate for all boundary relations.
- [Overpass QL](https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL): dated queries and role-specific member recursion are an alternative for compatible source recovery if needed; do not use undated replacements under the old timestamp.
- [Shapely 2.1.2 simplify](https://shapely.readthedocs.io/en/2.1.2/reference/shapely.simplify.html): geometric simplification tolerance/topology controls do not replace the plan's shared-junction and global graph tests.
- [OpenStreetMap data attribution/license](https://www.openstreetmap.org/copyright): retain ODbL attribution and data-license information for the derived line dataset.
