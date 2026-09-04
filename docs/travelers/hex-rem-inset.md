# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Red void row + pocket lock + hex grid above void AABB.
PR: 136
Branch: docs/hex-rem-inset
Head: c7bd067744158226b1283dea8462d098518c18f4
Session: fresh
job_id: NGJ-20260903-hex-rem
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Rem-pocket spitball
2    Start-branch       Owner local / Codex App
3    Cut                1 red void row + pocket inset           2bb43c4
5    Cut                2 left-refill + hex diameter chip       e964f1f
5b   Cut                3 pocket lock + hex grid above void AABB
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
Worker worktree is not Owner Look.
Owner Look clone: /Users/computer/wrecklesstoddler/vibe/projects/nestcalc
Worker must push origin/docs/hex-rem-inset after the Cut. Unpushed commits are not Look. Do not edit the nestcalc clone.

## Cut lock

### Cut 1 / Cut 2
Landed. Diameter chip and rem faces stay. HOLE DIA 0 restores virgin hex.

### Cut 3 — pocket lock + hex grid above void AABB
Red voids stay inside the rem. If B + D_h + T > blankH, do not paint a void row through the blank stroke.

Pocket inserts sit in the cusps and lock. Ticket row 1 = those locked inserts.
Ticket row 2 is not another cusp copy. It starts above the red AABB: Y = redAABB.top + g + R_p. Runs from origin X across the rem.
That row and every row above sit on one hex grid (p,h from D_p + typed GAP). Occupied if the cell clears red walls, locked pockets, rem L/R/T/B, and typed GAP. Empty cells stay empty only when a neighbor would collide. Do not greedy-scatter. Do not leave walkable hex holes.
Dodge the locked pocket parts. Then stack the same grid.

Do not add a second red row. Do not emit NC. Do not steal PART SIZE or GAP.
Done when shot-style rem shows locked cusp inserts plus a regular hex field above the void box, no right-side swiss cheese.
Done only after origin/docs/hex-rem-inset has the implement commit.
