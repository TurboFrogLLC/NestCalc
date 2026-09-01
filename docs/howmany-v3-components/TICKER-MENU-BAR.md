# Ticker menu-bar

Child of `feat/v3-ticker-door` (#121). After picker-words #124. PR #125.
Not `main`.
Product is FLiPIT. Host stays `docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html`.

Owner locked. Desktop chrome. Phone is the remote look surface only.
Cuts A–F landed. Cut G look is this traveler.

## Picture

Picker sits **above** the ticker. Attached. Looks like a menu bar.

Shut — one stroke around the ticker:

```
[ −90 ][+90]  12.000 × 8.000  [calc] [▴]
```

Open — inverted-L. Inset join line. Convex quarter at the inside-left step.

```
                         ┌ Part  Gap  Margin  Reset ┐
                         │  ─── inset 8px ───  │
[−90][+90]  12.000 × 8.000  [calc] [▾]
                         ^ 6px convex quarter in the grid
```

The stroke walks **around** the step. It does not scoop into the chrome.

## Cut lock (landed A–F)

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
input radius     = 6
swap             = off (Blank / Part / Gap)
```

Idle hits stay idle. Tap highlight transparent. Click blurs.
Closed: one stroke around the ticker. Open: inverted-L. Picker overlaps travel top by 1.1px.
Inset join line under picker does not touch picker L/R.

## Cut G (open)

- Kill the Cut F concave scoop at picker left × travel top.
- Paint a **convex** 6px quarter in the grid at that step. Fill `#E8E8E8`. Stroke 1.1px `rgba(26,20,40,0.22)`.
- Shared edges stay square. Picker does not lift off the ticker on the right.
- Travel top-right under the picker stays flat.
- Outer L corners keep picker 6 / ticker 8.
- Inset join line unchanged.
- Not `border-radius` on the travel box that turns into the chrome.

## Out

React port. Slick mobile layout. HUD disappear leftover from #124. Live-resize on blank drag.
