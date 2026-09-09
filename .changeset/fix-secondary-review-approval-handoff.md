---
"opencode-workflow-guard": patch
---

Fix secondary review approval handoff and durable review persistence:
- Adds durable review approval disk caching (`last-review.json`) so passing secondary reviews persist across session restarts and multi-agent handoffs.
- Implements active repository resolution for `guard_status`, `guard_review_rubric`, and `record_review` so secondary reviewer subagents automatically inherit their parent session's active repository rather than failing against the host filesystem root.
- Adds worktree/git-common-dir compatibility (`isSameGitRepo`) so reviews recorded in isolated worktrees satisfy the main repository gates.
- Filters out negative/empty statements in `extractReviewFollowups` (e.g. `P2: None`, `P3: 0`, `P2: N/A`, `P2: No issues`) to prevent recording bogus open technical debt items.
- Fixes synthetic session continuation `messageID` prefix in `continuation.ts` to `msg_wg_` to conform to OpenCode's message ID schema.
