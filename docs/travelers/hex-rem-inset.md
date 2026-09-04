# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex rem inset
Description: Red void row + pocket inset + left refill + hex diameter chip.
PR: 136
Branch: docs/hex-rem-inset
Head: 43f2b6fced1e16189a12a612efe2c416d2e94642
Session: fresh
job_id: NGJ-20260903-hex-rem
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Rem-pocket spitball
2    Start-branch       Owner local / Grok Build
3    Cut                1 red void row + pocket inset           2bb43c4
5    Cut                2 left-refill after cusp row + hex diameter chip  e964f1f
4    Look               Owner. No Codex.
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
Worker must push origin/docs/hex-rem-inset after the Cut. Unpushed GB commits are not Look. Do not edit the nestcalc clone.

## Cut lock

### Cut 1 — red void row + pocket inset
Landed 2bb43c4 / origin 43f2b6f. One red row from 0,0. Rem faces stay. Do not steal PART SIZE or GAP.

### Cut 2 — left-refill + hex diameter chip
Cusp row is blue row 1 only: one new disk per pocket between reds, offset into the cusp legal.
Rows 2+ re-pack from the origin (+X). Eat leftover width. Keep typed GAP to red walls and to other blues. Row counts may differ. Do not freeze the stack to the cusp-row pitch.

Hex armed: PART SIZE chip stays the same box. One diameter number. Lucide circle-off only, viewBox 24:
M2 2l20 20
M8.35 2.69A10 10 0 0 1 21.3 15.65
M19.08 19.08A10 10 0 1 1 4.92 4.92
Same digit seats as the current size field. Hex off restores X × Y. Linked X=Y only while hex is on is not enough — drop the second number.

Do not add a second red row. Do not emit NC. HOLE DIA 0 still restores virgin hex.
Done when the right-side waste on a wide rem is filled when a left-packed center still clears GAP, and PART SIZE shows one diameter + circle-off while hex is armed.
Done only after origin/docs/hex-rem-inset has the implement commit.
