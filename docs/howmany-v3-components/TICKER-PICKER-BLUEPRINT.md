# Side-stack sheet + ticker lock

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127)
Lock: Seq 7 / PR 131

This replaces the former ticker-picker blueprint. It is intentionally not a picker schematic.

## Subject

The stage subject is the blank, its front ticker, and the left sheet together.

```
header 64px

canvas pad 48px  PART SIZE
                 [ 1.250 x 3.375 ]
                 BLANK
                 [12.000 x 8.000 ]     blank + front ticker
                 GAP
                 [ 0.375 x 0.125 ]
                 MARGIN
                 [ 0.250 all     ]
```

## Left sheet

- Transparent and borderless; it occupies a left lane rather than drawing a panel.
- Its top is `--app-header-h: 64px + --canvas-pad: 48px`; the sole measured inset is 48px.
- Labels are above chips and share their left edge: PART SIZE, BLANK, GAP, MARGIN.
- Label token: 11px / 650 / 0.04em / uppercase. Row gap: 8.8px.
- Chip token: height 28.6px, radius 6.6px, narrower than 21ch. Two-line MARGIN has min-height 40px and keeps its own radius and shadow.

## Stops and camera

- The blank stays within browser width and cannot collide with the sheet lane. It may sit below the stack in Y.
- Fit/camera includes blank + ticker + sheet as one subject. The sheet lane is reserved in its width calculation; it is not fabricated with extra sheet padding.
- Ticker is front of the blank and never sits behind or clips through the chips.

## Ticker

- A single 28.6px-high readout, wider only as needed.
- It presents live blank size `W.WWW × H.HHH` and the count number only.
- The travel row includes Lucide rotate-ccw and rotate-cw controls: 28px hits with 18px glyphs. There is no picker bar, calculator, chevron door, or reset.
- The blank arc is grab-only.

## Not in this lock

- Numeric calculator or picker surface
- Laser bed, grid, rulers, nest box, or part rendering
- AutoNest, calculation behavior, or product rename

## Cut 6 correction

The sheet is fixed at right 48px and top `64px + 48px`; no runtime placement may supply an inline left value. Fit, pan, and zoom reserve its lane, while the blank retains a visible 48px gap below the header. MARGIN remains a complete 6.6px box with its own shadow.

## Cut 7 left sheet

This supersedes the Cut 6 sheet side: the sheet is fixed at left 48px and top `64px + 48px`. Fit, pan, and zoom reserve the left lane so the blank cannot enter it; the right lane stays open. Ticker chrome and editor-chip state are unchanged.
