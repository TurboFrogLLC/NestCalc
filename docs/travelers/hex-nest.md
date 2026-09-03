# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex arm + circle tiles + auto inset packer + array ticket faces.
PR: 135
Branch: docs/hex-nest
Head: 665aaa8a93181b2ae999c4fea1744d98eb6a38d3
Session: continuous
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 hex arm, circles, packer, array faces  61c7157
3b   Cut                1b ticket off NE arc                    5a4db80
3c   Cut                1c ticket in left stack                 665aaa8
3d   Cut                1d units, XOR arms, X OFFSET
4    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/hex-nest.md
When this packets log → docs/travelers/hex-nest-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/135

Shop: Codex App, GPT-5.6 Terra, Medium
Proof: Owner remote.

## Cut lock

### Cut 1 / 1b / 1c
Landed. Ticket stays in the left stack between MARGIN and PRESETS.

### Cut 1d — units, XOR arms, X OFFSET
Strip the letters in from every ticket face. Numbers only, 3 dp. Labels stay COLUMNS, ROWS, X GAP, Y GAP, X OFFSET.

Hex and hamburger cannot both be pressed. Arming hex sets hamburger aria-pressed=false and runs hex pack. Arming hamburger sets hex aria-pressed=false and runs rectangle AutoNest. Both off is legal (manual rectangles).

Add X OFFSET: left edge of the first row-2 dotted box, measured from blank 0,0. Inches, 3 dp. Same card, still 154px. Do not add in.

Do not change packer math, circle draw, AABB, HUD pin, stack order, or PRESETS.
Done when ticket has no unit suffix, arms are XOR, and X OFFSET is visible while hex is on.
