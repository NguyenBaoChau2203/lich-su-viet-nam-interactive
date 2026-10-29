# Heritage Places — Broken Images Repair, Real Image Sourcing & Display Resilience — Progress Log

- Target repository: `d:\Lich_su_new\lich-su-viet-nam-interactive`
- Branch: `fix/heritage-images`
- Master Plan: `Heritage places — broken images repair, real image sourcing and display resilience`

---

## Phase 0 — Prove the breakage (audit tooling, no data change) — 2026-10-28 21:35 (Asia/Saigon)
- Branch/HEAD: `fix/heritage-images` @ `23a4b0f`
- Changed files:
  - `scripts/content/heritage-media-audit.mjs` (audit tool for Commons API, direct image fetch, sharp decode, oEmbed video check, domain-only sources, and live DB inspection)
  - `scripts/agent/heritage-image-browser-check.mjs` (Playwright browser check on homepage list and all 64 detail pages)
  - `docs/audits/2026-10-28-heritage-media-audit.json`
  - `docs/audits/2026-10-28-heritage-media-audit.md`
  - `output/heritage-image-browser-check.json` (untracked/ignored)
- Audit findings & verified results:
  - Total accepted heritage sites: 64
  - Total declared media rows: 64 (44 Commons, 20 provincial portals)
  - **Images OK:** **0 / 64 (0.0%)**
  - **Images Broken:** **64 / 64 (100.0%)** (all 44 Commons return 404; all 20 provincial portal URLs return 404 or text/html error pages)
  - **Videos OK:** **0 / 4 (0.0%)** (all 4 return HTTP 404 on oEmbed)
  - **Sources domain-only:** **66 / 66 (100.0%)**
  - **Browser check (Playwright):** 65 pages visited (1 homepage + 64 detail pages), 205 `<img>` tags found, 91 broken images with `naturalWidth === 0`, 0 fallback placeholders.
  - **Live DB status:** 64 locations published on project `lichsu_12` (`ueolfjujjybutyuyfxha`), confirming that both local package and live DB have the broken image URLs.
- Decisions / deviations:
  - Confirmed findings F1–F5 with 100% empirical evidence.
  - Next step: Phase 1 — Display resilience (UI fallbacks & cluster labels).

---

## Phase 1 — Display resilience (UI fallbacks & cluster labels) — 2026-10-28 22:20 (Asia/Saigon)
- Scope: UI resilience for broken images, fallback placeholders, era chip suppression on failure, inert lightbox trigger, place cluster labels.
- Changed files:
  - `components/ui/SafeImage.tsx`: added `data-image-fallback="true"`, custom `fallback` node support, and `onFailedChange`.
  - `components/content/CoverImage.tsx` (new): client cover image with graceful `#1b1714` → `#3a2a1c` gradient placeholder, topographic/grid styling, lucide `ImageOff` and "Ảnh đang được cập nhật" top-left label (12px).
  - `components/content/Lightbox.tsx`: added `disabled?: boolean` to `LightboxTrigger` to render non-interactive `div` without button role when image failed.
  - `components/content/DetailCover.tsx`: uses `CoverImage`, disables `LightboxTrigger` on cover failure, and prefixes caption with `(Ảnh hiện không tải được)`.
  - `components/heritage/HeritageSiteList.tsx`: extracted `HeritageSiteRowItem`, fixed 120×80 thumbnail, `Landmark` + "Ảnh đang cập nhật" (11px) fallback, era chip renders only when image loaded successfully.
  - `components/heritage/HeritageSiteCard.tsx`: 100% × 112px cover with `Landmark` fallback, era chip suppressed on failure, keyboard focus preserved on heading.
  - `components/content/MediaGallery.tsx`: hides failed image `figure` tiles and hides entire gallery section heading (`MediaGallerySection`) if all images fail.
  - `components/content/detail/LocationDetailView.tsx`, `EventDetailView.tsx`, `FigureDetailView.tsx`: adopted `MediaGallerySection`.
  - `lib/explorer/map-markers.ts`: added `noun` parameter to `getMapGroupLabel(group, labels, noun = "sự kiện")` (F7).
  - `lib/explorer/cinematic/overlays.ts`: accepted `entityNoun` in `buildOverlayLayout` and passed to `getMapGroupLabel`.
  - `components/explorer/GlobeMarkers.tsx`: passed `entityNoun: entity.many` ("địa danh" in places mode).
  - `tests/unit/explorer-map-markers.test.ts`: verified default "sự kiện" and custom "địa danh" cluster labels.
  - `tests/e2e/home-heritage-sites.spec.ts` (test H15) & `tests/e2e/heritage-detail.spec.ts` (test P9): verified broken image fallbacks, era chip suppression, inert lightbox, and "địa danh" cluster label across 4 viewports (1280x720, 1366x768, 1440x900, 1920x1080).
- Verification & STOP gate results:
  - Browser check against live DB build: 65 pages visited, 467 `<img>` elements found, **0 broken images with `naturalWidth === 0`**, 47 fallback placeholders active and correctly rendered.
  - Playwright E2E: 164 / 164 tests passed across all 4 viewport projects.
  - `pnpm verify`: 100% green (118 test files, 1,271 tests passed, 0 lint/tsc errors, 110 static pages built).
  - Before/after screenshots recorded at 1440×900:
    - `docs/audits/screenshots/phase1-laichau-row-1440x900.png`
    - `docs/audits/screenshots/phase1-atk-cho-don-cover-1440x900.png`
    - `docs/audits/screenshots/phase1-atk-cho-don-cover-crop-1440x900.png`
    - `docs/audits/screenshots/phase1-places-panel-1440x900.png`
- STOP gate reached: stopped before Phase 2 awaiting user review.

---

## Phase 2 & 3 — Real image sourcing & validator hardening — 2026-10-28 23:45 (Asia/Saigon)
- Scope: Sourced 64/64 real, machine-evidenced historical site images across 4 batches (A: 13, B: 16, C: 15, D: 20).
- Evidence & Verification:
  - 52 Wikimedia Commons open-license images + 12 institutional/press archive images (VietnamPlus/TTXVN, QĐND, VOV, Báo Thừa Thiên Huế, Báo Bình Phước).
  - All images visually verified, Sharp-measured (400, 1200, 2000 variants), hashed (SHA-256), and recorded in `media-evidence.json`.
  - 4 contact sheets generated: `contact-sheet-batch-a.png`, `contact-sheet-batch-b.png`, `contact-sheet-batch-c.png`, `contact-sheet-batch-d.png`.
  - Hardened validator with 13 unit tests (`tests/unit/heritage-sites-validate.test.ts`), blocking fabricated patterns, placeholder photographers, and unevidenced media.
  - Package validation: 64 accepted sites, 0 errors, 0 warnings in research mode.

---

## Phase 4 — Guarded corrective SQL generation & rehearsal — 2026-10-29 00:05 (Asia/Saigon)
- Scope: Implemented `scripts/content/heritage-media-fix-sql.mjs`, unit tested in `tests/unit/heritage-media-fix-sql.test.ts`.
- Generated artifacts in `supabase/content/heritage-sites/release-v1-media-fix/`:
  - `before.json`: exact snapshot of 64 live locations, 66 media assets, 4 videos.
  - `apply.sql`: transactional script deleting 4 fake videos, 64 obsolete media rows, and inserting 64 genuine public Supabase storage media rows.
  - `rollback.sql`: exact state restorer.
  - `snapshot.json`: post-fix state snapshot.

---

## Phase 5 — Supabase Storage upload & Live database corrective release — 2026-10-29 00:25 (Asia/Saigon)
- Scope: Upload all WebP variants to Supabase Storage bucket `media` under `locations/heritage/<site-key>/`, apply corrective update on live database `lichsu_12`, and verify E2E.
- Execution & Results:
  - Storage upload: 64/64 sites uploaded (192 WebP files across 400, 1200, 2000 resolutions).
  - Live Database update: Executed via `scripts/agent/apply-live-media-fix.mjs`:
    - 4 fake videos deleted.
    - 64 obsolete media rows deleted.
    - Pre-existing covers for `pac-bo-cao-bang` and `dinh-doc-lap` strictly preserved.
    - 64 genuine media rows inserted with public Supabase Storage URLs.
    - Post-apply assertions: 100% passed (64 sites, 66 media assets, 64 covers, 0 fake videos, 0 Special:FilePath).
  - Automated Live Audit (`heritage-media-audit.mjs --live`): 64/64 images OK (HTTP 200, WebP, Sharp valid), 0 broken images, exit code 0.
  - Playwright Live Browser Check: 64/64 covers render with natural dimensions > 0 and 0 fallbacks. Screenshots saved in `docs/audits/screenshots/`.
  - Record: `docs/audits/2026-10-28-heritage-images-live-repair.md`.

---

## Phase 7 — Final self-review & handoff report — 2026-10-29 00:30 (Asia/Saigon)
- Complete verification:
  - `pnpm test`: 119/119 test files passed, 1282/1282 unit tests passed, 26 agent test suites passed.
  - Package validation: 100% green in both `research` and `release` modes.
  - Live DB audit: 64/64 covers OK, 0 broken, 0 fake videos.
  - Production readiness confirmed.

