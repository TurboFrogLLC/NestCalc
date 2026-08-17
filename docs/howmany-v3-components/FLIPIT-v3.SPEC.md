# FLiPIT-v3 — Living SPEC

**Status:** Living (tip-sync after PASS)  
**Product name:** **FLiPIT** (case-sensitive — not flipIT)  
**HTML:** `docs/howmany-v3-components/FLIPIT-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Tip commit:** `37d628e970ff3f2a4d6eed189528d7a2fd23fc02`  
**Tip blob:** `c156815a6c0b98f1d3c509abfd4c5a8452e0c500`  
**Authority (source composition):** `fb011e6b230b5f7b4d28751554257782cf9c1b51` · blob `69d0bd9a17e9c10cc716f604726c8cdeea678772`  
**Class:** Exploratory component only · not product GOAL · not bridge  

**Authority note**  
Standalone extract from composition tip **fb011e6b** (pre-R29). This SPEC’s **identity** is the standalone HTML tip above — not the composition blob.  
Composition-only bridges (waypoints → toolPath, child-spec marks, `elementsFromPoint`) are absent in this file by design.

NO bed · NO Numeric HUD · NO toolPath card · NO isolator · NO child-spec marks in this package.

---

## Shell

| Token | Value |
|-------|-------|
| Width | 418–568px · bar 44px |
| Radius | 15.4px |
| Fill | `#D8D6E2` |
| Outer ring | hairline + green/yellow flash states |
| z-index | 30 |
| Position memory | R11 `lastGcodePos` (close/reopen; standalone has no Re-open control) |
| Resize | live in HTML (E/S/SE handles · width 418–568 · shell height 110–308) — documented residual |

## Header

| Token | Value |
|-------|-------|
| Fill | `rgba(26,20,40,0.82)` |
| Left mark | bordered chip · white icon |
| Wordmark | **FLiP** white weight **700** + **IT** amber weight **800** · 19.8px · letter-spacing -0.02em |
| Wordmark align | flex-start · **10px** gap after mark (parity with toolPath) |
| Close (X) | transparent · white icon · hover fill white@0.12 · hides panel (`display: none`) |

Stage action button copy: `FLIP IT` (uppercase UI string).

## Tool strip (R17)

Present on **Source** and **Output** panels (same row pattern).

| Control | Notes |
|---------|-------|
| Undo / Redo | live when not editing (titles mention Cmd/Ctrl+Z; no keydown in standalone) |
| **Waypoints** | Lucide waypoints · **composition-only** bridge to toolPath · standalone toast no-op |
| Clear (Source) / Edit · Copy · Download (Output) | existing |
| Unit switch (Source) | IN / MM |

### Strip icon chrome (live)

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | 1.1px solid ink @ 0.22 | `var(--white-70)` | **ink (black)** |
| Hover | ink @ 0.40 | `rgba(26,20,40,0.08)` | ink |
| Active press | — | ink @ 0.12 | ink · scale 0.94 |

**No blue engaged paint** on waypoints. `aria-pressed` tracks open/closed only in composition.

### Edit lock

`.gcode:has(.surface-row.is-editing-banner) .tool-strip .icon-btn` → grayscale + `pointer-events: none`.  
Accept/cancel in `.edit-actions` stay live.

## Footer stage chips

| Chip | State | Border | Glow |
|------|-------|--------|------|
| FLIP IT / START OVER | process / start | 1.65px blue-border | soft lift + `--blue-glow` |
| **READY** | ready | 1.65px **amber** `#FFCE1B` @ 0.85 | soft lift + amber glow |
| **DONE** | done | 1.65px green-border | soft lift + `--green-glow` |
| Idle / NOT READY | idle | 1.1px muted | none |

## Edit chrome

Accept / cancel (`.edit-actions`): `top: 6.6px` · **`right: 18px`**.

## Rings (shell)

| State | Border | Halo |
|-------|--------|------|
| Edit | 1px `#FFCE1B` | soft 2px @ 55% |
| Post / process flash | 1px green @ 90% | soft 2px @ 70% · 2200ms |

## Composition-only (not in this standalone HTML)

These live in the composition host only — do not expect them in `FLIPIT-v3.html`:

- Child-spec marks (`flipit-header` … `flipit-toolpath` …)
- `elementsFromPoint` hydrate for disabled controls
- Waypoints toggle of toolPath card
- Isolator / child-spec panel

## Out of scope for this file

- LaserBed / blank surface
- Numeric HUD
- toolPath card body
- Product G-code execution

## Changelog

| Date | Tip | Change |
|------|-----|--------|
| 2026-08-17 | `37d628e9` | Individual package from composition tip `fb011e6b`. Standalone blob `c156815a`. |
| 2026-08-17 | — | SPEC identity retargeted to standalone tip (was composition blob). Wordmark IT weight **800** aligned to HTML. Child-spec / elementsFromPoint / waypoints→toolPath marked composition-only. Resize documented as live residual. |
