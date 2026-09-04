# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Skeleton arm + one hex grid + pocket columns.
PR: 136
Branch: docs/hex-rem-inset
Head: 4cb4d50deb3cdf2228e44142f1f89c4e63fb45f5
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
5c   Cut                4 skeleton arm + grid origin + init card
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
Grok Build worktree is not Owner Look.
Owner Look clone: /Users/computer/wrecklesstoddler/vibe/projects/nestcalc
Worker must push origin/docs/hex-rem-inset. Unpushed commits are not Look.

Words: skeleton = rem with holes. Cutouts = those holes. Pocket = new part in a cusp. Skull = skeleton arm.

## Cut lock

### Cut 4 — skeleton arm + one hex grid + init card

Arms (glyph swap is not an arm)
- hex off + hamburger on = rectangle AutoNest. Hamburger stays hamburger.
- hex on = hamburger glyph becomes Lucide skull. Skull starts OFF. Rem is empty stock. Virgin hex packer stays the current hex (Cut 2). No cutouts. No init card. Ignore hole D.
- skull click while hex on = skeleton arm ON. Only then: init card, cutouts, pockets, skeleton ticket faces, min-rem clamp.
- skull off while hex on = back to virgin hex. Rem empty again.

Lucide skull viewBox 24:
path m12.5 17-.5-1-.5 1h1z
path M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z
circle 15,12 r1 and 9,12 r1
Tooltip: skeleton cut. Armed skull #16A34A. Unarmed skull #111111.

Init card (only on skull arm, same chrome as preset card)
Fields: skeleton W × H, cutout D default 2.000, skeleton lattice gap, new part D.
Don't show this again checkbox. After OK, values stay live and clamp.
Hmin = B+D_cut+T. Wmin = L+D_cut+R. No paint through the blank stroke.

Chrome (hex on, virgin or skeleton)
Hex PART SIZE: one diameter, Lucide circle-off on the LEFT of the number.
One click on any dimension opens + select-all.

Grid (skull armed only)
One hex lattice for pockets and every blue row. Pockets occupy a subset of columns on the same-stagger line as row 3.
Array X origin = leftmost part of a FULL same-stagger row (row 3 col 1), not the first pocket.
Ticket: COLUMNS, ROWS, X GAP, Y GAP, X ORIGIN (that leftmost full-row X from rem 0,0), POCKET COLS.
Y jog = pocket center Y from rem 0,0. Array negative Y GAP same law as virgin hex.
Row 2+ fill legal hex cells. No swiss cheese when a cell clears GAP, cutouts, and rem edges.

Cutouts red. Not in blue count. No second cutout row. No NC.
Done only after origin/docs/hex-rem-inset has the implement commit.
