# NestCalc V2 — Build Spec

**Project:** NestCalc  
**Version:** V2 (Major UI + Interaction Refinement)  
**Date:** June 30, 2026 (Updated with final layout + terminology)  
**Status:** Ready for implementation

---

## Goals for V2

- Improve shop-floor usability on iPhone
- Add Light Mode (many users prefer it in bright shop environments)
- Make the visual preview calmer and more predictable (no accidental panning)
- Fix visual rotation behavior so the entire Rem clearly rotates
- Reorganize the screen for better information hierarchy and thumb-friendly flow
- Use shop language: “Rem” (short for Remnant) instead of “Blank” or full “Remnant”

---

## 1. Theme / Mode Toggle

- Add a **Light / Dark Mode toggle** in the header.
- Position: **Immediately to the left** of the existing Units (in/mm) toggle.
- Same size, height, and visual style as the Units toggle.
- Default: Dark Mode (to match current behavior).
- When toggled to Light Mode, apply a clean, high-contrast light theme across the entire app (inputs, cards, preview background, text, etc.).
- Theme preference should persist (localStorage).

---

## 2. Layout Reorganization (Top → Bottom)

New screen order (thumb-friendly, shop-floor focused):

1. **Header**
   - “NestCalc” title on the left
   - Three items on the right (all same visual family):
     - **Light/Dark toggle** (new, same size and height as Units toggle)
     - **Units toggle** (in / mm) — keep current size
     - **Clear button** — smaller (≈ half width of the toggles), icon-only using a clean Lucide reset-style icon (e.g. `RotateCcw`). No text on the button.

2. **Part Inputs** (grouped)
   - Labels use the format: `X - [PART]`, `Y - [PART]`
   - Part X + Part Y (side by side)

3. **Gap Inputs** (new grouped section, right below Part)
   - Labels use the format: `X - [GAP]`, `Y - [GAP]`
   - Gap X + Gap Y (horizontal and vertical gap, edge-to-edge)

4. **Rem Inputs** (grouped)
   - Labels use the format: `X - [REM]`, `Y - [REM]`
   - REM X + REM Y (this is the physical measured sheet / remnant size — shop shorthand “Rem”)

5. **Margins Section**
   - Grouped block with small sub-header **“Margins”**
   - Left / Right / Top / Bottom fields
   - **Critical:** Margin values and their side assignments **never rotate** with the Rem. They stay fixed to Left/Right/Top/Bottom.

6. **Combined Results + Nest Preview Card** (prominent but compact, right after inputs)
   - At the top of this card (single compact line, reduced height):
     - **Left side:** `X5 | Y4` (minimal breakdown showing parts across X and parts down Y)
     - **Right side:** `Total Parts 20` with the big number **20** in the current gold/prominent color and slightly larger size
   - The whole card should feel tighter and less tall than the current V1 version.
   - Below the compact header line: The **static Nest Preview** visual
   - **On the visual itself** (clean, minimal labels):
     - Rem X dimension shown along the **bottom** edge
     - Rem Y dimension shown along the **left** edge
     - Parts Across (X count) shown near the grid
     - Parts Down (Y count) shown near the grid
   - Goal: Minimal text header + informative visual. The big total number stays prominent while the overall card height is reduced.

7. **Rotate Buttons** (directly under the Nest Preview card)
   - “Rotate Part 90°”
   - “Rotate Rem 90°”

---

## 3. Nest Preview — Major Changes

### 3.1 Make it Static
- **Completely disable** all touch gestures:
  - No pinch to zoom
  - No drag to pan
  - No double-tap to reset
- The preview is a clean, static visual. It only updates when inputs change or a rotate button is tapped.
- This removes the annoying accidental swiping/panning behavior on the phone.

### 3.2 Show Rem Dimensions + Part Counts on the Visual
- Display the current **Rem X** dimension cleanly along the **bottom** edge of the preview rectangle.
- Display the current **Rem Y** dimension cleanly along the **left** edge of the preview rectangle.
- Also display the calculated **Parts Across (X count)** and **Parts Down (Y count)** near the grid (small, clean labels — e.g. “5 across”, “4 down”, or simple positioned numbers).
- Do **not** put the “5 × 4” breakdown in the Total Parts text area above the preview. The part counts belong on the visual itself.
- Keep all labels minimal and readable at a glance on a phone.

### 3.3 Rotate Rem Behavior (Critical Fix)
- When the user taps **“Rotate Rem 90°”**:
  - The **entire visual Rem** (outer rectangle + parts grid inside it) must visually rotate 90°.
  - The part layout must update correctly for the new orientation.
  - Example: A 6" wide × 24" tall Rem should clearly appear tall after rotation.
- **Margins do NOT rotate** with the visual. Left/Right/Top/Bottom values and their side assignments stay fixed.
- The goal is to clearly show what the physical sheet looks like after rotating it on the laser table (especially useful for clamp clearance).

---

## 4. Other Minor Changes

- Use shop shorthand **“Rem”** for the physical sheet dimensions (REM X / REM Y) throughout the app.
- Rename the rotate button to **“Rotate Rem 90°”**.
- Keep the app extremely lightweight and fast (“light n tite”).
- Maintain full offline PWA capability.
- Keep 3 decimal place precision on all numeric inputs.

---

## 5. Out of Scope for V2

- No new features beyond what is listed above.
- No utilization percentage.
- No kerf field.
- No multi-part nesting.
- No saving presets or history (unless user specifically requests later).

---

## 6. Success Criteria

- User can quickly switch between Light and Dark mode on the shop floor.
- The Nest Preview feels calm and predictable (completely static — no accidental gestures).
- Rotating the Rem clearly shows the new physical orientation of the entire sheet (margins stay fixed).
- Input labels follow the clear “X - [REM]”, “Y - [PART]”, “X - [GAP]” format for fast peripheral recognition.
- Total Parts area is compact (single line): `X5 | Y4` on the left + prominent gold `Total Parts 20` on the right. Part counts and Rem dimensions are also shown directly on the Nest Preview visual.
- Margins remain intuitive and do not rotate with the Rem.
- Clear button (icon-only) quickly resets all fields to dashes (—) for fast re-use on the shop floor when the app is used as a home screen PWA.

---

## Next Steps

1. Confirm this spec is complete and accurate.
2. Create updated prompt for Grok Build CLI to implement V2.
3. Test on real iPhone (especially static preview + blank rotation visual).

---

**Status:** Awaiting final confirmation on layout order of sections after Nest Preview and any additional tweaks.

*For wReckless Toddler LLC — Shop floor laser remnant nesting tool*