# Traveler (handoff)

One copyable packet. Same shape on every Surface.
Surface = the station. Waypoint = the intersection. Traveler = this block.
the-Feeler is not this file. the-Feeler only measures the gap.

Three bands. Real blank lines between them. Do not bleed the bands.
Do not wrap the routing header in YAML `---` fences.
Keep it thin. Instruction is this station only. Do not restate GOAL.md.

```text
Repo: NestCalc
Surface:
Waypoint:
Branch:
Head:
flow_id:
goal_sha256:
Trace:
Model:
Effort:

Instruction:
Reason:

Corrective Action: None | Bent | Correction | Broken
```

## Bands

1. Routing header. `Waypoint:` is required. `Model:` and `Effort:` when that Surface uses them.
2. Instruction + Reason. Reason is plain English.
3. Corrective Action.

Instruction is this station's work only. It is not a host command list.
Do not put `cd`, git, npm, Playwright, or `python3 scripts/…` in the traveler.

Pack `06` may carry extra routing-header fields (Worktree, Orchestration,
Session, Mode). This product file keeps the slimmer set plus Model / Effort.
The three bands stay.

`create-handoff` JSON is a sidecar (prompt hash and bindings).
It is not this traveler.

## Orchestrator emission (two copy boxes)

When SuperGrok (or another Orchestrator) hands work to a human for a host
shell Surface, emit **two** separate copy boxes, in order:

1. Terminal commands — always start with exact `cd` into the NestCalc
   primary clone or named worktree, then fetch/checkout/branch as needed,
   short head check.
2. The one traveler block above.

Primary clone path:
`/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`

Do not fold the terminal commands into the traveler body.
When Branch is populated, the terminal box is required for Orchestrator
human-facing output.

Workers do not emit a terminal box. Workers read the traveler, then do
the Instruction.

## Corrective Action line

Values: None | Bent | Correction | Broken.

- None — omit the second line.
- Bent or Correction — second line is the problem and/or the correction.
- Broken — second line is the problem only. STOP. No correction.

Definitions live in AGENTS.md Boundaries. Do not restate them here.
