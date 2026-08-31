# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
One Lite Cut. Merge into #121 after Inspection is clean.

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

## Cut lock

```
picker height    = 22
word gap         = 8
join radius      = 0
outer radius     = 8
picker pad       = 0
```

- Desktop chrome this job.
- Picker above ticker. Attached. No 8px air.
- Right edges flush. Picker is not full ticker width.
- Words only: Part Gap Margin Reset. Gap 8. No chip padding. No boxed buttons.
- Reset stays a word.
- Still slides. User can leave it open.
- Chevron still opens / closes.
- Edit still happens in the ticker box. Lit word is the label.
- ±90 and calc stay on the ticker row.
- Ticker tokens from #124 stay: outer 42.2, hits/inputs 28, pad 6/8, radius 8 except the open join.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
