# Wiring — NestCalc UI Redesign

## Shared state (Calculator ↔ G-code)

| Field | Owner | Bridge |
|-------|-------|--------|
| Part X / Part Y | Calculator | G-code Fill writes here |
| Units (in/mm) | Global header switch | Mode-accent color only; value shared |
| Program units (G-code) | Source IN\|MM | Units of pasted code (independent of display) |
| Part size display units | Part size IN\|MM | Convert for display + Fill target |
| Rotation angle | G-code only | 0 / 90 / −90 / 180 |

## G-code primary action

**Single button: Generate** (matches product `GCodeRotation.tsx`)

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

Product reference: PR #40 (`Fill calculator part size from G-code bounds`).

## Mode morph

| From → To | Behavior |
|-----------|----------|
| Calculator → G-code | Sheet to right (420px); viewer → single-part; calc chrome hidden; accent → orange |
| G-code → Calculator | Sheet to left (300px); nest grid; gcode chrome hidden; accent → blue |
| G-code split → full | Viewer fades; panel width `420px` → `calc(100% - 1.5rem)`; mid-row Rotation\|Part size |
| G-code full → split | Viewer fades in; panel back to 420px right |

**Motion:** `0.72s cubic-bezier(0.34, 1.45, 0.64, 1)` on sheet left/right/**width** and stage padding together. Do not use `width: auto`.

## Collapse semantics

| Mode | Close control | Effect |
|------|---------------|--------|
| Calculator | Left-edge chevron | Hide sheet; nest full-bleed |
| G-code split | Left-edge of panel, arrow **←** | Expand panel full; hide viewer |
| G-code full | Same control, arrow **→** | Restore split |

## Collapsible sections (Calculator)

- Bounce open/close  
- Optional cascade settle on siblings  
- Collapsed: show compact value badge in header  
- Presets open: Save + Manage appear in **section header** (not body)

## Calculator numpad (optional chrome)

Prototype includes a mini pad with backspace + quick values (`.060` … `.5`). Wire to focused numeric field if product keeps a pad; otherwise omit without affecting layout of XY rows.

## Clerk / PWA

- AuthControls stay in header; restyle only  
- Do not change Clerk routes, middleware, or Serwist cache behavior in this wave  
