# Ticker two-box job

Child of `feat/v3-ticker-door` (#121). Not `main`.
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

Edit (click Gap) — ±90 and calc leave. Whole travel box is the field. Picker may stay. Lit picker chip is the label. No field word on the edit bar.

```
[ X ] [↕] [ Y ] [🔗]     [bookmark] [✓] [x]

[ Part ][ Gap* ][ Margin ][ Reset ]
```

OK (`check`) commits and returns travel. Cancel (`x`) drops the draft. Send (`bookmark`) earns `#hud` preset morph only. Reset runs on the picker, not an edit field.
Ticker `dblclick` does not open HUD. No `__howManyOpenField` from ticker or picker.

Lucide (#120 table): Part `rectangle-vertical`; Gap `between-horizontal-end`; Margin `align-start-vertical`; Reset `eraser`; Door `chevron-down` / `chevron-up` (end of bar, not between ticker and calc); ±90 `rotate-ccw` / `rotate-cw`; history stays `corner-up-left` / `corner-up-right`.

## Tokens (already in V3 — do not invent)

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
| Keep-out | #lb-hit-corner + #lb-count; whole pair walks left if needed |

Pin from the travel box outer rect only. Do not let pad change `#blank-ticker` width math.

## Cycle

Lite: Cut → Send for review → Wait → Inspection → Merge into #121 branch → Close.
Wait polls this draft PR for `@codex review` conclusion or `OM SIGNAL` / `+1`. Then Inspection. Clean → Merge. Dirty → Corrective Action on this traveler, then Inspection again.

## Out

React port. HexNest chrome. Bed lock. One-surface mobile. Cut sheet. Merge to `main`.
