# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Skeleton is pockets only. SKEL L/B → jog.
PR: 136
Branch: docs/hex-rem-inset
Head: 46d5c8c
Session: continuous
job_id: NGJ-20260903-hex-rem
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Rem-pocket spitball
2    Start-branch       Owner remote / Codex App
3    Cut                1 red cutout row                        2bb43c4
5    Cut                2 left-refill + diameter chip           e964f1f
5b   Cut                3 pocket lock + hex grid                8a7d533
5c   Cut                4 skeleton arm + init card              d16f9ec
5d   Cut                4b pocket lock + Codex P1/P2            83fd67c
5e   Cut                5 freeze part lattice                   2d02875
5f   Cut                5b phantom lattice + count winner       46d5c8c
5g   Cut                6 pockets only + SKEL L/B jog          631521f
4    Look               Owner. No Codex review until Send.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/hex-rem-inset.md
When this packets log → docs/travelers/hex-rem-inset-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/136

Shop: Codex App, GPT-5.6 Terra, High
Worker worktree is not Owner Look. Push origin/docs/hex-rem-inset.

## Cut lock

### Cut 6 — pockets only + SKEL L/B → jog
Skull armed. HOLE DIA > 0.

Skeleton paints cutouts and legal cusp pockets. That is the whole nest.
No Lattice B. No clear-hex candidate. No phantom row. No extra blues above the cutouts. Count = pocket count only.
Hex-on + skull-off stays virgin hex (full sheet, no reds).

Nest L/R/T/B stay clearance for NEW pocket parts vs rem edges. They do not place the hole row.

New rem faces next to HOLE DIA / X ROW GAP:
- SKEL L = measured left edge → first cutout. Default 0.250.
- SKEL B = measured bottom edge → cutout row. Default 0.500.

Cutout centers: x = SKEL L + R_cut + i * (D_cut + g_skel), y = SKEL B + R_cut.

Ticket, unitless 3 dp:
- COLUMNS = pocket count, ROWS = 1
- JOG X / JOG Y = first pocket from rem 0,0 (machine jog before the array)
- POCKET COLS = those column indices on a would-be full row if useful; else pocket count
Drop X ORIGIN from the skeleton ticket if it only duplicated JOG X.

HOLE DIA 0 → virgin hex. Arms/chrome stay. No NC.
Done only after origin has the implement commit.
