# Current implementation map for AI agents

Navigation baseline: 2026-10-25, source HEAD `851b31a`. This file locates existing code and relevant decisions; inspect current source/tests before assuming behavior. Counts and earlier test results in audits are historical evidence, not fresh results.

## Product and design authority

The source application was imported on 2026-10-22 and includes study, exam, account, payment and administration modules beyond the original small MVP. Their presence does not authorize new features or migrations. Preserve them when editing the requested slice. Desktop/laptop scope remains `docs/product/DESKTOP-UI-SCOPE.md`.

The approved `docs/superpowers/specs/2026-10-23-curated-history-globe-design.md` records the owner's later globe decision after the earlier tabletop and fullscreen 2D designs. The 2026-10-24 refinement spec explicitly preserves the globe. For the shipped province scope, read `docs/superpowers/plans/2026-10-25-vietnam-province-boundaries-completion-plan.md` and `docs/audits/2026-10-25-province-boundaries-final-review.md`. Earlier 2D/tabletop prompts are historical records; do not execute them as a new homepage rebuild.

## Locate work

| Area | Source / supporting evidence |
| --- | --- |
| Homepage server boundary | `app/(public)/page.tsx`, `lib/queries/explorer.ts` |
| Explorer UI, list/card/time controls | `components/explorer/HistoryExplorer.tsx`, `components/explorer/`, `components/explorer/explorer-map.css` |
| URL/filter/event contracts | `lib/explorer/types.ts`, `lib/explorer/filters.ts`, `lib/explorer/map-state.ts` |
| Cinematic renderer and layers | `components/explorer/cinematic/`, `lib/explorer/cinematic/` |
| Journeys | `lib/explorer/journey.ts`, `components/explorer/JourneyChooser.tsx`, `components/explorer/JourneyPanel.tsx`; follow current sourced journey records |
| Province reference data/pipeline | `scripts/province-boundaries/`, public map assets, `docs/audits/2026-10-25-province-boundaries-final-review.md` |
| Dedicated map/timeline/search/detail | `app/(public)/ban-do/`, `app/(public)/dong-thoi-gian/`, `app/(public)/tra-cuu/`, `app/(public)/su-kien/` |
| Study, exams, accounts and payments | Existing modules under `lib/`, `components/` and `app/`; use CodeGraph on the exact feature before editing. They are not a new implementation backlog. |
| Supabase schema/source records | `supabase/migrations/`, `supabase/content/`, `supabase/tests/`; live DB readiness is separate from local schema checks |
| Verification | `tests/unit/`, `tests/e2e/`, `scripts/agent/*.test.mjs`, `package.json`, `.github/workflows/ci.yml` |

## Journey popup and all-year timeline local handoff (2026-10-25)

Journey reading now uses `JourneyStopReader.tsx` and `JourneyStopPopup.tsx`; `HistoryExplorer` remains the sole playback/presentation-state owner. The cinematic adapter forwards a tagged stage-CSS projection, with `journeys/popup-layout.ts` handling placement. Stop media and its provenance are in `journeys/media.ts` and the dated media ledger. The owner explicitly permits coursework use of Internet images and requires historical event imagery instead of present-day place photos; educational-use entries do not assert an open license. All 20 stop bindings now use archival images, documents or explicitly labelled historical illustrations/context, with no present-day place image eligible.

`timeline-years.ts` derives inclusive all-year choices and normalizes ranges. The bounded local content package is `supabase/content/timeline-2026-10-25/`; its dedicated generator prepares insert-only draft SQL and does not feed a production fallback catalog. Read `docs/content/grade-12-vietnam-timeline-coverage.md` and `docs/audits/2026-10-25-journey-timeline-acceptance.md` for evidence, blocked database checks and remaining source/printing gaps. No remote import/publication is implied. The read-only network fixture under `tests/e2e/journey-catalog-server.mjs` is test-only and is not Supabase/RLS evidence.

Province lines are sourced modern shared-interior **reference lines**, not complete administrative polygons, cadastral geography, historical borders or point-in-province assignment. Preserve the honest limitation, source provenance and intentionally failing full-polygon research control when changing that pipeline.

## Route to the right skill

- Core browsing/state/filter changes: `build-map-timeline-slice`; do not research unchanged facts again for an interaction-only fix.
- New/changed historical claims, coordinates or journey copy: `research-history-sources` and existing provenance ledgers.
- Story/layout/motion: `design-history-story` plus the current approved route design.
- Schema/RLS/server database access: `model-supabase-history`; use a disposable/local DB for authorized changes.
- Completion evidence: `verify-release-slice`, adapted to the changed slice and one-agent self-review.

Canonical skills live in `.agents/skills/`. Claude wrappers only route to them. Broad personal skills/plugins are optional; they must not replace owner constraints, add external writes or start extra AI agents.

## Handoff between contributors

Share a branch/commit, requested outcome, current spec/plan, exact changed paths, observed commands/results and unresolved issues. Do not rely on former chats or personal Memory being available. Update this navigation map when entrypoints or approved scope change; maintain detailed task status in the relevant versioned plan/audit. Keep local reports ignored and cite fresh verification in each handoff.
