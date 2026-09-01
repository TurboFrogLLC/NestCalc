# Templates

Forms only in the sibling files.

When a term → `../GLOSSARY.md`.
When operating → `../WORKFLOW.md`.
When this visit → `packet.md`.
When the job sheet → `traveler.md` or `docs/travelers/<PR>.md`.

| File | Is |
| --- | --- |
| `traveler.md` | Job traveler stencil. Plan creates the routing. |
| `docs/travelers/<PR>.md` | Live job traveler |
| `packet.md` | Ops Packet. Current visit only. |
| `packslip.md` | Job-end receipt. That traveler after Close. |
| `nonconformance.md` | Non-conformance Report |
| `goal-form.md` | Copy sheet for `GOAL.md` |

## Traveler

Header + Seq list. Notes are the short callout.
Operators stamp a row. They do not rewrite the routing. Management may.
Do not put Waypoint or Sign on this form.

## Ops Packet

Current visit only. Two bands. No YAML `---` fences. No host commands.
When `/goal` is named, it is the first word of the copyable block.
Start-branch never `/goal`.
Host-present work: terminal box first (`cd` the worktree), then this block.
Primary clone: `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
Operators do not emit the terminal box.

## Packslip

Job-end only. First word is never `/goal`. No Model.
Print in the CLI. Post on the PR when one exists.
Stamp is a commit SHA or `NCMR-`.

## Non-conformance Report

Facts only. Disposition blank. `NCMR-` is the stamp.

## GOAL form

Copy `goal-form.md` to `GOAL.md`. Replace placeholders. Point; do not paste procedure.
The GOAL `skills` array stays empty unless the packet names a skill.
