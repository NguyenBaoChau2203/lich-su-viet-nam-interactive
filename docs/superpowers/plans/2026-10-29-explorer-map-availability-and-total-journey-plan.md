# Explorer Map Availability and Total Journey Implementation Plan

> **For the implementing agent:** Execute inline with one main agent, adapting `superpowers:executing-plans` if available. Do not spawn workers, reviewers, another chat, or another AI process. This proposed plan is prepared for Cursor with the owner's selected Grok 4.7 xhigh fast setting. This delivery does not implement the plan; an explicit owner handoff to execute authorizes the bounded local work below.

**Goal:** Make explorer selection truthful and usable when a public map location is unavailable, and add one journey containing every existing journey milestone in chronological order.

**Architecture:** Keep the existing public explorer event model, registry, reducer, globe and camera. Reuse one coordinate eligibility rule for marker generation, selection and UI availability. Derive the total journey from the four base records, preserving each milestone's original identity for provenance and media lookup.

**Tech stack:** Installed Next.js 16.3.8, React 19, strict TypeScript, existing atlas CSS, Vitest and Playwright/Edge. No new dependency.

**Design basis:** The owner's 2026-10-29 request, `docs/audits/2026-10-29-explorer-map-and-total-journey-investigation.md`, `docs/product/DESKTOP-UI-SCOPE.md`, the approved globe design, and current amendments linked in `docs/agent/CURRENT-STATE.md`. Engineering details below are recommendations for execution, not independently approved historical claims.

## Global constraints

- Read `AGENTS.md`, `docs/agent/CURRENT-STATE.md`, the investigation and the applicable installed guides in `node_modules/next/dist/docs/` before changing code.
- Baseline: branch `feat/homepage-visual-effects`, HEAD `23a4b0f`; inspect the actual working tree again. Preserve all existing timeline, locality, province-area and other unrelated changes. Do not create a worktree that omits required uncommitted functionality.
- Use CodeGraph first when `.codegraph/` exists; run `pnpm agent:status` or `pnpm agent:sync`. Fall back to targeted reads for missing/unsupported content or unavailable tools.
- Use one main agent. Do not stage, commit, push, create a PR, merge, deploy, publish or modify external services.
- Do not read or expose `.env` values or tokens; do not alter Word files, unrelated files, dependencies, hook protection or global model configuration.
- Reuse unchanged historical content and source metadata. Never infer an event/location relationship from a matching place name, nearby date, lesson, region or coordinate. Keep uncertain facts marked and unsupported mappings held.
- Preserve existing URLs, detail return state, one camera/history owner, locality state restoration, marker clustering, and the original four journeys.
- Desktop acceptance: CSS 1280×720, 1366×768, 1440×900 and 1920×1080, keyboard/focus, reduced motion, WebGL/error and static/no-JavaScript reading. Preserve existing responsive support; mobile/tablet expansion is out of scope.
- On this checkout, set `$env:NoDefaultCurrentDirectoryInExePath = '1'` for package commands and require substantive output. Do not delete or change owner command files.

## Product decisions

1. An event with a public eligible coordinate keeps a map-selection action. An event without one keeps an enabled `Xem tóm tắt` action and an explicit explanation. The event remains searchable, selectable and readable.
2. The opened summary explains that no public location with usable coordinates is available. Do not imply a transient map error or promise a pin when the content does not support one.
3. Add `Hành trình tổng hợp` with ID `hanh-trinh-tong-hop` as an additional registry/chooser option. Keep the four existing options, their relative order and the current default unchanged.
4. The total contains 20 milestones at this baseline: 7 + 4 + 5 + 4, from 05/06/1911 to 30/04/1975. Derive it from the base journey list; do not hardcode 20 into runtime logic. It contains journey milestones, not all 32 explorer events.
5. Preserve every source milestone, including recurring cities, year/month precision and milestones without a public event-detail link. Use chronological `sortDate` ordering with source order as a deterministic tie breaker. Do not invent missing day/month values in displayed data.
6. Display a note such as `Tổng hợp các mốc từ những hành trình hiện có theo thứ tự thời gian. Đường nối là sơ đồ, không phải tuyến di chuyển thực tế.`
7. Preserve existing autoplay semantics, including pause for reading/manual input/hidden document, reduced motion, stale-arrival rejection and stopping at the last milestone.

## Review focus

1. Empty, partially missing, non-finite, out-of-range and zero coordinates must yield identical eligibility in markers, UI and camera selection; a valid secondary location must remain usable.
2. Rapid event/journey/locality changes and stale camera arrivals must not reopen or focus the wrong content; repeated selection must work after manual panning.
3. Namespaced total-stop IDs must survive URL reload, Back/Forward and detail return; original journey URLs must remain unchanged.
4. Every total stop must retain its source's text, date precision, coordinates, uncertainty, sources and media result; no original stop may be mutated or silently deduplicated.
5. A 20-stop timeline and expanded list must fit the smallest desktop height while keeping controls, keyboard focus, selected markers and reading alternatives usable.

## File map

| Files | Responsibility |
| --- | --- |
| `lib/explorer/map-markers.ts` | Shared event map availability and eligible anchors |
| `components/explorer/MapEventList.tsx`, `MapEventCard.tsx` | Accurate map/summary actions and clear unavailable-location explanation |
| `components/explorer/cinematic/CinematicEventMap.tsx` | Focus only an anchor accepted by the same eligibility rule |
| `lib/explorer/journey.ts` | Optional original milestone identity on a derived stop |
| New `lib/explorer/journeys/total.ts`, existing `registry.ts` | Derive total from base journeys and register it without self-inclusion |
| `components/explorer/JourneyStopReader.tsx` | Resolve media by original milestone identity while preserving total URL state |
| `components/explorer/JourneyChooser.tsx`, `JourneyPanel.tsx`, `explorer-map.css` | Change only if existing composition needs bounded support for 20 milestones |
| Unit tests listed below; new focused E2E spec | Behavioral regression evidence |
| New content follow-up audit | Classify all missing public locations and hold unsupported or unapplied associations |

## Task 1 — Recheck the baseline and pin the failure

**Inspect:** `lib/queries/explorer.ts`, the investigation, public homepage response, map/list/card/focus paths and current dirty files.

- [ ] Record `git status --short`, HEAD, CodeGraph health and relevant file diffs. Read applicable installed Next.js guidance.
- [ ] Recheck public availability using the existing local application or a read-only public fixture. Do not access secrets to work around unavailable database tooling.
- [ ] Compare empty-location slugs with `supabase/content/timeline-review-2026-10-26/approved-events.json`; update the investigation if the baseline changed.
- [ ] Add a focused regression in new `tests/e2e/home-explorer-map-availability.spec.ts` using an isolated read-only fixture with explicit synthetic no-location, invalid-coordinate, valid-secondary and mappable cases. Extend `tests/e2e/journey-catalog-server.mjs` only where needed; do not mutate a real DB.
- [ ] Prove the current misleading action/message or inconsistent camera eligibility fails the new assertions. Existing tests alone are not a red baseline.

**Acceptance:** Evidence distinguishes an empty public location list from a renderer failure. A focused test fails for the intended missing-location UX or invalid-coordinate behavior.

## Task 2 — Share map eligibility and explain unavailable locations

**Files:** map-markers, list/card, cinematic adapter, `tests/unit/explorer-map-markers.test.ts`, the new E2E spec.

**Interface:** Add `getEventMapAvailability(event: ExplorerEvent): EventMapAvailability` beside existing anchor logic. Use a discriminated result with eligible anchors when available and a reason (`no-public-location`, `missing-coordinates` or `invalid-coordinates`) otherwise. Do not add a second event dataset. Keep `getEventMapAnchors(events)` as the existing external API and reuse the same validation logic internally.

- [ ] Add failing unit cases for empty arrays, null/partial values, `NaN`/Infinity, current supported coordinate bounds, `(0, 0)`, and an invalid primary plus valid secondary location. Assert actual anchors/availability, not source-code strings.
- [ ] Implement the shared eligibility rule, preserving current accepted coordinate bounds and all valid locations.
- [ ] Use availability in the event list and card. Available action: `Xem vị trí trên bản đồ`; unavailable action: `Xem tóm tắt`. For unavailable content, use clear copy such as `Sự kiện này chưa có địa điểm công khai đủ dữ liệu để đánh dấu trên bản đồ. Bạn vẫn có thể đọc tóm tắt và nguồn.` Preserve date/source/accuracy content and detail navigation.
- [ ] Use the first eligible anchor in cinematic focus. Preserve the existing rule that a visible valid secondary marker and useful current zoom do not cause a jump to a different place. Do not fly to an invalid, invented, `(0, 0)` placeholder or unrelated city.
- [ ] Keep selection and URL state for summary-only events; no fabricated anchor is required. Do not disable reading or hide the event from the timeline.
- [ ] Verify rapid A→B selection and repeated selection after panning with the existing intent/nonce flow. Change reducer contracts only if necessary and backed by a failing test.

**Acceptance:** A no-location event opens a readable summary with an explicit explanation and leaves the camera at its previous view. Mappable events still select an eligible visible marker or cluster and retain working camera behavior. List/card/camera eligibility agrees with marker generation.

**Focused check:** `pnpm exec vitest run tests/unit/explorer-map-markers.test.ts tests/unit/explorer-cinematic-overlays.test.ts tests/unit/explorer-journey-playback.test.ts`, plus the new isolated browser case.

## Task 3 — Derive and register the total journey

**Files:** journey types, new total builder, registry, new `tests/unit/explorer-total-journey.test.ts`, existing registry/content/state tests.

**Interfaces:** Export `TOTAL_JOURNEY_ID = "hanh-trinh-tong-hop"` and `createTotalJourney(baseJourneys: readonly HistoryJourney[]): HistoryJourney` from `total.ts`. Add optional `origin: { journeyId: string; stopId: string }` to `JourneyStop`. Create a base-record list before constructing the total; the builder must not import the runtime registry.

- [ ] Write a failing test asserting that the total has exactly all source pairs from the four base journeys, with a baseline count of 20, sorted `sortDate`, the first source stop `sai-gon-1911` and final source stop `sai-gon-1975`.
- [ ] Assert safe unique derived IDs, stable output, preserved content and no mutation of base objects. Test two synthetic base journeys sharing a stop ID, equal sort dates, repeated locations, and stops without `eventSlug`.
- [ ] Derive stops by copying existing records and retaining an explicit origin. A slug-safe deterministic ID such as `${sourceJourney.id}-${sourceStop.id}` is suitable; reject duplicate derived IDs rather than silently dropping a stop. Preserve every milestone; do not deduplicate by city, coordinate, date or event link.
- [ ] Union existing `lessonSlugs` deterministically. Keep date text, date precision, summaries, sources, coordinate provenance, accuracy notes, view and existing event links unchanged.
- [ ] Register the total as the fifth option after the four base records. Preserve `DEFAULT_JOURNEY_ID`, legacy object identity/content digest and original journey/stop IDs.
- [ ] Update only intentional four-journey assertions in registry/content/chooser/E2E tests. Preserve the original historical sequences and source checks.

**Acceptance:** Registry and URL parser accept the fifth journey and any of its stops. No composite recursion/import cycle, duplicate member, lost source or changed original record occurs. The total's 20 stops fit the current 64-stop path cap without modifying it.

**Focused check:** `pnpm exec vitest run tests/unit/explorer-total-journey.test.ts tests/unit/explorer-journey-registry.test.ts tests/unit/explorer-journey-content.test.ts tests/unit/explorer-map-state.test.ts tests/unit/explorer-journey-path.test.ts`.

## Task 4 — Preserve media, playback and navigation through the total

**Files:** `JourneyStopReader.tsx`, existing journey UI only where necessary, existing playback/reader/media/chooser tests, new total E2E coverage.

- [ ] Add a failing regression showing a derived stop must resolve the same reviewed media result as its original `(journeyId, stopId)`, including intentional null/failure fallbacks.
- [ ] At the reader media call, pass `stop.origin?.journeyId ?? journeyId` and `stop.origin?.stopId ?? stop.id` to the existing resolver. Keep composite IDs in URL, camera request, arrival and popup state; origin identity is for provenance/media only.
- [ ] Expose the total through the existing chooser, SSR/no-JavaScript links, timeline and reader. Retain the current default and all four individual choices. Add only necessary layout changes for 20 steps.
- [ ] Add regression tests for previous/next and playback across each source-journey boundary: Pác Bó→Hà Nội 1945, Ba Đình→Hà Nội 1946, and Genève→Buôn Ma Thuột. Use original identities via `origin` in assertions.
- [ ] Verify final-stop completion without unwanted wrap, manual pause, reading/source pause, hidden-tab pause, reduced motion, stale arrivals after switching, seeking, and exit restoration. Reuse existing reducer behavior; do not add another timer, store or player.
- [ ] Verify deep links, reload, Back/Forward and detail return to a middle total stop with original filters/camera retained. Existing event links remain conditional on public event availability.

**Acceptance:** Learners can start at the first total stop, progress through all original journeys and finish at the final stop. Media and source information match the originals. URLs use the total identity consistently; existing individual journeys and locality return behavior still work.

**Focused check:** Run the total test plus existing playback, reader, media, chooser and path unit files; run the relevant public desktop journey E2E cases against an isolated read-only fixture.

## Task 5 — Record the content follow-up and run acceptance gates

**Files:** new `docs/audits/2026-10-29-explorer-map-location-follow-up.md`, test evidence, local task report. Update `CURRENT-STATE.md` only if new implementation entrypoints materially change its navigation map.

- [ ] Record one row per currently missing-location event: event slug, observed public state, an existing sourced candidate if any, whether the event/place association has direct support, uncertainty, and next action. Use `needs_evidence` when unsupported. The 22-event baseline must be fully accounted for, even when some events appropriately remain summary-only.
- [ ] Existing journey coordinates may be listed as research leads with their source identity. They do not automatically establish the same association for a separate public event. Do not add a frontend fallback catalog or publish local research drafts.
- [ ] Prepare any proposed canonical data repair as reviewable local artifacts only. Applying it to live Supabase, publishing or changing RLS requires a separate owner request. Report separately how many events remain without locations; never claim all 32 now have map pins unless freshly proven.
- [ ] Exercise the changed browser flows at all four desktop viewports with meaningful DOM and URL assertions, keyboard/focus, reduced motion, and map-failure/static reading. Capture screenshots under `output/playwright/` and inspect console/network failures against the baseline.
- [ ] Self-review the diff. Check that unrelated existing changes, Word files, secrets, generated output, local reports and dependency files were not modified/staged by this task.
- [ ] Run `pnpm verify`, then `pnpm test:e2e:smoke`. Run the focused public E2E suite with the verified read-only fixture. Do not run mutation-capable legacy integration tests against the live project. Full `pnpm test:e2e` is conditional on an explicitly authorized disposable environment.
- [ ] Run `git diff --check`, `git status --short` and `pnpm agent:status`; create `.task-reports/YYYY-MM-DD-HHmm-explorer-map-total-journey.md` using Asia/Bangkok local time.

**Acceptance:** Fresh verification evidence supports the changed local behavior and remaining data gaps. No test is marked passed without output. If an unrelated working-tree failure blocks a full gate, record the exact command, failing file and scope; do not claim overall completion or rewrite unrelated work.

## Stop point and deliverables

Stop at **LOCAL-EXPLORER-MAP-TOTAL-JOURNEY**: reviewed local implementation, tests, screenshots, an explicit remaining-location queue, and the ignored local task report. Return a Vietnamese handoff mapping results to Tasks 1–5, changed files, exact test results, remaining risks and absolute artifact paths. Do not commit, integrate Git work or publish data/code. Missing credentials or denied SQL access must not block safe local work or justify secret access.
