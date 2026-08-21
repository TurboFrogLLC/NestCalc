# Archive nestcalc-goal-grilling

Draft opened. Lands to main. Look first. No Cut until Owner says.

## In this PR (proposed)

1. Remove `.agents/skills/nestcalc-goal-grilling/` from the live skill tree.
   Optional: keep a copy under `docs/audits/pr80/skills/` (#81 dump already has one).
2. Rewrite `docs/governance/GAP-AND-HARDENING.md` grilling rows as historical.
   That skill is not required. Do not put it back in `required_paths`.
3. Sweep remaining live pointers in governance docs that still say the skill is required.
   Leave `AGENTS.md` for step 3.

## Already done (do not redo)

- Manifest `required_paths` does not list the skill.
- `goal-form.md` default `skills` is `[]`.
- Quiet GOAL on main has `skills: []`.

## Out of scope

- AGENTS.md pointer pass
- New grilling skill
- Product, MODE, GOAL rewrite
- Merging #81
