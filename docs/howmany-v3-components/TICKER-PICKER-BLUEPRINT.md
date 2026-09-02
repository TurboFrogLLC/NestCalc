# Side-stack sheet + ticker lock

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127)
Lock: Cut 11 / PR 131

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

## Cut 8 blank ticker corrective

- The outer bar alone is 28.6px high: `#E8E8E8`, 6.6px radius, and `0 0.5px 1px rgba(0,0,0,.25)` shadow. Its travel and size children do not carry an inner 28px height.
- It uses the host's stock Lucide `rotate-ccw` and `rotate-cw` paths, each in a 28px hit with an 18px glyph, `viewBox="0 0 24 24"`, 2px round stroke.
- Inset vertical rules separate rotate pair, size, and count without touching the bar's top or bottom edge. Size and count share 12.1px / 650 / mono; the count is `#538BEC`.
- Rotate controls apply −90/+90. The count is live from blank, part, gap, margin, and rotation state; it does not construct AutoNest.
- MARGIN keeps its complete 6.6px radius, full 1.1px stroke, and own shadow, with visible overflow through the sheet stack. No picker, calculator, chevron, or popover is introduced.

## Cut 10 in-chip editors

- Clicking PART SIZE, BLANK, or GAP replaces that chip's readout with one X/Y editor row. The first field select-alls on open; Check commits, X cancels, and there is no link or swap control.
- Clicking MARGIN expands that same chip downward into L, R, B, T fields and Check/X. The outer chip keeps its complete 6.6px corners, full 1.1px stroke, own shadow, and visible bottom corners.
- No popover or dark 286px panel participates in the interaction. There is no picker, calculator, chevron, or restored bed.

## Cut 11 editor + gutter tweak

- Each in-chip input is direct white 12.1px / 650 / mono text with no nested field box, border, or padding. Its measured width grows right with its value. GAP alone puts a link control between Y and Check; no other editor has link or swap.
- Clicking the ticker's blank size opens the BLANK chip editor contract, including select-all, Check, and X. The ticker remains one 28.6px row with its existing rotate pair and live count.
- MARGIN's closed text has no plus separators. Its open L/R then B/T editor is an even two-column grid with a taller complete parent chip: 6.6px corners, 1.1px stroke, and own shadow.
- The 48px header-to-ticker gap equals the 48px sheet-right-to-blank gap. During the existing sheet-width glide, the blank moves right by exactly the sheet's width delta and moves back on close; browser-width clamping remains in force.
