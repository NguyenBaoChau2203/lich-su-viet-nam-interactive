# Vietnam 3D Map Explorer and Interactive Event Detail

**Homepage superseded on 2026-10-23:** After reviewing the implementation, the owner requested a full-viewport 2D geographic map with event positions and zoom/pan, without a tabletop or homepage 3D. Follow [the replacement homepage design](2026-10-23-fullscreen-history-map-design.md) and its plan. The event-detail simulation/artifact direction below remains applicable; do not use the earlier homepage acceptance criteria as the current contract.

Date: 2026-10-23.
Status: Accepted by the owner for implementation planning on 2026-10-23, after the tabletop clarification. The owner explicitly requested a detailed executable plan. Product implementation has not started.

Device scope updated by the owner on 2026-10-23: optimize and verify laptop/PC only, following [the current desktop UI scope](../../product/DESKTOP-UI-SCOPE.md). Mobile/tablet layouts and touch-specific acceptance checks are deferred. This changes device scope without starting product implementation.
Branch: codex/3d-map-design.

## Intent and source priority

The primary product is an interactive way to explore Vietnamese history within the chosen grade-12 curriculum. The homepage makes time and place directly explorable. Event pages provide deeper explanations, interactive reconstructions, historical objects, and relevant people.

The owner's latest messages replace the earlier galaxy-primary direction: the main surface is a raised tabletop model of Vietnam, with visible thickness and interactive rotation and zoom. The owner explicitly chose a simple diorama for the first version, with more detail available as a later extension. Mountains and measured topographic relief are not first-version requirements. The owner also clarified that the event simulation must run interactively in the browser, allowing scrubbing and camera changes, and should improve the existing Dien Bien Phu experience.

Sources, in priority order:

1. The owner's instructions in this chat, including the clarification about interactive playback.
2. AGENTS.md and approved product/design scope, where consistent with the latest request.
3. Existing academic reports and product documents as context, not as approval of outdated priorities.
4. Current application code and tests as evidence of existing behavior.

The earlier local galaxy research report remains a historical record. Its galaxy-primary recommendation is superseded by this request. The 2026-09-25 GIS design is explicitly pending review and does not establish a fixed 1945–1975 scope for this work.

## Confirmed owner requirements

- Show a raised 3D tabletop map of Vietnam on the homepage, with visible depth, rotation, and zoom.
- Keep the first map simple; reserve detailed topographic relief for a later extension.
- Show historical events at their relevant locations according to the selected time.
- Support wheel zoom and selecting events on the map.
- Open a concise event card when an event is selected.
- Open a dedicated event page through “Xem chi tiết”.
- Include an interactive event reconstruction that supports scrubbing and changing the viewpoint.
- Include related historical objects that can be examined in 3D.
- Include notable developments and relevant figures or heroes associated with the event.
- Improve the existing Dien Bien Phu simulation.
- Keep revision and exam preparation as secondary functions.
- Perform all work with one agent.

## Verified starting state

The current homepage is a learning dashboard, assembled in app/(public)/page.tsx from study-oriented home components.

The existing event route app/(public)/su-kien/[slug]/page.tsx loads published event detail and passes related events to EventDetailView. That shared view already presents sourced text, media, locations, people, and previous/next or same-topic navigation. It also serves administration previews, so public interactive enhancements must preserve the existing preview behavior.

The application already declares MapLibre GL and Three.js. components/mapfilm/MapFilmPlayer.tsx and runtime.ts already support:

- Play/pause and scene selection.
- Scrubbing within the current scene.
- Continuous or scene-by-scene playback.
- Free camera interaction and return to the authored camera.
- Narration, subtitles, fullscreen, and reduced motion.
- A fallback path when 3D cannot initialize.

The existing public/mapfilm/indochina-borders.geojson contains one MultiLineString feature with 12 line parts. It is linework, not a ready-to-extrude polygon dataset. It does not establish that a complete, validated Vietnam footprint is available for the new tabletop map.

tests/e2e/mapfilm.spec.ts contains browser cases covering those controls. Those test definitions were inspected; they were not executed as part of the requirements investigation.

There are six entries in the current interactive lesson catalog. This does not establish full curriculum coverage or six complete 3D simulations.

ResourceSection already organizes media into views that mount on demand. ModelViewer supports object inspection and hotspots. Other resource views distinguish real 3D scans from images with depth effects. The model catalog also contains procedural illustrations. These are different asset types and must retain accurate labels.

## Goals, boundaries, and failure conditions

Success means that a learner can choose a historical period, locate an event, understand its short explanation, and open an interactive detailed account while preserving orientation.

This design covers the public discovery and detail experience, plus necessary links to existing sourced content and media.

It does not authorize deleting current study features, replacing the application framework, changing external services, rewriting the Word reports, or claiming complete event/media coverage without an inventory.

A release fails the intended goal if the homepage still primarily directs people to textbook contents, exercises, progress, or purchase flows; if map markers cannot be interpreted chronologically; or if the detail page requires visiting several separate demonstration routes to understand one event.

A rendered still image, a depth-parallax photograph, or an autoplaying film alone does not satisfy the requested interactive reconstruction.

## Approaches and proposed implementation decision

### Recommended: a standalone Three.js tabletop map

Use the installed Three.js to construct a raised geographic model from a reviewed Vietnam footprint. Extrude the footprint to give it visible thickness and side faces, then add materials, light, shadow, and bounded camera controls. Event markers and readable HTML labels sit on the model's top surface.

The first version uses a simple top surface, not a country-wide elevation model. It does not need online map tiles, satellite imagery, street-map navigation, or MapLibre for the homepage.

This is the proposed technical implementation of the owner's chosen simple diorama. Existing event data, detail URLs, accessible UI patterns, object viewers, and appropriate simulation components remain reusable.

### Alternative: MapLibre terrain as the primary surface

MapLibre remains useful for geographically tiled navigation and elevation terrain, including the current Dien Bien Phu player. It supports actual 3D terrain, but that capability is not a requirement to render an extruded tabletop object. It is therefore optional for existing event-specific experiences, not the required homepage renderer.

This revision replaces the earlier MapLibre-first recommendation, which assumed a general geographic terrain viewer before the desired map shape was clear. Do not remove the installed library or rewrite an existing simulation merely to change the homepage renderer.

### Assessed authoring aid: img2threejs

The owner supplied https://github.com/img2threejs/img2threejs. Its README, architecture, package metadata, and skill instructions describe an agent-assisted workflow that reconstructs reference objects as procedural Three.js code and reviews rendered comparisons in stages. The output includes a Three.js Group factory; it is not itself a runtime geographic map engine.

This workflow can help author illustrative objects, structures, and diorama props. For the simple national map, a reviewed vector footprint plus Three.js extrusion is a more direct starting point. Reference-image interpretation must not replace authoritative geographic coordinates or silently generate a coastline, a boundary, or precise terrain.

No img2threejs installation or reconstruction was performed during the assessment. Its visual fidelity, performance, and compatibility with the project's full authoring workflow remain untested. The base workflow documents Node.js 18+ and Python 3.10+ requirements. Installation alone does not create any models.

The galaxy-primary option was considered earlier and is superseded by the chosen geographic tabletop model.

## Tabletop model construction

1. Obtain a sourced and reviewed geographic footprint with valid closed polygon rings, including the required disconnected parts. A reviewed SVG can also supply the shape if its coordinate transformation is explicit.
2. Use one projection and coordinate normalization for both the footprint and event locations. Do not fit event markers by eye to an image-generated silhouette.
3. Construct an extruded Three.js shape with a simple top, side walls, and visible thickness. Any edge treatment must preserve the reviewed geographic outline at the intended map scale.
4. Place markers on the top surface using the same coordinate transform. Attach labels and concise cards through accessible HTML.
5. Provide bounded orbit, zoom, and reset controls. Do not permit ordinary navigation to flip the tabletop upside down or lose the model off screen.
6. Drive marker visibility from the existing historical time filters and shared event identities.
7. Keep the geographic coordinate transform separate from visual height. A later terrain layer can change surface height while retaining the event identities and geographic positions.

The first prototype should verify the recognizable map outline, visible side depth, rotation, zoom, marker alignment, and time-filter behavior before adding decorative props or expensive effects. The raised base is an illustrative presentation and does not claim measured terrain.

## Homepage journey

### Overview

The map occupies the main viewport below a compact header. Time controls and a readable event list accompany it. Validate the composition at desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080, including the available height for the map and controls.

Proposed primary navigation: “Khám phá”, “Tư liệu”, and “Ôn tập”, with existing account and administration access retained where applicable. Revision controls must not dominate the map.

An initial oblique view frames the raised Vietnam model, makes its thickness visible, and provides readable context for the selected period. The product does not enter fullscreen automatically and does not play audio on arrival.

### Time selection

The proposed control supports a labeled period or year range, previous/next navigation, and explicit dates. It uses the curriculum-approved event inventory rather than a hard-coded period from an older prototype.

Events with date intervals are included when their intervals overlap the selection. Date precision and approximate ranges remain visible. Unknown dates must not be silently invented to position an event.

The historical time control is separate from the elapsed simulation time on the detail page.

Changing the time updates both the map and textual event list. It does not unexpectedly fly the camera away while the learner is examining a region. If a selected event falls outside the new filter, its card closes with a clear result update.

### Navigation and selection

- Wheel and trackpad zoom change map scale.
- Left dragging orbits; modified/right dragging pans. Rotation and tilt also have visible controls; preserve usable bounds.
- Zoom buttons and keyboard alternatives support users who cannot use gestures.
- Markers are grouped when multiple events cannot be selected distinctly at the current scale.
- Selecting a group zooms toward it or exposes a readable event chooser.
- Events at the same location remain individually selectable.
- Selecting an event opens its card; dragging the map must not count as a marker click.
- Closing the card preserves the time filter and camera position.

Locations come from the same event identity and sourced relationships used by the detail page. Multi-location events can highlight more than one place. Events outside the initial geographic view remain discoverable through the event list and an appropriate expanded map extent.

The first-version tabletop uses a reviewed footprint and illustrative materials. If present-day imagery or administrative boundaries appear in another view, filtering by a historical year must not imply that those layers reconstruct that year.

### Summary card

Show the event title, sourced date label, place name, two or three concise sentences, an image when available, and a clear “Xem chi tiết” link. Source and uncertainty information must remain reachable.

The card is a concise HTML panel, not a second article. On laptop/PC it can accompany the map as a side panel; it must leave the map controls usable, including at 1280×720. A separate mobile bottom panel is deferred.

Hover may provide a short hint, but is not required to access the content.

### URL and return journey

The URL records the meaningful period, filters, and selected event. Map camera restoration may use a validated URL representation or navigation state, as settled during implementation.

“Xem chi tiết” opens the existing /su-kien/[slug] route. Returning to exploration restores the time, selection, and viewpoint. A directly opened event URL provides a useful return link even without prior explorer state.

## Event detail journey

### Shared event narrative

Use one dedicated event page as the public destination for that event. Its content supports:

- A short orientation with title, date, location, and context.
- The interactive reconstruction.
- Readable background, developments, outcome, and significance as appropriate to the event.
- Historical objects and their use or relevance.
- Notable moments and relevant figures with sourced relationships.
- Related events and source references.

Diplomatic, political, social, and military events need appropriate treatments; the content model must not require every event to resemble a battle.

### Interactive reconstruction

The player remains a real browser-rendered scene. It provides play/pause, direct scene or historical milestone selection, scrubbing, camera changes, and a clear way back to the guided viewpoint.

The authoritative historical narrative and sources remain available as text when a GPU, media asset, or network dependency fails.

Heavy viewers load when activated. Opening an artifact must pause or suspend the simulation's rendering as appropriate. The page must not maintain multiple expensive animated viewers without a demonstrated need.

### Historical objects

Each object has a title, relevance to the event, a description, sources, and asset attribution. A ready 3D object supports rotation, zoom, reset view, and meaningful hotspots where authored.

A scan of an actual object, an illustrative procedural model, and a photograph with a depth effect must remain distinctly labeled. A depth photograph does not fulfill a promised full 3D object.

Object availability is recorded per event. Missing assets are content work, not evidence that a viewer feature has been completed for the whole curriculum.

### Notable moments and people

Notable moments point to an authored part of the event chronology and can seek the reconstruction to the matching scene when a mapping exists.

A person card explains the individual's specific role in the event, supported by sources. The display label “anh hùng” requires appropriate historical support. This design does not require a 3D reconstruction of every person's face.

Related events remain distinct from moments occurring within the selected event.

## Proposed Dien Bien Phu improvements

These proposals build on existing controls; basic playback, scrubbing, and free camera are already implemented.

1. Add a campaign-wide navigator labeled by historical developments, with the current scene and elapsed playback position shown clearly.
2. Distinguish “Theo diễn biến” from “Tự khám phá” in the player UI. Changing the viewpoint preserves the historical moment. Returning to the guided view does not restart the story.
3. Offer authored camera presets such as overview, overhead, and an appropriate oblique view. A target-specific view is available only when there is an authored object or location to inspect.
4. Make authored locations or objects selectable. Selection opens a concise explanation and relevant links to an artifact or figure.
5. Link notable moments to the simulation position rather than maintaining an unrelated reading list.
6. Keep current labels, active locations, text explanation, and object states synchronized when scrubbing backward or forward. Repeated seeks must produce the same scene state.
7. Coordinate narration, captions, audio, and scene state during seeking and playback changes.
8. Reduce competing overlays at the shortest supported laptop viewport, 1280×720, and ensure that information panels do not cover essential controls or the active point of interest.
9. Preserve the existing reduced-motion, no-WebGL, network-error, cleanup, and hidden-page behavior while measuring rendering cost on real target devices.

Additional battle actions, troop paths, dates, or historical details require research and editorial review. Visual improvements must not invent undocumented tactical precision.

## Content and integration inventory

Before expanding to every required event, record:

- Published event identifier and curriculum placement.
- Reviewed polygon or SVG footprint and its geographic projection for the tabletop map.
- Date interval, precision, locations, and provenance.
- Availability and editorial status of a simulation script.
- Historical-to-playback milestone mapping.
- Available 3D objects and their asset type, attribution, and relationship to the event.
- Notable moments, relevant people, and supporting sources.
- Missing content required for the promised experience.

The first implementation can prove the full journey with Dien Bien Phu, which already has authored material. This is an implementation order, not a reduction of the requested curriculum-wide target. Full coverage must be tracked separately and cannot be declared complete from one demonstration.

For an initial slice, existing typed event data and authored media registries can supply the integration. Do not introduce new database abstractions or migrations until an identified gap requires them.

Existing public publication rules and administration previews continue to apply. Interactive media cannot expose an unpublished linked record through a public event.

## Observable acceptance criteria

1. Opening / presents a raised Vietnam tabletop model with visible depth as the primary interaction; a tilted flat map alone does not fulfill this requirement.
2. Changing the selected period updates the visible markers and event list consistently.
3. Date intervals, approximate dates, and multiple locations retain their actual semantics.
4. Rotation, wheel/trackpad zoom, button zoom, reset view, and event selection work with mouse/trackpad and keyboard alternatives. The camera remains within usable viewing bounds; touch-specific behavior is deferred.
5. Multiple events at the same point remain individually accessible.
6. A marker opens the matching concise card; its detail link opens the corresponding event route.
7. Returning from detail restores the useful exploration context.
8. The Dien Bien Phu player exposes existing playback capabilities within the integrated event journey.
9. A learner can seek a historical milestone, change the viewpoint, and return to guided camera without losing the selected moment.
10. An authored hotspot opens matching information and related resources.
11. A ready historical object supports real 3D inspection; its asset type and provenance are visible.
12. The narrative, important controls, and sources remain accessible without motion or WebGL.
13. Verify the full journey at desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080, with mouse/trackpad and keyboard interactions. Mobile/tablet and touch-specific checks are deferred.
14. Run focused unit and browser cases for date filtering, selection, URL restoration, simulation seeking, camera mode, and resource switching, followed by pnpm verify and the relevant E2E suite.
15. Measure loading and interaction performance on a stated browser and device. Establish budgets in the implementation plan before adding high-cost effects. Existing software-rendered browser tests are behavior evidence, not a GPU performance benchmark.

## Review status and next step

This document records the confirmed product direction and proposed implementation decisions. After choosing a simple tabletop map, the owner accepted proceeding to a detailed execution plan on 2026-10-23. The planning deliverable does not itself start product implementation.

Write the implementation plan in this order: homepage map–time–card–detail journey; integrated Dien Bien Phu detail and player improvements; then event/media inventory expansion. Execution remains single-agent and checkpoint-based under AGENTS.md.

No production code, dependency, database, service, or historical claim is changed by this document.

## References

Local starting-state sources:

- app/(public)/page.tsx.
- app/(public)/su-kien/[slug]/page.tsx.
- components/content/detail/EventDetailView.tsx.
- components/mapfilm/MapFilmPlayer.tsx and runtime.ts.
- components/lesson/sections/ResourceSection.tsx.
- components/model3d/ModelViewer.tsx.
- lib/lessons/index.ts and catalog.ts.
- lib/mapfilm/types.ts.
- public/mapfilm/indochina-borders.geojson, inspected as linework rather than a complete polygon footprint.
- tests/e2e/mapfilm.spec.ts.
- docs/product/MVP-SCOPE.md and docs/product/VIDEO_STORYTELLING_FEASIBILITY.md.
- .agents/skills/design-history-story/SKILL.md and research-history-sources/SKILL.md.

Official technical references consulted in the preceding research in this chat:

- [MapLibre Three.js integration example](https://maplibre.org/maplibre-gl-js/docs/examples/add-3d-tiles-3d-objects-and-models-using-threejs/).
- [Three.js responsive design](https://threejs.org/manual/pages/responsive.html).
- [Three.js rendering on demand](https://threejs.org/manual/pages/rendering-on-demand.html).

Additional primary sources reviewed for the tabletop clarification on 2026-10-23:

- [Three.js ExtrudeGeometry](https://threejs.org/docs/pages/ExtrudeGeometry.html): constructs a volume from a path shape, with configurable depth.
- [Three.js SVGLoader](https://threejs.org/docs/pages/SVGLoader.html): reads SVG paths for a possible reviewed vector-shape input.
- [MapLibre 3D terrain example](https://maplibre.org/maplibre-gl-js/docs/examples/3d-terrain/): explains the capability behind the earlier geographic-terrain proposal.
- [img2threejs README](https://github.com/img2threejs/img2threejs#readme).
- [img2threejs architecture](https://github.com/img2threejs/img2threejs/blob/main/docs/ARCHITECTURE.md).
- [img2threejs package metadata](https://github.com/img2threejs/img2threejs/blob/main/package.json).
- [img2threejs authoring workflow](https://github.com/img2threejs/img2threejs/blob/main/SKILL.md), read as external project documentation, not installed or activated.

These sources establish available capabilities and technical considerations. The proposed information hierarchy and interaction choices are design judgments grounded in the owner's request.
