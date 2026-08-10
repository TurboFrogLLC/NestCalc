# GOAL.md - NestCalc

<!-- nestcalc-governance:start -->
```json
{
  "active_goal_title": "G-code reverse bounding box fills calculator part size",
  "agent_roster": {
    "orchestrator": "codex-cli",
    "read_only_agents": [
      {
        "lane": "source ownership and bridge",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "unit and golden span proof",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      },
      {
        "lane": "workflow and residual risk",
        "observed_model": null,
        "requested_model": "gpt-5.4-mini",
        "status": "unavailable"
      }
    ]
  },
  "branch_intent": "codex/gcode-fill-part-size",
  "execution_route": "codex-cli",
  "flow_id": "NC-20260809-156b2bb1",
  "goal_memory_commit": "197bf73eb8b2e36f61af6bb5db6cc3f7f7e37aa1",
  "goal_sha256": "sha256:91986132acc8c81179171c6e19a1b96e6c660479375e6d38b05f6304aafde028",
  "protected_surfaces": [
    "calculator math and NestResult formulas",
    "AutoNest packing ranking counts trim policies fallback guards and search budget",
    "Path B plotter-only ACS rewrite rules including G53 omitted-axis scientific-notation arc-start and opaque pass-through behavior",
    "Clerk auth request-access routes sign-up behavior secrets and deployment settings",
    "PWA and Serwist service-worker runtime cache behavior",
    "preset storage schema",
    "authenticated e2e suite",
    "repository governance files and docs/governance/MODE"
  ],
  "publication_route": "feature-pr",
  "repository": "TurboFrogLLC/NestCalc",
  "schema_version": "nestcalc-goal-v1",
  "skills": [
    "codex-repo-hygiene-gate",
    "nestcalc-goal-grilling",
    "codex-goal-prep",
    "lessons-aware-plan-scanner",
    "vercel-plugin:nextjs",
    "vercel-plugin:react-best-practices",
    "vercel-plugin:verification"
  ]
}
```
<!-- nestcalc-governance:end -->

## Active Goal: G-code reverse bounding box fills calculator part size

### Objective

After source G-code analysis succeeds, let the operator declare the program unit
with an `IN | MM` segmented switch and use one `Fill part size` control to copy
the source toolpath AABB spans into calculator `partWidth` and `partHeight`,
aligning the calculator unit to the declared unit so nesting can continue with
only the remnant or blank size left to enter.

Part size is source-bounds span only: `width = maxX - minX` and
`height = maxY - minY`. It never uses the rotated preview AABB.

### Scope / Allowed Files

- `GOAL.md` — this goal freeze and its metadata binding commits only.
- `docs/goals/*` — only if the existing NestCalc goal-memory pattern requires a
  snapshot or index row; no additional snapshot is currently required.
- `src/lib/gcodeRotation.ts` — export a pure `partSizeFromBounds` span helper;
  do not change parsing, rotation, or Path B rewrite behavior.
- `src/lib/gcodeRotation.test.ts` — cover finite non-negative spans, rejected
  invalid bounds, zero spans, and known spans from existing golden programs.
- `src/components/GCodeRotation.tsx` — add the `IN | MM` segmented switch, the
  `Fill part size` control, and an optional `onApplyPartSize` callback.
- `src/components/NestCalcApp.tsx` — thin callback bridge that updates existing
  manual `partWidth`, `partHeight`, and `unit` state only.
- `docs/ShopHelpers_Spec.md` — one short additive section documenting Path A
  fill behavior without rewriting the Path B rotation contract.

Implementation must preserve Generate, Copy, Download, source analysis,
rotation preview, and output-staleness behavior.

### Protected Surfaces

- Calculator math, `NestResult` formulas, and calculator input/layout behavior
  outside the thin G-code-to-part-size bridge.
- AutoNest engine packing, ranking, counts, trim-edge policies, fallback guards,
  and search budget.
- Path B plotter-only ACS rewrite rules: G53 rejection, omitted-axis emission,
  scientific notation, arc-start fail-closed behavior, opaque ACS pass-through,
  rotation precision, and output serialization.
- Clerk auth, request access, routes, sign-up behavior, secrets, deployment,
  Vercel project settings, and the authenticated e2e suite.
- PWA and Serwist service-worker/runtime-cache behavior.
- Preset storage schema, all unrelated repository governance files, and
  `docs/governance/MODE`.

### Required Proof

- `python3 scripts/nestcalc-governance.py validate-goal --goal GOAL.md` after
  goal metadata is bound to its goal-memory commit.
- `npm run governance:check` after the goal freeze.
- `npm run lint`.
- `npm run test` (or `npm run test:unit`), including the new span helper and
  existing `gcodeRotation` suite.
- `npm run build`.
- `git diff --check` and strict Allowed Files inspection before publication.

Authenticated Playwright and auth e2e are not required proof for this Path A
goal. The human will manually smoke the authenticated G-code flow.

### Grilling Decision Record

```text
evidence -> confidence -> decision -> residual risk / flagged decisions
```

- Evidence: `analyzeGCode()` already returns source `Bounds`, the G-code UI
  already shows min/max values, `NestInputs` already owns
  `partWidth`/`partHeight`/`unit`, and sanitized golden ACS bodies already prove
  line/arc analysis behavior.
- Confidence: high and freeze-ready. No blocking product question remains;
  required proof is reachable within Allowed Files under Path A.
- Decision: add only a pure span helper, segmented `IN | MM` declaration,
  fill control, thin parent-state bridge, focused tests, and additive spec text.
- Flagged decision — zero span: the helper may return a finite zero dimension,
  but `Fill part size` remains disabled unless both spans are strictly positive;
  consequence: line-only programs cannot overwrite calculator dimensions.
- Flagged decision — comment/header fallback: skip it because toolpath bounds
  are primary and comment parsing would expand scope; consequence: programs
  without analyzable motion remain unable to fill.
- Flagged decision — read-only evidence model: `gpt-5.4-mini` is unavailable in
  this runtime, so the orchestrator gathered the human-locked evidence directly
  and records all prescribed lanes as unavailable; consequence: no lane is
  claimed as matched evidence, but implementation remains bounded by the human
  freeze.
- Residual risk: G41/CRC-compensated motion may make the filled size slightly
  larger than nominal CAD; this is explicitly accepted. Authenticated browser
  proof remains human manual-smoke debt and is not represented as a pass.

### B3-Style Handoff / B4-Style Preflight

- Commit the goal freeze separately, bind `goal_memory_commit` in a second
  goal-memory-only commit, validate, then create the prompt-hash-only handoff
  with `python3 scripts/nestcalc-governance.py create-handoff`.
- Before the first product edit, revalidate the active goal, durable handoff,
  exact `codex/gcode-fill-part-size` branch, relevant lessons, and proof scope.
- Use host-first execution for git/GitHub network and any browser proof.

### Stopping Condition

Complete only after separate goal-memory and implementation commits, every
required proof passes, the branch is pushed, and a ready-for-review PR contains
Flow ID `NC-20260809-156b2bb1`, Allowed Files, proof, and explicit non-goals.
Stop blocked on any preflight, scope, validation, test, build, or publication
failure. Do not merge, deploy, flip MODE, force-push, or expand into Path B,
AutoNest, auth e2e, comment parsing, or production.
