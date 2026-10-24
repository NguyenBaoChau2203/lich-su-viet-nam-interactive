# Curated History Globe — Proposed Design

**Date:** 2026-10-23 (Asia/Bangkok)

**Status:** Design and inline implementation approved by the owner on 2026-10-23, following review of this document and the visual concept. Exact historical journey records still require evidence during implementation; approval is not evidence for a date, coordinate, or route.

**Delivery scope of this document:** Approved design and feasibility research. Implementation progress and verification are recorded in the companion plan and local task report.

## Intent and sources of truth

Make geographical exploration of Vietnamese history the homepage's primary experience. The globe explains the relationship between events in Vietnam and relevant events abroad; the timeline explains their order. Revision and examination features remain secondary navigation destinations.

The owner's latest request takes priority over the previous raised tabletop and tiled-map homepage concepts. Preserve the existing event detail flow, including separately scoped simulations, artifacts, and people. This proposal replaces the homepage rendering direction only after approval; the previous specs remain records of their earlier scopes.

Read together with `AGENTS.md`, `docs/product/DESKTOP-UI-SCOPE.md`, and the existing fullscreen-map design. User-confirmed requirements:

- A globe rotates toward Vietnam and zooms in on entry.
- Events appear at their geographical locations and follow the selected time range.
- Users drag and zoom, select an event, read a short card, and open its detail page.
- Only curated Vietnamese geographical labels and relevant overseas event locations appear.
- An optional journey follows milestones in the life and work of Chủ tịch Hồ Chí Minh.
- The current target is laptop/PC, with keyboard access and reduced motion retained.

## Verified starting state

- `components/explorer/HistoryExplorer.tsx` currently composes a full-viewport Leaflet map, time controls, a collapsed event list, and one event card.
- `EventMap.tsx` requests OpenStreetMap raster tiles. Their printed labels and detail are part of the image pixels; removing individual labels requires replacing that basemap.
- The installed `maplibre-gl` dependency is declared as `^6.11.2`. The installed declarations expose `setProjection`; official documentation demonstrates a globe projection. No dependency upgrade is required by this proposal.
- `lib/queries/explorer.ts` supplies published events and associated locations, date precision, coordinate accuracy, and source counts. It does not supply an ordered person-journey model or country membership.
- `lib/explorer/map-view.ts` currently accepts zoom 4–18, which excludes a world overview. `map-state.ts` and detail-return URLs already preserve event and filter context.
- `public/maps/vietnam-tabletop.geojson` contains sourced national geometry that may be rendered as a flat surface on the globe. Its provenance records modern, generalized boundaries and no independent human cartographic sign-off.
- Local historical content includes departure and return event files and a new Paris-related 1919 draft. File existence does not establish publication or verification. No complete ordered journey dataset was found during this review.

These findings establish a plausible approach, not a completed globe integration or measured runtime performance.

## Approaches and recommendation

| Approach | Fit | Tradeoff |
| --- | --- | --- |
| One MapLibre globe with an owned minimal style and curated data layers | Recommended engineering choice. One geographic camera handles world view, Vietnam, event selection, and journey transitions. Reuses an installed dependency. | Replace the homepage's Leaflet adapter; verify globe label occlusion, camera transitions, and WebGL fallback in the actual app. |
| A custom Three.js globe | Allows custom spherical art direction. | Adds custom geographical picking, near-view behavior, label placement, camera fitting, and coordinate restoration without a demonstrated need for this design. Keep as a fallback only if an approved visual requirement cannot be met by the first approach. |
| Separate globe and Leaflet renderers | Reuses more of the current 2D map. | Two renderers and camera states complicate transitions, history restoration, accessibility, and lifecycle. Does not solve raster label clutter without also replacing the Leaflet basemap. |

Use MapLibre as the rendering engine, not its demo map style. Do not load the existing OpenStreetMap raster layer, a satellite texture, or an unrelated provider's label set. No new dependency is proposed. The owner has selected the visual direction; this engine choice is the agent's recommendation.

## Visual composition

- A full-viewport stage below the compact site navigation. One main heading, one compact time bar at the bottom, and small map controls. No permanent side dashboard or large event-card grid.
- Near-black navy space/ocean, subdued slate land, light parchment text, and restrained warm highlights for Vietnam and active events. Avoid neon, dense stars, realistic terrain textures, and raised/extruded country geometry.
- At world distance the Earth reads as a sphere. Near Vietnam, geography fills the useful viewport; the user need not keep the whole sphere visible. The same map owns both views.
- The initial text is short: `Lịch sử qua những địa danh`, then `Kéo để di chuyển · Cuộn để phóng to`. It must not obscure important markers or remain as a large promotional panel after selection.
- A single event card opens only after selection. It shows date/precision, title, place/accuracy, a concise summary, source information, close, and `Xem chi tiết`.
- Primary controls: `Toàn cầu`, `Về Việt Nam`, zoom in/out, `Khám phá`, and `Hành trình`. On an untouched view, a short hint replaces an empty event panel; it is not a second persistent sidebar.
- The generated visual preview is an art-direction/layout reference only. Do not use generated coastlines, boundaries, islands, or marker positions as application data. Final geography must come from the sourced assets.

## Entry and free exploration

1. On a fresh entry without restored state, display a world view oriented near Asia. After geographical assets are ready, gently rotate and approach Vietnam in approximately 3–4 seconds total.
2. Provide `Bỏ qua`. Any direct drag, wheel, keyboard map action, or event selection cancels the intro immediately and transfers camera control to the user. Do not keep rotating after arrival.
3. Returning from a detail page, opening a shared URL, or navigating back restores the saved view and selection and skips the intro. A session marker may prevent repeated introductions, but must not override a valid URL.
4. Wheel/trackpad zoom, drag, plus/minus, world reset, and Vietnam reset all work. Vietnam fitting respects the space taken by the time bar and an open event card.
5. Zooming out reveals international context; zooming in reveals useful local labels and separates overlapping event markers. Similar coordinates produce a selectable group rather than overlapping buttons.
6. Selecting a marker opens the event card. `Xem chi tiết` retains an allowlisted return URL. Closing the card restores focus to its origin. Events without usable coordinates remain reachable from the text list.
7. Time changes update event markers, overseas event labels, counts, and the text list together. The geography itself is not presented as a reconstruction of historical borders.

## Layer and label policy

| Layer | Contents | Visibility rule |
| --- | --- | --- |
| World context | Generalized land, ocean, and coastline geometry | Quiet background; no global city, road, business, transit, or POI labels. |
| Vietnam geography | Sourced national geometry, including the existing island coverage subject to provenance review | Highlighted sufficiently to locate Vietnam; modern illustrative outline is disclosed in map information. |
| Curated Vietnamese place labels | A small sourced set of useful geographical names, plus places related to visible events | Density increases with zoom. Do not display every administrative name simultaneously. |
| International event places | Places attached to the currently filtered published events | Label only relevant locations. No unrelated foreign cities. |
| Event markers | Published events with usable locations | Time-filtered; group overlaps; expose date/location uncertainty. |
| Journey | The active milestone, adjacent context, and an optional schematic connection | Enabled only for a selected, reviewed journey. |

The selected event or milestone label has priority. Resolve collisions with other labels; hide symbols on the far side of the globe. Important text remains available in ordinary HTML even when its map label is suppressed.

Do not classify a place as Vietnamese merely because it falls inside a rectangular bounding box. Use reviewed place metadata or sourced membership. Do not reuse modern administrative-center coordinates as exact historical event sites. Historical and modern place names may be shown together where supported by the record.

Use versioned geographic assets with publisher, URL, access date, license, checksum, and limitations. Review the existing Vietnam provenance before reuse. World land without political border detail is preferred. No new historical border reconstruction or cadastral accuracy is promised.

## Journey experience

Propose one first journey, `Hành trình của Chủ tịch Hồ Chí Minh`, focused on selected 1911–1941 milestones. This is a proposed editorial scope, not a claim to cover every place visited or every movement in those years.

- Entry is explicit through `Hành trình`; the introduction never starts a biographical tour automatically. Show only journeys with reviewed, available content.
- Each ordered stop has a short title, date/range with precision, place, concise sourced explanation, and source access. Link to a detail page only when a corresponding published event exists.
- Controls are `Bắt đầu`, `Tạm dừng` / `Tiếp tục`, `Mốc trước`, `Mốc tiếp`, a selectable milestone strip, and `Thoát hành trình`.
- The user may read one stop indefinitely. Automatic progression requires pressing play, leaves at least eight seconds of settled reading time per stop, and pauses when the page is hidden. Offer sufficient control to stop progression immediately.
- For long distances, zoom out, rotate/travel to the next region, then approach the stop. For nearby stops, make a shorter movement. Fade the text/card during replacement; do not repeatedly fade the entire world to black.
- Approximate timing: 2–4 seconds for long flights, under 1.5 seconds for nearby changes, and 160–220 ms for card transitions. These are design defaults to tune in browser, not measured results.
- Manual map input pauses playback and retains the active stop. Resuming returns to that stop and continues; seeking cancels any previous animation. Stale callbacks must not overwrite a newer selection.
- Keep the ordinary exploration filter as a separate snapshot while touring. Journey controls address the authored sequence even when its dates differ from that filter. Show the journey's date range; exiting restores the saved exploration state.
- Draw route connections as `Đường nối các mốc (sơ đồ)` unless a documented actual route supports more detail. Do not imply a ship sailed a straight arc over land or invent intermediate visits, transport, or exact dates.
- Do not infer physical presence from every event mentioning Hồ Chí Minh. Named campaigns, quotations, and posthumous commemorations are not travel stops.

## Historical content contract

A journey stop needs a stable ID and order, person/journey identity, place reference, date or range, precision status, explanatory text, source references, coordinate evidence and accuracy, and an optional related published event. Camera targets are presentation metadata, not evidence for historical coordinates.

Existing event and location records should be reused by reference where appropriate. Do not invent a new database architecture before checking those relationships. A versioned, sourced editorial registry can be an initial delivery choice; persist through the existing administration model only when the required workflow is designed.

The initial research found official material that supports developing the journey, including departure from Bến Nhà Rồng and later activity abroad. It does not independently establish every coordinate or certify the local event records. Before public delivery:

1. Select an ordered set of milestones and cross-check dates/places against reliable institutional or scholarly sources.
2. Separate verified, approximate, disputed, and editorial values. A city-level coordinate must be visibly approximate and must not zoom as if it were an exact building.
3. Record each source's scope, publisher, URL/document, access date, and evidence for the associated claim. Geography and historical presence may require different sources.
4. Validate related event publication and public visibility. Do not publish or alter Supabase data as part of an unapproved content import.

No new milestone, date, coordinate, or biographical claim is added to production by this design document.

## State, integration, and failure behavior

- Keep the server's published-event query and HTML list as the readable foundation. Load the interactive globe in a client boundary; follow the installed Next.js lazy-loading guide.
- Reuse date filtering, selected-event semantics, event detail-return handling, coordinate accuracy, and source indicators. Replace the homepage renderer and camera adapter rather than rewriting unrelated pages.
- Extend the map-view parser to support a bounded world zoom and the camera values actually used. Continue accepting old valid `ban-do` links. Validate optional journey and stop IDs against the available registry.
- Represent intro, free exploration, and paused/playing journey states explicitly. Exactly one owner may command the camera at a time; cancel pending transitions on new intent, navigation, and unmount.
- Save meaningful settled camera state, filters, selection, and journey/stop identity. Do not serialize every animation frame, transient fades, or playing state into the URL. Shared journey links open paused at the selected stop.
- No persistent render loop for idle rotation. Pause autoplay in a hidden tab, release map resources on unmount, and cap zoom to the accuracy/resolution of the available assets.
- If WebGL, the worker, or geometry fails, show a clear retry state with the HTML event list and time controls. Do not silently restore the detailed OSM basemap. If JavaScript fails, event links and source access remain usable.

## Accessibility and desktop constraints

Test CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080. Mobile/tablet layout work is deferred. Retain existing responsive support.

- Keyboard users can select every event and stop through HTML controls; map gesture simulation is not the only path. Focus is visible, and Escape dismisses an open card before unrelated actions.
- Use an ordinary labelled region for a nonmodal event panel; do not trap focus. Announce settled stop changes politely without reading every camera update.
- Meet WCAG AA text/control contrast. Do not communicate selection or coordinate uncertainty through color alone.
- With `prefers-reduced-motion`, skip the rotating intro and camera flights, switch views immediately, and keep manual milestone navigation. Disable automated tour progression by default. No essential information depends on movement.
- Use the map engine for geographical camera motion. Simple UI fades can use CSS or the existing UI motion system. No GSAP/ScrollTrigger is needed for this homepage.

## Implementation acceptance gate

An implementation plan can follow approval of this design. It must include tests and fresh evidence for:

1. Fresh entry → skippable/interruption-safe globe intro → Vietnam → event selection → card → detail → correct restored map. Old valid URLs remain usable.
2. Network/style inspection shows no detailed OSM raster tiles, demo basemap, satellite imagery, unapproved global labels, or new unnecessary map dependency.
3. Real geographic assets, attribution/provenance, readable selected labels, far-side symbol hiding, overlap handling, and the agreed label allowlist at world and local zoom.
4. Timeline filtering across the map/list/cards; unrelated overseas labels disappear; coordinate-free events remain reachable.
5. One reviewed journey: start, pause/resume, previous/next, arbitrary seek, manual-input interruption, hidden-tab pause, exit, shared stop URL, and cancellation of stale camera callbacks.
6. Source access and precision disclosure for every public milestone. No unsourced route, physical-presence assumption, or data publication is introduced.
7. Keyboard flow, reduced motion, no-JavaScript reading, failed geometry/worker/WebGL recovery, and desktop screenshots at all four viewports.
8. Performance evidence from a stated laptop/PC and browser, separating software-rendered automation from hardware measurements. Proposed target: at least 30 fps during normal movement on the declared reference device, no continuous idle spin, and geometry transfer initially budgeted at 500 KiB gzip. Measure engine/worker/other transfers separately; revise budgets with evidence before claiming they pass.
9. Fresh `pnpm verify`, focused read-only desktop browser tests, and a reviewed task diff. Do not run remote write-oriented E2E cases without an isolated or explicitly approved database target.

This design/research delivery does not claim those implementation gates have passed.

## Research references and remaining decisions

Accessed 2026-10-23:

- [MapLibre: vector globe example](https://maplibre.org/maplibre-gl-js/docs/examples/display-a-globe-with-a-vector-map/) — supports the feasibility of globe rendering; the example's demo style is not the proposed visual design.
- [MapLibre: projection specification](https://maplibre.org/maplibre-style-spec/projection/) — projection configuration and globe/near-view behavior. Verify the used options against the installed package during implementation.
- [MapLibre: globe atmosphere example](https://maplibre.org/maplibre-gl-js/docs/examples/display-a-globe-with-an-atmosphere/) — atmosphere capability; its imagery is not a proposed asset.
- [Natural Earth terms](https://www.naturalearthdata.com/about/terms-of-use/) and the existing `public/maps/vietnam-tabletop.provenance.json` — candidate geography and limitations; no new cartographic sign-off is claimed here.
- [Cổng thông tin Hồ Chí Minh: 30-year journey](https://hochiminh.vn/tin-tuc/chu-tich-ho-chi-minh-va-hanh-trinh-30-nam-tim-duong-cuu-nuoc-giai-phong-dan-toc-9013) (2023-06-06) — research starting point for biographical milestones, not coordinate evidence for every stop.

Owner review concerns the overall experience and layout. Remaining builder/research decisions are the exact curated Vietnamese label set, final reviewed journey stops, sourced world-land asset resolution, camera fitting values, and measured performance budgets. Document these choices and their evidence during the approved implementation; do not treat this list as authorization to invent historical content.
