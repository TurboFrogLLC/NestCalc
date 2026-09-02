# Traveler

Repo: NestCalc
Owner: wReckless
Part: AutoNest on FLiPIT host
Description: Port V2 autoNestEngine onto COMPOSITION-FLIPIT-v3. Menu hit on the center HUD arms AutoNest. Cut 1 is best uniform orientation. Cut 2 is two-group plus trim. No picker. No calc. No bed.
PR: 133
Branch: docs/autonest-host
Head: 0eb6d636ecc666ed18bd152a3279bf1bc37b628c
Session: fresh
job_id: NGJ-20260902-autonest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Cut 1 best-orientation; Cut 2 two-group + trim     0eb6d636ecc666ed18bd152a3279bf1bc37b628c
2    Start-branch       Owner remote / Codex App
3    Cut                1 HUD menu + calculateBestUniformNest
4    Look               Owner htmlpreview. No Codex.
5    Cut                2 calculateAutoNest two-group + trim line
6    Look               Owner htmlpreview. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/autonest-host.md
When this packets log → docs/travelers/autonest-host-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living SPEC → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When the engine → src/lib/autoNestEngine.ts
When the engine tests → src/lib/autoNestEngine.test.ts
When the uniform nest → src/lib/nestcalc.ts

Proof: htmlpreview on this branch host. Not Vercel.
Do not restore picker, calculator, chevron, old popover, or bed.
Do not rewrite autoNestEngine. Host consumes it.
Do not invent a third nest formula.

## Cut lock

### Cut 1 — HUD menu + best uniform
Center HUD order: rotate-ccw | rotate-cw | blank size | Lucide menu | count.
Menu hit matches rotate hits: 24px hit, 16px glyph, stroke 2, 24 viewBox.
Lucide `menu` paths only: M4 5h16 / M4 12h16 / M4 19h16.
Menu off: nestLayout grid as on main.
Menu on: call calculateBestUniformNest with live blank, part, gap, margin. If 90° wins, set partRot to match and redraw tiles + count.
Idle size/rot edits while armed re-run best uniform.
Menu off returns to the current rotate state and nestLayout.

### Cut 2 — two-group + trim
While menu is on, call calculateAutoNest. If two-group totalParts beats uniform, count is that total. Draw both groups as tiles and one trim line on the blank.
If two-group is not better, keep Cut 1 uniform.
No React AutoNestPreview. No HowMany shell. Engine stays in src/lib.
