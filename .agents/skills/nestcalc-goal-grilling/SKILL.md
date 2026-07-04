---
name: nestcalc-goal-grilling
description: 'Prepare a NestCalc GOAL.md objective for CLI handoff: autonomous grilling, read-only gpt-5.4-mini sub-agents, no human questions, flagged decisions, and stop before commit or CLI prompt unless requested.'
---

# NestCalc Goal Grilling

Use this skill when preparing or refining a NestCalc `GOAL.md` objective before
Codex CLI execution.

## Workflow

1. Confirm repo state with `codex-repo-hygiene-gate`. Stop if dirty state is
   unrelated or unclear.
2. Read `AGENTS.md`, `GOAL.md` if present, `docs/WORKFLOW.md`,
   `LESSONS_LEARNED.md`, and task-specific files.
3. Use `ask-matt`, `codex-goal-prep`, and `grilling` as the governing flow, but
   do not ask the human questions during this autonomous pass.
4. Spawn bounded read-only sub-agents only for distinct evidence lanes. Launch
   every read-only sub-agent with model override `gpt-5.4-mini`; no other model
   is permitted for read-only evidence gathering in this cycle.
5. The main orchestrator owns reasoning, confidence, final decisions, and all
   writes. Sub-agents gather evidence only.
6. For each grilling question, decide from repo evidence. If evidence is
   insufficient or the choice is questionable, still choose the best path and
   record it as a flagged decision.
7. Iterate until every open question has either repo-backed evidence or a
   flagged decision. Do not continue looping after remaining uncertainty is
   explicitly flagged and non-blocking.
8. Update only `GOAL.md` unless the human explicitly asks for workflow docs or
   support files.
9. Run `git diff --check` and `git status --porcelain=v1`.
10. Stop before commit and before generating the CLI prompt unless the human
    asks for those next steps.

## Output

Report:

- Changed files.
- Validation run.
- Confidence level, stated against the concrete gate: no blocking questions
  remain and any residual uncertainty is flagged.
- Flagged decisions with the reason, decision, and consequence.
- Whether the next step is commit, CLI prompt generation, or more refinement.

## Guardrails

- Keep `GOAL.md` to one active objective.
- Do not execute implementation in chat unless explicitly asked.
- Do not commit `GOAL.md` until explicitly approved.
- Keep implementation files out of goal-memory commits.
- Repeat protected surfaces in the goal and prompt when relevant.
