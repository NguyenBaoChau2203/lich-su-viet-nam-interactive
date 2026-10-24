# Local MCP and Browser Tooling

This workspace has a machine-local Codex MCP configuration in `.codex/config.toml`. It is excluded by `.git/info/exclude` because it contains absolute paths for this Windows installation. The configuration supplements the existing user configuration; it does not replace the app's internal servers or connected service plugins.

## Configured tools

| Tool | Installation or endpoint | Verified on 2026-10-23 |
| --- | --- | --- |
| Memory | `@modelcontextprotocol/server-memory@2.0.0`, isolated user tool directory | Initialization, nine tools, entity persistence across server processes, retrieval, deletion |
| Context7 | `https://mcp.context7.com/mcp` | Anonymous initialization, library resolution, documentation query |
| OpenAI Docs | `https://developers.openai.com/mcp` | Initialization, documentation search and page fetch |
| Playwright CLI | User npm installation, `@playwright/cli@0.1.22` | Isolated headless Chrome navigation, accessibility snapshot, click, updated snapshot |
| Chrome DevTools CLI | Existing user npm installation, version `1.9.0` | Isolated headless Chrome navigation, accessibility snapshot, click, updated snapshot |

The browser tools are used through their CLIs. They are not additional MCP entries in the Codex configuration. Existing user Playwright skills remain available.

## Load the configuration

The project must be trusted for Codex to load project configuration; this workspace was already trusted during setup. Open a fresh Codex chat in this workspace, or use the application's MCP restart control. A configuration edit does not add tools to an already running chat's tool catalog.

Inspect the local listing with:

```powershell
codex mcp list
```

Expect `memory`, `context7`, and `openaiDeveloperDocs` to be enabled alongside existing internal entries. Context7 may report `not_logged_in` when there is no stored OAuth credential; anonymous tool calls succeeded during setup. Authentication and usage limits can change independently of installation.

Official setup reference: https://learn.chatgpt.com/docs/extend/mcp?surface=cli

## Use each tool for its purpose

Use Context7 for library documentation, resolve the library first, and request the installed version. The connectivity probe used `/vercel/next.js` and returned current upstream documentation; it does not prove that every installed version is indexed. The project's local Next.js documentation in `node_modules/next/dist/docs/` remains the required first source for its installed Next.js version.

Use OpenAI Docs for current OpenAI and Codex documentation. Search for the relevant topic, fetch the matching page, and retain its source URL.

Use Memory only as a retrieval aid for durable, verified project context. Include a source path or URL and observation date in useful observations. Current owner instructions, `AGENTS.md`, approved specifications, and verified project sources retain their existing authority. Do not store credentials, personal data, unsupported historical claims, temporary assumptions, or private reasoning traces. Store implementation outcomes and evidence instead.

Memory storage is deliberately outside the repository:

```text
C:/Users/chau1/.codex/memory/lich-su-viet-nam-interactive.jsonl
```

This file was empty after synthetic verification data was deleted. There is no automatic import of earlier chats or background learning. Retrieval and updates require tool calls.

## Installed local paths

```text
Project MCP configuration:
D:/lich-su-viet-nam-interactive/.codex/config.toml

Pinned Memory package and verification SDK:
C:/Users/chau1/.codex/tools/history-mcp/

Verification runner:
C:/Users/chau1/.codex/tools/history-mcp/verify-mcp.mjs
```

The isolated tool directory pins `@modelcontextprotocol/server-memory@2.0.0` and `@modelcontextprotocol/sdk@1.32.1` and has its own npm lockfile. Node.js 24 or newer is required by this Memory release. The setup does not add dependencies to the application package.

Rerun protocol checks with:

```powershell
node C:/Users/chau1/.codex/tools/history-mcp/verify-mcp.mjs
```

The runner uses synthetic Memory data, reopens the server to test persistence, and removes that data. Its HTTP checks send public documentation queries without a credential. It reports JSON results and returns a nonzero exit code on failure.

## Browser verification

Use a named, nonpersistent session to keep verification separate from personal browsing:

```powershell
playwright-cli -s=history-check open https://example.com --browser chrome
playwright-cli -s=history-check snapshot
playwright-cli -s=history-check close
```

Read a fresh snapshot before clicking an element reference. Close only the session created for the task.

For console, network, or performance inspection, the existing Chrome DevTools CLI can start an isolated browser:

```powershell
chrome-devtools start --headless --isolated --usageStatistics=false --performanceCrux=false --redactNetworkHeaders=true
chrome-devtools list_pages
```

Run `chrome-devtools stop` only when the task owns the daemon. The installation check started and stopped its own daemon; none was running before or after the check.

Primary browser documentation:

- https://github.com/microsoft/playwright-cli
- https://github.com/ChromeDevTools/chrome-devtools-mcp

## Existing project foundation

The project already had five project skills, safety hooks, a CodeGraph index, Playwright Test, and the Supabase CLI. `pnpm agent:doctor` confirmed Node.js, pnpm, Git, Codex, Antigravity launcher, OpenCode, CodeGraph, and Chrome DevTools CLI were callable. These launcher checks do not test account authentication or run additional AI agents.

Cursor already configured CodeGraph MCP in its user configuration. OpenCode already configured Chrome DevTools MCP locally. This setup leaves those clients unchanged and adds the three new MCP entries to Codex for this project only.

Connected GitHub, Supabase, Vercel, and Render tools exposed by plugins are separate from the local Codex MCP listing. A local MCP listing alone cannot establish those plugins' cloud authentication or service health.

## Maintenance and boundaries

When moving machines or directories, update the absolute paths in `.codex/config.toml`; reinstall the pinned tool packages if needed. Keep authentication values out of repository files. This setup did not require a new API key or OAuth login.

Only Memory was selected from `modelcontextprotocol/servers`. Filesystem, Git, Fetch, Time, Everything, and Sequential Thinking were not installed because the approved assessment did not identify a current need for them. Archived reference servers were not installed.

The setup report and raw local verification evidence are in `.task-reports/`. `pnpm verify` passed during setup; its current script does not include `pnpm test:e2e`. The browser smoke checks establish tool operation, not coverage of the application's complete user journeys.
