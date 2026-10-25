# Curated globe: journey and geography evidence

Reviewed locally on 2026-10-23 by the implementing agent. This is source traceability and self-review, not independent historical or cartographic sign-off. No database record was published by this work.

## Editorial scope

The registry in `lib/explorer/journey.ts` contains seven selected milestones, not a complete travel itinerary. Every location is approximate. City coordinates are used for city-level orientation; the Pác Bó stop uses a documented regional coordinate. The UI names those limitations, including the difference between Paris and Versailles and between the Pác Bó area and the precise border marker/cave.

| Registry ID | Historical claim and precision | Historical evidence | Coordinate evidence |
| --- | --- | --- | --- |
| `sai-gon-1911` | Departure from Bến Nhà Rồng, 1911-06-05, day | S2, paragraph beginning with departure date | G1: Ho Chi Minh City / Vietnam, 106.702985, 10.762125; city point, not the museum building |
| `marseille-1911` | Arrival at Marseille, 1911-07-06, day | S1 and S2, first voyage | G1: Marseille / France, 5.373064, 43.291925 |
| `london-1913` | Period in England beginning in 1913, year only | S1, section on time working in England, including London | G1: London / United Kingdom, -0.118668, 51.501941 |
| `paris-1919` | Petition activity in France, 1919-06, month only | S1 and S2, petition paragraphs | G1: Paris / France, 2.352992, 48.858092; not the conference venue in Versailles |
| `tours-1920` | Participation in the founding of the French Communist Party at Tours, 1920-12, month only | S1, Tours congress paragraphs | G1: Tours / France, 0.699947, 47.380375 |
| `moscow-1923` | Activity in Moskva after arrival in Petrograd in 1923, year only | S1, second major section | G1: Moscow / Russia, 37.613577, 55.754110; historical display name retained |
| `pac-bo-1941` | Return to Vietnam through marker 108, 1941-01-28, day | S2; date cross-checked against S3 | G2: Pắc Bó cultural/historical area, 22°58′N, 106°03′E, converted to 22.966667, 106.05; area point, not marker 108 |

Historical presence/date claims above are supported at the stated precision. Map coordinate accuracy remains `approximate` for every stop. Human editorial choices (selected stops, order of presentation, camera zoom, short teaching summaries, and schematic connections) are not historical source claims.

## Historical sources

All URLs accessed 2026-10-23. Summaries are paraphrases; no historical quotation is added.

- **S1:** Cổng thông tin Hồ Chí Minh, *Chủ tịch Hồ Chí Minh và hành trình 30 năm tìm đường cứu nước giải phóng dân tộc*, published 2023-06-06. [Article](https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013). Supports the selected foreign milestones at their displayed precision. Does not supply precise venue coordinates.
- **S2:** Trang tin Thành ủy TP. Hồ Chí Minh, *Hành trình đi tìm hình của nước*. [Article](https://hcmcpv.org.vn/tin-tuc/hanh-trinh-di-tim-hinh-cua-nuoc-1491878832). Publication date was not established in the retrieved article body; access date is recorded separately. Supports departure/arrival/return and contextual activity in France and England.
- **S3:** Bộ Tư lệnh Bảo vệ Lăng Chủ tịch Hồ Chí Minh, *Một số hoạt động chủ yếu của Bác Hồ ở Pác Bó thời kỳ 1941–1945*. [Article](https://btllang.mod.gov.vn/tin-tuc/tin-tong-hop/3447-mot-so-hoat-dong-chu-yeu-cua-bac-ho-o-pac-bo-thoi-ky-1941-1945.html). Search-extracted article text cross-checks the 1941 return date and border marker. Used as corroboration; runtime links S2 as the directly opened evidence.

## Geographic sources and processing

- **G1:** Natural Earth contributors, *1:10m Populated Places*, pinned v5.1.2. [Versioned GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson). Match both `name` and `adm0name`, avoiding the different cities named London. Extract only the chosen cities; do not ship the complete label set. Coordinates are WGS84 longitude/latitude. No contemporary population/administrative claim is inferred. The curated Vietnamese orientation labels and provenance are in `public/maps/history-vietnam-labels.json`.
- **G2:** *Thông tin về các khu bảo vệ hiện có và đề xuất ở Việt Nam*, second edition, *Khu VH-LS Pắc Bó*, printed update 2004-02-15. [PDF](https://thiennhienviet.org.vn/sourcebook/pdf/Dong%20bac/Pac%20Bo.pdf), page 1, coordinate field. The public mirror is identified in the registry rather than inventing an individual author. Geographic use is limited to the approximate historical-site area; other biological/historical claims in this old document are not adopted.
- **G3:** Natural Earth contributors, *1:50m Land*, v5.1.2. [Versioned GeoJSON](https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_land.geojson). World land layer: 1,420 features; source properties removed; coordinates rounded to four decimal degrees. This is contextual land/coastline geometry, not a political boundary or historical map. The shipped file's SHA-256, processing, and gzip size are in `public/maps/history-world-land.provenance.json`.
- **G4:** Existing Vietnam asset `public/maps/vietnam-tabletop.geojson` and its adjacent provenance. Reuse its flat geographical geometry and documented island coverage; no extrusion, new territorial boundary, or historical administrative reconstruction is introduced. The earlier automated/self-visual review does not constitute independent human cartographic approval.

[Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/) place its map data in the public domain. Keep provenance despite attribution not being mandatory under those terms. The approximate Pác Bó coordinate is a factual coordinate from G2; no PDF artwork is redistributed.

## Publication and precision safeguards

Related event links are rendered only when the existing public query contains the corresponding published event slug. A local draft file does not create a public detail link. The journey is an explicitly sourced editorial registry, separate from the existing event inventory, and does not expand the grade-12 event corpus by silently importing drafts.

No line represents a documented ship route or continuous travel track. Gaps between selected milestones are intentional and disclosed. Camera targets stop at city/area scale, and the source/accuracy notes remain accessible outside the canvas.
