# FlipIt V3 Components (Exploratory)

**Product:** **FlipIt** (repo remains NestCalc)  
**Class:** Exploratory UI blueprints only · **not a product GOAL** · not a residual  
Does not mutate Option B / residual-2 / V2 shell packages. Production still human-only.

## Living lock surfaces (this checkpoint)

| Surface | HTML | Living SPEC | Tip blob (HTML SHA) |
|---------|------|-------------|---------------------|
| Numeric HUD | `NUMERIC-HUD-v3.html` | `NUMERIC-HUD-v3.SPEC.md` | `d8a701b9…` |
| FLiPIT | `FLIPIT-v3.html` | `FLIPIT-v3.SPEC.md` | `8922424c…` |
| toolPath | `TOOLPATH-v3.html` | `TOOLPATH-v3.SPEC.md` | `ebf8d53e…` |
| LaserBed | `LASER-BED-v3.html` | `LASER-BED-v3.SPEC.md` | `60ca551c…` |
| **Composition host** | `COMPOSITION-FLIPIT-v3.html` | `COMPOSITION-FLIPIT-v3.SPEC.md` | `120ce855…` |
| Alignment contract | — | `ALIGNMENT-v3.SPEC.md` | copy-paste only (no runtime plugin) |

Audit (historical filename): `docs/audits/HOWMANY-V3-INDIVIDUALS-AUDIT-2026-08-17.md`

## Archives (kept, not deleted)

| Archive | Role |
|---------|------|
| `COMPOSITION-HUD-DECODER-v3.*` | prior composition host + index |
| `DE-CODER-v3-LOCKED.*` | early G-code panel lock (pre-FLiPIT rename) |
| `BACKPLOT-v3.SPEC.md` | superseded thin note for toolPath |

Older filenames referenced in early docs (`LASER-BED-v3-v1.html`, `NUMERIC-HUD-v3-LOCKED.html`) are **not** the living locks. Use the four individuals above + `COMPOSITION-FLIPIT-v3.html`.

## Walls

- Do not touch `docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html`
- Do not touch residual-components authority
- Individuals stay standalone (no cross-imports / no shared runtime plugin)
- Product insert requires a separate GOAL after quiet archive

## How to use with AI

1. Load `ALIGNMENT-v3.SPEC.md` for shared tokens / z-index / hide policies
2. Load each living `*.SPEC.md` + matching HTML as authority for that surface
3. Load `COMPOSITION-FLIPIT-v3.html` for the assembled host + bridges (R17 / R27 / R29 / R30 / R1–R7 chrome)
4. HTML wins on pixel/token conflicts vs SPEC
