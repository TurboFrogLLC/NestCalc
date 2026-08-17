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

## toolPath L2 backplot

`toolPath.html` is a dependency-free lab viewer for the six fixtures in this
directory. It fetches `manifest.json` and the selected sibling `.nc` file, so
serve the directory over HTTP rather than opening the page with `file://`:

```sh
python3 -m http.server 4173 --directory lab/laser-nc-fixtures
```

Then open <http://127.0.0.1:4173/toolPath.html>. The fixture buttons load F1,
F2, F3, F4, and both F6 orientations; **Refresh** fetches and redraws the
current selection without reloading the page.

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
