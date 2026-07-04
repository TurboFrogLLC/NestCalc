# AutoNest Feature Spec

**Project:** NestCalc  
**Date:** July 2026  
**Status:** Draft v7 — Simple Orthogonal Grid Packing + Post-Facto Trim Line + Operator-First  
**Author:** RecklessToddler + Grok  
**Location:** `docs/AutoNest_Spec.md`

---

## 1. Philosophy & Mindset (Most Important)

This is a **quick blank / remnant management & job prep sketch pad** for experienced operators.

**Goal:** Show “what is realistically possible” with the physical material the operator has right now, using simple machine workflows (one straight trim + two clean programs, or one with an origin offset).

**Mantra:**  
“Don’t tell me what to do or manage my job. Just show me the good options fast and accurately so I can decide on the fly.”

The operator is the expert. NestCalc does the math and visualization fast. AutoNest is simply one feature inside it.

## 2. Fallback Behavior

- If a useful two-group mixed orientation layout is not possible or does not beat the uniform result, **gracefully fall back** to the normal single-orientation calculation (best 0° or best 90° as currently selected).  
  Do not force a bad two-group result.  
  **Definition of “bad” result (for Codex clarity):** A two-group layout is considered not useful if it produces fewer total parts than the best uniform orientation, or if the resulting blanks are impractically thin/unusable for the operator’s clamps/fixtures, or if it violates the anchored margin rules on the origin sides.

## 3. Core Concept — Decoupled Inner / Outer Model + Simple Orthogonal Grid Packing

This is the key simplification and the reason we can keep the implementation lightweight:

- **Inner nest group** — Each orientation (0° group and 90° group) is packed **independently and tightly** using only the user-defined gap between parts (no margins inside the group). This creates its own minimal bounding rectangle (“imaginary tight blank size”).

- **Outer blank** — The actual piece(s) cut from the remnant. The full user-defined margins are applied around each inner group when fitting them onto the remnant.

- **Simple orthogonal grid / level / shelf packing only** — Because we are dealing exclusively with rectangles and squares (no irregular shapes, no part-in-part, no L/T/U nesting), we use standard, well-proven rectangular packing methods: shelf packing, level-oriented packing, or Bottom-Left-Fill (BLF) variants. These produce clean, predictable grids that operators understand immediately. No complex no-fit-polygon (NFP) logic is needed or wanted in v1.

- **One straight trim line separating two clean groups** — The two independently packed groups are placed on the remnant with a single straight (horizontal or vertical) trim line between them. The trim line becomes a new edge for both resulting blanks.

This approach deliberately avoids any interleaving or part-within-part logic. The groups remain completely separate and visually obvious.

### 3.5 Existing Patterns & References for Codex (Do Not Reinvent — Proof of Concept in the Wild)

**This entire approach is standard practice.** Codex should start from these battle-tested, widely implemented patterns and adapt only the rectangular + anchored-origin + two-clean-groups + post-facto trim aspects.

**Strong, directly usable references:**

1. **pyckingsolver** (modern, actively maintained)
   - Explicitly separates `item_item_minimum_spacing` (inner gaps) from `item_bin_minimum_spacing` (outer margins). Perfect match for our decoupled model.
   - Supports multiple bin types and per-bin clearance — directly usable for our two resulting blanks after the trim.
   - **Action:** `pip install pyckingsolver` and study the `InstanceBuilder` + spacing examples.

2. **Shelf / Level / Guillotine algorithms for rectangular packing** (extremely common, decades of use)
   - Shelf packing and level-oriented packing are the classic “grid” methods for rectangles. They pack left-to-right, top-to-bottom in levels/shelves. The resulting layout naturally supports straight separating cuts.
   - Guillotine algorithms (see rectpack library, Jylanki’s “A Thousand Ways to Pack the Bin”, academic literature) explicitly use straight cuts to subdivide space. After placing items, remaining space is split with guillotine (straight through) cuts. This is the mathematical foundation for our “one straight trim line” between two groups.
   - **Proof of concept:** rectpack Python library has full Guillotine implementation with multiple split rules. Many CNC/laser nesting packages offer “grid nesting” or “shelf nesting” modes for rectangular parts precisely because it produces clean, machine-friendly layouts with easy trim/separation lines.
   - **Post-facto trim line calculation:** It is common to first pack/group parts into minimal bounding areas, then decide on the optimal position of a dividing straight cut (trim line) afterward so the two resulting pieces fit the original sheet/remnant with proper margins. This is exactly “trim off calculated after the fact.” Guillotine and shelf methods make this trivial because the layouts are already aligned to straight lines.

3. **SVGnest / Deepnest lineage + libnest2d**
   - While primarily for irregular shapes, they demonstrate the pattern of tight inner placement + separate spacing/offset for edges. The rectangular case is a massive simplification of the same idea.
   - **GitHub:** https://github.com/Jack000/SVGnest and https://github.com/tamasmeszaros/libnest2d

**Bottom line for Codex:**  
Do not invent anything new. Start with shelf/guillotine/BLF rectangular packing (already solved problem). Pack each orientation group independently into its minimal bounding rect. Then solve a simple placement problem for the two bounding rects on the remnant with one straight dividing trim line, respecting anchored margins. The position of that trim line can (and should) be calculated after the groups are packed. This is standard, reliable, and exactly what many production rectangular nesting tools do.

## 4. Core Behavior

**Critical guardrail for Codex:** The existing manual calculator (uniform 0°/90° with part and remnant rotation) **remains 100% intact** and is the default. AutoNest is strictly an opt-in toggle that adds the two-group option on top. Codex must never remove, replace, or refactor the manual calculator.

- Remnant is fixed during calculation (but user can still swap X/Y and trigger re-calculation of AutoNest).
- Parts are only 0° or 90°.
- AutoNest produces **two clean, separate groups** (all 0° in one group, all 90° in the other) separated by **one straight trim line**.
- Each group is packed with simple orthogonal grid/shelf/level logic (no interleaving whatsoever).
- Resulting blank sizes are natural (whatever the packing produces).
- No automatic skeleton or complex scrap trimming — operator handles extra trimming manually if desired.
- Color-coded groups + visible trim line in preview.

When AutoNest toggle is active, manual part/remnant rotation controls are **disabled/locked** to avoid state conflicts.

## 5. User Experience & Output

**Main screen:**
- Toggle/button: **AutoNest** (default Off)
- When on: Clear label “AutoNest: Two groups (0° + 90°)” 
- Manual rotation controls locked while toggle is active.

**Settings (Gear Icon — hidden by default):**
- Accessed via a small gear icon (keeps the main calculator clean and “light n tite”).
- **Global Clamp Margin**: Single value (example default: 0.530") that applies to the origin/clamp sides. This is the most common setting most operators will use.
- Toggle/checkbox: **“Override global margins”** — when enabled, shows all four margin inputs (Left / Right / Top / Bottom) for full flexibility on special jobs.
- The override mode is intentionally secondary so the main UI stays simple. Most of the time users stay in global mode.

**Preview:**
- One remnant view showing two color-coded groups separated by a straight trim line.
- Trim line clearly visible and labeled.
- Blank sizes for each group (3 decimal places).
- **Actual achieved margins shown on each side of each resulting blank** (especially trim-facing sides and non-origin sides). This makes the real available room/slops immediately visible without extra math.
- Suggested origin offset (3 decimal places).

**Results panel:**
- Total parts + breakdown.
- Clear comparison: “Best uniform: X parts” vs “AutoNest two-group: Y parts (+Z)”
- Blank 1 size + actual achieved margins per side, Blank 2 size + actual achieved margins per side, trim suggestion.

The operator looks at the numbers and the visual for a few seconds and knows exactly what to do on the machine. That is the entire point.

## 6. Algorithm Approach (High-Level) — Keep It Simple

1. Run existing uniform 0° calculation.
2. Run existing uniform 90° calculation.
3. For two-group path:
   - Pack the 0° parts independently into a tight bounding rectangle using simple shelf/level/grid packing + user gap only.
   - Pack the 90° parts independently into their own tight bounding rectangle (same method).
   - Take the two resulting minimal rectangles and find the best position for a single straight trim line on the original remnant so both rectangles fit with proper anchored margins on the origin sides and full margins on the trim-facing edges.
   - The trim line position is calculated **after** the two groups are packed (post-facto). This is deliberate and matches real-world practice in guillotine/shelf-based rectangular nesting.
4. Score by total parts + preference for clean, usable blanks.
5. Return best result or graceful fallback to uniform.

This is fast, deterministic, and uses only proven rectangular packing techniques. No NFP, no irregular nesting, no part-in-part.

**Research-backed justification for “trim after the fact”:** Guillotine and shelf algorithms (rectpack, academic literature on rectangular packing, production CNC nesting software) routinely allow placement/grouping first, followed by determination of straight separating cuts. Many laser/CNC packages explicitly support “grid nesting” modes for rectangles followed by common-cut or trim-line decisions. This is not new; it is how simple rectangular nesting has worked for decades.

Performance target: Instant feel on modern iPhone for typical shop remnants.

## 7. Open Questions (Minor)

- Exact visual weight of the “+X parts” comparison line.
- Whether trim line is always shown or only when it adds value.
- Future simple toggle for “consider rotating the second blank.”

## 8. Success Metrics

- Operator immediately understands the output and what action to take on the machine.
- Even +1 extra part is recognized as valuable (common in job-shop reality where every part counts toward making the order from existing stock).
- The tool stays “light n tite” — no bloat, no over-optimization, no pretending to be full CAM software.
- Results are trustworthy and deterministic.
- It helps the person on the shop floor make quick decisions when management doesn’t know what they’re doing.

## 9. Recommended Phased Approach

**Phase 1 (MVP)**
- Opt-in AutoNest toggle on existing calculator.
- Independent simple grid/shelf packing of each orientation group.
- Post-facto calculation of best straight trim line position.
- Color-coded preview + trim line + blank sizes + **actual achieved margins per side of each blank** + offset.
- Comparison vs best uniform.
- **Settings gear icon** with Global Clamp Margin + Override toggle for full 4-margin control.
- Full protection of manual calculator.

**Phase 2**
- Polish mobile layout.
- Minor UX tweaks for the comparison and trim visualization.

**Phase 3 (Future, only if needed)**
- Optional single-program mixed mode.
- Remember last preference.
- Simple “second blank rotated” consideration.

---

**Status:** Ready for implementation planning. All core concepts have direct, widely-used proof-of-concept references in rectangular packing literature and production software (shelf/guillotine algorithms, decoupled spacing, post-placement straight-cut determination).

This spec lives at:  
**`/home/workdir/artifacts/nestcalc/AutoNest_Spec.md`**

Download the latest version from there. All future related files for this feature go in the same folder.