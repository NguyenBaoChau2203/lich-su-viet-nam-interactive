# Phase 02 execution ledger

Authority: owner-invoked Phase 02 prompt, LH-1.0.0-draft.1, and the approved Phase 01 v14/hash `893156e86b5e2e350698d05b05ddc0f93804ab174b5f043f0d2d62210c036305`.

Scope: additive persistence/security, atomic commands, bounded server readers, offline validation and tests. One main agent; no remote writes, publication, UI phase, dependency addition or commit. Preserve all entry files; the ignored entry snapshot records 84 byte hashes.

## Work sequence

1. Confirm an isolated, explicitly disposable local Supabase project and PostgreSQL/ICU prerequisites. Inventory migrations and current authorization. Write DB regression cases before migration implementation.
2. Add the exact schema, registry, grants/RLS, serialization lock, revision derivation, reverse integrity checks and graph commands. Rehearse migration, role matrix, rollback and two-session races.
3. Implement frozen DTOs, strict command schemas, anonymous GET RPC readers, staff graph reader and session-based actions. Route existing catalog submit/review/restore through graph commands. Write focused tests first.
4. Implement deterministic research/release package validation, with structural/schema parity, provenance, references, coverage and hash controls. Preserve all research bytes. Write synthetic negative controls before implementation.
5. Generate types from the disposable schema. Run focused checks, actual local DB tests/concurrency, `pnpm verify`, agent sync and diff checks. Self-review all changed and added files.
6. Record Vietnamese Phase 02 handoff, actual interface/compatibility and rollback evidence, explicit gaps and ignored local task report. Stop before Phase 03.

## Decisions and evidence

- Entry branch: `feat/local-revolutionary-heroes`; HEAD unchanged from Phase 01. CodeGraph complete at entry; Markdown/JSON/SQL require targeted direct reads.
- Current CLI: Supabase 2.111.0; `test db --local <path>` and `gen types --local` confirmed by installed help. Highest existing migration is `20261031000000`; generate via CLI, then advance its filename beyond that version if the wall-clock prefix is earlier.
- Ruling: use the existing checkout, not a new worktree, because the owner explicitly requires this branch and preservation of the uncommitted Phase 01 package.
- Ruling: adapt skill reviewer/commit steps to inline self-review and no commit, as explicitly required by the owner.
- Initial Docker daemon was stopped and the repository had no `supabase/config.toml`. An isolated CLI project was created under ignored `.task-reports/local-heroes-phase-02-work/db`; no linked project or environment secret is used.

## Completion evidence

Completed Phase 02 only. Fresh verification: 288 actual DB assertions; both real-session races with lock waits and cleanup; DDL rollback and full replay; 32 focused query/content tests; pnpm verify with 1,092 tests / 90 files, 26 script tests and 102-page build; CodeGraph 788 files; clean whitespace/staging checks. See the Phase 02 handoff and verification JSON for commands/hashes. National content remains two complete of 35 selected people; releaseReady=false.


## Final rulings and self-review

- Ruling: retain legacy API refinements and extract the generated catalog slice; replacing all legacy types broke unrelated nullability contracts. Cost: keep the extraction step in future schema regeneration.
- Ruling: reset only the dedicated disposable project after race fixtures, preserving the existing last-admin safety trigger. Cost: require an empty Auth baseline and allow local DB restart time.
- Ruling: retain approximate period evidence in incomplete approved research while requiring verified runtime readiness. Cost: the explicit Phase 06 evidence gap remains.
- Ruling: existing workflow forms select the primary story; new Phase 03 callers pass explicit selections/revisions. Cost: old forms do not select optional extra stories.
- Ruling: validate the frozen schema keywords explicitly with parity/negative cases; unsupported future keywords fail closed. No dependency was added.
- Final review: self-review by the single main agent. Material findings were fixed with failing/passing evidence in the ignored work logs. No independent review or historian certification is claimed.
