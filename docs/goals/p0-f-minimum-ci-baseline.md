# P0-F NestCalc Minimum CI Baseline

Parent: SuperBrain P0-F NestCalc child goal. This file is the NestCalc-local
acceptance/sequencing record for target-repository acceptance.

## Scope

This is a CI-only pilot, separate from and subordinate to the active G-code
product goal in the root `GOAL.md`. It does not replace or edit that active
goal, change product behavior, activate required checks, or touch SuperBrain.

The baseline runs on every `pull_request` with no path, branch, or commit-message
skip bypass and uses these stable job/command mappings:

- `p0f-lint`: `npm run lint` (format/lint coverage)
- `p0f-unit`: `npm test` (unit coverage)
- `p0f-build`: `npm run build` (typecheck/compile coverage)
- `p0f-governance`: `npm run governance:check`, `npm run test:governance`, and a
  thin deterministic local registry/mode assertion; no SuperBrain registry is
  copied into NestCalc
- `p0f-evidence`: PR number, head SHA, stable job names, results, and a manifest
  artifact named with the head SHA

The pilot remains main-based and CI-only. No branch-protection or required-check
activation is part of this child goal. P0-G is out of scope.

## Sequencing Record

- Base branch: `main`
- Base tip at branch creation: `bb131e8d310489d23f0ce35f2b9cf30ff684852e`
- Implementation branch: `codex/p0-f-minimum-ci-baseline`
- Local child commit: recorded by this file's first commit
- Target acceptance: pending the NestCalc test PR, final head-SHA evidence, and
  uploaded manifest artifact

## Protected Surfaces

Do not edit calculator math, nesting behavior, the active G-code goal, product
routes/auth/PWA behavior, governance MODE, SuperBrain, or unrelated user-owned
working-tree artifacts.
