# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT hex nest
Description: Lucide hex arm left of hamburger. Circle parts on diameter. Lab HCP inset math. Do not implement until Owner locks Cut 1.
PR: 135
Branch: docs/hex-nest
Head: 812f3a21ca039dd7f48ff100c22c137336abb93e
Session: fresh
job_id: NGJ-20260903-hex-nest
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Hex spitball + lab pointer
2    Start-branch       Owner remote / Codex App
3    Cut                1 reserved — hex arm + circle part
4    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/hex-nest.md
When this packets log → docs/travelers/hex-nest-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When lab hex layout → SuperBrain lab/laser-nc-fixtures/round-layout.mjs mode inset
When lab hex fixture → SuperBrain lab/laser-nc-fixtures/F5-round-hex-inset-r10-g2.nc
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/135

Shop: Codex App, Terra, Medium
Proof: Owner remote. Do not restore picker, calculator, chevron, old popover, or bed.
Do not copy NC emission into NestCalc. Do not replace the AutoNest hamburger.

## Pin

Lab points at hexagonal close-pack of round ODs. FLiPIT builds the calculator; it does not import the NC fixture pack.

### Arm
Lucide hexagon control in the center HUD, same hit/glyph/stroke class as the hamburger (24 hit / 16 glyph / 2 stroke / viewBox 24).
Sits immediately left of the AutoNest hamburger.
Armed stroke `#16A34A` (same green family as AutoNest arm). Off `#111111`.
Hex arm and AutoNest arm are independent. Hex does not use the hamburger.

### HUD seat lock
Adding the hex control must not break the closed pin. Re-measure the full closed row (rotates, size pair, count well, hex, hamburger) once after the seat is added. Digit count and open/close must not resize `#blank-ticker-pin`.

### Part surface when hex is armed
Part is a circle. Typed size is diameter only. PART SIZE stays linked: one field (X) drives diameter; Y follows. Canvas tiles render as circles, not rectangles.
Blank stays a rectangle. Gap is edge-to-edge between circles. Margins stay on the blank.

### Pack math (from lab)
R = diameter / 2.
p = 2R + gap (gap is the live edge gap; for equal X/Y gap use that value).
Inset row offset: (p/2, p√3/2).
Proven lab pair: R=10, g=2, p=22, second center (11, 19.052558883).

### Out of first Cut
Hexagon-shaped tiles. Point-to-point vs flat-to-flat. NC emission. Paint-bucket. Changing AutoNest math except to call the hex pack when hex is armed.
