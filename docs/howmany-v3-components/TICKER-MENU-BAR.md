# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Lite Cuts A and B landed. Cut C look is still this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.
Not a second floating box with 8px air.
Not dropdown menus. Words only. Click the word.

Shut:

```
[ −90 ][ +90 ]  12.000 × 8.000  [calc] [▴]
```

Open — picker slides up. Ticker does not move. Right-flush. Shorter than the ticker.
No line under the picker.

```
                         Part   Gap   Margin   Reset
[−90][+90]  12.000 × 8.000  [calc] [▾]
```

## Cut lock (landed A + B)

```
picker height    = 22
word gap         = 8
join radius      = 0 on the shared top-right only
outer radius     = 8 on ticker
picker radius    = 6
picker pad L/R   = 8
picker pad T/B   = 0
```

- Desktop chrome this job.
- Picker above ticker. Attached. No 8px air.
- Right edges flush. Picker is not full ticker width.
- Words only: Part Gap Margin Reset. Gap 8. No boxed buttons.
- Reset stays a word.
- Chevron still opens / closes.
- Edit still happens in the ticker box. Lit word is the label.
- ±90 and calc stay on the ticker row.
- Ticker tokens from #124 stay: outer 42.2, hits/inputs 28, pad 6/8.

## Look refinements

### Cut B (landed)

- Picker pad L/R = 8. Picker outer radius = 6. Ticker outer radius stays 8.
- Open join: ticker top-left stays 8. Ticker top-right goes to 0 under the picker.
- Ticker is static. Picker slides up / down. Do not animate cluster `top` by picker height.

### Cut C (open)

- No line under the picker. Kill picker `border-bottom` and the travel-box top border under the picker overlap. The join is one shell.
- Idle hits stay idle. No filled box on calc, rotate, chevron, readout, or picker words after tap.
- Kill cluster `.bt-hit:hover`, `.bt-hit:focus-visible`, `.blank-ticker:hover`, `.blank-ticker:focus-visible` fills.
- Kill `.bt-hit.is-on` fill on calc / rotate / chevron / door. Link `is-on` only while X/Y are linked.
- `-webkit-tap-highlight-color: transparent` on ticker hits and picker words. Blur the hit after click so Safari does not keep `:focus-visible`.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
