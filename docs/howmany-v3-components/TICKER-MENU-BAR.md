# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Lite Cut landed. Look refinements below are still this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.
Not a second floating box with 8px air.
Not dropdown menus. Words only. Click the word.

Shut:

```
[ −90 ][ +90 ]  12.000 × 8.000  [calc] [▴]
```

Open — picker slides up. Ticker does not move. Right-flush. Shorter than the ticker.

```
                         Part   Gap   Margin   Reset
[−90][+90]  12.000 × 8.000  [calc] [▾]
```

## Cut lock (landed)

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

## Look refinements (Owner 2026-08-31)

- Picker pad L/R = 8. Words were flush to the ends.
- Picker outer radius = 6. Ticker outer radius stays 8.
- Open join: ticker top-left stays 8. Ticker top-right goes to 0 under the picker. Do not zero both top corners.
- No press imprint. Kill `:active { transform: scale(...) }` and leftover pushed fill on ticker hits, picker words, and calc/chevron/rotate. Hover may tint. After pointer up, chrome looks idle except the lit word.
- Ticker is static. Picker slides up on open and down on close. Do not animate cluster `top` by picker height.
- Host bug: `positionBlankTicker` uses `lift = open ? pickerH : 0` then `top = screenTop - GAP_TOP - travelH - lift`. That walks the ticker. Drop `lift` from `top`. Animate picker height / clip only.
- Also drop cluster `transition: top` for the door. Left may still pin.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
