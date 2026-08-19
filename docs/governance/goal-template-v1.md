<!-- This template is copied to GOAL.md for post-bootstrap goals. -->
# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "REPLACE WITH ONE ACTIVE GOAL",
  "agent_roster": {
    "orchestrator": "REPLACE WITH NAMED SURFACE",
    "read_only_agents": [
      {
        "lane": "replace-with-bounded-lane",
        "observed_model": null,
        "requested_model": "replace-with-requested-model",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "replace-with-scope/replace-with-feature-branch",
  "execution_route": "REPLACE WITH NAMED ROUTE",
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

Name land-stamp outcomes. Do not put runnable host command fences here.
The host suite lives in `docs/WORKFLOW.md` Proof. Every named outcome MUST be
fixable inside Allowed Files, or apply Path A (narrow proof / residual debt)
or Path B (expand Allowed Files in this freeze). No third path.

### Grilling Decision Record

```text
evidence → confidence → decision → residual risk / flagged decisions
```

Record flagged decisions with reason, decision, and consequence.
Read-only evidence lanes record requested vs observed model honestly;
record unavailable or mismatched routing honestly.

The JSON `execution_route`, `branch_intent`, orchestrator, and model values must
record the real bounded route without inventing a Codex-only pin. A false
`matched` model claim fails closed.

### Traveler / sidecar

- Traveler: `docs/templates/handoff.md`. Thin. This station only.
- Sidecar is optional. Do not require it to continue.
- Do not write start-check or the land suite into the traveler Instruction.
- `/goal` is a tooling call. Name it on the freeze traveler only if the next
  station must invoke it. The executor does not add `/goal` after the fact.

### Stopping Condition

State the complete and blocked terminal conditions for this freeze station.
Do not implement from this freeze unless the traveler names that operation.
