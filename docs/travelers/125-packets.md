# 125 packets

job_id: NGJ-20260831-ticker-menubar
Branch: docs/ticker-menu-bar
Base: feat/v3-ticker-door (#121)
Operator: Codex App

## 2026-08-31 lock

Draft PR #125. Owner locked desktop menu-bar. Lite one Cut.

## Seq 2 — Cut — 2026-08-31

Locked menu-bar host at `e358a03b47efaf241a5117abc500df7ce568074b`, confirmed as the origin branch SHA. Picker is above and attached to the ticker; it is right-flush, 22px high, word-only with an 8px word gap, and has a zero-radius join. Travel retains ±90, calc, and in-ticker edit. No #124 HUD residual work.

## Seq 3 — Send for review — 2026-08-31

Posted a new `@codex review` comment on PR #125: https://github.com/TurboFrogLLC/NestCalc/pull/125#issuecomment-5484860113. Draft state is unchanged.

## Seq 4 — Wait — 2026-08-31

Short-read completed with authenticated `gh`: no completed Codex review, OM SIGNAL, or +1 is present. The review summary reports Codex review running on `4b71f54`; stamp fact: **no-review-yet**.

## Seq 5 — Inspection — 2026-08-31

**Clean.** Read PR #125 owner comments, SuperGrok notes, and Codex review threads: no Owner or SuperGrok note beyond the review request, no review threads, and no submitted reviews or findings. Codex review remains running; this is recorded as residual review state, not a corrective-action finding. Draft state unchanged; no merge.

## 2026-08-31 Cut B look opened

Owner added look refinements on the same traveler. No `@codex review` on Send B. Review is batched later.

## Seq 6 — Cut B look — 2026-08-31

Cut B host at `ef538f0ee1ad72a530547f705e13cdd9095a2532`, confirmed as the origin branch SHA. Picker has 8px horizontal padding and radius 6; ticker stays static with top-left radius 8 and only its top-right squared under the picker. Picker clips/slides independently; ticker hits, picker words, calc, chevron, and rotate have no press imprint. No #124 HUD residual work.

## Seq 7 — Send B — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.

## Seq 8 — Wait B — 2026-08-31

**owner-deferred-review.** No PR short-read was performed and no review wait was started, per the Owner's Send B instruction.

## Seq 9 — Inspection B — 2026-08-31

**Clean.** Cut B lock verified in the host and SPEC: picker 22px with 0 T/B · 8 L/R padding and radius 6; ticker remains static with top-left radius 8 and only top-right squared when open; picker clips/slides independently; no ticker hit, picker word, calc, chevron, or rotate press scale remains. No #124 HUD residual work, merge, or PR comment.

## 2026-08-31 Cut C look opened

Owner look: picker still shows a bottom join line. Calc still shows a filled idle box after tap. No `@codex review` on Send C.

## Seq 10 — Cut C look — 2026-08-31

Cut C host at `38176f45b105f4e7f67333eeb7f39d42cbe32b8d`, confirmed as the origin branch SHA. The picker masks the travel top border underneath it so the open pair reads as one shell. Cluster hover/focus fills are gone; only linked X/Y keeps `is-on`; ticker hits and picker words use transparent tap highlight and blur after click. No #124 HUD residual work.

## Seq 11 — Send C — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.

## Seq 12 — Wait C — 2026-08-31

**owner-deferred-review.** No PR short-read was performed and no review wait was started, per the Owner's Send C instruction.

## Seq 13 — Inspection C — 2026-08-31

**Clean.** Cut C lock verified in the host and SPEC: no visible picker join line; cluster hover/focus fills are removed; only linked X/Y may show `is-on`; ticker hits and picker words use transparent tap highlight and blur after click. No #124 HUD residual work, merge, or PR comment.

## Seq 14 — Cut D shell — 2026-08-31

Cut D host at `fba529836fb0c54ab22f1b85a84f312920ab92ff`, confirmed as the origin branch SHA. Closed ticker retains its only bounding stroke. Open picker overlaps the travel top by 1.1px with the same `#E8E8E8` fill, keeps left/top/right borders, and has no bottom border, leaving an inverted-L with no empty full-width shell or picker seam. No #124 HUD residual work.

## Seq 15 — Send D — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.

## Seq 16 — Wait D — 2026-08-31

**owner-deferred-review.** No PR short-read was performed and no review wait was started, per the Owner's Send D instruction.

## Seq 17 — Inspection D — 2026-08-31

**Clean.** Cut D lock verified in the host and SPEC: closed ticker retains its only bounding stroke; open picker overlaps the travel top by 1.1px with left/top/right borders and no bottom border, producing the required inverted-L without an empty full-width empty shell. No #124 HUD residual work, merge, or PR comment.

## Seq 18 — Cut E look — 2026-08-31

Cut E host at `06fd98ec911f879a1f30e0007995184117c695d7`, confirmed as the origin branch SHA. The picker keeps its overlapping L/T/R shell and gains only an inset 1.1px join rule with 8px side clearance. The travel’s inside top-right is radius 6; −90/+90 are flush while the remaining travel gaps stay 2px. No #124 HUD residual work.

## Seq 19 — Send E — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.

## Seq 20 — Wait E — 2026-08-31

**owner-deferred-review.** No PR short-read was performed and no review wait was started, per the Owner's Send E instruction.

## Seq 21 — Inspection E — 2026-08-31

**Clean.** Cut E lock verified in the host and SPEC: the 1.1px `rgba(26, 20, 40, 0.22)` join rule is inset 8px at each picker side without restoring its bottom border; the travel inside top-right is radius 6; −90/+90 are flush and all other travel gaps remain 2px. No #124 HUD residual work, merge, or PR comment.

## 2026-08-31 Cut F look opened

Owner look on local host: Cut E radiused the **wrong** corner (travel top-right under the picker). Wanted the **inside left** picker×travel join as a 6px concave fillet. Input radius 6. Swap off Blank/Part/Gap. Send-to-presets freezes the page after HUD hide. No `@codex review` on Send F.

## Seq 22 — Cut F look — 2026-08-31

Cut F host at `f3cc1220cfc4c42f77efa8ec2256e3d6df589750`, confirmed as the origin branch SHA. The travel outer top-right is flat and the 6px inverse fillet is at the picker-left connector; the inset join line remains. Ticker and Bed Presets inputs are radius 6, swap is absent from ticker X/Y edit, and ticker Send safely exits edit after opening Bed Presets. Browser verification confirmed Send leaves the picker and Zoom In interactive, with no Send-handler console error. No #124 HUD residual work.

## Seq 23 — Send F — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.

## Seq 24 — Wait F — 2026-08-31

**owner-deferred-review.** No PR short-read was performed and no review wait was started, per the Owner's Send F instruction.

## Seq 25 — Inspection F — 2026-08-31

**Clean.** Cut F lock verified in the host and SPEC: the travel outer top-right is flat, the picker-left connector is the 6px inverse fillet, and the 8px-inset join rule remains. Ticker and Bed Presets inputs are radius 6; Blank, Part, and Gap ticker edit have adjacent X/Y inputs with Link only. Browser verification confirmed ticker Send opens Bed Presets, exits ticker edit, leaves picker and Zoom In interactive, and adds no Send-handler console error. No merge or PR comment.

## 2026-08-31 Cut G look opened

Owner: Cut F scoop is concave. Want convex. Quarter lives in the grid at picker left × travel top so the stroke walks around the step. Shared edges square. No `@codex review` on Send G.

## Seq 26 — Cut G look — 2026-08-31

Cut G host at `8ceed5bd9c098cc80a72cd839ef869be20450d84`, confirmed as the origin branch SHA. The Cut F concave scoop is removed; a filled 6px convex grid quarter carries the 1.1px `rgba(26, 20, 40, 0.22)` outline around the picker-left × travel-top step. Shared edges remain square, the travel outer top-right stays flat, and the 8px-inset join line remains. No swap, Send-lockup, or #124 HUD work.

## Seq 27 — Send G — 2026-08-31

Owner-deferred review: no PR comment and no `@codex review` were posted. Draft state unchanged.
