# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "Path B - Authorize Plotter-Only ACS Rewriter, Then Fix",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "gcode-parser-and-safety",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "golden-fixtures-and-pure-tests",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "proof-scope-and-protected-surfaces",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/gcode-rotation-plotter-residual",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260801-385a107b",
  "goal_memory_commit": "9956e57ddc15f1bed7a14b876f4e6e32e1be9276",
  "goal_sha256": "sha256:02d7566c432c6be7a62534a12d6d445e5f4453bb2f1388185d4672801c9ee179",
  "protected_surfaces": [
    "calculator formulas and nesting behavior",
    "calculator UI layout and input behavior",
    "AutoNest engine session preview ranking counts trim-edge policies fallback guards and search budget",
    "nestcalc-app-state-v3 live scratch schema and unit conversion",
    "Clerk auth request-access policy routes secrets and Vercel settings",
    "PWA service worker offline shell manifest and runtime cache behavior",
    "repository governance files outside this goal-memory freeze and handoff",
    "docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep",
    "diagnosing-bugs",
    "tdd"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: Path B - Authorize Plotter-Only ACS Rewriter, Then Fix

### Objective

Ship one ready-for-review residual PR on
`codex/gcode-rotation-plotter-residual`. The residual first freezes the
plotter-only ACS contract in this file and `docs/ShopHelpers_Spec.md`, with a
goal-memory-only commit, then rewrites the pure G-code parser, transformer, and
serializer and fixes the four correctness/safety defects reproduced on the
current residual head. Do not merge product `main`.

This is a contract correction for the existing G-code module. It does not
reopen the named-preset, calculator, AutoNest, authentication, or PWA work
from the superseded product wave.

### Phase 0 — Goal-memory freeze

Before any source implementation edit:

1. Update this active goal and `docs/ShopHelpers_Spec.md` with the locked R4/R5
   plotter-only contract below.
2. Commit only `GOAL.md` and `docs/ShopHelpers_Spec.md`; preserve the existing
   user-owned `LESSONS_LEARNED.md` change and untracked `output/` artifacts.
3. Bind `goal_memory_commit` and `goal_sha256` in a follow-up goal-memory-only
   metadata commit, then validate the goal and create the sanitized B3-style
   handoff artifact.

No `src/`, `e2e/`, package, config, governance, or generated fixture path may
enter either goal-memory commit.

### Phase 1 — Implementation and focused proof

After the goal-memory commit and B4-style revalidation, update only the pure
G-code core and its pure tests. Preserve the existing conservative live
preview path: source parsing remains latest-only and angle changes rotate the
cached AABB corners without rewriting the full program.

### R4 — Plotter-only ACS input boundary

- The tool is a pure coordinate plotter / rewriter only.
- Transform only numeric X/Y endpoint values and numeric I/J arc-offset values
  around code origin `(0,0)` for recognized `G00`, `G01`, `G02`, and `G03`
  motion blocks.
- Leave every other token byte-for-byte: comments, `CALL`, `RET`, labels,
  `GOTO`, M-codes, `G40`, `G41D[CRC]`, `G200`, `M20001`, `M20002`, `ptp/ev`,
  whitespace, blank lines, and subroutines. ACS constructs are pass-through.
- Do not require or inject `G20`, `G21`, `G90`, or `G17` for Generate to
  succeed. Do not validate dialect completeness. Unknown non-target dialect
  text is opaque unless it is the explicit G53 safety case below.
- A recognized coordinate block uses the current modal X/Y endpoint values.
  Once both modal axes are known, a transformed block with an omitted X or Y
  emits the complete rotated X/Y pair before any trailing comment. If a
  required modal axis is still unknown, fail closed with a one-based line
  diagnostic rather than treating it as zero. No absent I/J word is invented;
  present numeric I/J offsets are rotated in place.
- Executable `G53` is rejected with a one-based line-specific diagnostic. Its
  numeric coordinates are never transformed. `G53` inside an opaque comment is
  pass-through.
- Scientific notation is accepted for numeric target words and must retain its
  magnitude through precision selection; `X1e-3` must not become `X0` after a
  quarter-turn.
- A center-format arc with I/J is transformed only after both modal start X/Y
  values are known. An unknown first arc start fails closed with a line-specific
  diagnostic.

### R5 — Rotation, serialization, and safety boundary

- Rotate endpoints as points and I/J as vectors:
  `x' = x*cos(theta) - y*sin(theta)` and
  `y' = x*sin(theta) + y*cos(theta)`. Preserve G02/G03 direction.
- Retain floating-point precision through parsing and transformation, then
  round once while serializing transformed numeric lexemes. Known `G20` output
  uses five fractional digits and known `G21` output uses four. Unknown-unit
  output selects enough fixed decimal precision to preserve finite magnitude;
  transformed output never uses exponent notation. Normalize negative zero.
- After rewriting, reparse the formatted stream and enforce center-format
  radius equality only for arcs that were actually transformed. Use the active
  unit tolerance of `0.0002` for inches and `0.002` for millimeters. Do not
  reject untouched non-target dialect text for lack of RS274 completeness.
- Generate is the only full rewrite path. Live preview remains a conservative
  AABB and never performs a full rewrite on every angle tick.

### Scope / Allowed Files

Goal-memory authority in Phase 0 may edit exactly:

- `GOAL.md`
- `docs/ShopHelpers_Spec.md`

Implementation authority after the goal-memory freeze is exactly:

- `src/lib/gcodeRotation.ts`
- `src/lib/gcodeRotation.test.ts`

The tests may contain five sanitized NC motion/control bodies extracted from
the local Reckless Toddler Vibe Images NestCalc fixture file. Headers and any
part, job, or drawing-revision identifiers are quarantined and must not appear
in repository files, logs, commit messages, PR text, or test names. The tests
must not depend on that external path at runtime.

Do not add dependencies or edit any other source, test, config, package, route,
fixture, screenshot, or governance path. Generated governance handoff output
may live under the gitignored `.nestcalc/governance/` directory only.

### Protected Surfaces

- `src/lib/nestcalc.ts`, calculator formulas, manual input behavior, and
  visible calculator result semantics.
- AutoNest engine, session, ranking, counts, trim-edge policies, fallback
  guards, search budget, and preview geometry.
- `nestcalc-app-state-v3` live scratch schema, migrations, and unit conversion.
- Calculator UI layout and input behavior.
- Clerk auth, request-access policy, routes, sign-in/sign-up behavior, secrets,
  `.env*`, deployment credentials, and Vercel settings.
- PWA service worker, offline shell, manifest, and runtime cache behavior.
- `docs/governance/MODE` and unrelated repository governance files.
- Native iOS work, machine connections, controller configuration, cloud sync,
  file upload, analytics, and deployment.
- The existing user-owned `LESSONS_LEARNED.md` modification and untracked
  `output/` directory are preserved and are not part of this residual.

### Required Proof

Phase 0:

```bash
git diff --check
python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md
git status --porcelain=v1
```

After the goal-memory commit and at final implementation head:

```bash
git diff --check
npm run governance:check
npm run lint
npm run test
npm run build
```

Focused pure proof in `src/lib/gcodeRotation.test.ts` must cover:

- five sanitized IPG LaserCube / ACS program bodies at `0°`, `90°`, and
  `−90°`, with zero diagnostics and only X/Y/I/J numeric changes;
- omitted-axis reconstruction after modal X/Y is known;
- explicit G53 rejection with a line-specific diagnostic;
- scientific-notation magnitude preservation;
- unknown first center-format arc start rejection;
- 0/90/−90 endpoint and I/J vector rotation, untouched-token preservation,
  conservative bounds, and post-format radius validation only on transformed
  arcs.

Run the focused suite explicitly as well:

```bash
npx vitest run src/lib/gcodeRotation.test.ts
```

Required proof failures are blockers. Do not claim a golden body is clean if
any diagnostic remains, and do not claim a P1 is fixed if its regression still
reproduces.

### Path B Decision Record

Evidence: the current residual head already contains the ACS pass-through
scanner and pure G-code test seam, while the required defects are localized to
the parser/serializer state and can be reproduced without calculator, auth,
PWA, or package changes. The existing goal's fail-closed RS274 matrix is the
wrong authority for the shop-floor plotter contract.

Confidence: freeze-ready. Required proof is reachable inside the Allowed Files,
the protected surfaces are explicit, and the current feature branch is not
`main`.

Decision: Path B expands the active goal authority to the plotter-only ACS
contract, chooses reject-with-diagnostic for executable G53, fails closed for
an unknown first arc start, and uses magnitude-aware fixed precision for
unknown-unit scientific notation. No absent I/J word is injected because the
contract preserves non-target and absent dialect tokens.

Flagged decisions / residual risks:

- The requested `gpt-5.4-mini` read-only sub-agent route is unavailable in this
  runtime; the orchestrator retains write authority and records no model-match
  evidence. CLI consequence: B4 must recheck the roster without inventing a
  receipt.
- The local fixture source is outside the repository; only sanitized
  motion/control bodies may be copied into tests. CLI consequence: inspect the
  final diff and search for identifying metadata before commit and PR creation.
- This residual does not claim controller-specific acceptance or dialect
  completeness. G53 rejection is the explicit safety boundary; all other
  non-target ACS text remains opaque.

### B3-Style Handoff / B4-Style Preflight

- After the goal-memory commit, create the durable handoff with
  `python3 scripts/nestcalc-governance.py create-handoff`; store prompt hash
  only.
- Before the first implementation edit, re-validate this goal and handoff,
  confirm the current branch equals `branch_intent`, recheck lessons and the
  Path B proof scope, and confirm no protected path is dirty from this goal.
- Do not merge product `main`. Publish one ready-for-review residual PR only.

### Stopping Condition

Stop and report blocked if goal-memory is not committed before implementation,
the branch is `main`, a protected surface would be edited, required proof
escapes Allowed Files, any golden body has a diagnostic, any P1 still
reproduces, a required command fails, or the final PR cannot be opened as one
ready-for-review residual PR. Never claim partial proof as pass and never merge.

### Final Report

Report the goal-memory commit SHA(s), branch and ready PR URL, clean-generation
confirmation for each of the five sanitized bodies at all three angles, a short
repro note for each fixed P1, changed/untouched files, exact verification
results, and residual risks. Do not include quarantined identifiers.
