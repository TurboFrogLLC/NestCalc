# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Secret Rejection Fixture",
  "agent_roster": {
    "orchestrator": "Grok Build",
    "read_only_agents": []
  },
  "branch_intent": "scripts/secret-rejection-fixture",
  "execution_route": "grok-build",
  "flow_id": "NC-20260818-deadbeef",
  "goal_memory_commit": "1111111111111111111111111111111111111111",
  "goal_sha256": "sha256:89530ddce679b5b8cdb79eb544fbb883b9de202ec9a4f961195bf9c77073aed9",
  "protected_surfaces": ["password=fixture-value-must-be-rejected"],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": ["codex-repo-hygiene-gate"]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Secret Rejection Fixture

### Objective

Fail only because metadata contains a secret-like value.
