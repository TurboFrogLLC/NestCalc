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
