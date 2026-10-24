# P3 homepage atlas shell

## Mission and starting evidence

Recompose the production homepage shell only, following Phase 3 of the cinematic globe plan and the accepted concept. The source of truth is the owner's P3 request, `docs/agent/prompts/cinematic-globe/shared-contract.md`, the visual spec, reference PNG and Phase 3 plan. P0–P2 reports and the P2 audit were read. The P2 audit records the owner's actual P1 response: “Tôi chấp nhận P1; tiếp tục P2”. The P1 score alone is not approval.

Fresh inspection: production still renders MapLibre through `EventMap`; `HistoryExplorer` owns filters, selection, journey, navigation guards and restoration. The public layout always renders `Header`, while `PublicPageTail` already isolates `/` by pathname. CodeGraph is present but has no current explorer/pathname-wrapper symbols; focused direct reads were used without reindexing. Installed Next 16.3.8 layout, Link and usePathname guides were read.

## Scope and decisions

- Use the existing dirty feature workspace per the shared contract. Preserve all previous tracked/untracked work; no branch switch, reset, staging, commit or external mutation.
- One agent implements and self-reviews inline. The existing design/plan and explicit P3 instruction authorize execution; no new design choice requires another approval checkpoint.
- Keep `HistoryExplorer` as the only mode/state owner. `HomeAtlasHeader` receives the existing callbacks and journey button ref. `PublicPageHeader` suppresses the shared header only at `/`.
- Retain brand, two real mode buttons, one compact native secondary navigation disclosure and existing search access/shortcuts. No new event bus or mode store.
- Title/hint/event-list on the left; guidance/event/journey panel share the right reading region. Preserve HTML links, uncertainty/source copy, focus restoration, filters and seven milestones.
- Thin bottom time rail and journey strip, scoped dark surfaces, existing Vietnamese fonts. Preserve responsive rules; verify only the four agreed desktop sizes.
- Do not touch renderer, camera, projection, geographic/historical content, server queries, dependencies or other public route designs. Stop at P3.

## Implementation and verification plan

- [x] Capture the existing shell and run a meaningful failing browser assertion for the missing atlas header/guidance.
- [x] Add pathname header selection, connected atlas masthead and mutually exclusive initial guidance.
- [x] Recompose title, timeline and reading panels within the desktop limits; preserve semantics and internal scroll.
- [x] Capture default/card/journey at 1280×720, 1366×768, 1440×900 and 1920×1080. Measure page/region/control bounds, visible control collisions and map safe area.
- [x] Check keyboard skip/modes/menu/search, focus restoration, source/list scrolling, reduced motion, no JavaScript, loading/error/retry and representative detail/study shared-header navigation.
- [x] Run focused public desktop E2E and `pnpm verify`; review task-owned before/after diffs and protected-file hashes; write the ignored local report.

## Pre-flight interfaces

| Producer | Consumer | Verified interface / decision |
| --- | --- | --- |
| `HistoryExplorer` | `HomeAtlasHeader` | Existing `enterJourney`, `exitJourney`, `journeyButton` and `Boolean(stop)`; no second mode state. |
| Public layout | `PublicPageHeader` | Existing pathname isolation pattern from `PublicPageTail`; shared header module unchanged. |
| Selection/journey state | Right reading area | Exactly one of guidance, event card, journey panel. Existing navigationPending/restoreRequest paths retained. |
| Existing HTML controls | Scoped CSS / E2E | Semantic buttons/inputs/links/details retained; assertions test outcomes and measured bounds, not individual CSS declarations. |

## Evidence and results

Production shell changes are limited to the public layout, two new header components, `HistoryExplorer` JSX/imports, `MapTimeControls` markup and scoped explorer CSS. `Header`, `PublicPageTail`, event/journey card markup, the entire existing state/callback body, renderer, camera, geography, seven stops and public server queries remain unchanged. The existing search overlay/shortcut implementation is reused; no new event bus was introduced.

### Measured composition

| CSS viewport | Masthead | Title left / top / width | Right panel width | Time rail height | Journey rail height |
| --- | ---: | --- | ---: | ---: | ---: |
| 1280×720 | 60 | 32 / 92 / 280 | 304 | 70.5 | 84.19 |
| 1366×768 | 60 | 32 / 92 / 280 | 304 | 70.5 | 84.19 |
| 1440×900 | 60 | 40 / 96 / 320 | 320 | 70 | 88.19 |
| 1920×1080 | 60 | 40 / 96 / 320 | 320 | 70 | 88.19 |

All twelve default/card/journey captures have document width/height equal to the viewport and zero measured visible control intersections. The left/right reading regions leave the specified central map safe region available. A representative selected marker stays accessible; both card footer and journey playback stay within the viewport. Expanded reading sources and event lists scroll internally. The existing Lora / Be Vietnam Pro fonts are retained; heading sizes are 38 px on the two short desktop sizes, 46.08 px at 1440 and 48 px at 1920.

### Fresh commands and outcomes

- `pnpm verify`: PASS after the final menu Escape fix. Agent setup, 42 history integrity checks, ESLint, strict TypeScript, 65 unit files / 834 tests, eight hook tests and a 102-page production build passed. Full log: `output/prototypes/cinematic-globe/p3-verify-final.log`.
- With `$env:E2E_BASE_URL='http://localhost:3219'`, `pnpm test:e2e tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts --workers=1`: **31 PASS**, including nine P3 tests. Tests run sequentially against the final task-owned production target. Log/JSON: `output/prototypes/cinematic-globe/p3-home-e2e-final.*`.
- With the same target, `pnpm test:e2e tests/e2e/public.spec.ts tests/e2e/a11y.spec.ts --workers=1 --grep 'viewport 1280px.*(E1:|E4:)|Trợ năng.* (/|/muc-luc) không có lỗi'`: **6 PASS**. This selects the existing desktop public event/person/place return flow, unaccented search, and homepage/study axe checks in both themes. It does not claim all public/mobile/staff/payment suites ran.
- `node output/prototypes/cinematic-globe/verify-p3-extra.mjs`: PASS. Real Edge 155.0.4283.62, Windows, Intel UHD / ANGLE D3D11, WebGL 2, DPR 1. Axe found zero violations in default, event card and journey with sources; no page errors. Keyboard End scrolls the short-screen card internally without changing the map or outer page height.
- Measured contrast using real rendered background samples: guidance body 9.82:1; heading 15.32:1; year-input text 15.58:1 and border 5.36:1; map-control text 15.24:1 and border 4.07:1. Visible focus is a 2 px solid outline, 5.19:1 against the sampled country color.
- `node output/prototypes/cinematic-globe/review-p3.mjs`: PASS. Of the 45 protected P2-baseline files, 44 are byte-identical; the sole intended difference is the `HistoryExplorer` shell. The complete existing function/state/callback body before JSX is byte-identical, and task-start copies confirm event/journey card markup unchanged.
- `git diff --check`: PASS, with pre-existing line-ending notices. The index is empty. The dirty feature workspace was preserved; no files were staged or committed.

### Red/green evidence and review rulings

- The initial P3 browser test failed because the atlas masthead was absent. Baseline screenshot: `before-1440x900.png`.
- Opening map sources originally intersected map controls; simultaneous data/renderer notices also overlapped. Two explicit browser assertions failed before their scoped layout fixes and pass in the final suite.
- A separate self-review regression reproduced Escape bubbling from the new secondary menu to the existing event-close listener. The card disappeared on the red run; the header now stops the handled Escape event, and the final test confirms the selected card and trigger focus survive.
- Visual inspection found the initial bottom scrim dimmed map controls because it sat above the complete map stacking context. The scrim now belongs to the stage behind markers/tools. Contrast inspection also prompted the control-border adjustments above.
- An intermediate 30-test run ended with 29 passes and one `browserContext.close` ENOENT for a Playwright trace `.network` file when a second CLI used the same result directory. This was a verification orchestration error, not valid green evidence. The final 31-test and six-test CLI runs were sequential and both passed; test assertions were not weakened.
- Final review is self-review by the implementation author, per the owner's single-agent rule. No independent reviewer is claimed. No outstanding critical/important P3 finding was identified.

### Artifacts, limits and stop

Evidence lives under `output/playwright/cinematic-globe/phase-3/`: twelve original full-size PNGs and bounds JSONs, `review-and-bounds.json`, `extra-verification.json`, `shell.diff`, a contact sheet, target/baseline comparisons, keyboard/menu/shared-header captures and expanded-source reading captures. These and harnesses are ignored local artifacts, not new product assets.

Ruling: keep the current MapLibre scene exactly as requested. Its flat geographic appearance, old camera framing and existing marker adapter remain visibly different from the accepted cinematic prototype. P3 proves the shell composition; it does not claim texture, atmosphere, planetary-limb, new projection or renderer integration. Those remain outside this task. No historical content, dependencies, mobile/tablet redesign/testing, performance benchmark, database or external service mutation was added. Stop at P3; do not begin P4.
