# Side-stack sheet + ticker lock

Product: FLiPIT
Host: `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`
Stage: blank-in-space (127)
Lock: Cut 29 / PR 131

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

## Cut 15 ghost A

- PART SIZE, GAP, and the center bar keep closed-chip chrome while editing. Numbers ghost in place (3 dp, 6ch tabular). Select-all on every field click. No X/Y labels. `×` stays between the pair.
- Check and X sit outside the pill to the right, vertically centered to that chip, not inside the stroke. Do not grow the pill right for actions. GAP Link sits outside right, between the chip and Check.
- Pointer over the whole chip until a number is clicked; I-beam in that field only. Same on the center bar size slot.
- MARGIN closed is `0.250 all` when equal, else two even lines `L 0.250  R 0.250` / `B 0.250  T 0.250`. Never `0 R 0.250B 0.250 T`. Open is that two-line grid in the same width; height grows down only enough for two rows. Check/X outside right. GAP is not shoved sideways.
- Fit clamp and 15px stops stay. No picker, calculator, chevron, popover, or bed.

## Cut 16 ghost highlight + margin center

- Selected number highlight has **3px** air above and below the blue field to the inner stroke. Same math on PART SIZE, GAP, MARGIN fields, and the center HUD size slot.
- While a side chip is open, its fill is **`#E8E8E8`** so the blue select shows. Closed chips stay frost-blue. Center bar fill stays **`#E8E8E8`** closed and open.
- MARGIN two-line L R / B T is vertically centered in its chip: equal padding top and bottom, column gap = row gap, width unchanged. Check/X stay outside right.
- Ghost A stays. Actions stay outside. No pill grow-right. No picker, calculator, chevron, popover, or bed.

## Cut 17 margin vertical inset

- Closed GAP's readout text box measures 7px from its inner top stroke and 7.45px from its inner bottom stroke in the browser's sub-pixel layout. MARGIN's two-line closed and open L R / B T grids use the shared **7px** vertical padding token.
- Column gap = row gap. Width stays. Check/X remain outside right. Open MARGIN remains `#E8E8E8`; Ghost A, no picker, no calculator, no chevron, and no bed stay locked.

## Cut 18 center-bar lock

- Center the travel box from its closed width once. Its left and width stay fixed during BLANK-editor open, field click, Check, and X; editor fields retain closed 13.31px / 650 / mono type and cannot widen the box.
- Check/X hang outside right and never participate in centering. First BLANK-field click select-alls.

## Cut 19 parts on blank

- Unhide only the live part tiles within the blank. Derive columns × rows from the existing blank, part, gap, margin, and quarter-turn count formula so the blue count equals the visible tile count.
- Keep LaserBed fill, grid, rim, rulers, nest-box chrome, picker, calculator, chevron, and other bed surfaces absent.

## Cut 20 presets block under margin

- Place PRESETS directly under MARGIN in the left sheet. The 11px / 650 / 0.04em uppercase label shares the side-label type; its right edge carries Lucide plus and minus at the header's 2px stroke weight. Plus appends one margin-preset slot; minus removes the last. Start with four.
- The slots are a 2×2 grid: two 31.46px frost-blue chips per 154px row with one shared 8.8px gap. Both rows therefore measure exactly 154px, matching the PART SIZE, GAP, and MARGIN chips.
- Slot chips retain 7.26px radius, 1.1px stroke, `0 0.5px 1px rgba(0,0,0,.25)` shadow, and 13.31px / 650 / mono type. They apply a stored margin value only; no picker, popover, calculator, chevron, or bed is reintroduced.

## Cut 22 boot defaults

- Boot and empty state: PART SIZE `2.500 × 3.500`; BLANK `12.000 × 8.000`; GAP `0.125 × 0.125`.
- MARGIN is `L 0.250  R 0.250` / `B 0.500  T 0.250` on two closed lines because B is `0.500`.
- Defaults change only; preserve the preset modal, pencil hydrate, label-row Check/X, gold arm, blank-grow-past-stop, parts-on-blank, Fit, pan stops, and no picker, calculator, or bed.

## Cut 24 preset modal wire

- PRESETS reads `PRESETS`, Lucide pencil paths `M21.174 6.812…` and `m15 5 4 4`, plus, minus. Slot buttons show a name only—never an ordinal—and retain the GAP-chip 72.6 × 31.46 token in the 154px two-column grid.
- Idle tap hydrates the live Blank X/Y, Gap X/Y, and Margin L/R/B/T state. Pencil then any slot tap, including an already armed slot, calls `openMarginPresetCard(index)`, keeps the pencil visibly pressed, arms the slot with `rgba(255,206,27,0.55)` fill and `rgba(201,140,0,0.85)` stroke, and opens the 240px, 8.8px-padded, 7.26px-radius `#E8E8E8` card through its explicit flex-layer open state. The layer sits above chips, HUD, and blank without a native `hidden` attribute.
- The card carries a 222.4 × 31.46 name field; only the section labels Blank, Gap, and Margin above their 72.6 × 31.46 paired fields (8.8px gap); and a single footer row with Copy live at left and unboxed 22px-hit / 14px Lucide Check and X at right. Empty fields hydrate from the live tickers. Check saves, X cancels, and a blank name becomes `Preset`.
- Opening a live chip editor clears any preset arm and never writes that slot. The card is not the old picker or popover; center-bar lock, ghost editors, parts on blank, Fit, stops, and boot sizes stay unchanged.

## Cut 25 preset card stack and footer

- Promote the explicit flex-layer to a body-level fixed sibling at z-index 201 so the open overlay covers the header, centered HUD pin, sheet chips, and blank and blocks their pointer input.
- Preserve the 240px `#E8E8E8`, 7.26px-radius card and 8.8px padding. Its 222.4px inner width contains a 222.4 × 31.46 name field; each Blank, Gap, and Margin axis box is 106.8 × 31.46 with a 7.26px radius and an 8.8px pair gap. Name, section blocks, and footer are separated by 8.8px.
- Copy live is a 31.46px-high, 7.26px-radius chip-type button on the footer left; the unboxed 22px Check/X actions stay on its right. Hydration, pencil paths, gold arm, plus/minus, center-bar lock, ghost editors, parts on blank, Fit, and stops remain unchanged.

## Cut 26 preset arm, card pad, HUD lock

- Idle slot tap hydrates live Blank, Gap, and Margin and arms that selected live slot with `rgba(255,206,27,0.55)` fill and `rgba(201,140,0,0.85)` stroke. Card close retains the arm; a live chip editor remains the only path here that clears it and never writes the slot.
- The blocking `#E8E8E8` card is 252.4px wide with 15px padding on all four edges. Its 222.4px content width keeps the name field at 222.4 × 31.46 and each paired axis field at 106.8 × 31.46 with the 8.8px gap. A 1.1px rule inset by that pad separates Margin from the one-row Copy live / Check / X footer.
- Opening, hydrating, or closing the card does not change the closed centered ticker pin's left coordinate or width. Pencil paths, layer z-index, ghost editors, parts-on-blank, Fit, and stops remain locked.

## Cut 27 pencil-on-selected and inline actions

- When a live slot is armed, pencil-on opens that selected slot’s card immediately; pencil-on without an arm opens no card. Idle hydration retains its gold arm, while a live chip editor still clears the arm without writing the slot.
- Retain the 252.4px card, 15px pad, 222.4px content width, 106.8 × 31.46 axis cells, and one-row Copy live footer. A second 1.1px rule, inset by the card pad, sits between the name field and Blank without adding a label.
- Check and X remain 22 × 22 Lucide hits immediately after the PART SIZE, GAP, MARGIN, and center-bar size readout. GAP Link stays between its numbers and Check. MARGIN’s actions align with the first number row, not the two-row grid’s vertical center. Pencil paths, gold tokens, layer z-index, parts-on-blank, Fit, and stops remain locked.

## Cut 28 Check X on label row

- Open PART SIZE, GAP, and MARGIN move their 22 × 22 Lucide Check/X hits to the respective 11px label row, immediately after PART SIZE, GAP, or MARGIN and vertically centered to that label row. GAP Link remains between GAP and Check. Closed labels expose no actions.
- The centered blank-size slot has no separate label, so its Check/X remain on its number row. Pencil-on-selected, gold arm, card pad, footer, parts-on-blank, Fit, and stops remain locked.

## Cut 29 pencil hydrate and blank grow

- Pencil with an armed slot still opens that slot's card. With no armed slot, pencil opens the card hydrated from the live Blank, Gap, and Margin values without assigning an arm or writing a slot. Check writes the first empty slot or appends one when all are filled; X closes without a write; a blank name becomes `Preset`. The footer contains Check and X only—Copy live is absent.
- Blank-handle resize may lower camera scale beneath the ordinary zoom floor after the drawn blank reaches a 15px viewport stop. The stops continue to constrain the drawn blank, while the numeric `blankW` and `blankH` and live nest keep growing. Label-row Check/X, gold arm, card pad, parts on blank, Fit, and stops-as-pan remain locked.
