# Side-stack sheet + ticker lock

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127)
Lock: Seq 7 / PR 131

This replaces the former ticker-picker blueprint. It is intentionally not a picker schematic.

## Subject

The stage subject is the blank, its front ticker, and the right sheet together.

```
header 64px

canvas pad 48px                 PART SIZE
                                [ 1.250 x 3.375 ]
        blank + front ticker    BLANK
                                [12.000 x 8.000 ]
                                GAP
                                [ 0.375 x 0.125 ]
                                MARGIN
                                [ 0.250 all     ]
```

## Right sheet

- Transparent and borderless; it occupies a right lane rather than drawing a panel.
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
- It presents live blank size `W.WWW × H.HHH` and **HOW MANY PARTS**.
- No picker bar, calculator, chevron door, rotate pair, reset, or control hit remains. The 18px glyph / 28px hit rule is inapplicable because no ticker control remains.
- The blank arc is grab-only.

## Not in this lock

- Numeric calculator or picker surface
- Laser bed, grid, rulers, nest box, or part rendering
- AutoNest, calculation behavior, or product rename
