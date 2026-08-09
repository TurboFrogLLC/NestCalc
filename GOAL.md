# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Repository Quiet State - No Active Product Objective",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": []
  },
  "branch_intent": "codex/quiet-goal-post-shop-helpers-hygiene",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260809-f18a6c4d",
  "goal_memory_commit": "7667e6386c9074b2ce4c46214de88f6364866f94",
  "goal_sha256": "sha256:a43fcdf3a5ba61415ed363325839d62fc610ca30a34d60f717995ff12a192886",
  "protected_surfaces": [
    "all product implementation, calculator math, AutoNest behavior, Clerk, PWA, and docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "codex-goal-prep",
    "codex-post-merge-cleanup"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Repository Quiet State - No Active Product Objective

### Status

No Active product objective. This is a mechanical, documentation-only quiet
state after the completed shop-helpers wave.

### Completed Work

- Named Full-State Presets and G-Code Rotation v1 (`NC-20260731-c7ced7c2`)
  is Complete: PR #32 merged.
- Path B plotter residual (`NC-20260801-385a107b`) is Complete: PR #33 merged
  at `bb131e8`, including `a32ff24`; `main` is now `622c60c` after PR #34.

### Scope

There is no product Allowed Files list and no product branch intent. Shop-helper
presets and plotter ACS support are on `main`; any next product work requires a
new goal freeze, its own branch intent, and explicit allowed files.

### Protected Surfaces

All product surfaces remain protected. Do not treat this quiet state as
authorization to change calculator behavior, AutoNest, Clerk, PWA, routes,
service workers, or `docs/governance/MODE`.
