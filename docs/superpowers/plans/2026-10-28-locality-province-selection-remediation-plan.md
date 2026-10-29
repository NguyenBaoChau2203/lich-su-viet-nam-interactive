# Province Selection and Connected Locality Cards — Remediation Plan

> **Implementer:** GPT 6.1 Sol, Max, one main agent. Execute tasks inline and label review as self-review. No subagents, separate AI reviewers, automatic commits or external publication. This document is a plan, not an implementation-completion claim.

**Goal:** Keep one compact locality interface, make a selected province lift slightly on the existing globe and connect it to floating place/person cards, correct close semantics, and keep broken media from crashing locality exploration.

**Architecture:** Extend the existing explorer reducer, one globe scene/camera adapter and read-only readers. Add a sourced province-area selection layer only after its geography gate passes. Replace mode-specific old panel rendering with one locality shell; preserve existing URL/search/pagination/detail contracts.

**Spec:** The product contract below records the owner's 2026-10-28 revision. It supersedes the earlier design's retained wide catalog panels and label-only province selection. The owner confirmed physical light lift, gold outline and connected cards; exact dimensions/timings remain proposed implementation defaults.

**Starting evidence:** `docs/audits/2026-10-28-locality-ui-media-investigation.md` and its public image-probe JSON. Read actual working source; Gemini changes are uncommitted on `feat/homepage-visual-effects`, HEAD `23a4b0f`.

## Product contract

### One compact shell

- Retain the visual direction of `LocalityChooser` in the owner's second screenshot: a compact left panel, searchable canonical locality names, clear selected state and an accessible close action.
- Target width 320px at 1280×720 and 1366×768, 340px at larger desktops; top follows the actual header plus 16px; bottom inset at least 24px. Keep a scrollable inner area and visible close control.
- Render exactly one locality shell. Do not mount `HeritagePanel` or `LocalHeroesPanel` as the old wide right panels in the active homepage discovery flow.
- `Địa danh` and `Nhân vật` become content filters inside this same shell/card system; they must not resurrect the old panel. Default overview shows both groups.
- Preserve full record access: `Xem tất cả`, people search/aliases, pagination and place selection use a compact expandable result area inside the same shell, with the same bounded readers and actual totals. Keep two default preview cards per type; more results are accessible without rendering dozens of floating cards.
- Continue accepting existing `noi-dung=dia-phuong`, `dia-danh`, `nhan-vat`, `dia-phuong`, people query/page and selected-place URL contracts. Internal existing modes can remain for compatibility; rendering is unified. No new query key is required merely to remove a panel.

### Selecting a province

- Clicking a province interior, its canonical name label, or its chooser row must call the same `selectLocality(code)` owner callback. Selecting the name immediately selects and raises the corresponding area and opens its cards; no extra `Xem trên bản đồ` action is required.
- Use canonical codes as identity, not a city label or nearest center. Reference centers remain camera/presentation metadata and do not establish geographical membership or a person's birthplace.
- The selected province cap rises slightly along the globe's outward normal, outlined in restrained gold. Proposed cap offset: start at 0.0015 globe radius and tune within 0.001–0.004 using measured local views. Do not scale, translate or replace the whole globe.
- One province is selected at a time. A new selection cancels the old lift, flight, layout animation and obsolete data request. A repeated click on the selected province keeps selection stable; a labelled clear action removes it.
- Hover may emphasize the outline before selection, with no lift or data request. Drag/trackpad movement is map navigation, not an accidental click. Far-side/occluded geometry cannot be selected through the Earth.
- Selection is shared with the URL, list, cards and detail-return state. Animation progress is transient and is never serialized.

### Floating cards and connectors

- Replace the large overview dossier presentation with up to four independently placed HTML cards in one labelled nonmodal region: two places and two people by default. Use the existing factual record/card content as the basis.
- Arrange cards around the focused province within safe screen rectangles, leaving the selected region, header, left chooser and map controls readable. Proposed card widths 240–280px; short preview excerpts, admitted images, clear type label and detail link.
- Compute placement from actual stage dimensions, occupied UI rectangles, selected-area projected bounds and measured card sizes. Use two columns around the region where space permits; if that cannot fit, dock cards in one bounded scrollable column. Never overlap essential controls or invent offscreen anchors to force the layout.
- Draw restrained SVG leader lines behind the cards in the same stage CSS-pixel coordinate space. Lines connect the province selection/presentation anchor to cards and mean content association, not historical travel routes or administrative evidence. Individual people do not get invented historical coordinates.
- Hide a line when its anchor is offscreen/occluded; keep the readable cards available. Resizing/panning must update projection safely. Do not attach cards to pointer coordinates or continue expensive layout work while idle/hidden.
- Preserve depiction, era, uncertainty, qualifying locality relationship and source/detail access. Use `Nhân vật gắn với địa phương`; do not label every historical profile as an officially recognized hero.

### Entry motion and accessibility

| Element | Proposed timing | Requirement |
| --- | --- | --- |
| Camera approach | 650–900ms | Existing controller, interruptible |
| Selected cap lift | 260ms ease-out | Existing scene owns the mesh property |
| Card reveal | 220ms, 40ms stagger | At most four cards; readable immediately |
| Connector reveal | 180ms | Decorative, no interaction capture |
| Clear/replace selection | 120ms | Cancel obsolete completion callbacks |

- No perpetual floating, pulse, orbit or particle effect. With reduced motion, use immediate camera/selection/layout updates without lift animation, stagger or line drawing. Selection still has a static outline and readable labels.
- Canonical locality buttons, search, cards and result pages are fully keyboard reachable. Focus the selection heading once per user selection, not on every projection or image update.
- Escape priority: active modal/search overlay → local disclosure → selected card/province region → chooser exit. Consume the key once. Nonmodal floating cards do not trap focus.
- WebGL or province-asset failure preserves the complete HTML locality path and content. The absence of full polygon evidence must be reported as a blocked area-picking requirement, not passed with a label-only substitute.

### Explicit close behavior

1. `Bỏ chọn [tỉnh]`/close-selection action: clear selected locality, connectors, floating cards and selected-place state; remain inside the compact locality chooser.
2. Chooser X, labelled `Đóng khám phá theo địa phương`: exit to ordinary `Khám phá`, remove locality presentation and active `hanh-trinh`/`moc` parameters; do not revive or auto-play a saved journey.
3. `Hành trình` is the explicit way to enter a journey. Browser Back/Forward and a valid detail return may intentionally restore a saved journey/selection; those are distinct from X.

Use the existing reducer and suspended snapshots to implement this distinction. Prefer an explicit exit target/action rather than deleting journey data in a render effect or calling `history.back()`.

### Media boundary

- The main UI task contains load/render failures locally, using the existing `SafeImage` mixed-host heritage policy for heritage preview media, keyed by URL so a failed image does not poison the next selection. Preserve existing person-image handling unless it has the same verified failure.
- Preserve image boxes, alt text, captions/era and detail links when a source is unavailable. No whole-explorer error boundary for an optional thumbnail.
- Do not globally permit arbitrary hosts, disable certificate checks, turn off image optimization application-wide, silence exceptions, or insert unrelated stock/AI images.
- Bulk URL corrections, replacement sourcing, uploads/storage/data fixes belong to the separate media-owner handoff. The UI worker must not claim those images were repaired by adding a fallback. `next.config.ts` media admission changes, if still necessary after reusing the existing policy, are coordinated with that handoff rather than edited concurrently.

## Global constraints and review focus

- Use one agent; preserve Gemini's dirty working tree and owner documents. No dependency, renderer, account, payment, study, admin or historical narrative expansion.
- Protect national/coastline/island assets. Any new province geometry is an approximate modern reference, not historical borders or cadastral truth.
- Read installed Next.js and Three.js code/docs for APIs used. CodeGraph is navigation, not proof of geometry, live media or browser correctness.
- Verify all 34 canonical choices, source completeness, narrow province interiors/coasts, holes/multipolygons, shared borders, occlusion, pointer coordinate conversion at nonzero stage offsets/DPR, and drag-vs-click.
- Pin rapid A→B→A, close during flight/load, one-sided reader failure, direct legacy URL, detail return, and X after entering from a journey.
- Require DOM/error-boundary/console assertions. The investigation saw a generic error fallback with no `pageerror`; that event alone is not acceptance.

## Task 0 — Preserve and reproduce the current baseline

- [ ] Read AGENTS, CURRENT-STATE, this contract, the investigation, prior implementation and actual Git state. Record tracked/untracked ownership before editing.
- [ ] Reproduce the two panel paths, X from event/journey contexts, and the media exception. Keep unrelated public/owner content untouched.
- [ ] Use the current 1303-unit/26-script passing checkpoint only as dated evidence. Run a fresh narrow baseline and inspect substantive output.
- [ ] For fixture browser work, build the dedicated `.next-local-heroes` output and run a single baseline case with a 120-second global limit. Stop on the first failure and diagnose; do not wait through a repeated multi-viewport failure cascade.

## Task 1 — Establish admissible province-area data before picking/lift code

**Inspect:** `docs/audits/2026-10-25-province-boundaries-final-review.md`, province membership/source evidence, `scripts/province-boundaries/`, `scripts/build-vietnam-province-boundaries.mjs`, current public line provenance and existing full-source validator.

- [ ] Record the current data gap: shared lines and 16 missing single-owner ways in the prior full-source control. Do not weaken that negative control or mark its old input complete.
- [ ] Evaluate complete, appropriately licensed modern polygons for all 34 canonical units. Start with the pinned membership relation IDs/source pipeline; collect complete relation ways/nodes or a complete consistent replacement snapshot, recording publisher, retrieval time, source date/version, license, canonical code mapping and hashes. Do not silently mix dates to close rings.
- [ ] Produce a reproducible full-area candidate and source ledger. Reject missing member coordinates, invented connectors, hull/Voronoi/nearest-center reconstruction, invalid rings/holes, duplicate/unknown codes and unexplained overlaps/gaps. Preserve legitimate multipolygon/island parts and current national display policy.
- [ ] Validate exactly one identity for each of 34 units, finite coordinates, closed valid rings, holes and shared-edge consistency within a documented source tolerance. Measure simplification against the actual source, not invented survey precision.
- [ ] Proposed lazy asset budget: ≤400KiB gzip for selection polygons and metadata, reported separately from existing geography. Record actual values; revise explicitly with evidence if unsuitable rather than dropping required areas.
- [ ] Save a versioned `public/maps/history-vietnam-province-areas.geojson` and provenance only after the source gate passes. Add a dedicated positive validator/test for this complete artifact; keep previous reference-line/negative-control artifacts unchanged.

**Gate:** If complete admissible areas cannot be established, report precisely which source/code/ring is missing. Continue independent shell/close/fallback work, but do not implement fabricated area selection or claim the requested raised-province feature complete.

## Task 2 — Add province picking and selected geometry to the existing scene

**Files:** new `lib/locality/province-areas.ts`, new `lib/explorer/cinematic/province-selection.ts`; extend `scene.ts`, `CinematicEventMap.tsx`, `globe-contract.ts` and the owner callback in `HistoryExplorer.tsx`. Reuse existing surface-cap/triangulation utilities where suitable; do not add another globe instance.

**Interfaces:** a validated `ProvinceAreaCollection`; scene methods `pickProvince(point: ScreenPoint): LocalityCode | null` and `setSelectedProvince(code: LocalityCode | null, options: { nonce: number; reducedMotion: boolean }): void`. Expose a nonce-tagged selection anchor/bounds through the existing adapter. DOM-stage→NDC/raycast conversion uses actual stage rectangles and CSS pixels, not device-pixel canvas dimensions.

- [ ] Write failing tests for identity mapping, invalid/partial geometry rejection, no pick through the globe, holes/coasts/shared-border tie policy, drag threshold and cancellation.
- [ ] Use full-area mesh raycasting/validated area containment; labels and list call the same canonical-selection callback. Separate hovered and selected visuals without a second meaningful selection store.
- [ ] Lift only the selected cap, add a fine top outline and shallow side wall as needed, retaining the existing national surface/context. Consolidate multipolygon geometry; proposed selected visual cost ≤3 additional draws and ≤6MiB GPU buffers.
- [ ] Cancel a lift/flight on newer intent, clear/unmount/hidden state; release buffers, observers and listeners. Confirm zero additional idle draws after settling.
- [ ] Verify label text uses the canonical locality name rather than an administrative-center name such as Quy Nhơn as province identity.

## Task 3 — Make close transitions intentional and history-safe

**Files:** `lib/local-heroes/state.ts`, `lib/explorer/journeys/playback.ts`, `HistoryExplorer.tsx`; tests `locality-overview-state.test.ts`, journey playback/return tests.

**Interfaces:** add explicit actions `locality-clear-selection` and `locality-exit-to-explore` if existing actions cannot express the contract. Keep generic suspended restoration separate; no second history writer.

- [ ] Add red tests for closing selection while in discovery, chooser X after entering from a journey, chooser X after event entry, repeated close, late camera arrival and Back/Forward.
- [ ] On exit to exploration, restore the pre-journey ordinary exploration snapshot when available. For a direct journey/discovery link with no such snapshot, retain validated year bounds and a valid settled view while clearing journey/selected-event state as needed. Never manufacture a journey or call browser Back.
- [ ] Remove active locality/journey presentation parameters from the exit URL while preserving relevant ordinary exploration filters. Details/Back can still restore explicit saved context.
- [ ] Route X and Escape through the same depth-aware owner actions; restore focus to an available chooser row or header entry. Update tests that explicitly asserted automatic journey restoration on the old X path, explaining the owner-requested contract change.

## Task 4 — Unify the compact shell and retire active old panels

**Files:** `LocalityChooser.tsx`, `HistoryExplorer.tsx`, `HomeAtlasHeader.tsx`, current catalog hooks/state, `LocalityTabs.tsx`, relevant scoped CSS; new `components/locality/LocalityResults.tsx` only if needed for a focused result list.

- [ ] Add red assertions that header, tabs, `Xem tất cả`, direct old URLs and detail-return links all expose exactly one compact locality shell and no old wide panels.
- [ ] Make chooser selection persist while cards are open; highlight the matching row and scroll it into view only on explicit selection/keyboard action.
- [ ] Convert tabs into content filtering inside the unified shell. Preserve complete place access and bounded people query/alias/page behavior in its expandable results area. Do not remove functionality by permanently slicing every result to two.
- [ ] Keep no-JS server-rendered forms and actual detail links. Normalize old URL presentation consistently on SSR and client rather than using a client-only redirect.
- [ ] Unmount old panel renderers from this flow; delete files only after proving no other route imports them. Do not rewrite unrelated admin/detail routes.

## Task 5 — Place floating cards and connector lines

**Files:** adapt `LocalityOverview.tsx` and `LocalityPreviewCard.tsx`; new `components/locality/LocalityCardCluster.tsx`, `LocalityConnectors.tsx`, `lib/locality/popup-layout.ts`; reuse current `buildLocalityOverview` and readers.

**Interfaces:** Define `Rect = { left: number; top: number; right: number; bottom: number }`, `CardSize = { key: string; width: number; height: number }`, and `LocalityCardPlacement = CardSize & { left: number; top: number; docked: boolean }`. Export `placeLocalityCards(input: { safeRect: Rect; occupied: readonly Rect[]; selectedBounds: Rect | null; cardSizes: readonly CardSize[] }): LocalityCardPlacement[]`. `LocalityProjection` includes canonical code, request nonce, stage CSS size/offset and visible anchor/bounds. Ignore stale projections; hide lines without hiding factual content.

- [ ] Add pure layout tests for 1280×720 and other desktop sizes, long headings, unavailable/occluded anchor, zoom/text stress, and deterministic nonoverlap/docking.
- [ ] Show both groups automatically on selection, initially up to two per type. Preserve independent loading/error/retry states, stable ordering, original sources and relationship/era labels.
- [ ] Render screen-space SVG connectors behind HTML cards with pointer-events disabled and short decorative reveal. Subscribe to existing scene/resize invalidation; avoid a permanent independent animation loop or full explorer re-render every frame.
- [ ] Apply the proposed entry sequence, reduced motion and cancellation. A late section/image must not replay the other section or reposition the focused control unexpectedly.
- [ ] Test both detail routes and exact return to the same province, content filter and result page; no forced journey playback.

## Task 6 — Contain optional image failures; hand off actual media repair

**Files:** `LocalityPreviewCard.tsx`, existing `SafeImage.tsx` usage/patterns, targeted preview tests and fixtures. Avoid broad changes to the shared component unless necessary and behaviorally tested.

- [ ] Add regression cases for an otherwise valid Supabase URL not on Next's optimizer allowlist, actual 404, HTML masquerading as HTTP 200, timeout and failed image followed by a different valid URL.
- [ ] Reuse the existing mixed-host heritage image policy with stable dimensions and URL-keyed lifecycle. Text, selection, connectors and detail navigation stay usable for all 34 choices even while media repair is pending.
- [ ] Assert the explorer and both sections remain mounted, no route-level generic error UI appears, and console/render errors are not merely swallowed.
- [ ] Link the separate media-owner handoff and carry unresolved original image URLs explicitly. Do not modify source mappings, fetch replacement assets, upload, or publish as part of this UI task.

## Task 7 — Full acceptance and local handoff

- [ ] At CSS 1280×720, 1366×768, 1440×900 and 1920×1080, verify map interior selection, name/list parity, slight lift, visible province, connectors, compact chooser and readable cards.
- [ ] Check every canonical locality via HTML; check every admitted polygon with representative interior samples and false-positive offshore/hole/border controls. Screen tests must prove picking, not just that meshes exist.
- [ ] Exercise query/page/full results, old/shared URLs, both detail returns, X from journey and event entry, Back/Forward, reduced motion, 200% zoom/text, WebGL/asset failure and no-JS alternatives.
- [ ] Record actual browser/device/GPU, transfer/GPU/draw/idle metrics and short motion evidence. Separate software automation from hardware performance measurements; proposed movement target remains ≥30fps on the stated reference device.
- [ ] Preserve the already accepted thin timeline and authored journey behavior outside the explicitly revised close path. Inspect complete diff and initial dirty ownership; do not commit another contributor's work.
- [ ] Run fresh gates, write the ignored local report, list media/geography blockers honestly, and stop at local review.

```powershell
$env:NoDefaultCurrentDirectoryInExePath = '1'
# Run focused new unit cases first, then the complete gate.
pnpm verify
# Fixture build differs from the ordinary .next output; never rebuild a served fixture.
node scripts/agent/local-heroes-e2e.mjs build
pnpm exec playwright test home-locality-overview.spec.ts --config playwright.local-heroes.config.ts --project=1280x720 --grep '^O1:' --max-failures=1 --global-timeout=120000
pnpm exec playwright test --config playwright.local-heroes.config.ts --max-failures=1 --global-timeout=900000
pnpm exec playwright test --config playwright.local-heroes-regression.config.ts --max-failures=1 --global-timeout=900000
git diff --check
git status --short
```

Update old O1/O3/O4/O5 expectations to the new product behavior and add focused area/close/media cases. A 15-minute global bound is an investigation budget, not permission to call partial coverage passed. Stop on first failure, diagnose, rerun narrowly and then complete required coverage. The configs share a fixture port and must run sequentially. Inspect additional smoke configuration before use; never run legacy mutation suites against the system database.

## Deliverables and stop conditions

Deliver scoped code/tests and a source-qualified geometry artifact if feasible, four-viewport screenshots, motion evidence, fresh commands, source/asset budgets, a self-review and `.task-reports/YYYY-MM-DD-HHmm-locality-remediation.md`. Report unresolved media separately from UI correctness. Do not claim area-picking/lift complete without the complete polygon gate. Do not stage/commit/push/PR/merge/deploy or modify external services without new explicit owner authorization.

## Local execution record — 2026-10-28 to 2026-10-29

One main agent executed the authorized local remediation in the existing dirty checkout. Gemini's initial source state was preserved in an ignored hash manifest/copy before edits. No stage, commit, push, PR, merge, deployment, content publication, storage upload or extra AI agent was used.

- Task 0: baseline fixture build and bounded O1 passed. The prompt's anchored `^O1:` expression selected zero tests because Playwright prefixes the full title; the equivalent intended `O1:` selection was used. The old full-results path was caught red when it unmounted the chooser, then passed in the compact shell.
- Tasks 1–2: area admission/picking/lift are **blocked**, with the exact Khánh Hòa missing-way evidence and rejected replacement-source findings in [the source gate](../../audits/2026-10-28-locality-province-area-source-gate.md). No area artifact or physical lift was fabricated. Existing reference-center labels and projection remain presentation metadata, with `bounds: null`.
- Task 3: explicit select, clear and exit transitions implemented in the existing reducer. Narrow tests cover event/journey entry, X, late arrivals, repeated exit and explicit restore. Generic suspended restoration stays separate.
- Task 4: one compact shell and complete bounded results replace active wide panel renderers, including old URL modes and SSR forms. Search, aliases, pagination and both detail routes are retained. Retained event-mode search preferences and first-page overview return have dedicated red-to-green tests.
- Task 5: measured HTML card placement, a scroll dock, finite reveal motion, decorative per-visible-card connections, stale projection rejection and reduced motion are implemented. Reference-center connections do not fulfill the blocked province-area/lift requirement. Saved camera/detail restoration and intro interruption have browser red-to-green regressions.
- Task 6: heritage thumbnails reuse URL-keyed `SafeImage`; mixed-host rendering and 404/HTML/timeout/recovery cases are isolated from the explorer. Source mappings, image admission configuration, uploads and live-media certification remain with [the media owner](../../agent/prompts/2026-10-28-heritage-media-owner-handoff.md).
- Task 7: safe UI locally verified on 2026-10-29. Fresh `pnpm verify` passed 1,321 unit tests / 124 files, 26 script tests, lint, strict TypeScript, agent checks and the 110/110-page production build. The dedicated fixture build and O1 passed; the final isolated feature suite passed 212/212 across all four desktop viewports, public regressions 10/10 and fresh-build public smoke 8/8, with no skipped/flaky/unexpected cases. Four-viewport screenshots, finite motion videos, scene/frame/resource measurements, diagnostics, initial-contributor hash checks and the final source/diff checks are recorded in the [acceptance audit](../../audits/2026-10-28-locality-remediation-acceptance.md) and ignored dated local report. The selected-label overlap and unfiltered place-selection/Back findings were pinned red-to-green before these final gates. Tasks 1–2 remain blocked; HTML/reference-center evidence does not fulfill them. Stop at the local handoff without Git integration or external changes.

The original task checklists above remain the acceptance contract. A blocked geography item is not checked off by passing HTML/line-layer tests.
