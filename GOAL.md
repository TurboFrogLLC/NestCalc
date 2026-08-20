# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Align governance machine and lifecycle recipe to Quality Control and Release",
  "agent_roster": {
    "orchestrator": "codex-app",
    "read_only_agents": []
  },
  "branch_intent": "scripts/machine-qc-release-align",
  "execution_route": "codex-app",
  "flow_id": "NC-20260820-7c19de45",
  "goal_memory_commit": "a419ea930818542a4de52fa331e003533ffcc476",
  "goal_sha256": "sha256:9badd4bbcd3b25d46b2dd8c63885db585f6e4b23c4b71f0c72a8c39609d1f8f3",
  "protected_surfaces": [
    "UI and chrome, calculator math, engine behavior, nest-session transforms, AutoNest, G-code, presets, Clerk, PWA, routes, service workers, secrets, deployment, and Production",
    "FLiPIT identity, V3 HTML and SPEC authority, docs/governance/MODE, main, flow_id format, schemas, fixtures, sidecar and closeout artifact contracts, and SuperBrain"
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
bounded implementation below; it does not authorize merge or any later
operation.

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

### Grilling Decision Record

```text
evidence → confidence → decision → residual risk / flagged decisions
```

- Evidence: `AGENTS.md`, `docs/GLOSSARY.md`, and `docs/WORKFLOW.md` define the
  living terms and the Quality Control and Release sequence. The two governance
  recipe documents still describe the retired numeric sequence.
- Evidence: `docs/governance/manifest.json` omits `docs/GLOSSARY.md` and
  `docs/templates/nonconformance.md`; `validate_manifest` directly requires only
  traveler and packslip; the deterministic test proves only those two pins.
- Confidence: freeze-ready. The required proof is reachable inside Allowed
  Files, protected surfaces are explicit and non-empty, exactly one Active Goal
  is present, and no blocking question remains.
- Decision: Path B. Include the existing deterministic governance test in
  Allowed Files so every new fail-closed manifest assertion can be implemented
  and proved without scope expansion.
- Flagged decision — reason: the employee manual is newer than the machine
  recipe, but the current artifact schemas still use older closeout field names.
  Decision: rewrite only the human lifecycle recipe and required authority pins;
  preserve artifact schemas and fixtures. Consequence: artifact-shape
  modernization, if ever desired, requires a separately named goal.
- Residual risk: the rewritten recipe may mention existing artifact commands
  whose field vocabulary predates the employee manual. Those commands remain
  mechanical evidence interfaces, not lifecycle identity, and must not be
  expanded in this wave.
- Evidence lanes: no delegated read-only agents were used. Evidence came from
  the pinned repository authority and checker/test sources at the named head.

### Stopping Condition

This Codex App operation stops after the goal-only freeze commits are created
on `scripts/machine-qc-release-align` and the final `flow_id` and canonical
`goal_sha256` are reported. Do not implement the allowed changes, create a
sidecar, push, open or update a PR, merge, touch `main`, or choose the next
operation in this hop.
