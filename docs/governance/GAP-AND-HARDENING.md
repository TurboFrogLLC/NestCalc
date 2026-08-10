# NestCalc Governance Gap And Hardening

| Field | Value |
| --- | --- |
| Baseline reference | Superbrain `NT-20260729-goal-lifecycle-hardened-baseline` |
| Target authority | TurboFrogLLC/NestCalc (sole authority after write) |
| Wave | Governance harden only — no product, no AutoNest GOAL edit, no MODE flip |
| MODE after this wave | `advisory` (unchanged) |
| Contract posture after this wave | Enforce-grade contracts; zero soft inference |

## Inventory (pre-hardening)

| Surface | Pre-wave state | Gap vs Superbrain hardened baseline |
| --- | --- | --- |
| `docs/governance/MODE` | `advisory` | Correct retention; Superbrain installs enforce by design — NestCalc must not flip without promotion criteria |
| `scripts/nestcalc-governance.py` | Fail-closed validators; advisory bootstrap exception | Module prose said “advisory seam” (soft); closeout Flow ID was optional warning |
| Schemas + fixtures | Present and deterministic | Keep; no rewrite |
| `nestcalc-goal-grilling` | Stop before commit/CLI; `gpt-5.6-terra` medium lanes after Wave A routing alignment | Explicit evidence → confidence → decision → residual-risk loop; unavailable or mismatched routes never count as passing evidence |
| `AGENTS.md` / `docs/WORKFLOW.md` | Role and skill map | Soft “should” language; handoff/preflight not fail-closed against Superbrain B3/B4 pattern |
| Closeout B6–B9 | NestCalc-native Grok Build ladder | Keep; do not invent conflicting B codes |
| Enterprise long-tail (SBOM, env-proxy, golden pipeline) | Not present | Explicit non-goal — do not import |

## Soft language removed

| Soft phrasing (pre-wave) | Hardened contract |
| --- | --- |
| “Advisory governance seam” as if compliance is optional | Contracts are **enforce-grade**. `MODE=advisory` only relaxes the historical bootstrap exception and active-goal missing-metadata path. |
| “should follow” / “prefer when available” for governance steps | **MUST** run named gates; failure is a hard stop. |
| Goal-grilling “when available” fallback as normal path | `nestcalc-goal-grilling` is **required** for autonomous NestCalc goal prep. Generic grilling is outage fallback only and must be recorded as residual risk. |
| Closeout Flow ID optional warning | Flow ID is **required** in closeout breakdowns. |
| Promotion described vaguely | Exact criteria, evidence, and rollback path recorded below (not executed). |

## Hardened in this wave

1. `AGENTS.md` — authority order, protected surfaces, skill routing, fail-closed walls.
2. `docs/WORKFLOW.md` — goal cycle, B3-style handoff, B4-style preflight, B6–B9 closeout, fail-closed stops.
3. `docs/governance/README.md` — contract authority and MODE semantics.
4. `docs/governance/goal-lifecycle-contract.md` — product-agnostic lifecycle contract.
5. `.agents/skills/nestcalc-goal-grilling/SKILL.md` — evidence → confidence → decision → residual risk / flagged decisions; `gpt-5.6-terra` read-only lanes at medium reasoning effort; orchestrator write authority only.
6. `scripts/nestcalc-governance.py` — module contract language; required closeout Flow ID.
7. Tests updated for bootstrap exception (fixture, not live AutoNest GOAL) and Flow ID requirement.
8. This file — gap record + promotion path.

## Explicit non-changes

- `docs/governance/MODE` remains `advisory`.
- Active `GOAL.md` (AutoNest Per-Part Preview) is untouched.
- No calculator math, AutoNest engine, build specs, or product UI/behavior edits.
- No NanoTate product facts, UI tier enterprise long-tail, SBOM, or env-proxy as required gates.
- Command surface of `scripts/nestcalc-governance.py` unchanged (same subcommands).

## Promotion path: MODE advisory → enforce

**Do not execute the flip in this wave.** A future human-approved goal may flip MODE only when all criteria hold.

### Promotion criteria (all required)

1. Two complete NestCalc **product** PR cycles after governance install (or after this harden wave lands) finish with:
   - goal-memory commit distinct from implementation;
   - valid `create-handoff` artifact (prompt hash only);
   - ready-for-review PR (not draft);
   - `validate-closeout-breakdown` pass including Flow ID and section 8;
   - post-merge snapshot capture/verify clean when cleanup ran.
2. Zero false positives that forced operators to bypass contracts.
3. Zero secret or prompt-plaintext exposure in governance artifacts.
4. Zero manual contract workarounds (editing fixtures to “make check green,” skipping handoff, inventing Flow IDs mid-cycle).
5. `python3 scripts/nestcalc-governance.py check` and `npm run test:governance` green on `main` immediately before the flip goal freezes.
6. Separate goal-memory commit whose sole product of flip is `docs/governance/MODE` → `enforce` plus any required rollback doc touch — **no product files**.

### Flip procedure (future goal only)

1. Freeze a goal that names only governance MODE flip surfaces.
2. Confirm criteria 1–5 with cited PR numbers and check output.
3. Set `docs/governance/MODE` to exactly `enforce\n` (single token).
4. Run `python3 scripts/nestcalc-governance.py check` — must pass with `advisory_mode: false` and **no** bootstrap exception on active goal (active goal must carry full v1 metadata).
5. Open ready-for-review PR; closeout with section 8 `merge-ready` only after check evidence is posted.

### Rollback path

If enforce mode produces false blocks or operator deadlock:

1. Do **not** weaken schemas or validators silently.
2. Revert MODE only: set `docs/governance/MODE` to `advisory` in a dedicated docs commit on a feature branch + PR (or `git revert` of the flip commit).
3. Record residual risk and the false-positive case in `LESSONS_LEARNED.md` after merge.
4. Keep contracts enforce-grade in prose; only the MODE token rolls back.
5. Never auto-merge, force-push, or delete branches as part of rollback.

## Residual risks (this wave)

| Risk | Mitigation |
| --- | --- |
| Operators still treat MODE=advisory as “optional contracts” | README + AGENTS hard language; contracts fail closed on validation regardless of MODE |
| AutoNest GOAL remains active product scope | Untouched; governance wave must not expand into it |
| Superbrain B1–B5 codes confuse NestCalc B6–B9 | Lifecycle doc uses B3-style / B4-style labels; NestCalc B6–B9 remain sole numeric closeout stages |
| B4-style preflight requires confirming handoff `flow_id` / `goal_sha256` / `branch_intent`, but CLI has no revalidate-existing-handoff command | Explicit non-change this wave (command surface frozen). Operator/agent must confirm the gitignored handoff manually. **Follow-up goal:** add `validate-handoff --input …` (or equivalent) that compares stored handoff to current goal hash/branch without expanding product scope. |
| Closeout Flow ID is required shape-only; not bound to active goal or handoff identity | This wave only promotes Flow ID from optional warning → required error. Typos or cross-goal IDs still shape-pass. **Follow-up goal:** bind closeout Flow ID to active goal metadata and/or companion handoff artifact during `validate-closeout-breakdown`. |
