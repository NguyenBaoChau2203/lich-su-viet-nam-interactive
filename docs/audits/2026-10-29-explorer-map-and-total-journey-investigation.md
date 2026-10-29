# Explorer map availability and total journey investigation

Date: 2026-10-29, Asia/Bangkok. One main agent performed investigation and self-review. This is an investigation and planning delivery; no application or database fix was implemented.

## Request and baseline

The owner reported that selecting some explorer events does not reveal their location on the map, and requested an additional journey containing all existing journeys from beginning to end. The owner requested a detailed implementation plan, an English execution prompt for Cursor using Grok 4.7 xhigh fast, and a short launch message.

Investigated checkout: `D:/lich-su-viet-nam-interactive`, branch `feat/homepage-visual-effects`, HEAD `23a4b0f039a91d549509c25b15f5b7ae972679c9`. Numerous pre-existing tracked and untracked changes include the explorer, timeline, locality/province selection, playback, tests, documents and owner Word files. Findings refer to the current working tree, not only HEAD. Preserve those changes during execution.

`pnpm agent:status` reported a complete index of 931 supported source files with no pending changes. CodeGraph was used before targeted source inspection; Markdown, JSON, SQL and source ranges omitted by the graph were inspected directly.

## Findings

### Confirmed: 22 public events have no public location association in the explorer response

The existing local application at `http://localhost:3000/` displayed 32 events, spanning 1905–2019. A fresh anonymous homepage response was decoded to inspect the public explorer props, without reading environment files, credentials or private data:

| Public response property | Count |
| --- | ---: |
| Events | 32 |
| Events with `locations: []` | 22 |
| Events with at least one coordinate accepted by the current marker validator | 10 |
| Location records across those 10 events | 11 |

All 22 empty-location event slugs exactly match the 22 event slugs in `supabase/content/timeline-review-2026-10-26/approved-events.json`. PowerShell `Compare-Object` returned no differences between these two sets.

The associated `docs/audits/2026-10-26-timeline-content-review.md` explicitly records that no new coordinates were added and four uncertified event/place associations were removed. This establishes the documented content boundary behind the observed gap. It does not prove the current database's private rows or whether each absent public association is missing, unpublished, or otherwise unavailable to the public reader.

The SQL MCP read was denied with `You do not have permission to perform this action`. No retry through privileged credentials or environment files was attempted. The conclusion above is independently supported by the actual anonymous application response.

### Confirmed: the UI can open a summary while no marker or camera destination exists

The current flow is:

1. `components/explorer/MapEventList.tsx:23` renders the same `Xem tóm tắt trên bản đồ` action for every event. The action is enabled even for an empty location array; a separate line at line 27 reports missing coordinates.
2. `components/explorer/HistoryExplorer.tsx:315` dispatches `select-event` and closes the list.
3. `lib/explorer/journeys/playback.ts:247` sets the selected event and a focus request regardless of location availability.
4. `components/explorer/cinematic/CinematicEventMap.tsx:230` looks for the first location with non-null latitude/longitude. If none exists, it returns without moving the camera.
5. `lib/explorer/map-markers.ts:22` creates anchors only for finite coordinates within the supported latitude/longitude bounds. An empty location array creates no anchor.
6. `components/explorer/MapEventCard.tsx:36` still opens the summary and renders `Địa điểm đang được bổ sung.` for an empty array.

Browser reproduction at CSS 1280×720 in Microsoft Edge:

- Open the event list and choose `nguyen-ai-quoc-dai-hoi-tours-1920`.
- The correct Tours summary opens; the URL records the selected event.
- The camera remains at its prior Vietnam view, `ban-do=15.5,106.4,3.32`.
- The card says `Địa điểm đang được bổ sung.` and there is no selected event marker.
- Screenshot: `output/playwright/explorer-map-audit-2026-10-29/tours-no-marker.png`.

This behavior follows the available data. The user experience is misleading because the action mentions the map and the reason is not explained clearly in the opened card.

### Confirmed: the map is capable of displaying selected events

Public browser controls were used to select these positive controls:

| Event slug | Observed result |
| --- | --- |
| `nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc` | Correct summary; a selected marker cluster includes the event |
| `hiep-dinh-geneve-ve-dong-duong` | Correct summary; a selected marker cluster includes the event |
| `tong-tien-cong-va-noi-day-tet-mau-than-1968` | Correct summary; a selected marker cluster includes the event |

Screenshot: `output/playwright/explorer-map-audit-2026-10-29/mappable-selected.png`. Cluster counts and camera URL samples were captured during transitions; do not treat the instantaneous count or URL as a settled camera assertion.

This is positive evidence against a universal renderer failure. It does not establish that every valid event is visible at every viewport or camera position.

### Secondary risks to cover during implementation

- Camera focus currently checks non-null coordinates, while `getEventMapAnchors` also rejects non-finite and out-of-range values. That is a confirmed validation mismatch; it was not the cause of these 22 empty arrays.
- `lib/explorer/cinematic/overlays.ts:51` removes marker groups overlapping occupied UI regions. Other events may therefore disappear behind panels. This is an existing rule, not a demonstrated cause for the empty-location cases.
- Several events share a place, so a selected event can be represented by a selected numbered cluster. Verification must inspect cluster membership, not demand a separate pin for every event.
- The initial development page logged `Maximum update depth exceeded` twice. The warning was observed, but its cause and relationship to this report were not established. Preserve it as baseline evidence and investigate further only if it blocks the scoped behavior.

## Empty-location inventory

These are public response identities, not newly asserted historical claims:

| Event slug | Display title |
| --- | --- |
| `phong-trao-dong-du` | Phong trào Đông Du |
| `nguyen-ai-quoc-dai-hoi-tours-1920` | Nguyễn Ái Quốc tại Đại hội Tours |
| `thanh-lap-dang-cong-san-viet-nam-1930` | Thành lập Đảng Cộng sản Việt Nam |
| `thanh-lap-viet-minh-1941` | Thành lập Mặt trận Việt Minh |
| `hue-gianh-chinh-quyen-1945` | Huế giành chính quyền năm 1945 |
| `sai-gon-gianh-chinh-quyen-1945` | Sài Gòn giành chính quyền năm 1945 |
| `chien-dich-viet-bac-1947` | Mở đầu cuộc chiến đấu bảo vệ Việt Bắc năm 1947 |
| `chien-dich-bien-gioi-1950` | Mở chiến dịch Biên giới năm 1950 |
| `phong-trao-dong-khoi-1960` | Đồng khởi Bến Tre năm 1960 |
| `chien-thang-ap-bac-1963` | Chiến thắng Ấp Bắc |
| `chien-thang-van-tuong-1965` | Chiến thắng Vạn Tường |
| `tien-cong-chien-luoc-1972` | Mở cuộc tiến công chiến lược năm 1972 |
| `chien-thang-buon-ma-thuot-1975` | Trận Buôn Ma Thuột tháng 3/1975 |
| `giai-phong-hue-1975` | Giải phóng Huế năm 1975 |
| `giai-phong-da-nang-1975` | Giải phóng Đà Nẵng năm 1975 |
| `bao-ve-chu-quyen-gac-ma-1988` | Bảo vệ chủ quyền tại Gạc Ma năm 1988 |
| `nghi-quyet-khoan-10-1988` | Nghị quyết 10 về đổi mới quản lý kinh tế nông nghiệp |
| `binh-thuong-hoa-quan-he-viet-my-1995` | Bình thường hóa quan hệ Việt Nam – Hoa Kỳ |
| `viet-nam-gia-nhap-asean-1995` | Việt Nam gia nhập ASEAN |
| `dai-hoi-dang-lan-thu-viii-1996` | Đại hội đại biểu toàn quốc lần thứ VIII của Đảng |
| `viet-nam-gia-nhap-wto-2007` | Việt Nam gia nhập Tổ chức Thương mại Thế giới (WTO) |
| `cptpp-co-hieu-luc-voi-viet-nam-2019` | CPTPP có hiệu lực đối với Việt Nam |

## Journey findings and proposed product interpretation

The current registry and live chooser both expose:

| Journey ID | Display title | Stops |
| --- | --- | ---: |
| `ho-chi-minh-1911-1941` | Hành trình của Chủ tịch Hồ Chí Minh | 7 |
| `mua-thu-doc-lap-1945` | Mùa thu độc lập 1945 | 4 |
| `khang-chien-chong-phap-1946-1954` | Những mốc kháng chiến chống Pháp | 5 |
| `mua-xuan-1975` | Mùa Xuân 1975 | 4 |
| Total across existing journeys | | 20 |

Proposed interpretation: add a fifth selectable journey, `Hành trình tổng hợp`, containing all 20 existing milestones in chronological order, from 05/06/1911 through 30/04/1975. This is a union of existing journey milestones, not a promise to turn all 32 public explorer events from 1905–2019 into journey stops. The owner has not separately reviewed the detailed engineering choices below.

Important dependencies:

- `HistoryJourney` and `JourneyStop` are in `lib/explorer/journey.ts`; stop IDs are currently unique only within a journey.
- `JOURNEY_REGISTRY` contains four records and preserves the legacy default.
- URL state already identifies both journey and stop; the existing reducer handles selection, arrival nonces, dwell, pause, seeking and restoration.
- `resolveJourneyMedia` uses the key `journeyId:stopId`. A new total journey ID will lose its images unless media lookup follows the original milestone identity.
- `buildJourneyPath` has a 64-stop cap. The proposed 20 stops fit; increasing that cap is unnecessary.
- Registry/content/chooser tests contain intentional four-journey expectations. Update those narrowly while retaining the four original content contracts and legacy digest.

## Approach comparison

| Approach | Consequence | Decision |
| --- | --- | --- |
| Shared map-availability semantics, explicit summary fallback, and a derived total journey in the existing registry | Correctly explains missing locations, preserves source integrity, and reuses camera/playback/history | Recommended for local implementation |
| Fill missing pins with inferred city centers or copy journey coordinates based on title similarity | Creates unsupported event/place associations and can misrepresent nationwide or multi-place events | Reject |
| Introduce a second map model/player or manually copy all 20 stops into another data block | Duplicates state, loses provenance/media identity, and drifts when original journeys change | Reject |

Preparing a source-backed location remediation queue is useful. Applying changes to the live Supabase project is a separate owner-authorized action. Do not describe relabeling the UI as completing all missing location data.

## Verification at this investigation checkpoint

Fresh focused command:

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
pnpm exec vitest run tests/unit/explorer-map-markers.test.ts tests/unit/explorer-journey-registry.test.ts tests/unit/explorer-journey-playback.test.ts tests/unit/explorer-journey-content.test.ts tests/unit/explorer-cinematic-overlays.test.ts
```

Result: 5 files, 53 tests passed. These are existing baseline tests; they do not prove the proposed feature or new regression cases.

Fresh `pnpm verify` passed with exit code 0: agent setup and data checks, lint (zero errors; one pre-existing unused `_camera` warning in `lib/explorer/cinematic/province-areas.ts:479`), strict type checking, 127 Vitest files/1,334 tests, 26 script tests, and production build with 110/110 static pages. The full output is recorded in the local task report/log. Browser investigation covered the existing application at 1280×720; a four-viewport feature acceptance pass remains part of execution. No full legacy E2E suite, content publication, database mutation, commit, push, PR or deployment was performed.

Local machine-readable evidence: `.task-reports/2026-10-29-explorer-public-inventory.json`. It contains only normalized public event/location data, is ignored by Git, and is corroborating evidence rather than a replacement for current source or fresh public reads.

## Next artifacts

- Plan: `docs/superpowers/plans/2026-10-29-explorer-map-availability-and-total-journey-plan.md`.
- Cursor execution prompt: `docs/agent/prompts/2026-10-29-grok-explorer-map-and-total-journey.md`.
