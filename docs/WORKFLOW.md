# WORKFLOW

Procedure only. Routing lives in AGENTS.md Surfaces.
Preferred strengths are not walls.
No Surface owns freeze, land, or a cycle. wReckless starts the work.

## Terms

| Term | Means |
| --- | --- |
| **Law** | This file + AGENTS.md. Bounds the roads. |
| **Surface** | Who runs this operation |
| **Operation** | This step. The next operation is the next step. |
| **Waypoint** | Fork. A decision is required to move forward |
| **Sign** | Posted choices at that fork (CA bands, known next operations) |
| **Traveler** | Instruction sheet. Records Surface + Instruction after a decision. `docs/templates/traveler.md` |
| **Packslip** | Job-end receipt. Mandatory. `docs/templates/packslip.md` |
| **Sidecar** | `create-handoff` JSON only |

Planning, the operation, or wReckless decides. Skills are tools for normal work, more information, or a stuck step.

Parent cannot flip itself mid-session. Model bump = new traveler; wReckless pastes it into the next session.
Continuing while still nonconforming is failure. A Non-conformance stop is containment.

## Start

Workers do not pick their own start. The traveler's Surface line is this operation.

1. Read the traveler. Instruction is the job for this operation.
2. Echo `flow_id` and `goal_sha256` every turn when a goal is on.
3. Stay on the named Branch + Head. Wrong branch or worktree is Correction.
   Create or switch is host or Orchestrator work, not traveler Instruction.
4. Do this operation's Instruction only. Do not run another operation's stamp.
5. Apply this operation's stamp before the next traveler is written.
6. When the named job ends, emit the packslip. Any B. PR or no PR. Silent finish is Non-conformance.

One `main` exception: checkout sync only (fetch, switch to `main`, fast-forward
to `origin/main`). No edits, commits, push, or merge. Any named Surface may
do that sync. Model and effort are not a gate on it.

Typical first-name: Codex App for product freeze, Grok Build for docs freeze.
A named Codex CLI (or any other Surface) may run a full cycle including freeze.
Codex does not touch UI / chrome unless the traveler's Instruction names it.

## Operation stamps

Each operation signs its own work. No stamp = in-process miss. Do not write the next traveler until this operation is stamped.
Stamp is the handle. Retrieve the SHA; do not keep the pile in the window.

| Operation | Stamp |
| --- | --- |
| Freeze | v1 fence on `GOAL.md`. `flow_id`, `goal_sha256`, hash match, one Active Goal. |
| B5 Implement | Named branch. Allowed Files only. Freeze hash unchanged. |
| Land B6–B9 | Host suite below, in the traveler worktree, after B5 is on HEAD. |
| Job end | Packslip. Always. Print in the CLI. Post on the PR when one exists. |

Freeze does not run the land suite. B5 does not re-run freeze.
Land does not start-check as if it were freeze.

B5 is the cut immediately before B6. It is not job close.
When independent review is named, the job closes at B9. B6–B9 is QC and ship.
The last stamp is the packslip, even if the job stopped at B1–B5.

## Goal

- One active `GOAL.md` when the goal workflow is on.
- Quiet `GOAL.md` when no product goal is open.
- Docs-only governance can land without a new GOAL after a land;
  wReckless + SuperGrok may unify surfaces in chat.

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
After freeze, the parent emits the traveler. Do not write start-check or
the land suite into that Instruction.
This operation's traveler Instruction wins over GOAL for which operation runs now.

### Memory files

When a goal is on, these three are the memory:

1. `GOAL.md`
2. `docs/goals/GOAL-TRACE-INDEX.md`
3. `docs/goals/history/`

Before replacing a completed or superseded `GOAL.md`, archive it to
history with Flow-ID, GOAL-SHA, commits, outcome, proof, and residual
risk. Update the index. Zero Active rows when quiet.

### Freeze

- Freeze `GOAL.md` with `flow_id` and `goal_sha256`.
- Commit that freeze before implementation. The freeze commit is not
  the implementation.
- The traveler's Surface line is who freezes. Typical: Codex App (product), Grok Build (docs).
- Echo `flow_id` and `goal_sha256` every turn.
- `/goal` is a Codex tooling call (thread loop). It is not the repo freeze.
  If the next operation must invoke `/goal`, the traveler's first word is
  `/goal`. Then the three-band packet. Do not bury it in Instruction.
  The executor does not add `/goal` after the fact.
  If the traveler omits `/goal`, the next operation reads `GOAL.md` only.
  Keep any `/goal` line short. Point it at `GOAL.md`. Do not paste the sheet.

### Worker-local gates

This operation is the Surface on the traveler. That Surface runs these. They are
not a decision point back to wReckless or SuperGrok unless confidence fails or a hard gate hits.

- Read the traveler first.
- Confirm freeze commit and `goal_sha256` when a goal is on.
- Stay inside Allowed Files.
- evidence → confidence → continue.
- Confidence from repo-backed evidence is clearance to continue.
  Invented or missing confidence is not clearance.
- Flag residual risk. Do not invent extra wReckless interrupts.
- Skills are tools for normal work, more information, or a stuck step.
- One real try. Progress → continue. No progress → one more pass. Still none → stop.
  Next from the known set (Surface, effort, model session, or wReckless). Do not churn.

Route, branch-prefix, or Surface mismatch against the old Codex-only
machine pins is a fork. Apply Corrective Action. It is not Non-conformance.

Draft PR on the named branch is not Non-conformance. Draft is a tier, not a start gate.

Fail a worker-local gate: apply Corrective Action on the traveler
(Correction / Bent / Non-conformance). Non-conformance is STOP. Do not send to us
unless a wReckless gate is hit or confidence is not cleared.

## Proof

Host only. Land proof, in the traveler worktree. Not in the traveler.
Not at freeze. Not at B5. Not at every operation.

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

## Land

When independent review is named: B5 → B6 → B7 → B8 → B9.
B5 is the last production operation. B6 starts QC. The job closes at B9.
The last stamp is the packslip.

Cycle:

| Cycle | Use |
| --- | --- |
| Full | Product / machine / Allowed Files. B5 → B6–B9 when review is named. |
| Lite | Skill or docs. Implement, stamp, draft PR, emit packslip. Merge only if Merge is on this traveler. |

PR-write tiers:

| Tier | Allowed |
| --- | --- |
| Draft | Named land Surface opens or updates a draft PR on the named branch. |
| Ready | Same Surface after B6 cap. Mark ready. Fix review. |
| Merge | B8 continue: repo-backed confidence and named criteria. |

Draft is a tier, not a start gate. Open a draft when there is something to
hang paper on.

- B6 review on the named Surface. Often named: Grok Build.
  A decision that changes the route here → stop; do not enter B7.
- B6 may listen and fix (cap: initial + one post-fix). Codex App or
  Codex CLI may run the same loop when named. Apply only concrete
  defects still on HEAD. Do not scope-expand. Unfixable after the cap
  → escalate (wReckless, or named Codex).
- B7 ready, B8 merge, and B9 post-merge travel as one package when
  repo-backed confidence and named criteria pass.
- B8 on that clearance is not a wReckless seat.
  B8: packslip → merge → B9 on the same slip → print that slip in the CLI → post it on the PR.
  The CLI print is the only closeout. No narrative report.
- B9 post-merge: sync, prune, persist approved lessons, quiet archive
  when that is the named work. Stamp B9 on the same packslip.
- Job end is the packslip even when B8/B9 did not run. PR or no PR.
- If next cannot be decided, next is wReckless.
- wReckless at land only on escalation: route change at B6, failed or
  missing confidence, failed criteria, or a hard gate.

## Corrective Action

Definitions live in AGENTS.md Boundaries.

Traveler band values: None | Bent | Correction | Non-conformance.

- None — omit the second line.
- Bent / Correction — problem and/or correction; continue.
- Non-conformance — problem only; STOP; no correction.
