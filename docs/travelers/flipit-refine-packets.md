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
