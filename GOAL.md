# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Repository Quiet State - No Active Product Objective",
  "agent_roster": {
    "orchestrator": "Codex App",
    "read_only_agents": []
  },
  "branch_intent": "docs/quiet-goal-post-pr82",
  "execution_route": "codex-app",
  "flow_id": "NC-20260820-a20c0de8",
  "goal_memory_commit": "e31838db9ccc5373336a224b1ec4c00f992bc7c8",
  "goal_sha256": "sha256:8234f00ec5d07087e6af12dd4f31184ce050b8c1f1baf48c3608857bdcec8f23",
  "protected_surfaces": [
    "Calculator math and nesting behavior.",
    "Calculator UI layout and input behavior.",
    "Clerk auth and request-access policy.",
    "PWA runtime behavior.",
    "FLiPIT identity.",
    "V3 HTML + SPEC under docs/howmany-v3-components/.",
    "AGENTS.md, docs/GLOSSARY.md, docs/WORKFLOW.md, and docs/governance/**."
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": []
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Repository Quiet State - No Active Product Objective

### Objective

Record that the completed Employee-manual Mermaid reconstruction probe is
archived and that no product objective is active.

### Scope / Allowed Files

- `GOAL.md`
- `docs/goals/GOAL-TRACE-INDEX.md`
- `docs/goals/history/NC-20260820-a20c0de8-employee-manual-mermaid-reconstruction-probe.md`

This quiet state authorizes goal-memory maintenance only. It does not authorize
product, law, governance-contract, or preserved-untracked-path changes.

### Protected Surfaces

- Calculator math and nesting behavior.
- Calculator UI layout and input behavior.
- Clerk auth and request-access policy.
- PWA runtime behavior.
- FLiPIT identity.
- V3 HTML + SPEC under `docs/howmany-v3-components/`.
- `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, and `docs/governance/**`.
- Owner-preserved untracked paths: `docs/architecture/nestcalc-ui-redesign-package*`,
  `e2e/full-surface-audit.authenticated.spec.ts`, and `output/`.

### Required Proof

The v1 metadata validates with one Active Goal and a matching canonical hash.
The archived probe records its Flow-ID, GOAL-SHA, implementation and merge
commits, outcome, proof, and residual risk. The trace index has no Active row.

### Decision Record

```text
PR #80 merged as adc1862277b98107a0893c2165076647b6871588 and the probe GOAL has Flow-ID NC-20260820-a20c0de8 and GOAL-SHA sha256:5b4541ad4d80566fbba941524206593659b24f53fa17722177899d7f7cfe7d07 -> completion evidence supports archival -> replace the completed probe with a quiet goal and preserve its trace -> no new product objective is authorized.
```

No skill execution is required for this quiet-state freeze.

### Traveler / sidecar

- Traveler: `docs/templates/traveler.md`. This Freeze archives the completed
  probe, validates the quiet goal, commits it, and pushes it to the existing
  draft PR branch.
- No sidecar is required.
- No `/goal` invocation is required.

### Stopping Condition

Complete when this valid quiet `GOAL.md`, the completed-probe archive, and the
trace index are committed and pushed to `origin/docs/quiet-goal-post-pr82`.
Do not start a product goal or merge PR #85.
