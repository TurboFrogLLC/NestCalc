# AGENTS.md — NestCalc

Repo NestCalc. Product FLiPIT. Next.js 16 PWA. Clerk. Serwist. Vercel.

## Pointers

- When a term is used → `docs/GLOSSARY.md`
- When handing work → `docs/templates/traveler.md`
- When the job ends → `docs/templates/packslip.md`
- When Non-conformance → `docs/templates/nonconformance.md`
- When operating → `docs/WORKFLOW.md` (procedure)
- When freezing GOAL → `docs/templates/goal-form.md`
- When validating GOAL hash → `docs/governance/README.md` (Goal canonicalization)
- When writing Next.js → `node_modules/next/dist/docs/` (version-matched).
- When naming the Operator → `docs/WORKFLOW.md` ## Start (typical first-name).

## Commands

Host first. Not traveler Instruction. Land suite at Release, in the traveler worktree.
Do not sandbox-first npm, Playwright, git, or committed `scripts/*.py`.
A script is not host-first until it is on HEAD and check is re-run from the host.
Missing Clerk auth env is blocked proof.

```text
npm run lint
npm run build
npm run test
npm run test:unit
npm run test:e2e
npm run test:e2e:auth
npm run governance:check
npm run test:governance
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
git diff --check origin/main...HEAD
git status --porcelain=v1
git branch --show-current
git rev-parse HEAD
```

## Boundaries

### Always

- One worktree + one branch. Engine and chrome stay split unless the GOAL names both.
- Read the traveler first. Do this operation's Instruction. No host commands in the traveler.
- Stay on Branch + Head. Create or switch is host work.
- Echo `flow_id` and `goal_sha256` when a goal is on.
- Post-bootstrap `GOAL.md` carries the v1 fence. Freeze stamp: `flow_id`, `goal_sha256`, hash match, one Active Goal.
- Preserve calculator math, AutoNest, FLiPIT identity, and V3 HTML + SPEC unless the GOAL or a new Owner decision names them.
- Secrets stay out of git. Operators fail-closed on governance files.
- One PR, one traveler. Completing an operation is not job-end.
- Job end is the packslip. Print it in the CLI. If a PR exists, post the same block on that PR.
- One real try. Progress → continue. No progress → one more pass. Still none → Non-conformance.
- Wrong branch, worktree, or repo is Corrective Action. Draft PR is not a stop.

### Never

- Touch `main` except checkout sync: fetch, switch, ff-only to `origin/main`. No edit, commit, push, or merge.
- Production, MODE, or identity without the Owner.
- Merge unless Release is cleared (repo-backed confidence and named criteria) and this traveler does not forbid merge.
- Invent the next operation. Soft-infer.
- Rewrite the traveler.
- Let Codex touch UI / chrome unless the traveler's Instruction names it.
- Emit a packslip for a Non-conformance.
- Act as Owner. Only wReckless is Owner.
- Silent job end (no packslip) is Non-conformance.

## Rails

- Quiet and freeze from WORKFLOW. No nestcalc-goal-grilling.
- If next is unknown → Owner.

Quality Control: Send for review → Wait → Inspection. When the PR is draft → `docs/WORKFLOW.md` ## Quality Control.
When Inspection is clean → `docs/WORKFLOW.md` ## Release.

## Roles

No Operator owns freeze, land, or a cycle. Owner starts the work and receives the packslip.
Typical first-name is a hint. The traveler Operator line is who runs this operation. Any named Operator may run a full cycle.

| Role | Who |
| --- | --- |
| Owner | wReckless only. Gates: Production, identity, MODE, land escalation. |
| Operator | Codex App |
| Operator | Codex CLI |
| Operator | Grok Build |

Do not auto-spawn Codex.

## Authority

1. This file + `docs/GLOSSARY.md`
2. Active `GOAL.md` — outcomes. Not a command list.
3. `docs/WORKFLOW.md`
4. `LESSONS_LEARNED.md`
5. V3 HTML + SPEC under `docs/howmany-v3-components/`

Traveler Instruction wins over GOAL for this operation.
Live GitHub wins mutable facts. Conversation memory is advisory.
`docs/governance/MODE` stays advisory until a dedicated promotion goal. Contracts still fail closed.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->
