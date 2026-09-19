---
"opencode-workflow-guard": minor
---

Add OpenCode V2 support through the `@opencode/plugin` API. The package now ships both entrypoints from one default export: OpenCode 1.x keeps loading `server()`, and OpenCode 2.x loads `setup(ctx)`, which registers the same policies through V2 domains (`ctx.tool.hook`/`transform`, `ctx.session.hook`, `ctx.permission.hook`, `ctx.shell.hook`, and `ctx.event.subscribe`). The TUI companion gains a V2 CLI-plugin implementation (`ctx.keymap.layer`, `ctx.ui.slot`) alongside the V1 `tui()` export. Enforcement behavior is unchanged on both generations.
