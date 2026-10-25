# Explorer refinement: verified baseline and research

Date: 2026-10-24, Asia/Bangkok. Scope: review and planning only. The owner requests brighter country borders/Earth atmosphere, Vietnam province lines, useful event declustering, restored journey connectors, additional grade-12 journeys and a two-second autoplay dwell. The owner explicitly selected **34 current provincial-level units**, with a modern-reference disclosure.

## Current implementation and reproduced failures

1. **Country borders exist.** `scene.ts` has `setCountryBoundaries`, `BOUNDARY_SLATE = #56605a`, CSS-pixel widths around 0.55–1.0 and optional loading. This is the implementation after the previous country-boundary plan. It needs a brightness adjustment, not another data-layer replacement.
2. **New interactive zoom is capped at 5.4.** `camera.ts:zoomView` clamps to `max(CLOSEST_USEFUL_EVENT_ZOOM, currentZoom)`, with `CLOSEST_USEFUL_EVENT_ZOOM = 5.4`. A legacy closer view is retained but cannot zoom in farther. Both the plus control and the cluster's requested `zoom + 1.5` pass through this function. In a fresh production browser at `ban-do=21.03,105.84,5.4`, clicking plus and then `Phóng to khu vực` retained zoom 5.4 and the three-event Hanoi group. The old unit test explicitly expects that cap; its passing result does not satisfy the new request.
3. **The relevant public locations already differ.** The public page currently returns ten published events. Hanoi examples: Nhà hát Lớn `[105.8578,21.0245]`, Ba Đình `[105.8342,21.0369]`, and a city-area reference `[105.8542,21.0285]`. Southern examples include Bến Nhà Rồng, Sài Gòn area and Dinh Độc Lập at different coordinates. These are existing published metadata, not coordinates independently re-surveyed here. Do not rewrite them or add random geographic jitter to work around the camera cap.
4. **Journey connection data is orphaned from the active renderer.** `journey.ts:getJourneyConnections` still builds the ordered schematic line, but the current cinematic scene/options/API have no journey-path layer/setter and the adapter passes only the active stop. Old `globe-style.ts` contains a MapLibre line source/layer, which does not render on the current Three scene. Restore actual spherical rendering; retaining a function or caption is insufficient.
5. **The journey model is single-journey.** `HistoryExplorer`, `JourneyPanel`, `getJourneyStop`, `parseJourneySelection`, captions and links refer to `HISTORY_JOURNEY`; only the Hồ Chí Minh journey is accepted. New titles alone cannot safely add choices. Registry, pair validation and stale callback identity must change together.
6. **The dwell is eight seconds after arrival.** `HistoryExplorer` schedules `8000` only after `settledStop === stop.id`; `JourneyPanel` and E2E copy name eight seconds. The requested change is specified as **2000 ms after arrival**, preserving geographic flight durations. It is not a two-second deadline for an entire intercontinental transition.
7. **Lighting is deliberately subdued.** Current Earth ambient uniform is 0.22; outer atmosphere intensity is 0.92. Use a restrained material/uniform adjustment with real contrast screenshots, not a CSS brightness filter over the whole UI.
8. **No current Vietnam province layer was found in the inspected rendering path.** A new optional, versioned interior-boundary artifact is required. Its stroke must sit above the Vietnam fill but below the national gold outline; reusing the country-border altitude below the cap would make it disappear.

Browser evidence is under `output/playwright/explorer-expansion-review/`: `cluster-zoom-capped-1440x900.png` and `journey-no-connector-1440x900.png`. A ten-event public coordinate inventory is saved in the ignored review directory. No service-role key, environment content or external database write was used.

## Provincial geography: what is and is not cleared

The owner's selection matches the reorganization described in [Resolution 202/2025/QH15 on the Government portal](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-202-2025-qh15-ve-sap-xep-don-vi-hanh-chinh-cap-tinh-119250612174148722.htm). This verifies the administrative framework/count, not the license or precision of a downloaded geometry.

| Candidate inspected on 2026-10-24 | Finding | Planning decision |
| --- | --- | --- |
| [thanglequoc GIS directory README](https://github.com/thanglequoc/vietnamese-provinces-database/blob/master/dataset-generation-scripts/resources/gis/geojson_11Mar2026/README.md) | Provides a 34-province geometry directory, but explicitly refers GIS usage restrictions to Bando.com.vn. Root MIT does not clear that separately sourced data. README blob `43f59141f2d6c19969d2cc842e4603707327f077`. | Do not ingest as permission-cleared GIS merely because the repo license is MIT. |
| [Open Admin Data Vietnam](https://github.com/open-admin-data/vietnam-administrative-divisions) | CC BY 4.0 hierarchy/coordinates for 34 units; inspected README describes lat/lon records, not boundary polygons. | Useful code/name cross-check; center points cannot draw borders. |
| [geoBoundaries gbOpen VNM ADM1 API](https://www.geoboundaries.org/api/current/gbOpen/VNM/ADM1/) | Returned year represented 2008 and 64 units, despite the endpoint path containing `current`. | Reject as the requested current 34-unit map. |
| [Open Development Vietnam boundary catalog](https://data.vietnam.opendevelopmentmekong.net/en/dataset/a-gii-hnh-chnh-vit-nam) | Metadata says data published 2009/reference 2016, plus noncommercial/use restrictions and copyright to be determined alongside a CC BY-SA label. | Not accepted as current/cleared 34-unit input. |
| [OpenStreetMap data license](https://www.openstreetmap.org/copyright), [administrative boundary model](https://wiki.openstreetmap.org/wiki/Tag:boundary%3Dadministrative) | ODbL data is available with attribution/license obligations; shared relation ways can support deduplicated interior borders. The attempted read-only Overpass metadata query returned HTTP 406, so the current 34-relation set and geometry were not verified here. | Candidate for an offline, attributed vector-only snapshot, subject to Task 05 verification. No OSM tiles, roads or global labels would be introduced. |

**Remaining data gate:** Task 05 must obtain and verify a licensed 34-unit artifact, government-code crosswalk, source timestamp and topology before Task 06 ships it. This review does not claim a final province dataset is ready. If using OSM, retain the required attribution and source/derived-data license materials. If a different publisher is selected, verify the actual GIS rights, not just the code license. Never fabricate 34 outlines or silently substitute an old administrative map.

## Candidate additional journeys and source readiness

Local `lib/sgk/curriculum.ts` maps the existing project to grade-12 Kết nối tri thức topics/lessons 6, 7 and 8. Its comments still require comparison with the printed edition, so the exact lesson mapping remains a verification item, not a fully validated quotation from a textbook. The publisher's training portal was discovered but page retrieval timed out. Do not copy textbook paragraphs.

Propose three **editorial sequences of historical milestones**, alongside the existing Hồ Chí Minh journey:

| Proposed ID / title | Candidate sequence | Evidence and remaining gate |
| --- | --- | --- |
| `mua-thu-doc-lap-1945` — `Mùa thu độc lập 1945` | Hanoi uprising → Huế uprising → Sài Gòn uprising → declaration of independence in Hanoi | [National History Museum](https://baotanglichsuquocgia.vn/vi/Articles/3097/18473/tong-khoi-nghia-cach-mang-thang-tam-nam-1945.html) supports 19/8, 23/8 and 25/8. The final declaration/date/site needs its own stop-level citation; use published source-backed anchors where applicable. Returning to Hanoi is intentional, not a sorting error. |
| `khang-chien-chong-phap-1946-1954` — `Những mốc kháng chiến chống Pháp` | Hanoi/Toàn quốc kháng chiến → Việt Bắc 1947 → Biên giới 1950 → Điện Biên Phủ 1954 → Genève 1954 | [Museum overview](https://baotanglichsu.vn/vi/Articles/4055/cuoc-khang-chien-chong-thuc-dan-phap-1946-1954) and [QĐND historical account](https://hc.qdnd.vn/lich-su-hau-can/dai-tuong-vo-nguyen-giap-voi-cong-tac-hau-can-quan-doi-482017) support the campaign sequence. Exact dates/representative regional anchors and Genève claim need their individual sources. Do not present a large campaign as one exact battle site. |
| `mua-xuan-1975` — `Mùa Xuân 1975` | Buôn Ma Thuột → Huế → Đà Nẵng → Sài Gòn | [Government account of Trị Thiên](https://baochinhphu.vn/nghe-thuat-van-dung-thoi-co-trong-chien-dich-tri-thien-102180398.htm) supports the Huế campaign/date. Đà Nẵng and education-portal results were leads whose direct fetch failed; all stop dates/coordinates still need readable primary sources. Distinguish the attack on Buôn Ma Thuột from the date the town was fully taken. |

Access date for these source checks: 2026-10-24. Publishers are identified in the links/table. Claims supported at the theme/sequence level above are not a final published stop manifest. New place coordinates, summaries and date precision are **needs_evidence** until Task 07's claim/coordinate ledger passes. Target four journeys total, with four/five/four additional sourced stops respectively; if a particular claim is unresolved, complete independent work and report the exact content blocker rather than publishing it.

All paths are explicitly schematic connections between authored milestones. They are not travel itineraries of one person, exact marching routes or reconstructed troop movements. Event-detail links are shown only for slugs present in the current published event inventory; an editorial stop can exist with sources and no event detail link. No database publication is implied.

## Current verification

Fresh `pnpm verify` passed: **873 unit tests / 68 files**, **8 agent-hook tests**, history/lint/typecheck and production build with 102 static pages. The five selected public homepage E2E files also passed **68/68 cases in 5.5 minutes**, against the task-owned fresh production server on port 3100. Passing these old tests does not prove the newly requested zoom, route or two-second behavior.

Exact selected browser command (with `E2E_BASE_URL=http://127.0.0.1:3100`):

```powershell
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts --workers=1
```

No account/admin/mutation-oriented or mobile/tablet suites were run. Fresh logs are in the ignored `.task-reports/explorer-expansion-plan-work/verify.log` and `e2e.log`. This planning task did not modify application code, historical records, dependencies or geography assets.

The task-owned production server also emitted `The destination stream closed early` (digest `3840477093`) during the browser session. The 68 selected cases passed, but that is not evidence of clean server logs. Its cause was not diagnosed in this planning-only task; record/reproduce it in the final integration audit if it persists rather than silently attributing it to the new features. The inspection browser and port-3100 server were closed afterward; the owner's port-3000 server was preserved.

CodeGraph was attempted first and did not cover current cinematic symbols adequately; focused direct reads followed. One main agent performed all work. Previous B3/P6 performance/visual reports were read as attributed reports, not independently remeasured benchmarks in this planning task.
