"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  displayGCodeSize,
  fieldBindingForId,
  formatShellNumber,
  generationIsFresh,
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
  const [source, setSource] = useState("");
  const [angle, setAngle] = useState(0);
  const [programUnit, setProgramUnit] = useState<Unit>("in");
  const [partUnit, setPartUnit] = useState<Unit>("in");
  const [generation, setGeneration] = useState<FreshGeneration | null>(null);

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
      "width:min(56vw,560px);height:min(66vh,520px);--card-border:rgba(83,139,236,.35);--preview-bg:rgba(11,8,20,.5);--rem-fill:transparent;--rem-stroke:#fff;--margin-fill:rgba(83,139,236,.08);--usable-stroke:rgba(83,139,236,.5);--part-fill:rgba(83,139,236,.2);--part-stroke:#538bec;--origin-stroke:#c8cdd8;--muted:#c8cdd8;--autonest-blank-stroke:rgba(238,140,60,.55);";
    calcView.append(stage);

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
      input.value = formatShellNumber(value);
      input.parentElement?.classList.toggle("has-value", value !== null);
    });

    setText(shellDocument.getElementById("part-badge"), `${formatShellNumber(inputs.partWidth)} × ${formatShellNumber(inputs.partHeight)}`);
    setText(shellDocument.getElementById("rem-badge"), `${formatShellNumber(inputs.remnantWidth)} × ${formatShellNumber(inputs.remnantHeight)}`);
    setText(shellDocument.getElementById("gap-badge"), `${formatShellNumber(inputs.gapX)} × ${formatShellNumber(inputs.gapY)}`);

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
    if (!track) return;
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
    track.replaceChildren(fragment);
    track.setAttribute("title", presets.error ?? presets.status);
    const shellWindow = shellDocument.defaultView as (Window & { __nestPresetsSync?: (() => void) | null }) | null;
    shellWindow?.__nestPresetsSync?.();
    track.querySelectorAll<HTMLElement>("[data-preset-id]").forEach((chip) => {
      const selected = chip.dataset.presetId === presets.selectedPresetId;
      chip.classList.toggle("is-selected", selected);
      chip.setAttribute("aria-pressed", selected ? "true" : "false");
    });
    const edit = shellDocument.getElementById("presets-edit") as HTMLButtonElement | null;
    const remove = shellDocument.getElementById("presets-delete") as HTMLButtonElement | null;
    if (edit) edit.disabled = !presets.selectedPresetId || presets.isBusy;
    if (remove) remove.disabled = !presets.selectedPresetId || presets.presets.length <= 1 || presets.isBusy;
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

    shellDocument.addEventListener("input", handleInput);
    shellDocument.addEventListener("change", handleChange);
    return () => {
      shellDocument.removeEventListener("input", handleInput);
      shellDocument.removeEventListener("change", handleChange);
    };
  }, [setState, shellDocument, updateInputs]);

  useEffect(() => {
    const stop = (event: Event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    const handleClick = (event: MouseEvent) => {
      const raw = event.target;
      if (!(raw instanceof shellDocument.defaultView!.Element)) return;
      const button = raw.closest<HTMLButtonElement>("button");
      if (!button) return;

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
        const size = partSizeFromBounds(generated.bounds);
        if (!size) {
          setGeneration(null);
          setText(output, "Generated bounds are unavailable.");
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
        const name = shellDocument.defaultView?.prompt("Preset name");
        if (name) void presets.savePreset(name);
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

    shellDocument.addEventListener("click", handleClick, true);
    return () => shellDocument.removeEventListener("click", handleClick, true);
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
              <AutoNestPreview
                twoGroup={auto.twoGroup}
                remnantWidth={state.manualInputs.remnantWidth}
                remnantHeight={state.manualInputs.remnantHeight}
                unitLabel={unitLabel(state.manualInputs.unit)}
                className="h-full border-0 bg-transparent"
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
