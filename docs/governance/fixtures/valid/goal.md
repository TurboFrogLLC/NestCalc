# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Governance Fixture Goal",
  "agent_roster": {
    "orchestrator": "Grok Build",
    "read_only_agents": [
      {
        "lane": "contract-review",
        "observed_model": "gpt-5.6-sol",
        "requested_model": "gpt-5.6-sol",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "scripts/governance-fixture",
  "execution_route": "grok-build",
  "flow_id": "NC-20260712-a1b2c3d4",
  "goal_memory_commit": "1111111111111111111111111111111111111111",
  "goal_sha256": "sha256:52424611491155f1d02ea6fa51551bc84bd4479b5c094d9735a6c344db159d55",
  "protected_surfaces": [
    "calculator math",
    "Clerk auth",
    "PWA behavior"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "security-audit"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Governance Fixture Goal

### Objective

Prove deterministic governance validation.

### Scope

Fixture-only behavior.

### Protected Surfaces

Product source and secrets remain unchanged.

### Verification

Run the governance unit tests.

### Stopping Condition

The fixture validates.
