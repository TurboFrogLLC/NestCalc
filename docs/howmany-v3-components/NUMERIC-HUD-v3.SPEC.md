# FlipIt — Numeric HUD — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Product:** **FlipIt**  
**Surface name:** **Numeric HUD**  
**HTML:** `docs/howmany-v3-components/NUMERIC-HUD-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Tip commit:** `bec93ffa2872155d293b9e7ff8424250c1e45c98` (P0 pack)  
**Tip blob:** `d8a701b903480c66ebf54621684eff1cddc29bd5` (post-naming HTML)  
**Authority (source composition):** `fb011e6b230b5f7b4d28751554257782cf9c1b51` · blob `69d0bd9a17e9c10cc716f604726c8cdeea678772`  
**Class:** Exploratory component only · not product GOAL · not bridge  

**Authority note**  
Extracted surgically from composition tip **fb011e6b** — the last completed state **before R29** introduced the real LaserBed surface.  
This is the **advanced dialed HUD** (dark 44px header, 15.4px radius, R20 Wordmark/mono, Auto-Size / FLiPIT footer chips, 600ms collapse, **position hold**).  
Not the older thin baseline (`NUMERIC-HUD-v3-LOCKED.html` / 230px / 520ms light toolbar).

NO bed · NO LaserBed SVG · NO FLiPIT panel · NO toolPath · NO isolator · NO child-spec.

---

## Shell

| Token | Value |
|-------|-------|
| Width | `max-content` · min-width **268px** |
| Radius | **15.4px** (`--radius`) |
| Fill | `#D8D6E2` (`--frost`) |
| Outer ring | `::after` 2px solid ink@0.22 + drop shadow `0 18px 40px -12px` |
| Header | **Dark ink** `rgba(26,20,40,0.82)` · **44px** fixed · full-bleed |
| Body pad | 13.2px 7.7px (matches header side inset) |
| Stage (standalone only) | soft 26.4px grid on `#F4F4F6` (demo surface, not product bed) |

## Motion

| Token | Value |
|-------|-------|
| `--motion-collapse` | **600ms** |
| `--motion-expand` | 560ms |
| `--motion-mode` | 420ms (calc ↔ HUD instant height lock) |
| `--motion-popover` | 180ms |
| `--motion-popover-out` | 145ms |
| Ease | standard / decelerate / accelerate |

Collapse = CSS `grid-template-rows: 0fr ↔ 1fr` on `#hud-body`.  
Never set `display` on `#hud-body` (breaks grid collapse).

## Type (R20)

| Role | Font |
|------|------|
| Labels / chrome / chips | system / SF Pro Text (Wordmark) |
| Numbers / tickers / LCD | mono (`--font-mono`) · tabular-nums · weight 650 |

## Structure

```
.keypad#hud
  .keypad-header (44px dark)
    #calc-toggle (tool)
    .header-spacer → .header-part-ticker (collapsed only)
    #btn-chevron (tool)
  #hud-body
    #hud-body-inner
      #hud-mode
        .param-rows
          Part size · Blank size · Gap · Margin  (label + ticker + popover)
        .hud-footer-sep
        .hud-controls
          #btn-auto-size  (AUTO-SIZE)
          #btn-gcode      (FLiP + IT wordmark)
      .classic-calc (hidden until calc-mode)
```

## Header tools

| Token | Value |
|-------|-------|
| Size | 28.6 × 28.6px (`--icon-btn`) |
| Radius | 6.6px (`--chip-r`) |
| Idle | transparent · border white@0.22 · icon white |
| Hover | white@0.12 fill · border white@0.35 |
| Calc engaged | `--blue-28` fill · white icon · blue border |
| Chevron | never inherits active-calc; rotates 180° when expanded |

## Tickers + rows

| Token | Value |
|-------|-------|
| Label width | 70.4px fixed · Wordmark 11px · uppercase |
| Ticker | 21ch · 28.6px · blue-22 fill · blue border@0.35 · mono 12.1px |
| Margin ticker | may grow two lines (`L R` / `B T`) |
| Hover / open | stronger blue fill |

## Popovers

| Token | Value |
|-------|-------|
| Width | 286px |
| Shell | ink@0.82 · amber text `#FFCE1B` · border white@0.12 |
| Fields | white@0.7 chips · mono digits · static clear × slot |
| Selection | black@60% over white field · text `#FFCE1B` (R12) |
| Placement | smart outside HUD (right → left → bottom → top) |

## Footer chips

| Token | Value |
|-------|-------|
| Height | 28.6px · equal flex |
| Fill | dark ink@0.82 · amber text |
| AUTO-SIZE | solid uppercase |
| FLiPIT | `FLiP` white + `IT` amber (case-sensitive, no forced uppercase) |
| Press | scale 0.98 |
| Standalone | **no-ops** (FLiPIT is its own component package) |

## Behavior locks

- **Position hold:** collapse / expand keeps the exact left/top. No dock to corner, no restore memory. Drag freely; collapse stays put; expand reopens in the same place.
- Calculator mode swaps body content; expands if collapsed; does not open a separate window.
- Tickers open popovers; popovers sit outside the HUD and avoid other surfaces when present.
- Link-button chrome (`.active` + `aria-pressed` on `[data-part-link]` / `[data-blank-link]` / `[data-gap-link]`) syncs from `paramState.*.linked` on popover open and close-X restore.
- Clear × on fields blanks for re-type (does not force 0.000).
- Drag is on the entire header (buttons stay clickable).
- Footer AUTO-SIZE / FLiPIT are visual chrome only in standalone (bridges live in composition).

## Out of scope for this file

- LaserBed / blank-tied floating ticker (R31+)
- FLiPIT panel (own package)
- toolPath / backplot (own package)
- Sandbox isolator
- Child-spec panel
- Composition host / multi-surface orchestration

## How to use

1. Open `NUMERIC-HUD-v3.html` alone in the browser.
2. Verify: dark 44px header, collapse 600ms, calc toggle, tickers → popovers (4-way), drag, footer chips present but no-op, link chrome sync on open/close-X.
3. Any residual that changes numbers or structure → update this SPEC tip fields + Changelog after PASS.
4. Do not re-introduce bed surface into this file.

## Changelog

| Date | Tip | Change |
|------|-----|--------|
| 2026-08-16 | — | Individual package first created from older thin lock (`NUMERIC-HUD-v3-LOCKED.html`). |
| 2026-08-17 | — | **Re-locked to advanced pre-LaserBed authority** `fb011e6b`. SPEC rewritten to match dark 44px header · 15.4px radius · 600ms collapse · Auto-Size/FLiPIT footer · R20 type. |
| 2026-08-17 | `092777a5` | **Position hold** — collapse/expand keeps exact left/top. Removed R18 dock-to-corner + restore memory. Initial placement only (16,16). HTML blob `221fb75e`. |
| 2026-08-17 | `bec93ffa` | **P0 pack** — never `display` on `#hud-body`; popover placement right → left → bottom → top; blank/gap link chrome sync on open + close-X. |
| 2026-08-17 | — | naming unify FlipIt product · strip decoder/decalc labels |
| 2026-08-17 | tip-sync | **Tip blob** advanced to post-naming HTML `d8a701b9…` (Codex P2). |

---

**Next individual packages (suggested order)**  
1. NUMERIC-HUD-v3 ← **this** (advanced extract)  
2. FLiPIT  
3. toolPath / backplot  
4. LaserBed-v3  
5. Composition shell (re-assemble only after individuals are stable)
