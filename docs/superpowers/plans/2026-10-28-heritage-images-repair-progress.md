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
