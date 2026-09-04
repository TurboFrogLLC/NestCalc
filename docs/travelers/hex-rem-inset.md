# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: AutoNest-style hex vs pocket compare on the rem with cutouts.
PR: 136
Branch: docs/hex-rem-inset
Head: 0cc83c79d15f9362b92412c58cd2586fa94491e1
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
5f   Cut                5b compare pocket vs clear-hex
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

### Cut 5b — compare pocket vs clear-hex (AutoNest law)
Skull armed and HOLE DIA > 0. Cutouts always paint. Both candidates see the same rem and the same reds.

Candidate H (clear-hex / manual hex on this rem)
No pockets. One lattice p = D_p + g, h = √3 p / 2.
First row is the lowest full-width hex row whose every cell clears every cutout at dWall = R_cut + R_p + g.
Grow that lattice up. Count = |H|.

Candidate P (pocketed)
Pockets in every legal cusp. Count those.
Do not grow a D_p+g hex from pocket centers (Cut 5 miss: p_skel is not a multiple of p).
If height remains, add Candidate H cells that also clear the pockets at pair = D_p + g. Count = |pockets| + |those H cells|.

Winner = max(|H|, |P|). Tie → H.
Paint only the winner. Ticket faces from the winner. POCKET COLS = 0 when H wins.

HOLE DIA 0 → virgin hex. Arms/chrome stay. No pocket toggle. No NC.
Done only after origin has the implement commit.
