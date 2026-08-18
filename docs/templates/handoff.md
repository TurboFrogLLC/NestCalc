# Handoff

One copyable block. Same shape on every Surface.
Surface = the step. Waypoint = the intersection. Handoff = this block.

Three bands. Real blank lines between them. Do not bleed the bands.

```text
Repo: NestCalc
Surface:
Waypoint:
Branch:
Head:
flow_id:
goal_sha256:
Trace:

Instruction:
Reason:

Corrective Action: None | Bent | Correction | Broken
```

## Bands

1. Front matter. `Waypoint:` is required.
2. Instruction + Reason. Reason is plain English.
3. Corrective Action.

Pack `06` may carry extra front-matter fields (Worktree, Model, Effort,
Orchestration, Session, Mode). This product file keeps the slimmer set.
The three bands stay.

## Corrective Action line

Values: None | Bent | Correction | Broken.

- None — omit the second line.
- Bent or Correction — second line is the problem and/or the correction.
- Broken — second line is the problem only. STOP. No correction.

Definitions live in AGENTS.md Boundaries. Do not restate them here.

## Optional terminal check

After the block, the Surface may add:

```text
git rev-parse --abbrev-ref HEAD
git rev-parse --short HEAD
git status --porcelain=v1
```
