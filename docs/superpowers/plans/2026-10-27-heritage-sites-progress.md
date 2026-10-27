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

