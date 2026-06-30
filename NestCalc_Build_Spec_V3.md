# NestCalc V3 — Build Spec

**Project:** NestCalc  
**Version:** V3 (Rotation & Shop-Floor Polish)  
**Status:** Locked for implementation  
**Date:** June 30, 2026

---

## 1. Overview & Goals

V3 focuses on making the **Rotate Rem** feature actually useful and trustworthy on the shop floor. The core problems in V2 were:

- Rem X/Y inputs were not swapping correctly.
- Parts were rendering in a broken/overlapping state after rotation.
- Visual feedback after rotation did not match physical intuition.

**V3 Goals:**
- Make rotation predictable and visually correct.
- Keep the tool extremely fast and minimal (“light n tite”).
- Add small but high-value controls (Link + Swap) that reduce typing on the shop floor.
- Maintain full offline PWA behavior.

---

## 2. Terminology (Locked)

- **Rem** = The physical remnant / blank / scrap piece being nested on.
- Labels use the format: `X [REM]`, `Y [REM]`, `X [PART]`, `Y [PART]`, `X [GAP]`, `Y [GAP]`.
- Never use the word “Blank” or full “Remnant” in the UI.

---

## 3. Rotation Behavior (Critical — Must Be Correct)

### When user taps **Rotate Rem 90°**:

| Item                    | Behavior                                      |
|-------------------------|-----------------------------------------------|
| Rem X / Rem Y inputs    | **Swap values** immediately                   |
| Gap X / Gap Y inputs    | **Swap values** immediately                   |
| Part X / Part Y inputs  | **Stay exactly the same**                     |
| Visual preview          | Outer rectangle changes aspect ratio (tall ↔ wide). Parts re-layout cleanly inside the new orientation. |
| Margins (Left/Right/Top/Bottom) | Stay fixed to their named sides by default |

### Rotation Rules Summary

- **Rem rotates** — Physical sheet turns 90°.
- **Parts do NOT rotate** — Individual part orientation stays the same.
- **Gaps follow the Rem** — Gap X and Gap Y swap so the physical spacing between parts remains correct in the new orientation.
- **Margins stay fixed** by default (the .530" clamp margin stays on the same physical edge of the machine).

### Future Option (include but unchecked by default)
- Add a small **checkbox** labeled something like “Move margins with rotation”.
- When **unchecked** (default): Margins stay on their named sides.
- When **checked**: Margins rotate with the Rem (advanced use case).

---

## 4. New Controls

### A. Link Button (Part section + Gap section)
- Small icon-only button (Lucide `Link` icon) placed between the X and Y input fields.
- When clicked:
  - Makes the X and Y values equal.
  - For **Part**: Useful for circles, discs, washers (creates square bounding box).
  - For **Gap**: If one field is empty (dash), copies the value from the other. If both have values, makes them equal.

### B. Swap Button (Part section + Gap section)
- Small icon-only button (Lucide arrows swapping left/right) placed next to the Link button.
- When clicked: Swaps the current X and Y values in that section only.
- This gives the user manual control without using rotation.

### C. Rotate Buttons Location
- Move both **Rotate Part 90°** and **Rotate Rem 90°** buttons into the **header of the Nest Preview card**.
- Make them smaller (icon + short text).
- Position them near the `Xnn | Ynn` summary on the left side of the header.
- This keeps rotation actions visually connected to the thing they affect.

---

## 5. UI Layout Order (Top → Bottom)

1. **Header**
   - NestCalc title (left)
   - Light/Dark toggle
   - Units toggle (in/mm)
   - Clear button (icon-only, smaller, top right)

2. **Quick Summary Card** (new in V3)
   - Full-width, same height as input boxes.
   - Left: `X11 | Y9`
   - Right: `Total Parts 99` (big gold number)
   - Font slightly larger/bolder than the version inside the Nest Preview card.
   - Purpose: Immediate glanceable results without scrolling.

3. **Part** section
   - `X [PART]` + `Y [PART]` inputs
   - Link button + Swap button between them

4. **Gap** section (new grouping)
   - `X [GAP]` + `Y [GAP]` inputs
   - Link button + Swap button between them

5. **Rem** section
   - `X [REM]` + `Y [REM]` inputs

6. **Margins** section
   - Small “Margins” sub-header
   - Left / Right / Top / Bottom inputs (grouped)
   - Checkbox: “Move margins with rotation” (unchecked by default)

7. **Combined Results + Nest Preview Card**
   - Header row: `Xnn | Ynn` + Rotate Part button + Rotate Rem button + `Total Parts nn` (big gold)
   - Below header: The **static** Nest Preview visual
   - On the visual:
     - Rem X dimension along bottom edge
     - Rem Y dimension along left edge
     - Parts Across and Parts Down counts labeled near the grid

8. **Nothing else below** the preview card (keep it tight).

---

## 6. Nest Preview Rules

- **Fully static** — No pinch zoom, no pan, no double-tap. Just a clean visual.
- Updates instantly on any input change or rotation.
- Shows Rem dimensions on the outer rectangle edges.
- Shows part counts (`X across`, `Y down`) near the grid.
- When Rem rotates, the outer rectangle changes aspect ratio and parts re-layout cleanly (no overlapping, correct gaps).

---

## 7. Other Retained V2 Behavior

- Live input updates (onChange) — preview reacts as you type.
- Clear button resets all fields to dashes (`—`).
- Light / Dark mode toggle works cleanly.
- Label format: `X [REM]`, `Y [PART]`, etc. (no dashes).
- All values support 3 decimal places.
- Fully offline PWA capable.

---

## 8. Out of Scope for V3

- Multi-part nesting
- DXF / STEP import
- Material utilization percentage
- Cost calculations
- Saving presets or history (beyond simple last-state)

---

## 9. Success Criteria

After V3 is implemented, a user on the shop floor should be able to:

1. Enter a Rem size and Part size.
2. Hit Rotate Rem 90° and see:
   - Rem X/Y inputs swap correctly.
   - Gap X/Y inputs swap correctly.
   - The visual preview shows a clean, non-overlapping nest in the new orientation.
3. Use the Link button on Part or Gap to quickly make values equal.
4. See an immediate summary of results both at the very top and inside the preview card.
5. Trust that the numbers and visual match physical reality.

---

**Status:** Ready for implementation via Grok Build CLI.

*This spec supersedes V2.*