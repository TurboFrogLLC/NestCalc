<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all
differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — NestCalc

Repo name is NestCalc. Product name is FLiPIT.
Next.js 16 web PWA. Clerk auth. Serwist/PWA. Vercel.

Every surface output is a traveler (the handoff). See `docs/templates/handoff.md`.
Procedure lives in `docs/WORKFLOW.md`. Routing lives here.

## Commands

Host first. Do not sandbox-first for npm, Playwright, git, or committed
`scripts/*.py`. These commands are not traveler Instruction. The host runs
them in the traveler worktree. The land suite runs at land, not at every station.

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

A script written in this step is not host-first until it is on HEAD and
`python3 scripts/nestcalc-governance.py check` has been re-run from the host.

Missing Clerk auth env is blocked proof, not a pass.

## Boundaries

### Always

- One worktree + one branch per authorized scope.
- Engine and chrome do not share a worktree unless the active GOAL names both.
- Read the traveler first. Do the Instruction. Do not emit host commands in the traveler.
- Stay on traveler Branch + Head. Create or switch is host / Orchestrator, not worker Instruction.
- Echo `flow_id` and `goal_sha256` every turn when a goal is on.
- Live post-bootstrap `GOAL.md` must carry the `nestcalc-governance` v1 block.
  Freeze stamp is that fence: `flow_id`, `goal_sha256`, hash match, one Active Goal.
  Recipe lives in `docs/WORKFLOW.md` and `docs/governance/`.
- Preserve calculator math and AutoNest unless the active GOAL names them.
- Preserve FLiPIT identity and V3 HTML + SPEC unless a new wReckless decision.
- Keep secrets, `.env*`, and production credentials out of git.
- Workers fail-closed on governance files. wReckless + SuperGrok may author them.

### Never

- Touch `main`.
- Production, MODE, or identity without the wReckless gate.
- Merge unless B8 continue is already cleared (repo-backed confidence and named
  criteria). Merge without that clearance is a wReckless gate.
- Invent the next Surface.
- Soft-infer across authorities.
- Import NanoTate golden-pipeline, SBOM, or env-proxy as NestCalc continue-gates.
- Mix engine and chrome in one worktree unless the active GOAL names both.
- Sandbox-first the host-first list.
- Fold host commands into the traveler.
- Let Codex touch UI / chrome unless the traveler names it.

### Corrective Action

- **None** — no problem this step.
- **Correction** — known predetermined fix. Worker applies it, records it on
  the traveler, continues.
- **Bent** — missed, new, or unknown-cause break. Continue. wReckless + SuperGrok
  watch the flow and inspect prior waypoints. Harden later.
- **Broken** — known hard gate. STOP. Problem only. No correction.

Hard gates: `main`, Production, secrets, MODE, FLiPIT name, V3 authority.
Wrong branch, wrong worktree, or wrong repo is Correction, not Broken.
Opening a draft PR on the named branch is not a hard gate.

Elevated CA is wReckless + SuperGrok process harden. Workers do not open it.

## Surfaces

wReckless owns the system. No Surface owns freeze, land, or a cycle.
wReckless starts the work and names the Surface on the traveler.
Workers do not pick their own start.

Surface = the station. Waypoint = the intersection. Traveler = the packet.
the-Feeler = the gap check.
Typical first-name below is a hint, not a wall.
Any named Surface may run a full cycle when the traveler says so,
including freeze + implement + land.

| Surface | Typical first-name |
| --- | --- |
| wReckless | Owner. Starts the cycle. Gates: Production, identity, MODE, land escalation. |
| SuperGrok | Orchestrator only. No product implement. May author governance files. |
| Codex App | Often named for product goal freeze and later coding. |
| Codex CLI | Often named for a full cycle, or escalate after no progress. |
| Grok Build | Often named for docs freeze, docs work, and B6–B9 land. |

When independent review is named: B5 → B6 → B7 → B8 → B9.
B5 is the last production station. B6 starts QC. B6 waypoint change → stop;
do not enter B7.
B6 may listen and fix on the named Surface (cap: initial + one post-fix).
Land is often named Grok Build. Codex App or Codex CLI may run that loop
when named. Unfixable after the cap → escalate (wReckless waypoint, or named
Codex).
B7 closeout, B8 merge, and B9 post-merge travel as one package when repo-backed
confidence and named criteria pass.
B8 merge on that clearance is not a wReckless seat.
The job closes at B9.
wReckless at land only on escalation: B6 waypoint change, failed or missing
confidence, failed criteria, or a hard gate.

PR-write tiers live in `docs/WORKFLOW.md` Land.

Do not auto-spawn Codex.

## Authority

Read in this order. Later items do not override earlier ones unless the
active GOAL narrows scope.

1. This file
2. Active `GOAL.md` — scope and outcomes. Not a host command list.
3. `docs/WORKFLOW.md`
4. `LESSONS_LEARNED.md`
5. V3 HTML + SPEC under `docs/howmany-v3-components/` and related docs packages

This station's traveler Instruction wins over GOAL for which operation runs now.
GOAL does not add operations to the packet.

Live GitHub wins mutable facts. Conversation memory is advisory.
wReckless is a gate, not a later authority. Soft inference is forbidden.

`docs/governance/MODE` stays `advisory` until a dedicated wReckless promotion goal.
Contracts still fail closed. MODE does not make them optional.
