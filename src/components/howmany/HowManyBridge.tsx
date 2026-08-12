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
  type GCodeUnit,
} from "@/lib/gcodeRotation";
import {
  derivePresetCarousel,
  displayGCodeSize,
  fieldBindingForId,
  formatMarginBadge,
  formatShellNumber,
  generationIsFresh,
  insertShellDecimal,
  nextPresetIndex,
  normalizeQuickValue,
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
import type { NestAppState, NestInputs, NestResult, Unit } from "@/lib/types";
import { unitLabel } from "@/lib/units";

interface HowManyBridgeProps {
  shellDocument: Document;
}

interface FreshGeneration {
  source: string;
  angle: number;
  output: string;
  size: { width: number; height: number };
  unit: GCodeUnit;
}

interface HostedDialogState {
  kind: "quick-add" | "quick-edit" | "preset-save";
  value: string;
  quickButtonId?: string;
  returnFocus: HTMLElement | null;
}

type ManualUpdater = (inputs: NestInputs) => NestInputs;

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
  const [dialogTarget, setDialogTarget] = useState<HTMLElement | null>(null);
  const [hostedDialog, setHostedDialog] = useState<HostedDialogState | null>(null);
  const [source, setSource] = useState("");
  const [angle, setAngle] = useState(0);
  const [programUnit, setProgramUnit] = useState<Unit>("in");
  const [partUnit, setPartUnit] = useState<Unit>("in");
  const [generation, setGeneration] = useState<FreshGeneration | null>(null);
  const fieldDraftsRef = useRef(new Map<string, string>());
  const typingFreshFieldRef = useRef<string | null>(null);
  const presetPageRef = useRef(0);
  const syncPresetCarouselRef = useRef<(() => void) | null>(null);
  const lastNumericFieldRef = useRef<HTMLInputElement | null>(null);
  const lastQuickButtonRef = useRef<HTMLButtonElement | null>(null);
  const quickButtonIdRef = useRef(0);

  const fresh = generationIsFresh(generation, source, angle);
  const generatedUnit =
    generation?.unit === "unknown" ? programUnit : generation?.unit;
  const displayedSize =
    generation && fresh && generatedUnit
      ? displayGCodeSize(generation.size, generatedUnit, partUnit)
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

  const closeHostedDialog = useCallback(() => {
    const returnFocus = hostedDialog?.returnFocus;
    setHostedDialog(null);
    shellDocument.defaultView?.requestAnimationFrame(() => returnFocus?.focus());
  }, [hostedDialog, shellDocument]);

  const cycleNumericFocus = useCallback(
    (direction: -1 | 1) => {
      const fields = Array.from(
        shellDocument.querySelectorAll<HTMLInputElement>("input[data-field]"),
      ).filter((field) => fieldBindingForId(field.id) !== null && !field.disabled);
      if (fields.length === 0) return;
      const active = shellDocument.activeElement;
      const current = fields.findIndex(
        (field) => field === active || field === lastNumericFieldRef.current,
      );
      const index = (Math.max(0, current) + direction + fields.length) % fields.length;
      fields[index].focus();
      fields[index].select();
      lastNumericFieldRef.current = fields[index];
    },
    [shellDocument],
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
      "display:flex;align-items:center;justify-content:center;width:min(56vw,560px);height:min(66vh,520px);min-width:0;min-height:0;--card:rgba(11,8,20,.72);--foreground:#fff;--card-border:rgba(83,139,236,.35);--preview-bg:rgba(11,8,20,.5);--rem-fill:transparent;--rem-stroke:#fff;--margin-fill:rgba(83,139,236,.08);--usable-stroke:rgba(83,139,236,.5);--part-fill:rgba(83,139,236,.2);--part-stroke:#538bec;--origin-stroke:#c8cdd8;--muted:#c8cdd8;--autonest-zero-fill:rgba(83,139,236,.24);--autonest-zero-stroke:#538bec;--autonest-ninety-fill:rgba(238,140,60,.24);--autonest-ninety-stroke:#ee8c3c;--autonest-blank-stroke:rgba(238,140,60,.55);--autonest-trim-stroke:#fb7185;";
    calcView.append(stage);

    const stageStyle = shellDocument.createElement("style");
    stageStyle.dataset.howmanyBridge = "stage-style";
    stageStyle.textContent = `
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
        stroke-width: 3pt;
      }
      [data-howmany-bridge="stage"] .autonest-preview-group-bounds {
        fill: none;
        stroke: var(--autonest-blank-stroke);
      }
      [data-howmany-bridge="stage"] .autonest-preview-summary {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0 0 0 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      [data-howmany-autonest-card] {
        display: grid;
        grid-template-rows: auto minmax(0, 1fr);
        width: 100%;
        height: 100%;
        overflow: hidden;
        border: 1px solid rgba(83,139,236,.38);
        border-radius: 16px;
        background: rgba(11,8,20,.74);
        box-shadow: 0 16px 42px rgba(0,0,0,.24);
      }
      [data-howmany-autonest-header] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
        border-bottom: 1px solid rgba(83,139,236,.24);
        background: rgba(83,139,236,.08);
        color: #fff;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      [data-howmany-autonest-body] {
        display: grid;
        grid-template-rows: minmax(0, 1fr) auto;
        min-height: 0;
        padding: 12px 14px 10px;
      }
      [data-howmany-autonest-drawing] {
        position: relative;
        min-height: 0;
        padding: 25px 0 0 32px;
      }
      [data-howmany-autonest-drawing] > .h-full { height: 100%; }
      [data-howmany-autonest-card] svg text:last-of-type { opacity: 0; }
      [data-howmany-trim-dimension] {
        position: absolute;
        z-index: 2;
        color: #fb7185;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: .02em;
        pointer-events: none;
      }
      [data-howmany-trim-dimension="vertical"] {
        top: 2px;
        left: 32px;
        right: 0;
        border-top: 1px solid #fb7185;
        text-align: center;
      }
      [data-howmany-trim-dimension="horizontal"] {
        top: 25px;
        bottom: 0;
        left: 5px;
        border-left: 1px solid #fb7185;
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        text-align: center;
      }
      [data-howmany-autonest-truth] {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 14px;
        padding-top: 8px;
        color: #c8cdd8;
        font-size: 11px;
      }
      [data-howmany-autonest-truth] strong { color: #fff; }
      [data-howmany-gcode-atmosphere] {
        position: absolute;
        inset: 9px;
        z-index: 0;
        overflow: hidden;
        color: rgba(238,140,60,.12);
        font: 700 9px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace;
        white-space: pre-wrap;
        pointer-events: none;
        user-select: none;
      }
      #gcode-part-preview > :not([data-howmany-gcode-atmosphere]) {
        position: relative;
        z-index: 1;
      }
      [data-howmany-source-actions] {
        display: flex;
        justify-content: flex-end;
        margin: 0 0 7px;
      }
      #howmany-open-file {
        min-height: 30px;
        padding: 0 11px;
        border: 1px solid rgba(238,140,60,.42);
        border-radius: 9px;
        background: rgba(238,140,60,.08);
        color: #fff;
        font-size: 11px;
        font-weight: 800;
      }
      [data-howmany-focus-nav-host] {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin-left: 7px;
      }
      [data-howmany-focus-nav-host] button {
        min-width: 30px;
        min-height: 28px;
        border: 1px solid rgba(83,139,236,.38);
        border-radius: 8px;
        background: rgba(83,139,236,.10);
        color: #fff;
        font-weight: 900;
      }
      .quick-chip.is-blinking { animation: howmany-quick-blink 180ms ease-out; }
      @keyframes howmany-quick-blink {
        45% { background: rgba(83,139,236,.34); transform: scale(.96); }
        100% { background: initial; transform: scale(1); }
      }
      #sheet.side-right { right: 0 !important; left: auto !important; }
      #sheet.panel-full {
        right: .75rem !important;
        left: .75rem !important;
        width: calc(100% - 1.5rem) !important;
        max-width: none !important;
        transform: none !important;
      }
      .stage.viewer-collapsed #gcode-view {
        height: 0 !important;
        min-height: 0 !important;
        overflow: hidden !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }
    `;
    shellDocument.head.append(stageStyle);

    const dialog = shellDocument.createElement("div");
    dialog.dataset.howmanyBridge = "dialog";
    shellDocument.body.append(dialog);

    const numpadChrome = select<HTMLElement>(shellDocument, ".numpad-chrome");
    const focusNav = shellDocument.createElement("span");
    focusNav.dataset.howmanyFocusNavHost = "true";
    const focusNavToggle = shellDocument.createElement("button");
    focusNavToggle.id = "howmany-focus-nav-toggle";
    focusNavToggle.type = "button";
    focusNavToggle.setAttribute("aria-label", "Toggle calculator field navigation");
    focusNavToggle.setAttribute("aria-expanded", "false");
    focusNavToggle.title = "Calculator field navigation";
    focusNavToggle.textContent = "↔";
    const focusNavStrip = shellDocument.createElement("span");
    focusNavStrip.setAttribute("role", "group");
    focusNavStrip.setAttribute("aria-label", "Calculator field navigation");
    focusNavStrip.hidden = true;
    for (const [direction, label, glyph] of [
      ["previous", "Previous calculator field", "←"],
      ["next", "Next calculator field", "→"],
    ] as const) {
      const button = shellDocument.createElement("button");
      button.type = "button";
      button.dataset.howmanyFocusDirection = direction;
      button.setAttribute("aria-label", label);
      button.textContent = glyph;
      focusNavStrip.append(button);
    }
    focusNav.append(focusNavToggle, focusNavStrip);
    numpadChrome?.insertBefore(focusNav, select(shellDocument, "#numpad-close"));
    const handleFocusNavToggle = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      focusNavStrip.hidden = !focusNavStrip.hidden;
      focusNav.closest("#numpad")?.setAttribute("aria-hidden", "false");
      focusNavToggle.setAttribute(
        "aria-expanded",
        focusNavStrip.hidden ? "false" : "true",
      );
    };
    focusNavToggle.addEventListener("click", handleFocusNavToggle);

    const ownerQuickEdit = shellDocument.getElementById(
      "quick-edit",
    ) as HTMLButtonElement | null;
    const hostedQuickEdit = shellDocument.createElement("button");
    hostedQuickEdit.id = "howmany-quick-edit";
    hostedQuickEdit.type = "button";
    hostedQuickEdit.className = "press";
    hostedQuickEdit.setAttribute("aria-label", "Edit quick value");
    hostedQuickEdit.title = "Edit quick value";
    hostedQuickEdit.textContent = "✎";
    focusNav.prepend(hostedQuickEdit);
    if (ownerQuickEdit) ownerQuickEdit.style.display = "none";

    const sourceInput = shellDocument.getElementById("gcode-input");
    const sourceActions = shellDocument.createElement("div");
    sourceActions.dataset.howmanySourceActions = "true";
    const openFile = shellDocument.createElement("button");
    openFile.id = "howmany-open-file";
    openFile.type = "button";
    openFile.textContent = "Open file";
    const fileInput = shellDocument.createElement("input");
    fileInput.id = "howmany-file-input";
    fileInput.type = "file";
    fileInput.accept = ".nc,.cnc,.txt,text/plain";
    fileInput.hidden = true;
    sourceActions.append(openFile, fileInput);
    sourceInput?.parentElement?.insertBefore(sourceActions, sourceInput);

    const bounds = shellDocument.getElementById("gcode-part-preview");
    if (bounds) bounds.style.position = "relative";
    const atmosphere = shellDocument.createElement("div");
    atmosphere.dataset.howmanyGcodeAtmosphere = "true";
    atmosphere.setAttribute("aria-hidden", "true");
    bounds?.prepend(atmosphere);
    const boundsLabel = bounds?.previousElementSibling;
    if (boundsLabel) boundsLabel.textContent = "Bounding box";

    const handleFile = async () => {
      const file = fileInput.files?.[0];
      fileInput.value = "";
      if (!file) return;
      const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
      const supported =
        extension === ".nc" ||
        extension === ".cnc" ||
        extension === ".txt" ||
        file.type.startsWith("text/");
      if (!supported) return;
      try {
        const value = await file.text();
        const textarea = shellDocument.getElementById(
          "gcode-input",
        ) as HTMLTextAreaElement | null;
        if (!textarea) return;
        textarea.value = value;
        textarea.dispatchEvent(
          new shellDocument.defaultView!.Event("input", { bubbles: true }),
        );
      } catch {
        // Browser-local read failures intentionally leave the current source intact.
      }
    };
    fileInput.addEventListener("change", handleFile);

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
      setDialogTarget(dialog);
    });

    return () => {
      cancelled = true;
      stage.remove();
      stageStyle.remove();
      fileInput.removeEventListener("change", handleFile);
      sourceActions.remove();
      atmosphere.remove();
      focusNavToggle.removeEventListener("click", handleFocusNavToggle);
      focusNav.remove();
      hostedQuickEdit?.remove();
      if (ownerQuickEdit) ownerQuickEdit.style.display = "";
      dialog.remove();
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
    setText(shellDocument.getElementById("margins-badge"), formatMarginBadge(inputs.margins));

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
  }, [session, shellDocument, state]);

  useEffect(() => {
    const atmosphere = select<HTMLElement>(
      shellDocument,
      "[data-howmany-gcode-atmosphere]",
    );
    if (!atmosphere) return;
    const staticTexture = "G00 X0.000 Y0.000\nG01 X1.000 Y0.000\nG01 X1.000 Y1.000\nG01 X0.000 Y1.000";
    atmosphere.textContent = (source.trim() || staticTexture)
      .split(/\r?\n/)
      .slice(0, 14)
      .join("\n");
  }, [shellDocument, source]);

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
      if (fieldBindingForId(target.id)) {
        typingFreshFieldRef.current = target.id;
        lastNumericFieldRef.current = target;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const raw = event.target;
        if (raw instanceof shellDocument.defaultView!.Element) {
          const presetControl = raw.closest(
            "#presets-carousel, #presets-prev, #presets-next, #presets-add, #presets-edit, #presets-delete",
          );
          if (presetControl) {
            const chips = Array.from(
              shellDocument.querySelectorAll<HTMLButtonElement>(
                "#presets-track button[data-preset-id]",
              ),
            );
            const focusedChip = raw.closest<HTMLButtonElement>("[data-preset-id]");
            const selectedIndex = chips.findIndex(
              (chip) =>
                chip === focusedChip ||
                chip.dataset.presetId === presets.selectedPresetId,
            );
            const index = nextPresetIndex(
              selectedIndex,
              chips.length,
              event.key === "ArrowRight" ? 1 : -1,
            );
            if (index >= 0) {
              event.preventDefault();
              event.stopImmediatePropagation();
              const chip = chips[index];
              const presetId = chip.dataset.presetId;
              chip.focus();
              if (presetId) {
                void presets.loadPreset(presetId).then(() => {
                  shellDocument.defaultView?.requestAnimationFrame(() => {
                    shellDocument.defaultView?.requestAnimationFrame(() => {
                      select<HTMLButtonElement>(
                        shellDocument,
                        `[data-preset-id="${presetId}"]`,
                      )?.focus();
                    });
                  });
                });
              }
            }
            return;
          }
        }
      }
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
  }, [presets, setState, shellDocument, updateInputs]);

  useEffect(() => {
    const stop = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const preserveNumericFocus = (event: Event) => {
      const raw = event.target;
      if (!(raw instanceof shellDocument.defaultView!.Element)) return;
      if (
        !raw.closest(
          "[data-quick], #quick-add, #quick-edit, #howmany-quick-edit, #howmany-focus-nav-toggle, [data-howmany-focus-direction]",
        )
      ) {
        return;
      }
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const handleClick = (event: MouseEvent) => {
      const raw = event.target;
      if (!(raw instanceof shellDocument.defaultView!.Element)) return;
      const button = raw.closest<HTMLButtonElement>("button");
      if (!button) return;

      if (button.id === "howmany-open-file") {
        stop(event);
        (shellDocument.getElementById("howmany-file-input") as HTMLInputElement | null)?.click();
        return;
      }
      if (button.dataset.howmanyFocusDirection) {
        stop(event);
        cycleNumericFocus(button.dataset.howmanyFocusDirection === "next" ? 1 : -1);
        return;
      }
      if (button.id === "quick-add") {
        stop(event);
        setHostedDialog({
          kind: "quick-add",
          value: "",
          returnFocus: button,
        });
        return;
      }
      if (button.id === "quick-edit" || button.id === "howmany-quick-edit") {
        stop(event);
        const quickButton =
          lastQuickButtonRef.current?.isConnected
            ? lastQuickButtonRef.current
            : select<HTMLButtonElement>(shellDocument, "#quick-track [data-quick]");
        if (!quickButton) return;
        const quickButtonId =
          quickButton.dataset.howmanyQuickId ?? `quick-${quickButtonIdRef.current++}`;
        quickButton.dataset.howmanyQuickId = quickButtonId;
        setHostedDialog({
          kind: "quick-edit",
          value: quickButton.dataset.quick ?? quickButton.textContent ?? "",
          quickButtonId,
          returnFocus: button,
        });
        return;
      }
      if (button.dataset.quick !== undefined) {
        stop(event);
        const value = normalizeQuickValue(button.dataset.quick);
        const input =
          lastNumericFieldRef.current?.isConnected &&
          fieldBindingForId(lastNumericFieldRef.current.id)
            ? lastNumericFieldRef.current
            : shellDocument.activeElement instanceof shellDocument.defaultView!.HTMLInputElement &&
                fieldBindingForId(shellDocument.activeElement.id)
              ? shellDocument.activeElement
              : null;
        if (!value || !input) return;
        lastQuickButtonRef.current = button;
        input.value = value;
        input.dispatchEvent(
          new shellDocument.defaultView!.Event("input", { bubbles: true }),
        );
        input.focus();
        input.select();
        button.classList.remove("is-selected");
        button.setAttribute("aria-pressed", "false");
        button.classList.add("is-blinking");
        shellDocument.defaultView?.setTimeout(
          () => button.classList.remove("is-blinking"),
          180,
        );
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
        setGeneration({ source, angle, output: generated.output, size, unit: generated.unit });
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
        setHostedDialog({
          kind: "preset-save",
          value: "",
          returnFocus: button,
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
        const name = shellDocument.defaultView?.prompt("Rename preset", selected.name);
        if (name) void presets.renamePreset(selected.presetId, name);
        return;
      }
      if (button.id === "presets-delete") {
        stop(event);
        const selected = presets.presets.find(({ presetId }) => presetId === presets.selectedPresetId);
        if (selected && shellDocument.defaultView?.confirm(`Delete ${selected.name}?`)) {
          void presets.deletePreset(selected.presetId);
        }
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

    shellDocument.addEventListener("mousedown", preserveNumericFocus, true);
    shellDocument.addEventListener("touchstart", preserveNumericFocus, {
      capture: true,
      passive: false,
    });
    shellDocument.addEventListener("click", handleClick, true);
    return () => {
      shellDocument.removeEventListener("mousedown", preserveNumericFocus, true);
      shellDocument.removeEventListener("touchstart", preserveNumericFocus, true);
      shellDocument.removeEventListener("click", handleClick, true);
    };
  }, [angle, cycleNumericFocus, displayedSize, fresh, generation, partUnit, presets, programUnit, setState, shellDocument, source, state.manualInputs.unit, state.mode, updateInputs]);

  useEffect(() => {
    if (!hostedDialog || !dialogTarget) return;
    const frame = shellDocument.defaultView?.requestAnimationFrame(() => {
      const input = select<HTMLInputElement>(
        dialogTarget.ownerDocument,
        "[data-howmany-dialog-input]",
      );
      input?.focus();
      input?.select();
    });
    return () => {
      if (frame !== undefined) shellDocument.defaultView?.cancelAnimationFrame(frame);
    };
  }, [dialogTarget, hostedDialog, shellDocument]);

  const commitHostedDialog = useCallback(() => {
    if (!hostedDialog) return;
    if (hostedDialog.kind === "preset-save") {
      const name = hostedDialog.value.trim();
      if (!name) return;
      void presets.savePreset(name);
      closeHostedDialog();
      return;
    }

    const value = normalizeQuickValue(hostedDialog.value);
    if (!value) return;
    const editedButton = hostedDialog.quickButtonId
      ? select<HTMLButtonElement>(
          shellDocument,
          `[data-howmany-quick-id="${hostedDialog.quickButtonId}"]`,
        )
      : null;
    if (hostedDialog.kind === "quick-edit" && editedButton) {
      editedButton.dataset.quick = value;
      editedButton.title = value;
      editedButton.textContent = value;
      lastQuickButtonRef.current = editedButton;
    } else {
      const track = shellDocument.getElementById("quick-track");
      if (!track) return;
      const button = shellDocument.createElement("button");
      button.type = "button";
      button.className = "quick-chip press";
      button.setAttribute("role", "listitem");
      button.setAttribute("aria-pressed", "false");
      button.dataset.quick = value;
      button.title = value;
      button.textContent = value;
      track.append(button);
      lastQuickButtonRef.current = button;
    }
    closeHostedDialog();
  }, [closeHostedDialog, hostedDialog, presets, shellDocument]);

  const deleteHostedQuickValue = useCallback(() => {
    if (hostedDialog?.kind !== "quick-edit") return;
    if (hostedDialog.quickButtonId) {
      select<HTMLElement>(
        shellDocument,
        `[data-howmany-quick-id="${hostedDialog.quickButtonId}"]`,
      )?.remove();
    }
    lastQuickButtonRef.current = null;
    closeHostedDialog();
  }, [closeHostedDialog, hostedDialog, shellDocument]);

  const auto = session.result.mode === "autonest" ? session.result.autoNest : null;
  const activeMargins = state.mode === "autonest"
    ? effectiveAutoNestMargins(state.autoNestSettings)
    : state.manualInputs.margins;
  const fallback = previewResult(state, session.manual.result);
  const trimLine = auto?.status === "computed" ? auto.twoGroup.trimLine : null;
  const zeroGroup = auto?.status === "computed"
    ? auto.twoGroup.blanks.find(({ group }) => group.orientation === "0deg")?.group
    : null;
  const ninetyGroup = auto?.status === "computed"
    ? auto.twoGroup.blanks.find(({ group }) => group.orientation === "90deg")?.group
    : null;
  const dialogQuickValue = hostedDialog?.kind === "preset-save"
    ? null
    : normalizeQuickValue(hostedDialog?.value ?? "");
  const dialogValid = hostedDialog?.kind === "preset-save"
    ? hostedDialog.value.trim().length > 0
    : dialogQuickValue !== null;

  return (
    <>
      {stageTarget
        ? createPortal(
            auto?.status === "computed" ? (
              <section data-howmany-autonest-card="true" aria-label="AutoNest result">
                <header data-howmany-autonest-header="true">
                  <span>AutoNest result</span>
                  <span>{auto.twoGroup.totalParts} parts</span>
                </header>
                <div data-howmany-autonest-body="true">
                  <div data-howmany-autonest-drawing="true">
                    {trimLine ? (
                      <div data-howmany-trim-dimension={trimLine.orientation}>
                        {trimLine.orientation === "vertical" ? "Vertical" : "Horizontal"}{" "}
                        trim {formatShellNumber(trimLine.position)} {unitLabel(state.manualInputs.unit)}
                      </div>
                    ) : null}
                    <AutoNestPreview
                      twoGroup={auto.twoGroup}
                      remnantWidth={state.manualInputs.remnantWidth}
                      remnantHeight={state.manualInputs.remnantHeight}
                      unitLabel={unitLabel(state.manualInputs.unit)}
                      className="h-full border-0 bg-transparent"
                    />
                  </div>
                  <div data-howmany-autonest-truth="true">
                    <span><strong>0°</strong> {zeroGroup?.count ?? 0} parts</span>
                    <span><strong>90°</strong> {ninetyGroup?.count ?? 0} parts</span>
                    <span><strong>Trim</strong> {trimLine?.orientation} @ {formatShellNumber(trimLine?.position ?? null)} {unitLabel(state.manualInputs.unit)}</span>
                    <span><strong>Offset</strong> X {formatShellNumber(auto.twoGroup.suggestedOriginOffset.x)} · Y {formatShellNumber(auto.twoGroup.suggestedOriginOffset.y)}</span>
                  </div>
                </div>
              </section>
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
      {dialogTarget && hostedDialog
        ? createPortal(
            <div
              data-howmany-dialog-backdrop="true"
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 10000,
                display: "grid",
                placeItems: "center",
                padding: 18,
                background: "rgba(5,4,12,.72)",
                backdropFilter: "blur(7px)",
              }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) closeHostedDialog();
              }}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="howmany-dialog-title"
                style={{
                  width: "min(360px, 100%)",
                  padding: 16,
                  border: "1px solid rgba(83,139,236,.42)",
                  borderRadius: 16,
                  background: "#100c1c",
                  boxShadow: "0 22px 70px rgba(0,0,0,.48)",
                  color: "#fff",
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    closeHostedDialog();
                    return;
                  }
                  if (event.key !== "Tab") return;
                  const controls = Array.from(
                    event.currentTarget.querySelectorAll<HTMLElement>(
                      "input, button:not([disabled])",
                    ),
                  );
                  const first = controls[0];
                  const last = controls.at(-1);
                  if (event.shiftKey && shellDocument.activeElement === first) {
                    event.preventDefault();
                    last?.focus();
                  } else if (!event.shiftKey && shellDocument.activeElement === last) {
                    event.preventDefault();
                    first?.focus();
                  }
                }}
              >
                <h2 id="howmany-dialog-title" style={{ margin: "0 0 12px", fontSize: 17 }}>
                  {hostedDialog.kind === "preset-save"
                    ? "Save preset"
                    : hostedDialog.kind === "quick-edit"
                      ? "Edit quick value"
                      : "Add quick value"}
                </h2>
                <label style={{ display: "grid", gap: 6, color: "#c8cdd8", fontSize: 12 }}>
                  {hostedDialog.kind === "preset-save" ? "Preset name" : "Value"}
                  <input
                    data-howmany-dialog-input="true"
                    inputMode={hostedDialog.kind === "preset-save" ? "text" : "decimal"}
                    value={hostedDialog.value}
                    onChange={(event) =>
                      setHostedDialog((current) =>
                        current ? { ...current, value: event.target.value } : current,
                      )
                    }
                    style={{
                      minHeight: 42,
                      padding: "0 11px",
                      border: `1px solid ${dialogValid ? "rgba(83,139,236,.5)" : "#fb7185"}`,
                      borderRadius: 10,
                      outline: "none",
                      background: "rgba(255,255,255,.06)",
                      color: "#fff",
                      fontSize: 16,
                    }}
                  />
                </label>
                {!dialogValid && hostedDialog.value ? (
                  <p role="alert" style={{ margin: "7px 0 0", color: "#fb7185", fontSize: 11 }}>
                    {hostedDialog.kind === "preset-save"
                      ? "Enter a preset name."
                      : "Use a nonnegative value with up to three decimal places."}
                  </p>
                ) : null}
                <footer style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {hostedDialog.kind === "quick-edit" ? (
                    <button
                      type="button"
                      onClick={deleteHostedQuickValue}
                      style={{ minHeight: 36, padding: "0 12px", border: "1px solid #fb7185", borderRadius: 10, background: "transparent", color: "#fb7185", fontWeight: 800 }}
                    >
                      Delete
                    </button>
                  ) : null}
                  <span style={{ flex: 1 }} />
                  <button
                    type="button"
                    onClick={closeHostedDialog}
                    style={{ minHeight: 36, padding: "0 14px", border: "1px solid rgba(200,205,216,.3)", borderRadius: 10, background: "transparent", color: "#fff", fontWeight: 800 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!dialogValid}
                    onClick={commitHostedDialog}
                    style={{ minHeight: 36, padding: "0 16px", border: 0, borderRadius: 10, background: "#538bec", color: "#fff", fontWeight: 900, opacity: dialogValid ? 1 : .45 }}
                  >
                    OK
                  </button>
                </footer>
              </section>
            </div>,
            dialogTarget,
          )
        : null}
    </>
  );
}
