---
"opencode-workflow-guard": patch
---

Allow tag publish flows: `git tag <name>` creation no longer counts as a protected-branch mutation, and tag push refspecs (`git push origin v1.2.0`, `git push origin refs/tags/v1.2.0`) are exempt from the protected-branch and merged-branch push rules. Tag deletions (`git tag -d`, `git push origin :refs/tags/v1.2.0`, `--delete`) remain blocked. Fixes #134.
