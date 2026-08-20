# Employee-manual flow — PR #80

```mermaid
flowchart TD
  A[Owner starts work] --> B[One PR, one traveler]
  B --> C[Traveler names the Operator, branch, head, instruction, and Spot Check]
  C --> D[Operator reads traveler and echoes flow_id and goal_sha256 when a goal is on]
  D --> E{Branch and worktree match?}
  E -- no --> F[Corrective Action: find a way on this operation]
  F --> E
  E -- yes --> G[Do this operation only; do not rewrite traveler]
  G --> H[Stamp this operation before the next operation]
  H --> I{Spot Check}
  I -- None --> J[Continue]
  I -- Corrective Action --> F
  I -- Non-conformance --> K[Stop; emit Non-conformance Report with NCMR-; wait]
  J --> L{Quality Control named?}
  L -- no --> M[PR remains draft]
  L -- yes --> N[Send for review: mark ready; named review]
  N --> O[Wait]
  O --> P[Inspection]
  P --> Q{Inspection clean?}
  Q -- needs work --> F
  Q -- clean --> R[Release]
  R --> S[Merge unless traveler forbids it]
  S --> T[Close]
  T --> U[Job end: print Packslip in CLI and post it on the PR]

```

Legend: solid arrows are the stated operating flow. “Corrective Action” loops
within the same operation; “Non-conformance” stops the operation and does not
produce a Packslip.
