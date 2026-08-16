# BACKPLOT-v3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Composition HTML tip:** `00b7975efea7a28ff60996b1dd09194ec0130234`  
**HTML blob:** `0158c636f1144770432bb792215b22df2cd135cc`  
**OPEN residuals:** R15  
**Authority baseline:** `BACKPLOT-v3-baseline.html` (ported R13)

## Class

**Unattached** 200×200 path card. Not a drawer. Not a flipIT child. Independent drag + resize.

## Shell

| Token | Value |
|-------|-------|
| Default size | `200 × 200` (`--bp-w` / `--bp-h`) |
| Resize range | `160–320` px |
| Radius | `var(--radius)` `15.4px` |
| Fill | `var(--frost)` |
| Outer | hairline white + blue + drop shadow |
| z-index | `20` (under HUD 40 · flipIT 30) |
| Default place | `left: 52.8px` · `top: 80px` |

## Chrome

| Element | Spec |
|---------|------|
| Head | `32px` · grab · title “Backplot” · demo-part toggle |
| Canvas | white inset · radius `6px` · border ink-15 |
| Handles | E / S / SE |

## Demo part

Toggle via head icon → silhouette rect + two holes. Empty state: “No part”.

## Isolation

Sandbox isolator (`#si-backplot`) can hide this surface without affecting HUD / flipIT.
