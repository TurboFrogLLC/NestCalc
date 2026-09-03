# Packets — NGJ-20260902-flipit-refine

Append only.

## Seq 3 Cut 1 — Fit top-align

Operator: Codex App · Worker · Terra / Medium

- Commit: `768b7381e24ee68ba05ab0370ec32c1df6cdb1e0`
- `fitBed()` reserves the full HEADER 64 + 15 + HUD 31.46 + 15 top stop, keeps the blank origin bottom-left, and limits Fit height against the existing 15px viewport-bottom stop.
- Pan, zoom, 25px side inset, fixed HUD X, presets, and AutoNest math were not changed.
- Verification: `git diff --check` passed before the Cut commit.
