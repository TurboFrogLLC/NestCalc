# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Hash Mismatch Fixture",
  "agent_roster": {
    "orchestrator": "Grok Build",
    "read_only_agents": []
  },
  "branch_intent": "scripts/hash-mismatch-fixture",
  "execution_route": "grok-build",
  "flow_id": "NC-20260818-bad0cafe",
  "goal_memory_commit": "1111111111111111111111111111111111111111",
  "goal_sha256": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "protected_surfaces": ["product source"],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": ["codex-repo-hygiene-gate"]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Hash Mismatch Fixture

### Objective

Fail only because the declared canonical goal hash is wrong.
