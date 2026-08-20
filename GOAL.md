# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Employee-manual Mermaid reconstruction probe",
  "agent_roster": {
    "orchestrator": "Codex App",
    "read_only_agents": []
  },
  "branch_intent": "docs/employee-manual-mermaid-probe",
  "execution_route": "codex-app",
  "flow_id": "NC-20260820-a20c0de8",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:5b4541ad4d80566fbba941524206593659b24f53fa17722177899d7f7cfe7d07",
  "protected_surfaces": [
    "calculator math and nesting behavior",
    "calculator UI layout and input behavior",
    "Clerk auth and request-access policy",
    "PWA runtime behavior",
    "NestCalc law and governance contracts"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Employee-manual Mermaid reconstruction probe

### Objective

Codex App reads the employee manual and writes one Mermaid flowchart of the
reconstructed flow into `docs/audits/employee-manual-mermaid.md`.

### Scope / Allowed Files

- `GOAL.md`
- `docs/audits/employee-manual-mermaid.md`

The next operation may read the employee manual and add one reconstructed
Mermaid flowchart to the audit file. It must not rewrite law or change product
behavior.

### Protected Surfaces

- Calculator math and nesting behavior.
- Calculator UI layout and input behavior.
- Clerk auth and request-access policy.
- PWA runtime behavior.
- `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, and `docs/governance/**`.

### Required Proof

The v1 goal metadata validates with one Active Goal and a matching canonical
hash. The freeze commit changes only `GOAL.md`. The subsequent chart operation
will verify that the audit contains one Mermaid flowchart and no law or product
changes.

### Grilling Decision Record

```text
authority and draft audit stub → scope is docs-only reconstruction → freeze a single-chart next operation without product or law changes → the employee manual may be incomplete or ambiguous; the chart must reflect only what it can reconstruct.
```

No read-only evidence lanes or skill execution are required for this freeze.
`nestcalc-goal-grilling` is intentionally omitted for this probe.

### Traveler / sidecar

- Traveler: `docs/templates/traveler.md`. Freeze only; stop after the origin
  branch has the freeze commit.
- No sidecar is required.
- No `/goal` invocation is required.

### Stopping Condition

Complete when this valid `GOAL.md` is committed and pushed to
`origin/docs/employee-manual-mermaid-probe`. Blocked if the v1 metadata cannot
validate without expanding this docs-only scope. Do not write the Mermaid
flowchart during this freeze.
