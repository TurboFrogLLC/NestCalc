# PR 101 — Grok Build session registry

job_id: `NGJ-20260822-101`  
Operator: Grok Build  
Model / effort: **Grok 4.6 / high** (Close **medium** per Close packet)  
Merge: `9bb091db3c63d29e36d5e1465a375952d3abdbad`  
Close stamp: `c9aa93efb35f986181e326db7ad8405523d791a4`  

Purpose: second harness corpus for `grok-thoughts` (high vs #102 low).  
Not product law. Not a traveler substitute.

## Sessions (seven fresh threads — all IDs unique)

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

## Station → session map (inferred from titles + traveler)

| Seq | Station | Mode | Session | Stamp (short) | Notes |
| --- | --- | --- | --- | --- | --- |
| 1 | Checkout sync | Worker | A | `1c9310c` | |
| 2 | Cut | Worker | B | `fa689fa` | chart |
| 3 | Send for review | Worker | C | `178b12c` | |
| 4 | Wait | Worker | — | — | traveler stamp empty; may live inside C or D export |
| CA | Corrective Action | Specialist | D | `52d5535` | |
| 5 | Inspection | Worker | E | `9995764` | |
| 6 | Merge | Worker | F | `9bb091d` | admin land override |
| 7 | Close | Worker | G | `c9aa93e` | Effort medium on packet |

## Multi-op vs single-op

Unlike #102 Session C (eight Stations in one thread), **#101 used one Session ID per Station** (seven threads). Smoke should still split on Ops Packet boundaries inside each export; expect one segment per session unless an export holds more than one packet.

## Legacy session files (already on main)

Packets index also points at paste captures:

- `docs/audits/pr101-checkout-session.md`
- `docs/audits/pr101-cut-session.md`
- `docs/audits/pr101-send-for-review-session.md`
- `docs/audits/pr101-ca-session.md`
- `docs/audits/pr101-inspection-session.md`
- `docs/audits/pr101-merge-session.md`

Smoke prefers **Session ID + `grok export`**. Legacy files are fallback only if export fails.

## Pointers

- Traveler: `docs/travelers/101.md`
- Packets log: `docs/travelers/101-packets.md`
- Chart: `docs/audits/employee-manual-mermaid-probe-4.md`
