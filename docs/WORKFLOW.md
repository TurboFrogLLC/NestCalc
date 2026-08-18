# WORKFLOW

Procedure only. Routing lives in AGENTS.md Surfaces.
Handoff chooses the Surface. Preferred strengths are not walls.

## Start

1. Match handoff Branch + Head. Create or switch if needed; continue.
2. One worktree + one branch per authorized scope.
   Engine and chrome do not share a worktree unless the active GOAL names both.
3. Host first. Do not sandbox-first for npm, Playwright, git, or
   committed `scripts/*.py` (today: `python3 scripts/nestcalc-governance.py`).
   A script written in this step is not host-first until it is on HEAD
   and `python3 scripts/nestcalc-governance.py check` has been re-run
   from the host.
4. Echo `flow_id` and `goal_sha256` every turn when a goal is on.

## Goal

- One active `GOAL.md` when the goal workflow is on.
- Quiet `GOAL.md` when no product goal is open.
- Docs-only governance can land without a new GOAL after a land;
  Human + SuperGrok may unify surfaces in chat.

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
- Echo `flow_id` and `goal_sha256` every turn.

### Worker-local gates

The waypoint chose the Surface. That Surface runs these. They are
not a waypoint back to Human or SuperGrok.

- Match handoff Branch + Head.
- Confirm freeze commit and `goal_sha256`.
- Read the three memory files and relevant lessons.
- Confirm required proof is reachable in Allowed Files.
- Host first for npm, Playwright, git, and committed scripts.
- Missing Clerk auth env is blocked proof, not a pass.
- Run:

```text
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
```

```text
evidence → confidence → continue
```

Confidence from repo-backed evidence is clearance to continue.
Flag residual risk. Do not invent extra Human interrupts.

Fail a worker-local gate: apply Corrective Action on the handoff
(Correction / Bent / Broken). Broken is STOP. Do not send to us
unless a Human gate is hit or confidence is not cleared.

## Surfaces

See AGENTS.md Surfaces. This file does not assign actors by phase.

## Proof

Run the proof named by the GOAL / handoff. Host first.
Report evidence. Confidence cleared → continue.

Use the strongest verification the touched surface warrants:

- `npm run lint`
- `npm run build`
- `npm run test` or `npm run test:unit`
- `npm run test:e2e` / `npm run test:e2e:auth` when Clerk env is present
- `npm run governance:check` / `npm run test:governance` for governance waves
- Playwright for UI

Missing Clerk auth env is blocked proof, not a pass.

## Land

When independent review is named: B6 → B7 → B8 → B9.

- B6 review. A waypoint change here → stop; do not enter B7.
- B7 closeout and B8 Human merge always travel together.
- B8 stays Human.
- B9 post-merge: sync, prune, persist approved lessons, quiet archive
  when that is the named work. Worker continues when confidence and
  criteria are met. Human at B9 only if they are not.
- Grok Build may do B6+B7 in one pass on the same authorized head
  only when B6 has no waypoint change.

Implementation waves push the branch and open a ready-for-review PR unless
the Human asks for draft. This governance review PR is draft by request.

## Corrective Action

Definitions live in AGENTS.md Boundaries.

Handoff band values: None | Bent | Correction | Broken.

- None — omit the second line.
- Bent / Correction — problem and/or correction; continue.
- Broken — problem only; STOP; no correction.
