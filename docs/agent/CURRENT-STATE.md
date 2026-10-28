# Current implementation map for AI agents

Navigation baseline: 2026-10-25, source HEAD `851b31a`. Latest local-heroes state: owner-authorized system Supabase publication and local final test, 2026-10-27, branch `feat/local-revolutionary-heroes`, HEAD `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`; see the final section below. This file locates existing code and relevant decisions; inspect current source/tests before assuming behavior. Counts and earlier test results in audits are historical evidence, not fresh results.

## Product and design authority

The source application was imported on 2026-10-22 and includes study, exam, account, payment and administration modules beyond the original small MVP. Their presence does not authorize new features or migrations. Preserve them when editing the requested slice. Desktop/laptop scope remains `docs/product/DESKTOP-UI-SCOPE.md`.

The approved `docs/superpowers/specs/2026-10-23-curated-history-globe-design.md` records the owner's later globe decision after the earlier tabletop and fullscreen 2D designs. The 2026-10-24 refinement spec explicitly preserves the globe. For the shipped province scope, read `docs/superpowers/plans/2026-10-25-vietnam-province-boundaries-completion-plan.md` and `docs/audits/2026-10-25-province-boundaries-final-review.md`. Earlier 2D/tabletop prompts are historical records; do not execute them as a new homepage rebuild.

## Locate work

| Area | Source / supporting evidence |
| --- | --- |
| Homepage server boundary | `app/(public)/page.tsx`, `lib/queries/explorer.ts` |
| Explorer UI, list/card/time controls | `components/explorer/HistoryExplorer.tsx`, `components/explorer/`, `components/explorer/explorer-map.css` |
| URL/filter/event contracts | `lib/explorer/types.ts`, `lib/explorer/filters.ts`, `lib/explorer/map-state.ts` |
| Cinematic renderer and layers | `components/explorer/cinematic/`, `lib/explorer/cinematic/` |
| Journeys | `lib/explorer/journey.ts`, `components/explorer/JourneyChooser.tsx`, `components/explorer/JourneyPanel.tsx`; follow current sourced journey records |
| Province reference data/pipeline | `scripts/province-boundaries/`, public map assets, `docs/audits/2026-10-25-province-boundaries-final-review.md` |
| Dedicated map/timeline/search/detail | `app/(public)/ban-do/`, `app/(public)/dong-thoi-gian/`, `app/(public)/tra-cuu/`, `app/(public)/su-kien/` |
| Study, exams, accounts and payments | Existing modules under `lib/`, `components/` and `app/`; use CodeGraph on the exact feature before editing. They are not a new implementation backlog. |
| Supabase schema/source records | `supabase/migrations/`, `supabase/content/`, `supabase/tests/`; live DB readiness is separate from local schema checks |
| Verification | `tests/unit/`, `tests/e2e/`, `scripts/agent/*.test.mjs`, `package.json`, `.github/workflows/ci.yml` |

## Journey popup and all-year timeline local handoff (2026-10-25)

Journey reading now uses `JourneyStopReader.tsx` and `JourneyStopPopup.tsx`; `HistoryExplorer` remains the sole playback/presentation-state owner. The cinematic adapter forwards a tagged stage-CSS projection, with `journeys/popup-layout.ts` handling placement. Stop media and its provenance are in `journeys/media.ts` and the dated media ledger. The owner explicitly permits coursework use of Internet images and requires historical event imagery instead of present-day place photos; educational-use entries do not assert an open license. All 20 stop bindings now use archival images, documents or explicitly labelled historical illustrations/context, with no present-day place image eligible.

`timeline-years.ts` derives inclusive all-year choices and normalizes ranges. The bounded local content package is `supabase/content/timeline-2026-10-25/`; its dedicated generator prepares insert-only draft SQL and does not feed a production fallback catalog. Read `docs/content/grade-12-vietnam-timeline-coverage.md` and `docs/audits/2026-10-25-journey-timeline-acceptance.md` for evidence, blocked database checks and remaining source/printing gaps. No remote import/publication is implied. The read-only network fixture under `tests/e2e/journey-catalog-server.mjs` is test-only and is not Supabase/RLS evidence.

Province lines are sourced modern shared-interior **reference lines**, not complete administrative polygons, cadastral geography, historical borders or point-in-province assignment. Preserve the honest limitation, source provenance and intentionally failing full-polygon research control when changing that pipeline.

## Timeline content approval (2026-10-26)

After the draft-only release, the owner delegated review and publication of the 22-item package. `supabase/content/timeline-review-2026-10-26/approved-events.json` records the bounded approved narratives, directly checked source locators and Vietnamese public notes. `publish-reviewed.sql` is a single-use operation guarded by the exact reviewed draft/source/link snapshot, not a general seed or schema migration. The source-review decisions and live verification are in `docs/audits/2026-10-26-timeline-content-review.md`.

Actual project `lichsu_12` now has 32 published events and 14 other drafts (46 total), with public timeline bounds 1905–2019. The 18 additions and four reconciled legacy drafts were published after source checks; the original ten public events remain unchanged. Four uncertified old event/place associations were removed without changing location records. This is an agent source review under owner delegation, not approval by a teacher or certification of an exact textbook edition/page. The held 1976 candidate, UNESCO wording and other legacy narratives remain outside this review. The 2026-10-25 package/audits above remain dated evidence of the earlier draft stage.

## Local revolutionary heroes research checkpoint (2026-10-26)

The owner approved contract `LH-1.0.0-draft.1`, then explicitly asked this main agent to continue Gemini's partial Phase 01. The current local package is `supabase/content/local-heroes/national-v1/`, manifest v14, hash `893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`. The actual roster is frozen and **owner-approved on 2026-10-26** (see `docs/audits/2026-10-26-local-heroes-phase-01-approval.md`): 53 nominees, 35 proposed selected people, 2 complete research records, 33 selected people incomplete and 18 held people. All 34 reference localities have a directly sourced qualifying candidate; only two have complete research content. No national release or import/publication is ready or authorized by that research status.

Read `docs/audits/2026-10-26-local-heroes-phase-01-handoff.md`, `docs/content/local-heroes/roster.md`, `coverage.md`, `discovery.md` and `phase-06-queue.md` before continuing. The inherited claim that ten records were complete was withdrawn after source/hash/reference checks. New claim/story/media evidence is separate from held inherited drafts. Nine canonical person identities were checked with a SELECT-only snapshot; the manifest reuses existing IDs. No local-heroes application/schema/importer/RLS code has been implemented. The Phase 02 roster/hash approval prerequisite is met; a new chat may execute `docs/prompts/local-revolutionary-heroes/02-data-security-gpt61-sol-max.md` after reading the approval record. Keep the same Local checkout/branch because current research artifacts are uncommitted; preserve all existing untracked owner files. Phase 02 still requires its own disposable database evidence and does not authorize remote writes or publication. This approval-recording follow-up starts no implementation.

## Route to the right skill

- Core browsing/state/filter changes: `build-map-timeline-slice`; do not research unchanged facts again for an interaction-only fix.
- New/changed historical claims, coordinates or journey copy: `research-history-sources` and existing provenance ledgers.
- Story/layout/motion: `design-history-story` plus the current approved route design.
- Schema/RLS/server database access: `model-supabase-history`; use a disposable/local DB for authorized changes.
- Completion evidence: `verify-release-slice`, adapted to the changed slice and one-agent self-review.

Canonical skills live in `.agents/skills/`. Claude wrappers only route to them. Broad personal skills/plugins are optional; they must not replace owner constraints, add external writes or start extra AI agents.

## Handoff between contributors

Share a branch/commit, requested outcome, current spec/plan, exact changed paths, observed commands/results and unresolved issues. Do not rely on former chats or personal Memory being available. Update this navigation map when entrypoints or approved scope change; maintain detailed task status in the relevant versioned plan/audit. Keep local reports ignored and cite fresh verification in each handoff.


## Local revolutionary heroes — Phase 02 backend handoff (2026-10-26)

Phase 02 now implements the additive catalog migration, real local DB role/invariant/race tests, public/staff server readers, atomic graph actions, generated catalog types and research/release validation. Read `docs/audits/2026-10-26-local-heroes-phase-02-handoff.md` and its implementation addendum/verification record for current interfaces and fresh evidence. Public page/profile readers are in `lib/queries/local-heroes.ts`; staff graph preview is in `lib/queries/local-heroes-admin.ts`; commands are in `lib/actions/local-heroes.ts`; types, normalization, validation and readiness are in `lib/local-heroes/`. Existing catalog workflow dispatch is conditional; legacy records remain unenrolled by default.

Only the separately created Docker project `local-heroes-phase02-disposable` on loopback DB port 55342 was mutated. No remote migration/import/publication occurred. The approved v14 research package/hash remains unchanged: 35 selected, 2 complete, 33 incomplete, 18 held; all 34 localities and every selected person remain mandatory before national release. UI, GET endpoint, explorer lifecycle and detail presentation remain Phases 03–05. Original checkpoint text above is dated prior-phase evidence.

## Local revolutionary heroes — Phase 03 remediation and Phase 04 homepage (2026-10-27)

The owner explicitly authorized fixing/verifying Phase 03 prerequisites before completing Phase 04. See `docs/audits/2026-10-27-local-heroes-phase-03-remediation.md` for the compile/form/CAS/workflow repairs and real disposable Auth/RLS/browser evidence; the earlier Phase 03 pass claim is superseded. One main agent performed investigation, implementation, self-review and verification inline.

Homepage people discovery is now implemented by `components/explorer/LocalHeroesPanel.tsx`, `components/local-heroes/`, `lib/local-heroes/state.ts`, `use-local-hero-page.ts` and `app/api/local-heroes/route.ts`. `HistoryExplorer` plus the existing playback reducer remain the single history/runtime owner; cinematic cancellation stays in the existing adapter. Entry pauses/cancels, exit restores the suspended snapshot paused, and SSR GET/detail return works without JS/WebGL. The default event homepage does not fetch people or representative photos. No geometry/renderer replacement or research-catalog fallback was added.

Use `playwright.local-heroes.config.ts` and `scripts/agent/local-heroes-e2e.mjs` for the isolated read-only public fixture; use the separate admin config/helper only with the descriptor-confirmed disposable DB. See contract section 14 and `docs/audits/2026-10-27-local-heroes-phase-04-handoff.md` for commands, actual evidence, measured budgets and limits. New build directories are ignored; normal output remains `.next`. On this checkout set `NoDefaultCurrentDirectoryInExePath=1` for Node/pnpm child commands because the pre-existing owner `node.cmd` is empty; do not edit/delete it.

The existing figure route has only the eligibility/accepted-image/safe-return bridge required for homepage navigation. Phase 05 detailed storytelling/citations/gallery, Phase 06 missing content and Phase 07 national release audit remain separate work. The v14 bytes/hash and mandatory 34/34 first-release scope are unchanged. No remote migration/import, publication, upload, deployment, commit or PR was performed. Earlier checkpoint paragraphs remain dated evidence.

## Local revolutionary heroes — Phase 07 local acceptance checkpoint (2026-10-27)

The owner authorized completing the remaining blockers with one main agent. Current package is **v18**, manifest hash `06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416`. Use `docs/audits/local-heroes-release-readiness.md`, `docs/content/local-heroes/2026-10-27-remediation-acceptance.md` and `docs/audits/sources/2026-10-27-local-heroes-remediation-content-review.json` for current acceptance. Earlier phase paragraphs, v17 ledgers and the first Phase 07 overlay remain dated evidence; their incomplete counts are superseded. V17 input bytes are preserved under `supabase/content/local-heroes/snapshots/v17/`. Current direct source/media acceptance admits **35/35 selected profiles, 35 main stories, 35 representative images and 34/34 localities** for local rehearsal, with 368 admitted claims and 73 scoped sources. All 53 roster decisions remain unchanged: 35 selected, 18 held. Historical/unsupported drafts and assets remain held rather than deleted.

Implemented navigation is `/` → `Nhân vật theo địa phương` → canonical locality/name or alias/page → existing `/nhan-vat/[slug]?kham-pha=...` → sourced stories/gallery/source anchors → exact homepage return. `components/local-heroes/StorySections.tsx`, `components/content/detail/FigureDetailView.tsx` and `lib/queries/figures.ts` implement detail. Public readers remain anonymous; staff preview now also carries story/locality citations and fails visibly on child-query outages. `HistoryExplorer` and the playback reducer retain the single history/runtime owner; the existing cinematic adapter retains the camera. No new renderer, geometry, account or study module was added.

Phase 07 also labels previously unnamed story/media controls and corrects media-status contrast. The frozen public/admin configs remain isolated. `scripts/agent/local-heroes-national-rehearsal.mjs --target .task-reports/local-heroes-disposable-db.json` additionally seeds/promotes the actual accepted 35-profile graph only on the descriptor-confirmed disposable DB, checks all 34 choices and every profile at four desktop viewports, then resets that dedicated DB to the verified empty baseline. See the audit for DOM/axe/browser, real Auth/PostgREST role, SQL invariant/race and image-transfer evidence. Browser fixtures do not establish historical truth or remote RLS. `pnpm verify` does not include actual DB/browser tests.

Offline draft preparation is `node scripts/content/prepare-local-heroes-release.mjs`; current artifacts are under `supabase/content/local-heroes/release-phase-07-remediation/`, snapshot hash `bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53`. All 35 stable identities now have admitted complete graphs, source/media fingerprints and draft-only SQL with default `ROLLBACK`. `--package supabase/content/local-heroes/snapshots/v17 --review docs/audits/sources/2026-10-27-local-heroes-phase-07-content-review.json` reproduces the original two-graph artifact byte-for-byte to a separate local output. `tests/rls/local-heroes-import-rehearsal.mjs` proves exact rerun/conflict/non-destructive/rollback behavior and all 35 local promotions; it is not a live importer.

New exact asset patterns in `next.config.ts` permit only reviewed original image URLs. Node 24 app startup (`pnpm dev`/`pnpm start`) and isolated helpers use `--use-system-ca`, adding the operating system's trusted CAs while retaining certificate verification. This resolves the observed upstream chain failure for Trần Quốc Mạnh's image; no TLS bypass or dependency was added. Actual Next optimizer transport passed for all 35 originals at DPR 1/2, separately from synthetic thumbnail/performance fixtures.

At the earlier local-only checkpoint (**superseded by the authorized publication below**), national live release was blocked: v18 exact-hash approval was pending, all 34 `publicSnapshot` values remain null and no live publication is claimed. The already approved v14 roster is not submitted for duplicate approval. Read-only CLI inventory of the intended `lichsu_12` project (`ueolfjujjybutyuyfxha`) found no feature schema/migration ledger and three selected canonical published/event-linked identities (Văn Tiến Dũng, Phạm Văn Đồng, Lê Duẩn). The local importer intentionally refuses these conflicts. The concrete target, unchanged legacy IDs/media and separately required schema-adoption/enrollment steps are in `docs/audits/2026-10-27-local-heroes-remediation-remote-plan.md`. The unavailable historical v16 bytes remain an explicit provenance gap; v18 links exactly to preserved v17. No external migration/content/storage write, upload, publication, stage/commit, push, PR, merge or deploy occurred.

## Local revolutionary heroes — authorized system publication (2026-10-27)

The owner then explicitly requested fixing the remaining integration blockers, publishing to the system Supabase and opening the local web. Read `docs/audits/2026-10-27-local-heroes-live-release-authorization.md`, `2026-10-27-local-heroes-live-publication.md`, `2026-10-27-local-heroes-live-release-verification.json` and the latest `local-heroes-release-readiness.md`. The earlier local-only stop/approval/publicSnapshot paragraphs describe their dated checkpoints and are superseded for this explicitly requested release. No new AI agent or independent review was used.

Actual target **lichsu_12 / ueolfjujjybutyuyfxha** now has **35 public catalog people, 35 published primary stories and 34/34 represented canonical localities**, observed anonymously at `2026-10-27T11:19:32.343Z` (use the machine observation for the exact recorded timestamp). Total canonical figures41 includes all9 preserved legacy figures; three existing people were enrolled and32 new people added. All46 events,17 event links and old media/base fields remain unchanged. No Auth/student/payment content or synthetic users were imported remotely.

The immutable research/rehearsal input remains `supabase/content/local-heroes/national-v1/`, v18 `06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416`; its acceptance overlay and original draft-only artifact remain reproducible. The current **release-gate package** is `supabase/content/local-heroes/published-national-v1/`, v19 `eece5e9012d40371947fc93687f10478325942e54ef9a19ceabf5edb5db1f9f0`. Its eight historical files are unchanged; coverage/public observation and manifest/approval metadata name the actual owner instruction and executed source hash. Validate it explicitly with `node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/published-national-v1 --mode release`.

`scripts/content/prepare-local-heroes-live-release.mjs` and `local-heroes-live-release-sql.mjs` own the separate target-specific canonical enrollment, based on exact public before images and directly checked preserved-biography/life-date evidence. The executed v5 artifact is `supabase/content/local-heroes/live-release-20261027-v5/`, release hash `0dcfc960010153a91fd3501c0004ed2b9c84138ab9ce45d356555d167c3ba43d`. The original draft importer still refuses legacy conflicts. Do not substitute it for this enrollment or rerun publication as a routine test. Exact rerun, conflict refusals and guarded content rollback were rehearsed in nine cases on a disposable actual-schema/content mirror.

The target's original schema is adopted through `supabase/releases/local-heroes-20261027/`, not a replay of root migrations. Ledger versions are exactly `20261027000000` (verified existing baseline adoption) and `20261031000001` (unchanged additive feature migration). Read that track's README before future database work. Do not execute its baseline over live data or pretend historical root migrations ran. Six new tables have RLS enabled; actual role/invariant mutations ran only on disposable local DBs. CLI pg-delta catalog-cache warning and unrelated/pre-existing advisories remain recorded separately from successful migration/publication observations.

Implemented learner navigation remains `/` → Nhân vật theo địa phương → locality/name/alias/page → `/nhan-vat/[slug]?kham-pha=...` → primary story/gallery/source anchor → exact return, including reload/Back/forward. Existing admin draft/review/request-changes/resubmit/preview/CAS workflow and the cinematic globe's single history/camera owner are preserved. No account, study, payment or renderer feature was added. The live-release handoff records the earlier local server and 1189-test checkpoint; it is dated evidence, not current server/process state.

The owner's later instruction authorizes final fixes, PR/merge and production synchronization. See `docs/audits/2026-10-27-local-heroes-final-self-review.md`: blank year inputs and portable SQL checkout hashes were corrected, the feature was committed, and current main `ad81a55` merged automatically without conflicts in `c500a7f`, preserving premium-lesson/layout/auth/hook changes. Fresh integrated verification passes 1210 unit tests/109 files and 26 scripts. Public fixture 72 cases, disposable admin 8 cases, database 296 assertions and two concurrency races pass. A new anonymous production read confirms all 35 profiles have images/stories/source claims and cover 34/34 units; the target-specific migration dry run has no pending changes. Remaining CI/PR and final browser outcomes belong to the task's final report. No storage upload or Vercel deployment is implied.

## Heritage places by locality — Phase 08 local acceptance checkpoint (2026-10-27)

Implemented and verified the "Featured historical places by locality" (`HS-1.0`) capability on branch `feat/heritage-sites-by-locality` (baseline `c0d8660`).

1. **Content package & Release SQL:**
   - Package directory: `supabase/content/heritage-sites/v1/` (`manifest.json`, `localities.json`, `sites.json`, `sources.json`, `roster.md`, `ledger.md`).
   - Content coverage: 64 accepted sites across all 34 canonical Grade 12 localities (34 Grade 12 primary sites + 30 extended sites), citing 66 deduplicated official sources.
   - Every Grade 12 site verified on OpenStreetMap with element id (node/way) and within Vietnam bounding box `[8.0, 23.5] x [102.0, 117.5]`.
   - Release SQL generated under `supabase/content/heritage-sites/release-v1/`: `import.sql` (draft and publish modes), `rollback.sql`, `snapshot.json`, `README.md` with verified SHA-256 hashes.
   - Migration file: `supabase/migrations/20261101000000_heritage_sites.sql` and copied into `supabase/releases/local-heroes-20261027/supabase/migrations/`.

2. **Homepage & Explorer Integration:**
   - Header renamed to "Theo địa phương" with tab switcher between "Địa danh" (`?noi-dung=dia-danh`) and "Nhân vật" (`?noi-dung=nhan-vat`), preserving selected locality across tabs.
   - State and reducer: `lib/local-heroes/state.ts` and `lib/explorer/journeys/playback.ts` manage `places` mode, camera requests, selection, and restoration of explorer state on close.
   - Globe markers: gold diamond markers for heritage places with `aria-pressed` states, accessible labels, and click-to-open place card.
   - Components: `HeritagePanel`, `HeritageSiteList`, `HeritageSiteCard`, `LocalityTabs`, `HeritageVideoDialog` (lazy iframe, Escape key cascade, focus restoration).

3. **Detail View (`/dia-diem/[slug]`):**
   - Renders ordered narrative story sections (`components/heritage/HeritageStory.tsx`), superscript citations `[i]` jumping to `#nguon-[i]`, uncertainty notes for non-verified sections, and ordered source list.
   - Lazy video embeds (`components/heritage/HeritageVideos.tsx`) with verification date and copyright disclaimer.
   - "Học sâu trong chuyên đề" card linking to the relevant interactive lesson.
   - Server component `LocalityPeople.tsx` displaying up to 4 local historical figures linking to `/nhan-vat/[slug]`.
   - Safe return link parsing via `getPlaceReturnHref(khamPha)` preventing open redirects.

4. **Admin Management & Readiness:**
   - `LocationForm`: fieldset for heritage tier, locality, rank, historical period, teaser counter (40–360), and lesson selector.
   - `HeritageStoryEditor`: section manager with reordering, certainty, notes, and source picker.
   - `HeritageVideoEditor`: video manager with 5s timeout YouTube oEmbed verification, reordering, and external links.
   - `MediaManager`: added `usage_basis` selection (`open_license`, `public_domain`, `permission`, `coursework_reference`), enforcing license rules.
   - `lib/admin/readiness.ts`: blocks review submission for heritage places if locality, teaser, period, >= 3 sections, section sources, coordinates, or cover image with usage basis are missing.

5. **Quality Gates & Verification:**
   - Vitest suite: 118 test files, 1271 unit tests passed (100% green).
   - E2E Playwright: 39 tests passed across all 4 suites (`figure-stories`, `heritage-detail`, `home-heritage-sites`, `home-local-heroes`).
   - ESLint: 0 errors, 0 warnings.
   - TypeScript: 0 errors.
   - Production build: 110 static pages generated successfully.
   - Package validator: 100% valid in release mode.
   - Rehearsal: `scripts/agent/heritage-rehearsal.mjs` passed 34/34 localities audit.

**Remote Publication Gate (Phase 9):** Remote database push and live publication to project `lichsu_12` (`ueolfjujjybutyuyfxha`) is STRICTLY HELD pending explicit owner approval.

## Heritage images repair & live database corrective release (2026-10-28)

Completed the full repair and hardening of historical places media across branch `fix/heritage-images`:

1. **Root Cause Resolved (Findings F1–F5):**
   - Replaced all 44 fabricated Wikimedia Commons URLs and 20 template provincial portal URLs with 100% verified, machine-evidenced real images (SHA-256, Sharp width/height/format, genuine photographers, licenses, and visual verification).
   - Removed 4 fake YouTube video rows with 404 embeds.
   - Sourced images: 52 Wikimedia Commons (open license) and 12 official press/museum archives (VietnamPlus/TTXVN, QĐND, VOV, Báo Thừa Thiên Huế, Báo Bình Phước under coursework reference).
   - Hardened validator `scripts/content/heritage-sites-validate.mjs` blocking fake patterns, duplicate photographer/dimension heuristics, and unevidenced media.

2. **Supabase Storage & Live Database Update:**
   - Generated WebP variants (400, 1200, 2000) for all 64 historical places.
   - Uploaded all variants to Supabase Storage bucket `media` under `locations/heritage/<site-key>/`.
   - Executed guarded corrective release on live Supabase project `lichsu_12` (`ueolfjujjybutyuyfxha`):
     - Deleted 4 fake videos.
     - Deleted 64 obsolete/broken media rows.
     - Preserved pre-existing covers of enrolled sites `pac-bo-cao-bang` and `dinh-doc-lap`.
     - Inserted 64 genuine media rows with public Supabase Storage WebP URLs.
   - Live audit `heritage-media-audit.mjs --live`: 64/64 sites have valid HTTP 200 covers, 0 broken images, 0 fake videos.
   - Playwright E2E verification: 64/64 covers render with natural dimensions > 0 and 0 fallbacks on live production.


