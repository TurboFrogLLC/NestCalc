# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Two lattices. Freeze part pitch after pockets.
PR: 136
Branch: docs/hex-rem-inset
Head: 83fd67c
Session: fresh
job_id: NGJ-20260903-hex-rem
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Rem-pocket spitball
2    Start-branch       Owner local / Grok Build
3    Cut                1 red cutout row                        2bb43c4
5    Cut                2 left-refill + diameter chip           e964f1f
5b   Cut                3 pocket lock + hex grid                8a7d533
5c   Cut                4 skeleton arm + init card              d16f9ec
5d   Cut                4b pocket lock + Codex P1/P2            83fd67c
5e   Cut                5 freeze part lattice after pockets
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

Shop: Grok Build, Grok 4.6, high
Grok Build worktree is not Owner Look. Push origin/docs/hex-rem-inset.

## Cut lock

### Cut 5 — two lattices, freeze p after pockets
Skull armed and HOLE DIA > 0.

Lattice A (skeleton): cutout centers. Pitch p_skel = D_cut + g_skel. Red. Not parts.
Lattice B (parts): pocket centers sit in every legal cusp of A. That is array row 1. Freeze
  p = D_p + g
  h = sqrt(3) * p / 2
Every later blue is a hex neighbor of Lattice B at that p and h. Do not start a new grid from rem origin or from AABB + GAP. Do not retune p on row 3+.
Keep a neighbor only if it clears cutouts, other parts, and rem L/R/T/B at typed GAP.

HOLE DIA 0 still virgin. Arms/chrome from Cut 4 stay. No NC. No second cutout row.
Done only after origin/docs/hex-rem-inset has the implement commit.
