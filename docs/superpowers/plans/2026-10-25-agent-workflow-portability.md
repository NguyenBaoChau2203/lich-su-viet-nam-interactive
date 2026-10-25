# AI agent workflow portability and index reliability

## Mission

Make the existing repository's AI workflow reproducible for a collaborator cloning it from GitHub, and replace misleading tooling health claims with observable checks. The owner authorized investigation and reversible local remediation. Execute serially in one agent; review is self-review.

## Sources of truth and verified starting state

- Owner instructions and `AGENTS.md`; existing product scope and approved feature specifications remain authoritative.
- `docs/agent/AI-AGENT-PROMPT-STANDARD.md` and the matching template govern new task prompts.
- Baseline HEAD: `851b31a`; working branch: `codex/agent-workflow-portability`.
- Existing Word, PDF, image, report and output files are untracked owner work. Preserve them.
- Confirmed environment: owner uses Codex desktop and Antigravity 2.0 on Windows; collaborator uses Claude Code on Windows. Add a thin Claude adapter to the canonical rules/skills. Do not require the same model or plugin catalog.
- Eight agent tests pass, but setup validation accepts empty hook configurations and checks presence rather than behavior.
- CodeGraph 1.6.0 reports 774 files, 11,762 nodes, no pending source changes and a complete index. Its scope includes untracked `outputs/` document-generation scripts. Its stored daemon PID is no longer live; this chat has no CodeGraph MCP tools. Git sync hooks are absent.
- `.codex/config.toml` is machine-local and excluded through `.git/info/exclude`. Its paths and private Memory store do not travel with a clone.
- `START-HERE.md` still describes the initial slice and assumes globally installed plugins. Project skills reference the superseded tabletop. The later approved globe design and implemented globe conflict with an older homepage sentence in `AGENTS.md`; record implementation separately and route homepage work to the current approved design without modifying UI.

## Scope and constraints

In scope: shared rules/skills, onboarding and current-code map, deterministic agent checks, portable optional MCP examples, safe local Git hook installation, CodeGraph scope/sync diagnostics, relevant CI configuration. No new application dependency is needed.

Out of scope: application UI/features, historical claims/geometry, database or service writes, Word edits, credential access, global agent configuration changes, plugin installation/upgrades, commit/push/PR/deployment.

Keep local configuration private. Never overwrite an existing custom Git hook configuration. Missing optional tools must produce an actionable warning, not a false success or a failed application gate. CodeGraph indexes supported code; it is not chat memory or a complete document/database index. Do not make its presence a mandatory CI prerequisite.

## Work items

- [x] Add regression tests proving semantic setup checks reject missing hook handlers, broken local links, unsafe portable configuration and inconsistent tool commands. Preserve support for additional skills.
- [x] Add repository-root command helpers and CodeGraph `status`, `sync`, `rebuild` commands with explicit health interpretation. Test missing CLI, malformed/partial/stale status, fresh-clone state and failure propagation. Verify a real source add/change/delete round trip outside the application tree.
- [x] Add idempotent, opt-in local Git hook setup that preserves custom hooks. Test it in disposable Git repositories, including a path with spaces.
- [x] Limit CodeGraph's scope with shared configuration. Reconcile the local index and verify output scripts are absent while current project scripts are present.
- [x] Fix hook invocation from nested working directories and validate the real JSON payload/exit contract. Do not represent regex guards as a sandbox.
- [x] Update onboarding, optional MCP examples, skill references and current-state navigation. Persist the owner's one-agent rule in the repo, distinguish imported features from permission to expand scope, and remove assumptions about personal plugins/paths.
- [x] Make CI's browser smoke gate explicit and independent of private database credentials, retaining the full integration suite as an opt-in documented workflow. A real fresh snapshot exposed the existing proxy's public-config requirement; use fixed synthetic build/runtime values rather than live credentials.

## Acceptance and verification gate

- `pnpm agent:setup`, `pnpm agent:doctor`, `pnpm agent:check` and documented CodeGraph commands work from this checkout. Repeated setup is harmless; existing custom hooks are preserved.
- New logic has focused regression tests observed failing before implementation and passing afterward.
- A collaborator needs Node 24, pinned pnpm and Git for the base workflow; optional tools and per-user trust/authentication are identified explicitly.
- `pnpm verify` passes with fresh output. Browser checks run only if the changed tooling/CI path needs them; no live data mutations.
- Inspect complete `git diff`, `git diff --check`, status and staged files. Do not stage or commit.
- Write the required ignored report under `.task-reports/` using Asia/Bangkok time, recording evidence, limitations and intentionally untouched files.

## Stop conditions and deliverables

Stop dependent work if it would require credentials, overwrite custom hooks, mutate external resources or alter product behavior. Report the exact boundary and continue independent authorized work. Deliver maintained scripts/tests/configuration, onboarding and a technical audit with verified causes versus possible CodeGraph failure modes, plus an accurate Vietnamese handoff and absolute local-report link.
