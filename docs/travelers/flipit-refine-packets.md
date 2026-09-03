# Packets — NGJ-20260902-flipit-refine

Append only.

## Seq 3 Cut 1 — Fit top-align

Operator: Codex App · Worker · Terra / Medium

- Commit: `768b7381e24ee68ba05ab0370ec32c1df6cdb1e0`
- `fitBed()` reserves the full HEADER 64 + 15 + HUD 31.46 + 15 top stop, keeps the blank origin bottom-left, and limits Fit height against the existing 15px viewport-bottom stop.
- Pan, zoom, 25px side inset, fixed HUD X, presets, and AutoNest math were not changed.
- Verification: `git diff --check` passed before the Cut commit.

## Seq 3b Cut 1b — Fit shares clamp stage stop

Operator: Codex App · Worker · Terra / Medium

- Commit: `eece6b896849b92cff6b29d1698c7578e11fb0e0`
- `fitBed()` now uses the stage-local `HUD_BLANK_STOP` for both its vertical fit height and bottom-left-origin `panY`, matching `clampSubjectToStops()` without adding `HEADER_H` a second time.
- Pan, zoom, side inset, fixed HUD X, presets, and AutoNest math were not changed.
- Verification: `git diff --check` passed before the Cut commit; Fit and clamp now share the same minimum `panY` equation.

## Seq 3c Cut 1c — Re-park after blank size changes

Operator: Codex App · Worker · Terra / Medium

- Commit: `41b6a91b4b0f7f74fcd290c0cc514f76f91a3b27`
- The host reuses the existing stage-local `fitBed()` park after a committed center-HUD blank-size edit and after `pointerup` from `x`, `y`, or `xy` blank resizing.
- Pan-only release and pointer-cancel do not re-park. The park remains `zoom = 1`, `topStop = HUD_BLANK_STOP`, and `panY = blankH * s + HUD_BLANK_STOP`.
- Presets and AutoNest math were not changed. Verification: `git diff --check` passed before the Cut commit.

## Seq 5 Cut 2 — Count well re-lock + preset card

Operator: Codex App · Worker · Terra / Medium

- Commit: `cbf37f0d7524adfb5ac317b9160b8cfd9067ff44`
- VOID implement. Count well measure landed. Sheet and card rewrite is dead. Do not follow this lock.

## Seq 5b Cut 2b — preset card chrome restoration

Operator: Codex App · Worker · Terra / Medium

- Commit: `99b5a8d993230387a827b5e46ea4d4b1aa306ada`
- VOID implement. Patched the rewrite. Do not follow this lock.

## Seq 5c Cut 2c — lock rewrite (management)

Operator: SuperGrok · Operations Manager

- Traveler Cut lock replaced. Cut 2 / 2b void. Next implement is restore host card + sheet from `78391d095a416cfe156dc79d8533e042e182a603` only.
- No host change in this row.

## Seq 5c Cut 2c — restore implementation

Operator: Codex App · Worker · Terra / Medium

- Commit: `16f7c066d7bf1eb560fac778d38978a559a1dd6c`
- Restored only the PRESETS row, centered z-index-201 preset card, and card open/close behavior from `78391d095a416cfe156dc79d8533e042e182a603`. The card is Blank, Gap, and Margin only; the old Part, paint-bucket, section toggles, target colors, and replacement confirmation are absent.
- Fit parking, count well, PART SIZE/GAP/MARGIN chips, and AutoNest math were not changed.
- Verification: exact source comparison for the four restored surfaces, `git diff --check`, inline JavaScript parse, and `npm run lint` passed before the Cut commit.

## Seq 5d Cut 2d — modal pair

Operator: Codex App · Worker · Terra / Medium

- Commit: `2224b4af8a28310edcfdae9418e995f19c61d813`
- Pencil opens a blocking `z-index: 201` modal with `blur(8px)` and `rgba(17,17,17,0.28)` backdrop. The centered 421.4px row is the live 154px PRESETS block, a 15px gap, and the unchanged 252.4px card; the card center is 84.5px right of viewport center.
- The live PRESETS node moves into the row with a measured, visibility-hidden sheet hole left behind and returns on close. Slots, pencil, plus, and minus remain live; the sheet’s PART SIZE, GAP, and MARGIN positions do not jump.
- Fit parking, count well, AutoNest math, card geometry, PART SIZE/GAP/MARGIN chips, paint-bucket, Part, accessibility, and header surfaces were not changed.
- Verification: browser open/add-slot/cancel interaction check; `npm run lint`; and `git diff --check` passed. The only browser console entry was the existing local missing-favicon 404.

## Seq 5e Cut 2e — card header, blur, selected minus

Operator: Codex App · Worker · Terra / Medium

- Commit: `a7e1c120787f7fa1dbaa76316a703dda8d14948b`.
- The blocking backdrop is now `blur(4px)` with its `rgba(17,17,17,0.28)` dim unchanged. The centered Cut 2d presets/editor pair geometry is preserved.
- The editor has a 31.46px Presets header with unboxed Check/X, a single header rule, 6px name/number field radii, and no footer actions or footer rule. It retains no paint-bucket or Part section.
- Minus now removes only an armed gold slot. Its first use opens the adjacent 8.8px-spaced confirmation card; opting out persists `howmany.flipit.v3.presetDeleteSkip`, allowing later armed deletes to happen immediately.

## Seq 5f Cut 2f — header type, placeholder, alert-dialog

Operator: Codex App · Worker · Terra / Medium

- Commit: `9b91cb0f07fa72f4b2243e3bf44232fe1633043e`.
- The Presets header now shares the PRESETS label type, and the empty name field reads `Name this preset`.
- The former side confirmation is replaced by a viewport-centered z-index-220 alert-dialog with overlay, title, description, checkbox, and Cancel then destructive Delete footer. The modal pair remains behind it.
- Verification: real-browser alert open/cancel/reopen/delete flow, `npm run lint`, and `git diff --check` passed.

## Seq 5g Cut 2g — card hits, dirty alert, arc clear

Operator: Codex App · Worker · Terra / Medium

- Commit: `e23750382c475c70bfe8958b99a5dacceec43935`
- Card name and number fields select-all on click. BLANK, GAP, and MARGIN now use the sheet label token and each has the locked 28 / 18 / 2 accessibility control; disabled sections remain blue and do not hydrate or write.
- Header Check/X use 28 / 18 / 2, the edit pencil stays black while the modal is open, and the existing delete alert is a 280px, 12px-radius shell with a black checkbox accent. The shell also confirms an armed-slot dirty edit: Cancel restores the card field and Change stores the selected slot.
- The shared HUD-to-blank stop gains 8px of clearance for the resize arc. AutoNest math and the count well are unchanged; no Part row or paint-bucket was added.
- Verification: real-browser dirty-edit alert opened with the specified copy and only Cancel/Change, and Cancel restored the edited value; `npm run lint`, inline JavaScript parsing, and `git diff --check` passed. Browser console retained only the existing local missing-favicon 404.

## Seq 5h Cut 2h — HUD seats, Part row, disable, gaps

Operator: Codex App · Worker · Terra / Medium

- Commit: `89789e1f31c213e114c0e57c320e5fdaeee49fa5`
- The centered HUD now measures the closed `00.000 × 00.000` size pair and tabular `999` count well at boot, reuses one immutable seat grid while editing, and fixes `#blank-ticker-pin` once after both measures.
- The card now orders PART SIZE, BLANK, GAP, MARGIN. Part defaults to `2.500 × 3.500`; sections use the requested 4px label and 6px section gaps; `Name preset` is the empty-field placeholder and blank saved names remain blank.
- Accessibility now dims and disables the full selected row, excludes it from card hydration and writes, and adds the same behavior to PART SIZE. No paint-bucket or AutoNest-math change was made.
- Verification: real-browser blank-size pointer interaction focused the selected field; card inspection confirmed PART SIZE order/defaults and the `Name preset` placeholder; toggling Part made both Part inputs disabled. `npm run lint`, inline JavaScript parsing, and `git diff --check` passed. The browser retained only the existing local missing-favicon 404.
