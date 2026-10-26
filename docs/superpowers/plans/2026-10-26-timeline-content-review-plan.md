# Timeline content review and publication

## Mission and authority

Review the 22-item timeline package already imported on 2026-10-25 and publish only the bounded narratives supported by the recorded original sources. The owner's follow-up, “duyệt nội dung cho tôi luôn đi”, delegates the review after the draft-only import. Perform all research, self-review and verification inline with one agent.

## Sources of truth and starting state

Use the latest owner request, `AGENTS.md`, the approved journey/timeline design, `supabase/content/timeline-2026-10-25/review-package.json`, its claim ledger and actual live Supabase state. The prior release merged PR #2; the connected project is `ueolfjujjybutyuyfxha` (`lichsu_12`). The last release reported 46 events: 10 published and 36 drafts. Eighteen package additions were inserted; four differing legacy drafts were preserved. Recheck these facts before writes.

## Scope and constraints

- Review the 18 additions and four proposed revisions, including dates, summaries, body copy, source scopes and actual lesson sections.
- Convert internal editorial/database notes into learner-facing copy without introducing unsupported facts. Keep month/year precision honest, commemorative dates distinct from conference intervals, and dated assessments attributed.
- Reconcile the four existing drafts only after inspecting their current payloads and existing links. Do not silently retain unsupported location/media/source associations with a rewritten narrative.
- Do not certify the other legacy narratives, the held 1976 candidate, UNESCO wording, exact textbook printing/pages, coordinates or new media. Do not change schema, RLS, application features, Word/PDF files or secrets.
- Record agent source review under delegated owner authority; do not invent a teacher, human historian, reviewer UUID or textbook approval.

## Work items

1. Snapshot the live catalog, constraints, policies, selected payloads and links read-only; preserve a rollback payload locally without user/secret data.
2. Reopen every source used by the 22 narratives. Record claim locators, access results, corrections and unresolved scope. Check uncertain or disputed claims against independent sources.
3. Prepare an explicit 22-slug publication artifact and decision ledger. Guard writes against unexpected payload/status/link changes. Retain the original draft-import artifact as dated evidence.
4. Check readiness with the existing content rules and verify all sources, topics and lesson placements. Run the full `pnpm verify` gate. Inspect the complete diff.
5. Apply only approved edits/link reconciliation and the existing draft → pending_review → published workflow in a bounded transaction, with source guards intact. Keep unsupported items draft with a precise reason.
6. Verify live payloads, anonymous published-only visibility, unchanged unrelated records/policies and real learner routes through the configured local application. Save a dated audit and ignored `.task-reports/` report.

## Acceptance, deliverables and stop conditions

Each published narrative has directly checked evidence and valid lesson/source links. Public timeline/details expose approved events, while all unapproved drafts remain hidden. Existing public records and unrelated modules remain unchanged. Deliver per-item decisions, exact before/after counts, test evidence, remaining gaps and a local report link. If live rows changed concurrently or an important claim lacks evidence, stop that dependent publication and report the concrete mismatch; complete independent review work.
