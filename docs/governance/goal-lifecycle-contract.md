# NestCalc Goal Lifecycle Contract (Harden-Grade)

| Field | Value |
| --- | --- |
| Posture | Enforce-grade contracts; zero soft inference |
| Runtime mode | `docs/governance/MODE` (`advisory` until promotion; see GAP-AND-HARDENING.md) |
| Authority | NestCalc repository files after write |

Written law is `AGENTS.md` and `docs/WORKFLOW.md`; terms are defined in
`docs/GLOSSARY.md`. This file is the lifecycle recipe checked by the Machine.
It does not assign an Owner gate to an Operator or pin Codex as the only route.

## Hard rules (fail-closed)

1. Exactly one active goal appears in `GOAL.md` (`## Active Goal:` once).
2. Post-bootstrap goals carry the `nestcalc-governance` v1 metadata block.
   Missing metadata is a hard error under `MODE=enforce`. Under
   `MODE=advisory`, only the historical bootstrap title
   `NestCalc Governed Goal Pipeline v1` may warn; all other goals hard-fail.
3. Canonical `goal_sha256` matches the computed hash (see README). A mismatch
   hard-fails.
4. Read-only evidence lanes record requested and observed models honestly.
   Status is `matched` | `mismatch` | `unavailable`; model mismatch is never
   passing evidence.
5. Goal-memory commits contain `GOAL.md` and no implementation paths under
   `src/`, `e2e/`, `public/`, `playwright/`, or the root package/config files
   listed in the governance script.
6. The execution sidecar stores a prompt hash only. Prompt plaintext fields and
   secret-like keys or values hard-fail.
7. `create-handoff` hard-fails on dirty `GOAL.md`, branch mismatch,
   goal-memory commit mismatch, or an invalid roster.
8. Completed closeout artifacts require an open, non-draft, ready-for-review
   NestCalc PR and distinct goal-memory and implementation commits.
9. The closeout breakdown contract retains its existing artifact sections,
   assessment signals, Flow ID, and reviewed-commit requirements.
10. Required proof is a subset of Allowed Files: use narrow proof with explicit
    residual debt, or expand Allowed Files in the same Freeze. There is no
    implicit third path.
11. The Operator retains write authority. Read-only agents gather evidence;
    they do not edit, commit, or decide scope.
12. Stop before a goal-memory commit or Traveler generation unless wReckless or
    the named Instruction asks for it.
13. Direct `main` implementation, automatic merge, force-push, branch deletion,
    and Production promotion are forbidden.

Secrets, hash mismatch, and more than one Active Goal remain hard failures.
Stale route or branch-prefix pins in schemas are a Corrective Action, not
permission to rewrite protected contracts.

## Lifecycle recipe

| Operation | Required result |
| --- | --- |
| Goal prep | Inspect repository hygiene, read authority, and mint or reuse `flow_id` in the `NC-YYYYMMDD-<8-hex>` format. |
| Freeze | Commit one active `GOAL.md` with v1 metadata, canonical `goal_sha256`, Allowed Files, protected surfaces, proof, and stopping condition. |
| Traveler | Carry one PR from start to end using `docs/templates/traveler.md`. |
| Packet | Current visit uses `docs/templates/packet.md`; its Instruction controls this operation. Management authors the packet. |
| Cut | Implement on the named branch, within Allowed Files, with the Freeze hash unchanged. A completed Cut is not job end. |
| Quality Control | While the PR is draft: Send for review (listen), then Inspection when planned. If Inspection needs work, next Plan + Cut, or Corrective Action on this visit when Mode is Specialist. |
| Release | With repo-backed confidence and named criteria satisfied, Merge unless the Traveler forbids it, then Close. |
| Job end | Emit the Packslip from `docs/templates/packslip.md` only after Close. Print it in the CLI and, when a PR exists, post the same block there. |
| Stopped operation | Emit the Non-conformance Report from `docs/templates/nonconformance.md`, leave Disposition blank. It is not a Packslip. |

No Operator owns Freeze, Release, or a cycle. Only wReckless is Owner. Merge is
permitted without a new Owner decision only when the Traveler allows it and the
repository supplies the required confidence and criteria. If the next operation
cannot be decided, the next decision returns to the Owner.

## Evidence and decision loop

```text
evidence → confidence → decision → residual risk / flagged decisions
```

1. **Evidence** — repository-backed facts from authority and bounded read-only lanes.
2. **Confidence** — state it against a concrete gate; invented or missing
   confidence is not clearance.
3. **Decision** — the Operator chooses only what the current operation permits.
4. **Residual risk / flagged decisions** — record uncertain choices with reason,
   decision, and consequence.

## Machine sidecar

The optional execution sidecar is not the Traveler. Its protected schema is
`docs/governance/schemas/execution-handoff.schema.json`; it contains bindings
and `prompt_sha256`, never prompt plaintext.

```bash
python3 scripts/nestcalc-governance.py create-handoff \
  --prompt-file <local-file> \
  --goal-memory-commit <sha> \
  --output .nestcalc/governance/execution-handoff.json
```

Current schema route and branch-prefix pins are leftover Machine encoding.
They do not override `AGENTS.md`, the packet, or the frozen GOAL, and this
contract does not authorize changing them.

## Preflight before Cut

1. Read the job traveler, the packet, `AGENTS.md`, `docs/GLOSSARY.md`, and `docs/WORKFLOW.md`.
2. Run `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md`.
3. Confirm packet and any sidecar bindings match `flow_id`, `goal_sha256`,
   branch, and head.
4. Identify relevant `L-nestcalc-*` lessons.
5. Confirm required proof is reachable within Allowed Files or record the
   explicitly frozen residual debt.
6. Run npm, Playwright, git, and committed scripts host-first.
7. Treat missing Clerk auth environment as blocked proof, never a pass.

A failed worker-local gate requires Corrective Action. Stay on the current
operation when a known path exists. If two passes make no progress, stop and
emit a Non-conformance Report.

## MODE semantics

| MODE | Contract validation | Active `GOAL.md` missing v1 metadata |
| --- | --- | --- |
| `advisory` | Schemas, fixtures, sidecar, and closeout contracts hard-fail as always. | The historical bootstrap title may warn; other goals hard-fail. |
| `enforce` | The same hard contracts apply. | Hard-fail. |

Promotion criteria and rollback are in `docs/governance/GAP-AND-HARDENING.md`.
