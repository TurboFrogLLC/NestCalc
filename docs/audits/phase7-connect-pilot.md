# Phase 7 connect pilot

This Lite Cut records the current Station path without changing it.

A Station is the isolated current-operation unit: its Ops Packet binds one
Operator, one fresh thread, one Mode, and one tool envelope. Worker and
Specialist are Modes, not roles; the traveler names the Operator and the
Station packet supplies the operation. `docs/GLOSSARY.md → Station`; `docs/GLOSSARY.md → Mode`; `docs/WORKFLOW.md → Start`.

In Worker Mode, the Operator performs only the named A→B Instruction. A
worker-local gate failure, or inability to finish that Instruction, stops this
Station as Escalate. `docs/GLOSSARY.md → Worker`; `docs/WORKFLOW.md → Worker-local gates`.

In Specialist Mode, a worker-local failure with known tools takes Corrective
Action and remains on the operation. If the law broke, the Specialist stops and
writes the facts-only Non-conformance Report with an `NCMR-` stamp; it is not
an Escalate or a packslip. `docs/GLOSSARY.md → Corrective Action`; `docs/GLOSSARY.md → Non-conformance Report`; `docs/WORKFLOW.md → Worker-local gates`.

After the current operation is stamped, the finishing Operator emits the next
Ops Packet from the next already-named traveler row. If no next Station is
named, routing returns to the Owner. `docs/WORKFLOW.md → Start`.

Product freeze is the goal-workflow v1 fence on `GOAL.md`, including its
`flow_id`, `goal_sha256`, matching hash, and one Active Goal. A non-goal
planning Station instead stamps its commit on the job traveler; it does not
create a `GOAL.md` fence. `docs/WORKFLOW.md → Operation stamps`; `docs/WORKFLOW.md → Freeze`.

GOAL states outcomes, while the current Ops Packet Instruction is the write
path. When they differ, the traveler Instruction governs this Station.
`docs/WORKFLOW.md → Goal`.
