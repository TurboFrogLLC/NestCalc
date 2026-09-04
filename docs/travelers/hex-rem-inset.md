# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Cut 6c skeleton ticket faces for the array.
PR: 136
Branch: docs/hex-rem-inset
Head: 11d68184321e6ba12e6bf60abe267254cf488f7d
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
5g   Cut                6 pockets only + SKEL L/B jog           45d1db2
5h   Cut                6b SKEL L/B on init card                11d6818
5i   Cut                6c ticket X GAP min-X + drop X OFFSET
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

### Cut 6c — skeleton ticket X GAP is min X, drop X OFFSET
Skull armed. Pockets-only from Cut 6 stays.

Ticket X GAP is the HMI array X gap. It is the minimum edge-to-edge distance on the X axis between consecutive painted pockets:
  X GAP = (center_x[i+1] - center_x[i]) - D_p
It is not the FLiPIT global GAP field. It is not X ROW GAP.
On this Look that is (D_cut + g_skel) - D_p.
If only one pocket, X GAP = 0.
Y GAP stays 0 on one row.

Drop X OFFSET from the skeleton ticket. JOG X / JOG Y stay first-pocket from rem 0,0.
COLUMNS = pocket count. ROWS = 1.
Virgin hex ticket is unchanged when skull is off.
No NC. Done only after origin has the implement commit.
