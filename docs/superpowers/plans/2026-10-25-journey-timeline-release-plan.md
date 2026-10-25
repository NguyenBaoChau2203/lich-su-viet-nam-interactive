# Journey popup and timeline release plan

## Mission

Commit the approved local journey-popup/timeline changes, open a pull request, merge into `main` after checks pass, and apply the bounded Supabase content package as **drafts only** when access to the repository's actual project is verified.

## Sources of truth

The owner's release request and explicit draft-only choice in this chat; `AGENTS.md`; the approved journey-popup spec/implementation plan; the dated acceptance audit; the bounded content package and its dedicated SQL generator. Historical local acceptance records remain dated evidence, not a claim that the remote release already occurred.

## Verified starting state

- Branch `feat/homepage-ui-refinement` and `origin/main` both start at `ffd20a11564d4382e8e6541403938eff33e6678d` after fetch.
- Local code includes 20 historical-media stop bindings, all-year navigation and a 22-draft content package. Existing focused browser and full verification evidence is recorded in the acceptance audit.
- The configured public application exposed ten events spanning 1911–1986. The content package was not previously applied.
- The connected Supabase plugin does not currently expose the repository's recorded project reference; verify CLI access independently before any mutation. Do not choose another project merely because it is available.
- Owner documents, extracted report images and unrelated prompts are untracked and outside this release.

## Scope and constraints

Include only the implemented slice, its tests, historical image assets, approved task documents, source/coverage ledgers and bounded SQL/content artifacts. Keep `.env`, Word/PDF, report images, local evidence/index/build outputs and `.task-reports/` out of Git. Work inline with one agent. No publication, schema/RLS changes, Storage uploads or frontend-host deployment is authorized by the draft-import choice.

## Work items

1. Recheck remote/base, self-review the exact allowlisted diff and run fresh `pnpm verify`. Preserve the running owner-facing local dev server.
2. Resolve the actual Supabase project from repository evidence and existing authenticated tools. Inspect schema, constraints, draft/published inventory, required topics and policies read-only. Never print credentials.
3. Stage only explicit paths, inspect the staged file list/diff and commit with a focused conventional message. Push the branch and open a PR explaining behavior, validation, draft-only import and unresolved content/environment limits.
4. Inspect PR checks on the expected head SHA. Resolve demonstrated failures without bypassing hooks or checks. Merge into `main` only after required checks pass; synchronize the local checkout without deleting unrelated work.
5. If the correct Supabase project is accessible, apply only the reviewed insert-only content SQL, preserving existing differing rows and all published rows. Verify draft counts/source/lesson links, repeat the bounded import to check idempotence, and confirm anonymous published-only exposure remains unchanged.
6. Record the commit, PR, merge SHA, CI result and exact Supabase inserted/skipped/verification results in a local ignored report. Identify every incomplete criterion explicitly.

## Acceptance and verification

Fresh full local gate; explicit staged allowlist without unrelated or secret files; PR and CI links; confirmed merge SHA on `main`; verified draft-only Supabase result when credentials permit. SQL output determinism does not substitute for actual executed import/rerun evidence. Keep historical evidence, workflow state and public availability separate.

## Stop conditions and deliverables

Do not merge failing/unresolved required checks, overwrite unrelated changes, bypass authorization, import into an unverified project, or publish drafts. If Supabase access is unavailable, finish the independent Git work and report the precise access gap with the ready-to-apply SQL. Do not claim the database deployment succeeded without post-apply evidence. Deliver the PR/merge links and `.task-reports/` release report; leave the owner's local testing workflow available.
