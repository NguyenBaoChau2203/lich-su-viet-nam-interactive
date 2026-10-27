# National figures final review, merge and production verification

Date: 2026-10-27, Asia/Bangkok. One-agent self-review and execution.

## Authorized outcome

Review and fix the implemented national homepage figures slice, create a PR, resolve conflicts, merge into main, and bring the matching feature schema/content to production Supabase. The latest owner request explicitly authorizes these actions. Earlier phase prompts' no-push/no-publication boundaries no longer block these requested actions. Preserve unrelated owner files and existing remote work.

## Observed starting state

- Branch feat/local-revolutionary-heroes, HEAD 6a38f58; feature implementation and audits are uncommitted local changes.
- Fresh origin/main ad81a55 is 24 commits ahead, containing premium-lesson/layout/auth/hook fixes to preserve.
- Existing release handoffs report Supabase lichsu_12 / ueolfjujjybutyuyfxha already published 35 people across 34 units. This is prior evidence, not a new live observation; verify before replaying any operation.
- Supabase MCP read calls are denied in this session; authenticated CLI fallback is available. GitHub CLI is authenticated.
- Root node.cmd is an owner-owned empty shim. Run command orchestration with NoDefaultCurrentDirectoryInExePath=1 to avoid false zero-output tool execution; do not stage or modify the shim.

## Execution and gates

- [ ] Inspect application, state/navigation, media/source handling, server authorization and SQL invariants; reproduce findings with focused tests and fix directly.
- [ ] Verify actual production target, migration ledger, public coverage and advisors using read-only CLI queries. Apply only missing reviewed changes after disposable verification; do not replay baseline/import on an already published graph.
- [ ] Run fresh pnpm verify, content release validator, selected public/admin browser and disposable DB tests.
- [ ] Stage only feature source/tests/content/audits/plans, inspect staged diff and secret/file lists; exclude Word/PDF/owner artifacts, local reports and shims.
- [ ] Commit feature; merge current origin/main locally, resolve conflicts preserving both features and rerun affected/full gates.
- [ ] Push branch, create concrete PR with evidence and remaining limits; wait for CI, fix failures, then merge matching tested head without bypassing protection.
- [ ] Fetch/sync local main, confirm merged commit and production public graph/schema, create ignored local task report and hand off exact PR/merge/production evidence.

Historical statements stay unchanged unless source verification justifies edits. Full legacy E2E is not authorized against production; only read-only observation runs there. No new user/test accounts or payment data on production. Do not claim independent review, model certification or national exhaustive-person coverage.
