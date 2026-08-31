# Ticker two-box job

Child of `feat/v3-ticker-door` (#121). Two-box #122. Look-fit #123. Picker-words #124.
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

                    [ Part ][ Gap ][ Margin ][ Reset ]
```

Picker right edge = travel right edge. Words only. No Lucide on picker chips.

Edit — ±90 and calc leave. Whole travel box is the field. Lit picker chip is the label. Axis letters on the bar. No field word.

OK (`check`) commits. Cancel (`x`) drops draft. Send (`square-arrow-out-up-right`) opens `#hud` calculator preset surface for Blank, Gap, Margin only. Not `.param-popover` WRITE. Reset on picker.
Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker.
Send does not write `paramState`. Draft stays until OK or preset confirm.

## Lucide

Picker chips: words only. No icon.

| Control | Lucide |
| --- | --- |
| Door | `chevron-down` / `chevron-up` |
| −90 / +90 | `rotate-ccw` / `rotate-cw` |
| Swap | `arrow-left-right` |
| Link | `link` |
| Send | `square-arrow-out-up-right` |
| OK | `check` |
| Cancel | `x` |
| History | `corner-up-left` / `corner-up-right` |

## Tokens as-built (#123)

```
input height     = 28
button / hit     = 28 × 28
travel icon      = 18
pad L/R          = 8
border           = 1.1
air between boxes = 8
```

## Picker-words lock (#124)

```
pad T/B          = 6
item gap         = 2
hit / input radius = 8
outer box radius   = 10
outer box height = 28 + 6 + 6 + 1.1 + 1.1 = 42.2
picker chips     = words only
picker align     = right edges flush with travel
```

Axis letters, select-all, gap-link first paint, Send isolation stay as #123.

## Cycle

Lite: Cut → Send for review → Wait → Inspection → Merge into #121 branch → Close.
Wait: `OM SIGNAL` / `+1` / `@codex review` conclusion.

## Out

React port. HexNest chrome. Bed lock. One-surface mobile. Cut sheet. Merge to `main`.
