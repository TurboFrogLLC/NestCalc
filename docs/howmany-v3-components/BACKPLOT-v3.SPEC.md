# Backplot V3 — Living SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Baseline authority:** `BACKPLOT-v3-baseline.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `2fb32796297510f5d19d1fbc97918960d5172de6`  
**HTML blob (tip):** `efcd1d59eabaf3ff72adb8c3856def85d7598bb5`  
**Class:** Exploratory composition only — not a product GOAL  

## Changelog

| Date | Tip | Residual | Spec sections touched |
|------|-----|----------|------------------------|
| 2026-08-16 | 2fb32796 | R13 PASS | Shell · size · drag/resize · demo part · walls |

---

## Role

Floating **200×200** path/silhouette card on the composition bed.  
**Separate and unattached** — not a flipIT drawer, not a child of `#gcode`, not wired to Post/FLIP IT.

---

## Shell / placement

| Token | Value |
|-------|--------|
| Selector | `#backplot` / `.backplot` |
| Default size | `--bp-w: 200px` · `--bp-h: 200px` |
| Resize range | min **160** · max **320** (E / S / SE handles) |
| z-index | **20** (under HUD 40 · flipIT 30) |
| Default place | left ~52.8px · top ~80px (clear of HUD center + flipIT TR) |
| Background | `var(--frost)` |
| Radius | `var(--radius)` (15.4px) |
| Hairlines | white 1.1px + blue 1.1px + soft drop |

---

## Header

| Token | Value |
|-------|--------|
| Height | 32px |
| Title | `Backplot` (uppercase letter-spacing) |
| Drag | header bar only (not the demo button) |
| Demo control | 22×22 icon toggles part silhouette (sandbox only) |

---

## Canvas

| Token | Value |
|-------|--------|
| Fill | white · margin 8px · radius 6px · ink-15 border |
| Empty | “No part” uppercase label |
| Demo part | rect + two holes; shown when `.has-part` |

---

## UX

- Drag moves **only** Backplot (no coupling to HUD/flipIT position memory).
- Resize does not open/close other surfaces.
- Demo part toggle is sandbox chrome — not a production hydrate path.

---

## Walls

- Docs / exploratory only — not product GOAL or bridge wire  
- Do not parent under `.gcode` or treat as drawer  
- Spec numbers must match tip HTML; tip wins on conflict  
