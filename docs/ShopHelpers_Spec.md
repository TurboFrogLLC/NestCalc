# NestCalc Shop Helpers v1

This residual specification freezes the shop-floor contract for the
plotter-only ACS rewriter. `GOAL.md` is the active execution authority. The
named-preset and two-module shell behavior from the earlier product wave is
baseline and out of scope for this residual.

## Baseline product boundaries

- Calculator formulas, AutoNest behavior, version-3 live scratch state, Clerk
  policy, request access, secrets, PWA runtime caching, deployment, and native
  iOS behavior remain unchanged.
- The G-code module remains a pure local coordinate plotter. It does not claim
  controller-specific acceptance, machine connectivity, cloud sync, or
  dialect completeness.

## Plotter-only ACS G-code contract

The tool rotates numeric X/Y endpoints and numeric I/J arc offsets around code
origin `(0,0)` for recognized `G00`, `G01`, `G02`, and `G03` motion blocks.
Endpoints are rotated as points; I/J values are rotated as vectors; G02/G03
direction is preserved.

Every other token remains byte-for-byte: comments, `CALL`, `RET`, labels,
`GOTO`, M-codes, `G40`, `G41D[CRC]`, `G200`, `M20001`, `M20002`, `ptp/ev`,
whitespace, blank lines, and subroutines. ACS constructs are pass-through.
The rewriter does not validate dialect completeness and does not require or
inject `G20`, `G21`, `G90`, or `G17` for Generate to succeed. A machine-ready
paste produces machine-ready rotated output within this opaque-token contract.

The transformer tracks modal X/Y values for recognized motion. After both
modal axes are known, an omitted endpoint axis is reconstructed and the
complete rotated X/Y pair is emitted before a trailing comment. If a required
axis is unknown, generation fails closed with a one-based diagnostic. Only
numeric I/J words that are present are rewritten; absent I/J words are not
invented.

Executable `G53` is rejected with a line-specific diagnostic and its machine
coordinate numbers are never rotated. `G53` inside an opaque comment remains
unchanged. Scientific notation is accepted for numeric target words and its
magnitude must survive precision selection; `X1e-3` must never collapse to
`X0`.

A center-format arc with I/J is transformed only once both modal start X/Y
values are known. The first such arc with an unknown start is rejected with a
line-specific diagnostic rather than being treated as if its start were zero.

## Rotation and serialization

The implementation keeps floating-point precision through parsing and
transformation, then rounds once while serializing transformed numbers. Known
`G20` output uses exactly five fractional digits; known `G21` output uses
exactly four. Unknown-unit output uses enough fixed decimal precision to retain
finite magnitude and transformed output never uses exponent notation. Negative
zero is normalized to positive zero.

After rewriting, the formatted stream is reparsed. Center-format radius
equality is enforced only for arcs that were actually transformed, using
`0.0002` in inches or `0.002` in millimeters. Untouched non-target ACS text is
not rejected for missing RS274 structure.

## Preview and output state

The existing live preview remains conservative: source parsing is latest-only
after its trailing debounce, and angle edits rotate the cached source AABB
corners without rewriting the full program. Generate performs the one full
rewrite and enables fresh output actions; later edits make output stale.

## Source-bounds part-size fill (Path A)

After source analysis succeeds, the operator declares the program unit with the
G-code panel's `IN | MM` segmented switch. `Fill part size` copies the source
toolpath AABB spans (`maxX - minX`, `maxY - minY`) into the calculator and aligns
the calculator unit to that declaration. The fill never uses the rotated preview
AABB and does not require `G20` or `G21` in the program.

Fill stays unavailable for invalid analysis or a zero span on either axis.
Comment/header size parsing and safety buffers are not part of Path A. This
additive bridge does not change Generate, Copy, Download, or any plotter-only ACS
rewrite rule.

## Fixture quarantine

Pure tests use five sanitized IPG LaserCube / ACS motion-and-control bodies
from the local fixture source. Headers and all part, job, and drawing-revision
identifiers are excluded. The repository and PR text contain only the
sanitized NC bodies and their behavior, never identifying metadata.
