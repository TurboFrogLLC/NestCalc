# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Cuts A–D landed. Cut E look is still this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.

Shut — one stroke around the ticker:

```
[ −90 ][+90]  12.000 × 8.000  [calc] [▴]
```

Open — inverted-L. Inset join line. 6px inside corner.

```
                         ┌ Part  Gap  Margin  Reset ┐
                         │  ─── inset 8px ───  │
[−90][+90]  12.000 × 8.000  [calc] [▾]
```

## Cut lock (landed A–D)

```
picker height    = 22
word gap         = 8
join radius      = 0 on the shared top-right only
outer radius     = 8 on ticker
picker radius    = 6
picker pad L/R   = 8
picker pad T/B   = 0
travel gap       = 2
hits             = 28
travel pad       = 6 T/B · 8 L/R
```

Idle hits stay idle. Tap highlight transparent. Click blurs.
Closed: one stroke around the ticker. Open: inverted-L. Picker overlaps travel top by 1.1px.

## Cut E (open)

- Join line returns under the picker. It does not connect to picker left or right. 8px gap each side.
- Host now: `.bt-picker { border-bottom: 0; bottom: calc(100% - 1.1px); }`. Paint a 1.1px rule `rgba(26,20,40,0.22)` inset 8px L/R. Do not restore a full picker bottom border.
- Inside corner where picker left meets travel top: 6px radius on the outer stroke. Not a sharp 90. Fill stays `#E8E8E8`.
- `#bt-rot-ccw` + `#bt-rot-cw` gap = 0. Hits stay 28. Do not change travel pad, readout, calc, or chevron spacing. `.bt-travel` gap stays 2 everywhere else.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
