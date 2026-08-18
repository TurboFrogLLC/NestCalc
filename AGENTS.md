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

Every surface output is a handoff. See `docs/templates/handoff.md`.
Procedure lives in `docs/WORKFLOW.md`. Routing lives here.

## Commands

Host first. Do not sandbox-first for npm, Playwright, git, or committed
`scripts/*.py`.

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
```

A script written in this step is not host-first until it is on HEAD and
`python3 scripts/nestcalc-governance.py check` has been re-run from the host.

Missing Clerk auth env is blocked proof, not a pass.

## Boundaries

### Always

- One worktree + one branch per authorized scope.
- Engine and chrome do not share a worktree unless the active GOAL names both.
- Start-check match handoff Branch + Head. Create or switch, then continue.
- Echo `flow_id` and `goal_sha256` every turn when a goal is on.
- Preserve calculator math and AutoNest unless the active GOAL names them.
- Preserve FLiPIT identity and V3 HTML + SPEC unless a new Human decision.
- Keep secrets, `.env*`, and production credentials out of git.
- Workers fail-closed on governance files. Human + SuperGrok may author them.

### Never

- Touch `main`.
- Merge, Production, MODE, or identity without the Human gate.
- Invent the next Surface.
- Soft-infer across authorities.
- Import NanoTate golden-pipeline, SBOM, or env-proxy as NestCalc continue-gates.
- Mix engine and chrome in one worktree unless the active GOAL names both.
- Sandbox-first the host-first list.

### Corrective Action

- **None** — no problem this step.
- **Correction** — known predetermined fix. Worker applies it, records it on
  the handoff, continues.
- **Bent** — missed, new, or unknown-cause break. Continue. Human + SuperGrok
  watch the flow and inspect prior waypoints. Harden later.
- **Broken** — known hard gate. STOP. Problem only. No correction.

Hard gates: `main`, Production, secrets, MODE, FLiPIT name, V3 authority.
Wrong branch or worktree is Correction, not Broken.

Elevated CA is Human + SuperGrok process harden. Workers do not open it.

## Surfaces

Surface = the step. Waypoint = the intersection. Handoff = the copyable block.
The waypoint chooses the Surface. Preferred strengths are not walls.
Any worker may receive any named task the handoff authorizes.
Workers execute the received handoff. They do not invent the next Surface.

| Surface | Role |
| --- | --- |
| Human | Gates: merge, Production, identity, MODE. Not an authority hop. |
| SuperGrok | Orchestrator only. No product implement. |
| Grok Build | Preferred implement / review+closeout when named. |
| Codex App | Named implement when the handoff says so. |
| Codex CLI | Named implement or escalate after no progress. |

When independent review is named: B6 → B7 → B8.
B6 waypoint change → stop; do not enter B7.
B7 and B8 travel together. B8 is Human.
Grok Build may do B6+B7 one pass on the same authorized head only when B6
has no waypoint change.

Escalate Grok Build → Codex CLI after real tries with no progress.
Do not auto-spawn Codex.

## Authority

Read in this order. Later items do not override earlier ones unless the
active GOAL narrows scope.

1. This file
2. Active `GOAL.md`
3. `docs/WORKFLOW.md`
4. `LESSONS_LEARNED.md`
5. V3 HTML + SPEC under `docs/howmany-v3-components/` and related docs packages

Live GitHub wins mutable facts. Conversation memory is advisory.
Human is a gate, not an authority hop. Soft inference is forbidden.

`docs/governance/MODE` stays `advisory` until a dedicated Human promotion goal.
Contracts still fail closed. MODE does not make them optional.
