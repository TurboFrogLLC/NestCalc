# Packets — NGJ-20260903-hex-nest

Append only.

## Seq 1 Plan — open draft

Operator: SuperGrok · Operations Manager

- Branch docs/hex-nest cut from docs/autonest-host at 121478d.
- Lab pointer: round-layout.mjs inset + F5-round-hex-inset-r10-g2.nc.
- No host change.

## Seq 1b Plan — Owner pin

Operator: SuperGrok · Operations Manager

- Lucide hexagon left of hamburger; independent arm; green when on.
- Circle part on diameter; PART SIZE linked; tiles draw as circles.
- Lab HCP inset math: p = 2R + g; offset (p/2, p√3/2).
- HUD seat lock required when the hex control is added.
- No host change in this row.

## Seq 3 Cut 1 — hex arm, circles, packer, array faces

Operator: Codex App · GPT-5.6 Terra · High

- Added the independently armed Lucide hex control immediately left of AutoNest and included its seat in the locked ticker width.
- Hex mode links PART SIZE to a circular diameter, packs legal inset centers, draws dotted diameter AABBs, and keeps AutoNest rectangle-only.
- Added the viewport array ticket for columns, rows, and the signed three-decimal X/Y box gaps; no NC, row handle, or tile drag was added.

## Seq 3b Cut 1b — ticket off the resize arc

Operator: Codex App · GPT-5.6 Terra · Medium

- Parked the armed hex array ticket against the blank's lower-west stroke with the required 15px gap, leaving the blank NE corner unoccupied.
- Browser proof: the ticket ended at x=203 while the blank began at x=218; the NE resize hit target remained at x=1077, y=110 and completed a resize drag with the ticket open.
- Packer math, hex arm, circles, dotted AABBs, HUD pin, AutoNest, and ticket values were not changed.

## Seq 3c Cut 1c — ticket in the left stack

Operator: Codex App · GPT-5.6 Terra · Medium

- Moved the array ticket into the left floating stack between MARGIN and PRESETS; it is a 154px read-only stack card using the MARGIN radius and shadow family.
- Browser proof: hex armed shows the ticket in that stack order with COLUMNS 4, ROWS 3, X GAP 0.125 in, and Y GAP -0.227 in; disarming hex removes the ticket.
- Removed the ticket's canvas positioning, leaving the NE resize arc clear; packer math, arm, circles, dotted AABBs, HUD pin, and AutoNest were unchanged.

## Seq 3d Cut 1d — exclusive arms, ticket faces

Operator: Codex App · GPT-5.6 Terra · Medium

- Made Hex and AutoNest mutually exclusive: arming either clears the other's pressed state, restores its default `#111111` color, and leaves the active control `#16A34A`.
- Added X OFFSET to the existing left-stack ticket as `L + p/2`, the row-2 first dotted-box left edge. Ticket measurements now render to three decimals without a unit suffix.
- Browser proof: Hex-on shows AutoNest off and all five faces — COLUMNS 4, ROWS 3, X GAP 0.125, Y GAP -0.227, X OFFSET 1.563. AutoNest-on clears Hex and hides the ticket; Hex-on also clears AutoNest.

## Seq 5 Cut 2 — max-squeezed rows, GAP held

Operator: Grok Build · Grok 4.6 · high

- Hex packer picks the largest N whose squeezed pitch still fits one even-row center and one odd-row center; leftover height adds a row instead of opening the nest.
- Live pair stays D+g. Copied rows stay at ≥ D+g. Origin (L+R, B+R), +X only. Ticket faces follow that lattice with no unit suffix.
- Hex arm, exclusive hamburger, ticket stack seat, dotted AABB, and HUD pin unchanged.
- Replayed onto 4abd1e7 and pushed origin/docs/hex-nest so Owner Look can ff. Unpushed GB commits are not Look.
