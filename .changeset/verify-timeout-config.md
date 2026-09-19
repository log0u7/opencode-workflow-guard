---
"opencode-workflow-guard": patch
---

Verification timeout is configurable: set `verifyTimeoutMs` in the project config or `WORKFLOW_GUARD_VERIFY_TIMEOUT_MS` in the environment (env wins) to raise the 30-second default for suites that legitimately exceed it.
