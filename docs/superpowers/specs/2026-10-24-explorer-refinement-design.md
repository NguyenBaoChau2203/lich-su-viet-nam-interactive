# Explorer refinement — proposed design

Date: 2026-10-24. Status: plan/design only. The owner requested these refinements and explicitly selected **34 current provincial-level units**. Technical values/source choices below are proposals to implement and verify, not changes already applied or a claim that all new historical coordinates are ready.

Read with `docs/audits/2026-10-24-explorer-refinement-review.md`, `docs/audits/2026-10-24-explorer-model-routing.md` and the matching implementation plan. The latest request concerns the existing cinematic globe; do not roll back to the older 2D/tabletop scope. Preserve historical/source/accessibility/security rules.

## Product outcomes

1. Slightly brighter country strokes, Earth reading surface and atmospheric limb without washing out the navy/gold hierarchy.
2. Useful zoom into a region and separately selectable event locations, preserving the real published coordinates and uncertainty.
3. A Vietnam-only province reference layer for the 34-unit current administrative scheme, with explicit date/source limitations.
4. Restored visible schematic journey connections with finite motion and proper Earth occlusion.
5. Four selectable journeys total: existing Hồ Chí Minh plus three sourced grade-12 thematic journeys.
6. Default autoplay dwell **2000 ms after arrival**, with existing play/pause/manual/reduced-motion behavior retained.

No new study/exam features, DB migrations/writes, route proliferation, historical-border reconstruction, full basemap service, mobile/tablet redesign or deployment.

## Light and line hierarchy

Use screenshot comparisons on the same camera. Suggested starting ranges: Earth ambient 0.22 → 0.24–0.27; atmosphere intensity 0.92 → 1.02–1.10; country stroke `#56605a` → a warm slate around `#748477`–`#84968a`. Choose the smallest change that makes the source-derived strokes and dark land easier to read.

Keep the current Vietnam national outline the dominant geographic stroke, event dots and focus clear, and small text ≥4.5:1 / meaningful control/dot contrast ≥3:1 on captured backgrounds. Do not apply a CSS brightness filter to text and canvas together, broaden the atmosphere into a white band, add bloom dependencies, change source geometry or remove uncertainty rings. No unit tests for literal color constants; verify appearance and composited contrast.

Province lines are weaker/thinner than the Vietnam outline, roughly 0.4–0.7 CSS px in overview, increasing only as useful during zoom. They are passive, clipped to the reviewed Vietnam land context, and add no unrelated global labels or pointer targets.

## Event zoom and declustering

Separate **imagery-detail advice** from **interactive camera limits**. Keep legacy `MapView` parsing up to 18 and round-trip existing URLs. Proposed new interactive range is 0–11; a restored view above 11 can zoom out gradually and must not be snapped to 11 on load. Do not keep the 5.4 image-sharpness cap as the effective maximum of the plus, wheel, keyboard or cluster controls.

At local zoom the global 4K texture is a subdued geographic context, not street-level imagery. Preserve useful borders, location labels and true event anchors even when the surface softens; do not fetch stock OSM tiles/POIs to hide that limit. Verify camera near planes, surface/cap/line offsets and HTML anchor alignment at zoom 8, 10 and 11; adjust a demonstrated depth/alignment defect coherently rather than simply raising a number and ignoring artifacts.

Cluster activation fits **all distinct member coordinates** into the current map-safe area, with a useful zoom increase and an interactive cap of 11. Do not center only the first member. Existing published Hanoi/Sài Gòn anchors already differ and must separate where their screen distance permits.

For still-overlapping or genuinely coincident points, offer a deterministic expanded marker layout with leader lines to the true anchors and a concise explanation such as `Các mốc gần nhau được tách để chọn; đường nối chỉ về vị trí gốc.` This changes screen placement only, never latitude/longitude. Preserve ≥32 px targets, label collision avoidance, keyboard selection, Escape collapse and reliable focus return after a cluster disappears/reforms. Groups/list remain usable at maximum zoom; repeated zoom commands must not be inert with no alternative.

Do not manufacture exact sites for broad campaigns or move an approximate city-area point to an unrelated monument. Prefer the current published locations; any needed correction requires a separate source-backed coordinate ledger and preserves accuracy/role notes. Group expansion is transient UI; meaningful event/filter/camera state remains shareable.

## Multi-journey state and two-second dwell

Introduce a small typed registry of `HistoryJourney` records, retaining the current Hồ Chí Minh data/ID and URL keys `hanh-trinh`, `moc`. Stop lookup/validation always uses the **journey ID + stop ID pair**. Titles, period captions, sources, navigation, last-stop checks and route construction derive from the selected record, never a remaining hardcoded Hồ Chí Minh constant.

Switching journeys pauses playback, selects the first valid stop and cancels the prior camera/path/timer work. Capture the exploration snapshot once when entering journey mode; switching among journeys must not overwrite it. Exit restores its filters, selected event and camera. Shared links/reload/back/forward open the valid selected pair paused. Unknown journey IDs are rejected; a mismatched/unknown stop recovers to the selected known journey's first stop with a safe notice, never to an unrelated journey's stop.

Camera arrival identity includes the journey/stop pair and a monotonically increasing request nonce. A late callback from a prior journey or seek cannot settle the new selection or start its timer. Preserve outgoing-navigation guards and existing hidden/manual/reduced-motion cancellation.

Use one constant `JOURNEY_DWELL_MS = 2000`. Start it only after actual arrival, never on request. At 1999 ms no automatic advance occurs; at/after 2000 ms one valid next request occurs. Pausing, seeking, changing journey, leaving the page, map interaction or hidden state cancels the timer. Last stop ends playback without an unsolicited loop. While keyboard focus is inside a reader or source details are expanded, pause automatic advancement so the shortened interval does not pull content away during reading. Reduced motion retains manual navigation and disables autonomous playback, as today.

This is a **two-second dwell**, not two-second total travel. Existing distance-appropriate flights may take longer. No speed-settings panel is required.

## Restored journey route

Draw a warm, restrained, georeferenced path on the same Three scene, connecting authored milestones through the current stop. Preserve chronological order even when a journey returns to the same city. Zero-length/repeated points do not cause invalid geometry; separate journeys never share stale geometry/progress.

Show completed segments statically; reveal the current leg or move one small light along it only while its camera transition is active. Drive this from the existing flight/render owner. No perpetual trail, second animation engine or idle rAF loop. During manual interruption retain a truthful static authored connection; do not imply the camera's dragged position is a historical stop. Under reduced motion render the selected static path immediately.

Spherical curves must avoid chords through Earth, handle the seam and be occluded correctly. They are schematic connections, **not exact sea routes, marching directions or one person's itinerary** for thematic tours. Keep that disclosure in the reader/timeline. Any timeline progress treatment must derive from the same selection/progress and must not create another clock.

## Province data and layer

The source gate in the review is unresolved. Task 05 must produce a licensed, timestamped 34-unit artifact and an official-code/name crosswalk before Task 06 ships geometry. A repo MIT license is insufficient if its GIS README defers to third-party restrictions. Do not use a 2008/64-unit endpoint or old 63-unit layer as current 34 units.

Prefer a verified current source. An offline OSM administrative-relation/shared-way snapshot is one candidate with explicit ODbL attribution; no OSM basemap tiles or browser-side Overpass service is proposed. Verify 34 complete valid province/city units, source IDs, timestamp, terms, missing parts and the intended national coverage. If using polygons, build proper shared-edge topology offline. Deduplicate **interior** province boundaries; exclude repeated coast/national strokes and unreviewed maritime claim lines. The output may contain many line features: 34 is the administrative-unit count, not a required line-feature count.

Preserve the existing Vietnam national/island geometry. Use a separate optional, abortable/lazy province asset; missing/late data cannot break the Earth or reattach to an old scene. Render above the Vietnam cap and below the gold national outline. Record the actual source-aware radial/depth behavior through deep zoom. Do not reuse a country class validator to misclassify province lines as international borders.

Source copy: `Ranh giới 34 tỉnh/thành hiện nay là lớp tham chiếu địa lý; không mô tả địa giới tại thời điểm sự kiện.` Include the actual source timestamp/approximation and appropriate credit. No historical-place renaming or event coordinate mutation follows from the modern layer.

If no candidate passes rights/currentness/topology checks, Task 05 reports the exact blocker and does not fabricate a fallback. Independent tasks can continue; province completion remains outstanding.

## Proposed new content

Retain `ho-chi-minh-1911-1941` unchanged in historical claims. Add:

- `mua-thu-doc-lap-1945`: Hanoi uprising → Huế → Sài Gòn → Hanoi/declaration; four sourced stops; connects to the current lesson 6 mapping subject to edition verification.
- `khang-chien-chong-phap-1946-1954`: Hanoi/Toàn quốc kháng chiến → Việt Bắc → Biên giới → Điện Biên Phủ → Genève; five sourced stops; current lesson 7 mapping subject to verification.
- `mua-xuan-1975`: Buôn Ma Thuột → Huế → Đà Nẵng → Sài Gòn; four sourced stops; current lesson 8 mapping subject to verification.

These are proposed sequences. Every date/summary/place/coordinate/precision needs readable provenance before registration; campaign areas use honest representative regional anchors. Do not copy textbook paragraphs or infer site coordinates from model memory. Store sources with publisher/author, access date, claim scope/locator and uncertainty. Unresolved material stays out of the selectable production registry with an explicit `needs_evidence` record.

Thematic stops are editorial sourced content and may lack a published detail event. Show a detail link only when its real slug occurs in the server-provided published inventory. Do not publish drafts or create database events just to populate journeys. Exploration filters are snapshotted; a journey uses its own authored sequence/period without silently filtering out its stops. Exit restores the prior exploration context.

## UI and budgets

A compact labeled native selector or equally accessible small chooser inside journey mode exposes four options; keep the existing two primary modes. No new route or dashboard is required. Real HTML stop/source links and a GET/link fallback support no-JavaScript reading. At 1280×720 all controls fit, with reading/source areas scrolling internally; verify the other three desktop sizes too.

Provisional additive budgets: province asset ≤200 KiB gzip, total runtime geographic JSON/GeoJSON ≤800 KiB (explicitly amending the previous 600 KiB only for this scope), added journey/UI JavaScript ≤60 KiB gzip, no new Earth imagery or runtime dependency. Existing image/texture budgets remain. Province/context route layers together target ≤3 additional draw calls and ≤6 MiB buffers; record actual geometry and enforce a ≤50,000-segment province artifact plus bounded authored routes. Lazy data must not delay core readiness.

Retain median rendered-frame interval ≤33.3 ms, p95 ≤50 ms in a disclosed 10-second camera run, and zero continuing idle/hidden draws after motion settles. Measure new interactions without concurrent test/build load; do not reuse prior report figures as new evidence.

## Execution and model handoff

Nine bounded tasks, one active agent at a time. The owner switches manually between GPT-6.1 Sol max and Gemini 3.8 Flash high according to the plan. The risk routing is a practical recommendation, not an empirical quality ranking or an instruction to spawn AI reviewers. Every handoff records verified contracts, changes, fresh checks, remaining work and the next allowed task in the progress record plus the required ignored local report.
