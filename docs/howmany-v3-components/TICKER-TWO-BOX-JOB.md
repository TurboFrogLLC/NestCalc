# Ticker two-box job

Child of `feat/v3-ticker-door` (#121). Landed via #122 at `fd63714`. Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Kills Plant 1b side rail and Plant 1c glyph-fix on that rail.
HTML host this job. React/shadcn port leftover, not this traveler.

## Lock

Two containers. Air between them. Calc lives in the travel box.

Travel (picker shut):

```
[ −90 ][ +90 ]  26.500 × 18.000  [calc] [▾]
```

Travel (picker open) — bar slides up by picker height + 8px air. Blank does not move. Bed stays live.

```
[ −90 ][ +90 ]  26.500 × 18.000  [calc] [▴]

[ Part ][ Gap ][ Margin ][ Reset ]
```

Edit — ±90 and calc leave. Whole travel box is the field. Picker may stay. Lit picker chip is the label. No field *word* on the edit bar. Axis letters stay (X/Y or T/R/B/L).

OK (`check`) commits and returns travel. Cancel (`x`) drops the draft. Send earns `#hud` **calculator** preset surface, not the floating BLANK SIZE popover. Reset runs on the picker, not an edit field.
Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker.

## Lucide (Owner pass 2026-08-30)

From NestCalc #120 `TICKER-DOOR-MARK.md` plus this pass.

| Control | Lucide | Box |
| --- | --- | --- |
| Part | `box` | picker |
| Gap | `between-horizontal-end` | picker |
| Margin | `align-start-vertical` | picker |
| Reset | `eraser` | picker |
| Door | `chevron-down` / `chevron-up` | last on travel bar |
| −90 / +90 | `rotate-ccw` / `rotate-cw` | travel |
| Swap | `arrow-left-right` | edit bar |
| Link | `link` | edit bar |
| Send | `save` | edit bar on Blank, Gap, Margin only — not Part |
| OK | `check` | edit bar |
| Cancel | `x` | edit bar |
| History | `corner-up-left` / `corner-up-right` | canvas corner |

Not `bookmark`. Not `arrow-up-down` for swap. Not `rectangle-vertical` for Part (Owner: `box`).

## Tokens as built (#122 host `fd9bb3b` + CA `b24f0e5`)

| Token | Value |
| --- | --- |
| Travel bar height | 34px |
| Hit square | 34px |
| Picker height | 28.6px |
| Item gap | 3px |
| Inner pad | 3px |
| Air between boxes | 8px (margin between elements, not inner pad) |
| Corner | 6.6px |
| Stroke | 1.1px rgba(26,20,40,0.22) |
| Fill | #E8E8E8 |
| Type | #1A1428 |
| Ticker type | 12.1px mono 650 |
| Motion | 240ms ease |
| Cluster z | 82 |
| Pin | 20px in from blank right, 10px above blank top |
| Keep-out | #lb-hit-corner + #lb-count |

Pin from the travel box outer rect only.

## Owner look residual (not cut yet)

Seen 2026-08-30 on `/howmany-shell` after #122 merge. Two-box sentence is right. Side rail is gone. Do not ship another cut until these are named.

1. Picker glyphs: Part `box`, Gap `between-horizontal-end`, Margin `align-start-vertical`, Reset `eraser` (eraser already hits).
2. Edit inputs: focus selects all, same as HUD popover fields.
3. Swap is left-right (`arrow-left-right`), not up-down.
4. Axis letters on the edit bar: Part and Gap show X / Y. Margin shows T / R / B / L (or L / R / T / B matching HUD order). No “Gap” word.
5. Send (`save`) only on Blank, Gap, Margin. Opens `#hud` calculator on the **preset** surface. Does not open `.param-popover` BLANK SIZE WRITE.
6. Check and X stay.
7. Anchor: prefer the travel/edit box to keep its right edge under the mouse when entering edit. If that fights keep-out, leave the current left-shift and note it.

No host edit in this note.

## Out

React port. HexNest chrome. Bed lock. One-surface mobile. Cut sheet. Merge to `main`.
