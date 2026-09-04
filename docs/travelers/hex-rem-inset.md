# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Cut 6c array X GAP vs machine jog.
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
5i   Cut                6c array X GAP + machine jog              5311ff4
5i2  Cut                6c2 hide skeleton X OFFSET              589b805
4    Look               Owner. No Codex review until Send.
7    Send for review    PR 136 ready; @codex on a1ca52c
8    Inspection         Cut 7 feasible cusp offset P1           3158867
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

### Cut 6c — array X GAP and machine jog are different inputs
Skull armed. Pockets-only from Cut 6 stays.

Two shop inputs. Do not mix them.

Array (HMI grid):
- COLUMNS = pocket count
- ROWS = 1
- X GAP = minimum edge-to-edge on X between consecutive painted pockets
  X GAP = (center_x[i+1] - center_x[i]) - D_p
  Not the FLiPIT global GAP chip. Not X ROW GAP.
- Y GAP = 0
Do not put JOG X or JOG Y in the array.

Machine offset (global jog, not the array):
- JOG X / JOG Y = first painted pocket from rem 0,0
Type those on the machine as the work offset, then run the 1-row array.

Drop X OFFSET from the skeleton ticket.
Virgin hex ticket is unchanged when skull is off.
No NC. Done only after origin has the implement commit.
