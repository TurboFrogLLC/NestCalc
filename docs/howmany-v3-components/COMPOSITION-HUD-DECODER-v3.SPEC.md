# Composition HUD + FLiPIT V3 — Shared Index SPEC

**Status:** Living (updated on tip-sync after PASS)  
**Composition HTML:** `COMPOSITION-HUD-DECODER-v3.html`  
**Branch:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip:** `f83981763acdf2b5e28feaba0f80fe2781f7ddc2`  
**HTML blob (tip):** `261541362edfa0cc18c5d9215f12e233de5a3098`  
**OPEN residuals:** R21 · R22 · R23 · R24 · R25 · R28  
**Class:** Exploratory composition only — not a product GOAL  

## Locked product naming

| Name | Rule |
|------|------|
| **FLiPIT** | Case-sensitive product / panel name (not flipIT, FlipIT, FLIPIT) |
| FLiPIT wordmark | `FLiP` white + `IT` amber on dark header · left-aligned · 10px gap from mark |
| Stage action label | `FLIP IT` (button copy, uppercase) stays as UI string |
| **toolPath** | Case-sensitive path viewer name (`tool` white + `Path` amber) |

## Changelog

| Date | Tip | Event | Spec sections touched |
|------|-----|-------|------------------------|
| 2026-08-16 | 00b7975e | R14 PASS | Sandbox isolator |
| 2026-08-16 | 58ec1be0 | R15 PASS | Child-spec table · elementsFromPoint · FLiPIT children |
| 2026-08-16 | f87394db | R16 PASS | toolPath card · header icon system · READY amber · popover vs toolPath · wordmark left gap |
| 2026-08-16 | f52aa3a9 | R17 PASS | FLiPIT strip waypoints open toolPath (Source+Output) · strip unlock when idle · black strip icons · visible hover |
| 2026-08-16 | **9d8cade5** | **R26 PASS** | Child-spec Lucide copy per row + free-draggable panel (reparent under `.bed-stage`) |
| 2026-08-16 | **b25d373b** | **R18–R19 PASS** | HUD top-left 16px dock on load/collapse + expand restores pre-collapse position · comp-note bottom z5 |
| 2026-08-16 | **0b779cab** | **R27 PASS** | toolPath default-hidden on load · open only via FLiPIT strip waypoints or isolator · isolator toolPath starts unchecked |
| 2026-08-16 | **fb011e6b** | **R20 PASS** | HUD fonts: `.hud-ctl` / `.param-label` / `.pop-title` → Wordmark (`var(--font)`); numbers/tickers/editor stay mono (`var(--font-mono)`); child-spec REG tokens updated |
| 2026-08-17 | **f8398176** | **R29 PASS** | Bed = real LaserBed SVG (authority LASER-BED-v3-v1) under `.bed-stage` · isolator Child-spec mute (target `#child-spec` + hard display/visibility) · top readout + bottom notes removed · reparent retired |

---

## Surfaces

| Surface | Selector / id | Detail SPEC | z-order |
|---------|---------------|-------------|---------| 
| Numeric HUD | `#hud` | `NUMERIC-HUD-v3.SPEC.md` | 40 |
| **FLiPIT** | `#gcode` | `FLIPIT-v3.SPEC.md` | 30 |
| **toolPath** | `#backplot` · class `.toolpath` | `BACKPLOT-v3.SPEC.md` | 20 |
| **LaserBed** | `.bed-stage` · `#laser-bed-host` · SVG `lb-*` | authority `LASER-BED-v3-v1.html` (R29) | behind (z0) |
| Sandbox isolator | `#sandbox-iso` | this index · **not production** | 90 |
| Child-spec panel | `#child-spec` (under `#child-spec-host` in bed) | this index · **not production** | 25 |

## Shared header icon system (R16)

Applies to **HUD** header tools · **FLiPIT** close · **toolPath** refresh/X.

| State | Border | Fill | Icon color |
|-------|--------|------|------------|
| Idle | 1.1px solid white @ 0.22 | transparent | **white** |
| Hover | 1.1px solid white @ 0.35 | `rgba(255,255,255,0.12)` (match static mark chip) | **white** |
| Press | scale 0.94 | — | white |

Static left **mark** chip (FLiPIT binary mark · toolPath waypoints):  
`background: rgba(255,255,255,0.12)` · `border: 1.1px solid rgba(255,255,255,0.18)` · icon white.

HUD calc **engaged**: fill `--blue-28` · icon white · border blue @ 0.55.

## FLiPIT tool-strip icons (R17)

Live when **not** editing. Locked only under `:has(.surface-row.is-editing-banner)`.

| State | Border | Fill | Icon |
|-------|--------|------|------|
| Idle | 1.1px ink @ 0.22 | white-70 | **ink (black)** |
| Hover | ink @ 0.40 | ink @ 0.08 | ink |

Waypoints control opens/closes toolPath from Source and Output strips. No blue engaged paint.

## Shared outer ring

HUD · FLiPIT · toolPath: `::after` 2px solid ink @ 0.22 · offset 8px · drop shadow `0 18px 40px -12px`.

## HUD dock (R18–R19)

| Behavior | Rule |
|----------|------|
| Load | Expanded HUD starts top-left at **16px** inset (matches FLiPIT first-open gap) |
| Collapse | Saves current left/top → docks to top-left **16px** |
| Expand | Restores pre-collapse left/top (or stays docked if never moved) |
| Drag | Free after load; user can move anywhere |
| Resize | Re-docks only while collapsed |

`.comp-note` moved to bottom-left (`left:16px; bottom:16px; z-index:5`) — sits on grid behind surfaces.

## Sandbox tools (not product)

### Isolator (R14 + R27 + R29)
Fixed BR card · toggles HUD / FLiPIT / **toolPath** / LaserBed / **Child-spec** · z-index 90.  
**R27:** toolPath checkbox starts **unchecked** (card `.is-hidden` on load).  
**R29:** Child-spec mute targets `#child-spec` directly (`display:none` + `visibility:hidden`); reparent retired.

### Child-spec panel (R15 + R26)
- Frost panel · 8px radius · shadow · absolute under `.bed-stage` (z 25)
- Template keys: `font` · `size` · `outline` · `radius` · `fill` · `shadow` · `note`
- Hydrate: `pointerdown` capture + `elementsFromPoint` · click surface → rows
- Clear: click outside composition surfaces only
- **R26 copy:** every row has Lucide copy icon (far right); click copies `"key: value"` to clipboard · green flash 900ms
- **R26 drag:** grab `.cs-head` (cursor grab/grabbing) · free move across stage · reparent + `overflow: visible` on blank so panel can leave the 280×210 host
- Non-production exploratory only

## OPEN residuals

| ID | Definition |
|----|------------|
| **R21** | Global button chrome unification |
| **R22** | Global icon system unification |
| **R23** | Global color / token unification |
| **R24** | Minor HUD polish |
| **R25** | Minor FLiPIT polish |
| **R28** | Minor toolPath polish |

R29 (LaserBed + isolator Child-spec mute) closed @ f8398176.
