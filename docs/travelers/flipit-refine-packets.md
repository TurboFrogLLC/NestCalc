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
