# Explorer final review and local remediation

Date: 2026-10-25, Asia/Bangkok. Scope: the cinematic homepage refinement, event-selection/detail-return integration and local acceptance. One main Codex agent performed investigation, fixes, optimization and self-review. The repository-wide MVP and unrelated account/admin/payment features are outside this acceptance.

## Findings and repairs

### Optional country rendering could reject outside the failure boundary

`CinematicGlobeCanvas` caught fetch/parser failures but did not catch `setCountryBoundaries`. The sphere subdivision helper rejects more than 60,000 rendered segments. A valid synthetic source with 60,001 distinct edges therefore left the optional layer at `loading` and produced an unhandled rejection. The new browser regression failed before the repair. Country attachment now clears the rejected optional layer and reports `unavailable`, preserving core readiness and usable event controls. The 60,000-segment limit is unchanged.

### Overlay subscriptions were recreated on every camera frame

`GlobeMarkers` put native ResizeObserver/MutationObserver setup in an effect dependent on the changing viewport. A real world-control flight constructed 121 new observers of each kind in the standalone baseline counter; the red regression observed 99 ResizeObserver constructions against a fixed allowance of three.

The observer lifetime now follows the mounted overlay. A React Effect Event reads current projection/content for callbacks; an explicit reactive effect still updates layout when those inputs change. Newly mounted occupied UI is observed and removed UI is unobserved, retaining card/chooser/source collision handling. The same post-fix counter constructed **zero** new observers during the flight. No extra animation scheduler, dependency or production debug global was added.

Reference checked via Context7: [React useEffectEvent](https://react.dev/reference/react/useEffectEvent), specifically native subscriptions that read the latest values without resubscribing. Relevant installed Next.js client-boundary/testing guides were read. This is a construction-count optimization, not a measured FPS multiplier; the standalone baseline counter overlapped a focused test run, and no frame-time claim is derived from it.

### Country render acceptance contained a false-positive assertion

The legacy test captured images but returned a constant true for its purported pixel check. It now captures the same canvas/camera before and after removing only the country layer and requires more than 100 changed pixels using the existing image helper. The test helper gained a test-only `clear-country` action; production exposes no new debug API. The fresh focused render test passes on the real current scene.

## Fresh final evidence

- `pnpm verify`: exit 0 after the final application edits; 979 unit tests / 76 files, eight hook/setup tests, history checks, lint, strict types and production build (102 pages).
- Focused browser gate: three cases passed, covering the two red regressions and real country pixel comparison.
- Full selected public desktop acceptance: **153/153 passed**, 755.697 seconds (12.6 minutes), zero unexpected/flaky/skipped cases, against the same fresh production build. Eleven files cover current homepage, cinematic acceptance, country borders, zoom/expansion, all four journey choices/content/path, province fallback/fixture rendering and the new regressions.
- A browser negative control served an empty synthetic country source. Clearing its already absent geometry produced identical canvas images and zero segments, confirming that the new changed-pixel threshold rejects an absent stroke. This checks test sensitivity, not real source coverage.
- Current screenshots were captured at 1280×720 and 1440×900 plus a Paris journey at 1440×900; all returned HTTP 200, matching title and no horizontal document overflow. The automated suite also covered 1366×768 and 1920×1080. Home and journey images were visually inspected directly.
- Source validator: exit 2, `needs_evidence`, `productionReady=false`, 34/34 administrative identities, 2,326/2,342 ways available, 16 missing ways in Khánh Hòa. No approved province artifact was invented or published.

## Known incomplete requirements and limits

The production 34-unit province geometry remains incomplete; renderer fixtures do not prove approved coverage. Exact textbook-printing/page mapping remains the prior disclosed source gap. No historical claims, coordinates, dependencies, secrets, Word reports or external service state were changed in this review.

The 153 diagnostic records contain **zero unhandled page errors**, but logs are not clean: 210 requests for the missing production province artifact returned 404; one country 404 and one province 503 were fault injections. There were five injected local failed requests, 337 local aborted requests during navigation/prefetch/teardown and **35 connection resets to the existing OpenStreetMap tiles on event-detail pages**. Browser assertions passed; that does not guarantee those remote tiles rendered. Aggregate console errors: 253; warnings: five, including injected WebGL context checks. Diagnostic fixture coverage is not a universal log of separately created no-JS contexts.

The task-owned server emitted **four** `The destination stream closed early` messages with digest `3840477093` during the scoped browser session. This prior symptom persists; its root cause has not been established. No framework patch or blanket error suppression was introduced. Passing tests do not prove it harmless in every flow. Account/admin/staff/payment/progress mutation suites and deferred mobile/tablet checks are not part of this run.

Evidence: `.task-reports/explorer-final-review-work/verify.log`, `focused-green.log`, `e2e.log`, `verification-summary.json`, `observer-before.json`, `observer-after.log`, `negative-country-control.log`, `province-source-validation.json` and `server-symptom.log`. The two pre-fix failed regression traces/screenshots are retained under `red-test-results/`.

Exact browser command used (with `E2E_BASE_URL=http://127.0.0.1:3000`):

```powershell
pnpm exec playwright test tests/e2e/home-map.spec.ts tests/e2e/home-globe.spec.ts tests/e2e/home-cinematic-globe.spec.ts tests/e2e/home-cinematic-acceptance.spec.ts tests/e2e/home-country-boundaries.spec.ts tests/e2e/home-explorer-refinement.spec.ts tests/e2e/home-journey-choices.spec.ts tests/e2e/home-journey-path.spec.ts tests/e2e/home-province-boundaries.spec.ts tests/e2e/home-journey-content.spec.ts tests/e2e/home-final-review.spec.ts --workers=1
```

## Changes and self-review

- Product: `components/explorer/GlobeMarkers.tsx`, `components/explorer/cinematic/CinematicGlobeCanvas.tsx`.
- Tests: `tests/e2e/home-final-review.spec.ts`, `home-country-boundaries.spec.ts`, `refinement-evidence.ts`.
- Documentation: the current audit, `docs/superpowers/plans/2026-10-25-explorer-final-review.md` and a new progress handoff.
- Compared 164 starting app/test/dependency hashes: only the four expected preexisting product/test files changed; the regression test is new. Protected baseline code/dependencies and existing historical records/geometry were preserved. This workspace already contains substantial untracked/dirty work, so a normal Git diff alone cannot show all local changes; actual task edits and hash scope were reviewed directly.
- `git diff --check` passed. Direct checks of the task-owned untracked files found no trailing whitespace/conflict markers. No file was staged/committed; no external service write occurred.

## Local delivery

The fresh production target is `http://127.0.0.1:3000`, build `Ju3JJRIh3dvOzmlzP4c_C`, task-owned node PID 15792/tool session 93826 at creation. A headed Microsoft Edge session `owner-final-test`, PID 7208, was opened on the home page for owner testing and is deliberately left open. The server is deliberately left running. Target details, logs and scoped baseline hashes are in the ignored `.task-reports/explorer-final-review-work/`; no deployment is implied.

Overall result: the requested review, two bounded product repairs/optimization and local testing handoff are delivered. The broader refinement remains **partial** at the required real province-data gate; its synthetic rendering tests do not change that status. Local report: `.task-reports/2026-10-25-0028-explorer-final-review.md`.
