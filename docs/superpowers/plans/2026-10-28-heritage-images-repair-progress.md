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
