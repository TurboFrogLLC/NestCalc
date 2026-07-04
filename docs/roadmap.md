# AutoNest Implementation Roadmap (Suggested Guidance)

**Status:** Suggested / Flexible Roadmap  
**Related Spec:** `AutoNest_Spec.md` (v7) in this same folder  
**Purpose:** This is **not** a rigid plan. It is a high-level suggested structure to help Codex get oriented quickly. Codex should:

1. Read the full `AutoNest_Spec.md` carefully (especially the Core Behavior, Decoupled Model, Algorithm Approach, and Settings sections).
2. Explore the **existing NestCalc codebase** thoroughly (current calculator logic, UI components, state management, margin/gap handling, preview rendering, etc.).
3. Create its own detailed `GOAL.md` (following the project's standard GOAL.md format).
4. Break the work into logical phases and P-xxx tasks as it sees fit.
5. Feel free to adjust, improve, or deviate from this roadmap based on what it discovers in the code.

This roadmap exists only to give strong starting pointers and reduce initial analysis time.

---

## High-Level Suggested Phases

### Phase 0: Preparation & Orientation
- Confirm location of `AutoNest_Spec.md` and this roadmap.
- Deep exploration of the current NestCalc implementation:
  - How the existing manual calculator works (state, calculations, UI).
  - Current margin/gap handling and where it lives.
  - Preview rendering logic.
  - Any existing toggle or settings patterns.
- Set up branch, initial commit, and project structure if needed.
- Create the project-level `GOAL.md` for AutoNest.

**Goal of this phase:** Codex should feel confident it understands the current system before touching anything.

### Phase 1: Settings + Toggle Infrastructure (Foundation)
- Implement the hidden **Settings (Gear Icon)** menu:
  - Global Clamp Margin (single primary value, e.g. default 0.530").
  - Toggle/checkbox for "Override global margins" that reveals full 4-margin controls.
- Add the main **AutoNest toggle** on the calculator screen.
- When AutoNest is active:
  - Lock/disable manual part and remnant rotation controls.
  - Show clear label: “AutoNest: Two groups (0° + 90°)”.
- Ensure the existing manual calculator remains 100% untouched and fully functional when the toggle is off.

**Key Spec References:** Settings section, Core Behavior guardrails, User Experience & Output.

### Phase 2: Core AutoNest Logic (The Engine)
- Implement the **decoupled inner-tight + outer-margin model**.
- For each orientation group (0° and 90°):
  - Pack parts independently using simple orthogonal grid / shelf / level packing (gaps only, no margins inside the group).
  - Calculate minimal bounding rectangle for each group.
- Post-facto calculation of the best straight trim line position that fits both bounding rectangles into the original remnant while respecting:
  - Anchored margins on origin/clamp sides.
  - Full margins on trim-facing edges.
- Scoring + fallback logic (prefer clean blanks + total part count; gracefully fall back to best uniform orientation when two-group result is not useful).
- Ensure the logic is fast and deterministic.

**Key Spec References:** Core Concept (Decoupled Model), Algorithm Approach (High-Level), Research-backed justification for post-facto trim.

### Phase 3: Preview, Results & Visualization
- Update the remnant preview to show:
  - Two color-coded groups.
  - Clear straight trim line (horizontal or vertical).
  - Blank sizes (3 decimal places).
  - **Actual achieved margins per side** of each resulting blank (especially trim-facing and non-origin sides).
  - Suggested origin offset (3 decimal places).
- Enhance the Results panel with clear comparison:
  - “Best uniform: X parts”
  - “AutoNest (two groups): Y parts (+Z)”
- Keep the UI clean, phone-friendly, and aligned with the existing NestCalc aesthetic (“light n tite”).

**Key Spec References:** User Experience & Output (Preview + Results), Success Metrics.

### Phase 4: Hardening, Edge Cases & Polish
- Full guardrail enforcement: Existing manual calculator must never be broken or refactored.
- Edge case handling (thin/unusable blanks, cases where two-group is worse, very small remnants, etc.).
- Performance validation (should feel instant on modern iPhone).
- Minor UX polish and consistency with spec.
- Any final alignment with the wReckless Toddler philosophy (operator is the expert, shows possibilities without dictating, +1 part is valuable, etc.).

---

## Important Guidance for Codex

- **Prioritize the guardrails** in the spec. The manual calculator must remain fully intact.
- **Reuse existing logic** where possible (especially margin/gap handling and basic layout math). Do not over-engineer.
- **Simple rectangular packing is sufficient.** We are not building a general irregular nester. Shelf/level/grid-style orthogonal packing for rectangles is the right level of complexity.
- **Post-facto trim calculation** is intentional and matches real-world guillotine/shelf patterns. Do not try to interleave the two groups.
- Codex is encouraged to research lightweight JS/TS rectangular packing approaches (shelf pack, guillotine variants, simple MaxRects-style, etc.) if it finds better patterns in the existing codebase or ecosystem — but keep the implementation pragmatic and fast.
- The **Settings gear + global vs override** pattern is important for keeping the main UI clean. Do not put four margin fields on the main screen by default.

---

## Success Criteria (High Level)

- Operator can toggle AutoNest on and immediately understand the two-group option.
- The preview clearly shows the trim line and the two separate blanks with their real achieved margins.
- Even +1 extra part is presented as valuable.
- The feature feels like a natural, lightweight enhancement to the existing calculator — not a separate heavy tool.
- The existing manual calculator works exactly as before when AutoNest is off.

---

**This roadmap is guidance only.**  

Codex should treat the `AutoNest_Spec.md` as the primary source of truth and create whatever detailed plan and task breakdown best serves clean, governed implementation.

Let’s build something practical and useful for the shop floor.