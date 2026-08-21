# AGENTS.md pointer pass (writing-for-agents)

Draft opened. Lands to main. Look before Cut.

Source skill: SuperGrok writing-for-agents (SuperBrain @ 30e7067).
Target: NestCalc AGENTS.md only. Do not rewrite WORKFLOW. Do not edit GOAL.md.

## Cut (agreed)

1. NestCalc law first. `# AGENTS.md — NestCalc` at the top.
2. Next.js managed block last. Keep `BEGIN:nextjs-agent-rules` / `END` intact. Do not rewrite inside the markers. `next dev` owns that span.
3. One Next pointer in our section:
   `When writing Next.js → node_modules/next/dist/docs/ (version-matched).`
4. Sharpen always-on pointers with When:
   - `When a term is used → docs/GLOSSARY.md`
   - `When handing work → docs/templates/traveler.md`
   - `When the job ends → docs/templates/packslip.md`
   - `When Spot Check is Non-conformance → docs/templates/nonconformance.md`
   - `When operating → docs/WORKFLOW.md (procedure)`
   - `When freezing GOAL → docs/templates/goal-form.md`
5. Hard rail: `Quiet and freeze from WORKFLOW. No nestcalc-goal-grilling.`
6. Drop duplicate Never/Always (engine-chrome, sandbox-first, packslip-because-operation-finished, hard-gates echo, second glossary line).
7. QC ladder: one sentence + `When the PR is draft → docs/WORKFLOW.md ## Quality Control.` Do not paste the full band.
8. Hash recipe: point `When freezing → docs/governance/README.md` Goal canonicalization. Do not restate hasher flags.
9. Pair invent-next: `If next is unknown → Owner.` Keep NanoTate rail as one line.

## Out of scope

- WORKFLOW rewrite
- GLOSSARY rewrite
- GOAL.md
- Inventing a replacement grilling skill
- Editing inside the Next.js markers
- SKILL_AND_PLUGIN_RECOMMENDATIONS.md unless Owner says point it
