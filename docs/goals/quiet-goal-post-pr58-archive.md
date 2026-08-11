# Goal Execution Trace: HowMany residual polish

**Status:** Complete
**Recorded:** 2026-08-11

## Trace

| Field | Evidence |
| --- | --- |
| Goal | HowMany residual polish - keyboard decimal, presets, AutoNest render, G-code Fill bounds, margins hydrate |
| Flow-ID | `NC-20260811-6ec4fb02` |
| GOAL-SHA | `sha256:51e9fc55fd5d2b9f0945eb4f15632637d0b91e7f90c2b1870701e9e6b81c047c` |
| Goal-memory | Freeze `c2780bbd2ecbef4e7144080f9ae25038b2596675`; metadata bind `57985bde27d5cb51d7daf20ae57fd41773e35a04` |
| Execution | `codex-cli` on `codex/howmany-residual-polish`; feature tip `65cf281f6bbb78375c7682b2d608ae72c8e1c8d7` |
| Publication | PR #57 goal freeze; PR #58 implementation, squash-merged 2026-08-11 |
| Merge SHA | `25ac898132b6b6b28b378f16bbd56edd103c8365` |
| Outcome | **Complete - all authorized HowMany residual-polish outcomes shipped** |

## Accepted shipped outcome

- Physical keyboard decimal entry is bridged into focused prototype numeric
  fields without changing calculator math or the prototype source.
- Existing owner-scoped complete v3 preset save/load remains authoritative;
  the hosted carousel owns real preset selection and exposes a truthful empty
  state after deleting the final preset.
- The hosted shell stage renders the existing real computed AutoNest preview.
- G-code Fill uses `analysis.bounds`, while Generate retains the existing real
  rotated output path.
- `moveMarginsWithRotation` hydrates from and writes back to real session state.
- The canonical prototype checksum remains
  `bed7567d093b73c08e2538f3e5939c32bc8765ae2cfbe9d43e7b2848d3f4475d`.
- HowMany identity, full brand line, free-standing wordmark, protected
  `docs/ui-shell` lineage, and Option B package authority remain durable.

## Quiet-state disposition

The root `GOAL.md` contains no active product implementation objective. Quiet
Flow `NC-20260811-c3c74ccb` binds that repository state through quiet freeze
`a2168e84a3704cefd3f2daf71e059c5f2c8d0775` and metadata bind
`f1697dd236021b98cbd9cc87191161426d4abe90`. Carousel
`selectedIndex` follow-up is explicitly not active or authorized here; any
future product work requires a new human-approved freeze. Product source, the
exact prototype, engine algorithms, Clerk, PWA, secrets, deployment,
Production, and `docs/governance/MODE` remain untouched by this archive.
