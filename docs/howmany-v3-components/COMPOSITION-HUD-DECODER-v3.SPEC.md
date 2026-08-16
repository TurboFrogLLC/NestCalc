# Composition HUD + flipIT V3 — Shared Index SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `00b7975efea7a28ff60996b1dd09194ec0130234`  
**HTML blob (tip):** `0158c636f1144770432bb792215b22df2cd135cc`  
**Content authority (R10c chrome):** `1a184ea67cf1bb4578422e22056d5e9a61c60784` / blob `3cc008ab5f5f4c55dd80e0a915c9d2781c0fe7b2`  
**OPEN residuals:** R15  
**Class:** Exploratory composition only — not a product GOAL  

## Changelog

| Date | Tip | Event | Spec sections touched |
|------|-----|-------|------------------------|
| 2026-08-16 | 52b2d464 | docs-only land three SPECs | Index scaffold · links to HUD + flipIT |
| 2026-08-16 | 4438c2ac | R11 PASS | Position memory · OPEN R12–R15 |
| 2026-08-16 | ad530cad | R12 PASS | Popover select-all · OPEN R13–R15 |
| 2026-08-16 | 2fb32796 | R13 PASS | Backplot 200×200 unattached · OPEN R14–R15 |
| 2026-08-16 | 00b7975e | R14 PASS | Sandbox isolator show/hide · OPEN R15 |

---

## Surfaces in this composition

| Surface | Selector / id | Detail SPEC | z-order |
|---------|---------------|-------------|---------| 
| Numeric HUD | `#hud` / `.keypad` | `NUMERIC-HUD-v3.SPEC.md` | 40 (front) |
| flipIT | `#gcode` / `.gcode` | `FLIPIT-v3.SPEC.md` | 30 |
| Backplot | `#backplot` / `.backplot` | `BACKPLOT-v3.SPEC.md` | 20 |
| Faux bed | `.bed-stage` | (host only — not a living product LaserBed) | behind |
| Sandbox isolator | `#sandbox-iso` / `.sandbox-iso` | (this index · R14 · **not production**) | 90 |

**Connections**

- HUD footer **AUTO-SIZE** → opens flipIT **collapsed** (toggle).
- HUD footer **FLiPIT** chip → opens flipIT **expanded** (toggle).
- flipIT **Post** → part size to HUD / bed + green outer-ring flash 2200ms.
- flipIT **FLIP IT** (process) → Output + same green outer-ring flash 2200ms.
- Part ticker posted state is independent of outer-ring flash duration.

---

## Shared tokens (composition host)

| Token | Value | Notes |
|-------|-------|-------|
| `--frost` | `#D8D6E2` | Card shell fill |
| `--ink` | `#1A1428` | Primary ink |
| `--blue` | `#538BEC` | Accent / arm |
| `--green` | `#00CF00` | Status ready |
| `--radius` | `15.4px` | Card shell radius |
| `--chip-r` | `6.6px` | Chip / icon-btn radius |
| Green post ring | `1px solid rgba(0,180,40,0.90)` + soft halo `0 0 2px 2px @ 70%` | R10c |
| Yellow edit ring | `1px solid #FFCE1B` + soft halo `0 0 2px 2px @ 55%` | R9 locked |

---

## Sandbox isolator (R14) — NOT production

Local-only show/hide card so surfaces can be inspected one at a time.

| Token | Value |
|-------|-------|
| Position | `fixed` · `right: 12px` · `bottom: 12px` |
| Size | width `168px` |
| z-index | `90` (above composition surfaces) |
| Shell | `rgba(26, 20, 40, 0.88)` · border `1.1px solid rgba(255,255,255,0.14)` · radius `10px` |
| Label color | `#FFCE1B` (amber) |
| Tag | `sandbox` uppercase · muted white |

### Controls (all checked on load)

| Checkbox id | Target | Hide method |
|-------------|--------|-------------|
| `#si-hud` | `#hud` | `display: none` |
| `#si-flipit` | `#gcode` | `visibility: hidden` + `pointer-events: none` (preserves open state) |
| `#si-backplot` | `#backplot` | `display: none` |
| `#si-bed` | `.bed-stage` | `display: none` |

### Code (shell)

```css
.sandbox-iso {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 90;
  width: 168px;
  background: rgba(26, 20, 40, 0.88);
  color: #FFCE1B;
  border: 1.1px solid rgba(255, 255, 255, 0.14);
  border-radius: 10px;
}
```

**UX:** Uncheck → surface hidden; recheck → restored. flipIT hide does not wipe `is-open` / last position. Isolator itself is never hidden by its own toggles.

---

## OPEN residual

| ID | Definition |
|----|------------|
| **R15** | faux-bed blank child-spec table on surface click (template tokens) |
