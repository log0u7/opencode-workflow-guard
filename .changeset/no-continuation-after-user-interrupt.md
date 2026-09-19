---
"opencode-workflow-guard": patch
---

User-initiated interrupts (Esc) no longer trigger automatic continuation: the guard marks the session interrupted on MessageAbortedError (session.error or the aborted assistant message) and resumes its no-silent-early-exit behavior only after genuine user input, mirroring the ralph user_stopped semantics.
