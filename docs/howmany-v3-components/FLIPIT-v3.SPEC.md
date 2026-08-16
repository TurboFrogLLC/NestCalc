# FLiPIT-v3 — Living SPEC (collapsed + expanded)

**Status:** Living (tip-sync after PASS)  
**Product name:** **FLiPIT** (case-sensitive — not flipIT)  
**Composition HTML tip:** `f52aa3a9b8638e72497f5779bc139c4999034978`  
**HTML blob:** `72ff09381ba9d59ab49301246870bc68b5101385`  
**OPEN residuals:** _(none)_

## Shell

| Token | Value |
|-------|-------|
| Width | 418–568px · bar 44px |
| Radius | 15.4px |
| Fill | `#D8D6E2` |
| Outer ring | hairline + green/yellow flash states |
| z-index | 30 |
| Position memory | R11 `lastGcodePos` |

## Header

| Token | Value |
|-------|-------|
| Fill | `rgba(26,20,40,0.82)` |
| Left mark | bordered chip · white icon |
| Wordmark | **FLiP** white + **IT** amber · 19.8px · weight 700 · letter-spacing -0.02em |
| Wordmark align | flex-start · **10px** gap after mark (parity with toolPath) |
| Close (X) | same header icon system as toolPath: transparent · white icon · hover fill white@0.12 |

Stage action button copy: `FLIP IT` (uppercase UI string).

## Tool strip (R17)

Present on **Source** and **Output** panels (same row pattern).

| Control | Notes |
|---------|-------|
| Undo / Redo | live when not editing |
| **Waypoints** (`btn-toolpath-src` / `btn-toolpath-out`) | Lucide waypoints · toggles toolPath open/close · `data-child-spec="flipit-toolpath"` |
| Clear (Source) / Edit · Copy · Download (Output) | existing |
| Unit switch (Source) | IN / MM |

### Strip icon chrome (live)

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | 1.1px solid ink @ 0.22 | `var(--white-70)` | **ink (black)** |
| Hover | ink @ 0.40 | `rgba(26,20,40,0.08)` | ink |
| Active press | — | ink @ 0.12 | ink · scale 0.94 |

**No blue engaged paint** on waypoints (parity with pencil / copy / download).  
`aria-pressed` tracks open/closed only.

### Edit lock

`.gcode:has(.surface-row.is-editing-banner) .tool-strip .icon-btn` → grayscale + `pointer-events: none`.  
Unit switch same parent scope. Accept/cancel in `.edit-actions` stay live.

## Footer stage chips

| Chip | State | Border | Glow |
|------|-------|--------|------|
| FLIP IT / START OVER | process / start | 1.65px blue-border | soft lift + `--blue-glow` (`0 0 0 2.2px` blue @ 0.45) |
| **READY** | ready | 1.65px **amber** `#FFCE1B` @ 0.85 | soft lift + `0 0 0 2.2px` amber @ 0.45 |
| **DONE** | done | 1.65px green-border | soft lift + `--green-glow` (`0 0 0 2.2px` green @ 0.45) |
| Idle / NOT READY | idle | 1.1px muted | none |

`--green-glow` weight matches `--blue-glow` (single ring — not double 3px+6px).

## Edit chrome

Accept / cancel (`.edit-actions`): `top: 6.6px` · **`right: 18px`** (inset past scrollbar).

## Rings (shell)

| State | Border | Halo |
|-------|--------|------|
| Edit | 1px `#FFCE1B` | soft 2px @ 55% |
| Post / process flash | 1px green @ 90% | soft 2px @ 70% · 2200ms |

## Child-spec marks (R15 + R17)

`flipit-header` · `flipit-prog` · `flipit-status-dot` · `flipit-close` · `flipit-gc0de` · `flipit-part-group` · `flipit-detect` · `part-ticker` · `flipit-post` · `flipit-io-tabs` · `flipit-tool-strip` · **`flipit-toolpath`** · `flipit-code-shell` · `flipit-stage-action` · `flipit-stage-status` · `flipit-rot` · `flipit-collapse` · `flipit-shell`

Disabled controls hydrate via `elementsFromPoint`.
