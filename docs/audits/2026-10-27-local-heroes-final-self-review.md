# Final national-figures self-review and integration

Date: 2026-10-27, Asia/Bangkok. Owner authorized fixes, PR, conflict resolution, merge and Supabase production synchronization in the current request. One main agent performs this review; it is not independent review or historical certification.

## Findings corrected

1. **Unknown lifespan incorrectly becomes year zero in administration.** The catalog branch validated trimmed values but converted the original truthy whitespace string with Number. A blank-looking input consequently failed the graph save. Trim before the optional conversion. Four focused action tests prove blank/space/tab remain null, padded valid years retain their values, and invalid years are rejected before save. Two whitespace cases failed before the fix; all four pass after it.
2. **Git newline conversion can invalidate audited SQL hashes.** The release SQL and migration paths did not pin checkout behavior; the adopted schema dump also contains mixed newlines inside function bodies. Add scoped LF rules for generated release/feature SQL and preserve the captured dump as exact bytes. A real temporary Git repository with core.autocrlf=true reproduces the issue and verifies checkout SHA-256 equality after the fix. The dump retains SHA-256 10e1fc5d3f4cd32add572b9f9ff120353759981f2eb411a61095dd56de1f909a. Its whitespace exception applies only to the immutable captured artifact, not application code or safety hooks.
3. Clean trailing whitespace in the mutable documentation generator and final blank lines in the new plan/prompt files. Do not rewrite hash-pinned source/content snapshots.

## Fresh verification before integration

- pnpm verify: exit 0, 1,193 unit tests / 107 files, 26 agent-script tests; history 42 tests, lint, strict types and 103-page build passed. The four year-input tests are included; the subsequently added Git-checkout test passed separately.
- Release content validator on published-national-v1: valid/releaseReady=true, manifest v19, 35/35 complete accepted people, 34/34 localities, no issues.
- Disposable PostgreSQL tests: local_heroes.sql and local_heroes_claim_groups.sql, 296 TAP assertions, zero failures; transactions rolled back. pg_prove is not installed in this database image, so psql ON_ERROR_STOP plus explicit TAP failure detection was used.
- Public browser, admin, concurrency and post-integration checks are recorded below when they finish. Prior phase results remain dated evidence and are not substituted for these new runs.
- Staging excludes Word/PDF, owner image/prompt files, root/.agents node.cmd, environment files, temporary Supabase links/credentials and ignored local reports. A staged-content credential-pattern scan found no credentials.

## Production observation and scope

Authenticated CLI identifies lichsu_12 / ueolfjujjybutyuyfxha as the linked healthy target. Supabase MCP returns a permission error in this session, so all observations use the existing CLI.

Fresh anonymous RPC read returns 35 people, 12 first-page rows and 34 represented localities. The migration ledger contains the adopted baseline 20261027000000 and feature 20261031000001. The target-specific db push --dry-run reports upToDate=true, migrations=[], seeds=[], roles=[]. The requested feature schema/content is already published; replaying its import or baseline is unnecessary.

The advisor command exits 1 with 98 notices because public.donation_wall is an existing SECURITY DEFINER view. This is the same previously documented unrelated error, not a newly introduced feature finding. No claim of a globally clean advisor report is made. Remediation reference: https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view.

No production mutation test, synthetic account, content deletion or re-import is performed. The current fixes concern server form conversion and portable Git artifacts and require no new SQL migration.

## Integration state

Feature starting HEAD: 6a38f58. Fresh origin/main: ad81a55, 24 commits ahead with premium lesson/layout/auth/hook changes. Preserve those changes when merging and record actual conflicts, final verification, PR/merge and final production checks in this audit and the ignored local report.

Feature commit 263c3ca was merged with origin/main ad81a55 in c500a7f. Git merged automatically without conflicts; the lesson/layout/portrait, proxy and hook fixes remain present. The feature-only diff against origin/main passes git diff --check; a pre-existing Markdown hard-break warning inside an incoming main document was not rewritten.

Fresh post-integration pnpm verify exits 0 with **1,210 unit tests / 109 files**, **26 script tests**, lint, strict types and production build. New checkout and year-input regressions are included. The unchanged feature fixture build passed **72/72 public browser cases** across all four required desktop sizes. The real disposable Auth/PostgREST administration build passed **8/8 cases**, including four viewport/keyboard/axe checks, revision/stale-tab handling, reviewer transitions and eight role/graph denials. Two concurrent PostgreSQL races passed with observed lock waits and deferred rollback of the conflicting operation; the dedicated disposable fixture was reset afterward.

Fresh production observation at 2026-10-27T11:58:30Z confirms **35 public profiles, 35 with images, 35 with stories, 35 with source claims and 34/34 localities**. No schema/content replay is needed. Browser fixture evidence, real disposable permissions and actual production observations are separate evidence classes.

Remaining integration gates are CI/PR merge, isolated smoke and a final read-only browser pass on the integrated configured build. Their exact outcomes and PR URL are recorded in the final local task report; no future success is asserted here.
