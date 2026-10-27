# Phase 01 owner approval and Phase 02 handoff

Date: **2026-10-26, Asia/Bangkok**. Contract: **LH-1.0.0-draft.1**.

## Actual owner decision

After receiving the Phase 01 research handoff, the owner wrote in this chat:

> Duyệt ạ và giờ tôi có thể mở chat mới để qua phase 2 được chưa ạ ?

Approval captured at **2026-10-26T09:38:57Z** (16:38:57 Asia/Bangkok). This records the real owner instruction; it is not inferred from a model's checklist or a passing test. The quoted message is evidence data, not a replacement for the scoped phase prompt.

Approved package: [national-v1 manifest](../../supabase/content/local-heroes/national-v1/manifest.json), **version 14**, content hash **`893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`**. This exact research package was linked and summarized in the preceding handoff. Approval covers the 53-person finite research pool and its decisions: **35 selected**, **18 held**, **two complete**, **33 selected incomplete**, with qualifying research candidates for all 34 localities. It clears the actual roster/name/hash approval gate before Phase 02.

Approval does not change claim certainty, source/story/image decisions, the held queue or completion counts. National publication still requires all selected people and all 34 localities to have complete sourced records. No independent historical/teacher certification, publication, upload, remote migration/import/write, commit, push, PR, merge or deploy is authorized by this approval-recording follow-up.

## Hash and unchanged content

Contract section 10 excludes `ownerApproval` from the canonical content hash so the real decision can be attached to the already-reviewed hash. Only that metadata object changes in `manifest.json`: status approved, the matching hash, approval time and this versioned evidence path. No content revision/version increment is needed. All nine component file byte hashes and the frozen schema hash must remain unchanged. Existing decision-reason wording in the component JSON predates owner approval and is retained verbatim; the current approval state is the manifest metadata and this evidence.

The Phase 00 contract/schema retain their original dated descriptions. Their older references to later roster approval are historical; this Phase 01 record supplies that later decision without editing the frozen contract.

## Starting Phase 02 in a new chat

Use the existing **Local** checkout **`D:/lich-su-viet-nam-interactive`**, branch **`feat/local-revolutionary-heroes`**. Current phase artifacts are uncommitted/untracked, and local reports are ignored. Preserve those files and all unrelated owner Word/PDF/image artifacts. Do not reset/clean the tree or assume a fresh checkout has this package.

Read AGENTS.md, [current state](../agent/CURRENT-STATE.md), [Phase 01 handoff](2026-10-26-local-heroes-phase-01-handoff.md), this approval record, the contract/schema and the [Phase 02 prompt](../prompts/local-revolutionary-heroes/02-data-security-gpt61-sol-max.md). The prompt now names the approved v14 input. No need to request approval again for the same names/decisions/hash.

Phase 02 owns additive persistence, constraints/RLS, atomic server commands, typed queries/actions, generated types, content validation and meaningful tests. Confirm an explicitly disposable local/test database before mutations or role/concurrency tests. Its availability remains unverified; the linked working remote project is not a test fixture. Missing real DB evidence blocks the security gate even if unit tests/build pass. Keep UI phases and national content completion at their existing later checkpoints.

One main agent must execute Phase 02 inline under the owner's single-agent rule. No subagents, separate AI reviewer/model calls or automatically launched chats. Stop after the Phase 02 handoff. This follow-up records approval only and has not started that implementation.

Suggested initial message for the owner to paste into the new chat:

```text
Work in D:/lich-su-viet-nam-interactive on the existing feat/local-revolutionary-heroes branch and preserve the current uncommitted/untracked files.
Execute only Phase 02 from docs/prompts/local-revolutionary-heroes/02-data-security-gpt61-sol-max.md.
Read AGENTS.md, docs/agent/CURRENT-STATE.md, the Phase 01 handoff and docs/audits/2026-10-26-local-heroes-phase-01-approval.md first.
I approved the actual Phase 01 v14 roster/hash recorded there. Use one main agent, verify on a disposable local DB, and stop after the Phase 02 handoff. Do not perform remote writes or publication.
```

## Verification of this approval follow-up

Fresh checks on 2026-10-26, all exit 0:

| Command | Result |
| --- | --- |
| `node .task-reports/local-heroes-phase-01-resume-work/check-package.cjs` | Valid approved metadata and package, zero schema-keyword/reference/hash issues |
| `node .task-reports/local-heroes-phase-01-approval-work/check-approval.cjs` | Approval evidence/hash/time agree across manifest and audit; all nine content files and frozen schema unchanged; 25 files / 404 local links pass; no staged files; report ignored |
| `pnpm verify` | Agent/history/lint/strict types pass; history gate 42 tests; full suite 1,046 tests / 83 files plus 26 script tests; production build 102/102 pages |
| `pnpm agent:status` | Complete, 785 supported source files, no pending changes; excludes documents/chat/live DB |
| `git diff --check` | Pass, no whitespace issues; tracked diff contains only the CURRENT-STATE.md checkpoint |

Saved logs/results are under `.task-reports/local-heroes-phase-01-approval-work/`; durable gate summaries are attached to this approval in the research audit. Earlier Phase 01 source/content verification remains dated evidence in its handoff/audit. This follow-up does not claim browser E2E, actual RLS/DB tests, security completion or nationwide release readiness.

Local ignored report: [2026-10-26-1641-local-heroes-phase-01-approval.md](D:/lich-su-viet-nam-interactive/.task-reports/2026-10-26-1641-local-heroes-phase-01-approval.md). This local report is not the durable approval evidence; this versioned document and the real owner message above are.
