# AI agent workflow and portability audit

Date: 2026-10-25, Asia/Bangkok. Baseline: `851b31a`; remediation branch: `codex/agent-workflow-portability`. One main agent investigated, implemented, self-reviewed and verified. No independent reviewer or additional AI process was used.

## Outcome and boundary

The original agent foundation was useful but was not reproducible across contributors: checks passed while adapters, documentation and local tool state disagreed. This change maintains one shared workflow for the owner's Codex desktop/Antigravity 2.0 on Windows and the collaborator's Claude Code on Windows. It changes tooling, tests and documentation, not application behavior, historical content or live services.

## Findings and remediation

| Finding observed at baseline | Impact | Remediation |
| --- | --- | --- |
| Antigravity rule had no YAML activation trigger | Current official docs say such modular rules are silently discarded | Add `trigger: always_on`; validate it |
| Antigravity hook used a flat object and a direct command without named/nested handlers | JSON validity did not establish hook compatibility | Use a named hook with nested handlers from the documented schema |
| Guard only handled legacy payloads/exit-code blocking | Current Antigravity sends `toolCall.args` and expects a JSON decision | Handle current camelCase payload and `allow`/`deny`; preserve Codex/Claude exit 2 contract |
| Hook script used a path relative to the session directory | Opening a nested directory could break invocation | Resolve the Git root through Node/Git and preserve stdin/status; test in Windows command shell and Git Bash |
| No Claude adapter/skill discovery in the repo | Collaborator could lack project instructions/skills | `CLAUDE.md` imports `@AGENTS.md`; five tiny native wrappers route to canonical `.agents/skills/`; shared shell guard |
| Single-agent preference existed in owner context but not the versioned project rule | Another machine could follow a plugin's delegation workflow | Persist the owner's rule in shared instructions/adapters and prompt template |
| Setup validator accepted empty hook configurations | False confidence from a green check | Validate handler wiring, activation metadata, script paths, core skill references/wrappers, runtime, optional example portability and ignore rules |
| Doctor reported only versions/file presence | Could call an uninitialized or stale graph healthy | Check pinned runtime and source-index health; distinguish optional tools, configured files and actual app trust/authentication |
| Machine-local Codex config contained private absolute paths and was ignored only locally | A clone lacked any reproducible MCP example | Provide a path-free example and shared ignore rule; preserve private config. Add tested Windows CodeGraph MCP launch to the owner's ignored config |
| CodeGraph reported 774 files with no pending changes, including report-generation scripts | “Up to date” described the wrong scope for normal code discovery | Commit scoped excludes, reconcile the local database, verify artifact scripts are removed |
| Stored daemon PID was not live; no CodeGraph MCP in this chat; no Git sync hooks | Automatic watch could not be assumed from installation/index presence | Explicit status/sync/index commands, safe opt-in Git hooks, local MCP launch verification and accurate recovery guide |
| CLI `index` rejects an uninitialized checkout | A seemingly valid rebuild command would fail on a new machine | Probe a real fresh directory; use `init --yes` for first setup and `index --quiet` for existing DB |
| Start guide described the initial slice and assumed the owner's plugins/paths | Agents could repeat completed work or fail setup | Rewrite onboarding, add current code/design navigation, explain local versus shared state |
| Skills and one AGENTS sentence pointed to superseded homepage designs | Agents could restore tabletop/2D despite later approved globe code/specs | Point to the later approved globe and dated amendments; keep old specs as historical records |
| CI ran the entire legacy E2E suite, whose helpers read local env and can mutate data | A fresh clone/CI has no safe disposable DB prepared | Isolate eight public desktop smoke cases; retain the full integration suite and document its required environment |
| A real clean-snapshot build succeeded, but starting anonymous routes without public Supabase configuration failed in the existing proxy | Merely excluding live-DB tests was insufficient for a reproducible CI smoke gate | Add fixed synthetic public URL/key build/runtime fixtures; `build:smoke` and CI require no valid key or running Supabase. Preserve application code |
| OpenCode's optional browser MCP used `@latest` | Tool behavior could change between installs | Pin its existing tested 1.9.0 version; keep OpenCode optional |

Generated `outputs/` and review-render directories are now ignored without deleting them. Word files, other owner artifacts and unrelated source remain untouched. No new application dependency or personal plugin is required.

## CodeGraph diagnosis

The initial database was complete according to CodeGraph 1.6.0, last indexed at `2026-10-24T17:02:07.358Z`, with 774 files, 11,762 nodes and 35,826 edges. It reported zero added/modified/removed supported source files. This supports freshness within its scanner scope, not universal document coverage.

Installed CLI source and upstream documentation establish that native watching is part of an active server/MCP process. Source discovery includes supported untracked files subject to ignores. Ordinary project Markdown, JSON/GeoJSON, SQL and Word are outside the installed extension map; updating those files need not produce a graph change. The filesystem watcher can also be disabled/delayed, and indexes can be incomplete or belong to another worktree. Those are possible mechanisms; this audit does not infer a specific cause for every historical incident without its logs.

The new wrapper checks initialized state, checkout identity, pending changes, extraction version, index completeness and unresolved references. It does not assert an active watcher or prove every graph edge correct. Git hooks are a task-boundary fallback and do not cover all editor saves/rebase variants. See [CODEGRAPH.md](../agent/CODEGRAPH.md).

## Verification evidence

- Focused regressions were observed failing before fixes: missing adapters/entrypoints, empty hook acceptance, ignored broken references, legacy payload behavior and fresh initialization using `index`.
- Agent tests cover source health interpretation, runtime mismatch, hook command/payload/exit/JSON behavior, nested working directories, idempotent setup, custom-hook preservation and invalid configuration. The original eight tests expanded to 26 meaningful cases.
- A disposable agent-only checkout with a space in its path passed repeated setup, setup validation and all agent tests without private config, `.env.local`, `.codegraph` database or copied `node_modules`.
- A real isolated CodeGraph project passed fresh initialization, added-file pending detection, source addition/modification/deletion, symbol retrieval and final complete/zero-pending status.
- A real Windows stdio MCP handshake and `codegraph_explore` retrieved the current `manageIndex` source through the installed CLI. Later in this audit the active Codex catalog exposed the native CodeGraph MCP tool as well. A newly created transient source symbol was retrieved through that tool without an explicit sync; after removal, `agent:status` reported zero pending changes and 748 supported files. The probe was removed. This verifies current operation; other contributors still need to confirm their own app's tool catalog after setup/restart.
- Git Bash ran the committed Claude guard command from a nested directory and returned blocking exit 2 for the synthetic payload; the destructive command was not executed.
- All five canonical skills and five Claude wrappers passed the skill-creator Python frontmatter validator. Both portable/private Codex TOML files parsed without printing their contents. Git hook scripts passed Git Bash syntax checks, and the actual post-merge script executed successfully.
- A complete clean source snapshot (no copied private config, `.env.local`, credentials or `node_modules`) passed a frozen dependency installation, production build with synthetic public configuration, and all eight smoke cases on Edge in 22.7 seconds. Dependency lifecycle scripts were disabled for this isolated installation; application prebuild ran normally. The normal workspace fixture build/smoke also passed all eight cases.
- The shared smoke fixture is JSON so the native Node ESM build launcher and Playwright's TypeScript/CommonJS config loader can consume it without importing CLI-only `import.meta` code.
- Frozen installation and the complete `pnpm verify` gate passed locally: 1,000 unit tests, 26 agent tests, lint, strict types and 102 generated pages. Final rerun evidence and browser results are recorded in the local handoff report.

## Remaining limits

### Publication follow-up: checksum-safe Git checkout

A later full unit run in a real clean Git clone exposed a Windows checkout issue that the earlier build/smoke probes did not exercise. With `core.autocrlf=true`, Git changed the final LF of `history-world-land.geojson` to CRLF. The existing integrity test failed: the original working file and committed blob have 1,257,963 bytes / SHA-256 `d2a0f8661ec662ba9bdd45072b2800a2c917102d2291a6d93a1401a2479a28cb`; the clone had 1,257,964 bytes / SHA-256 `953cff0e5efc4a3808ab98718c2cb9891967ea982f49f292c923adacfda91973`.

The publication fix adds `*.geojson text eol=lf` to shared Git attributes. Geometry, provenance hashes and integrity tests remain unchanged. The failing clean-clone test is the negative control; fresh verification and a new checkout of the corrected commit must establish the green handoff before publication. The earlier clean-snapshot build/smoke evidence does not claim that this full unit gate had passed in that earlier snapshot.

Claude Code is not installed on the audited machine, and the Antigravity app was not driven through a live model session. Adapters were verified against official documentation and executed directly, not claimed to be activated inside those apps. Each contributor must review/trust the workspace/hooks and verify the loaded rule/skill/tool catalog. No extra AI session was launched for testing.

Public smoke checks do not verify authenticated workflows, historical source quality, payment handling or live RLS. The full legacy integration suite was intentionally not run against the owner's live environment. GitHub Actions was edited and checked locally, not executed remotely. No push, PR, deploy, service write or global configuration upgrade was performed.

The Playwright Chromium download timed out repeatedly on the audited Windows connection. Local browser evidence therefore uses installed Edge; the workflow still installs Chromium on GitHub's Linux runner. No claim is made that this remote workflow or the unavailable local Chromium binary was executed. The initial fully offline dependency attempt lacked a cached payOS tarball; a normal frozen installation with registry access succeeded without changing the lockfile.

Primary references checked on the audit date: [Codex hooks](https://learn.chatgpt.com/docs/hooks), [Claude hooks](https://code.claude.com/docs/en/hooks), [Claude skills](https://code.claude.com/docs/en/skills), [Claude shared instructions](https://code.claude.com/docs/en/memory), [Antigravity rules](https://www.antigravity.google/docs/rules/), [Antigravity hooks](https://www.antigravity.google/docs/hooks/), and [CodeGraph](https://github.com/colbymchenry/codegraph). These supplement direct inspection/tests of the installed versions; they do not establish each user's account access.
