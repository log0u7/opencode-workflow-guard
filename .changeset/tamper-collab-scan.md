---
"opencode-workflow-guard": patch
---

Settings-tamper scan no longer blocks collaboration commands (`gh`/`glab` issue|pr, `az repos pr`) or document content mentioning guarded paths; the redirect heuristic is shell-only.
