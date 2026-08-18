# Handoff

One copyable block. Same shape on every Surface.
Surface = the step. Waypoint = the intersection. Handoff = this block.

Real blank lines between the three bands. Do not bleed the bands.

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

1. Routing header. `Waypoint:` is required.
2. Instruction + Reason. Reason is plain English.
3. Corrective Action.

## Corrective Action line

Values: None | Bent | Correction | Broken.

- None — omit the second line.
- Bent or Correction — second line is the problem and/or the correction.
- Broken — second line is the problem only. STOP. No correction.

Definitions live in AGENTS.md Boundaries. Do not restated them here.

## Optional terminal check

After the block, the Surface may add:

```text
git rev-parse --abbrev-ref HEAD
git rev-parse --short HEAD
git status --porcelain=v1
```
