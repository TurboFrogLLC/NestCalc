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
        "requested_model": "gpt-5.6-terra",
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

Record flagged decisions with reason, decision, and consequence.
Read-only evidence lanes record requested vs observed model honestly;
record unavailable or mismatched routing honestly.

The JSON `execution_route` / `branch_intent` pins below the fence are leftover
machine encoding. Name the real Surface in the traveler. Schema rewrite is a
later pass.

### Traveler / sidecar / preflight

- Traveler: `docs/templates/handoff.md`.
- After goal-memory commit, when a sidecar is required:
  `python3 scripts/nestcalc-governance.py create-handoff` (prompt hash only).
- Named Surface MUST re-validate goal + traveler bindings before first
  implementation edit.
- Host-first for Playwright, git/gh network, and npm.

### Stopping Condition

State the complete and blocked terminal conditions. Stop before goal commit and
traveler/sidecar generation unless wReckless or the named handoff asks.
