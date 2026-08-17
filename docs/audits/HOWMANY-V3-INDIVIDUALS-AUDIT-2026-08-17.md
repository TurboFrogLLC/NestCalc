# HowMany V3 Individual Components — Read-Only Audit

**Date:** 2026-08-17  
**Class:** docs-only · exploratory · one-shot · NestCalc  
**Branch at audit:** `docs/howmany-v3-decoder-lock`  
**Repo:** `TurboFrogLLC/NestCalc`  
**Branch tip at audit start:** `a7eea61d0e1bf3633e3d9a42f8e28f279c92b882`  
**Scope:** four locked standalone HTML tips + their living SPECs. Zero HTML/CSS/JS mutations. No visual or behavior changes.

This file is an audit + alignment-plugin feasibility note only. It is not a product GOAL, not a freeze, and not a merge brief.

---

## Audit-time identities

Working-tree `git hash-object` matched `HEAD` blobs for all four HTML files.

| Surface | Path | Last commit touching HTML | HTML blob (audit time) | SPEC tip blob (as written) | Blob match |
|---------|------|---------------------------|------------------------|----------------------------|------------|
| NUMERIC-HUD-v3 | `docs/howmany-v3-components/NUMERIC-HUD-v3.html` | `092777a524bf738bf7ff82fbafb64be28ec1279b` | `221fb75e8acbe00857e24e0425bea5b3a4930800` | `221fb75e8acbe00857e24e0425bea5b3a4930800` | match |
| FLIPIT-v3 | `docs/howmany-v3-components/FLIPIT-v3.html` | `37d628e970ff3f2a4d6eed189528d7a2fd23fc02` | `c156815a6c0b98f1d3c509abfd4c5a8452e0c500` | `69d0bd9a17e9c10cc716f604726c8cdeea678772` (composition tip `fb011e6b`) | **SPEC points at composition, not this file** |
| toolPath | `docs/howmany-v3-components/TOOLPATH-v3.html` | `2e9e2aceb59acec4d2e7dea490c577c380c12346` | `1ed50d650a06c260dcf135e75286adf5cdf54c10` | `1ed50d650a06c260dcf135e75286adf5cdf54c10` | match |
| LaserBed | `docs/howmany-v3-components/LASER-BED-v3.html` | `4776519dc2ad3c410860c15eba785ff1f8d3249c` | `0f193a4a4c277146cd157b5a7603cd1c4d058c0f` | `0f193a4a4c277146cd157b5a7603cd1c4d058c0f` | match |

Line counts at audit: HUD 1167 · FLiPIT 2050 · toolPath 421 · LaserBed 326.

Authority rule used here: HTML tip is visual/behavior truth; SPEC is the living contract. Drift is recorded when the SPEC number or behavior does not match the HTML.

---

## 1. Per-component audit

### 1.1 NUMERIC-HUD-v3

Single-file card: `:root` tokens → card CSS → markup → one IIFE. Structure matches the SPEC tree (`#hud` / `.keypad-header` / `#hud-body` / `#hud-mode` + `.classic-calc`). Isolation wall in the HTML banner is held: no bed, no FLiPIT panel, no toolPath, no isolator, no child-spec.

#### Structure

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| HUD-S1 | P2 | Large unused token block copied from the composition palette. | `:root` defines `--frost-blue`, `--white-70`, `--white-55`, `--white-40`, `--blue-42`, `--blue-dark`, `--blue-border`, `--blue-glow`, `--chip-h`, `--ease-standard`, `--motion-expand`, `--motion-mode`. None are referenced as `var(--…)` in this file. `--spring` and `--ease` are used. |
| HUD-S2 | P2 | Dead class name in JS. | `closeAllParamPopovers` removes `'show-hover'` (line 852). No CSS or add-path for `.show-hover`. |
| HUD-S3 | P2 | Duplicate focus/blur wiring on popover fields. | `wireXyGroup` attaches focus/blur on `.pop-half`; a later `querySelectorAll('.pop-half, .pop-m-field')` (1106–1118) attaches the same `is-focused` + 120ms blur timeout again. |
| HUD-S4 | P2 | `state.units` is never read. | Declared `'in'` at line 613; no consumer. |

Organization is otherwise clean: CSS is grouped (shell → header → body → tickers → popovers → calc). No external imports.

#### Bugs / correctness risks

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| HUD-B1 | P0 | `#hud-body` is given an inline `display` during measure. SPEC forbids this because it breaks CSS grid collapse. | SPEC: “Never set `display` on `#hud-body` (breaks grid collapse).” HTML `#hud-body` is `display: grid` (205–211). `lockBodyHeight` sets `hudBody.style.display = 'flex'` (1134), then a rAF later `applyModeVisibility` clears it with `hudBody.style.display = ''` (660). Collapse uses `grid-template-rows: 0fr ↔ 1fr`. A flex display makes that transition a no-op. Today it is transient (~1 frame) and then cleared; it is still the exact landmine the SPEC names. |
| HUD-B2 | P0 | Popover placement is two-way, not four-way. Off-screen on short/narrow viewports. | SPEC: “Placement · smart outside HUD (right → left → **bottom → top**).” `positionOutsideHUD` (901–917) tries `hudRect.right + gap`, then `hudRect.left - gap - pw`. No bottom or top branch. Vertical only clamps `top` to `rowRect.top`. |
| HUD-B3 | P0 | Blank (and gap-on-open) link-button chrome can desync from `paramState.*.linked`. | Close-X restores blank numbers + `linked` flag (868–871) but **does not** restore `[data-blank-link]` `.active` / `aria-pressed` (part and gap *do*). `openParamPopover` for `blank` (952–954) and `gap` (955–957) writes field values only — no link-button sync. Cancel or reopen can show the wrong chain/unlink paint. |
| HUD-B4 | P1 | Popover inputs cannot place a caret after the first click. | Lines 1121–1127: `mouseup` `preventDefault()` + `selectAll()` on every `.param-popover input[type="text"]`. First click selects all (intended); subsequent clicks cannot move the caret. Clear-× still works. |
| HUD-B5 | P2 | Collapse-then-drag-to-bottom, then expand, can overflow the viewport. | Drag clamp uses live `hud.offsetHeight` (733–734). Collapsed height is ~44px, so the card can sit on the bottom edge. Position-hold then expands in place. SPEC *wants* position hold; this is a composition-fit risk, not a SPEC violation. |

`setPointerCapture` on `#hud-header` is guarded (`try/catch`). Buttons are excluded via `closest('button')`. Footer chips are true no-ops (1150–1156).

#### Formatting / code quality

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| HUD-F1 | P1 | Collapse motion token is used for both directions; expand/mode tokens are unused. | CSS transition is only `grid-template-rows var(--motion-collapse)` (211). `--motion-expand: 560ms` and `--motion-mode: 420ms` are defined (56–57) and listed in the SPEC Motion table, but never applied. Calc ↔ HUD swap is an instant `display` toggle on children (662–663), not a 420ms height lock. |
| HUD-F2 | P1 | Amber and several sizes are raw literals next to tokens. | `#FFCE1B` appears at footer chips, popover text, and selection (300, 311, 325, 387). `--chip-h` exists but heights are written `28.6px`. |
| HUD-F3 | P2 | Copy-paste `title` on AUTO-SIZE. | `#btn-auto-size` title is `"FLiPIT is a separate component"` (567) — same string as `#btn-gcode`. |
| HUD-F4 | P2 | Mixed JS style vs the other three files. | HUD uses `const` / `function`. FLiPIT / toolPath / LaserBed use `var` + IIFE. Not a bug; hurts a shared helper extract. |

Comments in the banner and `placeInitial` / `setCollapsed` match the position-hold behavior. No lying comments found in the HUD script.

#### SPEC vs HTML drift

| Topic | SPEC | HTML | Verdict |
|-------|------|------|---------|
| Tip blob | `221fb75e…` | `221fb75e…` | match |
| Width / radius / frost / header 44 / ink@0.82 | 268 / 15.4 / `#D8D6E2` / 44 / `rgba(26,20,40,0.82)` | same | match |
| Collapse 600ms / grid rows | yes | `--motion-collapse: 600ms` + `#hud-body` grid | match |
| Never `display` on `#hud-body` | forbidden | `lockBodyHeight` sets `flex` | **drift + risk** |
| Popover right → left → bottom → top | 4-way | right → left only | **drift** |
| `--motion-expand` / `--motion-mode` | 560 / 420 | defined, unused | **soft drift** |
| Position hold | keep left/top | `placeInitial` 16,16; collapse does not write left/top | match |
| Footer chips standalone no-ops | yes | empty click handlers | match |
| FLiPIT footer case | `FLiP` + `IT`, no forced uppercase | `.label-flip` / `.label-it` `text-transform: none` | match |

#### Accessibility / semantics (light)

- `#hud` is `role="dialog"` with `aria-label="Numeric HUD"` but no `aria-modal`, no focus trap, no labelled-by title. It is a floating card, not a dialog. Light mismatch.
- Header tools, popover save/close/clear, calc keys: `type="button"` + `aria-label` where needed. Calc toggle has `aria-pressed`. Chevron has `aria-expanded`.
- Tickers are `tabindex="0"` but only the HUD click handler opens them — no Enter/Space key handler.

---

### 1.2 FLIPIT-v3

Largest extract (2050 lines). Same single-file shape: tokens → long CSS (shell, edit-lock, header, surface-row, tool-strip, code, stage, resize) → `<aside class="gcode">` → one IIFE. Isolation wall in the HTML banner is held: no bed, no HUD, no toolPath *card*, no isolator, no `data-child-spec`.

#### Structure

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| FL-S1 | P2 | JS writes classes CSS never reads. | `progField.classList.toggle('has-value', …)` (1657) — no `.has-value` rule. `panel.classList.toggle('is-source-tab', …)` (1828, 1835) — no `.is-source-tab` rule. |
| FL-S2 | P2 | `posted` boolean is write-only. | Set in `setBounds` / `clearBounds` / `btnPost` (1378, 1611, 1622, 2008). Status paint goes through `setStatus('posted')` and `data-state`, not this flag. |
| FL-S3 | P2 | EDITING banner node is permanently hidden. | `.surface-editing-banner { display: none !important; }` (466). `:has(.is-editing-banner)` still greyscales the strip (145–209) — the lock works; the “EDITING” label never appears. |
| FL-S4 | P1 | Resize handles ship in standalone; SPEC is silent. | Markup 1162–1164 (`.gcode-resize-e/s/se`). JS 1736–1788 clamps width 418–568 and shell height 110–308. Living SPEC Shell table has width/radius/z-index/position memory — no resize row. |
| FL-S5 | P2 | Composition leftovers in CSS that standalone never paints blue on waypoints. | Global `.icon-btn.is-on` is blue-dark (429–433). Waypoints never get `.is-on`. `btnEditOut` toggles both `.is-on` and `.is-editing` (1896–1897); `.is-editing` greyscales and disables pointer events, so the blue engaged rule is mostly dead here. |

No cross-imports. File is standalone.

#### Bugs / correctness risks

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| FL-B1 | P1 | Header **X** hides the panel with no standalone restore. | `closeGcode` (1721–1732) sets `display: none`, clears `is-open`, `aria-hidden="true"`. Unlike toolPath, there is no Re-open control. Refresh is the only way back. SPEC does not require a reopen; standalone inspectability is still one click from a dead page. |
| FL-B2 | P1 | Open/close is a dual path: class `is-open` **and** inline `display`. | CSS `.gcode` is already `display: flex` (113). There is no `.gcode:not(.is-open) { display: none }`. Hide/show is entirely `panel.style.display` (`flex` / `none`, 1709 / 1731) plus an inline `style="… display: flex;"` on the aside (1160). `is-open` is only consulted when capturing `lastGcodePos`. Easy to break if a composition host toggles the class alone. |
| FL-B3 | P2 | Undo/Redo titles advertise Cmd/Ctrl+Z; no keydown handler exists. | Titles on `#btn-undo-src` / `#btn-redo-src` (1237, 1240). Grep of the file: no `keydown` / `metaKey` / `ctrlKey`. |
| FL-B4 | P2 | **Open program** loads the inlined sample, not a file. | `#btn-open` → `loadSampleProgram` (2031, 1594–1596). Demo-correct; the `title` says “Open program”. |
| FL-B5 | — | Waypoints are no-ops with a toast. Isolation-correct. | 2033–2039: `showToast('toolPath not in this extract')`. `aria-pressed` stays `"false"`. Not a bug in this package. |

Drag: header capture, skip `button, input`, clamp `innerWidth-44` / `-offsetWidth+44` (1689–1690). Pointer capture is try/caught. R11 `lastGcodePos` is written on drag end and on close, restored in `openGcode` — but `openGcode` is never called after boot (close has no inverse). Memory is implemented, unused in the standalone session after first close.

Resize capture on the handle is try/caught and released. Collapse uses grid rows on `.gcode-body` (`--dur: 240ms`) and does **not** set `display` on the body — good.

Snap: none (not a bed). z-index 30 on `.gcode` matches SPEC. Toast is z-index 40 (same band as the HUD card).

#### Formatting / code quality

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| FL-F1 | P1 | Wordmark **IT** is weight 800; SPEC says 700. | `.gcode-bar .surface-label .label-it { color: #FFCE1B; font-weight: 800; }` (287–290). SPEC Header: “**FLiP** white + **IT** amber · 19.8px · **weight 700**”. HTML FLiP stays 700; IT is 800. Same split as toolPath **Path**. |
| FL-F2 | P1 | Collapse motion is 240ms, not the HUD 600ms family. | `--dur: 240ms` (69). `.gcode-body` transitions `grid-template-rows var(--dur)` (777–780). |
| FL-F3 | P2 | Indentation and comment style are consistent inside the file. Banner comments match isolation. | No lying comments found in the script header. CSS `:has(.is-editing-banner)` comments are accurate. |

#### SPEC vs HTML drift

| Topic | SPEC | HTML | Verdict |
|-------|------|------|---------|
| HTML blob field | `69d0bd9a…` (composition `fb011e6b`) | standalone blob `c156815a…` | **SPEC identity is the composition tip, not this file** |
| Width 418–568 · bar 44 · radius 15.4 · frost · z 30 | yes | `--panel-w` / `--bar-h` / `--radius` / `--frost` / `z-index: 30` | match |
| Header fill ink@0.82 · 10px gap after mark · close chrome | yes | `.gcode-bar` + `.surface-label-slot { padding-left: 10px }` + `.icon-btn.close` | match |
| Wordmark weight 700 | 700 | IT 800 | **drift** |
| READY amber 1.65px `#FFCE1B` @0.85 + 2.2px glow | yes | 1027–1036 | match |
| DONE green-border + `--green-glow` 2.2px | yes | 1038–1046 | match |
| Edit ring 1px `#FFCE1B` + soft 2px @55% | yes | `:has(.is-editing-banner)::after` 145–150 | match |
| Post flash 1px green @90% · 2200ms | yes | `.is-post-flash` + `flashGreenRing` 2200ms | match |
| `edit-actions` `top: 6.6px` · `right: 18px` | yes | 921–924 | match |
| Child-spec marks (`flipit-header` … `flipit-toolpath` …) | listed | **none** in HTML (banner: “NO … child-spec”) | **SPEC leftover from composition** |
| `elementsFromPoint` | “Disabled controls hydrate via `elementsFromPoint`.” | no call | **SPEC leftover** |
| Waypoints toggle toolPath | SPEC R17 | standalone toast no-op | **SPEC describes composition** |
| Position memory `lastGcodePos` | R11 | implemented; no reopen to consume it | partial |
| Resize | not in SPEC | present | **undocumented live behavior** |
| OPEN residuals | _(none)_ | identity + composition leftovers above | SPEC over-claims clean |

#### Accessibility / semantics (light)

- Root is `<aside>` with `aria-hidden` toggled. Good landmark-ish choice. Close sets `aria-hidden="true"` while the node stays in the tree (`display: none`).
- IO tabs: `role="tablist"` / `role="tab"` / `aria-selected`. No `aria-controls` / `aria-labelledby` pairing to `#panel-source` / `#panel-output`. Output panel uses both `.is-on` and the `hidden` attribute (1823–1827).
- Most icon buttons have `type="button"` + `aria-label`. Stage chips and rot chips are labelled via visible text.
- `.tok-n` is `#D3D3D3` on a white code pane — N-codes are low contrast.

---

### 1.3 TOOLPATH-v3

Smallest card after LaserBed. Tokens → card CSS → markup (`#backplot.toolpath`) → short IIFE. Isolation wall held. Standalone boots visible; SPEC says composition R27 boots `.is-hidden`.

#### Structure

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| TP-S1 | P1 | Almost the entire shared token block is unused. | `:root` copies HUD/FLiPIT tokens. `var(--…)` usages in this file are `--font`, `--frost`, `--ink`, `--ink-30`, `--blue-22`, `--radius`, `--chip-r`, `--white`. Unused: `--font-mono`, `--frost-blue`, `--ink-50`, `--ink-22` (raw rgba used), `--ink-15`, `--ink-08`, `--white-70/55/40`, `--chip-h`, `--icon-btn`, `--ease`, `--spring`. Header buttons hardcode `28.6px` instead of `--icon-btn`. |
| TP-S2 | P2 | Hide/show is class + inline display. | `.toolpath.is-hidden { display: none !important; }` (89–91). `setToolpathOpen(true)` also sets `card.style.display = ''` (389). Redundant; the class is sufficient. |
| TP-S3 | P2 | Empty-state path is unreachable in standalone. | `hasPart` starts `true` (376). Refresh forces `true` (411). `paint()` can show “No path”, but nothing sets `hasPart = false`. |

No dead selectors beyond the unused tokens. No imports.

#### Bugs / correctness risks

No P0 correctness bugs found.

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| TP-B1 | P2 | Drag clamp family differs from HUD. | toolPath: `innerWidth-40` / `-offsetWidth+40`, top min `0` (361–362). HUD clamps to stay fully on-screen. FLiPIT uses 44. Composition re-assembly will feel three different “can I drag this off?” policies. |
| TP-B2 | — | Pointer capture on the header, skip `button`, try/catch release. | 343–373. Sound. |

Refresh restores the demo fixture (`hasPart = true` + `paint`). X → Re-open works (`#btn-reopen.is-on`). Non-modal, no resize — matches SPEC.

#### Formatting / code quality

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| TP-F1 | P1 | **Path** is weight 800; living TOOLPATH SPEC says 700. | `.label-path { color: #FFCE1B; font-weight: 800; }` (167–169). `TOOLPATH-v3.SPEC.md` Header: “weight 700”. The superseded `BACKPLOT-v3.SPEC.md` snippet (line 84) documents `font-weight: 800` — HTML agrees with BACKPLOT, not with the new living SPEC. |
| TP-F2 | P2 | Stage note / reopen are standalone-only chrome. Correct. | `.stage-reopen` z-index 6. Not a product surface. |

#### SPEC vs HTML drift

| Topic | SPEC | HTML | Verdict |
|-------|------|------|---------|
| Tip blob | `1ed50d65…` | `1ed50d65…` | match |
| min-width 268 · header 44 · radius 15.4 · frost · z 20 | yes | same | match |
| Outer ring `::after` 2px ink@0.22 · 8px offset · `0 18px 40px -12px` | yes | 105–114 | match |
| Wordmark tool/Path · 19.8px · 10px gap | yes | `.wordmark-slot { padding-left: 10px }` | match except Path **800** vs SPEC **700** |
| `tp-head-btn` idle/hover/press | yes | 171–199 | match |
| Viewfinder 200px white · 11px pad · no grid | yes | 207–222 | match |
| Standalone visible / composition hidden | yes | boots `setToolpathOpen(true)` | match |
| No resize | yes | no handles | match |

#### Accessibility / semantics (light)

- `#backplot` has `aria-label="toolPath"`. Host is a `div`, not a dialog. Appropriate.
- Refresh / Close / Re-open: `type="button"` + `aria-label` / visible text.
- Viewfinder empty copy is `uppercase` 10px `ink-30`. Fine for a demo fixture.

---

### 1.4 LASER-BED-v3

Not a card. Full-viewport SVG world + zoom chrome + blank-tied ticker. Isolation wall held: no HUD panel, no FLiPIT, no toolPath, no isolator, no child-spec. Calc chip is chrome only (no click handler) — matches SPEC.

#### Structure

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| LB-S1 | P2 | Token block is a stub; `--blue` unused, `--chip-r` unused. | `:root` has `--font`, `--font-mono`, `--ink`, `--blue`, `--chip-r` (31–36). `--blue` is never referenced. Radius is hardcoded `6.6px` on `.blank-ticker` and `.bt-calc` (70, 90) instead of `var(--chip-r)`. |
| LB-S2 | P2 | `#lb-grid-1` is a 1×1 white rect, not a 1" grid pattern. | 105–107, used as `fill="url(#lb-grid-1)"` on the 48×48 bed. Actual minor/major grid is drawn as lines in `drawMajorGrid` (214–223). Not dead — it is a white fill. The id name oversells it. |
| LB-S3 | P2 | No `releasePointerCapture` on up. | `onPointerDown` captures on `e.target` (281). `onPointerUp` only clears `state.dragging` and body classes (296–298). Window-level `pointermove`/`pointerup` (302–304) still deliver events, so this is resilient — just a different pattern than the three cards. |

CSS is short and grouped (stage → chrome → ticker). JS is one IIFE with camera / blank / rulers / ticker pin.

#### Bugs / correctness risks

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| LB-B1 | P0 | **Fit (Scan) resets the blank to 12×8.** SPEC only says zoom 1 + center 48×48. | SPEC Interaction: “**Fit** — Scan button · zoom 1 · center 48×48”. HTML `#lb-fit` handler (319): `state.blankW = 12; state.blankH = 8; fitBed(); render();`. A user who resized the blank and hit Fit loses the blank size. `fitBed` itself (265–272) only resets zoom/pan — the blank wipe is extra. |
| LB-B2 | P1 | Window `resize` recenters the camera (`fitBed()`), wiping pan. | Line 320: `window.addEventListener('resize', function () { fitBed(); render(); });`. SPEC does not mention this. DevTools dock / split-screen will yank the view back to fitted 48×48. Blank size is preserved (unlike Fit). |
| LB-B3 | P2 | Zoom button lookups are unguarded. | `document.getElementById('lb-zoom-in').onclick = …` (317–319). Elements exist in this file; a composition extract that omits chrome would throw. |

Other interaction matches SPEC:

- Snap `0.125` (149, 170).
- Wheel toward cursor, clamp 0.35–12, factor 1.1 (305–315) — SPEC “Wheel zoom — toward cursor · zoom clamp 0.35–12”.
- Zoom ± is 1.25× (317–318) — SPEC “Zoom ± — 1.25× steps”.
- Y resize uses `- dy / s` so dragging up grows height in flipped-Y world (289).
- Ticker pin: `left = screenRight - tw - 20`, `top = screenTop - 34 - 10` (247–259) matches SPEC pin math.
- Ticker `z-index: 22`, height 34, ink@0.82, amber `#FFCE1B`, calc icon white.
- One free-corner indicator. Hits: right / top / corner only.

`display` on the ticker: default `display: none`, `.is-on` → `inline-flex` (65, 84). JS always adds `is-on` on first `positionBlankTicker`. Not a collapse-grid hazard.

#### Formatting / code quality

Compact, consistent `var` style. Magic numbers that are also in the SPEC (48, 12, 8, 0.125, 36 pad, 34 / 20 / 10 ticker) live as locals (`BED`, `PAD`, `TICKER_H`, `GAP_TOP`, `GAP_RIGHT`) — good. Hit geometry `0.28` / `0.7` / `1.1` is duplicated in markup attributes and `layoutBlank` — fine for a lock file.

#### SPEC vs HTML drift

| Topic | SPEC | HTML | Verdict |
|-------|------|------|---------|
| Tip blob | `0f193a4a…` | `0f193a4a…` | match |
| 48×48 · pad 36 · blank 12×8 · snap 0.125 | yes | same | match |
| Origin BL · camera `scale(s, −s)` | yes | `applyCamera` 184–186 | match |
| Grid 10% / 30% · labels 12→6→3→1 · min 36px | yes | `labelStep` / `drawMajorGrid` | match |
| Chrome 28×28 · 12px inset · depressed press | yes | `.lb-chrome` 44–52 | match |
| Ticker 34 / pin 20+10 / ink@0.82 / amber / z 22 | yes | 59–83, 244–259 | match |
| Calc icon white | yes | `.bt-calc { color: #ffffff }` + hover keeps white | match |
| Fit = zoom 1 + center 48×48 | yes | Fit **also** resets blank 12×8 | **drift + data-loss risk** |
| Drag none on ticker | yes | no ticker drag code | match |

#### Accessibility / semantics (light)

- Zoom buttons: `type="button"` + `title`, no `aria-label`.
- Ticker: `aria-label="Blank size"`. Calc chip: `aria-label="Calculator"` (chrome only).
- SVG world is pointer-first; no keyboard pan/resize. Expected for this surface.

---

## 2. Cross-component alignment audit

### 2.1 Shared tokens that already match

These values are the same wherever the surface uses them:

| Token | Value | HUD | FLiPIT | toolPath | LaserBed |
|-------|-------|-----|--------|----------|----------|
| `--frost` | `#D8D6E2` | yes | yes | yes | n/a (not a frost card) |
| `--ink` | `#1A1428` | yes | yes | yes | yes |
| `--blue` | `#538BEC` | yes | yes | yes | defined, unused |
| `--radius` | `15.4px` | yes | yes | yes | n/a |
| `--chip-r` | `6.6px` | yes | yes | yes | defined; ticker hardcodes `6.6px` |
| Header height | `44px` | `.keypad-header` | `--bar-h` | `.toolpath-head` | n/a |
| Header / popover / ticker fill | `rgba(26, 20, 40, 0.82)` | header + popover | header | header | blank ticker |
| Amber | `#FFCE1B` | footer + popover | IT + READY + toast | Path | ticker readout |
| Mono readout | `--font-mono` · 12.1px · weight 650 · `tabular-nums` | tickers | `.part-ticker .readout` | n/a (no readout) | `.blank-ticker` |
| `--font` | SF Pro Text stack | yes | yes | yes | yes |
| Outer ring (cards) | `::after` 2px ink@0.22 · 8px offset · `0 18px 40px -12px` | yes | yes | yes | n/a |
| Hairline | `1.1px` | yes | yes | yes | ticker border |
| Standalone stage grid | 26.4px on `#F4F4F6` | yes | yes | yes | n/a (white viewport) |

### 2.2 Divergences that would hurt composition re-assembly

| Area | HUD | FLiPIT | toolPath | LaserBed | Why it hurts |
|------|-----|--------|----------|----------|--------------|
| z-index | card **40**, popover **50**, note 5 | card **30**, toast **40**, note 5, resize 5 | card **20**, note 5, reopen 6 | stage **0**, chrome **15**, ticker **22** | Scale is coherent *except* FLiPIT toast (40) sits in the HUD card band. A toast over a dragged HUD will fight. |
| Collapse motion | **600ms** grid rows | **240ms** (`--dur`) grid rows | instant `.is-hidden` | n/a | Re-assembled shell will not feel like one system. |
| Hide primitive | class `collapsed` + grid 0fr (must not set `display` on `#hud-body`) | inline `display: none` + unused `is-open` | class `is-hidden` (`display: none !important`) + leftover `style.display` | ticker `display: none` ↔ `inline-flex` | Three hide languages. A host that toggles the wrong one will leave a surface stuck visible or stuck gone. |
| Drag clamp | stay fully on-screen (`max(0, … offsetWidth)`) | 44px peek | 40px peek | world pan, no card clamp | Cards can be parked in three different legal regions. |
| Position memory | **hold** left/top (no restore map) | R11 `lastGcodePos` (close/reopen) | none (wherever you left it, until hide) | camera pan in `state` | Host must not apply one memory policy to all four. |
| Wordmark | none on header; footer FLiP/IT at 11px | FLiP 700 + **IT 800**, 19.8px, −0.02em | tool 700 + **Path 800**, 19.8px, −0.02em | none | Living SPECs say 700 for the whole mark. HTML is internally consistent (800 on the amber half) and disagrees with TOOLPATH/FLIPIT SPECs. |
| Header chrome | transparent 28.6 tool buttons, white@0.22 border | left **filled** chip white@0.12 + close as transparent tool | filled waypoints chip + `tp-head-btn` transparent | 28×28 white square, 4px radius, `#a2a2a2` border — different family | Cards share a family; LaserBed chrome is a different language (intentional). |
| JS dialect | `const` | `var` | `var` | `var` | Shared helpers will not paste cleanly into HUD without a style choice. |
| Pointer capture | header element | header / resize handle | header | `e.target` (hit or svg) + window listeners | Two primitives. A shared drag helper cannot replace LaserBed’s camera drag. |

### 2.3 Isolation walls that must stay

Each file’s banner is explicit and currently true:

- **No cross-imports.** No `<link>`, no `<script src>`, no module, no shared CSS file.
- **No child-spec / isolator / composition host** in these four tips.
- **FLiPIT waypoints do not open toolPath** here. Bridge is composition-only.
- **HUD footer AUTO-SIZE / FLiPIT are no-ops.**
- **LaserBed calc chip is chrome only.**
- **toolPath has no FLiPIT parent.** `#backplot` id is reserved for composition, but this file does not call out.
- **LaserBed is not frost chrome.** Do not put `--frost` / 44px header on the bed.

A plugin that required `src=` / `@import` would break the lock contract (“each file standalone”). Any alignment layer has to be **copy-paste or documentation**, not a runtime dependency.

---

## 3. Alignment-plugin feasibility (opinion only — no implementation)

### 3.1 One-liner

**Yes — a shared alignment layer is feasible without rewriting the four tips, but only as a copy-paste contract (CSS custom-property block + tiny pure JS helpers + a written z-index scale). A runtime import / package would violate the isolation walls.**

### 3.2 What it could own

| Own in the plugin (safe) | Why |
|--------------------------|-----|
| Canonical `:root` custom-property block | frost, ink scale, blue scale, radius, chip-r, chip-h, icon-btn, fonts, amber `--amber: #FFCE1B`, popover `--ink-82: rgba(26,20,40,0.82)`, hairline 1.1, motion names |
| Written z-index scale | 0 bed · 15 bed-chrome · 20 toolPath · 22 blank-ticker · 30 FLiPIT · 40 HUD · 50 HUD popover · 5/6 standalone stage chrome. Call out: FLiPIT toast must **not** stay at 40 |
| `fmt3` / `snap(value, step)` | HUD and LaserBed both format/snap; trivial and pure |
| Card drag helper | `pointerdown` on a handle, skip `button, input`, `setPointerCapture`, clamp, write `left/top`. Parameterize clamp policy (full-on-screen vs peek) |
| Position-hold vs restore | two documented modes: HUD hold; FLiPIT `lastPos` map. Do not merge them |

### 3.3 What must stay per-component

- HUD popover DOM, dirty/save/cancel, `positionOutsideHUD` (and its missing bottom/top — fix in the HUD file, not a plugin)
- HUD calculator and `#hud-body` grid-collapse (the “never set display” rule)
- FLiPIT state machine (source/output, edit lock, stage chips, highlighter, history, toast)
- FLiPIT resize handles (or delete them in a later residual — not a plugin)
- toolPath viewfinder fixture / `#backplot` id
- LaserBed camera (`scale(s,−s)`), rulers, blank hits, ticker pin math
- Any composition bridge (waypoints ↔ toolPath, HUD ↔ ticker, isolator, child-spec)

### 3.4 Recommended shape if yes

1. **A markdown contract** (this audit’s tables, or a later `ALIGNMENT-v3.SPEC.md`) — source of truth for numbers.
2. **A commented CSS snippet** to paste into each file’s `:root` (not `@import`).
3. **Optional 40–80 line JS snippet** (`dragCard`, `fmt3`, `snap`) pasted into each card IIFE. No `export`. No `window.HowManyV3`.
4. **Do not** add a `howmany-v3-align.js` that the four HTML files load.

### 3.5 Explicitly do **not** put in a plugin

- DOM ids, markup, Lucide paths
- `display` show/hide
- Child-spec / `elementsFromPoint` / isolator
- G-code highlighter / history
- Bed camera / world Y flip / ticker pin
- Popover placement
- Product math (nesting, AutoNest, real path geometry)
- Wordmark strings or the HowMany header wordmark (out of scope; locked elsewhere)

### 3.6 Effort / risk sketch

| Slice | Effort | Risk |
|-------|--------|------|
| Document the token + z-index contract | hours | low — docs only |
| Paste-sync `:root` into the four files (later residual) | half day + visual check | medium — easy to shift a locked pixel |
| Extract `dragCard` / `fmt3` / `snap` as comments | half day | low if still inlined |
| Runtime shared file / build step | not recommended | **high** — breaks standalone lock, invites composition rewrites |
| “Fix P0s via the plugin” | wrong vehicle | P0s are per-file logic, not shared tokens |

Feasibility does **not** require rewriting the four tips. The P0s below should be later per-file residuals, not a plugin.

---

## 4. Ranked suggestions (do not apply in this pass)

### P0 — real bugs or correctness risks

| # | Surface | Suggestion |
|---|---------|------------|
| 1 | NUMERIC-HUD | Stop writing `hudBody.style.display` in `lockBodyHeight`. Measure `#hud-mode` / `.classic-calc` without changing `#hud-body`’s `display: grid`. Honor the SPEC sentence that already names this failure mode. |
| 2 | NUMERIC-HUD | Finish `positionOutsideHUD` as right → left → bottom → top (SPEC). Today a short window puts the 286×~140 popover off-screen. |
| 3 | NUMERIC-HUD | Sync `[data-blank-link]` / `[data-gap-link]` `.active` + `aria-pressed` in both `openParamPopover` and the close-X restore path (blank is missing restore; both are missing open). |
| 4 | LaserBed | Fit (Scan) should only `fitBed()` (zoom 1 + center 48×48). Move the `blankW/H = 12/8` reset out of `#lb-fit`, or document it in the SPEC if it is deliberate. As written it is silent data loss. |

### P1 — formatting / consistency that will hurt composition re-assembly

| # | Surface | Suggestion |
|---|---------|------------|
| 5 | FLIPIT SPEC | Retarget the living SPEC **HTML blob** to standalone `c156815a…` (and the individual tip commit `37d628e9…`). Keep composition `fb011e6b` / `69d0bd9a` as *authority source*, not as this file’s identity. |
| 6 | FLIPIT SPEC | Mark child-spec names, `elementsFromPoint`, and “waypoints toggle toolPath” as **composition-only**. The standalone file correctly has none of them. |
| 7 | FLIPIT + toolPath SPECs | Pick one wordmark weight: HTML amber half is **800** (and `BACKPLOT-v3.SPEC.md` snippet already says 800). Living TOOLPATH/FLIPIT SPECs say 700. Align SPEC → HTML (do not restyle the lock). |
| 8 | All cards | Publish the z-index scale in §2.1/§3. Drop FLiPIT toast from 40 (HUD band) to something like 35, *in a later residual*. |
| 9 | HUD vs FLiPIT | Decide whether collapse is 600ms or 240ms before re-assembly. Do not ship both in one host. |
| 10 | HUD / FLiPIT / toolPath | One drag-clamp policy (full-on-screen vs peek-px). Parameterize later; do not leave 0 / 40 / 44. |
| 11 | FLiPIT | Either add a standalone Re-open (parity with toolPath) or stop using `display: none` as the only hide, so `is-open` means something a host can toggle. |
| 12 | FLiPIT | Document resize (418–568 × shell 110–308) in the living SPEC, or record it as out-of-scope leftover. Silent live behavior will surprise re-assembly. |
| 13 | HUD / toolPath | Either use `--chip-h` / `--icon-btn` / `--amber` or delete the unused copies so a paste-sync of `:root` is a no-op. |
| 14 | LaserBed | Do not call `fitBed()` on every `window.resize` unless the SPEC says the camera is not user-persistent. |
| 15 | HUD | Drop the `mouseup` + `selectAll` trap, or limit it to `focus`. Mid-field edits are blocked. |

### P2 — nice-to-haves

| # | Surface | Suggestion |
|---|---------|------------|
| 16 | HUD | Fix `#btn-auto-size` title. Remove `show-hover` and `state.units`. Deduplicate popover focus wiring. |
| 17 | HUD | `role="dialog"` → `role="region"` (or drop the role). Add Enter/Space on tickers. |
| 18 | FLiPIT | Remove write-only `has-value` / `is-source-tab` / `posted`. Implement Cmd/Ctrl+Z or drop it from titles. Wire `aria-controls` on tabs. Raise `.tok-n` contrast. |
| 19 | FLiPIT | `.surface-editing-banner` is `display: none !important` — either show “EDITING” or delete the node. |
| 20 | toolPath | Delete unused `:root` keys. Remove redundant `card.style.display = ''`. |
| 21 | LaserBed | `var(--chip-r)` on the ticker; drop unused `--blue`. Add `aria-label` on zoom buttons. Release pointer capture on up for parity. |
| 22 | All | Tokenize `#FFCE1B` as `--amber` when a paste-sync happens — not before, and not as a visual change. |

---

## 5. Severity counts (this pass)

| Severity | Count | Meaning |
|----------|------:|---------|
| P0 | 4 | Real correctness risks (HUD display / popover / link-state; LaserBed Fit blank reset) |
| P1 | 11 | Re-assembly or SPEC-identity issues (rows 5–15) |
| P2 | 7 | Hygiene / a11y / dead code (rows 16–22) |

No P0 found on toolPath. FLiPIT’s worst live issue in standalone is close-without-reopen (P1), not a math/snap bug. Isolation walls on all four files are intact.

---

## 6. Alignment-plugin feasibility (repeat for scanners)

**Feasible as a copy-paste token + z-index + tiny helper contract. Not feasible as a runtime shared file without breaking the standalone lock. P0s are per-file and should not wait on a plugin.**

---

## 7. Out of scope / not done

- No edits to the four HTML files or their living `*.SPEC.md`.
- No browser/visual pass (read-only code/SPEC audit).
- No product GOAL.md, no merge to `main`, no PR.
- Composition host (`COMPOSITION-HUD-DECODER-v3.html`) and `DE-CODER-v3-LOCKED.html` were not in scope except as SPEC identity references.
- HowMany product header wordmark / `docs/ui-shell` not touched.

---

*End of audit.*
