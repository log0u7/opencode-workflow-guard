---
"opencode-workflow-guard": minor
---

Add OpenCode V2 support through the `@opencode/plugin` API. The package now ships both entrypoints from one default export: OpenCode 1.x keeps loading `server()`, and OpenCode 2.x loads `setup(ctx)`, which registers the same policies through V2 domains (`ctx.tool.hook`/`transform`, `ctx.session.hook`, `ctx.permission.hook`, `ctx.shell.hook`, and `ctx.event.subscribe`). The TUI companion gains a V2 CLI-plugin implementation (`ctx.keymap.layer`, `ctx.ui.slot`) alongside the V1 `tui()` export.

V2 notes:
- V2 has no todo endpoint, so the current todo list is reconstructed from the newest `todowrite` tool call in the session message history; enforcement semantics are unchanged.
- Builtin tool description enrichment (todowrite/edit/subagent notes) is best-effort under V2: builtin tools are not visible to the plugin tool editor during setup, so the notes may not appear until a later registration phase.
- V1's `command.executed` audit event has no V2 stream counterpart and is dropped (observability-only); permission journaling uses the V2 `permission.asked`/`permission.replied` events.
