# PR 90 packets

Exact SuperGrok emissions and Codex App returns for this probe.
Do not execute later rows from this file.

Issued against branch tip `facb431f9a3cf27b279d4e99e153cbd76f144f07`.
Packet-save commits after that issue: `0cd42f8`, `031a7ca`.

## Seq 1 — checkout sync — issued 2026-08-21

Operator: Codex App. Model: GPT-5.6 Luna. Effort: low.

```text
Repo: NestCalc
Operator: Codex App
Waypoint: checkout sync only; stop
Branch: main → docs/employee-manual-mermaid-probe-2
Head: confirm origin/main is 091ad99f5bed0af2f70dc1e20049ca4311f5ac96 then HEAD is facb431f9a3cf27b279d4e99e153cbd76f144f07
flow_id: NC-20260820-a20c0de8
goal_sha256: sha256:8234f00ec5d07087e6af12dd4f31184ce050b8c1f1baf48c3608857bdcec8f23
Trace: NestCalc #90; docs/travelers/90.md
Model: GPT-5.6 Luna
Effort: low

Instruction:
When tracking this job → docs/travelers/90.md.
When this operation → docs/WORKFLOW.md → ## Start (the main exception).
Fetch origin. Switch to main. Fast-forward to origin/main. Confirm that SHA. Switch to docs/employee-manual-mermaid-probe-2. Fast-forward to that origin branch. Confirm HEAD is facb431f9a3cf27b279d4e99e153cbd76f144f07. No edit. No commit. No push. No merge. Do not run later rows.

Reason:
#90 is draft. Checkout must match the named branch before Freeze.
```

### Seq 1 output

```text
Checkout sync blocked by existing local changes and inability to write `.git/index`/`.git/ORIG_HEAD`.

Completed:
- Fetched `origin`.
- Updated local `main` to `091ad99f5bed0af2f70dc1e20049ca4311f5ac96`.
- Confirmed remote target branch at `facb431f9a3cf27b279d4e99e153cbd76f144f07`.

Not completed:
- Switching to `docs/employee-manual-mermaid-probe-2`.
- No edits, commits, pushes, or merges were performed.
```

## Seq 1b — checkout sync Corrective Action — issued 2026-08-21

Stay on checkout. Do not Freeze.

```text
(issued in SuperGrok chat; paste is the current operation)
```

### Seq 1b output

```text
(await Codex App return)
```

## Seq 2 — Freeze — issued 2026-08-21

Operator: Codex App. Model: GPT-5.6 Terra. Effort: medium.
Hold until Seq 1 stamps a switch.

```text
Repo: NestCalc
Operator: Codex App
Waypoint: Freeze
Branch: docs/employee-manual-mermaid-probe-2
Head: facb431f9a3cf27b279d4e99e153cbd76f144f07
flow_id: —
goal_sha256: —
Trace: NestCalc #90; docs/travelers/90.md
Model: GPT-5.6 Terra
Effort: medium

Instruction:
When tracking this job → docs/travelers/90.md.
When this operation → docs/WORKFLOW.md → ## Goal → ### Freeze.
When copying the sheet → docs/templates/goal-form.md.
Keep PR 90 draft. Do not mark ready. Do not merge. Do not run later rows.

Reason:
Quiet goal is on. #90 needs a freeze before Cut.
```

### Seq 2 output

```text
(hold)
```
