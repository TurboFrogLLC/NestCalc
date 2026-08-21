# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Employee-manual Mermaid reconstruction probe 2",
  "agent_roster": {
    "orchestrator": "Codex App",
    "read_only_agents": []
  },
  "branch_intent": "docs/employee-manual-mermaid-probe-2",
  "execution_route": "codex-app",
  "flow_id": "NC-20260821-dd0feb4d",
  "goal_memory_commit": "0000000000000000000000000000000000000000",
  "goal_sha256": "sha256:ada0b54edb92e365e92cc672baf4b6868c250a9c480d532c6ef59d902529d9cd",
  "protected_surfaces": [
    "Calculator math and nesting behavior.",
    "Calculator UI layout and input behavior.",
    "Clerk auth and request-access policy.",
    "PWA runtime behavior.",
    "FLiPIT identity.",
    "V3 HTML + SPEC under docs/howmany-v3-components/.",
    "AGENTS.md, docs/GLOSSARY.md, docs/WORKFLOW.md, docs/templates/, and docs/governance/**.",
    "Existing PR #80 audit at docs/audits/employee-manual-mermaid.md.",
    "Owner-preserved untracked paths: docs/architecture/nestcalc-ui-redesign-package*, e2e/full-surface-audit.authenticated.spec.ts, and output/."
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": []
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Employee-manual Mermaid reconstruction probe 2

### Objective

Reconstruct the employee-manual flow from live NestCalc law and add one Mermaid
flowchart, plus a short legend, to
`docs/audits/employee-manual-mermaid-probe-2.md`.

### Scope / Allowed Files

- `GOAL.md`
- `docs/audits/employee-manual-mermaid-probe-2.md`

The next operation may read `AGENTS.md`, `docs/GLOSSARY.md`,
`docs/WORKFLOW.md`, and `docs/templates/` as source authority only. It must not
rewrite law, change product behavior, or read the prior employee-manual audit,
PR #81, GAP, or retired inventories. If authority files disagree, the chart
must draw both paths and label the collision.

### Protected Surfaces

- Calculator math and nesting behavior.
- Calculator UI layout and input behavior.
- Clerk auth and request-access policy.
- PWA runtime behavior.
- FLiPIT identity.
- V3 HTML + SPEC under `docs/howmany-v3-components/`.
- `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, `docs/templates/`, and `docs/governance/**`.
- `docs/audits/employee-manual-mermaid.md`, PR #81, GAP, and retired inventories.
- Owner-preserved untracked paths: `docs/architecture/nestcalc-ui-redesign-package*`,
  `e2e/full-surface-audit.authenticated.spec.ts`, and `output/`.

### Required Proof

The v1 goal metadata validates with one Active Goal and a matching canonical
hash. The freeze commit changes only `GOAL.md`. The subsequent chart operation
will verify that the audit contains one Mermaid flowchart and a short legend,
and no law or product changes.

### Decision Record

```text
PR #90's draft audit stub and PR description → live-law-only reconstruction is a
bounded docs outcome → authorize one chart and legend in the probe-2 audit only
→ authority may be internally inconsistent; preserve every observed collision
in the chart rather than resolving it.
```

No read-only evidence lanes or skill execution are required for this freeze.

### Traveler / sidecar

- Traveler: `docs/travelers/90.md`. Freeze only; stop after the origin branch
  has the freeze commit.
- No sidecar is required.
- No `/goal` invocation is required.

### Stopping Condition

Complete when this valid `GOAL.md` is committed and pushed to
`origin/docs/employee-manual-mermaid-probe-2`. Do not write the Mermaid chart,
mark PR #90 ready, or merge during this operation.
