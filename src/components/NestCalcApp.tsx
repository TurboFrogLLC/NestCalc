"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Link2,
  Moon,
  RotateCcw,
  RotateCw,
  Settings,
  Sun,
} from "lucide-react";
import { useNestAppState } from "@/hooks/useNestInputs";
import { useTheme } from "@/hooks/useTheme";
import {
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
  updateManualMargin,
} from "@/lib/nestSession";
import type {
  AutoNestResult,
  AutoNestSettings,
  Margins,
  NestAppState,
  NestInputs,
} from "@/lib/types";
import { unitLabel } from "@/lib/units";
import { QuickValuesFocusProvider } from "@/hooks/useQuickValuesFocus";
import { AuthControls } from "./AuthControls";
import { AutoNestPreview } from "./AutoNestPreview";
import { NestGrid } from "./NestGrid";
import { NumberInput } from "./NumberInput";
import { QuickValuesBar } from "./QuickValuesBar";

const iconBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)] active:scale-[0.97]";

const unitBtnClass =
  "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 font-mono text-xs font-bold uppercase text-[var(--accent)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.97]";

const rotateBtnClass =
  "nestcalc-split-rotate-btn flex shrink-0 items-center gap-0.5 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-1.5 py-1 text-[10px] font-semibold leading-none text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--btn-border)] disabled:hover:bg-[var(--btn-bg)] disabled:active:scale-100";

interface IconButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}

function IconButton({ label, onClick, active = false, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors active:scale-[0.97] ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]"
          : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
      }`}
    >
      {children}
    </button>
  );
}

interface XYInputRowProps {
  xLabel: string;
  yLabel: string;
  xValue: number | null;
  yValue: number | null;
  unit: string;
  linked: boolean;
  onXChange: (value: number | null) => void;
  onYChange: (value: number | null) => void;
  onLinkToggle: () => void;
  onSwap: () => void;
}

interface DualInputRowProps {
  leftLabel: string;
  rightLabel: string;
  leftValue: number | null;
  rightValue: number | null;
  unit: string;
  onLeftChange: (value: number | null) => void;
  onRightChange: (value: number | null) => void;
}

function DualInputRow({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  unit,
  onLeftChange,
  onRightChange,
}: DualInputRowProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <NumberInput
          label={leftLabel}
          value={leftValue}
          unit={unit}
          onChange={onLeftChange}
        />
      </div>
      <div
        className="nestcalc-xy-icons flex w-6 shrink-0 flex-col items-center justify-end gap-0.5 pb-[3px]"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <NumberInput
          label={rightLabel}
          value={rightValue}
          unit={unit}
          onChange={onRightChange}
        />
      </div>
    </div>
  );
}

function XYInputRow({
  xLabel,
  yLabel,
  xValue,
  yValue,
  unit,
  linked,
  onXChange,
  onYChange,
  onLinkToggle,
  onSwap,
}: XYInputRowProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <NumberInput
          label={xLabel}
          value={xValue}
          unit={unit}
          onChange={onXChange}
        />
      </div>
      <div className="nestcalc-xy-icons flex shrink-0 flex-col items-center justify-end gap-0.5 pb-[3px]">
        <IconButton label="Link X and Y" onClick={onLinkToggle} active={linked}>
          <Link2 className="h-3 w-3" strokeWidth={2} />
        </IconButton>
        <IconButton label="Swap X and Y" onClick={onSwap}>
          <ArrowLeftRight className="h-3 w-3" strokeWidth={2} />
        </IconButton>
      </div>
      <div className="min-w-0 flex-1">
        <NumberInput
          label={yLabel}
          value={yValue}
          unit={unit}
          onChange={onYChange}
        />
      </div>
    </div>
  );
}

function formatFallbackReason(
  reason: Extract<AutoNestResult, { status: "fallback" }>["reason"],
) {
  switch (reason) {
    case "insufficient-inputs":
      return "insufficient inputs";
    case "search-budget-exceeded":
      return "search budget exceeded";
    case "two-group-not-useful":
      return "two-group not useful";
    case "engine-unavailable":
      return "engine unavailable";
  }
}

function AutoNestSettingsPanel({
  settings,
  unit,
  onGlobalClampMarginChange,
  onOverrideGlobalMarginsChange,
  onMarginOverrideChange,
}: {
  settings: AutoNestSettings;
  unit: string;
  onGlobalClampMarginChange: (value: number | null) => void;
  onOverrideGlobalMarginsChange: (value: boolean) => void;
  onMarginOverrideChange: (key: keyof Margins, value: number | null) => void;
}) {
  return (
    <section
      id="autonest-settings-panel"
      className="flex shrink-0 flex-col gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2"
    >
      <NumberInput
        label="Global Clamp Margin"
        value={settings.globalClampMargin}
        unit={unit}
        onChange={onGlobalClampMarginChange}
      />
      <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
        <input
          type="checkbox"
          checked={settings.overrideGlobalMargins}
          onChange={(event) =>
            onOverrideGlobalMarginsChange(event.target.checked)
          }
          className="h-3.5 w-3.5 rounded border-[var(--input-border)] accent-[var(--accent)]"
        />
        Override global margins
      </label>
      {settings.overrideGlobalMargins ? (
        <div className="grid grid-cols-2 gap-2">
          <NumberInput
            label="Left margin override"
            value={settings.marginOverrides.left}
            unit={unit}
            onChange={(value) => onMarginOverrideChange("left", value)}
          />
          <NumberInput
            label="Right margin override"
            value={settings.marginOverrides.right}
            unit={unit}
            onChange={(value) => onMarginOverrideChange("right", value)}
          />
          <NumberInput
            label="Bottom margin override"
            value={settings.marginOverrides.bottom}
            unit={unit}
            onChange={(value) => onMarginOverrideChange("bottom", value)}
          />
          <NumberInput
            label="Top margin override"
            value={settings.marginOverrides.top}
            unit={unit}
            onChange={(value) => onMarginOverrideChange("top", value)}
          />
        </div>
      ) : null}
    </section>
  );
}

function AutoNestComparison({ result }: { result: AutoNestResult }) {
  if (result.status === "computed") {
    const delta = result.twoGroup.totalParts - result.bestUniform.totalParts;

    return (
      <span>
        Best uniform:{" "}
        <strong className="text-[var(--foreground)]">
          {result.bestUniform.totalParts}
        </strong>{" "}
        | AutoNest two-group:{" "}
        <strong className="text-[var(--accent)]">
          {result.twoGroup.totalParts}
        </strong>{" "}
        ({delta >= 0 ? "+" : ""}
        {delta})
      </span>
    );
  }

  if (result.status === "fallback") {
    return (
      <span>
        Best uniform:{" "}
        <strong className="text-[var(--foreground)]">
          {result.bestUniform.totalParts}
        </strong>{" "}
        | Using uniform:{" "}
        <strong className="text-[var(--accent)]">
          {result.fallback.totalParts}
        </strong>{" "}
        ({formatFallbackReason(result.reason)})
      </span>
    );
  }

  return (
    <span>
      Best uniform:{" "}
      <strong className="text-[var(--foreground)]">
        {result.bestUniform.totalParts}
      </strong>{" "}
      | AutoNest not ready
    </span>
  );
}

type ManualInputsUpdater = NestInputs | ((current: NestInputs) => NestInputs);

function updateManualInputs(
  state: NestAppState,
  updater: ManualInputsUpdater,
): NestAppState {
  return {
    ...state,
    manualInputs:
      typeof updater === "function" ? updater(state.manualInputs) : updater,
  };
}

export function NestCalcApp() {
  const { state, setState } = useNestAppState();
  const { theme, toggleTheme } = useTheme();
  const [autoNestSettingsOpen, setAutoNestSettingsOpen] = useState(false);

  const session = useMemo(() => createNestSession(state), [state]);
  const inputs = session.manual.inputs;
  const result = session.manual.result;
  const unit = unitLabel(inputs.unit);
  const autoNestSettings = state.autoNestSettings;
  const isAutoNest = session.mode === "autonest";
  const autoNestResult =
    session.result.mode === "autonest" ? session.result.autoNest : null;
  const computedAutoNest =
    autoNestResult?.status === "computed" ? autoNestResult.twoGroup : null;
  const manualRotationLocked = session.controls.manualRotationLocked;

  const setInputs = (updater: ManualInputsUpdater) => {
    setState((current) => updateManualInputs(current, updater));
  };

  const update = (patch: Partial<NestInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const updateMargin = (
    key: keyof NestInputs["margins"],
    value: number | null,
  ) => {
    setInputs((current) => updateManualMargin(current, key, value));
  };

  const toggleUnit = () => {
    setState(toggleNestSessionUnit);
  };

  const toggleAutoNest = () => {
    if (isAutoNest) {
      setAutoNestSettingsOpen(false);
    }

    setState((current) => ({
      ...current,
      mode: current.mode === "autonest" ? "manual" : "autonest",
    }));
  };

  const updateAutoNestSettings = (
    updater:
      | AutoNestSettings
      | ((current: AutoNestSettings) => AutoNestSettings),
  ) => {
    setState((current) => ({
      ...current,
      autoNestSettings:
        typeof updater === "function"
          ? updater(current.autoNestSettings)
          : updater,
    }));
  };

  const updateAutoNestMarginOverride = (
    key: keyof Margins,
    value: number | null,
  ) => {
    updateAutoNestSettings((current) => ({
      ...current,
      marginOverrides: {
        ...current.marginOverrides,
        [key]: value,
      },
    }));
  };

  const clearAll = () => {
    setInputs(clearManualInputs);
  };

  const rotatePart = () => {
    if (manualRotationLocked) return;
    setInputs(rotateManualPart);
  };

  const rotateRem = () => {
    if (manualRotationLocked) return;
    setInputs(rotateManualRemnant);
  };

  const previewPartsTotal = computedAutoNest?.totalParts ?? result.totalParts;
  const previewHeaderGridLabel = computedAutoNest
    ? computedAutoNest.blanks
        .map((blank) => `${blank.group.orientation} x${blank.group.count}`)
        .join(" | ")
    : `X${result.partsAcross} | Y${result.partsDown}`;

  const partsSummary = (
    <span className="font-mono text-xs tabular-nums text-[var(--foreground)]">
      Parts ={" "}
      <span className="font-bold text-[var(--accent)]">{previewPartsTotal}</span>
    </span>
  );

  return (
    <QuickValuesFocusProvider>
      <QuickValuesBar />
      <div className="nestcalc-split-shell mx-auto flex w-full max-w-lg flex-col gap-3 px-3 py-3 pb-6">
        <header className="flex h-10 shrink-0 items-center gap-2">
          <h1 className="shrink-0 text-lg font-semibold tracking-tight">
            <span className="text-[var(--foreground)]">Nest</span>
            <span className="text-[var(--quick-value)]">Calc</span>
          </h1>
          <div className="ml-auto flex items-center gap-1">
            <AuthControls />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className={iconBtnClass}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              onClick={toggleUnit}
              aria-label={`Switch to ${inputs.unit === "in" ? "millimeters" : "inches"}`}
              title={`Units: ${inputs.unit}`}
              className={unitBtnClass}
            >
              {inputs.unit}
            </button>
            <button
              type="button"
              onClick={clearAll}
              aria-label="Clear all fields"
              title="Clear all"
              className={iconBtnClass}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="nestcalc-split-row flex min-h-0 flex-col gap-3">
          <div className="nestcalc-split-inputs nestcalc-inputs flex min-h-0 flex-col gap-2">
            <section className="nestcalc-split-hide flex h-9 shrink-0 items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3">
              <span className="font-mono text-sm font-bold tabular-nums text-[var(--foreground)]">
                X{result.partsAcross} | Y{result.partsDown}
              </span>
              {partsSummary}
            </section>

            <section className="flex min-h-9 shrink-0 flex-wrap items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-2 py-1">
              <button
                type="button"
                aria-pressed={isAutoNest}
                onClick={toggleAutoNest}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold transition-colors active:scale-[0.98] ${
                  isAutoNest
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]"
                    : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--btn-text)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
                }`}
              >
                AutoNest
              </button>
              <span className="min-w-0 flex-1 text-[11px] font-medium leading-tight text-[var(--muted)]">
                {isAutoNest ? "AutoNest active" : "Manual"}
              </span>
              {isAutoNest ? (
                <button
                  type="button"
                  aria-label="AutoNest settings"
                  aria-expanded={autoNestSettingsOpen}
                  aria-controls="autonest-settings-panel"
                  title="AutoNest settings"
                  onClick={() =>
                    setAutoNestSettingsOpen((current) => !current)
                  }
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors active:scale-[0.97] ${
                    autoNestSettingsOpen
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]"
                      : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              ) : null}
            </section>

            {isAutoNest && autoNestSettingsOpen ? (
              <AutoNestSettingsPanel
                settings={autoNestSettings}
                unit={unit}
                onGlobalClampMarginChange={(value) =>
                  updateAutoNestSettings((current) => ({
                    ...current,
                    globalClampMargin: value,
                  }))
                }
                onOverrideGlobalMarginsChange={(value) =>
                  updateAutoNestSettings((current) => ({
                    ...current,
                    overrideGlobalMargins: value,
                  }))
                }
                onMarginOverrideChange={updateAutoNestMarginOverride}
              />
            ) : null}

            {autoNestResult ? (
              <section
                aria-live="polite"
                className="flex shrink-0 flex-col gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 py-2"
              >
                <p className="text-[11px] font-semibold leading-tight text-[var(--foreground)]">
                  AutoNest: Two groups (0° + 90°)
                </p>
                <p className="text-[11px] leading-tight text-[var(--muted)]">
                  <AutoNestComparison result={autoNestResult} />
                </p>
              </section>
            ) : null}

            <XYInputRow
              xLabel="X [PART]"
              yLabel="Y [PART]"
              xValue={inputs.partWidth}
              yValue={inputs.partHeight}
              unit={unit}
              linked={inputs.partLinked}
              onXChange={(value) =>
                setInputs((current) =>
                  updateManualField(current, "partWidth", value),
                )
              }
              onYChange={(value) =>
                setInputs((current) =>
                  updateManualField(current, "partHeight", value),
                )
              }
              onLinkToggle={() => setInputs(toggleManualPartLink)}
              onSwap={() => setInputs(swapManualPart)}
            />
            <DualInputRow
              leftLabel="X [REM]"
              rightLabel="Y [REM]"
              leftValue={inputs.remnantWidth}
              rightValue={inputs.remnantHeight}
              unit={unit}
              onLeftChange={(value) => update({ remnantWidth: value })}
              onRightChange={(value) => update({ remnantHeight: value })}
            />
            <XYInputRow
              xLabel="X [GAP]"
              yLabel="Y [GAP]"
              xValue={inputs.gapX}
              yValue={inputs.gapY}
              unit={unit}
              linked={inputs.gapLinked}
              onXChange={(value) =>
                setInputs((current) =>
                  updateManualField(current, "gapX", value),
                )
              }
              onYChange={(value) =>
                setInputs((current) =>
                  updateManualField(current, "gapY", value),
                )
              }
              onLinkToggle={() => setInputs(toggleManualGapLink)}
              onSwap={() => setInputs(swapManualGap)}
            />
            <p className="nestcalc-split-compact-label text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
              Margins
            </p>
            <DualInputRow
              leftLabel="Left"
              rightLabel="Right"
              leftValue={inputs.margins.left}
              rightValue={inputs.margins.right}
              unit={unit}
              onLeftChange={(value) => updateMargin("left", value)}
              onRightChange={(value) => updateMargin("right", value)}
            />
            <DualInputRow
              leftLabel="Bottom"
              rightLabel="Top"
              leftValue={inputs.margins.bottom}
              rightValue={inputs.margins.top}
              unit={unit}
              onLeftChange={(value) => updateMargin("bottom", value)}
              onRightChange={(value) => updateMargin("top", value)}
            />
            <label className="nestcalc-split-compact-checkbox flex shrink-0 cursor-pointer items-center gap-2 text-xs text-[var(--muted)]">
              <input
                type="checkbox"
                checked={inputs.moveMarginsWithRotation}
                onChange={(event) =>
                  update({ moveMarginsWithRotation: event.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-[var(--input-border)] accent-[var(--accent)]"
              />
              Move margins with rotation
            </label>
          </div>

          <section className="nestcalc-split-preview flex min-h-0 flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-2">
            <div className="nestcalc-split-preview-header mb-2 flex h-8 shrink-0 items-center gap-1.5 overflow-hidden">
              <span className="nestcalc-split-preview-header-text shrink-0 font-mono text-xs font-bold tabular-nums text-[var(--foreground)]">
                {previewHeaderGridLabel}
              </span>
              <button
                type="button"
                aria-label="Rotate Part 90°"
                onClick={rotatePart}
                disabled={manualRotationLocked}
                className={rotateBtnClass}
              >
                <RotateCw className="h-3 w-3 shrink-0" strokeWidth={2} />
                Part 90°
              </button>
              <button
                type="button"
                aria-label="Rotate Rem 90°"
                onClick={rotateRem}
                disabled={manualRotationLocked}
                className={rotateBtnClass}
              >
                <RotateCw className="h-3 w-3 shrink-0" strokeWidth={2} />
                Rem 90°
              </button>
              <span className="ml-auto shrink-0">{partsSummary}</span>
            </div>

            {computedAutoNest ? (
              <AutoNestPreview
                twoGroup={computedAutoNest}
                remnantWidth={inputs.remnantWidth}
                remnantHeight={inputs.remnantHeight}
                unitLabel={unit}
              />
            ) : (
              <NestGrid
                remnantWidth={inputs.remnantWidth}
                remnantHeight={inputs.remnantHeight}
                partWidth={inputs.partWidth}
                partHeight={inputs.partHeight}
                margins={inputs.margins}
                gapX={inputs.gapX}
                gapY={inputs.gapY}
                result={result}
                unitLabel={unit}
              />
            )}
          </section>
        </div>
      </div>
    </QuickValuesFocusProvider>
  );
}
