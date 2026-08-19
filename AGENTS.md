<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — NestCalc

Repo NestCalc. Product FLiPIT. Next.js 16 PWA. Clerk. Serwist. Vercel.
Traveler: `docs/templates/traveler.md`. Packslip: `docs/templates/packslip.md`.
Procedure: `docs/WORKFLOW.md`. Routing here.

## Commands

Host first. Not traveler Instruction. Land suite at land, in the traveler worktree.
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
- Read the traveler first. Do the Instruction. No host commands in the traveler.
- Stay on Branch + Head. Create or switch is host or Orchestrator.
- Echo `flow_id` and `goal_sha256` when a goal is on.
- Post-bootstrap `GOAL.md` carries the v1 fence. Freeze stamp: `flow_id`, `goal_sha256`, hash match, one Active Goal.
- Preserve calculator math, AutoNest, FLiPIT identity, and V3 HTML + SPEC unless the GOAL or a new wReckless decision names them.
- Secrets stay out of git. Workers fail-closed on governance files. wReckless + SuperGrok may author them.
- When the named job ends, emit the packslip to wReckless. Merge or no merge. That return is not inventing a Surface.

### Never

- Touch `main` except checkout sync: fetch, switch, ff-only to `origin/main`. No edit, commit, push, or merge.
- Production, MODE, or identity without wReckless.
- Merge unless B8 continue is cleared (repo-backed confidence and named criteria).
- Invent the next Surface. Soft-infer. Import NanoTate golden-pipeline / SBOM / env-proxy as continue-gates.
- Mix engine and chrome unless the GOAL names both.
- Sandbox-first the host list. Fold host commands into the traveler.
- Let Codex touch UI / chrome unless the traveler names it.
- Finish a job silent. No packslip is Broken.

### Corrective Action

- **None** — no problem.
- **Correction** — known fix. Apply it. Continue.
- **Bent** — unknown break. Continue. Inspect later.
- **Broken** — hard gate. STOP. Problem only.

Hard gates: `main` (except checkout sync), Production, secrets, MODE, FLiPIT name, V3.
Wrong branch, worktree, or repo is Correction. Draft PR is not Broken.
Silent job end (no packslip) is Broken.

## Surfaces

wReckless owns the system. No Surface owns freeze, land, or a cycle.
Surface = station. Waypoint = intersection. Traveler = instruction sheet for the next station. Packslip = shipped receipt.
Typical first-name is a hint. Any named Surface may run a full cycle.

| Surface | Typical first-name |
| --- | --- |
| wReckless | Owner. Starts work. Receives the packslip. Gates: Production, identity, MODE, land escalation. |
| SuperGrok | Orchestrator only. May author governance. |
| Codex App | Product freeze and later coding. |
| Codex CLI | Full cycle, or escalate after no progress. |
| Grok Build | Docs freeze, docs work, B6–B9 land. |

B5 → B6 → B7 → B8 → B9 when independent review is named. B5 is the cut. B6 starts QC. Job closes at B9.
B6 waypoint change → stop. Listen/fix cap: initial + one. Unfixable → escalate.
B7–B9 travel as one package when repo-backed confidence and named criteria pass.
B8 on that clearance is not a wReckless seat. wReckless at land only on escalation.
If next cannot be named, next is wReckless.
When a PR exists, post the packslip on that PR at merge.
PR-write tiers: `docs/WORKFLOW.md` Land. Draft is a tier, not a start gate. Do not auto-spawn Codex.

## Authority

1. This file
2. Active `GOAL.md` — outcomes. Not a command list.
3. `docs/WORKFLOW.md`
4. `LESSONS_LEARNED.md`
5. V3 HTML + SPEC under `docs/howmany-v3-components/`

Traveler Instruction wins over GOAL for which operation runs now.
Live GitHub wins mutable facts. Conversation memory is advisory.
`docs/governance/MODE` stays advisory until a dedicated promotion goal. Contracts still fail closed.
