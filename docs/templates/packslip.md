# Packslip

NestCalc wrapper. Standard form:
https://github.com/TurboFrogLLC/wReckless-Grok-Superbrain/blob/main/nerveCenter/templates/packslip.md

Shipped receipt. Not an Instruction. First word is never `/goal`. No Model.
No Waypoint line. Shipped is not a fork.
Stamp is the retrieve handle.

Job number = PR when a PR exists. No PR: `PR: —` and the handle is `flow_id`
or branch. Emit when the job stops, merge or not. Skip merge/ship rows that
did not run. If a PR exists, post this on that PR.

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
