<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — NestCalc

Repo NestCalc. Product FLiPIT. Next.js 16 PWA. Clerk. Serwist. Vercel.
Terms: `docs/GLOSSARY.md`. Read it with this file.
Traveler: `docs/templates/traveler.md`. Packslip: `docs/templates/packslip.md`.
Non-conformance Report: `docs/templates/nonconformance.md`.
Procedure: `docs/WORKFLOW.md`. Routing here.

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

### Never

- Touch `main` except checkout sync: fetch, switch, ff-only to `origin/main`. No edit, commit, push, or merge.
- Production, MODE, or identity without the Owner.
- Merge unless Release is cleared (repo-backed confidence and named criteria) and this traveler does not forbid merge.
- Invent the next operation. Soft-infer. Import NanoTate golden-pipeline / SBOM / env-proxy as continue-gates.
- Rewrite the traveler.
- Mix engine and chrome unless the GOAL names both.
- Sandbox-first the host list. Fold host commands into the traveler.
- Let Codex touch UI / chrome unless the traveler's Instruction names it.
- Emit a packslip because an operation finished.
- Emit a packslip for a Non-conformance.
- Act as Owner. Only wReckless is Owner.

### Spot Check

- **None** — continue this operation.
- **Corrective Action** — find a way with known tools. Stay on this operation.
- **Non-conformance** — stop. Emit the Non-conformance Report. Wait.

One real try. Progress → continue. No progress → one more pass. Still none → Non-conformance.
Wrong branch, worktree, or repo is Corrective Action. Draft PR is not a stop.
Hard gates: `main` (except checkout sync), Production, secrets, MODE, FLiPIT name, V3.
Silent job end (no packslip) is Non-conformance.

## Roles

Terms are in `docs/GLOSSARY.md`. This table is who runs the work.
No Operator owns freeze, land, or a cycle. Owner starts the work and receives the packslip.
Typical first-name is a hint. Any named Operator may run a full cycle.

| Role | Who |
| --- | --- |
| Owner | wReckless only. Gates: Production, identity, MODE, land escalation. |
| Operator | Codex App. Product freeze and later coding. |
| Operator | Codex CLI. Full cycle, or escalate after no progress. |
| Operator | Grok Build. Docs freeze, docs work, Quality Control and Release. |

Quality Control, while the PR is draft: Send for review → Wait → Inspection.
If Inspection needs work: another Spot Check on this traveler, then Inspection again.
If no way: Non-conformance Report.
If Inspection is clean: Release. Merge unless this traveler forbids it. Then Close.
If next cannot be decided, next is the Owner.
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
