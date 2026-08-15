# de-coder V3 — Build Spec (LOCKED)

**Status:** LOCKED exploratory blueprint  
**Surface name:** `de-coder` (case-sensitive)  
**Authority HTML:** `DE-CODER-v3-LOCKED.html`  
**sha256:** `22349e844e17ffcf634a2c590a83ae250d91be29ad0c3198d1a690ba22672da0`  
**Package path:** `docs/howmany-v3-components/`  
**Date locked:** 2026-08-14  

---

## 0. Scope & walls

| Rule | Detail |
|------|--------|
| Class | Exploratory UI blueprint only |
| NOT a residual | Does not reopen residual-2 or Option B |
| NOT a product GOAL | No GOAL freeze, no Allowed Files, no bridge edits |
| NOT V2 mutation | Do not touch `REFERENCE-PROTOTYPE-v2.html` or residual-components package |
| Standalone forever | HTML is a self-contained card; lives as design authority |
| Product wire later | Any NestCalc product insert is a separate GOAL after quiet archive |

**Companion components (same package, separate locks):**
- LaserBed V3 v1 — `LASER-BED-v3-v1.html`
- Numeric HUD V3 — `NUMERIC-HUD-v3-LOCKED.html`

---

## 1. What it is

`de-coder` is a **floating frost card** for G-code intake, rotation, color-coded editing, and one-way part-size detection → post to the HUD/bed.

It is a **plugin-like surface** separate from the Numeric HUD:
- HUD = 2-way walkie-talkie with the laser bed (params in/out)
- de-coder = G-code pipeline + part-size detect → one-way post into HUD/bed

Default launch state: **collapsed** (header + surface row only).

---

## 2. Visual tokens (locked)

### Shell
| Token | Value |
|-------|-------|
| Card fill | `--frost` `#D8D6E2` |
| Card radius | `--radius` **14px** |
| Panel width | `--panel-w` **380px** |
| Header height | `--bar-h` **40px** |
| Chip radius | `--chip-r` **6px** |
| Ease | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Duration | `240ms` |

### Ink / blue / status
| Token | Value |
|-------|-------|
| Ink | `#1A1428` |
| Blue | `#538BEC` |
| Blue-22 (Source selected / hat armed) | `rgba(83, 139, 236, 0.22)` |
| Blue border (arm ring) | `rgba(47, 111, 237, 0.85)` |
| Blue glow | `0 0 0 2px rgba(47, 111, 237, 0.45)` |
| Chip gray (READY / ticker ready) | `rgba(26, 20, 40, 0.10)` |
| Green (Notes + DONE/READY ring) | `#00CF00` |
| Green border | `rgba(0, 140, 30, 0.70)` |
| Green glow | `0 0 0 2px rgba(0, 160, 30, 0.40)` |
| Posted ticker fill | `#7DDB8C` |
| EDITING amber | `#FFCE1B` |
| Toast bg | `#1A1428` |
| Toast text | `#FFCE1B` |

### G-code color scheme (syntax)
| Class | Color | Meaning |
|-------|-------|---------|
| Notes / comments | `#00CF00` | `(...)` and `;` lines |
| G words | `#FF00FF` | G0, G1, G17, G20, G90… |
| M codes | `#FF8380` | M3, M5, M6… |
| Feed / speed | `#F86400` | F…, S… |
| T tools | `#538BEC` | T1… |
| N blocks | `#D3D3D3` | N10, N20… |

---

## 3. Layout structure

```
┌─────────────────────────────────────────────────────────┐
│ [binary]  de-coder   [program name …… ↗ ⬇]  ●  [×]     │  header (drag)
├─────────────────────────────────────────────────────────┤
│ [GC0DE]          OR  [Source|Output]                    │  surface row
│              [Auto-Size|ticker|post]  OR connected 3-seg │
├─────────────────────────────────────────────────────────┤
│ tool strip (undo/redo · units · clear · edit/copy/dl)   │  expanded only
│ source / output text area (colorized)                   │
├─────────────────────────────────────────────────────────┤
│ [PROCESS|START OVER]  [0°|90°|-90°|180°]  [READY|DONE]  │  footer
│                                              [chevron]  │
└─────────────────────────────────────────────────────────┘
```

### Header
1. Binary mark icon (26×26 outlined chip)
2. **`de-coder`** label — 16px, weight 650, **centered** in gap between mark and program name
3. Program name input (right-aligned text, max ~168px)
   - Focus shows clear **×** (same math as HUD part-size clear)
   - Right icons **inside** field: folder-open (open program), download (save program)
4. Status dot (none=crimson / ready=green / posted=green)
5. Close (×) — corner-down-right style close icon

### Surface row
- **Collapsed:** `GC0DE` expand button + part group
- **Expanded:** Source | Output tabs (Source selected = blue-22) + part group
- Spacer pushes part group to the right

### Part group (detect · ticker · post)
| State | Layout |
|-------|--------|
| **No dimensions** | Separate chips: Auto-Size / — / post |
| **Has dimensions** | Connected 3-segment group (rotation-style seps) |

**Collapsed first segment:** `Auto-Size` text label  
**Expanded first segment:** hat-glasses Lucide icon  

**Highlight rules (locked):**
- Blue ring **only on the part ticker** when `ready` (darker gray fill + inset 1.5px blue border)
- Hat armed after source edit → **Source blue fill** (`--blue-22`) on hat only — not whole group
- Posted → green ticker fill
- Stale (source edited after size) → darker gray ticker, no ring; hat re-arms

### Body (expanded)
- **Source tab:** undo/redo left · clear · IN|MM unit switch · always-editable textarea · colorized overlay
- **Output tab:** undo/redo left · pen-line edit · copy · download · eraser appears in edit mode · accept/cancel when editing
- Output edit mode: light frost-blue textarea background; edit button disabled while active

### Footer stage machine
Fixed outer gaps **10px** left (container → action) and right (status → chevron).  
Equal **78px** side chips; rotation group fills middle `1fr`.

| Side | States | Style |
|------|--------|-------|
| **LEFT (action)** | PROCESS · START OVER · EDITING | PROCESS/START OVER = chip-gray + blue outline + ink text; EDITING = amber both sides |
| **RIGHT (status)** | READY · DONE · EDITING | READY/DONE = chip-gray + green ring + **ink text** (not green text); EDITING = amber |
| **Center** | 0° 90° −90° 180° | Connected rot-row; selected = blue-22 |

**Flow:**
1. Load program → Auto-Size arms
2. Auto-Size → bounds set → part group connects → PROCESS available · READY indicator
3. PROCESS → Output filled · DONE · START OVER available · toast “Output ready”
4. Source edit after process → processDone clears · re-process required
5. Output edit → both chips EDITING amber · accept commits · cancel reverts
6. START OVER → clears output, rewinds to READY/PROCESS
7. Collapse commits source edit (does not wipe code)

---

## 4. Open / save (sandbox vs product)

| Action | Sandbox blueprint behavior | Product expectation |
|--------|---------------------------|---------------------|
| Open (folder-open in program name) | Loads **sample** program `BRACKET_PLATE` — no OS file dialog | Native file picker → parse NC → fill source |
| Save / download | Downloads current Output (or empty) as `.nc` blob | Same, plus optional program-library write |
| Clear name × | Clears program name input only | Same |

Sandbox deliberately does **not** open the system file dialog so the component stays self-contained for visual/interaction proof.

---

## 5. One-way data rules

1. **de-coder → HUD/bed only via Post** — part ticker post is explicit click  
2. **HUD never hydrates de-coder part size** — G-code panel owns detect  
3. **Source → Output only via PROCESS** — rotation + source text applied on click  
4. **Output edit does not rewrite Source** — accept stays on Output surface  
5. **Source edit after DONE invalidates process** — must PROCESS again  

---

## 6. Interaction checklist (AI rebuild gate)

- [ ] Floating card, drag by header, frost `#D8D6E2`, radius 14px, width 380px  
- [ ] Header label exact string `de-coder` (16px, centered in gap)  
- [ ] Program name: right-align, focus clear ×, open + save icons inside field  
- [ ] Collapsed default; GC0DE expands; chevron collapses  
- [ ] Part group separate when empty; connected 3-seg when dims exist  
- [ ] Auto-Size label collapsed / hat icon expanded  
- [ ] Blue ring only on ticker when ready; hat armed = Source blue  
- [ ] PROCESS / START OVER blue outline + ink; READY / DONE green ring + ink  
- [ ] Both EDITING chips amber when either surface is editing  
- [ ] Footer math: 10px outer gaps, 78px equal side chips, rot fills center  
- [ ] G-code color scheme matches table in §2  
- [ ] Toast: flat black capsule, amber text, above header, no pointer  
- [ ] Open loads sample in sandbox; Save downloads `.nc`  
- [ ] Collapse does not wipe source code  

---

## 7. File map

| File | Role |
|------|------|
| `DE-CODER-v3-LOCKED.html` | Visual + interaction authority (single file, IIFE) |
| `DE-CODER-v3-SPEC.md` | This AI-readable build spec |
| `GCODE-PANEL-v3-baseline.html` | Same content as LOCKED (working name retained) |

---

## 8. Explicit non-goals

- No product React/bridge wiring  
- No mutation of Option B shell or residual-2 components  
- No engine/algorithm changes  
- No Clerk / PWA / MODE / Production from this track  
- No real OS file dialog in the blueprint HTML  

---

*Locked 2026-08-14 — HowMany V3 exploratory package. Compare this spec against `DE-CODER-v3-LOCKED.html` when implementing.*
