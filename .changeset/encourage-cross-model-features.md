---
"opencode-workflow-guard": minor
---

Encourage open models, Gemini, and Claude to actively utilize Workflow Guard features:
- Injects operational workflow tool guidance via `experimental.chat.system.transform` so models discover and actively use planning, review, memory, learning, and isolation tools.
- Enriches `task` tool definitions via `tool.definition` with subagent isolation (`guard_worktree_create`) and secondary review guidance (`guard_review_rubric`).
- Adds proactive action triggers to custom tools (`guard_next_tasks`, `guard_status`, `project_memory_*`, `learning_*`, `guard_review_*`, `guard_worktree_*`).
- Emits actionable `recommendedActions` in `guard_status` directing models to the next required verification or review step.
- Reinforces `guard_status` and `guard_review_rubric` guidance in synthetic session continuation prompts and circuit breaker block feedback.
