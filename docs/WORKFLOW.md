# WORKFLOW

Procedure only. Routing lives in AGENTS.md Surfaces.
The traveler chooses the Surface. Preferred strengths are not walls.

## Terms

Shop words. Same meaning here.

| Term | Means | Is not |
| --- | --- | --- |
| **Surface** | The station doing this step | A person-name for the packet |
| **Waypoint** | The intersection. Next Surface + why. Always forward | A fail flag |
| **Traveler** | The packet that moves with the job. Three-band handoff in `docs/templates/handoff.md` | A person, a Surface, or the-Feeler |
| **the-Feeler** | Feeler-gauge check. Bounded probe: gap / no gap / next station | Implement, merge, or invent a Surface |
| **Sidecar** | `create-handoff` JSON (prompt hash and bindings) | The traveler |

the-Feeler measures. It does not cut, ship, or rewrite the parent model.
Parent cannot flip itself mid-session. Model bump = traveler; wReckless pastes it into the next session.
Continuing while still broken is failure. A Broken stop is containment.

## Start

1. Match traveler Branch + Head. Create or switch if needed; continue.
2. One worktree + one branch per authorized scope.
   Engine and chrome do not share a worktree unless the active GOAL names both.
3. Host first. Do not sandbox-first for npm, Playwright, git, or
   committed `scripts/*.py` (today: `python3 scripts/nestcalc-governance.py`).
   A script written in this step is not host-first until it is on HEAD
   and `python3 scripts/nestcalc-governance.py check` has been re-run
   from the host.
4. Echo `flow_id` and `goal_sha256` every turn when a goal is on.

Coding goals prefer Codex App to start. Codex does not touch UI / chrome unless
the traveler names it. Docs prefer the named Surface (often Grok Build or SuperGrok).

## Goal

- One active `GOAL.md` when the goal workflow is on.
- Quiet `GOAL.md` when no product goal is open.
- Docs-only governance can land without a new GOAL after a land;
  wReckless + SuperGrok may unify surfaces in chat.

### v1 metadata

Post-bootstrap `GOAL.md` must carry the `nestcalc-governance` v1 fence and
JSON block (`flow_id`, `goal_sha256`, and the other required keys).

```text
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
```

Missing block **stops**, except the one historical title
`NestCalc Governed Goal Pipeline v1` may **warn** while
`docs/governance/MODE` is `advisory`.
Hash mismatch, secrets in the block, or more than one Active Goal still stop.
The full recipe and hash steps live in `docs/governance/README.md`.
The copy template is `docs/governance/goal-template-v1.md`.

`create-handoff` JSON is a sidecar. The traveler is `docs/templates/handoff.md`.

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
not a waypoint back to wReckless or SuperGrok.

- Match traveler Branch + Head.
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
Invented or missing confidence is not clearance.
Flag residual risk. Do not invent extra wReckless interrupts.

No movement after a real try: the-Feeler may probe once on the named ladder.
Same defect, no movement → traveler to the next allowed station (Surface,
effort, model session, or wReckless). Do not churn.

Route, branch-prefix, or Surface mismatch against the old Codex-only
machine pins is a waypoint. Apply Corrective Action. It is not Broken.

Fail a worker-local gate: apply Corrective Action on the traveler
(Correction / Bent / Broken). Broken is STOP. Do not send to us
unless a wReckless gate is hit or confidence is not cleared.

## Surfaces

See AGENTS.md Surfaces. This file does not assign actors by phase.

## Proof

Run the proof named by the GOAL / traveler. Host first.
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

- B6 review on the named Surface. Preferred: Grok Build.
  A waypoint change here → stop; do not enter B7.
- B6 may listen and fix (cap: initial + one post-fix). Codex App or
  Codex CLI may run the same loop when named. Apply only concrete
  defects still on HEAD. Do not scope-expand. Unfixable after the cap
  → escalate (wReckless waypoint, or named Codex).
- B7 closeout, B8 merge, and B9 post-merge travel as one package when
  repo-backed confidence and named criteria pass.
- B8 merge on that clearance is not a wReckless seat.
- B9 post-merge: sync, prune, persist approved lessons, quiet archive
  when that is the named work.
- wReckless at land only on escalation: B6 waypoint change, failed or
  missing confidence, failed criteria, or a hard gate.

Implementation waves push the branch and open a ready-for-review PR unless
wReckless asks for draft. This governance review PR is draft by request.

## Corrective Action

Definitions live in AGENTS.md Boundaries.

Traveler band values: None | Bent | Correction | Broken.

- None — omit the second line.
- Bent / Correction — problem and/or correction; continue.
- Broken — problem only; STOP; no correction.
