# WORKFLOW

Procedure only. Routing lives in AGENTS.md Roles.
Preferred strengths are not walls.
No Operator owns freeze, land, or a cycle. Owner starts the work.

One PR, one traveler. Management may edit it. Operators complete this operation.
The same operation may appear more than once.
Completing an operation is not job-end. Packslip is job-end.

Tools are for this operation. A tool has a parent Operator.
Parent cannot flip itself mid-session. Model bump = Owner pastes the same packet into the next session.

## Start

Operators do not pick their own start. The packet Operator line is who runs this operation.

1. Read the traveler. Instruction is this operation on the packet.
2. Echo `job_id` every turn when no goal is on; echo `flow_id` and `goal_sha256` every turn when a goal is on.
3. Stay on the named Branch + Head. Wrong branch or worktree: host fix or
   Escalate in Worker Mode; Corrective Action in Specialist Mode. Create or
   switch is host work, not packet Instruction.
4. Do this operation only. Do not rewrite the traveler.
5. Stamp this operation before the next operation runs.
   After stamp, if the next Operation is already named on the job traveler at
   `docs/travelers/<PR>.md`, the finishing Operator emits that Ops Packet from
   that row; if it is not named, → Owner. Completing a visit is not job-end.
6. Job end is the packslip. Non-conformance is the Non-conformance Report.

First `main` exception: Start-branch at job start only (host). Create or switch is host work.
The second `main` exception lives in AGENTS Never.

Typical first-name: Codex App for product freeze, Grok Build for docs freeze.
A named Codex CLI (or any other Operator) may run a full cycle including freeze.
Codex does not touch UI / chrome unless the packet Instruction names it.

## Operation stamps

| Operation | Stamp |
| --- | --- |
| Plan | Commit that wrote or revised the routing. |
| Start-branch | Named feature Branch exists. HEAD is that Branch. |
| Freeze | Product freeze: v1 fence on `GOAL.md` — `flow_id`, `goal_sha256`, hash match, one Active Goal. Non-goal freeze: planning stamp on the job traveler (commit SHA), not a `GOAL.md` v1 fence. |
| Cut | Named branch. Allowed Files only. Freeze hash unchanged. |
| Send for review | PR marked ready. Named review tagged. Listen on that thread. |
| Inspection | Review looked at. Disposition only. |
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

GOAL states outcomes only. The Ops Packet Instruction is the write path for
this visit. GOAL must not name a concrete write path that disagrees with the
Ops Packet. Packet Instruction still wins for this operation.

### v1 metadata

Post-bootstrap `GOAL.md` must carry the `nestcalc-governance` v1 fence and
JSON block (`flow_id`, `goal_sha256`, and the other required keys).

That fence is the freeze stamp. Do not put runnable host command fences in a
freeze GOAL. The host suite lives under Proof.

Missing block **stops**, except the one historical title
`NestCalc Governed Goal Pipeline v1` may **warn** while
`docs/governance/MODE` is `advisory`.
Hash mismatch, secrets in the block, or more than one Active Goal still stop.
The full recipe and hash steps live in `docs/governance/README.md`.
The copy template is `docs/templates/goal-form.md`.

`create-handoff` JSON is a sidecar. The job sheet is `docs/templates/traveler.md`.
The current visit is `docs/templates/packet.md`.
After freeze, the parent emits the current packet.
Do not write start-check or the land suite into that Instruction.
Packet Instruction wins over GOAL for this operation.

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

When the goal workflow is on, product freeze is the `GOAL.md` v1 fence. A
non-goal freeze is a planning stamp on the job traveler (commit SHA),
not a `GOAL.md` v1 fence.

- Freeze `GOAL.md` with `flow_id` and `goal_sha256` when the goal workflow is on.
- Commit that freeze before implementation. The freeze commit is not
  the implementation.
- The packet Operator line is who freezes. Typical: Codex App (product), Grok Build (docs).
- Echo `flow_id` and `goal_sha256` every turn.
- `/goal` is a Codex tool (thread loop). It is not the repo freeze.
  If the next operation must invoke `/goal`, the packet's first word is
  `/goal`. Then the packet. Do not bury it in Instruction.
  The executor does not add `/goal` after the fact.
  If the packet omits `/goal`, the next operation reads `GOAL.md` only.
  Keep any `/goal` line short. Point it at `GOAL.md`. Do not paste the sheet.

### Worker-local gates

This operation is run by the Operator on the packet.

Corrective Action and the Non-conformance Report are the Specialist ladder
(Mode Specialist). Worker stop remains Escalate. See `docs/GLOSSARY.md` for
their meanings.

- Read the traveler first.
- Confirm freeze commit and `goal_sha256` when a goal is on.
- Stay inside Allowed Files.
- evidence → confidence → continue.
- Confidence from repo-backed evidence is clearance to continue.
  Invented or missing confidence is not clearance.
- Flag residual risk. Do not invent extra Owner interrupts.
- Tools are for this operation. A tool is not an Operator.
- One real try. Progress → continue. No progress → one more pass. Still none → Escalate.

Draft PR on the named branch is not a stop. The PR stays draft until Quality Control.

Worker Mode: fail a worker-local gate or cannot finish the named Instruction →
Escalate.
Specialist Mode: fail a worker-local gate with known tools → Corrective Action.
Stay on this operation.
Law broke → Non-conformance Report. Stop.
Wrong branch or worktree: host fix or Escalate in Worker Mode; Corrective
Action only in Specialist Mode.
Do not send to us unless an Owner gate is hit or confidence is not cleared.

## Proof

Host only. Release proof, in the traveler worktree. Not in the packet.
Not at freeze. Not at Cut. Not at every operation.

`cd` the traveler worktree. If none is named, use the primary clone:
`/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
That `cd` is host setup. It is not packet Instruction.

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

1. Send for review — mark ready. Named review: `@codex review` and `agents-pr-review` (companion). Listen on that thread.
2. Inspection — look at the thread or the pass. Only when that visit is planned.

If Inspection needs work: next Plan + new Cut, or Corrective Action on this visit when Mode is Specialist.
If the law broke: Non-conformance Report.
If this visit cannot finish: Escalate.
If Inspection is clean: Release.
Midstream spitball may Send for review without an Inspection row.

## Release

Merge, then Close. Two operations.

- Merge when repo-backed confidence and named criteria pass, unless this traveler forbids merge.
- Merge is not an Owner seat when that clearance holds.
- After merge, docs-only traveler and packslip stamps on `main`: AGENTS Never second exception, when this traveler names Owner authorization.
- Close after Merge: main-side sync, then stamps / packslip. Retain the feature branch unless this traveler names prune.
- Persist approved lessons; quiet archive when that is the named work.
- Packslip after Close when this is job-end. Print. Post on the PR.
- If next cannot be decided, next is the Owner.
- Owner at land only on escalation: route change, failed or missing confidence, failed criteria, or a hard gate.

The job traveler Seq list is the cycle. Do not invent a Cycle field.
