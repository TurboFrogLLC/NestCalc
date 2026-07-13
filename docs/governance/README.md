# NestCalc Governed Goal Pipeline v1

This repository-local module is an advisory governance seam. It binds one active
goal to a separate goal-memory commit, a sanitized Codex CLI handoff, a
`codex/` feature branch, a ready-for-review PR closeout, and a stale-state-safe
post-merge snapshot. It does not merge, delete branches, modify lessons, install
hooks, or change product behavior.

## Command Interface

All callers and tests use one interface:

```text
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
python3 scripts/nestcalc-governance.py create-handoff --prompt-file <local-file> --goal-memory-commit <sha> --output .nestcalc/governance/execution-handoff.json
python3 scripts/nestcalc-governance.py validate-closeout --input <closeout.json>
python3 scripts/nestcalc-governance.py validate-closeout-breakdown --input <closeout.md>
python3 scripts/nestcalc-governance.py capture-post-merge --pr-number <number> --branch <codex/branch> --lesson-state <none|pending|applied> --output .nestcalc/governance/post-merge.json
python3 scripts/nestcalc-governance.py verify-post-merge --input .nestcalc/governance/post-merge.json
```

Grok Build closeout uses the global `pr-closeout-breakdown` skill. Every posted
closeout comment must include sections 1–8, an Overall Assessment, and the
`END OF PR CLOSEOUT BREAKDOWN` sentinel. Section 8 merge disposition templates
live in `docs/governance/closeout-rollback-templates.md`. Lesson persistence
uses the canonical checkout per `docs/governance/lesson-persistence-example.md`.

`check` validates the manifest, schemas, valid fixtures, negative fixtures, and
the active goal. The active "NestCalc Governed Goal Pipeline v1" goal is the one
bootstrap exception: in advisory mode its missing v1 metadata is an explicit
warning, not a retrofit. Enforce mode fails closed.

## Goal Canonicalization

The v1 goal metadata is JSON between the exact
`nestcalc-governance:start`/`nestcalc-governance:end` comments. The canonical
goal hash is computed as follows:

1. Normalize CRLF and CR line endings to LF.
2. Remove trailing spaces from every line and ensure one final LF.
3. Parse the JSON metadata object.
4. Replace `goal_sha256` with the literal `sha256:<canonical>`.
5. Serialize the metadata with sorted keys, two-space indentation, and UTF-8.
6. Replace the original fenced JSON with that canonical serialization.
7. SHA-256 the complete normalized file and prefix the lowercase digest with
   `sha256:`.

This includes the goal body and every metadata field without hashing the hash
value itself. The active title in metadata must exactly match the single
`## Active Goal:` heading.

## Artifact Lifecycle And Privacy

- `GOAL.md` and `docs/governance/**` are committed authority.
- Generated handoff, closeout, and snapshot artifacts belong under
  `.nestcalc/governance/` and are gitignored.
- Handoffs store only the prompt hash. Prompt plaintext is never copied.
- Artifact validation rejects secret-like keys and values, Clerk/env material,
  private keys, bearer tokens, credentials, and prompt plaintext fields.
- Requested and observed read-only agent models are both recorded. A missing or
  mismatched required `gpt-5.4-mini` route is `unavailable` or `mismatch`; it is
  never passing evidence.

## Migration

The first goal prepared after this PR merges must copy
`docs/governance/goal-template-v1.md`, replace every placeholder, commit the goal
alone, update `goal_memory_commit` to that commit in a second goal-memory commit,
then run `validate-goal` and `create-handoff`. The goal-memory commit supplied to
`create-handoff` must exist, contain `GOAL.md`, contain no implementation path,
and predate implementation. The bootstrap goal in this PR remains unchanged.

## Advisory To Enforce Promotion

Keep `docs/governance/MODE` set to `advisory`. A separate human-approved goal may
promote it only after two real NestCalc product PR cycles complete without false
positives, missing evidence, secret exposure, or manual contract workarounds.
That promotion must include a rollback path and must not add automatic merge or
destructive cleanup.
