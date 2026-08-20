# Traveler

One packet for this PR. Start to end.
This block is the current operation on that traveler.
Three bands. Real blank lines. No YAML `---` fences. No host commands.
Instruction is this operation only.
Operator is Codex App, Codex CLI, or Grok Build. Not Owner. Not Operations Manager.
Management may edit this traveler. Operators complete the operation. They do not rewrite the traveler.

```text
Repo: NestCalc
Operator:
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

Spot Check: None | Corrective Action | Non-conformance
```

When the operation must invoke `/goal`, the first word of this copyable block is
`/goal`. Then the three-band packet. Do not bury it in Instruction.
The executor does not add `/goal` if this packet omits it.

Job end is `packslip.md`. That is when the job is done.
Non-conformance stops this operation. Emit `nonconformance.md`. Do not emit a packslip for that.

Host-shell: terminal box first (`cd` the worktree), then this block.
Primary clone: `/Users/computer/wrecklesstoddler/vibe/projects/nestcalc`
Operators do not emit the terminal box.
