# Vietnam Tabletop History Explorer Implementation Plan

**Homepage plan superseded on 2026-10-23:** The owner reviewed the tabletop and requested a full-viewport 2D geographic map instead. Follow [the replacement homepage plan](2026-10-23-fullscreen-history-map-plan.md). The former A/B tabletop checkpoints are historical planning records. Event-detail and curriculum coverage work remains separately scoped; it does not authorize restoring the tabletop homepage.

> For agentic workers: use superpowers:executing-plans and implement sequentially with one agent. The owner prohibits subagents, separate AI reviewers, and additional AI chats or CLI processes. Steps use checkboxes for tracking.

**Goal:** Replace the study-dashboard homepage with a raised Three.js Vietnam map that links time, event selection, and an integrated event detail experience, then improve Dien Bien Phu playback and expand evidenced curriculum coverage.

**Architecture:** Keep Next.js Server Components responsible for published data and page content. Use a small client explorer with a lazily imported Three.js tabletop runtime; retain MapLibre in event simulations where already useful. Reuse the existing event, lesson, model, and simulation identities instead of creating a second historical database.

**Tech stack:** Installed Next.js 16.3.8, React 19.2.8, strict TypeScript, Tailwind 4, Three.js ^0.186.1, existing Supabase public client, Vitest, Playwright. No new dependency is planned.

**Spec:** ../specs/2026-10-23-3d-vietnam-map-explorer-design.md.

**Status:** Detailed planning deliverable requested by the owner on 2026-10-23. No product task below has been executed.

**Device scope:** The owner updated the project on 2026-10-23 to laptop/PC only. Follow [DESKTOP-UI-SCOPE.md](../../product/DESKTOP-UI-SCOPE.md); mobile/tablet layouts and touch-specific verification are deferred in every subplan and checkpoint.

## Mission and definition of done

Deliver a geographic tabletop experience for grade-12 Vietnamese history. Revision stays accessible as a secondary function.

The complete release requires all four checkpoints below. A working Dien Bien Phu pilot proves the architecture, not full curriculum or asset coverage. The source and coverage gates are part of the work.

## Sources of truth

1. AGENTS.md, including the single-agent and local-report rules.
2. The approved design linked above and the owner's latest tabletop clarification.
3. This master plan and the three sequential subplans.
4. docs/agent/AI-AGENT-PROMPT-STANDARD.md and AI-AGENT-PROMPT-TEMPLATE.md for any task prompt.
5. Actual code, tests, historical sources, and the inventory produced during execution.

Read the installed Next.js guides on server/client boundaries and lazy loading before implementation. If .codegraph exists, use CodeGraph before broad code searches.

## Verified starting state

- The current homepage renders a study hero, goals, textbook contents, and featured lessons.
- getTimelineEvents returns startYear and a primary location name/slug; it does not provide endYear or coordinates for all places.
- getEventDetail already returns endYear, locations with precision, sources, figures, and media.
- public/mapfilm/indochina-borders.geojson is a MultiLineString, not a reviewed polygon footprint.
- The Dien Bien Phu lesson uses eventSlug chien-dich-dien-bien-phu and mapFilm dien-bien-phu.
- MapFilmRuntime already supports scene-local seeking, free camera, recentering, audio, and playback.
- totalDuration(script) already exists in lib/mapfilm/evaluate.ts.
- Vitest currently discovers tests/unit/**/*.test.ts; do not add unconfigured TSX component tests.
- Playwright defaults to the installed Edge browser and a production server on port 3100. Its webServer does not build the app.
- The workspace has substantial pre-existing tracked and untracked work. A clean HEAD checkout would omit much of the current app.
- Full E2E includes staff/payment tests that can write data. A local app URL alone does not prove the database is disposable.
- img2threejs has been assessed from documentation, not installed or executed.

## In and out of scope

In scope: sourced map footprint, tabletop projection/mesh, published explorer data, time filters, marker selection, cards, URL restoration, primary navigation, integrated event media, Dien Bien Phu improvements, coverage inventory, accessibility, and measured performance.

Out of scope: realistic national elevation, province-level rebuilding, new accounts/exam/payment features, a framework rewrite, new database schema without a demonstrated gap, automatic img2threejs installation, external publication, and Word-report edits.

## Global constraints

- Use one agent for investigation, implementation, self-review, and verification. Do not describe self-review as independent review.
- Keep the initial national map a simple raised tabletop with a plain top and visible sides. No country-wide elevation work.
- Keep meaningful filters and selection in the URL. Keep deep links usable without a previous visit.
- Preserve date and location uncertainty, published-only access, source labels, and static readable alternatives.
- Test desktop CSS viewports 1280×720, 1366×768, 1440×900, and 1920×1080; mouse/trackpad, keyboard, reduced motion, no WebGL, loading, error, and empty states. Preserve existing responsive support; do not add mobile/tablet or touch-specific acceptance work.
- Use synthetic fixtures only for mathematical/UI tests; label them synthetic. Never invent historical dates, coordinates, relationships, media rights, or reviewer identities.
- Keep heavy viewers lazy and only one active heavy viewer in the event-media area.
- Retain existing study, exam, account, and administration routes; change their prominence deliberately.
- Never read or print secret files for convenience. Never put a service-role key in client code.
- Do not push, merge, deploy, publish, send messages, or mutate an external service.
- Existing unrelated changes are not task-owned. Never reset, stash, clean, or stage them automatically.
- Before editing, record the target-file baseline. New checkpoints do not justify recreating the workspace from HEAD.

## Execution sequence

| Checkpoint | Execute | Observable handoff |
| --- | --- | --- |
| A: real tabletop foundation | Homepage subplan A1–A3 | Reviewed footprint, published-data contract, and an actual raised model on / with bounded rotation/zoom and readable fallback |
| B: complete discovery journey | Homepage subplan A4–A5 | Time-filtered markers/list, card, deep link, restored context, secondary revision navigation, laptop/PC and keyboard evidence |
| C: integrated event immersion | Event subplan B1–B5 | Dien Bien Phu global timeline, preserved camera/time, selectable authored locations, artifact viewer, figures, sources |
| D: evidenced coverage and release | Coverage subplan C1–C3 | Curriculum/asset coverage reconciled, required content gaps resolved or explicitly incomplete, full verification and performance evidence |

Subplans, in order:

1. [Tabletop homepage](2026-10-23-tabletop-homepage-plan.md).
2. [Event detail and Dien Bien Phu](2026-10-23-event-immersion-plan.md).
3. [Coverage and release](2026-10-23-history-coverage-release-plan.md).

Stop and write a local report after each checkpoint. Continue to the next checkpoint only when the requested execution scope includes it. Routine implementation choices within a checkpoint do not need repeated permission.

## File ownership and integration map

| Area | New files/modules | Existing integration points |
| --- | --- | --- |
| Map and event state | lib/explorer/{types,projection,filters,url,markers}.ts; lib/queries/explorer.ts; public/maps/vietnam-tabletop.geojson and provenance JSON | lib/queries/events.ts and event-detail.ts as patterns; existing labels and media types |
| Homepage | components/explorer/{HistoryExplorer,TabletopStage,TimeNavigator,EventPreviewCard,ExplorerEventList}.tsx; components/explorer/{runtime,tabletop-mesh}.ts | app/(public)/page.tsx; components/layout/nav.ts and dependent layout components; existing home coaching |
| Event integration | lib/event-experience/{types,index,dien-bien-phu}.ts; components/event-experience/{EventExperience,EventSimulation,MomentNavigator,EventArtifacts,EventFigures}.tsx | EventDetailView, event route, existing Lesson/ModelViewer/ScanViewer and media patterns |
| Simulation | lib/mapfilm/playback.ts; components/mapfilm/{PlaybackControls,InspectionPanel}.tsx | runtime.ts, MapFilmPlayer.tsx, map-base.ts, camera.ts, types.ts, Dien Bien Phu script |
| Evidence | docs/content/{vietnam-tabletop-map-sources,explorer-curriculum-coverage}.md; lib/event-experience/coverage.ts; unit/E2E files named in subplans | Existing content validation, mapfilm tests, and public journeys |

These are planned paths, not a claim they exist. Keep a file small enough to have one clear responsibility; do not reorganize unrelated modules.

## Product and rendering defaults to implement

These defaults settle details left open in the design. They are planning choices, not measured results.

- Model coordinates: east is +X, north is -Z, vertical is +Y; maximum geographic span is 100 world units; base Y=0, top Y=3.
- Use a shared local equirectangular projection centered on the reviewed footprint bounds. Use its center latitude for longitude scaling.
- Perspective camera FOV: 50 degrees; orbit polar angle: 0.25–1.35 radians; camera distance: 25–250 units. Derive initial fit from bounds and viewport aspect.
- Left drag orbits; wheel/trackpad zooms; modified/right drag pans within model bounds plus 20 units. Provide visible rotate, zoom, and reset buttons and keyboard alternatives. Touch-specific controls are deferred.
- No auto-rotation, ambient particle loop, autoplay audio, or autonomous historical-time playback.
- Inclusive year range from actual published data. Native range/number controls labeled “Từ năm” and “Đến năm”; “Toàn bộ” resets both bounds.
- Group projected markers within 28 CSS pixels; never merge event identities or make hover mandatory.
- URL keys: tu, den, su-kien, goc. goc encodes azimuth,polar,distance,targetX,targetZ, rounded to three decimals.
- Detail context key: kham-pha, containing a validated relative explorer URL. Reject external and protocol-relative destinations.
- Update camera URL after control end, debounced 150 ms; avoid server requests or history entries per animation frame.

## Review focus

1. A published event may have no published location, null coordinates, or an approximate region: keep it readable, show precision, and never invent a marker. Owned by A2/A4.
2. Intervals cross year boundaries; different events share a point; one event has multiple places: keep filtering and individual selection consistent. Owned by A2/A4.
3. Malformed year/camera/context URLs or stale event slugs: recover predictably without NaN geometry or an external return link. Owned by A2/A4/B3.
4. WebGL fails, context is lost, viewport changes, or JavaScript is absent: preserve readable content, working links, controls, and proper cleanup. Owned by A3/A5/B4.
5. A user seeks backward across scenes while freely inspecting: keep time, scene state, camera mode, captions, and artifacts coherent. Owned by B1/B2/B4.

Each owning task below names tests for these conditions.

## Performance budgets

Record the test browser/device before measuring. Targets are first-version limits, not claims already achieved:

- Compressed map footprint at most 200 KiB; generated tabletop geometry at most 80,000 triangles. Do not meet these by silently dropping required geography.
- Added homepage 3D JavaScript at most 300 KiB compressed, measured as unique chunks beyond a saved baseline.
- Cap drawing pixel ratio at 2 on the target laptop/PC. Lower it if needed to meet the measured performance budget; no separate mobile pixel-ratio policy is required in this phase.
- No continuous render loop once controls settle; zero additional frames during a stable two-second idle window.
- On the stated hardware-accelerated reference device, p95 frame time during rotation at most 33.3 ms and event-card activation within 200 ms.
- Visible static event content remains available before 3D loads and when it fails.
- Use SwiftShader for deterministic behavior tests only; never claim its timings prove real-device performance.

If a budget fails, reduce effects, geometry, or pixel ratio and remeasure. Record an unresolved budget rather than silently changing the target.

## Verification and Git contract

For every logic task: write the named failing test, run it and inspect the actual failure, implement, rerun, then self-review. Visual-only changes need browser evidence rather than implementation-mirroring tests.

Before each checkpoint handoff:

~~~powershell
pnpm verify
git diff --check
git status --short
~~~

Run the subplan's focused browser journeys after a production build. Run the entire pnpm test:e2e suite only against a local/disposable test database or an explicitly authorized test service. Do not run mutating staff/payment tests against an unapproved external target. Missing required public data or skipped required journeys means that checkpoint is incomplete.

The current required UI matrix is desktop only. Inspect legacy mixed files before using the browser commands listed in subplans; select the desktop cases by test title or a documented desktop group. Existing mobile/tablet tests remain optional and must not be deleted or silently relabeled as desktop evidence. Report the exact selection and any unrun coverage. New explorer tests must use the desktop matrix above.

Finish each task with a scoped diff review and an eligible small commit. Stage only reviewed task-owned files or hunks. If a pre-existing untracked file or unrelated edited content cannot be separated safely, leave it uncommitted and record the baseline problem; do not bundle that work. Never stage .task-reports, Word files, secrets, or generated build outputs.

## Deliverables and stop conditions

At each checkpoint return its acceptance results, changed paths, commands/outcomes, screenshots at the four desktop viewport sizes, outstanding content/performance gaps, and an absolute local report path under .task-reports.

Stop the affected release path for an unverified footprint, unsupported historical/media claims, unavailable required test data, failed gates, or an action requiring external mutation. Continue unrelated safe work within the authorized checkpoint when possible; do not present a partial checkpoint as passed.

The first execution prompt is [Checkpoint A](../../agent/prompts/EXECUTE_TABLETOP_CHECKPOINT_A.md). It stops at the tabletop foundation and does not start the rest of the redesign.

## Plan self-review

- All fifteen spec acceptance criteria map to A1–A5, B1–B5, or C1–C3.
- Existing local seek, recenter, totalDuration, eventSlug, and model IDs are reused.
- Historical time and playback seconds are distinct types.
- The five review-focus classes have explicit owning tests.
- This plan provides interfaces and test assertions, not full implementation bodies.
- Implementation, external services, new assets, and optional img2threejs execution have not been started by writing this plan.
