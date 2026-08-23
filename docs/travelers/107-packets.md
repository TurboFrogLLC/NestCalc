# 107 packets — NGJ-20260823-p0f

P0-F runner residual. Checkout sync is Owner terminal.

## Seq 2 Cut — Ops Packet

```
Repo: NestCalc
Station: Cut
Mode: Worker
Operator: Grok Build
Branch: docs/p0f-runner-residual
Head: 025e7bb28b690c0aec30331fc846c0865db08d7d
job_id: NGJ-20260823-p0f
flow_id: —
goal_sha256: —
Trace: NestCalc #107; P0-F runner residual; NCMR-MGMT-20260823-01
Model: Grok 4.6
Effort: medium
Session: fresh
```

Instruction (this Station): Facts-only diagnosis of why p0f-* jobs show `runner_id` 0 and 0 steps; write `docs/audits/p0f-runner-residual.md`; stamp Cut; Still open / Next = Send for review. Workflow read-only unless YAML is the failure.

## Seq 2 Cut — Facts return

- Branch `docs/p0f-runner-residual` @ `025e7bb28b690c0aec30331fc846c0865db08d7d` (pre-Cut files).
- Sampled P0-F via `gh` + Actions API. Latest 20 runs: all `failure`, 7–9 s. PR 107 run [32661407604](https://github.com/TurboFrogLLC/NestCalc/actions/runs/32661407604) (head `025e7bb`): five jobs, each `runner_id` 0, `steps` 0, billable 0 ms. Logs 404/`BlobNotFound`.
- Check-run annotation: job not started because recent account payments failed or spending limit needs increase.
- YAML `.github/workflows/p0-f-minimum-ci.yml` not rewritten: same file assigned runners and executed 6–10 steps on success run 32551786132 (2026-08-22).
- Out: `docs/audits/p0f-runner-residual.md` (symptoms, evidence, Owner checklist: Actions enablement / minutes / spending limit; admin land temporary until runners execute steps).
- Still open / Next: Send for review. Not ready. Not merge.
- Cut landing SHA (after Allowed Files push): `e87dc843288d44048e361a030967f1a486cf3e61`.

