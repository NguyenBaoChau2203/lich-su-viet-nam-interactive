# CodeGraph: scope, freshness and recovery

Tested CLI: `@colbymchenry/codegraph@1.6.0`, native Windows, Node 24, on 2026-10-25. The repository does not auto-upgrade the user's global installation. [Upstream documentation](https://github.com/colbymchenry/codegraph#configuration) explains project configuration; its claims about automatic freshness require an active server/watcher and a matching scope.

## Commands

```powershell
pnpm agent:status
pnpm agent:sync
pnpm agent:index
codegraph explore "scripts/agent/validate-setup.mjs"
```

- `agent:status`: read health as JSON; reject wrong checkout/worktree, pending changes, incomplete index, unresolved references and extraction-version mismatch. It does not start a watcher.
- `agent:sync`: reconcile an existing local database and then check health. It does not rebuild/create an index silently.
- `agent:index`: explicitly initialize a fresh checkout with `codegraph init --yes`, or rebuild an existing database with `codegraph index --quiet`, then check health. It does not invoke `codegraph install` or change global agent configuration. On filesystems where CodeGraph offers fallback Git hooks, the CLI's defaults may add its local hook snippet; inspect existing hooks and prefer the repo's explicit setup.
- Git post-commit/post-checkout/post-merge hooks: sync an existing database after Git changes. Enable them once per clone with `pnpm agent:setup`. They print a warning if CodeGraph is absent/fails and do not reject the successful Git operation. They do not observe every editor save or guarantee freshness after rebase/squash; run the explicit sync at task boundaries.

Install the optional CLI using `npm install -g @colbymchenry/codegraph@1.6.0`, reopen the terminal, and run `pnpm agent:index`. The `.codegraph/` directory itself is not proof of a database: Git shares only its `.gitignore`. Never commit the database, locks, logs or daemon PID. A new clone/worktree builds its own index; do not copy another checkout's SQLite files.

If a command fails or the index is absent, use targeted `rg`/file reads and report the limit. Optional local intelligence must not prevent application development or CI. Run sync after editing supported source and before querying relationships; avoid a costly rebuild after every edit.

## Why a change may not appear

| Symptom | Verified mechanism / next check |
| --- | --- |
| Updated Markdown, JSON/GeoJSON, SQL or Word cannot be found as symbols | The installed 1.6.0 source-extension table does not index these ordinary project files. Read them directly; do not repeatedly rebuild or pretend their contents are synchronized. `openai.yaml` may be indexed as YAML, but this does not mean the adjacent `SKILL.md` was indexed. |
| CLI works, but automatic updates stop | The CLI and MCP connection are separate. Auto-watch belongs to a running MCP/server. Inspect the active tool catalog, current app's MCP status and actual process; a daemon PID/log file can be stale. Connect/restart MCP if wanted; explicit sync remains available. |
| Recently saved code is missing briefly | Watcher sync is debounced and can be delayed during bulk changes/locking. Check `agent:status`, then `agent:sync`; do not interpret a live-source snippet as proof its relationship graph was refreshed. |
| Unexpected report helpers dominate results | The index scans supported untracked source too, subject to ignores. `codegraph.json` excludes `outputs/`, `output/`, review renders and local reports without deleting or hiding owner files from Git. Sync reconciles scope changes and removes excluded records. |
| New machine or branch seems unrelated | Confirm `projectPath`, worktree mismatch, initialized database and active MCP root. A global MCP installation or Git-tracked `.codegraph/.gitignore` is insufficient. |
| Partial or upgraded index | Inspect `index.state`, `pendingRefs`, `reindexRecommended`; retry sync for unresolved references, rebuild for incomplete/extraction-stale indexes. CLI exit 0 alone is not a health gate. |
| Locked index / WSL / disabled watch | Check the process holding the database before recovery. Upstream can disable native watching on WSL `/mnt/*`; `CODEGRAPH_NO_WATCH` also disables it. These are documented possible causes, not established causes of every past failure. Do not remove locks while another indexer is active. |

The initial 2026-10-25 investigation found a complete index with zero pending source changes, a non-live stored daemon PID, no CodeGraph MCP tools in the active Codex chat, no Git sync hooks, and unrelated output scripts indexed. Those facts explain specific weaknesses; they do not prove every earlier missed update had the same cause. See [the audit](../audits/2026-10-25-agent-workflow-audit.md) for evidence and limits.

## What “healthy” establishes

Healthy means the current scanner's supported source scope has no pending changes and the index reports complete/resolved extraction. It does not establish the correctness of every edge, historical verification, document coverage, remote database state, another person's memory, or that a watcher is active. The wrappers and doctor deliberately state this boundary.
