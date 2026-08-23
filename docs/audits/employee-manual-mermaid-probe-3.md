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
  H -- Specialist Mode --> I[Corrective Action]
  I --> H
  H -- Worker Mode --> J[Host fix]
  J -- success --> H
  J -- cannot finish --> K[Escalate; stop this Station]
  H -- no --> L[Do this operation only; stay in Allowed Files]
  L --> M{Worker-local gate passes?}
  M -- Worker Mode: cannot finish --> K
  M -- Specialist Mode: known tools --> I
  M -- law broke --> N[Non-conformance Report; NCMR-; stop]
  M -- yes --> O{Named operation}
  O -- Cut --> P[Named branch; Allowed Files only; freeze hash unchanged]
  O -- other --> Q[Perform the named operation]
  P --> R[Stamp the operation]
  Q --> R
  R --> S[Advance traveler Still open and Next on the same pass]
  S --> T{Next Station named on the traveler?}
  T -- yes --> U[Emit that named Station's Ops Packet]
  T -- no --> AA[Owner]
  U --> V{Next named Station}
  V -- Send for review / Wait / Inspection --> W[Quality Control: Send for review, Wait, Inspection]
  V -- Corrective Action --> I
  V -- Merge / Close --> Y[Release: Merge, then Close]
  W --> X{Inspection clean?}
  X -- needs work --> I
  X -- clean --> Y[Release: Merge, then Close]
  Y --> Z[Job end: print Packslip in CLI and post on PR]
```

Legend: Solid arrows show stated flow. For a wrong branch or worktree, a
successful Worker host fix returns to the branch/worktree check; only
“Escalate” stops the Station. After a stamp, the finishing Operator emits the
packet for the next Station named on the traveler; that packet is current for
that Station and describes that Station only. “Non-conformance” stops and does
not produce a Packslip.
