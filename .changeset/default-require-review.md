---
"opencode-workflow-guard": minor
---

Enforce secondary review approval (`requireReview: true`) by default during PR creation (`gh pr create` and `az repos pr create`). Before a pull request can be created, a secondary review subagent must evaluate the changes with `guard_review_rubric` and record approval using `record_review`. Projects can opt out via `.opencode/workflow-guard.json` (`{ "requireReview": false }`) or environment variable `WORKFLOW_GUARD_REQUIRE_REVIEW=0`.
