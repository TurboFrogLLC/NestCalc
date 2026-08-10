# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Model Mismatch Fixture",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "contract-review",
        "observed_model": "some-other-model",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/model-mismatch-fixture",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260712-bad0cafe",
  "goal_memory_commit": "1111111111111111111111111111111111111111",
  "goal_sha256": "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "protected_surfaces": ["product source"],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": ["security-audit"]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Model Mismatch Fixture

### Objective

This fixture must fail because mismatched evidence claims a match.
