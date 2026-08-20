# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Align governance machine and lifecycle recipe to Quality Control and Release",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": []
  },
  "branch_intent": "scripts/machine-qc-release-align",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260820-7c19de45",
  "goal_memory_commit": "83f7a2bac8c8b69b216eb978b1d0ccbe7fb04a44",
  "goal_sha256": "sha256:382b1b08472a77806f57ebc4148133235405b6f93286e9de81f98ab0605eba12",
  "protected_surfaces": [
    "UI and chrome, calculator math, engine behavior, nest-session transforms, AutoNest, G-code, presets, Clerk, PWA, routes, service workers, secrets, deployment, and Production",
    "FLiPIT identity, V3 HTML and SPEC authority, docs/governance/MODE, main, flow_id format, schemas, fixtures, sidecar and closeout artifact contracts, and SuperBrain"
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

## Active Goal: Align governance machine and lifecycle recipe to Quality Control and Release

### Objective

Align the repository-local governance manifest, its fail-closed manifest check,
and the two lifecycle recipe documents with the employee manual landed by
NestCalc PR #77 at `a419ea930818542a4de52fa331e003533ffcc476`.

The machine must pin the glossary and Non-conformance Report template as
required authority. The lifecycle recipe must use the full-word Quality Control
and Release operations defined by `AGENTS.md`, `docs/GLOSSARY.md`, and
`docs/WORKFLOW.md`, without retaining a numeric land identity.

This freeze is authored by Operator **Codex App**, model **GPT-5.6 Sol**,
effort **medium**, on `scripts/machine-qc-release-align`. It authorizes only the
bounded implementation below, routed next to Operator **Codex CLI**. It does
not authorize merge.

### Scope / Allowed Files

Only these files may change during implementation:

- `docs/governance/manifest.json`
- `scripts/nestcalc-governance.py`
- `test/governance/test_nestcalc_governance.py`
- `docs/governance/goal-lifecycle-contract.md`
- `docs/governance/README.md`

Required outcomes:

- Add `docs/GLOSSARY.md` and `docs/templates/nonconformance.md` to the
  governance manifest's required paths.
- Make `validate_manifest` require the glossary and Non-conformance Report
  template directly, alongside the traveler and packslip, so deleting a pin
  fails closed even if the manifest is weakened.
- Update the deterministic governance test to prove all four required authority
  files are enforced by `validate_manifest`.
- Rewrite `docs/governance/goal-lifecycle-contract.md` and
  `docs/governance/README.md` so their lifecycle recipe matches current law:
  Goal prep and Freeze; Traveler; Cut; Quality Control as Send for review,
  Wait, and Inspection; Release as Merge then Close; Packslip only at job end;
  Non-conformance Report on a stopped operation.
- Remove numeric station identity and retired land-ladder vocabulary from those
  two recipe documents. Use the role and operation terms defined in the glossary.
- Preserve fail-closed governance behavior and the current `flow_id` format.
  This goal does not authorize changes to schemas, fixtures, sidecar or closeout
  artifact shapes, or `docs/governance/MODE`.

### Protected Surfaces

Do not touch UI or chrome, calculator math, engine behavior, nest-session
transforms, AutoNest, G-code, presets, Clerk, PWA, routes, service workers,
secrets, deployment, Production, FLiPIT identity, V3 HTML or SPEC authority,
`docs/governance/MODE`, `main`, SuperBrain, or any file outside Allowed Files.

Do not change the `flow_id` regex or semantics. Do not change governance
schemas, fixtures, sidecar or closeout artifact contracts. Do not merge.

### Required Proof

At Release, from the traveler worktree and after the implementation is on HEAD,
run the repository host suite named by `AGENTS.md` and `docs/WORKFLOW.md`:

- `python3 scripts/nestcalc-governance.py check`
- `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`
- `npm run governance:check`
- `npm run test:governance`
- `git diff --check origin/main...HEAD`
- `git status --porcelain=v1`
- `git branch --show-current`
- `git rev-parse HEAD`

Proof must demonstrate that the glossary and Non-conformance Report template
are both present in the manifest and independently enforced by
`validate_manifest`, and that the rewritten lifecycle documents contain no
numeric station identity or retired land-ladder vocabulary.

### Stopping Condition

This Codex App operation stops after the replacement goal-only freeze commits
are created and the Codex CLI implementation traveler is printed. Codex App
must not implement the allowed changes.

The Codex CLI implementation operation stops after the frozen outcomes are
implemented inside Allowed Files and committed on
`scripts/machine-qc-release-align`. Do not merge, touch `main`, or choose the
next operation.
