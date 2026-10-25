# Country Boundaries Globe Acceptance Audit — Phase 3 (B3)

**Date:** 2026-10-24\
**Scope:** Acceptance verification of the narrow country-boundary extension on the cinematic Three.js Earth\
**Authority:** `docs/agent/prompts/country-boundaries/phase-3.md`, `shared-contract.md`, and `docs/superpowers/plans/2026-10-24-country-boundaries-globe-plan.md`\
**Prior Baseline:** P6 cinematic acceptance audit (`docs/audits/2026-10-23-cinematic-globe-acceptance.md`)

---

## 1. Executive Summary

The narrow country-boundary extension on the cinematic history globe passes all visual, behavioral, resilience, performance, and memory gates on the fresh Next.js 16.3.8 production build.

Key highlights:
- **Test Gate:** **68/68 public desktop homepage E2E tests passed** (including 15 new country boundary tests and 53 retained public regressions across 5 test suites).
- **Quality Gate:** `pnpm verify` passed with exit code 0 (**873 unit tests across 68 files**, 42 history data checks, 8 agent-hook tests, ESLint, TypeScript strict, and 102 static production pages).
- **Payload Gates:**
  - Boundary GeoJSON gzip: **129.23 KiB** (132,335 bytes) ≤ **150 KiB** limit (**PASS**).
  - Total runtime geography gzip (4 assets): **572.57 KiB** (586,312 bytes) ≤ **600 KiB** cap (**PASS**).
- **Rendering & Cost Gates:**
  - Added draw calls: **exactly +1 draw call** (6 draw calls boundary-off vs. 7 draw calls boundary-on; limit ≤ 1) (**PASS**).
  - Rendered segments: **19,213 segments** (with source-aware suppression of 349 shared-border segments; budget ≤ 60,000) (**PASS**).
  - Geometry buffer allocation: **461,112 bytes** (~450.3 KiB; target ≤ 4 MiB) (**PASS**).
  - Active flight frame intervals (10-second flight, DPR 1.5, 4 desktop sizes):
    - **Median interval:** **16.70 ms** (60 FPS equivalent) ≤ **33.3 ms** limit (**PASS**).
    - **p95 interval:** **16.80 – 16.90 ms** ≤ **50.0 ms** limit (**PASS**).
  - **Idle behavior:** **0 WebGL draw calls, 0 rAF callbacks** over 1500 ms settled window (**PASS**).
  - **Hidden behavior:** **0 draw calls, 0 rAF callbacks** over 4000 ms hidden window; URL held and target settled on return (**PASS**).
  - **Lifecycle & teardown:** 5 consecutive SPA mount/dispose cycles show **0 leaked live WebGL contexts** and complete disposal of buffers/programs (**PASS**).

---

## 2. Measurement Configuration & Methodology

Measurements were captured in a quiet window without concurrent test or build activity, targeting the local Next.js production server (`http://localhost:3100`).

- **Machine:** Intel Core i5-11400H @ 2.70 GHz (6 cores / 12 threads), 16 GB RAM, Windows 10 x64.
- **Browser:** Microsoft Edge / HeadlessChrome `155.0.4283.62`.
- **WebGL Backend:** WebGL 2.0 (OpenGL ES 3.0 Chromium), ANGLE Direct3D11 (`Intel(R) UHD Graphics (0x00009A68)`), `EXT_disjoint_timer_query_webgl2` active.
- **Display Configurations:** Tested at CSS viewports 1280×720, 1366×768, 1440×900, 1920×1080 at DPR 1.5 (stress configuration).
- **Flight Test Protocol:** 10,000 ms continuous flight alternating intercontinental stops (`Sài Gòn 1911` ↔ `Marseille 1911`) at 0 ms, 3000 ms, 6000 ms, 9000 ms.
- **Data Capture:** Stored in `output/playwright/country-boundaries/phase-3/measurements.json`.

---

## 3. Comparative Measurements: Baseline vs. Extension

| Metric | Prior P6 Baseline | Boundary-OFF (B3 Target) | Boundary-ON (B3 Target) | Extension Limit | Outcome |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Boundary Gzip Payload** | N/A (no asset) | 0 B | 129.23 KiB (132,335 B) | ≤ 150 KiB | **PASS** |
| **All Runtime Geography Gzip** | 443.77 KiB (3 files) | 443.34 KiB (3 files) | 572.57 KiB (4 files) | ≤ 600 KiB | **PASS** |
| **Rendered Line Segments** | 0 country lines | 0 country lines | 19,213 segments | ≤ 60,000 | **PASS** |
| **Active Scene Draw Calls** | 6 draw calls | 6 draw calls | 7 draw calls | ≤ +1 call | **PASS (+1)** |
| **Added Geometry Buffer** | 0 B | 0 B | 461.1 KiB (positions) | ≤ 4.0 MiB | **PASS** |
| **Flight Median Interval (1440×900)** | 8.4 ms (DPR 1.5) | 16.7 ms (DPR 1.5) | 16.70 ms (DPR 1.5) | ≤ 33.3 ms | **PASS** |
| **Flight p95 Interval (1440×900)** | 16.7 ms (DPR 1.5) | 16.8 ms (DPR 1.5) | 16.80 ms (DPR 1.5) | ≤ 50.0 ms | **PASS** |
| **Settled Idle Draws (1500 ms)** | 0 draws | 0 draws | 0 draws | 0 draws | **PASS** |
| **Hidden Page Draws (4000 ms)** | 0 draws | 0 draws | 0 draws | 0 draws | **PASS** |
| **Live WebGL Contexts (disposed)**| 0 live contexts | 0 live contexts | 0 live contexts | 0 leaked | **PASS** |

*Note on P6 vs B3 baseline comparison:* The P6 baseline audit was conducted on an earlier version of the cinematic globe. In B3, all measurements were freshly captured on the integrated codebase, confirming that rendering the country-boundary layer adds exactly 1 draw call, negligible memory (~450 KiB), and maintains solid 60 FPS (16.7 ms) frame timing across all 4 desktop resolutions.

---

## 4. Four-Size Visual Evidence Matrix

Visual matrix captures were recorded under `output/playwright/country-boundaries/phase-2/` across 4 key application states and all 4 desktop viewports:

1. **Default View (Vietnam Focus):**
   - [default-1280x720.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/default-1280x720.png)
   - [default-1366x768.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/default-1366x768.png)
   - [default-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/default-1440x900.png)
   - [default-1920x1080.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/default-1920x1080.png)
2. **World View (Planetary Overview):**
   - [world-1280x720.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/world-1280x720.png)
   - [world-1366x768.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/world-1366x768.png)
   - [world-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/world-1440x900.png)
   - [world-1920x1080.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/world-1920x1080.png)
3. **Event Card View:**
   - [card-1280x720.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/card-1280x720.png)
   - [card-1366x768.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/card-1366x768.png)
   - [card-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/card-1440x900.png)
   - [card-1920x1080.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/card-1920x1080.png)
4. **European Journey Stop (Paris 1919):**
   - [journey-paris-1280x720.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/journey-paris-1280x720.png)
   - [journey-paris-1366x768.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/journey-paris-1366x768.png)
   - [journey-paris-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/journey-paris-1440x900.png)
   - [journey-paris-1920x1080.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-2/journey-paris-1920x1080.png)
5. **Phase 1 Matched Ready vs. Blocked Comparison:**
   - [boundaries-ready-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-1/boundaries-ready-1440x900.png)
   - [boundaries-blocked-1440x900.png](file:///D:/lich-su-viet-nam-interactive/output/playwright/country-boundaries/phase-1/boundaries-blocked-1440x900.png)

### Visual Hierarchy & Calibration Assessment
- **Subordinate Styling:** Country borders render with warm slate `#56605a`, non-transparent stroke to avoid junction bead artifacts, and responsive line width (0.55 px world, 0.75 px overview, 0.95 px close zoom).
- **Vietnam Prominence:** Vietnam's gold mainland outline (1.5 px linewidth, `#f7dfad` / `#e7c47f`) and tinted polygon cap remain distinctly dominant over adjacent country lines.
- **Shared-Edge Alignment:** Suppression of the 3 Natural Earth shared border segments (`1746705493`, `1746707417`, `1746707649`) eliminates double-stroking and clashing along Vietnam's northern and western land borders.
- **Depth & Occlusion:** Depth test is active (`depthTest: true`, `depthWrite: false`, `renderOrder: 2`), ensuring lines on the far side of the globe are physically occluded by the sphere.
- **Passive Atlas Layer:** Boundary lines do not capture pointer events or interfere with event marker clicks, clusters, or card navigation.

---

## 5. Resilience & Optional Loading Verification

The boundary asset is loaded concurrently as an optional visual enhancement:
- **HTTP 404 / Network Abort:** Sets `data-country-boundaries="unavailable"`; Earth, atmosphere, stars, Vietnam outline, and event markers render normally with zero errors.
- **Malformed JSON / Corrupt Coordinates:** Gracefully caught, status set to `unavailable`, scene remains fully interactive.
- **Rapid Navigation / Cancellation:** Aborting or switching views before the asset arrives marks the callback inert and prevents stale mesh attachment.
- **Keyboard & Attribution Access:** Map attribution discloses the modern generalized nature of the boundaries, the omission policy, and provides a keyboard-navigable link to `history-country-boundaries.provenance.json`.

---

## 6. Demonstrated Defect & Targeted Repair

During Phase 3 full regression testing, `tests/e2e/home-cinematic-globe.spec.ts:97` (`atlas shell default/card/journey fits <size>`) initially reported a collision between inline links inside `.globe-attribution[open]`.
- **Root Cause:** When links in `.globe-attribution` wrapped onto multiple lines, inline `<a>` tags produced a multi-line bounding box spanning the union of line fragments, triggering Playwright's collision assertion against adjacent links.
- **Targeted Repair:** Added `display: inline-block` to `.globe-attribution a` in `components/explorer/explorer-map.css`. Each link now maintains a tight single-line bounding box.
- **Verification:** Rebuilt production bundle and re-ran the full 68-test suite; all 4 viewport layout tests and all 68 tests passed cleanly.

---

## 7. Deferred Items & Explicit Boundaries

1. **Mobile / Tablet Testing:** Out of scope per `docs/product/DESKTOP-UI-SCOPE.md`. Existing responsive desktop behavior is preserved.
2. **Disputed & Provisional Boundaries:** 33 non-ordinary feature classes (lines of control, disputed zones) remain excluded from the solid boundary asset with full inventory retained in `.provenance.json`.
3. **Historical Borders by Year:** Modern generalized boundaries are provided solely for spatial orientation. Time-filtering does not reconstruct historical borders for specific years.
4. **Close-Zoom Texture Sharpness:** 4K planetary imagery softness at close zoom levels (authored presets 6.4 and 7) remains unchanged from P6 baseline.
5. **No External Writes or Publication:** No git commit, push, PR, merge, or deployment was performed.

---

## 8. Final Gate Evidence

- **Unit & Integrity Tests:**
  `pnpm exec vitest run tests/unit/explorer-country-boundaries.test.ts tests/unit/explorer-globe.test.ts tests/unit/explorer-cinematic-projection.test.ts`
  → **3 files, 48 tests passed in 582 ms**.
- **Full Quality Gate:**
  `pnpm verify`
  → **Exit code 0** (5 project skills, 42 history checks, ESLint, TypeScript strict, 873 unit tests, 8 hook tests, production build 102/102 pages).
- **Public Desktop E2E Suites:**
  `pnpm exec playwright test tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts --workers=1`
  → **68 passed in 6.2 minutes** (0 failed, 0 flaky).
- **Diff & Git Cleanliness:**
  `git diff --check` → Clean (pre-existing line-ending notices only).
  `git status --short` → Inspected; dirty workspace and untracked files preserved.
