# Employee-manual flow reconstruct (probe-5)

Sources read only: `AGENTS.md`, `docs/GLOSSARY.md`, `docs/WORKFLOW.md`, `docs/templates/`. No law change.

```mermaid
flowchart TD
  OWNER["Owner wReckless starts work"] --> READT["Operator reads traveler Instruction"]
  READT --> ECHO{"Goal on?"}
  ECHO -->|yes| ECHOG["Echo flow_id and goal_sha256"]
  ECHO -->|no| ECHOJ["Echo job_id"]
  ECHOG --> BRANCH
  ECHOJ --> BRANCH
  BRANCH{"Named Branch + Head?"}
  BRANCH -->|no COLLISION A| WRONG
  WRONG["COLLISION A wrong branch/worktree/repo"]
  WRONG --> HOSTQ{"Host can correct?"}
  HOSTQ -->|yes| HOSTFIX["Host fix then recheck BRANCH"]
  HOSTFIX --> BRANCH
  HOSTQ -->|no Worker| WESCBR["Escalate"]
  HOSTQ -->|no Specialist| CABR["Corrective Action"]
  WRONG --> WRONG_AGENTS["AGENTS Always: Corrective Action"]
  BRANCH -->|yes| DOOP["Do this operation only. Do not rewrite traveler"]
  DOOP --> MODE{"Mode"}
  MODE -->|Worker| WGATES["Worker-local gates: Allowed Files; one try then one more"]
  MODE -->|Specialist| SGATES["Known tools"]
  WGATES -->|pass| STAMP
  WGATES -->|fail| WESC["Escalate"]
  SGATES -->|pass| STAMP
  SGATES -->|fail gate| SCA["Corrective Action; stay on this operation"]
  SGATES -->|law broke| SNCMR["NCMR; stop"]
  STAMP["Stamp this Station SHA"]
  STAMP --> NEXTNAMED{"Next Station named on job traveler?"}
  NEXTNAMED -->|yes| EMIT["Finishing Operator emits that Ops Packet"]
  NEXTNAMED -->|no| OWNERUNK["Owner"]
  EMIT --> NAMEDROW["Dispatch packet to named next Station"]

  SPINE["Spine from WORKFLOW stamps + QC + Release"]
  SPINE --> FREEZE["Freeze"]
  FREEZE --> CUT["Cut: named branch; Allowed Files; freeze hash unchanged"]
  CUT --> QC["Quality Control band; PR stays draft until this band"]
  QC --> SFR["Send for review: mark PR ready; named @codex review + agents-pr-review"]
  SFR --> WAIT["Wait"]
  WAIT --> INSP["Inspection"]
  INSP -->|needs work| CA["Corrective Action then Inspection again"]
  CA --> INSP
  INSP -->|law broke| NCMR["Non-conformance Report NCMR-; Disposition blank; no packslip"]
  INSP -->|cannot finish| ESC["Escalate"]
  INSP -->|clean| REL["Release"]
  REL --> MERGE["Merge onto main unless traveler forbids"]
  MERGE --> CLOSE["Close: sync prune lessons quiet archive as named"]
  CLOSE --> PS["Packslip job-end; print CLI; post on PR"]

  FREEZE --> FKIND{"Goal workflow on?"}
  FKIND -->|yes| GFENCE["GOAL.md v1 fence flow_id goal_sha256 hash match one Active Goal"]
  FKIND -->|no| NFENCE["Non-goal freeze: planning Station stamp SHA on job traveler"]

  AUTH["COLLISION B authority vs Law"]
  AUTH --> AUTH_AGENTS["AGENTS Authority: AGENTS+GLOSSARY then GOAL then WORKFLOW then LESSONS then V3"]
  AUTH --> AUTH_GLOSS["GLOSSARY Law: AGENTS.md + WORKFLOW.md"]

  FORM["COLLISION C packet vs traveler form"]
  FORM --> FORM_GLOSS["GLOSSARY: Ops Packet is current Station; Traveler is the job one per PR"]
  FORM --> FORM_TPL["templates/README: traveler.md is Ops Packet; docs/travelers/PR.md is Job traveler"]

  PACK["COLLISION D packslip rows vs WORKFLOW stamp table"]
  PACK --> PACK_TPL["packslip.md rows: Plan Freeze Bind Cut Send for review Wait Inspection Merge Close"]
  PACK --> PACK_WF["WORKFLOW Operation stamps: Freeze Cut Send for review Wait Inspection Merge Close; no Plan/Bind rows"]
```

Legend: reconstruct only. COLLISION A–D are disagreements left as drawn, not resolved. Completing a Station is not job-end; packslip is job-end. Worker stop is Escalate; Specialist ladder is Corrective Action then NCMR for law break. Proof/host suite is not at freeze or Cut.
