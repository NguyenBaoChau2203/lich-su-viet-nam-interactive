# Task 05 — Vietnam province source and topology ledger

Date: 2026-10-24, Asia/Bangkok. Status: **BLOCKED — Task 05 remains outstanding; no province artifact is cleared.** Scope is the modern 34-unit reference selected by the owner. Task 06 rendering is excluded.

**Later authorized follow-up, 2026-10-25:** the owner approved a separate shared-interior reference-line scope. Its real artifact and independent source/production gates are recorded in the dated follow-up below and in the [source review](sources/2026-10-25-province-interior-source-review.json). The original Task 05 record above/below remains evidence about **full polygon completeness**, which is still `needs_evidence`; it no longer blocks this expressly narrower line product. Final browser acceptance for the follow-up is recorded separately below.

## Execution plan and source gate

1. Recheck Resolution 202/2025/QH15 on the Government portal and visually transcribe the two-page province-code appendix of Decision 19/2025/QD-TTg. The administrative list does not license GIS geometry.
2. Obtain a timestamped OSM snapshot, match all 34 government identities to relation IDs, and verify all referenced boundary ways/nodes. Reject missing or ambiguous membership, unknown geometry roles, nonfinite coordinates, invalid rings/holes, or unexplained parts.
3. Build interior lines from shared source way/node identities exactly once. Exclude single-owner coast/national edges, maritime/disputed lines and national-outline duplication. Preserve every existing national/island asset byte for byte.
4. Pin source/checksums, keep ODbL notices and reproducible source extraction, and produce a deterministic offline builder plus a separate province parser. Freeze its schema and future loading behavior in the progress audit; do not integrate the renderer.
5. Verify meaningful membership/topology/invalid-input/determinism tests, build twice and compare hashes, measure gzip and segment budgets, inspect a rendered source preview, then run the focused test, history checks, full verify, diff/status and write the local report.

If the source/currentness/topology/rights gate does not pass, record the exact failing evidence and keep Tasks 05/06 outstanding. Never substitute cached/old polygons, centers, guessed outlines or a code repository's license for GIS rights.

## Investigation decisions

- CodeGraph was attempted first but did not locate current cinematic geography symbols. Focused direct reads followed without reindexing.
- Branch: `codex/refinement-task-05`; preceding dirty work is preserved. One agent performs implementation and self-review; no independent review is claimed.
- OSM metadata retrieval succeeded for 34 administrative relations at database timestamp `2026-10-24T09:54:11Z`. Geometry queries returned HTTP 406/502, rate limits, connection or certificate errors. No TLS verification was disabled and no source-service refresh/generation was requested.
- The alternate polygons.openstreetmap.fr cache is not accepted: its unsimplified Đồng Tháp export is dated `2026-07-05 01:52:51.046332`, whereas the retrieved relation revision is dated `2026-10-16T03:44:25Z`. The export contains no verifiable relation revision or shared-way identities.
- Geofabrik's dated `vietnam-261023.osm.pbf` was downloaded successfully through the matching `vietnam-latest.osm.pbf` URL. The PBF header confirms `2026-10-23T20:20:51Z`, 331,456,690 bytes. The downloaded MD5 matches the dated publisher checksum `bdf516510a27fab5223bee468f79c79a`. SHA-256: `c2d0d493638ba152370c89252f9b9a5f0844e7936505f3ab617fadd7023a5c90`. **The file is incomplete for the required province relations; integrity of the download does not clear geometry coverage.**
- Offline-only tools: pyosmium 4.3.2 reads the PBF's native relation/way/node identities; Shapely 2.1.2 validates reconstructed polygon parts/holes and line topology. They are installed in the local `uv` tool cache, with no application dependency or lockfile change. A future builder must run without network access from its pinned source input.

## Authoritative references

- National Assembly / Government portal: [Resolution 202/2025/QH15](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-202-2025-qh15-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-119250612174148722.htm), adopted 2025-06-12; read 2026-10-24. Supports the 34-unit reorganization, not GIS rights or survey precision.
- Prime Minister / Government portal: [Decision 19/2025/QD-TTg signed PDF](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/7/19ttg.signed.pdf), 2025-06-30, effective 2025-07-01; read 2026-10-24. Appendix I, PDF pages 4–5, supports official two-digit codes and names. Pages rendered locally and visually inspected; PDF text extraction alone is insufficient for this scanned table.
- [OpenStreetMap copyright and license](https://www.openstreetmap.org/copyright), [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/) and [Geofabrik download service](https://download.geofabrik.de/), read 2026-10-24. OSM data is ODbL, with attribution and share-alike/source-access obligations for a distributed derivative database. These terms do not establish geometry completeness or legal boundary authority.

## Source decision and claim status

| Claim / candidate | Publisher, represented date and evidence | Status / decision |
| --- | --- | --- |
| 34-unit administrative framework | National Assembly, Resolution 202/2025/QH15, adopted 2025-06-12; Government portal rechecked on 2026-10-24 | `verified` for the framework. Does not grant GIS rights or establish polygon precision. |
| Official two-digit code/name table | Prime Minister / Government portal, Decision 19/2025/QD-TTg, effective 2025-07-01; Appendix I, PDF pages 4–5, visually checked | `verified` transcription. Signed PDF SHA-256 `2fd391335947affbfb86fa2b9438f0fdca90694e80887e205266542c3236aea1`, 2,631,808 bytes. |
| OSM relation identity crosswalk | 34 relations from Overpass, database time 2026-10-24T09:54:11Z; raw response SHA-256 `6f872236aba6463acfcfb04a026e9c0087aabb3de677a335b2d7bfa42c29e467` | All 34 official identities match relation IDs and ISO tags. These ISO tags are not government numeric codes. The explicit mapping is retained separately. |
| OSM country extract | OpenStreetMap contributors / Geofabrik GmbH; represented 2026-10-23T20:20:51Z; dated URL and hashes above | Download integrity, timestamp and published ODbL rights checked. All 34 relation revisions match the next-day metadata response, but 16 referenced ways are absent. `needs_evidence` for complete geometry. |
| Position/border authority | Community OSM geometry | `approximate` geographic reference, not an official legal or survey boundary; not historical-year borders. Complete topology, coastal placement and claim exclusions remain a data gate. |
| Province/city prefixes | OSM labels Quảng Ninh, Bắc Ninh and Đồng Nai as cities; the inspected 2025 official table labels them provinces | Unresolved classification difference. Preserve both labels in the ledger; do not silently treat OSM tags as an official change or rename the government identity. This does not change the matched 34 names. |
| thanglequoc GIS directory | [GIS README](https://github.com/thanglequoc/vietnamese-provinces-database/blob/master/dataset-generation-scripts/resources/gis/geojson_11Mar2026/README.md), fetched date 2026-03-13; rechecked 2026-10-24 | README still refers data rights/restrictions to Bando. Repository MIT does not clear the GIS. Not ingested. |
| Open Admin Data | [Vietnam hierarchy](https://github.com/open-admin-data/vietnam-administrative-divisions), README updated 2026-09-08; rechecked 2026-10-24 | CC BY 4.0 hierarchy with `geo.lat`/`geo.lon`, not polygon geometry. Not promoted to outlines. |
| geoBoundaries | [gbOpen VNM ADM1 endpoint](https://www.geoboundaries.org/api/current/gbOpen/VNM/ADM1/), boundary ID `VNM-ADM1-63759600`; rechecked 2026-10-24 | Endpoint still reports year 2008 and 64 units. Rejected for the requested current 34-unit layer. |
| polygons.openstreetmap.fr cache | [Đồng Tháp cache listing](https://polygons.openstreetmap.fr/index.py?id=1875866), accessed 2026-10-24 | Original export dated 2026-07-05; relation revision is 2026-10-16. No matching source revision/shared-way proof. Not ingested. No remote refresh or generation requested. |

All URLs were accessed on 2026-10-24. The machine-readable [34-unit crosswalk](sources/2026-10-24-vietnam-province-membership.json) records every official code/name, OSM ISO tag, relation ID, version and revision timestamp. The [evidence manifest](sources/2026-10-24-vietnam-province-source-evidence.json) records exact diagnostic results, source/code hashes, budget inventory and preview hashes. They document research, not approval of a runtime dataset.

## Exact geometry blocker

The pinned PBF includes **34/34 relation identities**, **2,326 of 2,342 referenced boundary ways**, and **218,035/218,035 nodes referenced by the available ways**. Every absent way belongs to **Khánh Hòa, government code `56`, OSM relation `1887959`**:

- Outer: `1120240923`, `1120240925`, `1120240927`, `1120240928`, `1120240930`, `1120240932`, `1120240934`, `1120240941`, `1120240942`, `1120240947`, `1120240954`, `1120240955`, `1199677144`, `1319181446`, `1368675506`.
- Inner: **`1120240931`**.

The offline validator reports precisely these **16 `MISSING_WAY` failures**, with relation ID and ring role, and exits **2**. A dedicated supplement query for these exact IDs timed out. Other geometry requests returned 406/502, 429, connection timeout/refusal or an expired certificate; no security settings were bypassed. This is evidence that this country's extract cannot prove full relation coverage, not a claim that the missing objects do not exist in OSM or that no other source can ever work.

Shapely 2.1.2 reconstructs and validates all outer parts for the **other 33 units** with positive area. Khánh Hòa is explicitly **not checked**, because reconstructing a polygon after dropping its missing outer/inner parts would conceal the failure. Coordinate checks on every available node pass. Source endpoint incidence and ownership checks find no other structural error in this snapshot; these checks alone do not prove a complete coverage or cross-feature spatial validity.

Available topology has 1,726 shared ways; 32 are excluded from candidate metrics by maritime/disputed tags or the source national relation. The remaining available candidates have **144,617 raw segments**. This exceeds 50,000 before simplification. No simplification, inferred part, repaired ring, clipped claim, stitched fallback or production line artifact was created. Untagged coastal/water segments still need source-aware spatial review, so tag filtering alone is not accepted as a land-only proof.

## Reproduction and deterministic research evidence

The tracked extractor pins the PBF byte count, SHA-256 and header timestamp. It reads only selected boundary relations, direct boundary ways and their nodes; it makes no network requests and rejects output under `public/`. The input PBF contains unrelated OSM content, but that content is not copied into the research snapshot or application.

```powershell
uv run --with osmium==4.3.2 python scripts/extract-vietnam-province-research.py --input .task-reports/explorer-refinement-task-05-work/vietnam-2026-10-23.osm.pbf --output .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz
uv run --with osmium==4.3.2 python scripts/extract-vietnam-province-research.py --input .task-reports/explorer-refinement-task-05-work/vietnam-2026-10-23.osm.pbf --output .task-reports/explorer-refinement-task-05-work/province-source.run-2.json.gz
node scripts/validate-vietnam-province-source.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --report .task-reports/explorer-refinement-task-05-work/source-validation.json
```

The third command is **expected to fail with exit 2** for this pinned, incomplete source. No production output is written. Tool setup may require a package download on a new machine; extraction and auditing themselves are offline once tools/input are available. The dated Geofabrik URL may eventually expire, so the locally downloaded PBF and pinned checksums are retained in ignored research storage; no enduring upstream archival guarantee is claimed.

Two actual extraction runs on Python 3.13.5 / pyosmium 4.3.2 produced identical bytes:

| Research output | Bytes | SHA-256 |
| --- | ---: | --- |
| Uncompressed JSON | 15,166,255 | `587a00e6aedc42f461c100fcaa33c4ac80f78dd5c00afddc1f7d748e9e3fef3c` |
| Gzip research snapshot | 3,231,099 | `5504fab937f8f991a4926334e441da1f9f1b6a9219ec303eff82dd44f41c76d0` |

These hashes prove repeatable **research extraction**, not a completed province builder. `scripts/build-vietnam-province-boundaries.mjs`, the public province GeoJSON/provenance and `lib/explorer/cinematic/province-boundaries.ts` are intentionally **not created**. Production builder/artifact hashes and their two-run comparison are **not available** while the source gate fails.

## Rights and eventual attribution requirements

OSM identity metadata in the crosswalk and research geometry remain **ODbL 1.0**, separately from any code license; Government administrative facts are credited to Decision 19/2025/QD-TTg. The intended OSM-derived vector data would be a derivative database, retained under ODbL with the license URI, copyright/attribution notices, source snapshot and reproducible modifications. Source access must accompany any distribution/public use as applicable under ODbL §§4.2–4.6. A web renderer would need readable **© OpenStreetMap contributors** attribution linked to the copyright page and a clear ODbL reference. Task 06 must implement that only after the data gate passes. Code licensing does not relicense OSM data, and an ODbL notice does not certify currentness or geographic authority.

No OSM tile, road, POI, remote runtime query, extra Earth image or basemap is introduced. The research PNGs carry attribution; they are not published into the application.

## Preview, budget and remaining work

The following generated source previews were opened and visually inspected directly:

- `output/playwright/explorer-refinement/task-05/source-overview-incomplete.png`.
- `output/playwright/explorer-refinement/task-05/khanh-hoa-available-parts.png`.

The available mainland linework is visually coherent at the inspected scales, but the missing source parts cannot be established by a plausible image. Coarse national/coastal offsets and straight coastal/water segments remain visible and need review before any land-only output. Existing national/island geometry is shown as unchanged context, including its offshore coverage; no source gap is filled from that context and no precision/territorial conclusion is drawn.

| Measured inventory | Raw bytes | Sum of per-file gzip bytes |
| --- | ---: | ---: |
| Four existing runtime geography files (world land, national/islands, country lines, labels) | 1,777,643 | 586,931 (573.175 KiB) |
| Every JSON/GeoJSON under `public/maps`, including provenance | 1,796,447 | 592,714 (578.822 KiB) |
| Above plus the separate existing map-film GeoJSON (`public/mapfilm/indochina-borders.geojson`) | 1,811,338 | 597,656 (583.648 KiB) |
| Province runtime artifact | Not produced | Not produced |

The project's earlier aggregate geography gate measures gzip transfer size; both sizes are reported here. If 800 KiB is interpreted as raw JSON, the existing baseline already exceeds it. No national or island detail was deleted to alter either measure. The 200 KiB province / 800 KiB aggregate / 50,000 added-segment gates remain unproved for a completed province layer.

The 18 focused tests exercise the actual offline validator with explicit synthetic source topology: missing identities/ways/inner rings/nodes, invalid coordinates, unknown roles, open endpoint topology, duplicated membership/source edges, non-manifold ownership, exclusions and deterministic diagnostics. They do not register synthetic geometry in production and do not claim the absent complete real dataset passed.

Fresh final checks: `pnpm exec vitest run tests/unit/explorer-province-boundaries.test.ts` passed **18/18**; `pnpm history:data:check` passed **42/42**. `pnpm verify` exited **0** with **944 unit tests / 74 files**, **8 hook/setup tests**, history checks, ESLint, strict typecheck and a production build generating **102 pages**. The real source validator intentionally exits **2** with its 16 recorded missing-way errors. A direct public-output guard check also exited **2**, and the province public asset remains absent. `git diff --check` passed; existing line-ending notices are not whitespace failures. No application E2E or Task 06 visual/performance acceptance is claimed, because application behavior was not modified. Self-review was performed inline by the author, not an independent reviewer.

**Unblocking evidence:** obtain all 16 missing ways and every referenced node with compatible revisions/timestamp, or obtain a different complete licensed current source with its government crosswalk; then revalidate every source polygon/part/hole, spatial coverage and coastal/maritime exclusions, implement a deterministic source-aware topology/simplification builder, prove its budgets/determinism and complete the real artifact tests. The reserved schema/loading envelope is frozen in the Task 05 progress handoff; no loader is implemented or activated. **Tasks 05 and 06 remain outstanding. Stop after this Task 05 research handoff.**

## 2026-10-25 — Authorized shared-interior line follow-up

The owner invoked `2026-10-25-vietnam-province-boundaries-completion-plan.md` to finish the reference-line layer, with one main agent and self-review. This explicitly replaces the old full-polygon prerequisite **only for mutual interior source ways**. It does not certify province fills, point-in-province use, cadastral/legal accuracy, historical-year borders or complete polygons.

The exact cached research gzip, decompressed bytes and PBF were rehashed and match the pins above. The original full-source validator is unchanged and still exits 2 with its 16 missing-way errors and `productionReady=false`. Every missing way has only one selected provincial owner, derived from the complete relation memberships **before** available-way lookup. Their physical locations remain unknown. This is an ownership classification, not a claim that the missing ways lie offshore.

The new independent `auditProvinceInteriorSource(input, membership)` and its offline CLI pass the mutual-line scope: **1,726 shared ways, zero missing shared ways/nodes, 32 policy exclusions, 1,694 eligible ways, 144,617 raw source segments, 58 pairs and all 34 units**. It checks identities/revisions, unknown roles, duplicate/non-manifold edges, finite coordinates, licensing and all referenced nodes. The single-owner inventory is **616 total**, including 16 absent objects; the earlier 600 count described available single-owner ways. No permanent missing-ID allowlist is used. Pyosmium's space/`+00:00` revision representation is normalized to the same UTC instant as the crosswalk; no source timestamp or input bytes changed.

Spatial self-review found that literal land-only clipping would erase river/channel boundaries between existing national land parts, including all of pair 79–82. The source review records **89 individual source channel way IDs** and their bounds. Only their exact source geometry receives a 3cm numerical corridor in the **derived display mask**; no river connector or coastal buffer is invented. The national/island asset remains byte-identical. Of the remaining ten mask interactions, eight are clipped and two ways (`140350283`, `1427502033`, pair 08–15) are entirely outside this display context. These exclusions do not assert their legal or physical classification. All 58 pairs and all 34 units remain represented. Every eligible way has explicit spatial accounting: 1,684 retained, eight clipped, two masked; 1,692 source ways contribute to the displayed output.

The deterministic builder makes one undirected graph, freezes pair/policy endpoints and junctions, clips source-aware chains and simplifies each shared chain once in spherical equirectangular **projected metres** (origin 108°E/16°N, radius 6,371,008.8m). It tests tolerances 0/5/10/20/40/80 and selects **40m**, the smallest satisfying both geometry and transfer limits. No valid boundary is dropped for size. Closed loops, holes, disconnected parts, reversed duplicates, new crossings and local smaller-tolerance retries have offline tests. Original-chain arclength traces source IDs through overlay roundoff and closed-loop seams. Runtime output has **62 line features / 18,489 raw and actual subdivided segments**, with no new crossing, duplicate or lost junction. Maximum measured source-relative displacement is **39.999944 projected metres**, not a survey-accuracy claim. Five actual near-side camera samples at zoom 11 have maximum source-relative screen deviation **1.087919 CSS px** (limit 3px).

Two final runs produce identical GeoJSON, deterministic gzip (mtime 0) and provenance bytes:

| Final output | Bytes | SHA-256 |
| --- | ---: | --- |
| Runtime GeoJSON | 503,329 | `01ae6a329e978323f85621aa656558bb0b1e2acbc71845e8040856afda9436cd` |
| Generator gzip, Python zlib level 6 | 173,550 | `a489b81bbd03a55b4efb48a05cc0392828f2084a00797c13110fef8733bcb2aa` |
| Public provenance | 479,867 | `8d30ec1b2b845b31356669aed12f01d032256af88a9e0ff5be6047e1278eadfb` |
| Source review | See file | `e6b60a68085802a99683e7001bccf90d15126efa1c716b8ecf1cb0f542d1bf5a` |

Node runtime recompression is **170,874 bytes gzip** (different zlib build), also within 200KiB. Both compressor/tool versions are recorded; equal byte streams are required on the same toolchain, while every production-check recompression must meet the budget. Default homepage runtime geography is **2,280,972 raw / 757,805 gzip bytes** across the five actually fetched geographic JSON assets, below 800KiB gzip. All JSON/GeoJSON under `public/maps`, including optional linked provenance, totals **818,943 gzip bytes**; unrelated map-film/detail-route data is not a homepage fetch. Existing world/country/label/national/island and authored journey files match entry hashes.

The actual files are available at `/maps/history-vietnam-province-boundaries.geojson` and `/maps/history-vietnam-province-boundaries.provenance.json`, both HTTP 200 on the fresh local target. The generic parser/subdivision accepts the real production bytes; separate production tests reject missing files, source/scope/hash mismatches, rehashed coordinate drift and TEST-ONLY/example.invalid fixtures. The source review pins the GeoJSON checked by the implementing agent, not an independent or official approval. Clean-checkout production checks require neither network nor the ignored PBF.

The existing optional scene loader now passes only successfully attached timestamp/license metadata to the source UI and clears it on failure/retry/context loss. Source copy shows **2026-10-23 20:20:51 UTC**, **© OpenStreetMap contributors**, ODbL, actual derivative/provenance links and separate Government Resolution/Decision links. The exact modern-reference disclosure remains. Actual-source contrast exposed cap tinting and regional background variation; only province pass/order/brightness changed. Width/radii, country/national materials, image assets, cameras, event/journey data and clocks remain unchanged. Fifteen regional/zoom comparisons (five source pairs × zoom 8/10/11) pass stroke-core contrast ≥3:1; far-side comparison changes zero pixels. Single-agent self-review is weaker than an independent review and is labeled accordingly.

Reproduction after obtaining the pinned ignored input and offline tool cache:

```powershell
node scripts/audit-vietnam-province-interior-source.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --membership docs/audits/sources/2026-10-24-vietnam-province-membership.json --report .task-reports/province-boundaries-completion-work/source-audit.json
node scripts/build-vietnam-province-boundaries.mjs --input .task-reports/explorer-refinement-task-05-work/province-source.run-1.json.gz --membership docs/audits/sources/2026-10-24-vietnam-province-membership.json --mask public/maps/vietnam-tabletop.geojson --source-review docs/audits/sources/2026-10-25-province-interior-source-review.json --output-dir .task-reports/province-boundaries-completion-work/candidate
uv run --offline --with shapely==2.1.2 python -m unittest discover -s scripts/province-boundaries -p "test_*.py"
pnpm exec vitest run tests/unit/explorer-province-interior-source.test.ts tests/unit/explorer-province-production-artifact.test.ts tests/unit/explorer-province-boundaries.test.ts
```

Fresh final verification: **13/13 Python**, **54/54 focused unit**, final `pnpm verify` exit 0 (**1,000 unit / 78 files**, eight hook/setup, 42 history checks, lint/strict types/build 102 pages). **Final eleven-file public browser gate passed 162/162 in 783.779s, zero skipped/flaky/unexpected.** Bounded attribution scrolling and a <=1s zero-collision observer-settlement assertion repair the two initial layout failures; stable observers and native summary hit tests remain. Real province requests have no accepted natural 404. Final source/pixel/metadata checks return 200/ready and match the pinned hashes. Evidence and final outcome are in the progress handoff and `output/playwright/province-boundaries-completion/`. The preserved full-polygon and official/source prefix discrepancies remain unresolved.
