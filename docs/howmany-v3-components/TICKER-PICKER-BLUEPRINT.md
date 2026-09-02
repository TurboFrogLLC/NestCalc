# Ticker + picker blueprint

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127). Chrome: ticker-door (121–125) on that stage (129).
job_id: NGJ-20260901-tickerbp

This file is the schematic. The host follows it. Do not invent a second ticker.

## Subject

The HUD is the ticker + picker only.

```
                         ┌ Part   Gap   Margin   Reset ┐   picker h 22
                         │        inset 8px L/R         │   join 1.1px
[−90][+90]  12.000 × 8.000  [calc] [▴/▾]                   travel
```

Closed: one stroke around the travel row. Picker hidden.
Open: inverted-L. Picker sits on the travel top edge, right-aligned to the calc+chevron cluster. Join line under the picker, inset 8px L/R, does not touch picker L/R.

## Travel row (left → right)

| Piece | Size | Gap |
| --- | --- | --- |
| −90 | hit 28 × 28 | pair gap 0 |
| +90 | hit 28 × 28 | travel gap 2 after pair |
| size field | live blank W × H, 3 dp, input radius 6 | travel gap 2 |
| calc | hit 28 × 28 | travel gap 2 |
| chevron | hit 28 × 28 | — |

Travel pad: 6 T/B · 8 L/R.
Travel outer radius: 8.
Idle hits stay idle. Tap highlight transparent. Click blurs.

## Picker menu (open only)

| Piece | Size |
| --- | --- |
| height | 22 |
| words | Part · Gap · Margin · Reset |
| word gap | 8 |
| pad L/R | 8 |
| pad T/B | 0 |
| radius | 6 |

Part / Gap / Margin open that field’s retained controls on the calculator *surface* (chips + fields only).
Reset is a later leftover (129 packslip). Do not fake it in this job unless the Cut can do it without growing scope.
−90 / +90 are later leftovers (129 packslip). Chrome stays; wiring is not this job.

## Calculator surface (picker-opened)

Allowed on that surface:
- Blank / Gap / Margin (and Part when selected) field chips
- preset chips that already live on those fields

Forbidden on that surface:
- the numeric keypad / calc pad (`C ± % ÷` grid)
- AUTO-SIZE / HEXNEST / FLiPIT chips
- Numeric HUD card chrome from pre-127

The pad is not the presets. Remove the pad from this host surface.

## Pin

Ticker cluster pins to the blank in viewport coordinates.
Gap from blank top edge to cluster bottom = 10px.
Use live cluster height, not a hardcoded 34.
Stay below the app header.

## Not this job

- AutoNest
- laser bed / grid / rulers / nest box
- rotate wiring
- Reset behavior (unless free)
- React port
