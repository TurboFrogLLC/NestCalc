# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Governance Fixture Goal",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "contract-review",
        "observed_model": "gpt-5.6-terra",
        "requested_model": "gpt-5.6-terra",
        "status": "matched"
      }
    ]
  },
  "branch_intent": "codex/governance-fixture",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260712-a1b2c3d4",
  "goal_memory_commit": "1111111111111111111111111111111111111111",
  "goal_sha256": "sha256:16a76588578166e665b743dc40e6e93b5653ab41bb17d10e7d3c180a0cb57fa7",
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
