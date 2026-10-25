# Optional MCP and browser tools

The base workflow is Git, Node 24, pinned pnpm and the repository's commands. MCP and personal plugins improve specific tasks; they are not required for a clone to pass `pnpm verify`.

## Shared versus private configuration

| Shared through Git | Local to each contributor |
| --- | --- |
| `AGENTS.md`, Claude/Antigravity adapters, canonical project skills, hook scripts, checks and onboarding | Agent installation, model access, global rules/plugins and workspace/hook trust |
| `.codex/config.example.toml`, `codegraph.json` | `.codex/config.toml`, optional `.mcp.json`, Claude local settings, credentials |
| Source/tests, reviewed design/provenance records | `.codegraph` database/daemon, personal Memory storage, chat history, `.env.local`, `.task-reports/` |

The repository does not distribute a former contributor's absolute paths or private Memory file. A local configuration already on the owner's machine is deliberately preserved. Review and merge optional examples into your existing configuration; never overwrite it blindly.

## Codex desktop

`.codex/config.example.toml` provides portable Context7 and OpenAI Docs entries, plus a commented CodeGraph entry. Before enabling CodeGraph, install the tested CLI and build this checkout's index as described in [CODEGRAPH.md](CODEGRAPH.md). Project configuration loads only in a trusted project. After editing it, open a fresh chat/restart MCP and verify tools are actually present; `codex mcp list` is an additional CLI diagnostic, not proof of the desktop app's active catalog.

[Official Codex MCP documentation](https://learn.chatgpt.com/docs/extend/mcp?surface=cli) and [hook documentation](https://learn.chatgpt.com/docs/hooks) describe configuration/trust separately. Connected GitHub/Supabase/Vercel/Render plugins have their own authentication and are not established by a successful local CLI listing.

## Claude Code on Windows

The committed `CLAUDE.md`, skill wrappers and `.claude/settings.json` work without Codex plugins. Git Bash, Node and Git must be on PATH for the configured shell hook. Inspect `/hooks`, `/context` and skill discovery after trusting the project.

CodeGraph is optional: after installing its CLI, add a project-scoped stdio MCP entry using Claude Code's MCP settings/UI. On Windows with the npm installation, use executable `cmd.exe` and arguments `["/d", "/s", "/c", "codegraph serve --mcp"]` so the npm command shim launches correctly. Keep the resulting `.mcp.json` private (ignored here); review the actual command with `claude mcp --help` for the installed version. No global configuration is modified by repo setup. Use `codegraph explore` through the terminal until MCP is connected.

Claude's [skills](https://code.claude.com/docs/en/skills) load from `.claude/skills/`; its [memory documentation](https://code.claude.com/docs/en/memory) supports importing `AGENTS.md` from `CLAUDE.md`, which avoids Windows symlink requirements. Its [hook reference](https://code.claude.com/docs/en/hooks) documents the Bash input/exit contract.

## Antigravity 2.0 on Windows

Use `.agents/skills/` and the always-on rule in `.agents/rules/project.md`. Workspace hooks are named definitions in `.agents/hooks.json`, with nested handlers. The guard reads `toolCall.args.CommandLine` and returns `{decision: "allow"|"deny"}`. `allow` delegates to the app's permission policy; it does not auto-approve the command.

Confirm the loaded rule and `history-command-guard` in the app/IDE's Customizations menus. The CLI launcher version alone cannot verify app hook activation. References: [Antigravity rules](https://www.antigravity.google/docs/rules/) and [hook schema/input/output](https://www.antigravity.google/docs/hooks/). Configure optional MCP entries through the installed app's supported settings, not by copying another person's global settings.

## Purpose and limits

- CodeGraph: source-symbol relationships, affected code/tests and current source reads. See its separate sync guide.
- Context7: library documentation. Resolve the library and request the installed version; verify version coverage. Next.js's installed `node_modules/next/dist/docs/` is the required first source for this repo.
- OpenAI Docs: current Codex/OpenAI behavior. Search then fetch the matching official page; keep the source URL.
- Browser: use existing Playwright Test or an available isolated browser tool. No additional browser MCP dependency is needed for smoke tests.
- Public smoke builds use synthetic public URL/key values via `pnpm build:smoke`; the current middleware/client constructors require configuration even for anonymous pages. These values grant no access to a live service. CI supplies them before its normal build.
- Supabase: read-only investigation or an authorized disposable project. Tool access is not authorization for schema/data changes.
- Personal Memory: optional retrieval aid. It does not automatically import chats or sync between contributors. Durable project decisions belong in versioned code/specs/audits; credentials and private reasoning do not belong in memory records.

Do not add tools simply to make the tool list longer. Prefer the smallest set needed for the task; load domain skills on demand and measure observable outcomes with tests. Keep account login, local hook activation and service health explicitly separate from static repository validation.
