# AutoNest Integration Analysis

**Date:** 2026-07-04  
**Scope:** Analysis only. No `GOAL.md` creation.  
**Primary source of truth:** [AutoNest_Spec.md](./AutoNest_Spec.md)  
**Secondary guidance:** [roadmap.md](./roadmap.md)

## 1. What AutoNest Changes

AutoNest is not a small UI enhancement. It adds a second operating mode to
NestCalc:

- **Manual mode** remains the current uniform single-orientation calculator.
- **AutoNest mode** becomes an opt-in two-group mixed-orientation calculator with:
  - one 0-degree group
  - one 90-degree group
  - one straight trim line
  - achieved-margin reporting per resulting blank
  - hidden settings for global clamp margin plus full override
  - direct comparison against the best uniform result

The strongest guardrail in the spec is correct:

- **The current manual calculator must remain fully intact and untouched in behavior.**

That means AutoNest is not a replacement for the current calculator. It is a
parallel feature that shares inputs, preview space, and persistence, but must
not silently alter existing manual behavior.

## 2. Current Planning Baseline

The current repo planning sources say:

- [docs/architecture/ARCHITECTURE_REVIEW_TODO.md](./architecture/ARCHITECTURE_REVIEW_TODO.md)
  still ranks the next strong work as:
  1. verification deepening
  2. Nest session module
  3. shop-floor shell module
  4. PWA access gate module
- [NestCalc_Build_Spec_V3.md](../NestCalc_Build_Spec_V3.md) is the latest
  manual-calculator product spec and clearly supersedes V2.
- The current implementation still keeps most domain transitions inline in
  [NestCalcApp.tsx](../src/components/NestCalcApp.tsx), while the domain model is
  still only:
  - one `NestInputs`
  - one `NestResult`
  - one uniform `calculateNest()`
  - one single-group preview in [NestGrid.tsx](../src/components/NestGrid.tsx)

Verification infrastructure is no longer the main blocker. The repo now has:

- Vitest coverage for current pure helpers
- Playwright public proof
- Clerk-authenticated Playwright proof
- repo-local workflow and skill routing

So the architecture todo's verification item is now partially stale as a
priority driver.

## 3. Implementation Assumptions AutoNest Breaks

AutoNest does not fit the current domain model cleanly. These are the main
assumptions that break:

### 3.1 Single-result assumption

Current `NestResult` only supports:

- usable width
- usable height
- parts across
- parts down
- total parts

AutoNest needs more than that:

- best uniform comparison
- two-group result
- fallback state
- trim line orientation and position
- blank sizes
- achieved margins per blank side
- per-group counts and bounding boxes
- suggested origin offset

This is too much to bolt onto the current uniform-only result shape without
either:

- creating an explicit union / mode-specific result type, or
- adding a deeper session/domain interface first.

### 3.2 Single-mode input/state assumption

Current `NestInputs` only models the manual calculator:

- part dims
- rem dims
- four margins
- gaps
- linked flags
- move-margins-with-rotation
- unit

AutoNest needs additional state:

- mode toggle
- global clamp margin
- margin override mode
- possibly separate override margins
- UI lock state for rotation controls while AutoNest is active
- persistence and migration rules for those new settings

This is the clearest reason the current "deepen the Nest session module"
candidate became more important, not less.

### 3.3 Single-preview assumption

Current [NestGrid.tsx](../src/components/NestGrid.tsx) assumes:

- one remnant
- one usable rectangle
- one repeated part orientation
- one dashed usable area
- one pair of across/down counts

AutoNest needs:

- two color-coded groups
- trim line
- two resulting blanks
- achieved-margin annotations
- fallback to uniform when two-group loses

That means either:

- `NestGrid` becomes mode-aware, or
- a new AutoNest preview surface sits beside the current manual preview.

Given the guardrail to keep manual behavior intact, the second option is safer:
preserve the manual preview contract and add a separate AutoNest preview path or
explicit preview mode.

### 3.4 Inline transition assumption

Today, manual transitions are still embedded directly in
[NestCalcApp.tsx](../src/components/NestCalcApp.tsx):

- rotate part
- rotate rem
- link part
- link gap
- swap values
- clear
- unit conversion
- margin updates

If AutoNest is added directly here, the component becomes the owner of:

- manual state transitions
- AutoNest mode transitions
- settings gear state
- locked controls
- fallback logic presentation
- result comparison presentation

That is exactly the entanglement the architecture todo was warning about.

## 4. Candidate Interaction Analysis

## 4.1 Deepen the Nest session module

This candidate is now **more important**.

AutoNest strongly benefits from it because the next domain boundary needs to own:

- manual mode state
- AutoNest mode state
- shared input normalization
- mode-specific result production
- persistence and migration
- control locking rules
- fallback selection rules

Without a deeper session module, AutoNest will land as a large pile of mode
branches inside the UI layer.

### Recommendation

Do this candidate first, but scope it specifically for AutoNest readiness rather
than as a generic refactor.

The goal should not be "refactor because architecture says so." The goal should
be:

- extract a stable session/domain interface that preserves the current manual
  calculator exactly
- make that interface capable of supporting a future AutoNest mode without
  rewriting the UI again

## 4.2 Margin rotation toggle

As a next-goal candidate, this is now effectively dead.

Reasons:

- In V3 it was only a future/manual refinement.
- In the current code it is already implemented as
  `moveMarginsWithRotation`.
- AutoNest explicitly disables manual rotation controls while active.
- AutoNest also introduces a different margin model:
  - global clamp margin
  - override to full four-margin control
  - anchored origin-side behavior

So this should no longer be treated as an independent next-goal candidate. It is
now just part of the manual calculator's preserved behavior.

## 4.3 Verification deepening

This drops in priority.

The harness now exists and is working. More proof still matters, but it should
be pulled into the next product-facing goal rather than treated as the next main
goal by itself.

Specifically:

- session refactor work should add targeted unit tests at the session interface
- AutoNest work should add domain tests and browser proof for the new preview

That is higher leverage than a standalone verification-only wave.

## 4.4 Shop-floor shell module

Still useful, but later.

AutoNest will touch the shell anyway because it adds:

- toggle
- settings gear
- hidden settings surface
- comparison/results presentation
- trim/blank preview details

Doing shell modularization before the mode/domain separation risks refactoring
the wrong UI boundary first.

## 4.5 PWA access gate module

This becomes lower priority for the immediate next goal.

AutoNest does not materially depend on:

- Clerk policy changes
- request-access flows
- offline-shell route policy

So this should not go first.

## 5. What Older Specs Are Now Outdated Or Need Reframing

AutoNest does not mean older specs are useless. It means they should be
reclassified properly.

## 5.1 `NestCalc_Build_Spec.md`

This file is now outdated as the current product authority.

Parts that are outdated or superseded:

- It frames NestCalc as only a simple uniform nesting calculator.
- It says "advanced nesting algorithms" are out of scope; AutoNest is now an
  in-scope practical mixed-orientation mode.
- It says "100% client-side (no backend, no accounts, no data leaving the
  device)". That was already outdated once Clerk auth and request-access were
  introduced.

Recommendation:

- Keep this as historical v1 context only.
- Do not treat it as the active product authority once AutoNest planning starts.

## 5.2 `NestCalc_Build_Spec_V2.md`

This is already historical.

It is mostly a UI-transition spec and should not drive new planning.

Recommendation:

- Treat as archived historical design intent only.

## 5.3 `NestCalc_Build_Spec_V3.md`

This is still important, but only as the **manual calculator spec**.

What becomes incomplete or superseded:

- It still describes the app's product direction as centered on manual rem
  rotation and uniform calculation.
- It assumes the main calculation mode is always one orientation at a time.
- Its layout/control story does not include:
  - AutoNest toggle
  - settings gear
  - global clamp margin
  - override mode
  - comparison vs best uniform
  - two-group preview

What should remain authoritative:

- manual-mode rotation behavior
- link/swap behavior
- gap/rem swap rules
- existing manual UI behavior
- existing manual preview expectations

Recommendation:

- Reclassify V3 as the authoritative spec for **manual mode only**.
- Do not delete it.
- Once AutoNest is real, introduce a new current product authority that says:
  - manual mode is governed by V3 behavior
  - AutoNest mode is governed by AutoNest spec behavior

## 5.4 `docs/architecture/ARCHITECTURE_REVIEW_TODO.md`

This file is partially stale.

Outdated parts:

- verification as the top next step is no longer accurate in the same form
- repo status notes are obsolete
- PR #17 / workflow status notes are obsolete

Still valid parts:

- the "deepen the Nest session module" recommendation is now even more correct
- the "shop-floor shell module" recommendation still makes sense later

Recommendation:

- Do not use the current recommended order literally anymore.
- Treat the session-module recommendation as the durable part.

## 6. Best Sequencing From Here

## Recommended Order

1. **Deepen the Nest session module, explicitly for AutoNest readiness**
2. **Implement AutoNest phase 1 + phase 2 together in one bounded wave**
3. **Deepen browser proof for the new manual/AutoNest mode split**
4. **Consider shop-floor shell modularization after the mode/domain boundary is stable**
5. **Leave PWA access gate work for later unless a separate auth/PWA problem appears**

## Why This Order Wins

If AutoNest is attempted immediately on the current structure:

- state branches land inside `NestCalcApp.tsx`
- result typing becomes ad hoc
- persistence changes become fragile
- preview branching becomes tangled with existing manual rendering

If the session module is deepened first:

- the current manual calculator can be preserved behind a stable interface
- AutoNest can be added as a second mode instead of a UI hack
- tests can shift from helper-level to behavior-level
- storage migration can happen in one place
- control locking rules have a natural home

This does **not** mean a long abstract cleanup phase. It means a tightly scoped
preparatory goal that exists specifically to make AutoNest safe to add.

## 7. Highest-Leverage Next `GOAL.md`

The best next `GOAL.md` is **not** "implement AutoNest now."

The best next `GOAL.md` is:

**Prepare NestCalc for AutoNest by deepening the Nest session module and result model while preserving current manual calculator behavior exactly.**

That goal should likely include:

- extract a session/domain interface from the current inline UI transitions
- preserve existing manual behavior exactly
- make the result typing capable of supporting future mode-specific outputs
- keep the current manual preview contract intact
- add interface-level tests for the manual session behavior
- avoid implementing the full AutoNest algorithm yet

Then the following goal becomes much cleaner:

**Add AutoNest as an opt-in second mode with global clamp margin settings, two-group packing, fallback logic, and trim-line preview.**

## 8. Final Recommendation

AutoNest should happen soon. It is now the most important product direction
change in the repo.

But the highest-leverage move is **one goal before AutoNest**, not AutoNest
itself:

- Do the Nest session/domain deepening first.
- Scope that goal narrowly around AutoNest readiness.
- Then implement AutoNest as the next feature wave on top of that boundary.

The candidate list should now change like this:

- **Promote:** Deepen the Nest session module
- **Promote immediately after:** AutoNest implementation
- **Demote:** standalone verification deepening
- **Demote:** shop-floor shell module
- **Demote strongly / remove as candidate:** margin rotation toggle
- **Defer:** PWA access gate module

If a single sentence is needed for the next planning move:

**Do not make AutoNest the next coding goal directly; make AutoNest-ready session extraction the next goal, then build AutoNest immediately after.**
