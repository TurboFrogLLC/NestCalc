# NestCalc Governed Goal Pipeline v1 (Harden-Grade)

This repository-local module is the enforce-grade Machine contract for NestCalc
goal lifecycle evidence. Contracts fail closed; Operators do not guess
compliance.

Written law is `AGENTS.md` and `docs/WORKFLOW.md`; terms are defined in
`docs/GLOSSARY.md`. The Machine checks that law. It is not a second authority.

`docs/governance/MODE` remains `advisory` until a separate Owner-authorized
promotion goal meets `GAP-AND-HARDENING.md`. MODE does not make contracts
optional. It controls only the historical bootstrap exception for the one
pre-v1 goal title `NestCalc Governed Goal Pipeline v1`.

Superbrain baseline `NT-20260729-goal-lifecycle-hardened-baseline` is a product-agnostic hardness reference. NestCalc files are sole authority after
write. NanoTate product facts and enterprise gates are not NestCalc gates.

## Authority map

| Document | Role |
| --- | --- |
| `AGENTS.md` | Routing, protected surfaces, roles, and hard boundaries |
| `docs/GLOSSARY.md` | Canonical role, operation, stamp, and artifact terms |
| `docs/WORKFLOW.md` | Procedure, Freeze contract, proof, Quality Control, and Release |
| `docs/templates/traveler.md` | One-PR Traveler and current-operation Instruction |
| `docs/templates/packslip.md` | Job-end receipt emitted only after Close |
| `docs/templates/nonconformance.md` | Stopped-operation report with blank Disposition |
| `docs/templates/goal-form.md` | Copy sheet for `GOAL.md` |
| `docs/governance/goal-lifecycle-contract.md` | Lifecycle recipe checked by the Machine |
| `docs/governance/GAP-AND-HARDENING.md` | Hardening record and MODE promotion or rollback criteria |
| `docs/governance/MODE` | `advisory` or `enforce` token only |
| `scripts/nestcalc-governance.py` | Single Machine command interface |
| Schemas under `docs/governance/schemas/` | Protected artifact contracts |

`docs/governance/manifest.json` pins required repository paths. In addition,
`validate_manifest` directly requires the glossary, Traveler, Packslip, and
Non-conformance Report template. Removing any one fails closed even if the
manifest's `required_paths` list is weakened.

## Lifecycle recipe

1. **Goal prep and Freeze** — inspect hygiene and authority; commit one active
   `GOAL.md` with v1 metadata, canonical hash, bounded outcomes, Allowed Files,
   protected surfaces, proof, and stopping condition.
2. **Traveler** — use `docs/templates/traveler.md` for the one PR. Its
   Instruction names the current operation and wins over GOAL for that
   operation.
3. **Cut** — implement on the named branch and head, within Allowed Files, with
   the Freeze hash unchanged. Finishing Cut is not job end.
4. **Quality Control** — keep the PR draft through Send for review, Wait, and
   Inspection. Findings return to another Spot Check on the same Traveler,
   followed by another Inspection.
5. **Release** — when repository evidence satisfies confidence and named
   criteria, Merge unless the Traveler forbids it, then Close.
6. **Packslip** — emit only at job end after Close. Print it in the CLI and, if
   a PR exists, post the same block on the PR.
7. **Non-conformance Report** — when the operation cannot progress after the
   required attempts, stop, emit `docs/templates/nonconformance.md` with blank
   Disposition, and wait. Never substitute a Packslip.

Only wReckless is Owner. Operators run the named operation; none owns Freeze,
Release, or a cycle. Production, identity, MODE, and unresolved escalation
remain Owner gates.

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

The Machine never merges, deletes branches, modifies lessons, installs hooks,
or changes product behavior.

`check` validates the manifest, schemas, valid fixtures, negative fixtures, and
active goal. Under `MODE=advisory`, only missing v1 metadata on the historical
bootstrap title may warn. Under `MODE=enforce`, it hard-fails. Every other
contract failure hard-fails in both modes.

## Goal canonicalization

The v1 goal metadata is JSON between the exact
`nestcalc-governance:start`/`nestcalc-governance:end` comments. The canonical
goal hash is computed as follows:

1. Normalize CRLF and CR line endings to LF.
2. Remove trailing spaces from every line and ensure one final LF.
3. Parse the JSON metadata object.
4. Replace `goal_sha256` with the literal `sha256:<canonical>`.
5. Serialize metadata with sorted keys, two-space indentation, and UTF-8.
6. Replace the original fenced JSON with that canonical serialization.
7. SHA-256 the complete normalized file and prefix the lowercase digest with
   `sha256:`.

The hash includes the goal body and every metadata field without hashing the
hash value itself. The metadata title exactly matches the single
`## Active Goal:` heading.

## Artifact lifecycle and privacy

- `GOAL.md` and `docs/governance/**` are committed authority.
- Generated sidecar, closeout, and snapshot artifacts belong under
  `.nestcalc/governance/` and are gitignored.
- The execution sidecar is not the Traveler. It stores bindings and a prompt
  hash only; prompt plaintext is never copied.
- Artifact validation rejects secret-like keys and values, Clerk or environment
  material, private keys, bearer tokens, credentials, and prompt plaintext.
- Requested and observed read-only agent models are recorded honestly. Missing
  or mismatched evidence is not passing evidence.
- Existing sidecar and closeout schemas remain protected; this lifecycle recipe
  does not change their shapes.

## Freeze and execution

Goals prepared under this contract copy
`docs/templates/goal-form.md`, replace every placeholder, commit the
goal alone, update `goal_memory_commit` in a second goal-memory commit, then run
`validate-goal`. When a sidecar is required, run `create-handoff` only after the
Freeze is valid.

The goal-memory commit supplied to `create-handoff` exists, contains `GOAL.md`,
contains no implementation path, and predates implementation. The Traveler,
not the sidecar, supplies the current operation. Do not edit an active product
GOAL as part of an unrelated governance wave.

## MODE promotion

Keep `docs/governance/MODE` set to `advisory` until the promotion criteria in
`GAP-AND-HARDENING.md` are met. Promotion is a separate Owner-authorized goal.
Rollback changes the MODE token only; it never silently weakens schemas.
