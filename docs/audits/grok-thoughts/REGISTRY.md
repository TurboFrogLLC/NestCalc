# Grok thoughts — REGISTRY

Index only. Full dumps: one `NGJ-*.md` per `job_id` in this folder.  
Not product law. Append a row + new dump file; do not split per-probe PRs.

## Jobs

| job_id | PR | Effort | Sessions | Merge | Dump |
| --- | --- | --- | --- | --- | --- |
| NGJ-20260822-101 | 101 | high | 7 | `9bb091db3c63d29e36d5e1465a375952d3abdbad` | [NGJ-20260822-101.md](./NGJ-20260822-101.md) |
| NGJ-20260823-102 | 102 | low | 3 (C multi-op, 8 Stations) | `65d1334ddd556c9c0d5ac70bfa288baf043c2e9c` | [NGJ-20260823-102.md](./NGJ-20260823-102.md) |
| NGJ-20260823-gtc | 105 | low | 1 (A multi-op, 7 Stations) | `bbda2b2272f217b6beee409bd2254cfbd64314a1` | [NGJ-20260823-gtc.md](./NGJ-20260823-gtc.md) |

Wait: **absent on 101** (Seq 4 stamp empty; never an Ops Packet). Present on 102 (Session C). Present on 105 (Session A). Checkout sync: **absent as an Ops Packet on 105** (index starts Seq 2 Cut).

---

## NGJ-20260822-101 — Session IDs

Source: `origin/docs/pr101-session-registry` `docs/audits/pr101-session-registry.md`. Do not invent IDs.

Operator: Grok Build. Model / effort: **Grok 4.6 / high** (Close **medium** per Close packet).  
Close stamp: `c9aa93efb35f986181e326db7ad8405523d791a4`.

### Sessions (seven fresh threads — all IDs unique)

| Key | Title (dashboard) | Session ID | Worktree suffix | Turns | Context |
| --- | --- | --- | --- | --- | --- |
| A | NestCalc #101 Checkout Sync Seq 1 Stamp | `01a02d2f-56b6-79b0-9a59-215282e3b96a` | `2026-08-22-467f1d8f` | 1 | 40.9k / 500k (8%) |
| B | NestCalc mermaid probe-4 employee-manual flowchart | `01a02d41-de84-73f3-9fd6-319c8d555cf0` | `2026-08-22-035d9bc0` | 1 | 53.0k / 500k (11%) |
| C | NestCalc PR 101 send-for-review stamp | `01a02d63-db87-7991-a11c-882f55564e71` | `2026-08-22-db828cdf` | 1 | 53.1k / 500k (11%) |
| D | Fix Codex P2s, unpark PR, stamp CA | `01a02d70-25f5-7782-971f-2f6c82671e33` | `2026-08-23-54678027` | 1 | 86.4k / 500k (17%) |
| E | Inspect NestCalc traveler 101 Seq 5 | `01a02d81-7fda-70f2-bc12-3a50982b3e57` | `2026-08-23-4ace7be3` | 1 | 55.8k / 500k (11%) |
| F | Squash-merge NestCalc PR 101 onto main | `01a02eb8-dec2-7a61-9c61-29a98a2874ab` | `2026-08-23-f2f542a0` | 1 | 43.3k / 500k (9%) |
| G | NestCalc 101 Close stamp prune packslip | `01a02ec6-4803-72e1-bead-b16c328994c0` | `2026-08-23-045b915a` | 1 | 48.3k / 500k (10%) |

Duplicate check: **none**. Seven distinct Session IDs.

### Station → session map

| Seq | Station | Mode | Session | Stamp (short) | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | A | `1c9310c` | |
| 2 | Cut | Worker | B | `fa689fa` | chart |
| 3 | Send for review | Worker | C | `178b12c` | |
| 4 | Wait | Worker | — | — | **Wait absent** — traveler stamp empty; never an Ops Packet |
| CA | Corrective Action | Specialist | D | `52d5535` | |
| 5 | Inspection | Worker | E | `9995764` | |
| 6 | Merge | Worker | F | `9bb091d` | admin land override |
| 7 | Close | Worker | G | `c9aa93e` | Effort medium on packet |

Unlike #102 Session C, **#101 used one Session ID per Station**.

---

## NGJ-20260823-102 — Session IDs

Source: `origin/docs/pr102-session-registry` `docs/audits/pr102-session-registry.md`. Do not invent IDs.

Operator: Grok Build. Model / effort: **Grok 4.6 / low** (every Station).  
Close stamp: `57131686fcc3180576df2cc866011d8e4d3b82a7`.  
Packslip: https://github.com/TurboFrogLLC/NestCalc/pull/102#issuecomment-5386783030

### Sessions (three fresh threads)

| Key | Title | Session ID | Worktree suffix | Turns | Context |
| --- | --- | --- | --- | --- | --- |
| A | Checkout sync mermaid-probe traveler stamp | `01a02eea-0a11-7360-85e1-0d69fca2c2f1` | `2026-08-23-5e3df837` | 1 | 30.8k / 500k (6%) |
| B | NestCalc Cut probe-5 mermaid employee-manual flow | `01a02ef0-3657-7173-aa65-8a72dcbdab11` | `2026-08-23-4efbbe09` | 1 | 38.3k / 500k (8%) |
| C | PR 102 mermaid probe QC and CA2 restore | `01a02ef4-f2f7-7cf0-8523-ff6e83ee5026` | `2026-08-23-2bb4eece` | 8 | 124.6k / 500k (25%) |

### Station → session map

| Seq | Station | Mode | Session | Stamp (short) | Approx wall |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | A | `25b4cb55` | ~31s |
| 2 | Cut | Worker | B | `682ea477` | ~1m2s |
| 3 | Send for review | Worker | C | `48a20afa` | ~2m8s |
| 4 | Wait | Worker | C | `304cc018` | ~43s |
| CA | Corrective Action | Specialist | C | `e970090` | ~2m48s |
| 5 | Inspection (fail) | Worker | C | `c04c1cc` | ~1m49s |
| CA2 | Corrective Action | Specialist | C | `e99b2a9` | ~2m7s |
| 5b | Inspection (clean) | Worker | C | `bfd8304` restamp | ~39s |
| 6 | Merge | Worker | C | `65d1334` | ~1m45s |
| 7 | Close | Worker | C | `5713168` | ~1m26s |

Session **C** is multi-op: split on Ops Packet boundaries (8 Stations in one thread). A and B are single-op.

---

## NGJ-20260823-gtc — Session IDs

Source: `grok export` + `~/.grok/sessions/.../2026-08-23-94aaae8d/01a02fdf-2283-7120-8f65-a35cb8356b51`. Do not invent IDs.

Operator: Grok Build. Model / effort: **Grok 4.6 / low**.  
Merge: `bbda2b2272f217b6beee409bd2254cfbd64314a1`.  
Dump: [NGJ-20260823-gtc.md](./NGJ-20260823-gtc.md).

### Sessions (one continuous thread)

| Key | Title (dashboard) | Session ID | Worktree suffix | Turns | Context |
| --- | --- | --- | --- | --- | --- |
| A | NestCalc #105 continuous grok-thoughts home QC | `01a02fdf-2283-7120-8f65-a35cb8356b51` | `2026-08-23-94aaae8d` | 7 | ~128.6k / 500k |

### Station → session map

| Seq | Station | Mode | Session | Stamp (short) | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | — | — | **absent** — never an Ops Packet on this job |
| 2 | Cut | Worker | A | `02e285ab` | |
| 3 | Send for review | Worker | A | `ccaf496` | |
| 4 | Wait | Worker | A | `a7d0e95` | COMMENTED P2=1 → CA |
| CA | Corrective Action | Specialist | A | `efa7f7d` | README prefix |
| 5 | Inspection | Worker | A | `ec32e75` | clean |
| 6 | Merge | Worker | A | `bbda2b2` | admin squash override |
| 7 | Close | Worker | A | `5ef629d` | |

Session **A** is multi-op: split on Ops Packet boundaries (7 Stations in one thread).
