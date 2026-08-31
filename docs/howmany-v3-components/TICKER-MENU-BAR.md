# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Cuts A–C landed. Cut D shell is still this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.
Not a second floating box with 8px air.
Not dropdown menus. Words only. Click the word.

Shut — one stroke around the ticker:

```
[ −90 ][ +90 ]  12.000 × 8.000  [calc] [▴]
```

Open — inverted-L. Picker is a tab on the right. No line under the picker.

```
                         ┌ Part  Gap  Margin  Reset ┐
[−90][+90]  12.000 × 8.000  [calc] [▾]
```

## Cut lock (landed A + B + C)

```
picker height    = 22
word gap         = 8
join radius      = 0 on the shared top-right only
outer radius     = 8 on ticker
picker radius    = 6
picker pad L/R   = 8
picker pad T/B   = 0
```

Idle hits stay idle. Tap highlight transparent. Click blurs.

## Cut D (open)

Closed: one bounding stroke around the ticker only.
Open: that same stroke grows into an inverted-L. It climbs the picker left, across the picker top, down the picker right. There is no horizontal line under the picker.
Left of the picker the ticker keeps its top stroke and top-left radius 8.

Host bug: `.bt-picker` and `.bt-travel-box` each have `border: 1.1px solid rgba(26,20,40,0.22)`. Two boxes = a seam. Cut C mask did not kill it.

Do this:
- Picker `border-bottom: 0`. Picker keeps L / T / R.
- Sit the picker on the travel top stroke. Overlap by **1.1px** (`bottom: calc(100% - 1.1px)` or equivalent).
- Same fill `#E8E8E8` so the travel top stroke disappears only under the picker.
- Do not draw a full-width rectangle around the empty space left of the picker.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
