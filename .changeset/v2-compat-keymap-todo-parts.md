---
"opencode-workflow-guard": patch
---

Fix V2 runtime compatibility: register the TUI companion's keymap layer from an app-slot render instead of plugin setup (`ctx.keymap.layer` resolves only inside the TUI's provider render tree; setup crashed with "Keymap.Provider is missing" on opencode v2.0.10), read the V2 `tool` field (with `name` fallback) when reconstructing todos and tool outcomes from message parts, and stop treating numeric SQL/awk comparison operands (`WHERE count > 5`, `n >= 10`) as shell file redirects.

Backwards compatible: the OpenCode 1.x server and TUI entrypoints are byte-identical, no config schema changes, and the dual default export is retained (patch bump). The only semantic change is the redirect relaxation above; real redirects (`> src/a.ts`, `>>`, fd forms, `/dev/null`) are unchanged.
