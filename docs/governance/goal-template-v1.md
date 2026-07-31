<!-- This template is copied to GOAL.md for post-bootstrap goals. -->
# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "REPLACE WITH ONE ACTIVE GOAL",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "replace-with-bounded-lane",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/replace-with-feature-branch",
  "execution_route": "codex-cli",
  "flow_id": "NC-YYYYMMDD-00000000",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:0000000000000000000000000000000000000000000000000000000000000000",
  "protected_surfaces": [
    "calculator math and nesting behavior",
    "calculator UI layout and input behavior",
    "Clerk auth and request-access policy",
    "PWA runtime behavior"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: REPLACE WITH ONE ACTIVE GOAL

### Objective

State one measurable objective.

### Scope / Allowed Files

Name allowed files (edit authority) and required outcomes.

### Protected Surfaces

Name every surface that must not change.

### Required Proof

List exact required commands and proof. Every required proof title MUST be
fixable inside Allowed Files edit authority, or apply Path A (narrow proof /
residual debt) or Path B (expand Allowed Files in this freeze). No third path.

### Grilling Decision Record

Use `nestcalc-goal-grilling`:

```text
evidence → confidence → decision → residual risk / flagged decisions
```

Record flagged decisions with reason, decision, and CLI consequence.

### B3-Style Handoff / B4-Style Preflight

- After goal-memory commit: create execution handoff via
  `python3 scripts/nestcalc-governance.py create-handoff` (prompt hash only).
- CLI MUST re-validate goal + handoff + branch before first implementation edit.
- Host-first for Playwright, git/gh network, and `npm ci`.

### Stopping Condition

State the complete and blocked terminal conditions. Stop before goal commit and
CLI prompt generation unless the human asks.
