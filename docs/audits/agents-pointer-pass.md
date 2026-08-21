# AGENTS.md pointer pass (writing-for-agents)

Draft opened. Lands to main. Look before Cut.

Source skill: SuperGrok `writing-for-agents` (SuperBrain candidate @ 30e7067).
Target: NestCalc `AGENTS.md` only. Do not rewrite WORKFLOW bodies here.

## Skill audit (live AGENTS on main b462393)

### Keep

- Under ~150 lines. Human shape.
- Authority order, Roles table, Spot Check three states.
- Host-first command list (in-file steps with checkable commands).
- Always: one worktree, traveler first, branch+head, freeze stamps, protected surfaces.
- Pointers exist for GLOSSARY, traveler, packslip, nonconformance, WORKFLOW.

### Sharpen (proposed Cut)

1. **Top-of-file pointers** — weak When.
   Now: `Procedure: docs/WORKFLOW.md. Routing here.`
   Prefer: `When operating → docs/WORKFLOW.md (procedure).` Same for templates.
   Glossary stays always-on: keep paired with this file.

2. **goal-form missing** 
   Live form is `docs/templates/goal-form.md` (#82). AGENTS never names it.
   Add: `When freezing GOAL → docs/templates/goal-form.md (copy sheet).`

3. **Grilling residual** 
   Skill archived (#86). AGENTS never says so.
   Hard rail, paired: `Quiet and freeze from WORKFLOW. No nestcalc-goal-grilling.`

4. **Never stack** 
   Several naked don'ts without a paired do. Pair the high-miss ones only:
   main checkout sync (already paired), packslip (pair with job-end Always line), invent-next (pair: stop for Owner).

5. **Orphan inventory** 
   `docs/SKILL_AND_PLUGIN_RECOMMENDATIONS.md` is not pointed from AGENTS.
   Either one When-line for skill inventory, or leave as Owner-memory only (skill says orphan is a miss).

### Out of scope

- WORKFLOW rewrite
- GLOSSARY rewrite
- New skill
- GOAL.md
- Next.js agent-rules banner (framework inject; leave unless Owner says strip)

## Success

AGENTS.md still short. Every critical path has a leading When. No live grilling. goal-form named. No paste of WORKFLOW into AGENTS.
