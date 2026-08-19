# NestCalc Governed Goal Pipeline v1 (Harden-Grade)

This repository-local module is the **enforce-grade** governance contract for
NestCalc goal lifecycle evidence. Contracts fail closed. Soft inference is
forbidden: agents do not guess compliance.

Written law is `AGENTS.md` and `docs/WORKFLOW.md`. The script is a mechanical
check of that law. It is a waypoint, not a second authority.

`docs/governance/MODE` remains **`advisory`** until a separate wReckless
promotion goal meets the criteria in `GAP-AND-HARDENING.md`. MODE does **not**
make contracts optional. MODE only controls the historical bootstrap exception
for missing v1 metadata on the one pre-v1 goal title
(`NestCalc Governed Goal Pipeline v1`).

Superbrain baseline `NT-20260729-goal-lifecycle-hardened-baseline` is the
product-agnostic hardness reference. NestCalc files are sole authority after
write. Do not import NanoTate product facts, UI, SBOM, env-proxy, or other
enterprise long-tail as required NestCalc gates.

## Authority map

| Document | Role |
| --- | --- |
| `AGENTS.md` | Routing, protected surfaces, Surfaces |
| `docs/WORKFLOW.md` | Procedure, v1 MUST, land loop |
| `docs/templates/handoff.md` | Traveler |
| `docs/governance/goal-lifecycle-contract.md` | Recipe the machine still checks |
| `docs/governance/GAP-AND-HARDENING.md` | Soft→hard record + MODE promotion/rollback |
| `docs/governance/MODE` | `advisory` \| `enforce` token only |
| `scripts/nestcalc-governance.py` | Single command interface |
| Schemas under `docs/governance/schemas/` | Machine contracts |

## Command interface

All callers and tests use one interface:

```text
python3 scripts/nestcalc-governance.py check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
python3 scripts/nestcalc-governance.py create-handoff --prompt-file <local-file> --goal-memory-commit <sha> --output .nestcalc/governance/execution-handoff.json
python3 scripts/nestcalc-governance.py validate-closeout --input <closeout.json>
python3 scripts/nestcalc-governance.py validate-closeout-breakdown --input <closeout.md>
python3 scripts/nestcalc-governance.py capture-post-merge --pr-number <number> --branch <branch> --lesson-state <none|pending|applied> --output .nestcalc/governance/post-merge.json
python3 scripts/nestcalc-governance.py verify-post-merge --input .nestcalc/governance/post-merge.json
```

The tool never merges, deletes branches, modifies lessons, installs hooks, or
changes product behavior.

`check` validates the manifest, schemas, valid fixtures, negative fixtures, and
the active goal. Under `MODE=advisory`, missing v1 metadata on the historical
bootstrap title only is a warning. Under `MODE=enforce`, missing metadata
hard-fails. All other contract failures hard-fail in both modes.

## Goal canonicalization

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

## Artifact lifecycle and privacy

- `GOAL.md` and `docs/governance/**` are committed authority.
- Generated sidecar, closeout, and snapshot artifacts belong under
  `.nestcalc/governance/` and are gitignored.
- Sidecars store only the prompt hash. Prompt plaintext is never copied.
- Artifact validation rejects secret-like keys and values, Clerk/env material,
  private keys, bearer tokens, credentials, and prompt plaintext fields.
- Requested and observed read-only agent models are both recorded. A missing
  route is `unavailable`; a differing observed model is `mismatch`; neither is
  passing evidence.

## Traveler vs sidecar

- **Traveler:** `docs/templates/handoff.md`. This is the Surface interface.
- **Sidecar:** `create-handoff` JSON. Prompt hash and bindings only.
- Current sidecar schema still pins `execution_route: codex-cli` and
  `branch_intent: ^codex/`. That is leftover encoding. Surface law is AGENTS.
  Schema rewrite is a later pass.

NestCalc numeric stage codes **B6–B9** remain the land ladder.
B8 is continuation when repo-backed confidence and named criteria pass.
wReckless is escalation only.

Grok Build is the preferred land worker. Codex App or Codex CLI may run the
same listen/fix/cap loop when named. Closeout comments still use the global
`pr-closeout-breakdown` shape until that contract is rewritten: sections 1–8,
Overall Assessment, Flow ID, Reviewed commit SHA, and
`END OF PR CLOSEOUT BREAKDOWN`.

## Migration

Goals prepared under this contract MUST copy
`docs/governance/goal-template-v1.md`, replace every placeholder, commit the goal
alone, update `goal_memory_commit` to that commit in a second goal-memory commit,
then run `validate-goal` and, when a sidecar is required, `create-handoff`.
The goal-memory commit supplied to `create-handoff` MUST exist, contain
`GOAL.md`, contain no implementation path, and predate implementation.

Do not edit an active product GOAL as part of a governance-only wave.

## MODE promotion

Keep `docs/governance/MODE` set to `advisory` until promotion criteria in
`GAP-AND-HARDENING.md` are met. Promotion is a separate wReckless goal.
Rollback is MODE token only; do not silently weaken schemas.
