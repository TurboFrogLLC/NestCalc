# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Hex arm + circle tiles + auto inset packer + array ticket faces.
PR: 135
Branch: docs/hex-nest
Head: 731fc69468ec1430fc6aa137256d154393869c9f
Session: fresh
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner local / Grok Build
3    Cut                1 hex arm, circles, packer, array faces  61c7157
3b   Cut                1b ticket off NE arc                    5a4db80
3c   Cut                1c ticket in left stack                 665aaa8
3d   Cut                1d exclusive arms, X OFFSET             e6eef97
5    Cut                2 max-squeezed rows, GAP held           3b11920
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

Shop: Grok Build, Grok 4.6, high
Grok Build worktree is not Owner Look.
Owner Look clone: /Users/computer/wrecklesstoddler/vibe/projects/nestcalc
Worker must push origin/docs/hex-nest. Unpushed GB commits are not Look.
Proof: Owner local 8091 after ff from origin.

## Cut lock

### Cut 1 / 1b / 1c / 1d
Landed at e6eef97. Do not reopen arm, ticket seat, exclusive arms, or unit suffix.

### Cut 2 — every new row pushes down and away
Typed GAP chip is the inset circle clearance. Live pair always equals D+g. Do not undercut. Do not open the nest to spend leftover height.

For N rows (N≥2):
h_N = min((D+g)·√3/2, (blankH − T − B − D) / (N − 1))
p_N = 2·sqrt((D+g)² − h_N²)
Pick the largest N where p_N still fits one even-row center and one odd-row center inside blankW − L − R.
Origin circle stays at (L+R, B+R). Spread is +X only.
Row 3 copies row 1. Row 4 copies row 2. Same h and half-stagger.

Ticket: COLUMNS, ROWS=N, X GAP=p−D, Y GAP=h−D signed, X OFFSET=L+p/2. No unit suffix.
Do not change hex arm, hamburger exclusive, ticket stack seat, dotted AABB, or HUD pin.
Done when lifting the blank adds a squeezed row as soon as width allows, instead of leaving empty height.
Done only after origin/docs/hex-nest has the implement commit.
