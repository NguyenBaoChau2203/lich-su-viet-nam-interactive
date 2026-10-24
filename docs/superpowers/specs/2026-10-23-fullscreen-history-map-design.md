# Full-viewport History Map Design

Date: 2026-10-23.
Status: Implements the owner's explicit correction after reviewing the tabletop homepage. The homepage is now a two-dimensional geographic map. This supersedes the raised tabletop requirements for the homepage in the earlier 3D explorer design; the event-detail simulation direction remains applicable.

## Intended experience

The map fills the entire content viewport below the existing 65-pixel navigation header. No centered card, raised model, fixed event-list column, or footer competes with the initial map. Laptop/PC is the current device scope in `docs/product/DESKTOP-UI-SCOPE.md`.

Users see Vietnam and published event locations immediately, drag the map, and use wheel/trackpad, buttons, or keyboard to zoom toward an event. A compact introduction and optional event list float above the map. A compact time control occupies the bottom edge. Selecting an event opens a concise floating card with date, location accuracy, summary, available image, source count, and “Xem chi tiết”. The dedicated event route remains the reading/simulation destination.

## Implementation decisions

Reuse the installed Leaflet/react-leaflet libraries and the existing OpenStreetMap tile source used by `/ban-do`. This is an engineering choice: it supports the requested flat map and existing coordinate records without introducing a dependency or requiring WebGL. The earlier extruded Three.js implementation remains unused by the homepage; event simulations and 3D artifact viewers are retained.

Keep the existing published explorer query and inclusive interval filter. Never add coordinates for missing locations. Events without coordinates remain accessible in the readable list. Group overlapping markers in screen space; clusters preserve distinct event identities, offer individual selection, and allow closer zoom. Approximate/region/unknown locations keep their labels and distinct marker styling.

Preserve years, selected event, geographic center, and zoom in allowlisted URL parameters. Ignore legacy 3D camera parameters on this homepage. The detail link carries safe return context; “Trở lại bản đồ” restores it. Browser Back/Forward updates the visible explorer. Selecting an event outside a later date filter clears that selection.

Lazy-load the browser map inside a Client Component. Keep readable links in server-rendered HTML, including without JavaScript. A failed basemap shows an explanation while geographic markers and the list remain usable. Published content is not described as independently verified merely because it is published.

## Acceptance

1. At 1280×720, 1366×768, 1440×900, and 1920×1080, the map fills the viewport below the header with no horizontal overflow or homepage footer scroll.
2. No Three.js canvas, tabletop asset request, or elevated model appears on the homepage.
3. Actual published locations appear as selectable event markers/clusters. Wheel/button zoom, dragging, and keyboard controls work; controls and attribution remain visible.
4. A marker/list selection opens the matching event summary, and its detail link opens the existing matching event route. Shared locations do not hide individual events.
5. Date changes filter both map and list; empty results and events without coordinates remain understandable. Date/location uncertainty remains visible.
6. URL reload, browser navigation, and the event-detail return link preserve date selection, selected event, and center/zoom. Malformed or external return destinations are rejected.
7. Keyboard access, visible focus, reduced motion, failed tiles/data, and no-JavaScript reading alternatives work.
8. Fresh focused tests, desktop browser evidence, `pnpm verify`, scoped diff review, and an ignored local task report support the handoff.

## Out of scope

Mobile/tablet optimization, new historical records, database/schema changes, new dependencies or map providers, simulation rewrites, Word-report changes, and external publication.
# Homepage rendering direction superseded

The owner approved the [curated globe design](2026-10-23-curated-history-globe-design.md) on 2026-10-23. This document records the earlier fullscreen raster-map implementation; preserve its reusable event/filter/detail behavior, but use the newer design for homepage rendering and journeys.
