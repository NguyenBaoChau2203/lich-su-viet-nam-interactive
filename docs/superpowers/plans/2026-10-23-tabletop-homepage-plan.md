# Tabletop Homepage Implementation Plan

> For agentic workers: use superpowers:executing-plans inline. One agent only. Do not dispatch workers or reviewers.

**Goal:** Deliver checkpoints A and B: a real raised Vietnam map followed by the complete time–marker–card–detail journey.

**Architecture:** One published-data server query feeds an SSR-readable client explorer. A lazy Three.js runtime renders the tabletop and projects markers; pure modules own dates, geographic projection, grouping, and URLs.

**Tech stack:** Existing Next.js, Three.js, TypeScript, Supabase public client, Vitest, Playwright.

**Spec:** ../specs/2026-10-23-3d-vietnam-map-explorer-design.md.
**Master:** 2026-10-23-tabletop-explorer-implementation-plan.md. Inherit all global constraints, budgets, review focus, Git rules, and checkpoint gates.

**Device scope:** Laptop/PC only: 1280×720, 1366×768, 1440×900, and 1920×1080 CSS viewports, with mouse/trackpad and keyboard. Mobile/tablet layouts and touch-specific checks are deferred per the master's desktop scope.

## Shared contracts

Create lib/explorer/types.ts during A2. Reuse EventSummary, DatePrecision, and AccuracyLevel from the existing modules.

~~~ts
type GeoBounds = { west: number; east: number; south: number; north: number };
type PointXZ = { x: number; z: number };
type LinearRing = readonly (readonly [number, number])[];
type PolygonCoordinates = readonly LinearRing[];
type MapGeometry =
  | { type: "Polygon"; coordinates: PolygonCoordinates }
  | { type: "MultiPolygon"; coordinates: readonly PolygonCoordinates[] };
type MapFootprint = { type: "FeatureCollection"; features: readonly {
  type: "Feature"; properties: { partId: string; sourceId: string }; geometry: MapGeometry;
}[] };
type MapProjection = {
  project(lng: number, lat: number): PointXZ;
  unproject(point: PointXZ): [number, number];
};
type ExplorerLocation = {
  slug: string; name: string; historicalName: string | null;
  latitude: number | null; longitude: number | null;
  accuracyLevel: AccuracyLevel; accuracyNote: string | null;
  isPrimary: boolean; role: string | null;
};
type ExplorerEvent = EventSummary & {
  id: string; startYear: number; endYear: number | null;
  locations: ExplorerLocation[]; sourceCount: number;
};
type CameraView = {
  azimuth: number; polar: number; distance: number;
  targetX: number; targetZ: number;
};
type ExplorerState = {
  from: number; to: number; selectedEvent: string | null;
  view: CameraView | null;
};
type ExplorerLimits = {
  minYear: number; maxYear: number; eventSlugs: readonly string[];
};
type MarkerAnchor = {
  key: string; eventSlug: string; locationSlug: string;
  position: PointXZ; accuracyLevel: AccuracyLevel;
};
type ProjectedAnchor = MarkerAnchor & { screenX: number; screenY: number; visible: boolean };
type MarkerGroup = { key: string; members: ProjectedAnchor[]; screenX: number; screenY: number };
~~~

Export each type. Geographic tuples in footprint data are [longitude, latitude]; current battle tuples are [latitude, longitude]. Never share them implicitly.

## Task A1: source and validate the geographic footprint

**Files:** Create public/maps/vietnam-tabletop.geojson, public/maps/vietnam-tabletop.provenance.json, docs/content/vietnam-tabletop-map-sources.md, tests/unit/explorer-footprint.test.ts. Modify AGENTS.md, docs/product/MVP-SCOPE.md, .agents/skills/build-map-timeline-slice/SKILL.md, and design-history-story/SKILL.md only to align their old 3D defaults with this approved scope.

**Interfaces:** Produce a FeatureCollection containing only Polygon/MultiPolygon geometry in WGS84 longitude/latitude order, with stable partId and sourceId properties. Produce provenance fields sourceUrl, dataUrl, publisher, accessedAt, license, scope, limitations, sha256, and reviewEvidence. Do not fabricate a human reviewer or approval.

- [ ] Record the current branch, dirty/untracked baseline, and target-file ownership. Do not reconstruct the app from HEAD.
- [ ] Write failing footprint tests: every ring is closed, has at least four points, contains finite valid coordinates, has nonzero area, and references a documented sourceId; geometry is polygonal, not MultiLineString.
- [ ] Run pnpm exec vitest run tests/unit/explorer-footprint.test.ts. Expect failure because the reviewed asset does not exist.
- [ ] Research a primary geographic source and its reuse terms. Verify outline, disconnected parts, required islands, and relevant scope. Keep uncertain geometry unapproved; do not trace an AI-generated image or blindly close existing linework.
- [ ] Prepare the scoped asset and record the exact transformation/simplification, input version/hash, source coverage limits, access date, and visual inspection evidence. Simplification must preserve required parts and topology.
- [ ] Update the four scope/skill files narrowly: this approved tabletop is a core feature; unrelated 3D, quizzes, accounts, and games still need separate scope. Preserve all provenance and accessibility rules. Do not edit plugin-wide skills or Word reports.
- [ ] Rerun the footprint test; expect all assertions passed. Compare the footprint to its sources visually and check the 200 KiB compressed budget. Record a blocker if scope or reuse rights are unresolved.
- [ ] Self-review the diff and make an eligible docs/data commit under the master's baseline rule.

**Acceptance:** A source-checked usable footprint exists; required parts are accounted for; no claim that linework alone was sufficient. If this gate cannot pass, A is incomplete; safe A2 logic work may continue but the real-map handoff cannot.

## Task A2: published event data, date semantics, projection, and URLs

**Files:** Create lib/queries/explorer.ts; lib/explorer/{types,projection,filters,url}.ts; tests/unit/{explorer-query,explorer-state,explorer-projection}.test.ts.

**Interfaces:**
- getExplorerEvents(): Promise<ExplorerEvent[]> in lib/queries/explorer.ts.
- getExplorerLimits(events: readonly ExplorerEvent[]): ExplorerLimits | null and filterExplorerEvents(events: readonly ExplorerEvent[], from: number, to: number): ExplorerEvent[] in filters.ts.
- createMapProjection(bounds: GeoBounds, maxSpan?: number): MapProjection in projection.ts; maxSpan defaults to 100.
- parseExplorerState(params: URLSearchParams, limits: ExplorerLimits): ExplorerState and buildExplorerUrl(state: ExplorerState): string in url.ts.
- buildEventDetailHref(slug: string, state: ExplorerState): string and getExplorerReturnHref(value: unknown, fallbackSlug: string): string in url.ts.

- [ ] Write failing tests for the new query mapper using a mocked public client. Cover published-only parent filtering, null/unpublished embedded locations and sources, all valid locations, numeric zero coordinates, and no N+1 detail queries.
- [ ] Write the pure failing assertions below using explicitly synthetic events and coordinates.
~~~ts
expect(filterExplorerEvents([syntheticSpan(10, 20)], 20, 25)).toHaveLength(1);
expect(filterExplorerEvents([syntheticSpan(10, 20)], 21, 25)).toHaveLength(0);
expect(filterExplorerEvents([syntheticSpan(10, null)], 11, 25)).toHaveLength(0);
const [longitude, latitude] = projection.unproject(projection.project(2, 3));
expect(longitude).toBeCloseTo(2, 8);
expect(latitude).toBeCloseTo(3, 8);
~~~
syntheticSpan is a local test fixture factory, not a product API. Null endYear filters only by the known start year; it does not mean “ongoing”.
- [ ] Add URL cases: reversed/invalid/out-of-bounds years reset the full known range; an unknown selected slug becomes null; absent camera stays null; malformed/nonfinite camera is ignored. getExplorerReturnHref rejects https:, //host, backslashes, other pathnames, and unrecognized parameters.
- [ ] Run pnpm exec vitest run tests/unit/explorer-query.test.ts tests/unit/explorer-state.test.ts tests/unit/explorer-projection.test.ts; inspect the expected failures.
- [ ] Implement one server-only published query following events.ts and event-detail.ts. Select id, summary fields, start_year, end_year, all event_locations coordinates/precision/status, and public event_sources. Reuse toEventSummary and existing parsers. Exclude unpublished embedded records; do not derive “verified” from “published”.
- [ ] Implement inclusive interval intersection. Expose no-location events in the list; never substitute a modern city center. Empty data returns null limits and null initial state; render a clear empty/error message with disabled time controls instead of a fabricated historical year range.
- [ ] Implement the shared projection with east +X/north -Z and inverse round-trip. Center on the footprint bounds; do not include Three.js or database imports in pure modules.
- [ ] Implement the master's URL keys and bounds. Reject nonfinite camera values, polar/distance outside their limits, and target magnitudes above 70 world units; the runtime further clamps targets to the actual narrower model bounds plus 20. Keep URL length for camera data bounded; getExplorerReturnHref reconstructs only a root-relative explorer URL from allowlisted parameters, defaulting to /?su-kien=<validated event slug>.
- [ ] Rerun all three tests, pnpm typecheck, inspect query count and type serialization, then self-review and make an eligible commit.

**Acceptance:** Range events, uncertain/no-location events, multiple places, and malformed URLs have explicit semantics. No runtime schema migration or secret client is introduced.

## Task A3: real 3D tabletop, lifecycle, and first homepage integration

**Files:** Create components/explorer/{tabletop-mesh,runtime}.ts, {HistoryExplorer,TabletopStage,ExplorerEventList}.tsx; tests/unit/explorer-mesh.test.ts; tests/e2e/tabletop-foundation.spec.ts. Modify app/(public)/page.tsx.

**Interfaces:**
- buildTabletopMesh(footprint: MapFootprint, projection: MapProjection): THREE.Group and disposeTabletopMesh(root: THREE.Group): void in tabletop-mesh.ts; top Y=3, base Y=0.
- createTabletopRuntime(options: TabletopRuntimeOptions): Promise<TabletopRuntime> in runtime.ts.
- TabletopRuntimeOptions: canvas: HTMLCanvasElement, footprint: MapFootprint, reducedMotion: boolean, onViewChange(view: CameraView): void, onLayout(anchors: ProjectedAnchor[]): void, onContextLost(): void.
- TabletopRuntime methods: setAnchors(anchors: readonly MarkerAnchor[]): void; setView(view: CameraView): void; getView(): CameraView; zoom(factor: number): void; rotate(deltaAzimuth: number, deltaPolar: number): void; reset(): void; resize(): void; setVisible(visible: boolean): void; dispose(): void.
- HistoryExplorer consumes serializable events, limits: ExplorerLimits | null, initialState: ExplorerState | null, and an optional dataError message. TabletopStage owns browser initialization and cleanup.

- [ ] Write failing mesh tests using a synthetic polygon with a hole and a separate island: every part survives, vertices are finite, Y spans 0–3, north/east orientation matches projection, and repeated disposal is safe.
- [ ] Run pnpm exec vitest run tests/unit/explorer-mesh.test.ts and confirm failure.
- [ ] Implement extrusion without a new dependency. Shape XY uses x and -z, then rotate -PI/2 around X so extrusion points upward and geographic north stays -Z. Preserve holes/winding and required disconnected parts.
- [ ] Implement bounded OrbitControls, aspect-aware fit, capped pixel ratio, resize handling, render-on-demand, hidden-page suspension, and disposal of controls/listeners/observers/geometries/materials. Use bounded change/damping frames only; no idle auto-rotation.
- [ ] Make TabletopStage lazily import the runtime inside the client boundary. Handle stale async initialization after unmount. Keep readable loading/error/no-WebGL states and the event list in prerendered HTML.
- [ ] Replace the old home dashboard composition with the explorer. Read searchParams as a Promise under installed Next.js conventions. Load public events on the server; preserve unstable_rethrow in catches. Database failure shows one clear message and a usable map/fallback, not fabricated events.
- [ ] Add browser assertions: visible raised side faces from the initial angle, rotation/zoom/reset, camera limits, no external tile/DEM requests for the homepage, keyboard buttons, resize, reduced motion, context loss, retry, and JavaScript-disabled event links. The foundation test must not require staff credentials.
- [ ] Run pnpm exec vitest run tests/unit/explorer-mesh.test.ts, pnpm verify, then pnpm exec playwright test tests/e2e/tabletop-foundation.spec.ts. Expect all required foundation cases to run and pass.
- [ ] Capture actual screenshots at desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080. Review geographic shape, thickness, and control visibility, not only test attributes. Self-review and make an eligible commit.

**Checkpoint A:** Report footprint evidence, data contract tests, real model screenshots, cleanup behavior, and current limitations. It is a foundation checkpoint, not the completed selection journey. Stop here when executing the supplied Checkpoint A prompt.

## Task A4: time controls, marker groups, summary card, and return state

**Files:** Create components/explorer/{TimeNavigator,EventPreviewCard}.tsx, lib/explorer/markers.ts, tests/unit/explorer-markers.test.ts, tests/e2e/tabletop-explorer.spec.ts. Modify HistoryExplorer, TabletopStage, runtime, ExplorerEventList, and the event detail route.

**Interfaces:**
- buildMarkerAnchors(events: readonly ExplorerEvent[], projection: MapProjection): MarkerAnchor[] in markers.ts; key = eventSlug + @ + locationSlug.
- groupScreenMarkers(anchors: ProjectedAnchor[], radiusPx?: number): MarkerGroup[]; default radius 28.
- EventPreviewCard consumes the same ExplorerEvent as the list, selected location, and a detail href from buildEventDetailHref.
- The detail route consumes getExplorerReturnHref and provides a back link; do not create an arbitrary redirect endpoint.

- [ ] Write failing grouping tests: same-point different events stay individually selectable; one event at two locations keeps one event identity; invalid/null coordinates are omitted; stable group ordering survives input reordering; hidden anchors do not create visible groups.
- [ ] Extend state tests for inclusive bounds, a selected event leaving the range, URL round-trip with camera, invalid camera fallback, and sanitized return destinations. Run the targeted unit tests and inspect failures.
- [ ] Implement the two labeled native time controls and “Toàn bộ”; a crossing bound moves the other bound to the changed year. Filter map and list from the same array; clear a now-invisible selection with a polite announcement.
- [ ] Project marker anchors through the actual runtime camera. Use reachable HTML buttons/labels tied to real positions; recompute grouping after view changes without a continuous React update loop.
- [ ] Group activation fits the members or opens an event chooser when positions coincide. A drag beyond five CSS pixels is not an event click. Keep selection possible by mouse/trackpad and keyboard; do not require hover. Touch-specific controls are deferred.
- [ ] Show date/precision, selected place, image if available, two or three concise sentences, and “Xem chi tiết”. Show the existing source count accurately without inventing a verification badge.
- [ ] Replace URL state without per-frame server requests. Snapshot camera on control end with the master debounce; detail links carry the allowlisted explorer context. Browser Back and the explicit back link restore it.
- [ ] Add E2E cases using the existing published Dien Bien Phu event: select period, select event, read card, open /su-kien/chien-dich-dien-bien-phu, return, and assert period/event/camera restoration. Include empty range, stale URL, overlapping markers, Escape/focus return, and a card/panel that leaves map controls usable at 1280×720. Do not add a mobile bottom panel for this checkpoint.
- [ ] Run pnpm exec vitest run tests/unit/explorer-state.test.ts tests/unit/explorer-markers.test.ts; pnpm verify; pnpm exec playwright test tests/e2e/tabletop-foundation.spec.ts tests/e2e/tabletop-explorer.spec.ts. A missing published pilot event is an explicit unmet prerequisite, not a silent skip.
- [ ] Review source date/coordinate precision in the real browser; self-review and make an eligible commit.

## Task A5: primary navigation, old journeys, accessibility, and discovery gate

**Files:** Modify components/layout/nav.ts, Header.tsx, MobileTabBar.tsx, Footer.tsx only where the shared nav requires; adapt components/home/CoachMarks.tsx. Modify tests/e2e/{public,sgk,ui-v2,a11y}.spec.ts where they assert the replaced dashboard. Add tests/e2e/tabletop-quality.spec.ts.

**Interfaces:** Retain existing NavGroup IDs and activeGroup API. Order kham-pha first, label hoc as “Tư liệu”, retain on-tap as “Ôn tập”; / belongs to kham-pha. Study routes and search remain reachable.

- [ ] Add failing browser assertions for discovery as the homepage's primary region, access to textbook content through “Tư liệu”, and a secondary “Ôn tập” entry. Keep existing account, search, lesson, and administration paths.
- [ ] Update public E1 from homepage textbook-link discovery to map–card–event; keep a separate test proving the textbook journey is still usable. Adapt the “Học tiếp” and coaching expectations to their retained study entry instead of deleting their coverage.
- [ ] Adapt or remove only obsolete dashboard coaching targets; ensure new-user help describes the map controls and never points at removed elements.
- [ ] Verify keyboard order, visible focus, group chooser/card focus, Escape, non-drag controls, and no horizontal overflow at all four required widths. Run the existing axe checks and fix actual failures.
- [ ] Record compressed asset/chunk size, geometry count, idle frame count, and real-device rotation/card timings against the master's budgets. Keep a debug statistics surface test-only/explicit debug; do not expose service data.
- [ ] Run pnpm verify and the focused public suites: pnpm exec playwright test tests/e2e/tabletop-foundation.spec.ts tests/e2e/tabletop-explorer.spec.ts tests/e2e/tabletop-quality.spec.ts tests/e2e/public.spec.ts tests/e2e/sgk.spec.ts tests/e2e/ui-v2.spec.ts tests/e2e/a11y.spec.ts.
- [ ] Inspect the complete task diff, report retained routes and measured limitations, and make an eligible commit.

**Checkpoint B:** The real discovery journey works end to end. Deliver screenshots, required browser results, URL restoration evidence, source limitations, and performance measurements in the local report. Start the event-immersion subplan only when that checkpoint is included in the execution request.
