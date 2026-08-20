# Packslip

NestCalc wrapper. Standard form:
https://github.com/TurboFrogLLC/wReckless-Grok-Superbrain/blob/main/nerveCenter/templates/packslip.md

Shipped receipt. Not an Instruction. First word is never `/goal`. No Model.
No Waypoint line. Shipped is not a fork.
Job number = PR number. Post this on the PR at merge. Worker emits the same
block when merge completes. Stamp is the retrieve handle.

```text
Repo: NestCalc
Surface: wReckless
PR:
Branch:
Head:
flow_id:
goal_sha256:
Trace:
Cycle: Full | Lite
Date:

Seq  Label     Surface      Stamp                 CA taken              Still open
B1   Plan
B2   Freeze
B3   Bind
B4   Traveler
B5   Cut
B6   QC
B7   Ready
B8   Merge
B9   Ship

Closed CA:
Still open: none | NC …
Next: none | NC-…

Corrective Action: None | closed list only
```

Stamp is a commit SHA. Skip a row that did not run. A Correction is a new row.
B1–B4 are history labels only.
