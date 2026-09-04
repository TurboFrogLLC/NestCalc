# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Cut 6b SKEL L/B on init card.
PR: 136
Branch: docs/hex-rem-inset
Head: 45d1db20ec59280a0d15403641099abad08ae864
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
5h   Cut                6b SKEL L/B on init card
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

### Cut 6b — SKEL L / SKEL B on the init card
Skull-arm init card already has SKELETON W×H, CUTOUT D, LATTICE GAP, NEW PART D, don't-show-again.
Add SKEL L and SKEL B on that card, same input chrome, defaults 0.250 and 0.500, 3 dp, select-all on click.
OK writes those two into the rem faces and places the cutout row. Live ticker SKEL L / SKEL B stay; they are not removed.
Do not add nest L/R/T/B to the card. Do not restore Lattice B or extra hex. Pockets-only law from Cut 6 stays.
No NC. Done only after origin has the implement commit.
