# FLiPIT-v3 — Living SPEC (collapsed + expanded)

**Status:** Living (tip-sync after PASS)  
**Product name:** **FLiPIT** (case-sensitive — not flipIT)  
**Composition HTML tip:** `f87394dbddfdc1654486fe3c62e26bc86c979cde`  
**HTML blob:** `b1cd0d13955aa42c560f7561b0cfb62371cd1c8a`  
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

## Child-spec marks (R15)

`flipit-header` · `flipit-prog` · `flipit-status-dot` · `flipit-close` · `flipit-gc0de` · `flipit-part-group` · `flipit-detect` · `part-ticker` · `flipit-post` · `flipit-io-tabs` · `flipit-tool-strip` · `flipit-code-shell` · `flipit-stage-action` · `flipit-stage-status` · `flipit-rot` · `flipit-collapse` · `flipit-shell`

Disabled controls hydrate via `elementsFromPoint`.
