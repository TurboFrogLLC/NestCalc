# Traveler

Repo: NestCalc
Owner: wReckless
Part: FLiPIT refine — Fit top + preset card
Description: Fit parks blank top at the HUD stop. Preset card restore from 78391d0, then surgical adds. No picker. No calc. No bed. Q2 HUD-to-blank X is out.
PR: 134
Branch: docs/flipit-refine
Head: c34a67b5c36b3fa59549c274aecf22efc9e49140
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
5    Cut                2c–2i preset card                      3e1c7e63345f5b8c458599de929ac2140f257a95
7    Send for review    one @codex at 3e1c7e6                  c34a67b5c36b3fa59549c274aecf22efc9e49140
8    Inspection         Codex P2 threads open
5j   Cut                2j keep disable across slot; close card on delete  f0bd202984a1876a46509d4214d9e3c2c880f7d8
9    Merge
10   Close

When a term → docs/GLOSSARY.md
When this visit → docs/templates/packet.md
When the job sheet → docs/travelers/flipit-refine.md
When this packets log → docs/travelers/flipit-refine-packets.md
When the host → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html
When the living contract → docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.SPEC.md
When the shop table → SuperBrain nerveCenter/control-surface/OPERATOR-PIN.md
When PR → https://github.com/TurboFrogLLC/NestCalc/pull/134
When Codex disable thread → https://github.com/TurboFrogLLC/NestCalc/pull/134#discussion_r3924810634
When Codex delete thread → https://github.com/TurboFrogLLC/NestCalc/pull/134#discussion_r3924810646

Shop: Codex App, Terra, Medium
Proof: Owner remote host. Do not restore picker, calculator, chevron, old popover, or bed.
Do not change AutoNest math. Do not center the HUD on the blank.
Do not post a second @codex review from this Cut.

## Cut lock

### Cut 2j — keep disable across slot; close card on delete
Selecting another slot while the card is open must keep the current accessibility inclusion state. Do not reset every section to enabled before hydrate. Disabled sections do not hydrate from the new slot.

Deleting the armed slot while the card is open closes the card and clears marginPresetCardSlot. Header Check must not write into the index that slid into the hole.

No paint-bucket. No green target. No second review request.
