---
"opencode-workflow-guard": patch
---

Fix a V2 todo-gate deadlock: OpenCode V2 has no builtin `todowrite` tool, so sessions driven by builtin tools could never satisfy the Policy 1 active-todo gate and every `edit`/`write` was blocked forever. Todo reconstruction now distinguishes "no todo capability" (history contains no `todowrite` part → unknown → the gate is skipped) from "definitively empty" (a `todowrite` part exists and reports no active todos → still enforced), and the parent-chain walk continues past unknown links so a subagent still attributes mutations to a parent that owns the todo list. V1 behavior is unchanged: a real empty list still blocks, and API read failures still fail open. Fixes #148.
