# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Cuts A–E landed. Cut F look is this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.

Shut — one stroke around the ticker:

```
[ −90 ][+90]  12.000 × 8.000  [calc] [▴]
```

Open — inverted-L. Inset join line. Inverse fillet on the **inside left** join only.

```
                         ┌ Part  Gap  Margin  Reset ┐
                         │  ─── inset 8px ───  │
[−90][+90]  12.000 × 8.000  [calc] [▾]
                         ^ inside-left 6px concave
```

## Cut lock (landed A–E)

```
picker height    = 22
word gap         = 8
outer radius     = 8 on ticker
picker radius    = 6
picker pad L/R   = 8
picker pad T/B   = 0
travel gap       = 2
rotate pair gap  = 0
hits             = 28
travel pad       = 6 T/B · 8 L/R
join line        = 1.1px rgba(26,20,40,0.22) inset 8px L/R
```

Idle hits stay idle. Tap highlight transparent. Click blurs.
Closed: one stroke around the ticker. Open: inverted-L. Picker overlaps travel top by 1.1px.
Inset join line under picker does not touch picker L/R.

## Cut F (open)

- Wrong corner from Cut E: travel **top-right** under the picker is **not** radius 6. Flatten that outer right join.
- Right corner: picker left × travel top. 6px **concave / inverse** fillet. Opposite the picker outer convex 6. Same 1.1px stroke. Fill `#E8E8E8`.
- Inset join line unchanged.
- Edit inputs `border-radius: 6px`.
- No swap on Blank / Part / Gap ticker edit. Link stays. Inputs sit closer after swap is gone.
- Send from ticker edit must not freeze the page. After Send, ticker / picker / bed / HUD / zoom still take clicks. No leftover overlay. Phone HUD-leave from #124 is still out unless it is this Send lockup.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124 (except Send lockup). Live-resize on blank drag.
