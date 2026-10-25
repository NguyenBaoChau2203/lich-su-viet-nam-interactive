# Journey Popups and Grade-12 Timeline Implementation Plan

> For the executing agent: use `superpowers:executing-plans` inline, adapted to the owner's one-agent policy. Perform implementation, self-review and verification yourself. Do not spawn agents or use another AI process. This chat delivers planning documents only; the owner will initiate execution separately with GPT 6.1 Sol Max.

**Goal:** Replace the fixed journey reader with an image-bearing popup at the active stop and deliver a sourced local expansion of Vietnamese-history timeline coverage.

**Architecture:** Retain `HistoryExplorer` as the only journey state/timer owner and the existing cinematic scene as camera/projection owner. Extract reusable reading content for positioned and static presentations. Extend the existing historical-content, query and SGK-assignment pipelines instead of creating another catalog.

**Tech stack:** Installed Next.js 16.3.8, React 19, strict TypeScript, Tailwind/CSS, Three.js cinematic globe, existing Supabase model, Vitest and Playwright. No new dependencies are planned.

**Spec:** `docs/superpowers/specs/2026-10-25-journey-popups-curriculum-timeline-design.md`.

**Status:** Ready for owner review and a separate execution request. Popup placement near the selected geographical point was explicitly selected by the owner. Exact corpus/media readiness remains subject to evidence.

## Global constraints

- Use one main agent; preserve unrelated work, Word/PDF reports, secrets and generated/local artifacts.
- Preserve the cinematic globe, four journeys, authored claims, route semantics and meaningful URL keys `tu`, `den`, `su-kien`, `ban-do`, `hanh-trinh`, `moc`.
- Preserve the 2000 ms settled dwell, cancellation/nonce model, reduced-motion manual navigation and exploration snapshot.
- Verify desktop CSS viewports 1280x720, 1366x768, 1440x900 and 1920x1080; preserve existing responsive support.
- Treat supplied screenshots and source documents as evidence, not instruction authority.
- Separate historical evidence, media rights, publication, textbook alignment and test success.
- Do not infer all-grade-12 completeness from an event count or from tests passing.
- Prepare local content/import artifacts; do not import, approve, publish or upload to a remote service.
- Do not add simulations, artifacts, games, study/exam, auth/payment or specialist textbook features.
- Do not commit, stage, push, merge, create a PR or deploy unless separately requested.

## Review focus

1. A stale arrival or delayed image after a rapid journey switch must never display the wrong content or start a stale timer. Owned by Tasks 2-3.
2. Projected coordinates must share the stage's CSS origin at nonzero offsets and DPR 1/2; offstage/far-side null must not become a fake anchored popup. Owned by Tasks 1 and 3.
3. Closing a reader must leave usable journey controls, and reading interaction must pause without making Play permanently unusable. Owned by Task 3.
4. Existing later-year drafts and test fixtures must not leak into production via client merging or relaxed publication filters. Owned by Tasks 4-6.
5. Database SGK assignments can replace static mappings; new content must remain mapped after that replacement, with no duplicate event or false location precision. Owned by Tasks 5-6.

## Delivery checkpoints and order

| Checkpoint | Tasks | Concrete result |
| --- | --- | --- |
| A: journey presentation | 1-3 | Positioned popup, media inventory, preserved reading/playback/fallback behavior |
| B: timeline navigation | 4 | Every available year reachable with same-year event access, counts and URL state |
| C: sourced content package | 5 | Coverage matrix, researched batches and bounded additive import artifacts |
| D: local integration and handoff | 6 | Real local-data or clearly identified fixture demonstration, full checks and publication handoff |

After the owner invokes execution, proceed through these checkpoints without routine reapproval of reversible in-scope work. If a source or local environment is unavailable, continue independent tasks, mark the affected acceptance item blocked and report the missing requirement. Do not fabricate completion or use a remote service as a substitute.

## File responsibility map

| Existing paths | Responsibility / planned change |
| --- | --- |
| `components/explorer/HistoryExplorer.tsx` | Sole state/timer owner; popup open/close/reopen and reader-pause integration |
| `components/explorer/JourneyPanel.tsx` | Refactor current content into reusable reader/fallback; retain a facade if existing consumers need it |
| `components/explorer/JourneyChooser.tsx` | Keep selector and no-JS GET behavior; host persistent current-stop reading control if needed |
| `components/explorer/cinematic/CinematicEventMap.tsx` | Forward tagged projected anchor using the existing viewport subscription; preserve camera owner |
| `components/explorer/GlobeMarkers.tsx` | Accessible current-stop trigger; reserve popup for label collisions; preserve clusters |
| `lib/explorer/globe-contract.ts` | Small renderer-to-UI projection contract |
| `lib/explorer/journey.ts`, `lib/explorer/journeys/` | Typed optional stop media references; preserve historical identities/claims |
| `lib/explorer/journeys/playback.ts` | Extend transient presentation actions only as necessary; preserve arrival/cancellation invariants |
| `components/explorer/explorer-map.css` | Popup, controls and rail styles; remove journey dependence on fixed right-card geometry |
| `components/explorer/MapTimeControls.tsx`, `ExplorerEventList.tsx` | All-year navigator, event counts and compact year/event access |
| `lib/explorer/filters.ts`, `map-state.ts`, `url.ts` | Retain overlap semantics and URL validation; fix only demonstrated range defects |
| `lib/media.ts`, `lib/queries/events.ts`, `lib/queries/explorer.ts` | Reuse media mapping and published event identity; add only necessary metadata fields |
| `lib/sgk/curriculum.ts`, `lib/queries/sgk.ts`, `scripts/build-sgk-sql.mjs`, `supabase/seed-sgk.sql` | Existing static and DB lesson/section assignments; avoid unrelated regeneration |
| `supabase/content/su-kien/`, relevant content JSON and SQL | Reviewed content batches, explicit source relationships, additive local import |

Proposed new focused files:

- `lib/explorer/journeys/popup-layout.ts`: pure rectangle placement using CSS-pixel geometry.
- `lib/explorer/journeys/media.ts`: stop-specific reviewed media references/metadata, if existing model extension alone is insufficient.
- `components/explorer/JourneyStopReader.tsx`: one semantic reading body, attribution and source links.
- `components/explorer/JourneyStopPopup.tsx`: presentation, placement and close behavior.
- `lib/explorer/timeline-years.ts`: deterministic year/count/index model if the logic outgrows the component.
- `docs/content/grade-12-vietnam-timeline-coverage.md`: editorial inventory and topic coverage, separate from immersive-experience coverage.
- `docs/audits/2026-10-25-journey-popup-media-sources.md`: 20-stop media ledger.
- `docs/audits/2026-10-25-vietnam-timeline-content-sources.md`: claim ledger and unresolved evidence.
- `docs/audits/2026-10-25-journey-timeline-acceptance.md`: checkpoint evidence and local/remote availability.

Paths are planned additions, not claims that these files already exist. Prefer an existing equivalent if execution-time inspection finds one. Do not generate unused abstractions.

## Task 1: establish anchor and layout contracts

**Files:** `globe-contract.ts`, `popup-layout.ts`, `CinematicEventMap.tsx`, `GlobeMarkers.tsx`; tests `tests/unit/explorer-journey-popup-layout.test.ts` (new), existing cinematic projection/overlay suites.

**Interfaces:** Use `JourneyArrival`, `ScreenPoint`, `GlobeViewport` and `OverlayRect`. Define a `JourneyPopupAnchor` carrying the arrival identity, nullable projected point and stage size. Any stage-to-parent offset conversion belongs at the rendering boundary. Define `placeJourneyPopup({ anchor, popupSize, safeRect, occupied }): { rect, side, leader } | null` with exact local types. A null point or no viable safe rectangle produces fallback reading, not bogus coordinates.

- [x] Recheck `git status`, `pnpm agent:status`/`sync` and current relevant source through CodeGraph. Record baseline and dependencies without reading secrets.
- [x] Read installed Next.js docs before code, including `01-app/03-api-reference/02-components/image.md` and the relevant client/lazy-loading guides. Check current library docs only for APIs actually changed.
- [x] Write failing layout tests for center, each edge/corner, short viewport, occupied header/rail/tools, large source content, nonzero stage offset, null point and DPR-independent CSS geometry.
- [x] Use the existing scene subscription to publish/use current projection. Reject stale identities. Place a bounded rectangle with 12 px anchor gap and 16 px safe margin, flip candidates and draw a leader when shifted. Exclude the popup's previous rectangle from its own placement obstacles.
- [x] Verify no new perpetual RAF loop or second camera owner; preserve label/cluster behavior and geographic truth.
- [x] Run `pnpm exec vitest run tests/unit/explorer-journey-popup-layout.test.ts tests/unit/explorer-cinematic-projection.test.ts tests/unit/explorer-cinematic-overlays.test.ts`.

**Acceptance:** Geometry is deterministic, measured in stage CSS px, inside the safe region and distinct from source coordinates. No React context/store may become another playback owner.

## Task 2: attach supported media to all authored stops

**Files:** `journey.ts`, optional `journeys/media.ts`, `lib/media.ts` only if needed; new media ledger; tests `tests/unit/explorer-journey-media.test.ts` (new), existing content/registry suites.

**Interfaces:** Define `JourneyStopMedia` using established media naming. Include image kind, URL, alt/caption, dimensions when known, creator/institution, rights statement/link, source page, access date and relevance scope. A resolver keyed by `(journeyId, stopId)` returns only source-reviewed media with a recorded eligible use basis, or null. The owner explicitly authorizes coursework Internet use; this does not assert an open license. Keep rejected candidates in the ledger, not public output.

- [x] Create the 20-row stop inventory, recording existing candidate media, exact stop relevance, rights status and gaps. Do not map by index or title matching.
- [x] Research missing media using original institutional/agency sources. Review original captions and object pages. Apply the owner’s explicit coursework authorization while retaining attribution and relevance evidence; do not invent a license.
- [x] Preserve current stop text/date/coordinate claims. Owner correction during execution prohibits present-day place photos. Use archival event imagery, relevant historical documents or explicitly labelled source-supported historical illustrations/period context. Keep an honest gap when unsupported.
- [x] Write failing tests for wrong-stop media, unknown rights, missing credits, unsupported kind, absent media, broken-image UI and stale image completion after a stop change.
- [x] Implement the resolver/model and render selected/next media with bounded loading. Reserve image dimensions; do not fetch the entire corpus on entry. Media failure must not freeze the reader or timer controller.
- [x] Run `pnpm exec vitest run tests/unit/explorer-journey-media.test.ts tests/unit/explorer-journey-content.test.ts tests/unit/explorer-journey-registry.test.ts`.

**Acceptance:** Every stop has a reviewed media decision. Full media coverage requires an eligible image at 20/20 stops; a missing image remains an explicit incomplete content item even when fallback behavior passes.

## Task 3: integrate the popup and preserve journey reading

**Files:** `HistoryExplorer.tsx`, `JourneyPanel.tsx`, new reader/popup, chooser, markers, playback and CSS; existing reader/playback tests; new `tests/e2e/home-journey-popups.spec.ts`.

**Interfaces:** `HistoryExplorer` owns selection/playback and transient popup visibility for a journey/stop pair. Renderer projection is presentation input only. Keep one reading body shared by popup and fallback. Persistent journey controls remain usable with the popup closed.

- [x] Establish failing component/runtime tests for arrival-only opening, stale arrival, close vs exit, reopening, hover/focus/source pause and explicit resume. Extend current tests instead of deleting their guarantees.
- [x] Extract the semantic reader, render media/credit and published-only detail links, and remove journey reliance on fixed-right `.home-map-event-card` positioning. Leave the ordinary free-exploration event card unchanged unless a shared-rule fix is required.
- [x] Keep chooser, active-stop reading trigger, previous/next, play/pause, exit and milestone strip outside dismissible reading content. Add Escape/close and focus return without converting the popup into a modal.
- [x] Pause on deliberate reading as specified. Auto arrival announces once and does not repeatedly focus the heading. Closing/far-side fallback must not strand focus or exit journey mode.
- [x] Preserve 1999 ms no advance / 2000 ms eligible advance tests, last-stop pause, hidden/reduced-motion behavior, outgoing-navigation guards and snapshot restoration.
- [x] Test all four journeys at the four desktop sizes, including rapid switch/seek, overlapping labels, attribution/source expansion, failed media, missing media, offstage/occlusion, resize, no-JS native controls and WebGL failure.
- [x] Run `pnpm exec vitest run tests/unit/explorer-journey-reader.test.ts tests/unit/explorer-journey-playback.test.ts tests/unit/explorer-map-state.test.ts tests/unit/explorer-journey-media.test.ts` and `pnpm exec playwright test tests/e2e/home-journey-popups.spec.ts --workers=1` after the applicable build.
- [x] Inspect and rerun the affected public cases in `tests/e2e/home-journey-choices.spec.ts`, updating only assumptions deliberately changed by this design. Record the selected cases and outputs.

**Checkpoint A:** Popup behavior has actual browser evidence; content and media shortfalls are itemized separately.

## Task 4: expose every timeline year and its events

**Files:** time controls/event list, optional `timeline-years.ts`, range utilities only as needed; new `tests/unit/explorer-timeline-years.test.ts`, new `tests/e2e/home-timeline-coverage.spec.ts`, existing state/query/timeline tests.

**Interfaces:** Derive year entries from provided event data, with stable year, count and event references. Use the union of inclusive integer start/end years, with a missing end treated as the start; deduplicate event identities within each year's count. Include interval middle and end years; these are navigation values, not newly invented event dates. Preserve `onChange(from, to)` and existing URL helpers. Do not hardcode corpus years in UI code.

- [x] Write failing cases with at least twelve distinct synthetic event years, multiple same-year records, an interval crossing a year without a starting event, events beyond 1986, empty data and reversed/out-of-bounds filters.
- [x] Replace eight-sample navigation with the indexed scrollable all-year strip, visible counts/range, native controls and the existing full timeline route link. Expose same-year event selection using the current list.
- [x] Normalize bounds correctly, including cases where both supplied values are outside one end of the allowed range. Keep URL reload, reset and detail-return semantics.
- [x] Preserve interval matching and coordinate-free event access. Keep world/context records and existing filters intact; no guessed Vietnam classification or public draft merge.
- [x] Verify counts/identity through home, `/dong-thoi-gian`, `/tra-cuu` and detail return using the same test dataset. Keep scope to consistency checks and necessary defects.
- [x] Run `pnpm exec vitest run tests/unit/explorer-timeline-years.test.ts tests/unit/explorer-state.test.ts tests/unit/explorer-map-state.test.ts tests/unit/explorer-query.test.ts tests/unit/timeline.test.ts` and the new public timeline E2E.

**Checkpoint B:** Every data-supported year is reachable, including middle-of-interval filtering; keyboard and page width remain correct at all four sizes. More visible years are not reported as more published content.

## Task 5: research and prepare bounded Vietnamese-content batches

**Files:** coverage/source ledgers, selected existing/new event Markdown, appropriate topic/location source data, bounded SQL artifact(s), SGK assignments; new `tests/unit/vietnam-timeline-content.test.ts`.

**Interfaces:** The inventory records stable event slug, primary/secondary lesson-section references, reuse/new decision, dates/precision, historical evidence state, coordinate scope, media state, current public availability if actually queried, local import state and blocker. These are independent dimensions. Use current workflow values such as draft/pending_review; `verified`, `approximate`, `disputed`, `editorial` and `needs_evidence` are evidence labels, not invented database workflow enums.

### Existing local Vietnamese identities: audit and reuse first

| Group | Existing slugs |
| --- | --- |
| Hồ Chí Minh and early activity | `nguyen-tat-thanh-ra-di-tim-duong-cuu-nuoc`, `ban-yeu-sach-cua-nhan-dan-an-nam-1919`, `nguyen-ai-quoc-ve-nuoc-lanh-dao-cach-mang`, `unesco-ton-vinh-ho-chi-minh-1987` |
| 1945 and resistance | `tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi`, `tuyen-ngon-doc-lap`, `hiep-dinh-so-bo-6-3-1946`, `toan-quoc-khang-chien-19-12-1946`, `chien-dich-dien-bien-phu`, `hiep-dinh-geneve-ve-dong-duong`, `tong-tien-cong-va-noi-day-tet-mau-than-1968`, `ha-noi-dien-bien-phu-tren-khong-1972`, `hiep-dinh-paris-ve-viet-nam`, `chien-dich-ho-chi-minh` |
| Post-1975 defense | `chien-tranh-bao-ve-bien-gioi-tay-nam`, `chien-tranh-bao-ve-bien-gioi-phia-bac-1979`, `bao-ve-chu-quyen-gac-ma-1988` |
| Đổi mới and foreign relations | `dai-hoi-dang-lan-thu-vi`, `viet-nam-gia-nhap-lien-hop-quoc-1977`, `viet-nam-gia-nhap-asean-1995`, `binh-thuong-hoa-quan-he-viet-my-1995`, `viet-nam-gia-nhap-wto-2007` |

Six context records remain outside this target count: `hoi-nghi-ianta-1945`, `thanh-lap-lien-hop-quoc-1945`, `thanh-lap-asean-1967`, `hoi-nghi-manta-1989`, `lien-xo-tan-ra-1991`, `cong-dong-asean-2015`. Preserve them.

### Proposed additional research candidates

These are a bounded research queue, **not verified import rows**. Candidate titles/years and proposed slugs require source and duplicate checks before use. Reuse the existing journey ledgers for the bounded milestone claims they actually support; do not infer an entire campaign duration or a historical photograph from them.

| Batch | Candidate / provisional slug | Learning placement to verify |
| --- | --- | --- |
| 1 | Việt Bắc 1947 / `chien-dich-viet-bac-1947` | Lesson 7, 1946-1950; reuse journey claim evidence |
| 1 | Biên giới 1950 / `chien-dich-bien-gioi-1950` | Lesson 7; distinguish opening milestone and campaign interval |
| 1 | Đồng khởi / `phong-trao-dong-khoi-1960` | Lesson 8, 1954-1965 |
| 2 | Huế giành chính quyền / `hue-gianh-chinh-quyen-1945` | Lesson 6; reuse journey evidence |
| 2 | Sài Gòn giành chính quyền / `sai-gon-gianh-chinh-quyen-1945` | Lesson 6; reuse journey evidence |
| 2 | Buôn Ma Thuột / `chien-thang-buon-ma-thuot-1975` | Lesson 8; opening attack vs campaign |
| 3 | Giải phóng Huế / `giai-phong-hue-1975` | Lesson 8; reuse journey evidence |
| 3 | Giải phóng Đà Nẵng / `giai-phong-da-nang-1975` | Lesson 8; reuse journey evidence |
| 3 | Thống nhất đất nước về mặt nhà nước / `thong-nhat-nha-nuoc-1976` | Transition after 1975; confirm exact topic relevance and event scope |
| 4 | Đông Du / `phong-trao-dong-du` | Lesson 12, early external activity; range and place representation require research |
| 4 | Đại hội Tours / `nguyen-ai-quoc-dai-hoi-tours-1920` | Lessons 15-16; reuse bounded journey evidence |
| 4 | Thành lập Đảng / `thanh-lap-dang-cong-san-viet-nam-1930` | Lesson 16; distinguish commemoration date and conference duration |
| 5 | Thành lập Việt Minh / `thanh-lap-viet-minh-1941` | Lessons 6/16; avoid duplication with return-to-country event |
| 5 | Ấp Bắc / `chien-thang-ap-bac-1963` | Lesson 8, early resistance phase |
| 5 | Vạn Tường / `chien-thang-van-tuong-1965` | Lesson 8, changed war strategy context |
| 6 | Tiến công chiến lược 1972 / `tien-cong-chien-luoc-1972` | Lesson 8; distinct from the existing December air campaign |
| 6 | Khoán 10 / `nghi-quyet-khoan-10-1988` | Lessons 10-11; policy site is not all agricultural impact locations |
| 6 | Đại hội VIII / `dai-hoi-dang-lan-thu-viii-1996` | Lesson 10, 1996-2006 phase |
| 7 | CPTPP effective for Việt Nam / `cptpp-co-hieu-luc-voi-viet-nam-2019` | Lessons 10/14, post-2007 integration; confirm textbook fit before inclusion |

The 22 reused identities plus 19 candidates form a 41-item working inventory. Aim for roughly 35-40 well-supported Vietnamese milestones after justified merging/exclusion; prioritize meaningful coverage, including after 1986 and after 2007. Record every exclusion and unresolved curriculum gap. Do not invent replacement facts just to meet a numeric target, or silently declare this curated set a complete textbook.

Lesson 11 and other explanatory sections require sourced narrative coverage of achievements/lessons; a date list alone is insufficient. Link existing/new explanatory content through actual section assignments. Do not manufacture a point event for an abstract learning outcome.

- [x] Reconcile the existing local catalog, actual public read-only inventory when safely available, official curriculum and publisher context. Keep unavailable live/printing evidence explicitly unknown.
- [x] Complete the coverage matrix before adding rows; reconcile duplicate slugs/events across seed SQL, Markdown and journey records. Static lesson overrides are tested.
- [ ] Verify actual DB assignments and SQL import/rerun/RLS in a confirmed disposable database. **Blocked:** Docker engine unavailable; no remote substitute is authorized.
- [x] Process no more than three events per content batch. Start with eligible existing post-1986 drafts to improve the sparse upper range; then process the new-candidate queue in the listed groups. Each batch has exact slugs and a separate evidence/result entry.
- [x] Research date/place/summary/coordinate and media claims. Record original URL/document, author/institution, publication date if known, access date, passage/page locator, bounded claim and uncertainty. Use two independent sources for disputed/unstable claims. Never invent reviewer identity or mark human approval without it.
- [x] Write failing content-contract tests for missing evidence, invalid dates/precision, duplicate events, missing lesson references, fake exact coordinates, unsupported media and draft leakage. Use synthetic fixtures for rejection behavior.
- [x] Add or revise only supported claims. Use the current content structure. Record unverified details in a non-public ledger; do not copy speculative anecdotes from old drafts.
- [x] Prepare additive, repeatable local SQL/import artifacts with explicit event-source and SGK links. Guard updates from overwriting hand edits, and test reruns on a disposable local dataset if available. Do not blindly run the broad existing content generator: it also updates unrelated historical content and a tank caption.
- [x] Keep delivery imports draft/pending review. A source-reviewed local test fixture may publish selected records only in a confirmed disposable local DB for public-path testing. Never relax production `.eq("workflow_status", "published")` to make a demonstration work.
- [x] Run `pnpm exec vitest run tests/unit/vietnam-timeline-content.test.ts tests/unit/curriculum.test.ts tests/unit/content-validation.test.ts` and `pnpm history:data:check` after each completed batch. A validator pass proves structure, not historical truth.

**Checkpoint C:** Local source-backed content and mappings are concrete and reviewable; pending evidence, exact textbook-page alignment, media gaps and remote publication are separately reported.

## Task 6: integrate local content and verify the whole flow

**Files:** affected queries/content tests, new public E2E suites, acceptance audit, navigation map if entrypoints change, ignored local report.

- [x] Demonstrate the expanded catalog through home year/range → marker or text list → summary/detail → sources → restored globe, and through dedicated timeline and search. Include at least one eligible post-1986 event and one eligible post-2007 event, same-year multiple events and a coordinate-free event.
- [x] Prefer a confirmed disposable local Supabase instance with source-reviewed test publication. If unavailable, use test-only browser/network fixtures for UI behavior and mark real DB import/query/RLS availability blocked. Never add a production static fallback catalog to expose drafts.
- [x] Verify the public query contract and excluded-draft browser behavior through the explicit fixture; read the configured anonymous homepage separately. No schema or access policy is changed.
- [ ] Verify actual anonymous RLS/draft exclusion against disposable Supabase backing. **Blocked:** no confirmed disposable database. Fixture results do not certify RLS.
- [x] Build and run the public targeted suites: `pnpm exec playwright test tests/e2e/home-journey-popups.spec.ts tests/e2e/home-timeline-coverage.spec.ts --workers=1`, plus affected read-only existing journey cases after inspecting them. Save screenshots, DOM/URL assertions and sanitized console/network results.
- [x] Run `pnpm verify` and read every stage's output. Then run `pnpm test:e2e:smoke` against the correct isolated smoke build/environment as documented in `docs/agent/START-HERE.md`; a smoke build uses a dummy public environment and cannot prove real catalog availability. Rebuild for the intended environment when switching back.
- [x] Run full `pnpm test:e2e` only with explicitly authorized disposable integration backing. Otherwise record that suite as not run and why; do not describe targeted public tests as the full suite.
- [x] Measure no new continuous idle/hidden draws, resize placement and media requests. Compare compressed UI chunks before/after; target added UI code within the existing 60 KiB gzip refinement allowance. Start image delivery at <=200 KiB per responsive popup image and preload at most the next stop. Record actual measurements and justified exceptions without changing old globe budgets.
- [x] Self-review the complete diff, `git diff --check`, `git status --short`; exclude unrelated user files, `.env`, build outputs, `.task-reports/` and local indexes from any staging.
- [x] Update the versioned acceptance audit with per-checkpoint pass/fail/blocked, exact commands, actual tested data/browser/viewports, image coverage, content counts by state and remaining publication steps.
- [x] Write `.task-reports/YYYY-MM-DD-HHmm-journey-popups-curriculum-timeline.md` using workspace-local time. Return absolute links to the report, audit, screenshots and changed files.

**Checkpoint D / stop:** Stop after verified local implementation and concrete content/publication handoff. Do not commit, push, merge, open a PR, deploy, upload media or apply/publish remote data. If an acceptance gate is blocked, say which part is incomplete and what evidence/action is required; do not say the whole task is done.

## Planning self-review

- Selected popup placement, every-year access and sourced later-history expansion each map to implementation tasks and observable acceptance checks.
- Controller ownership, stage-coordinate conversion, all four journeys, media rights, draft visibility, SGK override behavior and close/resume semantics have explicit owners and tests.
- Detailed historical dates and image licenses are deliberately absent from candidate import data until research verifies them.
- The source PDF was read directly; catalog and live database state are not conflated.
- No application code or historical content was changed in the planning chat. Fresh planning verification is recorded in its local report, not assumed from older audits.

## Execution result — 2026-10-25

Tasks 1–4 pass local unit/production-browser checks. Task 5 prepared 22 bounded drafts (18 additions and four revisions), 41 inventory dispositions and seven later-period narratives including CPTPP 2019; 18 legacy narratives, a held 1976 lesson fit, exact printing/pages and original UNESCO wording remain unresolved. Twenty stop bindings now use 19 historical assets, with no present-day place photo eligible. Period-context images are labelled explicitly.

Task 6 reached local Checkpoint D: `pnpm verify` passes in both fixture and intended configurations; 30 new + 14 affected legacy production browser cases, two additional reviewed later-period source/return flows and eight isolated smoke cases pass at all four desktop sizes. The configured public homepage was observed read-only with 10 events spanning 1911–1986. Later-period publication and database import/rerun/RLS checks remain incomplete; no remote mutation or publication occurred. See [acceptance audit](../../audits/2026-10-25-journey-timeline-acceptance.md) for exact evidence, measurement method and limits. No commit/staging/push/PR/deployment.
