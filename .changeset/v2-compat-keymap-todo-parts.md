---
"opencode-workflow-guard": patch
---

Fix V2 runtime compatibility: register the TUI companion's keymap layer from an app-slot render instead of plugin setup (`ctx.keymap.layer` resolves only inside the TUI's provider render tree; setup crashed with "Keymap.Provider is missing" on opencode v2.0.10), read the V2 `tool` field (with `name` fallback) when reconstructing todos and tool outcomes from message parts, and stop treating numeric SQL/awk comparison operands (`WHERE count > 5`, `n >= 10`) as shell file redirects.
