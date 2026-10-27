# National homepage figures — current release readiness

**Decision: PUBLISHED TO THE OWNER-AUTHORIZED SYSTEM SUPABASE; ready for the owner's final local test.** Date: 2026-10-27, Asia/Bangkok. Direct one-agent **self-review**, not independent review, teacher approval or historian certification. The latest owner instruction explicitly authorizes fixing the remaining integration, publishing to the system Supabase and opening local web. [Authorization](2026-10-27-local-heroes-live-release-authorization.md), [actual publication](2026-10-27-local-heroes-live-publication.md), [machine verification](2026-10-27-local-heroes-live-release-verification.json).

The [previous local-only audit](2026-10-27-local-heroes-remediation-local-readiness.md) is preserved byte-for-byte, including its then-pending approval, missing live schema/counts and qualified performance comparison. Earlier Phase00–07 handoffs remain dated evidence. Their blocked live state is superseded by execution, not relabelled as previously successful.

## Exact target and artifacts

- Target **lichsu_12 / ueolfjujjybutyuyfxha / ap-northeast-1**, PostgreSQL17.6. Authenticated CLI fallback was used because the connected Supabase MCP lists other projects. Both linked refs and actual public before images were checked.
- Branch/HEAD unchanged: `feat/local-revolutionary-heroes` / `6a38f582515102c03ccc7ac806ae6d3f1becbbb0`. No staging/commit/push/PR/merge; owner/unrelated files preserved.
- Immutable research v18 **06080db323af8f89364355323cd585824f3772963e96316dd8ae72aa0fc54416**, exact parent v17 **84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb**. Original draft snapshot **bc6bdbf6f6fcd6c4259987b9b010514109b5fdffe044c50f0fa52329a5c74a53** and legacy-conflict refusal unchanged.
- Current [release-gate package v19](../../supabase/content/local-heroes/published-national-v1/manifest.json): **eece5e9012d40371947fc93687f10478325942e54ef9a19ceabf5edb5db1f9f0**. Eight historical files match v18 byte-for-byte; only coverage/public observation and manifest/approval metadata differ. The public snapshot names the executed v18 source hash, avoiding a circular self-hash.
- Executed [target-specific v5 artifact](../../supabase/content/local-heroes/live-release-20261027-v5/artifact-hashes.json): **0dcfc960010153a91fd3501c0004ed2b9c84138ab9ce45d356555d167c3ba43d**. Publish SQL SHA-256 **98081843e08f589b6b7ebc39e3e3f4b06e7a5ff18fff54694c9e269d7851f69e**; rollback SQL **0f438056638c84d889083427361e443e39db1aaec8faa9ab4baba8e13a5109e2**.
- Actual public-schema backup **852c69884eeb9539c8dc3cc63f4a4a8ed265b97b3ec7496d42237faccd94c78d**; public content before image **f61ea0f1d5736af962e0b056a17a91b4331a9afada8167ff0136946b4f0381d5**. No remote Auth/student/payment data copied. Full safe backups/logs: `.task-reports/local-heroes-live-release-20261027/`.

## Acceptance matrix

| Area | Current decision | Evidence and limits |
| --- | --- | --- |
| National first release | PASS: **34/34 localities;35/35 complete selected people** | No reduced denominator, regional pilot or omitted selected item |
| Roster and held decisions | PASS:53 nominees=35 selected/18 held | Original decisions retained, including30 held stories/24 held images |
| Sources/stories/images | PASS:35 people,35 main stories,35 representative images | V18 [direct ledger](sources/2026-10-27-local-heroes-remediation-content-review.json):368 admitted claims/73 scoped sources; original pages, actual image identity/context/usage checked. No invented portrait, honor or license |
| Canonical integration | PASS:3 existing enrollments,32 new figures | All9 original figure base records,6 figure media,46 events and17 event links preserved. [Nine scoped legacy field checks](sources/2026-10-27-local-heroes-live-legacy-evidence.json) support preserved biography/life dates; old covers retained |
| Draft artifact | PASS; original bytes unchanged | Deterministic IDs/slugs/fingerprints, draft-only default rollback and original legacy refusal preserved |
| Actual-baseline release rehearsal | PASS:9 cases | Disposable actual-schema/content mirror: exact rerun/revision stability, source/child/canonical/slug/prepared-draft refusals, later-edit rollback refusal, actual rollback, republish |
| DB role/RLS/invariants | PASS on disposable actual schema |296 SQL assertions/2 files; earlier Auth/PostgREST admin8 and two lock-observed races remain separately dated evidence. No live role-write tests/fake users |
| Actual schema application | PASS | [Separate adoption track](../../supabase/releases/local-heroes-20261027/README.md), verified existing baseline plus unchanged feature migration, six new RLS-enabled tables, exact two-version ledger |
| Live anonymous graph | PASS |35 profiles with story/gallery/claims/qualifying relationship;34 positive locality counts. [Observed counts/fingerprints](sources/2026-10-27-local-heroes-live-publication.json) |
| Real-target desktop flow | PASS |4 viewports,140 profile checks,136 locality selections,35 paginated identities each; alias/reload/exact return/Back/forward/keyboard/reduced motion/source anchors/images/no-JS detail;0 diagnostics and0 attempted writes. [Observation](../../output/playwright/local-heroes-live-release/results.json) |
| Broader fixture/admin/globe cases | Prior Phase07 evidence retained |72 isolated public cases,8 actual disposable Auth admin cases,10 selected globe/journey/history regressions. [Dated audit](2026-10-27-local-heroes-remediation-local-readiness.md); not relabelled as fresh live mutations |
| Final wording | Implemented and rebuilt | Stale pending-release disclaimer replaced by factual observed coverage only; final four-viewport/no-JS/no-WebGL checks recorded in handoff |
| Full verification | PASS |1189 tests/106 files,26 script tests,42 history tests,lint0 warnings,strict types,103-page build; repeated after final copy change |
| Public smoke | PASS |Build smoke→8 read-only smoke tests→ordinary configured build restored, all exit0; before final wording-only adjustment |
| Performance | Qualified prior control retained |Same-current-fixture HEAD control delta5632 gzip bytes<35840; no new renderer/geometry/idle loop; one bounded RPC.70/70 actual optimizer transports DPR1/2 widths128/256,max27394 bytes. Original whole-fixture mismatch remains explicit |
| Actual owner release authority | PASS |Latest explicit request to publish exact presented source/target; no fabricated manual hash quotation |

## Self-review and release safety

The separate preparer/SQL renderer binds the intended ref, actual public before image, direct legacy citations, deterministic identities and SQL hashes. One atomic transaction locks affected tables, applies timeouts and the catalog advisory lock, refuses identity/content/unknown-child/unpublished-preparation conflicts, checks every graph through the existing invariant, forces deferred constraints and verifies anonymous35/34 before commit. Exact rerun leaves revisions unchanged. Rollback refuses later edits/references instead of deleting them.

The actual-baseline mirror restores public historical data with original triggers installed before feature/release tests, using schema-only local managed Auth/Storage scaffolding. No remote Auth data or disabled production trigger. Source-metadata NFC, legacy evidence and unique-cover issues found in rehearsal were fixed before execution. The prepared-catalog overwrite probe first failed meaningfully, then passed with the new refusal; assertions were not weakened.

Self-review covered the changed source/SQL/content, generated artifacts, source/claim scopes, actual before/after data and unrelated changes. Removal of four unused locals in `scripts/content/sync-docs.mjs` cleared three lint warnings without running the generator over historical ledgers. No dependency, TLS bypass, account/payment behavior or renderer added. Supported code was traced through CodeGraph; Markdown/JSON/SQL, omitted graph content and live data were checked directly.

## Four desktop sizes

| CSS viewport | Real published-data checks | Screenshots |
| --- | --- | --- |
|1280×720|35 profiles,34 choices,35 paginated IDs,return/keyboard/axe/no-JS|[catalog](../../output/playwright/local-heroes-live-release/catalog-1280x720.png),[detail](../../output/playwright/local-heroes-live-release/detail-1280x720.png)|
|1366×768|same complete flow|[catalog](../../output/playwright/local-heroes-live-release/catalog-1366x768.png),[detail](../../output/playwright/local-heroes-live-release/detail-1366x768.png)|
|1440×900|same complete flow|[catalog](../../output/playwright/local-heroes-live-release/catalog-1440x900.png),[detail](../../output/playwright/local-heroes-live-release/detail-1440x900.png)|
|1920×1080|same complete flow|[catalog](../../output/playwright/local-heroes-live-release/catalog-1920x1080.png),[detail](../../output/playwright/local-heroes-live-release/detail-1920x1080.png)|

These140 profile/136 locality checks passed with no mocks, login or attempted writes. Screenshots above precede only the final coverage-copy change. Final-build captures `final-catalog-<viewport>.png` and `final-build-results.json` are separate. Scoped axe reports0 WCAG A/AA violations on catalog/Kim Đồng detail; this is not whole-product certification. Installed Edge156.0.4314.42/Windows hardware automation; earlier device/timing limitations remain in the dated audit.

Ordinary local URL: **http://127.0.0.1:3000/?noi-dung=nhan-vat**. The owned loopback server is kept running for final owner testing. A visible Edge window was opened with Playwright Interactive using the installed executable; no browser installation. Only the owned earlier server was stopped for the last copy rebuild.

## Exact commands and evidence

All fresh command hashes/exits and evidence are in [live-release verification](2026-10-27-local-heroes-live-release-verification.json), with full logs under `.task-reports/local-heroes-live-release-20261027/`. Prior complete Phase07 gate commands remain in the preserved local audit.

| Command/action | Exit and result |
| --- | --- |
|`pnpm agent:sync`|0;836 supported sources; omitted/non-source evidence read directly|
|`pnpm exec vitest run tests/unit/local-heroes-live-release.test.ts`|0;5 tests, deterministic artifacts and exact preservation/conflict/evidence/NFC refusal|
|`node scripts/content/prepare-local-heroes-live-release.mjs --baseline tests/unit/fixtures/local-heroes-live-baseline.json --evidence docs/audits/sources/2026-10-27-local-heroes-live-legacy-evidence.json --out supabase/content/local-heroes/live-release-20261027-v5`|0;35 people/34 localities/3 exact enrollments|
|`node .task-reports/local-heroes-live-release-20261027/rehearse-publication-v5.mjs`|0;9 asserted cases; expected SQL refusals exit3; actual rollback/republish|
|`pnpm verify` before execution|0;1189 tests/106 files+26 scripts+42 history,lint0 warnings,types/build|
|`supabase migration repair 20261027000000 --status applied --linked --workdir supabase/releases/local-heroes-20261027`|0;only the captured actual baseline adopted; no invented old root history|
|`supabase db push --dry-run --linked --workdir supabase/releases/local-heroes-20261027`|0;one feature migration,no seed/roles|
|`supabase db push --linked --workdir supabase/releases/local-heroes-20261027 --yes`|0;feature applied; catalog-cache warning retained and presence queried independently|
|`supabase db query --linked --file supabase/content/local-heroes/live-release-20261027-v5/publish.sql --output json`|0;atomic publication,actual35/34;41 total figures/106 sources/66 media|
|Owner/anon read-only postflight|0;35 complete public profiles,34 positive locality counts,old base fields/events/links/media unchanged,six RLS tables|
|`node scripts/content/check-local-heroes.mjs --package supabase/content/local-heroes/published-national-v1 --mode release`|0;valid=true,releaseReady=true,35/35 complete,34/34|
|`pnpm build:smoke` then `pnpm test:e2e:smoke` then `pnpm build`|0/0/0;8 read-only cases,four desktops,ordinary build restored|
|Real-target read-only browser observer|0;4 viewports/140 profiles/136 selections,0 diagnostics/attempted writes|
|`pnpm verify` after the final wording change|0;fresh complete gate; final build ID in handoff|
|`supabase db advisors --linked --type all --level info --fail-on error --output json`|**1**, retained:98 notices vs89 before;0 new ERROR,same pre-existing donation_wall security-definer-view ERROR|

The unsafe mixed legacy `pnpm test:e2e` was not run against the working system. No diagnostic was hidden to manufacture a pass. Fresh copy/fallback checks, final build ID, Git whitespace/status and exact local server/browser state are in the final handoff/verification record.

## Remaining limits and external boundary

- **Existing system advisory:** `public.donation_wall` security-definer view already existed; advisor fail-on-error still exits1. Its public payment/donation whitelist is unrelated to this feature. No silent rewrite under a figures release. [Supabase remediation](https://supabase.com/docs/guides/database/database-linter?lint=0010_security_definer_view). Other existing function/Auth/index/policy notices remain in [classification](sources/2026-10-27-local-heroes-live-advisors.json).
- Nine added notices contain **no new ERROR**: six performance notices for deliberate authenticated public/staff/editor/reviewer RLS unions, two INFO covering-index opportunities for composite owner/claim FKs, one INFO newly unused locality index. Current catalog budgets/role assertions pass; performance follow-up must preserve role semantics. [Policy guidance](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies),[FK indexes](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys).
- CLI pg-delta cache extraction reported null collate/ctype. Actual migration ledger, six RLS tables and RPCs were verified independently before content publication. No CLI/platform/collation change was made.
- Missing historical v16 bytes remain a provenance limitation; current facts/images were directly reviewed and v18 has exact preserved v17 parent. No fabricated history repair.
- Image use remains recorded coursework/reference use with original-page credits and labels. Publication does not create a general commercial license. Held people/stories/media remain unpublished.
- Live role mutations, fake users and destructive tests were deliberately not run; role evidence is disposable. Actual owner/staff accounts were not changed.
- No storage upload, Git stage/commit/push/PR/merge, Vercel or other frontend deployment occurred. Those actions, unrelated Auth/payment remediation or any live rollback/schema reversal require a later explicit instruction and concrete reviewed artifact/target.

Stop at the requested system Supabase publication and running local final-test checkpoint. No next model/phase is invoked.
