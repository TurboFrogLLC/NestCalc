# PR 90 packets

Exact SuperGrok emissions and Codex App returns for this probe.
Do not execute later rows from this file.

Issued against branch tip `facb431f9a3cf27b279d4e99e153cbd76f144f07`.
Later tips: `0cd42f8`, `031a7ca`, `1dd40e5`.

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

```text
Repo: NestCalc
Operator: Codex App
Waypoint: checkout sync only; stop
Branch: main → docs/employee-manual-mermaid-probe-2
Head: confirm origin/main is 091ad99f5bed0af2f70dc1e20049ca4311f5ac96 then HEAD is 1dd40e56b719cb0adcf1ffadc087681e7926164a
flow_id: NC-20260820-a20c0de8
goal_sha256: sha256:8234f00ec5d07087e6af12dd4f31184ce050b8c1f1baf48c3608857bdcec8f23
Trace: NestCalc #90; docs/travelers/90.md; Seq 1 blocked
Model: GPT-5.6 Luna
Effort: low

Instruction:
When tracking this job → docs/travelers/90.md.
When this operation → docs/WORKFLOW.md → ## Start (wrong branch or worktree).
When preserving Owner paths → GOAL.md → Protected Surfaces.
Fetch origin. Finish the switch to docs/employee-manual-mermaid-probe-2. Fast-forward to origin. Confirm HEAD is 1dd40e56b719cb0adcf1ffadc087681e7926164a. Do not discard Owner-preserved untracked paths. No commit. No push. No merge. Do not Freeze.

Reason:
Seq 1 updated main and then stopped on local changes and a locked `.git/index`. Checkout is not stamped until the named branch is HEAD.
```

### Seq 1b output

```text
Checkout sync completed:

- Fetched `origin`.
- Switched to `docs/employee-manual-mermaid-probe-2`.
- Confirmed `HEAD` is `1dd40e56b719cb0adcf1ffadc087681e7926164a`.
- Owner-preserved changes and untracked paths were retained in a recoverable stash.

git stash pop produced an AGENTS.md conflict; the stash was kept. No commit, push, merge, or freeze was performed.
```

## Seq 2 — Freeze — issued 2026-08-21

Hold until Seq 1 stamps. Restamp Head to `1dd40e5` for the run.

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
(await restamped Freeze)
```
