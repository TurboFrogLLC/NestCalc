# WORKFLOW

Procedure only. Routing lives in AGENTS.md Roles.
Preferred strengths are not walls.
No Operator owns freeze, land, or a cycle. Owner starts the work.

One PR, one traveler. Management may edit it. Operators complete this operation.
The same operation may appear more than once.
Completing an operation is not job-end. Packslip is job-end.

Tools are for this operation. A tool has a parent Operator.
Parent cannot flip itself mid-session. Model bump = Owner pastes the same traveler into the next session.

## Start

Operators do not pick their own start. The traveler's Operator line is who runs this operation.

1. Read the traveler. Instruction is this operation.
2. Echo `flow_id` and `goal_sha256` every turn when a goal is on.
3. Stay on the named Branch + Head. Wrong branch or worktree is Corrective Action.
   Create or switch is host work, not traveler Instruction.
4. Do this operation only. Do not rewrite the traveler.
5. Stamp this operation before the next operation runs.
6. Spot Check. None, Corrective Action, or Non-conformance.
7. Job end is the packslip. Non-conformance is the Non-conformance Report.

One `main` exception: checkout sync only (fetch, switch to `main`, fast-forward
to `origin/main`). No edits, commits, push, or merge. Any named Operator may
do that sync. Model and effort are not a gate on it.

Typical first-name: Codex App for product freeze, Grok Build for docs freeze.
A named Codex CLI (or any other Operator) may run a full cycle including freeze.
Codex does not touch UI / chrome unless the traveler's Instruction names it.

## Operation stamps

| Operation | Stamp |
| --- | --- |
| Freeze | v1 fence on `GOAL.md`. `flow_id`, `goal_sha256`, hash match, one Active Goal. |
| Cut | Named branch. Allowed Files only. Freeze hash unchanged. |
| Send for review | PR marked ready. |
| Wait | Named review held. |
| Inspection | Review looked at. |
| Merge | On `main` when cleared. |
| Close | Cleanup after Merge. |
| Job end | Packslip. Print in the CLI. Post on the PR when one exists. |
| Non-conformance | Non-conformance Report. `NCMR-`. Disposition blank. |

Freeze does not run the land suite. Cut does not re-run freeze.
Release does not start-check as if it were freeze.

The PR stays draft until Quality Control.

## Goal

- One active `GOAL.md` when the goal workflow is on.
- Quiet `GOAL.md` when no product goal is open.
- Docs-only governance can land without a new GOAL after a land.

### v1 metadata

Post-bootstrap `GOAL.md` must carry the `nestcalc-governance` v1 fence and
JSON block (`flow_id`, `goal_sha256`, and the other required keys).

That fence is the freeze stamp. GOAL states outcomes. Do not put runnable
host command fences in a freeze GOAL. The host suite lives under Proof.

Missing block **stops**, except the one historical title
`NestCalc Governed Goal Pipeline v1` may **warn** while
`docs/governance/MODE` is `advisory`.
Hash mismatch, secrets in the block, or more than one Active Goal still stop.
The full recipe and hash steps live in `docs/governance/README.md`.
The copy template is `docs/governance/goal-template-v1.md`.

`create-handoff` JSON is a sidecar. The traveler is `docs/templates/traveler.md`.
After freeze, the parent emits the current operation on that traveler.
Do not write start-check or the land suite into that Instruction.
Traveler Instruction wins over GOAL for this operation.

### Memory files

When a goal is on, these three are the memory:

1. `GOAL.md`
2. `docs/goals/GOAL-TRACE-INDEX.md`
3. `docs/goals/history/`

Before replacing a completed or superseded `GOAL.md`, archive it to
history with Flow-ID, GOAL-SHA, commits, outcome, proof, and residual
risk. Update the index. Zero Active rows when quiet.

Lessons point at an `NCMR-` when a Non-conformance Report exists. Do not paste the report body.

### Freeze

- Freeze `GOAL.md` with `flow_id` and `goal_sha256`.
- Commit that freeze before implementation. The freeze commit is not
  the implementation.
- The traveler's Operator line is who freezes. Typical: Codex App (product), Grok Build (docs).
- Echo `flow_id` and `goal_sha256` every turn.
- `/goal` is a Codex tool (thread loop). It is not the repo freeze.
  If the next operation must invoke `/goal`, the traveler's first word is
  `/goal`. Then the three-band packet. Do not bury it in Instruction.
  The executor does not add `/goal` after the fact.
  If the traveler omits `/goal`, the next operation reads `GOAL.md` only.
  Keep any `/goal` line short. Point it at `GOAL.md`. Do not paste the sheet.

### Worker-local gates

This operation is run by the Operator on the traveler.

- Read the traveler first.
- Confirm freeze commit and `goal_sha256` when a goal is on.
- Stay inside Allowed Files.
- evidence → confidence → continue.
- Confidence from repo-backed evidence is clearance to continue.
  Invented or missing confidence is not clearance.
- Flag residual risk. Do not invent extra Owner interrupts.
- Tools are for this operation. A tool is not an Operator.
- One real try. Progress → continue. No progress → one more pass. Still none → Non-conformance.

Route, branch-prefix, or Operator mismatch against the old Codex-only
machine pins is a fork. Apply Corrective Action.

Draft PR on the named branch is not a stop. The PR stays draft until Quality Control.

Fail a worker-local gate: Spot Check on this operation.
Non-conformance: stop, emit the Non-conformance Report, wait.
Do not send to us unless an Owner gate is hit or confidence is not cleared.

## Proof

Host only. Release proof, in the traveler worktree. Not in the traveler.
Not at freeze. Not at Cut. Not at every operation.

`cd` the traveler worktree. If none is named, use the primary clone:
`/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
That `cd` is host setup. It is not traveler Instruction.

```text
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
npm run governance:check
npm run test:governance
git diff --check origin/main...HEAD
git status --porcelain=v1
git branch --show-current
git rev-parse HEAD
```

Plus the GOAL-named product proof (lint / build / unit / e2e) when that
GOAL names it.

A script written in this step is not host-first until it is on HEAD and
the host has re-run `python3 scripts/nestcalc-governance.py check`.

Missing Clerk auth env is blocked proof, not a pass.
Use the strongest verification the touched surface warrants.

## Quality Control

The PR is draft until this band.

1. Send for review — mark ready. Named review.
2. Wait.
3. Inspection — look at the thread or the pass.

If Inspection needs work: another Spot Check on this traveler, then Inspection again.
Listen/fix cap sits inside that Spot Check.
If no way: Non-conformance Report.
If Inspection is clean: Release.

## Release

Merge, then Close. Two operations.

- Merge when repo-backed confidence and named criteria pass, unless this traveler forbids merge.
- Merge is not an Owner seat when that clearance holds.
- Close: sync, prune, persist approved lessons, quiet archive when that is the named work.
- Packslip after Close when this is job-end. Print. Post on the PR.
- If next cannot be decided, next is the Owner.
- Owner at land only on escalation: route change, failed or missing confidence, failed criteria, or a hard gate.

Cycle:

| Cycle | Use |
| --- | --- |
| Full | Product / machine / Allowed Files. Cut → Quality Control → Release when review is named. |
| Lite | Skill or docs. Implement, stamp, draft PR, Quality Control. Merge unless this traveler forbids it. |

## Spot Check

- None — omit the second line.
- Corrective Action — find a way; continue this operation.
- Non-conformance — stop; Non-conformance Report; wait.
