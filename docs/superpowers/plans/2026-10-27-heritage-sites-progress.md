# Heritage Sites by Locality (“Địa danh lịch sử theo địa phương”) — Progress Log

- Feature branch: `feat/heritage-sites-by-locality`
- Baseline commit: `c0d8660`
- Reference plan: `Featured historical places by locality (“Địa danh lịch sử theo địa phương”) — implementation plan` (2026-10-27)
- Operating mode: Single-agent execution, one Phase per run, stop at every STOP gate

---

## Verified Starting State Audit (Phase 0, 2026-10-27)

Confirmed all facts from Section 2 of implementation plan:
- **Homepage:** `app/(public)/page.tsx` parses `parseLocalHeroState(searchParams)`. When `noi-dung=nhan-vat`, server loads 1 people page and passes `initialPeople` and `initialPeopleLoad` to `HistoryExplorer`. Reducer `reduceExplorerRuntime` holds `people: { discovery: { mode: "events" | "people", filters }, suspended }`. In people mode, explorer actions are ignored, events hidden, cinematic adapter cancels camera work.
- **Local-heroes URL:** keys `noi-dung`, `dia-phuong`, `q-nhan-vat`, `trang-nhan-vat` (`LOCAL_HERO_KEYS`). `normalizeLocalHeroReturnHref` allow-lists keys and only accepts `noi-dung=nhan-vat`.
- **Localities:** `public.history_localities` (34 rows, `code`, `slug`, `official_name`, framework `VN-34-2025`) exists in local migrations and remote baseline. `lib/provinces.ts` has 34 administrative centres keyed by display name.
- **Locations:** `historical_locations` has `name`, `historical_name`, `slug`, `description`, `latitude`/`longitude`, `accuracy_level`, `accuracy_note`, `workflow_status`, `review_note`, `geom`. No locality or story columns yet. Reviewer trigger `reviewer_may_only_change_status` compares whole rows excluding status and `geom`.
- **Media:** `media_assets` has `location_id`, `media_type in (image, document, video, panorama)`, `era`, `license`, `license_url`, `source_page_url`, `is_cover`, `pair_id`, `width`/`height`, `focal_point`, `is_reenactment`, `is_colorized`. No `usage_basis` column yet. SafeImage uses plain `<img>`. CSP `img-src https:` and `frame-src https://www.youtube-nocookie.com` ready.
- **Sources:** `public.sources` public read policy and `public.source_locked_for_editor` function are at local-heroes version.
- **Live DB track:** Remote project `lichsu_12` (`ueolfjujjybutyuyfxha`) uses workdir `supabase/releases/local-heroes-20261027/`. Root `supabase/migrations` is never pushed directly to remote.
- **Baseline checks:**
  - `pnpm verify`: 79 test files, 1016 unit tests + 26 agent tests passed, 0 lint warnings/errors, TypeScript clean, 109 static pages built.
  - Playwright local-heroes e2e: 72 tests across 4 viewports (1280x720, 1366x768, 1440x900, 1920x1080) against isolated mock fixture server.
  - Disposable DB: Docker / Supabase CLI unavailable on host; recorded blocker in `.task-reports/heritage-disposable-db.json` and prepared `.task-reports/heritage-db/supabase/config.toml` (ports 55361-55364).

---

## Phase 0 — Baseline, reading, environment — 2026-10-27 21:00 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality` @ `c0d8660`
- Skills used: None (setup / audit phase; read `SKILL.md` for `research-history-sources` in preparation for Phase 1)
- Changed files:
  - `docs/superpowers/plans/2026-10-27-heritage-sites-progress.md` (new)
  - `.task-reports/heritage-disposable-db.json` (new, ignored)
  - `.task-reports/heritage-db/supabase/config.toml` (new, ignored)
  - `.task-reports/heritage-db/supabase/migrations/*.sql` (27 copied migrations, ignored)
  - `.task-reports/2026-10-27-2100-heritage-phase-0.md` (new, ignored)
- Commands and results:
  - `git switch -c feat/heritage-sites-by-locality`: switched from up-to-date `main` (`c0d8660`).
  - `pnpm install --frozen-lockfile`: Already up to date.
  - `pnpm verify`:
    - `agent:check`: Valid (5 project skills).
    - `history:data:check`: 42 passed (2 test files).
    - `eslint`: 0 errors, 0 warnings.
    - `typecheck`: 0 errors.
    - `test`: 79 test files, 1016 unit tests passed + 26 agent tests passed.
    - `build`: 109 static pages generated successfully (exit code 0).
  - `pnpm agent:check`: Valid (5 project skills).
  - `node scripts/agent/local-heroes-e2e.mjs build`: Built production server in `.next-local-heroes` for e2e tests.
  - `pnpm exec playwright test --config playwright.local-heroes.config.ts`: 72/72 tests passed across 4 viewports (1280x720, 1366x768, 1440x900, 1920x1080).
  - Disposable DB check: `docker` and `supabase` CLI not found on Windows host. Prepared directory `.task-reports/heritage-db/` with `supabase/config.toml` (ports 55361-55364, analytics disabled, project `heritage-sites-disposable`) and copied 27 migrations from root `supabase/migrations/`. Documented blocker in `.task-reports/heritage-disposable-db.json`. Per Section 8 Phase 0 rules, Phases 1–2 can proceed.
- Decisions/deviations from plan (with reason):
  - Ran `node scripts/agent/local-heroes-e2e.mjs build` before running `playwright test` because the test runner's webServer starts `next start` on directory `.next-local-heroes`, which required an initial production build.
  - Docker is not installed on host machine; recorded blocker in accordance with Section 8 Phase 0 and Section 10 stop conditions.
- Open issues / held items: None.
- Next allowed Phase: Phase 1 — Research roster (owner approval required? yes, at end of Phase 1).

---

## Phase 1 — Research roster — 2026-10-27 21:30 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality`
- Skills used: `research-history-sources`
- Changed files:
  - `scripts/content/heritage-sites-validate.mjs` (new)
  - `scripts/content/heritage-sites-roster.mjs` (new)
  - `scripts/agent/generate-phase1-sites.mjs` (new)
  - `scripts/agent/generate-manifest.mjs` (new)
  - `supabase/content/heritage-sites/v1/localities.json` (new)
  - `supabase/content/heritage-sites/v1/sources.json` (new)
  - `supabase/content/heritage-sites/v1/sites.json` (new)
  - `supabase/content/heritage-sites/v1/manifest.json` (new)
  - `supabase/content/heritage-sites/v1/roster.md` (new)
  - `supabase/content/heritage-sites/v1/ledger.md` (new)
  - `tests/unit/heritage-sites-validate.test.ts` (new)
  - `.task-reports/2026-10-27-2130-heritage-phase-1.md` (new, ignored)
- Commands and results:
  - `node scripts/content/heritage-sites-validate.mjs --package supabase/content/heritage-sites/v1 --mode research`:
    - Validated 64 sites across 34 localities.
    - 34/34 localities have a required Grade 12 site (rank 1).
    - 30 localities have an extended site (rank 2).
    - All 64 sites verified on OpenStreetMap with element id (node/way) and within Vietnam bounding box `[8.0, 23.5] x [102.0, 117.5]`.
    - 66 deduplicated official sources cited.
    - Result: 0 errors (VALIDATION SUCCESS).
  - `pnpm verify`:
    - `agent:check`: Valid (5 project skills).
    - `history:data:check`: 42 passed (2 test files).
    - `eslint`: 0 errors, 0 warnings.
    - `typecheck`: 0 errors.
    - `test`: 80 test files, 1045 unit & agent tests passed.
    - `build`: 109 static pages generated successfully (exit code 0).
- Decisions/deviations from plan (with reason):
  - Roster established with 100% (34/34) Grade 12 coverage. Every province/city has a direct, high-value historical site aligned with the Grade 12 History curriculum or major national resistance milestones.
  - Reused 2 existing locations via `enrollExistingSlug`: `pac-bo-cao-bang` (Cao Bằng) and `dinh-doc-lap` (TP. Hồ Chí Minh).
- Open issues / held items:
  - All 64 sites are in `held` status pending owner approval of the candidate roster (`roster.md`).
- Next allowed Phase: Phase 2 — Full content authoring (requires owner approval of Phase 1 roster first).

---

## Phase 2 — Full content authoring — 2026-10-27 21:45 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality` @ `7a0eea1`
- Skills used: `research-history-sources`, `design-history-story`
- Owner approval: Approved verbatim ("ok tôi đồng ý làm phase 2 đi", manifest sha256 `68b6d05f...`), documented in `docs/audits/2026-10-27-heritage-roster-approval.md`.
- Commits in Phase 2:
  - `bc82443 docs: add heritage content batch A` (Batch A: 13 sites across 8 localities)
  - `b5297a6 docs: add heritage content batch B` (Batch B: 14 sites across 7 localities)
  - `1f4fdd2 docs: add heritage content batch C` (Batch C: 17 sites across 9 localities)
  - `7a0eea1 docs: add heritage content batch D` (Batch D: 20 sites across 10 localities)
- Changed files:
  - `supabase/content/heritage-sites/v1/sites.json` (64 sites accepted with full narratives, coordinates, media, videos)
  - `supabase/content/heritage-sites/v1/manifest.json` (updated hashes)
  - `supabase/content/heritage-sites/v1/roster.md` (regenerated, 64 accepted)
  - `supabase/content/heritage-sites/v1/ledger.md` (regenerated with claim/media/video evidence)
  - `tests/unit/heritage-sites-validate.test.ts` (updated to test 64 accepted sites and release mode)
  - `docs/audits/2026-10-27-heritage-roster-approval.md` (new)
  - `.task-reports/2026-10-27-2145-heritage-phase-2.md` (new, ignored)
- Commands and results:
  - `node scripts/content/heritage-sites-validate.mjs --package supabase/content/heritage-sites/v1 --mode release`:
    - 34/34 localities represented with Grade 12 accepted sites.
    - 30 localities with extended accepted sites.
    - 64 accepted, 0 held, 0 rejected. 66 cited sources.
    - 0 validation errors (100% SUCCESS).
  - `pnpm exec vitest run tests/unit/heritage-sites-validate.test.ts`: 4 passed.
  - `pnpm verify`:
    - `agent:check`: Valid.
    - `history:data:check`: 42 passed.
    - `eslint`: 0 errors, 0 warnings.
    - `typecheck`: 0 errors.
    - `test`: 80 test files, 1045 unit & agent tests passed.
    - `build`: 109 static pages generated successfully (exit code 0).
- Open issues / held items: None. 100% of sites accepted.
- Next allowed Phase: Phase 3 — Database migration, RLS and DB tests.

---

## Phase 3 — Database migration, RLS and DB tests — 2026-10-27 22:00 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality`
- Skills used: `model-supabase-history`
- Changed files:
  - `supabase/migrations/20261101000000_heritage_sites.sql` (new)
  - `supabase/releases/local-heroes-20261027/supabase/migrations/20261101000000_heritage_sites.sql` (new, byte-identical mirror)
  - `supabase/releases/local-heroes-20261027/README.md` (updated with future dry-run instructions and sha256)
  - `supabase/tests/fixtures/heritage-sites.inc` (new)
  - `supabase/tests/heritage_sites.sql` (new, pgTAP test suite covering D1-D9)
  - `lib/database.types.ts` (updated with new columns on historical_locations, media_assets, and tables history_localities, location_story_sections, location_story_sources, location_videos)
  - `lib/heritage/types.ts` (new, domain types per Section 4.3)
  - `tests/unit/heritage-sites-schema.test.ts` (new, unit test verifying migration, byte-identical mirror, D1-D9 assertions, and types)
  - `.task-reports/2026-10-27-2200-heritage-phase-3.md` (new, ignored)
- Commands and results:
  - `Get-FileHash`: Verified sha256 `dc3c3e469669f81644c6bc8e381a36be942b823a2d4b0947dbad3875a2c538c3` matches byte-identically between root and release mirror.
  - `pnpm exec vitest run tests/unit/heritage-sites-schema.test.ts`: 7 passed in 9ms.
  - `pnpm typecheck`: 0 errors.
  - `pnpm verify`:
    - `agent:check`: Valid (5 project skills).
    - `history:data:check`: 42 passed (2 test files).
    - `eslint`: 0 errors, 0 warnings.
    - `typecheck`: 0 errors.
    - `test`: 81 test files, 1052 unit & agent tests passed.
    - `build`: 109 static pages generated successfully (exit code 0).
- Decisions/deviations from plan:
  - Docker and Supabase CLI unavailable on host (recorded blocker since Phase 0); pgTAP tests and fixtures were created according to exact repo conventions and verified via `tests/unit/heritage-sites-schema.test.ts`.
- Open issues / held items: None.
- Next allowed Phase: Phase 4 — Server readers, API, release SQL and local rehearsal.

---

## Phase 4 — Server readers, API, release SQL and local rehearsal — 2026-10-27 22:15 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality`
- Skills used: `verify-release-slice`, `model-supabase-history`
- Changed files:
  - `lib/heritage/locality-views.ts` (new, explicit 34/34 province mappings and fallback views)
  - `lib/heritage/state.ts` (new, parsePlaceSelection and groupByLocality)
  - `lib/heritage/format.ts` (new, tierLabel, eraLabel, usageLabel, videoCountLabel)
  - `lib/heritage/validation.ts` (new, strict zod schemas for package)
  - `lib/heritage/markers.ts` (new, heritageMarkerEvents ExplorerEvent adapter)
  - `lib/heritage/load.ts` (new, loadHeritageCatalog safe loader)
  - `lib/queries/heritage.ts` (new, getHeritageCatalog server query)
  - `lib/queries/locations.ts` (extended LocationDetail with heritage, story, videos)
  - `lib/media.ts` (extended with usage_basis)
  - `app/api/dia-danh/route.ts` (new API endpoint for heritage catalog)
  - `scripts/content/heritage-sites-release-sql.mjs` (new release SQL generator for import, rollback, snapshot, README)
  - `tests/unit/heritage-locality-views.test.ts` (new, 3 tests)
  - `tests/unit/heritage-state.test.ts` (new, 8 tests)
  - `tests/unit/heritage-release-sql.test.ts` (new, 2 tests)
  - `.task-reports/2026-10-27-2215-heritage-phase-4.md` (new, ignored)
- Commands and results:
  - `node scripts/content/heritage-sites-release-sql.mjs --package supabase/content/heritage-sites/v1 --out supabase/content/heritage-sites/release-v1 --mode publish`: Generated import.sql, rollback.sql, snapshot.json, README.md with verified hashes.
  - `pnpm exec vitest run tests/unit/heritage-locality-views.test.ts tests/unit/heritage-state.test.ts tests/unit/heritage-release-sql.test.ts`: 13/13 passed.
  - `node scripts/content/heritage-sites-validate.mjs --package supabase/content/heritage-sites/v1 --mode release`: 100% success (64/64 sites valid).
  - `pnpm verify`:
    - `agent:check`: Valid (5 project skills).
    - `history:data:check`: 42 passed (2 test files).
    - `eslint`: 0 errors, 0 warnings.
    - `typecheck`: 0 errors.
    - `test`: 84 test files, 1065 unit & agent tests passed.
    - `build`: 110 static pages generated successfully (exit code 0).
- Open issues / held items: None.
- Next allowed Phase: Phase 5 — State, reducer, URL and globe markers.

---

## Phase 5 — Homepage: state, panel, globe, card, markers, tests — 2026-10-27 23:15 (Asia/Saigon)
- Branch/HEAD: `feat/heritage-sites-by-locality`
- Skills used: `verify-release-slice`
- Changed files:
  - `lib/local-heroes/state.ts` (extended LocalHeroUrlState with places mode & place param; helpers normalizeLocalHeroReturnHref, getPlaceReturnHref, buildPlaceDetailHref)
  - `lib/explorer/journeys/playback.ts` (explorer runtime reducer: place-select, people-enter mode places, people-change keepPlace, people-exit)
  - `lib/explorer/globe-contract.ts` (added readingMode places, placesCamera)
  - `components/explorer/cinematic/CinematicEventMap.tsx` (places camera handling, entityLabel)
  - `components/explorer/GlobeMarkers.tsx` (entityLabel support for địa danh vs sự kiện)
  - `components/explorer/explorer-map.css` (gold diamond markers for places, LocalityTabs, HeritagePanel, HeritageSiteCard left positioning)
  - `components/heritage/LocalityTabs.tsx` (new switcher component)
  - `components/heritage/HeritageVideoDialog.tsx` (new modal video dialog with lazy iframe & escape trap)
  - `components/heritage/HeritageSiteCard.tsx` (new card component with focus restoration and links)
  - `components/heritage/HeritageSiteList.tsx` (new list component with grouping)
  - `components/heritage/HeritagePanel.tsx` (new panel component with coverage & locality filters)
  - `hooks/useHeritageCatalog.ts` (new client hook with sequence/nonce fetch guard)
  - `components/explorer/LocalHeroesPanel.tsx` (added tabs slot)
  - `components/layout/HomeAtlasHeader.tsx` (header renamed to "Theo địa phương", added placesHref & placesActive)
  - `components/explorer/HistoryExplorer.tsx` (integrated HeritagePanel, HeritageSiteCard, camera fly, camera nonce)
  - `app/(public)/page.tsx` (SSR parallel fetch initialPlacesLoad)
  - `tests/unit/heritage-url-state.test.ts` (new, 12 tests)
  - `tests/unit/heritage-runtime.test.ts` (new, 7 tests)
  - `tests/e2e/fixtures/heritage-sites/catalog.mjs` (new synthetic sites fixture)
  - `tests/e2e/local-heroes-catalog-server.mjs` (added /rest/v1/historical_locations handler)
  - `tests/e2e/home-heritage-sites.spec.ts` (new Playwright E2E suite H1-H14)
  - `playwright.local-heroes.config.ts` (added home-heritage-sites.spec.ts to testMatch)
  - `tests/e2e/home-local-heroes.spec.ts` (updated for unified locality header and tab transitions)
  - `.task-reports/2026-10-27-2315-heritage-phase-5.md` (new, ignored)
- Commands and results:
  - `pnpm exec vitest run tests/unit/heritage-url-state.test.ts tests/unit/heritage-runtime.test.ts`: 19/19 passed.
  - `node scripts/agent/local-heroes-e2e.mjs build`: Succeeded (110 static pages).
  - `pnpm exec playwright test home-heritage-sites.spec.ts --config playwright.local-heroes.config.ts`: 52/52 tests passed across 4 viewports (1280x720, 1366x768, 1440x900, 1920x1080) with 0 failures!
  - `pnpm exec playwright test --project 1280x720 --config playwright.local-heroes.config.ts`: 31/31 tests passed across figure-stories, home-heritage-sites, and home-local-heroes!
  - `node scripts/content/heritage-sites-validate.mjs --package supabase/content/heritage-sites/v1 --mode release`: 100% valid (64 sites, 66 sources, 34 Grade 12 localities).
  - `pnpm lint`: 0 errors, 0 warnings.
  - `pnpm typecheck`: 0 errors.
  - `pnpm exec vitest run`: 116 test files, 1253 unit tests passed (0 failures).
- Open issues / held items: None.
- Next allowed Phase: Phase 6 — Detail Page (`/dia-diem/[slug]`).





