# Notes — blank-in-space canvas

Repo: NestCalc
Owner: wReckless
job_id: NGJ-20260901-blankspace
Session: fresh
Date: 2026-09-01
Source: FLiPIT SuperGrok planning chat after form-lock close

These notes pin Owner spitball. They are not product GOAL.
Quiet GOAL.md stays quiet. This job is Owner-named docs + composition chrome.

## This traveler (do)

- Lock the canvas subject: the blank sits in empty space. No drawn laser bed.
- 48×48 is current Fit UI, not a machine max. Fit frames blank + gutter, never a fake plate.
- App header across the top. Canvas well hard-stops X px under the header bottom.
- General window controls live in the header.
- Numeric HUD *surface* (frost card) is gone.
- Blank ticker + picker *is* the HUD. It stays pinned to the blank.
- Calculator *surface* stays. It is hidden until the ticker picker is clicked.
- Presets live on the calculator surface, not on the HUD card, not on the blank ticker.
- LaserBed individual HTML + SPEC stay on disk. Composition stops starring the bed.
- Numeric HUD individual HTML + SPEC stay on disk. Composition stops mounting the HUD card.

## This traveler (do not)

- Do not delete or rewrite AutoNest engine math (`src/lib/autoNestEngine.ts`, manual `calculateNest`).
- Do not add an AutoNest trigger in this traveler. Later traveler.
- Do not change calculator math, AutoNest policy, or FLiPIT identity.
- Do not invent a user-origin tool (hex nest / offset machine). Later.
- Do not make “what is your bed size?” a boot wall.
- Do not parse-implement Auto-Size bounds in this traveler. Detect stays FLiPIT's control.
- Do not treat HowMany as the product name.

## Spoken lock vs still open

Spoken: origin 0,0 at the *right* corner, bottom at 0 → bottom-right growth (left + up).
Current LaserBed law: bottom-left, blank grows right + up.
This traveler may keep BL growth if BR is not confirmed on the Cut packet.
Do not flip origin silently.

Gutter around the blank is hit slop for resize (right / top / free-corner). It is not a bed.
Vertical gutter larger than horizontal because picker / calc / popovers come off the blank.

## Later travelers (parked)

- AutoNest trigger (header vs calculator). Mode stays opt-in. Live math. Rotation locks while on.
- Typed machine envelope clamp (optional).
- User-set origin.
- Real Auto-Size parse (product `analyzeGCode` / `partSizeFromBounds`) vs FLiPIT stub `82.398 × 92.396`.
- FLiPIT / toolPath occupancy vs header well.
- Gap / Margin field homes once HUD rows are gone (picker vs calc vs header).

## Authority snapshot at pin

- NestCalc `main` tip at branch birth: `1352858dc4a5942773daef8188ba6e7edec3e75f`
- Form lock: PR 126 merge `f836d2b`
- Composition R29 still says full-viewport canvas = LaserBed 48×48. This job reverses that subject.
- Open sibling drafts that also touch V3 ticker / HUD: PR 121, 120, 119, 117, 116. This branch starts from `main`, not those heads.
