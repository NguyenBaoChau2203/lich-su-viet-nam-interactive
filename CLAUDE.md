@AGENTS.md

## Claude Code adapter

Shared project skills are maintained in `.agents/skills/`. The five small wrappers in `.claude/skills/` route to those canonical instructions; read the matching canonical skill before executing its workflow.

Use one main agent for the entire task, including self-review. Do not invoke Agent/Task/subagents or a separate AI process. Read `docs/agent/START-HERE.md` for setup and `docs/agent/CURRENT-STATE.md` for the existing implementation. Personal memory and plugins are not shared project state.
