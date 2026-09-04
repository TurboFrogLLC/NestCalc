# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Pocket row + phantom lattice. Winner by count.
PR: 136
Branch: docs/hex-rem-inset
Head: bbfc070661bef2b738cd297cac01c72e72cb328e
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
5f   Cut                5b pocket row + phantom lattice         51545de
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

### Cut 5b — pocket row + phantom lattice + count winner
Skull armed and HOLE DIA > 0. Cutouts always paint. Not perfect hex. Saturate the rem.

Candidate P
Array row 1: every legal cusp pocket. Those are extra parts, not lattice B seeds.
Lattice B origin: x0 = L + R_p, y2 = (cutout AABB top) + g + R_p.
Pitch p = D_p + g. Hex h = √3 p / 2. Array row 2 sits on y2, left to right from x0.
A Lattice B cell that collides with a pocket (dist < D_p + g) is hidden. It is still a lattice point.
Array row 3+ hex-nests from Lattice B including hidden points. Only rows 2–3 show gaps from those hides. Later rows are full hex on B.
Count N_P = painted pockets + painted B cells.

Candidate H
No pockets. Same Lattice B. No hidden cells. Count N_H.

Winner max(N_P, N_H). Tie → H. Paint only the winner.
POCKET COLS = 0 when H wins.
Ticket faces from the painted lattice. X ORIGIN = x0.

HOLE DIA 0 → virgin hex. Arms/chrome stay. No pocket toggle. No NC.
Done only after origin has the implement commit.
