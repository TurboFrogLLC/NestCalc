# Wiring — NestCalc UI Redesign

**Option B:** Bridge existing engines into the **exact** `REFERENCE-PROTOTYPE-v2.html` shell. Shell layout, resize, and motion already live in that HTML — do **not** reimplement competing transitions in a parallel React chrome layer.

## Shared state (Calculator ↔ G-code)

| Field | Owner | Bridge |
|-------|-------|--------|
| Part X / Part Y | Calculator | G-code Fill writes here |
| Units (in/mm) | Global header switch | Mode-accent color only; value shared |
| Program units (G-code) | Source IN\|MM | Units of pasted code (independent of display) |
| Part size display units | Part size IN\|MM | Convert for display + Fill target |
| Rotation angle | G-code only | 0 / 90 / −90 / 180 |

## G-code primary action

**Single button: Generate** (product engine: same semantics as `GCodeRotation` / lib)

1. Parse / analyze source (product: `analyzeGCode`)  
2. Apply angle (product: `generateRotatedGCode`)  
3. Hydrate Part size X/Y from bounds (AABB)  
4. Write output; **auto-expand Output** section  

No separate Analyze in the redesign UI.

## Fill part size → Calculator

1. Requires successful Generate (bounds present)  
2. Convert program units → part display units → calculator units if needed  
3. Write Part X/Y  
4. Brief “Filled ✓”  
5. **Morph switch to Calculator mode** so the bridge is visible  

Product reference: PR #40 (`Fill calculator part size from G-code bounds`). Keep Fill / Generate / mode morph **semantics**; host them on the exact shell controls.

## Mode morph (tip geometry + motion)

| From → To | Behavior |
|-----------|----------|
| Calculator → G-code | Sheet to right (default **620px**, min 420 / max 620); viewer → single-part; calc chrome hidden; accent → orange |
| G-code → Calculator | Sheet to left (default **500px**, min 300 / max 500); nest grid; gcode chrome hidden; accent → blue |
| G-code split → full | Viewer fades (`--view-dur`); panel width → `calc(100% - 1.5rem)`; mid-row Rotation\|Part size |
| G-code full → split | Viewer fades in; panel back to last gcode width (default 620) on the right |

**Motion (tip):** sheet left/right/**width** and stage padding share **`--sheet-dur` (`0.71s`) + `--sheet-ease`**. Do not use `width: auto`. Stage pad ≈ `sheetWidth + 24` (calc) or `sheetWidth + 28` (gcode); closed/full-bleed **16px**.

**Option B:** These transitions already run in the exact HTML. Bridge must bind data/events only — **no second animation system** fighting the shell.

## Collapse semantics

| Mode | Close control | Effect |
|------|---------------|--------|
| Calculator | Left-edge chevron | Hide sheet; nest full-bleed |
| G-code split | Left-edge of panel, arrow **←** | Expand panel full; hide viewer |
| G-code full | Same control, arrow **→** | Restore split |

Section open/close uses tip **`--collapse-dur` (`0.41s`)** with `--spring` on open / `--smooth` on close (as in shell CSS).

## Collapsible sections (Calculator)

- Bounce open/close (shell)  
- Optional cascade settle on siblings  
- Collapsed: show compact value badge in header  
- Presets open: Save + Manage appear in **section header** (not body)

## Calculator numpad (optional chrome)

Prototype includes a mini pad with backspace + quick values (`.060` … `.5`). Wire to focused numeric field if product keeps a pad; otherwise omit without inventing a different primary chrome.

## Clerk / PWA

- AuthControls (or equivalent) stay in header; bind into shell auth chrome  
- Do not change Clerk routes, middleware, or Serwist cache behavior in a UI wire wave  
