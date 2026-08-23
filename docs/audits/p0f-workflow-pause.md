# P0-F workflow pause

Date: 2026-08-23
PR: 108
Trace: NestCalc #108; pause P0-F free-tier; keep file; post #107

## Why paused

GitHub Actions on this repository hit a free-tier billing block (Actions minutes / payment). While that block is in place, `pull_request` auto-runs of P0-F consume minutes the account cannot pay for and fail closed at the provider.

Owner chose option B on #107: disable auto-run, keep the workflow machine in-tree for a later monthly restore. Do not delete the file. Do not invent a second CI system.

## What changed

File: `.github/workflows/p0-f-minimum-ci.yml`

- `on:` is `workflow_dispatch` only (was `pull_request`).
- All jobs and steps are unchanged (`p0f-lint`, `p0f-unit`, `p0f-build`, `p0f-governance`, `p0f-evidence`).
- The workflow file is retained.
- Pause-path evidence: `p0f-evidence` gates `github.event.pull_request.*` on `github.event_name == 'pull_request'`; `workflow_dispatch` uses `github.sha` / `github.event_name`.

P0-F no longer starts on pull request. Manual dispatch remains available when Actions minutes are restored enough for an on-demand run.

## How to restore

When minutes or payments allow:

1. In `.github/workflows/p0-f-minimum-ci.yml`, change `on:` back to `pull_request` (same shape as before this pause).
2. Keep the existing jobs and steps. Do not add a parallel CI workflow as a substitute.
3. If branch protection still lists required checks named `p0f-*`, Owner must clear or re-align those required-check names. A paused `workflow_dispatch`-only workflow will not report `p0f-lint` / `p0f-unit` / `p0f-build` / `p0f-governance` / `p0f-evidence` on pull requests; required checks with those names will stay pending or fail closed until Owner updates protection or restore lands.
