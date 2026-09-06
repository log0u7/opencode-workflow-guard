---
"opencode-workflow-guard": patch
---

Prevent false-positive shell file mutation blocks when mutation keywords appear in arguments to read-only inspection commands (`grep`, `strings`, `git log`), and make circuit breaker failure tracking escalate across consecutive diverse failures in a session.
