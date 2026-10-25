# Journey popup and curriculum timeline acceptance

Local execution, 2026-10-25, Asia/Bangkok. Starting revision `ffd20a1`, branch `feat/homepage-ui-refinement`. One main agent performed implementation and self-review. No independent reviewer, commit, staging, database mutation, upload, publication or deployment occurred.

## Scope and owner decisions

- Execute the approved [design](../superpowers/specs/2026-10-25-journey-popups-curriculum-timeline-design.md) and [plan](../superpowers/plans/2026-10-25-journey-popups-curriculum-timeline-plan.md), Tasks 1–6 / Checkpoints A–D.
- Preserve the cinematic globe, four journeys, authored sequences, arrival nonces, cancellation and 2000 ms settled dwell. No new renderer, journey, geography, game or dependency.
- The owner permits Internet images for coursework and subsequently requires historical imagery instead of present-day place photos. All present-day popup selections were removed; the resolver rejects that kind independently of license completeness. See the [20-stop media ledger](2026-10-25-journey-popup-media-sources.md).
- No disposable database is available: the Docker engine endpoint was absent. The local browser catalog is a GET-only network fixture, not a Supabase instance, RLS check or publication.

## Checkpoints

| Checkpoint | Local implementation | Evidence / limits |
| --- | --- | --- |
| A — anchored reader | PASS locally | One current reader near the current projected point, safe-area placement, leader, close/reopen, independent controls and native reading fallback. 20/20 historical-media bindings, 19 local assets; some explicitly labelled period context rather than the event instant. Four journeys × four desktop sizes plus race/failure/focus cases pass. |
| B — all-year navigation | PASS for UI behavior | Inclusive interval years, counts and individual same-year access; shared clamped/ordered URL ranges. Four-size fixture coverage passes. The configured public catalog still ends in 1986; navigation cannot fabricate later public rows. No static production draft catalog. |
| C — bounded content | Local review artifacts prepared; database gates blocked | 41 inventory dispositions, 22 bounded draft narratives (18 additions + four revisions), seven after 1986 including CPTPP 2019. One 1976 candidate held for lesson fit; 18 old narratives still need evidence. No completeness/publication certificate. |
| D — integration and handoff | PASS for local evidence/handoff; DB gates BLOCKED | Full verification, 46 focused production browser cases and eight isolated smoke cases pass. Real SQL import/rerun, DB assignments and RLS remain untested. No remote publication was authorized or performed. |

## Implementation and invariants

The cinematic adapter forwards existing stage CSS projection plus shell offset with journey ID, stop ID and nonce. A small pure placement helper measures safe bounds and occupied HTML; it adds no animation loop or camera owner. Unavailable/occluded projections use ordinary in-flow HTML. Focus moves on explicit reading activation or when its focused representation disappears; automatic arrival does not take focus.

`HistoryExplorer` remains the state/timer owner. Closing reading pauses without exiting; persistent controls reopen the current stop. Hover, keyboard focus and expanded sources latch pause until explicit Play. Source reading, failed media, reduced motion, hidden documents, no JavaScript and failed WebGL retain reading/navigation. The chosen image is the only mounted journey image; local WebP files reserve dimensions and remain below 200 KiB.

The year index derives every integer year covered by published event intervals, deduplicates each event within a year and offers the existing event list/full timeline. Invalid or reversed ranges use the same normalization at controls and URL parsing. Published-only server queries and RLS are unchanged.

## Historical content and import boundary

The [coverage matrix](../content/grade-12-vietnam-timeline-coverage.md), [claim ledger](2026-10-25-vietnam-timeline-content-sources.md), [learning notes](../content/doi-moi-learning-notes-1996.md) and [review package](../../supabase/content/timeline-2026-10-25/review-package.json) distinguish evidence, workflow, lesson fit and actual availability. The 19-candidate queue was handled in batches of at most three; original passages and the relevant original curriculum pages were read. Exact textbook printing/pages and the UNESCO original resolution remain unresolved.

The dedicated [SQL builder](../../scripts/build-vietnam-timeline-sql.mjs) validates identities, provenance, dates and real lesson references, and generates [insert-only draft SQL](../../supabase/seed-vietnam-timeline-2026-10-25.sql). Existing differing records are skipped, never overwritten. Link inserts require a matching draft payload; four existing revisions may need human reconciliation. No reviewer or approval is invented. All 22 prepared events have null coordinates/media where evidence was not established. These event-media gaps are separate from journey-popup coverage.

Import reruns, database lesson assignments and RLS behavior remain **blocked** without a confirmed disposable database. Static generator determinism does not prove executed SQL idempotence. No legacy broad generator was run.

## Verification record

| Command / boundary | Fresh result | Evidence |
| --- | --- | --- |
| `pnpm agent:sync` | Complete current index; no pending files. CodeGraph gaps/cached spans used targeted reads where needed. | Local command output; graph covers source, not historical documents or database state. |
| `pnpm verify` with explicit synthetic public configuration + read-only catalog | PASS, exit 0 | 5 project skills; 42 content checks; lint without warnings; strict typecheck; 82 unit files / 1042 tests; 26 tooling tests; production build / 102 static pages. Local log `verify-final.log`. |
| `pnpm exec playwright test tests/e2e/home-journey-popups.spec.ts tests/e2e/home-timeline-coverage.spec.ts` | 30 passed, 1.2 minutes | Production Next server; explicit GET-only fixture; four desktop sizes; geometry, source reading, keyboard, stale arrival/image, resize, actual DPR 2, no JS, failed WebGL, range/count/identity/detail return and excluded-draft 404. |
| `pnpm exec playwright test tests/e2e/home-journey-choices.spec.ts --grep 'actual intercontinental\|reader keyboard\|final milestone\|manual camera\|malformed shared\|users can select\|keyboard selection\|exiting journey\|browser history\|Task 09 all four\|Task 09 no-JS native'` | 14 passed, 1.5 minutes | Real settled two-second dwell, final stop, manual camera, paused shared URL, chooser, snapshot/history, all four journey sequences, real authored path pixel differences, Axe and native GET fallback. |
| `pnpm exec playwright test tests/e2e/home-timeline-coverage.spec.ts --grep 'reviewed later-period'` | Two additional cases passed, 7.3 seconds | Production fixture: actual reviewed WTO 2007 and CPTPP 2019 identities; home → detail → original institutional source → restored year range. [WTO source screen](../../output/playwright/journey-timeline/reviewed-event-sources-2007.png), [CPTPP source screen](../../output/playwright/journey-timeline/reviewed-event-sources-2019.png). These remain test-only publication. |
| `pnpm build:smoke`, then `E2E_CHANNEL=msedge pnpm test:e2e:smoke` | PASS; eight cases passed, 20.6 seconds | Fixture API and other test app were stopped first; isolated production smoke build uses only known dummy public configuration. Empty-data geographic fallback and guide at all four sizes. |
| `pnpm verify` in the repository's intended configuration, after smoke | PASS, exit 0 | Fresh 1042 unit tests + 26 tooling tests, content/lint/types/build all passed. Restores `.next` to the intended configuration; dummy public build is not left behind. Local log `verify-intended-env.log`. |
| Final `pnpm lint` after local scratch cleanup | PASS, exit 0; no warnings | The final full gate reported one unused variable in an ignored execution helper. It was removed and lint was rerun cleanly; no application code changed in that cleanup. Local log `lint-final.log`. |
| Public configured homepage, fresh anonymous browser, fixture API stopped | HTTP 200; 10 exposed records; 1911–1986 | [Public-boundary snapshot](../../output/playwright/journey-timeline/configured-public-catalog.json). This is application exposure, not direct DB inventory or RLS evidence. |
| Dedicated generator + focused package/SGK/content tests | 22 draft artifacts regenerated with identical SQL SHA-256; 67 focused tests passed after final availability annotation | SQL SHA-256 `322a609ac67f8a273c0759abe516640f6ca0fdb5e8b4742e76546457704c3eb0`. `history:data:check` also passed after every content batch. |
| `git diff --check`, staged-file check and full self-review | PASS; nothing staged | No Word/PDF, `.env`, unrelated owner image/prompt, generated vendor file or build output staged. Final status remains local/uncommitted. |

The final scoped [diagnostics summary](../../output/playwright/journey-timeline/diagnostics-summary.json) contains 46 passing cases and no unexpected diagnostic entries. Recorded failures are deliberate image-abort/WebGL/404 cases and navigation/prefetch cancellations. They are not suppressed as clean console evidence. The full legacy `pnpm test:e2e` suite was **not run** because it includes database preparation/deletion and no authorized disposable backing exists.

After the final original-page attribution correction, the intended-configuration `pnpm verify` was rerun successfully (started 21:33 Asia/Bangkok). A second [anonymous public-boundary snapshot](../../output/playwright/journey-timeline/configured-public-catalog-final.json) again observed 10 records spanning 1911–1986, and the intended-configuration popup screenshot was refreshed. Test fixtures and temporary preview servers were stopped at handoff.

All four CSS viewports were covered: 1280×720, 1366×768, 1440×900, 1920×1080, in Edge 156.0.4314.42. Representative screenshots and all-year layouts were visually inspected alongside DOM geometry/keyboard/Axe checks. Evidence uses the actual mounted cinematic scene, not a mock projection.

Local command logs are under `.superpowers/sdd/2026-10-25-journey-popups-curriculum-timeline-plan/`, excluded locally from Git. Screenshots/JSON are under `output/playwright/journey-timeline/`. Neither directory is publication evidence.

## Performance and browser evidence

- [UI bundle comparison](../../output/playwright/journey-timeline/ui-bundle-comparison.json): baseline gzip 26,763 bytes; current gzip 33,792 bytes; **+7,029 bytes**, below the 60 KiB UI allowance. Method: identical Vite minification of the relevant UI dependency closure, excluding shared React/Next/lucide/CSS and the unchanged dynamic EventMap boundary. This is a comparable UI-code measurement, **not** an actual Next route first-load delta; that broader metric was not established.
- [Actual render/media measurements](../../output/playwright/journey-timeline/render-media-measurements.json): hardware WebGL2 / Intel UHD / ANGLE D3D11; idle draws 20→20 during 600 ms; simulated-hidden draws 25→25 during 600 ms; one current historical image transferred 44,342 bytes. Largest local image in the complete inventory: 108,188 bytes. No next-stop preload.
- Hidden rendering checks simulate document visibility in the browser and do not claim OS background-tab scheduling or power measurements.
- [Configured public historical popup at 1366×768](../../output/playwright/journey-timeline/configured-public-historical-popup-1366x768.png) uses the intended configuration and the newly sourced 1945 image, with the fixture server stopped.
- Fixture screenshots: [Hà Nội, 1280×720](../../output/playwright/journey-timeline/mua-thu-doc-lap-1945-1280x720.png), [Buôn Ma Thuột, 1366×768](../../output/playwright/journey-timeline/mua-xuan-1975-1366x768.png), [Marseille document, 1440×900](../../output/playwright/journey-timeline/ho-chi-minh-1911-1941-1440x900.png), [Điện Biên, 1920×1080](../../output/playwright/journey-timeline/khang-chien-chong-phap-1946-1954-1920x1080.png), [all-year UI, 1280×720](../../output/playwright/journey-timeline/all-year-navigation-1280x720.png), [actual stage-offset/DPR-2 alignment](../../output/playwright/journey-timeline/stage-offset-dpr-2.png). All 16 journey/viewport combinations and four year-index screenshots are retained in the same folder.

## Self-review and deliberate limits

- Review all changed tracked files and task-created untracked code/data; leave the owner's Word/PDF/image/prompt files untouched.
- Keep public published-only filtering, server access boundaries and RLS unchanged. The test catalog is imported only by test tooling.
- Legacy journey browser tests were adapted for a display-contents facade and for native offstage reading: after camera inspection, reveal the fallback before focusing its source summary. Focusing hidden source content left Enter on the stop-list summary and falsely toggled that list. The keyboard, geometry, real-path-pixel and accessibility assertions remain.
- Final original-page credit review corrected the Hồ Chí Minh portal images to the credited archival material / Tô Ngọc presentation and Báo Quân đội nhân dân republication; Trịnh Phòng retains the painting credit. No unsupported photographer or article author is asserted.
- The configured public homepage was read anonymously at 19:29 Asia/Bangkok: 10 identities are observed, and 31 working-inventory identities are not exposed there. Their internal database workflow states remain unknown. Actual availability is recorded separately from source review. The later-period expansion is a prepared draft package until separately applied and reviewed.
- No mobile/tablet redesign, unrelated module work, historical route reconstruction, guessed coordinates or AI-generated documentary imagery.

Required ignored local report: `.task-reports/2026-10-25-1844-journey-popups-curriculum-timeline.md` (not a versioned source of truth).
