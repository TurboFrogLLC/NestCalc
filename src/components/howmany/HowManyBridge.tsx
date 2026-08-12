"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AuthControls } from "@/components/AuthControls";
import { AutoNestPreview } from "@/components/AutoNestPreview";
import { NestGrid } from "@/components/NestGrid";
import { useNestAppState } from "@/hooks/useNestInputs";
import { usePresets } from "@/hooks/usePresets";
import { effectiveAutoNestMargins } from "@/lib/autoNestEngine";
import {
  analyzeGCode,
  generateRotatedGCode,
  partSizeFromBounds,
  type GCodeDiagnostic,
} from "@/lib/gcodeRotation";
import {
  derivePresetCarousel,
  displayGCodeSize,
  fieldBindingForId,
  formatShellNumber,
  generationIsFresh,
  insertShellDecimal,
  marginsBadgeText,
  normalizeShellDialogName,
  quickValueDraft,
  sanitizeShellNumericDraft,
  shouldPreserveNumericDraft,
} from "@/lib/howmany/bridge";
import {
  applyPartSizeToNestSession,
  clearManualInputs,
  createNestSession,
  rotateManualPart,
  rotateManualRemnant,
  swapManualGap,
  swapManualPart,
  toggleManualGapLink,
  toggleManualPartLink,
  toggleNestSessionUnit,
  updateManualField,
  updateNestSessionMargin,
} from "@/lib/nestSession";
import { parseNumericInput } from "@/lib/numericInput";
import type {
  AutoNestTwoGroupResult,
  NestAppState,
  NestInputs,
  NestResult,
  Unit,
} from "@/lib/types";
import { unitLabel } from "@/lib/units";

interface HowManyBridgeProps {
  shellDocument: Document;
}

interface FreshGeneration {
  source: string;
  angle: number;
  output: string;
  size: { width: number; height: number };
}

type ManualUpdater = (inputs: NestInputs) => NestInputs;

interface AuthorityAutoNestCardProps {
  twoGroup: AutoNestTwoGroupResult;
  remnantWidth: number | null;
  remnantHeight: number | null;
  unit: string;
}

interface ShellDialogOptions {
  title: "Save preset" | "Edit quick value" | "Rename preset";
  label: "Name" | "Value";
  value: string;
  numeric?: boolean;
  allowDelete?: boolean;
  onConfirm: (value: string) => void;
  onDelete?: () => void;
}

const LUCIDE_X = `
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
  </svg>`;

const LUCIDE_CHECK = `
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 6 9 17l-5-5"></path>
  </svg>`;

const LUCIDE_TRASH = `
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>`;

function AuthorityAutoNestCard({
  twoGroup,
  remnantWidth,
  remnantHeight,
  unit,
}: AuthorityAutoNestCardProps) {
  const zeroCount =
    twoGroup.blanks.find(({ group }) => group.orientation === "0deg")?.group
      .count ?? 0;
  const ninetyCount =
    twoGroup.blanks.find(({ group }) => group.orientation === "90deg")?.group
      .count ?? 0;
  const trimOrientation =
    twoGroup.trimLine.orientation === "vertical" ? "Vertical" : "Horizontal";

  return (
    <div className="howmany-autonest-card" data-howmany-autonest-card="true">
      <div className="howmany-autonest-header">
        <span className="title">AutoNest result</span>
        <span className="count">
          Total <strong>{twoGroup.totalParts}</strong>
        </span>
      </div>
      <div className="howmany-autonest-body">
        <AutoNestPreview
          twoGroup={twoGroup}
          remnantWidth={remnantWidth}
          remnantHeight={remnantHeight}
          unitLabel={unit}
          className="howmany-autonest-preview"
        />
        <div className="howmany-autonest-meta">
          <div className="meta-col orient">
            <span className="meta-k">Orientation</span>
            <span className="meta-line">
              <span className="deg0">0°</span> · {zeroCount}{" "}
              <span className="muted">parts</span>
            </span>
            <span className="meta-line">
              <span className="deg90">90°</span> · {ninetyCount}{" "}
              <span className="muted">parts</span>
            </span>
          </div>
          <div className="meta-sep" aria-hidden="true" />
          <div className="meta-col trim">
            <span className="meta-k">Trim / offset approx</span>
            <span className="meta-line">
              {trimOrientation} @ {formatShellNumber(twoGroup.trimLine.position)}{" "}
              {unit}
            </span>
            <span className="meta-line">
              X {formatShellNumber(twoGroup.suggestedOriginOffset.x)} · Y{" "}
              {formatShellNumber(twoGroup.suggestedOriginOffset.y)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function openShellDialog(
  shellDocument: Document,
  options: ShellDialogOptions,
): () => void {
  shellDocument.querySelector("[data-howmany-dialog-stage]")?.remove();
  const stage = shellDocument.createElement("div");
  stage.className = "howmany-dialog-stage";
  stage.dataset.howmanyDialogStage = "true";
  const titleId = `howmany-dialog-${options.title.replaceAll(" ", "-")}`;
  stage.innerHTML = `
    <div class="howmany-dialog-card" role="dialog" aria-modal="true" aria-labelledby="${titleId}">
      <div class="dialog-header"><h3 id="${titleId}">${options.title}</h3></div>
      <div class="dialog-body">
        <label for="${titleId}-input">${options.label}</label>
        <input id="${titleId}-input" class="dialog-input" type="text"${options.numeric ? ' inputmode="decimal"' : ' maxlength="24"'} />
      </div>
      <div class="dialog-actions">
        ${
          options.allowDelete
            ? `<button type="button" class="dlg-icon-btn danger" data-dialog-action="delete" title="Delete" aria-label="Delete">${LUCIDE_TRASH}</button>`
            : `<button type="button" class="dlg-icon-btn cancel" data-dialog-action="cancel" title="Cancel" aria-label="Cancel">${LUCIDE_X}</button>`
        }
        <div class="spacer"></div>
        ${
          options.allowDelete
            ? `<button type="button" class="dlg-icon-btn cancel" data-dialog-action="cancel" title="Cancel" aria-label="Cancel">${LUCIDE_X}</button>`
            : ""
        }
        <button type="button" class="dlg-icon-btn ok" data-dialog-action="confirm" title="OK" aria-label="OK">${LUCIDE_CHECK}</button>
      </div>
    </div>`;
  shellDocument.body.append(stage);

  const input = stage.querySelector<HTMLInputElement>(".dialog-input");
  if (!input) {
    stage.remove();
    return () => undefined;
  }
  input.value = options.value;

  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    stage.remove();
    shellDocument.removeEventListener("keydown", handleKeyDown, true);
  };
  const confirm = () => {
    options.onConfirm(input.value);
    close();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      confirm();
    }
  };

  if (options.numeric) {
    input.addEventListener("input", () => {
      const sanitized = sanitizeShellNumericDraft(input.value);
      if (sanitized !== input.value) input.value = sanitized;
    });
  }
  stage.addEventListener("click", (event) => {
    const action = (event.target as Element).closest<HTMLElement>(
      "[data-dialog-action]",
    )?.dataset.dialogAction;
    if (action === "cancel") close();
    if (action === "confirm") confirm();
    if (action === "delete") {
      options.onDelete?.();
      close();
    }
  });
  shellDocument.addEventListener("keydown", handleKeyDown, true);
  queueMicrotask(() => {
    input.focus();
    input.select();
  });
  return close;
}

function select<T extends Element>(document: Document, selector: string) {
  return document.querySelector<T>(selector);
}

function syncSegment(
  document: Document,
  trackId: string,
  activeId: string,
  accent: string,
  attribute: string,
  value: string,
) {
  const track = document.getElementById(trackId);
  const active = document.getElementById(activeId);
  if (!track || !active) return;
  track.setAttribute(attribute, value);
  track.querySelectorAll("button").forEach((button) =>
    button.setAttribute("aria-pressed", button === active ? "true" : "false"),
  );
  const thumb = track.querySelector<HTMLElement>(".seg-switch__thumb");
  if (thumb) {
    thumb.style.background = accent;
    thumb.style.width = `${active.getBoundingClientRect().width}px`;
    thumb.style.transform = `translateX(${Math.max(0, (active as HTMLElement).offsetLeft - 2)}px)`;
  }
}

function diagnosticsText(diagnostics: GCodeDiagnostic[]) {
  return diagnostics.map(({ line, reason }) => `Line ${line}: ${reason}`).join("\n");
}

function setText(element: Element | null, value: string | number) {
  if (element) element.textContent = `${value}`;
}

function exposeCalculatorUnit(document: Document, unit: Unit) {
  const shellWindow = document.defaultView as
    | (Window & { calcUnitMode?: Unit })
    | null;
  if (shellWindow) shellWindow.calcUnitMode = unit;
}

function placeAuthorityNumpad(document: Document) {
  const shellWindow = document.defaultView;
  const numpad = document.getElementById("numpad");
  if (!shellWindow || !numpad || numpad.classList.contains("hidden-pad")) return;
  const rect = numpad.getBoundingClientRect();
  const maxX = Math.max(0, shellWindow.innerWidth - 288);
  const maxY = Math.max(0, shellWindow.innerHeight - rect.height);
  numpad.style.left = `${Math.min(maxX, Math.max(0, rect.left))}px`;
  numpad.style.top = `${Math.min(maxY, Math.max(0, rect.top))}px`;
  numpad.style.right = "auto";
  numpad.style.bottom = "auto";
}

function previewResult(state: NestAppState, manual: NestResult) {
  if (state.mode === "manual") return manual;
  const auto = createNestSession(state).result;
  if (auto.mode !== "autonest" || auto.autoNest.status === "computed") return manual;
  return auto.autoNest.status === "fallback"
    ? auto.autoNest.fallback
    : auto.autoNest.bestUniform;
}

export function HowManyBridge({ shellDocument }: HowManyBridgeProps) {
  const { state, setState } = useNestAppState();
  const presets = usePresets(state, setState);
  const session = useMemo(() => createNestSession(state), [state]);
  const [stageTarget, setStageTarget] = useState<HTMLElement | null>(null);
  const [authTarget, setAuthTarget] = useState<HTMLElement | null>(null);
  const [source, setSource] = useState("");
  const [angle, setAngle] = useState(0);
  const [programUnit, setProgramUnit] = useState<Unit>("in");
  const [partUnit, setPartUnit] = useState<Unit>("in");
  const [generation, setGeneration] = useState<FreshGeneration | null>(null);
  const fieldDraftsRef = useRef(new Map<string, string>());
  const typingFreshFieldRef = useRef<string | null>(null);
  const presetPageRef = useRef(0);
  const syncPresetCarouselRef = useRef<(() => void) | null>(null);
  const activeNumericFieldRef = useRef<HTMLInputElement | null>(null);
  const selectedQuickValueRef = useRef<string | null>(null);
  const activeDialogCleanupRef = useRef<(() => void) | null>(null);

  const fresh = generationIsFresh(generation, source, angle);
  const displayedSize =
    generation && fresh
      ? displayGCodeSize(generation.size, programUnit, partUnit)
      : null;

  const updateInputs = useCallback(
    (updater: ManualUpdater) => {
      setState((current) => ({
        ...current,
        manualInputs: updater(current.manualInputs),
      }));
    },
    [setState],
  );

  useEffect(() => {
    const calcView = shellDocument.getElementById("calc-view");
    const stub = select<HTMLElement>(shellDocument, '[title="Clerk (stub)"]');
    if (!calcView || !stub?.parentElement) return;

    Array.from(calcView.children).forEach((child) => {
      (child as HTMLElement).style.display = "none";
    });
    const stage = shellDocument.createElement("div");
    stage.dataset.howmanyBridge = "stage";
    stage.style.cssText =
      "display:flex;align-items:center;justify-content:center;width:min(56vw,560px);height:min(66vh,520px);min-width:0;min-height:0;--card:rgba(11,8,20,.72);--foreground:#fff;--card-border:rgba(83,139,236,.35);--preview-bg:rgba(11,8,20,.5);--rem-fill:transparent;--rem-stroke:#fff;--margin-fill:rgba(83,139,236,.08);--usable-stroke:rgba(83,139,236,.5);--part-fill:rgba(83,139,236,.2);--part-stroke:#538bec;--origin-stroke:#c8cdd8;--muted:#c8cdd8;--autonest-zero-fill:rgba(83,139,236,.28);--autonest-zero-stroke:#538BEC;--autonest-ninety-fill:rgba(238,140,60,.32);--autonest-ninety-stroke:#EE8C3C;--autonest-blank-stroke:rgba(255,255,255,.28);--autonest-trim-stroke:#EE8C3C;";
    calcView.append(stage);

    const stageStyle = shellDocument.createElement("style");
    stageStyle.dataset.howmanyBridge = "stage-style";
    stageStyle.textContent = `
      [data-howmany-bridge="stage"] .howmany-autonest-card {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        border-radius: 16px;
        background: #0E0C14;
        box-shadow: 0 0 0 1px rgba(255,255,255,.1), 0 0 0 1px rgba(83,139,236,.18), 0 12px 32px -14px rgba(0,0,0,.75);
      }
      [data-howmany-bridge="stage"] .howmany-autonest-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-bottom: 1px solid rgba(255,255,255,.06);
        background: rgba(11,8,20,.55);
      }
      [data-howmany-bridge="stage"] .howmany-autonest-header .title {
        color: #C8CDD8;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-header .count {
        color: #fff;
        font-size: 12px;
        font-weight: 650;
        font-variant-numeric: tabular-nums;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-header .count strong {
        margin-left: 4px;
        font-size: 15px;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-body {
        position: relative;
        display: flex;
        flex: 1;
        min-height: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px 20px 14px;
        background: linear-gradient(160deg,rgba(11,8,20,.92),rgba(34,26,50,.35));
      }
      [data-howmany-bridge="stage"] .howmany-autonest-preview {
        width: min(78%,440px) !important;
        min-height: 0;
        flex: 1;
        border: 0 !important;
        border-radius: 6px;
        background: rgba(11,8,20,.45) !important;
      }
      [data-howmany-bridge="stage"] .autonest-preview-group-zero {
        fill: var(--autonest-zero-fill);
        stroke: var(--autonest-zero-stroke);
      }
      [data-howmany-bridge="stage"] .autonest-preview-group-ninety {
        fill: var(--autonest-ninety-fill);
        stroke: var(--autonest-ninety-stroke);
      }
      [data-howmany-bridge="stage"] .autonest-preview-trim-line {
        fill: none;
        stroke: var(--autonest-trim-stroke);
        stroke-linecap: butt;
        stroke-width: 1.5pt;
      }
      [data-howmany-bridge="stage"] .autonest-preview-group-bounds {
        fill: none;
        stroke: var(--autonest-blank-stroke);
      }
      [data-howmany-bridge="stage"] .autonest-preview-summary {
        display: none;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-preview svg text:last-child {
        display: none;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-meta {
        display: flex;
        width: fit-content;
        max-width: 100%;
        align-items: stretch;
        gap: 0;
        margin-top: 34px;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.14);
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(83,139,236,.12);
      }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .meta-col {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px 14px;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .orient { background: rgba(22,18,31,.92); }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .trim { background: rgba(245,243,255,.94); }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .meta-sep { width: 1px; background: rgba(255,255,255,.16); }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .meta-k {
        color: #C8CDD8;
        font-size: 9px;
        font-weight: 650;
        letter-spacing: .07em;
        text-transform: uppercase;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .trim .meta-k { color: #5B5670; }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .meta-line {
        color: #fff;
        font-size: 13px;
        font-weight: 550;
        font-variant-numeric: tabular-nums;
        line-height: 1.25;
      }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .trim .meta-line { color: #1A1428; }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .muted { color: #C8CDD8; font-weight: 500; }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .deg0 { color: #538BEC; }
      [data-howmany-bridge="stage"] .howmany-autonest-meta .deg90 { color: #EE8C3C; }

      #calc-footer.howmany-footer-strip {
        display: flex;
        align-items: center;
        gap: 22px;
        padding: 10px 16px;
        border-top: 1px solid rgba(255,255,255,.06);
        background: rgba(11,8,20,.45);
      }
      #calc-footer .howmany-footer-item > div:first-child {
        color: #C8CDD8;
        font-size: 9px;
        font-weight: 650;
        letter-spacing: .08em;
      }
      #calc-footer .howmany-footer-item .tabular-nums { font-size: 18px; font-weight: 650; line-height: 1.15; }
      #calc-footer .howmany-footer-item[data-footer-kind="manual"] .tabular-nums { color: #C8CDD8 !important; font-size: 16px; font-weight: 550; }
      #calc-footer .howmany-footer-item[data-footer-kind="auto"] .tabular-nums { color: #538BEC !important; }
      #calc-footer [data-footer-kind="auto"][hidden] { display: none !important; }
      #calc-footer .howmany-mode-badge {
        margin-left: auto;
        padding: 4px 8px;
        border: 1px solid rgba(83,139,236,.35);
        border-radius: 6px;
        background: #1E1A2A;
        color: #C8CDD8;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      #calc-footer .howmany-mode-badge.on-auto { color: #fff; background: rgba(83,139,236,.35); border-color: rgba(83,139,236,.55); }

      [data-gsection="source"] > .section-header-gcode {
        min-height: 36px;
        height: 36px;
        gap: 6px;
        padding: 0 10px 0 12px !important;
        background: #D97830;
      }
      .howmany-source-icon {
        display: inline-flex;
        width: 26px;
        height: 26px;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 1px solid rgba(255,255,255,.25);
        border-radius: 6px;
        background: rgba(0,0,0,.18);
        color: #fff;
      }
      .howmany-source-icon:hover { background: rgba(0,0,0,.32); border-color: rgba(255,255,255,.4); }
      #source-body, #source-body.is-opening {
        transform: none !important;
        transform-origin: top right;
        animation: none !important;
      }

      .howmany-dialog-stage {
        position: fixed;
        inset: 0;
        z-index: 80;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px 16px;
        background: rgba(0,0,0,.45);
      }
      .howmany-dialog-card {
        width: 168px;
        overflow: hidden;
        border-radius: 12px;
        background: rgba(245,243,255,.94);
        color: #1A1428;
        box-shadow: 0 0 0 1px rgba(255,255,255,.55), 0 0 0 1px rgba(83,139,236,.28), 0 18px 40px -12px rgba(0,0,0,.85);
      }
      .howmany-dialog-card .dialog-header { padding: 10px 10px 0; }
      .howmany-dialog-card .dialog-header h3 { margin: 0; color: #1A1428; font-size: 12px; font-weight: 650; letter-spacing: -.01em; }
      .howmany-dialog-card .dialog-body { padding: 8px 10px 2px; }
      .howmany-dialog-card .dialog-body label { display: block; margin-bottom: 4px; color: #5B5670; font-size: 9px; font-weight: 650; letter-spacing: .06em; text-transform: uppercase; }
      .howmany-dialog-card .dialog-input {
        width: 100%;
        height: 28px;
        padding: 0 8px;
        border: 1px solid rgba(30,26,42,.18);
        border-radius: 7px;
        background: #1E1A2A;
        color: #fff;
        font-size: 12px;
        font-variant-numeric: tabular-nums;
      }
      .howmany-dialog-card .dialog-input:focus { outline: none; border-color: rgba(83,139,236,.65); box-shadow: 0 0 0 2px rgba(83,139,236,.35); }
      .howmany-dialog-card .dialog-actions { display: flex; align-items: center; gap: 6px; padding: 8px 10px 10px; }
      .howmany-dialog-card .spacer { flex: 1; }
      .howmany-dialog-card .dlg-icon-btn { display: inline-flex; width: 28px; height: 28px; flex-shrink: 0; align-items: center; justify-content: center; padding: 0; border: 1px solid transparent; border-radius: 7px; cursor: pointer; transition: background .15s, border-color .15s, color .15s; }
      .howmany-dialog-card .dlg-icon-btn.cancel { border-color: rgba(30,26,42,.18); background: transparent; color: #7A748C; }
      .howmany-dialog-card .dlg-icon-btn.cancel:hover { border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.1); color: #DC2626; }
      .howmany-dialog-card .dlg-icon-btn.ok { border-color: rgba(83,139,236,.85); background: #538BEC; color: #fff; }
      .howmany-dialog-card .dlg-icon-btn.ok:hover { filter: brightness(1.08); }
      .howmany-dialog-card .dlg-icon-btn.danger { border-color: rgba(239,68,68,.4); background: rgba(239,68,68,.12); color: #DC2626; }
      .howmany-dialog-card .dlg-icon-btn.danger:hover { background: rgba(239,68,68,.22); color: #B91C1C; }

      #numpad {
        --key-h: 44px;
        --key-gap: 6px;
        --op-w: 52px;
        width: 230px !important;
        padding: 12px;
        border: 0;
        border-radius: 16px;
        background: #D8D6E2 !important;
        color: #1A1428;
        box-shadow: 0 0 0 1px rgba(255,255,255,.55), 0 0 0 1px rgba(83,139,236,.22), 0 14px 32px -10px rgba(0,0,0,.75);
        transition: opacity .17s ease, transform .3s var(--spring), width .45s var(--smooth);
      }
      #numpad.numpad--calc { width: 288px !important; }
      #numpad.hidden-pad, #numpad.hidden-pad * { pointer-events: none !important; }
      #numpad .press { transition: transform .15s var(--spring), background .12s, border-color .12s, color .12s, filter .12s, box-shadow .12s; }
      #numpad .press:active { transform: scale(.94); }
      #numpad .numpad-chrome { display: flex; min-height: 26px; align-items: center; gap: 4px; margin-bottom: 8px; }
      #numpad .numpad-mode-btn, #numpad .howmany-toolbar-tool, #numpad .numpad-close {
        display: inline-flex;
        width: 26px;
        height: 26px;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        border-radius: 8px;
        background: rgba(255,255,255,.55);
        color: #5B6A9A;
        cursor: pointer;
      }
      #numpad .numpad-mode-btn:hover, #numpad .howmany-toolbar-tool:hover, #numpad .numpad-close:hover { background: rgba(255,255,255,.85); color: #1A1428; }
      #numpad .numpad-mode-btn.is-active { background: rgba(83,139,236,.28); color: #1E3A8A; }
      #numpad .numpad-drag-handle { height: 26px; border: 0; border-radius: 8px; background: rgba(255,255,255,.4); cursor: grab; }
      #numpad .howmany-mid-chrome { position: relative; height: 68px; margin-bottom: 10px; }
      #numpad .numpad-quick {
        position: absolute;
        inset: 0;
        display: flex !important;
        flex-direction: column;
        gap: 6px;
        width: auto;
        margin: 0;
        opacity: 1;
        pointer-events: auto;
        transition: opacity .22s ease;
      }
      #numpad.numpad--calc .numpad-quick { display: flex !important; opacity: 0; pointer-events: none; }
      #numpad .howmany-arrow-strip { display: flex; gap: 4px; }
      #numpad .howmany-arrow-strip .quick-carousel__btn {
        display: inline-flex !important;
        width: auto;
        height: 28px;
        flex: 1;
        border: 0;
        border-radius: 8px;
        background: rgba(255,255,255,.55);
        color: #1A1428;
        opacity: 1;
        cursor: pointer;
      }
      #numpad .howmany-arrow-strip .quick-carousel__btn:hover { background: rgba(255,255,255,.85); }
      #numpad .howmany-chips-scroll { min-height: 0; flex: 1; overflow-x: auto; overflow-y: hidden; scrollbar-width: thin; scrollbar-color: rgba(83,139,236,.45) transparent; }
      #numpad .quick-carousel__viewport { width: max-content; overflow: visible; container-type: normal; }
      #numpad .quick-carousel__track { display: flex; width: max-content; height: 100%; align-items: center; gap: 4px; transform: none !important; transition: none; }
      #numpad .quick-carousel__track .quick-chip {
        width: auto;
        height: 24px;
        flex: 0 0 auto;
        padding: 0 7px;
        border: 0;
        border-radius: 6px;
        background: rgba(255,255,255,.55);
        color: #5B5670;
        font-size: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-weight: 550;
        cursor: pointer;
        box-shadow: none;
      }
      #numpad .quick-carousel__track .quick-chip.is-selected { background: rgba(255,255,255,.55); color: #5B5670; }
      #numpad .quick-carousel__track .quick-chip:hover { background: rgba(255,255,255,.85); color: #1A1428; }
      #numpad .quick-carousel__track .quick-chip.blink { background: rgba(83,139,236,.35); color: #1A1428; }
      #numpad .numpad-lcd {
        position: absolute;
        inset: 50% 0 auto;
        display: flex !important;
        height: 50px;
        min-height: 50px;
        margin: -25px 0 0;
        align-items: center;
        justify-content: flex-end;
        padding: 0 14px;
        border: 0;
        border-radius: 12px;
        background: #1C1A28;
        color: #F5F3FF;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 20px;
        font-weight: 550;
        font-variant-numeric: tabular-nums;
        letter-spacing: .02em;
        white-space: nowrap;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transition: opacity .22s ease;
      }
      #numpad.numpad--calc .numpad-lcd { opacity: 1; pointer-events: auto; }
      #numpad .numpad-keys { display: block; }
      #numpad .howmany-keys-row { display: flex; align-items: stretch; gap: 0; }
      #numpad .howmany-keys-num { display: grid; min-width: 0; flex: 0 0 206px; grid-template-columns: repeat(3,1fr); gap: 6px; }
      #numpad .howmany-ops-slide { width: 0; flex: 0 0 0; margin-left: 0; overflow: hidden; transition: flex-basis .45s var(--smooth), width .45s var(--smooth), margin .45s var(--smooth); }
      #numpad.numpad--calc .howmany-ops-slide { width: 52px; flex-basis: 52px; margin-left: 6px; }
      #numpad .numpad-ops { display: flex !important; width: 52px; height: 100%; flex-direction: column; gap: 6px; }
      #numpad .numpad-ops .key-op { min-height: 44px; flex: 1; border-radius: 12px; background: #EE9A3C; color: #fff; font-size: 18px; font-weight: 650; cursor: pointer; box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 2px 4px rgba(180,90,20,.35); }
      #numpad .numpad-ops .key-op:hover { background: #EE9A3C; filter: brightness(1.06); }
      #numpad .howmany-keys-num > button {
        height: 44px;
        border: 0;
        border-radius: 12px;
        background: #2A2A38;
        color: #E8E4F0;
        font-size: 15px;
        font-weight: 550;
        cursor: pointer;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 2px 4px rgba(0,0,0,.25);
      }
      #numpad .howmany-keys-num > button:hover { background: #343446; }
      #numpad .key-eq {
        width: 100%;
        height: 44px;
        margin-top: 6px;
        border: 0;
        border-radius: 14px;
        background: #7BA3F0;
        color: #fff;
        font-size: 15px;
        font-weight: 650;
        cursor: pointer;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.3), 0 2px 6px rgba(50,90,180,.35);
      }
      #numpad .key-eq:hover { filter: brightness(1.06); }
    `;
    shellDocument.head.append(stageStyle);

    const sourceUnit = shellDocument.getElementById("prog-unit-switch");
    const sourceActions = sourceUnit?.parentElement;
    if (sourceUnit && sourceActions && !shellDocument.getElementById("howmany-source-file")) {
      const fileButton = shellDocument.createElement("button");
      fileButton.type = "button";
      fileButton.id = "howmany-source-file";
      fileButton.className = "howmany-source-icon press";
      fileButton.title = "Open file";
      fileButton.setAttribute("aria-label", "Open file");
      fileButton.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path></svg>`;
      const clearButton = shellDocument.createElement("button");
      clearButton.type = "button";
      clearButton.id = "howmany-source-clear";
      clearButton.className = "howmany-source-icon press";
      clearButton.title = "Clear source";
      clearButton.setAttribute("aria-label", "Clear source");
      clearButton.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>`;
      sourceActions.insertBefore(fileButton, sourceUnit);
      sourceActions.insertBefore(clearButton, sourceUnit);
      const fileInput = shellDocument.createElement("input");
      fileInput.id = "howmany-source-file-input";
      fileInput.type = "file";
      fileInput.accept = ".nc,.cnc,.gcode,.txt,text/plain";
      fileInput.hidden = true;
      shellDocument.body.append(fileInput);
    }

    const footer = shellDocument.getElementById("calc-footer");
    if (footer && !footer.dataset.howmanyAuthorityWired) {
      footer.dataset.howmanyAuthorityWired = "true";
      footer.classList.add("howmany-footer-strip");
      const children = Array.from(footer.children) as HTMLElement[];
      children[0]?.classList.add("howmany-footer-item");
      children[0]?.setAttribute("data-footer-kind", "total");
      children[2]?.classList.add("howmany-footer-item");
      children[2]?.setAttribute("data-footer-kind", "manual");
      children[3]?.classList.add("howmany-footer-item");
      children[3]?.setAttribute("data-footer-kind", "auto");
      const badge = shellDocument.createElement("div");
      badge.className = "howmany-mode-badge";
      badge.dataset.howmanyModeBadge = "true";
      badge.textContent = "Manual";
      footer.append(badge);
    }

    const numpad = shellDocument.getElementById("numpad");
    if (numpad && !numpad.dataset.howmanyAuthorityWired) {
      numpad.dataset.howmanyAuthorityWired = "true";
      const chrome = numpad.querySelector<HTMLElement>(".numpad-chrome");
      const modeButton = shellDocument.getElementById("numpad-mode-btn");
      const drag = numpad.querySelector<HTMLElement>(".numpad-drag-handle");
      const quickManage = drag?.querySelector<HTMLElement>(".quick-manage");
      const quickEdit = shellDocument.getElementById("quick-edit") as HTMLButtonElement | null;
      if (chrome && modeButton && drag && quickEdit) {
        modeButton.title = "Calculator mode";
        modeButton.setAttribute("aria-label", "Calculator mode");
        const backspace = shellDocument.createElement("button");
        backspace.type = "button";
        backspace.id = "howmany-toolbar-backspace";
        backspace.className = "howmany-toolbar-tool press";
        backspace.title = "Backspace";
        backspace.setAttribute("aria-label", "Backspace");
        backspace.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path><path d="m12 9 6 6"></path><path d="m18 9-6 6"></path></svg>`;
        quickEdit.className = "howmany-toolbar-tool press";
        quickEdit.title = "Edit quick values";
        quickEdit.setAttribute("aria-label", "Edit quick values");
        quickEdit.disabled = true;
        quickEdit.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path><path d="m15 5 4 4"></path></svg>`;
        chrome.insertBefore(backspace, drag);
        chrome.insertBefore(quickEdit, drag);
        quickManage?.remove();
      }

      const lcd = shellDocument.getElementById("numpad-lcd");
      const quick = shellDocument.getElementById("numpad-quick");
      const previous = shellDocument.getElementById("quick-prev");
      const next = shellDocument.getElementById("quick-next");
      const viewport = shellDocument.getElementById("quick-viewport");
      if (lcd && quick && previous && next && viewport) {
        const mid = shellDocument.createElement("div");
        mid.className = "howmany-mid-chrome";
        const arrows = shellDocument.createElement("div");
        arrows.className = "howmany-arrow-strip";
        arrows.setAttribute("aria-label", "Field focus");
        previous.setAttribute("aria-label", "Previous field");
        previous.setAttribute("title", "Previous field");
        next.setAttribute("aria-label", "Next field");
        next.setAttribute("title", "Next field");
        arrows.append(previous, next);
        const chips = shellDocument.createElement("div");
        chips.className = "howmany-chips-scroll";
        chips.append(viewport);
        quick.replaceChildren(arrows, chips);
        numpad.insertBefore(mid, lcd);
        mid.append(quick, lcd);
      }

      const keys = shellDocument.getElementById("numpad-keys");
      const operations = shellDocument.getElementById("numpad-ops");
      const enter = keys?.querySelector<HTMLButtonElement>('[data-key="enter"]');
      if (keys && operations && enter) {
        const row = shellDocument.createElement("div");
        row.className = "howmany-keys-row";
        const numbers = shellDocument.createElement("div");
        numbers.className = "howmany-keys-num";
        Array.from(keys.querySelectorAll<HTMLButtonElement>(":scope > button[data-key]"))
          .filter((button) => button !== enter)
          .forEach((button) => numbers.append(button));
        const slide = shellDocument.createElement("div");
        slide.className = "howmany-ops-slide";
        slide.append(operations);
        row.append(numbers, slide);
        keys.replaceChildren(row, enter);
      }
    }

    const sourceFileInput = shellDocument.getElementById(
      "howmany-source-file-input",
    ) as HTMLInputElement | null;
    const handleFileChange = async () => {
      const file = sourceFileInput?.files?.[0];
      const textarea = shellDocument.getElementById(
        "gcode-input",
      ) as HTMLTextAreaElement | null;
      if (!file || !textarea) return;
      textarea.value = await file.text();
      textarea.dispatchEvent(
        new shellDocument.defaultView!.Event("input", { bubbles: true }),
      );
      sourceFileInput.value = "";
    };
    sourceFileInput?.addEventListener("change", handleFileChange);
    const handleResize = () => placeAuthorityNumpad(shellDocument);
    shellDocument.defaultView?.addEventListener("resize", handleResize);

    const sectionBodies = Array.from(
      shellDocument.querySelectorAll<HTMLElement>(".section-body"),
    );
    const syncClosedFields = () => {
      sectionBodies.forEach((body) => {
        body.inert = body.classList.contains("closed");
      });
      const activeField = activeNumericFieldRef.current;
      if (activeField?.closest(".section-body.closed")) {
        shellDocument.getElementById("numpad-close")?.click();
      }
    };
    const closedObserver = new MutationObserver(syncClosedFields);
    sectionBodies.forEach((body) =>
      closedObserver.observe(body, {
        attributes: true,
        attributeFilter: ["class"],
      }),
    );
    syncClosedFields();

    const auth = shellDocument.createElement("div");
    auth.dataset.howmanyBridge = "auth";
    auth.style.cssText =
      "display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;overflow:hidden;border-radius:9999px;";
    stub.style.display = "none";
    stub.parentElement.append(auth);
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setStageTarget(stage);
      setAuthTarget(auth);
    });

    return () => {
      cancelled = true;
      stage.remove();
      stageStyle.remove();
      sourceFileInput?.removeEventListener("change", handleFileChange);
      shellDocument.defaultView?.removeEventListener("resize", handleResize);
      closedObserver.disconnect();
      auth.remove();
      stub.style.display = "";
    };
  }, [shellDocument]);

  useEffect(() => {
    const inputs = state.manualInputs;
    shellDocument.querySelectorAll<HTMLInputElement>("input[data-field]").forEach((input) => {
      const binding = fieldBindingForId(input.id);
      if (!binding) return;
      const value = binding.kind === "input" ? inputs[binding.key] : inputs.margins[binding.key];
      const draft = fieldDraftsRef.current.get(input.id);
      const preserveDraft =
        shellDocument.activeElement === input &&
        draft !== undefined &&
        shouldPreserveNumericDraft(draft, value);
      if (!preserveDraft) input.value = formatShellNumber(value);
      input.parentElement?.classList.toggle("has-value", value !== null);
    });

    const moveMarginsWithRotation = select<HTMLInputElement>(
      shellDocument,
      '[data-section="margins"] input[type="checkbox"]',
    );
    if (moveMarginsWithRotation) {
      moveMarginsWithRotation.checked = inputs.moveMarginsWithRotation;
      moveMarginsWithRotation.setAttribute(
        "aria-checked",
        inputs.moveMarginsWithRotation ? "true" : "false",
      );
    }

    setText(shellDocument.getElementById("part-badge"), `${formatShellNumber(inputs.partWidth)} × ${formatShellNumber(inputs.partHeight)}`);
    setText(shellDocument.getElementById("rem-badge"), `${formatShellNumber(inputs.remnantWidth)} × ${formatShellNumber(inputs.remnantHeight)}`);
    setText(shellDocument.getElementById("gap-badge"), `${formatShellNumber(inputs.gapX)} × ${formatShellNumber(inputs.gapY)}`);
    setText(
      shellDocument.getElementById("margins-badge"),
      marginsBadgeText(inputs.margins),
    );

    syncSegment(shellDocument, "unit-switch", inputs.unit === "in" ? "unit-in" : "unit-mm", "#538BEC", "data-value", inputs.unit);
    exposeCalculatorUnit(shellDocument, inputs.unit);
    syncSegment(shellDocument, "autonest-switch", state.mode === "autonest" ? "mode-autonest" : "mode-manual", "#538BEC", "data-mode", state.mode);

    const partLink = select<HTMLElement>(shellDocument, '[data-link="part"]');
    const gapLink = select<HTMLElement>(shellDocument, '[data-link="gap"]');
    partLink?.classList.toggle("active", inputs.partLinked);
    gapLink?.classList.toggle("active", inputs.gapLinked);

    const manualTotal = session.manual.result.totalParts;
    const autoResult = session.result.mode === "autonest" ? session.result.autoNest : null;
    const autoTotal = autoResult?.status === "computed"
      ? autoResult.twoGroup.totalParts
      : autoResult?.bestUniform.totalParts ?? manualTotal;
    const total = state.mode === "autonest" ? autoTotal : manualTotal;
    setText(select(shellDocument, "#stage [data-calc-only] .font-bold"), total);
    const footerValues = shellDocument.querySelectorAll("#calc-footer .tabular-nums");
    setText(footerValues[0] ?? null, total);
    setText(footerValues[1] ?? null, manualTotal);
    setText(footerValues[2] ?? null, autoTotal);
    const autoFooter = shellDocument.querySelector<HTMLElement>(
      '#calc-footer [data-footer-kind="auto"]',
    );
    if (autoFooter) autoFooter.hidden = state.mode !== "autonest";
    const modeBadge = shellDocument.querySelector<HTMLElement>(
      "#calc-footer [data-howmany-mode-badge]",
    );
    if (modeBadge) {
      const isAuto = state.mode === "autonest";
      modeBadge.textContent = isAuto ? "AutoNest" : "Manual";
      modeBadge.classList.toggle("on-auto", isAuto);
    }
  }, [session, shellDocument, state]);

  useEffect(() => {
    if (!authTarget) return;
    const compactClerkChrome = () => {
      authTarget
        .querySelectorAll<HTMLElement>(
          ".cl-userButtonBox, .cl-userButtonTrigger, .cl-userButtonAvatarBox, .cl-userButtonAvatarImage, .cl-avatarBox, .cl-avatarImage",
        )
        .forEach((element) => {
          element.style.setProperty("width", "2rem", "important");
          element.style.setProperty("height", "2rem", "important");
          element.style.setProperty("max-width", "2rem", "important");
          element.style.setProperty("max-height", "2rem", "important");
          element.style.setProperty("overflow", "hidden", "important");
          element.style.setProperty("border-radius", "9999px", "important");
        });
    };
    compactClerkChrome();
    const observer = new MutationObserver(compactClerkChrome);
    observer.observe(authTarget, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [authTarget]);

  useEffect(() => {
    syncSegment(shellDocument, "prog-unit-switch", programUnit === "in" ? "prog-unit-in" : "prog-unit-mm", "#EE8C3C", "data-value", programUnit);
    syncSegment(shellDocument, "part-unit-switch", partUnit === "in" ? "part-unit-in" : "part-unit-mm", "#EE8C3C", "data-value", partUnit);
    shellDocument.querySelectorAll<HTMLElement>("[data-angle]").forEach((button) => {
      const active = Number(button.dataset.angle) === angle;
      button.style.background = active ? "#EE8C3C" : "var(--raised)";
      button.style.border = active ? "none" : "1px solid rgba(200,205,216,0.2)";
      button.style.color = active ? "#fff" : "#C8CDD8";
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
    setText(shellDocument.getElementById("gcode-angle-label"), `${angle}°`);

    const x = shellDocument.getElementById("gcode-part-x") as HTMLInputElement | null;
    const y = shellDocument.getElementById("gcode-part-y") as HTMLInputElement | null;
    const label = shellDocument.getElementById("gcode-preview-label");
    const fill = shellDocument.getElementById("fill-part-size") as HTMLButtonElement | null;
    const copy = shellDocument.getElementById("gcode-copy") as HTMLButtonElement | null;
    const download = shellDocument.getElementById("gcode-download") as HTMLButtonElement | null;
    if (x) x.value = displayedSize ? formatShellNumber(displayedSize.width) : "—";
    if (y) y.value = displayedSize ? formatShellNumber(displayedSize.height) : "—";
    setText(label, displayedSize ? `${formatShellNumber(displayedSize.width)} × ${formatShellNumber(displayedSize.height)} ${partUnit}` : "— × —");
    if (fill) fill.disabled = !displayedSize || displayedSize.width <= 0 || displayedSize.height <= 0;
    if (copy) copy.disabled = !fresh;
    if (download) download.disabled = !fresh;
    const preview = shellDocument.getElementById("gcode-part-preview");
    if (preview && displayedSize && displayedSize.height > 0) {
      preview.style.aspectRatio = `${displayedSize.width} / ${displayedSize.height}`;
    }
  }, [angle, displayedSize, fresh, partUnit, programUnit, shellDocument]);

  useEffect(() => {
    const track = shellDocument.getElementById("presets-track");
    const carousel = shellDocument.getElementById("presets-carousel");
    const viewport = shellDocument.getElementById("presets-viewport");
    const previous = shellDocument.getElementById("presets-prev") as HTMLButtonElement | null;
    const next = shellDocument.getElementById("presets-next") as HTMLButtonElement | null;
    const add = shellDocument.getElementById("presets-add") as HTMLButtonElement | null;
    const edit = shellDocument.getElementById("presets-edit") as HTMLButtonElement | null;
    const remove = shellDocument.getElementById("presets-delete") as HTMLButtonElement | null;
    if (!track || !carousel || !viewport) return;
    track.setAttribute("aria-busy", presets.isLoading || presets.isBusy ? "true" : "false");
    track.setAttribute("aria-label", "Saved presets");
    const fragment = shellDocument.createDocumentFragment();
    for (const record of presets.presets) {
      const chip = shellDocument.createElement("button");
      chip.type = "button";
      chip.className = `preset-chip press${record.presetId === presets.selectedPresetId ? " is-selected" : ""}`;
      chip.setAttribute("role", "listitem");
      chip.setAttribute("aria-label", `Load preset ${record.name}`);
      chip.setAttribute("aria-pressed", record.presetId === presets.selectedPresetId ? "true" : "false");
      chip.dataset.presetId = record.presetId;
      chip.title = record.name;
      chip.textContent = record.name;
      fragment.append(chip);
    }
    if (presets.presets.length === 0) {
      const empty = shellDocument.createElement("span");
      empty.dataset.howmanyPresetsEmpty = "true";
      empty.setAttribute("role", "status");
      empty.style.cssText =
        "display:flex;width:100%;height:32px;align-items:center;justify-content:center;color:#C8CDD8;font-size:12px;font-weight:600;";
      empty.textContent = "No saved presets";
      fragment.append(empty);
    }
    track.replaceChildren(fragment);
    track.setAttribute("title", presets.error ?? presets.status);
    const selectedIndex = presets.presets.findIndex(
      ({ presetId }) => presetId === presets.selectedPresetId,
    );

    const resolveVisibleCount = () => {
      const sheetWidth = shellDocument.getElementById("sheet")?.getBoundingClientRect().width ?? 0;
      return sheetWidth > 0 && sheetWidth <= 360 ? 2 : 3;
    };

    const initialVisibleCount = resolveVisibleCount();
    presetPageRef.current =
      selectedIndex >= 0 ? Math.floor(selectedIndex / initialVisibleCount) : 0;

    const syncRealCarousel = () => {
      const visibleCount = resolveVisibleCount();
      const chips = Array.from(
        track.querySelectorAll<HTMLElement>("[data-preset-id]"),
      );
      const carouselState = derivePresetCarousel({
        count: chips.length,
        selectedIndex: -1,
        visibleCount,
        requestedPage: presetPageRef.current,
      });
      presetPageRef.current = carouselState.page;
      carousel.setAttribute("data-visible", `${visibleCount}`);

      const firstChipWidth = chips[0]?.offsetWidth ?? 0;
      const fallbackChipWidth =
        viewport.clientWidth > 0
          ? (viewport.clientWidth - 6 * (visibleCount - 1)) / visibleCount
          : 0;
      const chipStep = (firstChipWidth || fallbackChipWidth) + 6;
      const pageStep = chipStep * visibleCount;
      track.style.transform =
        pageStep > 0
          ? `translateX(${-carouselState.page * pageStep}px)`
          : "translateX(0px)";

      chips.forEach((chip) => {
        const selected = chip.dataset.presetId === presets.selectedPresetId;
        chip.classList.toggle("is-selected", selected);
        chip.setAttribute("aria-pressed", selected ? "true" : "false");
        const record = presets.presets.find(
          ({ presetId }) => presetId === chip.dataset.presetId,
        );
        if (record) chip.title = record.name;
        chip.style.background = "";
        chip.style.border = "";
        chip.style.color = "";
      });
      if (previous) previous.disabled = !carouselState.canGoPrevious;
      if (next) next.disabled = !carouselState.canGoNext;
      if (add) add.disabled = presets.isLoading || presets.isBusy;
      if (edit) edit.disabled = !presets.selectedPresetId || presets.isBusy;
      if (remove) remove.disabled = !presets.selectedPresetId || presets.isBusy;
    };

    syncPresetCarouselRef.current = syncRealCarousel;
    syncRealCarousel();

    let correctiveFrame: number | undefined;
    const hasShellDrift = () => {
      const selectionDrift = Array.from(
        track.querySelectorAll<HTMLElement>("[data-preset-id]"),
      ).some((chip) => {
        const selected = chip.dataset.presetId === presets.selectedPresetId;
        return (
          chip.classList.contains("is-selected") !== selected ||
          chip.getAttribute("aria-pressed") !== (selected ? "true" : "false")
        );
      });
      const editDisabled = !presets.selectedPresetId || presets.isBusy;
      const removeDisabled = !presets.selectedPresetId || presets.isBusy;
      return (
        selectionDrift ||
        Boolean(edit && edit.disabled !== editDisabled) ||
        Boolean(remove && remove.disabled !== removeDisabled)
      );
    };
    const driftObserver = new MutationObserver(() => {
      if (!hasShellDrift() || !shellDocument.defaultView) return;
      if (correctiveFrame !== undefined) {
        shellDocument.defaultView.cancelAnimationFrame(correctiveFrame);
      }
      correctiveFrame =
        shellDocument.defaultView.requestAnimationFrame(syncRealCarousel);
    });
    driftObserver.observe(track, {
      attributes: true,
      attributeFilter: ["aria-pressed", "class"],
      subtree: true,
    });
    if (edit) {
      driftObserver.observe(edit, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    }
    if (remove) {
      driftObserver.observe(remove, {
        attributes: true,
        attributeFilter: ["disabled"],
      });
    }

    const shellWindow = shellDocument.defaultView as
      | (Window & { __nestPresetsSync?: (() => void) | null })
      | null;
    shellWindow?.__nestPresetsSync?.();
    let deferredFrame: number | undefined;
    const frame = shellWindow?.requestAnimationFrame(() => {
      syncRealCarousel();
      deferredFrame = shellWindow.requestAnimationFrame(syncRealCarousel);
    });
    const resizeObserver = new ResizeObserver(syncRealCarousel);
    resizeObserver.observe(viewport);

    return () => {
      if (frame !== undefined) shellWindow?.cancelAnimationFrame(frame);
      if (deferredFrame !== undefined) {
        shellWindow?.cancelAnimationFrame(deferredFrame);
      }
      if (correctiveFrame !== undefined) {
        shellWindow?.cancelAnimationFrame(correctiveFrame);
      }
      driftObserver.disconnect();
      resizeObserver.disconnect();
      if (syncPresetCarouselRef.current === syncRealCarousel) {
        syncPresetCarouselRef.current = null;
      }
    };
  }, [presets.error, presets.isBusy, presets.isLoading, presets.presets, presets.selectedPresetId, presets.status, shellDocument]);

  useEffect(() => {
    const handleInput = (event: Event) => {
      const target = event.target;
      if (!(target instanceof shellDocument.defaultView!.HTMLInputElement) && !(target instanceof shellDocument.defaultView!.HTMLTextAreaElement)) return;
      if (target.id === "gcode-input") {
        setSource(target.value);
        return;
      }
      const binding = fieldBindingForId(target.id);
      if (!binding) return;
      const sanitized = sanitizeShellNumericDraft(target.value);
      if (sanitized !== target.value) {
        target.value = sanitized;
        target.setSelectionRange(sanitized.length, sanitized.length);
      }
      fieldDraftsRef.current.set(target.id, target.value);
      typingFreshFieldRef.current = null;
      const value = parseNumericInput(target.value);
      if (binding.kind === "input") {
        updateInputs((current) => updateManualField(current, binding.key, value));
      } else {
        setState((current) => updateNestSessionMargin(current, binding.key, value));
      }
    };

    const handleChange = (event: Event) => {
      const checkbox = event.target;
      if (!(checkbox instanceof shellDocument.defaultView!.HTMLInputElement) || checkbox.type !== "checkbox") return;
      if (!checkbox.closest('[data-section="margins"]')) return;
      updateInputs((current) => ({ ...current, moveMarginsWithRotation: checkbox.checked }));
    };

    const handleFocusOut = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof shellDocument.defaultView!.HTMLInputElement)) return;
      if (!fieldBindingForId(target.id)) return;
      fieldDraftsRef.current.delete(target.id);
      if (typingFreshFieldRef.current === target.id) {
        typingFreshFieldRef.current = null;
      }
      target.value = formatShellNumber(parseNumericInput(target.value));
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof shellDocument.defaultView!.HTMLInputElement)) return;
      if (!fieldBindingForId(target.id)) return;
      if (target.closest(".section-body.closed")) {
        target.blur();
        shellDocument.getElementById("numpad-close")?.click();
        return;
      }
      activeNumericFieldRef.current = target;
      typingFreshFieldRef.current = target.id;
      queueMicrotask(() => {
        placeAuthorityNumpad(shellDocument);
        const modeButton = shellDocument.getElementById("numpad-mode-btn");
        if (modeButton) {
          modeButton.setAttribute("aria-label", "Calculator mode");
          modeButton.setAttribute("title", "Calculator mode");
        }
      });
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "." && event.key !== "Decimal") return;
      const target = event.target;
      if (!(target instanceof shellDocument.defaultView!.HTMLInputElement)) return;
      if (!fieldBindingForId(target.id)) return;

      event.preventDefault();
      const edit = insertShellDecimal(
        target.value,
        target.selectionStart,
        target.selectionEnd,
        typingFreshFieldRef.current === target.id,
      );
      if (!edit) return;
      typingFreshFieldRef.current = null;
      target.value = edit.value;
      target.setSelectionRange(edit.caret, edit.caret);
      target.dispatchEvent(
        new shellDocument.defaultView!.Event("input", { bubbles: true }),
      );
    };

    shellDocument.addEventListener("input", handleInput, true);
    shellDocument.addEventListener("change", handleChange);
    shellDocument.addEventListener("focusout", handleFocusOut);
    shellDocument.addEventListener("focusin", handleFocusIn);
    shellDocument.addEventListener("keydown", handleKeyDown, true);
    return () => {
      shellDocument.removeEventListener("input", handleInput, true);
      shellDocument.removeEventListener("change", handleChange);
      shellDocument.removeEventListener("focusout", handleFocusOut);
      shellDocument.removeEventListener("focusin", handleFocusIn);
      shellDocument.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [setState, shellDocument, updateInputs]);

  useEffect(() => {
    const stop = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const showDialog = (options: ShellDialogOptions) => {
      activeDialogCleanupRef.current?.();
      const close = openShellDialog(shellDocument, options);
      activeDialogCleanupRef.current = () => {
        close();
        activeDialogCleanupRef.current = null;
      };
    };

    const visibleNumericFields = () =>
      Array.from(
        shellDocument.querySelectorAll<HTMLInputElement>("input[data-field]"),
      ).filter((field) => !field.closest(".section-body.closed"));

    const selectedQuickChip = () => {
      const selected = selectedQuickValueRef.current;
      if (!selected) return null;
      return Array.from(
        shellDocument.querySelectorAll<HTMLButtonElement>(
          "#quick-track button[data-quick]",
        ),
      ).find((chip) => chip.dataset.quick === selected) ?? null;
    };

    const handleClick = (event: MouseEvent) => {
      const raw = event.target;
      if (!(raw instanceof shellDocument.defaultView!.Element)) return;
      const button = raw.closest<HTMLButtonElement>("button");
      if (!button) return;

      if (
        button.id !== "numpad-close" &&
        button.closest("#numpad") &&
        activeNumericFieldRef.current?.closest(".section-body.closed")
      ) {
        stop(event);
        shellDocument.getElementById("numpad-close")?.click();
        return;
      }

      if (button.id === "numpad-mode-btn") {
        const numpad = shellDocument.getElementById("numpad");
        if (numpad && numpad.style.right !== "auto") {
          const rect = numpad.getBoundingClientRect();
          numpad.style.left = `${rect.left}px`;
          numpad.style.top = `${rect.top}px`;
          numpad.style.right = "auto";
          numpad.style.bottom = "auto";
        }
        queueMicrotask(() => {
          button.title = "Calculator mode";
          button.setAttribute("aria-label", "Calculator mode");
        });
        return;
      }

      if (button.id === "howmany-source-file") {
        stop(event);
        shellDocument.getElementById("howmany-source-file-input")?.click();
        return;
      }
      if (button.id === "howmany-source-clear") {
        stop(event);
        const textarea = shellDocument.getElementById(
          "gcode-input",
        ) as HTMLTextAreaElement | null;
        if (textarea) {
          textarea.value = "";
          textarea.dispatchEvent(
            new shellDocument.defaultView!.Event("input", { bubbles: true }),
          );
        }
        setGeneration(null);
        setText(shellDocument.getElementById("gcode-output"), "—");
        return;
      }

      if (button.id === "howmany-toolbar-backspace") {
        stop(event);
        shellDocument
          .querySelector<HTMLButtonElement>('#numpad [data-key="back"]')
          ?.click();
        return;
      }

      if (button.id === "quick-prev" || button.id === "quick-next") {
        stop(event);
        const fields = visibleNumericFields();
        if (fields.length === 0) return;
        const current = activeNumericFieldRef.current;
        const currentIndex = current ? fields.indexOf(current) : -1;
        const delta = button.id === "quick-next" ? 1 : -1;
        const fallback = delta > 0 ? 0 : fields.length - 1;
        const nextIndex =
          currentIndex < 0
            ? fallback
            : (currentIndex + delta + fields.length) % fields.length;
        fields[nextIndex]?.focus();
        return;
      }

      if (button.dataset.quick) {
        stop(event);
        const active = activeNumericFieldRef.current;
        if (!active || active.closest(".section-body.closed")) return;
        const quick = button.dataset.quick;
        const replacement = quickValueDraft(active.value, quick);
        active.value = replacement;
        active.setSelectionRange(replacement.length, replacement.length);
        active.dispatchEvent(
          new shellDocument.defaultView!.Event("input", { bubbles: true }),
        );
        selectedQuickValueRef.current = quick;
        shellDocument
          .querySelectorAll("#quick-track .is-selected")
          .forEach((chip) => chip.classList.remove("is-selected"));
        button.classList.add("blink");
        shellDocument.defaultView?.setTimeout(
          () => button.classList.remove("blink"),
          180,
        );
        const edit = shellDocument.getElementById(
          "quick-edit",
        ) as HTMLButtonElement | null;
        if (edit) edit.disabled = false;
        return;
      }

      if (button.id === "quick-edit") {
        stop(event);
        const chip = selectedQuickChip();
        if (!chip) return;
        showDialog({
          title: "Edit quick value",
          label: "Value",
          value: chip.dataset.quick ?? "",
          numeric: true,
          allowDelete: true,
          onConfirm: (draft) => {
            const next = sanitizeShellNumericDraft(draft);
            if (!next) return;
            const duplicate = Array.from(
              shellDocument.querySelectorAll<HTMLButtonElement>(
                "#quick-track button[data-quick]",
              ),
            ).some((candidate) => candidate !== chip && candidate.dataset.quick === next);
            if (duplicate) return;
            chip.dataset.quick = next;
            chip.title = next;
            chip.textContent = Number(next) < 1 ? next.replace(/^0/, "") : `${Number(next)}`;
            selectedQuickValueRef.current = next;
          },
          onDelete: () => {
            const chips = Array.from(
              shellDocument.querySelectorAll<HTMLButtonElement>(
                "#quick-track button[data-quick]",
              ),
            );
            if (chips.length <= 1) return;
            chip.remove();
            selectedQuickValueRef.current = null;
            const edit = shellDocument.getElementById(
              "quick-edit",
            ) as HTMLButtonElement | null;
            if (edit) edit.disabled = true;
          },
        });
        return;
      }

      if (button.id === "unit-in" || button.id === "unit-mm") {
        stop(event);
        const requested: Unit = button.id === "unit-mm" ? "mm" : "in";
        if (requested !== state.manualInputs.unit) setState(toggleNestSessionUnit);
        return;
      }
      if (button.id === "mode-autonest" || button.id === "mode-manual") {
        stop(event);
        const mode = button.id === "mode-autonest" ? "autonest" : "manual";
        setState((current) => ({ ...current, mode }));
        return;
      }
      if (button.id === "prog-unit-in" || button.id === "prog-unit-mm") {
        stop(event);
        setProgramUnit(button.id === "prog-unit-mm" ? "mm" : "in");
        return;
      }
      if (button.id === "part-unit-in" || button.id === "part-unit-mm") {
        stop(event);
        setPartUnit(button.id === "part-unit-mm" ? "mm" : "in");
        return;
      }
      if (button.matches("[data-angle]")) {
        stop(event);
        setAngle(Number(button.dataset.angle));
        return;
      }

      if (button.id === "gcode-generate") {
        stop(event);
        const output = shellDocument.getElementById("gcode-output");
        const analysis = analyzeGCode(source);
        if (!analysis.ok) {
          setGeneration(null);
          setText(output, diagnosticsText(analysis.diagnostics));
          return;
        }
        const generated = generateRotatedGCode(source, angle);
        if (!generated.ok) {
          setGeneration(null);
          setText(output, diagnosticsText(generated.diagnostics));
          return;
        }
        const size = partSizeFromBounds(analysis.bounds);
        if (!size) {
          setGeneration(null);
          setText(output, "Analyzed bounds are unavailable.");
          return;
        }
        setGeneration({ source, angle, output: generated.output, size });
        setText(output, generated.output);
        const body = shellDocument.getElementById("output-body");
        if (body?.classList.contains("closed")) shellDocument.getElementById("output-toggle")?.click();
        return;
      }

      if (button.id === "fill-part-size") {
        stop(event);
        if (!displayedSize || displayedSize.width <= 0 || displayedSize.height <= 0) return;
        setState((current) => applyPartSizeToNestSession(current, displayedSize, partUnit));
        button.textContent = "Filled ✓";
        shellDocument.defaultView?.setTimeout(() => {
          button.textContent = "Fill part size → Calculator";
          shellDocument.getElementById("tab-calc")?.click();
        }, 450);
        return;
      }

      if (button.id === "gcode-copy" || button.id === "gcode-download") {
        stop(event);
        if (!fresh || !generation) return;
        if (button.id === "gcode-copy") {
          void shellDocument.defaultView?.navigator.clipboard?.writeText(generation.output);
        } else {
          const blob = new Blob([generation.output], {
            type: "text/plain;charset=utf-8",
          });
          const link = document.createElement("a");
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = "nestcalc-rotated.nc";
          document.body.append(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
        }
        return;
      }

      if (button.id === "presets-add") {
        stop(event);
        showDialog({
          title: "Save preset",
          label: "Name",
          value: "",
          onConfirm: (draft) => {
            const name = normalizeShellDialogName(draft);
            if (name) void presets.savePreset(name);
          },
        });
        return;
      }
      if (button.id === "presets-prev" || button.id === "presets-next") {
        stop(event);
        presetPageRef.current += button.id === "presets-next" ? 1 : -1;
        syncPresetCarouselRef.current?.();
        return;
      }
      if (button.id === "presets-edit") {
        stop(event);
        const selected = presets.presets.find(({ presetId }) => presetId === presets.selectedPresetId);
        if (!selected) return;
        showDialog({
          title: "Rename preset",
          label: "Name",
          value: selected.name,
          onConfirm: (draft) => {
            const name = normalizeShellDialogName(draft);
            if (name) void presets.renamePreset(selected.presetId, name);
          },
        });
        return;
      }
      if (button.id === "presets-delete") {
        stop(event);
        const selected = presets.presets.find(({ presetId }) => presetId === presets.selectedPresetId);
        if (selected) void presets.deletePreset(selected.presetId);
        return;
      }
      if (button.dataset.presetId) {
        stop(event);
        void presets.loadPreset(button.dataset.presetId);
        return;
      }

      const clearInput = button.matches(".num-input-clear") ? button.parentElement?.querySelector<HTMLInputElement>("input[data-field]") : null;
      if (clearInput) {
        stop(event);
        const binding = fieldBindingForId(clearInput.id);
        if (binding?.kind === "input") updateInputs((current) => updateManualField(current, binding.key, null));
        if (binding?.kind === "margin") setState((current) => updateNestSessionMargin(current, binding.key, null));
        return;
      }
      if (button.title === "Clear") {
        stop(event);
        updateInputs(clearManualInputs);
        return;
      }

      const section = button.closest<HTMLElement>("[data-section]")?.dataset.section;
      if (button.title === "Swap X & Y" && section) {
        stop(event);
        if (section === "part") updateInputs(swapManualPart);
        if (section === "rem") updateInputs(rotateManualRemnant);
        if (section === "gap") updateInputs(swapManualGap);
        return;
      }
      if (button.dataset.link) {
        stop(event);
        if (button.dataset.link === "part") updateInputs(toggleManualPartLink);
        if (button.dataset.link === "gap") updateInputs(toggleManualGapLink);
        return;
      }
      if (button.id === "btn-rem-90" || button.textContent?.includes("Part 90°")) {
        stop(event);
        if (state.mode === "autonest") return;
        updateInputs(button.id === "btn-rem-90" ? rotateManualRemnant : rotateManualPart);
      }
    };

    shellDocument.addEventListener("click", handleClick, true);
    return () => {
      shellDocument.removeEventListener("click", handleClick, true);
      activeDialogCleanupRef.current?.();
    };
  }, [angle, displayedSize, fresh, generation, partUnit, presets, programUnit, setState, shellDocument, source, state.manualInputs.unit, state.mode, updateInputs]);

  const auto = session.result.mode === "autonest" ? session.result.autoNest : null;
  const activeMargins = state.mode === "autonest"
    ? effectiveAutoNestMargins(state.autoNestSettings)
    : state.manualInputs.margins;
  const fallback = previewResult(state, session.manual.result);

  return (
    <>
      {stageTarget
        ? createPortal(
            auto?.status === "computed" ? (
              <AuthorityAutoNestCard
                twoGroup={auto.twoGroup}
                remnantWidth={state.manualInputs.remnantWidth}
                remnantHeight={state.manualInputs.remnantHeight}
                unit={unitLabel(state.manualInputs.unit)}
              />
            ) : (
              <NestGrid
                remnantWidth={state.manualInputs.remnantWidth}
                remnantHeight={state.manualInputs.remnantHeight}
                partWidth={state.manualInputs.partWidth}
                partHeight={state.manualInputs.partHeight}
                margins={activeMargins}
                gapX={state.manualInputs.gapX}
                gapY={state.manualInputs.gapY}
                result={fallback}
                unitLabel={unitLabel(state.manualInputs.unit)}
                className="h-full border-0 bg-transparent"
              />
            ),
            stageTarget,
          )
        : null}
      {authTarget ? createPortal(<AuthControls />, authTarget) : null}
    </>
  );
}
