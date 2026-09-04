# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Skeleton measured Lx / By → machine jog.
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
5g   Cut                6 skeleton Lx By machine jog
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

### Cut 6 — skeleton Lx / By → machine jog
Skull armed. HOLE DIA > 0.

Nest L/R/T/B stay the clearance for NEW parts. They do not move the cutout row.

New rem faces next to HOLE DIA / X ROW GAP:
- SKEL L = measured left edge → first cutout (edge to circle). Default 0.250.
- SKEL B = measured bottom edge → cutout row (edge to circle). Default 0.500.

Cutout centers: x = SKEL L + R_cut + i * (D_cut + g_skel), y = SKEL B + R_cut.
Pockets stay in legal cusps of that row.

Ticket adds, unitless 3 dp, no suffix:
- JOG X = first painted pocket X from rem 0,0. If H wins and no pockets, JOG X = Lattice B x0.
- JOG Y = that same part Y from rem 0,0.
Those two are the machine jog before array row 1.

Array still uses COLUMNS / ROWS / X GAP / Y GAP / X ORIGIN / POCKET COLS.
Cut 5b winner law stays. No NC.
Done only after origin has the implement commit.
