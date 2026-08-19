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
- Start-check match traveler Branch + Head. Create or switch, then continue.
- Echo `flow_id` and `goal_sha256` every turn when a goal is on.
- Live post-bootstrap `GOAL.md` must carry the `nestcalc-governance` v1 block.
  `validate-goal` is the check. Recipe lives in `docs/WORKFLOW.md` and
  `docs/governance/`.
- Preserve calculator math and AutoNest unless the active GOAL names them.
- Preserve FLiPIT identity and V3 HTML + SPEC unless a new wReckless decision.
- Keep secrets, `.env*`, and production credentials out of git.
- Workers fail-closed on governance files. wReckless + SuperGrok may author them.

### Never

- Touch `main`.
- Merge, Production, MODE, or identity without the wReckless gate.
- Invent the next Surface.
- Soft-infer across authorities.
- Import NanoTate golden-pipeline, SBOM, or env-proxy as NestCalc continue-gates.
- Mix engine and chrome in one worktree unless the active GOAL names both.
- Sandbox-first the host-first list.

### Corrective Action

- **None** — no problem this step.
- **Correction** — known predetermined fix. Worker applies it, records it on
  the traveler, continues.
- **Bent** — missed, new, or unknown-cause break. Continue. wReckless + SuperGrok
  watch the flow and inspect prior waypoints. Harden later.
- **Broken** — known hard gate. STOP. Problem only. No correction.

Hard gates: `main`, Production, secrets, MODE, FLiPIT name, V3 authority.
Wrong branch or worktree is Correction, not Broken.

Elevated CA is wReckless + SuperGrok process harden. Workers do not open it.

## Surfaces

Surface = the station. Waypoint = the intersection. Traveler = the packet.
the-Feeler = the gap check. The waypoint chooses the Surface.
Preferred strengths are not walls.
Any worker may receive any named task the traveler authorizes.
Workers execute the received traveler. They do not invent the next Surface.
Do not call a person, Surface, or the-Feeler a traveler.

| Surface | Role |
| --- | --- |
| wReckless | Gates: Production, identity, MODE, and land escalation. Not an authority hop. Not a mid-ladder stop. |
| SuperGrok | Orchestrator only. No product implement. May author governance files. |
| Grok Build | Preferred implement and preferred B6–B9 land when named. |
| Codex App | Named implement when the traveler says so. May run the same land loop. |
| Codex CLI | Named implement or escalate after no progress. May run the same land loop. |

When independent review is named: B6 → B7 → B8 → B9.
B6 waypoint change → stop; do not enter B7.
B6 may listen and fix on the named Surface (cap: initial + one post-fix).
Preferred land worker is Grok Build. Codex App or Codex CLI may run that loop
when named. Unfixable after the cap → escalate (wReckless waypoint, or named
Codex).
B7 closeout, B8 merge, and B9 post-merge travel as one package when repo-backed
confidence and named criteria pass.
B8 is continuation, not a wReckless seat.
wReckless at land only on escalation: B6 waypoint change, failed or missing
confidence, failed criteria, or a hard gate.

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
wReckless is a gate, not an authority hop. Soft inference is forbidden.

`docs/governance/MODE` stays `advisory` until a dedicated wReckless promotion goal.
Contracts still fail closed. MODE does not make them optional.
