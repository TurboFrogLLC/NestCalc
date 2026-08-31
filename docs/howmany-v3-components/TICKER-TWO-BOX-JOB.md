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

OK (`check`) commits. Cancel (`x`) drops draft. Reset on picker.
Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker.

## Lucide

Picker chips: words only. No icon.

| Control | Lucide |
| --- | --- |
| Door | `chevron-down` / `chevron-up` |
| −90 / +90 | `rotate-ccw` / `rotate-cw` |
| Swap | `arrow-left-right` |
| Link | `link` |
| Presets | `square-arrow-out-up-right` |
| Apply to bed | `square-arrow-out-up-right` on the panel (same mark, other direction of the job) |
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

Axis letters, select-all, gap-link first paint stay as #123.

## Preset door (#124 draft)

Calculator face is the preset surface. Numeric pad is gone.
Rows: Blank, Gap, Margin. Five slots per row. No Part row. No material tree.

```
Blank    [1] [2] [3] [4] [5] [+]
Gap      [1] [2] [3] [4] [5] [+]
Margin   [1] [2] [3] [4] [5] [+]

[ ticker for the lit slot ]  [ send to bed ]
```

Two ways in:

1. Make it here. Hit a slot or `+`. Panel ticker pops with that slot. Type the numbers. That writes the slot. Does not touch the laser bed until Send-to-bed.
2. Save from the bed. Edit Blank / Gap / Margin on the travel ticker. Hit Presets. Face opens on that row. Current draft lands in the first empty slot, or the lit slot if you already picked one. Still a draft on the bed until bed OK.

One way out:

- Send-to-bed on the face hydrates the lit slot onto the laser ticker even if the picker is shut. Blank slot → blank. Gap slot → gap. Margin slot → four sides. Picker does not have to be open.

Tap slot 5 → that row lights, ticker shows slot 5, then Send-to-bed.
Travel `[calc]` opens this face on Blank if no field is in edit.
Presets on the edit bar does not open the HUD inspector and does not open WRITE.

## Camera (#124 draft)

Subject is the **blank**, not the laser bed.

- Default view is blank-fit.
- Fit-to-screen = blank-fit, with air around the blank so it can grow a couple inches.
- Zoom out may show the whole bed. Wheel zoom is leftover, not this job.
- Blank resize does **not** re-fit the camera live.
- Bed is static. Drags do not walk it off the viewport.
- Bed heading / origin plaque stay Out.

## Cycle

Lite: Cut → Send for review → Wait → Inspection → Merge into #121 branch → Close.
Wait: `OM SIGNAL` / `+1` / `@codex review` conclusion.
Drafting. No Cut until Owner says drop.

## Out

React port. HexNest chrome. One-surface mobile. Cut sheet. Merge to `main`.
Pretty preset chrome. Material breadcrumb. Named slots.
Bed heading / origin plaque. Wheel zoom. Live-resize camera.
