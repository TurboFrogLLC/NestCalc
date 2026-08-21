# GOAL form

Copy this file to `GOAL.md`. Replace every `<angle>` placeholder.
Do not paste procedure from other files. Point.

Hash recipe: `docs/governance/README.md` (Goal canonicalization).
Freeze stamp: `docs/WORKFLOW.md` ## Goal → ### Freeze.
Memory: `docs/WORKFLOW.md` ## Goal → ### Memory files.
Operation spine: `docs/WORKFLOW.md` ## Start.
Traveler form: `docs/templates/traveler.md`.
Tool: the-Feeler. Parent is the Operator on the traveler. Same class as `/goal`.

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "<one title, must match the heading below>",
  "agent_roster": {
    "orchestrator": "<Codex App | Codex CLI | Grok Build>",
    "read_only_agents": []
  },
  "branch_intent": "<branch name>",
  "execution_route": "<codex-app | codex-cli | grok-build>",
  "flow_id": "<NC-YYYYMMDD-xxxxxxxx>",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:<canonical>",
  "protected_surfaces": [
    "<surface>"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": []
}
```
<!-- nestcalc-governance:end -->

## Active Goal: <one title, must match metadata>

### Objective

<what this goal is, one objective>

### Scope / Allowed Files

- `GOAL.md`
- `<path>`

### Protected Surfaces

- Calculator math and nesting behavior.
- Calculator UI layout and input behavior.
- Clerk auth and request-access policy.
- PWA runtime behavior.
- `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, and `docs/governance/**`.
- <extra, or delete this line>

### Required Proof

Point at `docs/WORKFLOW.md` ## Proof. Name only extra proof this goal needs.

### Traveler

`docs/templates/traveler.md`. Instruction is this operation only.
After Freeze, emit the next traveler.

### Stopping Condition

<when this goal is done>
