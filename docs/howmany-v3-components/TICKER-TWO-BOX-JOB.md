# Ticker two-box job

Child of `feat/v3-ticker-door` (#121). Two-box landed via #122 at `fd63714`. Look-fit is #123.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

HTML host this job. React/shadcn port leftover.

## Lock — two-box (landed)

Two containers. 8px air. Calc lives in the travel box.

Travel (picker shut):

```
[ −90 ][ +90 ]  26.500 × 18.000  [calc] [▾]
```

Travel (picker open) — bar slides up by picker height + 8px air. Blank does not move.

```
[ −90 ][ +90 ]  26.500 × 18.000  [calc] [▴]

[ box Part ][ start Gap ][ align Margin ][ eraser Reset ]
```

Edit — ±90 and calc leave. Whole travel box is the field. Lit picker chip is the label. Axis letters on the bar. No field word.

OK (`check`) commits. Cancel (`x`) drops draft. Send (`square-arrow-out-up-right`) opens `#hud` calculator preset surface for Blank, Gap, Margin only. Not `.param-popover` WRITE. Reset on picker.
Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker.

## Lucide (#123)

| Control | Lucide |
| --- | --- |
| Part | `box` + word Part |
| Gap | `between-horizontal-start` + word Gap |
| Margin | `align-start-vertical` + word Margin |
| Reset | `eraser` + word Reset |
| Door | `chevron-down` / `chevron-up` |
| −90 / +90 | `rotate-ccw` / `rotate-cw` |
| Swap | `arrow-left-right` |
| Link | `link` |
| Send | `square-arrow-out-up-right` |
| OK | `check` |
| Cancel | `x` |
| History | `corner-up-left` / `corner-up-right` |

Picker chips: icon left, word right.

## Tokens as-built (#122)

`.bt-edit input` height **28px**. `.bt-hit` was 34px inside 3px pad + 1.1px border → ~42px outer. That is the fat hit.

HUD `--chip-h` 28.6 and popover XY 30.8 stay HUD. Do not mix.

## Look-fit lock (#123)

```
input height     = 28
button / hit     = 28 × 28
travel icon      = 18 (unchanged)
picker icon      = 16 (unchanged)
pad T/B          = 3
pad L/R          = 8
radius           = 10
border           = 1.1
item gap         = 3
outer box height = 28 + 3 + 3 + 1.1 + 1.1 = 36.2
air between boxes = 8
```

Icons centered in the 28 hit. No extra inner pad.
Picker chips 28 tall, same pad and radius.
Axis letters: Part/Gap X Y. Margin L R B T (match HUD field order).
Focus select-all on edit inputs, same as HUD popover.

Link first paint: if X ≠ Y, link off. `paramState.gap` boots linked true at 0.375 × 0.125 — that lie does not copy into the edit bar.

Send morphs `#hud` calculator preset surface. Exit calc first if calc is on. Do not open floating WRITE card.

Anchor-right under the mouse is a try. Keep-out still wins if count/handle overlap.

## Cycle

Lite: Cut → Send for review → Wait → Inspection → Merge into #121 branch → Close.
Wait polls this draft PR for `@codex review` conclusion or `OM SIGNAL` / `+1`.

## Out

React port. HexNest chrome. Bed lock. One-surface mobile. Cut sheet. Merge to `main`.
