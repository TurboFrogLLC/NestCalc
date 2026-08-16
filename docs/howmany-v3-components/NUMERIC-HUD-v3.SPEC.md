# NUMERIC-HUD-v3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Composition HTML tip:** `00b7975efea7a28ff60996b1dd09194ec0130234`  
**HTML blob:** `0158c636f1144770432bb792215b22df2cd135cc`  
**OPEN residuals:** R15  
**Detail authority:** composition host · locked layout also in `NUMERIC-HUD-v3-LOCKED.html`

## Shell

| Token | Value |
|-------|-------|
| Width | `max-content` · min `268px` |
| Radius | `var(--radius)` = `15.4px` |
| Fill | `var(--frost)` `#D8D6E2` |
| Outer ring | `2px solid rgba(26,20,40,0.22)` via `::after` + drop shadow |
| Header | dark ink `rgba(26,20,40,0.82)` · height `44px` |
| z-index | `40` |

## Header tools

| Control | Idle | Active |
|---------|------|--------|
| Calc / Chevron | white fill · ink icon · `28.6px` · `chip-r` | Calc engaged = blue-28 over white |

## Body / collapse

- Grid `1fr` ↔ `0fr` at `--motion-collapse` `600ms`
- Collapsed: header-only · part ticker in header spacer

## Tickers (Part · Blank · Gap · Margin)

| Token | Value |
|-------|-------|
| Height | `28.6px` (margin may grow) |
| Width | `21ch` fixed |
| Fill | `rgba(83,139,236,0.22)` · border blue `0.35` |
| Font | mono `12.1px` weight `650` |

## Popovers (R12)

| Token | Value |
|-------|-------|
| Width | `286px` |
| Shell | `rgba(26,20,40,0.82)` · amber text `#FFCE1B` |
| Selection | `::selection` background `rgba(0,0,0,0.60)` · text `#FFCE1B` |
| Focus field | solid white under-layer |
| Select-all | focus + mouseup `preventDefault` · always full value |

## Footer controls

| Chip | Behavior |
|------|----------|
| AUTO-SIZE | Opens flipIT collapsed (toggle) |
| FLiP IT | Opens flipIT expanded (toggle) · wordmark white/amber |

## Position

Centered on load via JS pixel left/top. Drag from header. No CSS transform on shell.
