# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Repository Quiet State - No Active Product Objective",
  "agent_roster": {
    "orchestrator": "Codex CLI",
    "read_only_agents": []
  },
  "branch_intent": "docs/quiet-goal-post-pr90",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260821-dd0feb4d",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:24548d32890b33b5a1f1dd9723dc97d3582ad718938441495d0cc38ac947c3aa",
  "protected_surfaces": [
    "Calculator math and nesting behavior.",
    "Calculator UI layout and input behavior.",
    "Clerk auth and request-access policy.",
    "PWA runtime behavior.",
    "FLiPIT identity.",
    "V3 HTML + SPEC under docs/howmany-v3-components/.",
    "AGENTS.md, docs/GLOSSARY.md, docs/WORKFLOW.md, docs/templates/, and docs/governance/**.",
    "Owner-preserved untracked paths: docs/architecture/nestcalc-ui-redesign-package*, e2e/full-surface-audit.authenticated.spec.ts, and output/."
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

Record that the completed Employee-manual Mermaid reconstruction probe 2 is
archived and that no product objective is active.

### Scope / Allowed Files

- `GOAL.md`
- `docs/goals/GOAL-TRACE-INDEX.md`
- `docs/goals/history/NC-20260821-dd0feb4d-employee-manual-mermaid-reconstruction-probe-2.md`
- `docs/travelers/94.md`

This quiet state authorizes goal-memory maintenance only. It does not authorize
product, law, governance-contract, or preserved-untracked-path changes.

### Protected Surfaces

- Calculator math and nesting behavior.
- Calculator UI layout and input behavior.
- Clerk auth and request-access policy.
- PWA runtime behavior.
- FLiPIT identity.
- V3 HTML + SPEC under `docs/howmany-v3-components/`.
- `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, `docs/templates/`, and `docs/governance/**`.
- Owner-preserved untracked paths: `docs/architecture/nestcalc-ui-redesign-package*`,
  `e2e/full-surface-audit.authenticated.spec.ts`, and `output/`.

### Required Proof

The v1 metadata validates with one Active Goal and a matching canonical hash.
The archived probe records its Flow-ID, GOAL-SHA, implementation and merge
commits, outcome, proof, and residual risk. The trace index has zero Active
rows. `goal_memory_commit` remains the all-zero placeholder until the separate
Bind memory operation.

### Decision Record

```text
PR #90 merged as 586298b7337122c8d1d052503d59b07bc1c40663 and the probe-2 GOAL
has Flow-ID NC-20260821-dd0feb4d and GOAL-SHA
sha256:ada0b54edb92e365e92cc672baf4b6868c250a9c480d532c6ef59d902529d9cd ->
completion evidence supports archival -> replace the completed probe with a
quiet goal and preserve its trace -> no new product objective is authorized.
```

No skill execution is required for this quiet-state freeze.

### Traveler / sidecar

- Traveler: `docs/travelers/94.md`. This Quiet freeze archives the completed
  probe, validates the quiet goal, commits it, and pushes it to the existing
  draft PR branch.
- No sidecar is required.
- No `/goal` invocation is required.

### Stopping Condition

Complete when this valid quiet `GOAL.md`, the completed-probe archive, and the
trace index are committed and pushed to `origin/docs/quiet-goal-post-pr90`.
Do not bind `goal_memory_commit`, start a product goal, mark the PR ready, or
merge.
