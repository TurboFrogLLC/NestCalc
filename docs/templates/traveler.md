# Traveler

NestCalc wrapper. Standard form:
https://github.com/TurboFrogLLC/wReckless-Grok-Superbrain/blob/main/nerveCenter/templates/traveler.md

This product keeps the slimmer header. Meaning does not fork.

Three bands. Real blank lines. No YAML `---` fences. No host commands.
Instruction is this station only.

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

When the station must invoke `/goal`, the first word of this copyable block is
`/goal`. Then the three-band packet. Do not bury it in Instruction.
The executor does not add `/goal` if this packet omits it.

Job end is `packslip.md`, not this file.

## Orchestrator emission

Host-shell Surfaces: terminal box first (`cd` the worktree), then this block.
Primary clone: `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
Workers do not emit the terminal box.
