# NestCalc Goal Lifecycle Contract (Harden-Grade)

| Field | Value |
| --- | --- |
| Posture | Enforce-grade contracts; zero soft inference |
| Runtime mode | `docs/governance/MODE` (`advisory` until promotion; see GAP-AND-HARDENING.md) |
| Superbrain reference | `NT-20260729-goal-lifecycle-hardened-baseline` (product-agnostic patterns only) |
| Authority | NestCalc repository files after write — Superbrain does not run NestCalc |

## Hard rules (fail-closed)

1. Exactly one active goal in `GOAL.md` (`## Active Goal:` once).
2. Post-bootstrap goals MUST carry the `nestcalc-governance` v1 metadata block. Missing metadata is a hard error under `MODE=enforce`. Under `MODE=advisory`, only the historical bootstrap title exception may warn; all other goals hard-fail.
3. Canonical `goal_sha256` MUST match the computed hash (see README). Mismatch hard-fails.
4. Read-only evidence lanes MUST request `gpt-5.6-terra` at medium reasoning effort. Status is `matched` | `mismatch` | `unavailable`. Matched without matching observed model hard-fails. Model mismatch is never pass evidence.
5. Goal-memory commits MUST contain `GOAL.md`, MUST NOT contain implementation paths under `src/`, `e2e/`, `public/`, `playwright/`, or root package/config implementation files listed in the governance script.
6. Execution handoff stores **prompt hash only**. Prompt plaintext fields and secret-like keys/values hard-fail.
7. `create-handoff` hard-fails on dirty/uncommitted `GOAL.md`, branch mismatch, goal-memory commit mismatch, or invalid roster.
8. Completed closeout requires open, non-draft, ready-for-review NestCalc PR and distinct goal-memory vs implementation commits.
9. Closeout breakdown MUST include sections 1–8, Overall Assessment, Flow ID, Reviewed commit, and `END OF PR CLOSEOUT BREAKDOWN`.
10. Assessment MUST align with section 8 signal (`merge-ready` / `suspend-merge` / `rollback-required`).
11. Required proof ⊆ Allowed Files (edit authority). Path A (narrow required proof / residual debt) or Path B (expand Allowed Files in the same freeze). No third path. No “require it and hope CLI fixes scope.”
12. Orchestrator retains write authority. Read-only sub-agents gather evidence only; they do not edit, commit, or decide scope.
13. Stop before goal-memory commit and before CLI prompt generation unless the human explicitly asks.
14. Direct main implementation is forbidden. Feature branch `codex/…` only.
15. No automatic merge, force-push, branch deletion, or production promote from governance tooling.

## Lifecycle map (no conflicting stage codes)

NestCalc closeout stages **B6–B9** remain the only numeric NestCalc stage codes.

| Phase | NestCalc name | Superbrain-aligned label | Gate |
| --- | --- | --- | --- |
| Goal prep | Goal prep | B1-aligned | Hygiene; mint/reuse `flow_id` `NC-YYYYMMDD-<8-hex>`; read authority |
| Goal freeze | Goal freeze | B2-aligned | Metadata + `goal_sha256` + protected surfaces + skills |
| Execution handoff | Execution handoff artifact | **B3-style** | `create-handoff` → `.nestcalc/governance/execution-handoff.json` (prompt hash only) |
| CLI preflight | CLI preflight | **B4-style** | Re-validate goal hash, handoff, branch, lessons; host-first for Playwright/git/gh |
| Implement | Implementation | — | Allowed Files only; protected surfaces untouched |
| Publish | Feature PR | B5-aligned | Ready-for-review PR on `codex/…` branch |
| Review | Grok Build review | **B6** | Scope, protected surfaces, verification evidence |
| Closeout | Grok Build closeout | **B7** | `pr-closeout-breakdown` + disposition validation |
| Merge | Human merge | **B8** | Human only |
| Post-merge | Cleanup + lessons | **B9** | Snapshot capture/verify; canonical lesson persistence |

Do not invent NestCalc stage codes B1–B5 that would collide with documentation. Use the NestCalc names above; “B3-style” / “B4-style” are Superbrain alignment labels only.

## Autonomous goal-grilling loop (required pattern)

```text
evidence → confidence → decision → residual risk / flagged decisions
```

1. **Evidence** — repo-backed facts from authority files and bounded read-only lanes (`gpt-5.6-terra` at medium reasoning effort only).
2. **Confidence** — stated against a concrete gate: no blocking questions remain; residual uncertainty is explicit.
3. **Decision** — orchestrator chooses scope, Allowed Files, required proof, and stop conditions.
4. **Residual risk / flagged decisions** — every uncertain choice records reason, decision, consequence for CLI.

Skill authority: `.agents/skills/nestcalc-goal-grilling/SKILL.md`.

## B3-style execution handoff (required fields)

Artifact schema: `docs/governance/schemas/execution-handoff.schema.json`.

- `flow_id`, `goal_sha256`, `goal_memory_commit`, `branch_intent`
- `execution_route: codex-cli`, `publication_route: feature-pr`
- `prompt_sha256` only (never prompt body)
- `agent_roster` with required model contract

Command:

```bash
python3 scripts/nestcalc-governance.py create-handoff \
  --prompt-file <local-file> \
  --goal-memory-commit <sha> \
  --output .nestcalc/governance/execution-handoff.json
```

## B4-style CLI preflight (required before implement)

Before first implementation edit, the execution layer MUST:

1. Read authority order in `AGENTS.md` / `docs/WORKFLOW.md`.
2. Run `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`.
3. Confirm durable B3-style handoff exists and matches current `flow_id` / `goal_sha256` / branch.
4. Confirm current branch equals `branch_intent`.
5. Identify relevant `L-nestcalc-*` lessons.
6. Confirm required proof is reachable inside Allowed Files (or Path A residual debt is recorded).
7. Host-first for Playwright, git network/credentials/`.git` locks, and `npm ci` — never sandbox-then-escalate for known host ops.
8. Treat missing Clerk auth env as **blocked auth proof**, never as a pass.

Fail any item → stop. Do not implement.

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
| `advisory` | Schemas, fixtures, handoff, closeout hard-fail as always | Bootstrap title exception may warn; other goals hard-fail |
| `enforce` | Same hard contracts | Hard-fail (no bootstrap exception) |

Promotion criteria and rollback: `docs/governance/GAP-AND-HARDENING.md`.
