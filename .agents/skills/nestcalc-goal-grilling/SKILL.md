---
name: nestcalc-goal-grilling
description: >-
  Prepare a NestCalc GOAL.md for CLI handoff with enforce-grade autonomous grilling:
  evidence → confidence → decision → residual risk / flagged decisions; read-only
  gpt-5.4-mini sub-agents; orchestrator write authority only; stop before commit or
  CLI prompt unless the human asks.
---

# NestCalc Goal Grilling (Harden-Grade)

Use this skill when preparing or refining a NestCalc `GOAL.md` objective before
Codex CLI execution.

**Contract authority:** `docs/governance/goal-lifecycle-contract.md`,
`docs/governance/README.md`, `AGENTS.md`, `docs/WORKFLOW.md`. Soft inference is
forbidden. This skill is **required** for autonomous NestCalc goal prep. Generic
grilling is outage fallback only and MUST be recorded as residual risk.

## Decision loop (mandatory)

```text
evidence → confidence → decision → residual risk / flagged decisions
```

Every open question ends in repo-backed evidence **or** a flagged decision.
Do not freeze with silent uncertainty.

## Workflow

1. Confirm repo state with `codex-repo-hygiene-gate`. **Stop** if dirty state is
   unrelated or unclear. Do not guess dirt is “fine.”
2. Read `AGENTS.md`, `GOAL.md` if present, `docs/WORKFLOW.md`,
   `LESSONS_LEARNED.md`, `docs/governance/goal-lifecycle-contract.md`, and
   task-specific source. Do not edit the active product GOAL when the human
   requested a different wave (for example governance-only).
3. Use `ask-matt`, `codex-goal-prep`, and this skill as the governing flow.
   Do **not** ask the human grilling questions during the autonomous pass.
4. Spawn bounded **read-only** sub-agents only for distinct evidence lanes
   (source ownership, tests, lessons/workflow, Clerk/PWA proof, browser risk).
   Launch every read-only sub-agent with model override **`gpt-5.4-mini`**.
   No other model is permitted for read-only evidence gathering in this cycle.
5. The main orchestrator owns reasoning, confidence, final decisions, and all
   writes. Sub-agents gather evidence only. Sub-agents do not edit files,
   create commits, mint Flow-IDs, or expand scope.
6. For each grilling question:
   - Collect **evidence** (paths, tests, lessons, commands).
   - State **confidence** against the concrete gate below.
   - Record the **decision**.
   - If evidence is incomplete or the choice is risky, still choose the best
     scoped path and record a **flagged decision** (reason, decision, CLI
     consequence) plus residual risk.
7. **Required proof ⊆ Allowed Files (edit authority) — hard freeze reject.**
   - If any required proof can fail for a reason this goal is not allowed to
     fix: **do not freeze**.
   - Human path before freeze (no third path):
     - **Path A:** narrow required proof; residual debt for a later wave.
     - **Path B:** expand Allowed Files in the same freeze so every required
       title is fixable.
   - Forbidden: “require it anyway and hope CLI expands scope.”
8. Iterate until every open question has evidence or a flagged decision. Stop
   looping once no blocking questions remain and all residual uncertainty is
   explicitly flagged. Do not chase a performative 100% claim.
9. Update only `GOAL.md` unless the human explicitly asked for workflow or
   governance docs. Emit full v1 `nestcalc-governance` metadata for any new
   post-bootstrap goal. Recompute `goal_sha256` after body edits.
10. Run `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`
    when metadata is present. Run `git diff --check` and
    `git status --porcelain=v1`.
11. **Stop** before commit and before generating the CLI prompt unless the human
    asks for those next steps.

## Concrete confidence gate

Confidence is freeze-ready only when:

- no blocking questions remain;
- every residual uncertainty is a flagged decision with reason, decision, and
  consequence;
- required proof ⊆ Allowed Files (Path A or Path B applied);
- protected surfaces are explicit and non-empty;
- single active goal title matches metadata when metadata is present.

## Output (required report)

Report all of:

- Changed files.
- Evidence lanes run (lane name + model `gpt-5.4-mini` + status).
- Validation run (`validate-goal` when applicable, `git diff --check`, status).
- Confidence against the concrete gate above.
- Flagged decisions and residual risks (reason, decision, consequence).
- Path A/B outcome if proof-scope conflict existed.
- Whether the next step is commit, CLI prompt (B3-style handoff), or more
  refinement.

## Guardrails

- Keep `GOAL.md` to one active objective.
- Do not execute implementation in chat unless explicitly asked.
- Do not commit `GOAL.md` until explicitly approved.
- Keep implementation files out of goal-memory commits.
- Repeat protected surfaces in the goal and thin CLI prompt when relevant.
- Do not flip `docs/governance/MODE`.
- Do not invent NestCalc stage codes that conflict with B6–B9 closeout stages.
  Handoff is B3-style; preflight is B4-style (see lifecycle contract).
- Host-first for known host ops in preflight language carried into goals
  (Playwright, git/gh network and credentials, `npm ci`).
