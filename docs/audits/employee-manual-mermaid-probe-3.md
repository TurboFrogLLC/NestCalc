# Employee-manual Mermaid reconstruction probe 3

This is a descriptive reconstruction of the employee-manual operating flow
from `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, and
`docs/templates/`. It does not change the governing documents.

```mermaid
flowchart TD
  A[Owner starts the job] --> B[One PR; one traveler]
  B --> C[Current Ops Packet binds one Station, Mode, Operator, and Instruction]
  C --> D[Operator reads the traveler first]
  D --> E{Goal workflow on?}
  E -- yes --> F[Confirm freeze and echo flow_id and goal_sha256]
  E -- no --> G[Stay on named branch and head]
  F --> G
  G --> H{Branch or worktree wrong?}
  H -- AGENTS.md --> I[Corrective Action]
  H -- WORKFLOW.md Worker Mode --> J[Host fix or Escalate]
  I --> H
  J --> K[Stop this Station]
  H -- no --> L[Do this operation only; stay in Allowed Files]
  L --> M{Worker-local gate passes?}
  M -- no --> J
  M -- law broke --> N[Non-conformance Report; NCMR-; stop]
  M -- yes --> O{Named operation}
  O -- Cut --> P[Named branch; Allowed Files only; freeze hash unchanged]
  O -- other --> Q[Perform the named operation]
  P --> R[Stamp the operation]
  Q --> R
  R --> S[Advance traveler Still open and Next on the same pass]
  S --> T{Packet handling after the stamp}
  T -- WORKFLOW.md --> U[Emit the next named Ops Packet]
  T -- templates --> V[Ops Packet is the current Station only]
  U --> W[Quality Control: Send for review, Wait, Inspection]
  V --> W
  W --> X{Inspection clean?}
  X -- needs work --> I
  X -- clean --> Y[Release: Merge, then Close]
  Y --> Z[Job end: print Packslip in CLI and post on PR]
```

Legend: Solid arrows show stated flow. The two arrows from “Branch or worktree
wrong?” are a collision: `AGENTS.md` requires Corrective Action, while
`docs/WORKFLOW.md` routes a Worker to a host fix or Escalate. The two packet
arrows are also a collision: `docs/WORKFLOW.md` says the finishing Operator
emits the next named packet after stamping, while `docs/templates/README.md`
defines the Ops Packet as the current Station only. Both are drawn without
selecting a new rule. “Non-conformance” stops and does not produce a Packslip.
