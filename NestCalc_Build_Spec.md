# NestCalc v1 — Build Spec

**Project Name:** NestCalc  
**Type:** Local-first Progressive Web App (PWA)  
**Primary Platform:** iPhone / iPad (installable to home screen via Safari), also works on desktop browser  
**Goal:** Replace the paper + calculator manual margin math done every time a random remnant/scrap is grabbed for the laser. Extremely fast, dead simple, sketch-pad style tool.

---

## 1. Core Purpose

A lightweight calculator that lets you quickly figure out how many of one part will fit on an odd-sized remnant while properly accounting for:

- Independent margins on all four sides (especially important for clamps/fixtures)
- Edge-to-edge gap between parts
- Quick 90° rotation of either the part or the entire remnant

---

## 2. Inputs (all with 3 decimal place precision)

- **Part**
  - Width (X)
  - Height (Y)

- **Remnant / Blank** (physical measured size — these numbers **never change** when rotating the sheet)
  - Width (X)
  - Height (Y)

- **Margins** (four independent fields)
  - Left
  - Right
  - Top
  - Bottom

- **Gap** (single value — edge of part bounding box to edge of next part bounding box)

- **Units Toggle**: Inches ↔ Millimeters (live conversion of all values)

---

## 3. Calculations (instant, live)

- Usable width = Remnant Width − Left Margin − Right Margin
- Usable height = Remnant Height − Top Margin − Bottom Margin
- Parts that fit across (X count)
- Parts that fit down (Y count)
- **Total parts** (most prominent number on screen)
- Simple logic: If usable dimension is smaller than part dimension → 0 parts in that direction

---

## 4. Rotation Features

- **Rotate Part 90°** button  
  Swaps Part X and Y, instantly recalculates everything.

- **Rotate Remnant 90°** button  
  Keeps the physical remnant dimensions the same, but rotates the four margin values (Left/Right/Top/Bottom cycle) so the user can quickly see the effect of moving a large clamp margin (e.g. 0.530") from one axis to the other.

Both rotation actions update the counts **and** the visual grid immediately.

---

## 5. Visual

- Clean, simple 2D grid showing:
  - The remnant as a rectangle
  - Parts as smaller rectangles nested inside it
  - Correct spacing from all four margins + the gap between parts
- Visual updates instantly on any input change or rotation
- Touch-friendly (pinch zoom or tap to inspect on mobile)

---

## 6. UI / Experience Goals

- Extremely sparse and fast (“light n tite”)
- Big, glanceable total parts number
- Feels like a digital sketch pad, not a heavy piece of software
- Thumb-friendly on iPhone
- Dark mode friendly
- No material utilization percentage
- No kerf compensation (laser kerf is negligible for this use case)

---

## 7. Technical Requirements

- Built as a **Next.js 16 + TypeScript + Tailwind** PWA
- 100% client-side (no backend, no accounts, no data leaving the device)
- Fully offline capable after first load
- Proper PWA setup (`manifest.json` + service worker) so it can be added to iOS home screen and launch in standalone mode
- Canvas or lightweight SVG for the visual grid
- All values handle 3 decimal places cleanly
- Fast, instant feedback with no lag
- Installable to iPhone home screen and works completely offline after initial load

---

## 8. Out of Scope for v1

- Material utilization / yield percentage
- Kerf compensation
- Multiple different part sizes on one remnant
- DXF / STEP import or file handling
- Saving multiple named projects or long history (simple last-state persistence is acceptable)
- Advanced nesting algorithms (this is simple grid math only)
- Cost calculations

---

## 9. Success Criteria

- User can grab a random rem, enter 4 margin values + part size + gap, and instantly see accurate counts + visual
- Both rotation buttons work intuitively and update everything immediately
- The app feels faster and less annoying than doing the math on paper
- Works completely offline on iPhone after being added to home screen

---

## 10. Future Considerations (not in v1)

- Native SwiftUI version for App Store
- Optional kerf field (if needed for other processes later)
- Ability to save common part sizes or remnant presets
- Multi-part support (if the workflow expands)

---

**Status:** Locked for v1 implementation.  
**Next Step:** Use this spec to generate the project via Grok Build CLI.

---

*Created: June 29, 2026*  
*For wReckless Toddler LLC — Shop floor laser remnant nesting tool*