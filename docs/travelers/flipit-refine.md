# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset editor is a non-modal card with Part, section disable, live load, and overwrite confirm. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: c16e89ddf7690a4752f5d6f9b52a7967a2abeebb
Session: fresh
job_id: NGJ-20260902-flipit-refine
flow_id:
goal_sha256:

Seq  Label              Notes                                              Stamp
1    Plan               Fit top-align; preset card lock                    
2    Start-branch       Owner remote / Codex App
3    Cut                1 Fit blank top at HUD stop            768b7381e24ee68ba05ab0370ec32c1df6cdb1e0
3b   Cut                1b Fit shares clamp stage stop         eece6b896849b92cff6b29d1698c7578e11fb0e0
3c   Cut                1c Re-park after blank size changes    41b6a91b4b0f7f74fcd290c0cc514f76f91a3b27
4    Look               Owner. No Codex.
5    Cut                2 preset card + Part + accessibility disable
6    Look               Owner. No Codex.
7    Send for review
8    Inspection
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/flipit-refine.md
When this packets log → docs/travelers/flipit-refine-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living SPEC → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When the blueprint → docs/howmany-v3-components/TICKER-PICKER-BLUEPRINT.md
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md

Shop: Codex App, Terra, Medium
Proof: Owner local host. Do not restore picker, calculator, chevron, old popover, or bed.
Do not change AutoNest math. Do not center the HUD on the blank.

## Cut lock

### Cut 1 — Fit top-align
`#lb-fit` / `fitBed()` parks the blank top at HEADER 64 + 15 + HUD 31.46 + 15.
Blank origin stays bottom-left of the blank. Extra height hangs below.
Pan and zoom stay. 15px bottom and 25px side insets stay.
Window is not a bed. Do not pin Fit to window bottom.

### Cut 2 — preset card
Not a modal. Slots stay clickable while the card is open.
Top row: label Presets | Lucide paint-bucket | name field | Check | X.
Name field is shorter than today. Placeholder only: Name this preset.
Check/X stay 22 / 14 / 2. One rule under that row. No footer rule. No Copy live text button.

Paint-bucket Lucide paths only, 22 / 14 / 2, viewBox 24, stroke 2, fill none:
M11 7 6 2
M18.992 12H2.041
M21.145 18.38A3.34 3.34 0 0 1 20 16.5a3.3 3.3 0 0 1-1.145 1.88c-.575.46-.855 1.02-.855 1.595A2 2 0 0 0 20 22a2 2 0 0 0 2-2.025c0-.58-.285-1.13-.855-1.595
m8.5 4.5 2.148-2.148a1.205 1.205 0 0 1 1.704 0l7.296 7.296a1.205 1.205 0 0 1 0 1.704l-7.592 7.592a3.615 3.615 0 0 1-5.112 0l-3.888-3.888a3.615 3.615 0 0 1 0-5.112L5.67 7.33
Title: Load canvas. Copies live Part / Blank / Gap / Margin into the open card, honoring section disable. Idle stroke #111111.

Card open + empty slot target: fill rgba(22,163,74,0.22) stroke #16A34A.
Card open + occupied slot target: gold arm rgba(255,206,27,0.55) / stroke rgba(201,140,0,0.85).
Card closed + that slot is live on the canvas: same gold. No red chips.

Check on an occupied target opens a second #E8E8E8 card 8.8px from the editor: Replace this preset? + Check/X. Empty target writes with no alert.

Sections top to bottom: Part, Blank, Gap, Margin.
Part defaults 2.500 × 3.500. Axis fields stay 106.8 × 31.46 with 8.8px gaps.
Idle slot tap hydrates enabled sections only.

Each section label row gets Lucide accessibility, 22 / 14 / 2, viewBox 24, stroke 2, fill none:
circle cx=16 cy=4 r=1
m18 19 1-7-6 1
m5 8 3-3 5.5 3-2.36 3.5
M4.24 14.5a5 5 0 0 0 6.88 6
M13.76 17.5a5 5 0 0 0-6.88-6
On / enabled: stroke #111111.
Off / disabled: stroke #538BEC.
Off sections do not write on save and do not hydrate on slot tap. Live canvas keeps those values. Off is stored on the slot.

Pencil with no arm still opens the card hydrated from live values. Pencil is momentary. Card close returns pencil to #111111.
