# Bounded Vietnamese timeline review package

Local handoff, 2026-10-25. This folder does not feed production client data. Public queries continue to require `workflow_status = published`.

`review-package.json` contains 41 independent inventory dispositions, 22 bounded source-reviewed draft narratives, their claim locators and actual lesson-section references. `reviewed-events/` contains the same proposed narratives in the project's frontmatter/Markdown format: 18 additions and four bounded revisions of existing slugs. The 22 original Vietnamese identities and six world/regional records remain in their existing files. A repeated slug here is a revision artifact, not a second event.

Generate only this package:

```powershell
node scripts/build-vietnam-timeline-sql.mjs
pnpm exec vitest run tests/unit/vietnam-timeline-content.test.ts tests/unit/curriculum.test.ts tests/unit/content-validation.test.ts
pnpm history:data:check
```

The generator writes `supabase/seed-vietnam-timeline-2026-10-25.sql` and the bounded Markdown copies. It does not apply SQL, change workflow state, write storage or rewrite other content. Do not use the broad `build-content-sql.mjs` for this handoff.

The SQL is insert-only and keeps new events in `draft`. It fails before changes when required topics are absent. Existing differing slugs are skipped. Source and lesson links are added only to draft rows whose title, summary, content and dates match the proposed artifact; existing hand edits and published rows are not replaced. Existing four revisions therefore require explicit editorial reconciliation if their database contents differ. Source IDs are deterministic technical identifiers, never reviewer identities. No historical location, source approval or human approval is invented.

Actual database rerun, constraint, RLS and assignment behavior remains untested: Docker Desktop's Linux engine was unavailable. Deterministic output and query-shape checks are structural evidence only. A separate anonymous read of the configured homepage at 19:29 Asia/Bangkok exposed 10 public identities spanning 1911–1986. The package records that observation for each identity; non-exposure does not establish internal database workflow state. This read did not import or publish the new drafts. Run the SQL and rerun it first in a confirmed disposable local database after reviewing the package; inspect inserted/skipped counts, sources and assignments. Remote import and publication need a separate owner request.

See `docs/content/grade-12-vietnam-timeline-coverage.md`, the dated content/media source ledgers and `docs/audits/2026-10-25-journey-timeline-acceptance.md`. An event count is not a completeness certificate. The 1976 candidate is held for lesson fit, UNESCO wording/date still needs its original resolution, 18 legacy narratives have no new full certification, and the owner's exact textbook printing/pages remain unknown.
