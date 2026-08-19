# NestCalc Goal Lifecycle Contract (Harden-Grade)

| Field | Value |
| --- | --- |
| Posture | Enforce-grade contracts; zero soft inference |
| Runtime mode | `docs/governance/MODE` (`advisory` until promotion; see GAP-AND-HARDENING.md) |
| Superbrain reference | `NT-20260729-goal-lifecycle-hardened-baseline` (product-agnostic patterns only) |
| Authority | NestCalc repository files after write — Superbrain does not run NestCalc |

Written law is `AGENTS.md` and `docs/WORKFLOW.md`. This file is the recipe the
machine still checks. The checker is a waypoint against that law. It does not
define Surfaces or pin Codex as the only route.

## Hard rules (fail-closed)

1. Exactly one active goal in `GOAL.md` (`## Active Goal:` once).
2. Post-bootstrap goals MUST carry the `nestcalc-governance` v1 metadata block.
   Missing metadata is a hard error under `MODE=enforce`. Under `MODE=advisory`,
   only the historical bootstrap title `NestCalc Governed Goal Pipeline v1` may
   warn; all other goals hard-fail.
3. Canonical `goal_sha256` MUST match the computed hash (see README). Mismatch
   hard-fails.
4. Read-only evidence lanes record requested vs observed model honestly.
   Status is `matched` | `mismatch` | `unavailable`. Matched without matching
   observed model hard-fails. Model mismatch is never pass evidence.
5. Goal-memory commits MUST contain `GOAL.md`, MUST NOT contain implementation
   paths under `src/`, `e2e/`, `public/`, `playwright/`, or root package/config
   implementation files listed in the governance script.
6. Execution sidecar stores **prompt hash only**. Prompt plaintext fields and
   secret-like keys/values hard-fail.
7. `create-handoff` hard-fails on dirty/uncommitted `GOAL.md`, branch mismatch,
   goal-memory commit mismatch, or invalid roster.
8. Completed closeout requires open, non-draft, ready-for-review NestCalc PR and
   distinct goal-memory vs implementation commits.
9. Closeout breakdown MUST include sections 1–8, Overall Assessment, Flow ID,
   Reviewed commit, and `END OF PR CLOSEOUT BREAKDOWN`.
10. Assessment MUST align with section 8 signal (`merge-ready` /
    `suspend-merge` / `rollback-required`).
11. Required proof ⊆ Allowed Files (edit authority). Path A (narrow required
    proof / residual debt) or Path B (expand Allowed Files in the same freeze).
    No third path.
12. Orchestrator retains write authority. Read-only sub-agents gather evidence
    only; they do not edit, commit, or decide scope.
13. Stop before goal-memory commit and before CLI prompt generation unless
    wReckless or the named handoff asks.
14. Direct main implementation is forbidden.
15. No automatic merge, force-push, branch deletion, or production promote from
    governance tooling.

Secrets, hash mismatch, and more than one Active Goal stay Broken.
Stale Codex-only route or `codex/` branch pins in the current machine are a
waypoint (Correction), not Broken. Schema rewrite is a later pass.

## Lifecycle map (no conflicting stage codes)

NestCalc closeout stages **B6–B9** remain the only numeric NestCalc stage codes.

| Phase | NestCalc name | Gate |
| --- | --- | --- |
| Goal prep | Goal prep | Hygiene; mint/reuse `flow_id` `NC-YYYYMMDD-<8-hex>`; read authority |
| Goal freeze | Goal freeze | v1 metadata + `goal_sha256` + protected surfaces + skills |
| Traveler | Handoff | `docs/templates/handoff.md` three-band block |
| Machine sidecar | `create-handoff` | `.nestcalc/governance/execution-handoff.json` (prompt hash only) |
| Preflight | Worker-local gates | Re-validate goal hash, sidecar, branch, lessons; host-first |
| Implement | Implementation | Allowed Files only; protected surfaces untouched |
| Publish | Feature PR | Ready-for-review unless wReckless asks for draft |
| Review | B6 | Named Surface; preferred Grok Build; listen/fix cap |
| Closeout + merge + hygiene | B7 + B8 + B9 | One package when repo-backed confidence and named criteria pass |

B8 is continuation, not a wReckless seat. wReckless at land only on
escalation: B6 waypoint change, failed or missing confidence, failed criteria,
or a hard gate.

Do not invent NestCalc stage codes B1–B5.

## Autonomous goal-grilling loop (required pattern)

```text
evidence → confidence → decision → residual risk / flagged decisions
```

1. **Evidence** — repo-backed facts from authority files and bounded read-only lanes.
2. **Confidence** — stated against a concrete gate: no blocking questions remain;
   residual uncertainty is explicit. Invented confidence is not clearance.
3. **Decision** — orchestrator chooses scope, Allowed Files, required proof, and
   stop conditions.
4. **Residual risk / flagged decisions** — every uncertain choice records reason,
   decision, consequence.

Skill authority: `.agents/skills/nestcalc-goal-grilling/SKILL.md`.

## Machine sidecar (required fields)

Artifact schema: `docs/governance/schemas/execution-handoff.schema.json`.
This is not the traveler.

- `flow_id`, `goal_sha256`, `goal_memory_commit`, `branch_intent`
- `prompt_sha256` only (never prompt body)
- `agent_roster` with honest model contract

Command:

```bash
python3 scripts/nestcalc-governance.py create-handoff \
  --prompt-file <local-file> \
  --goal-memory-commit <sha> \
  --output .nestcalc/governance/execution-handoff.json
```

Current schema still pins `execution_route: codex-cli` and `branch_intent: ^codex/`.
That pin is leftover machine encoding. Do not treat it as Surface law.

## Preflight (required before implement)

Before first implementation edit, the named Surface MUST:

1. Read authority order in `AGENTS.md` / `docs/WORKFLOW.md`.
2. Run `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`.
3. Confirm the traveler bindings and, when present, the sidecar match current
   `flow_id` / `goal_sha256` / branch.
4. Confirm current branch equals the handoff Branch.
5. Identify relevant `L-nestcalc-*` lessons.
6. Confirm required proof is reachable inside Allowed Files (or Path A residual
   debt is recorded).
7. Host-first for Playwright, git network/credentials/`.git` locks, and `npm` —
   never sandbox-then-escalate for known host ops.
8. Treat missing Clerk auth env as **blocked auth proof**, never as a pass.

Fail any item → apply Corrective Action. Broken is STOP.

## Thin path / non-goals

NestCalc does **not** require NanoTate enterprise long-tail as gates:

- golden pipeline / SBOM / supply-chain scanners
- env-proxy gates
- UI-tier mechanical thin process from NanoTate product docs
- Superbrain runtime mode flips

Product-agnostic hardness only. NestCalc remains sole authority.

## MODE semantics

| MODE | Contract validation | Active `GOAL.md` missing v1 metadata |
| --- | --- | --- |
| `advisory` | Schemas, fixtures, sidecar, closeout hard-fail as always | Bootstrap title exception may warn; other goals hard-fail |
| `enforce` | Same hard contracts | Hard-fail (no bootstrap exception) |

Promotion criteria and rollback: `docs/governance/GAP-AND-HARDENING.md`.
