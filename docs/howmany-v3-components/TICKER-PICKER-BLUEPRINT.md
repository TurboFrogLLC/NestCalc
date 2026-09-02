# Side-stack sheet + ticker lock

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127)
Lock: Cut 14 / PR 131

This replaces the former ticker-picker blueprint. It is intentionally not a picker schematic.

## Subject

The stage subject is the blank and left sheet; the ticker is an independent fixed HUD.

```
header 64px
15px
                 [ rotate | 12.000 × 8.000 | count ]   fixed, centered ticker
15px             blank top cannot cross

24px inset       PART SIZE   15px   [ blank ]
                 [ 31.46 row ]
                 GAP
                 [ 31.46 row ]
                 MARGIN
                 [ 31.46 row ]

                 15px to viewport bottom
```

## Left sheet

- Transparent and borderless; it occupies a left lane rather than drawing a panel.
- Its top is `--app-header-h: 64px + --canvas-pad: 48px`; its inset is 24px.
- Labels are above chips and share their left edge: PART SIZE, GAP, MARGIN.
- Label token: 11px / 650 / 0.04em / uppercase. Row gap: 8.8px.
- Chip token: height 28.6px, radius 6.6px, narrower than 21ch. Two-line MARGIN has min-height 40px and keeps its own radius and shadow.

## Stops and camera

- The blank stays within browser width and cannot collide with the sheet lane. It may sit below the stack in Y.
- Fit/camera reserves the sheet lane for the blank. The ticker is not part of camera placement.
- Ticker stays above the stage as a fixed HUD and never clips through the chips.

## Ticker

- A single 31.46px-high readout centered in the viewport at 112px from the top, wider only when its blank editor opens.
- It presents live blank size `W.WWW × H.HHH` and the count number only; the blank editor uses two padded white cells and `×`, without X/Y labels.
- The travel row includes Lucide rotate-ccw and rotate-cw controls: 30.8px hits with 19.8px glyphs. There is no picker bar, calculator, chevron door, or reset.
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

## Cut 12 centered ticker + side stack

- The ticker is a fixed viewport HUD, horizontally centered at `top: 112px`. It is not positioned from the blank or camera and does not move on pan, zoom, Fit, or blank resize.
- The complete bar is 10% above the 28.6px lock: 31.46px high, 7.26px radius, 30.8px rotate hits, 19.8px Lucide glyphs, and 13.31px / 650 / mono size and count. `#E8E8E8`, the existing shadow, inset rules, blue live count, and −90/+90 pair stay.
- The bar's size readout is the BLANK editor. Its two padded white fields select-all, type, commit with Check, or cancel with X; `×` alone separates them. It grows right from a fixed left edge.
- The left sheet inset is 24px and the stack is PART SIZE, GAP, MARGIN. BLANK has no sheet row or label. Fit, pan, and zoom reserve the remaining lane.
- Opening a side chip grows that chip and the fixed-left sheet right; the blank follows the width delta and returns on close. The centered ticker stays fixed. GAP alone has Link between Y and Check. MARGIN remains an even, taller L/R then B/T chip with complete 6.6px corners and no pluses or axis labels.

## Cut 13 HUD seats + editor chrome

- Header-bottom to centered-HUD-top is 15px. HUD-bottom to blank-top is a 15px hard stop. The blank cannot cross that line. The centered HUD stays fixed: no pan, zoom, or Fit motion.
- Side chips scale +10% from the 28.6 lock: height 31.46, radius 7.26, type 13.31 / 650 / mono — the same 10% already on the closed bar. Blue count on the centered bar is one step larger: 14.64 / 650 / mono. Closed bar chrome stays.
- Check and X are unboxed Lucide `check` and `x` only, 19.8px / 2px stroke in 30.8px hits, matching the rotate pair and header + / − / Fit. Header + / − / Fit are Lucide `plus`, `minus`, and `maximize` at that same size and stroke.
- Every editor field select-alls on click, not only the first field on open. No X/Y labels; `×` is enough. MARGIN is an even L R / B T grid inside a tight pill: padded white cells, no empty slab, no plus signs, grows right only. GAP keeps Link between Y and Check.
- No picker, calculator, chevron, popover, or bed.

## Cut 14 editor math + 15px stops

- Closed and open chips are one 31.46 row, radius 7.26, type 13.31 / 650 / mono, line-height 31.46, align-items center. Inputs do not drop. White cells pad left/right only. Values are three decimals in 6ch tabular fields with no wrap. Select-all on every field click.
- MARGIN open is an even 2×2: L R then B T, equal column and row gap, one number per cell, shared column left edges. Check and X sit on the right of the grid and center to it. No empty slab. No second popover. The chip is the editor.
- Check, X, and Link are 22px hits with 14px Lucide glyphs, stroke 2. Rotate pair is 24px hits with 16px glyphs, stroke 2. Header + / − / Fit stay as Cut 13.
- One 15px stop: header-bottom → HUD-top, HUD-bottom → blank-top, stack-right → blank-left, viewport-bottom → blank-bottom. HUD stays fixed. Pills grow right only; the blank follows that delta and returns.
