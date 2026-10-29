# Local locality remediation acceptance

Work started: 2026-10-28; final verification continued 2026-10-29, Asia/Bangkok. Branch `feat/homepage-visual-effects`, original HEAD `23a4b0f`. One main agent performed implementation, self-review and verification in the existing checkout. This document separates the safe UI delivery from the blocked province-area feature. No independent review, remote publication or Git integration is claimed.

## Scope and preservation

The [execution prompt](../agent/prompts/2026-10-28-sol-max-locality-remediation.md), [owner remediation plan](../superpowers/plans/2026-10-28-locality-province-selection-remediation-plan.md) and [investigation](2026-10-28-locality-ui-media-investigation.md) govern this work. Thirty-five initially modified/untracked source/document paths were copied with SHA-256 hashes before editing. The accepted thin timeline, `MapTimeControls`, `TimelineRail`, its helper/tests, and media-owner handoff/probe remain preserved. No Word document, private environment file, map asset, source/media binding, dependency, schema or storage object was edited.

## Acceptance by work item

| Plan task | Implemented result | Evidence/status |
| --- | --- | --- |
| 0: preserve/reproduce | Existing checkout and initial dirty ownership recorded; baseline build and bounded chooser case passed; old catalog path reproduced by a red single-shell assertion. | Ignored baseline manifest/copies and red/green logs. |
| 1: admit province areas | No complete admissible 34-unit collection was established. The old full-source control still fails on 16 Khánh Hòa ways, including an inner member. | **Blocked**; [source gate](2026-10-28-locality-province-area-source-gate.md) records IDs, requests and replacement-source/license limits. |
| 2: area picking/lift | No fabricated area, hull, inferred ring, picking mesh or raised cap. Existing canonical labels share the selection callback; projection is tagged `reference-center` with null area bounds. | **Area picking and physical lift are not delivered.** Area topology, raycast, hole/coast/island and lift GPU gates cannot be claimed passed. |
| 3: clear/X/history | Clear stays in locality discovery; chooser X exits to ordinary exploration and cannot revive playback. Generic restore/Back/detail state stays separate. Retained search preferences are normalized on entry. | Runtime red-to-green regressions; camera return/intro regressions also red-to-green. |
| 4: compact shell | All locality URL modes use one 320/340px chooser and internal complete results. The old wide panel renderers are not mounted. Search, aliases, bounded pagination, record selection, videos, detail/return and SSR forms remain. | Four-viewport feature gate **212/212**. Expanded H4 covers unfiltered place selection followed by browser Back at every viewport. |
| 5: cards/connections | Up to two previews of each type, independent status/retry states, measured safe placement, scroll docking, connections to visible card portions, finite motion, reduced motion and stale/occluded anchor rejection. | Unit and four-viewport browser checks passed, including measured selected-label exclusion. Anchors remain presentation metadata while task 2 is blocked. |
| 6: optional media | Heritage previews use existing URL-keyed `SafeImage`; alt/era/credit/detail access survive unconfigured hosts, 404, HTML content and timeouts. | Synthetic browser failures/recovery passed; original-media health is **not certified**. [Media owner](../agent/prompts/2026-10-28-heritage-media-owner-handoff.md) retains source/mapping/GET/decode/upload work. |
| 7: local gate | Fresh code quality gate and sequential isolated browser gates completed. Source hashes match the fixture build. | **UI locally verified**: 212 feature, 10 public regression and 8 smoke cases; no skipped, flaky or unexpected cases. Geography remains blocked. |

The source admission blocker is intentional enforcement of the plan, not a successful implementation of raised province selection.

## Verification

- `pnpm verify`: exit 0 after final code/self-review fixes — agent setup, history checks 42/42, lint, strict TypeScript, **1,321 unit tests / 124 files**, **26 script tests**, production build **110/110** pages. The 42 history cases are included in the unit count, not an additional unique count.
- Targeted locality/SSR/state/layout/projection/media regressions were exercised red-to-green. The final unit gate includes the selected-label bounds regression added during visual review.
- Fresh dedicated fixture build: exit 0, build ID `yEZf3fFmqzUteCg3chju9`; all 37 pinned runtime/test file hashes match the final tested source.
- Fresh bounded O1 on 2026-10-29: **1/1**. The prompt's `--grep '^O1:'` expression initially collected zero tests; Playwright prefixes its full test titles, so the intended case was selected with `--grep 'O1:'`.
- Full `playwright.local-heroes.config.ts`: **212/212** in 614.384s across CSS 1280×720, 1366×768, 1440×900 and 1920×1080; zero skipped, flaky or unexpected cases.
- `playwright.local-heroes-regression.config.ts`: **10/10** in 31.867s, including the existing journey and four-viewport timeline checks; zero skipped, flaky or unexpected cases. No database mutation suite was authorized or run.
- Fresh `pnpm build:smoke`: exit 0; isolated `pnpm test:e2e:smoke` with Edge: **8/8** in 21.059s; zero skipped, flaky or unexpected cases.
- `git diff --check`, agent structure/status, source-hash and initial-contributor preservation checks passed. HEAD remains `23a4b0f`; no staged paths or Git integration.

The final logs are retained locally under `.task-reports/locality-remediation-20261028/`: `verify-history-final-20261029.log`, `fixture-history-build-20261029.log`, `o1-history-final-20261029.log`, `feature-history-final-20261029.log`, `regression-history-final-20261029.log`, `smoke-build-history-final-20261029.log` and `smoke-history-final-20261029.log`. The final feature/regression/smoke JSON summaries are copied there. These are local verification records, not replacements for this audit, the source gate or executable tests.

## Evidence and limits

Final chooser/overview screenshots and native finite camera/card/connector videos for all four viewports are retained in `.task-reports/locality-remediation-20261028/evidence/`. The screenshots were visually inspected. Data and covers are labelled synthetic fixtures; they do not certify live historical records or original media. The ignored dated handoff report links the exact artifacts, commands, changed files and preserved baseline paths.

| CSS viewport | Frame interval median / p95 (ms) | CPU submission p95 (ms) | Settled idle draws |
| --- | --- | --- | --- |
| 1280×720 | 8.4 / 25.0 | 0.8 | 0 |
| 1366×768 | 8.4 / 16.7 | 0.6 | 0 |
| 1440×900 | 8.4 / 25.0 | 0.8 | 0 |
| 1920×1080 | 16.6 / 25.0 | 0.8 | 0 |

Actual renderer: Edge 156.0.4314.50, Intel UHD ANGLE/D3D11, Intel Core i5-11400H, Windows, headless hardware rendering. All four captures retain 8 draw calls, 8 geometries and 330,160 triangles before/after selection. Video capture is enabled. The measurement covers the finite camera transition and a 400ms settled window; it is not sustained FPS, GPU-fence timing or a cap/lift benchmark. The observed p95 does not guarantee every frame meets 30fps. Browser resource totals in the motion case are 1,570,064 encoded bytes for `/maps/` including textures and 935,080 encoded JS bytes; these are total observed resources, not an incremental task budget. Existing asset raw/gzip sizes remain recorded in the local report; no province-area asset is admitted.

Structured diagnostics cover 180/212 feature cases; other detail cases have their own assertions/page-error guards. No unhandled page error appears in the structured records. The retained expected-error diagnostics include 223 console errors (211 injected 503s, four unsupported-WebGL errors, four 404s and four timeouts), 195 intentional broken-image responses, 20 injected HTTP errors and 338 request failures. The failures classify as 298 navigation/prefetch aborts and 40 ORB failures on fixture media (`/hoa-lo.jpg` and `/w/index.php`). No completely clean console/network claim is made. Injected reader failure also emits the expected sanitized `DATA_UNAVAILABLE` server error in its dedicated public-detail test.

An earlier full-browser attempt was manually stopped after 133 passing cases when visual review exposed a selected name-label overlap; that is partial evidence, not a suite pass. The 1366×768 label-overlap regression failed against that layout, then passed after using the measured HTML rectangle with nonce and CSS-offset checks. A later H4 extension exposed unfiltered place selection consuming the intended history push during subsequent URL canonicalization, so Back reached `about:blank`. The selected record and its catalog locality now update in the same intent; the expanded regression failed before that fix and passes at all four viewports. Only the final post-fix gates above are handoff evidence; earlier 212/10/8 results were retained separately.

The stress check doubles computed text sizes and exercises a 640×360 CSS layout equivalent to 1280×720 at 200% browser zoom. It does not automate native browser zoom controls. The geography parser/negative control, DOM error boundaries, console output and actual reader behavior are checked separately from mocked thumbnail transport.

Self-review is by the implementing main agent. The remaining product gap is the explicitly blocked geography feature; live media repair remains separately owned. Stop after the locally verified handoff, without staging, committing, pushing, creating a PR, merging, deploying or changing an external service.
