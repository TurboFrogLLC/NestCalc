# Templates

Forms only in the sibling files. Rules live here.

| File | Is |
| --- | --- |
| `traveler.md` | Ops Packet: current Station only |
| `docs/travelers/<PR>.md` | Job traveler |
| `packslip.md` | Job-end receipt |
| `nonconformance.md` | Non-conformance Report |
| `goal-form.md` | Copy sheet for `GOAL.md` |

Terms: `../GLOSSARY.md`.
Procedure: `../WORKFLOW.md`.

## Traveler

One PR, one traveler. This block is the current operation.
Two bands. Real blank lines. No YAML `---` fences. No host commands.
Instruction is this operation only.
Operator is Codex App, Codex CLI, or Grok Build.
Station binds the room. Mode is Worker or Specialist.
Owner may sit any seat. Operators do not rewrite the traveler. Management may.

When the operation must invoke `/goal`, the first word of the copyable block is `/goal`.
Then the packet. The executor does not add `/goal` if this packet omits it.

Host-shell: terminal box first (`cd` the worktree), then this block.
Primary clone: `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
Operators do not emit the terminal box.

Do not put Waypoint or Sign on this form.

## Packslip

Job-end only. That is when the job is done.
First word is never `/goal`. No Model.
Print in the CLI. Post on the PR when one exists.
Do not emit because an operation finished. Do not emit for a Non-conformance.
Release when named: Merge, then Close on this slip, then print, then post.
The same operation may appear more than once. Skip a row that did not run.
A Corrective Action is a new row. Stamp is a commit SHA.

## Non-conformance Report

Facts only. Disposition blank. Management fills it.
`NCMR-` is the stamp. Do not expand it.

## GOAL form

Copy `goal-form.md` to `GOAL.md`. Replace placeholders. Point; do not paste procedure.
`skills` stays empty unless this traveler names a skill.
