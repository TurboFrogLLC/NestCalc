# toolPath (BACKPLOT-v3) — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Surface name:** **toolPath** (case-sensitive)  
**Composition HTML tip:** `fb011e6b230b5f7b4d28751554257782cf9c1b51`  
**HTML blob:** `69d0bd9a17e9c10cc716f604726c8cdeea678772`  
**OPEN residuals:** _(none)_  
**DOM id:** `#backplot` (stable for isolator / child-spec) · class `.toolpath`

## Class

Non-modal path viewer card. Not a dialog. Not a drawer. Not a **FLiPIT** child.  
No resize.

## Open / close (R17 + R27)

| Path | Behavior |
|------|----------|
| FLiPIT tool-strip waypoints (Source + Output) | `toggleToolpath()` → `setToolpathOpen(on)` |
| Header **X** | `setToolpathOpen(false)` |
| Isolator checkbox | syncs via `setToolpathOpen(!!checked)` |

**R27 load contract:** card boots with `.is-hidden` · isolator toolPath checkbox **unchecked**.  
Open only via FLiPIT strip waypoints or isolator (never auto-visible on page load).

`setToolpathOpen` toggles `.is-hidden`, keeps isolator checkbox + strip `aria-pressed` in sync.  
Strip waypoints stay **black** when open (no blue engaged fill).

## Shell

| Token | Value |
|-------|-------|
| Width | max-content · min **268px** |
| Header height | **44px** |
| Radius | 15.4px (`--radius`) |
| Shell fill | frost `#D8D6E2` |
| Outer ring | `::after` 2px ink @ 0.22 · 8px offset · drop shadow |
| z-index | 20 |
| Resize | **none** |
