# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Docs / spitball this job. No host Cut until Owner locks.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.
Not a second floating box with 8px air.
Not dropdown menus. Words only. Click the word.

Shut:

```
[ −90 ][ +90 ]  12.000 × 8.000  [calc] [▴]
```

Open — bar grows up. Picker is shorter than the ticker and right-flush. Ticker top radius dies where they meet.

```
                         Part   Gap   Margin   Reset
[−90][+90]  12.000 × 8.000  [calc] [▾]
```

## Pin so far

- Picker above ticker.
- Attached. Seamless. No 8px air.
- Right edges flush. Picker is not full ticker width.
- Picker shorter than ticker height.
- Words only. Gap between words. No chip padding. No boxed buttons unless a hit target fails.
- Still slides. User can leave it open.
- Chevron still opens / closes.
- Edit still happens in the ticker box. Lit word is the label.
- ±90 and calc stay on the ticker row.

## Open

- Exact picker height.
- Word gap px.
- Shared wall radius when open (0 on the join, 8 on the outer corners?).
- Reset stays a word, or becomes the eraser after lock.
- Phone hit size if words have no pad.

## Out

React port. HUD disappear leftover from #124. Live-resize on blank drag.
