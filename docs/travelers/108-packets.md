# 108 packets — NGJ-20260823-p0f-pause

Pause P0-F pull_request trigger (free-tier). Checkout sync is Owner terminal.

## Station: Cut

### Ops Packet

- Repo: NestCalc
- Station: Cut
- Mode: Worker
- Operator: Grok Build
- Branch: docs/p0f-workflow-pause
- Head in: e5a23c86619dd2cbbd751ad6fb5c23ee7e2ddbf3
- job_id: NGJ-20260823-p0f-pause
- flow_id: —
- goal_sha256: —
- Trace: NestCalc #108; pause P0-F free-tier; keep file; post #107
- Instruction: Done when P0-F no longer auto-runs on pull_request; workflow file retained; audit documents pause + restore; Seq Cut stamped; Still open / Next = Send for review.

### Facts return

- `.github/workflows/p0-f-minimum-ci.yml`: `on:` is `workflow_dispatch` only; jobs and steps kept; file not deleted; no second CI system.
- `docs/audits/p0f-workflow-pause.md`: written (why = free-tier billing block / #107; what changed; restore = `on: pull_request` when minutes/payments allow; Owner must clear required-check names if protection still lists `p0f-*`).
- `docs/travelers/108.md`: Cut row stamped `8c43e486fa82f5045b1ed4551671c04ea77c5779`; Still open / Next = Send for review.
- Not done this Station: Send for review, Wait, Inspection, Merge, Close, ready, packslip.
