# Laser NC fixture pack — L1 lab only

This directory is an isolated, emit-only fixture pack for future laser-NC
parser and bounds experimentation. It is not wired to HowMany, NestCalc
product code, controller output, or any deployment path. The advisory research
pointer is SuperBrain `R-20260811-laser-nc-fixtures` and its UoG `laser-nc`
shelf synthesis; that material informed fixture shape only.

## Charter walls

- Everything here is lab text and a lab-only bounds helper.
- `M3`, `M4`, `M5`, and `S` in F4 are fixture tokens, not live laser commands.
- This pack does not change calculator, AutoNest, product G-code, auth, PWA,
  routes, or product UI behavior.
- Programs use the fixed convention `G21 G90 G17` and end with `M5` then `M2`.

## Regenerate and verify

Run from the repository root:

```sh
node lab/laser-nc-fixtures/generate-fixtures.mjs
git diff --exit-code -- lab/laser-nc-fixtures
```

The generator writes LF-only deterministic files and records each fixture's
SHA-256 in `manifest.json`. Running it repeatedly should leave no diff.
`bounds.mjs` intentionally computes motion-only XY bounds: linear endpoints
and G2/G3 endpoints plus any traversed E/N/W/S arc extrema.

## Arc AABB policy

F2's I/J circle and F3's R-word circle both have the full-diameter AABB
`[-10, -10]` to `[10, 10]`; their two endpoints alone would misleadingly form
only the horizontal chord box. F3 uses exact 180-degree R-word semicircles
solely as a fixture. Near 180-degree R arcs are controller-sensitive: NIST
guidance warns that radius-format arcs are ambiguous/ill-conditioned around a
semicircle. Do not use this representation as a production controller policy.

F6 records a rectangle at 0 degrees and its 90-degree counter-clockwise twin
about origin. Their dimensions exchange and the rotated AABB becomes
`[-20, 0]` to `[0, 40]`, as expected.

## toolPath L3 round hex inset pair

`toolPath.html` is a dependency-free lab viewer for the seven fixtures in this
directory. It fetches `manifest.json` and the selected sibling `.nc` file, so
serve the directory over HTTP rather than opening the page with `file://`:

```sh
python3 -m http.server 4173 --directory lab/laser-nc-fixtures
```

Then open <http://127.0.0.1:4173/toolPath.html>. The default view is the L3
round **hex inset pair** in **inches**, preserving the original physical
geometry: `R ≈ 0.393701 in` (`10 mm`) and `g ≈ 0.078740 in` (`2 mm`).
The in/mm toggle converts the displayed `R` and `g` values without changing
the physical layout. The fixture buttons still load F1–F4, the fixed F5 golden
round pair, and both F6 orientations; **Refresh** redraws the current round
layout or fetches the current fixture without reloading the page.

For round parts, `R` is the outer radius, `g` is a required positive perimeter
gap, and `p = 2R + g` is the center distance. The continuous gap dial clamps
to `0.050–0.500 in` (`1.27–12.7 mm`) and has preset chips for `0.050 in`,
`0.125 in`, `0.250 in`, `0.500 in`, `1 mm`, and `2 mm`. The first center is
`(0, 0)`; the default inset second center is `(p/2, p*sqrt(3)/2)`. The clearly
labelled optional **row compare** places its second center at `(p, 0)`. The
readout reports `R`, `g`, `p`, `dx`, `dy`, center distance, and the combined
AABB in the active unit. The page packs washers on their OD only; a washer ID
hole, if introduced in a future lab fixture, is draw-only and never changes the
layout calculation.

### L2 proof checklist

- F1 shows one `40 × 20 mm` rectangular cut profile.
- F2 (I/J) and F3 (R-word) show circles in `[-10, -10] → [10, 10] mm`.
- F4 shows the `60 × 40 mm` outer profile and the inner circular profile;
  `M3`, `M4`, `M5`, and `S` words do not create plotted motion.
- F6-0° is `40 × 20 mm`; F6-90° is `20 × 40 mm` and occupies
  `[-20, 0] → [0, 40] mm`.
- Every fixture reports `MATCH` with a near-zero maximum AABB delta, and the
  dashed manifest outline overlays the computed path bounds.
- G0 motion is dim/dashed; G1/G2/G3 motion is solid.

### L3 proof checklist

- Default inch view preserves `R = 10 mm`, `g = 2 mm`; flipping to mm shows
  those values while preserving the same two-circle geometry.
- The gap dial clamps continuously to `0.050–0.500 in` or its `1.27–12.7 mm`
  equivalent. Each inch/mm preset sets that same physical gap in the active
  display unit.
- The default hex inset has center distance `p = 22 mm`, `dx = 11 mm`, and
  `dy = 11*sqrt(3) mm` (or their inch equivalents).
- **Single circle** shows only the origin-centered OD. **Row compare** is an
  optional comparison only and places its second center at `(p, 0)`.
- `F5-round-hex-inset-r10-g2.nc` is the deterministic golden fixture for the
  default round layout; its manifest row records the combined arc-aware AABB.

### Parser walls

- The inline parser is a lab visualizer, not a controller, validator, or
  production G-code implementation.
- It recognizes only modal `G0`/`G1`/`G2`/`G3` XY motion. Missing X or Y words
  retain the previous coordinate; I/J are center offsets and R is radius form.
- Parenthesized and semicolon comments plus non-motion words such as M, S, and
  F are ignored. The fixtures remain fixed to `G21 G90 G17`; unit conversion,
  incremental positioning, other planes, and controller dialect behavior are
  intentionally outside this L2 page.
- R-word arcs at or near 180 degrees retain the ambiguity caveat above. The
  exact F3 semicircles have a single midpoint center, but this is not a
  production controller policy.
- Nothing in this page connects to HowMany, NestCalc product code, the
  calculator, bridge/host surfaces, Clerk, PWA, routes, or deployment.
- This is not a multi-part different-shapes nesting lab, a full-sheet nest,
  AutoNest, or a FlipIt host change. It does not prescribe controller output.
