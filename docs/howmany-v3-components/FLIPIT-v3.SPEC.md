# FLiPIT-v3 — Living SPEC (collapsed + expanded)

**Status:** Living (tip-sync after PASS)  
**Product name:** **FLiPIT** (case-sensitive — not flipIT)  
**Composition HTML tip:** `58ec1be071ff7ff147cd66bd59d7400fe0ce1ec7`  
**HTML blob:** `a585059ba7619f9df816c909841e5bf7b6b597c4`  
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

## Wordmark

- Header / HUD chip: **FLiP** white + **IT** amber  
- Stage action button copy: `FLIP IT` (uppercase UI string)  

## Child-spec marks (R15)

`flipit-header` · `flipit-prog` · `flipit-status-dot` · `flipit-close` · `flipit-gc0de` · `flipit-part-group` · `flipit-detect` · `part-ticker` · `flipit-post` · `flipit-io-tabs` · `flipit-tool-strip` · `flipit-code-shell` · `flipit-stage-action` · `flipit-stage-status` · `flipit-rot` · `flipit-collapse` · `flipit-shell`

Disabled controls hydrate via `elementsFromPoint`.

## Rings

| State | Border | Halo |
|-------|--------|------|
| Edit | 1px `#FFCE1B` | soft 2px @ 55% |
| Post / process flash | 1px green @ 90% | soft 2px @ 70% · 2200ms |
