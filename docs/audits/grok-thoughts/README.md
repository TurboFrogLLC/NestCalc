# Grok thoughts — continuous home

Owner: wReckless. SuperGrok harness dumps. **Not product law.** Not a traveler substitute. Not NestCalc floor Ops Packet skill.

This folder is the **append-forever** corpus for `grok-thoughts` job dumps.

## Layout

| Path | Role |
| --- | --- |
| `REGISTRY.md` | Index. One row per `job_id`. Session ID tables live here (and in the job file). |
| `NGJ-*.md` | One file per `job_id`. Full post-install dump body. |

Do **not** add split `pr101-*` / `pr102-*` dumps under `docs/audits/` for new jobs. Those draft probes (#103, #104) are superseded by this home.

## Future dumps

1. Append one row to `REGISTRY.md` (job, PR, effort, session count, merge SHA, dump filename).
2. Copy Session ID table into `REGISTRY.md` (or point at the job file and keep a short table here).
3. Write **only** a new `NGJ-<job_id>.md` under this folder.
4. Do not rewrite old job files unless Owner names a re-dump of that `job_id`.

## Baseline (locked)

| job_id | PR | Effort | Sessions | Merge | Dump |
| --- | --- | --- | --- | --- | --- |
| NGJ-20260822-101 | 101 | high | 7 | `9bb091d` | [NGJ-20260822-101.md](./NGJ-20260822-101.md) |
| NGJ-20260823-102 | 102 | low | 3 (C multi-op, 8 Stations) | `65d1334` | [NGJ-20260823-102.md](./NGJ-20260823-102.md) |

Wait Station: **absent as an Ops Packet on 101** (traveler stamp empty). Present on 102 (Session C).

Index details: [REGISTRY.md](./REGISTRY.md).
