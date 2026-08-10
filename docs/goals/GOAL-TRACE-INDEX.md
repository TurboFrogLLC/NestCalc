# NestCalc Goal Trace Index

This informational index links active and completed goal memory to its Flow-ID,
freeze commit, execution route, and publication state. Root `GOAL.md` remains
the sole active goal authority. This index is not consumed by the v1 governance
validator and never broadens an Allowed Files list.

| State | Goal | Flow-ID | Goal snapshot | Goal-memory commit | Implementation | Publication / review | Evidence / residual risk |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Complete | NestCalc UI redesign - Calculator + G-code shell (visual/UX) | `NC-20260810-5e79a800` | Historical; root `GOAL.md` quieted | `424415d7f4497505d3ee8cb8271970383ba675fb` (freeze) / `d92d748e906cac9fa83d0628b1f79955aac3ecd8` (rebind) | `ac524a7ab0cfb1b3f04f2c0eb53b581b9f1743b0` on feature tip; merged as `fb27fcefb8ceb196453889ce063efe2b6b8ef742` (PR #43) | PR #42 freeze; PR #43 implementation merged; quiet PR on `codex/quiet-goal-post-pr43` | Residual: portrait mobile expand may leave blank stage height (Codex P2); optional Allowed-Files polish only. No protected-surface drift. |
| Active (quiet) | Repository Quiet State - No Active Product Objective | `NC-20260810-7114cb07` | Active in root `GOAL.md` | `fb27fcefb8ceb196453889ce063efe2b6b8ef742` (completed product merge; quiet bind may rebind) | None — documentation-only quiet | Quiet goal-memory feature PR; no product implementation | Quiet state does not authorize product, auth, PWA, secrets, deployment, or MODE changes. |

Earlier NestCalc goals predate this local index and are not retroactively
backfilled. Their committed `GOAL.md` revisions and merged PR history remain the
historical trace evidence.
