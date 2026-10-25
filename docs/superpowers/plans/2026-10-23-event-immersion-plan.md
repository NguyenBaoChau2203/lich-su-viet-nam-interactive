# Event Detail and Dien Bien Phu Immersion Implementation Plan

> For agentic workers: use superpowers:executing-plans inline. One agent only; self-review is not independent review.

**Goal:** Deliver checkpoint C: an integrated event page with improved interactive Dien Bien Phu playback, inspectable authored locations, historical objects, people, and sourced context.

**Architecture:** Keep published event detail as the server-owned narrative. Resolve an authored experience registry against existing lesson, map-film, model, and public-event records. Client media controls mount one heavy viewer at a time.

**Tech stack:** Existing React/Next.js, Three.js model viewer, MapLibre/Three.js campaign player, Vitest, Playwright.

**Spec:** ../specs/2026-10-23-3d-vietnam-map-explorer-design.md.
**Master:** 2026-10-23-tabletop-explorer-implementation-plan.md. Inherit its constraints, review focus, budgets, Git rules, and gates.

**Device scope:** Laptop/PC only: 1280×720, 1366×768, 1440×900, and 1920×1080 CSS viewports, with mouse/trackpad and keyboard. Mobile/tablet and touch-specific verification are deferred. Use the master's selection rules when existing E2E files mix desktop and mobile cases.
**Prerequisite:** Checkpoint B passes. Retain the national tabletop renderer; this plan does not replace it with MapLibre.

## Shared authored experience contract

Define in lib/event-experience/types.ts during B1:

~~~ts
type EvidenceRef = {
  sourceUrl: string; locator: string;
  confidence: "verified" | "approximate" | "disputed" | "editorial";
};
type EventMoment = {
  id: string; title: string; dateText: string;
  sceneIndex: number; localSeconds: number; evidence: EvidenceRef[];
};
type ArtifactRef =
  | { kind: "model"; id: string; modelId: string; relation: string; evidence: EvidenceRef[] }
  | { kind: "lesson-exhibit"; id: string; lessonSlug: string; title: string; relation: string; evidence: EvidenceRef[] };
type InspectionTarget = {
  id: string; title: string; text: string;
  anchor: { kind: "strongpoint" | "label"; id: string };
  momentId?: string; artifactId?: string; figureSlug?: string;
  evidence: EvidenceRef[];
};
type EventExperienceDefinition = {
  eventSlug: string; lessonSlug: string; mapFilmSlug?: string;
  readiness: "draft" | "ready";
  moments: EventMoment[]; artifacts: ArtifactRef[]; targets: InspectionTarget[];
};
~~~

References identify existing data. Do not duplicate historical objects or people just to supply these interfaces. A lesson-exhibit reference must resolve uniquely to an existing title in that lesson; fail validation if it is renamed or ambiguous.

## Task B1: sourced pilot registry and campaign-wide playback positions

**Files:** Create lib/event-experience/{types,index,dien-bien-phu}.ts, lib/mapfilm/playback.ts, tests/unit/{event-experience,mapfilm-playback}.test.ts. Extend tests/unit/mapfilm.test.ts only where needed. Create tests/e2e/mapfilm-fixtures.ts by extracting the existing synthetic offline tile helper from mapfilm.spec.ts.

**Interfaces:**
- getEventExperience(eventSlug: string): EventExperienceDefinition | undefined in registry index.
- resolveEventExperience(event: EventDetail): EventExperienceDefinition | null; return null for draft definitions and remove resource links not allowed by the public event's records.
- buildPlaybackTimeline(scenes: readonly Pick<MapScene, "duration">[]): PlaybackSegment[].
- PlaybackSegment = { sceneIndex: number; start: number; end: number }.
- resolvePlaybackPosition(segments: readonly PlaybackSegment[], seconds: number): { sceneIndex: number; localSeconds: number; globalSeconds: number }.
- playbackSeconds(segments, sceneIndex: number, localSeconds: number): number.
- Reuse totalDuration(script) from evaluate.ts as the existing duration authority.

- [ ] Write failing registry tests for unknown event, draft definition, missing/duplicate model and target IDs, non-resolving exhibit title, invalid scene/time, and a figure link absent from the public event.
- [ ] Write playback tests using synthetic scene durations [10, 20]: -1 resolves to scene 0/time 0; 10 resolves to scene 1/time 0; 30 resolves to final scene/time 20; >30 clamps; nonfinite requested seconds become zero. Reject empty timelines and nonpositive durations explicitly.
- [ ] Run pnpm exec vitest run tests/unit/event-experience.test.ts tests/unit/mapfilm-playback.test.ts and inspect failures.
- [ ] Audit the existing Dien Bien Phu narrative, script, key dates, artifact descriptions, and sources. Record claim locators and uncertainty before marking new mappings ready. Reuse existing labels and coordinates; do not add invented historical timings or tactics.
- [ ] Register the existing event slug chien-dich-dien-bien-phu, lesson slug chien-dich-dien-bien-phu, and map-film slug dien-bien-phu. Select at least one source-supported current object and one authored location for the pilot. Keep the definition draft if evidence is insufficient.
- [ ] Implement pure timeline helpers with exact cross-scene boundary semantics. Test that final timeline end equals existing totalDuration for the real script.
- [ ] Extract offlineTiles into the named E2E helper without changing its synthetic nature: it tests behavior with flat terrain, not geographic or visual fidelity.
- [ ] Rerun the two new unit files and tests/unit/mapfilm.test.ts; self-review and make an eligible commit.

**Acceptance:** The pilot has validated authored relationships and a single campaign-wide time mapping. Existing unverified text is not automatically promoted merely because it was already in the repository.

## Task B2: global seek, explicit camera modes, and selectable locations

**Files:** Modify components/mapfilm/runtime.ts, MapFilmPlayer.tsx, map-base.ts, lib/mapfilm/camera.ts, and lib/mapfilm/types.ts. Create components/mapfilm/{PlaybackControls,InspectionPanel}.tsx and tests/e2e/mapfilm-interaction.spec.ts. Extend existing mapfilm.spec.ts.

**Interfaces:** Extend MapFilmRuntime without removing existing methods:
- seekGlobal(seconds: number): void.
- getPlaybackPosition(): { sceneIndex: number; localSeconds: number; globalSeconds: number }.
- setCameraMode(mode: "guided" | "free"): void.
- setCameraPreset(preset: "overview" | "overhead" | "oblique"): void.
- getCameraView(): MapCam and restoreCameraView(view: MapCam, mode: "guided" | "free"): void.
- Keep recenter() as the compatible guided-mode entry.
- Add optional inspectionTargets and onInspect(targetId: string) to runtime options and MapFilmPlayer props.
- Define SimulationSnapshot = { globalSeconds: number; cameraMode: "guided" | "free"; view: MapCam } in lib/mapfilm/types.ts. Add initialSnapshot?: SimulationSnapshot and onSnapshot?(snapshot: SimulationSnapshot): void to MapFilmPlayer props. Capture before disposal; restoring a snapshot initializes paused at the saved time/view.
- Extend createMapBase with an optional final inspection argument; existing callers remain valid.

- [ ] Add failing real-browser cases for global seek across a boundary, preserving paused/playing state, preserving free camera across the seek, returning to guided view without restarting time, and all three camera presets.
- [ ] Add selectable-label cases: an authored target opens matching content by pointer or keyboard; a decorative/non-authored label does not claim inspectable content; selecting does not inadvertently enter free camera or advance the story.
- [ ] Run pnpm verify, then pnpm exec playwright test tests/e2e/mapfilm-interaction.spec.ts. Inspect missing-control/API failures before implementing.
- [ ] Implement seekGlobal atomically: resolve scene/time, cancel stale narration, reset the new scene's audio scheduler, seek to local time, update deterministic scene state, and preserve the prior play/pause and camera mode. Do not route it through an autoplaying scene button.
- [ ] Implement explicit modes labeled “Theo diễn biến” and “Tự khám phá”. Presets change only the viewpoint. Derive views from current authored camera/targets; do not invent geographic positions.
- [ ] Split the player controls into the named small component. Show historical milestone labels separately from elapsed playback time. Preserve current keyboard shortcuts, subtitles, sound toggles, fullscreen, and standalone player route.
- [ ] Make the matching existing map-base label/strongpoint a real button only when its InspectionTarget is authored and visible. Remove aria-hidden from that interactive path; retain decorative labels as decorative. Prevent propagation from those controls to canvas free-camera handlers.
- [ ] Expose the new APIs through the existing debug-only mapfilm interface for deterministic tests. No public secret or new authorization bypass is added.
- [ ] Run unit playback/mapfilm tests, pnpm verify, then pnpm exec playwright test tests/e2e/mapfilm.spec.ts tests/e2e/mapfilm-interaction.spec.ts.
- [ ] Check that repeated seek positions produce identical strongpoint states and that captions/narration do not overlap. Self-review and make an eligible commit.

**Acceptance:** Basic seeking/free camera already existed; this task proves campaign-wide navigation and coherent inspection rather than claiming those old controls were newly created.

## Task B3: integrate the simulation into the actual event page

**Files:** Create components/event-experience/{EventExperience,EventSimulation,MomentNavigator}.tsx. Modify components/content/detail/EventDetailView.tsx, app/(public)/su-kien/[slug]/page.tsx, and tests/e2e/event-experience.spec.ts.

**Interfaces:**
- EventExperience consumes an already validated EventExperienceDefinition and the public event's allowed figures/sources.
- EventSimulation consumes mapFilmSlug, moments, targets, onInspect, initialSnapshot, onSnapshot, and optional seekTo: { sceneIndex: number; localSeconds: number; nonce: number }.
- MomentNavigator consumes moments, activeMomentId, and onSelect(momentId: string).
- Public preview=false may mount the experience; administration preview=true does not create a public viewer or expose an unpublished resource.

- [ ] Add failing browser cases for /su-kien/chien-dich-dien-bien-phu: narrative and source list are available before any player import; “Mô phỏng 3D” starts the integrated player; selecting a moment seeks the matching scene/time.
- [ ] Cover a directly opened event URL, a valid explorer return context, malicious return contexts, an event without a ready definition, and an administration preview. Use existing authorized preview tests where credentials are available; never create external staff data for this task.
- [ ] Run the new event test to inspect the missing integrated controls.
- [ ] Add the integrated experience to EventDetailView while retaining the existing article, sources, figures, and location content. Keep the main event route a Server Component and resolve publication-sensitive relationships there.
- [ ] Add the clear “Quay lại bản đồ” link using the A2 URL helper; a direct event visit falls back to selecting the event on /. Preserve normal browser Back behavior.
- [ ] Implement MomentNavigator using authored mappings. A selected moment updates the player without starting unrelated media. If the player is not ready, retain the requested target and seek once initialization completes.
- [ ] Keep a clear authored/no-WebGL fallback; do not redirect every event to the older lesson route or load simulation code on unrelated events.
- [ ] Run pnpm verify and pnpm exec playwright test tests/e2e/event-experience.spec.ts tests/e2e/tabletop-explorer.spec.ts tests/e2e/mapfilm-interaction.spec.ts.
- [ ] Inspect the actual map-to-event-to-simulation journey and the shared administration view for regressions; self-review and make an eligible commit.

## Task B4: real artifact inspection and contextual people

**Files:** Create components/event-experience/{EventArtifacts,EventFigures}.tsx. Modify EventExperience and existing model/scan viewer wrappers only if needed. Extend tests/unit/event-experience.test.ts and tests/e2e/event-experience.spec.ts.

**Interfaces:**
- EventArtifacts consumes validated ArtifactRef[] and resolved ModelSpec/LessonExhibit records.
- EventFigures consumes only the current public event's figure records plus a selected figureSlug.
- EventExperience media mode is "simulation" | "artifacts"; moments/figures are readable contextual panels.
- Switching mode unmounts the previous heavy viewer. Within artifacts only the selected model or scan viewer mounts.

- [ ] Add failing cases for target-to-artifact navigation, a source-backed figure link, missing/unpublished figure exclusion, an invalid artifact reference, and returning from artifacts to the same simulation position.
- [ ] Assert that inactive viewers have no live canvas/iframe and that late initialization after unmount is disposed. Assert no artifact viewer network request before activation.
- [ ] Run the focused unit and browser cases to inspect failures.
- [ ] Use getModelSpec/ModelViewer for approved procedural objects and the existing scan wrapper for real scans. Preserve model note, attribution, source reference, and relation to this event.
- [ ] Label assets accurately as “Mô hình minh họa 3D”, “Bản quét 3D”, or “Ảnh có chiều sâu”. A depth photograph is not counted as the requested rotatable 3D artifact.
- [ ] Provide rotate/zoom/reset and authored hotspot text through existing viewer controls. Reuse description text for non-WebGL fallback; do not require a scan or face model for every person.
- [ ] Resolve InspectionTarget artifactId/figureSlug only after validation. Switching viewers captures a SimulationSnapshot including the exact free-camera view; remounting uses it to restore time, mode, and viewpoint in the paused state. Resume playback only through the intended control.
- [ ] Run pnpm verify, pnpm exec vitest run tests/unit/event-experience.test.ts tests/unit/models3d.test.ts, then pnpm exec playwright test tests/e2e/event-experience.spec.ts tests/e2e/models3d.spec.ts.
- [ ] Capture laptop/PC examples at the four supported desktop viewports and self-review for unsupported historical claims; make an eligible commit.

## Task B5: player quality, seeking determinism, and checkpoint C

**Files:** Modify components/mapfilm/runtime.ts, PlaybackControls.tsx, InspectionPanel.tsx, and components/event-experience components only where evidence requires. Extend tests/e2e/mapfilm-interaction.spec.ts and event-experience.spec.ts. Add tests/perf/event-experience.md.

**Interfaces:** Retain B1–B4 contracts. Keep measured budgets and debug metrics separate from historical content.

- [ ] Add regression assertions for seek A→B→A, scene-boundary seek while paused, free camera plus moment selection, hidden-tab pause, resource-switch cleanup, reduced motion, and WebGL loss. Compare deterministic frame states, not only button labels.
- [ ] Fix actual inconsistencies revealed by these cases; do not alter authored historical timings to make tests pass.
- [ ] Check all four desktop viewport sizes, mouse/trackpad controls, visible focus, shortcut scoping, captions, text transcript, and that panels do not cover important controls/targets, including at 1280×720. Mobile/tablet and touch-specific checks are deferred.
- [ ] Verify the national tabletop runtime is not imported into unrelated event pages and mapfilm is not imported into the homepage.
- [ ] Measure real-device frame time, loading, and card/panel response. Suspend application animation when the simulation is paused and stable or the page is hidden; restart only for user interaction or playback. Verify audio does not resume without the intended action.
- [ ] Run pnpm verify; then pnpm exec playwright test tests/e2e/mapfilm.spec.ts tests/e2e/mapfilm-interaction.spec.ts tests/e2e/event-experience.spec.ts tests/e2e/models3d.spec.ts tests/e2e/tabletop-explorer.spec.ts tests/e2e/a11y.spec.ts.
- [ ] Review the full checkpoint diff and source inventory, make eligible small commits, and write the local checkpoint report.

**Checkpoint C:** The published Dien Bien Phu event has the integrated, controllable experience and at least one genuinely inspectable 3D object with accurate labeling. Missing pilot evidence, data, viewer behavior, or required browser execution keeps the checkpoint incomplete. Curriculum-wide readiness belongs to the next subplan.
